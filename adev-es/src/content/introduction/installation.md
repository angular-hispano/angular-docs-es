<docs-decorative-header title="Instalación" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Comienza con Angular rápidamente usando iniciadores en línea o localmente con tu terminal.

## Probar en línea

Si solo quieres experimentar con Angular en tu navegador sin configurar un proyecto, puedes usar nuestro sandbox en línea:

<docs-card-container>
  <docs-card title="" href="/playground" link="Abrir en Playground">
  La forma más rápida de experimentar con una aplicación Angular. No requiere configuración.
  </docs-card>
</docs-card-container>

## Configurar un nuevo proyecto localmente

Si estás comenzando un nuevo proyecto, lo más probable es que quieras crear un proyecto local para poder usar herramientas como Git.

### Prerrequisitos

- **Node.js** - [v20.11.1 o más reciente](/reference/versions)
- **Editor de texto** - Recomendamos [Visual Studio Code](https://code.visualstudio.com/)
- **Terminal** - Requerido para ejecutar comandos de Angular CLI
- **Herramienta de desarrollo** - Para mejorar tu flujo de trabajo de desarrollo, recomendamos el [Angular Language Service](/tools/language-service)

### Instrucciones

La siguiente guía te explicará cómo configurar un proyecto de Angular de forma local.

#### Instalar Angular CLI

Abre una terminal (si estás usando [Visual Studio Code](https://code.visualstudio.com/), puedes abrir una [terminal integrada](https://code.visualstudio.com/docs/editor/integrated-terminal)) y ejecuta el siguiente comando:

<docs-code-multifile>
  <docs-code
    header="npm"
    >
    npm install -g @angular/cli
    </docs-code>
  <docs-code
    header="pnpm"
    >
    pnpm install -g @angular/cli
    </docs-code>
  <docs-code
    header="yarn"
    >
    yarn global add @angular/cli
    </docs-code>
  <docs-code
    header="bun"
    >
    bun install -g @angular/cli
    </docs-code>

</docs-code-multifile>

Si tienes problemas ejecutando este comando en Windows o Unix, consulta la [Documentación del CLI](/tools/cli/setup-local#install-the-angular-cli) para más información.

#### Crear un nuevo proyecto

En tu terminal, ejecuta el comando de la CLI `ng new` con el nombre del proyecto deseado. En los siguientes ejemplos, usaremos el nombre de proyecto de ejemplo `my-first-angular-app`.

<docs-code language="shell">

ng new <project-name>

</docs-code>

Se te presentarán algunas opciones de configuración para tu proyecto. Usa las teclas de flecha y enter para navegar y seleccionar las opciones que desees.

Si no tienes ninguna preferencia, simplemente presiona enter para aceptar las opciones predeterminadas y continuar con la configuración.

Después de seleccionar las opciones de configuración y que la CLI la ejecute, deberias ver el siguiente mensaje:

```shell
✔ Packages installed successfully.
    Successfully initialized git.
```

En este punto, ¡ya estás listo para ejecutar tu proyecto localmente!

#### Ejecutar tu nuevo proyecto localmente

En tu termina, cambia a tu nuevo proyecto en Angular.

<docs-code language="shell">

cd my-first-angular-app

</docs-code>

Todas tus dependencias deberían estar instaladas en este punto (lo cual puedes verificar revisando la existencia de una carpeta `node_modules` en tu proyecto), así que puedes iniciar tu proyecto ejecutando el comando:

<docs-code language="shell">

npm start

</docs-code>

Si todo es exitoso, deberías ver un mensaje de confirmación similar en tu terminal:

```shell
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

Y ahora puedes visitar la ruta en `Local` (por ejemplo, `http://localhost:4200`) para ver tu aplicación. ¡Disfruta programando! 🎉


### Usar IA para el desarrollo

Para comenzar a construir en tu IDE preferido con IA, [consulta las reglas de prompts de Angular y las mejores prácticas](/ai/develop-with-ai).


## Próximos pasos

Ahora que has creado tu proyecto Angular, puedes aprender más sobre Angular en nuestra [Guía de Fundamentos](/essentials) o elegir un tema en nuestras guías detalladas!