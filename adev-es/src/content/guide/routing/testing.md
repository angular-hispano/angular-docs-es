# Probar enrutamiento y navegación

Probar enrutamiento y navegación es esencial para asegurar que tu aplicación se comporte correctamente cuando los usuarios navegan entre diferentes rutas. Esta guía cubre varias estrategias para probar funcionalidad de enrutamiento en aplicaciones Angular.

## Prerrequisitos

Esta guía asume que estás familiarizado con las siguientes herramientas y librerías:

- **[Jasmine](https://jasmine.github.io/)** - Framework de pruebas JavaScript que proporciona la sintaxis de pruebas (`describe`, `it`, `expect`)
- **[Karma](https://karma-runner.github.io/)** - Test runner que ejecuta pruebas en navegadores
- **[Angular Testing Utilities](guide/testing)** - Herramientas de prueba integradas de Angular ([`TestBed`](api/core/testing/TestBed), [`ComponentFixture`](api/core/testing/ComponentFixture))
- **[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)** - Test harness para probar componentes enrutados con capacidades integradas de navegación y prueba de componentes

## Escenarios de prueba

### Parámetros de ruta

Los componentes a menudo dependen de parámetros de ruta de la URL para obtener datos, como un ID de usuario para una página de perfil.

El siguiente ejemplo muestra cómo probar un componente `UserProfile` que muestra un ID de usuario de la ruta.

```ts
// user-profile.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  it('should display user ID from route parameters', async () => {
    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [
        provideRouter([
          { path: 'user/:id', component: UserProfile }
        ])
      ]
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user/123', UserProfile);

    expect(harness.routeNativeElement?.textContent).toContain('User Profile: 123');
  });
});
```

```angular-ts
// user-profile.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: '<h1>User Profile: {{userId}}</h1>'
})
export class UserProfile {
  private route = inject(ActivatedRoute);
  userId: string | null = this.route.snapshot.paramMap.get('id');
}
```

### Guards de ruta

Los guards de ruta controlan el acceso a rutas basándose en condiciones como autenticación o permisos. Al probar guards, concéntrate en simular dependencias y verificar resultados de navegación.

El siguiente ejemplo prueba un `authGuard` que permite navegación para usuarios autenticados y redirige usuarios no autenticados a una página de login.

```ts
// auth.guard.spec.ts
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStore } from './auth-store';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({ template: '<h1>Protected Page</h1>' })
class ProtectedComponent {}

@Component({ template: '<h1>Login Page</h1>' })
class LoginComponent {}

describe('authGuard', () => {
  let authStore: jasmine.SpyObj<AuthStore>;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authStore = jasmine.createSpyObj('AuthStore', ['isAuthenticated']);
    authStore.isAuthenticated.and.returnValue(isAuthenticated);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStore },
        provideRouter([
          { path: 'protected', component: ProtectedComponent, canActivate: [authGuard] },
          { path: 'login', component: LoginComponent },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', ProtectedComponent);
    // El componente protegido debe renderizar cuando esté autenticado
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', LoginComponent);
    // El componente de login debe renderizar después de la redirección
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});
```

```ts
// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth-store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### Router outlets

Las pruebas de router outlet son más de integración ya que esencialmente estás probando la integración entre el [`Router`](api/router/Router), el outlet y los componentes que se muestran.

Aquí hay un ejemplo de cómo configurar una prueba que verifica que diferentes componentes se muestran para diferentes rutas:

```ts
// app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { App } from './app';

@Component({
  template: '<h1>Home Page</h1>'
})
class MockHome {}

@Component({
  template: '<h1>About Page</h1>'
})
class MockAbout {}

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: '', component: MockHome },
          { path: 'about', component: MockAbout }
        ])
      ]
    });

    harness = await RouterTestingHarness.create();
  });

  it('should display home component for default route', async () => {
    await harness.navigateByUrl('');

    expect(harness.routeNativeElement?.textContent).toContain('Home Page');
  });

  it('should display about component for about route', async () => {
    await harness.navigateByUrl('/about');

    expect(harness.routeNativeElement?.textContent).toContain('About Page');
  });
});
```

```angular-ts
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet />
  `
})
export class App {}
```

### Rutas anidadas

Probar rutas anidadas asegura que tanto los componentes padre como hijo se renderizan correctamente al navegar a URLs anidadas. Esto es importante porque las rutas anidadas involucran múltiples capas.

