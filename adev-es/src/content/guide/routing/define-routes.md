# Definir rutas

Las rutas sirven como los bloques de construcción fundamentales para la navegación dentro de una aplicación Angular.

## ¿Qué son las rutas? {#what-are-routes}

En Angular, una **ruta** es un objeto que define qué componente debe renderizar para una ruta URL específica o patrón, así como opciones de configuración adicionales sobre qué sucede cuando un usuario navega a esa URL.

Aquí hay un ejemplo básico de una ruta:

```angular-ts
import { AdminPage } from './app-admin/app-admin.component';

const adminPage = {
  path: 'admin',
  component: AdminPage
}
```

Para esta ruta, cuando un usuario visita la ruta `/admin`, la aplicación mostrará el componente `AdminPage`.

### Gestionando rutas en tu aplicación {#managing-routes-in-your-application}

La mayoría de los proyectos definen rutas en un archivo separado que contiene `routes` en el nombre del archivo.

Una colección de rutas se ve así:

```angular-ts
import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page.component';
import { AdminPage } from './about-page/admin-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'admin',
    component: AdminPage,
  },
];
```

CONSEJO: Si generaste un proyecto con Angular CLI, tus rutas están definidas en `app.routes.ts`.

### Agregando el router a tu aplicación {#adding-the-router-to-your-application}

Al hacer bootstrap de una aplicación Angular sin Angular CLI, puedes pasar un objeto de configuración que incluye un array `providers`.

Dentro del array `providers`, puedes agregar el router de Angular a tu aplicación agregando una llamada a la función `provideRouter` con tus rutas.

```angular-ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ]
};
```

## Rutas URL {#route-url-paths}

### Rutas URL estáticas {#static-url-paths}

Las rutas URL estáticas se refieren a rutas con rutas predefinidas que no cambian según parámetros dinámicos. Estas son rutas que coinciden exactamente con un string `path` y tienen un resultado fijo.

Ejemplos de esto incluyen:

- "/admin"
- "/blog"
- "/settings/account"

### Definir rutas URL con parámetros de ruta {#define-url-paths-with-route-parameters}

Las URLs parametrizadas te permiten definir rutas dinámicas que permiten múltiples URLs al mismo componente mientras muestran datos dinámicamente según los parámetros en la URL.

Puedes definir este tipo de patrón agregando parámetros al string `path` de tu ruta y prefijando cada parámetro con el carácter dos puntos (`:`).

