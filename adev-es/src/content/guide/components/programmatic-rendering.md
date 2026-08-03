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

## Usando NgComponentOutlet {#using-ngcomponentoutlet}

`NgComponentOutlet` es una directiva estructural que renderiza dinámicamente un componente dado en una
plantilla.

```angular-ts
@Component({/*...*/})
export class AdminBio { /* ... */ }

@Component({/*...*/})
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

### Pasar entradas a componentes renderizados dinámicamente {#passing-inputs-to-dynamically-rendered-components}

Puedes pasar entradas al componente renderizado dinámicamente usando la propiedad `ngComponentOutletInputs`. Esta propiedad acepta un objeto donde las claves son nombres de entradas y los valores son los valores de las entradas.

```angular-ts
@Component({
  selector: 'user-greeting',
  template: `
    <div>
      <p>User: {{ username() }}</p>
      <p>Role: {{ role() }}</p>
    </div>
  `,
})
export class UserGreeting {
  username = input.required<string>();
  role = input('guest');
}

@Component({
  selector: 'profile-view',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="greetingComponent; inputs: greetingInputs()" />`,
})
export class ProfileView {
  greetingComponent = UserGreeting;
  greetingInputs = signal({username: 'ngAwesome', role: 'admin'});
}
```

Las entradas se actualizan cada vez que la signal `greetingInputs` cambia, manteniendo el componente dinámico sincronizado con el estado del padre.

### Proporcionar proyección de contenido {#providing-content-projection}

Usa `ngComponentOutletContent` para pasar contenido proyectado al componente renderizado dinámicamente. Esto es útil cuando el componente dinámico usa `<ng-content>` para mostrar contenido.

```angular-ts
@Component({
  selector: 'card-wrapper',
  template: `
    <div class="card">
      <ng-content />
    </div>
  `,
})
export class CardWrapper {}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container *ngComponentOutlet="cardComponent; content: cardContent()" />

    <ng-template #contentTemplate>
      <h3>Dynamic Content</h3>
      <p>This content is projected into the card.</p>
    </ng-template>
  `,
})
export class DynamicCard {
  private vcr = inject(ViewContainerRef);
  cardComponent = CardWrapper;

  private contentTemplate = viewChild<TemplateRef<unknown>>('contentTemplate');

  cardContent = computed(() => {
    const template = this.contentTemplate();
    if (!template) return [];
    // Devuelve un array de slots de proyección. Cada elemento representa un slot <ng-content>.
    // CardWrapper tiene un <ng-content>, así que devolvemos un array con un elemento.
    return [this.vcr.createEmbeddedView(template).rootNodes];
  });
}
```

NOTA: La hidratación no admite la proyección de nodos DOM creados con APIs nativas del DOM. Esto causa un [error NG0503](/errors/NG0503). Usa APIs de Angular para crear contenido proyectado o agrega `ngSkipHydration` al componente.

### Proporcionar inyectores {#providing-injectors}

Puedes proporcionar un inyector personalizado al componente creado dinámicamente usando `ngComponentOutletInjector`. Esto es útil para proporcionar servicios o configuración específicos del componente.

```angular-ts
export const THEME_DATA = new InjectionToken<string>('THEME_DATA', {
  factory: () => 'light',
});

@Component({
  selector: 'themed-panel',
  template: `<div [class]="theme">...</div>`,
})
export class ThemedPanel {
  theme = inject(THEME_DATA);
}

@Component({
  selector: 'dynamic-panel',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="panelComponent; injector: customInjector" />`,
})
export class DynamicPanel {
  panelComponent = ThemedPanel;

  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

### Acceder a la instancia del componente {#accessing-the-component-instance}

Puedes acceder a la instancia del componente creado dinámicamente usando la característica `exportAs` de la directiva:

```angular-ts
@Component({
  selector: 'counter',
  template: `<p>Count: {{ count() }}</p>`,
})
export class Counter {
  count = signal(0);
  increment() {
    this.count.update((c) => c + 1);
  }
}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container [ngComponentOutlet]="counterComponent" #outlet="ngComponentOutlet" />

    <button (click)="outlet.componentInstance?.increment()">Increment</button>
  `,
})
export class CounterHost {
  counterComponent = Counter;
}
```

NOTA: La propiedad `componentInstance` es `null` antes de que el componente sea renderizado.

## Usando ViewContainerRef {#using-viewcontainerref}

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

## Carga diferida de componentes {#lazy-loading-components}

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

## Enlazando inputs, outputs y estableciendo directivas host en la creación {#binding-inputs-outputs-and-setting-host-directives-at-creation}

Cuando creas componentes dinámicamente, establecer inputs manualmente y suscribirse a outputs puede ser propenso a errores. A menudo necesitas escribir código extra solo para conectar los enlaces después de que el componente es instanciado.

Para simplificar esto, tanto `createComponent` como `ViewContainerRef.createComponent` soportan pasar un array `bindings` con helpers como `inputBinding()`, `outputBinding()` y `twoWayBinding()` para configurar inputs y outputs de antemano. También puedes especificar un array `directives` para aplicar cualquier directiva host. Esto permite crear componentes programáticamente con enlaces similares a plantillas en una sola llamada declarativa.

### Vista host usando `ViewContainerRef.createComponent` {#host-view-using-viewcontainerrefcreatecomponent}

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

### Popup adjunto a `document.body` con `createComponent` + `hostElement` {#popup-attached-to-documentbody-with-createcomponent--hostelement}

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
  Service,
} from '@angular/core';
import {Popup} from './popup';

@Service()
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Crear un elemento host para el popup
    const host = document.createElement('popup-host');

    // Crear el componente y enlazar en una sola llamada
    const ref = createComponent(Popup, {
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
