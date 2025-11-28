# Sirviendo aplicaciones Angular para desarrollo

Puedes servir tu aplicación Angular CLI con el comando `ng serve`.
Esto compilará tu aplicación, omitirá optimizaciones innecesarias, iniciará un servidor de desarrollo y automáticamente reconstruirá y recargará en vivo cualquier cambio subsiguiente.
Puedes detener el servidor presionando `Ctrl+C`.

`ng serve` solo ejecuta el builder para el objetivo `serve` en el proyecto predeterminado como se especifica en `angular.json`. Aunque cualquier builder puede usarse aquí, el más común (y predeterminado) es `@angular/build:dev-server`.

Puedes determinar qué builder se está usando para un proyecto en particular buscando el objetivo `serve` para ese proyecto.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invoca el objetivo Architect llamado `serve`.
        "serve": {
          "builder": "@angular/build:dev-server",
          // ...
        },
        "build": { /* ... */ }
        "test": { /* ... */ }
      }
    }
  }
}

```

## Hacer proxy a un servidor backend

Usa el [soporte de proxy](https://vite.dev/config/server-options#server-proxy) para desviar ciertas URLs a un servidor backend, pasando un archivo a la opción de construcción `--proxy-config`.
Por ejemplo, para desviar todas las llamadas a `http://localhost:4200/api` a un servidor ejecutándose en `http://localhost:3000/api`, sigue los siguientes pasos.

1. Crea un archivo `proxy.conf.json` en la carpeta `src/` de tu proyecto.
1. Agrega el siguiente contenido al nuevo archivo proxy:

```json
{
  "/api/**": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

1. En el archivo de configuración del CLI, `angular.json`, agrega la opción `proxyConfig` al objetivo `serve`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "proxyConfig": "src/proxy.conf.json"
          }
        }
      }
    }
  }
}

```

1. Para ejecutar el servidor de desarrollo con esta configuración de proxy, llama a `ng serve`.

NOTA: Si editas el archivo de configuración de proxy, debes relanzar el proceso `ng serve` para que tus cambios tengan efecto.

### El comportamiento de coincidencia de rutas depende del builder

**`@angular/build:dev-server`** (basado en [Vite](https://vite.dev/config/server-options#server-proxy))

- `/api` coincide solo con `/api`.
- `/api/*` coincide con `/api/users` pero no con `/api/users/123`.
- `/api/**` coincide con `/api/users` y `/api/users/123`.

**`@angular-devkit/build-angular:dev-server`** (basado en [Webpack DevServer](https://webpack.js.org/configuration/dev-server/#devserverproxy))

- `/api` coincide con `/api` y cualquier subruta (equivalente a `/api/**`).