Necesitas verificar que:

1. El componente padre se renderiza apropiadamente.
2. El componente hijo se renderiza dentro de él.
3. Asegurarse de que ambos componentes puedan acceder a sus respectivos datos de ruta.

Aquí hay un ejemplo de prueba de una estructura de ruta padre-hijo:

```ts
// nested-routes.spec.ts
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { Parent, Child } from './nested-components';

describe('Nested Routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Parent, Child],
      providers: [
        provideRouter([
          {
            path: 'parent',
            component: Parent,
            children: [
              { path: 'child', component: Child }
            ]
          }
        ])
      ]
    });

    harness = await RouterTestingHarness.create();
  });

  it('should render parent and child components for nested route', async () => {
    await harness.navigateByUrl('/parent/child');

    expect(harness.routeNativeElement?.textContent).toContain('Parent Component');
    expect(harness.routeNativeElement?.textContent).toContain('Child Component');
  });
});
```

```angular-ts
// nested-components.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Parent Component</h1>
    <router-outlet />
  `
})
export class Parent {}

@Component({
  template: '<h2>Child Component</h2>'
})
export class Child {}
```

### Parámetros de consulta y fragmentos

Los parámetros de consulta (como `?search=angular&category=web`) y fragmentos de URL (como `#section1`) proporcionan datos adicionales a través de la URL que no afecta qué componente se carga, pero sí afecta cómo se comporta el componente. Los componentes que leen parámetros de consulta a través de [`ActivatedRoute.queryParams`](api/router/ActivatedRoute#queryParams) necesitan ser probados para asegurar que manejan diferentes escenarios de parámetros correctamente.

A diferencia de los parámetros de ruta que son parte de la definición de ruta, los parámetros de consulta son opcionales y pueden cambiar sin activar navegación de ruta. Esto significa que necesitas probar tanto la carga inicial como las actualizaciones reactivas cuando cambian los parámetros de consulta.

Aquí hay un ejemplo de cómo probar parámetros de consulta y fragmentos:

```ts
// search.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Search } from './search';

describe('Search', () => {
  let component: Search;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        provideRouter([
          { path: 'search', component: Search }
        ])
      ]
    });

    harness = await RouterTestingHarness.create();
  });

  it('should read search term from query parameters', async () => {
    component = await harness.navigateByUrl('/search?q=angular', Search);

    expect(component.searchTerm()).toBe('angular');
  });
});
```

```angular-ts
// search.component.ts
import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: '<div>Search term: {{searchTerm()}}</div>'
})
export class Search {
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });

  searchTerm = computed(() => this.queryParams()['q'] || null);
}
```

## Mejores prácticas para pruebas del router

1. **Usa RouterTestingHarness** - Para probar componentes enrutados, usa [`RouterTestingHarness`](api/router/testing/RouterTestingHarness) que proporciona una API más limpia y elimina la necesidad de componentes host de prueba. Ofrece acceso directo a componentes, navegación integrada y mejor seguridad de tipos. Sin embargo, no es tan adecuado para algunos escenarios, como probar outlets nombrados, donde podrías necesitar crear componentes host personalizados.
2. **Maneja dependencias externas con cuidado** - Prefiere implementaciones reales cuando sea posible para pruebas más realistas. Si las implementaciones reales no son factibles (por ejemplo, APIs externas), usa fakes que aproximen el comportamiento real. Usa mocks o stubs solo como último recurso, ya que pueden hacer que las pruebas sean frágiles y menos confiables.
3. **Prueba el estado de navegación** - Verifica tanto la acción de navegación como el estado resultante de la aplicación, incluyendo cambios de URL y renderización de componentes.
4. **Maneja operaciones asíncronas** - La navegación del router es asíncrona. Usa `async/await` o [`fakeAsync`](api/core/testing/fakeAsync) para manejar apropiadamente el tiempo en tus pruebas.
5. **Prueba escenarios de error** - Incluye pruebas para rutas inválidas, navegación fallida y rechazos de guard para asegurar que tu aplicación maneja casos extremos con gracia.
6. **No simules Angular Router** - En su lugar, proporciona configuraciones de ruta reales y usa el harness para navegar. Esto hace que tus pruebas sean más robustas y menos propensas a romperse en actualizaciones internas de Angular, mientras también asegura que captures problemas reales cuando el router se actualiza ya que los mocks pueden ocultar cambios disruptivos.
