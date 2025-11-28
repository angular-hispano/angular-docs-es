# Controlar el acceso a rutas con guards

CRÍTICO: Nunca confíes en guards del lado del cliente como única fuente de control de acceso. Todo JavaScript que se ejecuta en un navegador web puede ser modificado por el usuario que ejecuta el navegador. Siempre aplica la autorización de usuario del lado del servidor, además de cualquier guard del lado del cliente.

Los guards de ruta son funciones que controlan si un usuario puede navegar hacia o desde una ruta en particular. Son como puntos de control que gestionan si un usuario puede acceder a rutas específicas. Ejemplos comunes de uso de guards de ruta incluyen autenticación y control de acceso.

## Crear un guard de ruta

Puedes generar un guard de ruta usando Angular CLI:

```bash
ng generate guard CUSTOM_NAME
```

Esto te solicitará que selecciones qué [tipo de guard de ruta](#tipos-de-guards-de-ruta) usar y luego creará el archivo `CUSTOM_NAME-guard.ts` correspondiente.

CONSEJO: También puedes crear un guard de ruta manualmente creando un archivo TypeScript separado en tu proyecto Angular. Los desarrolladores típicamente agregan un sufijo de `-guard.ts` en el nombre del archivo para distinguirlo de otros archivos.

## Tipos de retorno de guards de ruta

Todos los guards de ruta comparten los mismos tipos de retorno posibles. Esto te da flexibilidad en cómo controlas la navegación:

| Tipos de retorno                | Descripción                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `boolean`                       | `true` permite la navegación, `false` la bloquea (ver nota para el guard de ruta `CanMatch`)    |
| `UrlTree` o `RedirectCommand`   | Redirige a otra ruta en lugar de bloquear                                                        |
| `Promise<T>` o `Observable<T>`  | El router usa el primer valor emitido y luego se desuscribe                                      |

Nota: `CanMatch` se comporta de manera diferente— cuando retorna `false`, Angular intenta otras rutas coincidentes en lugar de bloquear completamente la navegación.

## Tipos de guards de ruta

Angular proporciona cuatro tipos de guards de ruta, cada uno sirviendo diferentes propósitos:

<docs-pill-row>
  <docs-pill href="#canactivate" title="CanActivate"/>
  <docs-pill href="#canactivatechild" title="CanActivateChild"/>
  <docs-pill href="#candeactivate" title="CanDeactivate"/>
  <docs-pill href="#canmatch" title="CanMatch"/>
</docs-pill-row>

### CanActivate

El guard `CanActivate` determina si un usuario puede acceder a una ruta. Se usa más comúnmente para autenticación y autorización.

Tiene acceso a los siguientes argumentos predeterminados:

- `route: ActivatedRouteSnapshot` - Contiene información sobre la ruta que está siendo activada
- `state: RouterStateSnapshot` - Contiene el estado actual del router

Puede retornar los [tipos de retorno estándar de guards](#tipos-de-retorno-de-guards-de-ruta).

```ts
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

Consejo: Si necesitas redirigir al usuario, retorna un [`URLTree`](api/router/UrlTree) o [`RedirectCommand`](api/router/RedirectCommand). **No** retornes `false` y luego navegues al usuario programáticamente.

Para más información, consulta la [documentación de la API para CanActivateFn](api/router/CanActivateFn).

### CanActivateChild

El guard `CanActivateChild` determina si un usuario puede acceder a rutas hijas de una ruta padre en particular. Esto es útil cuando quieres proteger una sección completa de rutas anidadas. En otras palabras, `canActivateChild` se ejecuta para _todos_ los hijos. Si hay un componente hijo con otro componente hijo debajo de él, `canActivateChild` se ejecutará una vez para ambos componentes.

Tiene acceso a los siguientes argumentos predeterminados:

- `childRoute: ActivatedRouteSnapshot` - Contiene información sobre la snapshot "futura" (es decir, el estado al que el router está intentando navegar) de la ruta hija que está siendo activada
- `state: RouterStateSnapshot` - Contiene el estado actual del router

Puede retornar los [tipos de retorno estándar de guards](#tipos-de-retorno-de-guards-de-ruta).

```ts
export const adminChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

Para más información, consulta la [documentación de la API para CanActivateChildFn](api/router/CanActivateChildFn).

### CanDeactivate

El guard `CanDeactivate` determina si un usuario puede salir de una ruta. Un escenario común es prevenir la navegación desde formularios no guardados.

Tiene acceso a los siguientes argumentos predeterminados:

- `component: T` - La instancia del componente que está siendo desactivada
- `currentRoute: ActivatedRouteSnapshot` - Contiene información sobre la ruta actual
- `currentState: RouterStateSnapshot` - Contiene el estado actual del router
- `nextState: RouterStateSnapshot` - Contiene el siguiente estado del router al que se está navegando

Puede retornar los [tipos de retorno estándar de guards](#tipos-de-retorno-de-guards-de-ruta).

```ts
export const unsavedChangesGuard: CanDeactivateFn<FormComponent> = (component: FormComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
  return component.hasUnsavedChanges()
    ? confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')
    : true;
};
```

Para más información, consulta la [documentación de la API para CanDeactivateFn](api/router/CanDeactivateFn).

### CanMatch

El guard `CanMatch` determina si una ruta puede ser coincidente durante la coincidencia de rutas. A diferencia de otros guards, el rechazo recurre a intentar otras rutas coincidentes en lugar de bloquear la navegación por completo. Esto puede ser útil para feature flags, pruebas A/B o carga condicional de rutas.

Tiene acceso a los siguientes argumentos predeterminados:

- `route: Route` - La configuración de ruta que está siendo evaluada
- `segments: UrlSegment[]` - Los segmentos URL que no han sido consumidos por evaluaciones de rutas padre previas

Puede retornar los [tipos de retorno estándar de guards](#tipos-de-retorno-de-guards-de-ruta), pero cuando retorna `false`, Angular intenta otras rutas coincidentes en lugar de bloquear completamente la navegación.

```ts
export const featureToggleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};
```

También puede permitirte usar diferentes componentes para la misma ruta.

```ts
// 📄 routes.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard]
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard]
  }
]
```

En este ejemplo, cuando el usuario visita `/dashboard`, se usará el primero que coincida con el guard correcto.

Para más información, consulta la [documentación de la API para CanMatchFn](api/router/CanMatchFn).

## Aplicar guards a rutas

Una vez que hayas creado tus guards de ruta, necesitas configurarlos en tus definiciones de rutas.

Los guards se especifican como arrays en la configuración de ruta para permitirte aplicar múltiples guards a una sola ruta. Se ejecutan en el orden en que aparecen en el array.

```ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { featureToggleGuard } from './guards/feature-toggle.guard';

const routes: Routes = [
  // CanActivate básico - requiere autenticación
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Múltiples guards CanActivate - requiere autenticación Y rol de admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard]
  },

  // CanActivate + CanDeactivate - ruta protegida con verificación de cambios sin guardar
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard]
  },

  // CanActivateChild - protege todas las rutas hijas
  {
    path: 'users', // /user - NO protegido
    canActivateChild: [authGuard],
    children: [
      // /users/list - PROTEGIDO
      { path: 'list', component: UserListComponent },
      // /users/detail/:id - PROTEGIDO
      { path: 'detail/:id', component: UserDetailComponent }
    ]
  },

  // CanMatch - coincide condicionalmente con la ruta según feature flag
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canMatch: [featureToggleGuard]
  },

  // Ruta alternativa si la característica beta está deshabilitada
  {
    path: 'beta-feature',
    component: ComingSoonComponent
  }
];
```
