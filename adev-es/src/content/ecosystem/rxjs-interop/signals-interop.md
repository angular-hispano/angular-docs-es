# Interoperabilidad de RxJS con signals de Angular

El paquete `@angular/core/rxjs-interop` ofrece APIs que te ayudan a integrar RxJS y los signals de Angular.

## Crea un signal a partir de un Observable de RxJS con `toSignal`

Usa la función `toSignal` para crear un signal que rastrea el valor de un Observable. Se comporta de forma similar al pipe `async` en las plantillas, pero es más flexible y puede utilizarse en cualquier parte de la aplicación.

```angular-ts
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // Obtiene un `Signal` que representa el valor de `counterObservable`.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

Al igual que el pipe `async`, `toSignal` se suscribe al Observable inmediatamente, lo cual puede desencadenar efectos secundarios. La suscripción creada por `toSignal` se da de baja automáticamente del Observable proporcionado cuando se destruye el componente o servicio que llama a `toSignal`.

IMPORTANTE: `toSignal` crea una suscripción. Debes evitar llamarlo repetidamente para el mismo Observable y, en su lugar, reutilizar el signal que devuelve.

### Contexto de inyección

De manera predeterminada, `toSignal` necesita ejecutarse en un [contexto de inyección](guide/di/dependency-injection-context), como durante la construcción de un componente o servicio. Si no hay un contexto de inyección disponible, puedes especificar manualmente el `Injector` que debe utilizar.

### Valores iniciales

Es posible que los Observables no produzcan un valor de forma síncrona al suscribirse, pero los signals siempre requieren un valor actual. Hay varias formas de manejar este valor "inicial" de los signals de `toSignal`.

#### La opción `initialValue`

Como en el ejemplo anterior, puedes especificar una opción `initialValue` con el valor que el signal debe devolver antes de que el Observable emita por primera vez.

#### Valores iniciales `undefined`

Si no proporcionas un `initialValue`, el signal resultante devolverá `undefined` hasta que el Observable emita. Esto es similar al comportamiento del pipe `async`, que devuelve `null`.

#### La opción `requireSync`

Algunos Observables garantizan que emitirán de forma síncrona, por ejemplo, `BehaviorSubject`. En esos casos, puedes especificar la opción `requireSync: true`.

Cuando `requireSync` es `true`, `toSignal` exige que el Observable emita de forma síncrona al suscribirse. Esto garantiza que el signal siempre tenga un valor y que no sea necesario un tipo `undefined` ni un valor inicial.

### `manualCleanup`

De forma predeterminada, `toSignal` da de baja automáticamente del Observable cuando se destruye el componente o servicio que lo crea.

Para reemplazar este comportamiento, puedes pasar la opción `manualCleanup`. Puedes utilizar este ajuste para Observables que se completan de forma natural.

#### Comparación de igualdad personalizada

Algunos Observables pueden emitir valores que son **iguales** aunque difieran por referencia o en detalles menores. La opción `equal` te permite definir una **función de igualdad personalizada** para determinar cuándo dos valores consecutivos deben considerarse iguales.

Cuando dos valores emitidos se consideran iguales, el signal resultante **no se actualiza**. Esto evita cálculos redundantes, actualizaciones del DOM o efectos que se ejecuten innecesariamente.

```ts
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component(/* ... */)
export class EqualExample {
  temperature$ = interval(1000).pipe(
    map(() => ({ temperature: Math.floor(Math.random() * 3) + 20 }) ) // 20, 21 o 22 aleatoriamente
  );

  // Solo actualiza si la temperatura cambia
  temperature = toSignal(this.temperature$, {
    initialValue: { temperature : 20  },
    equal: (prev, curr) => prev.temperature === curr.temperature
  });
}
```

### Error y finalización

Si un Observable usado en `toSignal` produce un error, dicho error se lanza cuando se lee el signal.

Si un Observable usado en `toSignal` se completa, el signal continúa devolviendo el valor emitido más recientemente antes de completarse.

## Crea un Observable de RxJS a partir de un signal con `toObservable`

Usa la utilidad `toObservable` para crear un `Observable` que rastrea el valor de un signal. El valor del signal se supervisa con un `effect` que emite el valor al Observable cuando cambia.

```ts
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);

  results$ = this.query$.pipe(
    switchMap(query => this.http.get('/search?q=' + query ))
  );
}
```

Cuando el signal `query` cambia, el Observable `query$` emite la consulta más reciente y desencadena una nueva solicitud HTTP.

### Contexto de inyección

De forma predeterminada, `toObservable` necesita ejecutarse en un [contexto de inyección](guide/di/dependency-injection-context), como durante la construcción de un componente o servicio. Si no hay un contexto de inyección disponible, puedes especificar manualmente el `Injector` que se debe utilizar.

### Sincronización de `toObservable`

`toObservable` utiliza un effect para rastrear el valor del signal en un `ReplaySubject`. Al suscribirse, el primer valor (si está disponible) puede emitirse de forma síncrona y todos los valores posteriores serán asíncronos.

A diferencia de los Observables, los signals nunca proporcionan una notificación síncrona de los cambios. Incluso si actualizas el valor de un signal varias veces, `toObservable` solo emitirá el valor después de que el signal se estabilice.

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe(value => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

Aquí, solo se registrará el último valor (3).

## Usar `rxResource` para datos asíncronos

IMPORTANTE: `rxResource` es [experimental](reference/releases#experimental). Está listo para que lo pruebes, pero podría cambiar antes de ser estable.

La [`resource` function](/guide/signals/resource) de Angular te permite incorporar datos asíncronos en el código de tu aplicación basado en signals. Sobre este patrón, `rxResource` te permite definir un recurso en el que la fuente de tus datos está definida en términos de un `Observable` de RxJS. En lugar de aceptar una función `loader`, `rxResource` acepta una función `stream` que recibe un `Observable` de RxJS.

```typescript
import {Component, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class UserProfile {
  // Este componente depende de un servicio que expone datos a través de un Observable de RxJS.
  private userData = inject(MyUserDataClient);

  protected userId = input<string>();

  private userResource = rxResource({
    params: () => ({ userId: this.userId() }),

    // La propiedad `stream` espera una función factory que devuelva
    // un flujo de datos como un Observable de RxJS.
    stream: ({params}) => this.userData.load(params.userId),
  });
}
```

La propiedad `stream` acepta una función factory para un `Observable` de RxJS. Esta función factory recibe el valor `params` del recurso y devuelve un `Observable`. El recurso llama a esta función cada vez que el cómputo de `params` produce un valor nuevo. Consulta [Resource loaders](/guide/signals/resource#resource-loaders) para más detalles sobre los parámetros que se pasan a la función factory.

En todos los demás aspectos, `rxResource` se comporta como `resource` y proporciona las mismas APIs para especificar parámetros, leer valores, comprobar el estado de carga y examinar errores.
