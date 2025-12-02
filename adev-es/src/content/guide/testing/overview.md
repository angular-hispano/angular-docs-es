# Pruebas unitarias

Probar tu aplicación Angular te ayuda a verificar que está funcionando como esperas. Las pruebas unitarias son cruciales para detectar errores temprano, asegurar la calidad del código y facilitar la refactorización segura.

NOTA: Esta guía se enfoca en la configuración de pruebas predeterminada para nuevos proyectos de Angular CLI. Si estás migrando un proyecto existente de Karma a Vitest, consulta la [guía de Migración de Karma a Vitest](guide/testing/migrating-to-vitest). Aunque Vitest es el ejecutor de pruebas predeterminado, Karma todavía está completamente soportado. Para información sobre pruebas con Karma, consulta la [guía de pruebas de Karma](guide/testing/karma).

## Configurar pruebas

Angular CLI descarga e instala todo lo que necesitas para probar una aplicación Angular con el [framework de pruebas Vitest](https://vitest.dev). Por defecto, los nuevos proyectos incluyen `vitest` y `jsdom`.

Vitest ejecuta tus pruebas unitarias en un entorno de Node.js, usando `jsdom` para emular el DOM. Esto permite una ejecución de pruebas más rápida al evitar la sobrecarga de lanzar un navegador. También puedes usar `happy-dom` como alternativa instalándolo y eliminando `jsdom`. El CLI detectará y usará automáticamente `happy-dom` si está presente.

El proyecto que creas con el CLI está inmediatamente listo para probar. Solo ejecuta el comando CLI [`ng test`](cli/test):

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

El comando `ng test` también observa cambios. Para ver esto en acción, haz un pequeño cambio a `app.ts` y guárdalo. Las pruebas se ejecutan nuevamente y los nuevos resultados aparecen en la consola.

## Configuración

Angular CLI maneja la mayor parte de la configuración de Vitest por ti. Para muchos casos de uso comunes, puedes ajustar el comportamiento de las pruebas modificando opciones directamente en tu archivo `angular.json`.

### Opciones de configuración integradas

Puedes cambiar las siguientes opciones en el target `test` de tu archivo `angular.json`:

- `include`: Patrones glob de archivos para incluir en las pruebas. Por defecto es `['**/*.spec.ts', '**/*.test.ts']`.
- `exclude`: Patrones glob de archivos para excluir de las pruebas.
- `setupFiles`: Una lista de rutas a archivos de configuración global (por ejemplo, polyfills o mocks globales) que se ejecutan antes de tus pruebas.
- `providersFile`: La ruta a un archivo que exporta un array predeterminado de proveedores de Angular para el entorno de pruebas. Esto es útil para configurar proveedores de prueba globales que se inyectan en tus pruebas.
- `coverage`: Un booleano para habilitar o deshabilitar reportes de cobertura de código. Por defecto es `false`.
- `browsers`: Un array de nombres de navegadores para ejecutar pruebas (por ejemplo, `["chromium"]`). Requiere que se instale un proveedor de navegador.

Por ejemplo, podrías crear un archivo `src/test-providers.ts` para proporcionar `provideHttpClientTesting` a todas tus pruebas:

```typescript
import { Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const testProviders: Provider[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
];

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

### Avanzado: Configuración personalizada de Vitest

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

## Cobertura de código

Puedes generar reportes de cobertura de código agregando la bandera `--coverage` al comando `ng test`. El reporte se genera en el directorio `coverage/`.

Para información más detallada sobre prerrequisitos, aplicar umbrales de cobertura y configuración avanzada, consulta la [guía de Cobertura de código](guide/testing/code-coverage).

## Ejecutar pruebas en un navegador

Aunque el entorno predeterminado de Node.js es más rápido para la mayoría de las pruebas unitarias, también puedes ejecutar tus pruebas en un navegador real. Esto es útil para pruebas que dependen de APIs específicas del navegador (como renderizado) o para depuración.

Para ejecutar pruebas en un navegador, primero debes instalar un proveedor de navegador.
Elige uno de los siguientes proveedores de navegador según tus necesidades:

- **Playwright**: `@vitest/browser-playwright` para Chromium, Firefox y WebKit.
- **WebdriverIO**: `@vitest/browser-webdriverio` para Chrome, Firefox, Safari y Edge.
- **Preview**: `@vitest/browser-preview` para entornos Webcontainer (como StackBlitz).

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

Una vez que el proveedor esté instalado, puedes ejecutar tus pruebas en el navegador usando la bandera `--browsers`:

```bash
# Ejemplo para Playwright
ng test --browsers=chromium

# Ejemplo para WebdriverIO
ng test --browsers=chrome
```

El modo headless se habilita automáticamente si la variable de entorno `CI` está establecida. De lo contrario, las pruebas se ejecutarán en un navegador con interfaz gráfica.

## Otros frameworks de prueba

También puedes hacer pruebas unitarias de una aplicación Angular con otras librerías de prueba y ejecutores de pruebas. Cada librería y ejecutor tiene sus propios procedimientos de instalación, configuración y sintaxis distintivos.

## Pruebas en integración continua

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

## Más información sobre pruebas

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
