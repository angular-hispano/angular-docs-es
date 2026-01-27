# Enlazar texto, propiedades y atributos dinámicos

En Angular, un **enlace** (binding) crea una conexión dinámica entre la plantilla de un componente y sus datos. Esta conexión asegura que los cambios en los datos del componente actualicen automáticamente la plantilla renderizada.

## Renderizar texto dinámico con interpolación de texto

Puedes enlazar texto dinámico en plantillas con llaves dobles, lo que le indica a Angular que es responsable de la expresión dentro y asegurar que se actualice correctamente. Esto se llama **interpolación de texto**.

```angular-ts
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class AppComponent {
  theme = 'dark';
}
```

En este ejemplo, cuando el fragmento se renderiza en la página, Angular reemplazará `{{ theme }}` con `dark`.

```angular-html
<!-- Salida renderizada -->
<p>Your color preference is dark.</p>
```

Los enlaces que cambian con el tiempo deben leer valores de [signals](/guide/signals). Angular rastrea los signals leídos en la plantilla, y actualiza la página renderizada cuando esos valores de signals cambian.

```angular-ts
@Component({
  template: `
    <!-- No necesariamente se actualiza cuando `welcomeMessage` cambia. -->
    <p>{{ welcomeMessage }}</p>

    <p>Your color preference is {{ theme() }}.</p> <!-- Siempre se actualiza cuando el valor del signal `name` cambia. -->
  `
  ...
})
export class AppComponent {
  welcomeMessage = "Welcome, enjoy this app that we built for you";
  theme = signal('dark');
}
```

Para más detalles, consulta la [guía de Signals](/guide/signals).

Continuando con el ejemplo del tema, si un usuario hace clic en un botón que actualiza el signal `theme` a `'light'` después de que se carga la página, la página se actualiza en consecuencia a:

```angular-html
<!-- Salida renderizada -->
<p>Your color preference is light.</p>
```

Puedes usar interpolación de texto en cualquier lugar donde normalmente escribirías texto en HTML.

Todos los valores de expresión se convierten a una cadena. Los objetos y arrays se convierten usando el método `toString` del valor.

## Enlazar propiedades y atributos dinámicos

Angular soporta enlazar valores dinámicos a propiedades de objetos y atributos HTML con corchetes.

Puedes enlazar a propiedades en la instancia DOM de un elemento HTML, una instancia de [componente](guide/components), o una instancia de [directiva](guide/directives).

### Propiedades de elementos nativos

Cada elemento HTML tiene una representación DOM correspondiente. Por ejemplo, cada elemento HTML `<button>` corresponde a una instancia de `HTMLButtonElement` en el DOM. En Angular, usas enlaces de propiedad para establecer valores directamente a la representación DOM del elemento.

```angular-html
<!-- Enlaza la propiedad `disabled` en el objeto DOM del elemento button -->
<button [disabled]="isFormValid()">Save</button>
```

En este ejemplo, cada vez que `isFormValid` cambia, Angular establece automáticamente la propiedad `disabled` de la instancia `HTMLButtonElement`.

### Propiedades de componentes y directivas

Cuando un elemento es un componente de Angular, puedes usar enlaces de propiedad para establecer propiedades de entrada de componentes usando la misma sintaxis de corchetes.

```angular-html
<!-- Enlaza la propiedad `value` en la instancia del componente `MyListbox`. -->
<my-listbox [value]="mySelection()" />
```

En este ejemplo, cada vez que `mySelection` cambia, Angular establece automáticamente la propiedad `value` de la instancia `MyListbox`.

También puedes enlazar a propiedades de directivas.

```angular-html
<!-- Enlaza a la propiedad `ngSrc` de la directiva `NgOptimizedImage` -->
<img [ngSrc]="profilePhotoUrl()" alt="The current user's profile photo">
```

### Atributos

Cuando necesitas establecer atributos HTML que no tienen propiedades DOM correspondientes, como atributos SVG, puedes enlazar atributos a elementos en tu plantilla con el prefijo `attr.`.

```angular-html
<!-- Enlaza el atributo `role` en el elemento `<ul>` a la propiedad `listRole` del componente. -->
<ul [attr.role]="listRole()">
```

En este ejemplo, cada vez que `listRole` cambia, Angular establece automáticamente el atributo `role` del elemento `<ul>` llamando a `setAttribute`.

Si el valor de un enlace de atributo es `null`, Angular elimina el atributo llamando a `removeAttribute`.

### Interpolación de texto en propiedades y atributos

También puedes usar sintaxis de interpolación de texto en propiedades y atributos usando la sintaxis de llaves dobles en lugar de corchetes alrededor del nombre de la propiedad o atributo. Cuando uses esta sintaxis, Angular trata la asignación como un enlace de propiedad.

```angular-html
<!-- Enlaza un valor a la propiedad `alt` del objeto DOM del elemento imagen. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName() }}" >
```

## Enlaces de clases CSS y propiedades de estilo

Angular soporta funcionalidades adicionales para enlazar clases CSS y propiedades de estilo CSS a elementos.

