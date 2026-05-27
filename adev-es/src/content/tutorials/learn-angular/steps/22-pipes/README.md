# Pipes

Los pipes son funciones que se usan para transformar datos en plantillas. En general, los pipes son funciones "puras" que no causan efectos secundarios. Angular tiene varios pipes integrados útiles que puedes importar y usar en tus componentes. También puedes crear un pipe personalizado.

NOTA: Aprende más sobre [pipes en la guía detallada](/guide/templates/pipes).

En esta actividad, importarás un pipe y lo usarás en la plantilla.

<hr>

Para usar un pipe en una plantilla, inclúyelo en una expresión interpolada. Revisa este ejemplo:

<docs-code language="angular-ts" highlight="[1,5,6]">
import {UpperCasePipe} from '@angular/common';

@Component({
...
template: `{{ loudMessage | uppercase }}`,
imports: [UpperCasePipe],
})
export class App {
loudMessage = 'we think you are doing great!'
}
</docs-code>

Ahora, es tu turno de intentarlo:

<docs-workflow>

<docs-step title="Importa el pipe `LowerCase`">
Primero, actualiza `app.ts` agregando la importación a nivel de archivo para `LowerCasePipe` desde `@angular/common`.

```ts
import { LowerCasePipe } from '@angular/common';
```

</docs-step>

<docs-step title="Agrega el pipe a los imports de la plantilla">
A continuación, actualiza los `imports` del decorador `@Component()` para incluir una referencia a `LowerCasePipe`

<docs-code language="ts" highlight="[3]">
@Component({
  ...
  imports: [LowerCasePipe]
})
</docs-code>

</docs-step>

<docs-step title="Agrega el pipe a la plantilla">
Finalmente, en `app.ts` actualiza la plantilla para incluir el pipe `lowercase`:

```ts
template: `{{username | lowercase }}`
```

</docs-step>

</docs-workflow>

Los pipes también pueden aceptar parámetros que se pueden usar para configurar su salida. Descubre más en la siguiente actividad.

P.D. lo estás haciendo excelente ⭐️
