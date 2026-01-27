# Variables en plantillas

Angular tiene dos tipos de declaraciones de variables en plantillas: variables locales de plantilla y variables de referencia de plantilla.

## Variables locales de plantilla con `@let`

La sintaxis `@let` de Angular te permite definir una variable local y reutilizarla en toda la plantilla, similar a la [sintaxis `let` de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let).

### Usando `@let`

Usa `@let` para declarar una variable cuyo valor se basa en el resultado de una expresión de plantilla. Angular mantiene automáticamente el valor de la variable actualizado con la expresión dada, similar a los [bindings](./templates/bindings).

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
                      'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
                      'Ut enim ad minim veniam...';
```

Cada bloque `@let` puede declarar exactamente una variable. No puedes declarar múltiples variables en el mismo bloque con una coma.

### Referenciando el valor de `@let`

Una vez que has declarado una variable con `@let`, puedes reutilizarla en la misma plantilla:

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{user.name}}</h1>
  <user-avatar [photo]="user.photo"/>

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{snack.name}}</li>
    }
  </ul>

  <button (click)="update(user)">Update profile</button>
}
```

### Asignabilidad

Una diferencia clave entre `@let` y el `let` de JavaScript es que `@let` no puede ser reasignado después de la declaración. Sin embargo, Angular mantiene automáticamente el valor de la variable actualizado con la expresión dada.

```angular-html
@let value = 1;

<!-- Inválido - ¡Esto no funciona! -->
<button (click)="value = value + 1">Increment the value</button>
```

### Alcance de variables

Las declaraciones `@let` tienen alcance a la vista actual y sus descendientes. Angular crea una nueva vista en los límites de componentes y en cualquier lugar donde una plantilla pueda contener contenido dinámico, como bloques de control de flujo, bloques `@defer`, o directivas estructurales.

Dado que las declaraciones `@let` no se elevan (no son hoisted), **no pueden** ser accedidas por vistas padres o hermanas:

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

{{topLevel}} <!-- Válido -->
{{insideDiv}} <!-- Válido -->

@if (condition) {
  {{topLevel + insideDiv}} <!-- Válido -->

  @let nested = value;

  @if (condition) {
    {{topLevel + insideDiv + nested}} <!-- Válido -->
  }
}

{{nested}} <!-- Error, no se eleva desde @if -->
```

### Sintaxis completa

La sintaxis `@let` está formalmente definida como:

- La palabra clave `@let`.
- Seguida de uno o más espacios en blanco, sin incluir nuevas líneas.
- Seguida de un nombre JavaScript válido y cero o más espacios en blanco.
- Seguida del símbolo = y cero o más espacios en blanco.
- Seguida de una expresión Angular que puede ser multilínea.
- Terminada por el símbolo `;`.

## Variables de referencia de plantilla

Las variables de referencia de plantilla te dan una forma de declarar una variable que referencia un valor de un elemento en tu plantilla.

Una variable de referencia de plantilla puede referirse a lo siguiente:

- un elemento DOM dentro de una plantilla (incluyendo [elementos personalizados](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements))
- un componente o directiva de Angular
- un [TemplateRef](/api/core/TemplateRef) de un [ng-template](/api/core/ng-template)

Puedes usar variables de referencia de plantilla para leer información de una parte de la plantilla en otra parte de la misma plantilla.

### Declarando una variable de referencia de plantilla

Puedes declarar una variable en un elemento de una plantilla agregando un atributo que comienza con el carácter hash (`#`) seguido del nombre de la variable.

```angular-html
<!-- Crea una variable de referencia de plantilla llamada "taskInput", que referencia al HTMLInputElement. -->
<input #taskInput placeholder="Enter task name">
```

### Asignando valores a variables de referencia de plantilla

Angular asigna un valor a las variables de plantilla basándose en el elemento en el que se declara la variable.

Si declaras la variable en un componente de Angular, la variable se refiere a la instancia del componente.

```angular-html
<!-- La variable `startDate` se asigna a la instancia de `MyDatepicker`. -->
<my-datepicker #startDate />
```

Si declaras la variable en un elemento `<ng-template>`, la variable se refiere a una instancia de TemplateRef que representa la plantilla. Para más información, consulta [Cómo Angular usa el asterisco, \*, sintaxis](/guide/directives/structural-directives#structural-directive-shorthand) en [Directivas estructurales](/guide/directives/structural-directives).

```angular-html
<!-- La variable `myFragment` se asigna a la instancia de `TemplateRef` correspondiente a este fragmento de plantilla. -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Si declaras la variable en cualquier otro elemento mostrado, la variable se refiere a la instancia de `HTMLElement`.

```angular-html
<!-- La variable "taskInput" se refiere a la instancia de HTMLInputElement. -->
<input #taskInput placeholder="Enter task name">
```

#### Asignando una referencia a una directiva de Angular

Las directivas de Angular pueden tener una propiedad `exportAs` que define un nombre por el cual la directiva puede ser referenciada en una plantilla:

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone { /* ... */ }
```

Cuando declaras una variable de plantilla en un elemento, puedes asignar a esa variable una instancia de directiva especificando este nombre `exportAs`:

```angular-html
<!-- La variable `firstZone` se refiere a la instancia de la directiva `DropZone`. -->
<section dropZone #firstZone="dropZone"> ... </section>
```

No puedes referirte a una directiva que no especifica un nombre `exportAs`.

### Usando variables de referencia de plantilla con consultas

Además de usar variables de plantilla para leer valores de otra parte de la misma plantilla, también puedes usar este estilo de declaración de variable para "marcar" un elemento para [consultas de componentes y directivas](/guide/components/queries).

Cuando quieres consultar por un elemento específico en una plantilla, puedes declarar una variable de plantilla en ese elemento y luego consultar por el elemento basándote en el nombre de la variable.

```angular-html
 <input #description value="Original description">
```

```angular-ts
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // Consulta por el elemento input basándose en el nombre de la variable de plantilla.
  @ViewChild('description') input: ElementRef | undefined;
}
```

Consulta [Referenciando hijos con consultas](/guide/components/queries) para más información sobre consultas.
