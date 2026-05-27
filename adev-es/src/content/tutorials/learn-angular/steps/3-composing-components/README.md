# Composición de componentes

Has aprendido a actualizar la plantilla del componente, la lógica del componente y los estilos del componente, pero ¿cómo usas un componente en tu aplicación?

La propiedad `selector` de la configuración del componente te da un nombre para usar al referenciar el componente en otra plantilla. Usas el `selector` como una etiqueta HTML, por ejemplo `app-user` sería `<app-user />` en la plantilla.

NOTA: Aprende más sobre [usar componentes en la guía esencial](/essentials/components#using-components).

En esta actividad, aprenderás cómo componer componentes.

<hr/>

En este ejemplo, hay dos componentes: `User` y `App`.

<docs-workflow>

<docs-step title="Agrega una referencia a `User`">
Actualiza la plantilla de `App` para incluir una referencia a `User` que usa el selector `app-user`. Asegúrate de agregar `User` al arreglo `imports` de `App`, esto lo hace disponible para usar en la plantilla de `App`.

```ts
template: `<app-user />`,
imports: [User]
```

El componente ahora muestra el mensaje `Username: youngTech`. Puedes actualizar el código de la plantilla para incluir más marcado.
</docs-step>

<docs-step title="Agrega más marcado">
Como puedes usar cualquier marcado HTML que desees en una plantilla, intenta actualizar la plantilla de `App` para incluir también más elementos HTML. Este ejemplo agregará un elemento `<section>` como padre del elemento `<app-user>`.

```ts
template: `<section><app-user /></section>`,
```

</docs-step>

</docs-workflow>
Puedes usar tanto marcado HTML y tantos componentes como necesites para hacer realidad la idea de tu aplicación. Incluso puedes tener múltiples copias de tu componente en la misma página.

Esa es una buena transición, ¿cómo mostrarías condicionalmente un componente basado en datos? Dirígete a la siguiente sección para descubrirlo.
