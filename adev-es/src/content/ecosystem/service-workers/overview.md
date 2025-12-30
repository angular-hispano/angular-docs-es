# Visión general del service worker de Angular

IMPORTANTE: El service worker de Angular es una utilidad básica de caché para ofrecer soporte sin conexión sencillo con un conjunto limitado de características. No aceptaremos nuevas funcionalidades, salvo correcciones de seguridad. Para capacidades más avanzadas de caché y trabajo sin conexión, te recomendamos explorar directamente las API nativas del navegador.

Los service workers complementan el modelo tradicional de despliegue web y permiten que las aplicaciones ofrezcan una experiencia de usuario con la confiabilidad y el rendimiento propios del código diseñado para ejecutarse en tu sistema operativo y hardware.
Agregar un service worker a una aplicación Angular es uno de los pasos para convertirla en una [aplicación web progresiva](https://web.dev/progressive-web-apps/) (PWA).

En su forma más simple, un service worker es un script que se ejecuta en el navegador web y gestiona la caché de una aplicación.

Los service workers actúan como un proxy de red.
Interceptan todas las solicitudes HTTP salientes hechas por la aplicación y pueden decidir cómo responderlas.
Por ejemplo, pueden consultar una caché local y entregar una respuesta almacenada si hay una disponible.
El proxy no se limita a las solicitudes realizadas mediante API programáticas, como `fetch`; también incluye los recursos referenciados en HTML e incluso la solicitud inicial a `index.html`.
La caché basada en service workers es completamente programable y no depende de encabezados de caché definidos por el servidor.

A diferencia de los otros scripts que componen una aplicación, como el bundle de la aplicación Angular, el service worker se conserva después de que la persona usuaria cierra la pestaña.
La próxima vez que el navegador carga la aplicación, el service worker se carga primero y puede interceptar cada solicitud de recursos para cargar la aplicación.
Si el service worker está diseñado para hacerlo, puede *satisfacer por completo la carga de la aplicación sin necesidad de acceder a la red*.

Incluso en redes rápidas y confiables, la latencia de ida y vuelta puede introducir demoras significativas al cargar la aplicación.
Usar un service worker para reducir la dependencia de la red puede mejorar significativamente la experiencia de usuario.

## Service workers en Angular

Las aplicaciones Angular, al ser aplicaciones de una sola página, están en una posición ideal para aprovechar las ventajas de los service workers. Angular incluye una implementación de service worker. Las personas desarrolladoras pueden aprovechar este service worker y beneficiarse del aumento de confiabilidad y rendimiento que brinda, sin necesidad de programar con APIs de bajo nivel.

El service worker de Angular está diseñado para optimizar la experiencia de uso de la aplicación en conexiones lentas o poco confiables y, al mismo tiempo, minimizar el riesgo de servir contenido desactualizado.

Para lograrlo, el service worker de Angular sigue estas pautas:

* Almacenar una aplicación en caché es similar a instalar una aplicación nativa.
    La aplicación se guarda en caché como una sola unidad y todos los archivos se actualizan juntos.

* Una aplicación en ejecución continúa usando la misma versión de todos los archivos.
    No empieza a recibir de repente archivos en caché de una versión más reciente, que probablemente serían incompatibles.

* Cuando las personas usuarias actualizan la aplicación, ven la versión totalmente almacenada en caché más reciente.
    Las nuevas pestañas cargan el código más reciente en caché.

* Las actualizaciones suceden en segundo plano, relativamente poco después de que se publican los cambios.
    Se sirve la versión anterior de la aplicación hasta que la actualización se instala y está lista.

* El service worker conserva el ancho de banda siempre que puede.
    Los recursos solo se descargan si cambiaron.

Para respaldar estos comportamientos, el service worker de Angular carga un archivo *manifest* desde el servidor.
El archivo, llamado `ngsw.json` (no debe confundirse con el [web app manifest](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps/Manifest)), describe los recursos que se deben almacenar en caché e incluye hashes del contenido de cada archivo.
Cuando se distribuye una actualización de la aplicación, el contenido del manifest cambia, lo que informa al service worker que debe descargar y almacenar en caché una nueva versión de la aplicación.
Este manifest se genera a partir de un archivo de configuración creado por la CLI llamado `ngsw-config.json`.

Instalar el service worker de Angular es tan sencillo como [ejecutar un comando de Angular CLI](ecosystem/service-workers/getting-started#adding-a-service-worker-to-your-project).
Además de registrar el service worker de Angular en el navegador, esto también habilita algunos servicios que se pueden inyectar, los cuales interactúan con el service worker y se pueden usar para controlarlo.
Por ejemplo, una aplicación puede solicitar que se le notifique cuando haya una actualización disponible o pedirle al service worker que verifique en el servidor si existen actualizaciones nuevas.

## Antes de comenzar

Para aprovechar todas las funciones de los service workers de Angular, usa las versiones más recientes de Angular y de la [Angular CLI](tools/cli).

Para que los service workers se registren, la aplicación debe accederse mediante HTTPS, no HTTP.
Los navegadores ignoran los service workers en las páginas servidas a través de una conexión insegura.
La razón es que los service workers son bastante potentes, por lo que se debe tener especial cuidado para garantizar que el script del service worker no haya sido manipulado.

Existe una excepción a esta regla: para facilitar el desarrollo local, los navegadores *no* requieren una conexión segura cuando se accede a una aplicación en `localhost`.

### Compatibilidad con navegadores

Para beneficiarte del service worker de Angular, tu aplicación debe ejecutarse en un navegador que admita service workers en general.
Actualmente, los service workers son compatibles con las versiones más recientes de Chrome, Firefox, Edge, Safari, Opera, UC Browser (versión de Android) y Samsung Internet.
Navegadores como IE y Opera Mini no admiten service workers.

Si la persona usuaria accede a tu aplicación con un navegador que no admite service workers, el service worker no se registra y comportamientos relacionados, como la administración de caché sin conexión y las notificaciones push, no se llevarán a cabo.
Más específicamente:

* El navegador no descarga el script del service worker ni el archivo de manifest `ngsw.json`.
* Los intentos activos por interactuar con el service worker, como llamar a `SwUpdate.checkForUpdate()`, devuelven promesas rechazadas.
* No se disparan los eventos observables de los servicios relacionados, como `SwUpdate.available`.

Se recomienda encarecidamente que te asegures de que tu aplicación funcione incluso sin soporte de service worker en el navegador.
Aun cuando un navegador sin compatibilidad ignora la caché del service worker, seguirá reportando errores si la aplicación intenta interactuar con él.
Por ejemplo, llamar a `SwUpdate.checkForUpdate()` devuelve promesas rechazadas.
Para evitar ese error, verifica si el service worker de Angular está habilitado usando `SwUpdate.isEnabled`.

Para obtener más información sobre los navegadores preparados para service workers, consulta la página [Can I Use](https://caniuse.com/#feat=serviceworkers) y la [documentación de MDN](https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API).

## Recursos relacionados

El resto de los artículos de esta sección abordan específicamente la implementación de service workers en Angular.

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Archivo de configuración"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunícate con el Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Notificaciones push"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="Patrón App shell"/>
</docs-pill-row>

Para obtener más información acerca de los service workers en general, consulta [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers).

Para obtener más detalles sobre la compatibilidad con navegadores, revisa la sección [browser support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) de [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers), la página [Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready) de Jake Archibald y [Can I Use](https://caniuse.com/serviceworkers).

Para recomendaciones y ejemplos adicionales, consulta:

<docs-pill-row>
  <docs-pill href="https://web.dev/precaching-with-the-angular-service-worker" title="Precaching con Angular Service Worker"/>
  <docs-pill href="https://web.dev/creating-pwa-with-angular-cli" title="Crear una PWA con Angular CLI"/>
</docs-pill-row>

## Próximo paso

Para comenzar a usar los service workers de Angular, consulta [Getting Started with service workers](ecosystem/service-workers/getting-started).
