# Bloques @loading, @error y @placeholder

Las vistas diferibles te permiten definir contenido que se mostrará en diferentes estados de carga.

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>@placeholder</code></td>
      <td>
        Por defecto, los bloques defer no renderizan ningún contenido antes de ser disparados. El bloque <code>@placeholder</code> es un bloque opcional que declara contenido para mostrar antes de que el contenido diferido se cargue. Angular reemplaza el placeholder con el contenido diferido después de que la carga se completa. Aunque este bloque es opcional, el equipo de Angular recomienda incluir siempre un placeholder.
        <a href="https://angular.dev/guide/templates/defer#triggers" target="_blank">
          Aprende más en la documentación completa de vistas diferibles
        </a>
      </td>
    </tr>
    <tr>
      <td><code>@loading</code></td>
      <td>
        Este bloque opcional te permite declarar contenido que se mostrará durante la carga de cualquier dependencia diferida.
      </td>
    </tr>
    <tr>
      <td><code>@error</code></td>
      <td>
        Este bloque te permite declarar contenido que se muestra si la carga diferida falla.
      </td>
    </tr>
  </table>
</div>

El contenido de todos los sub-bloques anteriores se carga de forma inmediata. Adicionalmente, algunas funcionalidades requieren un bloque `@placeholder`.

En esta actividad, aprenderás cómo usar los bloques `@loading`, `@error` y `@placeholder` para gestionar los estados de las vistas diferibles.

<hr>

<docs-workflow>

<docs-step title="Agrega un bloque `@placeholder`">
En tu `app.ts`, agrega un bloque `@placeholder` al bloque `@defer`.

<docs-code language="angular-html" highlight="[3,4,5]">
@defer {
  <article-comments />
} @placeholder {
  <p>Placeholder for comments</p>
}
</docs-code>
</docs-step>

<docs-step title="Configura el bloque `@placeholder`">
El bloque `@placeholder` acepta un parámetro opcional para especificar la cantidad de tiempo `minimum` que este placeholder debe mostrarse. Este parámetro `minimum` se especifica en incrementos de tiempo de milisegundos (ms) o segundos (s). Este parámetro existe para evitar el parpadeo rápido del contenido del placeholder en caso de que las dependencias diferidas se obtengan rápidamente.

<docs-code language="angular-html" highlight="[3,4,5]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
}
</docs-code>
</docs-step>

<docs-step title="Agrega un bloque `@loading`">
A continuación, agrega un bloque `@loading` a la plantilla del componente.

El bloque `@loading` acepta dos parámetros opcionales:

- `minimum`: la cantidad de tiempo que este bloque debe mostrarse
- `after`: la cantidad de tiempo a esperar después de que comience la carga antes de mostrar la plantilla de carga

Ambos parámetros se especifican en incrementos de tiempo de milisegundos (ms) o segundos (s).

Actualiza `app.ts` para incluir un bloque `@loading` con un parámetro minimum de `1s` así como un parámetro after con el valor 500ms para el bloque @loading.

<docs-code language="angular-html" highlight="[5,6,7]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
}
</docs-code>

NOTA: este ejemplo usa dos parámetros, separados por el carácter ;.

</docs-step>

<docs-step title="Agrega un bloque `@error`">
Finalmente, agrega un bloque `@error` al bloque `@defer`.

<docs-code language="angular-html" highlight="[7,8,9]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>
</docs-step>
</docs-workflow>

¡Felicidades! En este punto, tienes un buen entendimiento sobre las vistas diferibles. Sigue con el excelente trabajo y aprendamos sobre los triggers a continuación.
