# Referenciando hijos de componentes con consultas

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee eso primero si eres nuevo en Angular.

Un componente puede definir **consultas** que encuentran elementos hijos y leen valores de sus inyectores.

Los desarrolladores más comúnmente usan consultas para recuperar referencias a componentes hijos, directivas, elementos DOM, y más.

Todas las funciones de consulta devuelven signals que reflejan los resultados más actualizados. Puedes leer el
resultado llamando a la función signal, incluyendo en contextos reactivos como `computed` y `effect`.

Hay dos categorías de consulta: **consultas de vista** y **consultas de contenido.**

## Consultas de vista

Las consultas de vista recuperan resultados de los elementos en la _vista_ del componente — los elementos definidos en la propia plantilla del componente. Puedes consultar por un solo resultado con la función `viewChild`.

```typescript {highlight: [14, 15]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}
```

En este ejemplo, el componente `CustomCard` consulta por un hijo `CustomCardHeader` y usa el resultado en un `computed`.

Si la consulta no encuentra un resultado, su valor es `undefined`. Esto puede ocurrir si el elemento objetivo está oculto por `@if`. Angular mantiene el resultado de `viewChild` actualizado a medida que el estado de tu aplicación cambia.

También puedes consultar por múltiples resultados con la función `viewChildren`.

```typescript {highlight: [17]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `<custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map(action => action.text);
}
```

`viewChildren` crea un signal con un `Array` de los resultados de la consulta.

**Las consultas nunca atraviesan los límites de los componentes.** Las consultas de vista solo pueden recuperar resultados de la plantilla del componente.

## Consultas de contenido

Las consultas de contenido recuperan resultados de los elementos en el _contenido_ del componente — los elementos anidados dentro del componente en la plantilla donde se usa. Puedes consultar por un solo resultado con la función `contentChild`.

```typescript {highlight: [14, 15]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /* ... */
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}

@Component({
/* ... */
// CustomToggle se usa dentro de CustomExpando como contenido.
template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})

export class UserProfile { }
```

Si la consulta no encuentra un resultado, su valor es `undefined`. Esto puede ocurrir si el elemento objetivo está ausente u oculto por `@if`. Angular mantiene el resultado de `contentChild` actualizado a medida que el estado de tu aplicación cambia.

Por defecto, las consultas de contenido encuentran solo hijos _directos_ del componente y no atraviesan hacia los descendientes.

También puedes consultar por múltiples resultados con la función `contentChildren`.

```typescript {highlight: [14, 16, 17, 18, 19, 20]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})

export class CustomMenu {
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map(item => item.text));
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
```

`contentChildren` crea un signal con un `Array` de los resultados de la consulta.

**Las consultas nunca atraviesan los límites de los componentes.** Las consultas de contenido solo pueden recuperar resultados de la misma plantilla que el componente mismo.

## Consultas requeridas

Si una consulta de hijo (`viewChild` o `contentChild`) no encuentra un resultado, su valor es `undefined`. Esto puede ocurrir si el elemento objetivo está oculto por una declaración de flujo de control como `@if` o `@for`. Debido a esto, las consultas de hijo devuelven un signal que incluye `undefined` en su tipo de valor.

En algunos casos, especialmente con `viewChild`, sabes con certeza que un hijo específico siempre está disponible. En otros casos, puedes querer exigir estrictamente que un hijo específico esté presente. Para estos casos, puedes usar una _consulta requerida_.

```angular-ts
@Component({/* ... */})
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

Si una consulta requerida no encuentra un resultado coincidente, Angular reporta un error. Debido a que esto garantiza que un resultado está disponible, las consultas requeridas no incluyen automáticamente `undefined` en el tipo de valor del signal.

## Localizadores de consulta

El primer parámetro para cada decorador de consulta es su **localizador**.

La mayoría de las veces, quieres usar un componente o directiva como tu localizador.

