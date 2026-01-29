# Seguridad

Este tema describe las protecciones integradas de Angular contra vulnerabilidades y ataques comunes de aplicaciones web, como los ataques de cross-site scripting.
No cubre la seguridad a nivel de aplicación, como autenticación y autorización.

Para más información sobre los ataques y mitigaciones descritas a continuación, consulta la [Guía del Open Web Application Security Project (OWASP)](https://www.owasp.org/index.php/Category:OWASP_Guide_Project).

<a id="report-issues"></a>

<docs-callout title="Reportar vulnerabilidades">

Angular es parte del [Programa de Recompensas por Vulnerabilidades de Software de Código Abierto](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules) de Google. Para vulnerabilidades en Angular, por favor envía tu reporte en [https://bughunters.google.com](https://bughunters.google.com/report).

Para más información sobre cómo Google maneja los problemas de seguridad, consulta la [filosofía de seguridad de Google](https://www.google.com/about/appsecurity).

</docs-callout>

## Mejores prácticas

Estas son algunas mejores prácticas para asegurar que tu aplicación Angular sea segura.

1. **Mantente actualizado con las últimas versiones de las bibliotecas de Angular** - Las bibliotecas de Angular reciben actualizaciones regulares, y estas actualizaciones pueden corregir defectos de seguridad descubiertos en versiones anteriores. Revisa el [registro de cambios](https://github.com/angular/angular/blob/main/CHANGELOG.md) de Angular para actualizaciones relacionadas con seguridad.
2. **No alteres tu copia de Angular** - Las versiones privadas y personalizadas de Angular tienden a quedarse atrás de la versión actual y podrían no incluir correcciones de seguridad importantes y mejoras. En su lugar, comparte tus mejoras de Angular con la comunidad y haz un pull request.
3. **Evita las APIs de Angular marcadas en la documentación como "_Riesgo de Seguridad_"** - Para más información, consulta la sección [Confiar en valores seguros](#confiar-en-valores-seguros) de esta página.

## Prevenir cross-site scripting (XSS)

[Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) permite a los atacantes inyectar código malicioso en páginas web.
Dicho código puede, por ejemplo, robar datos de usuario y credenciales de inicio de sesión, o realizar acciones que suplantan al usuario.
Este es uno de los ataques más comunes en la web.

Para bloquear ataques XSS, debes evitar que código malicioso entre en el Document Object Model (DOM).
Por ejemplo, si los atacantes pueden engañarte para insertar una etiqueta `<script>` en el DOM, pueden ejecutar código arbitrario en tu sitio web.
El ataque no está limitado a etiquetas `<script>` —muchos elementos y propiedades en el DOM permiten la ejecución de código, por ejemplo, `<img alt="" onerror="...">` y `<a href="javascript:...">`.
Si datos controlados por atacantes entran al DOM, espera vulnerabilidades de seguridad.

### Modelo de seguridad de Angular contra cross-site scripting

Para bloquear sistemáticamente bugs de XSS, Angular trata todos los valores como no confiables por defecto.
Cuando un valor se inserta en el DOM desde un enlace de plantilla o interpolación, Angular sanitiza y escapa los valores no confiables.
Si un valor ya fue sanitizado fuera de Angular y se considera seguro, comunícalo a Angular marcando el [valor como confiable](#confiar-en-valores-seguros).

A diferencia de los valores usados para renderizar, las plantillas de Angular se consideran confiables por defecto y deben tratarse como código ejecutable.
Nunca crees plantillas concatenando entrada de usuario y sintaxis de plantilla.
Hacer esto permitiría a los atacantes [inyectar código arbitrario](https://en.wikipedia.org/wiki/Code_injection) en tu aplicación.
Para prevenir estas vulnerabilidades, siempre usa el [compilador de plantillas Ahead-Of-Time (AOT)](#usar-el-compilador-de-plantillas-aot) por defecto en despliegues de producción.

Se puede proporcionar una capa extra de protección mediante el uso de Content Security Policy y Trusted Types.
Estas características de la plataforma web operan a nivel del DOM, que es el lugar más efectivo para prevenir problemas de XSS. Aquí no pueden ser evadidas usando otras APIs de nivel inferior.
Por esta razón, se recomienda encarecidamente aprovechar estas características. Para hacerlo, configura la [política de seguridad de contenido](#política-de-seguridad-de-contenido) para la aplicación y habilita la [aplicación de trusted types](#aplicar-trusted-types).

### Sanitización y contextos de seguridad

_Sanitización_ es la inspección de un valor no confiable, convirtiéndolo en un valor que es seguro insertar en el DOM.
En muchos casos, la sanitización no cambia el valor en absoluto.
La sanitización depende del contexto.
Por ejemplo, un valor que es inofensivo en CSS es potencialmente peligroso en una URL.

Angular define los siguientes contextos de seguridad:

| Contextos de seguridad | Detalles                                                                              |
| :--------------------- | :------------------------------------------------------------------------------------ |
| HTML                   | Usado cuando se interpreta un valor como HTML, por ejemplo, al enlazar a `innerHtml`. |
| Style                  | Usado cuando se enlaza CSS a la propiedad `style`.                                    |
| URL                    | Usado para propiedades de URL, como `<a href>`.                                       |
| Resource URL           | Una URL que se carga y ejecuta como código, por ejemplo, en `<script src>`.           |

Angular sanitiza valores no confiables para HTML y URLs. Sanitizar URLs de recursos no es posible porque contienen código arbitrario.
En modo de desarrollo, Angular imprime una advertencia en la consola cuando tiene que cambiar un valor durante la sanitización.

### Ejemplo de sanitización

La siguiente plantilla enlaza el valor de `htmlSnippet`. Una vez interpolándolo en el contenido de un elemento, y otra vez enlazándolo a la propiedad `innerHTML` de un elemento:

<docs-code header="inner-html-binding.component.html" path="adev/src/content/examples/security/src/app/inner-html-binding.component.html"/>

El contenido interpolado siempre se escapa —el HTML no se interpreta y el navegador muestra los corchetes angulares en el contenido de texto del elemento.

Para que el HTML sea interpretado, enlázalo a una propiedad HTML como `innerHTML`.
Ten en cuenta que enlazar un valor que un atacante podría controlar a `innerHTML` normalmente causa una vulnerabilidad XSS.
Por ejemplo, uno podría ejecutar JavaScript de la siguiente manera:

<docs-code header="inner-html-binding.component.ts (class)" path="adev/src/content/examples/security/src/app/inner-html-binding.component.ts" visibleRegion="class"/>

Angular reconoce el valor como inseguro y automáticamente lo sanitiza, lo que elimina el elemento `script` pero mantiene contenido seguro como el elemento `<b>`.

<img alt="Una captura de pantalla mostrando valores HTML interpolados y enlazados" src="assets/images/guide/security/binding-inner-html.png#small">

### Uso directo de las APIs del DOM y llamadas explícitas de sanitización

A menos que apliques Trusted Types, las APIs del DOM integradas del navegador no te protegen automáticamente de vulnerabilidades de seguridad.
Por ejemplo, `document`, el nodo disponible a través de `ElementRef`, y muchas APIs de terceros contienen métodos inseguros.
De igual manera, si interactúas con otras bibliotecas que manipulan el DOM, probablemente no tendrás la misma sanitización automática que con las interpolaciones de Angular.
Evita interactuar directamente con el DOM y en su lugar usa plantillas de Angular donde sea posible.

Para casos donde esto es inevitable, usa las funciones de sanitización integradas de Angular.
Sanitiza valores no confiables con el método [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) y el `SecurityContext` apropiado.
Esa función también acepta valores que fueron marcados como confiables usando las funciones `bypassSecurityTrust`, y no los sanitiza, como se [describe a continuación](#confiar-en-valores-seguros).

### Confiar en valores seguros

A veces las aplicaciones genuinamente necesitan incluir código ejecutable, mostrar un `<iframe>` desde alguna URL, o construir URLs potencialmente peligrosas.
Para prevenir la sanitización automática en estas situaciones, dile a Angular que inspeccionaste un valor, verificaste cómo fue creado, y te aseguraste de que es seguro.
_Ten cuidado_.
Si confías en un valor que podría ser malicioso, estás introduciendo una vulnerabilidad de seguridad en tu aplicación.
Si tienes dudas, busca un revisor de seguridad profesional.

Para marcar un valor como confiable, inyecta `DomSanitizer` y llama uno de los siguientes métodos:

- `bypassSecurityTrustHtml`
- `bypassSecurityTrustScript`
- `bypassSecurityTrustStyle`
- `bypassSecurityTrustUrl`
- `bypassSecurityTrustResourceUrl`

Recuerda, si un valor es seguro depende del contexto, así que elige el contexto correcto para el uso previsto del valor.
Imagina que la siguiente plantilla necesita enlazar una URL a una llamada `javascript:alert(...)`:

<docs-code header="bypass-security.component.html (URL)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" visibleRegion="URL"/>

Normalmente, Angular sanitiza automáticamente la URL, deshabilita el código peligroso, y en modo de desarrollo, registra esta acción en la consola.
Para prevenir esto, marca el valor de la URL como una URL confiable usando la llamada `bypassSecurityTrustUrl`:

<docs-code header="bypass-security.component.ts (trust-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" visibleRegion="trust-url"/>

<img alt="Una captura de pantalla mostrando un cuadro de alerta creado desde una URL confiable" src="assets/images/guide/security/bypass-security-component.png#medium">

Si necesitas convertir entrada de usuario en un valor confiable, usa un método del componente.
La siguiente plantilla permite a los usuarios ingresar un ID de video de YouTube y cargar el video correspondiente en un `<iframe>`.
El atributo `<iframe src>` es un contexto de seguridad de URL de recurso, porque una fuente no confiable puede, por ejemplo, infiltrar descargas de archivos que usuarios desprevenidos podrían ejecutar.
Para prevenir esto, llama un método en el componente para construir una URL de video confiable, lo que hace que Angular permita el enlace a `<iframe src>`:

<docs-code header="bypass-security.component.html (iframe)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" visibleRegion="iframe"/>

<docs-code header="bypass-security.component.ts (trust-video-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" visibleRegion="trust-video-url"/>

### Política de seguridad de contenido

Content Security Policy \(CSP\) es una técnica de defensa en profundidad para prevenir XSS.
Para habilitar CSP, configura tu servidor web para devolver un encabezado HTTP `Content-Security-Policy` apropiado.
Lee más sobre la política de seguridad de contenido en la [guía de Web Fundamentals](https://developers.google.com/web/fundamentals/security/csp) en el sitio web de Google Developers.

La política mínima requerida para una aplicación Angular nueva es:

```txt
default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';
```

Al servir tu aplicación Angular, el servidor debe incluir un nonce generado aleatoriamente en el encabezado HTTP para cada petición.
Debes proporcionar este nonce a Angular para que el framework pueda renderizar elementos `<style>`.
Puedes establecer el nonce para Angular de una de estas maneras:

1. Establece la opción `autoCsp` a `true` en la [configuración del espacio de trabajo](reference/configs/workspace-config#extra-build-and-test-options).
1. Establece el atributo `ngCspNonce` en el elemento raíz de la aplicación como `<app ngCspNonce="randomNonceGoesHere"></app>`. Usa este enfoque si tienes acceso a plantillas del lado del servidor que pueden agregar el nonce tanto al encabezado como al `index.html` al construir la respuesta.
1. Proporciona el nonce usando el token de inyección `CSP_NONCE`. Usa este enfoque si tienes acceso al nonce en tiempo de ejecución y quieres poder cachear el `index.html`.

```ts
import { bootstrapApplication, CSP_NONCE } from "@angular/core";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: CSP_NONCE,
      useValue: globalThis.myRandomNonceValue,
    },
  ],
});
```

<docs-callout title="Nonces únicos">

Siempre asegúrate de que los nonces que proporcionas sean <strong>únicos por petición</strong> y que no sean predecibles o adivinables.
Si un atacante puede predecir futuros nonces, puede evadir las protecciones ofrecidas por CSP.

</docs-callout>

NOTA: Si quieres [incluir el CSS crítico en línea](/tools/cli/build#critical-css-inlining) de tu aplicación, no puedes usar el token `CSP_NONCE`, y deberías preferir la opción `autoCsp` o establecer el atributo `ngCspNonce` en el elemento raíz de la aplicación.

Si no puedes generar nonces en tu proyecto, puedes permitir estilos en línea agregando `'unsafe-inline'` a la sección `style-src` del encabezado CSP.

| Secciones                                        | Detalles                                                                                                                                                                                                         |
| :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self';`                            | Permite que la página cargue todos sus recursos requeridos desde el mismo origen.                                                                                                                                |
| `style-src 'self' 'nonce-randomNonceGoesHere';`  | Permite que la página cargue estilos globales desde el mismo origen \(`'self'`\) y estilos insertados por Angular con el `nonce-randomNonceGoesHere`.                                                            |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | Permite que la página cargue JavaScript desde el mismo origen \(`'self'`\) y scripts insertados por Angular CLI con el `nonce-randomNonceGoesHere`. Esto solo es requerido si estás usando CSS crítico en línea. |

Angular en sí solo requiere estas configuraciones para funcionar correctamente.
A medida que tu proyecto crece, puede que necesites expandir tu configuración CSP para acomodar características extra específicas de tu aplicación.

### Aplicar Trusted Types

Se recomienda que uses [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) como una forma de ayudar a asegurar tus aplicaciones contra ataques de cross-site scripting.
Trusted Types es una característica de la [plataforma web](https://en.wikipedia.org/wiki/Web_platform) que puede ayudarte a prevenir ataques de cross-site scripting aplicando prácticas de codificación más seguras.
Trusted Types también puede ayudar a simplificar la auditoría del código de la aplicación.

<docs-callout title="Trusted Types">

Trusted Types podría no estar disponible aún en todos los navegadores que tu aplicación apunta.
En el caso de que tu aplicación habilitada con Trusted Types se ejecute en un navegador que no soporta Trusted Types, las características de la aplicación se preservan. Tu aplicación está protegida contra XSS mediante el DomSanitizer de Angular.
Consulta [caniuse.com/trusted-types](https://caniuse.com/trusted-types) para el soporte actual de navegadores.

</docs-callout>

Para aplicar Trusted Types en tu aplicación, debes configurar el servidor web de tu aplicación para emitir encabezados HTTP con una de las siguientes políticas de Angular:

| Políticas                | Detalle                                                                                                                                                                                                                                                                                                |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angular`                | Esta política se usa en código revisado de seguridad que es interno de Angular, y es requerida para que Angular funcione cuando Trusted Types está aplicado. Cualquier valor de plantilla en línea o contenido sanitizado por Angular es tratado como seguro por esta política.                        |
| `angular#bundler`        | Esta política es usada por el bundler de Angular CLI al crear archivos de chunks lazy.                                                                                                                                                                                                                 |
| `angular#unsafe-bypass`  | Esta política se usa para aplicaciones que usan cualquiera de los métodos en [DomSanitizer](api/platform-browser/DomSanitizer) de Angular que evaden la seguridad, como `bypassSecurityTrustHtml`. Cualquier aplicación que use estos métodos debe habilitar esta política.                            |
| `angular#unsafe-jit`     | Esta política es usada por el [compilador Just-In-Time (JIT)](api/core/Compiler). Debes habilitar esta política si tu aplicación interactúa directamente con el compilador JIT o está ejecutándose en modo JIT usando [platform browser dynamic](api/platform-browser-dynamic/platformBrowserDynamic). |
| `angular#unsafe-upgrade` | Esta política es usada por el paquete [@angular/upgrade](api/upgrade/static/UpgradeModule). Debes habilitar esta política si tu aplicación es un híbrido de AngularJS.                                                                                                                                 |

Debes configurar los encabezados HTTP para Trusted Types en las siguientes ubicaciones:

- Infraestructura de servicio de producción
- Angular CLI \(`ng serve`\), usando la propiedad `headers` en el archivo `angular.json`, para desarrollo local y pruebas de extremo a extremo
- Karma \(`ng test`\), usando la propiedad `customHeaders` en el archivo `karma.config.js`, para pruebas unitarias

El siguiente es un ejemplo de un encabezado específicamente configurado para Trusted Types y Angular:

```html
Content-Security-Policy: trusted-types angular; require-trusted-types-for
'script';
```

Un ejemplo de un encabezado específicamente configurado para Trusted Types y aplicaciones Angular que usan cualquiera de los métodos de Angular en [DomSanitizer](api/platform-browser/DomSanitizer) que evaden la seguridad:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-bypass;
require-trusted-types-for 'script';
```

El siguiente es un ejemplo de un encabezado específicamente configurado para Trusted Types y aplicaciones Angular usando JIT:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-jit;
require-trusted-types-for 'script';
```

El siguiente es un ejemplo de un encabezado específicamente configurado para Trusted Types y aplicaciones Angular que usan lazy loading de módulos:

```html
Content-Security-Policy: trusted-types angular angular#bundler;
require-trusted-types-for 'script';
```

<docs-callout title="Contribuciones de la comunidad">

Para aprender más sobre la solución de problemas de configuraciones de Trusted Types, el siguiente recurso podría ser útil:

[Prevenir vulnerabilidades de cross-site scripting basadas en DOM con Trusted Types](https://web.dev/trusted-types/#how-to-use-trusted-types)

</docs-callout>

### Usar el compilador de plantillas AOT

El compilador de plantillas AOT previene toda una clase de vulnerabilidades llamada inyección de plantillas, y mejora enormemente el rendimiento de la aplicación.
El compilador de plantillas AOT es el compilador por defecto usado por las aplicaciones de Angular CLI, y deberías usarlo en todos los despliegues de producción.

Una alternativa al compilador AOT es el compilador JIT que compila plantillas a código de plantilla ejecutable dentro del navegador en tiempo de ejecución.
Angular confía en el código de plantilla, así que generar dinámicamente plantillas y compilarlas, en particular plantillas que contienen datos de usuario, evade las protecciones integradas de Angular. Este es un anti-patrón de seguridad.
Para información sobre cómo construir formularios dinámicamente de forma segura, consulta la guía de [Formularios Dinámicos](guide/forms/dynamic-forms).

### Protección XSS del lado del servidor

El HTML construido en el servidor es vulnerable a ataques de inyección.
Inyectar código de plantilla en una aplicación Angular es lo mismo que inyectar código ejecutable en la aplicación:
Le da al atacante control total sobre la aplicación.
Para prevenir esto, usa un lenguaje de plantillas que automáticamente escape valores para prevenir vulnerabilidades XSS en el servidor.
No crees plantillas de Angular en el lado del servidor usando un lenguaje de plantillas. Esto conlleva un alto riesgo de introducir vulnerabilidades de inyección de plantillas.

## Vulnerabilidades a nivel HTTP

Angular tiene soporte integrado para ayudar a prevenir dos vulnerabilidades HTTP comunes, cross-site request forgery \(CSRF o XSRF\) y cross-site script inclusion \(XSSI\).
Ambas deben ser mitigadas principalmente en el lado del servidor, pero Angular proporciona helpers para hacer la integración en el lado del cliente más fácil.

### Cross-site request forgery

En un cross-site request forgery \(CSRF o XSRF\), un atacante engaña al usuario para que visite una página web diferente \(como `evil.com`\) con código malicioso. Esta página web secretamente envía una petición maliciosa al servidor web de la aplicación \(como `example-bank.com`\).

Asume que el usuario está conectado a la aplicación en `example-bank.com`.
El usuario abre un correo electrónico y hace clic en un enlace a `evil.com`, que se abre en una nueva pestaña.

La página `evil.com` inmediatamente envía una petición maliciosa a `example-bank.com`.
Quizás es una petición para transferir dinero de la cuenta del usuario a la cuenta del atacante.
El navegador automáticamente envía las cookies de `example-bank.com`, incluyendo la cookie de autenticación, con esta petición.

Si el servidor de `example-bank.com` carece de protección XSRF, no puede distinguir entre una petición legítima de la aplicación y la petición falsificada de `evil.com`.

Para prevenir esto, la aplicación debe asegurar que una petición de usuario se origina desde la aplicación real, no desde un sitio diferente.
El servidor y el cliente deben cooperar para frustrar este ataque.

En una técnica anti-XSRF común, el servidor de la aplicación envía un token de autenticación creado aleatoriamente en una cookie.
El código del cliente lee la cookie y agrega un encabezado de petición personalizado con el token en todas las peticiones siguientes.
El servidor compara el valor de la cookie recibida con el valor del encabezado de la petición y rechaza la petición si los valores faltan o no coinciden.

Esta técnica es efectiva porque todos los navegadores implementan la _política del mismo origen_.
Solo el código del sitio web en el que se establecen las cookies puede leer las cookies de ese sitio y establecer encabezados personalizados en las peticiones a ese sitio.
Eso significa que solo tu aplicación puede leer este token de cookie y establecer el encabezado personalizado.
El código malicioso en `evil.com` no puede.

### Seguridad XSRF/CSRF de `HttpClient`

`HttpClient` soporta un [mecanismo común](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) usado para prevenir ataques XSRF. Al realizar peticiones HTTP, un interceptor lee un token de una cookie, por defecto `XSRF-TOKEN`, y lo establece como un encabezado HTTP, `X-XSRF-TOKEN`. Debido a que solo el código que se ejecuta en tu dominio podría leer la cookie, el backend puede estar seguro de que la petición HTTP vino de tu aplicación cliente y no de un atacante.

Por defecto, un interceptor envía este encabezado en todas las peticiones mutantes (como `POST`) a URLs relativas, pero no en peticiones GET/HEAD o en peticiones con una URL absoluta.

<docs-callout helpful title="¿Por qué no proteger las peticiones GET?">
La protección CSRF solo es necesaria para peticiones que pueden cambiar el estado en el backend. Por su naturaleza, los ataques CSRF cruzan límites de dominio, y la [política del mismo origen](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) de la web evitará que una página atacante recupere los resultados de peticiones GET autenticadas.
</docs-callout>

Para aprovechar esto, tu servidor necesita establecer un token en una cookie de sesión legible por JavaScript llamada `XSRF-TOKEN` ya sea en la carga de la página o en la primera petición GET. En peticiones subsecuentes el servidor puede verificar que la cookie coincide con el encabezado HTTP `X-XSRF-TOKEN`, y por lo tanto estar seguro de que solo código ejecutándose en tu dominio podría haber enviado la petición. El token debe ser único para cada usuario y debe ser verificable por el servidor; esto evita que el cliente fabrique sus propios tokens. Establece el token como un digest de la cookie de autenticación de tu sitio con un salt para seguridad adicional.

Para prevenir colisiones en entornos donde múltiples aplicaciones Angular comparten el mismo dominio o subdominio, da a cada aplicación un nombre de cookie único.

<docs-callout important title="HttpClient solo soporta la mitad del cliente del esquema de protección XSRF">
  Tu servicio backend debe estar configurado para establecer la cookie para tu página, y para verificar que el encabezado esté presente en todas las peticiones elegibles. No hacerlo hace que la protección por defecto de Angular sea inefectiva.
</docs-callout>

### Configurar nombres personalizados de cookie/header

Si tu servicio backend usa nombres diferentes para la cookie o el encabezado del token XSRF, usa `withXsrfConfiguration` para sobrescribir los valores por defecto.

Agrégalo a la llamada `provideHttpClient` de la siguiente manera:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: "CUSTOM_XSRF_TOKEN",
        headerName: "X-Custom-Xsrf-Header",
      }),
    ),
  ],
};
```

### Deshabilitar la protección XSRF

Si el mecanismo de protección XSRF integrado no funciona para tu aplicación, puedes deshabilitarlo usando la característica `withNoXsrfProtection`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```

Para información sobre CSRF en el Open Web Application Security Project \(OWASP\), consulta [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) y [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
El documento de la Universidad de Stanford [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) es una fuente rica en detalles.

Consulta también la [charla de Dave Smith sobre XSRF en AngularConnect 2016](https://www.youtube.com/watch?v=9inczw6qtpY "Cross Site Request Funkery Securing Your Angular Apps From Evil Doers").

### Cross-site script inclusion (XSSI)

Cross-site script inclusion, también conocido como vulnerabilidad JSON, puede permitir que el sitio web de un atacante lea datos de una API JSON.
El ataque funciona en navegadores más antiguos sobrescribiendo constructores de objetos JavaScript integrados, y luego incluyendo una URL de API usando una etiqueta `<script>`.

Este ataque solo es exitoso si el JSON devuelto es ejecutable como JavaScript.
Los servidores pueden prevenir un ataque prefijando todas las respuestas JSON para hacerlas no ejecutables, por convención, usando la cadena bien conocida `")]}',\n"`.

La biblioteca `HttpClient` de Angular reconoce esta convención y automáticamente elimina la cadena `")]}',\n"` de todas las respuestas antes de continuar con el parseo.

Para más información, consulta la sección XSSI de esta [publicación del blog de seguridad web de Google](https://security.googleblog.com/2011/05/website-security-for-webmasters.html).

## Auditar aplicaciones Angular

Las aplicaciones Angular deben seguir los mismos principios de seguridad que las aplicaciones web regulares, y deben ser auditadas como tales.
Las APIs específicas de Angular que deberían ser auditadas en una revisión de seguridad, como los métodos [_bypassSecurityTrust_](#confiar-en-valores-seguros), están marcadas en la documentación como sensibles a la seguridad.
