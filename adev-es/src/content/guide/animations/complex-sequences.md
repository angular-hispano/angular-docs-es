# Secuencias de animación complejas

IMPORTANTE: El paquete `@angular/animations` ahora está deprecado. El equipo de Angular recomienda usar CSS nativo con `animate.enter` y `animate.leave` para animaciones en todo código nuevo. Aprende más en la nueva [guía de animaciones](guide/animations/enter-and-leave) de entrada y salida. También consulta [Migrando del paquete de Animations de Angular](guide/animations/migration) para aprender cómo puedes comenzar a migrar a animaciones CSS puras en tus aplicaciones.

Hasta ahora, hemos aprendido animaciones simples de elementos HTML únicos.
Angular también te permite animar secuencias coordinadas, como una cuadrícula o lista completa de elementos a medida que entran y salen de una página.
Puedes elegir ejecutar múltiples animaciones en paralelo, o ejecutar animaciones discretas secuencialmente, una tras otra.

Las funciones que controlan secuencias de animación complejas son:

| Funciones                         | Detalles |
|:---                               |:---     |
| `query()`                         | Encuentra uno o más elementos HTML internos. |
| `stagger()`                       | Aplica un retraso en cascada a las animaciones para múltiples elementos. |
| [`group()`](api/animations/group) | Ejecuta múltiples pasos de animación en paralelo. |
| `sequence()`                      | Ejecuta pasos de animación uno tras otro. |

## La función query()

La mayoría de las animaciones complejas dependen de la función `query()` para encontrar elementos hijos y aplicarles animaciones, ejemplos básicos de esto son:

| Ejemplos                               | Detalles |
|:---                                    |:---     |
| `query()` seguido de `animate()`      | Se usa para consultar elementos HTML simples y aplicar animaciones directamente a ellos.                                                                                                                            |
| `query()` seguido de `animateChild()` | Se usa para consultar elementos hijos, que tienen metadatos de animación aplicados a ellos mismos y disparar tal animación (que de otro modo sería bloqueada por la animación del elemento actual/padre). |

El primer argumento de `query()` es una cadena de [selector CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) que también puede contener los siguientes tokens específicos de Angular:

| Tokens                     | Detalles |
|:---                        |:---     |
| `:enter` <br /> `:leave`   | Para elementos que entran/salen.               |
| `:animating`               | Para elementos actualmente animando.            |
| `@*` <br /> `@triggerName` | Para elementos con cualquier trigger—o uno específico. |
| `:self`                    | El propio elemento que se está animando.                |

<docs-callout title="Elementos que entran y salen">

