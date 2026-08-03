# Disparadores de defer (defer triggers)

Si bien las opciones predeterminadas para `@defer` ofrecen excelentes opciones para lazy loading de partes de tus componentes, puede ser deseable personalizar aún más la experiencia de carga diferida.

Por defecto, el contenido diferido se carga cuando el navegador está inactivo. Sin embargo, puedes personalizar cuándo ocurre esta carga especificando un **trigger** (disparador). Esto te permite elegir el comportamiento de carga más adecuado para tu componente.

Las vistas diferibles ofrecen dos tipos de triggers de carga:

| Trigger | Descripción                                                                                                                                                                                          |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `on`    | Una condición de trigger usando un trigger de la lista de triggers integrados.<br/>Por ejemplo: `@defer (on viewport)`                                                                             |
| `when`  | Una condición como expresión que se evalúa para determinar su veracidad. Cuando la expresión es verdadera, el placeholder se reemplaza con el contenido cargado de forma diferida.<br/>Por ejemplo: `@defer (when customizedCondition)` |

Si la condición `when` se evalúa como `false`, el bloque `defer` no se revierte al placeholder. El intercambio es una operación de una sola vez.

Puedes definir múltiples triggers de eventos a la vez, estos triggers se evaluarán como condiciones OR.

- Ej: `@defer (on viewport; on timer(2s))`
- Ej: `@defer (on viewport; when customizedCondition)`

En esta actividad, aprenderás cómo usar triggers para especificar la condición para cargar las vistas diferibles.

<hr>

<docs-workflow>

<docs-step title="Agrega un trigger `on hover`">
En tu `app.ts`,  agrega un trigger `on hover` al bloque `@defer`.

```angular-html {highlight:[1]}
@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

Ahora, la página no renderizará la sección de comentarios hasta que pases el cursor sobre su placeholder.
</docs-step>

<docs-step title="Agrega un botón 'Show all comments'">
A continuación, actualiza la plantilla para incluir un botón con la etiqueta "Show all comments". Incluye una variable de plantilla llamada `#showComments` con el botón.

```angular-html {highlight:[1]}
<button type="button" #showComments>Show all comments</button>

@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

NOTA: para obtener más información sobre [variables de plantilla consulta la documentación](/guide/templates/variables#declaring-a-template-reference-variable).

</docs-step>

<docs-step title="Agrega un trigger `on interaction`">
Actualiza el bloque `@defer` en la plantilla para usar el trigger `on interaction`. Proporciona la variable de plantilla `showComments` como parámetro a `interaction`.

```angular-html {highlight:[3]}
<button type="button" #showComments>Show all comments</button>

@defer (on hover; on interaction(showComments)) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

Con estos cambios, la página esperará una de las siguientes condiciones antes de renderizar la sección de comentarios:

- El usuario pasa el cursor sobre el placeholder de la sección de comentarios
- El usuario hace clic en el botón "Show all comments"

Puedes recargar la página para probar diferentes triggers para renderizar la sección de comentarios.
</docs-step>
</docs-workflow>

Si deseas aprender más, consulta la documentación de [Deferrable View](/guide/templates/defer).
Sigue aprendiendo para descubrir más características increíbles de Angular.
