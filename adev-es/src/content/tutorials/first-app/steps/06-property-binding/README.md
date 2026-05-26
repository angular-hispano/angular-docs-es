# Agregar un enlace de propiedad a la plantilla de un componente

Esta lección del tutorial demuestra cómo agregar enlace de propiedad a una plantilla y usarlo para pasar datos dinámicos a componentes.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=AsiczpWnMz5HhJqB&amp;start=599"/>

## ¿Qué aprenderás?

- Tu aplicación tiene enlaces de datos en la plantilla de `Home`.
- Tu aplicación envía datos desde `Home` a `HousingLocation`.

## Vista previa conceptual de Inputs

En esta lección, continuarás el proceso de compartir datos desde el componente padre al componente hijo vinculando datos a esas propiedades en la plantilla usando enlace de propiedad.

El enlace de propiedad te permite conectar una variable a un `Input` en una plantilla Angular. Los datos se vinculan dinámicamente al `Input`.

Para una explicación más detallada, consulta la guía de [Enlace de propiedad](guide/templates/property-binding).

<docs-workflow>

<docs-step title="Actualiza la plantilla de `Home`">
Este paso agrega enlace de propiedad a la etiqueta `<app-housing-location>`.

En el editor de código:

1.  Navega a `src/app/home/home.ts`
1.  En la propiedad template del decorador `@Component`, actualiza el código para que coincida con el código a continuación:
    <docs-code language="angular-ts" header="Agregar enlace de propiedad housingLocation" path="adev/src/content/tutorials/first-app/steps/07-dynamic-template-values/src/app/home/home.ts" visibleLines="[15,17]"/>

        Al agregar un enlace de propiedad a una etiqueta de componente, usamos la sintaxis `[atributo] = "valor"` para notificar a Angular que el valor asignado debe tratarse como una propiedad de la clase del componente y no como un valor string.

        El valor en el lado derecho es el nombre de la propiedad de `Home`.

    </docs-step>

<docs-step title="Confirma que el código aún funciona">
1.  Guarda tus cambios y confirma que la aplicación no tenga errores.
1.  Corrige cualquier error antes de continuar al siguiente paso.
</docs-step>

</docs-workflow>

RESUMEN: En esta lección, agregaste un nuevo enlace de propiedad y pasaste una referencia a una propiedad de clase. Ahora, `HousingLocation` tiene acceso a datos que puede usar para personalizar la visualización del componente.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="/guide/templates/property-binding" title="Enlace de propiedad"/>
</docs-pill-row>
