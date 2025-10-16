# Patrones de diseño para SDKs de IA y APIs de signals

Interactuar con APIs de IA y Modelos de Lenguaje Extenso (LLM) introduce desafíos únicos, como gestionar operaciones asíncronas, manejar datos en streaming y diseñar una experiencia de usuario responsiva para solicitudes de red potencialmente lentas o poco confiables. Los [signals](guide/signals) de Angular y la API [`resource`](guide/signals/resource) proporcionan herramientas poderosas para resolver estos problemas de manera elegante.

## Activando solicitudes con signals

Un patrón común al trabajar con prompts proporcionados por el usuario es separar la entrada en tiempo del usuario del valor enviado que activa la llamada a la API.

1. Almacena la entrada sin procesar del usuario en un signal mientras escribe
2. Cuando el usuario envía (por ejemplo, haciendo clic en un botón), actualiza un segundo signal con el contenido del primer signal.
3. Usa el segundo signal en el campo **`params`** de tu `resource`.

Esta configuración asegura que la función **`loader`** del resource solo se ejecute cuando el usuario envía explícitamente su prompt, no en cada pulsación de tecla. Puedes usar parámetros de signal adicionales, como un `sessionId` o `userId` (que pueden ser útiles para crear sesiones persistentes de LLM), en el campo `loader`. De esta manera, la solicitud siempre usa los valores actuales de estos parámetros sin volver a activar la función asíncrona definida en el campo `loader`.