No todos los elementos hijos son realmente considerados como que entran/salen; esto puede, a veces, ser contraintuitivo y confuso. Por favor consulta la [documentación de la API de query](api/animations/query#entering-and-leaving-elements) para más información.

También puedes ver una ilustración de esto en el ejemplo de animaciones (introducido en la [sección de introducción de animaciones](guide/legacy-animations#about-this-guide)) bajo la pestaña Querying.

</docs-callout>

## Animar múltiples elementos usando las funciones query() y stagger()

Después de haber consultado elementos hijos a través de `query()`, la función `stagger()` te permite definir un espacio de tiempo entre cada elemento consultado que se anima y, por lo tanto, anima elementos con un retraso entre ellos.

El siguiente ejemplo demuestra cómo usar las funciones `query()` y `stagger()` para animar una lista (de héroes) agregando cada uno en secuencia, con un ligero retraso, de arriba hacia abajo.

* Usa `query()` para buscar un elemento que entra en la página que cumple con ciertos criterios
* Para cada uno de estos elementos, usa `style()` para establecer el mismo estilo inicial para el elemento.
    Hazlo transparente y usa `transform` para moverlo fuera de posición para que pueda deslizarse a su lugar.

* Usa `stagger()` para retrasar cada animación por 30 milisegundos
* Anima cada elemento en pantalla durante 0.5 segundos usando una curva de easing personalizada definida, simultáneamente desvaneciéndolo y sin transformarlo

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="page-animations"/>

## Animación paralela usando la función group()

Has visto cómo agregar un retraso entre cada animación sucesiva.
Pero también es posible que desees configurar animaciones que sucedan en paralelo.
Por ejemplo, es posible que desees animar dos propiedades CSS del mismo elemento pero usar una función `easing` diferente para cada una.
Para esto, puedes usar la función de animación [`group()`](api/animations/group).

ÚTIL: La función [`group()`](api/animations/group) se usa para agrupar *pasos* de animación, en lugar de elementos animados.

El siguiente ejemplo usa [`group()`](api/animations/group)s en `:enter` y `:leave` para dos configuraciones de tiempo diferentes, aplicando así dos animaciones independientes al mismo elemento en paralelo.

<docs-code header="src/app/hero-list-groups.component.ts (excerpt)" path="adev/src/content/examples/animations/src/app/hero-list-groups.component.ts" visibleRegion="animationdef"/>

## Animaciones secuenciales vs. paralelas

Las animaciones complejas pueden tener muchas cosas sucediendo a la vez.
Pero ¿qué pasa si deseas crear una animación que involucre varias animaciones sucediendo una tras otra? Anteriormente usaste [`group()`](api/animations/group) para ejecutar múltiples animaciones todas al mismo tiempo, en paralelo.

Una segunda función llamada `sequence()` te permite ejecutar esas mismas animaciones una tras otra.
Dentro de `sequence()`, los pasos de animación consisten en llamadas a funciones `style()` o `animate()`.

* Usa `style()` para aplicar los datos de estilo proporcionados inmediatamente.
* Usa `animate()` para aplicar datos de estilo durante un intervalo de tiempo dado.

## Ejemplo de animación de filtro

Echa un vistazo a otra animación en la página de ejemplo.
Bajo la pestaña Filter/Stagger, ingresa algo de texto en el cuadro de texto **Search Heroes**, como `Magnet` o `tornado`.

El filtro funciona en tiempo real a medida que escribes.
Los elementos salen de la página a medida que escribes cada nueva letra y el filtro se vuelve progresivamente más estricto.
La lista de héroes gradualmente vuelve a entrar en la página a medida que eliminas cada letra en el cuadro de filtro.

La plantilla HTML contiene un trigger llamado `filterAnimation`.

<docs-code header="src/app/hero-list-page.component.html" path="adev/src/content/examples/animations/src/app/hero-list-page.component.html" visibleRegion="filter-animations" language="angular-html"/>

El `filterAnimation` en el decorador del componente contiene tres transiciones.

<docs-code header="src/app/hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="filter-animations"/>

El código en este ejemplo realiza las siguientes tareas:

* Omite animaciones cuando el usuario abre por primera vez o navega a esta página (la animación de filtro reduce lo que ya está allí, por lo que solo funciona en elementos que ya existen en el DOM)
* Filtra héroes basándose en el valor de entrada de búsqueda

Para cada cambio:

* Oculta un elemento que sale del DOM estableciendo su opacidad y ancho a 0
* Anima un elemento que entra al DOM durante 300 milisegundos.
    Durante la animación, el elemento asume su ancho y opacidad predeterminados.

* Si hay múltiples elementos entrando o saliendo del DOM, escalona cada animación comenzando desde la parte superior de la página, con un retraso de 50 milisegundos entre cada elemento

## Animando los elementos de una lista que se reordena

Aunque Angular anima correctamente los elementos de listas `*ngFor` de forma predeterminada, no podrá hacerlo si su ordenamiento cambia.
Esto se debe a que perderá el rastro de qué elemento es cuál, resultando en animaciones rotas.
La única forma de ayudar a Angular a mantener el rastro de dichos elementos es asignando una `TrackByFunction` a la directiva `NgForOf`.
Esto asegura que Angular siempre sepa qué elemento es cuál, permitiéndole aplicar las animaciones correctas a los elementos correctos en todo momento.

IMPORTANTE: Si necesitas animar los elementos de una lista `*ngFor` y existe la posibilidad de que el orden de dichos elementos cambie durante el tiempo de ejecución, siempre usa una `TrackByFunction`.

## Animaciones y encapsulación de vista de componentes

Las animaciones de Angular se basan en la estructura DOM de los componentes y no tienen en cuenta directamente la [encapsulación de vista](guide/components/styling#style-scoping), esto significa que los componentes que usan `ViewEncapsulation.Emulated` se comportan exactamente como si estuvieran usando `ViewEncapsulation.None` (`ViewEncapsulation.ShadowDom` se comporta de manera diferente como discutiremos en breve).

Por ejemplo, si la función `query()` (que verás más en el resto de la guía de Animaciones) se aplicara en la parte superior de un árbol de componentes usando encapsulación de vista emulada, tal query sería capaz de identificar (y por lo tanto animar) elementos DOM en cualquier profundidad del árbol.

Por otro lado, el `ViewEncapsulation.ShadowDom` cambia la estructura DOM del componente "ocultando" elementos DOM dentro de elementos [`ShadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot). Tales manipulaciones DOM previenen que algunas de las implementaciones de animaciones funcionen correctamente ya que se basa en estructuras DOM simples y no tiene en cuenta elementos `ShadowRoot`. Por lo tanto, se aconseja evitar aplicar animaciones a vistas que incorporan componentes usando la encapsulación de vista ShadowDom.

## Resumen de secuencia de animación

Las funciones de Angular para animar múltiples elementos comienzan con `query()` para encontrar elementos internos; por ejemplo, recopilando todas las imágenes dentro de un `<div>`.
Las funciones restantes, `stagger()`, [`group()`](api/animations/group), y `sequence()`, aplican cascadas o te permiten controlar cómo se aplican múltiples pasos de animación.

## Más sobre animaciones de Angular

También puede que te interese lo siguiente:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introduction to Angular animations"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
