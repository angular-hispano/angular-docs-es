# Archivo de configuración del Service Worker

Este tema describe las propiedades del archivo de configuración del service worker.

## Modificar la configuración {#modifying-the-configuration}

El archivo de configuración JSON `ngsw-config.json` especifica qué archivos y URLs de datos debe cachear el service worker de Angular y cómo debe actualizar los archivos y datos cacheados.
El [Angular CLI](tools/cli) procesa este archivo de configuración durante `ng build`.

Todas las rutas de archivos deben comenzar con `/`, lo que corresponde al directorio de despliegue — generalmente `dist/<nombre-del-proyecto>` en proyectos CLI.

A menos que se indique lo contrario, los patrones usan un formato glob **limitado\*** que internamente se convertirá en regex:

| Formatos glob | Detalles                                                                                                              |
| :------------ | :-------------------------------------------------------------------------------------------------------------------- |
| `**`          | Coincide con 0 o más segmentos de ruta                                                                                |
| `*`           | Coincide con 0 o más caracteres excluyendo `/`                                                                        |
| `?`           | Coincide exactamente con un carácter excluyendo `/`                                                                   |
| Prefijo `!`   | Marca el patrón como negativo, lo que significa que solo se incluyen archivos que no coincidan con el patrón          |

<docs-callout important title="Los caracteres especiales deben ser escapados">
Ten en cuenta que algunos caracteres con significado especial en una expresión regular no son escapados y el patrón tampoco se envuelve en `^`/`$` en la conversión interna de glob a regex.

`$` es un carácter especial en regex que coincide con el final de la cadena y no se escapará automáticamente al convertir el patrón glob a una expresión regular.

Si deseas hacer coincidir literalmente el carácter `$`, debes escaparlo tú mismo (con `\\$`). Por ejemplo, el patrón glob `/foo/bar/$value` resulta en una expresión sin coincidencia posible, porque es imposible tener una cadena que tenga caracteres después de que haya terminado.

El patrón no se envolverá automáticamente en `^` y `$` al convertirlo a una expresión regular. Por lo tanto, los patrones coincidirán parcialmente con las URLs de solicitud.

Si deseas que tus patrones coincidan con el principio y/o el final de las URLs, puedes agregar `^`/`$` tú mismo. Por ejemplo, el patrón glob `/foo/bar/*.js` coincidirá con archivos `.js` y `.json`. Si solo deseas coincidir con archivos `.js`, usa `/foo/bar/*.js$`.
</docs-callout>

Patrones de ejemplo:

| Patrones     | Detalles                                        |
| :----------- | :---------------------------------------------- |
| `/**/*.html` | Especifica todos los archivos HTML              |
| `/*.html`    | Especifica solo los archivos HTML en la raíz    |
| `!/**/*.map` | Excluye todos los sourcemaps                    |

## Propiedades de configuración del service worker {#service-worker-configuration-properties}

Las siguientes secciones describen cada propiedad del archivo de configuración.

### `appData`

Esta sección te permite pasar cualquier dato que quieras para describir esta versión particular de la aplicación.
El servicio `SwUpdate` incluye esos datos en las notificaciones de actualización.
Muchas aplicaciones usan esta sección para proporcionar información adicional para mostrar popups de UI, notificando a los usuarios sobre la actualización disponible.

### `index`

Especifica el archivo que sirve como página de índice para satisfacer solicitudes de navegación.
Generalmente es `/index.html`.

### `assetGroups`

Los _assets_ son recursos que forman parte de la versión de la aplicación que se actualizan junto con la aplicación.
Pueden incluir recursos cargados desde el origen de la página, así como recursos de terceros cargados desde CDNs y otras URLs externas.
Como no todas esas URLs externas pueden conocerse en el momento de la compilación, se pueden hacer coincidir patrones de URL.

HELPFUL: Para que el service worker maneje recursos cargados desde diferentes orígenes, asegúrate de que [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) esté correctamente configurado en el servidor de cada origen.

Este campo contiene un array de grupos de assets, cada uno de los cuales define un conjunto de recursos de assets y la política por la cual se cachean.

```ts
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
```

HELPFUL: Cuando el ServiceWorker maneja una solicitud, verifica los grupos de assets en el orden en que aparecen en `ngsw-config.json`.
El primer grupo de assets que coincide con el recurso solicitado maneja la solicitud.

Se recomienda colocar los grupos de assets más específicos al principio de la lista.
Por ejemplo, un grupo de assets que coincide con `/foo.js` debería aparecer antes que uno que coincida con `*.js`.

Cada grupo de assets especifica tanto un grupo de recursos como una política que los rige.
Esta política determina cuándo se obtienen los recursos y qué sucede cuando se detectan cambios.

Los grupos de assets siguen la interfaz TypeScript mostrada aquí:

