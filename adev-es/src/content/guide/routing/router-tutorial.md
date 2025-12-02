# Usar rutas de Angular en una aplicación de página única (SPA)

Este tutorial describe cómo construir una aplicación de página única, SPA que usa múltiples rutas de Angular.

En una Single Page Application \(SPA\), todas las funciones de tu aplicación existen en una sola página HTML.
A medida que los usuarios acceden a las características de tu aplicación, el navegador solo necesita renderizar las partes que importan al usuario, en lugar de cargar una nueva página.
Este patrón puede mejorar significativamente la experiencia del usuario de tu aplicación.

Para definir cómo los usuarios navegan a través de tu aplicación, usas rutas.
Agrega rutas para definir cómo los usuarios navegan de una parte de tu aplicación a otra.
También puedes configurar rutas para protegerse contra comportamientos inesperados o no autorizados.

## Objetivos

- Organizar las características de una aplicación de ejemplo en módulos.
- Definir cómo navegar a un componente.
- Pasar información a un componente usando un parámetro.
- Estructurar rutas anidando varias rutas.
- Verificar si los usuarios pueden acceder a una ruta.
- Controlar si la aplicación puede descartar cambios no guardados.
- Mejorar el rendimiento precargando datos de ruta y cargando módulos de características con lazy loading.
- Requerir criterios específicos para cargar componentes.

## Crear una aplicación de ejemplo

Usando Angular CLI, crea una nueva aplicación, _angular-router-sample_.
Esta aplicación tendrá dos componentes: _crisis-list_ y _heroes-list_.

1. Crea un nuevo proyecto Angular, _angular-router-sample_.

    ```shell
    ng new angular-router-sample
    ```

    Cuando se te pregunte `Would you like to add Angular routing?`, selecciona `N`.

    Cuando se te pregunte `Which stylesheet format would you like to use?`, selecciona `CSS`.

    Después de unos momentos, un nuevo proyecto, `angular-router-sample`, estará listo.

1. Desde tu terminal, navega al directorio `angular-router-sample`.
1. Crea un componente, _crisis-list_.

    ```shell
    ng generate component crisis-list
    ```

1. En tu editor de código, localiza el archivo `crisis-list.component.html` y reemplaza el contenido placeholder con el siguiente HTML.

    <docs-code header="crisis-list/crisis-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/crisis-list/crisis-list.component.html"/>

1. Crea un segundo componente, _heroes-list_.

    ```shell
    ng generate component heroes-list
    ```

1. En tu editor de código, localiza el archivo `heroes-list.component.html` y reemplaza el contenido placeholder con el siguiente HTML.

    <docs-code header="heroes-list/heroes-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/heroes-list/heroes-list.component.html"/>

1. En tu editor de código, abre el archivo `app.component.html` y reemplaza su contenido con el siguiente HTML.

    <docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="setup"/>

1. Verifica que tu nueva aplicación se ejecuta como se espera ejecutando el comando `ng serve`.

    ```shell
    ng serve
    ```

1. Abre un navegador en `http://localhost:4200`.

    Deberías ver una sola página web, consistiendo en un título y el HTML de tus dos componentes.

## Definir tus rutas

En esta sección, definirás dos rutas:

- La ruta `/crisis-center` abre el componente `crisis-center`.
- La ruta `/heroes-list` abre el componente `heroes-list`.

Una definición de ruta es un objeto JavaScript.
Cada ruta típicamente tiene dos propiedades.
La primera propiedad, `path`, es un string que especifica la ruta de URL para la ruta.
La segunda propiedad, `component`, es un string que especifica qué componente debe mostrar tu aplicación para esa ruta.

1. Desde tu editor de código, crea y abre el archivo `app.routes.ts`.
1. Crea y exporta una lista de rutas para tu aplicación:

    ```ts
    import {Routes} from '@angular/router';

    export const routes = [];
    ```

1. Agrega dos rutas para tus primeros dos componentes:

    ```ts
    {path: 'crisis-list', component: CrisisListComponent},
    {path: 'heroes-list', component: HeroesListComponent},
    ```

Esta lista de rutas es un array de objetos JavaScript, con cada objeto definiendo las propiedades de una ruta.

