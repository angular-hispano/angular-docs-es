# Creando un pipe personalizado

Puedes crear pipes personalizados en Angular para adaptarte a tus necesidades de transformación de datos.

NOTA: Aprende más sobre [crear pipes personalizados en la guía detallada](/guide/templates/pipes#creating-custom-pipes).

En esta actividad, crearás un pipe personalizado y lo usarás en tu plantilla.

<hr>

Un pipe es una clase TypeScript con un decorador `@Pipe`. Aquí hay un ejemplo:

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'star',
})
export class StarPipe implements PipeTransform {
  transform(value: string): string {
    return `⭐️ ${value} ⭐️`;
  }
}
```

`StarPipe` acepta un valor string y devuelve ese string con estrellas alrededor. Ten en cuenta que:

- el nombre en la configuración del decorador `@Pipe` es lo que se usará en la plantilla
- la función `transform` es donde pones tu lógica

Bien, es tu turno de intentarlo — crearás el `ReversePipe`:

<docs-workflow>

<docs-step title="Crea el `ReversePipe`">

En `reverse.pipe.ts` agrega el decorador `@Pipe` a la clase `ReversePipe` y proporciona la siguiente configuración:

```ts
@Pipe({
  name: 'reverse'
})
```

</docs-step>

<docs-step title="Implementa la función `transform`">

Ahora la clase `ReversePipe` es un pipe. Actualiza la función `transform` para agregar la lógica de reversión:

<docs-code language="ts" highlight="[3,4,5,6,7,8,9]">
export class ReversePipe implements PipeTransform {
  transform(value: string): string {
    let reverse = '';

    for (let i = value.length - 1; i >= 0; i--) {
      reverse += value[i];
    }

    return reverse;

}
}
</docs-code>

</docs-step>

<docs-step title="Usa el `ReversePipe` en la plantilla"></docs-step>
Con la lógica del pipe implementada, el paso final es usarlo en la plantilla. En `app.ts` incluye el pipe en la plantilla y agrégalo a los imports del componente:

<docs-code language="angular-ts" highlight="[3,4]">
@Component({
  ...
  template: `Reverse Machine: {{ word | reverse }}`
  imports: [ReversePipe]
})
</docs-code>

</docs-workflow>

Y con eso lo has logrado. Felicidades por completar esta actividad. Ahora sabes cómo usar pipes e incluso cómo implementar tus propios pipes personalizados.
