# Crear el componente Home

Esta lección del tutorial demuestra cómo crear un nuevo [componente](guide/components) para tu aplicación Angular.

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=OMVaw71EIa44yIOJ"/>

## ¿Qué aprenderás?

Tu aplicación tiene un nuevo componente: `Home`.

## Vista previa conceptual de los componentes de Angular

Las aplicaciones Angular se construyen alrededor de componentes, que son los bloques de construcción de Angular.
Los componentes contienen el código, el diseño HTML y la información de estilo CSS que proporcionan la función y apariencia de un elemento en la aplicación.
En Angular, los componentes pueden contener otros componentes. Las funciones y la apariencia de una aplicación se pueden dividir y particionar en componentes.

En Angular, los componentes tienen metadatos que definen sus propiedades.
Cuando creas tu `Home`, usas estas propiedades:

- `selector`: para describir cómo Angular se refiere al componente en las plantillas.
- `standalone`: para describir si el componente requiere un `NgModule`.
- `imports`: para describir las dependencias del componente.
- `template`: para describir el marcado HTML y el diseño del componente.
- `styleUrls`: para listar las URLs de los archivos CSS que el componente usa en un arreglo.

<docs-pill-row>
  <docs-pill href="api/core/Component" title="Aprende más sobre Componentes"/>
</docs-pill-row>

<docs-workflow>

<docs-step title="Crea el `Home`">
En este paso, creas un nuevo componente para tu aplicación.

En el panel de **Terminal** de tu IDE:

1. En tu directorio del proyecto, navega al directorio `first-app`.
1. Ejecuta este comando para crear un nuevo `Home`

   ```shell
   ng generate component home
   ```

1. Ejecuta este comando para construir y servir tu aplicación.

   NOTA: ¡Este paso es solo para tu entorno local!

   ```shell
   ng serve
   ```

1. Abre un navegador y navega a `http://localhost:4200` para encontrar la aplicación.

1. Confirma que la aplicación se construye sin errores.

   ÚTIL: Debería renderizar igual que en la lección anterior porque aunque agregaste un nuevo componente, aún no lo has incluido en ninguna de las plantillas de la aplicación.

1. Deja `ng serve` ejecutándose mientras completas los siguientes pasos.
   </docs-step>

<docs-step title="Agrega el nuevo componente al diseño de tu aplicación">
En este paso, agregas el nuevo componente `Home` al componente raíz de tu aplicación, `App`, para que se muestre en el diseño de tu aplicación.

En el panel de **Edición** de tu IDE:

1. Abre `app.ts` en el editor.
1. En `app.ts`, importa `Home` agregando esta línea a las importaciones a nivel de archivo.

<docs-code header="Importar Home en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[2]"/>

1. En `app.ts`, en `@Component`, actualiza la propiedad del arreglo `imports` y agrega `Home`.

<docs-code header="Reemplazar en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[6]"/>

1. En `app.ts`, en `@Component`, actualiza la propiedad `template` para incluir el siguiente código HTML.

<docs-code language="angular-ts" header="Reemplazar en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[7,16]"/>

1. Guarda tus cambios en `app.ts`.
1. Si `ng serve` se está ejecutando, la aplicación debería actualizarse.
   Si `ng serve` no se está ejecutando, inícialo nuevamente.
   _Hello world_ en tu aplicación debería cambiar a _home works!_ desde `Home`.
1. Verifica la aplicación en ejecución en el navegador y confirma que la aplicación se haya actualizado.

<img alt="marco del navegador mostrando el texto 'home works!'" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-2.png">

</docs-step>

<docs-step title="Agrega funcionalidades a `Home`">

En este paso agregas funcionalidades a `Home`.

En el paso anterior, agregaste el `Home` predeterminado a la plantilla de tu aplicación para que su HTML predeterminado apareciera en la aplicación.
En este paso, agregas un filtro de búsqueda y un botón que se usará en una lección posterior.
Por ahora, eso es todo lo que tiene `Home`.
Ten en cuenta que este paso solo agrega los elementos de búsqueda al diseño sin ninguna funcionalidad, todavía.

En el panel de **Edición** de tu IDE:

1. En el directorio `first-app`, abre `home.ts` en el editor.
1. En `home.ts`, en `@Component`, actualiza la propiedad `template` con este código.

<docs-code language="angular-ts" header="Reemplazar en src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.ts" visibleLines="[5,12]"/>

1. A continuación, abre `home.css` en el editor y actualiza el contenido con estos estilos.

   NOTA: En el navegador, estos pueden ir en `src/app/home/home.ts` en el arreglo `styles`.

   <docs-code header="Reemplazar en src/app/home/home.css" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.css"/>

1. Confirma que la aplicación se construye sin errores.
   Deberías encontrar el cuadro de consulta de filtro y el botón en tu aplicación y deberían tener estilo.
   Corrige cualquier error antes de continuar al siguiente paso.

<img alt="marco del navegador de la aplicación de viviendas mostrando logo, cuadro de entrada de texto de filtro y botón de búsqueda" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-3.png">
</docs-step>

</docs-workflow>

RESUMEN: En esta lección, creaste un nuevo componente para tu aplicación y le diste un control de edición de filtro y un botón.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="cli/generate/component" title="`ng generate component`"/>
  <docs-pill href="api/core/Component" title="Referencia de `Component`"/>
  <docs-pill href="guide/components" title="Descripción general de componentes de Angular"/>
</docs-pill-row>
