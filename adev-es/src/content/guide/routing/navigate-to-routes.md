# Navegar a rutas

La directiva RouterLink es el enfoque declarativo de Angular para la navegación. Te permite usar elementos anchor estándar (`<a>`) que se integran sin problemas con el sistema de enrutamiento en Angular.

## Cómo usar RouterLink

En lugar de usar elementos anchor regulares `<a>` con un atributo `href`, agregas una directiva RouterLink con la ruta apropiada para aprovechar el enrutamiento en Angular.
```angular-ts
import {RouterLink} from '@angular/router';
@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">User profile</a>
      <a routerLink="/settings">Settings</a>
    </nav>
  `
  imports: [RouterLink],
  ...
})
export class App {}
```

### Usando enlaces absolutos o relativos

Las **URLs relativas** en el enrutamiento en Angular te permiten definir rutas de navegación relativas a la ubicación de la ruta actual. Esto contrasta con las **URLs absolutas** que contienen la ruta completa con el protocolo (por ejemplo, `http://`) y el **dominio raíz** (por ejemplo, `google.com`).

```angular-html
<!-- URL absoluta -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- URL relativa -->
<a href="/essentials">Angular Essentials Guide</a>
```

En este ejemplo, el primer ejemplo contiene la ruta completa con el protocolo (es decir, `https://`) y el dominio raíz (es decir, `angular.dev`) explícitamente definidos para la página de essentials. En contraste, el segundo ejemplo asume que el usuario ya está en el dominio raíz correcto para `/essentials`.

En términos generales, se prefieren las URLs relativas porque son más mantenibles en todas las aplicaciones porque no necesitan conocer su posición absoluta dentro de la jerarquía de enrutamiento.

### Cómo funcionan las URLs relativas

El enrutamiento en Angular tiene dos sintaxis para definir URLs relativas: strings y arrays.

```angular-html
<!-- Navega al usuario a /dashboard -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>
```

ÚTIL: Pasar un string es la forma más común de definir URLs relativas.

Cuando necesitas definir parámetros dinámicos en una URL relativa, usa la sintaxis de array:

```angular-html
<a [routerLink]="['user', currentUserId]">Current User</a>
```

Además, el enrutamiento en Angular te permite especificar si quieres que la ruta sea relativa a la URL actual o al dominio raíz según si la ruta relativa tiene o no el prefijo de barra diagonal (`/`).

Por ejemplo, si el usuario está en `example.com/settings`, aquí está cómo se pueden definir diferentes rutas relativas para varios escenarios:

```angular-html
<!-- Navega a /settings/notifications -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- Navega a /team/:teamId/user/:userId -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>"
```

## Navegación programática a rutas

Mientras que `RouterLink` maneja la navegación declarativa en templates, Angular proporciona navegación programática para escenarios donde necesitas navegar basándote en lógica, acciones del usuario o estado de la aplicación. Al inyectar `Router`, puedes navegar dinámicamente a rutas, pasar parámetros y controlar el comportamiento de navegación en tu código TypeScript.

### `router.navigate()`

Puedes usar el método `router.navigate()` para navegar programáticamente entre rutas especificando un array de ruta URL.

```angular-ts
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <button (click)="navigateToProfile()">View Profile</button>
  `
})
export class AppDashboard {
  private router = inject(Router);

  navigateToProfile() {
    // Navegación estándar
    this.router.navigate(['/profile']);

    // Con parámetros de ruta
    this.router.navigate(['/users', userId]);

    // Con parámetros de consulta
    this.router.navigate(['/search'], {
      queryParams: { category: 'books', sort: 'price' }
    });
  }
}
```

`router.navigate()` soporta escenarios de enrutamiento simples y complejos, permitiéndote pasar parámetros de ruta, [parámetros de consulta](/guide/routing/read-route-state#query-parameters), y controlar el comportamiento de navegación.

También puedes construir rutas de navegación dinámicas relativas a la ubicación de tu componente en el árbol de enrutamiento usando la opción `relativeTo`.

```angular-ts
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Edit User</button>
    <button (click)="navigateToParent()">Back to List</button>
  `
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {}

  // Navegar a una ruta hermana
  navigateToEdit() {
    // Desde: /users/123
    // A:     /users/123/edit
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  // Navegar al padre
  navigateToParent() {
    // Desde: /users/123
    // A:     /users
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
```

### `router.navigateByUrl()`

El método `router.navigateByUrl()` proporciona una forma directa de navegar programáticamente usando strings de ruta URL en lugar de segmentos de array. Este método es ideal cuando tienes una ruta URL completa y necesitas realizar navegación absoluta, especialmente cuando trabajas con URLs proporcionadas externamente o escenarios de deep linking.

```angular-ts
// Navegación de ruta estándar
router.navigateByUrl('/products);

// Navegar a ruta anidada
router.navigateByUrl('/products/featured');

// URL completa con parámetros y fragmento
router.navigateByUrl('/products/123?view=details#reviews');

// Navegar con parámetros de consulta
router.navigateByUrl('/search?category=books&sortBy=price');
```

En caso de que necesites reemplazar la URL actual en el historial, `navigateByUrl` también acepta un objeto de configuración que tiene una opción `replaceUrl`.

```angular-ts
// Reemplazar URL actual en el historial
router.navigateByUrl('/checkout', {
  replaceUrl: true
});
```

## Próximos pasos

Aprende cómo [leer estado de ruta](/guide/routing/read-route-state) para crear componentes responsivos y conscientes del contexto.
