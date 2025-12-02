# Migrando del paquete de Animations de Angular

El paquete `@angular/animations` está deprecado a partir de la v20.2, que también introdujo las nuevas características `animate.enter` y `animate.leave` para agregar animaciones a tu aplicación. Usando estas nuevas características, puedes reemplazar todas las animaciones basadas en `@angular/animations` con CSS puro o bibliotecas de animación JS. Eliminar `@angular/animations` de tu aplicación puede reducir significativamente el tamaño de tu bundle de JavaScript. Las animaciones CSS nativas generalmente ofrecen rendimiento superior, ya que pueden beneficiarse de la aceleración por hardware. Esta guía te acompaña a través del proceso de refactorizar tu código de `@angular/animations` a animaciones CSS nativas.

## Cómo escribir animaciones en CSS nativo

Si nunca has escrito animaciones en CSS nativo, hay varias guías excelentes para comenzar. Aquí hay algunas de ellas:
[Guía de animaciones CSS de MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[Guía de animaciones CSS3 de W3Schools](https://www.w3schools.com/css/css3_animations.asp)
[Tutorial completo de animaciones CSS](https://www.lambdatest.com/blog/css-animations-tutorial/)
[Animación CSS para principiantes](https://thoughtbot.com/blog/css-animation-for-beginners)

y un par de videos:
[Aprende animación CSS en 9 minutos](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Lista de reproducción de tutorial de animación CSS de Net Ninja](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Consulta algunas de estas diversas guías y tutoriales, y luego regresa a esta guía.

## Creando animaciones reutilizables

Al igual que con el paquete de animaciones, puedes crear animaciones reutilizables que se pueden compartir en toda tu aplicación. La versión del paquete de animaciones de esto te hacía usar la función `animation()` en un archivo TypeScript compartido. La versión CSS nativa de esto es similar, pero vive en un archivo CSS compartido.

#### Con el paquete de Aninaciones

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="animation-example"/>

#### Con CSS nativo

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-shared"/>

Agregar la clase `animated-class` a un elemento activaría la animación en ese elemento.

## Animando una transición

### Animando estado y estilos

El paquete de animaciones te permitía definir varios estados usando la función [`state()`](api/animations/state) dentro de un componente. Los ejemplos podrían ser un estado `open` o `closed` que contiene los estilos para cada estado respectivo dentro de la definición. Por ejemplo:

#### Con el paquete de Aninaciones

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

Este mismo comportamiento se puede lograr nativamente usando clases CSS ya sea mediante una animación de keyframe o estilo de transición.

#### Con CSS nativo

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-states"/>

Disparar el estado `open` o `closed` se hace alternando clases en el elemento en tu componente. Puedes encontrar ejemplos de cómo hacer esto en nuestra [guía de plantillas](guide/templates/binding#css-class-and-style-property-bindings).

Puedes ver ejemplos similares en la guía de plantillas para [animar estilos directamente](guide/templates/binding#css-style-properties).

### Transiciones, tiempo y easing

La función `animate()` del paquete de animaciones permite proporcionar tiempo, como duración, retrasos y easing. Esto se puede hacer nativamente con CSS usando varias propiedades CSS o propiedades abreviadas.

Especifica `animation-duration`, `animation-delay` y `animation-timing-function` para una animación de keyframe en CSS, o alternativamente usa la propiedad abreviada `animation`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-timing"/>

De manera similar, puedes usar `transition-duration`, `transition-delay` y `transition-timing-function` y la abreviación `transition` para animaciones que no están usando `@keyframes`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="transition-timing"/>

### Disparando una animación

El paquete de animaciones requería especificar triggers usando la función `trigger()` y anidar todos tus estados dentro de ella. Con CSS nativo, esto es innecesario. Las animaciones se pueden disparar alternando estilos o clases CSS. Una vez que una clase está presente en un elemento, la animación ocurrirá. Eliminar la clase revertirá el elemento a cualquier CSS que esté definido para ese elemento. Esto resulta en significativamente menos código para hacer la misma animación. Aquí hay un ejemplo:

#### Con el paquete de Aninaciones

<docs-code-multifile>
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.ts" />
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.html" />
    <docs-code header="open-close.component.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.css"/>
</docs-code-multifile>

#### Con CSS nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts">
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts" />
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.html" />
    <docs-code header="open-close.component.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.css"/>
</docs-code-multifile>

## Transiciones y triggers

### Coincidencia de estado predefinido y comodines

El paquete de animaciones ofrece la capacidad de hacer coincidir tus estados definidos con una transición mediante cadenas. Por ejemplo, animar de open a closed sería `open => closed`. Puedes usar comodines para hacer coincidir cualquier estado con un estado objetivo, como `* => closed` y la palabra clave `void` se puede usar para estados de entrada y salida. Por ejemplo: `* => void` para cuando un elemento sale de una vista o `void => *` para cuando el elemento entra en una vista.

Estos patrones de coincidencia de estado no se necesitan en absoluto cuando se anima con CSS directamente. Puedes gestionar qué transiciones y animaciones `@keyframes` se aplican basándote en las clases que establezcas y/o los estilos que establezcas en los elementos. También puedes agregar `@starting-style` para controlar cómo se ve el elemento al entrar inmediatamente al DOM.

### Cálculo automático de propiedades con comodines

El paquete de animaciones ofrece la capacidad de animar cosas que han sido históricamente difíciles de animar, como animar una altura establecida a `height: auto`. Ahora también puedes hacer esto con CSS puro.

#### Con el paquete de Animaciones

<docs-code-multifile>
    <docs-code header="auto-height.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.ts" />
    <docs-code header="auto-height.component.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.html" />
    <docs-code header="auto-height.component.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.css" />
</docs-code-multifile>

Puedes usar css-grid para animar a altura automática.

#### Con CSS nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts">
    <docs-code header="auto-height.component.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts" />
    <docs-code header="auto-height.component.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.html" />
    <docs-code header="auto-height.component.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.css"  />
</docs-code-multifile>

Si no tienes que preocuparte por soportar todos los navegadores, también puedes revisar `calc-size()`, que es la verdadera solución para animar altura automática. Consulta [la documentación de MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) y (este tutorial)[https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/] para más información.

### Animar entrada y salida de una vista

El paquete de animaciones ofrecía el patrón de coincidencia mencionado anteriormente para entrada y salida, pero también incluía los alias abreviados de `:enter` y `:leave`.

#### Con el paquete de Ani

<docs-code-multifile>
    <docs-code header="insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.ts" />
    <docs-code header="insert-remove.component.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.html" />
    <docs-code header="insert-remove.component.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.css" />
</docs-code-multifile>

Aquí está cómo se puede lograr lo mismo sin el paquete de animaciones usando `animate.enter`.

#### Con CSS nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts">
    <docs-code header="insert.component.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts" />
    <docs-code header="insert.component.html" path="adev/src/content/examples/animations/src/app/native-css/insert.component.html" />
    <docs-code header="insert.component.css" path="adev/src/content/examples/animations/src/app/native-css/insert.component.css"  />
</docs-code-multifile>

Usa `animate.leave` para animar elementos a medida que salen de la vista, lo que aplicará las clases CSS especificadas al elemento a medida que sale de la vista.

#### Con CSS nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts">
    <docs-code header="remove.component.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts" />
    <docs-code header="remove.component.html" path="adev/src/content/examples/animations/src/app/native-css/remove.component.html" />
    <docs-code header="remove.component.css" path="adev/src/content/examples/animations/src/app/native-css/remove.component.css"  />
</docs-code-multifile>

Para más información sobre `animate.enter` y `animate.leave`, consulta la [guía de animaciones de entrada y salida](guide/animations).

### Animando incremento y decremento

Junto con los mencionados `:enter` y `:leave`, también está `:increment` y `:decrement`. También puedes animar estos agregando y eliminando clases. A diferencia de los alias integrados del paquete de animaciones, no hay aplicación automática de clases cuando los valores suben o bajan. Puedes aplicar las clases apropiadas programáticamente. Aquí hay un ejemplo:

#### Con el paquete de Aninaciones

<docs-code-multifile>
    <docs-code header="increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.ts" />
    <docs-code header="increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.html" />
    <docs-code header="increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.css" />
</docs-code-multifile>

#### Con CSS nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts">
    <docs-code header="increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts" />
    <docs-code header="increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.html" />
    <docs-code header="increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.css" />
</docs-code-multifile>

### Animaciones padre / hijo

A diferencia del paquete de animaciones, cuando se especifican múltiples animaciones dentro de un componente dado, ninguna animación tiene prioridad sobre otra y nada bloquea que ninguna animación se dispare. Cualquier secuenciación de animaciones tendría que ser manejada por tu definición de tu animación CSS, usando retraso de animation / transition, y/o usando `animationend` o `transitionend` para manejar la adición del siguiente CSS a animar.

### Deshabilitando una animación o todas las animaciones

Con animaciones CSS nativas, si deseas deshabilitar las animaciones que has especificado, tienes múltiples opciones.

1. Crea una clase personalizada que fuerce la animación y transición a `none`.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

Aplicar esta clase a un elemento previene que cualquier animación se dispare en ese elemento. Alternativamente podrías aplicar esto a todo tu DOM o sección de tu DOM para forzar este comportamiento. Sin embargo, esto previene que los eventos de animación se disparen. Si estás esperando eventos de animación para la eliminación de elementos, esta solución no funcionará. Una solución alternativa es establecer las duraciones a 1 milisegundo en su lugar.

2. Usa la media query [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) para asegurar que no se reproduzcan animaciones para usuarios que prefieren menos animación.

3. Prevenir la adición de clases de animación programáticamente

### Callbacks de animación

El paquete de animaciones exponía callbacks para que uses en el caso de que desees hacer algo cuando la animación haya terminado. Las animaciones CSS nativas también tienen estos callbacks.

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationitration_event)
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

La API de Web Animations tiene mucha funcionalidad adicional. [Echa un vistazo a la documentación](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) para ver todas las APIs de animación disponibles.

NOTA: Ten en cuenta los problemas de propagación con estos callbacks. Si estás animando hijos y padres, los eventos se propagan desde los hijos hacia los padres. Considera detener la propagación o examinar más detalles dentro del evento para determinar si estás respondiendo al objetivo de evento deseado en lugar de un evento que se propaga desde un nodo hijo. Puedes examinar la propiedad `animationname` o las propiedades que están siendo transicionadas para verificar que tienes los nodos correctos.

## Secuencias complejas

El paquete de animaciones tiene funcionalidad integrada para crear secuencias complejas. Estas secuencias son totalmente posibles sin el paquete de animaciones.

### Dirigirse a elementos específicos

En el paquete de animaciones, podías dirigirte a elementos específicos usando la función `query()` para encontrar elementos específicos por un nombre de clase CSS, similar a [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). Esto es innecesario en un mundo de animación CSS nativa. En su lugar, puedes usar tus selectores CSS para dirigirte a sub-clases y aplicar cualquier `transform` o `animation` deseada.

Para alternar clases para nodos hijos dentro de una plantilla, puedes usar enlaces de clase y estilo para agregar las animaciones en los puntos correctos.

### Stagger()

La función `stagger()` te permitía retrasar la animación de cada elemento en una lista de elementos por un tiempo especificado para crear un efecto en cascada. Puedes replicar este comportamiento en CSS nativo utilizando `animation-delay` o `transition-delay`. Aquí hay un ejemplo de cómo podría verse ese CSS.

#### Con el paquete de Aninaciones

<docs-code-multifile>
    <docs-code header="stagger.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.ts" />
    <docs-code header="stagger.component.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.html" />
    <docs-code header="stagger.component.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.css" />
</docs-code-multifile>

#### Con CSS nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts">
    <docs-code header="stagger.component.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts" />
    <docs-code header="stagger.component.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.html" />
    <docs-code header=stagger.component.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.css" />
</docs-code-multifile>

### Animaciones paralelas

El paquete de animaciones tiene una función `group()` para reproducir múltiples animaciones al mismo tiempo. En CSS, tienes control total sobre el tiempo de animación. Si tienes múltiples animaciones definidas, puedes aplicarlas todas a la vez.

```css
.target-element {
  animation: rotate 3s, fade-in 2s;
}
```

En este ejemplo, las animaciones `rotate` y `fade-in` se disparan al mismo tiempo.

### Animando los elementos de una lista que se reordena

El reordenamiento de elementos en una lista funciona de forma inmediata usando las técnicas descritas anteriormente. No se requiere ningún trabajo especial adicional. Los elementos en un bucle `@for` serán eliminados y re-agregados correctamente, lo que disparará animaciones usando `@starting-styles` para animaciones de entrada. Alternativamente, puedes usar `animate.enter` para este mismo comportamiento. Usa `animate.leave` para animar elementos a medida que se eliminan, como se ve en el ejemplo anterior.

#### Con el paquete de Aninaciones

<docs-code-multifile>
    <docs-code header="reorder.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.ts" />
    <docs-code header="reorder.component.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.html" />
    <docs-code header="reorder.component.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.css" />
</docs-code-multifile>

#### Con CSS nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts">
    <docs-code header="reorder.component.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts" />
    <docs-code header="reorder.component.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.html" />
    <docs-code header="reorder.component.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.css" />
</docs-code-multifile>

## Migrando usos de AnimationPlayer

La clase `AnimationPlayer` permite acceso a una animación para hacer cosas más avanzadas como pausar, reproducir, reiniciar y finalizar una animación a través de código. Todas estas cosas también se pueden manejar nativamente.

Puedes obtener animaciones de un elemento directamente usando [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations). Esto devuelve un array de cada [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) en ese elemento. Puedes usar la API de `Animation` para hacer mucho más de lo que podías con lo que ofrecía el `AnimationPlayer` del paquete de animaciones. Desde aquí puedes `cancel()`, `play()`, `pause()`, `reverse()` y mucho más. Esta API nativa debería proporcionar todo lo que necesitas para controlar tus animaciones.

## Transiciones de ruta

Puedes usar transiciones de vista para animar entre rutas. Consulta la [Guía de animaciones de transición de ruta](guide/routing/route-transition-animations) para comenzar.
