# Creando una interfaz

Esta lección del tutorial demuestra cómo crear una interfaz e incluirla en un componente de tu aplicación.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=YkFSeUeV8Ixtz8pm"/>

## ¿Qué aprenderás?

- Tu aplicación tiene una nueva interfaz que puede usar como tipo de dato.
- Tu aplicación tiene una instancia de la nueva interfaz con datos de ejemplo.

## Vista previa conceptual de interfaces

Las [interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) son tipos de datos personalizados para tu aplicación.

Angular usa TypeScript para aprovechar el trabajo en un entorno de programación fuertemente tipado.
La comprobación estricta de tipos reduce la probabilidad de que un elemento en tu aplicación envíe datos con formato incorrecto a otro.
Dichos errores de desajuste de tipo son detectados por el compilador de TypeScript y muchos de esos errores también pueden detectarse en tu IDE.

En esta lección, crearás una interfaz para definir propiedades que representan datos sobre una ubicación de vivienda.

<docs-workflow>

<docs-step title="Crea una nueva interfaz de Angular">
Este paso crea una nueva interfaz en tu aplicación.

En el panel de **Terminal** de tu IDE:

1. En tu directorio del proyecto, navega al directorio `first-app`.
1. En el directorio `first-app`, ejecuta este comando para crear la nueva interfaz.

   ```shell

   ng generate interface housinglocation

   ```

1. Ejecuta `ng serve` para construir la aplicación y servirla en `http://localhost:4200`.
1. En un navegador, abre `http://localhost:4200` para ver tu aplicación.
1. Confirma que la aplicación se construye sin errores.
   Corrige cualquier error antes de continuar al siguiente paso.
   </docs-step>

<docs-step title="Agrega propiedades a la nueva interfaz">
Este paso agrega las propiedades a la interfaz que tu aplicación necesita para representar una ubicación de vivienda.

1. En el panel de **Terminal** de tu IDE, inicia el comando `ng serve`, si aún no se está ejecutando, para construir la aplicación y servirla en `http://localhost:4200`.
1. En el panel de **Edición** de tu IDE, abre el archivo `src/app/housinglocation.ts`.
1. En `housinglocation.ts`, reemplaza el contenido predeterminado con el siguiente código para que tu nueva interfaz coincida con este ejemplo.

<docs-code header="Actualizar src/app/housinglocation.ts para que coincida con este código" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/housinglocation.ts" visibleLines="[1,10]" />

1. Guarda tus cambios y confirma que la aplicación no muestre errores. Corrige cualquier error antes de continuar al siguiente paso.

En este punto, has definido una interfaz que representa datos sobre una ubicación de vivienda, incluyendo un `id`, `name` e información de ubicación.
</docs-step>

<docs-step title="Crea una casa de prueba para tu aplicación">
Tienes una interfaz, pero aún no la estás usando.

En este paso, creas una instancia de la interfaz y le asignas algunos datos de ejemplo.
No verás estos datos de ejemplo aparecer en tu aplicación todavía.
Quedan algunas lecciones más por completar antes de que eso suceda.

1. En el panel de **Terminal** de tu IDE, ejecuta el comando `ng serve`, si aún no se está ejecutando, para construir la aplicación y servir tu aplicación en `http://localhost:4200`.
1. En el panel de **Edición** de tu IDE, abre `src/app/home/home.ts`.
1. En `src/app/home/home.ts`, agrega esta declaración de importación después de las declaraciones `import` existentes para que `Home` pueda usar la nueva interfaz.

<docs-code language="angular-ts" header="Importar Home en src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[3]"/>

1. En `src/app/home/home.ts`, reemplaza la definición vacía `export class Home {}` con este código para crear una única instancia de la nueva interfaz en el componente.

<docs-code language="angular-ts" header="Agregar datos de ejemplo a src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[22,35]"/>

1. Confirma que tu archivo `home.ts` coincide con este ejemplo.

   <docs-code language="angular-ts" header="src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[[1,7],[9,36]]" />

   Al agregar la propiedad `housingLocation` de tipo `HousingLocation` a la clase `Home`, podemos confirmar que los datos coinciden con la descripción de la interfaz. Si los datos no satisficieran la descripción de la interfaz, el IDE tiene suficiente información para darnos errores útiles.

1. Guarda tus cambios y confirma que la aplicación no tenga errores. Abre el navegador y confirma que tu aplicación aún muestra el mensaje "housing-location works!"

<img alt="marco del navegador de la aplicación de viviendas mostrando logo, cuadro de entrada de texto de filtro, botón de búsqueda y el mensaje 'housing-location works!'" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

1. Corrige cualquier error antes de continuar al siguiente paso.
   </docs-step>

</docs-workflow>

RESUMEN: En esta lección, creaste una interfaz que creó un nuevo tipo de dato para tu aplicación.
Este nuevo tipo de dato hace posible que especifiques dónde se requieren datos de `HousingLocation`.
Este nuevo tipo de dato también hace posible que tu IDE y el compilador TypeScript aseguren que los datos de `HousingLocation` se usen donde se requieren.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="cli/generate/interface" title="ng generate interface"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
