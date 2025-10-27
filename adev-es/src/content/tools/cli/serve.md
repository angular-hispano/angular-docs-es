# Sirviendo aplicaciones Angular para desarrollo

Puedes servir tu aplicación Angular CLI con el comando `ng serve`.
Esto compilará tu aplicación, omitirá optimizaciones innecesarias, iniciará un servidor de desarrollo y automáticamente reconstruirá y recargará en vivo cualquier cambio subsiguiente.
Puedes detener el servidor presionando `Ctrl+C`.

`ng serve` solo ejecuta el builder para el objetivo `serve` en el proyecto predeterminado como se especifica en `angular.json`.
Aunque cualquier builder puede usarse aquí, el más común (y predeterminado) es `@angular-devkit/build-angular:dev-server`.

Puedes determinar qué builder se está usando para un proyecto en particular buscando el objetivo `serve` para ese proyecto.

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invoca el objetivo Architect llamado `serve`.
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          // ...
        },
        "build": { /* ... */ }
        "test": { /* ... */ }
      }
    }
  }
}

</docs-code>

Esta página discute el uso y las opciones de `@angular-devkit/build-angular:dev-server`.

## Hacer proxy a un servidor backend

Usa el [soporte de proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy) para desviar ciertas URLs a un servidor backend, pasando un archivo a la opción de construcción `--proxy-config`.
Por ejemplo, para desviar todas las llamadas a `http://localhost:4200/api` a un servidor ejecutándose en `http://localhost:3000/api`, sigue los siguientes pasos.

1. Crea un archivo `proxy.conf.json` en la carpeta `src/` de tu proyecto.
1. Agrega el siguiente contenido al nuevo archivo proxy:

    <docs-code language="json">

    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }

    </docs-code>

1. En el archivo de configuración del CLI, `angular.json`, agrega la opción `proxyConfig` al objetivo `serve`:

    <docs-code language="json">

    {
      "projects": {
        "my-app": {
          "architect": {
            "serve": {
              "builder": "@angular-devkit/build-angular:dev-server",
              "options": {
                "proxyConfig": "src/proxy.conf.json"
              }
            }
          }
        }
      }
    }

    </docs-code>

1. Para ejecutar el servidor de desarrollo con esta configuración de proxy, llama a `ng serve`.

Edita el archivo de configuración de proxy para agregar opciones de configuración; a continuación algunos ejemplos.
Para una descripción detallada de todas las opciones, consulta la [documentación de webpack DevServer](https://webpack.js.org/configuration/dev-server/#devserverproxy) cuando uses `@angular-devkit/build-angular:browser`, o la [documentación de Vite DevServer](https://vite.dev/config/server-options#server-proxy) cuando uses `@angular-devkit/build-angular:browser-esbuild` o `@angular-devkit/build-angular:application`.

NOTA: Si editas el archivo de configuración de proxy, debes relanzar el proceso `ng serve` para que tus cambios tengan efecto.
