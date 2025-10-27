# Construyendo aplicaciones Angular

Puedes construir tu aplicación o librería Angular CLI con el comando `ng build`.
Esto compilará tu código TypeScript a JavaScript, así como optimizará, empaquetará y minificará la salida según corresponda.

`ng build` solo ejecuta el builder para el objetivo `build` en el proyecto predeterminado como se especifica en `angular.json`.
Angular CLI incluye cuatro builders típicamente usados como objetivos `build`:

| Builder                                         | Propósito                                                                                                                                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular-devkit/build-angular:application`     | Construye una aplicación con un bundle del lado del cliente, un servidor Node y rutas prerenderizadas en tiempo de construcción con [esbuild](https://esbuild.github.io/).                                     |
| `@angular-devkit/build-angular:browser-esbuild` | Empaqueta una aplicación del lado del cliente para usar en un navegador con [esbuild](https://esbuild.github.io/). Consulta la [documentación de `browser-esbuild`](tools/cli/build-system-migration#manual-migration-to-the-compatibility-builder) para más información. |
| `@angular-devkit/build-angular:browser`         | Empaqueta una aplicación del lado del cliente para usar en un navegador con [webpack](https://webpack.js.org/).                                                                                   |
| `@angular-devkit/build-angular:ng-packagr`      | Construye una librería Angular adhiriéndose al [Angular Package Format](tools/libraries/angular-package-format).                                                                           |

Las aplicaciones generadas por `ng new` usan `@angular-devkit/build-angular:application` por defecto.
Las librerías generadas por `ng generate library` usan `@angular-devkit/build-angular:ng-packagr` por defecto.

Puedes determinar qué builder se está usando para un proyecto en particular buscando el objetivo `build` para ese proyecto.

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build` invoca el objetivo Architect llamado `build`.
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          …
        },
        "serve": { … }
        "test": { … }
        …
      }
    }
  }
}

</docs-code>

Esta página discute el uso y las opciones de `@angular-devkit/build-angular:application`.

## Directorio de salida

El resultado de este proceso de construcción se envía a un directorio (`dist/${PROJECT_NAME}` por defecto).

## Configurar presupuestos de tamaño

A medida que las aplicaciones crecen en funcionalidad, también crecen en tamaño.
El CLI te permite establecer umbrales de tamaño en tu configuración para asegurar que partes de tu aplicación se mantengan dentro de los límites de tamaño que defines.

Define tus límites de tamaño en el archivo de configuración del CLI, `angular.json`, en una sección `budgets` para cada [entorno configurado](tools/cli/environments).

<docs-code language="json">

{
  …
  "configurations": {
    "production": {
      …
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "250kb",
          "maximumError": "500kb"
        },
      ]
    }
  }
}

</docs-code>

Puedes especificar presupuestos de tamaño para toda la aplicación y para partes particulares.
Cada entrada de presupuesto configura un presupuesto de un tipo dado.
Especifica valores de tamaño en los siguientes formatos:

| Valor de tamaño | Detalles                                                                     |
| :-------------- | :-------------------------------------------------------------------------- |
| `123` o `123b` | Tamaño en bytes.                                                              |
| `123kb`         | Tamaño en kilobytes.                                                          |
| `123mb`         | Tamaño en megabytes.                                                          |
| `12%`           | Porcentaje de tamaño relativo a la línea base. \(No válido para valores de línea base.\) |

Cuando configuras un presupuesto, el builder advierte o reporta un error cuando una parte dada de la aplicación alcanza o excede un tamaño límite que estableciste.

Cada entrada de presupuesto es un objeto JSON con las siguientes propiedades:

