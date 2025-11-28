# Ciclo de vida y eventos del Router

Angular Router proporciona un conjunto completo de hooks de ciclo de vida y eventos que te permiten responder a cambios de navegación y ejecutar lógica personalizada durante el proceso de enrutamiento.

## Eventos comunes del router

Angular Router emite eventos de navegación a los que puedes suscribirte para rastrear el ciclo de vida de la navegación. Estos eventos están disponibles a través del observable `Router.events`. Esta sección cubre eventos comunes del ciclo de vida de enrutamiento para navegación y seguimiento de errores (en orden cronológico).

| Eventos                                             | Descripción                                                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)     | Ocurre cuando comienza la navegación y contiene la URL solicitada.                                            |
| [`RoutesRecognized`](api/router/RoutesRecognized)   | Ocurre después de que el router determina qué ruta coincide con la URL y contiene la información del estado de la ruta. |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)   | Comienza la fase de guards de ruta. El router evalúa guards de ruta como `canActivate` y `canDeactivate`.  |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)       | Señala la finalización de la evaluación de guards. Contiene el resultado (permitido/denegado).                            |
| [`ResolveStart`](api/router/ResolveStart)           | Comienza la fase de resolución de datos. Los resolvers de ruta comienzan a obtener datos.                                   |
| [`ResolveEnd`](api/router/ResolveEnd)               | La resolución de datos se completa. Todos los datos requeridos están disponibles.                                          |
| [`NavigationEnd`](api/router/NavigationEnd)         | Evento final cuando la navegación se completa exitosamente. El router actualiza la URL.                          |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Ocurre cuando el router omite la navegación (por ejemplo, navegación a la misma URL).                                     |

Los siguientes son eventos de error comunes:

| Evento                                            | Descripción                                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`NavigationCancel`](api/router/NavigationCancel) | Ocurre cuando el router cancela la navegación. A menudo debido a que un guard retorna false. |
| [`NavigationError`](api/router/NavigationError)   | Ocurre cuando la navegación falla. Podría ser debido a rutas inválidas o errores de resolver. |

Para una lista de todos los eventos de ciclo de vida, consulta la [tabla completa de esta guía](#todos-los-eventos-del-router).

## Cómo suscribirse a eventos del router

Cuando quieres ejecutar código durante eventos específicos del ciclo de vida de navegación, puedes hacerlo suscribiéndote a `router.events` y verificando la instancia del evento:

```ts
// Ejemplo de suscripción a eventos del router
import { Component, inject, signal, effect } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({ ... })
export class RouterEventsComponent {
  private readonly router = inject(Router);
  
  constructor() {
    // Suscribirse a eventos del router y reaccionar a eventos
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navegación iniciando
        console.log('Navigation starting:', event.url);
      }
      if (event instanceof NavigationEnd) {
        // Navegación completada
        console.log('Navigation completed:', event.url);
      }
    });
  }
}
```

Nota: El tipo [`Event`](api/router/Event) de `@angular/router` tiene el mismo nombre que el tipo global regular [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event), pero es diferente del tipo [`RouterEvent`](api/router/RouterEvent).

## Cómo depurar eventos de enrutamiento

Depurar problemas de navegación del router puede ser desafiante sin visibilidad en la secuencia de eventos. Angular proporciona una característica de depuración integrada que registra todos los eventos del router en la consola, ayudándote a entender el flujo de navegación e identificar dónde ocurren los problemas.

Cuando necesitas inspeccionar una secuencia de eventos del Router, puedes habilitar el registro para eventos de navegación internos para depuración. Puedes configurar esto pasando una opción de configuración (`withDebugTracing()`) que habilita el registro detallado en consola de todos los eventos de enrutamiento.

```ts
import { provideRouter, withDebugTracing } from '@angular/router';

const appRoutes: Routes = [];
bootstrapApplication(AppComponent,
  {
    providers: [
      provideRouter(appRoutes, withDebugTracing())
    ]
  }
);
```

Para más información, consulta la documentación oficial sobre [`withDebugTracing`](api/router/withDebugTracing).

## Casos de uso comunes

Los eventos del router habilitan muchas características prácticas en aplicaciones del mundo real. Aquí hay algunos patrones comunes que se usan con eventos del router.

### Indicadores de carga

Mostrar indicadores de carga durante la navegación:

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loading',
  template: `
    @if (loading()) {
      <div class="loading-spinner">Loading...</div>
    }
  `
})
export class AppComponent {
  private router = inject(Router);
  
