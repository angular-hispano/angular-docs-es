# Agregar rutas a la aplicación

Esta lección del tutorial demuestra cómo agregar rutas a tu aplicación.

<docs-video src="https://www.youtube.com/embed/r5DEBMuStPw?si=H6Bx6nLJoMLaMxkx" />

IMPORTANTE: Recomendamos usar tu entorno local para aprender routing.

## ¿Qué aprenderás?

Al final de esta lección tu aplicación tendrá soporte para routing.

## Vista previa conceptual de routing

Este tutorial introduce el routing en Angular. El routing es la capacidad de navegar de un componente en la aplicación a otro. En [Aplicaciones de Página Única (SPA)](guide/routing), solo partes de la página se actualizan para representar la vista solicitada por el usuario.

El [Router de Angular](guide/routing) permite a los usuarios declarar rutas y especificar qué componente debe mostrarse en pantalla si esa ruta es solicitada por la aplicación.

En esta lección, habilitarás el routing en tu aplicación para navegar a la página de detalles.

<docs-workflow>

<docs-step title="Crea un componente de detalles predeterminado">
1. Desde la terminal, ingresa el siguiente comando para crear el componente `Details`:

    ```shell
    ng generate component details
    ```

    Este componente representará la página de detalles que proporciona más información sobre una ubicación de vivienda dada.

</docs-step>

<docs-step title="Agrega routing a la aplicación">
1.  En el directorio `src/app`, crea un archivo llamado `routes.ts`. Este archivo es donde definiremos las rutas en la aplicación.

2. En `main.ts`, realiza las siguientes actualizaciones para habilitar el routing en la aplicación:
   1. Importa el archivo de rutas y la función `provideRouter`:

   <docs-code header="Importar detalles de routing en src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[7,8]"/>
   2. Actualiza la llamada a `bootstrapApplication` para incluir la configuración de routing:

   <docs-code header="Agregar configuración del router en src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[10,17]"/>

3. En `src/app/app.ts`, actualiza el componente para usar routing:
   1. Agrega importaciones a nivel de archivo para las directivas del router `RouterOutlet` y `RouterLink`:

   <docs-code language="angular-ts" header="Importar directivas del router en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[3]"/>
   2. Agrega `RouterOutlet` y `RouterLink` a los imports de los metadatos de `@Component`

   <docs-code language="angular-ts" header="Agregar directivas del router a los imports del componente en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[6]"/>
   3. En la propiedad `template`, reemplaza la etiqueta `<app-home></app-home>` con la directiva `<router-outlet>` y agrega un enlace de vuelta a la página de inicio. Tu código debería coincidir con este código:

   <docs-code language="angular-ts" header="Agregar router-outlet en src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[7,18]"/>

</docs-step>

<docs-step title="Agrega ruta al nuevo componente">
En el paso anterior eliminaste la referencia al componente `<app-home>` en la plantilla. En este paso, agregarás una nueva ruta a ese componente.

1. En `routes.ts`, realiza las siguientes actualizaciones para crear una ruta.
   1. Agrega importaciones a nivel de archivo para `Home`, `Details` y el tipo `Routes` que usarás en las definiciones de ruta.

   <docs-code header="Importar componentes y Routes" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[1,3]"/>
   1. Define una variable llamada `routeConfig` de tipo `Routes` y define dos rutas para la aplicación:
      <docs-code header="Agregar rutas a la aplicación" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[5,18]"/>

   Las entradas en el arreglo `routeConfig` representan las rutas en la aplicación. La primera entrada navega a `Home` cada vez que la url coincide con `''`. La segunda entrada usa un formato especial que se revisitará en una lección futura.

1. Guarda todos los cambios y confirma que la aplicación funciona en el navegador. La aplicación debería seguir mostrando la lista de ubicaciones de vivienda.
   </docs-step>

</docs-workflow>

RESUMEN: En esta lección, habilitaste el routing en tu aplicación y definiste nuevas rutas. Ahora tu aplicación puede soportar navegación entre vistas. En la próxima lección, aprenderás a navegar a la página de "detalles" para una ubicación de vivienda dada.

Estás progresando muy bien con tu aplicación, bien hecho.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/routing" title="Descripción general de Routing en Angular"/>
  <docs-pill href="guide/routing/common-router-tasks" title="Tareas Comunes de Routing"/>
</docs-pill-row>