## Importar `provideRouter` desde `@angular/router`

El enrutamiento te permite mostrar vistas específicas de tu aplicación dependiendo de la ruta de URL.
Para agregar esta funcionalidad a tu aplicación de ejemplo, necesitas actualizar el archivo `app.config.ts` para usar la función de proveedores del router, `provideRouter`.
Importas esta función de proveedor desde `@angular/router`.

1. Desde tu editor de código, abre el archivo `app.config.ts`.
1. Agrega las siguientes declaraciones de importación:

    ```ts
    import { provideRouter } from '@angular/router';
    import { routes } from './app.routes';
    ```

1. Actualiza los providers en el `appConfig`:

    ```ts
    providers: [provideRouter(routes)]
    ```

Para aplicaciones basadas en `NgModule`, coloca el `provideRouter` en la lista de `providers` del `AppModule`, o cualquier módulo que se pase a `bootstrapModule` en la aplicación.

## Actualizar tu componente con `router-outlet`

En este punto, has definido dos rutas para tu aplicación.
Sin embargo, tu aplicación aún tiene ambos componentes `crisis-list` y `heroes-list` codificados directamente en tu plantilla `app.component.html`.
Para que tus rutas funcionen, necesitas actualizar tu plantilla para cargar dinámicamente un componente basado en la ruta de URL.

Para implementar esta funcionalidad, agregas la directiva `router-outlet` a tu archivo de plantilla.

1. Desde tu editor de código, abre el archivo `app.component.html`.
1. Elimina las siguientes líneas.

    <docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="components"/>

1. Agrega la directiva `router-outlet`.

    <docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="router-outlet"/>

1. Agrega `RouterOutlet` a los imports del `AppComponent` en `app.component.ts`

    ```ts
    imports: [RouterOutlet],
    ```

Visualiza tu aplicación actualizada en tu navegador.
Solo deberías ver el título de la aplicación.
Para ver el componente `crisis-list`, agrega `crisis-list` al final de la ruta en la barra de direcciones de tu navegador.
Por ejemplo:

<docs-code language="http">
http://localhost:4200/crisis-list
</docs-code>

Nota que el componente `crisis-list` se muestra.
Angular está usando la ruta que definiste para cargar dinámicamente el componente.
Puedes cargar el componente `heroes-list` de la misma manera:

<docs-code language="http">
http://localhost:4200/heroes-list
</docs-code>

## Controlar la navegación con elementos UI

Actualmente, tu aplicación soporta dos rutas.
Sin embargo, la única forma de usar esas rutas es que el usuario escriba manualmente la ruta en la barra de direcciones del navegador.
En esta sección, agregarás dos enlaces en los que los usuarios pueden hacer clic para navegar entre los componentes `heroes-list` y `crisis-list`.
También agregarás algunos estilos CSS.
Aunque estos estilos no son requeridos, facilitan identificar el enlace del componente actualmente mostrado.
Agregarás esa funcionalidad en la siguiente sección.

1. Abre el archivo `app.component.html` y agrega el siguiente HTML debajo del título.

    <docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="nav"/>

    Este HTML usa una directiva de Angular, `routerLink`.
    Esta directiva conecta las rutas que definiste a tus archivos de plantilla.

1. Agrega la directiva `RouterLink` a la lista de imports de `AppComponent` en `app.component.ts`.

1. Abre el archivo `app.component.css` y agrega los siguientes estilos.

    <docs-code header="app.component.css" path="adev/src/content/examples/router-tutorial/src/app/app.component.css"/>

Si visualizas tu aplicación en el navegador, deberías ver estos dos enlaces.
Cuando haces clic en un enlace, aparece el componente correspondiente.

## Identificar la ruta activa

Aunque los usuarios pueden navegar tu aplicación usando los enlaces que agregaste en la sección anterior, no tienen una forma directa de identificar cuál es la ruta activa.
Agrega esta funcionalidad usando la directiva `routerLinkActive` de Angular.

1. Desde tu editor de código, abre el archivo `app.component.html`.
1. Actualiza las etiquetas anchor para incluir la directiva `routerLinkActive`.

    <docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="routeractivelink"/>
    
