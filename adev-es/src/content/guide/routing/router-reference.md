# Referencia del Router

Las siguientes secciones destacan algunos conceptos y terminología centrales del router.

## Eventos del Router

Durante cada navegación, el `Router` emite eventos de navegación a través de la propiedad `Router.events`.
Estos eventos se muestran en la siguiente tabla.

| Evento del Router                                         | Detalles                                                                                                                                                                |
| :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | Se dispara cuando comienza la navegación.                                                                                                                                      |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | Se dispara antes de que el `Router` cargue de forma diferida una configuración de ruta.                                                                                                        |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | Se dispara después de que una ruta ha sido cargada de forma diferida.                                                                                                                          |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Se dispara cuando el Router parsea la URL y las rutas son reconocidas.                                                                                                |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Se dispara cuando el Router comienza la fase de Guards del enrutamiento.                                                                                                          |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Se dispara cuando el Router comienza a activar los hijos de una ruta.                                                                                                        |
| [`ActivationStart`](api/router/ActivationStart)           | Se dispara cuando el Router comienza a activar una ruta.                                                                                                                   |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Se dispara cuando el Router finaliza la fase de Guards del enrutamiento exitosamente.                                                                                           |
| [`ResolveStart`](api/router/ResolveStart)                 | Se dispara cuando el Router comienza la fase de Resolve del enrutamiento.                                                                                                         |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Se dispara cuando el Router finaliza la fase de Resolve del enrutamiento exitosamente.                                                                                          |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Se dispara cuando el Router finaliza la activación de los hijos de una ruta.                                                                                                      |
| [`ActivationEnd`](api/router/ActivationEnd)               | Se dispara cuando el Router finaliza la activación de una ruta.                                                                                                                 |
| [`NavigationEnd`](api/router/NavigationEnd)               | Se dispara cuando la navegación finaliza exitosamente.                                                                                                                           |
| [`NavigationCancel`](api/router/NavigationCancel)         | Se dispara cuando la navegación se cancela. Esto puede suceder cuando un Route Guard retorna false durante la navegación, o redirige retornando un `UrlTree` o `RedirectCommand`. |
| [`NavigationError`](api/router/NavigationError)           | Se dispara cuando la navegación falla debido a un error inesperado.                                                                                                            |
| [`Scroll`](api/router/Scroll)                             | Representa un evento de scrolling.                                                                                                                                          |

Cuando habilitas la característica `withDebugTracing`, Angular registra estos eventos en la consola.

## Terminología del Router

Aquí están los términos clave del `Router` y sus significados:

| Parte del Router      | Detalles                                                                                                                                                                                                                                   |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Router`              | Muestra el componente de aplicación para la URL activa. Gestiona la navegación de un componente al siguiente.                                                                                                                                 |
| `provideRouter`       | proporciona los proveedores de servicio necesarios para navegar a través de las vistas de la aplicación.                                                                                                                                                        |
| `RouterModule`        | Un NgModule separado que proporciona los proveedores de servicio y directivas necesarias para navegar a través de las vistas de la aplicación.                                                                                                                |
| `Routes`              | Define un array de Routes, cada una mapeando una ruta de URL a un componente.                                                                                                                                                                       |
| `Route`               | Define cómo el router debe navegar a un componente basándose en un patrón de URL. La mayoría de las rutas consisten en una ruta y un tipo de componente.                                                                                                         |
| `RouterOutlet`        | La directiva \(`<router-outlet>`\) que marca dónde el router muestra una vista.                                                                                                                                                          |
| `RouterLink`          | La directiva para vincular un elemento HTML clickeable a una ruta. Hacer clic en un elemento con una directiva `routerLink` que está vinculada a un _string_ o un _array de parámetros de enlace_ dispara una navegación.                                           |
| `RouterLinkActive`    | La directiva para agregar/eliminar clases de un elemento HTML cuando un `routerLink` asociado contenido en o dentro del elemento se vuelve activo/inactivo. También puede establecer el `aria-current` de un enlace activo para mejor accesibilidad. |
| `ActivatedRoute`      | Un servicio que se proporciona a cada componente de ruta que contiene información específica de la ruta como parámetros de ruta, datos estáticos, datos resueltos, parámetros de consulta globales y el fragmento global.                                         |
| `RouterState`         | El estado actual del router incluyendo un árbol de las rutas actualmente activadas junto con métodos de conveniencia para recorrer el árbol de rutas.                                                                                       |
| Array de parámetros de enlace | Un array que el router interpreta como una instrucción de enrutamiento. Puedes vincular ese array a un `RouterLink` o pasar el array como argumento al método `Router.navigate`.                                                                 |
| Componente de enrutamiento     | Un componente Angular con un `RouterOutlet` que muestra vistas basadas en navegaciones del router.                                                                                                                                               |

## `<base href>`

El router usa el [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') del navegador para navegación.
`pushState` te permite personalizar rutas de URL dentro de la aplicación; por ejemplo, `localhost:4200/crisis-center`.
Las URLs dentro de la aplicación pueden ser indistinguibles de las URLs del servidor.

Los navegadores HTML5 modernos fueron los primeros en soportar `pushState`, razón por la cual muchas personas se refieren a estas URLs como URLs "estilo HTML5".

ÚTIL: La navegación estilo HTML5 es el valor predeterminado del router.
En la sección [LocationStrategy y estilos de URL del navegador](#locationstrategy-and-browser-url-styles), aprende por qué el estilo HTML5 es preferable, cómo ajustar su comportamiento y cómo cambiar al estilo hash \(`#`\) más antiguo, si es necesario.

