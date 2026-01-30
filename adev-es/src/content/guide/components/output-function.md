# Outputs basados en funciones

La función `output()` declara un output en una directiva o componente.
Los outputs te permiten emitir valores a los componentes padre.

ÚTIL: La función `output()` está actualmente en [developer preview](/reference/releases#developer-preview).

<docs-code language="ts" highlight="[[5], [8]]">
import {Component, output} from '@angular/core';

@Component({...})
export class MyComp {
  onNameChange = output<string>()    // OutputEmitterRef<string>

  setNewName(newName: string) {
    this.onNameChange.emit(newName);
  }
}
</docs-code>

Un output es automáticamente reconocido por Angular cada vez que usas la función `output` como inicializador de un miembro de clase.
Los componentes padre pueden escuchar outputs en las plantillas usando la sintaxis de enlace de eventos.

```html
<my-comp (onNameChange)="showNewName($event)" />
```

## Alias de un output

Angular usa el nombre del miembro de clase como el nombre del output.
Puedes crear un alias para los outputs para cambiar su nombre público y que sea diferente.

```typescript
class MyComp {
  onNameChange = output({alias: 'ngxNameChange'});
}
```

Esto permite a los usuarios enlazar a tu output usando `(ngxNameChange)`, mientras que dentro de tu componente puedes acceder al emisor de output usando `this.onNameChange`.

## Suscripción programática

Los consumidores pueden crear tu componente dinámicamente con una referencia a un `ComponentRef`.
En esos casos, los padres pueden suscribirse a los outputs accediendo directamente a la propiedad de tipo `OutputRef`.

```ts
const myComp = viewContainerRef.createComponent(...);

myComp.instance.onNameChange.subscribe(newName => {
  console.log(newName);
});
```

Angular limpiará automáticamente la suscripción cuando `myComp` sea destruido.
Alternativamente, se devuelve un objeto con una función para cancelar explícitamente la suscripción antes.

## Usando observables de RxJS como fuente

En algunos casos, puedes querer emitir valores de output basados en observables de RxJS.
Angular proporciona una forma de usar observables de RxJS como fuente para outputs.

La función `outputFromObservable` es una primitiva del compilador, similar a la función `output()`, y declara outputs que son impulsados por observables de RxJS.

<docs-code language="ts" highlight="[7]">
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive(...)
class MyDir {
  nameChange$ = this.dataService.get(); // Observable<Data>
  nameChange = outputFromObservable(this.nameChange$);
}
</docs-code>

Angular reenviará las suscripciones al observable, pero dejará de reenviar valores cuando la directiva propietaria sea destruida.
En el ejemplo anterior, si `MyDir` es destruida, `nameChange` dejará de emitir valores.

ÚTIL: La mayoría de las veces, usar `output()` es suficiente y puedes emitir valores imperativamente.

## Convirtiendo un output a un observable

Puedes suscribirte a outputs llamando al método `.subscribe` en `OutputRef`.
En otros casos, Angular proporciona una función auxiliar que convierte un `OutputRef` a un observable.

<docs-code language="ts" highlight="[11]">
import {outputToObservable} from '@angular/core/rxjs-interop';

@Component(...)
class MyComp {
  onNameChange = output<string>();
}

// Referencia de instancia a `MyComp`.
const myComp: MyComp;

outputToObservable(this.myComp.instance.onNameChange) // Observable<string>
  .pipe(...)
  .subscribe(...);
</docs-code>

## ¿Por qué deberías usar `output()` sobre `@Output()` basado en decoradores?

La función `output()` proporciona numerosos beneficios sobre `@Output` y `EventEmitter` basados en decoradores:

1. Modelo mental y API más simples:
  <br/>• Sin concepto de canal de error, canales de completado, u otras APIs de RxJS.
  <br/>• Los outputs son simples emisores. Puedes emitir valores usando la función `.emit`.
2. Tipos más precisos.
  <br/>• `OutputEmitterRef.emit(value)` ahora está correctamente tipado, mientras que `EventEmitter` tiene tipos rotos y puede causar errores en tiempo de ejecución.
