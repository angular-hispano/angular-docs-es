# Optimizando imágenes

Las imágenes son una gran parte de muchas aplicaciones, y pueden ser un contribuyente importante a problemas de rendimiento de la aplicación, incluyendo puntuaciones bajas de [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals).

La optimización de imágenes puede ser un tema complejo, pero Angular maneja la mayor parte por ti, con la directiva `NgOptimizedImage`.

NOTA: Aprende más sobre [optimización de imágenes con NgOptimizedImage en la guía detallada](/guide/image-optimization).

En esta actividad, aprenderás cómo usar `NgOptimizedImage` para asegurar que tus imágenes se carguen de manera eficiente.

<hr>

<docs-workflow>

<docs-step title="Importa la directiva NgOptimizedImage">

Para aprovechar la directiva `NgOptimizedImage`, primero impórtala desde la librería `@angular/common` y agrégala al arreglo `imports` del componente.

```ts
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  ...
})
```

</docs-step>

<docs-step title="Actualiza el atributo src a ngSrc">

Para habilitar la directiva `NgOptimizedImage`, reemplaza el atributo `src` por `ngSrc`. Esto aplica tanto para fuentes de imagen estáticas (es decir, `src`) como dinámicas (es decir, `[src]`).

<docs-code language="angular-ts" highlight="[[9], [13]]">
import { NgOptimizedImage } from '@angular/common';

@Component({
template: `     ...
    <li>
      Static Image:
      <img ngSrc="/assets/logo.svg" alt="Angular logo" width="32" height="32" />
    </li>
    <li>
      Dynamic Image:
      <img [ngSrc]="logoUrl" [alt]="logoAlt" width="32" height="32" />
    </li>
    ...
  `,
imports: [NgOptimizedImage],
})
</docs-code>

</docs-step>

<docs-step title="Agrega atributos width y height">

Nota que en el ejemplo de código anterior, cada imagen tiene atributos `width` y `height`. Para prevenir [cambio de layout (layout shift)](https://web.dev/articles/cls), la directiva `NgOptimizedImage` requiere ambos atributos de tamaño en cada imagen.

En situaciones donde no puedes o no quieres especificar un `height` y `width` estáticos para las imágenes, puedes usar [el atributo `fill`](https://web.dev/articles/cls) para indicarle a la imagen que actúe como una "imagen de fondo", llenando su elemento contenedor:

```angular-html
<div class="image-container"> // El div contenedor tiene 'position: "relative"'
  <img ngSrc="www.example.com/image.png" fill />
</div>
```

NOTA: Para que la imagen con `fill` se renderice correctamente, su elemento padre debe tener estilo `position: "relative"`, `position: "fixed"` o `position: "absolute"`.

</docs-step>

<docs-step title="Prioriza imágenes importantes">

Una de las optimizaciones más importantes para el rendimiento de carga es priorizar cualquier imagen que pueda ser el ["elemento LCP"](https://web.dev/articles/optimize-lcp), que es el elemento gráfico más grande en pantalla cuando la página se carga. Para optimizar tus tiempos de carga, asegúrate de agregar el atributo `priority` a tu "imagen principal" o cualquier otra imagen que creas que podría ser un elemento LCP.

```ts
<img ngSrc="www.example.com/image.png" height="600" width="800" priority />
```

</docs-step>

<docs-step title="Opcional: Usa un image loader">

`NgOptimizedImage` te permite especificar un [image loader](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage), que le indica a la directiva cómo formatear las URLs de tus imágenes. Usar un loader te permite definir tus imágenes con URLs cortas y relativas:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
]
```

La URL final será 'https://my.base.url/image.png'

```angular-html
<img ngSrc="image.png" height="600" width="800" />
```

Los image loaders son más que solo conveniencia -- te permiten usar todas las capacidades de `NgOptimizedImage`. Aprende más sobre estas optimizaciones y los loaders incorporados para CDNs populares [aquí](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage).

</docs-step>

</docs-workflow>

Al agregar esta directiva a tu flujo de trabajo, tus imágenes ahora se cargan usando mejores prácticas con la ayuda de Angular 🎉

Si deseas aprender más, consulta la [documentación de `NgOptimizedImage`](guide/image-optimization). Sigue con el excelente trabajo y aprendamos sobre routing a continuación.
