# Agregar un formulario a tu aplicación Angular

Esta lección del tutorial demuestra cómo agregar un formulario que recopila datos del usuario a una aplicación Angular.
Esta lección comienza con una aplicación Angular funcional y muestra cómo agregar un formulario a ella.

Los datos que el formulario recopila se envían solo al servicio de la aplicación, que los escribe en la consola del navegador.
El uso de una API REST para enviar y recibir los datos del formulario no se cubre en esta lección.

<docs-video src="https://www.youtube.com/embed/kWbk-dOJaNQ?si=FYMXGdUiT-qh321h"/>

IMPORTANTE: Recomendamos usar tu entorno local para este paso del tutorial.

## ¿Qué aprenderás?

- Tu aplicación tiene un formulario en el que los usuarios pueden ingresar datos que se envían al servicio de tu aplicación.
- El servicio escribe los datos del formulario en el registro de la consola del navegador.

<docs-workflow>

<docs-step title="Agrega un método para enviar datos del formulario">
Este paso agrega un método al servicio de tu aplicación que recibe los datos del formulario para enviarlos al destino de los datos.
En este ejemplo, el método escribe los datos del formulario en el registro de la consola del navegador.

En el panel de **Edición** de tu IDE:

1. En `src/app/housing.service.ts`, dentro de la clase `HousingService`, pega este método al final de la definición de la clase.

<docs-code header="Método submit en src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/housing.service.ts" visibleLines="[120,124]"/>

1. Confirma que la aplicación se construye sin errores.
   Corrige cualquier error antes de continuar al siguiente paso.
   </docs-step>

<docs-step title="Agrega las funciones del formulario a la página de detalles">
Este paso agrega el código a la página de detalles que maneja las interacciones del formulario.

En el panel de **Edición** de tu IDE, en `src/app/details/details.ts`:

1. Después de las declaraciones `import` en la parte superior del archivo, agrega el siguiente código para importar las clases de formulario de Angular.

<docs-code header="Importaciones de formularios en src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[5]"/>

1. En los metadatos del decorador `Details`, actualiza la propiedad `imports` con el siguiente código:

<docs-code header="Directiva imports en src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[9]"/>

1. En la clase `Details`, antes del método `constructor()`, agrega el siguiente código para crear el objeto del formulario.

   <docs-code header="Directiva template en src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[52,56]"/>

   En Angular, `FormGroup` y `FormControl` son tipos que te permiten construir formularios. El tipo `FormControl` puede proporcionar un valor predeterminado y dar forma a los datos del formulario. En este ejemplo, `firstName` es un `string` y el valor predeterminado es string vacío.

1. En la clase `Details`, después del método `constructor()`, agrega el siguiente código para manejar el clic de **Apply now**.

   <docs-code header="Directiva template en src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[62,68]"/>

   Este botón aún no existe — lo agregarás en el siguiente paso. En el código anterior, los `FormControl`s pueden devolver `null`. Este código usa el operador de coalescencia nula para usar string vacío por defecto si el valor es `null`.

1. Confirma que la aplicación se construye sin errores.
   Corrige cualquier error antes de continuar al siguiente paso.
   </docs-step>

<docs-step title="Agrega el marcado del formulario a la página de detalles">
Este paso agrega el marcado a la página de detalles que muestra el formulario.

En el panel de **Edición** de tu IDE, en `src/app/details/details.ts`:

1. En los metadatos del decorador `Details`, actualiza el HTML de `template` para que coincida con el siguiente código para agregar el marcado del formulario.

   <docs-code language="angular-ts" header="Directiva template en src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[10,45]"/>

   La plantilla ahora incluye un manejador de eventos `(submit)="submitApplication()"`. Angular usa la sintaxis de paréntesis alrededor del nombre del evento para definir eventos en el código de la plantilla. El código en el lado derecho del signo igual es el código que debe ejecutarse cuando se dispara este evento. Puedes enlazarte a eventos del navegador y eventos personalizados.

1. Confirma que la aplicación se construye sin errores.
   Corrige cualquier error antes de continuar al siguiente paso.

<img alt="página de detalles con un formulario para solicitar vivir en esta ubicación" src="assets/images/tutorials/first-app/homes-app-lesson-12-step-3.png">

</docs-step>

<docs-step title="Prueba el nuevo formulario de tu aplicación">
Este paso prueba el nuevo formulario para ver que cuando los datos del formulario se envían a la aplicación, los datos del formulario aparecen en el registro de la consola.

1. En el panel de **Terminal** de tu IDE, ejecuta `ng serve`, si aún no se está ejecutando.
1. En tu navegador, abre tu aplicación en `http://localhost:4200`.
1. Haz clic derecho en la aplicación en el navegador y desde el menú contextual, elige **Inspeccionar**.
1. En la ventana de herramientas de desarrollador, elige la pestaña **Consola**.
   Asegúrate de que la ventana de herramientas de desarrollador sea visible para los siguientes pasos
1. En tu aplicación:
   1. Selecciona una ubicación de vivienda y haz clic en **Learn more**, para ver los detalles de la casa.
   1. En la página de detalles de la casa, desplázate hacia abajo para encontrar el nuevo formulario.
   1. Ingresa datos en los campos del formulario — cualquier dato está bien.
   1. Elige **Apply now** para enviar los datos.
1. En la ventana de herramientas de desarrollador, revisa la salida del registro para encontrar los datos de tu formulario.
   </docs-step>

</docs-workflow>

RESUMEN: En esta lección, actualizaste tu aplicación para agregar un formulario usando la funcionalidad de formularios de Angular, y conectaste los datos capturados en el formulario a un componente usando un manejador de eventos.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/forms" title="Formularios Angular"/>
  <docs-pill href="guide/templates/event-listeners" title="Manejo de Eventos"/>
</docs-pill-row>
