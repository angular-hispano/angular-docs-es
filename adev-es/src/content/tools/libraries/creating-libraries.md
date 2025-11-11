# Creando librerías

Esta página proporciona una visión general conceptual de cómo crear y publicar nuevas librerías para extender la funcionalidad de Angular.

Si encuentras que necesitas resolver el mismo problema en más de una aplicación \(o quieres compartir tu solución con otros desarrolladores\), tienes un candidato para una librería.
Un ejemplo simple podría ser un botón que envía usuarios al sitio web de tu empresa, que se incluiría en todas las aplicaciones que tu empresa construya.

## Primeros pasos

Usa el Angular CLI para generar un nuevo esqueleto de librería en un nuevo espacio de trabajo con los siguientes comandos.

<docs-code language="shell">

ng new my-workspace --no-create-application
cd my-workspace
ng generate library my-lib

</docs-code>

<docs-callout title="Nombrando tu librería">

Debes tener mucho cuidado al elegir el nombre de tu librería si quieres publicarla más tarde en un registro de paquetes público como npm.
Consulta [Publicando tu librería](tools/libraries/creating-libraries#publishing-your-library).

Evita usar un nombre que esté prefijado con `ng-`, como `ng-library`.
El prefijo `ng-` es una palabra clave reservada usada por el framework Angular y sus librerías.
El prefijo `ngx-` se prefiere como una convención usada para denotar que la librería es adecuada para uso con Angular.
También es una excelente indicación para los consumidores del registro para diferenciar entre librerías de diferentes frameworks de JavaScript.

</docs-callout>

El comando `ng generate` crea la carpeta `projects/my-lib` en tu espacio de trabajo, que contiene un componente.

ÚTIL: Para más detalles sobre cómo se estructura un proyecto de librería, consulta la sección [Archivos de proyecto de librería](reference/configs/file-structure#library-project-files) de la [guía de Estructura de archivos del proyecto](reference/configs/file-structure).

Usa el modelo monorepo para usar el mismo espacio de trabajo para múltiples proyectos.
Consulta [Configurando un espacio de trabajo multi-proyecto](reference/configs/file-structure#multiple-projects).

Cuando generas una nueva librería, el archivo de configuración del espacio de trabajo, `angular.json`, se actualiza con un proyecto de tipo `library`.

<docs-code language="json">

"projects": {
  …
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:ng-packagr",
        …

</docs-code>

Construye, prueba y verifica el proyecto con comandos del CLI:

<docs-code language="shell">

ng build my-lib --configuration development
ng test my-lib
ng lint my-lib

</docs-code>

Observa que el builder configurado para el proyecto es diferente del builder predeterminado para proyectos de aplicación.
Este builder, entre otras cosas, asegura que la librería siempre se construya con el [compilador AOT](tools/cli/aot-compiler).

Para hacer que el código de la librería sea reutilizable, debes definir una API pública para ella.
Esta "capa de usuario" define lo que está disponible para los consumidores de tu librería.
Un usuario de tu librería debería poder acceder a la funcionalidad pública \(como proveedores de servicios y funciones de utilidad generales\) a través de una única ruta de importación.

La API pública para tu librería se mantiene en el archivo `public-api.ts` en tu carpeta de librería.
Cualquier cosa exportada desde este archivo se hace pública cuando tu librería se importa en una aplicación.

Tu librería debería proporcionar documentación \(típicamente un archivo README\) para instalación y mantenimiento.

## Refactorizando partes de una aplicación en una librería

Para hacer tu solución reutilizable, necesitas ajustarla para que no dependa de código específico de la aplicación.
Aquí hay algunas cosas a considerar al migrar funcionalidad de aplicación a una librería.

* Las declaraciones como componentes y pipes deberían diseñarse como sin estado, lo que significa que no dependen ni alteran variables externas.
    Si dependes del estado, necesitas evaluar cada caso y decidir si es estado de aplicación o estado que la librería gestionaría.

* Cualquier observable al que los componentes se suscriban internamente debería limpiarse y eliminarse durante el ciclo de vida de esos componentes
* Los componentes deberían exponer sus interacciones a través de entradas para proporcionar contexto, y salidas para comunicar eventos a otros componentes

* Verifica todas las dependencias internas.
  * Para clases personalizadas o interfaces usadas en componentes o servicios, verifica si dependen de clases o interfaces adicionales que también necesitan ser migradas
  * De manera similar, si tu código de librería depende de un servicio, ese servicio necesita ser migrado
  * Si tu código de librería o sus plantillas dependen de otras librerías \(como Angular Material, por ejemplo\), debes configurar tu librería con esas dependencias

* Considera cómo proporcionas servicios a las aplicaciones cliente.

  * Los servicios deberían declarar sus propios proveedores, en lugar de declarar proveedores en el NgModule o un componente.
        Declarar un proveedor hace que ese servicio sea *tree-shakable*.
        Esta práctica permite que el compilador deje el servicio fuera del bundle si nunca se inyecta en la aplicación que importa la librería.
        Para más información sobre esto, consulta [Proveedores tree-shakable](guide/di/lightweight-injection-tokens).

  * Si registras proveedores de servicios globales, expone una función proveedor `provideXYZ()`.
  * Si tu librería proporciona servicios opcionales que podrían no ser usados por todas las aplicaciones cliente, soporta tree-shaking apropiado para ese caso usando el [patrón de diseño de token ligero](guide/di/lightweight-injection-tokens)

## Integración con el CLI usando schematics de generación de código

Una librería típicamente incluye *código reutilizable* que define componentes, servicios y otros artefactos de Angular \(pipes, directivas\) que importas en un proyecto.
Una librería se empaqueta en un paquete npm para publicación y distribución.
Este paquete también puede incluir schematics que proporcionan instrucciones para generar o transformar código directamente en tu proyecto, de la misma manera que el CLI crea un nuevo componente genérico con `ng generate component`.
Un schematic que se empaqueta con una librería puede, por ejemplo, proporcionar al Angular CLI la información que necesita para generar un componente que configure y use una característica particular, o conjunto de características, definidas en esa librería.
Un ejemplo de esto es el [schematic de navegación de Angular Material](https://material.angular.dev/guide/schematics#navigation-schematic) que configura el [BreakpointObserver](https://material.angular.dev/cdk/layout/overview#breakpointobserver) del CDK y lo usa con los componentes [MatSideNav](https://material.angular.dev/components/sidenav/overview) y [MatToolbar](https://material.angular.dev/components/toolbar/overview) de Material.

Crea e incluye los siguientes tipos de schematics:

* Incluye un schematic de instalación para que `ng add` pueda agregar tu librería a un proyecto
* Incluye schematics de generación en tu librería para que `ng generate` pueda crear tus artefactos definidos \(componentes, servicios, pruebas\) en un proyecto
* Incluye un schematic de actualización para que `ng update` pueda actualizar las dependencias de tu librería y proporcionar migraciones para cambios disruptivos en nuevas versiones

Lo que incluyas en tu librería depende de tu tarea.
Por ejemplo, podrías definir un schematic para crear un dropdown que esté pre-poblado con datos predefinidos para mostrar cómo agregarlo a una aplicación.
Si quieres un dropdown que contenga diferentes valores pasados cada vez, tu librería podría definir un schematic para crearlo con una configuración dada.
Los desarrolladores podrían entonces usar `ng generate` para configurar una instancia para su propia aplicación.

Supón que quieres leer un archivo de configuración y luego generar un formulario basado en esa configuración.
Si ese formulario necesita personalización adicional por parte del desarrollador que está usando tu librería, podría funcionar mejor como un schematic.
Sin embargo, si el formulario siempre será el mismo y no necesitará mucha personalización por parte de los desarrolladores, entonces podrías crear un componente dinámico que tome la configuración y genere el formulario.
En general, cuanto más compleja sea la personalización, más útil será el enfoque de schematic.

Para más información, consulta [Visión general de Schematics](tools/cli/schematics) y [Schematics para librerías](tools/cli/schematics-for-libraries).

## Publicando tu librería

Usa el Angular CLI y el gestor de paquetes npm para construir y publicar tu librería como un paquete npm.

Angular CLI usa una herramienta llamada [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) para crear paquetes desde tu código compilado que pueden publicarse en npm.
Consulta [Construyendo librerías con Ivy](tools/libraries/creating-libraries#publishing-libraries) para información sobre los formatos de distribución soportados por `ng-packagr` y orientación sobre cómo elegir el formato correcto para tu librería.

Siempre debes construir librerías para distribución usando la configuración `production`.
Esto asegura que la salida generada use las optimizaciones apropiadas y el formato de paquete correcto para npm.

<docs-code language="shell">

ng build my-lib
cd dist/my-lib
npm publish

</docs-code>

## Gestionando recursos en una librería

En tu librería de Angular, el distribuible puede incluir recursos adicionales como archivos de temas, mixins de Sass, o documentación \(como un changelog\).
Para más información [copia recursos en tu librería como parte de la compilación](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) e [incrusta recursos en estilos de componentes](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).

IMPORTANTE: Cuando incluyas recursos adicionales como mixins de Sass o CSS pre-compilado.
Necesitas agregar estos manualmente a las ["exports"](tools/libraries/angular-package-format#quotexportsquot) condicionales en el `package.json` del punto de entrada principal.

`ng-packagr` fusionará las `"exports"` escritas manualmente con las auto-generadas, permitiendo que los autores de librerías configuren subpaths de exportación adicionales, o condiciones personalizadas.

<docs-code language="json">

"exports": {
  ".": {
    "sass": "./_index.scss",
  },
  "./theming": {
    "sass": "./_theming.scss"
  },
  "./prebuilt-themes/indigo-pink.css": {
    "style": "./prebuilt-themes/indigo-pink.css"
  }
}

</docs-code>

Lo anterior es un extracto del distribuible de [@angular/material](https://unpkg.com/browse/@angular/material/package.json).

## Dependencias peer

Las librerías de Angular deberían listar cualquier dependencia `@angular/*` de la que dependa la librería como dependencias peer.
Esto asegura que cuando los módulos pidan Angular, todos obtengan exactamente el mismo módulo.
Si una librería lista `@angular/core` en `dependencies` en lugar de `peerDependencies`, podría obtener un módulo Angular diferente, lo que causaría que tu aplicación falle.

## Usando tu propia librería en aplicaciones

No tienes que publicar tu librería en el gestor de paquetes npm para usarla en el mismo espacio de trabajo, pero sí tienes que construirla primero.

Para usar tu propia librería en una aplicación:

* Construye la librería.
    No puedes usar una librería antes de que se construya.

    <docs-code language="shell">

    ng build my-lib

    </docs-code>

* En tus aplicaciones, importa desde la librería por nombre:

    <docs-code language="typescript">

    import { myExport } from 'my-lib';

    </docs-code>

### Construyendo y reconstruyendo tu librería

El paso de construcción es importante si no has publicado tu librería como un paquete npm y luego instalado el paquete de vuelta en tu aplicación desde npm.
Por ejemplo, si clonas tu repositorio git y ejecutas `npm install`, tu editor muestra las importaciones de `my-lib` como faltantes si aún no has construido tu librería.

ÚTIL: Cuando importas algo desde una librería en una aplicación de Angular, Angular busca un mapeo entre el nombre de la librería y una ubicación en disco.
Cuando instalas un paquete de librería, el mapeo está en la carpeta `node_modules`.
Cuando construyes tu propia librería, tiene que encontrar el mapeo en tus rutas `tsconfig`.

Generar una librería con el Angular CLI agrega automáticamente su ruta al archivo `tsconfig`.
El Angular CLI usa las rutas `tsconfig` para decirle al sistema de compilación dónde encontrar la librería.

Para más información, consulta [Visión general del mapeo de rutas](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

Si encuentras que los cambios en tu librería no se reflejan en tu aplicación, tu aplicación probablemente esté usando una construcción antigua de la librería.

Puedes reconstruir tu librería cuando hagas cambios en ella, pero este paso extra lleva tiempo.
La funcionalidad de *compilaciones incrementales* mejora la experiencia de desarrollo de librerías.
Cada vez que se cambia un archivo, se realiza una compilación parcial que emite los archivos modificados.

Las compilaciones incrementales pueden ejecutarse como un proceso en segundo plano en tu entorno de desarrollo.
Para aprovechar esta característica, agrega la bandera `--watch` al comando de compilación:

<docs-code language="shell">

ng build my-lib --watch

</docs-code>

IMPORTANTE: El comando `build` del CLI usa un builder diferente e invoca una herramienta de compilación diferente para librerías que para aplicaciones.

* El sistema de compilación para aplicaciones, `@angular-devkit/build-angular`, está basado en `webpack`, y está incluido en todos los nuevos proyectos de Angular CLI
* El sistema de compilación para librerías está basado en `ng-packagr`.
    Solo se agrega a tus dependencias cuando agregas una librería usando `ng generate library my-lib`.

Los dos sistemas de compilación soportan cosas diferentes, e incluso donde soportan las mismas cosas, hacen esas cosas de manera diferente.
Esto significa que el código fuente TypeScript puede resultar en código JavaScript diferente en una librería construida que en una aplicación construida.

Por esta razón, una aplicación que depende de una librería debería usar solo mapeos de rutas de TypeScript que apunten a la *librería construida*.
Los mapeos de rutas de TypeScript *no* deberían apuntar a los archivos `.ts` fuente de la librería.

## Publicando librerías

Hay dos formatos de distribución para usar al publicar una librería:

| Formatos de distribución     | Detalles |
|:---                          |:---     |
| Partial-Ivy \(recomendado\) | Contiene código portable que puede ser consumido por aplicaciones Ivy construidas con cualquier versión de Angular desde v12 en adelante. |
| Full-Ivy                    | Contiene instrucciones privadas de Angular Ivy, que no están garantizadas para funcionar en diferentes versiones de Angular. Este formato requiere que la librería y la aplicación sean construidas con la *misma* versión exacta de Angular. Este formato es útil para entornos donde todo el código de librería y aplicación se construye directamente desde el código fuente. |

Para publicar en npm usa el formato partial-Ivy ya que es estable entre versiones de parche de Angular.

Evita compilar librerías con código full-Ivy si estás publicando en npm porque las instrucciones Ivy generadas no son parte de la API pública de Angular, y por lo tanto podrían cambiar entre versiones de parche.

## Asegurando compatibilidad de versión de librería

La versión de Angular usada para construir una aplicación siempre debería ser la misma o mayor que las versiones de Angular usadas para construir cualquiera de sus librerías dependientes.
Por ejemplo, si tuvieras una librería usando Angular versión 13, la aplicación que depende de esa librería debería usar Angular versión 13 o posterior.
Angular no soporta usar una versión anterior para la aplicación.

Si tienes la intención de publicar tu librería en npm, compila con código partial-Ivy estableciendo `"compilationMode": "partial"` en `tsconfig.prod.json`.
Este formato parcial es estable entre diferentes versiones de Angular, por lo que es seguro publicar en npm.
El código con este formato se procesa durante la compilación de la aplicación usando la misma versión del compilador de Angular, asegurando que la aplicación y todas sus librerías usen una única versión de Angular.

Evita compilar librerías con código full-Ivy si estás publicando en npm porque las instrucciones Ivy generadas no son parte de la API pública de Angular, y por lo tanto podrían cambiar entre versiones de parche.

Si nunca has publicado un paquete en npm antes, debes crear una cuenta de usuario.
Lee más en [Publicando paquetes npm](https://docs.npmjs.com/getting-started/publishing-npm-packages).

## Consumiendo código partial-Ivy fuera del Angular CLI

Una aplicación instala muchas librerías de Angular desde npm en su directorio `node_modules`.
Sin embargo, el código en estas librerías no puede empaquetarse directamente junto con la aplicación construida ya que no está completamente compilado.
Para terminar la compilación, usa el linker de Angular.

Para aplicaciones que no usan el Angular CLI, el linker está disponible como un plugin de [Babel](https://babeljs.io).
El plugin debe importarse desde `@angular/compiler-cli/linker/babel`.

El plugin Babel del linker de Angular soporta caché de compilación, lo que significa que las librerías solo necesitan ser procesadas por el linker una sola vez, independientemente de otras operaciones de npm.

Ejemplo de integración del plugin en una compilación personalizada de [webpack](https://webpack.js.org) registrando el linker como un plugin de [Babel](https://babeljs.io) usando [babel-loader](https://webpack.js.org/loaders/babel-loader/#options).

<docs-code header="webpack.config.mjs" path="adev/src/content/examples/angular-linker-plugin/webpack.config.mjs" visibleRegion="webpack-config"/>

ÚTIL: El Angular CLI integra el plugin linker automáticamente, así que si los consumidores de tu librería están usando el CLI, pueden instalar librerías nativas de Ivy desde npm sin ninguna configuración adicional.
