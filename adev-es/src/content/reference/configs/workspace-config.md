# Configuración del espacio de trabajo de Angular

El archivo `angular.json` en el nivel raíz de un espacio de trabajo de Angular proporciona valores de configuración predeterminados para todo el espacio de trabajo y para proyectos específicos. Estos son utilizados por las herramientas de compilación y desarrollo que provee el Angular CLI.
Los valores de ruta indicados en la configuración son relativos al directorio raíz del espacio de trabajo.

## Estructura general del JSON

En el nivel superior de `angular.json`, algunas propiedades configuran el espacio de trabajo y una sección `projects` contiene las demás opciones de configuración por proyecto.
Puedes sobrescribir los valores predeterminados del Angular CLI establecidos a nivel del espacio de trabajo mediante valores definidos a nivel de proyecto.
También puedes sobrescribir los valores predeterminados a nivel de proyecto usando la línea de comandos.

Las siguientes propiedades, en el nivel superior del archivo, configuran el espacio de trabajo.

| Propiedades      | Detalles                                                                                                                                                                                                |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `version`        | La versión del archivo de configuración.                                                                                                                                                                |
| `newProjectRoot` | Ruta donde se crean nuevos proyectos mediante herramientas como `ng generate application` o `ng generate library`. La ruta puede ser absoluta o relativa al directorio del espacio de trabajo. El valor predeterminado es `projects` |
| `cli`            | Un conjunto de opciones que personalizan el [Angular CLI](tools/cli). Consulta las [opciones de configuración del Angular CLI](#opciones-de-configuración-del-angular-cli) más abajo.                   |
| `schematics`     | Un conjunto de [schematics](tools/cli/schematics) que personalizan los valores predeterminados de las opciones del subcomando `ng generate` para este espacio de trabajo. Consulta [schematics](#schematics) más abajo. |
| `projects`       | Contiene una subsección para cada aplicación o biblioteca del espacio de trabajo, con opciones de configuración específicas del proyecto.                                                                |

La aplicación inicial que creas con `ng new app-name` aparece en la sección "projects":

Cuando creas un proyecto de biblioteca con `ng generate library`, el proyecto de biblioteca también se agrega a la sección `projects`.

ÚTIL: La sección `projects` del archivo de configuración no corresponde exactamente a la estructura de archivos del espacio de trabajo.

<!-- markdownlint-disable-next-line MD032 -->

- La aplicación inicial creada con `ng new` se encuentra en el nivel superior de la estructura de archivos del espacio de trabajo.
- Las demás aplicaciones y bibliotecas están en el directorio `projects` de forma predeterminada.

Para más información, consulta [Estructura de archivos del espacio de trabajo y del proyecto](reference/configs/file-structure).

## Opciones de configuración del Angular CLI

Las siguientes propiedades son un conjunto de opciones que personalizan el Angular CLI.

| Propiedad              | Detalles                                                                                                                                                                                         | Tipo de valor                               | Valor predeterminado |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ | :------------------- |
| `analytics`            | Comparte datos de uso anónimos con el equipo de Angular. Un valor booleano indica si se comparten o no los datos, mientras que una cadena UUID los comparte usando un identificador seudónimo.   | `boolean` \| `string`                       | `false`              |
| `cache`                | Controla la [caché persistente en disco](cli/cache) utilizada por los [builders del Angular CLI](tools/cli/cli-builder).                                                                         | [Opciones de caché](#opciones-de-caché)     | `{}`                 |
| `schematicCollections` | Lista las colecciones de schematics a usar en `ng generate`.                                                                                                                                     | `string[]`                                  | `[]`                 |
| `packageManager`       | La herramienta de gestión de paquetes preferida.                                                                                                                                                 | `npm` \| `cnpm` \| `pnpm` \| `yarn`\| `bun` | `npm`                |
| `warnings`             | Controla las advertencias de consola específicas del Angular CLI.                                                                                                                                | [Opciones de advertencias](#opciones-de-advertencias) | `{}`        |

### Opciones de caché

| Propiedad     | Detalles                                                                                                                                                                                                                                                        | Tipo de valor            | Valor predeterminado |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :------------------- |
| `enabled`     | Configura si el almacenamiento en caché en disco está habilitado para las compilaciones.                                                                                                                                                                        | `boolean`                | `true`               |
| `environment` | Configura en qué entorno se habilita la caché en disco.<br><br>_ `ci` habilita la caché solo en entornos de integración continua (CI).<br>_ `local` habilita la caché solo _fuera_ de los entornos CI.<br>\* `all` habilita la caché en todas partes.          | `local` \| `ci` \| `all` | `local`              |
| `path`        | El directorio utilizado para almacenar los resultados de la caché.                                                                                                                                                                                              | `string`                 | `.angular/cache`     |

### Opciones de advertencias

| Propiedad         | Detalles                                                                                       | Tipo de valor | Valor predeterminado |
| :---------------- | :--------------------------------------------------------------------------------------------- | :--------- | :------------------- |
| `versionMismatch` | Muestra una advertencia cuando la versión global del Angular CLI es más reciente que la local. | `boolean`  | `true`               |

## Opciones de configuración del proyecto

Las siguientes propiedades de configuración de nivel superior están disponibles para cada proyecto, en `projects['project-name']`.

| Propiedad     | Detalles                                                                                                                                                                                        | Tipo de valor                                                          | Valor predeterminado |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- | :------------------- |
| `root`        | El directorio raíz de los archivos de este proyecto, relativo al directorio del espacio de trabajo. Vacío para la aplicación inicial, que reside en el nivel superior del espacio de trabajo.   | `string`                                                               | Ninguno (requerido)  |
| `projectType` | Puede ser "application" o "library". Una aplicación puede ejecutarse de forma independiente en un navegador, mientras que una biblioteca no.                                                    | `application` \| `library`                                             | Ninguno (requerido)  |
| `sourceRoot`  | El directorio raíz de los archivos fuente de este proyecto.                                                                                                                                     | `string`                                                               | `''`                 |
| `prefix`      | Una cadena que Angular antepone a los selectores al generar nuevos componentes, directivas y pipes con `ng generate`. Se puede personalizar para identificar una aplicación o área de funcionalidad. | `string`                                                           | `'app'`              |
| `schematics`  | Un conjunto de schematics que personalizan los valores predeterminados de las opciones del subcomando `ng generate` para este proyecto. Consulta la sección [schematics](#schematics) de generación. | Consulta [schematics](#schematics)                                | `{}`                 |
| `architect`   | Valores de configuración predeterminados para los targets de builder de Architect para este proyecto.                                                                                           | Consulta [Configuración de targets de builder](#configuración-de-targets-de-builder) | `{}`    |

## Schematics

Los [schematics de Angular](tools/cli/schematics) son instrucciones para modificar un proyecto añadiendo nuevos archivos o modificando los existentes.
Pueden configurarse mapeando el nombre del schematic a un conjunto de opciones predeterminadas.

El "nombre" de un schematic tiene el formato: `<paquete-schematic>:<nombre-schematic>`.
Los schematics para los subcomandos predeterminados de `ng generate` del Angular CLI están recopilados en el paquete [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).
Por ejemplo, el schematic para generar un componente con `ng generate component` es `@schematics/angular:component`.

Los campos del esquema del schematic corresponden a los valores de argumento de línea de comandos permitidos y los valores predeterminados para las opciones del subcomando del Angular CLI.
Puedes actualizar el archivo de esquema de tu espacio de trabajo para establecer un valor predeterminado diferente para una opción de subcomando. Por ejemplo, para desactivar `standalone` en `ng generate component` de forma predeterminada:

```json
{
  "projects": {
    "my-app": {
      "schematics": {
        "@schematics/angular:component": {
          "standalone": false
        }
      }
    }
  }
}
```

## Configuración de builders del CLI

Architect es la herramienta que usa el Angular CLI para realizar tareas complejas, como la compilación y la ejecución de pruebas.
Architect es una capa que ejecuta un builder específico para realizar una tarea determinada, según la configuración del target.
Puedes definir y configurar nuevos builders y targets para extender el Angular CLI.
Consulta [builders del Angular CLI](tools/cli/cli-builder).

### Builders y targets predeterminados de Architect

Angular define builders predeterminados para usar con comandos específicos o con el comando general `ng run`.
Los esquemas JSON que definen las opciones y valores predeterminados de cada uno de estos builders están recopilados en el paquete [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json).
Los esquemas configuran las opciones para los siguientes builders.

### Configuración de targets de builder

La sección `architect` de `angular.json` contiene un conjunto de targets de Architect.
Muchos de los targets corresponden a los comandos del Angular CLI que los ejecutan.
Otros targets pueden ejecutarse con el comando `ng run`, y puedes definir tus propios targets.

Cada objeto de target especifica el `builder` para ese target, que es el paquete npm de la herramienta que ejecuta Architect.
Cada target también tiene una sección `options` que configura las opciones predeterminadas del target, y una sección `configurations` que nombra y especifica configuraciones alternativas para el target.
Consulta el ejemplo en [target de compilación](#target-de-compilación) más abajo.

| Propiedad      | Detalles                                                                                                                                                                                                    |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`        | Configura los valores predeterminados para las opciones del comando `ng build`. Consulta la sección [target de compilación](#target-de-compilación) para más información.                                   |
| `serve`        | Sobrescribe los valores predeterminados de compilación y proporciona valores adicionales para el comando `ng serve`. Además de las opciones disponibles para `ng build`, añade opciones relacionadas con el servidor de la aplicación. |
| `e2e`          | Sobrescribe los valores predeterminados de compilación para construir aplicaciones de prueba de extremo a extremo con el comando `ng e2e`.                                                                   |
| `test`         | Sobrescribe los valores predeterminados de compilación para builds de prueba y proporciona valores predeterminados adicionales para ejecutar pruebas con el comando `ng test`.                               |
| `lint`         | Configura los valores predeterminados para las opciones del comando `ng lint`, que realiza análisis estático del código en los archivos fuente del proyecto.                                                 |
| `extract-i18n` | Configura los valores predeterminados para las opciones del comando `ng extract-i18n`, que extrae cadenas de mensajes localizados del código fuente y genera archivos de traducción para la internacionalización. |

ÚTIL: Todas las opciones del archivo de configuración deben usar `camelCase`, en lugar de `dash-case` como se usa en la línea de comandos.

## Target de compilación

Cada target en `architect` tiene las siguientes propiedades:

| Propiedad        | Detalles                                                                                                                                                                                                                                                    |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `builder`        | El builder del CLI usado para crear este target, con el formato `<nombre-paquete>:<nombre-builder>`.                                                                                                                                                        |
| `options`        | Opciones predeterminadas del target de compilación.                                                                                                                                                                                                         |
| `configurations` | Configuraciones alternativas para ejecutar el target. Cada configuración establece los valores predeterminados para el entorno previsto, sobrescribiendo el valor asociado en `options`. Consulta [configuraciones de compilación alternativas](#configuraciones-de-compilación-alternativas) más abajo. |

Por ejemplo, para configurar una compilación con las optimizaciones desactivadas:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          }
        }
      }
    }
  }
}
```

### Configuraciones de compilación alternativas

El Angular CLI incluye dos configuraciones de compilación: `production` y `development`.
De forma predeterminada, el comando `ng build` usa la configuración `production`, que aplica varias optimizaciones de compilación, entre ellas:

- Agrupación de archivos en bundles
- Eliminación del espacio en blanco excesivo
- Eliminación de comentarios y código muerto
- Minificación del código para usar nombres cortos y ofuscados

Puedes definir y nombrar configuraciones alternativas adicionales (como `staging`, por ejemplo) apropiadas para tu proceso de desarrollo.
Puedes seleccionar una configuración alternativa pasando su nombre al flag de línea de comandos `--configuration`.

Por ejemplo, para configurar una compilación donde la optimización se habilita solo para builds de producción (`ng build --configuration production`):

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          },
          "configurations": {
            "production": {
              "optimization": true
            }
          }
        }
      }
    }
  }
}
```

También puedes pasar más de un nombre de configuración como una lista separada por comas.
Por ejemplo, para aplicar las configuraciones de compilación `staging` y `french` al mismo tiempo, usa el comando `ng build --configuration staging,french`.
En este caso, el comando analiza las configuraciones nombradas de izquierda a derecha.
Si varias configuraciones cambian la misma opción, el último valor establecido es el definitivo.
En este ejemplo, si tanto `staging` como `french` establecen la ruta de salida, se usará el valor de `french`.

### Opciones adicionales de compilación y prueba

Las opciones configurables para una compilación predeterminada o con target generalmente corresponden a las opciones disponibles para los comandos [`ng build`](cli/build) y [`ng test`](cli/test).
Para más detalles sobre esas opciones y sus posibles valores, consulta la [Referencia del Angular CLI](cli).

| Propiedades de opciones    | Detalles                                                                                                                                                                                                                                                                   |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`                   | Un objeto con rutas a los recursos estáticos que se sirven con la aplicación. Las rutas predeterminadas apuntan al directorio `public` del proyecto. Consulta más en la sección [configuración de assets](#configuración-de-assets).                                        |
| `styles`                   | Un array de archivos CSS que se añaden al contexto global del proyecto. El Angular CLI admite importaciones CSS y todos los principales preprocesadores CSS. Consulta más en la sección [configuración de estilos y scripts](#configuración-de-estilos-y-scripts).           |
| `stylePreprocessorOptions` | Un objeto con pares opción-valor que se pasan a los preprocesadores de estilos. Consulta más en la sección [configuración de estilos y scripts](#configuración-de-estilos-y-scripts).                                                                                       |
| `scripts`                  | Un objeto con archivos JavaScript que se añaden a la aplicación. Los scripts se cargan exactamente como si los hubieras añadido en una etiqueta `<script>` dentro de `index.html`. Consulta más en la sección [configuración de estilos y scripts](#configuración-de-estilos-y-scripts). |
| `budgets`                  | Tipo y umbrales del presupuesto de tamaño predeterminado para toda la aplicación o partes de ella. Puedes configurar el builder para reportar una advertencia o un error cuando la salida alcance o supere un tamaño umbral. Consulta [Configurar presupuestos de tamaño](tools/cli/build#configure-size-budgets). |
| `fileReplacements`         | Un objeto con archivos y sus reemplazos en tiempo de compilación. Consulta más en [Configurar reemplazos de archivos según el target](tools/cli/build#configure-target-specific-file-replacements).                                                                         |
| `index`                    | Un documento HTML base que carga la aplicación. Consulta más en [configuración de index](#configuración-de-index).                                                                                                                                                          |
| `security`                 | Un objeto que contiene la clave `autoCsp`, que puede establecerse en `true` o `false`                                                                                                                                                                                       |

### Opciones adicionales del servidor de desarrollo

El servidor de desarrollo tiene su propio conjunto de opciones que generalmente corresponden a las disponibles para el comando [`ng serve`](cli/serve).

| Propiedades de opciones | Detalles                                                                                                                                                                                                              |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedHosts`       | Un array de hosts a los que responderá el servidor de desarrollo. Esta opción establece la opción de Vite con el mismo nombre. Para más detalles, [consulta la documentación de Vite](https://vite.dev/config/server-options.html#server-allowedhosts) |

## Valores de configuración complejos

Las opciones `assets`, `index`, `outputPath`, `styles` y `scripts` pueden tener valores de cadena de ruta simples o valores de objeto con campos específicos.
Las opciones `sourceMap` y `optimization` pueden establecerse con un valor booleano simple, o también pueden recibir un valor complejo usando el archivo de configuración.

Las siguientes secciones ofrecen más detalles sobre cómo se usan estos valores complejos en cada caso.

### Configuración de assets

Cada configuración del target `build` puede incluir un array `assets` que lista los archivos o carpetas que deseas copiar tal cual al compilar tu proyecto.
De forma predeterminada, se copian los contenidos del directorio `public/`.

Para excluir un asset, puedes eliminarlo de la configuración de assets.

Puedes configurar más detalladamente los assets a copiar especificándolos como objetos, en lugar de rutas simples relativas a la raíz del espacio de trabajo.
Un objeto de especificación de asset puede tener los siguientes campos.

| Campos           | Detalles                                                                                                                                    |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `glob`           | Un [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) que usa `input` como directorio base.                             |
| `input`          | Una ruta relativa a la raíz del espacio de trabajo.                                                                                         |
| `output`         | Una ruta relativa a `outDir`. Por razones de seguridad, el Angular CLI nunca escribe archivos fuera de la ruta de salida del proyecto.       |
| `ignore`         | Una lista de globs a excluir.                                                                                                               |
| `followSymlinks` | Permite que los patrones glob sigan directorios de enlace simbólico. Esto permite buscar en los subdirectorios del enlace simbólico. El valor predeterminado es `false`. |

Por ejemplo, las rutas de assets predeterminadas pueden representarse con más detalle usando los siguientes objetos.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "output": "/assets/"
              },
              {
                "glob": "favicon.ico",
                "input": "src/",
                "output": "/"
              }
            ]
          }
        }
      }
    }
  }
}
```

El siguiente ejemplo usa el campo `ignore` para excluir ciertos archivos del directorio de assets de ser copiados en la compilación:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "ignore": ["**/*.svg"],
                "output": "/assets/"
              }
            ]
          }
        }
      }
    }
  }
}
```

### Configuración de estilos y scripts

Una entrada del array para las opciones `styles` y `scripts` puede ser una cadena de ruta simple, o un objeto que apunte a un archivo de punto de entrada adicional.
El builder asociado carga ese archivo y sus dependencias como un bundle separado durante la compilación.
Con un objeto de configuración, tienes la opción de nombrar el bundle para el punto de entrada usando el campo `bundleName`.

El bundle se inyecta de forma predeterminada, pero puedes establecer `inject` en `false` para excluirlo de la inyección.
Por ejemplo, los siguientes valores de objeto crean y nombran un bundle que contiene estilos y scripts, y lo excluyen de la inyección:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "styles": [
              {
                "input": "src/external-module/styles.scss",
                "inject": false,
                "bundleName": "external-module"
              }
            ],
            "scripts": [
              {
                "input": "src/external-module/main.js",
                "inject": false,
                "bundleName": "external-module"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Opciones del preprocesador de estilos

En Sass, puedes utilizar la función `includePaths` tanto para estilos de componentes como para estilos globales. Esto te permite añadir rutas base adicionales que se verifican al resolver importaciones.

Para añadir rutas, usa la opción `stylePreprocessorOptions`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": ["src/style-paths"]
            }
          }
        }
      }
    }
  }
}
```