```ts
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
```

Cada `AssetGroup` se define por las siguientes propiedades del grupo de assets.

#### `name`

Un `name` es obligatorio.
Identifica este grupo particular de assets entre versiones de la configuración.

#### `installMode`

El `installMode` determina cómo se cachean inicialmente estos recursos.
El `installMode` puede ser uno de dos valores:

| Valores    | Detalles                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefetch` | Le indica al service worker de Angular que obtenga cada recurso listado mientras cachea la versión actual de la aplicación. Esto consume mucho ancho de banda pero garantiza que los recursos estén disponibles cuando se soliciten, incluso si el navegador está actualmente sin conexión.                                                                                                                   |
| `lazy`     | No cachea ninguno de los recursos de antemano. En cambio, el service worker de Angular solo cachea recursos para los que recibe solicitudes. Este es un modo de caché bajo demanda. Los recursos que nunca se solicitan no se cachean. Esto es útil para cosas como imágenes en diferentes resoluciones, por lo que el service worker solo cachea los assets correctos para la pantalla y orientación específicas. |

Por defecto es `prefetch`.

#### `updateMode`

Para recursos que ya están en la caché, el `updateMode` determina el comportamiento de caché cuando se descubre una nueva versión de la aplicación.
Cualquier recurso en el grupo que haya cambiado desde la versión anterior se actualiza de acuerdo con `updateMode`.

| Valores    | Detalles                                                                                                                                                                                                                                            |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefetch` | Le indica al service worker que descargue y cachee los recursos modificados de inmediato.                                                                                                                                                           |
| `lazy`     | Le indica al service worker que no cachee esos recursos. En cambio, los trata como no solicitados y espera hasta que se soliciten nuevamente antes de actualizarlos. Un `updateMode` de `lazy` solo es válido si el `installMode` también es `lazy`. |

Por defecto es el valor en que está configurado `installMode`.

#### `resources`

Esta sección describe los recursos a cachear, divididos en los siguientes grupos:

| Grupos de recursos | Detalles                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `files`            | Lista patrones que coinciden con archivos en el directorio de distribución. Pueden ser archivos individuales o patrones tipo glob que coinciden con varios archivos.                                                                                                                                                                                                                                                        |
| `urls`             | Incluye tanto URLs como patrones de URL que se hacen coincidir en tiempo de ejecución. Estos recursos no se obtienen directamente y no tienen hashes de contenido, pero se cachean según sus encabezados HTTP. Esto es más útil para CDNs como el servicio Google Fonts. <br /> _(Los patrones glob negativos no son compatibles y `?` se hará coincidir literalmente; es decir, no coincidirá con ningún carácter que no sea `?`.)_ |

#### `cacheQueryOptions`

Estas opciones se usan para modificar el comportamiento de coincidencia de las solicitudes.
Se pasan a la función `Cache#match` del navegador.
Consulta [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match) para más detalles.
Actualmente, solo se admiten las siguientes opciones:

| Opciones       | Detalles                                              |
| :------------- | :---------------------------------------------------- |
| `ignoreSearch` | Ignora los parámetros de consulta. Por defecto `false`. |

### `dataGroups`

A diferencia de los recursos de assets, las solicitudes de datos no están versionadas junto con la aplicación.
Se cachean según políticas configuradas manualmente que son más útiles para situaciones como solicitudes de API y otras dependencias de datos.

Este campo contiene un array de grupos de datos, cada uno de los cuales define un conjunto de recursos de datos y la política por la cual se cachean.

```json
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
```

HELPFUL: Cuando el ServiceWorker maneja una solicitud, verifica los grupos de datos en el orden en que aparecen en `ngsw-config.json`.
El primer grupo de datos que coincide con el recurso solicitado maneja la solicitud.

Se recomienda colocar los grupos de datos más específicos al principio de la lista.
Por ejemplo, un grupo de datos que coincide con `/api/foo.json` debería aparecer antes que uno que coincida con `/api/*.json`.

Los grupos de datos siguen esta interfaz TypeScript:

```ts
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
```

Cada `DataGroup` se define por las siguientes propiedades del grupo de datos.

#### `name`

Similar a `assetGroups`, cada grupo de datos tiene un `name` que lo identifica de forma única.

#### `urls`

Una lista de patrones de URL.
Las URLs que coincidan con estos patrones se cachean de acuerdo con la política de este grupo de datos.
Solo se cachean las solicitudes no mutantes (GET y HEAD).

- Los patrones glob negativos no son compatibles
- `?` se hace coincidir literalmente; es decir, coincide _solo_ con el carácter `?`

#### `version`

Ocasionalmente las APIs cambian sus formatos de manera que no es compatible con versiones anteriores.
Una nueva versión de la aplicación podría no ser compatible con el formato de API anterior y, por lo tanto, podría no ser compatible con los recursos cacheados existentes de esa API.

