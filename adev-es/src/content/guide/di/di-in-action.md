# DI en acción

Esta guía explora características adicionales de la inyección de dependencias en Angular.

NOTA: Para una cobertura completa de InjectionToken y proveedores personalizados, consulta la [guía de definición de proveedores de dependencias](guide/di/defining-dependency-providers#injection-tokens).

## Inyectar el elemento DOM del componente

Aunque los desarrolladores se esfuerzan por evitarlo, algunos efectos visuales y herramientas de terceros requieren acceso directo al DOM.
Como resultado, es posible que necesites acceder al elemento DOM de un componente.

Angular expone el elemento subyacente de un `@Component` o `@Directive` vía inyección usando el token de inyección `ElementRef`:

```ts {highlight:[7]}
import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private element = inject(ElementRef);

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}

```

## Resolver dependencias circulares con una referencia anticipada

El orden de declaración de clases en TypeScript es importante.
No puedes referenciar directamente una clase hasta que haya sido definida.

Esto no suele ser un problema, especialmente si te adhieres a la regla recomendada de _una clase por archivo_.
Pero a veces las referencias circulares son inevitables.
Por ejemplo, cuando la clase 'A' se refiere a la clase 'B' y 'B' se refiere a 'A', una de ellas tiene que ser definida primero.

La función `forwardRef()` de Angular crea una referencia _indirecta_ que Angular puede resolver más tarde.

Te enfrentas a un problema similar cuando una clase hace _una referencia a sí misma_.
Por ejemplo, en su array `providers`.
El array `providers` es una propiedad de la función decoradora `@Component()`, que debe aparecer antes de la definición de la clase.
Puedes romper tales referencias circulares usando `forwardRef`.

```typescript {header: 'app.component.ts', highlight: [4]}
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```
