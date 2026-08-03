# Crear fragmentos de plantilla con ng-template

Inspirado por el [elemento nativo `<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template), el elemento `<ng-template>` te permite declarar un **fragmento de plantilla** – una sección de contenido que puedes renderizar dinámica o programáticamente.

## Creando un fragmento de plantilla {#creating-a-template-fragment}

Puedes crear un fragmento de plantilla dentro de cualquier plantilla de componente con el elemento `<ng-template>`:

```angular-html
<p>This is a normal element</p>

<ng-template>
  <p>This is a template fragment</p>
</ng-template>
```

Cuando lo anterior se renderiza, el contenido del elemento `<ng-template>` no se renderiza en la página. En su lugar, puedes obtener una referencia al fragmento de plantilla y escribir código para renderizarlo dinámicamente.

### Contexto de enlace para fragmentos {#binding-context-for-fragments}

Los fragmentos de plantilla pueden contener enlaces con expresiones dinámicas:

```angular-ts
@Component({
  /* ... */,
  template: `<ng-template>You've selected {{count}} items.</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}
```

Las expresiones o declaraciones en un fragmento de plantilla se evalúan contra el componente en el que se declara el fragmento, independientemente de dónde se renderice el fragmento.

## Obteniendo una referencia a un fragmento de plantilla {#getting-a-reference-to-a-template-fragment}

Puedes obtener una referencia a un fragmento de plantilla de una de tres formas:

- Declarando una [variable de referencia de plantilla](/guide/templates/variables#template-reference-variables) en el elemento `<ng-template>`
- Consultando por el fragmento con [una consulta de componente o directiva](/guide/components/queries)
- Inyectando el fragmento en una directiva que se aplica directamente a un elemento `<ng-template>`.

En los tres casos, el fragmento está representado por un objeto [TemplateRef](/api/core/TemplateRef).

### Referenciando un fragmento de plantilla con una variable de referencia de plantilla {#referencing-a-template-fragment-with-a-template-reference-variable}

Puedes agregar una variable de referencia de plantilla a un elemento `<ng-template>` para referenciar ese fragmento de plantilla en otras partes del mismo archivo de plantilla:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Luego puedes referenciar este fragmento en cualquier otro lugar de la plantilla a través de la variable `myFragment`.

### Referenciando un fragmento de plantilla con consultas {#referencing-a-template-fragment-with-queries}

Puedes obtener una referencia a un fragmento de plantilla usando cualquier [API de consulta de componente o directiva](/guide/components/queries).

Puedes consultar el objeto `TemplateRef` directamente usando una consulta `viewChild`.

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template>
      <p>This is a template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  templateRef = viewChild<TemplateRef<unknown>>(TemplateRef);
}
```

Luego puedes referenciar este fragmento en el código de tu componente o en la plantilla del componente como cualquier otro miembro de clase.

Si una plantilla contiene múltiples fragmentos, puedes asignar un nombre a cada fragmento agregando una variable de referencia de plantilla a cada elemento `<ng-template>` y consultando por los fragmentos basándote en ese nombre:

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template #fragmentOne>
      <p>This is one template fragment</p>
    </ng-template>

    <ng-template #fragmentTwo>
      <p>This is another template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
    fragmentOne = viewChild<TemplateRef<unknown>>('fragmentOne');
    fragmentTwo = viewChild<TemplateRef<unknown>>('fragmentTwo');
}
```

Nuevamente, luego puedes referenciar estos fragmentos en el código de tu componente o en la plantilla del componente como cualquier otro miembro de clase.

### Inyectando un fragmento de plantilla {#injecting-a-template-fragment}

Una directiva puede inyectar un `TemplateRef` si esa directiva se aplica directamente a un elemento `<ng-template>`:

```angular-ts
@Directive({
  selector: '[myDirective]'
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}
```

```angular-html
<ng-template myDirective>
  <p>This is one template fragment</p>
</ng-template>
```

Luego puedes referenciar este fragmento en el código de tu directiva como cualquier otro miembro de clase.

## Renderizando un fragmento de plantilla {#rendering-a-template-fragment}

Una vez que tienes una referencia al objeto `TemplateRef` de un fragmento de plantilla, puedes renderizar un fragmento de una de dos formas: en tu plantilla con la directiva `NgTemplateOutlet` o en tu código TypeScript con `ViewContainerRef`.

### Usando `NgTemplateOutlet` {#using-ngtemplateoutlet}

La directiva `NgTemplateOutlet` de `@angular/common` acepta un `TemplateRef` y renderiza el fragmento como un **hermano** del elemento con el outlet. Generalmente deberías usar `NgTemplateOutlet` en un [elemento `<ng-container>`](/guide/templates/ng-container).

Primero, importa `NgTemplateOutlet`:

```typescript
import { NgTemplateOutlet } from '@angular/common';
```

El siguiente ejemplo declara un fragmento de plantilla y renderiza ese fragmento en un elemento `<ng-container>` con `NgTemplateOutlet`:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a fragment</p>
</ng-template>

<ng-container *ngTemplateOutlet="myFragment"></ng-container>
```

Este ejemplo produce el siguiente DOM renderizado:

```angular-html
<p>This is a normal element</p>
<p>This is a fragment</p>
```

### Usando `ViewContainerRef` {#using-viewcontainerref}

Un **contenedor de vista** es un nodo en el árbol de componentes de Angular que puede contener contenido. Cualquier componente o directiva puede inyectar `ViewContainerRef` para obtener una referencia a un contenedor de vista correspondiente a la ubicación de ese componente o directiva en el DOM.

Puedes usar el método `createEmbeddedView` en `ViewContainerRef` para renderizar dinámicamente un fragmento de plantilla. Cuando renderizas un fragmento con un `ViewContainerRef`, Angular lo agrega al DOM como el siguiente hermano del componente o directiva que inyectó el `ViewContainerRef`.

El siguiente ejemplo muestra un componente que acepta una referencia a un fragmento de plantilla como entrada y renderiza ese fragmento en el DOM al hacer clic en un botón.

```angular-ts
@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>Component with a fragment</h2>
    <ng-template #myFragment>
      <p>This is the fragment</p>
    </ng-template>
    <my-outlet [fragment]="myFragment" />
  `,
})
export class ComponentWithFragment { }

@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="showFragment()">Show</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  fragment = input<TemplateRef<unknown> | undefined>();

  showFragment() {
    if (this.fragment()) {
      this.viewContainer.createEmbeddedView(this.fragment());
    }
  }
}
```

En el ejemplo anterior, hacer clic en el botón "Show" resulta en la siguiente salida:

```angular-html
<component-with-fragment>
  <h2>Component with a fragment>
  <my-outlet>
    <button>Show</button>
  </my-outlet>
  <p>This is the fragment</p>
</component-with-fragment>
```

## Pasando parámetros al renderizar un fragmento de plantilla {#passing-parameters-when-rendering-a-template-fragment}

Al declarar un fragmento de plantilla con `<ng-template>`, puedes adicionalmente declarar parámetros aceptados por el fragmento. Cuando renderizas un fragmento, puedes opcionalmente pasar un objeto `context` correspondiente a estos parámetros. Puedes usar datos de este objeto de contexto en expresiones y declaraciones de enlace, además de referenciar datos del componente en el que se declara el fragmento.

Cada parámetro se escribe como un atributo con prefijo `let-` con un valor que coincide con un nombre de propiedad en el objeto de contexto:

```angular-html
<ng-template let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>
```

### Usando `NgTemplateOutlet` {#using-ngtemplateoutlet-with-parameters}

Puedes vincular un objeto de contexto a la entrada `ngTemplateOutletContext`:

```angular-html
<ng-template #myFragment let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>

<ng-container
  [ngTemplateOutlet]="myFragment"
  [ngTemplateOutletContext]="{topping: 'onion'}"
/>
```

### Usando `ViewContainerRef` {#using-viewcontainerref-with-parameters}

Puedes pasar un objeto de contexto como segundo argumento a `createEmbeddedView`:

```angular-ts
this.viewContainer.createEmbeddedView(this.myFragment, {topping: 'onion'});
```

## Proveer injectors a fragmentos de plantilla {#providing-injectors-to-template-fragments}

Cuando renderizas un fragmento de plantilla, su contexto de injector proviene de la **ubicación de declaración de la plantilla**, no de donde se renderiza. Puedes sobrescribir este comportamiento proporcionando un injector personalizado.

### Usar `NgTemplateOutlet` con injectors {#using-ngtemplateoutlet-with-injectors}

Puedes pasar un `Injector` personalizado al input `ngTemplateOutletInjector`:

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
  selector: 'root',
  imports: [NgTemplateOutlet, ThemedPanel],
  template: `
    <ng-template #myFragment>
      <themed-panel />
    </ng-template>
    <ng-container *ngTemplateOutlet="myFragment; injector: customInjector" />
  `,
})
export class Root {
  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

#### Heredar el injector del outlet {#inheriting-the-outlets-injector}

Puedes establecer `ngTemplateOutletInjector` con el string `'outlet'` para hacer que la vista embebida herede su injector de la ubicación del outlet en el DOM en lugar de desde donde se declaró la plantilla.

```angular-html
<ng-template #node let-items>
  <item-component>
    @for (child of items; track $index) {
      <ng-container
        *ngTemplateOutlet="node; context: {$implicit: child.children}; injector: 'outlet'"
      />
    }
  </item-component>
</ng-template>

<ng-container *ngTemplateOutlet="node; context: {$implicit: topLevelItems}" />
```

Cada renderizado recursivo de la plantilla `node` hereda el injector del `<item-component>` circundante, permitiendo que cada nivel anidado acceda a providers con ámbito de su componente padre.

NOTA: Esto es útil para construir estructuras recursivas o cualquier situación donde la plantilla renderizada necesita acceso a providers del árbol de componentes en el sitio del outlet.

### Usar `ViewContainerRef` con injectors {#using-viewcontainerref-with-injectors}

Puedes pasar un injector personalizado como parte del objeto de opciones en `createEmbeddedView`:

```ts
this.viewContainer.createEmbeddedView(this.myFragment, context, {
  injector: myCustomInjector,
});
```

## Directivas estructurales {#structural-directives}

Una **directiva estructural** es cualquier directiva que:

- Inyecta `TemplateRef`
- Inyecta `ViewContainerRef` y renderiza programáticamente el `TemplateRef` inyectado

Angular soporta una sintaxis de conveniencia especial para directivas estructurales. Si aplicas la directiva a un elemento y prefigas el selector de la directiva con un carácter asterisco (`*`), Angular interpreta el elemento completo y todo su contenido como un fragmento de plantilla:

```angular-html
<section *myDirective>
  <p>This is a fragment</p>
</section>
```

Esto es equivalente a:

```angular-html
<ng-template myDirective>
  <section>
    <p>This is a fragment</p>
  </section>
</ng-template>
```

Los desarrolladores típicamente usan directivas estructurales para renderizar fragmentos condicionalmente o renderizar fragmentos múltiples veces.

Para más detalles, consulta [Directivas Estructurales](/guide/directives/structural-directives).

## Recursos adicionales {#additional-resources}

Para ejemplos de cómo se usa `ng-template` en otras bibliotecas, consulta:

- [Tabs de Angular Material](https://material.angular.dev/components/tabs/overview) - nada se renderiza en el DOM hasta que la pestaña se activa
- [Table de Angular Material](https://material.angular.dev/components/table/overview) - permite a los desarrolladores definir diferentes formas de renderizar datos
