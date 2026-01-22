# Migración de Karma a Vitest

Angular CLI usa [Vitest](https://vitest.dev/) como el ejecutor de pruebas unitarias predeterminado para nuevos proyectos. Esta guía proporciona instrucciones para migrar un proyecto existente de Karma y Jasmine a Vitest.

IMPORTANTE: Migrar un proyecto existente a Vitest se considera experimental. Este proceso también requiere el uso del sistema de compilación `application`, que es el predeterminado para todos los proyectos recién creados.

## Pasos de migración manual

Antes de usar el schematic de refactorización automatizado, debes actualizar manualmente tu proyecto para usar el ejecutor de pruebas Vitest.

### 1. Instalar dependencias

Instala `vitest` y una biblioteca de emulación de DOM. Si bien las pruebas en el navegador aún son posibles (consulta el [paso 5](#5-configurar-el-modo-navegador-opcional)), Vitest usa una biblioteca de emulación de DOM de forma predeterminada para simular un entorno de navegador dentro de Node.js para una ejecución de pruebas más rápida. El CLI detecta y usa automáticamente `happy-dom` si está instalado; de lo contrario, recurre a `jsdom`. Debes tener uno de estos paquetes instalados.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev vitest jsdom
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev vitest jsdom
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D vitest jsdom
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev vitest jsdom
  </docs-code>
</docs-code-multifile>

### 2. Actualizar `angular.json`

En tu archivo `angular.json`, busca el target `test` para tu proyecto y cambia el `builder` a `@angular/build:unit-test`.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}
```

El builder `unit-test` tiene como valor predeterminado `"tsConfig": "tsconfig.spec.json"` y `"buildTarget": "::development"`. Puedes establecer explícitamente estas opciones si tu proyecto requiere valores diferentes. Por ejemplo, si falta la configuración de compilación `development` o necesitas opciones diferentes para las pruebas, puedes crear y usar una configuración de compilación `testing` o con nombre similar para `buildTarget`.

El builder `@angular/build:karma` anteriormente permitía que las opciones de compilación (como `polyfills`, `assets` o `styles`) se configuraran directamente dentro del target `test`. El nuevo builder `@angular/build:unit-test` no admite esto. Si tus opciones de compilación específicas para pruebas difieren de tu configuración de compilación `development` existente, debes moverlas a una configuración de target de compilación dedicada. Si tus opciones de compilación de pruebas ya coinciden con tu configuración de compilación `development`, no se requiere ninguna acción.

### 3. Manejar configuraciones personalizadas de `karma.conf.js`

Las configuraciones personalizadas en `karma.conf.js` no se migran automáticamente. Antes de eliminar tu archivo `karma.conf.js`, revísalo para detectar cualquier configuración personalizada que necesite ser migrada.

Muchas opciones de Karma tienen equivalentes en Vitest que se pueden establecer en un archivo de configuración personalizado de Vitest (por ejemplo, `vitest.config.ts`) y vincularlo a tu `angular.json` a través de la opción `runnerConfig`.

Las rutas de migración comunes incluyen:

- **Reporters**: Los reporters de Karma deben reemplazarse con reporters compatibles con Vitest. Estos a menudo se pueden configurar directamente en tu `angular.json` bajo la propiedad `test.options.reporters`. Para configuraciones más avanzadas, usa un archivo personalizado `vitest.config.ts`.
- **Plugins**: Los plugins de Karma pueden tener equivalentes en Vitest que necesitarás encontrar e instalar. Ten en cuenta que la cobertura de código es una característica de primera clase en Angular CLI y se puede habilitar con `ng test --coverage`.
- **Custom Browser Launchers**: Estos son reemplazados por la opción `browsers` en `angular.json` y la instalación de un proveedor de navegador como `@vitest/browser-playwright`.

Para otras configuraciones, consulta la [documentación oficial de Vitest](https://vitest.dev/config/).

### 4. Eliminar archivos de Karma y `test.ts`

Ahora puedes eliminar `karma.conf.js` y `src/test.ts` de tu proyecto y desinstalar los paquetes relacionados con Karma. Los siguientes comandos se basan en los paquetes instalados en un nuevo proyecto de Angular CLI; tu proyecto puede tener otros paquetes relacionados con Karma para eliminar.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="bun" language="shell">
    bun remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
</docs-code-multifile>

### 5. Configurar el modo navegador (opcional)

Si necesitas ejecutar pruebas en un navegador real, debes instalar un proveedor de navegador y configurar tu `angular.json`.

**Instalar un proveedor de navegador:**

Elige uno de los siguientes proveedores de navegador según tus necesidades:

- **Playwright**: `@vitest/browser-playwright` para Chromium, Firefox y WebKit.
- **WebdriverIO**: `@vitest/browser-webdriverio` para Chrome, Firefox, Safari y Edge.
- **Preview**: `@vitest/browser-preview` para entornos Webcontainer (como StackBlitz).

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright
  </docs-code>
</docs-code-multifile>

**Actualizar `angular.json` para modo navegador:**

Agrega la opción `browsers` a las opciones del target `test`. El nombre del navegador depende del proveedor que instalaste (por ejemplo, `chromium` para Playwright, `chrome` para WebdriverIO).

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

El modo headless se habilita automáticamente si la variable de entorno `CI` está configurada o si el nombre de un navegador incluye "Headless" (por ejemplo, `ChromeHeadless`). De lo contrario, las pruebas se ejecutarán en un navegador con interfaz gráfica.

## Refactorización automatizada de pruebas con schematics

IMPORTANTE: El schematic `refactor-jasmine-vitest` es experimental y puede no cubrir todos los patrones de prueba posibles. Siempre revisa los cambios realizados por el schematic.

Angular CLI proporciona el schematic `refactor-jasmine-vitest` para refactorizar automáticamente tus pruebas de Jasmine para usar Vitest.

### Descripción general

El schematic automatiza las siguientes transformaciones en tus archivos de prueba (`.spec.ts`):

- Convierte `fit` y `fdescribe` a `it.only` y `describe.only`.
- Convierte `xit` y `xdescribe` a `it.skip` y `describe.skip`.
- Convierte las llamadas `spyOn` al equivalente `vi.spyOn`.
- Reemplaza `jasmine.objectContaining` con `expect.objectContaining`.
- Reemplaza `jasmine.any` con `expect.any`.
- Reemplaza `jasmine.createSpy` con `vi.fn`.
- Actualiza `beforeAll`, `beforeEach`, `afterAll` y `afterEach` a sus equivalentes en Vitest.
- Convierte `fail()` al `vi.fail()` de Vitest.
- Ajusta las expectativas para que coincidan con las APIs de Vitest
- Agrega comentarios TODO para código que no se puede convertir automáticamente

El schematic **no** realiza las siguientes acciones:

- No instala `vitest` u otras dependencias relacionadas.
- No cambia tu `angular.json` para usar el builder de Vitest ni migra ninguna opción de compilación (como `polyfills` o `styles`) del target `test`.
- No elimina los archivos `karma.conf.js` o `test.ts`.
- No maneja escenarios de spy complejos o anidados, que pueden requerir refactorización manual.

### Ejecutar el schematic

Una vez que tu proyecto esté configurado para Vitest, puedes ejecutar el schematic para refactorizar tus archivos de prueba.

Para refactorizar **todos** los archivos de prueba en tu proyecto predeterminado, ejecuta:

```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

### Opciones

Puedes usar las siguientes opciones para personalizar el comportamiento del schematic:

| Opción                   | Descripción                                                                                                         |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `--project <name>`       | Especifica el proyecto a refactorizar en un workspace con múltiples proyectos. <br> Ejemplo: `--project=my-lib`     |
| `--include <path>`       | Refactoriza solo un archivo o directorio específico. <br> Ejemplo: `--include=src/app/app.component.spec.ts`       |
| `--file-suffix <suffix>` | Especifica un sufijo de archivo diferente para archivos de prueba. <br> Ejemplo: `--file-suffix=.test.ts`           |
| `--add-imports`          | Agrega imports explícitos de `vitest` si has deshabilitado los globales en tu configuración de Vitest.             |
| `--verbose`              | Muestra el registro detallado de todas las transformaciones aplicadas.                                             |

### Después de migrar

Después de que se complete el schematic, es una buena práctica:

1.  **Ejecuta tus pruebas**: Ejecuta `ng test` para asegurar que todas las pruebas aún pasen después de la refactorización.
2.  **Revisa los cambios**: Revisa los cambios realizados por el schematic, prestando especial atención a cualquier prueba compleja, especialmente aquellas con spies o mocks intrincados, ya que pueden requerir ajustes manuales adicionales.

El comando `ng test` construye la aplicación en _modo observación_ e inicia el ejecutor configurado. El modo observación está habilitado de forma predeterminada cuando se usa un terminal interactivo y no se ejecuta en CI.

## Configuración

Angular CLI se encarga de la configuración de Vitest por ti, construyendo la configuración completa en memoria basándose en las opciones en `angular.json`.

### Configuración personalizada de Vitest

IMPORTANTE: Si bien usar una configuración personalizada habilita opciones avanzadas, el equipo de Angular no proporciona soporte directo para el contenido específico del archivo de configuración ni para ningún plugin de terceros utilizado dentro de él. El CLI también sobrescribirá ciertas propiedades (`test.projects`, `test.include`) para garantizar el funcionamiento adecuado.

Puedes proporcionar un archivo de configuración personalizado de Vitest para sobrescribir la configuración predeterminada. Para obtener una lista completa de opciones disponibles, consulta la [documentación oficial de Vitest](https://vitest.dev/config/).

**1. Ruta directa:**
Proporciona una ruta directa a un archivo de configuración de Vitest en tu `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": { "runnerConfig": "vitest.config.ts" }
        }
      }
    }
  }
}
```

**2. Búsqueda automática de configuración base:**
Si estableces `runnerConfig` en `true`, el builder buscará automáticamente un archivo compartido `vitest-base.config.*` en las raíces de tu proyecto y workspace.

## Reporte de errores

Reporta problemas y solicitudes de características en [GitHub](https://github.com/angular/angular-cli/issues).

Proporciona una reproducción mínima cuando sea posible para ayudar al equipo a abordar los problemas.
