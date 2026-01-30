# Herencia

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee esa primero si eres nuevo en Angular.

Los componentes de Angular son clases TypeScript y participan en la semántica de herencia estándar de JavaScript.

Un componente puede extender cualquier clase base:

```ts
export class ListboxBase {
  value: string;
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  // CustomListbox hereda la propiedad `value`.
}
```

## Extender otros componentes y directivas

Cuando un componente extiende otro componente o una directiva, hereda algunos de los metadatos definidos en
el decorador de la clase base y los miembros decorados de la clase base. Esto incluye
enlaces host, inputs, outputs, métodos de ciclo de vida.

```angular-ts
@Component({
  selector: 'base-listbox',
  template: `
    ...
  `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  value = input.required<string>();
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}

@Component({
  selector: 'custom-listbox',
  template: `
    ...
  `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  disabled = input(false);
  focusActiveOption() {
    /* ... */
  }
}
```

En el ejemplo anterior, `CustomListbox` hereda toda la información asociada con `ListboxBase`,
sobrescribiendo el selector y la plantilla con sus propios valores. `CustomListbox` tiene dos inputs (`value`
y `disabled`) y dos event listeners (`keydown` y `click`).

Las clases hijas terminan con la _unión_ de todos los inputs, outputs y enlaces host de sus ancestros
y los suyos propios.

### Reenviar dependencias inyectadas

Si una clase base inyecta dependencias como parámetros del constructor, la clase hija debe pasar explícitamente estas dependencias a `super`.

```ts
@Component({ ... })
export class ListboxBase {
  constructor(private element: ElementRef) { }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```

### Sobrescribir métodos de ciclo de vida

Si una clase base define un método de ciclo de vida, como `ngOnInit`, una clase hija que también
implementa `ngOnInit` _sobrescribe_ la implementación de la clase base. Si quieres preservar el
método de ciclo de vida de la clase base, llama explícitamente al método con `super`:

```ts
@Component({ ... })
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```
