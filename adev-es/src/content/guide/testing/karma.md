# Pruebas con Karma y Jasmine

Si bien [Vitest](https://vitest.dev) es el ejecutor de pruebas predeterminado para nuevos proyectos en Angular, [Karma](https://karma-runner.github.io) sigue siendo un ejecutor de pruebas compatible y ampliamente utilizado. Esta guía proporciona instrucciones para probar tu aplicación en Angular utilizando el ejecutor de pruebas Karma con el framework de pruebas [Jasmine](https://jasmine.github.io).

## Configurar Karma y Jasmine

Puedes configurar Karma y Jasmine para un nuevo proyecto o agregarlo a uno existente.

### Para proyectos nuevos

Para crear un nuevo proyecto con Karma y Jasmine preconfigurados, ejecuta el comando `ng new` con la opción `--test-runner=karma`:

```shell
ng new my-karma-app --test-runner=karma
```

### Para proyectos existentes

Para agregar Karma y Jasmine a un proyecto existente, sigue estos pasos:

1.  **Instala los paquetes necesarios:**

    <docs-code-multifile>
      <docs-code header="npm" language="shell">
        npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="yarn" language="shell">
        yarn add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="pnpm" language="shell">
        pnpm add -D karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="bun" language="shell">
        bun add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
    </docs-code-multifile>

2.  **Configura el ejecutor de pruebas en `angular.json`:**

    En tu archivo `angular.json`, busca el target `test` y establece la opción `runner` en `karma`:

    ```json
    {
      // ...
      "projects": {
        "your-project-name": {
          // ...
          "architect": {
            "test": {
              "builder": "@angular/build:unit-test",
              "options": {
                "runner": "karma",
                // ... otras opciones
              }
            }
          }
        }
      }
    }
    ```

3.  **Actualiza `tsconfig.spec.json` para tipos de Jasmine:**

    Para asegurar que TypeScript reconozca las funciones globales de pruebas como `describe` e `it`, agrega `"jasmine"` al array `types` en tu `tsconfig.spec.json`:

    ```json
    {
      // ...
      "compilerOptions": {
        // ...
        "types": [
          "jasmine"
        ]
      },
      // ...
    }
    ```

## Ejecutar pruebas

Una vez configurado tu proyecto, ejecuta las pruebas usando el comando [`ng test`](cli/test):

```shell
ng test
```

El comando `ng test` construye la aplicación en _modo observación_ e inicia el [ejecutor de pruebas Karma](https://karma-runner.github.io).

La salida en consola se ve como a continuación:

```shell

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

```

La salida de las pruebas se muestra en el navegador usando [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter).

<img alt="Jasmine HTML Reporter en el navegador" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

Haz clic en una fila de prueba para volver a ejecutar solo esa prueba o haz clic en una descripción para volver a ejecutar las pruebas en el grupo de pruebas seleccionado ("test suite").

Mientras tanto, el comando `ng test` está observando cambios. Para ver esto en acción, realiza un pequeño cambio en un archivo fuente y guárdalo. Las pruebas se ejecutan nuevamente, el navegador se actualiza y aparecen los nuevos resultados de las pruebas.

## Configuración

Angular CLI se encarga de la configuración de Jasmine y Karma por ti. Construye la configuración completa en memoria, basándose en las opciones especificadas en el archivo `angular.json`.

### Personalizar la configuración de Karma

Si deseas personalizar Karma, puedes crear un `karma.conf.js` ejecutando el siguiente comando:

```shell
ng generate config karma
```

ÚTIL: Lee más sobre la configuración de Karma en la [guía de configuración de Karma](http://karma-runner.github.io/6.4/config/configuration-file.html).

### Establecer el ejecutor de pruebas en `angular.json`

Para establecer explícitamente Karma como el ejecutor de pruebas para tu proyecto, localiza el target `test` en tu archivo `angular.json` y establece la opción `runner` en `karma`:

```json
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runner": "karma",
            // ... otras opciones
          }
        }
      }
    }
  }
}
```

## Cumplimiento de cobertura de código

Para aplicar un nivel mínimo de cobertura de código, puedes usar la propiedad `check` en la sección `coverageReporter` de tu archivo `karma.conf.js`.

Por ejemplo, para requerir un mínimo de 80% de cobertura:

```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

Esto hará que la ejecución de pruebas falle si no se cumplen los umbrales de cobertura especificados.

## Pruebas en integración continua

Para ejecutar tus pruebas de Karma en un entorno de CI, usa el siguiente comando:

```shell
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

NOTA: Las banderas `--no-watch` y `--no-progress` son cruciales para Karma en entornos de CI para asegurar que las pruebas se ejecuten una vez y terminen correctamente. La bandera `--browsers=ChromeHeadless` también es esencial para ejecutar pruebas en un entorno de navegador sin interfaz gráfica.

## Depurar pruebas

Si tus pruebas no están funcionando como esperas, puedes inspeccionarlas y depurarlas en el navegador.

Para depurar una aplicación con el ejecutor de pruebas Karma:

1.  Muestra la ventana del navegador de Karma. Consulta [Configurar pruebas](guide/testing/overview#configurar-pruebas) si necesitas ayuda con este paso.
2.  Haz clic en el botón **DEBUG** para abrir una nueva pestaña del navegador y volver a ejecutar las pruebas.
3.  Abre las **Herramientas para desarrolladores** del navegador. En Windows, presiona `Ctrl-Shift-I`. En macOS, presiona `Command-Option-I`.
4.  Selecciona la sección **Sources**.
5.  Presiona `Control/Command-P`, y luego comienza a escribir el nombre de tu archivo de prueba para abrirlo.
6.  Establece un breakpoint en la prueba.
7.  Actualiza el navegador, y nota cómo se detiene en el breakpoint.

<img alt="Depuración en Karma" src="assets/images/guide/testing/karma-1st-spec-debug.png">