1. Agrega la directiva `RouterLinkActive` a la lista de `imports` de `AppComponent` en `app.component.ts`.

Visualiza tu aplicación nuevamente.
Al hacer clic en uno de los botones, el estilo para ese botón se actualiza automáticamente, identificando el componente activo para el usuario.
Al agregar la directiva `routerLinkActive`, informas a tu aplicación que aplique una clase CSS específica a la ruta activa.
En este tutorial, esa clase CSS es `activebutton`, pero podrías usar cualquier clase que desees.

Nota que también estamos especificando un valor para el `ariaCurrentWhenActive` de `routerLinkActive`. Esto asegura que los usuarios con discapacidades visuales (que pueden no percibir el estilo diferente que se está aplicando) también puedan identificar el botón activo. Para más información consulta las Mejores Prácticas de Accesibilidad [sección de identificación de enlaces activos](/best-practices/a11y#active-links-identification).

## Agregar una redirección

En este paso del tutorial, agregas una ruta que redirige al usuario para mostrar el componente `/heroes-list`.

1. Desde tu editor de código, abre el archivo `app.routes.ts`.
1. Actualiza la sección `routes` como sigue.

    ```ts
    {path: '', redirectTo: '/heroes-list', pathMatch: 'full'},
    ```

    Nota que esta nueva ruta usa un string vacío como su ruta.
    Además, reemplaza la propiedad `component` con dos nuevas:

    | Propiedades  | Detalles                                                                                                                                                                                                                                                                                                                        |
    |:-----------  |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `redirectTo` | Esta propiedad instruye a Angular a redirigir desde una ruta vacía a la ruta `heroes-list`.                                                                                                                                                                                                                                     |
    | `pathMatch`  | Esta propiedad instruye a Angular sobre cuánto de la URL debe coincidir. Para este tutorial, deberías establecer esta propiedad en `full`. Esta estrategia se recomienda cuando tienes un string vacío para una ruta. Para más información sobre esta propiedad, consulta la [documentación de la API Route](api/router/Route). |

Ahora cuando abres tu aplicación, muestra el componente `heroes-list` por defecto.

## Agregar una página 404

Es posible que un usuario intente acceder a una ruta que no has definido.
Para dar cuenta de este comportamiento, la mejor práctica es mostrar una página 404.
En esta sección, crearás una página 404 y actualizarás tu configuración de rutas para mostrar esa página para cualquier ruta no especificada.

1. Desde la terminal, crea un nuevo componente, `PageNotFound`.

    ```shell
    ng generate component page-not-found
    ```

1. Desde tu editor de código, abre el archivo `page-not-found.component.html` y reemplaza su contenido con el siguiente HTML.

    <docs-code header="src/app/page-not-found/page-not-found.component.html" path="adev/src/content/examples/router-tutorial/src/app/page-not-found/page-not-found.component.html"/>

1. Abre el archivo `app.routes.ts` y agrega la siguiente ruta a la lista de rutas:

    ```ts
    {path: '**', component: PageNotFoundComponent}
    ```

    La nueva ruta usa una ruta, `**`.
    Esta ruta es cómo Angular identifica una ruta comodín.
    Cualquier ruta que no coincida con una ruta existente en tu configuración usará esta ruta.

IMPORTANTE: Nota que la ruta comodín se coloca al final del array.
El orden de tus rutas es importante, ya que Angular aplica rutas en orden y usa la primera coincidencia que encuentra.

Intenta navegar a una ruta no existente en tu aplicación, como `http://localhost:4200/powers`.
Esta ruta no coincide con nada definido en tu archivo `app.routes.ts`.
Sin embargo, como definiste una ruta comodín, la aplicación automáticamente muestra tu componente `PageNotFound`.

## Próximos pasos

En este punto, tienes una aplicación básica que usa la característica de enrutamiento en Angular para cambiar qué componentes puede ver el usuario basándose en la dirección URL.
Has extendido estas características para incluir una redirección, así como una ruta comodín para mostrar una página 404 personalizada.

Para más información sobre enrutamiento, consulta los siguientes temas:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="Enrutamiento y navegación en la aplicación"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>
