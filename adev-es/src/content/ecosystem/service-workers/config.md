# Archivo de configuración del Service Worker

Este tema describe las propiedades del archivo de configuración del service worker.

## Modificar la configuración

El archivo de configuración JSON `ngsw-config.json` especifica qué archivos y URL de datos debe almacenar en caché el service worker de Angular y cómo debe actualizar los archivos y datos almacenados.
La [Angular CLI](tools/cli) procesa este archivo de configuración durante `ng build`.

Todas las rutas de archivo deben comenzar con `/`, que corresponde al directorio de despliegue (generalmente `dist/<project-name>` en proyectos creados con la CLI).

A menos que se indique lo contrario, los patrones utilizan un formato de glob **limitado*** que internamente se convierte en expresiones regulares:

| Formatos de glob | Detalles |
|:---              |:---     |
| `**`             | Coincide con 0 o más segmentos de ruta                                                                        |
| `*`              | Coincide con 0 o más caracteres excluyendo `/`                                                                 |
| `?`              | Coincide con exactamente un carácter excluyendo `/`                                                            |
| Prefijo `!`      | Marca el patrón como negativo, lo que significa que solo se incluyen los archivos que no coincidan con el patrón |

<docs-callout important title="Los caracteres especiales deben escaparse">
Ten en cuenta que algunos caracteres con significado especial en una expresión regular no se escapan y que el patrón tampoco se envuelve en `^`/`$` durante la conversión interna de glob a regex.

`$` es un carácter especial en regex que coincide con el final de la cadena y no se escapará automáticamente al convertir el patrón glob a expresión regular.

Si quieres coincidir literalmente con el carácter `$`, debes escaparlo manualmente (con `\$`). Por ejemplo, el patrón glob `/foo/bar/$value` produce una expresión imposible de hacer coincidir, porque no puede existir ninguna cadena después del final de la cadena.

El patrón tampoco se envolverá automáticamente en `^` y `$` al convertirlo en una expresión regular. Por lo tanto, los patrones coincidirán parcialmente con las URL de solicitud.

Si deseas que tus patrones coincidan con el inicio y/o el final de las URL, puedes agregar `^`/`$` manualmente. Por ejemplo, el patrón glob `/foo/bar/*.js` coincidirá tanto con archivos `.js` como `.json`. Si quieres coincidir únicamente con archivos `.js`, usa `/foo/bar/*.js$`.
</docs-callout>

Ejemplos de patrones:

| Patrones      | Detalles |
|:---           |:---     |
| `/**/*.html`  | Especifica todos los archivos HTML              |
| `/*.html`     | Especifica solo los archivos HTML en la raíz    |
| `!/**/*.map`  | Excluye todos los sourcemaps                    |

## Propiedades de configuración del service worker

Las siguientes secciones describen cada propiedad del archivo de configuración.

### `appData`

Esta sección te permite pasar cualquier dato que describa esta versión particular de la aplicación.
El servicio `SwUpdate` incluye esos datos en las notificaciones de actualización.
Muchas aplicaciones usan esta sección para proporcionar información adicional que se muestra en pop-ups de la interfaz de usuario cuando se notifica a las personas usuarias sobre una actualización disponible.

### `index`

Especifica el archivo que actúa como página de índice para atender las solicitudes de navegación.
Por lo general, es `/index.html`.

### `assetGroups`

Los *assets* son recursos que forman parte de la versión de la aplicación y se actualizan junto con ella.
Pueden incluir recursos cargados desde el origen de la página, así como recursos de terceros cargados desde CDNs y otras URLs externas.
Como no todas esas URL externas pueden conocerse en tiempo de compilación, se pueden usar patrones de URL.

