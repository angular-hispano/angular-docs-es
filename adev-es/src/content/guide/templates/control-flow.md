# Flujo de control

Las plantillas de Angular soportan bloques de flujo de control que te permiten mostrar, ocultar y repetir elementos condicionalmente.

## Mostrar contenido condicionalmente con `@if`, `@else-if` y `@else` {#conditionally-display-content-with-if-else-if-and-else}

El bloque `@if` muestra condicionalmente su contenido cuando su expresión de condición es truthy:

```angular-html
@if (a > b) {
  <p>{{a}} is greater than {{b}}</p>
}
```

Si quieres mostrar contenido alternativo, puedes hacerlo proporcionando cualquier número de bloques `@else if` y un único bloque `@else`.

```angular-html
@if (a > b) {
  {{a}} is greater than {{b}}
} @else if (b > a) {
  {{a}} is less than {{b}}
} @else {
  {{a}} is equal to {{b}}
}
```

### Referenciar el resultado de la expresión condicional {#referencing-the-conditional-expressions-result}

El condicional `@if` soporta guardar el resultado de la expresión condicional en una variable para reutilizarla dentro del bloque.

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

Esto puede ser útil para referenciar expresiones más largas que serían más fáciles de leer y mantener dentro de la plantilla.

## Repetir contenido con el bloque `@for` {#repeat-content-with-the-for-block}

El bloque `@for` recorre una colección y renderiza repetidamente el contenido de un bloque. La colección puede ser cualquier [iterable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) de JavaScript, pero Angular tiene optimizaciones de rendimiento adicionales para valores de `Array`.

Un bucle `@for` típico se ve así:

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

El bloque `@for` de Angular no soporta declaraciones que modifican el flujo como `continue` o `break` de JavaScript.

### ¿Por qué es importante `track` en los bloques `@for`? {#why-is-track-in-for-blocks-important}

La expresión `track` permite a Angular mantener una relación entre tus datos y los nodos DOM en la página. Esto permite a Angular optimizar el rendimiento ejecutando las operaciones DOM mínimas necesarias cuando los datos cambian.

Usar track efectivamente puede mejorar significativamente el rendimiento de renderización de tu aplicación al iterar sobre colecciones de datos.

Selecciona una propiedad que identifique únicamente cada elemento en la expresión `track`. Si tu modelo de datos incluye una propiedad que identifica únicamente, comúnmente `id` o `uuid`, usa este valor. Si tus datos no incluyen un campo como este, considera seriamente agregar uno.

Para colecciones estáticas que nunca cambian, puedes usar `$index` para indicarle a Angular que rastree cada elemento por su índice en la colección.

Si no hay otra opción disponible, puedes especificar `identity`. Esto le indica a Angular que rastree el elemento por su identidad de referencia usando el operador de triple igualdad (`===`). Evita esta opción siempre que sea posible, ya que puede llevar a actualizaciones de renderización significativamente más lentas, ya que Angular no tiene forma de mapear qué elemento de datos corresponde a qué nodos DOM.

### Variables contextuales en bloques `@for` {#contextual-variables-in-for-blocks}

Dentro de los bloques `@for`, varias variables implícitas siempre están disponibles:

| Variable | Significado                                              |
| -------- | -------------------------------------------------------- |
| `$count` | Número de elementos en la colección iterada              |
| `$index` | Índice de la fila actual                                 |
| `$first` | Si la fila actual es la primera fila                     |
| `$last`  | Si la fila actual es la última fila                      |
| `$even`  | Si el índice de la fila actual es par                    |
| `$odd`   | Si el índice de la fila actual es impar                  |

Estas variables siempre están disponibles con estos nombres, pero pueden ser renombradas mediante un segmento `let`:

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

El renombrado es útil al anidar bloques `@for`, permitiéndote leer variables del bloque `@for` externo desde un bloque `@for` interno.

### Proporcionar un fallback para bloques `@for` con el bloque `@empty` {#providing-a-fallback-for-for-blocks-with-the-empty-block}

Opcionalmente puedes incluir una sección `@empty` inmediatamente después del contenido del bloque `@for`. El contenido del bloque `@empty` se muestra cuando no hay elementos:

```angular-html
@for (item of items; track item.name) {
  <li> {{ item.name }}</li>
} @empty {
  <li> There are no items. </li>
}
```

## Mostrar contenido condicionalmente con el bloque `@switch` {#conditionally-display-content-with-the-switch-block}

Aunque el bloque `@if` es excelente para la mayoría de escenarios, el bloque `@switch` proporciona una sintaxis alternativa para renderizar datos condicionalmente. Su sintaxis se asemeja mucho a la declaración `switch` de JavaScript.

```angular-html
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer') {
    <app-reviewer-dashboard />
  }
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```

El valor de la expresión condicional se compara con la expresión case usando el operador de triple igualdad (`===`).

**`@switch` no tiene fallthrough**, por lo que no necesitas un equivalente a una declaración `break` o `return` en el bloque.

Opcionalmente puedes incluir un bloque `@default`. El contenido del bloque `@default` se muestra si ninguna de las expresiones case precedentes coincide con el valor del switch.

Si ningún `@case` coincide con la expresión y no hay un bloque `@default`, no se muestra nada.

### Verificación de tipos exhaustiva {#exhaustive-type-checking}

`@switch` soporta la verificación de tipos exhaustiva, permitiendo que Angular verifique en tiempo de compilación que todos los valores posibles de un tipo unión son manejados.

Al usar `@default never;`, declaras explícitamente que no deben existir casos restantes. Si el tipo unión se extiende posteriormente y un nuevo caso no está cubierto por un `@case`, el verificador de tipos de plantillas de Angular reportará un error, ayudándote a detectar ramas faltantes temprano.

NOTA: La verificación de exhaustividad depende del estrechamiento de tipos de TypeScript, que solo funciona en variables. No funcionará si la condición del switch es una llamada a función o un signal (por ejemplo, `@switch (state())`). Para solucionarlo, asigna el signal a una variable `@let`, p. ej.: `@let mySignal = this.mySignal()`.

```angular-html
@Component({
  template: `
    @switch (state) {
      @case ('loggedOut') {
        <button>Login</button>
      }

      @case ('loggedIn') {
        <p>Welcome back!</p>
      }

      @default never; // lanza error porque falta `@case ('loading')`
    }
  `,
})
export class AppComponent {
  state: 'loggedOut' | 'loading' | 'loggedIn' = 'loggedOut';
}
```

Cuando la expresión del switch está anidada dentro de una unión, debes especificar explícitamente la expresión para verificar la exhaustividad.

<!-- prettier-ignore -->
```angular-ts
@Component({
  template: `
    @switch (state.mode) {
      @case ('show') {
        {{ state.menu }};
      }
      @case ('hide') {}
      @default never(state);
    }
  `,
})
export class App {
  state!: {mode: 'hide'} | {mode: 'show'; menu: number};
}
```