`version` proporciona un mecanismo para indicar que los recursos que se están cacheando se han actualizado de forma incompatible con versiones anteriores, y que las entradas de caché antiguas —las de versiones anteriores— deben descartarse.

`version` es un campo entero y por defecto es `1`.

#### `cacheConfig`

Las siguientes propiedades definen la política por la que se cachean las solicitudes coincidentes.

##### `maxSize`

El número máximo de entradas, o respuestas, en la caché.

CRITICAL: Las cachés sin límite pueden crecer de manera ilimitada y eventualmente exceder las cuotas de almacenamiento, resultando en expulsión.

##### `maxAge`

El parámetro `maxAge` indica cuánto tiempo se permite que las respuestas permanezcan en la caché antes de considerarse inválidas y ser expulsadas. `maxAge` es una cadena de duración, usando los siguientes sufijos de unidad:

| Sufijos | Detalles      |
| :------ | :------------ |
| `d`     | Días          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milisegundos  |

Por ejemplo, la cadena `3d12h` cachea contenido por hasta tres días y medio.

##### `timeout`

Esta cadena de duración especifica el timeout de red.
El timeout de red es cuánto tiempo espera el service worker de Angular a que la red responda antes de usar una respuesta cacheada, si está configurado para hacerlo.
`timeout` es una cadena de duración, usando los siguientes sufijos de unidad:

| Sufijos | Detalles      |
| :------ | :------------ |
| `d`     | Días          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milisegundos  |

Por ejemplo, la cadena `5s30u` se traduce en cinco segundos y 30 milisegundos de timeout de red.

##### `refreshAhead`

Esta cadena de duración especifica el tiempo previo a la expiración de un recurso cacheado cuando el service worker de Angular debería intentar proactivamente actualizar el recurso desde la red.
La duración `refreshAhead` es una configuración opcional que determina cuánto tiempo antes de la expiración de una respuesta cacheada debe el service worker iniciar una solicitud para actualizar el recurso desde la red.

| Sufijos | Detalles      |
| :------ | :------------ |
| `d`     | Días          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milisegundos  |

Por ejemplo, la cadena `1h30m` se traduce en una hora y 30 minutos antes del tiempo de expiración.

##### `strategy`

El service worker de Angular puede usar cualquiera de dos estrategias de caché para recursos de datos.

| Estrategias de caché | Detalles                                                                                                                                                                                                                                                                                                                                                  |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `performance`        | El valor por defecto, optimiza para respuestas lo más rápidas posible. Si un recurso existe en la caché, se usa la versión cacheada y no se realiza ninguna solicitud de red. Esto permite cierta obsolescencia, dependiendo del `maxAge`, a cambio de un mejor rendimiento. Es adecuado para recursos que no cambian con frecuencia; por ejemplo, imágenes de avatar de usuario. |
| `freshness`          | Optimiza la actualidad de los datos, obteniendo preferentemente los datos solicitados de la red. Solo si la red agota el tiempo de espera, según `timeout`, la solicitud recurre a la caché. Esto es útil para recursos que cambian con frecuencia; por ejemplo, saldos de cuentas.                                                                        |

HELPFUL: También puedes emular una tercera estrategia, [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate), que devuelve datos cacheados si están disponibles, pero también obtiene datos frescos de la red en segundo plano para la próxima vez.
Para usar esta estrategia, configura `strategy` como `freshness` y `timeout` como `0u` en `cacheConfig`.

Esto esencialmente hace lo siguiente:

1. Intentar obtener de la red primero.
2. Si la solicitud de red no se completa de inmediato, es decir, después de un timeout de 0&nbsp;ms, ignorar la antigüedad de la caché y recurrir al valor cacheado.
3. Una vez que la solicitud de red se completa, actualizar la caché para solicitudes futuras.
4. Si el recurso no existe en la caché, esperar la solicitud de red de todos modos.

##### `cacheOpaqueResponses`

Si el service worker de Angular debe cachear respuestas opacas o no.

Si no se especifica, el valor por defecto depende de la estrategia configurada del grupo de datos:

| Estrategias                                 | Detalles                                                                                                                                                                                                                                                                                                                               |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grupos con la estrategia `freshness`        | El valor por defecto es `true` y el service worker cachea respuestas opacas. Estos grupos solicitarán los datos cada vez y solo recurrirán a la respuesta cacheada cuando estén sin conexión o en una red lenta. Por lo tanto, no importa si el service worker cachea una respuesta de error.                                           |
| Grupos con la estrategia `performance`      | El valor por defecto es `false` y el service worker no cachea respuestas opacas. Estos grupos continuarían devolviendo una respuesta cacheada hasta que `maxAge` expire, incluso si el error se debió a un problema temporal de red o servidor. Por lo tanto, sería problemático que el service worker cacheara una respuesta de error. |

