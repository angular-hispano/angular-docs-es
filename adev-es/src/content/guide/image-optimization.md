# Primeros pasos con NgOptimizedImage

La directiva `NgOptimizedImage` facilita la adopción de las mejores prácticas de rendimiento para la carga de imágenes.

La directiva asegura que la carga de la imagen [Largest Contentful Paint (LCP)](http://web.dev/lcp) se priorice mediante:

- Estableciendo automáticamente el atributo `fetchpriority` en la etiqueta `<img>`
- Aplicando lazy loading a otras imágenes de forma predeterminada
- Generando automáticamente una etiqueta de enlace preconnect en el encabezado del documento
- Generando automáticamente un atributo `srcset`
- Generando una [sugerencia de preload](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) si la aplicación usa SSR

Además de optimizar la carga de la imagen LCP, `NgOptimizedImage` aplica una serie de mejores prácticas para imágenes, como:

- Usar [URLs de CDN de imágenes para aplicar optimizaciones](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
- Evitar el desplazamiento del diseño requiriendo `width` y `height`
- Advertir si `width` o `height` se han establecido incorrectamente
- Advertir si la imagen se distorsionará visualmente al renderizarse

Si estás usando una imagen de fondo en CSS, [comienza aquí](#cómo-migrar-tu-imagen-de-fondo).

**NOTA: Aunque la directiva `NgOptimizedImage` se convirtió en una característica estable en Angular versión 15, ha sido retroportada y también está disponible como una característica estable en las versiones 13.4.0 y 14.3.0.**

## Primeros pasos

<docs-workflow>
<docs-step title="Importa la directiva `NgOptimizedImage`">
Importa la directiva `NgOptimizedImage` desde `@angular/common`:

```ts

import { NgOptimizedImage } from '@angular/common'

```

e inclúyela en el array `imports` de un componente standalone o un NgModule:

```ts
imports: [
  NgOptimizedImage,
  // ...
],
```

</docs-code>
</docs-step>
<docs-step title="(Opcional) Configura un Loader">
Un loader de imágenes no es **obligatorio** para usar NgOptimizedImage, pero usar uno con una CDN de imágenes habilita características de rendimiento potentes, incluyendo `srcset`s automáticos para tus imágenes.

Una breve guía para configurar un loader se puede encontrar en la sección [Configurando un image loader](#configurando-un-image-loader-para-ngoptimizedimage) al final de esta página.
</docs-step>
<docs-step title="Habilita la directiva">
Para activar la directiva `NgOptimizedImage`, reemplaza el atributo `src` de tu imagen con `ngSrc`.

```html

<img ngSrc="cat.jpg">

```

Si estás usando un [loader integrado de terceros](#loaders-integrados), asegúrate de omitir la ruta de la URL base de `src`, ya que el loader la agregará automáticamente al principio.
</docs-step>
<docs-step title="Marca imágenes como `priority`">
Siempre marca la [imagen LCP](https://web.dev/lcp/#what-elements-are-considered) en tu página como `priority` para priorizar su carga.

```html

<img ngSrc="cat.jpg" width="400" height="200" priority>

```

Marcar una imagen como `priority` aplica las siguientes optimizaciones:

- Establece `fetchpriority=high` (lee más sobre las sugerencias de prioridad [aquí](https://web.dev/priority-hints))
- Establece `loading=eager` (lee más sobre el lazy loading nativo [aquí](https://web.dev/browser-level-image-lazy-loading))
- Genera automáticamente un [elemento de enlace preload](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) si se [renderiza en el servidor](guide/ssr).

Angular muestra una advertencia durante el desarrollo si el elemento LCP es una imagen que no tiene el atributo `priority`. El elemento LCP de una página puede variar en función de varios factores, como las dimensiones de la pantalla del usuario, por lo que una página puede tener varias imágenes que deberían marcarse como `priority`. Consulta [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) para más detalles.
</docs-step>
<docs-step title="Incluye el ancho y el alto">
Para evitar [desplazamientos del diseño relacionados con imágenes](https://web.dev/css-web-vitals/#images-and-layout-shifts), NgOptimizedImage requiere que especifiques una altura y un ancho para tu imagen, de la siguiente manera:

```html

<img ngSrc="cat.jpg" width="400" height="200">

```

Para **imágenes responsivas** (imágenes que has estilizado para crecer y reducirse según el viewport), los atributos `width` y `height` deben ser el tamaño intrínseco del archivo de imagen. Para imágenes responsivas también es importante [establecer un valor para `sizes`.](#imágenes-responsivas)

Para **imágenes de tamaño fijo**, los atributos `width` y `height` deben reflejar el tamaño renderizado deseado de la imagen. La relación de aspecto de estos atributos siempre debe coincidir con la relación de aspecto intrínseca de la imagen.

NOTA: Si no conoces el tamaño de tus imágenes, considera usar el "modo fill" para heredar el tamaño del contenedor padre, como se describe a continuación.
</docs-step>
</docs-workflow>

## Usando el modo `fill`

En los casos en que deseas que una imagen llene un elemento contenedor, puedes usar el atributo `fill`. Esto es útil cuando quieres lograr un comportamiento de "imagen de fondo". También puede ser útil cuando no conoces el ancho y la altura exactos de tu imagen, pero tienes un contenedor padre con un tamaño conocido en el que deseas ajustar tu imagen (ver "object-fit" a continuación).

Cuando añades el atributo `fill` a tu imagen, no necesitas ni debes incluir `width` y `height`, como en este ejemplo:

```html

<img ngSrc="cat.jpg" fill>

```

Puedes usar la propiedad CSS [object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit) para cambiar cómo la imagen llenará su contenedor. Si estilizas tu imagen con `object-fit: "contain"`, la imagen mantendrá su relación de aspecto y tendrá un efecto "letterbox" para ajustarse al elemento. Si estableces `object-fit: "cover"`, el elemento mantendrá su relación de aspecto, llenará completamente el elemento y parte del contenido puede quedar "recortado".

Consulta ejemplos visuales de lo anterior en la [documentación de MDN sobre object-fit.](https://developer.mozilla.org/docs/Web/CSS/object-fit)

También puedes estilizar tu imagen con la [propiedad object-position](https://developer.mozilla.org/docs/Web/CSS/object-position) para ajustar su posición dentro de su elemento contenedor.

IMPORTANTE: Para que la imagen con "fill" se renderice correctamente, su elemento padre **debe** estar estilizado con `position: "relative"`, `position: "fixed"` o `position: "absolute"`.

## Cómo migrar tu imagen de fondo

Aquí hay un proceso simple paso a paso para migrar de `background-image` a `NgOptimizedImage`. Para estos pasos, nos referiremos al elemento que tiene un fondo de imagen como el "elemento contenedor":

1. Elimina el estilo `background-image` del elemento contenedor.
2. Asegúrate de que el elemento contenedor tenga `position: "relative"`, `position: "fixed"` o `position: "absolute"`.
3. Crea un nuevo elemento de imagen como hijo del elemento contenedor, usando `ngSrc` para habilitar la directiva `NgOptimizedImage`.
4. Dale a ese elemento el atributo `fill`. No incluyas `height` ni `width`.
5. Si crees que esta imagen podría ser tu [elemento LCP](https://web.dev/lcp/), añade el atributo `priority` al elemento de imagen.

Puedes ajustar cómo la imagen de fondo llena el contenedor como se describe en la sección [Usando el modo `fill`](#usando-el-modo-fill).

## Usando placeholders

### Placeholders automáticos

NgOptimizedImage puede mostrar un placeholder automático de baja resolución para tu imagen si estás usando una CDN o un host de imágenes que proporciona cambio de tamaño automático de imágenes. Aprovecha esta característica añadiendo el atributo `placeholder` a tu imagen:

```html

<img ngSrc="cat.jpg" width="400" height="200" placeholder>

```

Añadir este atributo solicita automáticamente una segunda versión más pequeña de la imagen usando tu image loader especificado. Esta imagen pequeña se aplicará como un estilo `background-image` con un desenfoque CSS mientras se carga tu imagen. Si no se proporciona ningún image loader, no se puede generar ninguna imagen de placeholder y se lanzará un error.

El tamaño predeterminado para los placeholders generados es de 30px de ancho. Puedes cambiar este tamaño especificando un valor en píxeles en el proveedor `IMAGE_CONFIG`, como se muestra a continuación:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      placeholderResolution: 40
    }
  },
],
```

Si deseas bordes nítidos alrededor de tu placeholder desenfocado, puedes envolver tu imagen en un `<div>` contenedor con el estilo `overflow: hidden`. Siempre que el `<div>` tenga el mismo tamaño que la imagen (por ejemplo, usando el estilo `width: fit-content`), los "bordes difusos" del placeholder estarán ocultos.

### Placeholders con URL de datos

También puedes especificar un placeholder usando una [URL de datos](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) base64 sin un image loader. El formato de la URL de datos es `data:image/[imagetype];[data]`, donde `[imagetype]` es el formato de la imagen, como `png`, y `[data]` es una codificación base64 de la imagen. Esa codificación se puede hacer usando la línea de comandos o en JavaScript. Para comandos específicos, consulta [la documentación de MDN](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#encoding_data_into_base64_format). A continuación se muestra un ejemplo de un placeholder con URL de datos con datos truncados:

```html

<img
  ngSrc="cat.jpg"
  width="400"
  height="200"
  placeholder="data:image/png;base64,iVBORw0K..."
/>

```

Sin embargo, las URLs de datos grandes aumentan el tamaño de tus bundles de Angular y ralentizan la carga de la página. Si no puedes usar un image loader, el equipo de Angular recomienda mantener las imágenes de placeholder en base64 por debajo de 4KB y usarlas exclusivamente en imágenes críticas. Además de reducir las dimensiones del placeholder, considera cambiar los formatos de imagen o los parámetros usados al guardar imágenes. A resoluciones muy bajas, estos parámetros pueden tener un gran efecto en el tamaño del archivo.

### Placeholders sin desenfoque

De forma predeterminada, NgOptimizedImage aplica un efecto de desenfoque CSS a los placeholders de imágenes. Para renderizar un placeholder sin desenfoque, proporciona un argumento `placeholderConfig` con un objeto que incluya la propiedad `blur`, establecida en false. Por ejemplo:

```html
<img
ngSrc="cat.jpg"
width="400"
height="200"
placeholder
[placeholderConfig]="{blur: false}"
/>
```

## Ajustando el estilo de la imagen

Dependiendo del estilo de la imagen, añadir los atributos `width` y `height` puede hacer que la imagen se renderice de manera diferente. `NgOptimizedImage` te advierte si el estilo de tu imagen renderiza la imagen con una relación de aspecto distorsionada.

Generalmente puedes solucionar esto añadiendo `height: auto` o `width: auto` a los estilos de tu imagen. Para más información, consulta el [artículo de web.dev sobre la etiqueta `<img>`](https://web.dev/patterns/web-vitals-patterns/images/img-tag).

Si los atributos `width` y `height` de la imagen te impiden ajustar el tamaño de la imagen como deseas con CSS, considera usar el modo `fill` en su lugar y estilizar el elemento padre de la imagen.

## Características de rendimiento

NgOptimizedImage incluye una serie de características diseñadas para mejorar el rendimiento de carga en tu aplicación. Estas características se describen en esta sección.

### Agregar resource hints

Un [resource hint `preconnect`](https://web.dev/preconnect-and-dns-prefetch) para el origen de tu imagen asegura que la imagen LCP se cargue lo más rápido posible.

Los enlaces preconnect se generan automáticamente para los dominios proporcionados como argumento a un [loader](#opcional-configura-un-loader). Si un origen de imagen no puede identificarse automáticamente, y no se detecta ningún enlace preconnect para la imagen LCP, `NgOptimizedImage` advertirá durante el desarrollo. En ese caso, debes añadir manualmente un resource hint a `index.html`. Dentro del `<head>` del documento, añade una etiqueta `link` con `rel="preconnect"`, como se muestra a continuación:

```html

<link rel="preconnect" href="https://my.cdn.origin" />

```

Para deshabilitar las advertencias de preconnect, inyecta el token `PRECONNECT_CHECK_BLOCKLIST`:

```ts

providers: [
{provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

```

Consulta más información sobre la generación automática de preconnect [aquí](#por-qué-no-se-está-generando-un-elemento-preconnect-para-mi-dominio-de-imagen).

### Solicitar imágenes del tamaño correcto con `srcset` automático

Definir un [atributo `srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) asegura que el navegador solicite una imagen del tamaño correcto para el viewport del usuario, evitando desperdiciar tiempo descargando una imagen demasiado grande. `NgOptimizedImage` genera un `srcset` apropiado para la imagen, basándose en la presencia y el valor del [atributo `sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) en la etiqueta de imagen.

#### Imágenes de tamaño fijo

Si tu imagen debe tener un tamaño "fijo" (es decir, el mismo tamaño en todos los dispositivos, excepto por la [densidad de píxeles](https://web.dev/codelab-density-descriptors/)), no es necesario establecer un atributo `sizes`. Un `srcset` puede generarse automáticamente a partir de los atributos de ancho y alto de la imagen sin ninguna entrada adicional.

Ejemplo de srcset generado:

```html
<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x">
```

#### Imágenes responsivas

Si tu imagen debe ser responsiva (es decir, crecer y reducirse según el tamaño del viewport), deberás definir un [atributo `sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) para generar el `srcset`.

Si no has usado `sizes` antes, un buen punto de partida es establecerlo en función del ancho del viewport. Por ejemplo, si tu CSS hace que la imagen llene el 100% del ancho del viewport, establece `sizes` en `100vw` y el navegador seleccionará la imagen en el `srcset` que sea más cercana al ancho del viewport (después de tener en cuenta la densidad de píxeles). Si es probable que tu imagen ocupe solo la mitad de la pantalla (por ejemplo, en una barra lateral), establece `sizes` en `50vw` para asegurarte de que el navegador seleccione una imagen más pequeña. Y así sucesivamente.

Si encuentras que lo anterior no cubre el comportamiento de imagen deseado, consulta la documentación sobre [valores 'sizes' avanzados](#valores-sizes-avanzados).

Ten en cuenta que `NgOptimizedImage` añade automáticamente `"auto"` al principio del valor `sizes` proporcionado. Esto es una optimización que aumenta la precisión de la selección del srcset en los navegadores que soportan `sizes="auto"`, y es ignorada por los navegadores que no lo hacen.

De forma predeterminada, los breakpoints responsivos son:

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

Si deseas personalizar estos breakpoints, puedes hacerlo usando el proveedor `IMAGE_CONFIG`:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
```

Si deseas definir manualmente un atributo `srcset`, puedes proporcionarlo usando el atributo `ngSrcset`:

```html

<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w">

```

Si el atributo `ngSrcset` está presente, `NgOptimizedImage` genera y establece el `srcset` basándose en los tamaños incluidos. No incluyas nombres de archivos de imagen en `ngSrcset`: la directiva infiere esta información de `ngSrc`. La directiva soporta tanto descriptores de ancho (por ejemplo, `100w`) como descriptores de densidad (por ejemplo, `1x`).

```html

<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw">

```

### Deshabilitando la generación automática de srcset

Para deshabilitar la generación de srcset para una sola imagen, puedes añadir el atributo `disableOptimizedSrcset` en la imagen:

```html

<img ngSrc="about.jpg" disableOptimizedSrcset>

```

### Deshabilitando el lazy loading de imágenes

De forma predeterminada, `NgOptimizedImage` establece `loading=lazy` para todas las imágenes que no están marcadas como `priority`. Puedes deshabilitar este comportamiento para imágenes sin prioridad estableciendo el atributo `loading`. Este atributo acepta los valores: `eager`, `auto` y `lazy`. [Consulta la documentación del atributo estándar `loading` de imagen para más detalles](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/loading#value).

```html

<img ngSrc="cat.jpg" width="400" height="200" loading="eager">

```

### Controlando la decodificación de imágenes

De forma predeterminada, `NgOptimizedImage` establece `decoding="auto"` para todas las imágenes. Esto permite al navegador decidir el momento óptimo para decodificar una imagen después de que se ha obtenido. Cuando una imagen se marca como `priority`, Angular automáticamente establece `decoding="sync"` para asegurar que la imagen se decodifique y pinte lo antes posible, ayudando a mejorar el rendimiento del **Largest Contentful Paint (LCP)**.

Aún puedes sobrescribir este comportamiento estableciendo explícitamente el atributo `decoding`.
[Consulta la documentación del atributo estándar `decoding` de imagen para más detalles](https://developer.mozilla.org/docs/Web/HTML/Element/img#decoding).

```html
<!-- Predeterminado: la decodificación es 'auto' -->
<img ngSrc="gallery/landscape.jpg" width="1200" height="800">

<!-- Decodifica la imagen de forma asíncrona para evitar bloquear el hilo principal. -->
<img ngSrc="gallery/preview.jpg" width="600" height="400" decoding="async">

<!-- Las imágenes con priority usan automáticamente decoding="sync" -->
<img ngSrc="awesome.jpg" width="500" height="625" priority >

<!-- Decodifica inmediatamente (puede bloquear) cuando necesitas los píxeles de inmediato -->
<img ngSrc="hero.jpg" width="1600" height="900" decoding="sync">
```

**Valores permitidos**

- `auto` (predeterminado): permite al navegador elegir la estrategia óptima.
- `async`: decodifica la imagen de forma asíncrona, evitando el bloqueo del hilo principal siempre que sea posible.
- `sync`: decodifica la imagen inmediatamente; puede bloquear el renderizado, pero garantiza que los píxeles estén listos tan pronto como la imagen esté disponible.

### Valores 'sizes' avanzados

Es posible que desees mostrar imágenes con diferentes anchos en pantallas de diferentes tamaños. Un ejemplo común de este patrón es un diseño basado en cuadrículas o columnas que renderiza una sola columna en dispositivos móviles y dos columnas en dispositivos más grandes. Puedes capturar este comportamiento en el atributo `sizes`, usando una sintaxis de "media query", como la siguiente:

```html

<img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw">

```

El atributo `sizes` en el ejemplo anterior dice "Espero que esta imagen ocupe el 100 por ciento del ancho de la pantalla en dispositivos de menos de 768px de ancho. De lo contrario, espero que ocupe el 50 por ciento del ancho de la pantalla."

Para más información sobre el atributo `sizes`, consulta [web.dev](https://web.dev/learn/design/responsive-images/#sizes) o [mdn](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes).

## Configurando un image loader para `NgOptimizedImage`

Un "loader" es una función que genera una [URL de transformación de imagen](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) para un archivo de imagen dado. Cuando es apropiado, `NgOptimizedImage` establece las transformaciones de tamaño, formato y calidad de imagen para una imagen.

`NgOptimizedImage` proporciona tanto un loader genérico que no aplica transformaciones, como loaders para varios servicios de imágenes de terceros. También soporta escribir tu propio loader personalizado.

| Tipo de loader                               | Comportamiento                                                                                                                                                                                                                                                         |
| :------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loader genérico                              | La URL devuelta por el loader genérico siempre coincidirá con el valor de `src`. En otras palabras, este loader no aplica transformaciones. Los sitios que usan Angular para servir imágenes son el caso de uso principal previsto para este loader.                    |
| Loaders para servicios de imágenes de terceros | La URL devuelta por los loaders para servicios de imágenes de terceros seguirá las convenciones de API utilizadas por ese servicio de imágenes en particular.                                                                                                          |
| Loaders personalizados                       | El comportamiento de un loader personalizado está definido por su desarrollador. Debes usar un loader personalizado si tu servicio de imágenes no está soportado por los loaders que vienen preconfigurados con `NgOptimizedImage`.                                     |

Basándose en los servicios de imágenes comúnmente utilizados con aplicaciones Angular, `NgOptimizedImage` proporciona loaders preconfigurados para trabajar con los siguientes servicios de imágenes:

| Servicio de imágenes      | API de Angular            | Documentación                                                               |
| :------------------------ | :------------------------ | :-------------------------------------------------------------------------- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [Documentación](https://developers.cloudflare.com/images/image-resizing/)   |
| Cloudinary                | `provideCloudinaryLoader` | [Documentación](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit                  | `provideImageKitLoader`   | [Documentación](https://docs.imagekit.io/)                                  |
| Imgix                     | `provideImgixLoader`      | [Documentación](https://docs.imgix.com/)                                    |
| Netlify                   | `provideNetlifyLoader`    | [Documentación](https://docs.netlify.com/image-cdn/overview/)               |

Para usar el **loader genérico** no es necesario realizar cambios de código adicionales. Este es el comportamiento predeterminado.

### Loaders integrados

Para usar un loader existente para un **servicio de imágenes de terceros**, añade el provider factory de tu servicio elegido al array `providers`. En el siguiente ejemplo, se usa el loader de Imgix:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

La URL base de tus recursos de imagen debe pasarse al provider factory como argumento. Para la mayoría de los sitios, esta URL base debe coincidir con uno de los siguientes patrones:

- <https://yoursite.yourcdn.com>
- <https://subdomain.yoursite.com>
- <https://subdomain.yourcdn.com/yoursite>

Puedes obtener más información sobre la estructura de la URL base en la documentación del proveedor CDN correspondiente.

### Loaders personalizados

Para usar un **loader personalizado**, proporciona tu función de loader como valor para el token DI `IMAGE_LOADER`. En el siguiente ejemplo, la función de loader personalizado devuelve una URL que comienza con `https://example.com` e incluye `src` y `width` como parámetros de URL.

```ts
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}`;
    },
  },
],
```

Una función de loader para la directiva `NgOptimizedImage` toma un objeto del tipo `ImageLoaderConfig` (de `@angular/common`) como argumento y devuelve la URL absoluta del recurso de imagen. El objeto `ImageLoaderConfig` contiene la propiedad `src`, y las propiedades opcionales `width` y `loaderParams`.

NOTA: aunque la propiedad `width` puede no estar siempre presente, un loader personalizado debe usarla para soportar la solicitud de imágenes de varios anchos para que `ngSrcset` funcione correctamente.

### La propiedad `loaderParams`

Existe un atributo adicional soportado por la directiva `NgOptimizedImage`, llamado `loaderParams`, que está específicamente diseñado para soportar el uso de loaders personalizados. El atributo `loaderParams` toma un objeto con cualquier propiedad como valor, y no hace nada por sí solo. Los datos en `loaderParams` se añaden al objeto `ImageLoaderConfig` pasado a tu loader personalizado, y pueden usarse para controlar el comportamiento del loader.

Un uso común de `loaderParams` es controlar características avanzadas de CDN de imágenes.

### Ejemplo de loader personalizado

A continuación se muestra un ejemplo de una función de loader personalizado. Esta función de ejemplo concatena `src` y `width`, y usa `loaderParams` para controlar una característica personalizada de CDN para esquinas redondeadas:

```ts
const myCustomLoader = (config: ImageLoaderConfig) => {
  let url = `https://example.com/images/${config.src}?`;
  let queryParams = [];
  if (config.width) {
    queryParams.push(`w=${config.width}`);
  }
  if (config.loaderParams?.roundedCorners) {
    queryParams.push('mask=corners&corner-radius=5');
  }
  return url + queryParams.join('&');
};
```

Ten en cuenta que en el ejemplo anterior, hemos creado el nombre de propiedad 'roundedCorners' para controlar una característica de nuestro loader personalizado. Luego podemos usar esta característica al crear una imagen, de la siguiente manera:

```html

<img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}">

```

## Preguntas frecuentes

### ¿NgOptimizedImage soporta la propiedad CSS `background-image`?

NgOptimizedImage no soporta directamente la propiedad CSS `background-image`, pero está diseñada para acomodar fácilmente el caso de uso de tener una imagen como fondo de otro elemento.

Para un proceso paso a paso de migración de `background-image` a `NgOptimizedImage`, consulta la sección [Cómo migrar tu imagen de fondo](#cómo-migrar-tu-imagen-de-fondo) anterior.

### ¿Por qué no puedo usar `src` con `NgOptimizedImage`?

El atributo `ngSrc` fue elegido como disparador para NgOptimizedImage debido a consideraciones técnicas sobre cómo el navegador carga las imágenes. NgOptimizedImage realiza cambios programáticos en el atributo `loading`: si el navegador ve el atributo `src` antes de que se realicen esos cambios, comenzará a descargar ansiosamente el archivo de imagen y los cambios de carga serán ignorados.

### ¿Por qué no se está generando un elemento preconnect para mi dominio de imagen?

La generación de preconnect se realiza basándose en el análisis estático de tu aplicación. Esto significa que el dominio de la imagen debe estar incluido directamente en el parámetro del loader, como en el siguiente ejemplo:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

Si usas una variable para pasar la cadena de dominio al loader, o no estás usando un loader, el análisis estático no podrá identificar el dominio y no se generará ningún enlace preconnect. En este caso, debes añadir manualmente un enlace preconnect al encabezado del documento, como se [describe arriba](#agregar-resource-hints).

### ¿Puedo usar dos dominios de imagen diferentes en la misma página?

El patrón de proveedor de [image loaders](#configurando-un-image-loader-para-ngoptimizedimage) está diseñado para ser lo más simple posible para el caso de uso común de tener una sola CDN de imágenes usada dentro de un componente. Sin embargo, aún es muy posible gestionar múltiples CDN de imágenes usando un solo proveedor.

Para hacerlo, recomendamos escribir un [loader de imágenes personalizado](#loaders-personalizados) que use la [propiedad `loaderParams`](#la-propiedad-loaderparams) para pasar una flag que especifique qué CDN de imágenes debe usarse, y luego invoque el loader apropiado basándose en esa flag.

### ¿Pueden añadir un nuevo loader integrado para mi CDN preferida?

Por razones de mantenimiento, actualmente no planeamos soportar loaders integrados adicionales en el repositorio de Angular. En su lugar, animamos a los desarrolladores a publicar cualquier loader de imágenes adicional como paquetes de terceros.

### ¿Puedo usar esto con la etiqueta `<picture>`?

No, pero está en nuestra hoja de ruta, así que estate atento.

Si estás esperando esta característica, por favor vota a favor del issue de Github [aquí](https://github.com/angular/angular/issues/56594).

### ¿Cómo encuentro mi imagen LCP con Chrome DevTools?

1. Usando la pestaña de rendimiento de Chrome DevTools, haz clic en el botón "iniciar perfilado y recargar página" en la parte superior izquierda. Parece un ícono de actualización de página.

2. Esto activará una instantánea de perfilado de tu aplicación Angular.

3. Una vez que el resultado del perfilado esté disponible, selecciona "LCP" en la sección de tiempos.

4. Debería aparecer una entrada de resumen en el panel inferior. Puedes encontrar el elemento LCP en la fila "related node". Al hacer clic en él, se revelará el elemento en el panel de Elementos.

<img alt="LCP en las Chrome DevTools" src="assets/images/guide/image-optimization/devtools-lcp.png">

NOTA: Esto solo identifica el elemento LCP dentro del viewport de la página que estás probando. También se recomienda usar la emulación móvil para identificar el elemento LCP en pantallas más pequeñas.
