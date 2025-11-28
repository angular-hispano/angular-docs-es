# Animando tus aplicaciones con `animate.enter` y `animate.leave`

Las animaciones bien diseñadas pueden hacer que tu aplicación sea más divertida y fácil de usar, pero no son solo algo cosmético.
Las animaciones pueden mejorar tu aplicación y la experiencia del usuario de varias maneras:

- Sin animaciones, las transiciones de páginas web pueden parecer abruptas y chocantes.
- El movimiento mejora enormemente la experiencia del usuario, por lo que las animaciones les dan la oportunidad de detectar la respuesta de la aplicación a sus acciones.
- Las buenas animaciones pueden guiar suavemente la atención del usuario a lo largo de un flujo de trabajo.

Angular proporciona `animate.enter` y `animate.leave` para animar los elementos de tu aplicación. Estas dos características aplican clases CSS de entrada y salida en los momentos apropiados o llaman funciones para aplicar animaciones de bibliotecas de terceros. `animate.enter` y `animate.leave` no son directivas. Son APIs especiales soportadas directamente por el compilador de Angular. Pueden ser usadas en elementos directamente y también pueden ser usadas como un enlace host.

## `animate.enter`

Puedes usar `animate.enter` para animar elementos a medida que _entran_ al DOM. Puedes definir animaciones de entrada usando clases CSS con transiciones o animaciones de keyframes.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

Cuando la animación se completa, Angular elimina la clase o clases que especificaste en `animate.enter` del DOM. Las clases de animación solo están presentes mientras la animación está activa.

NOTA: Cuando se usan múltiples animaciones de keyframes o propiedades de transición en un elemento, Angular elimina todas las clases solo _después_ de que la animación más larga se haya completado.

Puedes usar `animate.enter` con cualquier otra característica de Angular, como control de flujo o expresiones dinámicas. `animate.enter` acepta tanto una cadena de clase única (con múltiples clases separadas por espacios), o un array de cadenas de clases.

Una nota rápida sobre el uso de transiciones CSS: Si eliges usar transiciones en lugar de animaciones de keyframes, las clases agregadas al elemento con `animate.enter` representan el estado al que la transición animará. Tu CSS de elemento base es cómo se verá el elemento cuando no se ejecuten animaciones, lo cual es probablemente similar al estado final de la transición CSS. Así que todavía necesitarías emparejarlo con `@starting-style` para tener un estado _desde_ apropiado para que tu transición funcione.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave`

Puedes usar `animate.leave` para animar elementos a medida que _salen_ del DOM. Puedes definir animaciones de salida usando clases CSS con transformaciones o animaciones de keyframes.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

Cuando la animación se completa, Angular elimina automáticamente el elemento animado del DOM.

NOTA: Cuando se usan múltiples animaciones de keyframes o propiedades de transición en un elemento, Angular espera para eliminar el elemento solo _después_ de que la más larga de esas animaciones se haya completado.

`animate.leave` también puede ser usado con signals y otros enlaces. Puedes usar `animate.leave` con una clase única o múltiples clases. Ya sea especificándolo como una cadena simple con espacios o un array de cadenas.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

## Enlaces de eventos, funciones y bibliotecas de terceros

Tanto `animate.enter` como `animate.leave` soportan sintaxis de enlace de eventos que permite llamadas a funciones. Puedes usar esta sintaxis para llamar a una función en el código de tu componente o utilizar bibliotecas de animación de terceros, como [GSAP](https://gsap.com/), [anime.js](https://animejs.com/), o cualquier otra biblioteca de animación JavaScript.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

El objeto `$event` tiene el tipo `AnimationCallbackEvent`. Incluye el elemento como el `target` y proporciona una función `animationComplete()` para notificar al framework cuando la animación termina.

IMPORTANTE: **Debes** llamar a la función `animationComplete()` cuando uses `animate.leave` para que Angular elimine el elemento.

Si no llamas a `animationComplete()` cuando usas `animate.leave`, Angular llama a la función automáticamente después de un retraso de cuatro segundos. Puedes configurar la duración del retraso proporcionando el token `MAX_ANIMATION_TIMEOUT` en milisegundos.

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## Compatibilidad con las animaciones heredadas de Angular

No puedes usar animaciones heredadas junto con `animate.enter` y `animate.leave` dentro del mismo componente. Hacerlo provocaría que las clases de entrada permanezcan en el elemento o que los nodos que salen no se eliminen. Fuera de eso, está bien usar tanto las animaciones heredadas como las nuevas animaciones `animate.enter` y `animate.leave` dentro de la misma _aplicación_. La única excepción es la proyección de contenido. Si estás proyectando contenido desde un componente con animaciones heredadas hacia otro componente que usa `animate.enter` o `animate.leave`, o viceversa, esto producirá el mismo comportamiento que si se usaran juntas en el mismo componente. Esto no es compatible.

## Pruebas

TestBed proporciona soporte integrado para habilitar o deshabilitar animaciones en tu entorno de prueba. Las animaciones CSS requieren un navegador para ejecutarse, y muchas de las APIs no están disponibles en un entorno de prueba. Por defecto, TestBed deshabilita las animaciones para ti en tus entornos de prueba.

Si quieres probar que las animaciones están animando en una prueba de navegador, por ejemplo una prueba end-to-end, puedes configurar TestBed para habilitar animaciones especificando `animationsEnabled: true` en tu configuración de prueba.

```typescript
  TestBed.configureTestingModule({animationsEnabled: true});
```

Esto configurará las animaciones en tu entorno de prueba para que se comporten normalmente.

NOTA: Algunos entornos de prueba no emiten eventos de animación como `animationstart`, `animationend` y sus equivalentes de eventos de transición.

## Más sobre animaciones de Angular

También puede que te interese lo siguiente:

<docs-pill-row>
  <docs-pill href="guide/animations/css" title="Complex Animations with CSS"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
