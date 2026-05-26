# Agregar un parámetro input al componente

Esta lección del tutorial demuestra cómo crear un `input` de componente y usarlo para pasar datos a un componente para personalización.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=WvRGFSkW_7_zDIFD&amp;start=241"/>

NOTA: Este video refleja una sintaxis anterior, pero los conceptos principales siguen siendo válidos.

## ¿Qué aprenderás?

La plantilla de `HousingLocation` de tu aplicación tiene una propiedad `HousingLocation` para recibir input.

## Vista previa conceptual de Inputs

Los [Inputs](api/core/input) permiten a los componentes especificar datos que pueden pasarse desde un componente padre.

En esta lección, definirás una propiedad `input` en el componente `HousingLocation` que te permite personalizar los datos mostrados en el componente.

Aprende más en las guías [Aceptando datos con propiedades input](guide/components/inputs) y [Eventos personalizados con outputs](guide/components/outputs).

<docs-workflow>

<docs-step title="Importa la función input()">
En el editor de código, importa el método auxiliar `input` desde `@angular/core` en el componente `HousingLocation`.

<docs-code header="Importar input en housing-location.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[1]"/>

</docs-step>

<docs-step title="Agrega la propiedad Input">
Agrega una propiedad requerida llamada `housingLocation` e inicialízala usando `input.required()` con el tipo `HousingLocationInfo`.

  <docs-code header="Declarar la propiedad input en housing-location.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[12]"/>

Tienes que invocar el método `required` en `input` para indicar que el componente padre debe proporcionar un valor. En nuestra aplicación de ejemplo, sabemos que este valor siempre se pasará — esto es por diseño. La llamada `.required()` asegura que el compilador TypeScript lo aplique y trate la propiedad como no anulable cuando este componente se usa en una plantilla.

</docs-step>

<docs-step title="Pasa datos al input">
Envía el valor de `housingLocation` desde el componente `Home` a la propiedad `housingLocation` del componente HousingLocation.

<docs-code language="angular-ts" header="Declarar la propiedad input para HousingLocation en home.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/home/home.ts" visibleLines="[16]"/>

</docs-step>

</docs-workflow>

RESUMEN: En esta lección, creaste una nueva propiedad `input`. También usaste el método `.required` para asegurar que el valor del signal esté siempre definido.

<docs-pill-row>
  <docs-pill href="guide/components/inputs" title="Aceptando datos con propiedades input"/>
  <docs-pill href="guide/components/outputs" title="Eventos personalizados con outputs"/>
</docs-pill-row>