<docs-callout title="Comentario sobre respuestas opacas">

En caso de que no estés familiarizado, una [respuesta opaca](https://fetch.spec.whatwg.org#concept-filtered-response-opaque) es un tipo especial de respuesta que se devuelve al solicitar un recurso que está en un origen diferente que no devuelve encabezados CORS.
Una de las características de una respuesta opaca es que el service worker no puede leer su estado, lo que significa que no puede verificar si la solicitud fue exitosa o no.
Consulta [Introducción a `fetch()`](https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types) para más detalles.

Si no puedes implementar CORS — por ejemplo, si no controlas el origen — es preferible usar la estrategia `freshness` para recursos que resulten en respuestas opacas.

</docs-callout>

#### `cacheQueryOptions`

Consulta [assetGroups](#assetgroups) para más detalles.

### `navigationUrls`

Esta sección opcional te permite especificar una lista personalizada de URLs que serán redirigidas al archivo de índice.

#### Manejo de solicitudes de navegación {#handling-navigation-requests}

El ServiceWorker redirige las solicitudes de navegación que no coinciden con ningún grupo de `asset` o `data` al [archivo de índice](#index) especificado.
Una solicitud se considera una solicitud de navegación si:

- Su [método](https://developer.mozilla.org/docs/Web/API/Request/method) es `GET`
- Su [modo](https://developer.mozilla.org/docs/Web/API/Request/mode) es `navigation`
- Acepta una respuesta `text/html` según lo determinado por el valor del encabezado `Accept`
- Su URL coincide con los siguientes criterios:
  - La URL no debe contener una extensión de archivo (es decir, un `.`) en el último segmento de ruta
  - La URL no debe contener `__`

HELPFUL: Para configurar si las solicitudes de navegación se envían a través de la red o no, consulta las secciones [navigationRequestStrategy](#navigationrequeststrategy) y [applicationMaxAge](#applicationmaxage).

#### Hacer coincidir URLs de solicitudes de navegación {#matching-navigation-request-urls}

Aunque estos criterios predeterminados están bien en la mayoría de los casos, a veces es deseable configurar reglas diferentes.
Por ejemplo, es posible que desees ignorar rutas específicas, como las que no forman parte de la aplicación Angular, y pasarlas al servidor.

Este campo contiene un array de URLs y patrones de URL [tipo glob](#modifying-the-configuration) que se hacen coincidir en tiempo de ejecución.
Puede contener tanto patrones negativos (es decir, patrones que comienzan con `!`) como patrones y URLs no negativos.

Solo las solicitudes cuyas URLs coincidan con _cualquiera_ de las URLs/patrones no negativos y _ninguno_ de los negativos se consideran solicitudes de navegación.
La consulta de URL se ignora al hacer la coincidencia.

Si el campo se omite, por defecto es:

```ts
[
  '/**', // Incluir todas las URLs.
  '!/**/*.*', // Excluir URLs de archivos (que contienen una extensión de archivo en el último segmento).
  '!/**/*__*', // Excluir URLs que contienen `__` en el último segmento.
  '!/**/*__*/**', // Excluir URLs que contienen `__` en cualquier otro segmento.
];
```

### `navigationRequestStrategy`

Esta propiedad opcional te permite configurar cómo el service worker maneja las solicitudes de navegación:

```json
{
  "navigationRequestStrategy": "freshness"
}
```

| Valores posibles | Detalles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'performance'`  | La configuración por defecto. Sirve el [archivo de índice](#index) especificado, que generalmente está cacheado.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `'freshness'`    | Pasa las solicitudes a través de la red y recurre al comportamiento `performance` cuando está sin conexión. Este valor es útil cuando el servidor redirige las solicitudes de navegación a otro lugar usando un código de estado HTTP de redirección `3xx`. Las razones para usar este valor incluyen: <ul> <li> Redirigir a un sitio web de autenticación cuando la autenticación no es manejada por la aplicación </li> <li> Redirigir URLs específicas para evitar romper enlaces/marcadores existentes después de un rediseño del sitio web </li> <li> Redirigir a un sitio web diferente, como una página de estado del servidor, mientras una página está temporalmente inactiva </li> </ul> |

IMPORTANT: La estrategia `freshness` generalmente resulta en más solicitudes enviadas al servidor, lo que puede aumentar la latencia de respuesta. Se recomienda usar la estrategia de rendimiento por defecto siempre que sea posible.

### `applicationMaxAge`

Esta propiedad opcional te permite configurar cuánto tiempo el service worker cacheará cualquier solicitud. Dentro del `maxAge`, los archivos se servirán desde la caché. Más allá de eso, todas las solicitudes solo se servirán desde la red, incluidas las solicitudes de assets y datos.
