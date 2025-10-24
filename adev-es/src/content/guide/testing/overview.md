# Pruebas

Probar tu aplicación Angular te ayuda a verificar que tu aplicación está funcionando como esperas.

## Configurar pruebas

Angular CLI descarga e instala todo lo que necesitas para probar una aplicación Angular con [Jasmine testing framework](https://jasmine.github.io).

El proyecto que creas con el CLI está inmediatamente listo para probar.
Solo ejecuta el comando CLI [`ng test`](cli/test):

<docs-code language="shell">

ng test

</docs-code>

El comando `ng test` construye la aplicación en modo *watch*,
y lanza el [Karma test runner](https://karma-runner.github.io).

La salida de consola se ve como a continuación:

<docs-code language="shell">

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

</docs-code>

La última línea del log muestra que Karma ejecutó tres pruebas que todas pasaron.

La salida de pruebas se muestra en el navegador usando [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter).

<img alt="Jasmine HTML Reporter en el navegador" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

Haz clic en una fila de prueba para re-ejecutar solo esa prueba o haz clic en una descripción para re-ejecutar las pruebas en el grupo de pruebas seleccionado \("test suite"\).

Mientras tanto, el comando `ng test` está observando cambios.

Para ver esto en acción, haz un pequeño cambio a `app.component.ts` y guarda.
Las pruebas se ejecutan nuevamente, el navegador se actualiza y los nuevos resultados de prueba aparecen.

## Configuración

Angular CLI se encarga de la configuración de Jasmine y Karma por ti. Construye la configuración completa en memoria, basándose en opciones especificadas en el archivo `angular.json`.

Si quieres personalizar Karma, puedes crear un `karma.conf.js` ejecutando el siguiente comando:

<docs-code language="shell">

ng generate config karma

</docs-code>

ÚTIL: Lee más sobre la configuración de Karma en la [guía de configuración de Karma](http://karma-runner.github.io/6.4/config/configuration-file.html).

### Otros frameworks de prueba

También puedes hacer pruebas unitarias de una aplicación Angular con otras librerías de prueba y test runners.
Cada librería y runner tiene sus propios procedimientos de instalación, configuración y sintaxis distintivos.

### Nombre y ubicación del archivo de prueba

Dentro de la carpeta `src/app` el Angular CLI generó un archivo de prueba para el `AppComponent` llamado `app.component.spec.ts`.

IMPORTANTE: La extensión del archivo de prueba **debe ser `.spec.ts`** para que las herramientas puedan identificarlo como un archivo con pruebas \(también conocido como un archivo *spec*\).

Los archivos `app.component.ts` y `app.component.spec.ts` son hermanos en la misma carpeta.
Los nombres raíz de los archivos \(`app.component`\) son los mismos para ambos archivos.

Adopta estas dos convenciones en tus propios proyectos para *cada tipo* de archivo de prueba.

#### Coloca tu archivo spec junto al archivo que prueba

Es una buena idea colocar los archivos spec de prueba unitaria en la misma carpeta
que los archivos de código fuente de la aplicación que prueban:

* Tales pruebas son fáciles de encontrar
* Ves de un vistazo si una parte de tu aplicación carece de pruebas
* Las pruebas cercanas pueden revelar cómo funciona una parte en contexto
* Cuando mueves el código fuente \(inevitable\), recuerdas mover la prueba
* Cuando renombras el archivo fuente \(inevitable\), recuerdas renombrar el archivo de prueba

#### Coloca tus archivos spec en una carpeta de prueba

Las specs de integración de aplicación pueden probar las interacciones de múltiples partes
distribuidas en carpetas y módulos.
Realmente no pertenecen a ninguna parte en particular, por lo que no tienen un
hogar natural junto a ningún archivo.

A menudo es mejor crear una carpeta apropiada para ellas en el directorio `tests`.

Por supuesto, las specs que prueban los helpers de prueba pertenecen en la carpeta `test`,
junto a sus archivos helper correspondientes.

## Pruebas en integración continua

Una de las mejores maneras de mantener tu proyecto libre de errores es a través de un conjunto de pruebas, pero podrías olvidar ejecutar las pruebas todo el tiempo.

Los servidores de integración continua \(CI\) te permiten configurar el repositorio de tu proyecto para que tus pruebas se ejecuten en cada commit y pull request.

Para probar tu aplicación Angular CLI en integración continua \(CI\) ejecuta el siguiente comando:

<docs-code language="shell">
ng test --no-watch --no-progress --browsers=ChromeHeadless
</docs-code>

## Más información sobre pruebas

Después de que hayas configurado tu aplicación para pruebas, podrías encontrar útiles las siguientes guías de pruebas.

|                                                                    | Detalles |
|:---                                                                |:---     |
| [Cobertura de código](guide/testing/code-coverage)                       | Cuánto de tu aplicación cubren tus pruebas y cómo especificar cantidades requeridas. |
| [Probar servicios](guide/testing/services)                         | Cómo probar los servicios que usa tu aplicación.                                   |
| [Fundamentos de probar componentes](guide/testing/components-basics)    | Fundamentos de probar componentes en Angular.                                             |
| [Escenarios de prueba de componentes](guide/testing/components-scenarios)  | Varios tipos de escenarios de prueba de componentes y casos de uso.                       |
| [Probar directivas de atributo](guide/testing/attribute-directives) | Cómo probar tus directivas de atributo.                                            |
| [Probar pipes](guide/testing/pipes)                               | Cómo probar pipes.                                                                |
| [Depurar pruebas](guide/testing/debugging)                            | Bugs comunes de pruebas.                                                              |
| [APIs utilitarias de pruebas](guide/testing/utility-apis)                 | Características de pruebas en Angular.                                                         |
