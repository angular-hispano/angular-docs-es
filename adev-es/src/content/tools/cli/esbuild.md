# Comenzando con el nuevo sistema de construcción del Angular CLI

En v17 y superior, el nuevo sistema de construcción proporciona una forma mejorada de construir aplicaciones Angular. Este nuevo sistema de construcción incluye:

- Un formato de salida moderno usando ESM, con expresiones de importación dinámica para soportar carga lazy de módulos.
- Rendimiento de tiempo de construcción más rápido tanto para construcciones iniciales como para reconstrucciones incrementales.
- Herramientas más nuevas del ecosistema JavaScript como [esbuild](https://esbuild.github.io/) y [Vite](https://vitejs.dev/).
- Capacidades integradas de SSR y prerendering.

Este nuevo sistema de construcción es estable y completamente soportado para uso con aplicaciones Angular.
Puedes migrar al nuevo sistema de construcción con aplicaciones que usan el builder `browser`.
Si usas un builder personalizado, consulta la documentación de ese builder sobre posibles opciones de migración.

IMPORTANTE: El sistema de construcción existente basado en Webpack todavía se considera estable y completamente soportado.
Las aplicaciones pueden continuar usando el builder `browser` y no se migrarán automáticamente al actualizar.

## Para nuevas aplicaciones

Las nuevas aplicaciones usarán este nuevo sistema de construcción por defecto a través del builder `application`.

## Para aplicaciones existentes

Para proyectos existentes, puedes optar por usar el nuevo builder de manera individual por aplicación con dos opciones diferentes.
Ambas opciones se consideran estables y completamente soportadas por el equipo de Angular.
La elección de qué opción usar es un factor de cuántos cambios necesitarás hacer para migrar y qué nuevas características te gustaría usar en el proyecto.

- El builder `browser-esbuild` construye solo el bundle del lado del cliente de una aplicación diseñada para ser compatible con el builder `browser` existente que proporciona el sistema de construcción preexistente. Sirve como un reemplazo directo para aplicaciones `browser` existentes.
- El builder `application` cubre una aplicación completa, como el bundle del lado del cliente, así como opcionalmente construir un servidor para renderizado del lado del servidor y realizar prerendering en tiempo de construcción de páginas estáticas.

El builder `application` es generalmente preferido ya que mejora las construcciones renderizadas del lado del servidor (SSR), y hace más fácil que proyectos renderizados del lado del cliente adopten SSR en el futuro.
Sin embargo, requiere un poco más de esfuerzo de migración, particularmente para aplicaciones SSR existentes.
Si el builder `application` es difícil de adoptar para tu proyecto, `browser-esbuild` puede ser una solución más fácil que da la mayoría de los beneficios de rendimiento de construcción con menos cambios disruptivos.

### Usando el builder `browser-esbuild`

Un builder llamado `browser-esbuild` está disponible dentro del paquete `@angular-devkit/build-angular` que está presente en una aplicación generada por Angular CLI.
Puedes probar el nuevo sistema de construcción para aplicaciones que usan el builder `browser`.
Si usas un builder personalizado, consulta la documentación de ese builder sobre posibles opciones de migración.

La opción de compatibilidad se implementó para minimizar la cantidad de cambios necesarios para migrar inicialmente tus aplicaciones.
Esto se proporciona a través de un builder alternativo (`browser-esbuild`).
Puedes actualizar el objetivo `build` para cualquier objetivo de aplicación para migrar al nuevo sistema de construcción.

Lo siguiente es lo que típicamente encontrarías en `angular.json` para una aplicación:

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</docs-code>

Cambiar el campo `builder` es el único cambio que necesitarás hacer.

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
</docs-code>

### Usando el builder `application`

Un builder llamado `application` también está disponible dentro del paquete `@angular-devkit/build-angular` que está presente en una aplicación generada por Angular CLI.
Este builder es el predeterminado para todas las nuevas aplicaciones creadas con `ng new`.

Lo siguiente es lo que típicamente encontrarías en `angular.json` para una aplicación:

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</docs-code>

Cambiar el campo `builder` es el primer cambio que necesitarás hacer.

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
</docs-code>

Una vez que el nombre del builder haya sido cambiado, las opciones dentro del objetivo `build` necesitarán ser actualizadas.
La siguiente lista discute todas las opciones del builder `browser` que necesitarán ser ajustadas.

- `main` debería renombrarse a `browser`.
- `polyfills` debería ser un array, en lugar de un solo archivo.
- `buildOptimizer` debería eliminarse, ya que esto está cubierto por la opción `optimization`.
- `resourcesOutputPath` debería eliminarse, esto ahora siempre es `media`.
- `vendorChunk` debería eliminarse, ya que esto era una optimización de rendimiento que ya no es necesaria.
- `commonChunk` debería eliminarse, ya que esto era una optimización de rendimiento que ya no es necesaria.
- `deployUrl` debería eliminarse y no está soportado. Prefiere [`<base href>`](guide/routing/common-router-tasks) en su lugar. Consulta la [documentación de despliegue](tools/cli/deployment#--deploy-url) para más información.
- `ngswConfigPath` debería renombrarse a `serviceWorker`.

Si la aplicación no está usando SSR actualmente, este debería ser el paso final para permitir que `ng build` funcione.
Después de ejecutar `ng build` por primera vez, puede haber nuevas advertencias o errores basados en diferencias de comportamiento o uso de la aplicación de características específicas de Webpack.
Muchas de las advertencias proporcionarán sugerencias sobre cómo remediar ese problema.
Si parece que una advertencia es incorrecta o la solución no es aparente, por favor abre un issue en [GitHub](https://github.com/angular/angular-cli/issues).
Además, las secciones posteriores de esta guía proporcionan información adicional sobre varios casos específicos así como problemas conocidos actuales.

Para aplicaciones nuevas en SSR, la [Guía SSR de Angular](guide/ssr) proporciona información adicional sobre el proceso de configuración para agregar SSR a una aplicación.

Para aplicaciones que ya están usando SSR, se necesitarán ajustes adicionales para actualizar el servidor de aplicación para soportar las nuevas capacidades integradas de SSR.
El builder `application` ahora proporciona la funcionalidad integrada para todos los siguientes builders preexistentes:

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

El proceso `ng update` eliminará automáticamente los usos de los paquetes del scope `@nguniversal` donde algunos de estos builders estaban ubicados previamente.
El nuevo paquete `@angular/ssr` también se agregará y usará automáticamente con la configuración y el código siendo ajustados durante la actualización.
El paquete `@angular/ssr` soporta el builder `browser` así como el builder `application`.
Para convertir de los builders SSR separados a las capacidades integradas del builder `application`, ejecuta la migración experimental `use-application-builder`.

<docs-code language="shell">

ng update @angular/cli --name use-application-builder

</docs-code>

La migración hace lo siguiente:

* Convierte el objetivo `browser` o `browser-esbuild` existente a `application`
* Elimina cualquier builder SSR anterior (porque `application` hace eso ahora).
* Actualiza la configuración en consecuencia.
* Fusiona `tsconfig.server.json` con `tsconfig.app.json` y agrega la opción TypeScript `"esModuleInterop": true` para asegurar que las importaciones de `express` sean [compatibles con ESM](#esm-default-imports-vs-namespace-imports).
* Actualiza el código del servidor de aplicación para usar el nuevo bootstrapping y estructura de directorio de salida.

ÚTIL: Recuerda eliminar cualquier suposición CommonJS en el código del servidor de aplicación como `require`, `__filename`, `__dirname`, u otros constructos del [alcance del módulo CommonJS](https://nodejs.org/api/modules.html#the-module-scope). Todo el código de aplicación debería ser compatible con ESM. Esto no aplica a dependencias de terceros.

## Ejecutando una construcción

Una vez que hayas actualizado la configuración de la aplicación, las construcciones pueden realizarse usando `ng build` como se hacía previamente.
Dependiendo de la elección de migración del builder, algunas de las opciones de línea de comandos pueden ser diferentes.
Si el comando de construcción está contenido en algún script de `npm` u otros scripts, asegúrate de que sean revisados y actualizados.
Para aplicaciones que han migrado al builder `application` y que usan SSR y/o prerendering, también puedes eliminar comandos `ng run` extra de los scripts ahora que `ng build` tiene soporte SSR integrado.

<docs-code language="shell">

ng build

</docs-code>

## Iniciando el servidor de desarrollo

El servidor de desarrollo detectará automáticamente el nuevo sistema de construcción y lo usará para construir la aplicación.
Para iniciar el servidor de desarrollo no son necesarios cambios en la configuración del builder `dev-server` o línea de comandos.

<docs-code language="shell">

ng serve

</docs-code>

Puedes continuar usando las [opciones de línea de comandos](/cli/serve) que has usado en el pasado con el servidor de desarrollo.

## Reemplazo de módulo en caliente

El reemplazo de módulo en caliente (HMR) basado en JavaScript actualmente no está soportado.
Sin embargo, el HMR de hojas de estilo globales (opción de construcción `styles`) está disponible y habilitado por defecto.
Las capacidades HMR enfocadas en Angular están actualmente planificadas y se introducirán en una versión futura.

## Opciones y comportamiento no implementados

Varias opciones de construcción aún no están implementadas pero se agregarán en el futuro a medida que el sistema de construcción avance hacia un estado estable. Si tu aplicación usa estas opciones, todavía puedes probar el sistema de construcción sin eliminarlas. Se emitirán advertencias para cualquier opción no implementada pero de lo contrario serán ignoradas. Sin embargo, si tu aplicación depende de cualquiera de estas opciones para funcionar, es posible que quieras esperar para probar.

- [Importaciones WASM](https://github.com/angular/angular-cli/issues/25102) -- WASM aún puede cargarse manualmente a través de [APIs web estándar](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running).

## Importaciones predeterminadas ESM vs. importaciones de namespace

TypeScript por defecto permite que las exportaciones predeterminadas se importen como importaciones de namespace y luego se usen en expresiones de llamada.
Esto es desafortunadamente una divergencia de la especificación ECMAScript.
El bundler subyacente (`esbuild`) dentro del nuevo sistema de construcción espera código ESM que cumpla con la especificación.
El sistema de construcción ahora generará una advertencia si tu aplicación usa un tipo incorrecto de importación de un paquete.
Sin embargo, para permitir que TypeScript acepte el uso correcto, debe habilitarse una opción TypeScript dentro del archivo `tsconfig` de la aplicación.
Cuando está habilitada, la opción [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) proporciona mejor alineación con la especificación ECMAScript y también es recomendada por el equipo de TypeScript.
Una vez habilitada, puedes actualizar las importaciones de paquetes donde sea aplicable a una forma conforme con ECMAScript.

Usando el paquete [`moment`](https://npmjs.com/package/moment) como ejemplo, el siguiente código de aplicación causará errores en tiempo de ejecución:

```ts
import * as moment from 'moment';

console.log(moment().format());
```

La construcción generará una advertencia para notificarte que hay un problema potencial. La advertencia será similar a:

<docs-code language="text">
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

</docs-code>

Sin embargo, puedes evitar los errores en tiempo de ejecución y la advertencia habilitando la opción TypeScript `esModuleInterop` para la aplicación y cambiando la importación a lo siguiente:

```ts
import moment from 'moment';

console.log(moment().format());
```

## Vite como servidor de desarrollo

El uso de Vite en el Angular CLI actualmente es solo dentro de una _capacidad de servidor de desarrollo únicamente_. Incluso sin usar el sistema de construcción Vite subyacente, Vite proporciona un servidor de desarrollo completo con soporte del lado del cliente que ha sido empaquetado en un paquete npm de baja dependencia. Esto lo hace un candidato ideal para proporcionar funcionalidad completa de servidor de desarrollo. El proceso actual del servidor de desarrollo usa el nuevo sistema de construcción para generar una construcción de desarrollo de la aplicación en memoria y pasa los resultados a Vite para servir la aplicación. El uso de Vite, muy parecido al servidor de desarrollo basado en Webpack, está encapsulado dentro del builder `dev-server` del Angular CLI y actualmente no puede configurarse directamente.

## Problemas conocidos

Actualmente hay varios problemas conocidos que puedes encontrar al probar el nuevo sistema de construcción. Esta lista se actualizará para mantenerse al día. Si alguno de estos problemas te está bloqueando actualmente de probar el nuevo sistema de construcción, por favor verifica de nuevo en el futuro ya que puede haber sido resuelto.

### Verificación de tipos del código Web Worker y procesamiento de Web Workers anidados

Los Web Workers pueden usarse dentro del código de aplicación usando la misma sintaxis (`new Worker(new URL('<workerfile>', import.meta.url))`) que está soportada con el builder `browser`.
Sin embargo, el código dentro del Worker actualmente no será verificado por tipos por el compilador TypeScript. El código TypeScript está soportado solo que no se verifica por tipos.
Además, cualquier worker anidado no será procesado por el sistema de construcción. Un worker anidado es una instanciación de Worker dentro de otro archivo Worker.

### Importaciones con efectos secundarios dependientes del orden en módulos lazy

Las declaraciones de importación que dependen de un orden específico y que también se usan en múltiples módulos lazy pueden causar que las declaraciones de nivel superior se ejecuten fuera de orden.
Esto no es común ya que depende del uso de módulos con efectos secundarios y no aplica a la opción `polyfills`.
Esto es causado por un [defecto](https://github.com/evanw/esbuild/issues/399) en el bundler subyacente pero se abordará en una actualización futura.

IMPORTANTE: Se recomienda evitar el uso de módulos con efectos secundarios no locales (fuera de polyfills) siempre que sea posible independientemente del sistema de construcción que se esté usando y evita este problema en particular. Los módulos con efectos secundarios no locales pueden tener un efecto negativo tanto en el tamaño de la aplicación como en el rendimiento en tiempo de ejecución también.

## Reportes de errores

Reporta problemas y solicitudes de características en [GitHub](https://github.com/angular/angular-cli/issues).

Por favor proporciona una reproducción mínima donde sea posible para ayudar al equipo a abordar problemas.