IMPORTANTE: Los parámetros son distintos de la información en el [query string](https://en.wikipedia.org/wiki/Query_string) de la URL.
Aprende más sobre [parámetros de consulta en Angular en esta guía](/guide/routing/read-route-state#query-parameters).

El siguiente ejemplo muestra un componente de perfil de usuario basado en el id de usuario pasado a través de la URL.

```angular-ts
import { Routes } from '@angular/router';
import { UserProfile } from './user-profile/user-profile;

const routes: Routes = [
  { path: 'user/:id', component: UserProfile }
];
```

En este ejemplo, URLs como `/user/leeroy` y `/user/jenkins` renderizan el componente `UserProfile`. Este componente puede entonces leer el parámetro `id` y usarlo para realizar trabajo adicional, como obtener datos. Consulta la [guía de lectura de estado de ruta](/guide/routing/read-route-state) para detalles sobre la lectura de parámetros de ruta.

Los nombres de parámetros de ruta válidos deben comenzar con una letra (a-z, A-Z) y solo pueden contener:

- Letras (a-z, A-Z)
- Números (0-9)
- Guión bajo (\_)
- Guión (-)

También puedes definir rutas con múltiples parámetros:

```angular-ts
import { Routes } from '@angular/router';
import { UserProfile } from './user-profile/user-profile.component';
import { SocialMediaFeed } from './user-profile/social–media-feed.component';

const routes: Routes = [
  { path: 'user/:id/:social-media', component: SocialMediaFeed },
  { path: 'user/:id/', component: UserProfile },
];
```

Con esta nueva ruta, los usuarios pueden visitar `/user/leeroy/youtube` y `/user/leeroy/bluesky` y ver feeds de redes sociales respectivos basados en el parámetro para el usuario leeroy.

Consulta [Leer estado de ruta](/guide/routing/read-route-state) para detalles sobre la lectura de parámetros de ruta.

### Comodines {#wildcards}

Cuando necesitas capturar todas las rutas para una ruta específica, la solución es una ruta comodín que se define con el doble asterisco (`**`).

Un ejemplo común es definir un componente de Página No Encontrada.

```angular-ts
import { Home } from './home/home.component';
import { UserProfile } from './user-profile/user-profile.component';
import { NotFound } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'user/:id', component: UserProfile },
  { path: '**', component: NotFound }
];
```

En este array de rutas, la aplicación muestra el componente `NotFound` cuando el usuario visita cualquier ruta fuera de `home` y `user/:id`.

Consejo: Las rutas comodín típicamente se colocan al final de un array de rutas.

## Cómo Angular hace coincidir URLs {#how-angular-matches-urls}

Cuando defines rutas, el orden es importante porque Angular usa una estrategia de primera coincidencia gana. Esto significa que una vez que Angular hace coincidir una URL con un `path` de ruta, deja de verificar más rutas. Como resultado, siempre coloca rutas más específicas antes que rutas menos específicas.

El siguiente ejemplo muestra rutas definidas de más específica a menos específica:

```angular-ts
const routes: Routes = [
  { path: '', component: HomeComponent },              // Ruta vacía
  { path: 'users/new', component: NewUserComponent },  // Estática, más específica
  { path: 'users/:id', component: UserDetailComponent }, // Dinámica
  { path: 'users', component: UsersComponent },        // Estática, menos específica
  { path: '**', component: NotFoundComponent }         // Comodín - siempre último
];
```

Si un usuario visita `/users/new`, el router de Angular pasaría por los siguientes pasos:

1. Verifica `''` - no coincide
1. Verifica `users/new` - ¡coincide! Se detiene aquí
1. Nunca alcanza `users/:id` aunque podría coincidir
1. Nunca alcanza `users`
1. Nunca alcanza `**`

## Redirecciones {#redirects}

Puedes definir una ruta que redirige a otra ruta en lugar de renderizar un componente:

```angular-ts
import { BlogComponent } from './home/blog.component';

const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: BlogComponent
  },
];
```

Si modificas o eliminas una ruta, algunos usuarios aún pueden hacer clic en enlaces desactualizados o marcadores a esa ruta. Puedes agregar una redirección para dirigir a esos usuarios a una ruta alternativa apropiada en lugar de una página "no encontrada".

## Títulos de página {#page-titles}

Puedes asociar un **título** con cada ruta. Angular actualiza automáticamente el [título de página](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) cuando una ruta se activa. Siempre define títulos de página apropiados para tu aplicación, ya que estos títulos son necesarios para crear una experiencia accesible.

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us'
  },
];
```

La propiedad `title` de la página puede establecerse dinámicamente a una función resolver usando [`ResolveFn`](/api/router/ResolveFn).

```ts
const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
const routes: Routes = [
   ...
  {
    path: 'products',
    component: ProductsComponent,
    title: titleResolver,
  }
];

```

Los títulos de ruta también se pueden establecer a través de un servicio que extiende la clase abstracta [`TitleStrategy`](/api/router/TitleStrategy). Por defecto, Angular usa el [`DefaultTitleStrategy`](/api/router/DefaultTitleStrategy).

### Usando TitleStrategy para títulos de página {#using-titlestrategy-for-page-titles}

Para escenarios avanzados donde necesitas control centralizado sobre cómo se compone el título del documento, implementa un `TitleStrategy`.

`TitleStrategy` es un token que puedes proporcionar para sobrescribir la estrategia de título predeterminada que usa Angular. Puedes suministrar un `TitleStrategy` personalizado para implementar convenciones como agregar un sufijo de aplicación, formatear títulos desde breadcrumbs o generar títulos dinámicamente desde datos de ruta.

```ts
import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleStrategy, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // PageTitle es igual al "Title" de una ruta si está establecido
    // Si no está establecido, usará el "title" dado en index.html
    const pageTitle = this.buildTitle(snapshot) || this.title.getTitle();
    this.title.setTitle(`MyAwesomeApp - ${pageTitle}`);
  }
}
```

Para usar la estrategia personalizada, proporciónala con el token `TitleStrategy` a nivel de aplicación:

```ts
import {provideRouter, TitleStrategy} from '@angular/router';
import {AppTitleStrategy} from './app-title.strategy';

