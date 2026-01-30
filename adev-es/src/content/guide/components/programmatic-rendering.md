# Renderizado programático de componentes

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee eso primero si eres nuevo en Angular.

Además de usar un componente directamente en una plantilla, también puedes renderizar componentes dinámicamente
de forma programática. Esto es útil para situaciones cuando un componente es desconocido inicialmente (por lo tanto no puede
ser referenciado en una plantilla directamente) y depende de algunas condiciones.

Hay dos formas principales de renderizar un componente programáticamente: en una plantilla usando `NgComponentOutlet`,
o en tu código TypeScript usando `ViewContainerRef`.

ÚTIL: para casos de uso de carga diferida (por ejemplo si quieres retrasar la carga de un componente pesado), considera
usar la funcionalidad incorporada [`@defer`](/guide/templates/defer) en su lugar. La funcionalidad `@defer` permite que el código
de cualquier componente, directiva y pipe dentro del bloque `@defer` sea extraído en chunks de JavaScript
separados automáticamente y cargados solo cuando sea necesario, basado en los triggers configurados.

## Usando NgComponentOutlet

`NgComponentOutlet` es una directiva estructural que renderiza dinámicamente un componente dado en una
plantilla.

```angular-ts
@Component({ ... })
export class AdminBio { /* ... */ }

@Component({ ... })
export class StandardBio { /* ... */ }

@Component({
  ...,
  template: `
    <p>Profile for {{user.name}}</p>
    <ng-container *ngComponentOutlet="getBioComponent()" /> `
})
export class CustomDialog {
  user = input.required<User>();

  getBioComponent() {
    return this.user().isAdmin ? AdminBio : StandardBio;
  }
}
```

Ve la [referencia de API de NgComponentOutlet](api/common/NgComponentOutlet) para más información sobre las
capacidades de la directiva.

## Usando ViewContainerRef

Un **contenedor de vista** es un nodo en el árbol de componentes de Angular que puede contener contenido. Cualquier componente
o directiva puede inyectar `ViewContainerRef` para obtener una referencia a un contenedor de vista correspondiente a
la ubicación de ese componente o directiva en el DOM.

Puedes usar el método `createComponent` en `ViewContainerRef` para crear y renderizar dinámicamente un
componente. Cuando creas un nuevo componente con un `ViewContainerRef`, Angular lo añade al
DOM como el siguiente hermano del componente o directiva que inyectó el `ViewContainerRef`.

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `
    This is the leaf content
  `,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>This is the start of the outer container</p>
    <inner-item />
    <p>This is the end of the outer container</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `
    <button (click)="loadContent()">Load content</button>
  `,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

En el ejemplo anterior, hacer clic en el botón "Load content" resulta en la siguiente estructura DOM

```angular-html
<outer-container>
  <p>This is the start of the outer container</p>
  <inner-item>
    <button>Load content</button>
  </inner-item>
  <leaf-content>This is the leaf content</leaf-content>
  <p>This is the end of the outer container</p>
</outer-container>
```

## Carga diferida de componentes

ÚTIL: si quieres cargar de forma diferida algunos componentes, puedes considerar usar la funcionalidad incorporada [`@defer`](/guide/templates/defer)
en su lugar.

Si tu caso de uso no está cubierto por la funcionalidad `@defer`, puedes usar ya sea `NgComponentOutlet` o
`ViewContainerRef` con un [import dinámico](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) estándar de JavaScript.

```angular-ts
@Component({
  ...,
  template: `
    <section>
      <h2>Basic settings</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Advanced settings</h2>
      @if(!advancedSettings) {
        <button (click)="loadAdvanced()">
          Load advanced settings
        </button>
      }
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>
  `
})
export class AdminSettings {
  advancedSettings: {new(): AdvancedSettings} | undefined;

  async loadAdvanced() {
    const { AdvancedSettings } = await import('path/to/advanced_settings.js');
    this.advancedSettings = AdvancedSettings;
  }
}
```

El ejemplo anterior carga y muestra el `AdvancedSettings` al recibir un clic en el botón.

## Enlazando inputs, outputs y estableciendo directivas host en la creación

Cuando creas componentes dinámicamente, establecer inputs manualmente y suscribirse a outputs puede ser propenso a errores. A menudo necesitas escribir código extra solo para conectar los enlaces después de que el componente es instanciado.

Para simplificar esto, tanto `createComponent` como `ViewContainerRef.createComponent` soportan pasar un array `bindings` con helpers como `inputBinding()`, `outputBinding()` y `twoWayBinding()` para configurar inputs y outputs de antemano. También puedes especificar un array `directives` para aplicar cualquier directiva host. Esto permite crear componentes programáticamente con enlaces similares a plantillas en una sola llamada declarativa.

### Vista host usando `ViewContainerRef.createComponent`

`ViewContainerRef.createComponent` crea un componente e inserta automáticamente su vista host y elemento host en la jerarquía de vistas del contenedor en la ubicación del contenedor. Usa esto cuando el componente dinámico debe convertirse en parte de la estructura lógica y visual del contenedor (por ejemplo, añadiendo elementos de lista o UI en línea).

Por contraste, la API standalone `createComponent` no adjunta el nuevo componente a ninguna vista existente o ubicación DOM — devuelve un `ComponentRef` y te da control explícito sobre dónde colocar el elemento host del componente.

```angular-ts
import { Component, input, model, output } from "@angular/core";

@Component({
  selector: 'app-warning',
  template: `
      @if(isExpanded()) {
        <section>
            <p>Warning: Action needed!</p>
            <button (click)="close.emit(true)">Close</button>
        </section>
      }
  `
})
export class AppWarningComponent {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import { Component, ViewContainerRef, signal, inputBinding, outputBinding, twoWayBinding, inject } from '@angular/core';
import { FocusTrap } from "@angular/cdk/a11y";
import { ThemeDirective } from '../theme.directive';

@Component({
  template: `<ng-container #container />`
})
export class HostComponent {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarningComponent, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        })
      ],
      directives: [
        FocusTrap,
        { type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')] }
      ]
    });
  }
}
```

En el ejemplo anterior, el **AppWarningComponent** dinámico es creado con su input `canClose` enlazado a un signal reactivo, un enlace bidireccional en su estado `isExpanded`, y un listener de output para `close`. El `FocusTrap` y `ThemeDirective` están adjuntos al elemento host a través de `directives`.

### Popup adjunto a `document.body` con `createComponent` + `hostElement`

Usa esto cuando renderizas fuera de la jerarquía de vistas actual (por ejemplo, overlays). El `hostElement` proporcionado se convierte en el host del componente en el DOM, por lo que Angular no crea un nuevo elemento que coincida con el selector. Te permite configurar **bindings** directamente.

```ts
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
} from '@angular/core';
import { PopupComponent } from './popup.component';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Crear un elemento host para el popup
    const host = document.createElement('popup-host');

    // Crear el componente y enlazar en una sola llamada
    const ref = createComponent(PopupComponent, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        outputBinding('closed', () => {
          document.body.removeChild(host);
          this.appRef.detachView(ref.hostView);
          ref.destroy();
        }),
      ],
    });

    // Registra la vista del componente para que participe en el ciclo de detección de cambios.
    this.appRef.attachView(ref.hostView);
    // Inserta el elemento host proporcionado en el DOM (fuera de la jerarquía normal de vistas de Angular).
    // Esto es lo que hace el popup visible en pantalla, típicamente usado para overlays o modales.
    document.body.appendChild(host);
  }
}
```
