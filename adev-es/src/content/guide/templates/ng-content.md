# Renderizar plantillas desde un componente padre con `ng-content`

`<ng-content>` es un elemento especial que acepta marcado o un fragmento de plantilla y controla cómo los componentes renderizan contenido. No renderiza un elemento DOM real.

Aquí hay un ejemplo de un componente `BaseButton` que acepta cualquier marcado de su padre.

```angular-ts {header:'base-button/base-button.ts'}
import {Component} from '@angular/core';

@Component({
  selector: 'button[baseButton]',
  template: `<ng-content />`,
})
export class BaseButton {}
```

```angular-ts {header:'app.ts'}
import {Component} from '@angular/core';
import {BaseButton} from './base-button';

@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `<button baseButton>Next <span class="icon arrow-right"></span></button>`,
})
export class App {}
```

Para más detalle, consulta la [guía en profundidad de `<ng-content>`](/guide/components/content-projection) para otras formas en que puedes aprovechar este patrón.