export const appConfig = {
  providers: [provideRouter(routes), {provide: TitleStrategy, useClass: AppTitleStrategy}],
};
```

## Proveedores a nivel de ruta para inyección de dependencias {#route-level-providers-for-dependency-injection}

Cada ruta tiene una propiedad `providers` que te permite proporcionar dependencias al contenido de esa ruta a través de [inyección de dependencias](/guide/di).

Escenarios comunes donde esto puede ser útil incluyen aplicaciones que tienen diferentes servicios según si el usuario es admin o no.

```angular-ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [
      AdminService,
      {provide: ADMIN_API_KEY, useValue: '12345'},
    ],
    children: [
      {path: 'users', component: AdminUsersComponent},
      {path: 'teams', component: AdminTeamsComponent},
    ],
  },
  // ... otras rutas de aplicación que no
  //     tienen acceso a ADMIN_API_KEY o AdminService.
];
```

En este ejemplo de código, la ruta `admin` contiene una propiedad de datos protegida de `ADMIN_API_KEY` que solo está disponible para los hijos dentro de su sección. Como resultado, ninguna otra ruta podrá acceder a los datos proporcionados a través de `ADMIN_API_KEY`.

Consulta la [guía de Inyección de dependencias](/guide/di) para más información sobre proveedores e inyección en Angular.

## Asociando datos con rutas {#associating-data-with-routes}

Los datos de ruta te permiten adjuntar información adicional a las rutas. Puedes configurar cómo se comportan los componentes según estos datos.

Hay dos formas de trabajar con datos de ruta: datos estáticos que permanecen constantes, y datos dinámicos que pueden cambiar según condiciones de tiempo de ejecución.

### Datos estáticos {#static-data}

Puedes asociar datos estáticos arbitrarios con una ruta a través de la propiedad `data` para centralizar cosas como metadatos específicos de ruta (por ejemplo, seguimiento de analytics, permisos, etc.):

```angular-ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { analyticsId: '456' }
  },
  {
    path: '',
    component: HomeComponent,
    data: { analyticsId: '123' }
  }
];
```

En este ejemplo de código, la página de inicio y la página about están configuradas con un `analyticsId` específico que luego se usaría en sus respectivos componentes para el seguimiento de analytics de página.

Puedes leer estos datos estáticos inyectando el `ActivatedRoute`. Consulta [Leer estado de ruta](/guide/routing/read-route-state) para más detalles.

### Datos dinámicos con data resolvers {#dynamic-data-with-data-resolvers}

Cuando necesitas proporcionar datos dinámicos a una ruta, consulta la [guía sobre resolvers de datos de ruta](/guide/routing/data-resolvers).

## Rutas anidadas {#nested-routes}

Las rutas anidadas, también conocidas como rutas hijas, son una técnica común para gestionar rutas de navegación más complejas donde un componente tiene una sub-vista que cambia según la URL.

<img alt="Diagrama para ilustrar rutas anidadas" src="assets/images/guide/router/nested-routing-diagram.svg">

Puedes agregar rutas hijas a cualquier definición de ruta con la propiedad `children`:

```angular-ts
const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductComponent,
    children: [
      {
        path: 'info',
        component: ProductInfoComponent
      },
      {
        path: 'reviews',
        component: ProductReviewsComponent
      }
    ]
  }
]
```

El ejemplo anterior define una ruta para una página de producto que permite a un usuario cambiar si se muestra la información del producto o las reseñas según la url.

La propiedad `children` acepta un array de objetos `Route`.

Para mostrar rutas hijas, el componente padre (`ProductComponent` en el ejemplo anterior) incluye su propio `<router-outlet>`.

```angular-html
<!-- ProductComponent -->
<article>
  <h1>Product {{ id }}</h1>
  <router-outlet />
</article>
```

Después de agregar rutas hijas a la configuración y agregar un `<router-outlet>` al componente, la navegación entre URLs que coinciden con las rutas hijas actualiza solo el outlet anidado.

## Próximos pasos {#next-steps}

<docs-pill-row>
  <docs-pill href="/guide/routing/loading-strategies" title="Estrategias de carga de rutas"/>
  <docs-pill href="/guide/routing/show-routes-with-outlets" title="Mostrar el contenido de tus rutas con Outlets"/>
</docs-pill-row>
