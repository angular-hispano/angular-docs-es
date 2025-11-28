# Configurando entornos de aplicación

Puedes definir diferentes configuraciones de construcción con nombre para tu proyecto, como `development` y `staging`, con diferentes valores predeterminados.

Cada configuración con nombre puede tener valores predeterminados para cualquiera de las opciones que se aplican a los diversos objetivos del builder, como `build`, `serve` y `test`.
Los comandos `build`, `serve` y `test` del [Angular CLI](tools/cli) pueden entonces reemplazar archivos con versiones apropiadas para tu entorno objetivo deseado.

## Configuraciones del Angular CLI

Los builders del Angular CLI soportan un objeto `configurations`, que permite sobrescribir opciones específicas para un builder basado en la configuración proporcionada en la línea de comandos.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // By default, disable source map generation.
            "sourceMap": false
          },
          "configurations": {
            // For the `debug` configuration, enable source maps.
            "debug": {
              "sourceMap": true
            }
          }
        },
        …
      }
    }
  }
}

```

Puedes elegir qué configuración usar con la opción `--configuration`.

```shell

ng build --configuration debug

```

Las configuraciones pueden aplicarse a cualquier builder del Angular CLI. Se pueden especificar múltiples configuraciones con un separador de coma. Las configuraciones se aplican en orden, con opciones conflictivas usando el valor de la última configuración.

```shell

ng build --configuration debug,production,customer-facing

```

## Configurar valores predeterminados específicos del entorno

`@angular-devkit/build-angular:browser` soporta reemplazos de archivos, una opción para sustituir archivos fuente antes de ejecutar una construcción.
Usar esto en combinación con `--configuration` proporciona un mecanismo para configurar datos específicos del entorno en tu aplicación.

Comienza [generando entornos](cli/generate/environments) para crear el directorio `src/environments/` y configurar el proyecto para usar reemplazos de archivos.

```shell

ng generate environments

```

El directorio `src/environments/` del proyecto contiene el archivo de configuración base, `environment.ts`, que proporciona la configuración predeterminada para producción.
Puedes sobrescribir valores predeterminados para entornos adicionales, como `development` y `staging`, en archivos de configuración específicos del objetivo.

Por ejemplo:

```text

my-app/src/environments
├── environment.development.ts
├── environment.staging.ts
└── environment.ts

```

El archivo base `environment.ts`, contiene la configuración de entorno predeterminada.
Por ejemplo:

```ts

export const environment = {
  production: true
};

```

El comando `build` usa esto como objetivo de construcción cuando no se especifica ningún entorno.
Puedes agregar más variables, ya sea como propiedades adicionales en el objeto environment, o como objetos separados.
Por ejemplo, lo siguiente agrega un valor predeterminado para una variable al entorno predeterminado:

```ts

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

```

Puedes agregar archivos de configuración específicos del objetivo, como `environment.development.ts`.
El siguiente contenido establece valores predeterminados para el objetivo de construcción de desarrollo:

```ts

export const environment = {
  production: false,
  apiUrl: 'http://my-dev-url'
};

```

## Usando variables específicas del entorno en tu aplicación

Para usar las configuraciones de entorno que has definido, tus componentes deben importar el archivo de entornos original:

```ts

import { environment } from './environments/environment';

```

Esto asegura que los comandos build y serve puedan encontrar las configuraciones para objetivos de construcción específicos.

El siguiente código en el archivo del componente (`app.component.ts`) usa una variable de entorno definida en los archivos de configuración.

```ts

import { environment } from './../environments/environment';

// Obtiene de `http://my-prod-url` en producción, `http://my-dev-url` en desarrollo.
fetch(environment.apiUrl);

```

El archivo de configuración principal del CLI, `angular.json`, contiene una sección `fileReplacements` en la configuración para cada objetivo de construcción, que te permite reemplazar cualquier archivo en el programa TypeScript con una versión específica del objetivo de ese archivo.
Esto es útil para incluir código o variables específicas del objetivo en una construcción que apunta a un entorno específico, como producción o staging.

Por defecto no se reemplazan archivos, sin embargo `ng generate environments` configura esto automáticamente.
Puedes cambiar o agregar reemplazos de archivos para objetivos de construcción específicos editando directamente la configuración `angular.json`.

```json

  "configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        …

```

Esto significa que cuando construyes tu configuración de desarrollo con `ng build --configuration development`, el archivo `src/environments/environment.ts` es reemplazado con la versión específica del objetivo del archivo, `src/environments/environment.development.ts`.

Para agregar un entorno staging, crea una copia de `src/environments/environment.ts` llamada `src/environments/environment.staging.ts`, luego agrega una configuración `staging` a `angular.json`:

```json

  "configurations": {
    "development": { … },
    "production": { … },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

```

También puedes agregar más opciones de configuración a este entorno objetivo.
Cualquier opción que tu construcción soporte puede sobrescribirse en una configuración de objetivo de construcción.

Para construir usando la configuración staging, ejecuta el siguiente comando:

```shell

ng build --configuration staging

```

Por defecto, el objetivo `build` incluye configuraciones `production` y `development` y `ng serve` usa la construcción de desarrollo de la aplicación.
También puedes configurar `ng serve` para usar la configuración de construcción objetivo si estableces la opción `buildTarget`:

```json

  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": { … },
    "configurations": {
      "development": {
        // Usa la configuración `development` del objetivo `build`.
        "buildTarget": "my-app:build:development"
      },
      "production": {
        // Usa la configuración `production` del objetivo `build`.
        "buildTarget": "my-app:build:production"
      }
    },
    "defaultConfiguration": "development"
  },

```

La opción `defaultConfiguration` especifica qué configuración se usa por defecto.
Cuando `defaultConfiguration` no está establecida, `options` se usa directamente sin modificación.