### Clases CSS

Puedes crear un enlace de clase CSS para agregar o quitar condicionalmente una clase CSS en un elemento basándose en si el valor enlazado es [truthy o falsy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

```angular-html
<!-- Cuando `isExpanded` es truthy, agrega la clase CSS `expanded`. -->
<ul [class.expanded]="isExpanded()">
```

También puedes enlazar directamente a la propiedad `class`. Angular acepta tres tipos de valor:

| Descripción del valor de `class`                                                                                                                                                 | Tipo TypeScript       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Una cadena que contiene una o más clases CSS separadas por espacios                                                                                                              | `string`              |
| Un array de cadenas de clases CSS                                                                                                                                                | `string[]`            |
| Un objeto donde cada nombre de propiedad es un nombre de clase CSS y cada valor correspondiente determina si esa clase se aplica al elemento, basado en su valor de truthiness. | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [class]="listClasses"> ... </ul>
    <section [class]="sectionClasses()"> ... </section>
    <button [class]="buttonClasses()"> ... </button>
  `,
  ...
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = signal(['expandable', 'elevated']);
  buttonClasses = signal({
    highlighted: true,
    embiggened: false,
  });
}
```

El ejemplo anterior renderiza el siguiente DOM:

```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

Angular ignora cualquier valor de cadena que no sea un nombre de clase CSS válido.

Cuando usas clases CSS estáticas, enlazando `class` directamente, y enlazando clases específicas, Angular combina inteligentemente todas las clases en el resultado renderizado.

```angular-ts
@Component({
  template: `<ul class="list" [class]="listType()" [class.expanded]="isExpanded()"> ...`,
  ...
})
export class Listbox {
  listType = signal('box');
  isExpanded = signal(true);
}
```

En el ejemplo anterior, Angular renderiza el elemento `ul` con las tres clases CSS.

```angular-html
<ul class="list box expanded">
```

Angular no garantiza ningún orden específico de clases CSS en los elementos renderizados.

Cuando enlazas `class` a un array o un objeto, Angular compara el valor anterior con el valor actual usando el operador de triple igualdad (`===`). Debes crear una nueva instancia de objeto o array cuando modifiques estos valores para que Angular aplique cualquier actualización.

Si un elemento tiene múltiples enlaces para la misma clase CSS, Angular resuelve las colisiones siguiendo su orden de precedencia de estilos.

NOTA: Los enlaces de clase no soportan nombres de clase separados por espacios en una sola clave. Tampoco soportan mutaciones en objetos ya que la referencia del enlace permanece igual. Si necesitas una u otra, usa la directiva [ngClass](/api/common/NgClass).

### Propiedades de estilo CSS

También puedes enlazar directamente a propiedades de estilo CSS en un elemento.

```angular-html
<!-- Establece la propiedad CSS `display` basada en la propiedad `isExpanded`. -->
<section [style.display]="isExpanded() ? 'block' : 'none'">
```

Puedes especificar además unidades para propiedades CSS que aceptan unidades.

```angular-html
<!-- Establece la propiedad CSS `height` a un valor en píxeles basado en la propiedad `sectionHeightInPixels`. -->
<section [style.height.px]="sectionHeightInPixels()">
```

También puedes establecer múltiples valores de estilo en un enlace. Angular acepta los siguientes tipos de valor:

| Descripción del valor de `style`                                                                                                                     | Tipo TypeScript       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Una cadena que contiene cero o más declaraciones CSS, como `"display: flex; margin: 8px"`.                                                           | `string`              |
| Un objeto donde cada nombre de propiedad es un nombre de propiedad CSS y cada valor correspondiente es el valor de esa propiedad CSS.                | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [style]="listStyles()"> ... </ul>
    <section [style]="sectionStyles()"> ... </section>
  `,
  ...
})
export class UserProfile {
  listStyles = signal('display: flex; padding: 8px');
  sectionStyles = signal({
    border: '1px solid black',
    'font-weight': 'bold',
  });
}
```

El ejemplo anterior renderiza el siguiente DOM.

```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

Cuando enlazas `style` a un objeto, Angular compara el valor anterior con el valor actual usando el operador de triple igualdad (`===`). Debes crear una nueva instancia de objeto cuando modifiques estos valores para que Angular aplique cualquier actualización.

Si un elemento tiene múltiples enlaces para la misma propiedad de estilo, Angular resuelve las colisiones siguiendo su orden de precedencia de estilos.

## Atributos ARIA

Angular soporta enlazar valores de cadena a atributos ARIA.

```angular-html
<button type="button" [aria-label]="actionLabel()">
  {{ actionLabel() }}
</button>
```

Angular escribe el valor de cadena al atributo `aria-label` del elemento y lo elimina cuando el valor enlazado es `null`.

Algunas funcionalidades ARIA exponen propiedades DOM o entradas de directivas que aceptan valores estructurados (como referencias a elementos). Usa enlaces de propiedad estándar para esos casos. Consulta la [guía de accesibilidad](best-practices/a11y#aria-attributes-and-properties) para ejemplos y orientación adicional.
