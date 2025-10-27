# Pruebas End to End

Las pruebas end-to-end o (E2E) son una forma de pruebas usadas para afirmar que tu aplicación completa funciona como se espera de principio a fin o _"end-to-end"_. Las pruebas E2E difieren de las pruebas unitarias en que están completamente desacopladas de los detalles de implementación subyacentes de tu código. Típicamente se usan para validar una aplicación de una manera que imita la forma en que un usuario interactuaría con ella. Esta página sirve como guía para comenzar con las pruebas end-to-end en Angular usando el Angular CLI.

## Configurar pruebas E2E

El Angular CLI descarga e instala todo lo que necesitas para ejecutar pruebas end-to-end para tu aplicación Angular.

<docs-code language="shell">

ng e2e

</docs-code>

El comando `ng e2e` primero verificará tu proyecto por el objetivo "e2e". Si no puede localizarlo, el CLI te preguntará qué paquete e2e te gustaría usar y te guiará a través de la configuración.

<docs-code language="shell">

Cannot find "e2e" target for the specified project.
You can add a package that implements these capabilities.

For example:
Cypress: ng add @cypress/schematic
Nightwatch: ng add @nightwatch/schematics
WebdriverIO: ng add @wdio/schematics
Playwright: ng add playwright-ng-schematics
Puppeteer: ng add @puppeteer/ng-schematics

Would you like to add a package with "e2e" capabilities now?
No
❯ Cypress
Nightwatch
WebdriverIO
Playwright
Puppeteer

</docs-code>

Si no encuentras el ejecutor de pruebas que te gustaría usar de la lista anterior, puedes agregar manualmente un paquete usando `ng add`.

## Ejecutar pruebas E2E

Ahora que tu aplicación está configurada para pruebas end-to-end, podemos ejecutar el mismo comando para ejecutar tus pruebas.

<docs-code language="shell">

ng e2e

</docs-code>

Nota, no hay nada "especial" sobre ejecutar tus pruebas con cualquiera de los paquetes e2e integrados. El comando `ng e2e` realmente solo está ejecutando el builder `e2e` bajo el capó. Siempre puedes [crear tu propio builder personalizado](tools/cli/cli-builder#creating-a-builder) llamado `e2e` y ejecutarlo usando `ng e2e`.

## Más información sobre herramientas de pruebas end-to-end

| Herramienta de Pruebas | Detalles                                                                                                              |
| :----------- | :------------------------------------------------------------------------------------------------------------------- |
| Cypress      | [Comenzando con Cypress](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) |
| Nightwatch   | [Comenzando con Nightwatch](https://nightwatchjs.org/guide/writing-tests/introduction.html)                    |
| WebdriverIO  | [Comenzando con Webdriver.io](https://webdriver.io/docs/gettingstarted)                                        |
| Playwright   | [Comenzando con Playwright](https://playwright.dev/docs/writing-tests)                                         |
| Puppeteer    | [Comenzando con Puppeteer](https://pptr.dev)                                                                   |
