# Renderización en el servidor y renderización híbrida

Angular distribuye todas las aplicaciones con renderización del lado del cliente (CSR) de forma predeterminada. Si bien este enfoque proporciona una carga inicial liviana, introduce compromisos que incluyen tiempos de carga más lentos, métricas de rendimiento degradadas y mayores demandas de recursos, ya que el dispositivo del usuario realiza la mayor parte de los cálculos. Como resultado, muchas aplicaciones logran mejoras significativas de rendimiento al integrar la renderización del lado del servidor (SSR) en una estrategia de renderización híbrida.

## ¿Qué es la renderización híbrida?

La renderización híbrida permite a los desarrolladores aprovechar los beneficios de la renderización del lado del servidor (SSR), el pre-renderizado (también conocido como "generación de sitios estáticos" o SSG) y la renderización del lado del cliente (CSR) para optimizar tu aplicación Angular. Te brinda un control detallado sobre cómo se renderizan las diferentes partes de tu aplicación para ofrecer a tus usuarios la mejor experiencia posible.

## Configurando la renderización híbrida

Puedes crear un proyecto **nuevo** con renderización híbrida utilizando el flag de renderización del lado del servidor (es decir, `--ssr`) con el comando `ng new` de Angular CLI:

```shell
ng new --ssr
```

También puedes habilitar la renderización híbrida añadiendo la renderización del lado del servidor a un proyecto existente con el comando `ng add`:

```shell
ng add @angular/ssr
```

