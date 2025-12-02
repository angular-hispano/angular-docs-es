# Construir formularios dinámicos

Muchos formularios, como los cuestionarios, pueden ser muy similares entre sí en formato y propósito. 
Para hacer que sea más rápido y fácil generar diferentes versiones de dicho formulario, puedes crear una _plantilla de formulario dinámico_ basada en metadatos que describen el modelo de objeto de negocio. 
Luego, utiliza la plantilla para generar nuevos formularios automáticamente, de acuerdo con los cambios en el modelo de datos.

La técnica es particularmente útil cuando tienes un tipo de formulario cuyo contenido debe cambiar frecuentemente para cumplir con requisitos de negocio y regulatorios que cambian rápidamente.
Un caso de uso típico es un cuestionario.
Podrías necesitar obtener entrada de usuarios en diferentes contextos.
El formato y estilo de los formularios que ve un usuario deben permanecer constantes, mientras que las preguntas reales que necesitas hacer varían con el contexto.

En este tutorial construirás un formulario dinámico que presenta un cuestionario básico.
Construyes una aplicación en línea para héroes que buscan empleo.
La agencia está constantemente ajustando el proceso de aplicación, pero usando el formulario dinámico
puedes crear los nuevos formularios sobre la marcha sin cambiar el código de la aplicación.

El tutorial te guía a través de los siguientes pasos.

1. Habilitar formularios reactivos para un proyecto.
1. Establecer un modelo de datos para representar controles de formulario.
1. Poblar el modelo con datos de muestra.
1. Desarrollar un componente para crear controles de formulario dinámicamente.

El formulario que creas utiliza validación de entrada y estilos para mejorar la experiencia del usuario. 
Tiene un botón de envío que solo se habilita cuando toda la entrada del usuario es válida, y marca la entrada no válida con codificación de colores y mensajes de error.

La versión básica puede evolucionar para admitir una variedad más amplia de preguntas, un renderizado más elegante y una mejor experiencia de usuario.

## Habilitar formularios reactivos para tu proyecto

Los formularios dinámicos se basan en formularios reactivos.

Para que la aplicación tenga acceso a las directivas de formularios reactivos, importa `ReactiveFormsModule` de la biblioteca `@angular/forms` en los componentes necesarios.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
    <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

## Crea un modelo de objeto de formulario

Un formulario dinámico requiere un modelo de objeto que pueda describir todos los escenarios necesarios para la funcionalidad del formulario.
El formulario de solicitud de héroe de ejemplo es un conjunto de preguntas, es decir, cada control en el formulario debe hacer una pregunta y aceptar una respuesta.

El modelo de datos para este tipo de formulario debe representar una pregunta.
El ejemplo incluye el `DynamicFormQuestionComponent`, que define una pregunta como el objeto base del modelo.

El siguiente `QuestionBase` es una clase base para un conjunto de controles que pueden representar la pregunta y su respuesta en el formulario.

<docs-code header="question-base.ts" path="adev/src/content/examples/dynamic-form/src/app/question-base.ts"/>

### Define clases de control

Desde esta base, el ejemplo deriva dos nuevas clases, `TextboxQuestion` y `DropdownQuestion`, que representan diferentes tipos de control.
Cuando creas la plantilla del formulario en el siguiente paso, instancias estos tipos específicos de pregunta para renderizar los controles apropiados dinámicamente.

El tipo de control `TextboxQuestion` se representa en una plantilla de formulario usando un elemento `<input>`. Presenta una pregunta y permite a los usuarios introducir datos. El atributo `type` del elemento se define basado en el campo `type` especificado en el argumento `options` (por ejemplo `text`, `email`, `url`).

<docs-code header="question-textbox.ts" path="adev/src/content/examples/dynamic-form/src/app/question-textbox.ts"/>

El tipo de control `DropdownQuestion` presenta una lista de opciones en una caja de selección.

 <docs-code header="question-dropdown.ts" path="adev/src/content/examples/dynamic-form/src/app/question-dropdown.ts"/>

### Compón grupos de formulario

Un formulario dinámico usa un servicio para crear conjuntos agrupados de controles de entrada, basado en el modelo del formulario.
El siguiente `QuestionControlService` recopila un conjunto de instancias de `FormGroup` que consumen los metadatos del modelo de preguntas.
Puedes especificar valores por defecto y reglas de validación.

