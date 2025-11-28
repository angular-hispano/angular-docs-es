# Validando la entrada de formularios

Puedes mejorar la calidad general de los datos al validar la entrada del usuario en cuanto a precisión y completitud. 
Esta página muestra cómo validar la entrada del usuario desde la interfaz de usuario y mostrar mensajes de validación útiles, tanto en formularios reactivos como en los basados en plantillas.

## Validando la entrada en formularios basados en plantillas

Para agregar validación a un formulario basado en plantillas, agregas los mismos atributos de validación que usarías con [validación nativa de formularios HTML](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation).
Angular usa directivas para hacer coincidir estos atributos con funciones validadoras en el framework.

Cada vez que cambia el valor de un control de formulario, Angular ejecuta la validación y genera una lista de errores de validación que resulta en un estado `INVALID`, o null, que resulta en un estado VALID.

Luego puedes inspeccionar el estado del control exportando `ngModel` a una variable de plantilla local.
El siguiente ejemplo exporta `NgModel` a una variable llamada `name`:

<docs-code header="actor-form-template.component.html (nombre)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-with-error-msg"/>

Observa las siguientes características ilustradas en el ejemplo.

- El elemento `<input>` lleva los atributos de validación HTML: `required` y `minlength`.
  También lleva una directiva validadora personalizada, `forbiddenName`.
  Para más información, consulta la sección [Validadores personalizados](#definiendo-validadores-personalizados).

- `#name="ngModel"` exporta `NgModel` a una variable local llamada `name`.
  `NgModel` refleja muchas de las propiedades de su instancia `FormControl` subyacente, por lo que puedes usar esto en la plantilla para verificar estados de control como `valid` y `dirty`.
  Para una lista completa de propiedades de control, consulta la referencia de la API [AbstractControl](api/forms/AbstractControl).
  - El `@if` más externo revela un conjunto de mensajes anidados pero solo si `name` es inválido y el control está `dirty` o `touched`.

  - Cada `@if` anidado puede presentar un mensaje personalizado para uno de los posibles errores de validación.
    Hay mensajes para `required`, `minlength`, y `forbiddenName`.

CONSEJO: Para evitar que el validador muestre errores antes de que el usuario tenga la oportunidad de editar el formulario, debes verificar los estados `dirty` o `touched` en un control.

* Cuando el usuario cambia el valor en el campo observado, el control se marca como "dirty"
* Cuando el usuario quita el foco del elemento de control del formulario, el control se marca como "touched"

## Validando la entrada en formularios reactivos

En un formulario reactivo, la fuente de la verdad es la clase del componente. 
En lugar de agregar validadores a través de atributos en la plantilla, agregas funciones de validador directamente al modelo de control del formulario en la clase del componente. 
Angular luego llama a estas funciones cada vez que el valor del control cambia.

### Funciones de validación

Las funciones de validador pueden ser síncronas o asíncronas.

| Tipo de validador      | Detalles                                                                                                                                                                                                                         |
|:---------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validadores síncronos  | Funciones síncronas que toman una instancia de control e inmediatamente devuelven un conjunto de errores de validación o `null`. Pásalos como el segundo argumento cuando instancies un `FormControl`.                           |
| Validadores asíncronos | Funciones asíncronas que toman una instancia de control y devuelven una Promesa u Observable que luego emite un conjunto de errores de validación o `null`. Pásalos como el tercer argumento cuando instancies un `FormControl`. |

Por razones de rendimiento, Angular solo ejecuta validadores asíncronos si todos los validadores síncronos pasan. 
Cada uno debe completarse antes de que se establezcan los errores.

### Funciones de validación integradas

Puedes optar por [escribir tus propias funciones de validador](#definiendo-validadores-personalizados), o puedes usar algunos de los validadores incorporados de Angular.

Los mismos validadores integrados que están disponibles como atributos en formularios basados en plantillas, como `required` y `minlength`, están todos disponibles para usar como funciones de la clase `Validators`.
Para una lista completa de validadores integrados, consulta la referencia de la API [Validators](api/forms/Validators).

Para actualizar el formulario de actor para que sea un formulario reactivo, usa algunos de los mismos
validadores integrados esta vez, en forma de función, como en el siguiente ejemplo.

<docs-code header="actor-form-reactive.component.ts (funciones de validación)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="form-group"/>

En este ejemplo, el control `name` configura dos validadores integrados, `Validators.required` y `Validators.minLength(4)`, y un validador personalizado, `forbiddenNameValidator`.

Todos estos validadores son síncronos, por lo que se pasan como segundo argumento.
Observa que puedes soportar múltiples validadores pasando las funciones como un array.

Este ejemplo también agrega algunos métodos getter.
En un formulario reactivo, siempre puedes acceder a cualquier control de formulario a través del método `get` en su grupo padre, pero a veces es útil definir getters como abreviación para la plantilla.

Si miras la plantilla para la entrada `name` nuevamente, es bastante similar al ejemplo basado en plantillas.

<docs-code header="actor-form-reactive.component.html (nombre con mensaje de errror)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="name-with-error-msg"/>

Este formulario difiere de la versión basada en plantillas en que ya no exporta ninguna directiva. En su lugar, utiliza el getter `name` definido en la clase del componente.

Observa que el atributo `required` todavía está presente en la plantilla. Aunque no es necesario para la validación, debe conservarse por razones de accesibilidad.

## Definiendo validadores personalizados

Los validadores integrados no siempre coinciden con el caso de uso exacto de tu aplicación, por lo que a veces necesitas crear un validador personalizado.

Considera la función `forbiddenNameValidator` del ejemplo anterior.
Así es como se ve la definición de esa función.

<docs-code header="forbidden-name.directive.ts (forbiddenNameValidator)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="custom-validator"/>

La función es una fábrica que toma una expresión regular para detectar un nombre prohibido _específico_ y devuelve una función validadora.

En esta muestra, el nombre prohibido es "bob", por lo que el validador rechaza cualquier nombre de actor que contenga "bob".
En otro lugar podría rechazar "alice" o cualquier nombre que coincida con la expresión regular configurada.

La fábrica `forbiddenNameValidator` devuelve la función validadora configurada.
Esa función toma un objeto de control de Angular y devuelve _ya sea_ null si el valor del control es válido _o_ un objeto de error de validación.
El objeto de error de validación típicamente tiene una propiedad cuyo nombre es la clave de validación, `'forbiddenName'`, y cuyo valor es un diccionario arbitrario de valores que podrías insertar en un mensaje de error, `{name}`.

Los validadores asíncronos personalizados son similares a los validadores síncronos, pero deben devolver una Promise u observable que más tarde emita null o un objeto de error de validación.
En el caso de un observable, el observable debe completarse, momento en el cual el formulario usa el último valor emitido para la validación.

### Añadiendo validadores personalizados a formularios reactivos

En formularios reactivos, agrega un validador personalizado pasando la función directamente al `FormControl`.

<docs-code header="actor-form-reactive.component.ts (funciones de validación)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="custom-validator"/>

### Añadiendo validadores personalizados a formularios basados en plantillas

En formularios basados en plantillas, agrega una directiva a la plantilla, donde la directiva envuelve la función validadora.
Por ejemplo, la directiva `ForbiddenValidatorDirective` correspondiente sirve como un envoltorio alrededor del `forbiddenNameValidator`.

Angular reconoce el papel de la directiva en el proceso de validación porque la directiva se registra con el proveedor `NG_VALIDATORS`, como se muestra en el siguiente ejemplo.
`NG_VALIDATORS` es un proveedor predefinido con una colección extensible de validadores.

<docs-code header="forbidden-name.directive.ts (proveedores)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive-providers"/>

La clase de directiva luego implementa la interfaz `Validator`, para que pueda integrarse fácilmente con formularios de Angular.
Aquí está el resto de la directiva para ayudarte a entender cómo todo se une.

<docs-code header="forbidden-name.directive.ts (directiva)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive"/>

Una vez que `ForbiddenValidatorDirective` esté lista, puedes agregar su selector, `appForbiddenName`, a cualquier elemento de entrada para activarlo.
Por ejemplo:

<docs-code header="actor-form-template.component.html (forbidden-name-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-input"/>

CONSEJO: Observa que la directiva de validación personalizada se instancia con `useExisting` en lugar de `useClass`.
El validador registrado debe ser *esta instancia* de `ForbiddenValidatorDirective` —la instancia en el formulario con su propiedad `forbiddenName` vinculada a "bob".

Si reemplazaras `useExisting` con `useClass`, entonces estarías registrando una nueva instancia de clase, una que no tiene `forbiddenName`.

## Clases CSS de estado de control

Angular automáticamente refleja muchas propiedades de control en el elemento de control del formulario como clases CSS.
Usa estas clases para estilizar elementos de control de formulario según el estado del formulario.
Las siguientes clases están actualmente soportadas.

- `.ng-valid`
- `.ng-invalid`
- `.ng-pending`
- `.ng-pristine`
- `.ng-dirty`
- `.ng-untouched`
- `.ng-touched`
- `.ng-submitted` \(solo elemento de formulario contenedor\)

En el siguiente ejemplo, el formulario de actor usa las clases `.ng-valid` y `.ng-invalid` para
establecer el color del borde de cada control de formulario.

<docs-code header="forms.css (status classes)" path="adev/src/content/examples/form-validation/src/assets/forms.css"/>

## Validación entre campos

Un validador entre campos es un [validador personalizado](#definiendo-validadores-personalizados "Leer sobre validadores personalizados") que compara los valores de diferentes campos en un formulario y los acepta o rechaza en combinación.
Por ejemplo, podrías tener un formulario que ofrece opciones mutuamente incompatibles, de modo que si el usuario puede elegir A o B, pero no ambos.
Algunos valores de campo también podrían depender de otros; un usuario podría estar permitido elegir B solo si A también está elegido.

Los siguientes ejemplos de validación cruzada muestran cómo hacer lo siguiente:

- Validar entrada de formulario reactivo o basado en plantillas según los valores de dos controles hermanos,
- Mostrar un mensaje de error descriptivo después de que el usuario interactuó con el formulario y la validación falló.

Los ejemplos usan validación cruzada para asegurar que los actores no reutilicen el mismo nombre en su rol llenando el Formulario de Actor.
Los validadores hacen esto verificando que los nombres de actor y roles no coincidan.

### Agregar validación cruzada a formularios reactivos

El formulario tiene la siguiente estructura:

```ts
const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl(),
});
```

Observa que `name` y `role` son controles hermanos.
Para evaluar ambos controles en un solo validador personalizado, debes realizar la validación en un control ancestro común: el `FormGroup`.
Consultas el `FormGroup` para sus controles hijos para que puedas comparar sus valores.

Para agregar un validador al `FormGroup`, pasa el nuevo validador como segundo argumento en la creación.

```ts
const actorForm = new FormGroup(
  {
    'name': new FormControl(),
    'role': new FormControl(),
    'skill': new FormControl(),
  },
  {validators: unambiguousRoleValidator},
);
```

El código del validador es el siguiente.

<docs-code header="unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-validator"/>

El validador `unambiguousRoleValidator` implementa la interfaz `ValidatorFn`.
Toma un objeto de control de Angular como argumento y devuelve null si el formulario es válido, o `ValidationErrors` en caso contrario.

El validador recupera los controles hijos llamando al método [get](api/forms/AbstractControl#get) del `FormGroup`, luego compara los valores de los controles `name` y `role`.

Si los valores no coinciden, el rol es inequívoco, ambos son válidos, y el validador devuelve null.
Si coinciden, el rol del actor es ambiguo y el validador debe marcar el formulario como inválido devolviendo un objeto de error.

Para proporcionar una mejor experiencia de usuario, la plantilla muestra un mensaje de error apropiado cuando el formulario es inválido.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="cross-validation-error-message"/>

Este `@if` muestra el error si el `FormGroup` tiene el error de validación cruzada devuelto por el validador `unambiguousRoleValidator`, pero solo si el usuario terminó de [interactuar con el formulario](#clases-css-de-estado-de-control).

### Agregar validación cruzada a formularios basados en plantillas

Para un formulario basado en plantillas, debes crear una directiva para envolver la función validadora.
Proporcionas esa directiva como el validador usando el [token `NG_VALIDATORS`](/api/forms/NG_VALIDATORS), como se muestra en el siguiente ejemplo.

<docs-code header="unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-directive"/>

Debes agregar la nueva directiva a la plantilla HTML.
Debido a que el validador debe registrarse en el nivel más alto del formulario, la siguiente plantilla coloca la directiva en la etiqueta `form`.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-register-validator"/>

Para proporcionar una mejor experiencia de usuario, aparece un mensaje de error apropiado cuando el formulario es inválido.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-error-message"/>

Esto es igual tanto en formularios basados en plantillas como reactivos.

## Crear validadores asíncronos

Los validadores asíncronos implementan las interfaces `AsyncValidatorFn` y `AsyncValidator`.
Estos son muy similares a sus contrapartes síncronas, con las siguientes diferencias.

- Las funciones `validate()` deben devolver una Promise u observable,
- El observable devuelto debe ser finito, lo que significa que debe completarse en algún momento.
- Para convertir un observable infinito en uno finito, canaliza el observable a través de un operador de filtrado como `first`, `last`, `take`, o `takeUntil`.

La validación asíncrona ocurre después de la validación síncrona, y se realiza solo si la validación síncrona es exitosa.
Esta verificación permite que los formularios eviten procesos de validación asíncrona potencialmente costosos \(como una solicitud HTTP\) si los métodos de validación más básicos ya han encontrado entrada inválida.

Después de que comienza la validación asíncrona, el control del formulario entra en un estado `pending`.
Inspecciona la propiedad `pending` del control y úsala para dar retroalimentación visual sobre la operación de validación en curso.

Un patrón de UI común es mostrar un spinner mientras se realiza la validación asíncrona.
El siguiente ejemplo muestra cómo lograr esto en un formulario basado en plantillas.

```angular-html
<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>

@if(model.pending) {
  <app-spinner />
}
```

### Implementar un validador asíncrono personalizado

En el siguiente ejemplo, un validador asíncrono garantiza que los actores sean seleccionados para un rol que aún no está ocupado. 
Los nuevos actores están constantemente audicionando y los actores antiguos se están retirando, por lo que la lista de roles disponibles no se puede recuperar de antemano. 
Para validar la posible entrada de rol, el validador debe iniciar una operación asíncrona para consultar una base de datos central de todos los actores actualmente seleccionados.

El siguiente código crea la clase de validador, `UniqueRoleValidato`r`, que implementa la interfaz `AsyncValidator`.

<docs-code header="role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator"/>

La propiedad `actorsService` se inicializa con una instancia del token `ActorsService`, que define la siguiente interfaz.

```ts
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}
```

En una aplicación del mundo real, `ActorsService` sería responsable de hacer una solicitud HTTP a la base de datos de actores para verificar si el rol está disponible.
Desde el punto de vista del validador, la implementación real del servicio no es importante, por lo que el ejemplo puede codificar contra la interfaz `ActorsService`.

A medida que comienza la validación, `UnambiguousRoleValidator` delega al método `isRoleTaken()` de `ActorsService` con el valor actual del control.
En este punto el control se marca como `pending` y permanece en este estado hasta que la cadena observable devuelta del método `validate()` se complete.

El método `isRoleTaken()` despacha una solicitud HTTP que verifica si el rol está disponible, y devuelve `Observable<boolean>` como resultado.
El método `validate()` canaliza la respuesta a través del operador `map` y la transforma en un resultado de validación.

El método luego, como cualquier validador, devuelve `null` si el formulario es válido, y `ValidationErrors` si no lo es.
Este validador maneja cualquier error potencial con el operador `catchError`.
En este caso, el validador trata el error de `isRoleTaken()` como una validación exitosa, porque la falla al hacer una solicitud de validación no necesariamente significa que el rol sea inválido.
Podrías manejar el error de manera diferente y devolver el objeto `ValidationError` en su lugar.

Después de que pasa algo de tiempo, la cadena observable se completa y la validación asíncrona está hecha.
La bandera `pending` se establece en `false`, y la validez del formulario se actualiza.

### Agregar validadores asíncronos a formularios reactivos

Para usar un validador asíncrono en formularios reactivos, comienza inyectando el validador en una propiedad de la clase del componente.

<docs-code header="actor-form-reactive.component.2.ts" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-inject"/>

Luego, pasa la función validadora directamente al `FormControl` para aplicarla.

En el siguiente ejemplo, la función `validate` de `UnambiguousRoleValidator` se aplica a `roleControl` pasándola a la opción `asyncValidators` del control y vinculándola a la instancia de `UnambiguousRoleValidator` que fue inyectada en `ActorFormReactiveComponent`.
El valor de `asyncValidators` puede ser una sola función validadora asíncrona, o un array de funciones.
Para aprender más sobre las opciones de `FormControl`, consulta la referencia de la API [AbstractControlOptions](api/forms/AbstractControlOptions).

<docs-code header="actor-form-reactive.component.2.ts" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-usage"/>

### Agregar validadores asíncronos a formularios basados en plantillas

Para usar un validador asíncrono en formularios basados en plantillas, crea una nueva directiva y registra el proveedor `NG_ASYNC_VALIDATORS` en ella.

En el ejemplo de abajo, la directiva inyecta la clase `UniqueRoleValidator` que contiene la lógica de validación real y la invoca en la función `validate`, activada por Angular cuando debe ocurrir la validación.

<docs-code header="role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator-directive"/>

Luego, como con los validadores síncronos, agrega el selector de la directiva a una entrada para activarla.

<docs-code header="actor-form-template.component.html (unique-unambiguous-role-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="role-input"/>

### Optimizar el rendimiento de validadores asíncronos

Por defecto, todos los validadores se ejecutan después de cada cambio de valor del formulario.
Con validadores síncronos, esto normalmente no tiene un impacto notable en el rendimiento de la aplicación.
Los validadores asíncronos, sin embargo, comúnmente realizan algún tipo de solicitud HTTP para validar el control.
Despachar una solicitud HTTP después de cada pulsación de tecla podría poner tensión en la API del backend, y debe evitarse si es posible.

Puedes retrasar la actualización de la validez del formulario cambiando la propiedad `updateOn` de `change` (predeterminado) a `submit` o `blur`.

Con formularios basados en plantillas, establece la propiedad en la plantilla.

```angular-html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
```

Con formularios reactivos, establece la propiedad en la instancia `FormControl`.

```ts
new FormControl('', {updateOn: 'blur'});
```

## Interacción con validación nativa de formularios HTML

Por defecto, Angular deshabilita la [validación nativa de formularios HTML](https://developer.mozilla.org/docs/Web/Guide/HTML/Constraint_validation) agregando el atributo `novalidate` en el `<form>` contenedor y usa directivas para hacer coincidir estos atributos con funciones validadoras en el framework.
Si quieres usar validación nativa **en combinación** con validación basada en Angular, puedes volver a habilitarla con la directiva `ngNativeValidate`.
Consulta la [documentación de la API](api/forms/NgForm#native-dom-validation-ui) para más detalles.