NOTA: De forma predeterminada, Angular pre-renderiza toda tu aplicación y genera un archivo de servidor. Para deshabilitar esto y crear una aplicación completamente estática, establece `outputMode` en `static`. Para habilitar SSR, actualiza las rutas del servidor para usar `RenderMode.Server`. Para más detalles, consulta [`Enrutamiento en el servidor`](#enrutamiento-en-el-servidor) y [`Generar una aplicación completamente estática`](#generar-una-aplicación-completamente-estática).

## Enrutamiento en el servidor

### Configurando rutas del servidor

Puedes crear una configuración de rutas del servidor declarando un array de objetos [`ServerRoute`](api/ssr/ServerRoute 'API reference'). Esta configuración generalmente se encuentra en un archivo llamado `app.routes.server.ts`.

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // Esta ruta renderiza "/" en el cliente (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // Esta página es estática, por lo que la pre-renderizamos (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // Esta página requiere datos específicos del usuario, por lo que usamos SSR
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // Todas las demás rutas se renderizarán en el servidor (SSR)
    renderMode: RenderMode.Server,
  },
];
```

Puedes añadir esta configuración a tu aplicación con [`provideServerRendering`](api/ssr/provideServerRendering 'API reference') usando la función [`withRoutes`](api/ssr/withRoutes 'API reference'):

```typescript
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ... otros proveedores ...
  ]
};
```

Cuando se usa el [patrón App shell](ecosystem/service-workers/app-shell), debes especificar el componente que se usará como app shell para las rutas renderizadas del lado del cliente. Para hacerlo, usa la característica [`withAppShell`](api/ssr/withAppShell 'API reference'):

```typescript
import { provideServerRendering, withRoutes, withAppShell } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      withRoutes(serverRoutes),
      withAppShell(AppShellComponent),
    ),
    // ... otros proveedores ...
  ]
};
```

### Modos de renderización

La configuración de enrutamiento del servidor te permite especificar cómo debe renderizarse cada ruta en tu aplicación estableciendo un [`RenderMode`](api/ssr/RenderMode 'API reference'):

| Modo de renderización | Descripción                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Server (SSR)**      | Renderiza la aplicación en el servidor para cada petición, enviando una página HTML completamente poblada al navegador.          |
| **Client (CSR)**      | Renderiza la aplicación en el navegador. Este es el comportamiento predeterminado en Angular.                                    |
| **Prerender (SSG)**   | Pre-renderiza la aplicación en tiempo de compilación, generando archivos HTML estáticos para cada ruta.                          |

#### Eligiendo un modo de renderización

Cada modo de renderización tiene diferentes beneficios e inconvenientes. Puedes elegir modos de renderización según las necesidades específicas de tu aplicación.

##### Renderización del lado del cliente (CSR)

La renderización del lado del cliente tiene el modelo de desarrollo más sencillo, ya que puedes escribir código asumiendo que siempre se ejecuta en un navegador web. Esto te permite usar una amplia variedad de bibliotecas del lado del cliente que también asumen que se ejecutan en un navegador.

La renderización del lado del cliente generalmente tiene peor rendimiento que otros modos de renderización, ya que debe descargar, parsear y ejecutar el JavaScript de tu página antes de que el usuario pueda ver cualquier contenido renderizado. Si tu página obtiene más datos del servidor mientras se renderiza, los usuarios también deben esperar esas peticiones adicionales antes de poder ver el contenido completo.

Si tu página es indexada por rastreadores de búsqueda, la renderización del lado del cliente puede afectar negativamente la optimización para motores de búsqueda (SEO), ya que los rastreadores tienen límites en la cantidad de JavaScript que ejecutan al indexar una página.

Cuando se usa renderización del lado del cliente, el servidor no necesita hacer ningún trabajo para renderizar una página más allá de servir recursos estáticos de JavaScript. Puedes considerar este factor si el costo del servidor es una preocupación.

Las aplicaciones que admiten experiencias instalables y sin conexión con [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) pueden depender de la renderización del lado del cliente sin necesidad de comunicarse con un servidor.

##### Renderización del lado del servidor (SSR)

La renderización del lado del servidor ofrece cargas de página más rápidas que la renderización del lado del cliente. En lugar de esperar a que JavaScript se descargue y ejecute, el servidor renderiza directamente un documento HTML al recibir una petición del navegador. El usuario experimenta únicamente la latencia necesaria para que el servidor obtenga datos y renderice la página solicitada. Este modo también elimina la necesidad de peticiones de red adicionales desde el navegador, ya que tu código puede obtener datos durante la renderización en el servidor.

La renderización del lado del servidor generalmente tiene una excelente optimización para motores de búsqueda (SEO), ya que los rastreadores de búsqueda reciben un documento HTML completamente renderizado.

La renderización del lado del servidor requiere que escribas código que no dependa estrictamente de las APIs del navegador y limita tu selección de bibliotecas JavaScript que asumen que se ejecutan en un navegador.

Cuando se usa renderización del lado del servidor, tu servidor ejecuta Angular para producir una respuesta HTML por cada petición, lo que puede aumentar los costos de alojamiento del servidor.

##### Pre-renderizado en tiempo de compilación

El pre-renderizado ofrece cargas de página más rápidas que tanto la renderización del lado del cliente como la renderización del lado del servidor. Debido a que el pre-renderizado crea documentos HTML en _tiempo de compilación_, el servidor puede responder directamente a las peticiones con el documento HTML estático sin ningún trabajo adicional.

El pre-renderizado requiere que toda la información necesaria para renderizar una página esté disponible en _tiempo de compilación_. Esto significa que las páginas pre-renderizadas no pueden incluir datos específicos del usuario que está cargando la página. El pre-renderizado es principalmente útil para páginas que son iguales para todos los usuarios de tu aplicación.

Debido a que el pre-renderizado ocurre en tiempo de compilación, puede añadir un tiempo significativo a tus compilaciones de producción. Usar [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') para producir una gran cantidad de documentos HTML puede afectar el tamaño total de archivos de tus despliegues y, por lo tanto, provocar despliegues más lentos.

El pre-renderizado generalmente tiene una excelente optimización para motores de búsqueda (SEO), ya que los rastreadores de búsqueda reciben un documento HTML completamente renderizado.

El pre-renderizado requiere que escribas código que no dependa estrictamente de las APIs del navegador y limita tu selección de bibliotecas JavaScript que asumen que se ejecutan en un navegador.

El pre-renderizado incurre en una sobrecarga mínima por petición al servidor, ya que tu servidor responde con documentos HTML estáticos. Los archivos estáticos también se pueden almacenar en caché fácilmente mediante redes de distribución de contenido (CDN), navegadores y capas intermedias de caché para cargas de página subsiguientes aún más rápidas. Los sitios completamente estáticos también pueden desplegarse únicamente a través de una CDN o un servidor de archivos estáticos, eliminando la necesidad de mantener un tiempo de ejecución de servidor personalizado para tu aplicación. Esto mejora la escalabilidad al descargar trabajo de un servidor web de aplicaciones, lo que lo hace especialmente beneficioso para aplicaciones de alto tráfico.

NOTA: Cuando se usa el service worker de Angular, la primera petición se renderiza en el servidor, pero todas las peticiones subsiguientes son gestionadas por el service worker y renderizadas del lado del cliente.

### Configurando encabezados y códigos de estado

Puedes establecer encabezados y códigos de estado personalizados para rutas individuales del servidor usando las propiedades `headers` y `status` en la configuración de `ServerRoute`.

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... otras rutas
];
```

### Redirecciones

