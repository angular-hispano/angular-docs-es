# Uso de librerías de Angular publicadas en npm

Cuando construyes tu aplicación de Angular, aprovecha las sofisticadas librerías propias, así como un ecosistema rico de librerías de terceros.
[Angular Material][AngularMaterialMain] es un ejemplo de una librería propia sofisticada.

## Instalar librerías

Las librerías se publican como [paquetes npm][GuideNpmPackages], generalmente junto con schematics que las integran con el Angular CLI.
Para integrar código de librería reutilizable en una aplicación, necesitas instalar el paquete e importar la funcionalidad proporcionada en la ubicación donde la uses.
Para la mayoría de las librerías publicadas de Angular, usa el comando `ng add <lib_name>` de Angular CLI.

El comando `ng add` de Angular CLI usa un gestor de paquetes para instalar el paquete de la librería e invoca schematics que están incluidos en el paquete para generar scaffold adicional dentro del código del proyecto.
Ejemplos de gestores de paquetes incluyen [npm][NpmjsMain] o [yarn][YarnpkgMain].
El scaffold adicional dentro del código del proyecto incluye declaraciones de importación, fuentes y temas.

Una librería publicada típicamente proporciona un archivo `README` u otra documentación sobre cómo agregar esa librería a tu aplicación.
Para un ejemplo, consulta la documentación de [Angular Material][AngularMaterialMain].

### Tipado de librerías

Típicamente, los paquetes de librerías incluyen tipados en archivos `.d.ts`; consulta ejemplos en `node_modules/@angular/material`.
Si el paquete de tu librería no incluye tipados y tu IDE se queja, es posible que necesites instalar el paquete `@types/<lib_name>` con la librería.

Por ejemplo, supón que tienes una librería llamada `d3`:

<docs-code language="shell">

npm install d3 --save
npm install @types/d3 --save-dev

</docs-code>

Los tipos definidos en un paquete `@types/` para una librería instalada en el espacio de trabajo se agregan automáticamente a la configuración de TypeScript para el proyecto que usa esa librería.
TypeScript busca tipos en el directorio `node_modules/@types` por defecto, así que no tienes que agregar cada paquete de tipos individualmente.

Si una librería no tiene tipados disponibles en `@types/`, puedes usarla agregando manualmente tipados para ella.
Para hacer esto:

1. Crea un archivo `typings.d.ts` en tu directorio `src/`.
    Este archivo se incluye automáticamente como definición de tipo global.

1. Agrega el siguiente código en `src/typings.d.ts`:

    <docs-code language="typescript">

    declare module 'host' {
      export interface Host {
        protocol?: string;
        hostname?: string;
        pathname?: string;
      }
      export function parse(url: string, queryString?: string): Host;
    }

    </docs-code>

1. En el componente o archivo que usa la librería, agrega el siguiente código:

    <docs-code language="typescript">

    import * as host from 'host';
    const parsedUrl = host.parse('https://angular.dev');
    console.log(parsedUrl.hostname);

    </docs-code>

Define más tipados según sea necesario.

## Actualizar librerías

Una librería puede ser actualizada por el publicador, y también tiene dependencias individuales que necesitan mantenerse actualizadas.
Para verificar actualizaciones de tus librerías instaladas, usa el comando [`ng update`][CliUpdate] de Angular CLI.

Usa el comando `ng update <lib_name>` de Angular CLI para actualizar versiones individuales de librerías.
El Angular CLI verifica la última versión publicada de la librería, y si la última versión es más reciente que tu versión instalada, la descarga y actualiza tu `package.json` para que coincida con la última versión.

Cuando actualizas Angular a una nueva versión, necesitas asegurarte de que cualquier librería que estés usando esté actualizada.
Si las librerías tienen interdependencias, es posible que tengas que actualizarlas en un orden particular.
Consulta la [Guía de actualización de Angular][AngularUpdateMain] para obtener ayuda.

