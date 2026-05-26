# Agregar la funcionalidad de búsqueda a tu app

Esta lección del tutorial demuestra cómo agregar una funcionalidad de búsqueda a tu aplicación Angular.

La aplicación permitirá a los usuarios buscar a través de los datos proporcionados por tu aplicación y mostrar solo los resultados que coincidan con el término ingresado.

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k&amp;start=457"/>

IMPORTANTE: Recomendamos usar tu entorno local para este paso del tutorial.

## ¿Qué aprenderás?

- Tu aplicación usará datos de un formulario para buscar ubicaciones de vivienda coincidentes
- Tu aplicación mostrará solo las ubicaciones de vivienda coincidentes

<docs-workflow>

<docs-step title="Actualiza las propiedades del componente home">
En este paso, actualizarás la clase `Home` para almacenar datos en una nueva propiedad de arreglo que usarás para filtrar.

1. En `src/app/home/home.ts`, agrega una nueva propiedad a la clase llamada `filteredLocationList`.

   <docs-code header="Agregar la propiedad filteredLocationList en home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[27]"/>

   `filteredLocationList` contiene los valores que coinciden con el criterio de búsqueda ingresado por el usuario.

1. `filteredLocationList` debería contener el conjunto total de valores de ubicaciones de vivienda por defecto cuando la página se carga. Actualiza el `constructor` de `Home` para establecer el valor.

   <docs-code header="Establecer el valor de filteredLocationList" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[29,32]"/>

</docs-step>

<docs-step title="Actualiza la plantilla del componente home">
`Home` ya contiene un campo de entrada que usarás para capturar la entrada del usuario. Ese texto string se usará para filtrar los resultados.

1. Actualiza la plantilla de `Home` para incluir una variable de plantilla en el elemento `input` llamada `#filter`.

   <docs-code language="angular-ts" header="Agregar una variable de plantilla al elemento HTML input en home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[12]"/>
   Este ejemplo usa una [variable de referencia de plantilla](guide/templates) para obtener acceso al elemento `input` como su valor.

1. A continuación, actualiza la plantilla del componente para adjuntar un manejador de eventos al botón "Search".

   <docs-code language="angular-ts" header="Vincular el evento click del botón a un método en home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[13]"/>

   Al vincular el evento `click` en el elemento `button`, puedes llamar a la función `filterResults`. El argumento de la función es la propiedad `value` de la variable de plantilla `filter`. Específicamente, la propiedad `.value` del elemento HTML `input`.

1. La última actualización de la plantilla es para la directiva `@for`. Actualiza `@for` para iterar sobre valores del arreglo `filteredLocationList`.

   <docs-code header="Actualizar la directiva de plantilla @for en home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[17,19]" language="html"/>

</docs-step>

<docs-step title="Implementa la función manejadora de eventos">
La plantilla ha sido actualizada para vincular la función `filterResults` al evento `click`. A continuación, tu tarea es implementar la función `filterResults` en la clase `Home`.

1. Actualiza la clase `Home` para incluir la implementación de la función `filterResults`.

   <docs-code header="Agregar la implementación de la función filterResults" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[34,43]"/>

   Esta función usa la función `filter` de `String` para comparar el valor del parámetro `text` contra la propiedad `housingLocation.city`. Puedes actualizar esta función para que coincida con cualquier propiedad o múltiples propiedades como ejercicio divertido.

1. Guarda tu código.

1. Actualiza el navegador y confirma que puedes buscar los datos de ubicaciones de vivienda por ciudad cuando haces clic en el botón "Search" después de ingresar texto.

<img alt="resultados de búsqueda filtrados basados en la entrada del usuario" src="assets/images/tutorials/first-app/homes-app-lesson-13-step-3.png">
</docs-step>

</docs-workflow>

RESUMEN: En esta lección, actualizaste tu aplicación para usar variables de plantilla para interactuar con valores de plantilla, y agregaste funcionalidad de búsqueda usando enlace de eventos y funciones de arreglo.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/templates" title="Variables de Plantilla"/>
  <docs-pill href="guide/templates/event-listeners" title="Manejo de Eventos"/>
</docs-pill-row>