Los archivos en ese directorio, como `src/style-paths/_variables.scss`, pueden importarse desde cualquier parte de tu proyecto sin necesidad de una ruta relativa:

```scss
// src/app/app.component.scss
// Una ruta relativa funciona
@import "../style-paths/variables";

// Pero ahora esto también funciona
@import "variables";
```

ÚTIL: También necesitas añadir cualquier estilo o script al builder `test` si los necesitas para las pruebas unitarias.
Consulta también [Usar bibliotecas globales en tiempo de ejecución dentro de tu aplicación](tools/libraries/using-libraries#using-runtime-global-libraries-inside-your-app).

### Configuración de optimización

La opción `optimization` puede ser un booleano o un objeto para una configuración más detallada.
Esta opción habilita varias optimizaciones de la salida de compilación, entre ellas:

- Minificación de scripts y estilos
- Tree-shaking
- Eliminación de código muerto
- [Inlining de CSS crítico](/tools/cli/build#critical-css-inlining)
- Inlining de fuentes

Varias opciones pueden usarse para ajustar con detalle la optimización de una aplicación.

| Opciones  | Detalles                                                              | Tipo de valor                                                                          | Valor predeterminado |
| :-------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :------------------- |
| `scripts` | Habilita la optimización de la salida de scripts.                     | `boolean`                                                                              | `true`               |
| `styles`  | Habilita la optimización de la salida de estilos.                     | `boolean` \| [Opciones de optimización de estilos](#opciones-de-optimización-de-estilos) | `true`             |
| `fonts`   | Habilita la optimización para fuentes. Requiere acceso a Internet.    | `boolean` \| [Opciones de optimización de fuentes](#opciones-de-optimización-de-fuentes) | `true`             |

#### Opciones de optimización de estilos

| Opciones                | Detalles                                                                                                                     | Tipo de valor | Valor predeterminado |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------- |
| `minify`                | Minifica las definiciones CSS eliminando espacios en blanco y comentarios innecesarios, fusionando identificadores y minimizando valores. | `boolean` | `true`    |
| `inlineCritical`        | Extrae e inserta en línea las definiciones de CSS crítico para mejorar el [First Contentful Paint](https://web.dev/first-contentful-paint). | `boolean` | `true` |
| `removeSpecialComments` | Elimina comentarios en el CSS global que contengan `@license` o `@preserve`, o que comiencen con `//!` o `/*!`.              | `boolean`  | `true`               |

#### Opciones de optimización de fuentes

| Opciones  | Detalles                                                                                                                                                                                                                  | Tipo de valor | Valor predeterminado |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------- |
| `inline` | Reduce las [solicitudes que bloquean el renderizado](https://web.dev/render-blocking-resources) insertando en línea las definiciones CSS de fuentes externas de Google Fonts y Adobe Fonts en el archivo HTML index de la aplicación. Requiere acceso a Internet. | `boolean` | `true` |

Puedes proporcionar un valor como el siguiente para aplicar optimización a uno u otro:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": ["src/style-paths"]
            }
          }
        }
      }
    }
  }
}
```

### Configuración de source maps

La opción `sourceMap` del builder puede ser un booleano o un objeto para una configuración más detallada que controla los source maps de una aplicación.

| Opciones         | Detalles                                                     | Tipo de valor | Valor predeterminado |
| :--------------- | :----------------------------------------------------------- | :--------- | :------------------- |
| `scripts`        | Genera source maps para todos los scripts.                   | `boolean`  | `true`               |
| `styles`         | Genera source maps para todos los estilos.                   | `boolean`  | `true`               |
| `vendor`         | Resuelve los source maps de paquetes de terceros.            | `boolean`  | `false`              |
| `hidden`         | Omite el enlace a los source maps en el JavaScript de salida. | `boolean` | `false`              |
| `sourcesContent` | Incluye el contenido fuente original de los archivos en los source maps. | `boolean` | `true`      |

El siguiente ejemplo muestra cómo alternar uno o más valores para configurar las salidas de source maps:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": false,
              "hidden": true,
              "vendor": true
            }
          }
        }
      }
    }
  }
}
```

