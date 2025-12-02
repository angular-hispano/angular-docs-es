# Seguridad en `HttpClient`

`HttpClient` incluye soporte integrado para dos mecanismos de seguridad HTTP comunes: protección XSSI y protección XSRF/CSRF.

CONSEJO: También considera adoptar una [Política de Seguridad de Contenido](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy) para tus APIs.

## Protección XSSI

La Inclusión de Scripts Entre Sitios (XSSI) es una forma de ataque de [Scripting Entre Sitios](https://es.wikipedia.org/wiki/Cross-site_scripting) donde un atacante carga datos JSON de tus endpoints de API como `<script>`s en una página que controla. Diferentes técnicas de JavaScript pueden entonces usarse para acceder a estos datos.

Una técnica común para prevenir XSSI es servir respuestas JSON con un "prefijo no ejecutable", comúnmente `)]}',\n`. Este prefijo previene que la respuesta JSON sea interpretada como JavaScript ejecutable válido. Cuando la API se carga como datos, el prefijo puede eliminarse antes del análisis JSON.

`HttpClient` automáticamente elimina este prefijo XSSI (si está presente) al analizar JSON de una respuesta.

## Protección XSRF/CSRF

[Falsificación de Solicitudes Entre Sitios (XSRF o CSRF)](https://es.wikipedia.org/wiki/Cross-site_request_forgery) es una técnica de ataque mediante la cual el atacante puede engañar a un usuario autenticado para que ejecute acciones en tu sitio web sin saberlo.

`HttpClient` soporta un [mecanismo común](https://es.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) usado para prevenir ataques XSRF. Al realizar solicitudes HTTP, un interceptor lee un token de una cookie, por defecto `XSRF-TOKEN`, y lo establece como un encabezado HTTP, `X-XSRF-TOKEN`. Debido a que solo el código que se ejecuta en tu dominio podría leer la cookie, el backend puede estar seguro de que la solicitud HTTP vino de tu aplicación cliente y no de un atacante.

Por defecto, un interceptor envía este encabezado en todas las solicitudes de mutación (como `POST`) a URLs relativas, pero no en solicitudes GET/HEAD o en solicitudes con una URL absoluta.

<docs-callout helpful title="¿Por qué no proteger las solicitudes GET?">
La protección CSRF solo es necesaria para solicitudes que pueden cambiar el estado en el backend. Por su naturaleza, los ataques CSRF cruzan límites de dominio, y la [política de mismo origen](https://developer.mozilla.org/es/docs/Web/Security/Same-origin_policy) de la web impedirá que una página atacante recupere los resultados de solicitudes GET autenticadas.
</docs-callout>

Para aprovechar esto, tu servidor necesita establecer un token en una cookie de sesión legible por JavaScript llamada `XSRF-TOKEN` ya sea en la carga de la página o en la primera solicitud GET. En solicitudes posteriores, el servidor puede verificar que la cookie coincida con el encabezado HTTP `X-XSRF-TOKEN`, y por lo tanto estar seguro de que solo el código que se ejecuta en tu dominio podría haber enviado la solicitud. El token debe ser único para cada usuario y debe ser verificable por el servidor; esto previene que el cliente invente sus propios tokens. Establece el token como un resumen de la cookie de autenticación de tu sitio con una sal para mayor seguridad.

Para prevenir colisiones en entornos donde múltiples aplicaciones Angular comparten el mismo dominio o subdominio, dale a cada aplicación un nombre de cookie único.

<docs-callout important title="HttpClient solo soporta la mitad del cliente del esquema de protección XSRF">
  Tu servicio backend debe estar configurado para establecer la cookie para tu página, y para verificar que el encabezado esté presente en todas las solicitudes elegibles. No hacerlo hace que la protección predeterminada de Angular sea inefectiva.
</docs-callout>

### Configura nombres personalizados de cookie/encabezado

Si tu servicio backend usa nombres diferentes para la cookie o encabezado del token XSRF, usa `withXsrfConfiguration` para sobrescribir los valores predeterminados.

Agrégalo a la llamada de `provideHttpClient` de la siguiente manera:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ]
};
```

### Deshabilitando la protección XSRF 

Si el mecanismo de protección XSRF integrado no funciona para tu aplicación, puedes deshabilitarlo usando la característica `withNoXsrfProtection`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withNoXsrfProtection(),
    ),
  ]
};
```