Alternativamente puedes especificar un localizador de cadena correspondiente a
una [variable de referencia de plantilla](guide/templates/variables#template-reference-variables).

```angular-ts
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```

Si más de un elemento define la misma variable de referencia de plantilla, la consulta recupera el primer elemento coincidente.

Angular no soporta selectores CSS como localizadores de consulta.

### Consultas y el árbol de inyectores

CONSEJO: Ve [Inyección de Dependencias](guide/di) para información de fondo sobre providers y el árbol de inyección de Angular.

Para casos más avanzados, puedes usar cualquier `ProviderToken` como localizador. Esto te permite localizar elementos basados en providers de componentes y directivas.

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem { }

@Component({/*...*/})
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```

El ejemplo anterior usa un `InjectionToken` como localizador, pero puedes usar cualquier `ProviderToken` para localizar elementos específicos.

## Opciones de consulta

Todas las funciones de consulta aceptan un objeto de opciones como segundo parámetro. Estas opciones controlan cómo la consulta encuentra sus resultados.

### Leyendo valores específicos del inyector de un elemento

Por defecto, el localizador de consulta indica tanto el elemento que estás buscando como el valor recuperado. Alternativamente puedes especificar la opción `read` para recuperar un valor diferente del elemento coincidente con el localizador.

```ts

@Component({/*...*/})
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

El ejemplo anterior localiza un elemento con la directiva `ExpandoContent` y recupera
el `TemplateRef` asociado con ese elemento.

Los desarrolladores más comúnmente usan `read` para recuperar `ElementRef` y `TemplateRef`.

### Descendientes de contenido

Por defecto, las consultas de `contentChildren` encuentran solo hijos _directos_ del componente y no atraviesan hacia los descendientes.
Las consultas de `contentChild` sí atraviesan hacia los descendientes por defecto.

```typescript {highlight: [13, 14, 15, 16]}
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChildren(CustomToggle); // ninguno encontrado
  // toggle = contentChild(CustomToggle); // encontrado
}

@Component({
  selector: 'user-profile',
  template: `     <custom-expando>
      <some-other-component>
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `
})
export class UserProfile { }
```

En el ejemplo anterior, `CustomExpando` no puede encontrar `<custom-toggle>` con `contentChildren` porque no es un hijo directo de `<custom-expando>`. Estableciendo `descendants: true`, configuras la consulta para atravesar todos los descendientes en la misma plantilla. Las consultas, sin embargo, _nunca_ atraviesan hacia dentro de componentes para recorrer elementos en otras plantillas.

Las consultas de vista no tienen esta opción porque _siempre_ atraviesan hacia los descendientes.

## Consultas basadas en decoradores

CONSEJO: Aunque el equipo de Angular recomienda usar la función de consulta basada en signals para proyectos nuevos, las
APIs de consulta basadas en decoradores originales permanecen completamente soportadas.

Alternativamente puedes declarar consultas añadiendo el decorador correspondiente a una propiedad. Las consultas basadas en decoradores se comportan de la misma manera que las consultas basadas en signals excepto como se describe a continuación.

### Consultas de vista

Puedes consultar por un solo resultado con el decorador `@ViewChild`.

```typescript {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

  ngAfterViewInit() {
    console.log(this.header.text);
  }
}
```

En este ejemplo, el componente `CustomCard` consulta por un hijo `CustomCardHeader` y accede al resultado en `ngAfterViewInit`.

Angular mantiene el resultado de `@ViewChild` actualizado a medida que el estado de tu aplicación cambia.

**Los resultados de consulta de vista están disponibles en el método de ciclo de vida `ngAfterViewInit`**. Antes de este punto, el valor es `undefined`. Ve la sección [Ciclo de vida](guide/components/lifecycle) para detalles sobre el ciclo de vida del componente.

También puedes consultar por múltiples resultados con el decorador `@ViewChildren`.

```typescript {highlight: [17, 19, 20, 21, 22, 23]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

  ngAfterViewInit() {
    this.actions.forEach(action => {
      console.log(action.text);
    });
  }
}
```

`@ViewChildren` crea un objeto `QueryList` que contiene los resultados de la consulta. Puedes suscribirte a cambios en los resultados de la consulta a lo largo del tiempo a través de la propiedad `changes`.

### Consultas de contenido

Puedes consultar por un solo resultado con el decorador `@ContentChild`.

```typescript {highlight: [14, 16, 17, 18, 25]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})

export class CustomExpando {
  @ContentChild(CustomToggle) toggle: CustomToggle;

  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }
```

En este ejemplo, el componente `CustomExpando` consulta por un hijo `CustomToggle` y accede al resultado en `ngAfterContentInit`.

Angular mantiene el resultado de `@ContentChild` actualizado a medida que el estado de tu aplicación cambia.

**Los resultados de consulta de contenido están disponibles en el método de ciclo de vida `ngAfterContentInit`**. Antes de este punto, el valor es `undefined`. Ve la sección [Ciclo de vida](guide/components/lifecycle) para detalles sobre el ciclo de vida del componente.

También puedes consultar por múltiples resultados con el decorador `@ContentChildren`.

```typescript {highlight: [15, 17, 18, 19, 20, 21]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})

export class CustomMenu {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

  ngAfterContentInit() {
    this.items.forEach(item => {
      console.log(item.text);
    });
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
```

`@ContentChildren` crea un objeto `QueryList` que contiene los resultados de la consulta. Puedes suscribirte a cambios en los resultados de la consulta a lo largo del tiempo a través de la propiedad `changes`.

### Opciones de consulta basadas en decoradores

Todos los decoradores de consulta aceptan un objeto de opciones como segundo parámetro. Estas opciones funcionan de la misma manera que las consultas basadas en signals excepto donde se describe a continuación.

### Consultas estáticas

Los decoradores `@ViewChild` y `@ContentChild` aceptan la opción `static`.

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

Estableciendo `static: true`, garantizas a Angular que el objetivo de esta consulta está _siempre_ presente y no se renderiza condicionalmente. Esto hace que el resultado esté disponible antes, en el método de ciclo de vida `ngOnInit`.

Los resultados de consultas estáticas no se actualizan después de la inicialización.

La opción `static` no está disponible para las consultas `@ViewChildren` y `@ContentChildren`.

### Usando QueryList

`@ViewChildren` y `@ContentChildren` ambos proporcionan un objeto `QueryList` que contiene una lista de resultados.

`QueryList` ofrece varias APIs de conveniencia para trabajar con resultados de manera similar a un array, como `map`, `reduce` y `forEach`. Puedes obtener un array de los resultados actuales llamando a `toArray`.

Puedes suscribirte a la propiedad `changes` para hacer algo cada vez que los resultados cambien.

## Errores comunes con consultas

Al usar consultas, errores comunes pueden hacer que tu código sea más difícil de entender y mantener.

Siempre mantén una única fuente de verdad para el estado compartido entre múltiples componentes. Esto evita escenarios donde el estado repetido en diferentes componentes se desincroniza.

Evita escribir estado directamente a componentes hijos. Este patrón puede llevar a código frágil que es difícil de entender y es propenso a errores de [ExpressionChangedAfterItHasBeenChecked](errors/NG0100).

Nunca escribas estado directamente a componentes padre o ancestros. Este patrón puede llevar a código frágil que es difícil de entender y es propenso a errores de [ExpressionChangedAfterItHasBeenChecked](errors/NG0100).
