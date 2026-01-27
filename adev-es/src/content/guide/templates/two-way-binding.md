# Enlace bidireccional

El **enlace bidireccional** es una forma abreviada de enlazar simultáneamente un valor a un elemento, mientras también le da a ese elemento la capacidad de propagar cambios de vuelta a través de este enlace.

## Sintaxis

La sintaxis para el enlace bidireccional es una combinación de corchetes y paréntesis, `[()]`. Combina la sintaxis del enlace de propiedad, `[]`, y la sintaxis del enlace de evento, `()`. La comunidad de Angular se refiere informalmente a esta sintaxis como "banana-in-a-box" (plátano en una caja).

## Enlace bidireccional con controles de formulario

Los desarrolladores comúnmente usan el enlace bidireccional para mantener los datos del componente sincronizados con un control de formulario mientras el usuario interactúa con el control. Por ejemplo, cuando un usuario llena un campo de texto, debería actualizar el estado en el componente.

El siguiente ejemplo actualiza dinámicamente el atributo `firstName` en la página:

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `
})
export class AppComponent {
  firstName = 'Ada';
}
```

Para usar el enlace bidireccional con controles de formulario nativos, necesitas:

1. Importar el `FormsModule` desde `@angular/forms`
1. Usar la directiva `ngModel` con la sintaxis de enlace bidireccional (por ejemplo, `[(ngModel)]`)
1. Asignarle el estado que quieres que actualice (por ejemplo, `firstName`)

Una vez que esté configurado, Angular asegurará que cualquier actualización en el campo de texto se refleje correctamente dentro del estado del componente.

Aprende más sobre [`NgModel`](guide/directives#displaying-and-updating-properties-with-ngmodel) en la documentación oficial.

## Enlace bidireccional entre componentes

Aprovechar el enlace bidireccional entre un componente padre e hijo requiere más configuración en comparación con elementos de formulario.

Aquí hay un ejemplo donde el `AppComponent` es responsable de establecer el estado de conteo inicial, pero la lógica para actualizar y renderizar la UI del contador reside principalmente dentro de su componente hijo `CounterComponent`.

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

### Habilitar el enlace bidireccional entre componentes

Si desglosamos el ejemplo anterior a su núcleo, cada enlace bidireccional para componentes requiere lo siguiente:

El componente hijo debe contener una propiedad `model`.

Aquí hay un ejemplo simplificado:

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({ /* Omitted for brevity */ })
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

El componente padre debe:

1. Envolver el nombre de la propiedad `model` en la sintaxis de enlace bidireccional.
1. Asignar una propiedad o un signal a la propiedad `model`.

Aquí hay un ejemplo simplificado:

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```