ÚTIL: Para que el service worker pueda manejar recursos cargados desde distintos orígenes, asegúrate de que [CORS](https://developer.mozilla.org/es/docs/Web/HTTP/Guides/CORS) esté configurado correctamente en el servidor de cada origen.

Este campo contiene un arreglo de grupos de assets; cada uno define un conjunto de recursos y la política mediante la cual se almacenan en caché.

<docs-code language="json">

{
  "assetGroups": [
    {
      …
    },
    {
      …
    }
  ]
}

</docs-code>

ÚTIL: Cuando el ServiceWorker gestiona una solicitud, revisa los grupos de assets en el orden en que aparecen en `ngsw-config.json`.
El primer grupo de assets que coincide con el recurso solicitado se encarga de la solicitud.

Es recomendable colocar los grupos de assets más específicos en la parte superior de la lista.
Por ejemplo, un grupo de assets que coincide con `/foo.js` debería aparecer antes que uno que coincida con `*.js`.

Cada grupo de assets especifica tanto un conjunto de recursos como la política que los rige.
Esta política determina cuándo se obtienen los recursos y qué sucede cuando se detectan cambios.

Los grupos de assets siguen la interfaz de TypeScript que se muestra aquí:

<docs-code language="typescript">

interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    urls?: string[];
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}

</docs-code>

Cada `AssetGroup` se define mediante las siguientes propiedades.

#### `name`

`name` es obligatorio.
Identifica este grupo de assets en particular entre versiones de la configuración.

#### `installMode`

`installMode` determina cómo se almacenan inicialmente estos recursos en caché.
`installMode` puede tomar uno de dos valores:

| Valores     | Detalles |
|:---         |:---     |
| `prefetch`  | Indica al service worker de Angular que obtenga cada recurso listado mientras almacena en caché la versión actual de la aplicación. Esto consume mucho ancho de banda, pero garantiza que los recursos estén disponibles siempre que se soliciten, incluso si el navegador está sin conexión. |
| `lazy`      | No almacena ninguno de los recursos por adelantado. En su lugar, el service worker de Angular solo guarda en caché los recursos que recibe en las solicitudes. Es un modo de caché bajo demanda. Los recursos que nunca se solicitan no se almacenan. Es útil para elementos como imágenes en distintas resoluciones, de modo que el service worker solo almacena en caché los assets correctos para la pantalla y orientación específicas. |

El valor predeterminado es `prefetch`.

#### `updateMode`

Para los recursos que ya están en caché, `updateMode` determina el comportamiento de caché cuando se descubre una nueva versión de la aplicación.
Cualquier recurso del grupo que haya cambiado desde la versión anterior se actualiza según `updateMode`.

| Valores     | Detalles |
|:---         |:---     |
| `prefetch`  | Indica al service worker que descargue y almacene en caché los recursos modificados de inmediato. |
| `lazy`      | Indica al service worker que no almacene esos recursos en caché. En su lugar, los trata como si no se hubieran solicitado y espera hasta que vuelvan a pedirse para actualizarlos. Un `updateMode` de `lazy` solo es válido si `installMode` también es `lazy`. |

El valor predeterminado es el que se defina en `installMode`.

#### `resources`

Esta sección describe los recursos que se almacenarán en caché, divididos en los siguientes grupos:

| Grupos de recursos | Detalles |
|:---                 |:---     |
| `files`             | Lista patrones que coinciden con archivos en el directorio de distribución. Estos pueden ser archivos individuales o patrones de tipo glob que coincidan con varios archivos. |
| `urls`              | Incluye tanto URL como patrones de URL que se comparan en tiempo de ejecución. Estos recursos no se obtienen directamente y no tienen hashes de contenido, pero se almacenan en caché de acuerdo con sus encabezados HTTP. Es especialmente útil para CDNs como el servicio de Google Fonts. <br />  *(No se admiten patrones glob negativos y `?` se compara literalmente; es decir, no coincide con ningún carácter que no sea `?`).* |

#### `cacheQueryOptions`

