<docs-decorative-header title="Condicionales y Bucles" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Mostrar y/o repetir contenido condicionalmente basado en datos dinámicos.
</docs-decorative-header>

Una de las ventajas de usar un framework como Angular es que proporciona soluciones integradas para problemas comunes que los desarrolladores encuentran. Ejemplos de esto incluyen: mostrar contenido basado en una condición determinada, representar una lista de elementos basada en datos de la aplicación, etc.

Para resolver este problema, Angular utiliza bloques de control de flujo integrados, que indican al framework cuándo y cómo se deben representar las plantillas.

## Renderizado Condicional

Uno de los escenarios más comunes que encuentran los desarrolladores es el deseo de mostrar u ocultar contenido en plantillas basadas en una condición.

Un ejemplo común de esto es si mostrar o no ciertos controles en la pantalla en función del nivel de permisos del usuario.

### Bloque `@if`

Similar a la sentencia `if` de JavaScript, Angular utiliza bloques de control de flujo `@if` para ocultar o mostrar condicionalmente partes de una plantilla y su contenido.

```ts
// user-controls.component.ts
@Component({
  standalone: true,
  selector: 'user-controls',
  template: `
    @if (isAdmin) {
      <button>Borrar Base de Datos</button>
    }
  `,
})
export class UserControls {
  isAdmin = true;
}
```

En este ejemplo, Angular solo muestra el elemento `<button>` si la propiedad `isAdmin` es verdadera. De lo contrario, no aparecerá en la página.

### Blloque `@else`

Si bien el bloque `@if` resulta útil en muchas situaciones, también es común mostrar una interfaz de usuario alternativa (UI alternativa) cuando la condición no se cumple.

Por ejemplo, en el componente `UserControls`, en lugar de mostrar una pantalla en blanco, sería útil para los usuarios saber que no pueden ver nada porque no están autenticados.

Cuando necesites un contenido alternativo, similar a la cláusula `else` de JavaScript, agrega un bloque `@else` para lograr el mismo efecto.

```ts
// user-controls.component.ts
@Component({
  standalone: true,
  selector: 'user-controls',
  template: `
    @if (isAdmin) {
      <button>Borrar Base de Datos</button>
    } @else {
      <p>No estás autorizado.</p>
    }
  `,
})
export class UserControls {
  isAdmin = true;
}
```

## Renderizado de Listas

Otro escenario habitual que enfrentan los desarrolladores es la necesidad de mostrar una lista de elementos.

### Bloque `@for`

Similar a los bucles `for...of` de JavaScript, Angular proporciona el bloque `@for` para renderizar elementos repetidos.

```html
<!-- ingredient-list.component.html -->
<ul>
  @for (ingredient of ingredientList; track ingredient.name) {
    <li>{{ ingredient.quantity }} - {{ ingredient.name }}</li>
  }
</ul>
```

```ts
// ingredient-list.component.ts
@Component({
  standalone: true,
  selector: 'ingredient-list',
  templateUrl: './ingredient-list.component.html',
})
export class IngredientList {
  ingredientList = [
    {name: 'noodles', quantity: 1},
    {name: 'miso broth', quantity: 1},
    {name: 'egg', quantity: 2},
  ];
}
```

Sin embargo, a diferencia de un bucle `for...of` estándar, te habrás dado cuenta de que el bloque `@for` de Angular tiene una palabra clave adicional: `track`.

#### Propiedad `track` 

Cuando Angular renderiza una lista de elementos con `@for`, esos elementos pueden cambiar o moverse posteriormente. Angular necesita rastrear cada elemento a través de cualquier reordenamiento, generalmente utilizando una propiedad del elemento como un identificador único o clave.

Esto asegura que cualquier actualización en la lista se refleje correctamente en la interfaz de usuario y se rastree de manera adecuada dentro de Angular, especialmente en el caso de elementos con estado o animaciones.

Para lograr esto, podemos proporcionarle a Angular una clave única con la palabra clave `track`.

## Siguiente Paso

Ahora que ya sabes cómo determinar cuándo y cómo se renderizan las plantillas, es momento de aprender a manejar un aspecto importante de la mayoría de las aplicaciones: El Manejo de la interacción del usuario (o la entrada del usuario).

<docs-pill-row>
  <docs-pill title="Manejo de la Interacción del Usuario" href="essentials/handling-user-interaction" />
</docs-pill-row>
