# Despliegue

Cuando estés listo para desplegar tu aplicación Angular a un servidor remoto, tienes varias opciones.

## Despliegue automático con el CLI

El comando `ng deploy` del Angular CLI ejecuta el [CLI builder](tools/cli/cli-builder) `deploy` asociado con tu proyecto.
Varios builders de terceros implementan capacidades de despliegue a diferentes plataformas.
Puedes agregar cualquiera de ellos a tu proyecto con `ng add`.

Cuando agregas un paquete con capacidad de despliegue, actualizará automáticamente tu configuración de workspace (archivo `angular.json`) con una sección `deploy` para el proyecto seleccionado.
Luego puedes usar el comando `ng deploy` para desplegar ese proyecto.

Por ejemplo, el siguiente comando despliega automáticamente un proyecto a [Firebase](https://firebase.google.com/).

<docs-code language="shell">

ng add @angular/fire
ng deploy

</docs-code>

El comando es interactivo.
En este caso, debes tener o crear una cuenta de Firebase y autenticarte usándola.
El comando te pide que selecciones un proyecto Firebase para el despliegue antes de construir tu aplicación y subir los recursos de producción a Firebase.

La tabla a continuación lista herramientas que implementan funcionalidad de despliegue a diferentes plataformas.
El comando `deploy` para cada paquete puede requerir diferentes opciones de línea de comandos.
Puedes leer más siguiendo los enlaces asociados con los nombres de paquetes a continuación:

| Despliegue a                                                     | Comando de Configuración                                                                              |
|:---                                                               |:---                                                                                  |
| [Firebase hosting](https://firebase.google.com/docs/hosting)      | [`ng add @angular/fire`](https://npmjs.org/package/@angular/fire)                           |
| [Vercel](https://vercel.com/solutions/angular)                    | [`vercel init angular`](https://github.com/vercel/vercel/tree/main/examples/angular) |
| [Netlify](https://www.netlify.com)                                | [`ng add @netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy)       |
| [GitHub pages](https://pages.github.com)                          | [`ng add angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages)               |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`ng add @jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

Si estás desplegando a un servidor autogestionado o no hay un builder para tu plataforma en la nube favorita, puedes [crear un builder](tools/cli/cli-builder) que te permita usar el comando `ng deploy`, o leer esta guía para aprender cómo desplegar manualmente tu aplicación.

## Despliegue manual a un servidor remoto

Para desplegar manualmente tu aplicación, crea una construcción de producción y copia el directorio de salida a un servidor web o red de entrega de contenido (CDN).
Por defecto, `ng build` usa la configuración `production`.
Si has personalizado tus configuraciones de construcción, es posible que quieras confirmar que se están aplicando las [optimizaciones de producción](tools/cli/deployment#production-optimizations) antes de desplegar.

`ng build` genera los artefactos construidos en `dist/my-app/` por defecto, sin embargo esta ruta puede configurarse con la opción `outputPath` en el builder `@angular-devkit/build-angular:browser`.
Copia este directorio al servidor y configúralo para servir el directorio.

Aunque esta es una solución de despliegue mínima, hay algunos requisitos para que el servidor sirva tu aplicación Angular correctamente.

## Configuración del servidor

Esta sección cubre los cambios que puedes necesitar configurar en el servidor para ejecutar tu aplicación Angular.

### Las aplicaciones enrutadas deben volver a `index.html`

Las aplicaciones Angular renderizadas del lado del cliente son candidatas perfectas para servir con un servidor HTML estático porque todo el contenido es estático y generado en tiempo de construcción.

Si la aplicación usa el router de Angular, debes configurar el servidor para que devuelva la página host de la aplicación (`index.html`) cuando se le pide un archivo que no tiene.

Una aplicación enrutada debería soportar "deep links".
Un *deep link* es una URL que especifica una ruta a un componente dentro de la aplicación.
Por ejemplo, `http://my-app.test/users/42` es un *deep link* a la página de detalle del usuario que muestra el usuario con `id` 42.

No hay problema cuando el usuario inicialmente carga la página índice y luego navega a esa URL desde dentro de un cliente en ejecución.
El router de Angular realiza la navegación *del lado del cliente* y no solicita una nueva página HTML.

Pero hacer clic en un deep link en un correo electrónico, ingresarlo en la barra de direcciones del navegador, o incluso refrescar el navegador mientras ya estás en la página del deep link será manejado por el navegador mismo, *fuera* de la aplicación en ejecución.
El navegador hace una petición directa al servidor por `/users/42`, evitando el router de Angular.

Un servidor estático rutinariamente devuelve `index.html` cuando recibe una petición para `http://my-app.test/`.
Pero la mayoría de los servidores por defecto rechazarán `http://my-app.test/users/42` y devolverán un error `404 - Not Found` *a menos que* esté configurado para devolver `index.html` en su lugar.
Configura la ruta de respaldo o la página 404 a `index.html` para tu servidor, para que Angular se sirva para deep links y pueda mostrar la ruta correcta.
Algunos servidores llaman a este comportamiento de respaldo modo "Single-Page Application" (SPA).

Una vez que el navegador carga la aplicación, el router de Angular leerá la URL para determinar en qué página está y mostrará `/users/42` correctamente.

Para páginas 404 "reales" como `http://my-app.test/does-not-exist`, el servidor no requiere ninguna configuración adicional.
Las [páginas 404 implementadas en el router de Angular](guide/routing/common-router-tasks#displaying-a-404-page) se mostrarán correctamente.

### Solicitar datos de un servidor diferente (CORS)

Los desarrolladores web pueden encontrar un error de [*intercambio de recursos de origen cruzado*](https://developer.mozilla.org/docs/Web/HTTP/CORS "Cross-origin resource sharing") al hacer una petición de red a un servidor diferente al servidor host propio de la aplicación.
Los navegadores prohíben tales peticiones a menos que el servidor las permita explícitamente.

No hay nada que Angular o la aplicación cliente puedan hacer sobre estos errores.
El _servidor_ debe configurarse para aceptar las peticiones de la aplicación.
Lee sobre cómo habilitar CORS para servidores específicos en [enable-cors.org](https://enable-cors.org/server.html "Enabling CORS server").

## Optimizaciones de producción

`ng build` usa la configuración `production` a menos que se configure de otra manera. Esta configuración habilita las siguientes características de optimización de construcción.

| Características                                                           | Detalles                                                                                       |
|:---                                                                |:---                                                                                           |
| [Compilación Ahead-of-Time (AOT)](tools/cli/aot-compiler)          | Precompila las plantillas de componentes Angular.                                                     |
| [Modo de producción](tools/cli/deployment#development-only-features) | Optimiza la aplicación para el mejor rendimiento en tiempo de ejecución                                    |
| Bundling                                                           | Concatena tus muchos archivos de aplicación y librería en un número mínimo de archivos desplegados. |
| Minificación                                                       | Elimina espacios en blanco excesivos, comentarios y tokens opcionales.                                     |
| Mangling                                                           | Renombra funciones, clases y variables para usar identificadores más cortos y arbitrarios.              |
| Eliminación de código muerto                                              | Elimina módulos no referenciados y código no usado.                                                 |

Consulta [`ng build`](cli/build) para más sobre las opciones de construcción del CLI y sus efectos.

### Características solo de desarrollo

Cuando ejecutas una aplicación localmente usando `ng serve`, Angular usa la configuración de desarrollo
en tiempo de ejecución que habilita:

* Verificaciones de seguridad adicionales como la detección de [`expression-changed-after-checked`](errors/NG0100).
* Mensajes de error más detallados.
* Utilidades de depuración adicionales como la variable global `ng` con [funciones de depuración](api#core-global) y soporte de [Angular DevTools](tools/devtools).

Estas características son útiles durante el desarrollo, pero requieren código extra en la aplicación, lo cual es
indeseable en producción. Para asegurar que estas características no impacten negativamente el tamaño del bundle para los usuarios finales, Angular CLI
elimina el código solo de desarrollo del bundle al construir para producción.

Construir tu aplicación con `ng build` por defecto usa la configuración `production` que elimina estas características de la salida para un tamaño de bundle óptimo.

## `--deploy-url`

`--deploy-url` es una opción de línea de comandos usada para especificar la ruta base para resolver URLs relativas para recursos como imágenes, scripts y hojas de estilo en tiempo de *compilación*.

<docs-code language="shell">

ng build --deploy-url /my/assets

</docs-code>

El efecto y propósito de `--deploy-url` se superpone con [`<base href>`](guide/routing/common-router-tasks). Ambos pueden usarse para scripts iniciales, hojas de estilo, scripts lazy y recursos css.

A diferencia de `<base href>` que puede definirse en un solo lugar en tiempo de ejecución, el `--deploy-url` necesita estar codificado en una aplicación en tiempo de construcción.
Prefiere `<base href>` donde sea posible.
