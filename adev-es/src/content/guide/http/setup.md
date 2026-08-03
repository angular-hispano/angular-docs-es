# Configurando `HttpClient`

`HttpClient` está disponible para inyección de forma predeterminada en Angular v21 y versiones posteriores.

## Proporcionando `HttpClient` a través de inyección de dependencias {#providing-httpclient-through-dependency-injection}

Puedes usar la función auxiliar `provideHttpClient` para configurar el conjunto de características HTTP predeterminado o agregar características en los `providers` de la aplicación en `app.config.ts`.

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(/* agrega características aquí, como withInterceptors(...) */)],
};
```

Si tu aplicación usa el método de inicialización basado en NgModule, puedes incluir `provideHttpClient` en los providers del NgModule de tu aplicación para configurar el conjunto de características HTTP predeterminado o agregar características:

```ts
@NgModule({
  providers: [provideHttpClient(/* agrega características aquí, como withInterceptors(...) */)],
  // ... otra configuración de la aplicación
})
export class AppModule {}
```

Luego puedes inyectar el servicio `HttpClient` como una dependencia de tus componentes, servicios u otras clases:

```ts
@Service()
export class ConfigService {
  private http = inject(HttpClient);
  // Este servicio ahora puede hacer solicitudes HTTP a través de `this.http`.
}
```

## Configurando características `HttpClient` {#configuring-features-of-httpclient}

`provideHttpClient` acepta una lista de configuraciones de características opcionales para habilitar o configurar diferentes aspectos del cliente. Esta sección detalla las características opcionales y su uso.

### `withXhr`

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withXhr())],
};
```

Por defecto, `HttpClient` usa la API [`fetch`](https://developer.mozilla.org/es/docs/Web/API/Fetch_API) para hacer solicitudes. La característica `withXhr` cambia el cliente para usar la API [`XMLHttpRequest`](https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest) en su lugar.

`fetch` es una API más moderna y está disponible en algunos entornos donde `XMLHttpRequest` no es compatible. Tiene algunas limitaciones, como no producir eventos de progreso de carga.

<docs-callout critical title="No uses `withXhr` en entornos de renderizado del lado del servidor (SSR)">

El soporte para XHR en el servidor está **deprecado** y se tiene previsto eliminar en Angular 23. La librería subyacente `xhr2` no maneja redirecciones de forma segura: puede reenviar encabezados `Authorization` en redirecciones de origen cruzado y es susceptible a ataques de denegación de servicio (DoS) mediante bucles de redirección. Para aplicaciones SSR, usa el backend `fetch` predeterminado en su lugar.

</docs-callout>

### `withInterceptors(...)`

`withInterceptors` configura el conjunto de funciones interceptor que procesarán las solicitudes realizadas a través de `HttpClient`. Consulta la [guía de interceptores](guide/http/interceptors) para más información.

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` incluye el estilo más antiguo de interceptores basados en clases en la configuración de `HttpClient`. Consulta la [guía de interceptores](guide/http/interceptors) para más información.

ÚTIL: Los interceptores funcionales (a través de `withInterceptors`) tienen un orden más predecible y los recomendamos sobre los interceptores basados en DI.

### `withRequestsMadeViaParent()`

Por defecto, cuando configuras `HttpClient` usando `provideHttpClient` dentro de un inyector dado, esta configuración sobrescribe cualquier configuración para `HttpClient` que pueda estar presente en el inyector padre.

Al agregar `withRequestsMadeViaParent()`, `HttpClient` se configura para pasar las solicitudes al `HttpClient` del inyector padre, una vez que han pasado por cualquier interceptor configurado en este nivel. Esto es útil si deseas _añadir_ interceptores en un inyector hijo mientras sigues enviando la solicitud a través de los interceptores del inyector padre.

CRÍTICO: Debes configurar una instancia de `HttpClient` en un inyector superior al actual, de lo contrario esta opción no será válida y obtendrás un error en tiempo de ejecución.

### `withJsonpSupport()`

Incluir `withJsonpSupport` habilita el método `.jsonp()` en `HttpClient`, que realiza una solicitud GET a través de la [convención JSONP](https://es.wikipedia.org/wiki/JSONP) para la carga de datos entre dominios.

ÚTIL: Siempre que sea posible, prefiere usar [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) para hacer solicitudes entre dominios en lugar de JSONP.

### `withXsrfConfiguration(...)`

Incluir esta opción permite la personalización de la funcionalidad de seguridad XSRF integrada de `HttpClient`. Consulta la [guía de seguridad](best-practices/security) para más información.

### `withNoXsrfProtection()`

Incluir esta opción deshabilita la funcionalidad de seguridad XSRF integrada de `HttpClient`. Consulta la [guía de seguridad](best-practices/security) para más información.

## Configuración basada en `HttpClientModule` {#httpclientmodule-based-configuration}

Algunas aplicaciones pueden configurar `HttpClient` usando la API más antigua basada en NgModules.

Esta tabla lista los NgModules disponibles en `@angular/common/http` y cómo se relacionan con las funciones de configuración de proveedores anteriores.

| **NgModule**                            | `provideHttpClient()` equivalent                         |
| --------------------------------------- | -------------------------------------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi(), withXhr())` |
| `HttpClientJsonpModule`                 | `withJsonpSupport()`                                     |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)`                             |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()`                                 |

<docs-callout important title="Ten cuidado al usar HttpClientModule en múltiples inyectores">
Cuando `HttpClientModule` está presente en múltiples inyectores, el comportamiento de los interceptores está mal definido y depende de las opciones exactas y el orden de providers/imports.

Se recomienda usar `provideHttpClient` para configuraciones con múltiples inyectores, ya que ofrece un comportamiento más estable. Consulta la característica anterior `withRequestsMadeViaParent`.
</docs-callout>
