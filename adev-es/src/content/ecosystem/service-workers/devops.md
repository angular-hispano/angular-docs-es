# Devops del service worker

Esta página es una referencia para desplegar y dar soporte a aplicaciones en producción que usan el service worker de Angular.
Explica cómo encaja el service worker de Angular en el entorno de producción, cuál es su comportamiento bajo distintas condiciones y qué recursos y mecanismos de seguridad están disponibles.

## Service worker y almacenamiento en caché de recursos de la aplicación

Imagina el service worker de Angular como una caché de reenvío o como un CDN en el borde instalado en el navegador del usuario final.
El service worker responde a las solicitudes que hace la aplicación Angular de recursos o datos desde una caché local, sin necesidad de esperar a la red.
Como cualquier caché, tiene reglas sobre cómo caduca el contenido y cómo se actualiza.

### Versiones de la aplicación

En el contexto de un service worker de Angular, una "versión" es un conjunto de recursos que representan una compilación específica de la aplicación Angular.
Cada vez que se despliega una nueva compilación de la aplicación, el service worker trata esa compilación como una nueva versión.
Esto es cierto incluso si solo se actualizó un archivo.
En un momento dado, el service worker puede tener múltiples versiones de la aplicación en la caché y podría estar sirviéndolas simultáneamente.
Para obtener más información, consulta la sección [Pestañas de la aplicación](#pestañas-de-la-aplicación).

Para preservar la integridad de la aplicación, el service worker de Angular agrupa todos los archivos en una versión conjunta.
Los archivos agrupados en una versión suelen incluir HTML, JS y CSS.
El agrupamiento es esencial para mantener la integridad porque los archivos HTML, JS y CSS con frecuencia se refieren entre sí y dependen de contenido específico.
Por ejemplo, un archivo `index.html` puede tener una etiqueta `<script>` que referencia `bundle.js` y podría intentar llamar a la función `startApp()` definida en ese script.
Cada vez que se sirve esta versión de `index.html`, debe acompañarse del `bundle.js` correspondiente.
Por ejemplo, supón que la función `startApp()` se renombra a `runApp()` en ambos archivos.
En este escenario, no es válido servir el `index.html` antiguo, que llama a `startApp()`, junto con el bundle nuevo, que define `runApp()`.

Esta integridad de archivos es especialmente importante cuando se usa lazy loading.
Un bundle de JS puede referenciar varios chunks diferidos, y los nombres de archivo de esos chunks son exclusivos de la compilación particular de la aplicación.
Si una aplicación en ejecución en la versión `X` intenta cargar un chunk diferido, pero el servidor ya se actualizó a la versión `X + 1`, la carga diferida falla.

El identificador de versión de la aplicación se determina por el contenido de todos los recursos y cambia si alguno de ellos cambia.
En la práctica, la versión se determina por el contenido del archivo `ngsw.json`, que incluye los hashes de todo el contenido conocido.
Si alguno de los archivos cacheados cambia, el hash del archivo cambia en `ngsw.json`. Este cambio hace que el service worker trate el conjunto activo de archivos como una versión nueva.

ÚTIL: El proceso de compilación crea el archivo de manifiesto `ngsw.json` usando la información de `ngsw-config.json`.

Con el comportamiento de versionado del service worker de Angular, un servidor de aplicaciones puede garantizar que la aplicación Angular siempre tenga un conjunto de archivos coherente.

#### Verificaciones de actualización

Cada vez que el usuario abre o actualiza la aplicación, el service worker de Angular verifica si hay actualizaciones revisando si `ngsw.json` cambió.
Si encuentra una actualización, la descarga y la almacena en caché automáticamente, y la sirve la próxima vez que se cargue la aplicación.

### Integridad de los recursos

Uno de los posibles efectos secundarios de un almacenamiento en caché prolongado es guardar accidentalmente un recurso que no es válido.
En una caché HTTP normal, una actualización forzada o el vencimiento de la caché limitan los efectos negativos de almacenar un archivo no válido.
Un service worker ignora esas restricciones y, efectivamente, almacena en caché la aplicación completa durante mucho tiempo.
Es importante que el service worker obtenga el contenido correcto, por lo que conserva hashes de los recursos para mantener su integridad.

#### Contenido con hash

Para asegurar la integridad de los recursos, el service worker de Angular valida los hashes de todos los recursos para los que dispone de un hash.
En una aplicación creada con la [Angular CLI](tools/cli), esto incluye todo lo que haya en el directorio `dist` cubierto por la configuración `src/ngsw-config.json` del usuario.

Si un archivo en particular falla la validación, el service worker intenta volver a obtenerlo usando un parámetro de URL "cache-busting" para evitar el almacenamiento en caché del navegador o de intermediarios.
Si ese contenido también falla la validación, el service worker considera que toda la versión de la aplicación no es válida y deja de servir la aplicación.
Si es necesario, el service worker entra en un modo seguro donde las solicitudes regresan a la red. El service worker no usa su caché si existe un alto riesgo de servir contenido roto, desactualizado o no válido.

Los errores de hash pueden ocurrir por varios motivos:

- Las capas de caché entre el servidor de origen y el usuario final podrían servir contenido obsoleto
- Un despliegue no atómico puede hacer que el service worker de Angular tenga visibilidad de contenido parcialmente actualizado
- Errores durante el proceso de compilación podrían generar recursos actualizados sin que `ngsw.json` se actualice
    Lo inverso también podría suceder: que `ngsw.json` se actualice sin que cambien los recursos.

#### Contenido sin hash

Los únicos recursos que tienen hashes en el manifiesto `ngsw.json` son los recursos que estaban presentes en el directorio `dist` cuando se generó el manifiesto.
Otros recursos, especialmente los que se cargan desde CDNs, tienen contenido que es desconocido en tiempo de compilación o se actualiza con más frecuencia de la que se despliega la aplicación.

Si el service worker de Angular no tiene un hash para verificar que un recurso sea válido, igualmente almacena su contenido en caché. Al mismo tiempo, respeta los encabezados de caché HTTP usando una política de _stale while revalidate_.
El service worker de Angular continúa sirviendo un recurso incluso después de que sus encabezados de caché HTTP indiquen que 
ya no es válido. Al mismo tiempo, intenta actualizar el recurso vencido en segundo plano.
De esta manera, los recursos sin hash que estén rotos no permanecen en la caché más allá de su vida útil configurada.

### Pestañas de la aplicación

Puede ser problemático para una aplicación si la versión de los recursos que recibe cambia repentinamente o sin aviso.
Consulta la sección [Versiones de la aplicación](#versiones-de-la-aplicación) para ver la descripción de este tipo de problemas.

El service worker de Angular ofrece una garantía: una aplicación en ejecución continúa usando la misma versión de la aplicación.
Si se abre otra instancia de la aplicación en una nueva pestaña del navegador, se sirve la versión más reciente de la aplicación.
Como resultado, esa nueva pestaña puede estar ejecutando una versión diferente a la pestaña original.

IMPORTANTE: Esta garantía es **más fuerte** que la que ofrece el modelo de distribución web estándar. Sin un service worker, no hay garantía de que el código cargado de manera diferida pertenezca a la misma versión que el código inicial de la aplicación.

El service worker de Angular puede cambiar la versión de una aplicación en ejecución en condiciones de error, tales como:

- La versión actual deja de ser válida debido a un hash fallido.
- Un error no relacionado provoca que el service worker entre en modo seguro y se desactive temporalmente.

El service worker de Angular limpia las versiones de la aplicación cuando ninguna pestaña las está usando.

Otras razones por las que el service worker puede cambiar la versión de una aplicación en ejecución son eventos normales:

- La página se vuelve a cargar o actualizar.
- La página solicita que se active una actualización de inmediato usando el servicio `SwUpdate`.

### Actualizaciones del service worker

El service worker de Angular es un script pequeño que se ejecuta en los navegadores web.
De vez en cuando, el service worker se actualiza con correcciones de errores y mejoras.

El service worker de Angular se descarga la primera vez que se abre la aplicación y cuando se accede a la aplicación después de un periodo de inactividad.
Si el service worker cambia, se actualiza en segundo plano.

La mayoría de las actualizaciones del service worker de Angular son transparentes para la aplicación. Las cachés antiguas siguen siendo válidas y el contenido se sirve con normalidad.
Ocasionalmente, una corrección de errores o una mejora puede requerir la invalidación de cachés antiguos.
En ese caso, el service worker actualiza la aplicación desde la red de forma transparente.

### Omitir el service worker

En algunos casos, podrías querer omitir el service worker por completo y dejar que el navegador maneje la solicitud.
Un ejemplo es cuando dependes de una característica que actualmente no está soportada en los service workers, como [reportar el progreso en cargas de archivos](https://github.com/w3c/ServiceWorker/issues/1141).

Para omitir el service worker, establece `ngsw-bypass` como encabezado de solicitud o como parámetro de consulta.
El valor del encabezado o del parámetro de consulta se ignora y puede estar vacío u omitirse.

### Solicitudes del service worker cuando el servidor no puede alcanzarse

El service worker procesa todas las solicitudes a menos que se [omita explícitamente](#omitir-el-service-worker).
Dependiendo del estado y la configuración de la caché, el service worker devuelve una respuesta cacheada o envía la solicitud al servidor.
El service worker solo almacena en caché las respuestas a solicitudes no mutables, como `GET` y `HEAD`.

Si el service worker recibe un error del servidor o no obtiene respuesta, retorna un código de error que indica el resultado de la llamada.
Por ejemplo, si el service worker no recibe respuesta, crea un estado [504 Gateway Timeout](https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status/504) para devolverlo. El estado `504` en este ejemplo puede aparecer porque el servidor está sin conexión o el cliente se desconectó.

## Depurar el service worker de Angular

Ocasionalmente, puede ser necesario examinar el service worker de Angular en ejecución para investigar problemas o confirmar que funciona como se espera.
Los navegadores ofrecen herramientas integradas para depurar service workers y el propio service worker de Angular incluye funcionalidades de depuración útiles.

### Ubicar y analizar información de depuración

El service worker de Angular expone información de depuración bajo el directorio virtual `ngsw/`.
Actualmente, la única URL expuesta es `ngsw/state`.
Este es un ejemplo del contenido de esa página de depuración:

<docs-code hideCopy language="shell">

NGSW Debug Info:

Driver version: 13.3.7
Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

Debug log:

</docs-code>

#### Estado del driver

La primera línea indica el estado del driver:

<docs-code hideCopy language="shell">

Driver state: NORMAL ((nominal))

</docs-code>

`NORMAL` indica que el service worker opera con normalidad y no está en un estado degradado.

Existen dos posibles estados degradados:

| Estados degradados          | Detalles |
|:---                         |:---     |
| `EXISTING_CLIENTS_ONLY`     | El service worker no tiene una copia limpia de la versión más reciente de la aplicación. Las versiones cacheadas antiguas son seguras de usar, por lo que las pestañas existentes continúan funcionando desde la caché, pero las nuevas cargas de la aplicación se servirán desde la red. El service worker intentará recuperarse de este estado cuando detecte e instale una nueva versión de la aplicación. Esto ocurre cuando hay un nuevo `ngsw.json` disponible. |
| `SAFE_MODE`                 | El service worker no puede garantizar la seguridad de usar los datos cacheados. Ocurrió un error inesperado o todas las versiones cacheadas no son válidas. Todo el tráfico se sirve desde la red y se ejecuta la menor cantidad posible de código del service worker. |

En ambos casos, la anotación entre paréntesis proporciona el 
error que provocó que el service worker entrara en el estado degradado.

Ambos estados son temporales; solo se conservan durante la vida útil de la [instancia de ServiceWorker](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope).
El navegador a veces finaliza un service worker inactivo para conservar memoria y capacidad de procesamiento, y crea uno nuevo en respuesta a eventos de red.
La nueva instancia comienza en modo `NORMAL`, independientemente del estado de la instancia anterior.

#### Último hash de manifiesto

<docs-code hideCopy language="shell">

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

</docs-code>

Este es el hash SHA1 de la versión más actual de la aplicación conocida por el service worker.

#### Última verificación de actualización

<docs-code hideCopy language="shell">

Last update check: never

</docs-code>

Indica la última vez que el service worker verificó si había una nueva versión o actualización de la aplicación.
`never` indica que el service worker nunca buscó una actualización.

En este ejemplo de depuración, la verificación de actualización está programada, como se explica en la siguiente sección.

#### Versión

<docs-code hideCopy language="shell">

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

</docs-code>

En este ejemplo, el service worker tiene una versión de la aplicación cacheada que se usa para servir dos pestañas distintas.

ÚTIL: Este hash de versión es el "latest manifest hash" listado anteriormente. Ambos clientes están en la versión más reciente. Cada cliente se lista por su ID del API `Clients` del navegador.

#### Cola de tareas inactivas

<docs-code hideCopy language="shell">

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

</docs-code>

La cola de tareas inactivas es la lista de todas las tareas pendientes que ocurren en segundo plano en el service worker.
Si hay tareas en la cola, se listan con una descripción.
En este ejemplo, el service worker tiene una tarea programada: una operación posterior a la inicialización que implica una verificación de actualización y una limpieza de cachés obsoletas.

Los contadores "Last update tick/run" muestran el tiempo desde eventos específicos relacionados con la cola inactiva.
"Last update run" muestra la última vez que se ejecutaron tareas inactivas.
"Last update tick" muestra el tiempo transcurrido desde el último evento después del cual la cola podría procesarse.

#### Registro de depuración

<docs-code hideCopy language="shell">

Debug log:

</docs-code>

Los errores que ocurren dentro del service worker se registran aquí.

### Herramientas para desarrolladores

Navegadores como Chrome proporcionan herramientas para interactuar con service workers.
Estas herramientas pueden ser muy poderosas cuando se usan correctamente, pero hay algunas consideraciones a tener en cuenta.

- Cuando utilizas las herramientas para desarrolladores, el service worker se mantiene ejecutándose en segundo plano y nunca se reinicia.
    Esto puede provocar que el comportamiento con DevTools abierto difiera del que experimentaría una persona usuaria.

- Si observas el visor de Cache Storage, la caché con frecuencia está desactualizada.
    Haz clic derecho en el título de Cache Storage y actualiza las cachés.

- Detener y reiniciar el service worker en el panel de Service Worker dispara una verificación de actualización.

## Seguridad del service worker

Los errores o configuraciones incorrectas podrían causar que el service worker de Angular actúe de maneras inesperadas.
Si esto sucede, el service worker de Angular contiene varios mecanismos de emergencia en caso de que un administrador necesite desactivarlo rápidamente.

### Mecanismo a prueba de fallos

Para desactivar el service worker, cambia el nombre del archivo `ngsw.json` o elimínalo.
Cuando la solicitud del service worker a `ngsw.json` devuelve un `404`, el service worker elimina todas sus cachés y se desregistra, esencialmente autodestruyéndose.

### Safety worker

<!-- vale Angular.Google_Acronyms = NO -->

Un script pequeño, `safety-worker.js`, también está incluido en el paquete NPM `@angular/service-worker`.
Cuando se carga, se desregistra a sí mismo del navegador y elimina las cachés del service worker.
Este script se puede usar como último recurso para eliminar service workers no deseados que ya estén instalados en las páginas de los clientes.

<!-- vale Angular.Google_Acronyms = YES -->

CRÍTICO: No puedes registrar este worker directamente, ya que los clientes antiguos con estado cacheado podrían no ver un `index.html` nuevo que instale el script diferente.

En su lugar, debes servir el contenido de `safety-worker.js` en la URL del script del Service Worker que intentas desregistrar. Debes continuar haciéndolo hasta estar seguro de que todas las personas usuarias han eliminado correctamente el worker antiguo.
Para la mayoría de los sitios, esto significa que deberías servir el safety worker en la URL antigua del Service Worker de forma permanente.
Este script puede usarse para desactivar `@angular/service-worker` y eliminar las cachés correspondientes. También elimina cualquier otro Service Worker que se haya servido en el pasado en tu sitio.

### Cambiar la ubicación de tu aplicación

IMPORTANTE: Los service workers no funcionan detrás de una redirección.
Es posible que ya te hayas encontrado con el error `The script resource is behind a redirect, which is disallowed`.

Esto puede ser un problema si tienes que cambiar la ubicación de tu aplicación.
Si configuras una redirección desde la ubicación anterior, como `example.com`, hacia la nueva ubicación, `www.example.com` en este ejemplo, el worker deja de funcionar.
Además, la redirección ni siquiera se activará para las personas usuarias que cargan el sitio completamente desde el service worker.
El worker antiguo, registrado en `example.com`, intenta actualizarse y envía una solicitud a la ubicación anterior `example.com`. Esta solicitud se redirige a la nueva ubicación `www.example.com` y produce el error: `The script resource is behind a redirect, which is disallowed`.

Para solucionar esto, quizá tengas que desactivar el worker antiguo usando una de las técnicas anteriores: [Mecanismo a prueba de fallos](#mecanismo-a-prueba-de-fallos) o [Safety worker](#safety-worker).

## Más sobre los service workers de Angular

También podría interesarte lo siguiente:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Archivo de configuración"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunícate con el Service Worker"/>
</docs-pill-row>
