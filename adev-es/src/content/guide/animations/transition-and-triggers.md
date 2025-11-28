# Transiciones y triggers de animación

IMPORTANTE: El paquete `@angular/animations` ahora está deprecado. El equipo de Angular recomienda usar CSS nativo con `animate.enter` y `animate.leave` para animaciones en todo código nuevo. Aprende más en la nueva [guía de animaciones](guide/animations/enter-and-leave) de entrada y salida. También consulta [Migrando del paquete de Animations de Angular](guide/animations/migration) para aprender cómo puedes comenzar a migrar a animaciones CSS puras en tus aplicaciones.

Esta guía profundiza en estados de transición especiales como el comodín `*` y `void`. Muestra cómo estos estados especiales se usan para elementos que entran y salen de una vista.
Esta sección también explora múltiples triggers de animación, callbacks de animación y animación basada en secuencias usando keyframes.

## Estados predefinidos y coincidencia de comodines

En Angular, los estados de transición se pueden definir explícitamente a través de la función [`state()`](api/animations/state), o usando los estados predefinidos `*` comodín y `void`.

### Estado comodín

Un asterisco `*` o _comodín_ coincide con cualquier estado de animación.
Esto es útil para definir transiciones que se aplican independientemente del estado inicial o final del elemento HTML.

Por ejemplo, una transición de `open => *` se aplica cuando el estado del elemento cambia de open a cualquier otra cosa.

<img alt="wildcard state expressions" src="assets/images/guide/animations/wildcard-state-500.png">

El siguiente es otro ejemplo de código usando el estado comodín junto con el ejemplo anterior usando los estados `open` y `closed`.
En lugar de definir cada par de transición estado-a-estado, cualquier transición a `closed` toma 1 segundo, y cualquier transición a `open` toma 0.5 segundos.

Esto permite la adición de nuevos estados sin tener que incluir transiciones separadas para cada uno.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard1"/>

Usa una sintaxis de doble flecha para especificar transiciones estado-a-estado en ambas direcciones.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard2"/>

### Usa el estado comodín con múltiples estados de transición

En el ejemplo del botón de dos estados, el comodín no es tan útil porque solo hay dos estados posibles, `open` y `closed`.
En general, usa estados comodín cuando un elemento tiene múltiples estados potenciales a los que puede cambiar.
Si el botón puede cambiar de `open` a `closed` o algo como `inProgress`, usar un estado comodín podría reducir la cantidad de código necesario.

<img alt="wildcard state with 3 states" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-transition"/>

La transición `* => *` se aplica cuando tiene lugar cualquier cambio entre dos estados.

Las transiciones se emparejan en el orden en que están definidas.
Por lo tanto, puedes aplicar otras transiciones sobre la transición `* => *`.
Por ejemplo, define cambios de estilo o animaciones que se aplicarían solo a `open => closed`, luego usa `* => *` como respaldo para emparejamientos de estado que no estén específicamente llamados.

Para hacer esto, lista las transiciones más específicas _antes de_ `* => *`.

### Usa comodines con estilos

Usa el comodín `*` con un estilo para decirle a la animación que use cualquier valor de estilo actual y anime con eso.
El comodín es un valor de respaldo que se usa si el estado que se está animando no está declarado dentro del trigger.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition4"/>

### Estado void

