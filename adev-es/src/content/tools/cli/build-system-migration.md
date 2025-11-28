# Sistema de construcción de aplicaciones Angular

En v17 y superior, el nuevo sistema de construcción proporciona una forma mejorada de construir aplicaciones Angular. Este nuevo sistema de construcción incluye:

- Un formato de salida moderno usando ESM, con expresiones de importación dinámica para soportar carga de módulos perezosa.
- Rendimiento de tiempo de construcción más rápido tanto para construcciones iniciales como reconstrucciones incrementales.
- Herramientas más nuevas del ecosistema JavaScript como [esbuild](https://esbuild.github.io/) y [Vite](https://vitejs.dev/).
- Capacidades integradas de SSR y prerendering.
- Reemplazo automático en caliente de hojas de estilo globales y de componentes.

Este nuevo sistema de construcción es estable y completamente soportado para uso con aplicaciones Angular.
Puedes migrar al nuevo sistema de construcción con aplicaciones que usan el builder `browser`.
Si usas un builder personalizado, por favor refiere a la documentación para ese builder sobre posibles opciones de migración.

IMPORTANTE: El sistema de construcción existente basado en webpack todavía se considera estable y completamente soportado.
Las aplicaciones pueden continuar usando el builder `browser` y los proyectos pueden optar por no migrar durante una actualización.

## Para aplicaciones nuevas

Las aplicaciones nuevas usarán este nuevo sistema de construcción por defecto a través del builder `application`.

## Para aplicaciones existentes

Tanto procedimientos automatizados como manuales están disponibles dependiendo de los requisitos del proyecto.
Comenzando con v18, el proceso de actualización preguntará si te gustaría migrar aplicaciones existentes para usar el nuevo sistema de construcción a través de la migración automatizada.
Antes de migrar, por favor considera revisar la sección [Problemas Conocidos](#problemas-conocidos) ya que puede contener información relevante para tu proyecto.

CONSEJO: Recuerda eliminar cualquier suposición CommonJS en el código del servidor de aplicación si usas SSR como `require`, `__filename`, `__dirname`, u otras construcciones del [ámbito de módulo CommonJS](https://nodejs.org/api/modules.html#the-module-scope). Todo el código de aplicación debería ser compatible con ESM. Esto no aplica a dependencias de terceros.

### Migración automatizada (Recomendado)

La migración automatizada ajustará tanto la configuración de la aplicación dentro de `angular.json` como código y hojas de estilo para eliminar el uso de características específicas de webpack previas.
Mientras muchos cambios pueden ser automatizados y la mayoría de las aplicaciones no requerirán cambios adicionales, cada aplicación es única y puede haber algunos cambios manuales requeridos.
Después de la migración, por favor intenta una construcción de la aplicación ya que podría haber nuevos errores que requerirán ajustes dentro del código.
Los errores intentarán proporcionar soluciones al problema cuando sea posible y las secciones posteriores de esta guía describen algunas de las situaciones más comunes que puedes encontrar.
Al actualizar a Angular v18 a través de `ng update`, se te pedirá ejecutar la migración.
Esta migración es completamente opcional para v18 y también se puede ejecutar manualmente en cualquier momento después de una actualización a través del siguiente comando:

```shell

ng update @angular/cli --name use-application-builder

```

La migración hace lo siguiente:

- Convierte el objetivo existente `browser` o `browser-esbuild` a `application`
- Elimina cualquier builder SSR previo (porque `application` hace eso ahora).
- Actualiza la configuración correspondientemente.
- Fusiona `tsconfig.server.json` con `tsconfig.app.json` y agrega la opción TypeScript `"esModuleInterop": true` para asegurar que las importaciones `express` sean [conformes con ESM](#importaciones-predeterminadas-esm-vs-importaciones-de-espacio-de-nombres).
- Actualiza el código del servidor de aplicación para usar la nueva estructura de directorio de salida y bootstrapping.
- Elimina cualquier uso de hoja de estilo del builder específico de webpack como la tilde o caret en `@import`/`url()` y actualiza la configuración para proporcionar comportamiento equivalente
- Convierte para usar el nuevo paquete Node.js `@angular/build` de menor dependencia si no se encuentra otro uso de `@angular-devkit/build-angular`.

### Migración manual

Adicionalmente para proyectos existentes, puedes optar manualmente por usar el nuevo builder en una base por aplicación con dos opciones diferentes.
Ambas opciones se consideran estables y completamente soportadas por el equipo de Angular.
La elección de qué opción usar es un factor de cuántos cambios necesitarás hacer para migrar y qué nuevas características te gustaría usar en el proyecto.

- El builder `browser-esbuild` construye solo el bundle del lado del cliente de una aplicación diseñada para ser compatible con el builder `browser` existente que proporciona el sistema de construcción preexistente.
Este builder proporciona opciones de construcción equivalentes, y en muchos casos, sirve como un reemplazo directo para aplicaciones `browser` existentes.
- El builder `application` cubre una aplicación completa, como el bundle del lado del cliente, así como opcionalmente construir un servidor para renderizado del lado del servidor y realizar prerendering en tiempo de construcción de páginas estáticas.

El builder `application` generalmente es preferido ya que mejora las construcciones de renderizado del lado del servidor (SSR), y hace más fácil para proyectos renderizados del lado del cliente adoptar SSR en el futuro.
Sin embargo requiere un poco más de esfuerzo de migración, particularmente para aplicaciones SSR existentes si se realiza manualmente.
Si el builder `application` es difícil de adoptar para tu proyecto, `browser-esbuild` puede ser una solución más fácil que da la mayoría de los beneficios de rendimiento de construcción con menos cambios disruptivos.

#### Migración manual al builder de compatibilidad

Un builder llamado `browser-esbuild` está disponible dentro del paquete `@angular-devkit/build-angular` que está presente en una aplicación generada por Angular CLI.
Puedes probar el nuevo sistema de construcción para aplicaciones que usan el builder `browser`.
Si usas un builder personalizado, por favor refiere a la documentación para ese builder sobre posibles opciones de migración.

La opción de compatibilidad fue implementada para minimizar la cantidad de cambios necesarios para migrar inicialmente tus aplicaciones.
Esto se proporciona a través de un builder alternativo (`browser-esbuild`).
Puedes actualizar el objetivo `build` para cualquier objetivo de aplicación para migrar al nuevo sistema de construcción.

Lo siguiente es lo que típicamente encontrarías en `angular.json` para una aplicación:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

Cambiar el campo `builder` es el único cambio que necesitarás hacer.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
```

#### Migración manual al nuevo builder `application`

Un builder llamado `application` también está disponible dentro del paquete `@angular-devkit/build-angular` que está presente en una aplicación generada por Angular CLI.
Este builder es el predeterminado para todas las aplicaciones nuevas creadas a través de `ng new`.

Lo siguiente es lo que típicamente encontrarías en `angular.json` para una aplicación:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

Cambiar el campo `builder` es el primer cambio que necesitarás hacer.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
```

Una vez que el nombre del builder ha sido cambiado, las opciones dentro del objetivo `build` necesitarán ser actualizadas.
La siguiente lista discute todas las opciones del builder `browser` que necesitarán ser ajustadas.

- `main` debería ser renombrado a `browser`.
- `polyfills` debería ser un array, en lugar de un solo archivo.
- `buildOptimizer` debería ser eliminado, ya que esto está cubierto por la opción `optimization`.
- `resourcesOutputPath` debería ser eliminado, esto ahora es siempre `media`.
- `vendorChunk` debería ser eliminado, ya que esto fue una optimización de rendimiento que ya no es necesaria.
- `commonChunk` debería ser eliminado, ya que esto fue una optimización de rendimiento que ya no es necesaria.
- `deployUrl` debería ser eliminado y no es soportado. Prefiere [`<base href>`](guide/routing/common-router-tasks) en su lugar. Consulta la [documentación de despliegue](tools/cli/deployment#--deploy-url) para más información.
- `ngswConfigPath` debería ser renombrado a `serviceWorker`.

Si la aplicación no está usando SSR actualmente, este debería ser el paso final para permitir que `ng build` funcione.
Después de ejecutar `ng build` por primera vez, puede haber nuevas advertencias o errores basados en diferencias de comportamiento o uso de características específicas de webpack de la aplicación.
Muchas de las advertencias proporcionarán sugerencias sobre cómo remediar ese problema.
Si parece que una advertencia es incorrecta o la solución no es aparente, por favor abre un issue en [GitHub](https://github.com/angular/angular-cli/issues).
También, las secciones posteriores de esta guía proporcionan información adicional sobre varios casos específicos así como problemas conocidos actuales.

Para aplicaciones nuevas en SSR, la [Guía SSR de Angular](guide/ssr) proporciona información adicional respecto al proceso de configuración para agregar SSR a una aplicación.

Para aplicaciones que ya están usando SSR, se necesitarán ajustes adicionales para actualizar el servidor de aplicación para soportar las nuevas capacidades integradas de SSR.
El builder `application` ahora proporciona la funcionalidad integrada para todos los siguientes builders preexistentes:

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

El proceso `ng update` automáticamente eliminará usos de los paquetes del scope `@nguniversal` donde algunos de estos builders estaban ubicados previamente.
El nuevo paquete `@angular/ssr` también será agregado y usado automáticamente con configuración y código siendo ajustado durante la actualización.
El paquete `@angular/ssr` soporta el builder `browser` así como el builder `application`.

## Ejecutando una construcción

Una vez que hayas actualizado la configuración de la aplicación, las construcciones se pueden realizar usando `ng build` como se hacía previamente.
Dependiendo de la elección de migración de builder, algunas de las opciones de línea de comandos pueden ser diferentes.
Si el comando de construcción está contenido en cualquier script `npm` u otro, asegúrate de que sean revisados y actualizados.
Para aplicaciones que han migrado al builder `application` y que usan SSR y/o prerendering, también podrías ser capaz de eliminar comandos `ng run` extra de scripts ahora que `ng build` tiene soporte SSR integrado.

```shell

ng build

```

## Iniciando el servidor de desarrollo

El servidor de desarrollo detectará automáticamente el nuevo sistema de construcción y lo usará para construir la aplicación.
Para iniciar el servidor de desarrollo no son necesarios cambios a la configuración del builder `dev-server` o línea de comandos.

```shell

ng serve

```

Puedes continuar usando las [opciones de línea de comandos](/cli/serve) que has usado en el pasado con el servidor de desarrollo.

CONSEJO: Con el servidor de desarrollo, puedes ver un pequeño Flash of Unstyled Content (FOUC) al inicio mientras el servidor se inicializa.
El servidor de desarrollo intenta aplazar el procesamiento de hojas de estilo hasta el primer uso para mejorar los tiempos de reconstrucción.
Esto no ocurrirá en construcciones fuera del servidor de desarrollo.

### Hot module replacement

Hot Module Replacement (HMR) es una técnica usada por servidores de desarrollo para evitar recargar toda la página cuando solo parte de una aplicación es cambiada.
Los cambios en muchos casos pueden ser mostrados inmediatamente en el navegador lo que permite un ciclo mejorado de editar/refrescar mientras se desarrolla una aplicación.
Mientras el hot module replacement (HMR) basado en JavaScript general actualmente no es soportado, varias formas más específicas de HMR están disponibles:

- **hoja de estilo global** (opción de construcción `styles`)
- **hoja de estilo de componente** (inline y basada en archivo)
- **plantilla de componente** (inline y basada en archivo)

Las capacidades HMR están automáticamente habilitadas y no requieren código o cambios de configuración para usar.
Angular proporciona soporte HMR tanto para estilos y plantillas de componente basados en archivo (`templateUrl`/`styleUrl`/`styleUrls`) como inline (`template`/`styles`).
El sistema de construcción intentará compilar y procesar la mínima cantidad de código de aplicación cuando detecta un cambio solo de hoja de estilo.

Si se prefiere, las capacidades HMR pueden ser deshabilitadas estableciendo la opción del servidor de desarrollo `hmr` a `false`.
Esto también puede ser cambiado en la línea de comandos a través de:

```shell

ng serve --no-hmr

```

### Vite como servidor de desarrollo

El uso de Vite en el Angular CLI está actualmente dentro de una _capacidad de servidor de desarrollo solo_. Incluso sin usar el sistema de construcción Vite subyacente, Vite proporciona un servidor de desarrollo completo con soporte del lado del cliente que ha sido empaquetado en un paquete npm de baja dependencia. Esto lo hace un candidato ideal para proporcionar funcionalidad de servidor de desarrollo completa. El proceso actual del servidor de desarrollo usa el nuevo sistema de construcción para generar una construcción de desarrollo de la aplicación en memoria y pasa los resultados a Vite para servir la aplicación. El uso de Vite, como el servidor de desarrollo basado en Webpack, está encapsulado dentro del builder `dev-server` del Angular CLI y actualmente no puede ser configurado directamente.

### Prebundling

El prebundling proporciona tiempos de construcción y reconstrucción mejorados al usar el servidor de desarrollo.
Vite proporciona [capacidades de prebundling](https://vite.dev/guide/dep-pre-bundling) que están habilitadas por defecto al usar el Angular CLI.
El proceso de prebundling analiza todas las dependencias de proyecto de terceros dentro de un proyecto y las procesa la primera vez que el servidor de desarrollo es ejecutado.
Este proceso elimina la necesidad de reconstruir y empaquetar las dependencias del proyecto cada vez que una reconstrucción ocurre o el servidor de desarrollo es ejecutado.

En la mayoría de los casos, no se requiere personalización adicional. Sin embargo, algunas situaciones donde puede ser necesaria incluyen:

- Personalizar el comportamiento del loader para importaciones dentro de la dependencia como la [opción `loader`](#personalización-del-loader-de-extensión-de-archivo)
- Enlazar simbólicamente una dependencia a código local para desarrollo como [`npm link`](https://docs.npmjs.com/cli/v10/commands/npm-link)
- Resolver un error encontrado durante el prebundling de una dependencia

El proceso de prebundling puede ser completamente deshabilitado o dependencias individuales pueden ser excluidas si es necesario por un proyecto.
La opción `prebundle` del builder `dev-server` puede ser usada para estas personalizaciones.
Para excluir dependencias específicas, la opción `prebundle.exclude` está disponible:

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": {
          "exclude": ["some-dep"]
        }
      },
```

Por defecto, `prebundle` está establecido a `true` pero puede ser establecido a `false` para deshabilitar completamente el prebundling.
Sin embargo, excluir dependencias específicas es recomendado en su lugar ya que los tiempos de reconstrucción aumentarán con el prebundling deshabilitado.

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": false
      },
```

## Nuevas características

Uno de los principales beneficios del sistema de construcción de aplicaciones es la velocidad mejorada de construcción y reconstrucción.
Sin embargo, el nuevo sistema de construcción de aplicaciones también proporciona características adicionales no presentes en el builder `browser`.

IMPORTANTE: Las nuevas características del builder `application` descritas aquí son incompatibles con el builder de prueba `karma` por defecto porque está usando el builder `browser` internamente.
Los usuarios pueden optar por usar el builder `application` estableciendo la opción `builderMode` a `application` para el builder `karma`.
Esta opción está actualmente en vista previa de desarrollador.
Si notas algún problema, por favor repórtalos [aquí](https://github.com/angular/angular-cli/issues).

### Reemplazo de valor en tiempo de construcción con `define`

La opción `define` permite que identificadores presentes en el código sean reemplazados con otro valor en tiempo de construcción.
Esto es similar al comportamiento del `DefinePlugin` de Webpack que fue previamente usado con algunas configuraciones personalizadas de Webpack que usaban builders de terceros.
La opción puede ser usada dentro del archivo de configuración `angular.json` o en la línea de comandos.
Configurar `define` dentro de `angular.json` es útil para casos donde los valores son constantes y capaces de ser registrados en el control de código fuente.

Dentro del archivo de configuración, la opción está en forma de objeto.
Las claves del objeto representan el identificador a reemplazar y los valores del objeto representan el valor de reemplazo correspondiente para el identificador.
Un ejemplo es el siguiente:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "define": {
          "SOME_NUMBER": "5",
          "ANOTHER": "'this is a string literal, note the extra single quotes'",
          "REFERENCE": "globalThis.someValue.noteTheAbsentSingleQuotes"
      }
    }
  }
```

CONSEJO: Todos los valores de reemplazo se definen como strings dentro del archivo de configuración.
Si el reemplazo está destinado a ser un literal de string real, debería estar encerrado en comillas simples.
Esto permite la flexibilidad de usar cualquier tipo JSON válido así como un identificador diferente como reemplazo.

El uso de línea de comandos es preferido para valores que pueden cambiar por ejecución de construcción como el hash de commit de git o una variable de entorno.
El CLI fusionará valores `--define` de la línea de comandos con valores `define` de `angular.json`, incluyendo ambos en una construcción.
El uso de línea de comandos tiene precedencia si el mismo identificador está presente para ambos.
Para uso de línea de comandos, la opción `--define` usa el formato de `IDENTIFIER=VALUE`.

```shell
ng build --define SOME_NUMBER=5 --define "ANOTHER='these will overwrite existing'"
```

Las variables de entorno también pueden ser incluidas selectivamente en una construcción.
Para shells no Windows, las comillas alrededor del literal hash pueden ser escapadas directamente si se prefiere.
Este ejemplo asume un shell similar a bash pero comportamiento similar está disponible para otros shells también.

```shell
export MY_APP_API_HOST="http://example.com"
export API_RETRY=3
ng build --define API_HOST=\'$MY_APP_API_HOST\' --define API_RETRY=$API_RETRY
```

Para cualquier uso, TypeScript necesita estar al tanto de los tipos para los identificadores para prevenir errores de verificación de tipo durante la construcción.
Esto puede ser logrado con un archivo de definición de tipo adicional dentro del código fuente de la aplicación (`src/types.d.ts`, por ejemplo) con contenido similar:

```ts
declare const SOME_NUMBER: number;
declare const ANOTHER: string;
declare const GIT_HASH: string;
declare const API_HOST: string;
declare const API_RETRY: number;
```

La configuración predeterminada del proyecto ya está configurada para usar cualquier archivo de definición de tipo presente en los directorios de código fuente del proyecto.
Si la configuración de TypeScript para el proyecto ha sido alterada, puede necesitar ser ajustada para referenciar este archivo de definición de tipo recién agregado.

IMPORTANTE: Esta opción no reemplazará identificadores contenidos dentro de metadata de Angular como un decorador Component o Directive.

### Personalización del loader de extensión de archivo

IMPORTANTE: Esta característica solo está disponible con el builder `application`.

Algunos proyectos pueden necesitar controlar cómo todos los archivos con una extensión de archivo específica son cargados y empaquetados en una aplicación.
Al usar el builder `application`, la opción `loader` puede ser usada para manejar estos casos.
La opción permite a un proyecto definir el tipo de loader a usar con una extensión de archivo especificada.
Un archivo con la extensión definida puede entonces ser usado dentro del código de aplicación a través de una declaración de importación o expresión de importación dinámica.
Los loaders disponibles que se pueden usar son:

- `text` - incorpora el contenido como un `string` disponible como exportación predeterminada
- `binary` - incorpora el contenido como un `Uint8Array` disponible como exportación predeterminada
- `file` - emite el archivo en la ruta de salida de la aplicación y proporciona la ubicación en tiempo de ejecución del archivo como exportación predeterminada
- `dataurl` - incorpora el contenido como una [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
- `base64` - incorpora el contenido como una cadena codificada en Base64.
- `empty` - considera el contenido vacío y no lo incluirá en bundles

El valor `empty`, aunque menos común, puede ser útil para compatibilidad de librerías de terceros que pueden contener uso de importación específico de bundler que necesita ser removido.
Un caso para esto son las importaciones de efecto secundario (`import 'my.css';`) de archivos CSS que no tienen efecto en un navegador.
En su lugar, el proyecto puede usar `empty` y luego los archivos CSS pueden ser agregados a la opción de construcción `styles` o usar algún otro método de inyección.

La opción loader es una opción basada en objeto con las claves usadas para definir la extensión de archivo y los valores usados para definir el tipo de loader.

Un ejemplo del uso de la opción de construcción para incorporar el contenido de archivos SVG en la aplicación empaquetada sería el siguiente:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "loader": {
        ".svg": "text"
      }
    }
  }
```

Un archivo SVG puede entonces ser importado:

```ts
import contents from './some-file.svg';

console.log(contents); // <svg>...</svg>
```

Adicionalmente, TypeScript necesita estar al tanto del tipo de módulo para la importación para prevenir errores de verificación de tipo durante la construcción. Esto puede ser logrado con un archivo de definición de tipo adicional dentro del código fuente de la aplicación (`src/types.d.ts`, por ejemplo) con el siguiente contenido o similar:

```ts
declare module "*.svg" {
  const content: string;
  export default content;
}
```

La configuración predeterminada del proyecto ya está configurada para usar cualquier archivo de definición de tipo (archivos `.d.ts`) presente en los directorios de código fuente del proyecto. Si la configuración de TypeScript para el proyecto ha sido alterada, el tsconfig puede necesitar ser ajustado para referenciar este archivo de definición de tipo recién agregado.

### Personalización del loader de atributo de importación

Para casos donde solo ciertos archivos deberían ser cargados de una manera específica, el control por archivo sobre el comportamiento de carga está disponible.
Esto se logra con un [atributo de importación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) `loader` que puede ser usado tanto con declaraciones de importación como expresiones.
La presencia del atributo de importación tiene precedencia sobre todo otro comportamiento de carga incluyendo JS/TS y cualquier valor de opción de construcción `loader`.
Para carga general para todos los archivos de un tipo de archivo no soportado de otra manera, la opción de construcción [`loader`](#personalización-del-loader-de-extensión-de-archivo) es recomendada.

Para el atributo de importación, los siguientes valores de loader son soportados:

- `text` - incorpora el contenido como un `string` disponible como exportación predeterminada
- `binary` - incorpora el contenido como un `Uint8Array` disponible como exportación predeterminada
- `file` - emite el archivo en la ruta de salida de la aplicación y proporciona la ubicación en tiempo de ejecución del archivo como exportación predeterminada
- `dataurl` - incorpora el contenido como una [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
- `base64` - incorpora el contenido como una cadena codificada en Base64.

Un requisito adicional para usar atributos de importación es que la opción `module` de TypeScript debe ser establecida a `esnext` para permitir que TypeScript construya exitosamente el código de la aplicación.
Una vez que `ES2025` esté disponible dentro de TypeScript, este cambio ya no será necesario.

En este momento, TypeScript no soporta definiciones de tipo que están basadas en valores de atributo de importación.
El uso de `@ts-expect-error`/`@ts-ignore` o el uso de archivos de definición de tipo individuales (asumiendo que el archivo solo se importa con el mismo atributo de loader) es actualmente requerido.
Como ejemplo, un archivo SVG puede ser importado como texto a través de:

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import contents from './some-file.svg' with { loader: 'text' };
```

Lo mismo puede ser logrado con una expresión de importación dentro de una función async.

```ts
async function loadSvg(): Promise<string> {
  // @ts-expect-error TypeScript cannot provide types based on attributes yet
  return import('./some-file.svg', { with: { loader: 'text' } }).then((m) => m.default);
}
```

Para la expresión de importación, el valor `loader` debe ser un literal de string para ser analizado estáticamente.
Se emitirá una advertencia si el valor no es un literal de string.

El loader `file` es útil cuando un archivo será cargado en tiempo de ejecución a través de un `fetch()`, estableciéndolo al `src` de un elemento de imagen, u otro método similar.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import imagePath from './image.webp' with { loader: 'file' };

console.log(imagePath); // media/image-ULK2SIIB.webp
```

El loader `base64` es útil cuando un archivo necesita ser incorporado directamente en el bundle como una cadena codificada que luego puede usarse para construir una Data URL.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import logo from './logo.png' with { loader: 'base64' };

console.log(logo) // "iVBORw0KGgoAAAANSUhEUgAA..."
```

El loader `dataurl` para incorporar assets como Data URLs completas.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import icon from './icon.svg' with { loader: 'dataurl' };

console.log(icon);// "data:image/svg+xml;..."
```

Para construcciones de producción como se muestra en los comentarios de código arriba, el hashing será agregado automáticamente a la ruta para caché a largo plazo.

CONSEJO: Al usar el servidor de desarrollo y usar un atributo `loader` para importar un archivo de un paquete Node.js, ese paquete debe ser excluido del prebundling a través de la opción `prebundle` del servidor de desarrollo.

### Condiciones de importación/exportación

Los proyectos pueden necesitar mapear ciertas rutas de importación a archivos diferentes basados en el tipo de construcción.
Esto puede ser particularmente útil para casos como `ng serve` necesitando usar código específico de depuración/desarrollo pero `ng build` necesitando usar código sin características/información de desarrollo.
Varias [condiciones](https://nodejs.org/api/packages.html#community-conditions-definitions) de importación/exportación se aplican automáticamente para soportar estas necesidades del proyecto:

- Para construcciones optimizadas, la condición `production` está habilitada.
- Para construcciones no optimizadas, la condición `development` está habilitada.
- Para código de salida del navegador, la condición `browser` está habilitada.

Una construcción optimizada se determina por el valor de la opción `optimization`.
Cuando `optimization` está establecido a `true` o más específicamente si `optimization.scripts` está establecido a `true`, entonces la construcción se considera optimizada.
Esta clasificación aplica tanto a `ng build` como a `ng serve`.
En un proyecto nuevo, `ng build` predetermina a optimizado y `ng serve` predetermina a no optimizado.

Un método útil para aprovechar estas condiciones dentro del código de aplicación es combinarlas con [importaciones de subruta](https://nodejs.org/api/packages.html#subpath-imports).
Al usar la siguiente declaración de importación:

```ts
import {verboseLogging} from '#logger';
```

El archivo puede ser cambiado en el campo `imports` en `package.json`:

```json
{
  ...
  "imports": {
    "#logger": {
      "development": "./src/logging/debug.ts",
      "default": "./src/logging/noop.ts"
    }
  }
}
```

Para aplicaciones que también están usando SSR, el código del navegador y servidor puede ser cambiado usando la condición `browser`:

```json
{
  ...
  "imports": {
    "#crashReporter": {
      "browser": "./src/browser-logger.ts",
      "default": "./src/server-logger.ts"
    }
  }
}
```

Estas condiciones también aplican a paquetes Node.js y cualquier [`exports`](https://nodejs.org/api/packages.html#conditional-exports) definida dentro de los paquetes.

CONSEJO: Si actualmente estás usando la opción de construcción `fileReplacements`, esta característica puede ser capaz de reemplazar su uso.

## Problemas Conocidos

Actualmente hay varios problemas conocidos que puedes encontrar al probar el nuevo sistema de construcción. Esta lista será actualizada para mantenerse actual. Si alguno de estos problemas te está bloqueando actualmente de probar el nuevo sistema de construcción, por favor verifica de nuevo en el futuro ya que puede haber sido resuelto.

### Verificación de tipos de código Web Worker y procesamiento de Web Workers anidados

Los Web Workers pueden ser usados dentro del código de aplicación usando la misma sintaxis (`new Worker(new URL('<workerfile>', import.meta.url))`) que es soportada con el builder `browser`.
Sin embargo, el código dentro del Worker no será actualmente verificado por tipo por el compilador TypeScript. El código TypeScript es soportado solo no verificado por tipo.
Adicionalmente, cualquier worker anidado no será procesado por el sistema de construcción. Un worker anidado es una instanciación de Worker dentro de otro archivo Worker.

### Importaciones predeterminadas ESM vs. importaciones de espacio de nombres

TypeScript por defecto permite que exportaciones predeterminadas sean importadas como importaciones de espacio de nombres y luego usadas en expresiones de llamada.
Esto es desafortunadamente una divergencia de la especificación ECMAScript.
El bundler subyacente (`esbuild`) dentro del nuevo sistema de construcción espera código ESM que conforma a la especificación.
El sistema de construcción ahora generará una advertencia si tu aplicación usa un tipo incorrecto de importación de un paquete.
Sin embargo, para permitir que TypeScript acepte el uso correcto, una opción de TypeScript debe ser habilitada dentro del archivo `tsconfig` de la aplicación.
Cuando está habilitada, la opción [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) proporciona mejor alineación con la especificación ECMAScript y también es recomendada por el equipo de TypeScript.
Una vez habilitada, puedes actualizar las importaciones de paquetes donde sea aplicable a una forma conforme a ECMAScript.

Usando el paquete [`moment`](https://npmjs.com/package/moment) como ejemplo, el siguiente código de aplicación causará errores en tiempo de ejecución:

```ts
import * as moment from 'moment';

console.log(moment().format());
```

La construcción generará una advertencia para notificarte que hay un problema potencial. La advertencia será similar a:

```text
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

```

Sin embargo, puedes evitar los errores en tiempo de ejecución y la advertencia habilitando la opción TypeScript `esModuleInterop` para la aplicación y cambiando la importación a lo siguiente:

```ts
import moment from 'moment';

console.log(moment().format());
```

### Importaciones con efectos secundarios dependientes del orden en módulos lazy

Las declaraciones de importación que son dependientes de un orden específico y también son usadas en múltiples módulos lazy pueden causar que declaraciones de nivel superior se ejecuten fuera de orden.
Esto no es común ya que depende del uso de módulos con efectos secundarios y no aplica a la opción `polyfills`.
Esto es causado por un [defecto](https://github.com/evanw/esbuild/issues/399) en el bundler subyacente pero será abordado en una actualización futura.

IMPORTANTE: Evitar el uso de módulos con efectos secundarios no locales (fuera de polyfills) es recomendado siempre que sea posible independientemente del sistema de construcción siendo usado y evita este problema particular. Los módulos con efectos secundarios no locales pueden tener un efecto negativo tanto en el tamaño de la aplicación como en el rendimiento en tiempo de ejecución también.

### Cambios de ubicación de salida 

Por defecto, después de una construcción exitosa por el builder de aplicación, el bundle está ubicado en un directorio `dist/<project-name>/browser` (en lugar de `dist/<project-name>` para el builder browser).
Esto podría romper algunas de las cadenas de herramientas que dependen de la ubicación anterior. En este caso, puedes [configurar la ruta de salida](reference/configs/workspace-config#output-path-configuration) para adaptarse a tus necesidades.

## Reportes de errores

Reporta problemas y solicitudes de características en [GitHub](https://github.com/angular/angular-cli/issues).

Por favor proporciona una reproducción mínima cuando sea posible para ayudar al equipo a abordar los problemas.
