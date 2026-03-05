# Dependencias npm del espacio de trabajo

El framework de Angular, el CLI de Angular y los componentes usados por las aplicaciones en Angular están empaquetados como [paquetes npm](https://docs.npmjs.com/getting-started/what-is-npm "¿Qué es npm?") y distribuidos usando el [registro npm](https://docs.npmjs.com).

Puedes descargar e instalar estos paquetes npm usando el [cliente CLI de npm](https://docs.npmjs.com/cli/install).
De forma predeterminada, el CLI de Angular usa el cliente npm.

ÚTIL: Consulta [Configuración del entorno local](tools/cli/setup-local "Configuración para el desarrollo local") para obtener información sobre las versiones requeridas y la instalación de `Node.js` y `npm`.

Si ya tienes proyectos ejecutándose en tu máquina que usan otras versiones de Node.js y npm, considera usar [nvm](https://github.com/creationix/nvm) para gestionar las múltiples versiones de Node.js y npm.

## `package.json`

`npm` instala los paquetes identificados en un archivo [`package.json`](https://docs.npmjs.com/files/package.json).

El comando del CLI `ng new` crea un archivo `package.json` cuando crea el nuevo espacio de trabajo.
Este `package.json` es usado por todos los proyectos en el espacio de trabajo, incluyendo el proyecto inicial de la aplicación que es creado por el CLI cuando crea el espacio de trabajo.
Las bibliotecas creadas con `ng generate library` incluirán su propio archivo `package.json`.

Inicialmente, este `package.json` incluye _un conjunto inicial de paquetes_, algunos de los cuales son requeridos por Angular y otros que apoyan escenarios comunes de aplicación.
Agregas paquetes al `package.json` a medida que tu aplicación evoluciona.

## Dependencias predeterminadas

Los siguientes paquetes de Angular se incluyen como dependencias en el archivo predeterminado `package.json` para un nuevo espacio de trabajo en Angular.
Para una lista completa de paquetes de Angular, consulta la [referencia de la API](api).

| Nombre del paquete                                                                             | Detalles                                                                                                                                                                                                                                                                |
| :--------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular/animations`](api#animations)                                                        | La biblioteca heredada (legacy) de animaciones en Angular facilita la definición y aplicación de efectos de animación tales como transiciones de páginas y listas. Para más información, consulta la [Guía de animaciones heredadas (legacy)](guide/legacy-animations). |
| [`@angular/common`](api#common)                                                                | Los servicios, pipes y directivas comúnmente necesarios proporcionados por el equipo de Angular.                                                                                                                                                                        |
| `@angular/compiler`                                                                            | El compilador de plantillas en Angular. Entiende las plantillas en Angular y puede convertirlas en código que hace que la aplicación se ejecute.                                                                                                                        |
| `@angular/compiler-cli`                                                                        | El compilador en Angular que es invocado por los comandos `ng build` y `ng serve` del Angular CLI. Procesa plantillas en Angular con `@angular/compiler` dentro de una compilación estándar de TypeScript.                                                              |
| [`@angular/core`](api#core)                                                                    | Partes críticas del framework en tiempo de ejecución que necesita toda aplicación. Incluye todos los decoradores de metadatos como `@Component`, inyección de dependencias y los hooks de ciclo de vida de los componentes.                                             |
| [`@angular/forms`](api#forms)                                                                  | Soporte tanto para [formularios basados en plantillas (template-driven)](guide/forms) como para [formularios reactivos](guide/forms/reactive-forms). Consulta [Introducción a los formularios](guide/forms).                                                            |
| [`@angular/platform-browser`](api#platform-browser)                                            | Todo lo relacionado con DOM y el navegador, especialmente las partes que ayudan a renderizar en el DOM.                                                                                                                                                                 |
| [`@angular/platform-browser-dynamic`](api#platform-browser-dynamic)                            | Incluye [proveedores](api/core/Provider) y métodos para compilar y ejecutar la aplicación en el cliente usando el [compilador JIT](tools/cli/aot-compiler#choosing-a-compiler).                                                                                         |
| [`@angular/router`](api#router)                                                                | El módulo de enrutador navega entre las páginas de tu aplicación cuando la URL del navegador cambia. Para más información, consulta [Enrutamiento y navegación](guide/routing).                                                                                         |
| [`@angular/cli`](https://github.com/angular/angular-cli)                                       | Contiene el binario del Angular CLI para ejecutar comandos `ng`.                                                                                                                                                                                                        |
| [`@angular-devkit/build-angular`](https://www.npmjs.com/package/@angular-devkit/build-angular) | Contiene constructores (builders) predeterminados del CLI para empaquetar, probar y servir aplicaciones y bibliotecas en Angular.                                                                                                                                       |
| [`rxjs`](https://www.npmjs.com/package/rxjs)                                                   | Una biblioteca para programación reactiva usando `Observables`.                                                                                                                                                                                                         |
| [`zone.js`](https://github.com/angular/zone.js)                                                | Angular depende de `zone.js` para ejecutar los procesos de detección de cambios de Angular cuando las operaciones nativas de JavaScript lanzan eventos.                                                                                                                 |
| [`typescript`](https://www.npmjs.com/package/typescript)                                       | El compilador de TypeScript, servidor de lenguaje y definiciones de tipo integradas.                                                                                                                                                                                    |
