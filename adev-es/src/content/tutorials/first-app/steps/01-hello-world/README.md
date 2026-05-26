# Hola mundo

Esta primera lección sirve como punto de partida desde el cual cada lección en este tutorial agrega nuevas funcionalidades para construir una aplicación Angular completa. En esta lección, actualizaremos la aplicación para mostrar el famoso texto "Hello World".

<docs-video src="https://www.youtube.com/embed/UnOwDuliqZA?si=uML-cDRbrxmYdD_9"/>

## ¿Qué aprenderás?

La aplicación actualizada que tendrás después de esta lección confirma que tú y tu IDE están listos para comenzar a crear una aplicación Angular.

NOTA: Si estás trabajando con el editor integrado, salta al [paso cuatro](#crea-un-hello-world).
Cuando trabajas en el playground del navegador, no necesitas `ng serve` para ejecutar la aplicación. Otros comandos como `ng generate` se pueden hacer en la ventana de la consola a tu derecha.

<docs-workflow>

<docs-step title="Descarga la aplicación predeterminada">
Comienza haciendo clic en el ícono "Download" en el panel superior derecho del editor de código. Esto descargará un archivo `.zip` que contiene el código fuente para este tutorial. Ábrelo en tu Terminal e IDE local, luego continúa con las pruebas de la aplicación predeterminada.

En cualquier paso del tutorial, puedes hacer clic en este ícono para descargar el código fuente del paso y comenzar desde allí.
</docs-step>

<docs-step title="Prueba la aplicación predeterminada">
En este paso, después de descargar la aplicación inicial predeterminada, construyes la aplicación Angular predeterminada.
Esto confirma que tu entorno de desarrollo tiene lo que necesitas para continuar el tutorial.

En el panel de **Terminal** de tu IDE:

1. En tu directorio del proyecto, navega al directorio `first-app`.
1. Ejecuta este comando para instalar las dependencias necesarias para ejecutar la aplicación.

   ```shell
   npm install
   ```

1. Ejecuta este comando para construir y servir la aplicación predeterminada.

   ```shell
   ng serve
   ```

   La aplicación debería construirse sin errores.

1. En un navegador web en tu computadora de desarrollo, abre `http://localhost:4200`.
1. Confirma que el sitio web predeterminado aparece en el navegador.
1. Puedes dejar `ng serve` ejecutándose mientras completas los siguientes pasos.
   </docs-step>

<docs-step title="Revisa los archivos del proyecto">
En este paso, conocerás los archivos que componen una aplicación Angular predeterminada.

En el panel **Explorador** de tu IDE:

1. En tu directorio del proyecto, navega al directorio `first-app`.
1. Abre el directorio `src` para ver estos archivos.
   1. En el explorador de archivos, encuentra los archivos de la aplicación Angular (`/src`).
      1. `index.html` es la plantilla HTML de nivel superior de la aplicación.
      1. `styles.css` es la hoja de estilos de nivel superior de la aplicación.
      1. `main.ts` es donde la aplicación comienza a ejecutarse.
      1. `favicon.ico` es el ícono de la aplicación, como encontrarías en cualquier sitio web.
   1. En el explorador de archivos, encuentra los archivos de componentes de la aplicación Angular (`/app`).
      1. `app.ts` es el archivo fuente que describe el componente `app-root`.
         Este es el componente Angular de nivel superior en la aplicación. Un componente es el bloque de construcción básico de una aplicación Angular.
         La descripción del componente incluye el código del componente, la plantilla HTML y los estilos, que pueden describirse en este archivo o en archivos separados.

         En esta aplicación, los estilos están en un archivo separado mientras que el código del componente y la plantilla HTML están en este archivo.

      1. `app.css` es la hoja de estilos para este componente.
      1. Los nuevos componentes se agregan a este directorio.

   1. En el explorador de archivos, encuentra el directorio de imágenes (`/assets`) que contiene las imágenes usadas por la aplicación.
   1. En el explorador de archivos, encuentra los archivos y directorios que una aplicación Angular necesita para construirse y ejecutarse, pero no son archivos con los que normalmente interactúas.
      1. `.angular` tiene archivos necesarios para construir la aplicación Angular.
      1. `.e2e` tiene archivos usados para probar la aplicación.
      1. `.node_modules` tiene los paquetes node.js que la aplicación usa.
      1. `angular.json` describe la aplicación Angular a las herramientas de construcción.
      1. `package.json` es usado por `npm` (el gestor de paquetes de node) para ejecutar la aplicación terminada.
      1. `tsconfig.*` son los archivos que describen la configuración de la aplicación al compilador de TypeScript.

Después de haber revisado los archivos que componen un proyecto de aplicación Angular, continúa al siguiente paso.
</docs-step>

<docs-step title="Crea un `Hello World`">
En este paso, actualizas los archivos del proyecto Angular para cambiar el contenido mostrado.

En tu IDE:

1. Abre `first-app/src/index.html`.
   NOTA: ¡Este paso y el siguiente son solo para tu entorno local!

1. En `index.html`, reemplaza el elemento `<title>` con este código para actualizar el título de la aplicación.

   <docs-code header="Reemplazar en src/index.html" path="adev/src/content/tutorials/first-app/steps/02-Home/src/index.html" visibleLines="[5]"/>

   Luego, guarda los cambios que acabas de hacer en `index.html`.

1. A continuación, abre `first-app/src/app/app.ts`.
1. En `app.ts`, en la definición de `@Component`, reemplaza la línea `template` con este código para cambiar el texto en el componente de la aplicación.

   <docs-code language="angular-ts" header="Reemplazar en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[6,8]"/>

1. En `app.ts`, en la definición de la clase `App`, reemplaza la línea `title` con este código para cambiar el título del componente.

   <docs-code header="Reemplazar en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[11,13]"/>

   Luego, guarda los cambios que hiciste en `app.ts`.

1. Si detuviste el comando `ng serve` del paso 1, en la ventana de **Terminal** de tu IDE, ejecuta `ng serve` nuevamente.
1. Abre tu navegador y navega a `localhost:4200` y confirma que la aplicación se construye sin errores y muestra _Homes_ en el título y _Hello world_ en el cuerpo de tu aplicación:
   <img alt="marco del navegador mostrando el texto 'Hello World'" src="assets/images/tutorials/first-app/homes-app-lesson-01-browser.png">
   </docs-step>

</docs-workflow>

RESUMEN: En esta lección, actualizaste una aplicación Angular predeterminada para mostrar _Hello world_.
En el proceso, aprendiste sobre el comando `ng serve` para servir tu aplicación localmente para pruebas.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/components" title="Componentes de Angular"/>
  <docs-pill href="tools/cli" title="Creando aplicaciones con el CLI de Angular"/>
</docs-pill-row>
