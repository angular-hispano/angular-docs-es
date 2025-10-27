# Sistema experimental de pruebas unitarias

Angular CLI proporciona un sistema experimental de pruebas unitarias que puede usar [Vitest](https://vitest.dev/) como test runner.

IMPORTANTE: Este sistema experimental de pruebas unitarias requiere el uso del sistema de build `application`.
El sistema de build `application` es el predeterminado para todos los proyectos creados recientemente.

## Instalar dependencias

Algunos paquetes son requeridos para que el nuevo builder funcione. Para instalar los nuevos paquetes, ejecuta el siguiente comando:

<docs-code language="bash">

npm install vitest jsdom --save-dev

</docs-code>

Si ningún otro proyecto en tu workspace usa Karma, ejecuta el siguiente comando para desinstalar los paquetes correspondientes:

<docs-code language="bash">

npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter --save-dev

</docs-code>

## Configurar testing

Angular CLI incluye el sistema de pruebas dentro de un nuevo proyecto pero debe configurarse antes de que pueda usarse.

El proyecto que creas con el CLI está configurado para usar el sistema de pruebas `karma` por defecto.
Para cambiar al sistema experimental de pruebas unitarias, actualiza el target `test` como sigue:

<docs-code language="json">
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "tsconfig.spec.json",
    "runner": "vitest",
    "buildTarget": "::development"
  }
}
</docs-code>

El `buildTarget` opera de manera similar a la opción disponible para el servidor de desarrollo.
El target `build` configura opciones de build para las pruebas.
Si la configuración de build `development` falta para un proyecto o necesitas
opciones diferentes para testing, puedes crear y usar una configuración de build `testing` o con nombre similar.

Para ejecutar el testing de la aplicación, solo ejecuta el comando CLI [`ng test`](cli/test) como antes:

<docs-code language="shell">

ng test

</docs-code>

El comando `ng test` construye la aplicación en modo *watch*, y lanza el runner configurado.

La salida de consola se ve como a continuación:

<docs-code language="shell">
 ✓ spec-app-app.spec.js (2 tests) 31ms
   ✓ App > should create the app 22ms
   ✓ App > should render title 8ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  14:24:15
   Duration  1.16s (transform 628ms, setup 703ms, collect 64ms, tests 31ms, environment 188ms, prepare 33ms)
</docs-code>

El modo watch está habilitado por defecto cuando se usa una terminal interactiva y no se está ejecutando en CI.

## Configuración

Angular CLI se encarga de la configuración de Vitest por ti. Construye la configuración completa en memoria, basándose en opciones especificadas en el archivo `angular.json`.
Personalizar directamente la configuración del test runner subyacente actualmente no está soportado.

## Reportes de bugs

Reporta problemas y solicitudes de características en [GitHub](https://github.com/angular/angular-cli/issues).

Por favor proporciona una reproducción mínima cuando sea posible para ayudar al equipo a abordar problemas.
