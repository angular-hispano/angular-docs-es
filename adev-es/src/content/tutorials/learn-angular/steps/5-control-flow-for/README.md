# Control de flujo en componentes - `@for`

A menudo, al construir aplicaciones web, necesitas repetir algún código una cantidad específica de veces - por ejemplo, dado un arreglo de nombres, puede que quieras mostrar cada nombre en una etiqueta `<p>`.

NOTA: Aprende más sobre [control de flujo en la guía esencial](/essentials/templates#control-flow-with-if-and-for).

En esta actividad, aprenderás cómo usar `@for` para repetir elementos en una plantilla.

<hr/>

La sintaxis que permite repetir elementos en una plantilla es `@for`.

Aquí hay un ejemplo de cómo usar la sintaxis `@for` en un componente:

```angular-ts
@Component({
  ...
  template: `
    @for (os of operatingSystems; track os.id) {
      {{ os.name }}
    }
  `,
})
export class App {
  operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'MacOS'}, {id: 'linux', name: 'Linux'}];
}
```

Dos cosas a tener en cuenta:

- Hay un prefijo `@` para `for` porque es una sintaxis especial llamada [sintaxis de plantillas de Angular](guide/templates)
- Para aplicaciones que usan v16 y anteriores, consulta la [documentación de Angular para NgFor](guide/directives/structural-directives)

<docs-workflow>

<docs-step title="Agrega la propiedad `users`">
En la clase `App`, agrega una propiedad llamada `users` que contenga usuarios y sus nombres.

```ts
[{id: 0, name: 'Sarah'}, {id: 1, name: 'Amy'}, {id: 2, name: 'Rachel'}, {id: 3, name: 'Jessica'}, {id: 4, name: 'Poornima'}]
```

</docs-step>

<docs-step title="Actualiza la plantilla">
Actualiza la plantilla para mostrar cada nombre de usuario en un elemento `p` usando la sintaxis de plantilla `@for`.

```angular-html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

NOTA: el uso de `track` es obligatorio, puedes usar el `id` o algún otro identificador único.

</docs-step>

</docs-workflow>

Este tipo de funcionalidad se llama control de flujo. A continuación, aprenderás a personalizar y comunicarte con componentes - por cierto, lo estás haciendo muy bien hasta ahora.
