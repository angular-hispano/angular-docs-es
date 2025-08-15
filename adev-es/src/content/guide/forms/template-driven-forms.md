# Construyendo un formulario basado en plantillas

Este tutorial te muestra cómo crear un formulario basado en plantillas. Los elementos de control en el formulario están vinculados a propiedades de datos que tienen validación de entrada. La validación de entrada ayuda a mantener la integridad de los datos y el estilo, lo que mejora la experiencia del usuario.

Los formularios basados en plantillas usan [enlace de datos bidireccional](guide/templates/two-way-binding) para actualizar el modelo de datos en el componente a medida que se realizan cambios en la plantilla y viceversa.

<docs-callout helpful title="Formularios basados en plantillas vs Formularios reactivos">
Angular soporta dos enfoques de diseño para formularios interactivos. Los formularios basados en plantillas te permiten usar directivas específicas de formulario en tu plantilla de Angular. Los formularios reactivos proporcionan un enfoque basado en modelos para construir formularios.

Los formularios basados en plantillas son una excelente opción para formularios pequeños o simples, mientras que los formularios reactivos son más escalables y adecuados para formularios complejos. Para una comparación de los dos enfoques, consulta [Elegir un enfoque](guide/forms#choosing-an-approach)
</docs-callout>

Puedes construir casi cualquier tipo de formulario con una plantilla de Angular formularios de inicio de sesión, formularios de contacto, y prácticamente cualquier formulario de negocio.
Puedes diseñar los controles de forma creativa y vincularlos a los datos en tu modelo de objeto.
Puedes especificar reglas de validación, mostrar errores de validación, permitir condicionalmente entrada en controles específicos, activar retroalimentación visual integrada, y mucho más.

## Objetivos

Este tutorial te enseña cómo hacer lo siguiente:

- Construir un formulario de Angular con un componente y plantilla
- Usar `ngModel` para crear enlaces de datos bidireccionales para leer y escribir valores de control de entrada
- Proporcionar retroalimentación visual usando clases CSS especiales que rastrean el estado de los controles
- Mostrar errores de validación a los usuarios y permitir la entrada de datos en los controles del formulario de forma condicional, basándose en el estado del mismo.
- Compartir información entre elementos HTML usando [variables de referencia de plantilla](guide/templates/variables#template-reference-variables)

## Construir un formulario basado en plantillas

Los formularios basados en plantillas se basan en directivas definidas en el `FormsModule`.

| Directives     | Details                                                                                                                                                                                                                                                                         |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NgModel`      | Reconcilia los cambios de valor en el elemento de formulario adjunto con los cambios en el modelo de datos, lo que te permite responder a la entrada del usuario con validación y manejo de errores.                                                                                                           |
| `NgForm`       | Crea una instancia de `FormGroup` de nivel superior y la vincula a un elemento `<form>` para rastrear el valor agregado del formulario y el estado de validación. Tan pronto como importas `FormsModule`, esta directiva se vuelve activa por defecto en todas las etiquetas `<form>`. No necesitas agregar un selector especial. |
| `NgModelGroup` | Crea y vincula una instancia de `FormGroup` a un elemento DOM.                                                                                                                                                                                                                      |

### Resumen de los pasos

En el curso de este tutorial, vinculas un formulario de muestra a datos y manejas la entrada del usuario usando los siguientes pasos.

1. Construir el formulario básico.
   - Definir un modelo de datos de muestra
   - Incluir infraestructura requerida como el `FormsModule`
1. Vincular controles de formulario a propiedades de datos usando la directiva `ngModel` y la sintaxis de enlace de datos bidireccional.
   - Examinar cómo `ngModel` reporta estados de control usando clases CSS
   - Nombrar controles para hacerlos accesibles a `ngModel`
1. Rastrear validez de entrada y estado de control usando `ngModel`.
   - Agregar CSS personalizado para proporcionar retroalimentación visual sobre el estado
   - Mostrar y ocultar mensajes de error de validación
1. Responder a un evento de clic de botón HTML nativo agregando al modelo de datos.
1. Manejar el envío del formulario usando la propiedad de salida [`ngSubmit`](api/forms/NgForm#properties) del formulario.
   - Deshabilitar el botón **Submit** hasta que el formulario sea válido
   - Después del envío, intercambiar el formulario terminado por contenido diferente en la página

## Construir el formulario

<!-- TODO: link to preview -->
<!-- <docs-code live/> -->

1. La aplicación de ejemplo proporcionada crea la clase `Actor` que define el modelo de datos reflejado en el formulario.

<docs-code header="src/app/actor.ts" language="typescript" path="adev/src/content/examples/forms/src/app/actor.ts"/>

1. El diseño y detalles del formulario están definidos en la clase `ActorFormComponent`.

   <docs-code header="src/app/actor-form/actor-form.component.ts (v1)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="v1"/>

   El valor `selector` del componente de "app-actor-form" significa que puedes colocar este formulario en una plantilla padre usando la etiqueta `<app-actor-form>`.

1. El siguiente código crea una nueva instancia de actor, para que el formulario inicial pueda mostrar un actor de ejemplo.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="Marilyn"/>

   Esta demo usa datos ficticios para `model` y `skills`.
   En una aplicación real, inyectarías un servicio de datos para obtener y guardar datos reales, o exponerías estas propiedades como entradas y salidas.

1. El siguiente código crea una nueva instancia de actor, para que el formulario inicial pueda mostrar un actor de ejemplo.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="imports"/>

1. El formulario se muestra en el diseño de la aplicación definido por la plantilla del componente raíz.

   <docs-code header="src/app/app.component.html" language="html" path="adev/src/content/examples/forms/src/app/app.component.html"/>

   La plantilla inicial define el diseño para un formulario con dos grupos de formulario y un botón de envío.
   Los grupos de formulario corresponden a dos propiedades del modelo de datos Actor, nombre y estudio.
   Cada grupo tiene una etiqueta y una caja para entrada de datos del usuario.

   - El elemento de control **Name** `<input>` tiene el atributo HTML5 `required`
   - El elemento de control **Studio** `<input>` no lo tiene porque `studio` es opcional

   El botón **Submit** tiene algunas clases para estilos.
   En este punto, el diseño del formulario es todo HTML5 plano, sin enlaces o directivas.

1. El formulario de muestra usa algunas clases de estilo de [Twitter Bootstrap](https://getbootstrap.com/css): `container`, `form-group`, `form-control`, y `btn`.
   Para usar estos estilos, la hoja de estilo de la aplicación importa la biblioteca.

<docs-code header="src/styles.css" path="adev/src/content/examples/forms/src/styles.1.css"/>

1. El formulario requiere que la habilidad de un actor se elija de una lista predefinida de `skills` mantenida internamente en `ActorFormComponent`.
   El bucle Angular `@for` itera sobre los valores de datos para llenar el elemento `<select>`.

<docs-code header="src/app/actor-form/actor-form.component.html (skills)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="skills"/>

Si ejecutas la aplicación, verás la lista de habilidades en el control de selección. 
Los elementos de entrada aún no están enlazados a valores de datos o eventos, por lo que todavía están en blanco y no tienen comportamiento.

## Vincular controles de entrada a propiedades de datos

El siguiente paso es vincular los controles de entrada a las propiedades `Actor` correspondientes con el enlace de datos bidireccional, para que respondan a la entrada del usuario actualizando el modelo de datos, y también respondan a los cambios programáticos en los datos actualizando la visualización.

La directiva `ngModel` declarada en `FormsModule` te permite vincular controles en tu formulario basado en plantillas a propiedades en tu modelo de datos.
Cuando incluyes la directiva usando la sintaxis para enlace de datos bidireccional, `[(ngModel)]`, Angular puede rastrear el valor y la interacción del usuario del control y mantener la vista sincronizada con el modelo.

1. Edita el archivo de plantilla `actor-form.component.html`.
1. Encuentra la etiqueta `<input>` junto a la etiqueta **Name**.
1. Agrega la directiva `ngModel`, usando la sintaxis de enlace de datos bidireccional `[(ngModel)]="..."`.

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModelName-1"/>

ÚTIL: Este ejemplo tiene una interpolación de diagnóstico temporal después de cada etiqueta de entrada, `{{model.name}}`, para mostrar el valor de datos actual de la propiedad correspondiente. El comentario te recuerda eliminar las líneas de diagnóstico cuando hayas terminado de observar el enlace de datos bidireccional en funcionamiento.

### Acceder al estado general del formulario

Cuando importaste `FormsModule` en tu componente, Angular automáticamente creó y adjuntó una directiva [NgForm](api/forms/NgForm) a la etiqueta `<form>` en la plantilla (porque `NgForm` tiene el selector `form` que coincide con elementos `<form>`).

Para obtener acceso a `NgForm` y el estado general del formulario, declara una [variable de referencia de plantilla](guide/templates/variables#template-reference-variables).

1. Edita el archivo de plantilla `actor-form.component.html`.
1. Actualiza la etiqueta `<form>` con una variable de referencia de plantilla, `#actorForm`, y establece su valor como sigue.

   <docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="template-variable"/>

La variable de plantilla `actorForm` ahora es una referencia a la instancia de directiva `NgForm` que gobierna el formulario como un todo.

1. Ejecuta la aplicación.
1. Comienza a escribir en la caja de entrada **Name**.

   A medida que agregas y eliminas caracteres, puedes verlos aparecer y desaparecer del modelo de datos.

La línea de diagnóstico que muestra valores interpolados demuestra que los valores fluyen de la caja de entrada al modelo y viceversa.

### Nombrando elementos de control

Cuando usas `[(ngModel)]` en un elemento, debes definir un atributo `name` para ese elemento.
Angular usa el nombre asignado para registrar el elemento con la directiva `NgForm` adjunta al elemento `<form>` padre.

El ejemplo agregó un atributo `name` al elemento `<input>` y lo estableció como "name", lo cual tiene sentido para el nombre del actor.
Cualquier valor único funcionará, pero es útil usar un nombre descriptivo.

1. Agrega enlaces `[(ngModel)]` similares y atributos `name` a **Studio** y **Skill**.
1. Ahora puedes eliminar los mensajes de diagnóstico que muestran valores interpolados.
1. Para confirmar que el enlace de datos bidireccional funciona para todo el modelo de actor, agrega un nuevo enlace de texto con el pipe [`json`](api/common/JsonPipe) en la parte superior de la plantilla del componente, que serializa los datos a una cadena.

Después de estas revisiones, la plantilla del formulario debería verse como así:

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModel-2"/>

Notarás que:

- Cada elemento `<input>` tiene una propiedad `id`.
  Esto es utilizado por el atributo `for` del elemento `<label>` para hacer coincidir la etiqueta con su control de entrada.
  Esta es una [característica estándar de HTML](https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/label).

- Cada elemento `<input>` también tiene la propiedad `name` requerida que Angular usa para registrar el control con el formulario..

Una vez que hayas observado los efectos, puedes eliminar el enlace de texto `{{ model | json }}`.

## Rastrear los estados del formulario

Angular aplica la clase `ng-submitted` a elementos `form` después de que el formulario ha sido enviado. 
Estas clases pueden usarse para cambiar el estilo del formulario después de que ha sido enviado

## Rastrear los estados de control

Agregar la directiva `NgModel` a un control agrega nombres de clase al control que describen su estado.

Estas clases pueden usarse para cambiar el estilo de un control basado en su estado.

| Estados                           | Clase si es verdadero | Clase si es falso |
| :------------------------------- | :------------ | :------------- |
| El control ha sido visitado.    | `ng-touched`  | `ng-untouched` |
| El valor del control ha cambiado. | `ng-dirty`    | `ng-pristine`  |
| El valor del control es válido.    | `ng-valid`    | `ng-invalid`   |

Angular también aplica la clase `ng-submitted` a los elementos `form` al enviar, 
pero no a los controles dentro del elemento `form`.

Puedes usar estas clases CSS para definir los estilos de tu control en función de su estado.

### Observar los estados del control

Para ver cómo las clases son agregadas y eliminadas por el framework, abre las herramientas de desarrollador del navegador e inspecciona el elemento `<input>` que representa el nombre del actor.

Usando las herramientas de desarrollador de tu navegador, encuentra el elemento `<input>` que corresponde a la caja de entrada **Name**.
   You can see that the element has multiple CSS classes in addition to "form-control".

1. Cuando lo abres por primera vez, las clases indican que tiene un valor válido, que el valor no ha sido cambiado desde la inicialización o reset, y que el control no ha sido visitado desde la inicialización o reset.

   <docs-code language="html">

   <input class="form-control ng-untouched ng-pristine ng-valid">;

   </docs-code>

1. Realiza las siguientes acciones en la caja de entrada `<input>` **Name**, y observa qué clases aparecen.

   - Observa sin tocar.
     Las clases indican que está sin tocar, pristino y válido.

   - Haz clic dentro de la caja de nombre, luego haz clic fuera de ella.
     El control ahora ha sido visitado, y el elemento tiene la clase `ng-touched` en lugar de la clase `ng-untouched`.

   - Agrega barras al final del nombre.
     Ahora está en estado `touched` y `dirty`.

   - Borra el nombre.
     Esto hace que el valor sea inválido, por lo que la clase `ng-invalid` reemplaza la clase `ng-valid`.

### Crea retroalimentación visual para los estados

El par `ng-valid`/`ng-invalid` es particularmente interesante, porque quieres enviar una
señal visual fuerte cuando los valores son inválidos.
También quieres marcar campos requeridos.

Puedes marcar campos requeridos y datos inválidos al mismo tiempo con una barra coloreada
a la izquierda de la caja de entrada.

Para cambiar la apariencia de esta manera, sigue estos pasos.

1. Agrega definiciones para las clases CSS `ng-*`.
1. Agrega estas definiciones de clase a un nuevo archivo `forms.css`.
1. Agrega el nuevo archivo al proyecto como hermano de `index.html`:

<docs-code header="src/assets/forms.css" language="css" path="adev/src/content/examples/forms/src/assets/forms.css"/>

1. In the `index.html` file, update the `<head>` tag to include the new style sheet.

<docs-code header="src/index.html (styles)" path="adev/src/content/examples/forms/src/index.html" visibleRegion="styles"/>

### Mostrar y ocultar mensajes de error de validación

La caja de entrada **Name** es requerida y limpiarla convierte la barra en roja.
Eso indica que algo está mal, pero el usuario no sabe qué está mal o qué hacer al respecto.
Puedes proporcionar un mensaje útil verificando y respondiendo al estado del control.

El control de de selección **Skill** también es requerida, pero no necesita este tipo de manejo de errores porque ya restringe la selección a valores válidos.

Para definir y mostrar un mensaje de error cuando sea apropiado, sigue estos pasos.

<docs-workflow>
<docs-step title="Agregar una referencia local a la entrada">
Extiende la etiqueta `input` con una variable de referencia de plantilla que puedes usar para acceder al control Angular de la caja de entrada desde dentro de la plantilla. En el ejemplo, la variable es `#name="ngModel"`.

La variable de referencia de plantilla (`#name`) se establece como `"ngModel"` porque ese es el valor de la propiedad [`NgModel.exportAs`](api/core/Directive#exportAs). Esta propiedad le dice a Angular cómo vincular una variable de referencia a una directiva.
</docs-step>

<docs-step title="Agregar el mensaje de error">
Agrega un `<div>` que contenga un mensaje de error apropiado.
</docs-step>

<docs-step title="Hacer el mensaje de error condicional">
Muestra u oculta el mensaje de error vinculando propiedades del control `name` a la propiedad `hidden` del elemento `<div>` del mensaje.
</docs-step>

<docs-code header="src/app/actor-form/actor-form.component.html (hidden-error-msg)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="hidden-error-msg"/>

<docs-step title="Agregar un mensaje de error condicional al nombre">
Agrega un mensaje de error condicional a la caja de entrada `name`, como en el siguiente ejemplo.

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="name-with-error-msg"/>
</docs-step>
</docs-workflow>

<docs-callout title='Ilustrando el estado "pristine"'>

En este ejemplo, ocultas el mensaje cuando el control es válido o _pristine_.
Pristine significa que el usuario no ha cambiado el valor desde que se mostró en este formulario.
Si ignoras el estado `pristine`, ocultarías el mensaje solo cuando el valor es válido.
Si llegas a este componente con un actor nuevo y en blanco o un actor inválido, verás el mensaje de error inmediatamente, antes de haber hecho algo.

Podrías querer que el mensaje se muestre solo cuando el usuario hace un cambio inválido.
Ocultar el mensaje mientras el control está en el estado `pristine` logra ese objetivo.
Verás la importancia de esta elección cuando agregues un nuevo actor al formulario en el siguiente paso.

</docs-callout>

## Agrega un nuevo actor

Este ejercicio muestra cómo puedes responder a un evento de clic de botón HTML nativo agregando al modelo de datos.
Para permitir que los usuarios del formulario agreguen un nuevo actor, agregarás un botón **New Actor** que responde a un evento de clic.

1. En la plantilla, coloca un elemento `<button>` "New Actor" en la parte inferior del formulario.
1. En el archivo del componente, agrega el método de creación de actor al modelo de datos de actor.

<docs-code header="src/app/actor-form/actor-form.component.ts (New Actor method)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="new-actor"/>

1. Vincula el evento de clic del botón a un método de creación de actor, `newActor()`.

<docs-code header="src/app/actor-form/actor-form.component.html (New Actor button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-no-reset"/>

1. Ejecuta la aplicación nuevamente y haz clic en el botón **New Actor**.

   El formulario se limpia, y las barras _required_ a la izquierda de la caja de entrada se vuelven rojas, indicando propiedades `name` y `skill` inválidas.
   Observa que los mensajes de error están ocultos.
   Esto es porque el formulario es pristino; no has cambiado nada aún.

1. Ingresa un nombre y haz clic en **New Actor** nuevamente.

   Ahora la aplicación muestra un mensaje de error `Name is required`, porque la caja de entrada ya no está en estado `pristine`.
   El formulario recuerda que ingresaste un nombre antes de hacer clic en **New Actor**.

1. Para restaurar el estado pristino de los controles del formulario, limpia todas las banderas imperativamente llamando al método `reset()` del formulario después de llamar al método `newActor()`.

   <docs-code header="src/app/actor-form/actor-form.component.html (Reset the form)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-form-reset"/>

   Ahora hacer clic en **New Actor** resetea tanto el formulario como sus banderas de control.

## Enviar el formulario con `ngSubmit`

El usuario debería poder enviar este formulario después de llenarlo.
El botón **Submit** en la parte inferior del formulario no hace nada por sí solo, pero activa un evento de envío de formulario debido a su tipo (`type="submit"`).

Para responder a este evento, sigue los siguientes pasos.

<docs-workflow>

<docs-step title="Escuchar ngOnSubmit">
Vincula la propiedad de evento [`ngSubmit`](api/forms/NgForm#properties) del formulario al método `onSubmit()` del componente actor-form.

<docs-code header="src/app/actor-form/actor-form.component.html (ngSubmit)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngSubmit"/>
</docs-step>

<docs-step title="Vincular la propiedad disabled">
Usa la variable de referencia de plantilla, `#actorForm` para acceder al formulario que contiene el botón **Submit** y crear un enlace de evento.

Vincularás la propiedad del formulario que indica su validez general a la propiedad `disabled` del botón **Submit**.

<docs-code header="src/app/actor-form/actor-form.component.html (submit-button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submit-button"/>
</docs-step>

<docs-step title="Ejecutar la aplicación">
Observa que el botón está habilitado —aunque aún no hace nada útil.
</docs-step>

<docs-step title="Eliminar el valor Name">
Esto viola la regla "required", así que muestra el mensaje de error —y observa que también deshabilita el botón **Submit**.

No tuviste que conectar explícitamente el estado habilitado del botón a la validez del formulario.
`FormsModule` hizo esto automáticamente cuando definiste una variable de referencia de plantilla en el elemento de formulario mejorado, luego referiste a esa variable en el control del botón.
</docs-step>
</docs-workflow>

### Responder al envío del formulario

Para mostrar una respuesta al envío del formulario, puedes ocultar el área de entrada de datos y mostrar algo más en su lugar.

<docs-workflow>
<docs-step title="Envolver el formulario">
Envuelve todo el formulario en un `<div>` y vincula su propiedad `hidden` a la propiedad `ActorFormComponent.submitted`.

<docs-code header="src/app/actor-form/actor-form.component.html (extracto)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="edit-div"/>

El formulario principal es visible desde el inicio porque la propiedad `submitted` es falsa hasta que envías el formulario, como muestra este fragmento de `ActorFormComponent`:

<docs-code header="src/app/actor-form/actor-form.component.ts (submitted)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="submitted"/>

Cuando haces clic en el botón **Submit**, la bandera `submitted` se vuelve verdadera y el formulario desaparece.
</docs-step>

<docs-step title="Agregar el estado enviado">
Para mostrar algo más mientras el formulario está en el estado enviado, agrega el siguiente HTML debajo del nuevo envoltorio `<div>`.

<docs-code header="src/app/actor-form/actor-form.component.html (extracto)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submitted"/>

Este `<div>`, que muestra un actor de solo lectura con enlaces de interpolación, aparece solo mientras el componente está en el estado enviado.

La visualización alternativa incluye un botón _Edit_ cuyo evento de clic está vinculado a una expresión que limpia la bandera `submitted`.
</docs-step>

<docs-step title="Probar el botón Edit">
Haz clic en el botón *Edit* para cambiar la visualización de vuelta al formulario editable.
</docs-step>
</docs-workflow>

## Resumen

El formulario de Angular discutido en esta página aprovecha las siguientes
características del framework para proporcionar soporte para modificación de datos, validación y más.

- Una plantilla de formulario HTML de Angular
- Una clase de componente de formulario que utiliza un decorador  `@Component`
- Manejo del envío del formulario vinculando a la propiedad de evento `NgForm.ngSubmit`
- Variables de referencia de plantilla como `#actorForm` y `#name`
- Sintaxis `[(ngModel)]` para enlace de datos bidireccional
- El uso de atributos `name` para la validación y el seguimiento de lo scambios en los elementos del formulario
- La propiedad `valid` de la variable de referencia en controles de entrada indica si un control es válido o debería mostrar mensajes de error
- Controlar el estado habilitado del botón **Submit** vinculando a la validez de `NgForm`
- Clases CSS personalizadas que proporcionan retroalimentación visual a los usuarios sobre controles que no son válidos

Aquí está el código para la versión final de la aplicación:

<docs-code-multifile>
    <docs-code header="actor-form/actor-form.component.ts" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="final"/>
    <docs-code header="actor-form/actor-form.component.html" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="final"/>
    <docs-code header="actor.ts" path="adev/src/content/examples/forms/src/app/actor.ts"/>
    <docs-code header="app.component.html" path="adev/src/content/examples/forms/src/app/app.component.html"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/forms/src/app/app.component.ts"/>
    <docs-code header="main.ts" path="adev/src/content/examples/forms/src/main.ts"/>
    <docs-code header="forms.css" path="adev/src/content/examples/forms/src/assets/forms.css"/>
</docs-code-multifile>
