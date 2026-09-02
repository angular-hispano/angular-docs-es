# Estrategias de carga de rutas

Entender cómo y cuándo se cargan las rutas y los componentes en el routing en Angular es crucial para construir aplicaciones web con buena capacidad de respuesta. Angular ofrece dos estrategias principales para controlar el comportamiento de carga:

1. **Carga anticipada (eager)**: Rutas y componentes que se cargan de inmediato
2. **Carga diferida (lazy)**: Rutas y componentes que se cargan solo cuando se necesitan

Cada enfoque ofrece ventajas distintas según el escenario.

## Componentes con carga anticipada {#eagerly-loaded-components}

Cuando defines una ruta con la propiedad [`component`](api/router/Route#component), el componente referenciado se carga de forma anticipada como parte del mismo bundle de JavaScript que la configuración de rutas.

```ts
import {Routes} from '@angular/router';
import {HomePage} from './components/home/home-page';
import {LoginPage} from './components/auth/login-page';

export const routes: Routes = [
  // HomePage y LoginPage se referencian directamente en esta configuración,
  // así que su código se incluye de forma anticipada en el mismo bundle de JavaScript que este archivo.
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
```

Cargar los componentes de ruta de forma anticipada como en este ejemplo significa que el navegador tiene que descargar y analizar todo el JavaScript de estos componentes como parte de la carga inicial de la página, pero los componentes están disponibles para Angular de inmediato.

Aunque incluir más JavaScript en la carga inicial de la página provoca tiempos de carga inicial más lentos, esto puede dar lugar a transiciones más fluidas mientras el usuario navega por la aplicación.

## Componentes y rutas con carga diferida {#lazily-loaded-components-and-routes}

Puedes usar la propiedad [`loadComponent`](api/router/Route#loadComponent) para cargar de forma diferida el JavaScript de un componente en el momento en que esa ruta se activaría. La propiedad [`loadChildren`](api/router/Route#loadChildren) carga de forma diferida las rutas hijas durante la coincidencia de rutas.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login-page'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    loadChildren: () => import('./admin/admin.routes'),
  },
];
```

Las propiedades [`loadComponent`](/api/router/Route#loadComponent) y [`loadChildren`](/api/router/Route#loadChildren) aceptan una función de carga que devuelve una Promise que se resuelve en un componente de Angular o en un conjunto de rutas, respectivamente. En la mayoría de los casos, esta función usa la [API estándar de importación dinámica de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import). Sin embargo, puedes usar cualquier función de carga asíncrona arbitraria.

Si el archivo cargado de forma diferida usa una exportación `default`, puedes devolver directamente la promesa de `import()` sin una llamada adicional a `.then` para seleccionar la clase exportada.

Cargar rutas de forma diferida puede mejorar significativamente la velocidad de carga de tu aplicación Angular al eliminar grandes porciones de JavaScript del bundle inicial. Estas porciones de tu código se compilan en "chunks" de JavaScript separados que el router solicita solo cuando el usuario visita la ruta correspondiente.

## Lazy loading en el contexto de inyección {#injection-context-lazy-loading}

El Router ejecuta [`loadComponent`](/api/router/Route#loadComponent) y [`loadChildren`](/api/router/Route#loadChildren) dentro del **contexto de inyección de la ruta actual**, lo que te permite llamar a [`inject`](/api/core/inject) dentro de estas funciones de carga para acceder a proveedores declarados en esa ruta, heredados de rutas padre mediante la inyección de dependencias jerárquica, o disponibles globalmente. Esto habilita un lazy loading consciente del contexto.

```ts
import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {FeatureFlags} from './feature-flags';

export const routes: Routes = [
  {
    path: 'dashboard',
    // Se ejecuta dentro del contexto de inyección de la ruta
    loadComponent: () => {
      const flags = inject(FeatureFlags);
      return flags.isPremium
        ? import('./dashboard/premium-dashboard')
        : import('./dashboard/basic-dashboard');
    },
  },
];
```

## ¿Debo usar una ruta eager o lazy? {#should-i-use-an-eager-or-a-lazy-route}

Hay muchos factores a considerar al decidir si una ruta debe ser eager o lazy.

En general, se recomienda la carga anticipada para la(s) página(s) de aterrizaje principal(es), mientras que las demás páginas se cargarían de forma diferida.

NOTE: Aunque las rutas lazy tienen la ventaja inicial de rendimiento de reducir la cantidad de datos que el usuario solicita al principio, añaden solicitudes de datos futuras que podrían ser indeseables. Esto es especialmente cierto cuando se trabaja con lazy loading anidado en varios niveles, lo que puede afectar significativamente al rendimiento.

## Próximos pasos {#next-steps}

Aprende cómo [mostrar el contenido de tus rutas con Outlets](/guide/routing/show-routes-with-outlets).
