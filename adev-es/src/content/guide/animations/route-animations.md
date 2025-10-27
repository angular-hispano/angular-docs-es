# Animaciones de transición de ruta

Cuando un usuario navega de una ruta a otra, el Router de Angular mapea la ruta URL al componente relevante y muestra su vista. Animar esta transición de ruta puede mejorar enormemente la experiencia del usuario. El Router tiene soporte para la API de View Transitions al navegar entre rutas en navegadores Chrome/Chromium.

ÚTIL: La integración nativa de View Transitions del Router está actualmente en [vista previa para desarrolladores](/reference/releases#developer-preview). Las View Transitions nativas también son una característica relativamente nueva, por lo que puede haber soporte limitado en algunos navegadores.

## Cómo funcionan las View Transitions

El método nativo del navegador que se usa para transiciones de vista es `document.startViewTransition`. Cuando se llama a `startViewTransition()`, el navegador captura el estado actual de la página, que incluye tomar una captura de pantalla. El método toma un callback que actualiza el DOM y esta función puede ser asíncrona. El nuevo estado se captura y la transición comienza en el siguiente frame de animación cuando la promesa devuelta por el callback se resuelve.

Aquí hay un ejemplo de la API startViewTransition:

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

Si tienes curiosidad por leer más sobre los detalles de la API del navegador, el [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions) es un recurso invaluable.

## Cómo el Router usa transiciones de vista

Varias cosas suceden después de que comienza la navegación en el router: coincidencia de rutas, carga de rutas y componentes lazy, ejecución de guards y resolvers, por nombrar algunos. Una vez que estos se han completado exitosamente, las nuevas rutas están listas para ser activadas. Esta activación de ruta es la actualización del DOM que queremos realizar como parte de la transición de vista.

Cuando la característica de transición de vista está habilitada, la navegación se "pausa" y se hace una llamada al método `startViewTransition` del navegador. Una vez que se ejecuta el callback `startViewTransition` (esto sucede de forma asíncrona, como se describe en la especificación aquí), la navegación se "reanuda". Los pasos restantes para la navegación del router incluyen actualizar la URL del navegador y activar o desactivar las rutas coincidentes (la actualización del DOM).

Finalmente, el callback pasado a `startViewTransition` devuelve una Promise que se resuelve una vez que Angular ha terminado de renderizar. Como se describió anteriormente, esto indica al navegador que el nuevo estado del DOM debe ser capturado y la transición debe comenzar.

Las transiciones de vista son una [mejora progresiva](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Si el navegador no soporta la API, el Router realizará las actualizaciones del DOM sin llamar a `startViewTransition` y la navegación no será animada.

## Habilitando View Transitions en el Router

Para habilitar esta característica, simplemente agrega `withViewTransitions` al `provideRouter` o establece `enableViewTransitions: true` en `RouterModule.forRoot`:

```ts
// Standalone bootstrap
bootstrapApplication(MyApp, {providers: [
  provideRouter(ROUTES, withViewTransitions()),
]});

// NgModule bootstrap
@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})]
})
export class AppRouting {}
```

[Prueba el ejemplo "count" en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

Este ejemplo usa la aplicación de contador del Chrome explainer y reemplaza la llamada directa a startViewTransition cuando el contador se incrementa con una navegación del router.

## Usando CSS para personalizar transiciones

Las transiciones de vista se pueden personalizar con CSS. También podemos instruir al navegador para crear elementos separados para la transición estableciendo un view-transition-name. Podemos expandir el primer ejemplo agregando view-transition-name: count al estilo .count en el componente Counter. Luego, en los estilos globales, podemos definir una animación personalizada para esta transición de vista:

```css
/* Custom transition */
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
::view-transition-old(count),
::view-transition-new(count) {
 animation-duration: 200ms;
 animation-name: -ua-view-transition-fade-in, rotate-in;
}
::view-transition-old(count) {
 animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

Es importante que las animaciones de transición de vista se definan en un archivo de estilo global. No pueden definirse en los estilos del componente porque la encapsulación de vista predeterminada delimitará los estilos al componente.

[Prueba el ejemplo "count" actualizado en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## Controlando transiciones con onViewTransitionCreated

La característica del router `withViewTransitions` también se puede llamar con un objeto de opciones que incluye un callback `onViewTransitionCreated`. Este callback se ejecuta en un [contexto de inyección](/guide/di/dependency-injection-context#run-within-an-injection-context) y recibe un objeto [ViewTransitionInfo](/api/router/ViewTransitionInfo) que incluye la `ViewTransition` devuelta por `startViewTransition`, así como el `ActivatedRouteSnapshot` desde el que la navegación está haciendo transición y el nuevo al que está haciendo transición.

Este callback se puede usar para cualquier número de personalizaciones. Por ejemplo, es posible que desees omitir transiciones bajo ciertas condiciones. Usamos esto en el nuevo sitio de documentación angular.dev:

```ts
withViewTransitions({
 onViewTransitionCreated: ({transition}) => {
   const router = inject(Router);
   const targetUrl = router.getCurrentNavigation()!.finalUrl!;
   // Skip the transition if the only thing
   // changing is the fragment and queryParams
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
}),
```

En este fragmento de código, creamos un `UrlTree` desde el `ActivatedRouteSnapshot` al que va la navegación. Luego verificamos con el Router para ver si este `UrlTree` ya está activo, ignorando cualquier diferencia en el fragmento o parámetros de consulta. Si ya está activo, llamamos a skipTransition que omitirá la porción de animación de la transición de vista. Este es el caso al hacer clic en un enlace de anclaje que solo se desplazará a otra ubicación en el mismo documento.

## Ejemplos del Chrome explainer adaptados a Angular

Hemos recreado algunos de los excelentes ejemplos del Chrome Team en Angular para que explores.

### Los elementos de transición no necesitan ser el mismo elemento DOM

* [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
* [Ejemplo de Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### Animaciones personalizadas de entrada y salida

* [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
* [Ejemplo de Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### Actualizaciones asíncronas del DOM y espera de contenido

* [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

> Durante este tiempo, la página está congelada, por lo que los retrasos aquí deben mantenerse al mínimo... en algunos casos es mejor evitar el retraso por completo y usar el contenido que ya tienes.

La característica de transición de vista en el Router de Angular no proporciona una forma de retrasar la animación. Por el momento, nuestra postura es que siempre es mejor usar el contenido que tienes en lugar de hacer que la página no sea interactiva por cualquier cantidad de tiempo adicional.

### Manejar múltiples estilos de transición de vista con tipos de transición de vista

* [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
* [Ejemplo de Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### Manejar múltiples estilos de transición de vista con un nombre de clase en la raíz de transición de vista (deprecado)

* [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
* [Ejemplo de Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### Transición sin congelar otras animaciones

* [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
* [Ejemplo de Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### Animando con Javascript

* [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
* [Ejemplo de Angular en StackBlitz](https://stackblitz.com/edit/stackblitz-starters-cklnkm)

## Alternativa de View Transitions nativas

Animar la transición entre rutas también se puede hacer con el paquete `@angular/animations`.
Los [triggers y transiciones](/guide/animations/transition-and-triggers) de animación
se pueden derivar del estado del router, como la URL actual o `ActivatedRoute`.
