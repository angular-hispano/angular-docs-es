# Control de flujo en componentes - `@if`

Decidir qué mostrar en la pantalla para un usuario es una tarea común en el desarrollo de aplicaciones. Muchas veces, la decisión se toma programáticamente usando condiciones.

Para expresar visualizaciones condicionales en plantillas, Angular usa la sintaxis de plantilla `@if`.

NOTA: Aprende más sobre [control de flujo en la guía esencial](/essentials/templates#control-flow-with-if-and-for).

En esta actividad, aprenderás cómo usar condicionales en plantillas.

<hr/>

La sintaxis que permite la visualización condicional de elementos en una plantilla es `@if`.

Aquí hay un ejemplo de cómo usar la sintaxis `@if` en un componente:

```angular-ts
@Component({
  ...
  template: `
    @if (isLoggedIn) {
      <p>Welcome back, Friend!</p>
    }
  `,
})
export class App {
  isLoggedIn = true;
}
```

Dos cosas a tener en cuenta:

- Hay un prefijo `@` para `if` porque es un tipo especial de sintaxis llamada [sintaxis de plantillas de Angular](guide/templates)
- Para aplicaciones que usan v16 y anteriores, consulta la [documentación de Angular para NgIf](guide/directives/structural-directives) para más información.

<docs-workflow>

<docs-step title="Crea una propiedad llamada `isServerRunning`">
En la clase `App`, agrega una propiedad `boolean` llamada `isServerRunning`, establece el valor inicial a `true`.
</docs-step>

<docs-step title="Usa `@if` en la plantilla">
Actualiza la plantilla para mostrar el mensaje `Yes, the server is running` si el valor de `isServerRunning` es `true`.

</docs-step>

<docs-step title="Usa `@else` en la plantilla">
Angular ahora soporta sintaxis nativa de plantillas para definir el caso `else` con la sintaxis `@else`. Actualiza la plantilla para mostrar el mensaje `No, the server is not running` como el caso `else`.

Aquí hay un ejemplo:

```angular-ts
template: `
  @if (isServerRunning) { ... }
  @else { ... }
`;
```

Agrega tu código para completar el marcado faltante.

</docs-step>

</docs-workflow>

Este tipo de funcionalidad se llama control de flujo condicional. A continuación aprenderás cómo repetir elementos en una plantilla.
