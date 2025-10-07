# Probar solicitudes

Como con cualquier dependencia externa, debes simular (mock) el backend HTTP para que tus pruebas puedan emular la interacción con un servidor remoto. La librería `@angular/common/http/testing` proporciona herramientas para capturar las solicitudes realizadas por la aplicación, hacer afirmaciones sobre ellas y simular respuestas que emulen el comportamiento de tu backend.

La librería de pruebas está diseñada para un patrón en el que la aplicación primero ejecuta el código y realiza las peticiones. Luego, la prueba espera que ciertas peticiones se hayan o no se hayan hecho, realiza afirmaciones contra esas peticiones y finalmente proporciona respuestas "vacilando" (flushing) cada petición esperada.

Al final, las pruebas pueden verificar que la aplicación no hizo solicitudes inesperadas.

## Configuración para pruebas

Para comenzar a probar el uso de `HttpClient`, configura `TestBed` e incluye `provideHttpClient()` y `provideHttpClientTesting()` en la configuración de tu prueba. Esto configura `HttpClient` para usar un backend de prueba en lugar de la red real. También proporciona `HttpTestingController`, que usarás para interactuar con el backend de prueba, establecer expectativas sobre qué solicitudes se han realizado, y limpiar respuestas a esas solicitudes. `HttpTestingController` se puede inyectar desde `TestBed` una vez configurado.

Ten en cuenta que debes proporcionar `provideHttpClient()` **antes** que `provideHttpClientTesting()`, ya que `provideHttpClientTesting()` sobrescribirá partes de `provideHttpClient()`. Hacerlo al revés puede romper potencialmente tus pruebas.

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    // ... otros providers de prueba
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
</docs-code>

Ahora cuando tus pruebas hagan solicitudes, llegarán al backend de prueba en lugar del normal. Puedes usar `httpTesting` para hacer afirmaciones sobre esas solicitudes.

## Esperando y respondiendo solicitudes

Por ejemplo, puedes escribir una prueba que espera que ocurra una solicitud GET y proporciona una respuesta simulada:

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    ConfigService,
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Cargar `ConfigService` y solicitar la configuración actual.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` se suscribe al `Observable`, lo que hace la solicitud HTTP,
// y crea una `Promise` de la respuesta.
const configPromise = firstValueFrom(config$);

// En este punto, la solicitud está pendiente, y podemos afirmar que se realizó
// a través del `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Solicitud para cargar la configuración');

// Si se desea, podemos hacer varias afirmaciones sobre las propiedades de la petición.
expect(req.request.method).toBe('GET');

// Limpiar la solicitud hace que se complete, entregando el resultado.
req.flush(DEFAULT_CONFIG);

// Podemos entonces afirmar que la respuesta fue entregada exitosamente por el `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Finalmente, podemos afirmar que no se hicieron otras solicitudes.
httpTesting.verify();
</docs-code>

NOTA: `expectOne` fallará si la prueba ha hecho más de una solicitud que coincida con los criterios dados.

Como alternativa a aseverar en `req.method`, podrías usar una forma expandida de `expectOne` para también coincidir con el método de solicitud:

<docs-code language="ts">
const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, 'Solicitud para cargar la configuración');
</docs-code>

ÚTIL: Las APIs de expectativa coinciden contra la URL completa de las solicitudes, incluyendo cualquier parámetro de consulta.

El último paso, verificar que no queden solicitudes pendientes, es lo suficientemente común para que lo muevas a un paso `afterEach()`:

<docs-code language="ts">
afterEach(() => {
  // Verificar que ninguna de las pruebas haga solicitudes HTTP adicionales.
  TestBed.inject(HttpTestingController).verify();
});
</docs-code>

## Manejando más de una solicitud a la vez

Si necesitas responder a solicitudes duplicadas en tu prueba, usa la API `match()` en lugar de `expectOne()`. Toma los mismos argumentos pero devuelve un array de solicitudes coincidentes. Una vez devueltas, estas solicitudes se eliminan de futuras coincidencias y eres responsable de limpiarlas y verificarlas.

<docs-code language="ts">
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Manejar la respuesta a cada petición.
}
</docs-code>

## Coincidencia avanzada

Todas las funciones de coincidencia aceptan una función predicado para lógica de coincidencia personalizada:

<docs-code language="ts">
// Busca una petición que tenga un cuerpo de petición.
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);
</docs-code>

La función `expectNone` afirma que ninguna petición coincide con los criterios dados.

<docs-code language="ts">
// Afirma que no se han emitido peticiones de mutación.
httpTesting.expectNone(req => req.method !== 'GET');
</docs-code>

## Probando el manejo de errores

Debes probar las respuestas de tu aplicación cuando las solicitudes HTTP fallan.

### Errores del backend

Para probar el manejo de errores del backend (cuando el servidor devuelve un código de estado no exitoso), limpia las solicitudes con una respuesta de error que emule lo que tu backend devolvería cuando una solicitud falla.

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.flush('¡Falló!', {status: 500, statusText: 'Error interno del servidor'});

// Afirma que la aplicación manejó con éxito el error del backend.
</docs-code>

### Errores de red

Las solicitudes también pueden fallar debido a errores de red, que se manifiestan como errores `ProgressEvent`. Estos se pueden entregar con el método `error()`:

<docs-code language="ts">
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Afirma que la aplicación manejó con éxito el error de red.
</docs-code>

## Probando un Interceptor

Debes probar que tus interceptores funcionen bajo las circunstancias deseadas.

Por ejemplo, una aplicación puede requerir agregar un token de autenticación generado por un servicio a cada solicitud saliente.
Este comportamiento se puede hacer cumplir con el uso de un interceptor:

<docs-code language="ts">
export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}
</docs-code>

La configuración de `TestBed` para este interceptor debe depender de la característica `withInterceptors`.

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    AuthService,
    // Se recomienda probar un interceptor a la vez.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
</docs-code>

El `HttpTestingController` puede recuperar la instancia de la solicitud que luego se puede inspeccionar para asegurar que la solicitud fue modificada.

<docs-code language="ts">
const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');

expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
</docs-code>

Un interceptor similar podría implementarse con interceptores basados en clases:

<docs-code language="ts">
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}
</docs-code>

Para probarlo, la configuración de `TestBed` debería ser en su lugar:

<docs-code language="ts">
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    // Dependemos del token HTTP_INTERCEPTORS para registrar el AuthInterceptor como un HttpInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
});
</docs-code>
