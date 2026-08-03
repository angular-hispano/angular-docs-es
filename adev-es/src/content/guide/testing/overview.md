# Pruebas unitarias

Probar tu aplicación Angular te ayuda a verificar que está funcionando como esperas. Las pruebas unitarias son cruciales para detectar errores temprano, asegurar la calidad del código y facilitar la refactorización segura.

NOTA: Esta guía cubre la configuración de pruebas predeterminada para nuevos proyectos de Angular CLI, que usa Vitest. Si estás migrando un proyecto existente de Karma, consulta la [guía de Migración de Karma a Vitest](guide/testing/migrating-to-vitest). Karma aún está soportado; para más información, consulta la [guía de pruebas de Karma](guide/testing/karma).

## Configurar pruebas {#set-up-for-testing}

Angular CLI descarga e instala todo lo que necesitas para probar una aplicación Angular con el [framework de pruebas Vitest](https://vitest.dev). Por defecto, los nuevos proyectos incluyen `vitest` y `jsdom`.

Vitest ejecuta tus pruebas unitarias en un entorno de Node.js. Para simular el DOM del navegador, Vitest usa una biblioteca llamada `jsdom`. Esto permite una ejecución de pruebas más rápida al evitar la sobrecarga de lanzar un navegador. Puedes cambiar `jsdom` por una alternativa como `happy-dom` instalándolo y desinstalando `jsdom`. Actualmente, `jsdom` y `happy-dom` son las bibliotecas de emulación del DOM soportadas.

El proyecto que creas con el CLI está inmediatamente listo para probar. Ejecuta el comando [`ng test`](cli/test):

```shell
ng test
```

El comando `ng test` construye la aplicación en _modo watch_ y lanza el [ejecutor de pruebas Vitest](https://vitest.dev).

La salida de consola se ve así:

```shell
 ✓ src/app/app.spec.ts (3)
   ✓ AppComponent should create the app
   ✓ AppComponent should have as title 'my-app'
   ✓ AppComponent should render title
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:18:01
   Duration  2.46s (transform 615ms, setup 2ms, collect 2.21s, tests 5ms)
```

El comando `ng test` también observa los archivos en busca de cambios. Si modificas un archivo y lo guardas, las pruebas se ejecutarán nuevamente.

## Configuración {#configuration}

Angular CLI maneja la mayor parte de la configuración de Vitest por ti. Puedes personalizar el comportamiento de las pruebas modificando las opciones del target `test` en tu archivo `angular.json`.

### Opciones de Angular.json {#angularjson-options}

Puedes cambiar las siguientes opciones en el target `test` de tu archivo `angular.json`:

- `include`: Patrones glob de archivos para incluir en las pruebas. Por defecto es `['**/*.spec.ts', '**/*.test.ts']`.
- `exclude`: Patrones glob de archivos para excluir de las pruebas.
- `setupFiles`: Una lista de rutas a archivos de configuración global (por ejemplo, polyfills o mocks globales) que se ejecutan antes de tus pruebas.
- `providersFile`: La ruta a un archivo que exporta un array predeterminado de proveedores de Angular para el entorno de pruebas. Esto es útil para configurar proveedores de prueba globales que se inyectan en tus pruebas.
- `coverage`: Un booleano para habilitar o deshabilitar reportes de cobertura de código. Por defecto es `false`.
- `browsers`: Un array de nombres de navegadores para ejecutar pruebas en un navegador real (por ejemplo, `["chromium"]`). Requiere que se instale un proveedor de navegador. Consulta la sección [Ejecutar pruebas en un navegador](#running-tests-in-a-browser) para más detalles.

### Configuración global de pruebas y proveedores {#global-test-setup-and-providers}

Las opciones `setupFiles` y `providersFile` son particularmente útiles para gestionar la configuración global de pruebas.

Por ejemplo, podrías crear un archivo `src/test-providers.ts` para proporcionar `provideHttpClientTesting` a todas tus pruebas:

```typescript {header: "src/test-providers.ts"}
import {EnvironmentProviders, Provider} from '@angular/core';
import {provideHttpClientTesting} from '@angular/common/http/testing';

const testProviders: (Provider | EnvironmentProviders)[] = [provideHttpClientTesting()];

export default testProviders;
```

Luego referenciarías este archivo en tu `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "include": ["src/**/*.spec.ts"],
            "setupFiles": ["src/test-setup.ts"],
            "providersFile": "src/test-providers.ts",
            "coverage": true,
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

### Avanzado: Configuración personalizada de Vitest {#advanced-vitest-configuration}

Para casos de uso avanzados, puedes proporcionar un archivo de configuración personalizado de Vitest.

IMPORTANTE: Aunque usar una configuración personalizada habilita opciones avanzadas, el equipo de Angular no proporciona soporte directo para el contenido específico del archivo de configuración o para cualquier plugin de terceros usado dentro de él. El CLI también sobrescribirá ciertas propiedades (`test.projects`, `test.include`) para asegurar el funcionamiento adecuado.

Puedes crear un archivo de configuración de Vitest (por ejemplo, `vitest-base.config.ts`) y referenciarlo en tu `angular.json` usando la opción `runnerConfig`.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runnerConfig": "vitest-base.config.ts"
          }
        }
      }
    }
  }
}
```

También puedes generar un archivo de configuración base usando el CLI:

```shell
ng generate config vitest
```

Esto crea un archivo `vitest-base.config.ts` que puedes personalizar.

CONSEJO: Lee más sobre la configuración de Vitest en la [guía de configuración de Vitest](https://vitest.dev/config/).

## Cobertura de código {#code-coverage}

Puedes generar reportes de cobertura de código agregando la bandera `--coverage` al comando `ng test`. El reporte se genera en el directorio `coverage/`.

Para información más detallada sobre prerrequisitos, aplicar umbrales de cobertura y configuración avanzada, consulta la [guía de Cobertura de código](guide/testing/code-coverage).

## Ejecutar pruebas en un navegador {#running-tests-in-a-browser}

Aunque el entorno predeterminado de Node.js es más rápido para la mayoría de las pruebas unitarias, también puedes ejecutar tus pruebas en un navegador real. Esto es útil para pruebas que dependen de APIs específicas del navegador (como renderizado) o para depuración.

Para ejecutar pruebas en un navegador, primero debes instalar un proveedor de navegador. Lee más sobre el modo navegador de Vitest en la [documentación oficial](https://vitest.dev/guide/browser).

Una vez que el proveedor esté instalado, puedes ejecutar tus pruebas en el navegador configurando la opción `browsers` en `angular.json` o usando la bandera `--browsers` del CLI. Las pruebas se ejecutan en un navegador con interfaz gráfica por defecto. Si la variable de entorno `CI` está establecida, se usa el modo headless. Para controlar explícitamente el modo headless, puedes agregar el sufijo `Headless` al nombre del navegador (p. ej., `chromiumHeadless`).

```bash
# Ejemplo para Playwright (con interfaz)
ng test --browsers=chromium

# Ejemplo para Playwright (headless)
ng test --browsers=chromiumHeadless

# Ejemplo para WebdriverIO (con interfaz)
ng test --browsers=chrome

# Ejemplo para WebdriverIO (headless)
ng test --browsers=chromeHeadless
```

Elige uno de los siguientes proveedores de navegador según tus necesidades:

### Playwright

[Playwright](https://playwright.dev/) es una librería de automatización de navegadores que soporta Chromium, Firefox y WebKit.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright playwright
  </docs-code>
</docs-code-multifile>

### WebdriverIO

[WebdriverIO](https://webdriver.io/) es un framework de automatización de pruebas para navegadores y dispositivos móviles que soporta Chrome, Firefox, Safari y Edge.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
</docs-code-multifile>

### Preview

El proveedor `@vitest/browser-preview` está diseñado para entornos WebContainer como StackBlitz y no está pensado para uso en CI/CD.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-preview
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-preview
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-preview
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-preview
  </docs-code>
</docs-code-multifile>

HELPFUL: Para una configuración más avanzada específica del navegador, consulta la sección [Configuración avanzada de Vitest](#advanced-vitest-configuration).

## Otros frameworks de prueba {#other-test-frameworks}

También puedes hacer pruebas unitarias de una aplicación Angular con otras librerías de prueba y ejecutores de pruebas. Cada librería y ejecutor tiene sus propios procedimientos de instalación, configuración y sintaxis distintivos.

## Pruebas en integración continua {#testing-in-continuous-integration}

Un conjunto de pruebas robusto es una parte clave de una canalización de integración continua (CI). Los servidores de CI te permiten configurar el repositorio de tu proyecto para que tus pruebas se ejecuten en cada commit y pull request.

Para probar tu aplicación Angular en un servidor de integración continua (CI), típicamente puedes ejecutar el comando de prueba estándar:

```shell
ng test
```

La mayoría de los servidores de CI establecen una variable de entorno `CI=true`, que `ng test` detecta. Esto ejecuta automáticamente tus pruebas en el modo apropiado no interactivo de ejecución única.

Si tu servidor de CI no establece esta variable, o si necesitas forzar el modo de ejecución única manualmente, puedes usar las banderas `--no-watch` y `--no-progress`:

```shell
ng test --no-watch --no-progress
```

## Más información sobre pruebas {#more-information-on-testing}

Después de que hayas configurado tu aplicación para pruebas, podrías encontrar útiles las siguientes guías de pruebas.

|                                                                           | Detalles                                                                            |
| :------------------------------------------------------------------------ | :---------------------------------------------------------------------------------- |
| [Cobertura de código](guide/testing/code-coverage)                        | Cuánto de tu aplicación cubren tus pruebas y cómo especificar cantidades requeridas. |
| [Probar servicios](guide/testing/services)                                | Cómo probar los servicios que usa tu aplicación.                                    |
| [Fundamentos de probar componentes](guide/testing/components-basics)      | Fundamentos de probar componentes Angular.                                          |
| [Escenarios de prueba de componentes](guide/testing/components-scenarios) | Varios tipos de escenarios de prueba de componentes y casos de uso.                 |
| [Probar directivas de atributo](guide/testing/attribute-directives)       | Cómo probar tus directivas de atributo.                                             |
| [Probar pipes](guide/testing/pipes)                                       | Cómo probar pipes.                                                                  |
| [Depurar pruebas](guide/testing/debugging)                                | Errores comunes de pruebas.                                                         |
| [APIs utilitarias de pruebas](guide/testing/utility-apis)                 | Características de pruebas en Angular.                                              |
