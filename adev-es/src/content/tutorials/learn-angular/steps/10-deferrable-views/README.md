# Vistas diferibles (deferrable views)

A veces en el desarrollo de aplicaciones, terminas con muchos componentes que necesitas referenciar en tu app, pero algunos de ellos no necesitan cargarse de inmediato por varias razones.

Quizás están debajo del pliegue visible o son componentes pesados con los que no se interactúa hasta más tarde. En ese caso, podemos cargar algunos de esos recursos más tarde con vistas diferibles (deferrable views).

NOTA: Aprende más sobre [carga diferida con @defer en la guía detallada](/guide/templates/defer).

En esta actividad, aprenderás cómo usar vistas diferibles para cargar de forma diferida una sección de la plantilla de tu componente.

<hr>

<docs-workflow>

<docs-step title="Agrega un bloque `@defer` alrededor del componente de comentarios">

En tu app, la página de publicación del blog tiene un componente de comentarios después de los detalles de la publicación.

Envuelve el componente de comentarios con un bloque `@defer` para cargarlo de forma diferida.

```angular-html
@defer {
  <comments />
}
```

El código anterior es un ejemplo de cómo usar un bloque `@defer` básico. Por defecto, `@defer` cargará el componente `comments` cuando el navegador esté inactivo.

</docs-step>

<docs-step title="Agrega un placeholder">

Agrega un bloque `@placeholder` al bloque `@defer`. El bloque `@placeholder` es donde pones HTML que se mostrará antes de que comience la carga diferida. El contenido en los bloques `@placeholder` se carga de forma inmediata.

<docs-code language="angular-html" highlight="[3,4,5]">
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
}
</docs-code>

</docs-step>

<docs-step title="Agrega un bloque de carga (loading)">

Agrega un bloque `@loading` al bloque `@defer`. El bloque `@loading` es donde pones HTML que se mostrará _mientras_ el contenido diferido se está obteniendo activamente, pero aún no ha terminado. El contenido en los bloques `@loading` se carga de forma inmediata.

<docs-code language="angular-html" highlight="[5,6,7]">
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading {
  <p>Loading comments...</p>
}
</docs-code>

</docs-step>

<docs-step title="Agrega una duración mínima">

Tanto las secciones `@placeholder` como `@loading` tienen parámetros opcionales para evitar parpadeos cuando la carga ocurre rápidamente. `@placeholder` tiene `minimum` y `@loading` tiene `minimum` y `after`. Agrega una duración `minimum` al bloque `@loading` para que se renderice durante al menos 2 segundos.

<docs-code language="angular-html" highlight="[5]">
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading (minimum 2s) {
  <p>Loading comments...</p>
}
</docs-code>

</docs-step>

<docs-step title="Agrega un disparador de viewport">

Las vistas diferibles tienen varias opciones de disparadores (triggers). Agrega un disparador de viewport para que el contenido se cargue de forma diferida una vez que entre en el viewport.

<docs-code language="angular-html" highlight="[1]">
@defer (on viewport) {
  <comments />
}
</docs-code>

</docs-step>

<docs-step title="Agrega contenido">

Un disparador de viewport se usa mejor cuando estás difiriendo contenido que está lo suficientemente abajo en la página como para que necesite ser desplazado para verse. Así que agreguemos algo de contenido a nuestra publicación del blog. Puedes escribir el tuyo propio, o puedes copiar el contenido de abajo y ponerlo dentro del elemento `<article>`.

<docs-code language="html" highlight="[1]">
<article>
  <p>Angular is my favorite framework, and this is why. Angular has the coolest deferrable view feature that makes defer loading content the easiest and most ergonomic it could possibly be. The Angular community is also filled with amazing contributors and experts that create excellent content. The community is welcoming and friendly, and it really is the best community out there.</p>
  <p>I can't express enough how much I enjoy working with Angular. It offers the best developer experience I've ever had. I love that the Angular team puts their developers first and takes care to make us very happy. They genuinely want Angular to be the best framework it can be, and they're doing such an amazing job at it, too. This statement comes from my heart and is not at all copied and pasted. In fact, I think I'll say these exact same things again a few times.</p>
  <p>Angular is my favorite framework, and this is why. Angular has the coolest deferrable view feature that makes defer loading content the easiest and most ergonomic it could possibly be. The Angular community is also filled with amazing contributors and experts that create excellent content. The community is welcoming and friendly, and it really is the best community out there.</p>
  <p>I can't express enough how much I enjoy working with Angular. It offers the best developer experience I've ever had. I love that the Angular team puts their developers first and takes care to make us very happy. They genuinely want Angular to be the best framework it can be, and they're doing such an amazing job at it, too. This statement comes from my heart and is not at all copied and pasted. In fact, I think I'll say these exact same things again a few times.</p>
  <p>Angular is my favorite framework, and this is why. Angular has the coolest deferrable view feature that makes defer loading content the easiest and most ergonomic it could possibly be. The Angular community is also filled with amazing contributors and experts that create excellent content. The community is welcoming and friendly, and it really is the best community out there.</p>
  <p>I can't express enough how much I enjoy working with Angular. It offers the best developer experience I've ever had. I love that the Angular team puts their developers first and takes care to make us very happy. They genuinely want Angular to be the best framework it can be, and they're doing such an amazing job at it, too. This statement comes from my heart and is not at all copied and pasted.</p>
</article>
</docs-code>

Una vez que hayas agregado este código, desplázate hacia abajo para ver el contenido diferido cargarse cuando lo despliegues dentro del viewport.

</docs-step>

</docs-workflow>

En esta actividad, has aprendido cómo usar vistas diferibles en tus aplicaciones. Excelente trabajo. 🙌

Hay aún más que puedes hacer con ellas, como diferentes disparadores, precarga (prefetching) y bloques `@error`.

Si deseas aprender más, consulta la [documentación sobre vistas diferibles (Deferrable views)](guide/templates/defer).
