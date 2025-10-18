# Introducción a las animaciones en Angular

IMPORTANTE: El paquete `@angular/animations` ahora está deprecado. El equipo de Angular recomienda usar CSS nativo con `animate.enter` y `animate.leave` para animaciones en todo código nuevo. Aprende más en la nueva [guía de animaciones](guide/animations/enter-and-leave) de entrada y salida. También consulta [Migrando del paquete de Animations de Angular](guide/animations/migration) para aprender cómo puedes comenzar a migrar a animaciones CSS puras en tus aplicaciones.

La animación proporciona la ilusión de movimiento: los elementos HTML cambian su estilo a lo largo del tiempo.
Las animaciones bien diseñadas pueden hacer que tu aplicación sea más divertida y fácil de usar, pero no son solo cosméticas.
Las animaciones pueden mejorar tu aplicación y la experiencia del usuario de varias maneras:

* Sin animaciones, las transiciones de páginas web pueden parecer abruptas y bruscas
* El movimiento mejora enormemente la experiencia del usuario, así que las animaciones dan a los usuarios la oportunidad de detectar la respuesta de la aplicación a sus acciones
* Las buenas animaciones llaman intuitivamente la atención del usuario hacia donde se necesita

Típicamente, las animaciones involucran múltiples *transformaciones* de estilo a lo largo del tiempo.
Un elemento HTML puede moverse, cambiar de color, crecer o encoger, desvanecerse o deslizarse fuera de la página.
Estos cambios pueden ocurrir simultáneamente o secuencialmente. Puedes controlar el tiempo de cada transformación.

El sistema de animación de Angular está construido sobre la funcionalidad CSS, lo que significa que puedes animar cualquier propiedad que el navegador considere animable.
Esto incluye posiciones, tamaños, transformaciones, colores, bordes y más.
El W3C mantiene una lista de propiedades animables en su página [CSS Transitions](https://www.w3.org/TR/css-transitions-1).

## Acerca de esta guía

Esta guía cubre las características básicas de animación de Angular para que comiences a agregar animaciones de Angular a tu proyecto.

## Primeros pasos

Los módulos principales de Angular para animaciones son `@angular/animations` y `@angular/platform-browser`.

Para comenzar a agregar animaciones de Angular a tu proyecto, importa los módulos específicos de animación junto con la funcionalidad estándar de Angular.

<docs-workflow>
<docs-step title="Habilitando el módulo de animaciones">
Importa `provideAnimationsAsync` desde `@angular/platform-browser/animations/async` y agrégalo a la lista de proveedores en la llamada a la función `bootstrapApplication`.

<docs-code header="Enabling Animations" language="ts" linenums>
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
  ]
});
</docs-code>

<docs-callout important title="Si necesitas animaciones inmediatas en tu aplicación">
  Si necesitas que una animación ocurra inmediatamente cuando tu aplicación se carga,
  querrás cambiar al módulo de animaciones cargado de forma inmediata (eager). Importa `provideAnimations`
  desde `@angular/platform-browser/animations` en su lugar, y usa `provideAnimations` **en lugar de**
  `provideAnimationsAsync` en la llamada a la función `bootstrapApplication`.
</docs-callout>

Para aplicaciones basadas en `NgModule` importa `BrowserAnimationsModule`, que introduce las capacidades de animación en el módulo raíz de tu aplicación Angular.

<docs-code header="src/app/app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="Importando funciones de animación en archivos de componentes">
Si planeas usar funciones de animación específicas en archivos de componentes, importa esas funciones desde `@angular/animations`.

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="imports"/>

