# Formularios reactivos

Los formularios reactivos proporcionan un enfoque basado en un modelo para manejar las entradas de un formulario cuyos valores cambian con el tiempo. 
Esta guía te muestra cómo crear y actualizar un control de formulario básico, usar múltiples controles en un grupo, validar los valores de un formulario y crear formularios dinámicos en los que puedes agregar o eliminar controles en tiempo de ejecución.

## Visión general de los formularios reactivos

Los formularios reactivos usan un enfoque explícito e inmutable para gestionar el estado de un formulario en cualquier momento.
Cada cambio en el estado del formulario devuelve un nuevo estado, lo que mantiene la integridad del modelo entre cambios.
Los formularios reactivos se construyen alrededor de flujos observables, donde las entradas y los valores del formulario se proporcionan como flujos de valores de entrada, a los que se puede acceder de forma síncrona.

Los formularios reactivos también proporcionan un camino directo hacia las pruebas porque tienes la seguridad de que tus datos son consistentes y predecibles cuando se solicitan.
Cualquier consumidor de los flujos tiene puede manipular esos datos de forma segura.

Los formularios reactivos difieren de los [formularios basados en plantillas](guide/forms/template-driven-forms) de maneras distintas.
Los formularios reactivos proporcionan acceso síncrono al modelo de datos, inmutabilidad con operadores observables y seguimiento de cambios a través de flujos observables.

Los formularios basados en plantillas permiten acceso directo para modificar datos en tu plantilla, pero son menos explícitos que los formularios reactivos porque dependen de directivas incrustadas en la plantilla, junto con datos mutables para rastrear cambios de forma asíncrona.
Consulta la [Visión general de Formularios](guide/forms) para comparaciones detalladas entre los dos paradigmas.

## Añadiendo un control de formulario básico

Para usar controles de formulario, hay tres pasos.

1. Generar un nuevo componente y registrar el módulo de formularios reactivos. Este módulo declara las directivas de formularios reactivos que necesitas para usar formularios reactivos.
1. Instanciar un `FormControl`.
1. Registrar el `FormControl` en la plantilla.

Luego puedes mostrar el formulario agregando el componente a la plantilla.

Los siguientes ejemplos muestran cómo agregar un único control de formulario.
En el ejemplo, el usuario ingresa su nombre en un campo de entrada, captura ese valor de entrada y muestra el valor actual del control del formulario.

<docs-workflow>

<docs-step title="Generar un nuevo componente e importar ReactiveFormsModule">
Usa el comando CLI `ng generate component` para generar un componente en tu proyecto e importa `ReactiveFormsModule` del paquete `@angular/forms` y agrégalo al array de `imports` de tu Componente.

<docs-code header="src/app/name-editor/name-editor.component.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="imports" />
</docs-step>

<docs-step title="Declarar una instancia de FormControl">
Usa el constructor de `FormControl` para establecer su valor inicial, que en este caso es una cadena vacía. Al crear estos controles en tu clase de componente, obtienes acceso inmediato para escuchar, actualizar y validar el estado de la entrada del formulario.

<docs-code header="src/app/name-editor/name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="create-control"/>
</docs-step>

<docs-step title="Registrar el control en la plantilla">
Después de crear el control en la clase del componente, debes asociarlo con un control de formulario en la plantilla. Actualiza la plantilla con el control de formulario usando el enlace `formControl` proporcionado por `FormControlDirective`, que también está incluido en `ReactiveFormsModule`.

<docs-code header="src/app/name-editor/name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="control-binding" />

Usando la sintaxis de enlace de plantilla, el control de formulario ahora está registrado en el elemento de entrada `name` de la plantilla. El control de formulario y el elemento DOM se comunican entre sí: la vista refleja cambios en el modelo, y el modelo refleja los cambios en la vista.
</docs-step>

<docs-step title="Mostrar el componente">
El `FormControl` asignado a la propiedad `name` se muestra cuando el componente `<app-name-editor>` se agrega a una plantilla.

<docs-code header="src/app/app.component.html (editor de nombre)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" visibleRegion="app-name-editor"/>
</docs-step>
</docs-workflow>

### Mostrando un valor de control de formulario

Puedes mostrar el valor de las siguientes maneras:

- A través del observable `valueChanges`, donde puedes escuchar cambios en el valor del formulario en la plantilla usando `AsyncPipe` o en la clase del componente usando el método `subscribe()`
- Con la propiedad `value`, que te da proporciona el valor actual en ese momento.

