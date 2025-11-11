# Visión general del service worker de Angular

IMPORTANTE: El Service Worker de Angular es una utilidad básica de almacenamiento en caché para soporte offline simple con un conjunto de características limitado. No aceptaremos ninguna característica nueva aparte de correcciones de seguridad. Para capacidades de almacenamiento en caché y offline más avanzadas, recomendamos explorar las APIs nativas del navegador directamente.

Los service workers aumentan el modelo tradicional de despliegue web y permiten a las aplicaciones ofrecer una experiencia de usuario con la confiabilidad y rendimiento al nivel del código que se escribe para ejecutarse en tu sistema operativo y hardware.
Agregar un service worker a una aplicación Angular es uno de los pasos para convertir una aplicación en una [Progressive Web App](https://web.dev/progressive-web-apps/) (también conocida como PWA).

En su forma más simple, un service worker es un script que se ejecuta en el navegador web y gestiona el almacenamiento en caché para una aplicación.

Los service workers funcionan como un proxy de red.
Interceptan todas las peticiones HTTP salientes realizadas por la aplicación y pueden elegir cómo responder a ellas.
Por ejemplo, pueden consultar una caché local y entregar una respuesta en caché si una está disponible.
El proxy no se limita a peticiones realizadas a través de APIs programáticas, como `fetch`; también incluye recursos referenciados en HTML e incluso la petición inicial a `index.html`.
El almacenamiento en caché basado en service worker es por lo tanto completamente programable y no depende de los encabezados de caché especificados por el servidor.

A diferencia de los otros scripts que componen una aplicación, como el bundle de la aplicación Angular, el service worker se preserva después de que el usuario cierra la pestaña.
La próxima vez que el navegador carga la aplicación, el service worker se carga primero, y puede interceptar cada petición de recursos para cargar la aplicación.
Si el service worker está diseñado para hacerlo, puede *satisfacer completamente la carga de la aplicación, sin necesidad de la red*.

Incluso a través de una red rápida y confiable, los retrasos de ida y vuelta pueden introducir latencia significativa al cargar la aplicación.
Usar un service worker para reducir la dependencia de la red puede mejorar significativamente la experiencia del usuario.

## Service workers in Angular

Angular applications, as single-page applications, are in a prime position to benefit from the advantages of service workers. Angular ships with a service worker implementation. Angular developers can take advantage of this service worker and benefit from the increased reliability and performance it provides, without needing to code against low-level APIs.

Angular's service worker is designed to optimize the end user experience of using an application over a slow or unreliable network connection, while also minimizing the risks of serving outdated content.

To achieve this, the Angular service worker follows these guidelines:

* Caching an application is like installing a native application.
    The application is cached as one unit, and all files update together.

* A running application continues to run with the same version of all files.
    It does not suddenly start receiving cached files from a newer version, which are likely incompatible.

* When users refresh the application, they see the latest fully cached version.
    New tabs load the latest cached code.

* Updates happen in the background, relatively quickly after changes are published.
    The previous version of the application is served until an update is installed and ready.

* The service worker conserves bandwidth when possible.
    Resources are only downloaded if they've changed.

To support these behaviors, the Angular service worker loads a *manifest* file from the server.
The file, called `ngsw.json` (not to be confused with the [web app manifest](https://developer.mozilla.org/docs/Web/Manifest)), describes the resources to cache and includes hashes of every file's contents.
When an update to the application is deployed, the contents of the manifest change, informing the service worker that a new version of the application should be downloaded and cached.
This manifest is generated from a CLI-generated configuration file called `ngsw-config.json`.

Installing the Angular service worker is as straightforward as [running an Angular CLI command](ecosystem/service-workers/getting-started#adding-a-service-worker-to-your-project).
In addition to registering the Angular service worker with the browser, this also makes a few services available for injection which interact with the service worker and can be used to control it.
For example, an application can ask to be notified when a new update becomes available, or an application can ask the service worker to check the server for available updates.

## Before you start

To make use of all the features of Angular service workers, use the latest versions of Angular and the [Angular CLI](tools/cli).

For service workers to be registered, the application must be accessed over HTTPS, not HTTP.
Browsers ignore service workers on pages that are served over an insecure connection.
The reason is that service workers are quite powerful, so extra care is needed to ensure the service worker script has not been tampered with.

There is one exception to this rule: to make local development more straightforward, browsers do *not* require a secure connection when accessing an application on `localhost`.

### Browser support

To benefit from the Angular service worker, your application must run in a web browser that supports service workers in general.
Currently, service workers are supported in the latest versions of Chrome, Firefox, Edge, Safari, Opera, UC Browser (Android version) and Samsung Internet.
Browsers like IE and Opera Mini do not support service workers.

If the user is accessing your application with a browser that does not support service workers, the service worker is not registered and related behavior such as offline cache management and push notifications does not happen.
More specifically:

* The browser does not download the service worker script and the `ngsw.json` manifest file
* Active attempts to interact with the service worker, such as calling `SwUpdate.checkForUpdate()`, return rejected promises
* The observable events of related services, such as `SwUpdate.available`, are not triggered

It is highly recommended that you ensure that your application works even without service worker support in the browser.
Although an unsupported browser ignores service worker caching, it still reports errors if the application attempts to interact with the service worker.
For example, calling `SwUpdate.checkForUpdate()` returns rejected promises.
To avoid such an error, check whether the Angular service worker is enabled using `SwUpdate.isEnabled`.

To learn more about other browsers that are service worker ready, see the [Can I Use](https://caniuse.com/#feat=serviceworkers) page and [MDN docs](https://developer.mozilla.org/docs/Web/API/Service_Worker_API).

## Related resources

The rest of the articles in this section specifically address the Angular implementation of service workers.

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Configuration file"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Communicating with the Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notifications"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell pattern"/>
</docs-pill-row>

For more information about service workers in general, see [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers).

For more information about browser support, see the [browser support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) section of [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers), Jake Archibald's [Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready), and [Can I Use](https://caniuse.com/serviceworkers).

For additional recommendations and examples, see:

<docs-pill-row>
  <docs-pill href="https://web.dev/precaching-with-the-angular-service-worker" title="Precaching with Angular Service Worker"/>
  <docs-pill href="https://web.dev/creating-pwa-with-angular-cli" title="Creating a PWA with Angular CLI"/>
</docs-pill-row>

## Next step

To begin using Angular service workers, see [Getting Started with service workers](ecosystem/service-workers/getting-started).
