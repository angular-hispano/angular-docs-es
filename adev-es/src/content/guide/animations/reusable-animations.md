# Animaciones reutilizables

IMPORTANTE: El paquete `@angular/animations` ahora está deprecado. El equipo de Angular recomienda usar CSS nativo con `animate.enter` y `animate.leave` para animaciones en todo código nuevo. Aprende más en la nueva [guía de animaciones](guide/animations/enter-and-leave) de entrada y salida. También consulta [Migrando del paquete de Animations de Angular](guide/animations/migration) para aprender cómo puedes comenzar a migrar a animaciones CSS puras en tus aplicaciones.

Este tema proporciona algunos ejemplos de cómo crear animaciones reutilizables.

## Crear animaciones reutilizables

Para crear una animación reutilizable, usa la función [`animation()`](api/animations/animation) para definir una animación en un archivo `.ts` separado y declara esta definición de animación como una variable de exportación `const`.
Luego puedes importar y reutilizar esta animación en cualquiera de los componentes de tu aplicación usando la función [`useAnimation()`](api/animations/useAnimation).

<docs-code header="src/app/animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="animation-const"/>

En el fragmento de código anterior, `transitionAnimation` se hace reutilizable declarándola como una variable de exportación.

ÚTIL: Las entradas `height`, `opacity`, `backgroundColor` y `time` se reemplazan durante el tiempo de ejecución.

También puedes exportar una parte de una animación.
Por ejemplo, el siguiente fragmento exporta el `trigger` de animación.

<docs-code header="src/app/animations.1.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="trigger-const"/>

Desde este punto, puedes importar variables de animación reutilizables en la clase de tu componente.
Por ejemplo, el siguiente fragmento de código importa la variable `transitionAnimation` y la usa a través de la función `useAnimation()`.

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.3.ts" visibleRegion="reusable"/>

## Más sobre animaciones de Angular

También puede que te interese lo siguiente:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introduction to Angular animations"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
