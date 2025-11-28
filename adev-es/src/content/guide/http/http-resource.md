# Obtención reactiva de datos con `httpResource`

IMPORTANTE: `httpResource` es [experimental](reference/releases#experimental). Está listo para que lo pruebes, pero podría cambiar antes de que sea estable.

`httpResource` es un envoltorio reactivo alrededor de `HttpClient` que te proporciona el estado de la solicitud y la respuesta como señales. Por lo tanto, puedes usar estas señales con `computed`, `effect`, `linkedSignal`, o cualquier otra API reactiva. Debido a que está construido sobre `HttpClient`, `httpResource` admite todas las mismas características, como interceptores.

Para más información sobre el patrón `resource` de Angular, consulta [Reactividad asíncrona con `resource`](/guide/signals/resource).

## `Usando httpResource`

CONSEJO: Asegúrate de incluir `provideHttpClient` en los providers de tu aplicación. Consulta [Configurar HttpClient](/guide/http/setup) para más detalles.

Puedes definir un recurso HTTP devolviendo una URL:

```ts
userId = input.required<string>();

user = httpResource(() => `/api/user/${userId()}`); // Una función reactiva como argumento
```

`httpResource` es reactivo, lo que significa que cada vez que una de las señales de las que depende cambie (como `userId`), el recurso emitirá una nueva solicitud HTTP.
Si una solicitud ya está pendiente, el recurso cancela la solicitud pendiente antes de emitir una nueva.

ÚTIL: `httpResource` difiere de `HttpClient` ya que inicia la solicitud de manera _inmediata_. En contraste, `HttpClient` solo inicia solicitudes al suscribirse al `Observable` devuelto.

Para solicitudes más avanzadas, puedes definir un objeto de solicitud similar al que toma `HttpClient`.
Cada propiedad del objeto de solicitud que debe ser reactiva debe estar compuesta por una señal.

```ts
user = httpResource(() => ({
  url: `/api/user/${userId()}`,
  method: 'GET',
  headers: {
    'X-Special': 'true',
  },
  params: {
    'fast': 'yes',
  },
  reportProgress: true,
  transferCache: true,
  keepalive: true,  
  mode: 'cors', 
  redirect: 'error',
  priority: 'high',
  cache : 'force-cache',
  credentials: 'include',
  referrer: 'no-referrer',
  integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY=',
  referrerPolicy: 'no-referrer'
}));
```

CONSEJO: Evita usar `httpResource` para _mutaciones_ como `POST` o `PUT`. En su lugar, prefiere usar directamente las APIs subyacentes de `HttpClient`.

Las signals del `httpResource` se pueden usar en la plantilla para controlar qué elementos deben mostrarse.

```angular-html
@if(user.hasValue()) {
  <user-details [user]="user.value()">
} @else if (user.error()) {
  <div>No se pudo cargar la información del usuario</div>
} @else if (user.isLoading()) {
  <div>Cargando información del usuario...</div>
}
```

ÚTIL: Leer la signal `value` en un `resource` que está en estado de error lanza una excepción en tiempo de ejecución. Se recomienda proteger las lecturas de `value` con `hasValue()`.

### Tipos de respuestas

Por defecto, `httpResource` devuelve y analiza la respuesta como JSON. Sin embargo, puedes especificar un retorno alternativo con funciones adicionales en `httpResource`:

```ts
httpResource.text(() => ({ … })); // devuelve un string en value()

httpResource.blob(() => ({ … })); // devuelve un objeto Blob en value()

httpResource.arrayBuffer(() => ({ … })); // devuelve un ArrayBuffer en value()
```

## Análisis y validación de respuestas

Al obtener datos, es posible que quieras validar las respuestas contra un esquema predefinido, a menudo usando bibliotecas populares de código abierto como [Zod](https://zod.dev) o [Valibot](https://valibot.dev). Puedes integrar bibliotecas de validación como estas con `httpResource` especificando una opción `parse`. El tipo de retorno de la función `parse` determina el tipo del `value` del recurso.

El siguiente ejemplo usa Zod para analizar y validar la respuesta de la [API de StarWars](https://swapi.info/). El recurso se tipa igual que el tipo de salida del análisis de Zod.

```ts
const starWarsPersonSchema = z.object({
  name: z.string(),
  height: z.number({ coerce: true }),
  edited: z.string().datetime(),
  films: z.array(z.string()),
});

export class CharacterViewer {
  id = signal(1);

  swPersonResource = httpResource(
    () => `https://swapi.info/api/people/${this.id()}`,
    { parse: starWarsPersonSchema.parse }
  );
}
```

## Probando un httpResource

Debido a que `httpResource` es un envoltorio alrededor de `HttpClient`, puedes probar `httpResource` con exactamente las mismas APIs que `HttpClient`. Consulta [Pruebas de HttpClient](/guide/http/testing) para más detalles.

El siguiente ejemplo muestra una prueba unitaria para código que usa `httpResource`.

```ts
TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const id = signal(0);
const mockBackend = TestBed.inject(HttpTestingController);
const response = httpResource(() => `/data/${id()}`, {injector: TestBed.inject(Injector)});
TestBed.tick(); // TDispara el efecto
const firstRequest = mockBackend.expectOne('/data/0');
firstRequest.flush(0);

// Asegura que los valores se propaguen al httpResource
await TestBed.inject(ApplicationRef).whenStable();

expect(response.value()).toEqual(0);
```