Muchos SDKs de IA proporcionan métodos auxiliares para realizar llamadas a la API. Por ejemplo, la biblioteca cliente de Genkit expone un método `runFlow` para llamar flujos de Genkit, que puedes llamar desde el `loader` de un resource. Para otras APIs, puedes usar el [`httpResource`](guide/signals/resource#reactive-data-fetching-with-httpresource).

El siguiente ejemplo muestra un `resource` que obtiene partes de una historia generada por IA. El `loader` se activa solo cuando el signal `storyInput` cambia.

```ts
// A resource that fetches three parts of an AI generated story
storyResource = resource({
  // The default value to use before the first request or on error
  defaultValue: DEFAULT_STORY,
  // The loader is re-triggered when this signal changes
  params: () => this.storyInput(),
  // The async function to fetch data
  loader: ({params}): Promise<StoryData> => {
    // The params value is the current value of the storyInput signal
    const url = this.endpoint();
    return runFlow({ url, input: {
      userInput: params,
      sessionId: this.storyService.sessionId() // Read from another signal
    }});
  }
});
```

## Preparando datos de LLM para plantillas

Puedes configurar las APIs de LLM para que devuelvan datos estructurados. Tipar fuertemente tu `resource` para que coincida con la salida esperada del LLM proporciona mejor seguridad de tipos y autocompletado del editor.

Para gestionar el estado derivado de un resource, usa un signal `computed` o `linkedSignal`. Debido a que `linkedSignal` [proporciona acceso a valores anteriores](guide/signals/linked-signal), puede servir para una variedad de casos de uso relacionados con IA, incluyendo
  * construir un historial de chat
  * preservar o personalizar datos que las plantillas muestran mientras los LLMs generan contenido

En el ejemplo a continuación, `storyParts` es un `linkedSignal` que agrega las últimas partes de la historia devueltas por `storyResource` al array existente de partes de la historia.

```ts
storyParts = linkedSignal<string[], string[]>({
  // The source signal that triggers the computation
  source: () => this.storyResource.value().storyParts,
  // The computation function
  computation: (newStoryParts, previous) => {
    // Get the previous value of this linkedSignal, or an empty array
    const existingStoryParts = previous?.value || [];
    // Return a new array with the old and new parts
    return [...existingStoryParts, ...newStoryParts];
  }
});
```

## Rendimiento y experiencia de usuario

Las APIs de LLM pueden ser más lentas y propensas a errores que las APIs convencionales y más determinísticas. Puedes usar varias características de Angular para construir una interfaz eficiente y amigable para el usuario.

* **Carga con Alcance:** coloca el `resource` en el componente que usa directamente los datos. Esto ayuda a limitar los ciclos de detección de cambios (especialmente en aplicaciones zoneless) y evita bloquear otras partes de tu aplicación. Si los datos necesitan ser compartidos entre múltiples componentes, proporciona el `resource` desde un servicio.  
* **SSR e Hidratación:** usa Renderizado del Lado del Servidor (SSR) con hidratación incremental para renderizar el contenido de la página inicial rápidamente. Puedes mostrar un marcador de posición para el contenido generado por IA y diferir la obtención de datos hasta que el componente se hidrate en el cliente.  
* **Estado de Carga:** usa el [estado](guide/signals/resource#resource-status) `LOADING` del `resource` para mostrar un indicador, como un spinner, mientras la solicitud está en curso. Este estado cubre tanto las cargas iniciales como las recargas.  
* **Manejo de Errores y Reintentos:** usa el método [**`reload()`**](guide/signals/resource#reloading) del `resource` como una forma simple para que los usuarios vuelvan a intentar solicitudes fallidas, que pueden ser más prevalentes cuando se depende de contenido generado por IA.

El siguiente ejemplo demuestra cómo crear una interfaz de usuario responsiva para mostrar dinámicamente una imagen generada por IA con funcionalidad de carga y reintento.

```angular-html
<!-- Display a loading spinner while the LLM generates the image -->
@if (imgResource.isLoading()) {
  <div class="img-placeholder">
    <mat-spinner [diameter]="50" />
  </div>
<!-- Dynamically populates the src attribute with the generated image URL -->
} @else if (imgResource.hasValue()) {
  <img [src]="imgResource.value()" />
<!-- Provides a retry option if the request fails  -->
} @else {
  <div class="img-placeholder" (click)="imgResource.reload()">
    <mat-icon fontIcon="refresh" />
      <p>Failed to load image. Click to retry.</p>
  </div>
}
```


## Patrones de IA en acción: transmisión de respuestas de chat
Las interfaces a menudo muestran resultados parciales de APIs basadas en LLM de forma incremental a medida que llegan los datos de respuesta. La API de resource de Angular proporciona la capacidad de transmitir respuestas para soportar este tipo de patrón. La propiedad `stream` de `resource` acepta una función asíncrona que puedes usar para aplicar actualizaciones a un valor de signal a lo largo del tiempo. El signal que se está actualizando representa los datos que se están transmitiendo.

```ts
characters = resource({
  stream: async () => {
    const data = signal<ResourceStreamItem<string>>({value: ''});
    // Calls a Genkit streaming flow using the streamFlow method
    // exposed by the Genkit client SDK
    const response = streamFlow({
      url: '/streamCharacters',
      input: 10
    });

    (async () => {
      for await (const chunk of response.stream) {
        data.update((prev) => {
          if ('value' in prev) {
            return { value: `${prev.value} ${chunk}` };
          } else {
            return { error: chunk as unknown as Error };
          }
        });
      }
    })();

    return data;
  }
});
```

El miembro `characters` se actualiza de forma asíncrona y puede mostrarse en la plantilla.

```angular-html
@if (characters.isLoading()) {
  <p>Loading...</p>
} @else if (characters.hasValue()) {
  <p>{{characters.value()}}</p>
} @else {
  <p>{{characters.error()}}</p>
}
```

En el lado del servidor, en `server.ts` por ejemplo, el endpoint definido envía los datos para ser transmitidos al cliente. El siguiente código usa Gemini con el framework Genkit, pero esta técnica es aplicable a otras APIs que soporten respuestas en streaming de LLMs:

```ts
import { startFlowServer } from '@genkit-ai/express';
import { genkit } from "genkit/beta";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

const ai = genkit({ plugins: [googleAI()] });

export const streamCharacters = ai.defineFlow({
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (count, { sendChunk }) => {
    const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    config: {
      temperature: 1,
    },
    prompt: `Generate ${count} different RPG game characters.`,
  });

  (async () => {
    for await (const chunk of stream) {
      sendChunk(chunk.content[0].text!);
    }
  })();

  return (await response).text;
});

startFlowServer({
  flows: [streamCharacters],
});

```