Estas opciones se usan para modificar el comportamiento de coincidencia de las solicitudes.
Se pasan a la función `Cache#match` de los navegadores.
Consulta [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match) para obtener detalles.
Actualmente, solo se admiten las siguientes opciones:

| Opciones        | Detalles |
|:---             |:---     |
| `ignoreSearch`  | Ignora los parámetros de consulta. El valor predeterminado es `false`. |

### `dataGroups`

A diferencia de los recursos de tipo asset, las solicitudes de datos no se versionan junto con la aplicación.
Se almacenan en caché según políticas configuradas manualmente que resultan más útiles en situaciones como solicitudes a APIs y otras dependencias de datos.

Este campo contiene un arreglo de grupos de datos; cada uno define un conjunto de recursos de datos y la política con la que se almacenan en caché.

<docs-code language="json">

{
  "dataGroups": [
    {
      …
    },
    {
      …
    }
  ]
}

</docs-code>

ÚTIL: Cuando el ServiceWorker gestiona una solicitud, revisa los grupos de datos en el orden en que aparecen en `ngsw-config.json`.
El primer grupo de datos que coincide con el recurso solicitado se encarga de la solicitud.

Se recomienda colocar los grupos de datos más específicos en la parte superior de la lista.
Por ejemplo, un grupo que coincida con `/api/foo.json` debería aparecer antes que uno que coincida con `/api/*.json`.

Los grupos de datos siguen la siguiente interfaz de TypeScript:

<docs-code language="typescript">

export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    refreshAhead?: string;
    strategy?: 'freshness' | 'performance';
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}

</docs-code>

Cada `DataGroup` se define mediante las siguientes propiedades.

#### `name`

De forma similar a `assetGroups`, cada grupo de datos tiene un `name` que lo identifica de manera única.

#### `urls`

Una lista de patrones de URL.
Las URL que coinciden con estos patrones se almacenan en caché según la política de este grupo de datos.
Solo se almacenan en caché las solicitudes no mutables (GET y HEAD).

* No se admiten patrones glob negativos
* `?` se compara literalmente; es decir, coincide *solo* con el carácter `?`

#### `version`

Ocasionalmente, las APIs cambian de formato de una manera que no es retrocompatible.
Una nueva versión de la aplicación podría no ser compatible con el formato antiguo de la API y, por lo tanto, no ser compatible con los recursos existentes almacenados en caché de esa API.

`version` ofrece un mecanismo para indicar que los recursos almacenados en caché se actualizaron de forma no retrocompatible y que las entradas antiguas de la caché—es decir, las versiones anteriores—deben descartarse.

`version` es un campo entero y el valor predeterminado es `1`.

#### `cacheConfig`

Las siguientes propiedades definen la política según la cual las solicitudes coincidentes se almacenan en caché.

##### `maxSize`

El número máximo de entradas o respuestas en la caché.

CRÍTICO: Las cachés sin límites pueden crecer indefinidamente y, finalmente, exceder las cuotas de almacenamiento, lo que se traduce en expulsiones.

##### `maxAge`

El parámetro `maxAge` indica cuánto tiempo pueden permanecer las respuestas en la caché antes de considerarse inválidas y ser expulsadas. `maxAge` es una cadena de duración con los siguientes sufijos de unidad:

| Sufijos | Detalles |
|:---     |:---     |
| `d`     | Días          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milisegundos  |

Por ejemplo, la cadena `3d12h` almacena contenido hasta por tres días y medio.

##### `timeout`

Esta cadena de duración especifica el tiempo de espera de red.
Es el tiempo que el service worker de Angular espera la respuesta de la red antes de usar una respuesta en caché, si está configurado para hacerlo.
`timeout` es una cadena de duración con los siguientes sufijos:

| Sufijos | Detalles |
|:---     |:---     |
| `d`     | Días          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milisegundos  |

Por ejemplo, la cadena `5s30u` equivale a cinco segundos y 30 milisegundos de tiempo de espera de red.

