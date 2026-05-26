# Agregar interpolación a la plantilla de un componente

Esta lección del tutorial demuestra cómo agregar interpolación a las plantillas Angular para mostrar datos dinámicos en una plantilla.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=IFAly3Ss8dwqFx8N&amp;start=338"/>

## ¿Qué aprenderás?

- Tu aplicación mostrará valores interpolados en la plantilla de `HousingLocation`.
- Tu aplicación renderizará datos de una ubicación de vivienda en el navegador.

## Vista previa conceptual de interpolación

En este paso mostrarás valores leídos de propiedades `input` en una plantilla usando interpolación.

Usando `{{ expresión }}` en las plantillas Angular, puedes renderizar valores de propiedades, `inputs` y expresiones JavaScript válidas.

Para una explicación más detallada, consulta la guía de [Mostrando valores con interpolación](guide/templates/binding#render-dynamic-text-with-text-interpolation).

<docs-workflow>

<docs-step title="Actualiza la plantilla de `HousingLocation` para incluir valores interpolados">
Este paso agrega nueva estructura HTML y valores interpolados en la plantilla de `HousingLocation`.

En el editor de código:

1.  Navega a `src/app/housing-location/housing-location.ts`
1.  En la propiedad template del decorador `@Component`, reemplaza el marcado HTML existente con el siguiente código:

<docs-code language="angular-ts" header="Actualizar plantilla de HousingLocation en housing-location.ts" path="adev/src/content/tutorials/first-app/steps/08-ngFor/src/app/housing-location/housing-location.ts" visibleLines="[6,17]"/>

En este código de plantilla actualizado has usado enlace de propiedad para vincular `housingLocation.photo` al atributo `src`. El atributo `alt` usa interpolación para dar más contexto al texto alternativo de la imagen.

Usas interpolación para incluir los valores de `name`, `city` y `state` de la propiedad `housingLocation`.

</docs-step>

<docs-step title="Confirma que los cambios se renderizan en el navegador">
1.  Guarda todos los cambios.
1.  Abre el navegador y confirma que la aplicación renderiza la foto, la ciudad y el estado de los datos de ejemplo.
    <img alt="marco del navegador de la aplicación de viviendas mostrando logo, cuadro de entrada de texto de filtro, botón de búsqueda y la misma tarjeta de UI de ubicación de vivienda" src="assets/images/tutorials/first-app/homes-app-lesson-07-step-2.png">
</docs-step>

</docs-workflow>

RESUMEN: En esta lección, agregaste una nueva estructura HTML y usaste la sintaxis de plantillas Angular para renderizar valores en la plantilla de `HousingLocation`.

Ahora, tienes dos habilidades importantes:

- pasar datos a componentes
- interpolar valores en una plantilla

Con estas habilidades, tu aplicación ahora puede compartir datos y mostrar valores dinámicos en el navegador. Excelente trabajo hasta ahora.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/templates" title="Sintaxis de plantillas"/>
  <docs-pill href="guide/templates/binding#render-dynamic-text-with-text-interpolation" title="Mostrando valores con interpolación"/>
</docs-pill-row>
