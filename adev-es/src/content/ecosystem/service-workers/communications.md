# Comunícate con el Service Worker

Habilitar el soporte de service worker implica algo más que registrarlo; también proporciona servicios que puedes usar para interactuar con el service worker y controlar la caché de tu aplicación.

## Servicio `SwUpdate`

El servicio `SwUpdate` te da acceso a eventos que indican cuándo el service worker descubre e instala una actualización disponible para tu aplicación.

El servicio `SwUpdate` admite tres operaciones diferentes:

- Recibir notificaciones cuando se _detecta_ una versión actualizada en el servidor, cuando se _instala y está lista_ para usarse localmente o cuando una _instalación falla_.
- Pedirle al service worker que verifique en el servidor si hay nuevas actualizaciones.
- Pedirle al service worker que active la versión más reciente de la aplicación para la pestaña actual.

### Actualizaciones de versión

`versionUpdates` es una propiedad `Observable` de `SwUpdate` y emite cinco tipos de eventos:

| Tipos de eventos                 | Detalles                                                                                                                                                                                                                  |
|:-------------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VersionDetectedEvent`           | Se emite cuando el service worker detecta una nueva versión de la aplicación en el servidor y está a punto de comenzar a descargarla.                                                                                     |
| `NoNewVersionDetectedEvent`      | Se emite cuando el service worker verifica la versión de la aplicación en el servidor y no encuentra una versión nueva.                                                                                                    |
| `VersionReadyEvent`              | Se emite cuando hay una nueva versión disponible para que los clientes la activen. Puede usarse para notificar a la persona usuaria que hay una actualización disponible o para pedirle que actualice la página.           |
| `VersionInstallationFailedEvent` | Se emite cuando la instalación de una nueva versión falla. Puede utilizarse con fines de registro o monitoreo.                                                                                                             |
| `VersionFailedEvent`             | Se emite cuando una versión encuentra una falla crítica (como errores de hashes rotos) que afecta a todas las personas usuarias que utilizan esa versión. Proporciona detalles del error para depuración y transparencia. |

<docs-code header="log-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/log-update.service.ts" visibleRegion="sw-update"/>

### Verificando actualizaciones

Es posible pedirle al service worker que revise si se desplegó alguna actualización en el servidor.
El service worker busca actualizaciones durante la inicialización y en cada solicitud de navegación—es decir, cuando la persona usuaria navega desde una dirección diferente hacia tu aplicación.
Sin embargo, podrías optar por verificar las actualizaciones manualmente si tu sitio cambia con frecuencia o si quieres que las actualizaciones sucedan según un cronograma.

Hazlo con el método `checkForUpdate()`:

<docs-code header="check-for-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/check-for-update.service.ts"/>

Este método devuelve un `Promise<boolean>` que indica si hay una actualización disponible para activar.
La verificación puede fallar, lo que provocará que la `Promise` se rechace.

<docs-callout important title="Estabilización y registro del service worker">
Para evitar que el renderizado inicial de la página se vea afectado de forma negativa, el servicio del service worker de Angular espera de manera predeterminada hasta 30 segundos a que la aplicación se estabilice antes de registrar el script del ServiceWorker.

Consultar constantemente si hay actualizaciones, por ejemplo, con [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) o con [interval()](https://rxjs.dev/api/index/function/interval) de RxJS, impide que la aplicación se estabilice y evita que el script del ServiceWorker se registre en el navegador hasta que se alcanza el límite máximo de 30 segundos.

Esto aplica a cualquier tipo de sondeo que haga tu aplicación.
Consulta la documentación de [isStable](api/core/ApplicationRef#isStable) para obtener más información.

Evita ese retraso esperando primero a que la aplicación se estabilice antes de comenzar a consultar por actualizaciones, como se muestra en el ejemplo anterior.
Como alternativa, puedes definir una [estrategia de registro](api/service-worker/SwRegistrationOptions#registrationStrategy) diferente para el ServiceWorker.
</docs-callout>

### Actualizando a la versión más reciente

Puedes actualizar una pestaña existente a la versión más reciente recargando la página tan pronto como una nueva versión esté lista.
Para evitar interrumpir el progreso de la persona usuaria, en general es recomendable mostrar un aviso y pedir que confirme si desea recargar la página y actualizar a la versión más reciente:

<docs-code header="prompt-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/prompt-update.service.ts" visibleRegion="sw-version-ready"/>

<docs-callout important title="Seguridad de actualizar sin recargar">
Llamar a `activateUpdate()` actualiza una pestaña a la versión más reciente sin recargar la página, pero esto podría romper la aplicación.

Actualizar sin recargar puede crear una discrepancia de versiones entre el shell de la aplicación y otros recursos de la página, como los chunks cargados de forma diferida, cuyos nombres de archivo pueden cambiar entre versiones.

Debes usar `activateUpdate()` solo si estás seguro de que es seguro para tu caso específico.
</docs-callout>

### Manejar un estado irrecuperable

En algunos casos, la versión de la aplicación que el service worker usa para atender a una persona usuaria puede quedar en un estado roto que no se puede recuperar sin recargar completamente la página.

Por ejemplo, imagina el siguiente escenario:

1. Una persona usuaria abre la aplicación por primera vez y el service worker almacena en caché la versión más reciente de la aplicación.
    Supón que los recursos cacheados de la aplicación incluyen `index.html`, `main.<main-hash-1>.js` y `lazy-chunk.<lazy-hash-1>.js`.

1. La persona usuaria cierra la aplicación y no la abre durante un tiempo.
1. Después de un tiempo, se despliega en el servidor una nueva versión de la aplicación.
    Esta versión más reciente incluye los archivos `index.html`, `main.<main-hash-2>.js` y `lazy-chunk.<lazy-hash-2>.js`.

IMPORTANTE: Los hashes ahora son diferentes porque el contenido de los archivos cambió. La versión anterior ya no está disponible en el servidor.

1. Mientras tanto, el navegador de la persona usuaria decide expulsar `lazy-chunk.<lazy-hash-1>.js` de su caché.
    Los navegadores pueden decidir expulsar recursos específicos (o todos) de una caché para recuperar espacio en disco.
    
1. La persona usuaria vuelve a abrir la aplicación.
    El service worker sirve la última versión que conoce en ese momento, es decir, la versión anterior (`index.html` y `main.<main-hash-1>.js`).

1. En algún momento posterior, la aplicación solicita el bundle diferido `lazy-chunk.<lazy-hash-1>.js`.
1. El service worker no puede encontrar el recurso en la caché (recuerda que el navegador lo expulsó).
    Tampoco puede obtenerlo del servidor (porque el servidor ahora solo tiene `lazy-chunk.<lazy-hash-2>.js` de la versión más reciente).

En el escenario anterior, el service worker no puede servir un recurso que normalmente estaría en caché.
Esa versión particular de la aplicación está rota y no hay forma de corregir el estado del cliente sin recargar la página.
En esos casos, el service worker notifica al cliente enviando un evento `UnrecoverableStateEvent`.
Suscríbete a `SwUpdate#unrecoverable` para recibir la notificación y manejar estos errores.

<docs-code header="handle-unrecoverable-state.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" visibleRegion="sw-unrecoverable-state"/>

## Más sobre los service workers de Angular

También podría interesarte lo siguiente:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Notificaciones push"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
</docs-pill-row>
