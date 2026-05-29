# Creando y actualizando tu primer signal

¡Bienvenido al tutorial de signals de Angular! Los [signals](/essentials/signals) son la primitiva reactiva de Angular que proporciona una forma de gestionar estado y actualizar automáticamente tu UI cuando ese estado cambia.

En esta actividad, aprenderás cómo:

- Crear tu primer signal usando la función `signal()`
- Mostrar su valor en una plantilla
- Actualizar el valor del signal usando los métodos `set()` y `update()`

¡Construyamos un sistema interactivo de estado de usuario con signals!

<hr />

<docs-workflow>

<docs-step title="Importa la función signal">
Importa la función `signal` desde `@angular/core` al inicio de tu archivo de componente.

```ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Crea un signal en tu componente">
Agrega un signal `userStatus` a tu clase de componente que se inicialice con un valor de `'offline'`.

```ts
@Component({
  /* Config omitida */
})
export class App {
  userStatus = signal<'online' | 'offline'>('offline');
}
```

</docs-step>

<docs-step title="Muestra el valor del signal en la plantilla">
Actualiza el indicador de estado para mostrar el estado actual del usuario:
1. Vinculando el signal al atributo class con `[class]="userStatus()"`
2. Mostrando el texto de estado reemplazando `???` con `{{ userStatus() }}`

```html
<!-- Actualizar desde: -->
<div class="status-indicator offline">
  <span class="status-dot"></span>
  Status: ???
</div>

<!-- A: -->
<div class="status-indicator" [class]="userStatus()">
  <span class="status-dot"></span>
  Status: {{ userStatus() }}
</div>
```

Observa cómo llamamos al signal `userStatus()` con paréntesis para leer su valor.
</docs-step>

<docs-step title="Agrega métodos para actualizar el signal">
Agrega métodos a tu componente que cambien el estado del usuario usando el método `set()`.

```ts
goOnline() {
  this.userStatus.set('online');
}

goOffline() {
  this.userStatus.set('offline');
}
```

El método `set()` reemplaza el valor del signal completamente con un nuevo valor.

</docs-step>

<docs-step title="Conecta los botones de control">
Los botones ya están en la plantilla. Ahora conéctalos a tus métodos agregando:
1. Manejadores de clic con `(click)`
2. Estados deshabilitados con `[disabled]` cuando ya están en ese estado

```html
<!-- Agregar enlaces a los botones existentes: -->
<button (click)="goOnline()" [disabled]="userStatus() === 'online'">
  Go Online
</button>
<button (click)="goOffline()" [disabled]="userStatus() === 'offline'">
  Go Offline
</button>
```

</docs-step>

<docs-step title="Agrega un método toggle usando update()">
Agrega un método `toggleStatus()` que cambie entre online y offline usando el método `update()`.

```ts
toggleStatus() {
  this.userStatus.update(current => current === 'online' ? 'offline' : 'online');
}
```

El método `update()` toma una función que recibe el valor actual y devuelve el nuevo valor. Esto es útil cuando necesitas modificar el valor existente basado en su estado actual.

</docs-step>

<docs-step title="Agrega el manejador del botón toggle">
El botón toggle ya está en la plantilla. Conéctalo a tu método `toggleStatus()`:

```html
<button (click)="toggleStatus()" class="toggle-btn">
  Toggle Status
</button>
```

</docs-step>

</docs-workflow>

¡Felicidades! Has creado tu primer signal y aprendido cómo actualizarlo usando los métodos `set()` y `update()`. La función `signal()` crea un valor reactivo que Angular rastrea, y cuando lo actualizas, tu UI refleja automáticamente los cambios.

A continuación, aprenderás [cómo derivar estado de signals usando computed](/tutorials/signals/2-deriving-state-with-computed-signals)!

<docs-callout helpful title="Acerca de ChangeDetectionStrategy.OnPush">

Puedes notar `ChangeDetectionStrategy.OnPush` en el decorador del componente a lo largo de este tutorial. Esta es una optimización de rendimiento para componentes Angular que usan signals. Por ahora, puedes ignorarlo de forma segura — solo debes saber que ayuda a tu aplicación a funcionar más rápido cuando usas signals. Puedes aprender más en la [documentación de la API de estrategias de detección de cambios](/api/core/ChangeDetectionStrategy).

</docs-callout>
