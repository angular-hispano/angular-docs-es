# Mostrar rutas con outlets

La directiva `RouterOutlet` es un marcador de posición que marca la ubicación donde el router debe renderizar el componente para la URL actual.

```angular-html
<app-header />
<router-outlet />  <!-- Angular inserta el contenido de tu ruta aquí -->
<app-footer />
```

```angular-ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

En este ejemplo, si una aplicación tiene las siguientes rutas definidas:

```angular-ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Our Products'
  }
];
```

Cuando un usuario visita `/products`, Angular renderiza lo siguiente:

```angular-html
<app-header />
<app-products />
<app-footer />
```

Si el usuario regresa a la página de inicio, entonces Angular renderiza:

```angular-html
<app-header />
<app-home />
<app-footer />
```

Al mostrar una ruta, el elemento `<router-outlet>` permanece presente en el DOM como un punto de referencia para futuras navegaciones. Angular inserta el contenido enrutado justo después del elemento outlet como un hermano.

```angular-html
<!-- Contenido de la plantilla del componente -->
<app-header />
<router-outlet />
<app-footer />
```

```angular-html
<!-- Contenido renderizado en la página cuando el usuario visita /admin -->
<app-header>...</app-header>
<router-outlet></router-outlet>
<app-admin-page>...</app-admin-page>
<app-footer>...</app-footer>
```

## Anidando rutas con rutas hijas

A medida que tu aplicación crece en complejidad, es posible que desees crear rutas que sean relativas a un componente distinto de tu componente raíz. Esto te permite crear experiencias donde solo parte de la aplicación cambia cuando la URL cambia, en lugar de que los usuarios sientan que toda la página se actualiza.

Estos tipos de rutas anidadas se llaman rutas hijas. Esto significa que estás agregando un segundo `<router-outlet>` a tu aplicación, porque es además del `<router-outlet>` en AppComponent.

En este ejemplo, el componente `Settings` mostrará el panel deseado según lo que el usuario seleccione. Una de las cosas únicas que notarás sobre las rutas hijas es que el componente a menudo tiene su propio `<nav>` y `<router-outlet>`.

```angular-html
<h1>Settings</h1>
<nav>
  <ul>
    <li><a routerLink="profile">Profile</a></li>
    <li><a routerLink="security">Security</a></li>
  </ul>
</nav>
<router-outlet />
```

Una ruta hija es como cualquier otra ruta, en que necesita tanto un `path` como un `component`. La única diferencia es que colocas las rutas hijas en un array children dentro de la ruta padre.

```angular-ts
const routes: Routes = [
  {
    path: 'settings-component',
    component: SettingsComponent, // este es el componente con el <router-outlet> en la plantilla
    children: [
      {
        path: 'profile', // ruta de la ruta hija
        component: ProfileComponent, // componente de ruta hija que el router renderiza
      },
      {
        path: 'security',
        component: SecurityComponent, // otro componente de ruta hija que el router renderiza
      },
    ],
  },
];
```

Una vez que tanto las `routes` como el `<router-outlet>` estén configurados correctamente, ¡tu aplicación ahora está usando rutas anidadas!

## Rutas secundarias con outlets nombrados

Las páginas pueden tener múltiples outlets— puedes asignar un nombre a cada outlet para especificar qué contenido pertenece a qué outlet.

```angular-html
<app-header />
<router-outlet />
<router-outlet name='read-more' />
<router-outlet name='additional-actions' />
<app-footer />
```

Cada outlet debe tener un nombre único. El nombre no se puede establecer ni cambiar dinámicamente. Por defecto, el nombre es `'primary'`.

Angular hace coincidir el nombre del outlet con la propiedad `outlet` definida en cada ruta:

```angular-ts
{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}
```

## Eventos del ciclo de vida del outlet

Hay cuatro eventos del ciclo de vida que un router outlet puede emitir:

| Evento       | Descripción                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| `activate`   | Cuando se instancia un nuevo componente                                           |
| `deactivate` | Cuando se destruye un componente                                                  |
| `attach`     | Cuando el `RouteReuseStrategy` instruye al outlet a adjuntar el subárbol          |
| `detach`     | Cuando el `RouteReuseStrategy` instruye al outlet a desconectar el subárbol       |

Puedes agregar escuchadores de eventos con la sintaxis estándar de vinculación de eventos:

```angular-html
<router-outlet
  (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'
  (attach)='onAttach($event)'
  (detach)='onDetach($event)'
/>
```

Consulta la [documentación de la API para RouterOutlet](/api/router/RouterOutlet?tab=api) si deseas aprender más.

## Próximos pasos

Aprende cómo [navegar a rutas](/guide/routing/navigate-to-routes) con Angular Router.
