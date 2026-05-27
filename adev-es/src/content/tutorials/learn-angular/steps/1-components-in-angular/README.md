# Componentes en Angular

Los componentes son los bloques de construcción fundamentales para cualquier aplicación Angular. Cada componente tiene tres partes:

- Clase TypeScript
- Plantilla HTML
- Estilos CSS

NOTA: Aprende más sobre [componentes en la guía esencial](/essentials/components).

En esta actividad, aprenderás cómo actualizar la plantilla y los estilos de un componente.

<hr />

Esta es una gran oportunidad para que comiences con Angular.

<docs-workflow>

<docs-step title="Actualiza la plantilla del componente">
Actualiza la propiedad `template` para que tenga el valor `Hello Universe`

```ts
template: `
  Hello Universe
`,
```

Cuando cambiaste la plantilla HTML, la vista previa se actualizó con tu mensaje. Vayamos un paso más allá: cambia el color del texto.
</docs-step>

<docs-step title="Actualiza los estilos del componente">
Actualiza el valor de `styles` y cambia la propiedad `color` de `blue` a `#a144eb`.

```ts
styles: `
  :host {
    color: #a144eb;
  }
`,
```

Cuando revises la vista previa, verás que el color del texto ha cambiado.
</docs-step>

</docs-workflow>

En Angular, puedes usar todo el CSS y HTML compatible con navegadores que esté disponible. Si lo deseas, puedes almacenar tus plantillas y estilos en archivos separados.