##### `refreshAhead`

Esta cadena de duración especifica cuánto tiempo antes de que expire un recurso almacenado en caché debe intentar el service worker de Angular actualizarlo proactivamente desde la red.
`refreshAhead` es opcional y determina cuánto antes de la expiración de la respuesta almacenada el service worker debe iniciar una solicitud para actualizar el recurso desde la red.

| Sufijos | Detalles |
|:---     |:---     |
| `d`     | Días          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milisegundos  |

Por ejemplo, la cadena `1h30m` significa una hora y 30 minutos antes del tiempo de expiración.

##### `strategy`

El service worker de Angular puede usar una de dos estrategias de caché para los recursos de datos.

| Estrategias de caché | Detalles |
|:---                  |:---     |
| `performance`        | Es la opción predeterminada y optimiza para respuestas lo más rápidas posible. Si existe un recurso en la caché, se usa la versión almacenada y no se realiza ninguna solicitud de red. Esto permite cierta obsolescencia, según `maxAge`, a cambio de un mejor rendimiento. Es adecuada para recursos que no cambian con frecuencia, como imágenes de avatar de usuario. |
| `freshness`          | Optimiza para la frescura de los datos, priorizando la obtención de la información solicitada desde la red. Solo si la red excede el tiempo de espera definido en `timeout` la solicitud recurre a la caché. Es útil para recursos que cambian con frecuencia, como saldos de cuentas. |

ÚTIL: También puedes emular una tercera estrategia, [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate), que devuelve datos cacheados si están disponibles, pero también obtiene datos frescos de la red en segundo plano para la próxima vez.
Para usar esta estrategia, establece `strategy` en `freshness` y `timeout` en `0u` dentro de `cacheConfig`.

Esto, en esencia, realiza lo siguiente:

1. Intenta obtener los datos desde la red primero.
2. Si la solicitud de red no se completa inmediatamente (es decir, después de un tiempo de espera de 0 ms), ignora la antigüedad de la caché y recurre al valor almacenado.
3. Una vez que la solicitud de red finaliza, actualiza la caché para futuras solicitudes.
4. Si el recurso no existe en la caché, espera igualmente la respuesta de la red.

##### `cacheOpaqueResponses`

Indica si el service worker de Angular debe almacenar o no respuestas opacas.

Si no se especifica, el valor predeterminado depende de la estrategia configurada para el grupo de datos:

| Estrategias                           | Detalles |
|:---                                   |:---     |
| Grupos con la estrategia `freshness`  | El valor predeterminado es `true` y el service worker almacena respuestas opacas. Estos grupos solicitarán los datos cada vez y solo recurrirán a la respuesta en caché cuando estén sin conexión o en una red lenta. Por lo tanto, no importa si el service worker almacena una respuesta de error. |
| Grupos con la estrategia `performance`| El valor predeterminado es `false` y el service worker no almacena respuestas opacas. Estos grupos seguirían devolviendo una respuesta cacheada hasta que `maxAge` expire, incluso si el error se debe a un problema temporal de red o del servidor. Por ello, sería problemático que el service worker almacenara una respuesta de error. |

