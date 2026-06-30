# Actualizando la clase del componente

En Angular, la lógica y el comportamiento del componente se definen en la clase TypeScript del componente.

NOTA: Aprende más sobre [mostrar texto dinámico en la guía esencial](/essentials/templates#showing-dynamic-text).

En esta actividad, aprenderás cómo actualizar la clase del componente y cómo usar [interpolación](/guide/templates/binding#render-dynamic-text-with-text-interpolation).

<hr />

<docs-workflow>

<docs-step title="Agrega una propiedad llamada `city`">
Actualiza la clase del componente agregando una propiedad llamada `city` a la clase `App`.

```ts
export class App {
  city = 'San Francisco';
}
```

La propiedad `city` es de tipo `string` pero puedes omitir el tipo debido a la [inferencia de tipos en TypeScript](https://www.typescriptlang.org/docs/handbook/type-inference.html). La propiedad `city` puede usarse en la clase `App` y puede referenciarse en la plantilla del componente.

<br>

Para usar una propiedad de la clase en una plantilla, debes usar la sintaxis `{{ }}`.
</docs-step>

<docs-step title="Actualiza la plantilla del componente">
Actualiza la propiedad `template` para que coincida con el siguiente HTML:

```ts
template: `Hello {{ city }}`,
```

Este es un ejemplo de interpolación y es parte de la sintaxis de plantillas de Angular. Te permite hacer mucho más que poner texto dinámico en una plantilla. También puedes usar esta sintaxis para llamar funciones, escribir expresiones y más.
</docs-step>

<docs-step title="Más práctica con interpolación">
Intenta esto: agrega otro conjunto de `{{ }}` con el contenido `1 + 1`:

```ts
template: `Hello {{ city }}, {{ 1 + 1 }}`,
```

Angular evalúa el contenido de `{{ }}` y renderiza el resultado en la plantilla.
</docs-step>

</docs-workflow>

This is just the beginning of what's possible with Angular templates, keep on learning to find out more.
