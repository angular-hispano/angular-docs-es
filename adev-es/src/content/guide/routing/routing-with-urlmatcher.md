# Crear coincidencias de ruta personalizadas

Angular Router soporta una estrategia de coincidencia poderosa que puedes usar para ayudar a los usuarios a navegar tu aplicación.
Esta estrategia de coincidencia soporta rutas estáticas, rutas variables con parámetros, rutas comodín, y más.
Además, puedes construir tu propia coincidencia de patrón personalizada para situaciones en las que las URLs son más complicadas.

En este tutorial, construirás un matcher de ruta personalizado usando `UrlMatcher` de Angular.
Este matcher busca un handle de Twitter en la URL.

## Objetivos

Implementar `UrlMatcher` de Angular para crear un matcher de ruta personalizado.

## Crear una aplicación de ejemplo

Usando Angular CLI, crea una nueva aplicación, *angular-custom-route-match*.
Además del framework de aplicación Angular predeterminado, también crearás un componente *profile*.

1. Crea un nuevo proyecto Angular, *angular-custom-route-match*.

    ```shell
    ng new angular-custom-route-match
    ```

    Cuando se te pregunte `Would you like to add Angular routing?`, selecciona `Y`.

    Cuando se te pregunte `Which stylesheet format would you like to use?`, selecciona `CSS`.

    Después de unos momentos, un nuevo proyecto, `angular-custom-route-match`, estará listo.

1. Desde tu terminal, navega al directorio `angular-custom-route-match`.
1. Crea un componente, *profile*.

    ```shell
    ng generate component profile
    ```

1. En tu editor de código, localiza el archivo `profile.component.html` y reemplaza el contenido placeholder con el siguiente HTML.

    <docs-code header="src/app/profile/profile.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.component.html"/>

1. En tu editor de código, localiza el archivo `app.component.html` y reemplaza el contenido placeholder con el siguiente HTML.

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.component.html"/>

## Configurar las rutas para tu aplicación

Con el framework de tu aplicación en su lugar, a continuación necesitas agregar capacidades de enrutamiento al archivo `app.config.ts`.
Como parte de este proceso, crearás un matcher de URL personalizado que busca un handle de Twitter en la URL.
Este handle se identifica por un símbolo `@` precedente.

1. En tu editor de código, abre tu archivo `app.config.ts`.
1. Agrega una declaración `import` para `provideRouter` y `withComponentInputBinding` de Angular, así como las rutas de la aplicación.

    ```ts
    import {provideRouter, withComponentInputBinding} from '@angular/router';

    import {routes} from './app.routes';
    ```

1. En el array de providers, agrega una declaración `provideRouter(routes, withComponentInputBinding())`.

1. Define el matcher de ruta personalizado agregando el siguiente código a las rutas de la aplicación.

    <docs-code header="src/app/app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" visibleRegion="matcher"/>

Este matcher personalizado es una función que realiza las siguientes tareas:

* El matcher verifica que el array contiene solo un segmento
* El matcher emplea una expresión regular para asegurar que el formato del nombre de usuario coincida
* Si hay una coincidencia, la función retorna la URL completa, definiendo un parámetro de ruta `username` como una subcadena de la ruta
* Si no hay coincidencia, la función retorna null y el router continúa buscando otras rutas que coincidan con la URL

ÚTIL: Un matcher de URL personalizado se comporta como cualquier otra definición de ruta. Define rutas hijo o rutas con lazy loading como lo harías con cualquier otra ruta.

## Leer los parámetros de ruta

Con el matcher personalizado en su lugar, ahora puedes vincular el parámetro de ruta en el componente `profile`.

En tu editor de código, abre tu archivo `profile.component.ts` y crea un `Input` que coincida con el parámetro `username`.
Agregamos la característica `withComponentInputBinding` anteriormente
en `provideRouter`. Esto permite que el `Router` vincule información directamente a los componentes de ruta.

```ts
@Input() username!: string;
```

## Probar tu matcher de URL personalizado

Con tu código en su lugar, ahora puedes probar tu matcher de URL personalizado.

1. Desde una ventana de terminal, ejecuta el comando `ng serve`.

    <docs-code language="shell">
    ng serve
    </docs-code>

1. Abre un navegador en `http://localhost:4200`.

    Deberías ver una sola página web, consistiendo en una oración que dice `Navigate to my profile`.

1. Haz clic en el hipervínculo **my profile**.

    Una nueva oración, que dice `Hello, Angular!` aparece en la página.

## Próximos pasos

La coincidencia de patrones con Angular Router te proporciona mucha flexibilidad cuando tienes URLs dinámicas en tu aplicación.
Para aprender más sobre Angular Router, consulta los siguientes temas:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="Enrutamiento y navegación en la aplicación"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>

ÚTIL: Este contenido está basado en [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483), de [Brandon Roberts](https://twitter.com/brandontroberts).