ÚTIL: Al usar source maps ocultos, los source maps no se referencian en el bundle.
Son útiles si solo quieres que los source maps mapeen los stack traces en herramientas de reporte de errores sin que aparezcan en las herramientas para desarrolladores del navegador.
Ten en cuenta que, aunque `hidden` evita que el source map se enlace en el bundle de salida, tu proceso de despliegue debe asegurarse de no servir los source maps generados en producción, de lo contrario la información igualmente queda expuesta.

#### Source maps sin contenido de fuentes

Puedes generar source maps sin el campo `sourcesContent`, que contiene el código fuente original.
Esto te permite desplegar source maps en producción para mejorar el reporte de errores con nombres de fuentes originales, mientras proteges tu código fuente de quedar expuesto.

Para excluir el contenido de fuentes de los source maps, establece la opción `sourcesContent` en `false`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": true,
              "sourcesContent": false
            }
          }
        }
      }
    }
  }
}
```

### Configuración de index

Configura la generación del HTML index de la aplicación.

La opción `index` puede ser una cadena o un objeto para una configuración más detallada.

Al proporcionar el valor como cadena, el nombre del archivo de la ruta especificada se usará para el archivo generado y se creará en la raíz de la ruta de salida configurada de la aplicación.

#### Opciones de index

| Opciones  | Detalles                                                                                                                                                                                    | Tipo de valor | Valor predeterminado |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------- |
| `input`  | La ruta del archivo a usar para el HTML index generado de la aplicación.                                                                                                                    | `string`   | Ninguno (requerido)  |
| `output` | La ruta de salida del archivo HTML index generado de la aplicación. Se usará la ruta completa proporcionada y se considerará relativa a la ruta de salida configurada de la aplicación.     | `string`   | `index.html`         |

### Configuración de la ruta de salida

La opción `outputPath` puede ser una cadena que se usará como valor de `base`, o un objeto para una configuración más detallada.

Varias opciones pueden usarse para ajustar con detalle la estructura de salida de una aplicación.

| Opciones  | Detalles                                                                                                                                                                                  | Tipo de valor | Valor predeterminado |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------- |
| `base`    | Especifica la ruta de salida relativa a la raíz del espacio de trabajo.                                                                                                                   | `string`   |                      |
| `browser` | El nombre del directorio de salida para la compilación del navegador, dentro de la ruta de salida base. Se puede servir a los usuarios de forma segura.                                   | `string`   | `browser`            |
| `server`  | El nombre del directorio de salida de la compilación del servidor dentro de la ruta de salida base.                                                                                       | `string`   | `server`             |
| `media`   | El nombre del directorio de salida para los archivos multimedia ubicados en el directorio de salida del navegador. Estos archivos multimedia suelen denominarse recursos en los archivos CSS. | `string` | `media`              |
