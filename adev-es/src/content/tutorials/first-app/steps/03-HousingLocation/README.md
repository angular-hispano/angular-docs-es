# Crear el componente HousingLocation de la aplicación

Esta lección del tutorial demuestra cómo agregar el componente `HousingLocation` a tu aplicación Angular.

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=U4ONEbPvtptdUHTt&amp;start=440"/>

## ¿Qué aprenderás?

- Tu aplicación tiene un nuevo componente: `HousingLocation` y muestra un mensaje que confirma que el componente fue agregado a tu aplicación.

<docs-workflow>

<docs-step title="Crea el `HousingLocation`">
En este paso, creas un nuevo componente para tu aplicación.

En el panel de **Terminal** de tu IDE:

1. En tu directorio del proyecto, navega al directorio `first-app`.

1. Ejecuta este comando para crear un nuevo `HousingLocation`

   ```shell
   ng generate component housingLocation
   ```

1. Ejecuta este comando para construir y servir tu aplicación.

   ```shell
   ng serve
   ```

   NOTA: ¡Este paso es solo para tu entorno local!

1. Abre un navegador y navega a `http://localhost:4200` para encontrar la aplicación.
1. Confirma que la aplicación se construye sin errores.

   ÚTIL: Debería renderizar igual que en la lección anterior porque aunque agregaste un nuevo componente, aún no lo has incluido en ninguna de las plantillas de la aplicación.

1. Deja `ng serve` ejecutándose mientras completas los siguientes pasos.
   </docs-step>

<docs-step title="Agrega el nuevo componente al diseño de tu aplicación">
En este paso, agregas el nuevo componente `HousingLocation` al `Home` de tu aplicación, para que se muestre en el diseño de tu aplicación.

En el panel de **Edición** de tu IDE:

1. Abre `home.ts` en el editor.
1. En `home.ts`, importa `HousingLocation` agregando esta línea a las importaciones a nivel de archivo.

<docs-code header="Importar HousingLocation en src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[2]"/>

1. A continuación, actualiza la propiedad `imports` de los metadatos de `@Component` agregando `HousingLocation` al arreglo.

<docs-code header="Agregar HousingLocation al arreglo imports en src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[6]"/>

1. Ahora el componente está listo para usarse en la plantilla de `Home`. Actualiza la propiedad `template` de los metadatos de `@Component` para incluir una referencia a la etiqueta `<app-housing-location>`.

<docs-code language="angular-ts" header="Agregar housing location a la plantilla del componente en src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[7,17]"/>

</docs-step>

<docs-step title="Agrega los estilos para el componente">
En este paso, copiarás los estilos preescritos para `HousingLocation` a tu aplicación para que la aplicación se renderice correctamente.

1. Abre `src/app/housing-location/housing-location.css` y pega los siguientes estilos en el archivo:

   NOTA: En el navegador, estos pueden ir en `src/app/housing-location/housing-location.ts` en el arreglo `styles`.

   <docs-code header="Agregar estilos CSS al componente housing location en src/app/housing-location/housing-location.css" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/housing-location/housing-location.css"/>

1. Guarda tu código, vuelve al navegador y confirma que la aplicación se construye sin errores. Deberías encontrar el mensaje "housing-location works!" renderizado en la pantalla. Corrige cualquier error antes de continuar al siguiente paso.

<img alt="marco del navegador de la aplicación de viviendas mostrando logo, cuadro de entrada de texto de filtro, botón de búsqueda y el mensaje 'housing-location works!'" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

</docs-step>

</docs-workflow>

RESUMEN: En esta lección, creaste un nuevo componente para tu aplicación y lo agregaste al diseño de la aplicación.
