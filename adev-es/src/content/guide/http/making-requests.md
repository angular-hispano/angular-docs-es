# Realizando solicitudes HTTP

`HttpClient` tiene métodos correspondientes a los diferentes verbos HTTP utilizados para hacer solicitudes, tanto para cargar datos como para aplicar mutaciones en el servidor. Cada método devuelve un [RxJS `Observable`](https://rxjs.dev/guide/observable) que, al sucribirse se suscribe, envía la solicitud y luego emite los resultados cuando el servidor responde.

NOTA: Los `Observable`s creados por `HttpClient` pueden suscribirse cualquier número de veces y harán una nueva solicitud al backend por cada suscripción.

A través de un objeto de opciones pasado al método de solicitud, se pueden ajustar varias propiedades de la solicitud y del tipo de respuesta devuelta.

## Obteniendo datos JSON

Obtener datos de un backend con frecuencia requiere hacer una solicitud GET usando el método [`HttpClient.get()`](api/common/http/HttpClient#get). Este método toma dos argumentos: la URL del endpoint como string desde donde obtener los datos, y un objeto de *opciones opcionales* para configurar la solicitud.

Por ejemplo, para obtener datos de configuración de una API hipotética usando el método `HttpClient.get()`:

<docs-code language="ts">
http.get<Config>('/api/config').subscribe(config => {
  // procesar la configuración.
});
</docs-code>

Observa el argumento de tipo genérico que especifica que los datos devueltos por el servidor serán de tipo `Config`. Este argumento es opcional, y si lo omites, los datos devueltos tendrán tipo `Object`.

CONSEJO: Cuando trabajes con datos de estructura incierta y valores potencialmente `undefined` o `null`, considera usar el tipo `unknown` en lugar de `Object` como tipo de respuesta.

CRÍTICO: El tipo genérico de los métodos de solicitud es una **afirmación** de tipo sobre los datos devueltos por el servidor. `HttpClient` no verifica que los datos de retorno reales coincidan con este tipo.

## Obteniendo otros tipos de datos

Por defecto, `HttpClient` asume que los servidores devolverán datos JSON. Cuando interactúes con una API que no sea JSON, puedes decirle a `HttpClient` qué tipo de respuesta esperar y devolver al hacer la solicitud. Esto se hace con la opción `responseType`.

| **`Valor de responseType`** | **Tipo de respuesta devuelto** |
| - | - |
| `'json'` (por defecto) | Datos JSON del tipo genérico dado |
| `'text'` | Cadena de texto (string) |
| `'arraybuffer'` | [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene los bytes de respuesta sin procesar |
| `'blob'` | instance [`Blob`](https://developer.mozilla.org/es/docs/Web/API/Blob) |

Por ejemplo, puedes pedirle al `HttpClient` que descargue los bytes sin procesar de una imagen `.jpeg` en un `ArrayBuffer`:

<docs-code language="ts">
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe(buffer => {
  console.log('La imagen tiene ' + buffer.byteLength + ' bytes de tamaño');
});
</docs-code>

<docs-callout important title="Valor literal para `responseType">
Debido a que el valor de `responseType` afecta el tipo devuelto por `HttpClient`, debe tener un tipo literal y no un tipo `string`.

Esto sucede automáticamente si el objeto de opciones pasado al método de solicitud es un objeto literal, pero si estás extrayendo las opciones de solicitud a una variable o método auxiliar, podrías necesitar especificarlo explícitamente como literal, por ejemplo: `responseType: 'text' as const`.
</docs-callout>

## Modificando el estado del servidor

Las APIs del servidor que realizan mutaciones con frecuencia requieren hacer solicitudes POST con un cuerpo de solicitud que especifique el nuevo estado o el cambio a realizar.

El método [`HttpClient.post()`](api/common/http/HttpClient#post) se comporta de manera similar a `get()`, y acepta un argumento `body` adicional antes de sus opciones:

<docs-code language="ts">
http.post<Config>('/api/config', newConfig).subscribe(config => {
  console.log('Configuración actualizada:', config);
});
</docs-code>

Se pueden proporcionar muchos tipos diferentes de valores como `body` de la solicitud, y `HttpClient` los serializará en consecuencia:

| **Tipo de `body`** | **Serializado as** |
| - | - |
| string | Texto plano |
| number, boolean, array, u objeto plano | JSON |
| [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | datos sin procesar del buffer |
| [`Blob`](https://developer.mozilla.org/es/docs/Web/API/Blob) | datos sin procesar con el tipo de contenido del `Blob |
| [`FormData`](https://developer.mozilla.org/es/docs/Web/API/FormData) | datos codificados `multipart/form-data` |
| [`HttpParams`](api/common/http/HttpParams) o [`URLSearchParams`](https://developer.mozilla.org/es/docs/Web/API/URLSearchParams) | string formateado `application/x-www-form-urlencoded` |

IMPORTANTE: Recuerda hacer `.subscribe()` a los `Observable`s de solicitudes de mutación para realmente ejecutar la solicitud.

## Configurando parámetros de URL parameters

Especifica los parámetros de solicitud que deben incluirse en la URL de la solicitud usando la opción `params`.

Pasar un objeto literal es la forma más simple de configurar parámetros de URL:

<docs-code language="ts">
http.get('/api/config', {
  params: {filter: 'all'},
}).subscribe(config => {
  // ...
});
</docs-code>

Alternativamente, puedes pasar una instancia de `HttpParams` si necesitas más control sobre la construcción o serialización de los parámetros.

IMPORTANTE: Las instancias de `HttpParams` son _inmutables_ y no se pueden cambiar directamente. En su lugar, los métodos de mutación como `append()` devuelven una nueva instancia de `HttpParams` con la mutación aplicada.

<docs-code language="ts">
const baseParams = new HttpParams().set('filter', 'all');

http.get('/api/config', {
  params: baseParams.set('details', 'enabled'),
}).subscribe(config => {
  // ...
});
</docs-code>

Puedes instanciar `HttpParams` con un `HttpParameterCodec` personalizado que determine cómo `HttpClient` codificará los parámetros en la URL.

## Configurando encabezados de solicitud

Especifica los encabezados de solicitud que deben incluirse en la solicitud usando la opción `headers`.

Pasar un objeto literal es la forma más simple de configurar encabezados de solicitud:

<docs-code language="ts">
http.get('/api/config', {
  headers: {
    'X-Debug-Level': 'verbose',
  }
}).subscribe(config => {
  // ...
});
</docs-code>

Alternativamente, pasa una instancia de `HttpHeaders` si necesitas más control sobre la construcción de encabezados

IMPORTANTE: Las instancias de `HttpHeaders` son _inmutables_ y no se pueden cambiar directamente. En su lugar, los métodos de mutación como `append()` devuelven una nueva instancia de `HttpHeaders` con la mutación aplicada.

<docs-code language="ts">
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http.get<Config>('/api/config', {
  headers: baseHeaders.set('X-Debug-Level', 'verbose'),
}).subscribe(config => {
  // ...
});
</docs-code>

## Interactuando con los eventos de respuesta del servidor

Por conveniencia, `HttpClient` devuelve por defecto un `Observable` con los datos de la respuesta (el body). A veces es útil examinar la respuesta completa, por ejemplo, para obtener cabeceras específicas.

Para acceder a toda la respuesta, establece la opción `observe` en `'response'`:

<docs-code language="ts">
http.get<Config>('/api/config', {observe: 'response'}).subscribe(res => {
  console.log('Estado de respuesta:', res.status);
  console.log('Cuerpo:', res.body);
});
</docs-code>

<docs-callout important title="Valor literal para `observe`">
Debido a que el valor de `observe` afecta el tipo devuelto por `HttpClient`, debe tener un tipo literal y no un tipo `string`.

Esto sucede automáticamente si el objeto de opciones pasado al método de solicitud es un objeto literal, pero si estás extrayendo las opciones de solicitud a una variable o método auxiliar, podrías necesitar especificarlo explícitamente como literal, por ejemplo: `observe: 'response' as const`.
</docs-callout>

## Recibiendo eventos de progreso sin procesar

Además del cuerpo de la respuesta o el objeto de respuesta, `HttpClient` también puede devolver una secuencia de _eventos_ sin procesar que corresponden a momentos específicos en el ciclo de vida de la solicitud. Estos eventos incluyen cuando se envía la solicitud, cuando se devuelve el encabezado de respuesta, y cuando el cuerpo está completo. Estos eventos también pueden incluir _eventos de progreso_ que reportan el estado de carga y descarga para cuerpos de solicitud o respuesta grandes.

Los eventos de progreso están deshabilitados por defecto (ya que tienen un costo de rendimiento) pero se pueden habilitar con la opción `reportProgress`.

NOTA: La implementación opcional `fetch` de `HttpClient` no reporta eventos de progreso de _carga_.

Para observar la secuencia de eventos, establece la opción `observe` en `'events'`:

<docs-code language="ts">
http.post('/api/upload', myData, {
  reportProgress: true,
  observe: 'events',
}).subscribe(event => {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      console.log('Cargados ' + event.loaded + ' de ' + event.total + ' bytes');
      break;
    case HttpEventType.Response:
      console.log('¡Carga finalizada!');
      break;
  }
});
</docs-code>

<docs-callout important title="Valor literal para `observe`">
Debido a que el valor de `observe` afecta el tipo devuelto por `HttpClient`, debe tener un tipo literal y no un tipo `string`.

Esto sucede automáticamente si el objeto de opciones pasado al método de solicitud es un objeto literal, pero si estás extrayendo las opciones de solicitud a una variable o método auxiliar, podrías necesitar especificarlo explícitamente como literal, como `observe: 'events' as const`.
</docs-callout>

Cada `HttpEvent` reportado en la secuencia de eventos tiene un `type` que distingue lo que representa el evento:

| **Valor de `type`** | **Significado del evento** |
| - | - |
| `HttpEventType.Sent` | La solicitud ha sido enviada al servidor |
| `HttpEventType.UploadProgress` | Un `HttpUploadProgressEvent` reportando progreso en la carga del cuerpo de la solicitud |
| `HttpEventType.ResponseHeader` | Se ha recibido el encabezado de la respuesta, incluyendo estado y encabezados |
| `HttpEventType.DownloadProgress` | An `HttpDownloadProgressEvent` reporting progress on downloading the response body |
| `HttpEventType.Response` | Se ha recibido toda la respuesta, incluyendo el cuerpo de la respuesta |
| `HttpEventType.User` | Un evento personalizado de un interceptor Http.

## Manejando fallos de solicitud

Hay dos formas en que una solicitud HTTP puede fallar:

* Un error de red o conexión puede impedir que la solicitud llegue al servidor backend.
* El backend puede recibir la solicitud pero fallar al procesarla, y devolver una respuesta de error.

`HttpClient` captura ambos tipos de errores en un `HttpErrorResponse` que devuelve a través del canal de error del `Observable`. Los errores de red tienen un código de `status` de `0` y un `error` que es una instancia de [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent). Los errores del backend tienen el código de `status` fallido devuelto por el backend, y la respuesta de error como `error`. Inspecciona la respuesta para identificar la causa del error y la acción apropiada para manejar el error.

La [librería RxJS](https://rxjs.dev/) ofrece varios operadores que pueden ser útiles para el manejo de errores.

Puedes usar el operador `catchError` para transformar una respuesta de error en un valor para la UI. Este valor puede decirle a la UI que muestre una página o valor de error, y capturar la causa del error si es necesario.

A veces, errores transitorios como interrupciones de red pueden hacer que una solicitud falle inesperadamente, y simplemente reintentar la solicitud permitirá que tenga éxito. RxJS proporciona varios operadores de *reintento* que automáticamente se re-suscriben a un `Observable` fallido bajo ciertas condiciones. Por ejemplo, el operador `retry()` automáticamente intentará re-suscribirse un número especificado de veces.

## `Observable`s Http

Cada método de solicitud en `HttpClient` construye y devuelve un `Observable` del tipo de respuesta solicitado. Entender cómo funcionan estos `Observable`s es importante al usar `HttpClient`.

`HttpClient` produce lo que RxJS llama `Observable`s "fríos", lo que significa que no ocurre ninguna solicitud real hasta que se suscribe al `Observable`. Solo entonces se envía realmente la solicitud al servidor. Suscribirse al mismo `Observable` múltiples veces activará múltiples solicitudes al backend. Cada suscripción es independiente.

CONSEJO: Puedes pensar en los `Observable`s de `HttpClient` como _planos_ para solicitudes reales del servidor.

Una vez suscrito, cancelar la suscripción abortará la solicitud en progreso. Esto es muy útil si el `Observable` se suscribe a través del pipe `async`, ya que automáticamente cancelará la solicitud si el usuario navega fuera de la página actual. Además, si usas el `Observable` con un combinador RxJS como `switchMap`, esta cancelación limpiará cualquier solicitud obsoleta.

Una vez que la respuesta regresa, los `Observable`s de `HttpClient` usualmente se completan (aunque los interceptores pueden influir en esto).

Debido a la finalización automática, generalmente no hay riesgo de fugas de memoria si las suscripciones de `HttpClient` no se limpian. Sin embargo, como con cualquier operación asíncrona, recomendamos encarecidamente que limpies las suscripciones cuando el componente que las usa se destruya, ya que el callback de suscripción podría ejecutarse y encontrar errores cuando intente interactuar con el componente destruido.

CONSEJO: Usar el pipe `async` o la operación `toSignal` para suscribirse a `Observable`s asegura que las suscripciones se eliminen correctamente.

## Mejores prácticas

Aunque `HttpClient` puede ser inyectado y usado directamente desde los componentes, generalmente se recomienda que crees servicios reutilizables e inyectables que aíslen y encapsulen la lógica de acceso a datos. Por ejemplo, este `UserService` encapsula la lógica para solicitar datos de un usuario por su id:

<docs-code language="ts">
@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
</docs-code>

Dentro de un componente, puedes combinar `@if` con el `async` pipe para renderizar la interfaz de usuario para los datos solo después de que hayan terminado de cargarse:

<docs-code language="ts">
import { AsyncPipe } from '@angular/common';
@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Nombre: {{ user.name }}</p>
      <p>Biografía: {{ user.biography }}</p>
    }
  `,
})
export class UserProfileComponent {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor(): void {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
</docs-code>
