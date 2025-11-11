# Patrones de diseño para SDKs de IA y APIs de signals

Interactuar con APIs de IA y Modelos de Lenguaje Grandes (LLM) introduce desafíos únicos, como gestionar operaciones asíncronas, manejar datos en streaming y diseñar una experiencia de usuario responsiva para solicitudes de red potencialmente lentas o poco confiables. Los [signals](guide/signals) de Angular y la API [`resource`](guide/signals/resource) proporcionan herramientas poderosas para resolver estos problemas de manera elegante.

## Disparando solicitudes con signals

Un patrón común al trabajar con prompts proporcionados por el usuario es separar la entrada en vivo del usuario del valor enviado que dispara la llamada a la API.

1. Almacena la entrada sin procesar del usuario en un signal mientras escribe
2. Cuando el usuario envía (por ejemplo, al hacer clic en un botón), actualiza un segundo signal con el contenido del primer signal.
3. Usa el segundo signal en el campo **`params`** de tu `resource`.

Esta configuración asegura que la función **`loader`** del resource solo se ejecute cuando el usuario envía explícitamente su prompt, no en cada pulsación de tecla. Puedes usar parámetros de signal adicionales, como un `sessionId` o `userId` (que pueden ser útiles para crear sesiones persistentes de LLM), en el campo `loader`. De esta manera, la solicitud siempre usa los valores actuales de estos parámetros sin volver a disparar la función asíncrona definida en el campo `loader`.

Muchos SDKs de IA proporcionan métodos auxiliares para hacer llamadas a la API. Por ejemplo, la biblioteca cliente de Genkit expone un método `runFlow` para llamar flows de Genkit, que puedes llamar desde el `loader` de un resource. Para otras APIs, puedes usar el [`httpResource`](guide/signals/resource#reactive-data-fetching-with-httpresource).

El siguiente ejemplo muestra un `resource` que obtiene partes de una historia generada por IA. El `loader` se dispara solo cuando el signal `storyInput` cambia.

```ts
// Un resource que obtiene tres partes de una historia generada por IA
storyResource = resource({
  // El valor predeterminado a usar antes de la primera solicitud o en caso de error
  defaultValue: DEFAULT_STORY,
  // El loader se vuelve a disparar cuando este signal cambia
  params: () => this.storyInput(),
  // La función asíncrona para obtener datos
  loader: ({params}): Promise<StoryData> => {
    // El valor de params es el valor actual del signal storyInput
    const url = this.endpoint();
    return runFlow({ url, input: {
      userInput: params,
      sessionId: this.storyService.sessionId() // Lee desde otro signal
    }});
  }
});
```

## Preparando datos de LLM para plantillas

Puedes configurar APIs de LLM para que devuelvan datos estructurados. Tipar fuertemente tu `resource` para que coincida con la salida esperada del LLM proporciona mejor seguridad de tipos y autocompletado del editor.

Para gestionar estado derivado de un resource, usa un signal `computed` o `linkedSignal`. Dado que `linkedSignal` [proporciona acceso a valores previos](guide/signals/linked-signal), puede servir una variedad de casos de uso relacionados con IA, incluyendo
  * construir un historial de chat
  * preservar o personalizar datos que las plantillas muestran mientras los LLMs generan contenido

En el ejemplo a continuación, `storyParts` es un `linkedSignal` que agrega las últimas partes de la historia devueltas desde `storyResource` al array existente de partes de la historia.

```ts
storyParts = linkedSignal<string[], string[]>({
  // El signal fuente que dispara el cálculo
  source: () => this.storyResource.value().storyParts,
  // La función de cálculo
  computation: (newStoryParts, previous) => {
    // Obtener el valor previo de este linkedSignal, o un array vacío
    const existingStoryParts = previous?.value || [];
    // Devolver un nuevo array con las partes antiguas y nuevas
    return [...existingStoryParts, ...newStoryParts];
  }
});
```

## Rendimiento y experiencia de usuario

Las APIs de LLM pueden ser más lentas y más propensas a errores que las APIs convencionales, más determinísticas. Puedes usar varias características de Angular para construir una interfaz eficiente y amigable para el usuario.

* **Carga Acotada:** coloca el `resource` en el componente que directamente usa los datos. Esto ayuda a limitar los ciclos de detección de cambios (especialmente en aplicaciones zoneless) y previene bloquear otras partes de tu aplicación. Si los datos necesitan ser compartidos entre múltiples componentes, proporciona el `resource` desde un servicio.
* **SSR e Hidratación:** usa Server-Side Rendering (SSR) con hidratación incremental para renderizar el contenido inicial de la página rápidamente. Puedes mostrar un placeholder para el contenido generado por IA y diferir la obtención de datos hasta que el componente se hidrate en el cliente.
* **Estado de Carga:** usa el [estado](guide/signals/resource#resource-status) `LOADING` del `resource` para mostrar un indicador, como un spinner, mientras la solicitud está en curso. Este estado cubre tanto cargas iniciales como recargas.
* **Manejo de Errores y Reintentos:** usa el método [**`reload()`**](guide/signals/resource#reloading) del `resource` como una forma simple para que los usuarios reintenten solicitudes fallidas, que pueden ser más prevalentes al depender de contenido generado por IA.

El siguiente ejemplo demuestra cómo crear una interfaz de usuario responsiva para mostrar dinámicamente una imagen generada por IA con funcionalidad de carga y reintento.

```angular-html
<!-- Mostrar un spinner de carga mientras el LLM genera la imagen -->
@if (imgResource.isLoading()) {
  <div class="img-placeholder">
    <mat-spinner [diameter]="50" />
  </div>
<!-- Puebla dinámicamente el atributo src con la URL de la imagen generada -->
} @else if (imgResource.hasValue()) {
  <img [src]="imgResource.value()" />
<!-- Proporciona una opción de reintento si la solicitud falla  -->
} @else {
  <div class="img-placeholder" (click)="imgResource.reload()">
    <mat-icon fontIcon="refresh" />
      <p>Falló la carga de la imagen. Haz clic para reintentar.</p>
  </div>
}
```


## Patrones de IA en acción: streaming de respuestas de chat
Las interfaces a menudo muestran resultados parciales de APIs basadas en LLM de forma incremental a medida que llegan los datos de respuesta. La API de resource de Angular proporciona la capacidad de hacer streaming de respuestas para soportar este tipo de patrón. La propiedad `stream` de `resource` acepta una función asíncrona que puedes usar para aplicar actualizaciones a un valor de signal a lo largo del tiempo. El signal que se está actualizando representa los datos que se están transmitiendo en streaming.

```ts
characters = resource({
  stream: async () => {
    const data = signal<ResourceStreamItem<string>>({value: ''});
    // Llama a un flow de streaming de Genkit usando el método streamFlow
    // expuesto por el SDK cliente de Genkit
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

El miembro `characters` se actualiza asincrónicamente y puede mostrarse en la plantilla.

```angular-html
@if (characters.isLoading()) {
  <p>Cargando...</p>
} @else if (characters.hasValue()) {
  <p>{{characters.value()}}</p>
} @else {
  <p>{{characters.error()}}</p>
}
```

En el lado del servidor, en `server.ts` por ejemplo, el endpoint definido envía los datos para ser transmitidos en streaming al cliente. El siguiente código usa Gemini con el framework Genkit pero esta técnica es aplicable a otras APIs que soporten respuestas en streaming de LLMs:

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
