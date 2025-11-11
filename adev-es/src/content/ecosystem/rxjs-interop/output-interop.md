# Interoperabilidad de RxJS con outputs de componentes y directivas

CONSEJO: Esta guía supone que ya estás familiarizado con los [outputs de componentes y directivas](guide/components/outputs).

El paquete `@angular/rxjs-interop` ofrece dos APIs relacionadas con los outputs de componentes y directivas.

## Crear un output basado en un Observable de RxJS

`outputFromObservable` te permite crear un output de componente o directiva que emite en función de un Observable de RxJS:

```ts {highlight:[9]}
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive({/*...*/})
class Draggable {
    pointerMoves$: Observable<PointerMovements> = listenToPointerMoves();
  
    // Cada vez que `pointerMoves$` emite, se dispara el evento `pointerMove`.
    pointerMove = outputFromObservable(this.pointerMoves$);
}
```

La función `outputFromObservable` tiene un significado especial para el compilador de Angular. **Solo puedes llamar a `outputFromObservable` en inicializadores de propiedades de componentes y directivas.**

Cuando te suscribes (`subscribe`) al output, Angular reenvía automáticamente la suscripción al Observable subyacente. Angular deja de reenviar valores cuando el componente o la directiva se destruye.

ÚTIL: Considera usar `output()` directamente si puedes emitir valores de forma imperativa.

## Crear un Observable de RxJS a partir de un output de componente o directiva

La función `outputToObservable` te permite crear un Observable de RxJS a partir de un output de componente.

```ts {highlight:[11]}
import {outputToObservable} from '@angular/core/rxjs-interop';

@Component(/*...*/)
    class CustomSlider {
    valueChange = output<number>();
}

// Referencia de instancia a `CustomSlider`.
const slider: CustomSlider = createSlider();

outputToObservable(slider.valueChange) // Observable<number>
    .pipe(...)
    .subscribe(...);
```

ÚTIL: Considera usar directamente el método `subscribe` en `OutputRef` si satisface tus necesidades.