El siguiente ejemplo te muestra cómo mostrar el valor actual usando interpolación en la plantilla. 

<docs-code header="src/app/name-editor/name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="display-value"/>

El valor mostrado cambia a medida que actualizas el control del formulario.

Los formularios reactivos proporcionan acceso a información sobre un control dado a través de propiedades y métodos proporcionados con cada instancia.
Estas propiedades y métodos de la clase subyacente [AbstractControl](api/forms/AbstractControl 'Referencia de API') se usan para controlar el estado del formulario y determinar cuándo mostrar mensajes al manejar [validación de entrada](#validating-form-input 'Aprende más sobre validación de la entrada de formulario').

Lee sobre otras propiedades y métodos de `FormControl` en la [Referencia de API](api/forms/FormControl 'Referencia de sintaxis detallada').

### Reemplazando un valor de control de formulario

Los formularios reactivos tienen métodos para cambiar el valor de un control de forma programática, lo que te da la flexibilidad de actualizar el valor sin necesidad de la interacción del usuario.
Una instancia de `FormControl` proporciona un método `setValue()` que actualiza el valor del control de formulario y valida la estructura del valor proporcionado contra la estructura del control.
Por ejemplo, cuando recuperas datos del formulario desde una API o servicio backend, usa el método `setValue()` para actualizar el control a su nuevo valor, reemplazando completamente el valor anterior.

El siguiente ejemplo agrega un método a la clase del componente para actualizar el valor del control a _Nancy_ usando el método `setValue()`.

<docs-code header="src/app/name-editor/name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="update-value"/>

Actualiza la plantilla con un botón para simular una actualización de nombre.
Cuando haces clic en el botón **Actualizar Nombre**, el valor ingresado en el control del formulario se refleja como su valor actual.

<docs-code header="src/app/name-editor/name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="update-value"/>

El modelo del formulario es la fuente de la verdad para el control. Por lo tanto, cuando haces clic en el botón, el valor de la entrada cambia dentro de la clase del componente, sobrescribiendo su valor actual.

ÚTIL: En este ejemplo, estás usando un control único.
Cuando uses el método `setValue()` con una instancia de [grupo de formulario](#grouping-form-controls) o [array de formulario](#creating-dynamic-forms), el valor necesita coincidir con la estructura del grupo o array.

## Agrupando controles de formulario

Los formularios típicamente contienen varios controles relacionados.
Los formularios reactivos proporcionan dos formas de agrupar múltiples controles relacionados en un formulario de entrada único.

| Grupos de formulario | Detalle                                                                                                                                                                                                                                                |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form group  | Define un formulario con un conjunto fijo de controles que puedes gestionar juntos. Los conceptos básicos del grupo de formulario se discuten en esta sección. También puedes [anidar grupos de formulario](#creating-nested-form-groups 'Ver más sobre anidar grupos') para crear formularios más complejos. |
| Form array  | Define un formulario dinámico, en los que puedes agregar y eliminar controles en tiempo de ejecución. También puedes anidar arrays de formulario para crear formularios más complejos. Para más sobre esta opción, consulta [Crear formularios dinámicos](#creating-dynamic-forms).                              |

Al igual que una instancia de `FormControl` (control de formulario) te da control sobre un solo campo de entrada, una instancia de `FormGroup` (grupo de formulario) rastrea el estado del formulario de un grupo de instancias de `FormControl` (por ejemplo, un formulario). 
Cada control en una instancia de `FormGroup` se rastrea por nombre al crear el grupo. 
El siguiente ejemplo muestra cómo gestionar múltiples instancias de `FormControl` en un solo grupo.

Genera un componente `ProfileEditor` e importa las clases `FormGroup` y `FormControl` del paquete `@angular/forms`.

<docs-code language="shell">
ng generate component ProfileEditor
</docs-code>

<docs-code header="src/app/profile-editor/profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="imports"/>

Para agregar un grupo de formulario a este componente, sigue los siguientes pasos.

1. Crear una instancia de `FormGroup`.
1. Asociar el modelo y vista de `FormGroup`.
1. Guardar los datos del formulario.

<docs-workflow>

<docs-step title="Crear una instancia de FormGroup">
Crea una propiedad en la clase del componente llamada `profileForm` y establece la propiedad a una nueva instancia de `FormGroup`. Para inicializar el `FormGroup`, proporciona al constructor un objeto de claves nombradas mapeadas a su control.

Para el formulario de perfil, agrega dos instancias de `FormControl` con los nombres `firstName` y `lastName`

<docs-code header="src/app/profile-editor/profile-editor.component.ts (grupo de formulario)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="formgroup"/>

Los controles de formulario individuales ahora están recopilados dentro de un grupo. Una instancia de `FormGroup` proporciona su valor de modelo como un objeto reducido de los valores de cada control en el grupo. Una instancia de `FormGroup` tiene las mismas propiedades \(como `value` y `untouched`\) y métodos \(como `setValue()`\) que una instancia de control de formulario.
</docs-step>

<docs-step title="Asociar el modelo y vista de FormGroup">
Un grupo de formulario rastrea el estado y los cambios para cada uno de sus controles, por lo que si uno de los controles cambia, el control padre también emite un nuevo estado o cambio de valor. El modelo para el grupo se mantiene a partir de sus miembros. Después de definir el modelo, debes actualizar la plantilla para reflejar el modelo en la vista.

<docs-code header="src/app/profile-editor/profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="formgroup"/>

Así como un grupo de formulario contiene un grupo de controles, el `FormGroup` _profileForm_ está vinculado al elemento `form` con la directiva `FormGroup`, creando una capa de comunicación entre el modelo y el formulario que contiene las entradas. La entrada `formControlName` proporcionada por la directiva `FormControlName` vincula cada entrada individual al control de formulario definido en `FormGroup`. Los controles de formulario se comunican con sus respectivos elementos. También comunican cambios a la instancia de `FormGroup`, que proporciona la fuente de verdad para el valor del modelo.
</docs-step>

<docs-step title="Guardar datos del formulario">
El componente `ProfileEditor` acepta entrada del usuario, pero en un escenario real quieres capturar el valor del formulario y hacerlo disponible para procesamiento adicional fuera del componente. La directiva `FormGroup` escucha el evento `submit` emitido por el elemento `form` y emite un evento `ngSubmit` que puedes vincular a una función de callback. Agrega un listener de evento `ngSubmit` a la etiqueta `form` con el método de callback `onSubmit()`.

<docs-code header="src/app/profile-editor/profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="ng-submit"/>

El método `onSubmit()` en el componente `ProfileEditor` captura el valor actual de `profileForm`. Usa `EventEmitter` para mantener el formulario encapsulado y proporcionar el valor del formulario fuera del componente. El siguiente ejemplo usa `console.warn` para registrar un mensaje en la consola del navegador.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="on-submit"/>

El evento `submit` es emitido por la etiqueta `form` usando el evento DOM integrado. Activas el evento haciendo clic en un botón con tipo `submit`. Esto permite que el usuario presionar la tecla **Enter** para enviar el formulario completado.

Usa un elemento `button` para agregar un botón al final del formulario para activar el envío del formulario.

<docs-code header="src/app/profile-editor/profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="submit-button"/>

El botón en el fragmento anterior también tiene un enlace `disabled` adjunto para deshabilitar el botón cuando `profileForm` es inválido. Aún no estás realizando ninguna validación, así que el botón siempre está habilitado. La validación básica de formularios se cubre en la sección [Validar entrada de formulario](#validating-form-input).
</docs-step>

<docs-step title="Mostrar el componente">
Para mostrar el componente `ProfileEditor` que contiene el formulario, agrégalo a una plantilla de componente.

<docs-code header="src/app/app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" visibleRegion="app-profile-editor"/>

`ProfileEditor` te permite gestionar las instancias de `FormControl` para los controles `firstName` y `lastName` dentro de la instancia de `FormGroup`.

### Creando grupos de formulario anidados

Los `FormGroup` pueden aceptar tanto instancias de `FormControl` individuales como otras instancias de `FormGroup` como hijos. 
Esto hace que la composición de modelos de formulario complejos sea más fácil de mantener y agruparlos lógicamente.

Al construir formularios complejos, gestionar las diferentes áreas de información es más fácil en secciones más pequeñas. 
Usar una instancia de `FormGroup` anidado te permite dividir grandes grupos de formularios en otros más pequeños y manejables.

Para hacer formularios más complejos, sigue estos pasos.

1. Crear un grupo anidado.
1. Agrupar el formulario anidado en la plantilla.

Algunos tipos de información naturalmente caen en el mismo grupo.
Un nombre y dirección son ejemplos típicos de tales grupos anidados, y se usan en los siguientes ejemplos.

<docs-workflow>
<docs-step title="Crear un grupo anidadop">
Para crear un grupo anidado en `profileForm`, agrega un elemento anidado `address` a la instancia de `FormGroup`.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="nested-formgroup"/>

En este ejemplo, `address group` combina los controles actuales `firstName` y `lastName` con los nuevos controles `street`, `city`, `state`, y `zip`. Aunque el elemento `address` en el grupo de formulario es un hijo del elemento general `profileForm` en el grupo de formulario, las mismas reglas se aplican con cambios de valor y estado. Los cambios en estado y valor del grupo de formulario anidado se propagan al grupo de formulario padre, manteniendo consistencia con el modelo general.
</docs-step>

<docs-step title="Agrupar el formulario anidado en la plantilla">
Después de actualizar el modelo en la clase del componente, actualiza la plantilla para conectar la instancia de `FormGroup` y sus elementos de entrada. Agrega el grupo de formulario `address` que contiene los campos `street`, `city`, `state`, y `zip` a la plantilla `ProfileEditor`.

<docs-code header="src/app/profile-editor/profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="formgroupname"/>

El formulario `ProfileEditor` se muestra como un grupo, pero el modelo se descompone más para representar las áreas de agrupación lógica.

Muestra el valor para la instancia de `FormGroup` en la plantilla del componente usando la propiedad `value` y `JsonPipe`.
</docs-step>
</docs-workflow>

### Actualizando partes del modelo de datos

Cuando actualizas el valor de una instancia de `FormGroup` que contiene múltiples controles, es posible que solo desees actualizar partes del modelo. 
Esta sección cubre cómo actualizar partes específicas del modelo de datos de un control de formulario.

Hay dos formas de actualizar el valor del modelo:

| Métodos        | Detalles                                                                                                                                                               |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setValue()`   | Establece un nuevo valor para un control individual. El método `setValue()` se adhiere estrictamente a la estructura del grupo de formulario y reemplaza el valor completo del control. |
| `patchValue()` | Reemplaza cualquier propiedad definida en el objeto que haya cambiado en el modelo del formulario.                                                                                     |

Las verificaciones estrictas del método `setValue()` ayudan a detectar errores de anidación en formularios complejos, mientras que `patchValue()` no muestra un error en estos casos.

En `ProfileEditorComponent`, usa el método `updateProfile` con el siguiente ejemplo para actualizar el nombre y la dirección de la calle para el usuario.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="patch-value"/>

Simula una actualización agregando un botón a la plantilla para actualizar el perfil del usuario bajo demanda.

<docs-code header="src/app/profile-editor/profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="patch-value"/>

Cuando un usuario hace clic en el botón, el modelo `profileForm` se actualiza con nuevos valores para `firstName` y `street`. Observa que `street` se proporciona en un objeto dentro de la propiedad `address`.
Esto es necesario porque el método `patchValue()` aplica la actualización contra la estructura del modelo.
`PatchValue()` solo actualiza propiedades que el modelo del formulario define.

## Empleando el servicio FormBuilder para generar controles

Crear instancias de `FormControl` manualmente puede volverse repetitivo cuando se trabaja con múltiples formularios.
El servicio `FormBuilder` proporciona métodos convenientes para generar controles.

Usa los siguientes pasos para aprovechar este servicio.

1. Importar la clase `FormBuilder`.
1. Inyectar el servicio `FormBuilder`.
1. Generar el contenido del formulario.

Los siguientes ejemplos muestran cómo refactorizar el componente `ProfileEditor` para usar el servicio form builder para crear instancias de `FormControl` y `FormGroup`.

<docs-workflow>
<docs-step title="Importar la clase FormBuilder">
Importa la clase `FormBuilder` del paquete `@angular/forms`.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-builder-imports"/>

</docs-step>

<docs-step title="Inyectar el servicio FormBuilder">
El servicio `FormBuilder` es un proveedor inyectable del módulo de formularios reactivos. Usa la función `inject()` para inyectar esta dependencia en tu componente.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (property init)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="inject-form-builder"/>

</docs-step>
<docs-step title="Generar controles de formulario">
El servicio `FormBuilder` tiene tres métodos: `control()`, `group()` y `array()`. Estos son métodos de fábrica para generar instancias en tus clases de componente incluyendo controles de formulario, grupos de formulario y arrays de formulario. Usa el método `group` para crear los controles de `profileForm`.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-builder"/>

En el ejemplo anterior, usas el método `group()` con el mismo objeto para definir las propiedades en el modelo. El valor para cada nombre de control es un array que contiene el valor inicial como el primer elemento en el array.

SUGERENCIA:  Puedes definir el control con solo el valor inicial, pero si tus controles necesitan validación síncrona o asíncrona, agrega validadores síncronos y asíncronos como el segundo y tercer elemento en el array. Compara usar el form builder con crear las instancias manualmente.

  <docs-code-multifile>
    <docs-code header="src/app/profile-editor/profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="formgroup-compare"/>
    <docs-code header="src/app/profile-editor/profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## Validando la entrada de formulario

_La validación de formularios_ se usa para asegurar que la entrada del usuario sea completa y correcta.
Esta sección cubre agregar un validador único a un control de formulario y cómo mostrar el estado general del formulario.
La validación de formularios se cubre más extensivamente en la guía [Validación de Formularios](guide/forms/form-validation).

Usa los siguientes pasos para agregar validación de formulario.

1. Importar una función validadora en tu componente de formulario.
1. Agregar el validador al campo en el formulario.
1. Agregar lógica para manejar el estado de validación.

La validación más común es hacer un campo requerido.
El siguiente ejemplo muestra cómo agregar una validación requerida al control `firstName` y mostrar el resultado de la validación.

<docs-workflow>
<docs-step title="Importar una función validadora">
Los formularios reactivos incluyen un conjunto de funciones validadoras para casos de uso comunes. Estas funciones reciben un control, lo validan y devuelven un objeto de error o un valor nulo según el resultado de la verificación.

Importa la clase `Validators` del paquete `@angular/forms`.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="validator-imports"/>
</docs-step>

<docs-step title="Hacer un campo requerido">
En el componente `ProfileEditor`, agrega el método estático `Validators.required` como el segundo elemento en el array para el control `firstName`.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="required-validator"/>
</docs-step>

<docs-step title="Mostrar estado del formulario">
Cuando agregas un campo requerido a un control del formulario, su estado inicial es inválido. Este estado inválido se propaga al elemento del grupo de formulario padre, haciendo su estado inválido. Accede al estado actual de la instancia de `FormGroup` a través de su propiedad `status`.

Muestra el estado actual de `profileForm` usando interpolación.

<docs-code header="src/app/profile-editor/profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="display-status"/>

El botón **Submit** está deshabilitado porque `profileForm` es inválido debido al control de formulario `firstName` requerido. Después de completar la entrada `firstName`, el formulario se vuelve válido y el botón **Submit** se habilita.

Para más información sobre la validación de formularios, visita la guía [Validación de Formularios](guide/forms/form-validation).
</docs-step>
</docs-workflow>

## Creando formularios dinámicos

`FormArray` es una alternativa a `FormGroup` para gestionar cualquier número de controles sin nombre.
Al igual que con las instancias de `FormGroup`, puedes insertar y eliminar controles dinámicamente de las instancias de `FormArray`, y el valor de la instancia de `FormArray` y el estado de validación se calcula desde sus controles hijos.
Sin embargo, no necesitas definir una clave para cada control por nombre, así que esta es una gran opción si no conoces el número de valores hijos de antemano.

Para definir un formulario dinámico, sigue estos pasos.

1. Importar la clase `FormArray`.
1. Definir un control `FormArray`.
1. Acceder al control `FormArray` con un método getter.
1. Mostrar el array de formulario en una plantilla.

El siguiente ejemplo te muestra cómo gestionar un array de _alias_ en `ProfileEditor`.

<docs-workflow>
<docs-step title="Importar la clase `FormArray`">
Importa la clase `FormArray` de `@angular/forms` para usar para información de tipo. El servicio `FormBuilder` está listo para crear una instancia de `FormArray`.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-array-imports"/>
</docs-step>

<docs-step title="Definir un control `FormArray`">
Puedes inicializar un array de formulario con cualquier número de controles, desde cero hasta muchos, definiéndolos en un array. Agrega una propiedad `aliases` a la instancia de `FormGroup` para `profileForm` para definir el array de formulario.

Usa el método `FormBuilder.array()` para definir el array, y el método `FormBuilder.control()` para poblar el array con un control inicial.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="aliases"/>

El control de alias dentro de la instancia de `FormGroup` ahora está poblado con un control único hasta que se agreguen más controles dinámicamente.
</docs-step>

<docs-step title="Acceder al control `FormArray`">
Un _getter_ proporciona acceso a los alias en la instancia de `FormArray` comparado con repetir el método `profileForm.get()` para obtener cada instancia. La instancia de `FormArray` representa un número indefinido de controles en un array. Es conveniente acceder a un control a través de un getter, y este enfoque es directo de repetir para controles adicionales. <br />

Usa la sintaxis getter para crear una propiedad de clase `aliases` para recuperar el control del `FormArray` de alias del grupo de formulario padre.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="aliases-getter"/>

Debido a que el control devuelto es del tipo `AbstractControl`, necesitas proporcionar un tipo explícito para acceder a la sintaxis del método para la instancia de `FormArray`. Define un método para insertar dinámicamente un control de alias en el array de formulario de alias. El método `FormArray.push()` inserta el control como un nuevo elemento en el array.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="add-alias"/>

En la plantilla, cada control se muestra como un campo de entrada separado.

</docs-step>

<docs-step title="Mostrar el array de formulario en la plantilla">

Para adjuntar los alias de tu modelo de formulario, debes agregarlo a la plantilla. Similar a la entrada `formGroupName` proporcionada por `FormGroupNameDirective`, `formArrayName` vincula la comunicación desde la instancia de `FormArray` a la plantilla con `FormArrayNameDirective`.

Agrega el siguiente HTML de plantilla después del `<div>` que cierra el elemento `formGroupName`.

<docs-code header="src/app/profile-editor/profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="formarrayname"/>

El bloque `@for` itera sobre cada instancia de `FormControl` proporcionada por la instancia de `FormArray` de alias. Debido a que los elementos del `FormArray` no tienen nombre, asignas el índice a la variable `i` y lo pasas a cada control para vincularlo a la entrada `formControlName`.

Cada vez que se agrega una nueva instancia de alias, la nueva instancia de `FormArray` se proporciona su control basado en el índice. Esto te permite rastrear cada control individual al calcular el estado y valor del control raíz.

</docs-step>

<docs-step title="Agregar un alias">

Inicialmente, el formulario contiene un campo `Alias`. Para agregar otro campo, haz clic en el botón **Add Alias**. También puedes validar el array de alias reportado por el modelo del formulario mostrado por `Form Value` en la parte inferior de la plantilla. En lugar de una instancia de `FormControl` para cada alias, puedes componer otra instancia de `FormGroup` con campos adicionales. El proceso de definir un control para cada elemento es el mismo.
</docs-step>

</docs-workflow>

## Resumen de API de formularios reactivos

La siguiente tabla lista las clases base y servicios usados para crear y gestionar controles de formulario reactivo.
Para detalles completos de sintaxis, consulta la documentación de referencia de API para el [paquete Forms](api#forms 'Referencia de API').

### Clases

| Clase             | Detailles                                                                                                                                                                                 |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AbstractControl` | La clase base abstracta para las clases concretas de control de formulario `FormControl`, `FormGroup`, y `FormArray`. Proporciona sus comportamientos y propiedades comunes.                           |
| `FormControl`     | Gestiona el valor y estado de validez de un control de formulario individual. Corresponde a un control de formulario HTML como `<input>` o `<select>`.                                            |
| `FormGroup`       | Gestiona el valor y estado de validez de un grupo de instancias de `AbstractControl`. Las propiedades del grupo incluyen sus controles hijos. El formulario de nivel superior en tu componente es `FormGroup`. |
| `FormArray`       | Gestiona el valor y estado de validez de un array indexado numéricamente de instancias de `AbstractControl`.                                                                                      |
| `FormBuilder`     | Un servicio inyectable que proporciona métodos de fábrica para crear instancias de control.                                                                                                     |
| `FormRecord`      | Rastrea el valor y estado de validez de una colección de instancias de `FormControl`, cada una de las cuales tiene el mismo tipo de valor.                                                                  |

### Directivas

| Directiva              | Detalles                                                                                    |
| :--------------------- | :----------------------------------------------------------------------------------------- |
| `FormControlDirective` | Sincroniza una instancia `FormControl` independiente a un elemento de control de formulario.                       |
| `FormControlName`      | Sincroniza `FormControl` en una instancia existente de `FormGroup` a un elemento de control de formulario por nombre. |
| `FormGroupDirective`   | Sincroniza una instancia existente de `FormGroup` a un elemento DOM.                                   |
| `FormGroupName`        | Sincroniza una instancia anidada de `FormGroup` a un elemento DOM.                                      |
| `FormArrayName`        | Sincroniza una instancia anidada de `FormArray` a un elemento DOM.                                      |
