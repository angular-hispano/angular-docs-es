# Limpiar importaciones no utilizadas

A partir de la versión 19, Angular reporta cuando el array `imports` de un componente contiene símbolos que no se usan en su plantilla.

Ejecutar este schematic limpiará todas las importaciones no utilizadas dentro del proyecto.

Ejecuta el schematic usando el siguiente comando:

```shell
ng generate @angular/core:cleanup-unused-imports
```

#### Antes

```angular-ts
import {Component} from '@angular/core';
import {UnusedDirective} from './unused';

@Component({
  template: 'Hello',
  imports: [UnusedDirective],
})
export class MyComp {}
```

#### Después

```angular-ts
import {Component} from '@angular/core';

@Component({
  template: 'Hello',
  imports: [],
})
export class MyComp {}
```
