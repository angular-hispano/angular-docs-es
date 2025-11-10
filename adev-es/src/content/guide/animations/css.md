# Animando tu aplicación con CSS

CSS ofrece un conjunto robusto de herramientas para crear animaciones hermosas y atractivas dentro de tu aplicación.

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

Puedes crear animaciones reutilizables que se pueden compartir en toda tu aplicación usando `@keyframes`. Define animaciones de keyframes en un archivo CSS compartido, y podrás reutilizar esas animaciones de keyframes donde quieras dentro de tu aplicación.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-shared"/>

Agregar la clase `animated-class` a un elemento activaría la animación en ese elemento.

## Animando una transición

### Animando estado y estilos

Es posible que desees animar entre dos estados diferentes, por ejemplo cuando un elemento está abierto o cerrado. Puedes lograr esto usando clases CSS ya sea mediante una animación de keyframe o estilo de transición.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-states"/>

Disparar el estado `open` o `closed` se hace alternando clases en el elemento en tu componente. Puedes encontrar ejemplos de cómo hacer esto en nuestra [guía de plantillas](guide/templates/binding#css-class-and-style-property-bindings).

Puedes ver ejemplos similares en la guía de plantillas para [animar estilos directamente](guide/templates/binding#css-style-properties).

### Transiciones, tiempo y easing

Animar a menudo requiere ajustar comportamientos de tiempo, retrasos y easing. Esto se puede hacer usando varias propiedades CSS o propiedades abreviadas.

Especifica `animation-duration`, `animation-delay` y `animation-timing-function` para una animación de keyframe en CSS, o alternativamente usa la propiedad abreviada `animation`.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-timing"/>

De manera similar, puedes usar `transition-duration`, `transition-delay` y `transition-timing-function` y la abreviación `transition` para animaciones que no están usando `@keyframes`.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="transition-timing"/>

### Disparando una animación

Las animaciones se pueden disparar alternando estilos o clases CSS. Una vez que una clase está presente en un elemento, la animación ocurrirá. Eliminar la clase revertirá el elemento a cualquier CSS que esté definido para ese elemento. Aquí hay un ejemplo:

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts">
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts" />
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.html" />
    <docs-code header="src/app/open-close.component.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.css"/>
</docs-code-multifile>

## Transiciones y triggers

### Animando altura automática

Puedes usar css-grid para animar a altura automática.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts">
    <docs-code header="src/app/auto-height.component.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts" />
    <docs-code header="src/app/auto-height.component.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.html" />
    <docs-code header="src/app/auto-height.component.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.css"  />
</docs-code-multifile>

Si no tienes que preocuparte por soportar todos los navegadores, también puedes revisar `calc-size()`, que es la verdadera solución para animar altura automática. Consulta [la documentación de MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) y (este tutorial)[https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/] para más información.

### Animar entrada y salida de una vista

Puedes crear animaciones para cuando un elemento entra en una vista o sale de una vista. Comencemos viendo cómo animar un elemento que entra en una vista. Haremos esto con `animate.enter`, que aplicará clases de animación cuando un elemento entre en la vista.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts">
    <docs-code header="src/app/insert.component.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts" />
    <docs-code header="src/app/insert.component.html" path="adev/src/content/examples/animations/src/app/native-css/insert.component.html" />
    <docs-code header="src/app/insert.component.css" path="adev/src/content/examples/animations/src/app/native-css/insert.component.css"  />
</docs-code-multifile>

Animar un elemento cuando sale de la vista es similar a animar cuando entra en una vista. Usa `animate.leave` para especificar qué clases CSS aplicar cuando el elemento sale de la vista.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts">
    <docs-code header="src/app/remove.component.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts" />
    <docs-code header="src/app/remove.component.html" path="adev/src/content/examples/animations/src/app/native-css/remove.component.html" />
    <docs-code header="src/app/remove.component.css" path="adev/src/content/examples/animations/src/app/native-css/remove.component.css"  />
</docs-code-multifile>

Para más información sobre `animate.enter` y `animate.leave`, consulta la [guía de animaciones de entrada y salida](guide/animations).

### Animando incremento y decremento

Animar en incremento y decremento es un patrón común en aplicaciones. Aquí hay un ejemplo de cómo puedes lograr ese comportamiento.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts">
    <docs-code header="src/app/increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts" />
    <docs-code header="src/app/increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.html" />
    <docs-code header="src/app/increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.css" />
</docs-code-multifile>

### Deshabilitando una animación o todas las animaciones

Si deseas deshabilitar las animaciones que has especificado, tienes múltiples opciones.

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

Si tienes acciones que te gustaría ejecutar en ciertos puntos durante las animaciones, hay varios eventos disponibles que puedes escuchar. Aquí hay algunos de ellos.

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

Las animaciones son a menudo más complicadas que solo un simple fade in o fade out. Puedes tener muchas secuencias complicadas de animaciones que desees ejecutar. Echemos un vistazo a algunos de esos posibles escenarios.

### Escalonando animaciones en una lista

Un efecto común es escalonar las animaciones de cada elemento en una lista para crear un efecto en cascada. Esto se puede lograr utilizando `animation-delay` o `transition-delay`. Aquí hay un ejemplo de cómo podría verse ese CSS.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts">
    <docs-code header="src/app/stagger.component.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts" />
    <docs-code header="src/app/stagger.component.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.html" />
    <docs-code header="src/app/stagger.component.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.css" />
</docs-code-multifile>

### Animaciones paralelas

Puedes aplicar múltiples animaciones a un elemento a la vez usando la propiedad abreviada `animation`. Cada una puede tener sus propias duraciones y retrasos. Esto te permite componer animaciones juntas y crear efectos complicados.

```css
.target-element {
  animation: rotate 3s, fade-in 2s;
}
```

En este ejemplo, las animaciones `rotate` y `fade-in` se disparan al mismo tiempo, pero tienen diferentes duraciones.

### Animando los elementos de una lista que se reordena

Los elementos en un bucle `@for` serán eliminados y re-agregados, lo que disparará animaciones usando `@starting-styles` para animaciones de entrada. Alternativamente, puedes usar `animate.enter` para este mismo comportamiento. Usa `animate.leave` para animar elementos a medida que se eliminan, como se ve en el ejemplo a continuación.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts">
    <docs-code header="src/app/reorder.component.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts" />
    <docs-code header="src/app/reorder.component.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.html" />
    <docs-code header="src/app/reorder.component.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.css" />
</docs-code-multifile>

## Control programático de animaciones

Puedes obtener animaciones de un elemento directamente usando [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations). Esto devuelve un array de cada [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) en ese elemento. Puedes usar la API de `Animation` para hacer mucho más de lo que podías con lo que ofrecía el `AnimationPlayer` del paquete de animaciones. Desde aquí puedes `cancel()`, `play()`, `pause()`, `reverse()` y mucho más. Esta API nativa debería proporcionar todo lo que necesitas para controlar tus animaciones.

## Más sobre animaciones de Angular

También puede que te interese lo siguiente:

<docs-pill-row>
  <docs-pill href="guide/animations" title="Enter and Leave animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
