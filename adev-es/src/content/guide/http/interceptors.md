# Interceptores

`HttpClient` soporta una forma de middleware conocida como _interceptores_.

RESUMEN: Los interceptores son middleware que permiten abstraer patrones comunes como reintentos, caché, registro de actividad y autenticación, evitando que cada solicitud individual tenga que manejar estos casos por separado.

`HttpClient` soporta dos tipos de interceptores: funcionales y basados en DI. Nuestra recomendación es usar interceptores funcionales porque tienen un comportamiento más predecible, especialmente en configuraciones complejas. Nuestros ejemplos en esta guía usan interceptores funcionales, y cubrimos los [interceptores basados en DI](#interceptores-basados-en-di) en su propia sección al final.

## Interceptores

Los interceptores son generalmente funciones que puedes ejecutar para cada solicitud, y tienen amplias capacidades para afectar el contenido y el flujo general de las solicitudes y respuestas. Puedes instalar múltiples interceptores, que forman una cadena de interceptores donde cada interceptor procesa la solicitud o respuesta antes de reenviarla al siguiente interceptor en la cadena.

Puedes usar interceptores para implementar una variedad de patrones comunes, como:

* Agregar encabezados de autenticación a las solicitudes salientes a una API particular.
* Reintentar solicitudes fallidas con retroceso exponencial.
* Almacenar en caché las respuestas por un período de tiempo, o hasta que sean invalidadas por mutaciones.
* Personalizar el análisis de las respuestas.
* Medir los tiempos de respuesta del servidor y registrarlos.
* Controlar elementos de la UI como un indicador de carga mientras las operaciones de red están en progreso.
* Recopilar y agrupar solicitudes realizadas dentro de un marco de tiempo determinado.
* Fallar automáticamente las solicitudes después de una fecha límite o tiempo de espera configurable.
* Consultar periódicamente el servidor y actualizar los resultados.

## Definiendo un interceptor

La forma básica de un interceptor es una función que recibe la `HttpRequest` saliente y una función `next` que representa el siguiente paso de procesamiento en la cadena de interceptores.

Por ejemplo, este `loggingInterceptor` registrará la URL de la solicitud saliente en `console.log` antes de reenviar la solicitud:

<docs-code language="ts">
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
</docs-code>

Para que este interceptor realmente intercepte las solicitudes, debes configurar `HttpClient` para usarlo.

## Configurando interceptores

Declaras el conjunto de interceptores a usar al configurar `HttpClient` a través de inyección de dependencias, usando la característica `withInterceptors`:

<docs-code language="ts">
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    withInterceptors([loggingInterceptor, cachingInterceptor]),
  )
]});
</docs-code>

Los interceptores que configuras se encadenan juntos en el orden que los has listado en los providers. En el ejemplo anterior, el `loggingInterceptor` procesaría la solicitud y luego la reenviaría al `cachingInterceptor`.

### Interceptando evento de respuesta

Un interceptor puede transformar la secuencia `Observable` de `HttpEvent`s devuelta por `next` para acceder o manipular la respuesta. Debido a que esta secuencia incluye todos los eventos de respuesta, inspeccionar el `.type` de cada evento puede ser necesario para identificar el objeto de respuesta final.

<docs-code language="ts">
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log(req.url, 'devolvió una respuesta con estado', event.status);
    }
  }));
}
</docs-code>

CONSEJO: Los interceptores naturalmente asocian las respuestas con sus solicitudes salientes, porque transforman el flujo de respuesta en una función de cierre (closure) que captura el objeto de solicitud.

## Modificando requests

La mayoría de los aspectos de las instancias `HttpRequest` y `HttpResponse` son _inmutables_, y los interceptores no pueden modificarlos directamente. En su lugar, los interceptores aplican mutaciones clonando estos objetos usando la operación `.clone()`, y especificando qué propiedades deben mutarse en la nueva instancia. Esto puede involucrar realizar actualizaciones inmutables en el valor mismo (como `HttpHeaders` o `HttpParams`).

Por ejemplo, para agregar un encabezado a una solicitud:

<docs-code language="ts">
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
</docs-code>

Esta inmutabilidad permite que la mayoría de los interceptores sean idempotentes si la misma `HttpRequest` se envía a la cadena de interceptores múltiples veces. Esto puede suceder por algunas razones, incluyendo cuando una solicitud se reintenta después de fallar.

