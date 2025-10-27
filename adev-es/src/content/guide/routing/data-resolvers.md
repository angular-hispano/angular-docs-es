# Data resolvers

Los data resolvers te permiten obtener datos antes de navegar a una ruta, asegurando que tus componentes reciban los datos que necesitan antes de renderizar. Esto puede ayudar a prevenir la necesidad de estados de carga y mejorar la experiencia del usuario al precargar datos esenciales.

## ¿Qué son los data resolvers?

Un data resolver es un servicio que implementa la función [`ResolveFn`](api/router/ResolveFn). Se ejecuta antes de que una ruta se active y puede obtener datos de APIs, bases de datos u otras fuentes. Los datos resueltos se vuelven disponibles para el componente a través del [`ActivatedRoute`](api/router/ActivatedRoute).

## ¿Por qué usar data resolvers?

Los data resolvers resuelven desafíos comunes de enrutamiento:

- **Prevenir estados vacíos**: Los componentes reciben datos inmediatamente al cargar
- **Mejor experiencia de usuario**: Sin spinners de carga para datos críticos
- **Manejo de errores**: Manejar errores de obtención de datos antes de la navegación
- **Consistencia de datos**: Asegurar que los datos requeridos estén disponibles antes de renderizar, lo cual es importante para SSR

## Creando un resolver

Creas un resolver escribiendo una función con el tipo [`ResolveFn`](api/router/ResolveFn).

Recibe el [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot) y el [`RouterStateSnapshot`](api/router/RouterStateSnapshot) como parámetros.

Aquí hay un resolver que obtiene la información del usuario antes de renderizar una ruta usando la función [`inject`](api/core/inject):

```ts
import { inject } from '@angular/core';
import { UserStore, SettingsStore } from './user-store';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import type { User, Settings } from './types';

export const userResolver: ResolveFn<User> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};

export const settingsResolver: ResolveFn<Settings> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};
```

## Configurando rutas con resolvers

Cuando quieres agregar uno o más data resolvers a una ruta, puedes agregarlo bajo la clave `resolve` en la configuración de ruta. El tipo [`Routes`](api/router/Routes) define la estructura para las configuraciones de ruta:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver
    }
  }
];
```

Puedes aprender más sobre la [configuración de `resolve` en los docs de la API](api/router/Route#resolve).

## Accediendo a datos resueltos en componentes

### Usando ActivatedRoute

Puedes acceder a los datos resueltos en un componente accediendo a los datos del snapshot desde el [`ActivatedRoute`](api/router/ActivatedRoute) usando la función [`signal`](api/core/signal):

```angular-ts
import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}
```

### Usando withComponentInputBinding

Un enfoque diferente para acceder a los datos resueltos es usar [`withComponentInputBinding()`](api/router/withComponentInputBinding) al configurar tu router con [`provideRouter`](api/router/provideRouter). Esto permite que los datos resueltos se pasen directamente como inputs de componente:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
});
```

Con esta configuración, puedes definir inputs en tu componente que coincidan con las claves del resolver usando la función [`input`](api/core/input) e [`input.required`](api/core/input#required) para inputs requeridos:

```angular-ts
import { Component, input } from '@angular/core';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}
```

Este enfoque proporciona mejor seguridad de tipos y elimina la necesidad de inyectar `ActivatedRoute` solo para acceder a los datos resueltos.

## Manejo de errores en resolvers

En caso de fallos de navegación, es importante manejar errores de forma elegante en tus data resolvers. De lo contrario, ocurrirá un `NavigationError` y la navegación a la ruta actual fallará, lo que conducirá a una mala experiencia para tus usuarios.

Hay tres formas principales de manejar errores con data resolvers:

1. [Centralizar el manejo de errores en `withNavigationErrorHandler`](#centralize-error-handling-in-withnavigationerrorhandler)
2. [Gestionar errores a través de una suscripción a eventos del router](#managing-errors-through-a-subscription-to-router-events)
3. [Manejar errores directamente en el resolver](#handling-errors-directly-in-the-resolver)

### Centralizar el manejo de errores en `withNavigationErrorHandler`

La característica [`withNavigationErrorHandler`](api/router/withNavigationErrorHandler) proporciona una forma centralizada de manejar todos los errores de navegación, incluyendo los de data resolvers fallidos. Este enfoque mantiene la lógica de manejo de errores en un solo lugar y previene código duplicado de manejo de errores en los resolvers.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withNavigationErrorHandler((error) => {
      const router = inject(Router);

      if (error?.message) {
        console.error('Navigation error occurred:', error.message)
      }

      router.navigate(['/error']);
    }))
  ]
});
```

Con esta configuración, tus resolvers pueden enfocarse en la obtención de datos mientras dejan que el manejador centralizado gestione escenarios de error:

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  // No es necesario manejo explícito de errores - dejar que burbujee
  return userStore.getUser(userId);
};
```

### Gestionar errores a través de una suscripción a eventos del router

También puedes manejar errores de resolver suscribiéndote a eventos del router y escuchando eventos [`NavigationError`](api/router/NavigationError). Este enfoque te da un control más granular sobre el manejo de errores y te permite implementar lógica personalizada de recuperación de errores.

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Retry</button>
      </div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationError => event instanceof NavigationError),
      map(event => {
        this.lastFailedUrl.set(event.url);

        if (event.error) {
          console.error('Navigation error', event.error)
        }

        return 'Navigation failed. Please try again.';
      })
    ),
    { initialValue: '' }
  );

  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
```

Este enfoque es particularmente útil cuando necesitas:

- Implementar lógica de reintento personalizada para navegación fallida
- Mostrar mensajes de error específicos basados en el tipo de fallo
- Rastrear fallos de navegación para propósitos de analytics

### Manejar errores directamente en el resolver

Aquí hay un ejemplo actualizado del `userResolver` que registra el error y navega de vuelta a la página genérica `/users` usando el servicio [`Router`](api/router/Router):

```ts
import { inject } from '@angular/core';
import { ResolveFn, RedirectCommand, Router } from '@angular/router';
import { catchError, of, EMPTY } from 'rxjs';
import { UserStore } from './user-store';
import type { User } from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;

  return userStore.getUser(userId).pipe(
    catchError(error => {
      console.error('Failed to load user:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    })
  );
};
```

## Consideraciones de carga de navegación

Aunque los data resolvers previenen estados de carga dentro de los componentes, introducen una consideración UX diferente: la navegación se bloquea mientras los resolvers se ejecutan. Los usuarios pueden experimentar retrasos entre hacer clic en un enlace y ver la nueva ruta, especialmente con peticiones de red lentas.

### Proporcionando retroalimentación de navegación

Para mejorar la experiencia del usuario durante la ejecución de resolvers, puedes escuchar eventos del router y mostrar indicadores de carga:

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

Este enfoque asegura que los usuarios reciban retroalimentación visual de que la navegación está en progreso mientras los resolvers obtienen datos.

## Mejores prácticas

- **Mantén los resolvers ligeros**: Los resolvers deben obtener solo datos esenciales y no todo lo que la página podría necesitar posiblemente
- **Maneja errores**: Siempre recuerda manejar errores de forma elegante para proporcionar la mejor experiencia posible a los usuarios
- **Usa caché**: Considera cachear datos resueltos para mejorar el rendimiento
- **Considera la UX de navegación**: Implementa indicadores de carga para la ejecución de resolvers ya que la navegación se bloquea durante la obtención de datos
- **Establece timeouts razonables**: Evita resolvers que puedan colgarse indefinidamente y bloquear la navegación
- **Seguridad de tipos**: Usa interfaces de TypeScript para datos resueltos
