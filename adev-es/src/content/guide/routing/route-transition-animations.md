# Animaciones de transición de ruta

Las animaciones de transición de ruta mejoran la experiencia del usuario proporcionando transiciones visuales suaves al navegar entre diferentes vistas en tu aplicación Angular. [Angular Router](/guide/routing/overview) incluye soporte integrado para la API View Transitions del navegador, habilitando animaciones fluidas entre cambios de ruta en navegadores compatibles.

ÚTIL: La integración nativa de View Transitions del Router está actualmente en [developer preview](/reference/releases#developer-preview). Native View Transitions son una característica relativamente nueva del navegador con soporte limitado en todos los navegadores.

## Cómo funcionan View Transitions

View transitions usan la API nativa del navegador [`document.startViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) para crear animaciones suaves entre diferentes estados de tu aplicación. La API funciona mediante:

1. **Capturar el estado actual** - El navegador toma una captura de pantalla de la página actual
2. **Ejecutar la actualización del DOM** - Tu función de callback se ejecuta para actualizar el DOM
3. **Capturar el nuevo estado** - El navegador captura el estado de la página actualizada
4. **Reproducir la transición** - El navegador anima entre los estados antiguo y nuevo

Aquí está la estructura básica de la API `startViewTransition`:

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

Para más detalles sobre la API del navegador, consulta el [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions).

## Cómo el Router usa view transitions

Angular Router integra view transitions en el ciclo de vida de navegación para crear cambios de ruta fluidos. Durante la navegación, el Router:

1. **Completa la preparación de navegación** - Se ejecutan coincidencia de ruta, [lazy loading](/guide/routing/define-routes#lazily-loaded-components), [guards](/guide/routing/route-guards) y [resolvers](/guide/routing/data-resolvers)
2. **Inicia la view transition** - El Router llama a `startViewTransition` cuando las rutas están listas para activación
3. **Actualiza el DOM** - El Router activa nuevas rutas y desactiva las antiguas dentro del callback de transición
4. **Finaliza la transición** - La Promise de transición se resuelve cuando Angular completa la renderización

La integración de view transition del Router actúa como una [mejora progresiva](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Cuando los navegadores no soportan la API View Transitions, el Router realiza actualizaciones DOM normales sin animación, asegurando que tu aplicación funcione en todos los navegadores.

## Habilitar View Transitions en el Router

Habilita view transitions agregando la característica `withViewTransitions` a tu [configuración del router](/guide/routing/define-routes#adding-the-router-to-your-application). Angular soporta tanto enfoques de bootstrap standalone como NgModule:

### Bootstrap standalone

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(MyApp, {
  providers: [
    provideRouter(routes, withViewTransitions()),
  ]
});
```

### Bootstrap NgModule

```ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})]
})
export class AppRouting {}
```

[Prueba el ejemplo "count" en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

Este ejemplo demuestra cómo la navegación del router puede reemplazar llamadas directas a `startViewTransition` para actualizaciones de contador.

## Personalizar transiciones con CSS

Puedes personalizar view transitions usando CSS para crear efectos de animación únicos. El navegador crea elementos de transición separados que puedes seleccionar con selectores CSS.

Para crear transiciones personalizadas:

1. **Agregar view-transition-name** - Asigna nombres únicos a elementos que quieras animar
2. **Definir animaciones globales** - Crea animaciones CSS en tus estilos globales
3. **Seleccionar pseudo-elementos de transición** - Usa selectores `::view-transition-old()` y `::view-transition-new()`

Aquí hay un ejemplo que agrega un efecto de rotación a un elemento contador:

```css
/* Definir animaciones keyframe */
@keyframes rotate-out {
  to {
    transform: rotate(90deg);
  }
}

@keyframes rotate-in {
  from {
    transform: rotate(-90deg);
  }
}

/* Seleccionar pseudo-elementos de view transition */
::view-transition-old(count),
::view-transition-new(count) {
  animation-duration: 200ms;
  animation-name: -ua-view-transition-fade-in, rotate-in;
}

::view-transition-old(count) {
  animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

IMPORTANTE: Define animaciones de view transition en tu archivo de estilos globales, no en estilos de componentes. La [encapsulación de vista](/guide/components/styling#view-encapsulation) de Angular limita el alcance de los estilos de componentes, lo que les impide seleccionar correctamente los pseudo-elementos de transición.

[Prueba el ejemplo actualizado "count" en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## Control avanzado de transición con onViewTransitionCreated

La característica `withViewTransitions` acepta un objeto de opciones con un callback `onViewTransitionCreated` para control avanzado sobre view transitions. Este callback:

- Se ejecuta en un [contexto de inyección](/guide/di/dependency-injection-context#run-within-an-injection-context)
- Recibe un objeto [`ViewTransitionInfo`](/api/router/ViewTransitionInfo) que contiene:
  - La instancia `ViewTransition` de `startViewTransition`
  - El [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) para la ruta desde la que se está navegando
  - El [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) para la ruta a la que se está navegando

Usa este callback para personalizar el comportamiento de transición basado en el contexto de navegación. Por ejemplo, puedes omitir transiciones para tipos específicos de navegación:

```ts
import { inject } from '@angular/core';
import { Router, withViewTransitions } from '@angular/router';

withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    const router = inject(Router);
    const targetUrl = router.getCurrentNavigation()!.finalUrl!;

    // Omitir transición si solo cambia el fragment o query params
    const config = {
      paths: 'exact',
      matrixParams: 'exact',
      fragment: 'ignored',
      queryParams: 'ignored',
    };

    if (router.isActive(targetUrl, config)) {
      transition.skipTransition();
    }
  },
})
```

Este ejemplo omite la view transition cuando la navegación solo cambia el [fragmento de URL o parámetros de consulta](/guide/routing/read-route-state#query-parameters) (como enlaces anchor dentro de la misma página). El método `skipTransition()` previene la animación mientras aún permite que la navegación se complete.

## Ejemplos del Chrome explainer adaptados a Angular

Los siguientes ejemplos demuestran varias técnicas de view transition adaptadas de la documentación del equipo de Chrome para uso con Angular Router:

### Los elementos en transición no necesitan ser el mismo elemento DOM

Los elementos pueden hacer transición suavemente entre diferentes elementos DOM siempre que compartan el mismo `view-transition-name`.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
- [Ejemplo Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### Animaciones personalizadas de entrada y salida

Crea animaciones únicas para elementos que entran y salen del viewport durante transiciones de ruta.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
- [Ejemplo Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### Actualizaciones asíncronas del DOM y espera por contenido

Angular Router prioriza transiciones inmediatas sobre esperar a que se cargue contenido adicional.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

NOTA: Angular Router no proporciona una forma de retrasar view transitions. Esta decisión de diseño previene que las páginas se vuelvan no interactivas mientras esperan contenido adicional. Como nota la documentación de Chrome: "Durante este tiempo, la página está congelada, por lo que los retrasos aquí deben mantenerse al mínimo...en algunos casos es mejor evitar el retraso por completo y usar el contenido que ya tienes."

### Manejar múltiples estilos de view transition con tipos de view transition

Usa tipos de view transition para aplicar diferentes estilos de animación basados en el contexto de navegación.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
- [Ejemplo Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### Manejar múltiples estilos de view transition con un nombre de clase en la raíz de view transition (deprecado)

Este enfoque usa clases CSS en el elemento raíz de transición para controlar estilos de animación.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
- [Ejemplo Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### Transición sin congelar otras animaciones

Mantén otras animaciones de página durante view transitions para crear experiencias de usuario más dinámicas.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
- [Ejemplo Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### Animar con JavaScript

Controla view transitions programáticamente usando APIs de JavaScript para escenarios de animación complejos.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
- [Ejemplo Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-cklnkm)