CRÍTICO: El cuerpo de una solicitud o respuesta **no** está protegido de mutaciones profundas. Si un interceptor debe mutar el cuerpo, ten cuidado de manejar la ejecución múltiples veces en la misma solicitud.

## Inyección de dependencias en interceptores

Los interceptores se ejecutan en el _contexto de inyección_ del inyector que los registró, y pueden usar la API `inject` de Angular para recuperar dependencias.

Por ejemplo, supongamos que una aplicación tiene un servicio llamado `AuthService`, que crea tokens de autenticación para las solicitudes salientes. Un interceptor puede inyectar y usar este servicio:

<docs-code language="ts">
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
</docs-code>

## Metada de solicitudes y respuestas

Con frecuencia es útil incluir información en una solicitud que no se envía al backend, pero está específicamente destinada para los interceptores. Las `HttpRequest`s tienen un objeto `.context` que almacena este tipo de metadatos como una instancia de `HttpContext`. Este objeto funciona como un mapa tipado, con claves de tipo `HttpContextToken`.

Para ilustrar cómo funciona este sistema, usemos metadatos para controlar si un interceptor de caché está habilitado para una solicitud determinada.

### Definiendo tokens de contexto

Para almacenar si el interceptor de caché debe almacenar en caché una solicitud particular en el mapa `.context` de esa solicitud, define un nuevo `HttpContextToken` para actuar como clave:

<docs-code language="ts">
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
</docs-code>

La función proporcionada crea el valor por defecto para el token para las solicitudes que no han establecido explícitamente un valor para él. Usar una función asegura que si el valor del token es un objeto o array, cada solicitud obtiene su propia instancia.

### Leyendo el token en un interceptor

Un interceptor puede entonces leer el token y elegir aplicar lógica de caché o no basándose en su valor:

<docs-code language="ts">
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // aplicar lógica de caché
    return ...;
  } else {
    // el caché ha sido deshabilitado para esta solicitud
    return next(req);
  }
}
</docs-code>

### Configurando tokens de contexto al hacer una solicitud

Al hacer una solicitud a través de la API `HttpClient`, puedes proporcionar valores para `HttpContextToken`s:

<docs-code language="ts">
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
</docs-code>

Los interceptores pueden leer estos valores del `HttpContext` de la solicitud.

### El contexto de la solicitud es mutable

A diferencia de otras propiedades de `HttpRequest`s, el `HttpContext` asociado es _mutable_. Si un interceptor cambia el contexto de una solicitud que luego se reintenta, el mismo interceptor observará la mutación del contexto cuando se ejecute nuevamente. Esto es útil para pasar estado a través de múltiples reintentos si es necesario.

## Respuestas sintéticas

La mayoría de los interceptores simplemente invocarán el manejador `next` mientras transforman la solicitud o la respuesta, pero esto no es estrictamente un requisito. Esta sección discute varias de las formas en que un interceptor puede incorporar comportamiento más avanzado.

Los interceptores no están obligados a invocar `next`. Pueden elegir construir respuestas a través de algún otro mecanismo, como desde un caché o enviando la solicitud a través de un mecanismo alternativo.

Construir una respuesta es posible usando el constructor `HttpResponse`:

<docs-code language="ts">
const resp = new HttpResponse({
  body: 'response body',
});
</docs-code>

## Interceptores basados en DI (Inyección de Dependencias)

`HttpClient` también soporta interceptores que se definen como clases inyectables y se configuran a través del sistema DI. Las capacidades de los interceptores basados en DI son idénticas a las de los interceptores funcionales, pero el mecanismo de configuración es diferente.

Un interceptor basado en DI es una clase inyectable que implementa la interfaz `HttpInterceptor`:

<docs-code language="ts">
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('URL de la petición: ' + req.url);
    return handler.handle(req);
  }
}
</docs-code>

Los interceptores basados en DI se configuran a través de un multi-provider de inyección de dependencias:

<docs-code language="ts">
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    // Los interceptores basados en DI deben habilitarse explícitamente.
    withInterceptorsFromDi(),
  ),

  {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
]});
</docs-code>

Los interceptores basados en DI se ejecutan en el orden en que se registran sus providers. En una aplicación con una configuración DI extensa y jerárquica, este orden puede ser muy difícil de predecir.