| Propiedad       | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | El tipo de presupuesto. Uno de: <table> <thead> <tr> <th> Valor </th> <th> Detalles </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> El tamaño de un bundle específico. </td> </tr> <tr> <td> <code>initial</code> </td> <td> El tamaño de JavaScript y CSS necesario para inicializar la aplicación. Por defecto advierte en 500kb y da error en 1mb. </td> </tr> <tr> <td> <code>allScript</code> </td> <td> El tamaño de todos los scripts. </td> </tr> <tr> <td> <code>all</code> </td> <td> El tamaño de toda la aplicación. </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> El tamaño de cualquier hoja de estilos de componente. Por defecto advierte en 2kb y da error en 4kb. </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> El tamaño de cualquier script. </td> </tr> <tr> <td> <code>any</code> </td> <td> El tamaño de cualquier archivo. </td> </tr> </tbody> </table> |
| name           | El nombre del bundle (para `type=bundle`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| baseline       | El tamaño de línea base para comparación.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| maximumWarning | El umbral máximo para advertencia relativo a la línea base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| maximumError   | El umbral máximo para error relativo a la línea base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| minimumWarning | El umbral mínimo para advertencia relativo a la línea base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| minimumError   | El umbral mínimo para error relativo a la línea base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| warning        | El umbral para advertencia relativo a la línea base (mín y máx).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| error          | El umbral para error relativo a la línea base (mín y máx).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Configurar dependencias CommonJS

Siempre prefiere [módulos ECMAScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) nativos (ESM) en toda tu aplicación y sus dependencias.
ESM es un estándar web completamente especificado y una característica del lenguaje JavaScript con soporte de análisis estático fuerte. Esto hace que las optimizaciones de bundles sean más potentes que otros formatos de módulos.

Angular CLI también soporta importar dependencias [CommonJS](https://nodejs.org/api/modules.html) en tu proyecto y empaquetará estas dependencias automáticamente.
Sin embargo, los módulos CommonJS pueden prevenir que los bundlers y minificadores optimicen esos módulos efectivamente, lo que resulta en tamaños de bundle más grandes.
Para más información, consulta [Cómo CommonJS está haciendo tus bundles más grandes](https://web.dev/commonjs-larger-bundles).

Angular CLI emite advertencias si detecta que tu aplicación de navegador depende de módulos CommonJS.
Cuando encuentres una dependencia CommonJS, considera pedir al mantenedor que soporte módulos ECMAScript, contribuir ese soporte tú mismo, o usar una dependencia alternativa que satisfaga tus necesidades.
Si la mejor opción es usar una dependencia CommonJS, puedes deshabilitar estas advertencias agregando el nombre del módulo CommonJS a la opción `allowedCommonJsDependencies` en las opciones `build` ubicadas en `angular.json`.

<docs-code language="json">

"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     …
   }
   …
},

</docs-code>

## Configurar compatibilidad de navegadores

El Angular CLI usa [Browserslist](https://github.com/browserslist/browserslist) para asegurar compatibilidad con diferentes versiones de navegadores.
Dependiendo de los navegadores soportados, Angular transformará automáticamente ciertas características de JavaScript y CSS para asegurar que la aplicación construida no use una característica que no ha sido implementada por un navegador soportado. Sin embargo, el Angular CLI no agregará automáticamente polyfills para suplementar APIs Web faltantes. Usa la opción `polyfills` en `angular.json` para agregar polyfills.

Por defecto, el Angular CLI usa una configuración `browserslist` que [coincide con los navegadores soportados por Angular](reference/versions#browser-support) para la versión mayor actual.

Para sobrescribir la configuración interna, ejecuta [`ng generate config browserslist`](cli/generate/config), que genera un archivo de configuración `.browserslistrc` en el directorio del proyecto coincidiendo con los navegadores soportados de Angular.

Consulta el [repositorio de browserslist](https://github.com/browserslist/browserslist) para más ejemplos de cómo apuntar a navegadores y versiones específicas.
Evita expandir esta lista a más navegadores. Incluso si tu código de aplicación es más ampliamente compatible, Angular mismo podría no serlo.
Solo deberías _reducir_ el conjunto de navegadores o versiones en esta lista.

ÚTIL: Usa [browsersl.ist](https://browsersl.ist) para mostrar navegadores compatibles para una consulta `browserslist`.

## Configurar Tailwind

Angular soporta [Tailwind CSS](https://tailwindcss.com/), un framework CSS utility-first.

Para integrar Tailwind CSS con Angular CLI, consulta [Usando Tailwind CSS con Angular](guide/tailwind)