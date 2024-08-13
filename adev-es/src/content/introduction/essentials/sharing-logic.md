<docs-decorative-header title="Compartiendo Código" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
La inyección de dependencias le permite compartir código.
</docs-decorative-header>

Cuando necesita compartir lógica entre componentes, Angular aprovecha el patrón de diseño de [inyección de dependencias](guide/di) que le permite crear un "servicio" que le permite inyectar código en componentes mientras lo administra desde una sola fuente de verdad.

## ¿Qué son los servicios?

Los servicios son piezas reutilizables de código que pueden ser inyectados.

Similares a la definición de un componente, los servicios se componen de lo siguiente:

- Un **decorador TypeScript** que declara la clase como un servicio Angular a través de `@Injectable` y le permite definir qué parte de la aplicación puede acceder al servicio a través de la propiedad `providedIn` (que es típicamente `'root'`) para permitir el acceso a un servicio en cualquier parte de la aplicación.
- Una **clase TypeScript** que define el código deseado que será accesible cuando el servicio sea inyectado.

Aquí hay un ejemplo del servicio `Calculator`.

```ts
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## Cómo usar un servicio

Cuando deseas utilizar un servicio en un componente, necesitas:

1. Importar el servicio
2. Declarar un campo de clase donde se inyecta el servicio. Asignar el campo de clase al resultado de la llamada de la función integrada `inject` que crea el servicio

Esto es lo que podría parecer en el componente `Receipt`:

```ts
import { Component } from '@angular/core';
import { CalculatorService } from './calculator.service';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})

export class Receipt {
  private calculatorService = inject(CalculatorService);
  totalCost = this.calculatorService.add(50, 25);
}
```

En este ejemplo, el `CalculatorService` se usa llamando a la función Angular `inject` y pasándole el servicio.

## Siguiente Paso

<docs-pill-row>
  <docs-pill title="Siguientes Pasos Despues de lo Esencial" href="essentials/next-steps" />
</docs-pill-row>