Usa el estado `void` para configurar transiciones para un elemento que está entrando o saliendo de una página.
Consulta [Animando entrada y salida de una vista](guide/legacy-animations/transition-and-triggers#alias-enter-y-leave).

### Combinar estados comodín y void

Combina estados comodín y void en una transición para disparar animaciones que entran y salen de la página:

- Una transición de `* => void` se aplica cuando el elemento sale de una vista, independientemente del estado en el que estaba antes de salir
- Una transición de `void => *` se aplica cuando el elemento entra en una vista, independientemente del estado que asuma al entrar
- El estado comodín `*` coincide con _cualquier_ estado, incluyendo `void`

## Animar entrada y salida de una vista

Esta sección muestra cómo animar elementos entrando o saliendo de una página.

Agrega un nuevo comportamiento:

- Cuando agregas un héroe a la lista de héroes, parece volar a la página desde la izquierda
- Cuando eliminas un héroe de la lista, parece volar hacia la derecha

<docs-code header="hero-list-enter-leave.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.component.ts" visibleRegion="animationdef"/>

En el código anterior, aplicaste el estado `void` cuando el elemento HTML no está adjunto a una vista.

## Alias :enter y :leave

`:enter` y `:leave` son alias para las transiciones `void => *` y `* => void`.
Estos alias son usados por varias funciones de animación.

<docs-code hideCopy language="typescript">

transition ( ':enter', [ … ] ); // alias for void => *
transition ( ':leave', [ … ] ); // alias for * => void

</docs-code>

Es más difícil dirigirse a un elemento que está entrando en una vista porque aún no está en el DOM.
Usa los alias `:enter` y `:leave` para dirigirte a elementos HTML que se insertan o eliminan de una vista.

### Usa `*ngIf` y `*ngFor` con :enter y :leave

La transición `:enter` se ejecuta cuando cualquier vista `*ngIf` o `*ngFor` se coloca en la página, y `:leave` se ejecuta cuando esas vistas se eliminan de la página.

IMPORTANTE: Los comportamientos de entrada/salida a veces pueden ser confusos.
Como regla general, considera que cualquier elemento que Angular agregue al DOM pasa por la transición `:enter`. Solo los elementos que Angular elimine directamente del DOM pasan por la transición `:leave`. Por ejemplo, la vista de un elemento se elimina del DOM porque su padre se está eliminando del DOM.

Este ejemplo tiene un trigger especial para la animación de entrada y salida llamado `myInsertRemoveTrigger`.
La plantilla HTML contiene el siguiente código.

<docs-code header="insert-remove.component.html" path="adev/src/content/examples/animations/src/app/insert-remove.component.html" visibleRegion="insert-remove"/>

En el archivo del componente, la transición `:enter` establece una opacidad inicial de 0. Luego la anima para cambiar esa opacidad a 1 a medida que el elemento se inserta en la vista.

<docs-code header="insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/insert-remove.component.ts" visibleRegion="enter-leave-trigger"/>

Nota que este ejemplo no necesita usar [`state()`](api/animations/state).

## Transición :increment y :decrement

La función `transition()` acepta otros valores de selector, `:increment` y `:decrement`.
Úsalos para iniciar una transición cuando un valor numérico ha aumentado o disminuido en valor.

ÚTIL: El siguiente ejemplo usa los métodos `query()` y `stagger()`.
Para más información sobre estos métodos, consulta la página de [secuencias complejas](guide/legacy-animations/complex-sequences).

<docs-code header="hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="increment"/>

## Valores booleanos en transiciones

Si un trigger contiene un valor booleano como valor de enlace, entonces este valor se puede emparejar usando una expresión `transition()` que compara `true` y `false`, o `1` y `0`.

<docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.2.html" visibleRegion="trigger-boolean"/>

En el fragmento de código anterior, la plantilla HTML enlaza un elemento `<div>` a un trigger llamado `openClose` con una expresión de estado de `isOpen`, y con valores posibles de `true` y `false`.
Este patrón es una alternativa a la práctica de crear dos estados nombrados como `open` y `close`.

Dentro de los metadatos del `@Component` bajo la propiedad `animations:`, cuando el estado se evalúa a `true`, la altura del elemento HTML asociado es un estilo comodín o predeterminado.
En este caso, la animación usa cualquier altura que el elemento ya tenía antes de que comenzara la animación.
Cuando el elemento está `closed`, el elemento se anima a una altura de 0, lo que lo hace invisible.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.2.ts" visibleRegion="trigger-boolean"/>

## Múltiples triggers de animación

Puedes definir más de un trigger de animación para un componente.
Adjunta triggers de animación a diferentes elementos, y las relaciones padre-hijo entre los elementos afectan cómo y cuándo se ejecutan las animaciones.

### Animaciones padre-hijo

Cada vez que se dispara una animación en Angular, la animación padre siempre tiene prioridad y las animaciones hijas se bloquean.
Para que se ejecute una animación hija, la animación padre debe consultar cada uno de los elementos que contienen animaciones hijas. Luego permite que las animaciones se ejecuten usando la función [`animateChild()`](api/animations/animateChild).

#### Deshabilitar una animación en un elemento HTML

Un enlace de control de animación especial llamado `@.disabled` se puede colocar en un elemento HTML para apagar animaciones en ese elemento, así como en cualquier elemento anidado.
Cuando es true, el enlace `@.disabled` previene que se rendericen todas las animaciones.

El siguiente ejemplo de código muestra cómo usar esta característica.

<docs-code-multifile>
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.4.html" visibleRegion="toggle-animation"/>
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.4.ts" visibleRegion="toggle-animation" language="typescript"/>
</docs-code-multifile>

Cuando el enlace `@.disabled` es true, el trigger `@childAnimation` no se activa.

Cuando un elemento dentro de una plantilla HTML tiene animaciones desactivadas usando el enlace host `@.disabled`, las animaciones se desactivan en todos los elementos internos también.
No puedes desactivar selectivamente múltiples animaciones en un solo elemento.<!-- vale off -->

Una animación hija selectiva aún se puede ejecutar en un padre deshabilitado de una de las siguientes maneras:

- Una animación padre puede usar la función [`query()`](api/animations/query) para recopilar elementos internos ubicados en áreas deshabilitadas de la plantilla HTML. 
Esos elementos aún pueden animar.
<!-- vale on -->

* Una animación hija puede ser consultada por un padre y luego animada posteriormente con la función `animateChild()`

#### Deshabilitar todas las animaciones

Para desactivar todas las animaciones para una aplicación Angular, coloca el enlace host `@.disabled` en el componente Angular superior.

<docs-code header="app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="toggle-app-animations"/>

ÚTIL: Deshabilitar animaciones en toda la aplicación es útil durante las pruebas end-to-end (E2E).

## Callbacks de animación

La función `trigger()` de animación emite _callbacks_ cuando comienza y cuando termina.
El siguiente ejemplo presenta un componente que contiene un trigger `openClose`.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events1"/>

En la plantilla HTML, el evento de animación se devuelve a través de `$event`, como `@triggerName.start` y `@triggerName.done`, donde `triggerName` es el nombre del trigger que se está usando.
En este ejemplo, el trigger `openClose` aparece de la siguiente manera.

<docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.3.html" visibleRegion="callbacks"/>

Un uso potencial para callbacks de animación podría ser cubrir una llamada API lenta, como una búsqueda en base de datos.
Por ejemplo, se puede configurar un botón **InProgress** para tener su propia animación en bucle mientras la operación del sistema backend finaliza.

Se puede llamar otra animación cuando la animación actual termina.
Por ejemplo, el botón pasa del estado `inProgress` al estado `closed` cuando la llamada API se completa.

Una animación puede influir en que un usuario final _perciba_ la operación como más rápida, incluso cuando no lo es.

Los callbacks pueden servir como herramienta de depuración, por ejemplo en conjunto con `console.warn()` para ver el progreso de la aplicación en la Consola de JavaScript del desarrollador del navegador.
El siguiente fragmento de código crea salida de registro de consola para el ejemplo original, un botón con los dos estados de `open` y `closed`.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events"/>

## Keyframes

Para crear una animación con múltiples pasos ejecutados en secuencia, usa _keyframes_.

La función `keyframe()` de Angular permite varios cambios de estilo dentro de un solo segmento de tiempo.
Por ejemplo, el botón, en lugar de desvanecerse, podría cambiar de color varias veces durante un solo período de tiempo de 2 segundos.

<img alt="keyframes" src="assets/images/guide/animations/keyframes-500.png">

El código para este cambio de color podría verse así.

<docs-code header="status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframes"/>

### Offset

Los keyframes incluyen un `offset` que define el punto en la animación donde ocurre cada cambio de estilo.
Los offsets son medidas relativas de cero a uno, marcando el inicio y el final de la animación. Deben aplicarse a cada uno de los pasos de keyframe si se usan al menos una vez.

Definir offsets para keyframes es opcional.
Si los omites, se asignan automáticamente offsets espaciados uniformemente.
Por ejemplo, tres keyframes sin offsets predefinidos reciben offsets de 0, 0.5 y 1.
Especificar un offset de 0.8 para la transición media en el ejemplo anterior podría verse así.

<img alt="keyframes with offset" src="assets/images/guide/animations/keyframes-offset-500.png">

El código con offsets especificados sería el siguiente.

<docs-code header="status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframesWithOffsets"/>

Puedes combinar keyframes con `duration`, `delay` y `easing` dentro de una sola animación.

### Keyframes con pulsación

Usa keyframes para crear un efecto de pulso en tus animaciones definiendo estilos en offsets específicos a lo largo de la animación.

Aquí hay un ejemplo de uso de keyframes para crear un efecto de pulso:

- Los estados originales `open` y `closed`, con los cambios originales en altura, color y opacidad, ocurriendo durante un período de tiempo de 1 segundo
- Una secuencia de keyframes insertada en el medio que hace que el botón parezca pulsar irregularmente durante el mismo período de tiempo de 1 segundo

<img alt="keyframes with irregular pulsation" src="assets/images/guide/animations/keyframes-pulsation.png">

El fragmento de código para esta animación podría verse así.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.1.ts" visibleRegion="trigger"/>

### Propiedades animables y unidades

Las animaciones de Angular se construyen sobre animaciones web, por lo que puedes animar cualquier propiedad que el navegador considere animable.
Esto incluye posiciones, tamaños, transformaciones, colores, bordes y más.
El W3C mantiene una lista de propiedades animables en su página [CSS Transitions](https://www.w3.org/TR/css-transitions-1).

Para propiedades con un valor numérico, define una unidad proporcionando el valor como una cadena, entre comillas, con el sufijo apropiado:

- 50 píxeles:
    `'50px'`

- Tamaño de fuente relativo:
    `'3em'`

- Porcentaje:
    `'100%'`

También puedes proporcionar el valor como un número. En tales casos Angular asume una unidad predeterminada de píxeles, o `px`.
Expresar 50 píxeles como `50` es lo mismo que decir `'50px'`.

ÚTIL: La cadena `"50"` no sería considerada válida.

### Cálculo automático de propiedades con comodines

A veces, el valor de una propiedad de estilo dimensional no se conoce hasta el tiempo de ejecución.
Por ejemplo, los elementos a menudo tienen anchos y alturas que dependen de su contenido o del tamaño de la pantalla.
Estas propiedades a menudo son desafiantes de animar usando CSS.

En estos casos, puedes usar un valor de propiedad comodín `*` especial bajo `style()`. El valor de esa propiedad de estilo particular se calcula en tiempo de ejecución y luego se conecta a la animación.

El siguiente ejemplo tiene un trigger llamado `shrinkOut`, usado cuando un elemento HTML sale de la página.
La animación toma cualquier altura que el elemento tenga antes de salir, y la anima desde esa altura hasta cero.

<docs-code header="hero-list-auto.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.component.ts" visibleRegion="auto-calc"/>

### Resumen de keyframes

La función `keyframes()` en Angular te permite especificar múltiples estilos intermedios dentro de una sola transición. Se puede usar un `offset` opcional para definir el punto en la animación donde debe ocurrir cada cambio de estilo.

## Más sobre animaciones de Angular

También puede que te interese lo siguiente:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introduction to Angular animations"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
