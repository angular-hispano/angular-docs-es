<docs-decorative-header title="Injección de Dependencias" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
Reutiliza código y controlar comportamientos en toda tu aplicación y durante las pruebas automatizadas.
</docs-decorative-header>

Cuando necesitas compartir la lógica entre componentes, Angular aprovecha el patrón de [inyección de dependencias](guide/di) que te permite crear un "servicio", el cual te permite inyectar código en componentes mientras lo manejas desde una única fuente de verdad.

## ¿Qué son los servicios? {#what-are-services}

Los servicios son piezas reutilizables de código que pueden ser inyectadas.

Similar a definir un componente, los servicios están compuestos de lo siguiente:

- Un **decorador TypeScript** que declara la clase como un servicio Angular vía `@Service` y te permite definir un servicio que puede ser accedido en cualquier lugar de tu aplicación.
- Una **clase TypeScript** que define el código deseado que será accesible cuando el servicio sea inyectado

Aquí hay un ejemplo de un servicio `Calculator`.

```angular-ts
import {Service} from '@angular/core';

@Service()
export class Calculator {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## ¿Cómo usar un servicio? {#how-to-use-a-service}

Cuando quieres usar un servicio en un componente, necesitas:

1. Importar el servicio
2. Declarar un campo de clase donde el servicio es inyectado. Asignar el campo de clase al resultado de la llamada de la función integrada [`inject`](/api/core/inject) que crea el servicio

Aquí está cómo se vería en el componente `Receipt`:

```angular-ts
import {Component, inject} from '@angular/core';
import {Calculator} from './calculator';

@Component({
  selector: 'app-receipt',
  template: `<h1>El total {{ totalCost }}</h1>`,
})

export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```

En este ejemplo, el `Calculator` está siendo usado llamando la función Angular [`inject`](/api/core/inject) y pasándole el servicio.

## Siguiente Paso {#next-step}

<docs-pill-row>
  <docs-pill title="Próximos pasos después de los Fundamentos" href="essentials/next-steps" />
  <docs-pill title="Guía detallada de inyección de dependencias" href="guide/di" />
</docs-pill-row>