  readonly loading = toSignal(
    this.router.events.pipe(
      map(() => !!this.router.getCurrentNavigation())
    ),
    { initialValue: false }
  );
}
```

### Seguimiento de analíticas

Rastrear vistas de página para analíticas:

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { inject, Injectable, DestroyRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        // Rastrear vistas de página cuando cambia la URL
        if (event instanceof NavigationEnd) {
           // Enviar vista de página a analíticas
          this.analytics.trackPageView(event.url);
        }
      });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Page view tracked:', url);
    }
  };
}
```

### Manejo de errores

Manejar errores de navegación con gracia y proporcionar retroalimentación al usuario:

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationError, NavigationCancel, NavigationCancellationCode } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Dismiss</button>
      </div>
    }
  `
})
export class ErrorHandlerComponent {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.errorMessage.set('Failed to load page. Please try again.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled:', event.reason);
        if (event.code === NavigationCancellationCode.GuardRejected) {
          this.errorMessage.set('Access denied. Please check your permissions.');
        }
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
```

## Todos los eventos del router

Para referencia, aquí está la lista completa de todos los eventos del router disponibles en Angular. Estos eventos están organizados por categoría y listados en el orden en que típicamente ocurren durante la navegación.

### Eventos de navegación

Estos eventos rastrean el proceso central de navegación desde el inicio a través del reconocimiento de rutas, verificación de guards y resolución de datos. Proporcionan visibilidad en cada fase del ciclo de vida de navegación.

| Evento                                                    | Descripción                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | Ocurre cuando comienza la navegación                                   |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | Ocurre antes de cargar de forma diferida una configuración de ruta                |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | Ocurre después de que se carga una configuración de ruta con lazy loading            |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Ocurre cuando el router parsea la URL y reconoce las rutas |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Ocurre al inicio de la fase de guards                          |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Ocurre al final de la fase de guards                            |
| [`ResolveStart`](api/router/ResolveStart)                 | Ocurre al inicio de la fase de resolve                        |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Ocurre al final de la fase de resolve                          |

### Eventos de activación

Estos eventos ocurren durante la fase de activación cuando los componentes de ruta están siendo instanciados e inicializados. Los eventos de activación se disparan para cada ruta en el árbol de rutas, incluyendo rutas padre e hijo.

| Evento                                                    | Descripción                                   |
| --------------------------------------------------------- | --------------------------------------------- |
| [`ActivationStart`](api/router/ActivationStart)           | Ocurre al inicio de la activación de ruta       |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Ocurre al inicio de la activación de ruta hijo |
| [`ActivationEnd`](api/router/ActivationEnd)               | Ocurre al final de la activación de ruta         |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Ocurre al final de la activación de ruta hijo   |

### Eventos de finalización de navegación

Estos eventos representan el resultado final de un intento de navegación. Cada navegación terminará con exactamente uno de estos eventos, indicando si tuvo éxito, fue cancelada, falló o fue omitida.

| Evento                                              | Descripción                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| [`NavigationEnd`](api/router/NavigationEnd)         | Ocurre cuando la navegación termina exitosamente                            |
| [`NavigationCancel`](api/router/NavigationCancel)   | Ocurre cuando el router cancela la navegación                           |
| [`NavigationError`](api/router/NavigationError)     | Ocurre cuando la navegación falla debido a un error inesperado             |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Ocurre cuando el router omite la navegación (por ejemplo, navegación a la misma URL) |

### Otros eventos

Hay un evento adicional que ocurre fuera del ciclo de vida principal de navegación, pero aún es parte del sistema de eventos del router.

| Evento                        | Descripción             |
| ----------------------------- | ----------------------- |
| [`Scroll`](api/router/Scroll) | Ocurre durante el scrolling |

## Próximos pasos

Aprende más sobre [guards de ruta](/guide/routing/route-guards) y [tareas comunes del router](/guide/routing/common-router-tasks).
