# DI en acción

Esta guía explora características adicionales de la inyección de dependencias en Angular.

## Proveedores personalizados con `@Inject`

Usar un proveedor personalizado te permite proveer una implementación concreta para dependencias implícitas, como las APIs del navegador integradas.
El siguiente ejemplo usa un `InjectionToken` para proveer la API del navegador [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) como dependencia en el `BrowserStorageService`:

<docs-code header="src/app/storage.service.ts" language="typescript"
           highlight="[[3,6],[12]]">
import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  public storage = inject(BROWSER_STORAGE);

  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
}
</docs-code>

La función `factory` devuelve la propiedad `localStorage` que está adjunta al objeto window del navegador.
La función `inject` inicializa la propiedad `storage` con una instancia del token.

Este proveedor personalizado ahora puede ser sobrescrito durante las pruebas con una API simulada de `localStorage` en lugar de interactuar con las APIs reales del navegador.

## Inyectar el elemento DOM del componente

Aunque los desarrolladores se esfuerzan por evitarlo, algunos efectos visuales y herramientas de terceros requieren acceso directo al DOM.
Como resultado, es posible que necesites acceder al elemento DOM de un componente.

Angular expone el elemento subyacente de un `@Component` o `@Directive` vía inyección usando el token de inyección `ElementRef`:

<docs-code language="typescript" highlight="[7]">
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  private element = inject(ElementRef)

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
</docs-code>

## Resolver dependencias circulares con una referencia anticipada (`forwardRef`)

El orden de declaración de clases en TypeScript es importante.
No puedes referenciar directamente una clase hasta que haya sido definida.

Esto no suele ser un problema, especialmente si te adhieres a la regla recomendada de *una clase por archivo*.
Pero a veces las referencias circulares son inevitables.
Por ejemplo, cuando la clase 'A' se refiere a la clase 'B' y 'B' se refiere a 'A', una de ellas tiene que ser definida primero.

La función `forwardRef()` de Angular crea una referencia *indirecta* que Angular puede resolver más tarde.

Te enfrentas a un problema similar cuando una clase hace *una referencia a sí misma*.
Por ejemplo, en su array `providers`.
El array `providers` es una propiedad de la función decoradora `@Component()`, que debe aparecer antes de la definición de la clase.
Puedes romper tales referencias circulares usando `forwardRef`.

<docs-code header="app.component.ts" language="typescript" highlight="[4]">
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
</docs-code>
