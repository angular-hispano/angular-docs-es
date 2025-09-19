# API de composición de directivas

Las directivas de Angular ofrecen una excelente manera de encapsular comportamientos reutilizables: las directivas pueden aplicar atributos, 
clases CSS y escuchadores de eventos a un elemento.

La *API de composición de directivas* te permite aplicar directivas al elemento host de un componente desde 
*dentro* de la clase TypeScript del componente.

## Añadiendo directivas a un componente

Se aplican directivas a un componente añadiendo una propiedad `hostDirectives` al decorador de un componente. 
Llamamos a tales directivas *directivas host*.

En este ejemplo, aplicamos la directiva `MenuBehavior` 
al elemento host de `AdminMenu`. Esto funciona de manera similar a aplicar `MenuBehavior` al elemento `<admin-menu>` en una plantilla.

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

Cuando el framework renderiza un componente, Angular también crea una instancia de cada directiva host. 
Los enlaces host de las directivas se aplican al elemento host del componente. 
Por defecto, las entradas y salidas de las directivas host no se exponen como parte de la API pública del componente. 
Consulta [Incluyendo entradas y salidas](#incluyendo-entradas-y-salidas) a continuación para más información.

**Angular aplica las directivas host estáticamente en tiempo de compilación.** 
No puedes añadir dinámicamente directivas en tiempo de ejecución.

**Las directivas usadas en `hostDirectives` no pueden especificar `standalone: false`.**

**Angular ignora el `selector` de las directivas aplicadas en la propiedad `hostDirectives`.**

## Incluyendo entradas y salidas

Cuando aplicas `hostDirectives` a tu componente, los inputs y outputs de las directivas host
no se incluyen en la API de tu componente de manera predeterminada.
Puedes incluir explícitamente esos inputs y outputs expandiendo la entrada en `hostDirectives`:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId'],
    outputs: ['menuClosed'],
  }],
})
export class AdminMenu { }
```

Al especificar explícitamente los inputs y outputs, los consumidores del componente con
`hostDirective` pueden enlazarlos en una plantilla:

```angular-html

<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()">
```

Además, puedes asignar alias a los inputs y outputs de `hostDirective` para personalizar la API
de tu componente:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId: id'],
    outputs: ['menuClosed: closed'],
  }],
})
export class AdminMenu { }
```

```angular-html

<admin-menu id="top-menu" (closed)="logMenuClosed()">
```

## Añadiendo directivass a otra directiva

También puedes agregar `hostDirectives` a otras directivas, además de a componentes.
Esto habilita la agregación transitiva de múltiples comportamientos.

En el siguiente ejemplo, definimos dos directivas, `Menu` y `Tooltip`.
Luego componemos el comportamiento de estas dos directivas en `MenuWithTooltip`.
Finalmente, aplicamos `MenuWithTooltip` a `SpecializedMenuWithTooltip`.

Cuando `SpecializedMenuWithTooltip` se usa en una plantilla, crea instancias de `Menu`, `Tooltip`
y `MenuWithTooltip`. Los host bindings de cada una de estas directivas se aplican al elemento host
de `SpecializedMenuWithTooltip`.

```typescript
@Directive({...})
export class Menu { }

@Directive({...})
export class Tooltip { }

// MenuWithTooltip puede componer comportamientos de múltiples directivas
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }

// CustomWidget puede aplicar los comportamientos ya compuestos de MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```

## Semántica de las directivas host

### Orden de ejecución de las directivas

Las directivas host siguen el mismo ciclo de vida que los componentes y directivas usadas
directamente en una plantilla.
Sin embargo, las directivas host siempre ejecutan su constructor, hooks de ciclo de vida y
bindings _antes_ que el componente o directiva sobre el cual se aplican.

El siguiente ejemplo muestra el uso mínimo de una directiva host:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

El orden de ejecución aquí es:

1. Se instancia `MenuBehavior`
2. Se instancia `AdminMenu`
3. `MenuBehavior` recibe entradas (`ngOnInit`)
4. `AdminMenu` recibe entradas (`ngOnInit`)
5. `MenuBehavior` aplica host bindings
6. `AdminMenu` aplica host bindings

Este orden de operaciones significa que los componentes con `hostDirectives` pueden sobrescribir
cualquier host binding especificado por una directiva host.

Este orden también se aplica a cadenas anidadas de directivas host, como se muestra en el siguiente ejemplo:

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```
En el ejemplo anterior, el orden de ejecución es:

1. Se instancia `Tooltip`
2. Se instancia `CustomTooltip`
3. Se instancia `EvenMoreCustomTooltip`
4. `Tooltip` recibe entradas (`ngOnInit`)
5. `CustomTooltip` recibe entradas (`ngOnInit`)
6. `EvenMoreCustomTooltip` recibe entradas (`ngOnInit`)
7. `Tooltip` aplica host bindings
8. `CustomTooltip` aplica host bindings
9. `EvenMoreCustomTooltip` aplica host bindings

### Dependency injection

Un componente o directiva que especifica `hostDirectives` puede inyectar las instancias de esas
directivas host y viceversa.

Cuando aplicas directivas host a un componente, tanto el componente como las directivas host
pueden definir providers.

Si un componente o directiva con `hostDirectives` y esas directivas host proveen el mismo token de
inyección, los providers definidos en la clase con `hostDirectives` tienen precedencia sobre
los providers definidos en las directivas host.
