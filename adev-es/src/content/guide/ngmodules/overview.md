# NgModules

IMPORTANTE: El equipo de Angular recomienda usar [componentes standalone](guide/components/anatomy-of-components#-imports-in-the-component-decorator) en lugar de `NgModule` para todo código nuevo. Usa esta guía para entender código existente construido con `@NgModule`.

Un NgModule es una clase marcada con el decorador `@NgModule`. Este decorador acepta _metadatos_ que le indican a Angular cómo compilar las plantillas de componentes y configurar la inyección de dependencias.

```typescript
import {NgModule} from '@angular/core';

@NgModule({
  // Los metadatos van aquí
})
export class CustomMenuModule { }
```

Un NgModule tiene dos responsabilidades principales:

- Declarar los componentes, directivas y pipes que pertenecen al NgModule
- Agregar proveedores al inyector para los componentes, directivas y pipes que importan el NgModule

## Declarations

La propiedad `declarations` de los metadatos de `@NgModule` declara los componentes, directivas y pipes que pertenecen al NgModule.

```typescript
@NgModule({
  /* ... */
  // CustomMenu y CustomMenuItem son componentes.
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule { }
```

En el ejemplo anterior, los componentes `CustomMenu` y `CustomMenuItem` pertenecen a `CustomMenuModule`.

La propiedad `declarations` también acepta _arrays_ de componentes, directivas y pipes. Estos arrays, a su vez, también pueden contener otros arrays.

```typescript
const MENU_COMPONENTS = [CustomMenu, CustomMenuItem];
const WIDGETS = [MENU_COMPONENTS, CustomSlider];

@NgModule({
  /* ... */
  // Este NgModule declara todos: CustomMenu, CustomMenuItem,
  // CustomSlider y CustomCheckbox.
  declarations: [WIDGETS, CustomCheckbox],
})
export class CustomMenuModule { }
```

Si Angular detecta algún componente, directiva o pipe declarado en más de un NgModule, reporta un error.

Todo componente, directiva o pipe debe estar marcado explícitamente como `standalone: false` para poder ser declarado en un NgModule.

```typescript
@Component({
  // Marca este componente como `standalone: false` para que pueda ser declarado en un NgModule.
  standalone: false,
  /* ... */
})
export class CustomMenu { /* ... */ }
```

### imports

Los componentes declarados en un NgModule pueden depender de otros componentes, directivas y pipes. Agrega estas dependencias a la propiedad `imports` de los metadatos de `@NgModule`.

```typescript
@NgModule({
  /* ... */
  // CustomMenu y CustomMenuItem dependen de los componentes PopupTrigger y SelectorIndicator.
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule { }
```

El array `imports` acepta otros NgModules, así como componentes, directivas y pipes standalone.

### exports

Un NgModule puede _exportar_ sus componentes, directivas y pipes declarados para que estén disponibles para otros componentes y NgModules.

```typescript
@NgModule({
 imports: [PopupTrigger, SelectionIndicator],
 declarations: [CustomMenu, CustomMenuItem],

 // Hacer que CustomMenu y CustomMenuItem estén disponibles para
 // los componentes y NgModules que importen CustomMenuModule.
 exports: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule { }
```

La propiedad `exports` no se limita a las declaraciones. Un NgModule también puede exportar cualquier otro componente, directiva, pipe y NgModule que importe.

```typescript
@NgModule({
 imports: [PopupTrigger, SelectionIndicator],
 declarations: [CustomMenu, CustomMenuItem],

 // También hacer que PopupTrigger esté disponible para cualquier componente o NgModule que importe CustomMenuModule.
 exports: [CustomMenu, CustomMenuItem, PopupTrigger],
})
export class CustomMenuModule { }
```

## Proveedores de `NgModule`

CONSEJO: Consulta la [guía de Inyección de Dependencias](guide/di) para información sobre inyección de dependencias y proveedores.

Un `NgModule` puede especificar `providers` para dependencias inyectadas. Estos proveedores están disponibles para:

- Cualquier componente, directiva o pipe standalone que importe el NgModule, y
- Las `declarations` y `providers` de cualquier _otro_ NgModule que importe el NgModule.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Proveer el servicio OverlayManager
  providers: [OverlayManager],
  /* ... */
})
export class CustomMenuModule { }

@NgModule({
  imports: [CustomMenuModule],
  declarations: [UserProfile],
  providers: [UserDataClient],
})
export class UserProfileModule { }
```

En el ejemplo anterior:

- `CustomMenuModule` provee `OverlayManager`.
- Los componentes `CustomMenu` y `CustomMenuItem` pueden inyectar `OverlayManager` porque están declarados en `CustomMenuModule`.
- `UserProfile` puede inyectar `OverlayManager` porque su NgModule importa `CustomMenuModule`.
- `UserDataClient` puede inyectar `OverlayManager` porque su NgModule importa `CustomMenuModule`.

### El patrón `forRoot` y `forChild`

Algunos NgModules definen un método estático `forRoot` que acepta cierta configuración y devuelve un array de proveedores. El nombre "`forRoot`" es una convención que indica que estos proveedores están destinados a agregarse exclusivamente en la _raíz_ de tu aplicación durante el bootstrap.

Cualquier proveedor incluido de esta manera se carga de forma eager, lo que aumenta el tamaño del bundle de JavaScript en la carga inicial de la página.

```typescript
bootstrapApplication(MyApplicationRoot, {
  providers: [
    CustomMenuModule.forRoot(/* alguna configuración */),
  ],
});
```

De manera similar, algunos NgModules pueden definir un método estático `forChild` que indica que los proveedores están destinados a agregarse a los componentes dentro de la jerarquía de tu aplicación.

```typescript
@Component({
  /* ... */
  providers: [
    CustomMenuModule.forChild(/* alguna configuración */),
  ],
})
export class UserProfile { /* ... */ }
```

## Bootstrap de una aplicación

IMPORTANTE: El equipo de Angular recomienda usar [bootstrapApplication](api/platform-browser/bootstrapApplication) en lugar de `bootstrapModule` para todo código nuevo. Usa esta guía para entender aplicaciones existentes que usan bootstrap con `@NgModule`.

El decorador `@NgModule` acepta un array opcional `bootstrap` que puede contener uno o más componentes.

Puedes usar el método [`bootstrapModule`](https://angular.dev/api/core/PlatformRef#bootstrapModule) de [`platformBrowser`](api/platform-browser/platformBrowser) o [`platformServer`](api/platform-server/platformServer) para iniciar una aplicación Angular. Al ejecutarse, esta función localiza todos los elementos de la página cuyo selector CSS coincide con los componentes listados y los renderiza en la página.

```typescript
import {platformBrowser} from '@angular/platform-browser';

@NgModule({
  bootstrap: [MyApplication],
})
export class MyApplicationModule { }

platformBrowser().bootstrapModule(MyApplicationModule);
```

Los componentes listados en `bootstrap` se incluyen automáticamente en las declaraciones del NgModule.

Cuando haces bootstrap de una aplicación desde un NgModule, los `providers` recopilados de ese módulo y todos los `providers` de sus `imports` se cargan de forma eager y están disponibles para inyectarse en toda la aplicación.
