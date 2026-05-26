# Usar @for para listar objetos en el componente

Esta lección del tutorial demuestra cómo usar el bloque `@for` en plantillas Angular para mostrar datos repetidos dinámicamente en una plantilla.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=MIl5NcRxvcLjYt5f&amp;start=477"/>

NOTA: Este video refleja una sintaxis anterior, pero los conceptos principales siguen siendo válidos.

## ¿Qué aprenderás?

- Habrás agregado un conjunto de datos a la aplicación
- Tu aplicación mostrará una lista de elementos del nuevo conjunto de datos usando `@for`

## Vista previa conceptual de `@for`

En Angular, `@for` es un tipo específico de [bloque de control de flujo](/guide/templates/control-flow) usado para repetir datos dinámicamente en una plantilla. En JavaScript plano usarías un bucle for - `@for` proporciona funcionalidad similar para las plantillas Angular.

Puedes utilizar `@for` para iterar sobre arreglos e incluso valores asíncronos. En esta lección, agregarás un nuevo arreglo de datos para iterar.

Para una explicación más detallada, consulta la guía de [control de flujo](guide/templates/control-flow#repeat-content-with-the-for-block).

<docs-workflow>

<docs-step title="Agrega datos de viviendas al `Home`">

En `Home` solo hay una única ubicación de vivienda. En este paso, agregarás un arreglo de entradas `HousingLocation`.

1. En `src/app/home/home.ts`, elimina la propiedad `housingLocation` de la clase `Home`.
1. Actualiza la clase `Home` para que tenga una propiedad llamada `housingLocationList`. Actualiza tu código para que coincida con el siguiente código:
   <docs-code language="angular-ts" header="Agregar propiedad housingLocationList en home.ts" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="26-131"/>

   IMPORTANTE: No elimines el decorador `@Component`, actualizarás ese código en un próximo paso.

</docs-step>

<docs-step title="Actualiza la plantilla de `Home` para usar `@for`">
Ahora la aplicación tiene un conjunto de datos que puedes usar para mostrar las entradas en el navegador usando el bloque `@for`.

1. Actualiza la etiqueta `<app-housing-location>` en el código de la plantilla a esto:
   <docs-code language="angular-ts" header="Agregar @for a la plantilla de Home en home.ts" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="[15,19]"/>

   Nota, en el código `[housingLocation] = "housingLocation"` el valor `housingLocation` ahora se refiere a la variable usada en el bloque `@for`. Antes de este cambio, se refería a la propiedad de la clase `Home`.

1. Guarda todos los cambios.

1. Actualiza el navegador y confirma que la aplicación ahora renderiza una cuadrícula de ubicaciones de vivienda.

<section class="lightbox">
<img alt="marco del navegador de la aplicación de viviendas mostrando logo, cuadro de entrada de texto de filtro, botón de búsqueda y una cuadrícula de tarjetas de ubicaciones de vivienda" src="assets/images/tutorials/first-app/homes-app-lesson-08-step-2.png">
</section>

</docs-step>

</docs-workflow>

RESUMEN: En esta lección, usaste el bloque `@for` para repetir datos dinámicamente en plantillas Angular. También agregaste un nuevo arreglo de datos para usar en la aplicación Angular. La aplicación ahora renderiza dinámicamente una lista de ubicaciones de vivienda en el navegador.

La aplicación está tomando forma, excelente trabajo.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/templates/control-flow" title="Bloques de control de flujo"/>
  <docs-pill href="guide/templates/control-flow#repeat-content-with-the-for-block" title="Guía de @for"/>
  <docs-pill href="/api/core/@for" title="@for"/>
</docs-pill-row>
