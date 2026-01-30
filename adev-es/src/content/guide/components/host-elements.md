# Elementos host de componentes

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee esa primero si eres nuevo en Angular.

Angular crea una instancia de un componente para cada elemento HTML que coincide con el
selector del componente. El elemento DOM que coincide con el selector de un componente es el **elemento host** de ese componente.
El contenido de la plantilla de un componente se renderiza dentro de su elemento host.

```angular-ts
// Código fuente del componente
@Component({
  selector: 'profile-photo',
  template: `
    <img src="profile-photo.jpg" alt="Tu foto de perfil" />
  `,
})
export class ProfilePhoto {}
```

```angular-html
<!-- Usando el componente -->
<h3>Tu foto de perfil</h3>
<profile-photo />
<button>Subir una nueva foto de perfil</button>
```

```angular-html
<!-- DOM renderizado -->
<h3>Tu foto de perfil</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Tu foto de perfil" />
</profile-photo>
<button>Subir una nueva foto de perfil</button>
```

En el ejemplo anterior, `<profile-photo>` es el elemento host del componente `ProfilePhoto`.

## Enlazar al elemento host

Un componente puede enlazar propiedades, atributos, estilos y eventos a su elemento host. Esto se comporta
de manera idéntica a los enlaces en elementos dentro de la plantilla del componente, pero en su lugar se define con
la propiedad `host` en el decorador `@Component`:

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[style.background]' : `hasError() ? 'red' : 'green'`,
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  hasError = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

## Los decoradores `@HostBinding` y `@HostListener`

Alternativamente puedes enlazar al elemento host aplicando los decoradores `@HostBinding` y `@HostListener`
a los miembros de la clase.

`@HostBinding` te permite enlazar propiedades y atributos del host a propiedades y getters:

```ts
@Component({
  /* ... */
})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;

  @HostBinding('tabIndex')
  get tabIndex() {
    return this.disabled ? -1 : 0;
  }

  /* ... */
}
```

`@HostListener` te permite enlazar event listeners al elemento host. El decorador acepta un nombre de evento
y un array opcional de argumentos:

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

<docs-callout critical title="Prefiere usar la propiedad `host` sobre los decoradores">
  **Siempre prefiere usar la propiedad `host` sobre `@HostBinding` y `@HostListener`.** Estos
decoradores existen exclusivamente por compatibilidad hacia atrás.
</docs-callout>

## Colisiones de enlaces

Cuando usas un componente en una plantilla, puedes agregar enlaces al elemento de esa instancia del componente.
El componente _también_ puede definir enlaces host para las mismas propiedades o atributos.

```angular-ts
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```

```angular-html
<profile-photo role="group" [id]="otherId" />
```

En casos como este, las siguientes reglas determinan qué valor gana:

- Si ambos valores son estáticos, el enlace de la instancia gana.
- Si un valor es estático y el otro dinámico, el valor dinámico gana.
- Si ambos valores son dinámicos, el enlace host del componente gana.

## Estilizar con propiedades personalizadas CSS

Los desarrolladores frecuentemente dependen de [Propiedades Personalizadas CSS](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) para habilitar una configuración flexible de los estilos de sus componentes.
Puedes establecer tales propiedades personalizadas en un elemento host con un [enlace de estilo](guide/templates/binding#css-style-properties).

```angular-ts
@Component({
  /* ... */
  host: {
    '[style.--my-background]': 'color()',
  }
})
export class MyComponent {
  color = signal('lightgreen');
}
```

En este ejemplo, la propiedad personalizada CSS `--my-background` está enlazada a la signal `color`. El valor de la propiedad personalizada se actualizará automáticamente cada vez que la signal `color` cambie. Esto afectará al componente actual y a todos sus hijos que dependan de esta propiedad personalizada.

### Establecer propiedades personalizadas en componentes hijos

Alternativamente, también es posible establecer propiedades personalizadas CSS en el elemento host de componentes hijos con un [enlace de estilo](guide/templates/binding#css-style-properties).

```angular-ts
@Component({
  selector: 'my-component',
  template: `<my-child [style.--my-background]="color()">`,
})
export class MyComponent {
  color = signal('lightgreen');
}
```

## Inyectar atributos del elemento host

Los componentes y directivas pueden leer atributos estáticos de su elemento host usando `HostAttributeToken` junto con la función [`inject`](api/core/inject).

```ts
import { Component, HostAttributeToken, inject } from '@angular/core';

@Component({
  selector: 'app-button',
  ...,
})
export class Button {
  variation = inject(new HostAttributeToken('variation'));
}
```

```angular-html
<app-button variation="primary">Haz clic aquí</app-button>
```

ÚTIL: `HostAttributeToken` lanza un error si el atributo falta, a menos que la inyección esté marcada como opcional.