Consulta todas las [funciones de animación disponibles](guide/legacy-animations#animations-api-summary) al final de esta guía.

</docs-step>
<docs-step title="Agregando la propiedad de metadatos de animación">
En el archivo del componente, agrega una propiedad de metadatos llamada `animations:` dentro del decorador `@Component()`.
Colocas el trigger que define una animación dentro de la propiedad de metadatos `animations`.

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="decorator"/>
</docs-step>
</docs-workflow>

## Animando una transición

Animemos una transición que cambia un elemento HTML único de un estado a otro.
Por ejemplo, puedes especificar que un botón muestre **Abrir** o **Cerrado** basándose en la última acción del usuario.
Cuando el botón está en el estado `open`, es visible y amarillo.
Cuando está en el estado `closed`, es translúcido y azul.

En HTML, estos atributos se establecen usando estilos CSS ordinarios como color y opacidad.
En Angular, usa la función `style()` para especificar un conjunto de estilos CSS para usar con animaciones.
Recopila un conjunto de estilos en un estado de animación, y dale al estado un nombre, como `open` o `closed`.

ÚTIL: Creemos un nuevo componente `open-close` para animar con transiciones simples.

Ejecuta el siguiente comando en la terminal para generar el componente:

<docs-code language="shell">

ng g component open-close

</docs-code>

Esto creará el componente en `src/app/open-close.component.ts`.

### Estado y estilos de animación

Usa la función [`state()`](api/animations/state) de Angular para definir diferentes estados para llamar al final de cada transición.
Esta función acepta dos argumentos:
Un nombre único como `open` o `closed` y una función `style()`.

Usa la función `style()` para definir un conjunto de estilos para asociar con un nombre de estado dado.
Debes usar *camelCase* para los atributos de estilo que contienen guiones, como `backgroundColor` o envolverlos entre comillas, como `'background-color'`.

Veamos cómo funciona la función [`state()`](api/animations/state) de Angular con la función `style⁣­(⁠)` para establecer atributos de estilo CSS.
En este fragmento de código, se establecen múltiples atributos de estilo al mismo tiempo para el estado.
En el estado `open`, el botón tiene una altura de 200 píxeles, una opacidad de 1 y un color de fondo amarillo.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

En el siguiente estado `closed`, el botón tiene una altura de 100 píxeles, una opacidad de 0.8 y un color de fondo azul.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state2"/>

### Transiciones y tiempo

En Angular, puedes establecer múltiples estilos sin ninguna animación.
Sin embargo, sin un mayor refinamiento, el botón se transforma instantáneamente sin desvanecimiento, sin reducción u otro indicador visible de que está ocurriendo un cambio.

Para hacer el cambio menos abrupto, necesitas definir una *transición* de animación para especificar los cambios que ocurren entre un estado y otro durante un período de tiempo.
La función `transition()` acepta dos argumentos:
El primer argumento acepta una expresión que define la dirección entre dos estados de transición, y el segundo argumento acepta uno o una serie de pasos `animate()`.

Usa la función `animate()` para definir la duración, el retraso y el easing de una transición, y para designar la función de estilo para definir estilos mientras las transiciones están en curso.
Usa la función `animate()` para definir la función `keyframes()` para animaciones de múltiples pasos.
Estas definiciones se colocan en el segundo argumento de la función `animate()`.

#### Metadatos de animación: duración, retraso y easing

La función `animate()` (segundo argumento de la función de transición) acepta los parámetros de entrada `timings` y `styles`.

El parámetro `timings` toma un número o una cadena definida en tres partes.

<docs-code language="typescript">

animate (duration)

</docs-code>

o

<docs-code language="typescript">

animate ('duration delay easing')

</docs-code>

La primera parte, `duration`, es requerida.
La duración puede expresarse en milisegundos como un número sin comillas, o en segundos con comillas y un especificador de tiempo.
Por ejemplo, una duración de una décima de segundo puede expresarse de las siguientes maneras:

* Como un número simple, en milisegundos:
    `100`

* En una cadena, como milisegundos:
    `'100ms'`

* En una cadena, como segundos:
    `'0.1s'`

El segundo argumento, `delay`, tiene la misma sintaxis que `duration`.
Por ejemplo:

* Espera 100ms y luego ejecuta durante 200ms: `'0.2s 100ms'`

El tercer argumento, `easing`, controla cómo la animación [acelera y desacelera](https://easings.net) durante su ejecución.
Por ejemplo, `ease-in` hace que la animación comience lentamente y gane velocidad a medida que progresa.

* Espera 100ms, ejecuta durante 200ms.
    Usa una curva de desaceleración para comenzar rápido y desacelerar lentamente hasta un punto de reposo:
    `'0.2s 100ms ease-out'`

* Ejecuta durante 200ms, sin retraso.
    Usa una curva estándar para comenzar lento, acelerar en el medio y luego desacelerar lentamente al final:
    `'0.2s ease-in-out'`

* Comienza inmediatamente, ejecuta durante 200ms.
    Usa una curva de aceleración para comenzar lento y terminar a toda velocidad:
    `'0.2s ease-in'`

ÚTIL: Consulta el tema sobre [curvas de easing naturales](https://material.io/design/motion/speed.html#easing) del sitio web de Material Design para información general sobre curvas de easing.

Este ejemplo proporciona una transición de estado de `open` a `closed` con una transición de 1 segundo entre estados.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition1"/>

En el fragmento de código anterior, el operador `=>` indica transiciones unidireccionales, y `<=>` es bidireccional.
Dentro de la transición, `animate()` especifica cuánto tiempo toma la transición.
En este caso, el cambio de estado de `open` a `closed` toma 1 segundo, expresado aquí como `1s`.

Este ejemplo agrega una transición de estado del estado `closed` al estado `open` con un arco de animación de transición de 0.5 segundos.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition2"/>

ÚTIL: Algunas notas adicionales sobre el uso de estilos dentro de las funciones [`state`](api/animations/state) y `transition`.

* Usa [`state()`](api/animations/state) para definir estilos que se aplican al final de cada transición, persisten después de que la animación se completa
* Usa `transition()` para definir estilos intermedios, que crean la ilusión de movimiento durante la animación
* Cuando las animaciones están deshabilitadas, los estilos de `transition()` pueden omitirse, pero los estilos de [`state()`](api/animations/state) no pueden
* Incluye múltiples pares de estados dentro del mismo argumento `transition()`:

    <docs-code language="typescript">

    transition( 'on => off, off => void' )

    </docs-code>

### Disparando la animación

Una animación requiere un *trigger*, para que sepa cuándo comenzar.
La función `trigger()` recopila los estados y transiciones, y le da a la animación un nombre, para que puedas adjuntarla al elemento disparador en la plantilla HTML.

La función `trigger()` describe el nombre de la propiedad a observar para cambios.
Cuando ocurre un cambio, el trigger inicia las acciones incluidas en su definición.
Estas acciones pueden ser transiciones u otras funciones, como veremos más adelante.

En este ejemplo, nombraremos el trigger `openClose` y lo adjuntaremos al elemento `button`.
El trigger describe los estados open y closed, y los tiempos para las dos transiciones.

ÚTIL: Dentro de cada llamada a la función `trigger()`, un elemento solo puede estar en un estado en cualquier momento dado.
Sin embargo, es posible que múltiples triggers estén activos a la vez.

### Definiendo animaciones y adjuntándolas a la plantilla HTML

Las animaciones se definen en los metadatos del componente que controla el elemento HTML a animar.
Coloca el código que define tus animaciones bajo la propiedad `animations:` dentro del decorador `@Component()`.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>

Cuando hayas definido un trigger de animación para un componente, adjúntalo a un elemento en la plantilla de ese componente envolviendo el nombre del trigger entre corchetes y precediéndolo con un símbolo `@`.
Luego, puedes enlazar el trigger a una expresión de plantilla usando la sintaxis de enlace de propiedad estándar de Angular como se muestra a continuación, donde `triggerName` es el nombre del trigger, y `expression` se evalúa a un estado de animación definido.

<docs-code language="typescript">

<div [@triggerName]="expression">…</div>;

</docs-code>

La animación se ejecuta o dispara cuando el valor de la expresión cambia a un nuevo estado.

El siguiente fragmento de código enlaza el trigger al valor de la propiedad `isOpen`.

<docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>

En este ejemplo, cuando la expresión `isOpen` se evalúa a un estado definido de `open` o `closed`, notifica al trigger `openClose` de un cambio de estado.
Luego depende del código `openClose` manejar el cambio de estado y lanzar una animación de cambio de estado.

Para elementos que entran o salen de una página (insertados o eliminados del DOM), puedes hacer que las animaciones sean condicionales.
Por ejemplo, usa `*ngIf` con el trigger de animación en la plantilla HTML.

ÚTIL: En el archivo del componente, establece el trigger que define las animaciones como el valor de la propiedad `animations:` en el decorador `@Component()`.

En el archivo de plantilla HTML, usa el nombre del trigger para adjuntar las animaciones definidas al elemento HTML a animar.

### Revisión del código

Aquí están los archivos de código discutidos en el ejemplo de transición.

<docs-code-multifile>
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>
    <docs-code header="src/app/open-close.component.css" path="adev/src/content/examples/animations/src/app/open-close.component.css"/>
</docs-code-multifile>

### Resumen

Aprendiste a agregar animación a una transición entre dos estados, usando `style()` y [`state()`](api/animations/state) junto con `animate()` para el tiempo.

Aprende sobre características más avanzadas en las animaciones de Angular en la sección de Animaciones, comenzando con técnicas avanzadas en [transiciones y triggers](guide/legacy-animations/transition-and-triggers).

## Resumen de la API de animaciones

La API funcional proporcionada por el módulo `@angular/animations` proporciona un lenguaje específico de dominio (DSL) para crear y controlar animaciones en aplicaciones Angular.
Consulta la [referencia de la API](api#animations) para un listado completo y detalles de sintaxis de las funciones principales y estructuras de datos relacionadas.

| Nombre de función                 | Qué hace                                                                                                                                                                                                                      |
|:---                               |:---                                                                                                                                                                                                                           |
| `trigger()`                       | Inicia la animación y sirve como contenedor para todas las demás llamadas a funciones de animación. La plantilla HTML se enlaza a `triggerName`. Usa el primer argumento para declarar un nombre de trigger único. Usa sintaxis de array. |
| `style()`                         | Define uno o más estilos CSS para usar en animaciones. Controla la apariencia visual de los elementos HTML durante las animaciones. Usa sintaxis de objeto.                                                                  |
| [`state()`](api/animations/state) | Crea un conjunto nombrado de estilos CSS que deben aplicarse en la transición exitosa a un estado dado. El estado puede entonces ser referenciado por nombre dentro de otras funciones de animación.                        |
| `animate()`                       | Especifica la información de tiempo para una transición. Valores opcionales para `delay` y `easing`. Puede contener llamadas a `style()` dentro.                                                                             |
| `transition()`                    | Define la secuencia de animación entre dos estados nombrados. Usa sintaxis de array.                                                                                                                                         |
| `keyframes()`                     | Permite un cambio secuencial entre estilos dentro de un intervalo de tiempo especificado. Usa dentro de `animate()`. Puede incluir múltiples llamadas a `style()` dentro de cada `keyframe()`. Usa sintaxis de array.       |
| [`group()`](api/animations/group) | Especifica un grupo de pasos de animación (*animaciones internas*) para ejecutarse en paralelo. La animación continúa solo después de que todos los pasos de animación internos se hayan completado. Usado dentro de `sequence()` o `transition()`. |
| `query()`                         | Encuentra uno o más elementos HTML internos dentro del elemento actual.                                                                                                                                                      |
| `sequence()`                      | Especifica una lista de pasos de animación que se ejecutan secuencialmente, uno por uno.                                                                                                                                     |
| `stagger()`                       | Escalonea el tiempo de inicio para animaciones de múltiples elementos.                                                                                                                                                       |
| `animation()`                     | Produce una animación reutilizable que puede ser invocada desde otro lugar. Usado junto con `useAnimation()`.                                                                                                                |
| `useAnimation()`                  | Activa una animación reutilizable. Usado con `animation()`.                                                                                                                                                                  |
| `animateChild()`                  | Permite que las animaciones en componentes hijos se ejecuten dentro del mismo marco de tiempo que el padre.                                                                                                                  |

</table>

## Más sobre animaciones de Angular

ÚTIL: Consulta esta [presentación](https://www.youtube.com/watch?v=rnTK9meY5us), mostrada en la conferencia AngularConnect en noviembre de 2017, y el [código fuente](https://github.com/matsko/animationsftw.in) adjunto.

También puede que te interese lo siguiente:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
