# Convertir el uso de CommonModule a importaciones standalone

Esta migración ayuda a los proyectos a eliminar las importaciones de `CommonModule` dentro de los componentes agregando el conjunto mínimo de importaciones de directivas y pipes que cada plantilla requiere (por ejemplo, `NgIf`, `NgFor`, `AsyncPipe`, etc.).

Ejecuta el schematic usando el siguiente comando:

```shell
ng generate @angular/core:common-to-standalone
```

## Opciones

| Opción | Detalles                                                                                                                                   |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `path` | La ruta (relativa a la raíz del proyecto) a migrar. Por defecto es `./`. Úsala para migrar de forma incremental un subconjunto de tu proyecto. |

## Ejemplo

Antes:

```angular-ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [CommonModule],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `
})
export class ExampleComponent {
  show = true;
  data = Promise.resolve({ message: 'Hello' });
}
```

Después de ejecutar la migración (importaciones del componente agregadas, CommonModule eliminado):

```angular-ts
import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [AsyncPipe, JsonPipe, NgIf],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `
})
export class ExampleComponent {
  show = true;
  data = Promise.resolve({ message: 'Hello' });
}
```
