# Configurando `HttpClient`

Antes de poder usar `HttpClient` en tu aplicación, debes configurarlo usando [inyección de dependencias](guide/di).

## Proporcionando `HttpClient` a través de inyección de dependencias

`HttpClient` se proporciona usando la función auxiliar `provideHttpClient`, que la mayoría de aplicaciones incluyen en los `providers` de la aplicación en `app.config.ts`.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ]
};
```

Si tu aplicación usa el método de inicialización basado en NgModule, puedes incluir `provideHttpClient` en los providers del NgModule de tu aplicación:

```ts
@NgModule({
  providers: [
    provideHttpClient(),
  ],
  // ... otra configuración de la aplicación
})
export class AppModule {}
```

Luego puedes inyectar el servicio `HttpClient` como una dependencia de tus componentes, servicios u otras clases:

```ts
@Injectable({providedIn: 'root'})
export class ConfigService {
  private http = inject(HttpClient);
  // Este servicio ahora puede hacer solicitudes HTTP a través de `this.http`.
}
```

## Configurando características `HttpClient`

`provideHttpClient` acepta una lista de configuraciones de características opcionales, para habilitar o configurar el comportamiento de diferentes aspectos del cliente. Esta sección detalla las características opcionales y sus usos.

### `withFetch`

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
    ),
  ]
};
```

Por defecto, `HttpClient` usa la API [`XMLHttpRequest`](https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest) para hacer solicitudes. La característica `withFetch` cambia el cliente para usar la API [`fetch`](https://developer.mozilla.org/es/docs/Web/API/Fetch_API) en su lugar.

`fetch` es una API más moderna y está disponible en algunos entornos donde `XMLHttpRequest` no es compatible. Tiene algunas limitaciones, como no producir eventos de progreso de carga.

### `withInterceptors(...)`

`withInterceptors` configura el conjunto de funciones interceptor que procesarán las solicitudes realizadas a través de `HttpClient`. Consulta la [guía de interceptores](guide/http/interceptors) para más información.

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` incluye el estilo más antiguo de interceptores basados en clases en la configuración de `HttpClient`. Consulta la [guía de interceptores](guide/http/interceptors) para más información.

ÚTIL: Los interceptores funcionales (a través de `withInterceptors`) tienen un orden más predecible y los recomendamos sobre los interceptores basados en DI.

### `withRequestsMadeViaParent()`

Por defecto, cuando configuras `HttpClient` usando `provideHttpClient` dentro de un inyector dado, esta configuración sobrescribe cualquier configuración para `HttpClient` que pueda estar presente en el inyector padre.

Al agregar `withRequestsMadeViaParent()`, `HttpClient` se configura para pasar las solicitudes al `HttpClient` del inyector padre, una vez que han pasado por cualquier interceptor configurado en este nivel. Esto es útil si deseas _añadir_ interceptores en un inyector hijo, pero enviando la solicitud también a través de los interceptores del inyector padre.

CRÍTICO: Debes configurar una instancia de `HttpClient` en un inyector superior al actual, de lo contrario esta opción no será válida y obtendrás un error en tiempo de ejecución.

### `withJsonpSupport()`

Incluir `withJsonpSupport` habilita el método `.jsonp()` en `HttpClient`, que realiza una solicitud GET a través de la [convención JSONP](https://es.wikipedia.org/wiki/JSONP) para la carga de datos entre dominios.

ÚTIL: Siempre que sea posible, prefiere usar [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) para hacer solicitudes entre dominios en lugar de JSONP.

### `withXsrfConfiguration(...)`

Incluir esta opción permite la personalización de la funcionalidad de seguridad XSRF integrada de `HttpClient`. Consulta la [guía de seguridad](best-practices/security) para más información.

### `withNoXsrfProtection()`

Incluir esta opción deshabilita la funcionalidad de seguridad XSRF integrada de `HttpClient`. Consulta la [guía de seguridad](best-practices/security) para más información.

## Configuración basada en `HttpClientModule`

Algunas aplicaciones pueden configurar `HttpClient` usando la API más antigua basada en NgModules.

Esta tabla lista los NgModules disponibles en `@angular/common/http` y cómo se relacionan con las funciones de configuración de proveedores anteriores.

| **NgModule**                            | `provideHttpClient()` equivalent              |
| --------------------------------------- | --------------------------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi())` |
| `HttpClientJsonpModule`                 | `withJsonpSupport()`                          |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)`                  |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()`                      |

<docs-callout important title="Ten cuidado al usar HttpClientModule en múltiples inyectores">
Cuando `HttpClientModule` está presente en múltiples inyectores, el comportamiento de los interceptores está mal definido y depende de las opciones exactas y el orden de providers/imports.

Se recomienda usar `provideHttpClient` para configuraciones con múltiples inyectores, ya que ofrece un comportamiento más estable. Consulta la característica anterior `withRequestsMadeViaParent`.
</docs-callout>