## Agregar una librería al alcance global en tiempo de ejecución

Si una librería heredada de JavaScript no se importa en una aplicación, puedes agregarla al alcance global en tiempo de ejecución y cargarla como si se hubiera agregado en una etiqueta script.
Configura el Angular CLI para hacer esto en tiempo de compilación usando las opciones `scripts` y `styles` del objetivo de compilación en el archivo de configuración de compilación del espacio de trabajo [`angular.json`][GuideWorkspaceConfig].

Por ejemplo, para usar la librería [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction]:

1. Instala la librería y las dependencias asociadas usando el gestor de paquetes npm:

    <docs-code language="shell">

    npm install jquery --save
    npm install popper.js --save
    npm install bootstrap --save

    </docs-code>

1. En el archivo de configuración `angular.json`, agrega los archivos de script asociados al array `scripts`:

    <docs-code language="json">

    "scripts": [
      "node_modules/jquery/dist/jquery.slim.js",
      "node_modules/popper.js/dist/umd/popper.js",
      "node_modules/bootstrap/dist/js/bootstrap.js"
    ],

    </docs-code>

1. Agrega el archivo CSS `bootstrap.css` al array `styles`:

    <docs-code language="css">

    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.css",
      "src/styles.css"
    ],

    </docs-code>

1. Ejecuta o reinicia el comando `ng serve` de Angular CLI para ver Bootstrap 4 funcionar en tu aplicación.

### Usar librerías globales en tiempo de ejecución dentro de tu aplicación

Después de importar una librería usando el array "scripts", **no** la importes usando una declaración de importación en tu código TypeScript.
El siguiente fragmento de código es un ejemplo de declaración de importación.

<docs-code language="typescript">

import * as $ from 'jquery';

</docs-code>

Si la importas usando declaraciones de importación, tienes dos copias diferentes de la librería: una importada como librería global, y una importada como módulo.
Esto es especialmente malo para librerías con plugins, como JQuery, porque cada copia incluye diferentes plugins.

En su lugar, ejecuta el comando `npm install @types/jquery` de Angular CLI para descargar tipados para tu librería y luego sigue los pasos de instalación de la librería.
Esto te da acceso a las variables globales expuestas por esa librería.

### Definir tipados para librerías globales en tiempo de ejecución

Si la librería global que necesitas usar no tiene tipados globales, puedes declararlos manualmente como `any` en `src/typings.d.ts`.

Por ejemplo:

<docs-code language="typescript">

declare var libraryName: any;

</docs-code>

Algunos scripts extienden otras librerías; por ejemplo con plugins de JQuery:

<docs-code language="typescript">

$('.test').myPlugin();

</docs-code>

En este caso, el `@types/jquery` instalado no incluye `myPlugin`, así que necesitas agregar una interfaz en `src/typings.d.ts`.
Por ejemplo:

<docs-code language="typescript">

interface JQuery {
  myPlugin(options?: any): any;
}

</docs-code>

Si no agregas la interfaz para la extensión definida por el script, tu IDE muestra un error:

<docs-code language="text">

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

</docs-code>

[CliUpdate]: cli/update "ng update | CLI |Angular"

[GuideNpmPackages]: reference/configs/npm-packages "Workspace npm dependencies | Angular"

[GuideWorkspaceConfig]: reference/configs/workspace-config "Angular workspace configuration | Angular"

[Resources]: resources "Explore Angular Resources | Angular"

[AngularMaterialMain]: https://material.angular.dev "Angular Material | Angular"

[AngularUpdateMain]: https://angular.dev/update-guide "Angular Update Guide | Angular"

[GetbootstrapDocs40GettingStartedIntroduction]: https://getbootstrap.com/docs/4.0/getting-started/introduction "Introduction | Bootstrap"

[NpmjsMain]: https://www.npmjs.com "npm"

[YarnpkgMain]: https://yarnpkg.com " Yarn"