<docs-code header="question-control.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question-control.service.ts"/>

## Compón el contenido del formulario dinámico

El formulario dinámico se representa mediante un componente contenedor, que se agrega en un paso posterior.
Cada pregunta está representada en la plantilla del componente del formulario por una etiqueta `<app-question>`, que coincide con una instancia de `DynamicFormQuestionComponent`.

El `DynamicFormQuestionComponent` es responsable de renderizar los detalles de una pregunta individual basado en valores en el objeto de pregunta vinculado a datos.
El formulario se basa en una directiva [`[formGroup]`](api/forms/FormGroupDirective "Referencia de API") para conectar el HTML de la plantilla a los objetos de control subyacentes.
El `DynamicFormQuestionComponent` crea grupos de formulario y los puebla con controles definidos en el modelo de pregunta, especificando reglas de visualización y validación.

<docs-code-multifile>
  <docs-code header="dynamic-form-question.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.html"/>
  <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

El objetivo del `DynamicFormQuestionComponent` es presentar tipos de pregunta definidos en tu modelo.
Solo tienes dos tipos de preguntas en este punto pero puedes imaginar muchas más.
El bloque `@switch` en la plantilla determina qué tipo de pregunta se debe mostrar.
El switch usa directivas con los selectores [`formControlName`](api/forms/FormControlName "Referencia de API de la directiva FormControlName") y [`formGroup`](api/forms/FormGroupDirective "Referencia de API de FormGroupDirective").
Ambas directivas están definidas en `ReactiveFormsModule`.

### Proporcionar datos

Se requiere otro servicio para proporcionar un conjunto específico de preguntas a partir del cual se construirá un formulario individual.
Para este ejercicio creas el `QuestionService` para proporcionar este array de preguntas desde los datos de muestra codificados.
En una aplicación del mundo real, el servicio podría obtener datos de un sistema backend.
El punto clave, sin embargo, es que controlas las preguntas de aplicación de trabajo de héroe completamente a través de los objetos devueltos de `QuestionService`.
Para mantener el cuestionario a medida que cambian los requisitos, solo necesitas agregar, actualizar y eliminar objetos del array `questions`.

El `QuestionService` proporciona un conjunto de preguntas en forma de un array vinculado a `input()` questions.

<docs-code header="question.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question.service.ts"/>

## Crea una plantilla de formulario dinámico

El componente `DynamicFormComponent` es el punto de entrada y el contenedor principal para el formulario, que se representa usando `<app-dynamic-form>` en una plantilla.

El componente `DynamicFormComponent` presenta una lista de preguntas vinculando cada una a un elemento `<app-question>` que coincide con el `DynamicFormQuestionComponent`.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.html"/>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
</docs-code-multifile>

### Muestra el formulario

Para mostrar una instancia del formulario dinámico, la plantilla shell `AppComponent` pasa el array `questions` devuelto por el `QuestionService` al componente contenedor del formulario, `<app-dynamic-form>`.

<docs-code header="app.component.ts" path="adev/src/content/examples/dynamic-form/src/app/app.component.ts"/>

Esta separación de modelo y datos te permite reutilizar los componentes para cualquier tipo de encuesta, siempre que sea compatible con el modelo de objeto _question_.

### Asegurando datos válidos

La plantilla del formulario usa vinculación dinámica de datos de metadatos para renderizar el formulario sin hacer suposiciones codificadas sobre preguntas específicas.
Agrega tanto metadatos de control como criterios de validación dinámicamente.

Para garantizar que la entrada sea válida, el botón _Save_ está deshabilitado hasta que el formulario está en un estado válido.
Cuando el formulario es válido, haz clic en _Save_ y la aplicación renderiza los valores actuales del formulario como JSON.

La siguiente figura muestra el formulario final.

<img alt="Dynamic-Form" src="assets/images/guide/dynamic-form/dynamic-form.png">

## Próximos pasos

<docs-pill-row>
  <docs-pill title="Validar entrada de formulario" href="guide/forms/reactive-forms#validating-form-input" />
  <docs-pill title="Guía de validación de formularios" href="guide/forms/form-validation" />
</docs-pill-row>