Angular maneja las redirecciones especificadas por la propiedad [`redirectTo`](api/router/Route#redirectTo 'API reference') en las configuraciones de rutas de manera diferente en el lado del servidor.

**Renderización del lado del servidor (SSR)**
Las redirecciones se realizan mediante redirecciones HTTP estándar (por ejemplo, 301, 302) dentro del proceso de renderización del lado del servidor.

**Pre-renderizado (SSG)**
Las redirecciones se implementan como "redirecciones suaves" usando etiquetas [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#refresh) en el HTML pre-renderizado.

### Personalizando el pre-renderizado en tiempo de compilación (SSG)

Cuando se usa [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), puedes especificar varias opciones de configuración para personalizar el proceso de pre-renderizado y servicio.

#### Rutas parametrizadas

Para cada ruta con [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), puedes especificar una función [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference'). Esta función te permite controlar qué parámetros específicos producen documentos pre-renderizados separados.

La función [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') retorna una `Promise` que se resuelve en un array de objetos. Cada objeto es un mapa clave-valor del nombre del parámetro de ruta a su valor. Por ejemplo, si defines una ruta como `post/:id`, `getPrerenderParams` podría retornar el array `[{id: 123}, {id: 456}]`, y así renderizar documentos separados para `post/123` y `post/456`.

El cuerpo de [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') puede usar la función [`inject`](api/core/inject 'API reference') de Angular para inyectar dependencias y realizar cualquier trabajo para determinar qué rutas pre-renderizar. Esto generalmente incluye hacer peticiones para obtener datos y construir el array de valores de parámetros.

También puedes usar esta función con rutas catch-all (por ejemplo, `/**`), donde el nombre del parámetro será `"**"` y el valor de retorno serán los segmentos de la ruta, como `foo/bar`. Estos pueden combinarse con otros parámetros (por ejemplo, `/post/:id/**`) para manejar configuraciones de rutas más complejas.

```ts
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Asumiendo que esto retorna ['1', '2', '3']

      return ids.map(id => ({ id })); // Genera rutas como: /post/1, /post/2, /post/3
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { id: '1', '**': 'foo/3' },
        { id: '2', '**': 'bar/4' },
      ]; // Genera rutas como: /post/1/foo/3, /post/2/bar/4
    },
  },
];
```

Dado que [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') aplica exclusivamente a [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), esta función siempre se ejecuta en _tiempo de compilación_. `getPrerenderParams` no debe depender de ninguna API específica del navegador o del servidor para obtener datos.

IMPORTANTE: Cuando se use [`inject`](api/core/inject 'API reference') dentro de `getPrerenderParams`, recuerda que `inject` debe usarse de forma síncrona. No puede invocarse dentro de callbacks asíncronos ni después de ninguna instrucción `await`. Para más información, consulta `runInInjectionContext`.

#### Estrategias de alternativa

Cuando se usa el modo [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), puedes especificar una estrategia de alternativa para gestionar las peticiones de rutas que no han sido pre-renderizadas.

Las estrategias de alternativa disponibles son:

- **Server:** Recurre a la renderización del lado del servidor. Este es el comportamiento **predeterminado** si no se especifica ninguna propiedad `fallback`.
- **Client:** Recurre a la renderización del lado del cliente.
- **None:** Sin alternativa. Angular no gestionará las peticiones de rutas que no estén pre-renderizadas.

```ts
// app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Recurre a CSR si no está pre-renderizado
    async getPrerenderParams() {
      // Esta función retorna un array de objetos que representan posts pre-renderizados en las rutas:
      // `/post/1`, `/post/2`, y `/post/3`.
      // La ruta `/post/4` utilizará el comportamiento de alternativa si es solicitada.
      return [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
];
```

## Creando componentes compatibles con el servidor

Algunas APIs y capacidades comunes del navegador pueden no estar disponibles en el servidor. Las aplicaciones no pueden hacer uso de objetos globales específicos del navegador como `window`, `document`, `navigator` o `location`, así como ciertas propiedades de `HTMLElement`.

En general, el código que depende de símbolos específicos del navegador solo debe ejecutarse en el navegador, no en el servidor. Esto puede aplicarse mediante los hooks de ciclo de vida `afterEveryRender` y `afterNextRender`. Estos solo se ejecutan en el navegador y se omiten en el servidor.

```angular-ts
import { Component, viewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  contentRef = viewChild.required<ElementRef>('content');

  constructor() {
    afterNextRender(() => {
      // Es seguro verificar `scrollHeight` porque esto solo se ejecutará en el navegador, no en el servidor.
      console.log('content height: ' + this.contentRef().nativeElement.scrollHeight);
    });
  }
}
```

## Configurando proveedores en el servidor

En el lado del servidor, los valores de los proveedores de nivel superior se establecen una vez cuando el código de la aplicación se parsea y evalúa inicialmente.
Esto significa que los proveedores configurados con `useValue` mantendrán su valor entre múltiples peticiones, hasta que la aplicación del servidor se reinicie.

Si deseas generar un nuevo valor para cada petición, usa un proveedor factory con `useFactory`. La función factory se ejecutará para cada petición entrante, asegurando que se cree un nuevo valor y se asigne al token cada vez.

## Accediendo a Document mediante DI

Cuando se trabaja con renderización del lado del servidor, debes evitar referenciar directamente objetos globales específicos del navegador como `document`. En su lugar, usa el token [`DOCUMENT`](api/core/DOCUMENT) para acceder al objeto document de una manera agnóstica a la plataforma.

```ts
import { Injectable, inject, DOCUMENT } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CanonicalLinkService {
  private readonly document = inject(DOCUMENT);

  // Durante la renderización en el servidor, inyecta una etiqueta <link rel="canonical">
  // para que el HTML generado incluya la URL canónica correcta
  setCanonical(href: string): void {
    const link = this.document.createElement('link');
    link.rel = 'canonical';
    link.href = href;
    this.document.head.appendChild(link);
  }
}

```

ÚTIL: Para gestionar metaetiquetas, Angular proporciona el servicio `Meta`.

## Accediendo a Request y Response mediante DI

El paquete `@angular/core` proporciona varios tokens para interactuar con el entorno de renderización del lado del servidor. Estos tokens te dan acceso a información crucial y objetos dentro de tu aplicación Angular durante SSR.

- **[`REQUEST`](api/core/REQUEST 'API reference'):** Proporciona acceso al objeto de petición actual, que es de tipo [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) de la Web API. Esto te permite acceder a encabezados, cookies y otra información de la petición.
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** Proporciona acceso a las opciones de inicialización de la respuesta, que es de tipo [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters) de la Web API. Esto te permite establecer encabezados y el código de estado para la respuesta de forma dinámica. Usa este token para establecer encabezados o códigos de estado que necesiten determinarse en tiempo de ejecución.
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** Proporciona acceso a contexto adicional relacionado con la petición actual. Este contexto puede pasarse como el segundo parámetro de la función [`handle`](api/ssr/AngularAppEngine#handle 'API reference'). Típicamente, se usa para proporcionar información adicional relacionada con la petición que no forma parte de la Web API estándar.

```angular-ts
import { inject, REQUEST } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}
```

IMPORTANTE: Los tokens anteriores serán `null` en los siguientes escenarios:

- Durante los procesos de compilación.
- Cuando la aplicación se renderiza en el navegador (CSR).
- Cuando se realiza generación de sitios estáticos (SSG).
- Durante la extracción de rutas en desarrollo (en el momento de la petición).

## Generar una aplicación completamente estática

De forma predeterminada, Angular pre-renderiza toda tu aplicación y genera un archivo de servidor para gestionar las peticiones. Esto permite que tu aplicación sirva contenido pre-renderizado a los usuarios. Sin embargo, si prefieres un sitio completamente estático sin servidor, puedes optar por no usar este comportamiento estableciendo `outputMode` en `static` en tu archivo de configuración `angular.json`.

Cuando `outputMode` está establecido en `static`, Angular genera archivos HTML pre-renderizados para cada ruta en tiempo de compilación, pero no genera un archivo de servidor ni requiere un servidor Node.js para servir la aplicación. Esto es útil para desplegar en proveedores de alojamiento estático donde no se necesita un servidor backend.

Para configurar esto, actualiza tu archivo `angular.json` de la siguiente manera:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

## Almacenando datos en caché al usar HttpClient

`HttpClient` almacena en caché las peticiones de red salientes cuando se ejecuta en el servidor. Esta información se serializa y transfiere al navegador como parte del HTML inicial enviado desde el servidor. En el navegador, `HttpClient` verifica si tiene datos en la caché y, de ser así, los reutiliza en lugar de realizar una nueva petición HTTP durante la renderización inicial de la aplicación. `HttpClient` deja de usar la caché una vez que la aplicación se vuelve [estable](api/core/ApplicationRef#isStable) mientras se ejecuta en un navegador.

### Configurando las opciones de caché

Puedes personalizar cómo Angular almacena en caché las respuestas HTTP durante la renderización del lado del servidor (SSR) y las reutiliza durante la hidratación configurando `HttpTransferCacheOptions`.
Esta configuración se proporciona globalmente usando `withHttpTransferCacheOptions` dentro de `provideClientHydration()`.

De forma predeterminada, `HttpClient` almacena en caché todas las peticiones `HEAD` y `GET` que no contienen encabezados `Authorization` o `Proxy-Authorization`. Puedes sobrescribir esas configuraciones usando `withHttpTransferCacheOptions` en la configuración de hidratación.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includeHeaders: ['ETag', 'Cache-Control'],
        filter: (req) => !req.url.includes('/api/profile'),
        includePostRequests: true,
        includeRequestsWithAuthHeaders: false,
      }),
    ),
  ],
});
```

---

### `includeHeaders`

Especifica qué encabezados de la respuesta del servidor deben incluirse en las entradas almacenadas en caché.
De forma predeterminada no se incluye ningún encabezado.

```ts
withHttpTransferCacheOptions({
  includeHeaders: ['ETag', 'Cache-Control'],
});
```

IMPORTANTE: Evita incluir encabezados sensibles como tokens de autenticación. Estos pueden filtrar datos específicos del usuario entre peticiones.

---

### `includePostRequests`

De forma predeterminada, solo se almacenan en caché las peticiones `GET` y `HEAD`.
Puedes habilitar el almacenamiento en caché para peticiones `POST` cuando se usan como operaciones de lectura, como consultas GraphQL.

```ts
withHttpTransferCacheOptions({
  includePostRequests: true,
});
```

Usa esto solo cuando las peticiones `POST` sean **idempotentes** y seguras para reutilizar entre renderizaciones del servidor y del cliente.

---

### `includeRequestsWithAuthHeaders`

Determina si las peticiones que contienen encabezados `Authorization` o `Proxy‑Authorization` son elegibles para el almacenamiento en caché.
De forma predeterminada, estas se excluyen para evitar el almacenamiento en caché de respuestas específicas del usuario.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithAuthHeaders: true,
});
```

Habilita esto solo cuando los encabezados de autenticación **no** afecten el contenido de la respuesta (por ejemplo, tokens públicos para APIs de analíticas).

### Anulaciones por petición

Puedes anular el comportamiento de caché para una petición específica usando la opción de petición `transferCache`.

```ts
// Incluir encabezados específicos para esta petición
http.get('/api/profile', { transferCache: { includeHeaders: ['CustomHeader'] } });
```

### Deshabilitando la caché

Puedes deshabilitar el almacenamiento en caché HTTP de las peticiones enviadas desde el servidor de forma global o individual.

#### Globalmente

Para deshabilitar la caché para todas las peticiones en tu aplicación, usa la característica `withNoHttpTransferCache`:

```ts
import { bootstrapApplication, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withNoHttpTransferCache())
  ]
});
```

#### `filter`

También puedes deshabilitar selectivamente la caché para ciertas peticiones usando la opción [`filter`](api/common/http/HttpTransferCacheOptions) en `withHttpTransferCacheOptions`. Por ejemplo, puedes deshabilitar la caché para un endpoint específico de la API:

```ts
import { bootstrapApplication, provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({
      filter: (req) => !req.url.includes('/api/sensitive-data')
    }))
  ]
});
```

Usa esta opción para excluir endpoints con datos específicos del usuario o dinámicos (por ejemplo, `/api/profile`).

#### Individualmente

Para deshabilitar la caché para una petición individual, puedes especificar la opción [`transferCache`](api/common/http/HttpRequest#transferCache) en un `HttpRequest`.

```ts
httpClient.get('/api/sensitive-data', { transferCache: false });
```

## Configurando un servidor

### Node.js

`@angular/ssr/node` extiende `@angular/ssr` específicamente para entornos Node.js. Proporciona APIs que facilitan la implementación de la renderización del lado del servidor dentro de tu aplicación Node.js. Para una lista completa de funciones y ejemplos de uso, consulta la referencia de API de [`@angular/ssr/node`](api/ssr/node/AngularNodeAppEngine).

```ts
// server.ts
import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // Pasar el control al siguiente middleware
      }
    })
    .catch(next);
});

/**
 * El manejador de peticiones usado por Angular CLI (servidor de desarrollo y durante la compilación).
 */
export const reqHandler = createNodeRequestHandler(app);
```

### Non-Node.js

`@angular/ssr` proporciona APIs esenciales para renderizar tu aplicación Angular del lado del servidor en plataformas distintas a Node.js. Aprovecha los objetos estándar [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) y [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) de la Web API, lo que te permite integrar Angular SSR en diversos entornos de servidor. Para información detallada y ejemplos, consulta la referencia de API de [`@angular/ssr`](api/ssr/AngularAppEngine).

```ts
// server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * Este es un manejador de peticiones usado por Angular CLI (servidor de desarrollo y durante la compilación).
 */
export const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response|null = await angularApp.render(req);

  // ...
});
```