<docs-callout title="Comentario sobre respuestas opacas">
Si no estás familiarizado, una [respuesta opaca](https://fetch.spec.whatwg.org#concept-filtered-response-opaque) es un tipo especial de respuesta que se devuelve cuando se solicita un recurso en un origen distinto que no retorna encabezados CORS.
Una de las características de una respuesta opaca es que al service worker no se le permite leer su estado, es decir, no puede verificar si la solicitud se realizó correctamente.
Consulta [Introduction to `fetch()`](https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types) para más detalles.

Si no puedes implementar CORS—por ejemplo, si no controlas el origen—prefiere usar la estrategia `freshness` para los recursos que resulten en respuestas opacas.
</docs-callout>

#### `cacheQueryOptions`

Consulta [assetGroups](#assetgroups) para obtener detalles.

### `navigationUrls`

Esta sección opcional te permite especificar una lista personalizada de URL que se redirigirán al archivo de índice.

#### Manejo de solicitudes de navegación

El ServiceWorker redirige las solicitudes de navegación que no coinciden con ningún grupo de `asset` o `data` al [archivo de índice](#index) especificado.
Una solicitud se considera de navegación si:

* Su [método](https://developer.mozilla.org/docs/Web/API/Request/method) es `GET`
* Su [modo](https://developer.mozilla.org/docs/Web/API/Request/mode) es `navigation`
* Acepta una respuesta `text/html`, según el valor del encabezado `Accept`
* Su URL cumple con los siguientes criterios:
  * La URL no debe contener una extensión de archivo (es decir, un `.`) en el último segmento del path
  * La URL no debe contener `__`

ÚTIL: Para configurar si las solicitudes de navegación se envían o no a la red, consulta las secciones [navigationRequestStrategy](#navigationrequeststrategy) y [applicationMaxAge](#application-max-age).

#### Coincidencias de URL de navegación

Aunque estos criterios predeterminados funcionan en la mayoría de los casos, a veces es conveniente configurar reglas diferentes.
Por ejemplo, podrías querer ignorar rutas específicas, como las que no forman parte de la aplicación Angular, y dejarlas pasar al servidor.

Este campo contiene un arreglo de URL y patrones de URL (tipo glob, [como se describió anteriormente](#modificar-la-configuración)) que se comparan en tiempo de ejecución.
Puede contener patrones y URL negativos (es decir, patrones que comienzan con `!`) y no negativos.

Solo las solicitudes cuyas URL coincidan con *alguno* de los patrones o URL no negativos y *ninguno* de los negativos se consideran solicitudes de navegación.
La query de la URL se ignora al hacer esta comparación.

Si se omite el campo, el valor predeterminado es:

<docs-code language="typescript">

[
  '/**',           // Incluir todas las URL.
  '!/**/*.*',      // Excluir URL de archivos (que contienen una extensión en el último segmento).
  '!/**/*__*',     // Excluir URL que contienen `__` en el último segmento.
  '!/**/*__*/**',  // Excluir URL que contienen `__` en cualquier otro segmento.
]

</docs-code>

### `navigationRequestStrategy`

Esta propiedad opcional te permite configurar cómo el service worker maneja las solicitudes de navegación:

<docs-code language="json">

{
  "navigationRequestStrategy": "freshness"
}

</docs-code>

| Posibles valores | Detalles |
|:---              |:---     |
| `'performance'`  | El valor predeterminado. Sirve el [archivo de índice](#index) especificado, que normalmente está almacenado en caché. |
| `'freshness'`    | Envía las solicitudes a la red y recurre al comportamiento de `performance` cuando se está sin conexión. Este valor es útil cuando el servidor redirige las solicitudes de navegación a otro lugar usando un código de estado HTTP `3xx`. Algunas razones para usar este valor incluyen: <ul> <li>Redirigir a un sitio de autenticación cuando la autenticación no la gestiona la aplicación</li> <li>Redirigir URL específicas para evitar romper enlaces o marcadores existentes después de un rediseño</li> <li>Redirigir a un sitio diferente, como una página de estado del servidor, mientras una página está temporalmente caída</li> </ul> |

IMPORTANTE: La estrategia `freshness` suele resultar en más solicitudes al servidor, lo que puede aumentar la latencia de respuesta. Se recomienda usar la estrategia predeterminada `performance` siempre que sea posible.

### `applicationMaxAge`

Esta propiedad opcional te permite configurar cuánto tiempo el service worker almacenará en caché cualquier solicitud. Dentro de `maxAge`, los archivos se entregan desde la caché. Después de ese tiempo, todas las solicitudes se atienden exclusivamente desde la red, incluidos los assets y los datos.