Debes agregar un [elemento `<base href>`](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') al `index.html` de la aplicación para que el enrutamiento `pushState` funcione.
El navegador usa el valor `<base href>` para prefijar URLs relativas al referenciar archivos CSS, scripts e imágenes.

Agrega el elemento `<base>` justo después de la etiqueta `<head>`.
Si la carpeta `app` es la raíz de la aplicación, como lo es para esta aplicación, establece el valor `href` en `index.html` como se muestra aquí.

<docs-code header="src/index.html (base-href)" path="adev/src/content/examples/router/src/index.html" visibleRegion="base-href"/>

### URLs HTML5 y el `<base href>`

Las directrices que siguen se referirán a diferentes partes de una URL.
Este diagrama describe a qué se refieren esas partes:

<docs-code hideCopy language="text">
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
</docs-code>

Aunque el router usa el estilo [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state') por defecto, debes configurar esa estrategia con un `<base href>`.

La forma preferida de configurar la estrategia es agregar una etiqueta [elemento `<base href>`](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') en el `<head>` del `index.html`.

```angular-html
<base href="/">
```

Sin esa etiqueta, el navegador podría no poder cargar recursos \(imágenes, CSS, scripts\) cuando se haga "deep linking" en la aplicación.

Algunos desarrolladores podrían no poder agregar el elemento `<base>`, quizás porque no tienen acceso al `<head>` o al `index.html`.

Esos desarrolladores aún pueden usar URLs HTML5 siguiendo los siguientes dos pasos:

1. Proporciona al router un valor `APP_BASE_HREF` apropiado.
1. Usa URLs raíz \(URLs con un `authority`\) para todos los recursos web: CSS, imágenes, scripts y archivos HTML de plantilla.

   - El `path` de `<base href>` debe terminar con un "/", ya que los navegadores ignoran caracteres en el `path` que siguen al "`/`" más a la derecha
   - Si el `<base href>` incluye una parte `query`, el `query` solo se usa si el `path` de un enlace en la página está vacío y no tiene `query`.
     Esto significa que un `query` en el `<base href>` solo se incluye cuando se usa `HashLocationStrategy`.

   - Si un enlace en la página es una URL raíz \(tiene un `authority`\), el `<base href>` no se usa.
     De esta manera, un `APP_BASE_HREF` con un authority causará que todos los enlaces creados por Angular ignoren el valor `<base href>`.

   - Un fragmento en el `<base href>` _nunca_ se persiste

Para información más completa sobre cómo `<base href>` se usa para construir URIs objetivo, consulta la sección [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) sobre transformación de referencias.

### `HashLocationStrategy`

Usa `HashLocationStrategy` proporcionando el `useHash: true` en un objeto como segundo argumento del `RouterModule.forRoot()` en el `AppModule`.

```ts
providers: [
  provideRouter(appRoutes, withHashLocation())
]
```

Cuando usas `RouterModule.forRoot`, esto se configura con el `useHash: true` en el segundo argumento: `RouterModule.forRoot(routes, {useHash: true})`.
