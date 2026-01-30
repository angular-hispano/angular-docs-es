# Eventos personalizados con outputs

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee esa primero si eres nuevo en Angular.

Los componentes de Angular pueden definir eventos personalizados asignando una propiedad a la función `output`:

```ts {highlight:[3]}
@Component({/*...*/})
export class ExpandablePanel {
  panelClosed = output<void>();
}
```

```angular-html
<expandable-panel (panelClosed)="savePanelState()" />
```

La función `output` devuelve un `OutputEmitterRef`. Puedes emitir un evento llamando al método `emit` en el `OutputEmitterRef`:

```ts
  this.panelClosed.emit();
```

Angular se refiere a las propiedades inicializadas con la función `output` como **outputs**. Puedes usar outputs para generar eventos personalizados, similares a los eventos nativos del navegador como `click`.

**Los eventos personalizados de Angular no propagan hacia arriba en el DOM**.

**Los nombres de output distinguen entre mayúsculas y minúsculas.**

Al extender una clase de componente, **los outputs son heredados por la clase hija.**

La función `output` tiene un significado especial para el compilador de Angular. **Solo puedes llamar a `output` en inicializadores de propiedades de componentes y directivas.**

## Emitir datos del evento

Puedes pasar datos del evento al llamar a `emit`:

```ts
// Puedes emitir valores primitivos.
this.valueChanged.emit(7);

// Puedes emitir objetos de evento personalizados
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
})
```

Al definir un event listener en una plantilla, puedes acceder a los datos del evento desde la variable `$event`:

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

Recibe los datos del evento en el componente padre:

```ts
@Component({
 /*...*/
})
export class App {
  logValue(value: number) {
    ...
  }
}

```

## Personalizar nombres de output

La función `output` acepta un parámetro que te permite especificar un nombre diferente para el evento en una plantilla:

```ts
@Component({/*...*/})
export class CustomSlider {
  changed = output({alias: 'valueChanged'});
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

Este alias no afecta el uso de la propiedad en código TypeScript.

Aunque generalmente debes evitar usar alias para outputs de componentes, esta característica puede ser útil para renombrar propiedades mientras se preserva un alias para el nombre original o para evitar colisiones con el nombre de eventos DOM nativos.

## Suscribirse a outputs programáticamente

Al crear un componente dinámicamente, puedes suscribirte programáticamente a eventos de output
desde la instancia del componente. El tipo `OutputRef` incluye un método `subscribe`:

```ts
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);

someComponentRef.instance.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});
```

Angular limpia automáticamente las suscripciones de eventos cuando destruye componentes con suscriptores. Alternativamente, puedes cancelar manualmente la suscripción a un evento. La función `subscribe` devuelve un `OutputRefSubscription` con un método `unsubscribe`:

```ts
const eventSubscription = someComponent.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});

// ...

eventSubscription.unsubscribe();
```

## Elegir nombres de eventos

Evita elegir nombres de output que colisionen con eventos en elementos DOM como HTMLElement. Las colisiones de nombres introducen confusión sobre si la propiedad enlazada pertenece al componente o al elemento DOM.

Evita agregar prefijos para outputs de componentes como lo harías con selectores de componentes. Dado que un elemento dado solo puede alojar un componente, se puede asumir que cualquier propiedad personalizada pertenece al componente.

Siempre usa [camelCase](https://en.wikipedia.org/wiki/Camel_case) para nombres de output. Evita prefijar nombres de output con "on".

## Usar outputs con RxJS

Consulta [Interoperabilidad de RxJS con outputs de componentes y directivas](ecosystem/rxjs-interop/output-interop) para detalles sobre la interoperabilidad entre outputs y RxJS.

## Declarar outputs con el decorador `@Output`

CONSEJO: Aunque el equipo de Angular recomienda usar la función `output` para proyectos nuevos, la
API original basada en decoradores `@Output` sigue siendo completamente compatible.

Alternativamente puedes definir eventos personalizados asignando una propiedad a un nuevo `EventEmitter` y agregando el decorador `@Output`:

```ts
@Component({/*...*/})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
```

Puedes emitir un evento llamando al método `emit` en el `EventEmitter`.

### Alias con el decorador `@Output`

El decorador `@Output` acepta un parámetro que te permite especificar un nombre diferente para el evento en una plantilla:

```ts
@Component({/*...*/})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

Este alias no afecta el uso de la propiedad en código TypeScript.

## Especificar outputs en el decorador `@Component`

Además del decorador `@Output`, también puedes especificar los outputs de un componente con la propiedad `outputs` en el decorador `@Component`. Esto puede ser útil cuando un componente hereda una propiedad de una clase base:

```ts
// `CustomSlider` hereda la propiedad `valueChanged` de `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
```

Además puedes especificar un alias de output en la lista `outputs` poniendo el alias después de dos puntos en la cadena:

```ts
// `CustomSlider` hereda la propiedad `valueChanged` de `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
```
