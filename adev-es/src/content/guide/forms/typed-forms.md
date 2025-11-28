# Formularios tipados

A partir de Angular 14, los formularios son estrictamente tipados por defecto.

Como antecedente para esta guía, te recomendamos familiarizarte con los [Formularios Reactivos de Angular](guide/forms/reactive-forms).

## Visión general de formularios tipados

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" alt="Formularios Tipados en Angular" />

Con los formularios reactivos de Angular, especificas explícitamente un _modelo de formulario_. Como ejemplo simple, considera este formulario básico de inicio de sesión:

```ts
const login = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

Angular proporciona muchas APIs para interactuar con este `FormGroup`. Por ejemplo, puedes llamar `login.value`, `login.controls`, `login.patchValue`, etc. (Para una referencia completa de la API, consulta la [documentación de la API](api/forms/FormGroup).)

En versiones anteriores de Angular, la mayoría de estas APIs incluían `any` en su tipado, e interactuar con la estructura de los controles, o los valores mismos, no era seguro en cuanto a tipos. Por ejemplo: podías escribir el siguiente código inválido:

```ts
const emailDomain = login.value.email.domain;
```

Con formularios reactivos estrictamente tipados, el código anterior no compila, porque `email` no tiene la propiedad `domain`.

Además de la seguridad, el tipado ofrece otras mejoras, como un mejor autocompletado en los IDE y una forma explícita de especificar la estructura del formulario

Estas mejoras actualmente se aplican solo a formularios *reactivos* (no a formularios [*basados en plantillas*](guide/forms/template-driven-forms)).

## Formularios no tipados

Los formularios no tipados siguen siendo compatibles y continuarán funcionando como antes. Para usarlos, debes importar los símbolos `Untyped` de `@angular/forms`:

```ts
const login = new UntypedFormGroup({
  email: new UntypedFormControl(''),
  password: new UntypedFormControl(''),
});
```

Cada símbolo `Untyped` tiene exactamente la misma semántica que en versiones anteriores de Angular. Puedes habilitar el tipado de forma incremental al eliminar los prefijos `Untyped`.

## `FormControl`: Primeros pasos

El formulario más simple consiste en un solo control:

```ts
const email = new FormControl('angularrox@gmail.com');
```

Este control será automáticamente inferido para tener el tipo `FormControl<string|null>`. TypeScript aplicará automáticamente este tipo en toda la [API de `FormControl`](api/forms/FormControl), como `email.value`, `email.valueChanges`, `email.setValue(...)`, etc.

### Nulabilidad

Podrías preguntarte: ¿por qué el tipo de este control incluye `null`? Esto es porque el control puede volverse `null` en cualquier momento, llamando a reset:

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScript te obligará a manejar la posibilidad de que el control se vuelva `null`. Si quieres hacer este control no nullable, puedes usar la opción `nonNullable`. Esto hará que el control se resetee a su valor inicial, en lugar de `null`:

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

Cabe reiterar, esta opción afecta el comportamiento del formulario en tiempo de ejecución cuando se llama a `.reset()`, y debe cambiarse con cuidado.

### Especificar un tipo explícito

Es posible especificar el tipo, en lugar de depender de la inferencia. Considera un control inicializado a `null`. Debido a que el valor inicial es `null`, TypeScript inferirá `FormControl<null>`,  lo cual es más restrictivo de lo que queremos.

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // Error!
```

Para prevenir esto, especificamos explícitamente el tipo como `string|null`:

```ts
const email = new FormControl<string|null>(null);
email.setValue('angularrox@gmail.com');
```

## `FormArray`: Colecciones dinámicas y homogéneas

Un `FormArray` contiene una lista abierta de controles. El parámetro de tipo corresponde al tipo de cada control interno:

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

Puedes pasar un array de controles a `aliases.push()` cuando necesites agregar varias entradas a la vez.

```ts
const aliases = new FormArray([new FormControl('ng')]);
aliases.push([new FormControl('ngDev'), new FormControl('ngAwesome')]);
```

Este `FormArray` tendrá el tipo de controles internos `FormControl<string|null>`.

Si necesitas tener múltiples tipos de elementos dentro del array, debes usar `UntypedFormArray`, ya que TypeScript no puede inferir el tipo de elemento en cada posición.

Un `FormArray` también proporciona un método `clear()` para eliminar todos los controles que contiene:

```ts
const aliases = new FormArray([new FormControl('ngDev'), new FormControl('ngAwesome')]);
aliases.clear();
console.log(aliases.length); // 0
```

## `FormGroup` y `FormRecord`

Angular proporciona el tipo `FormGroup` para formularios con un conjunto enumerado de claves, y un tipo llamado `FormRecord`, para grupos abiertos o dinámicos.

### Valores parciales

Considera de nuevo un formulario de inicio de sesión:

```ts
const login = new FormGroup({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
```

En cualquier `FormGroup`, es [posible deshabilitar controles](api/forms/FormGroup). Cualquier control deshabilitado no aparecerá en el valor del grupo.

Como consecuencia, el tipo de `login.value` es `Partial<{email: string, password: string}>`. El `Partial` en este tipo significa que cada miembro podría ser `undefined`.

Más específicamente, el tipo de `login.value.email` es `string|undefined`, y TypeScript aplicará que manejes el valor posiblemente `undefined` (si tienes `strictNullChecks` habilitado).

Si quieres acceder al valor *incluyendo* controles deshabilitados, y así evitar campos posiblemente `undefined`, puedes usar `login.getRawValue()`.

### Controles opcionales y grupos dinámicos

Algunos formularios tienen controles que pueden o no estar presentes, y que pueden ser agregados o eliminados en tiempo de ejecución. Puedes representar estos controles usando *campos opcionales*:

```ts
interface LoginForm {
  email: FormControl<string>;
  password?: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', {nonNullable: true}),
});

login.removeControl('password');
```

En este formulario especificamos explícitamente el tipo, lo que nos permite hacer que el control `password` sea opcional. TypeScript se encargará de aplicar que solo los controles opcionales puedan añadirse o eliminarse.

### `FormRecord`

Algunos usos de `FormGroup` no se ajustan al patrón anterior porque las claves no se conocen de antemano. La clase `FormRecord` está diseñada para ese caso:

```ts
const addresses = new FormRecord<FormControl<string|null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

A este `FormRecord` se le puede agregar cualquier control de tipo `string|null`.

Si necesitas un `FormGroup` que sea dinámico (abierto) y heterogéneo (los controles son de diferentes tipos), no es posible mejorar la seguridad de tipos, y deberías usar `UntypedFormGroup`.

Un `FormRecord` también puede construirse con el `FormBuilder`:

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` and `NonNullableFormBuilder`

La clase `FormBuilder` ha sido actualizada para soportar los nuevos tipos también, de la misma manera que los ejemplos anteriores.

Además, hay un constructor adicional disponible: `NonNullableFormBuilder`. Este tipo es una abreviatura para especificar `{nonNullable: true}` en cada control, y puede eliminar código repetitivo significativo de formularios grandes sin valores nulos. Puedes acceder a él usando la propiedad `nonNullable` en un `FormBuilder`:

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
  email: '',
  password: '',
});
```

En el ejemplo anterior, ambos controles internos no permitirán valores nulos (es decir, el valor `nonNullable` estará establecido como `true`)

También puedes inyectarlo usando el nombre `NonNullableFormBuilder`.
