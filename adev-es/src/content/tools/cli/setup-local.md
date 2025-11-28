# Configurando el entorno local y el workspace

Esta guía explica cómo configurar tu entorno para el desarrollo en Angular usando el [Angular CLI](cli 'Referencia de comandos CLI').
Incluye información sobre cómo instalar el CLI, crear un workspace inicial y una aplicación de inicio, y ejecutar esa aplicación localmente para verificar tu configuración.

<docs-callout title="Prueba Angular sin configuración local">

Si eres nuevo en Angular, es posible que quieras comenzar con [¡Pruébalo ahora!](tutorials/learn-angular), que introduce los fundamentos de Angular en tu navegador.
Este tutorial standalone aprovecha el entorno interactivo de desarrollo en línea [StackBlitz](https://stackblitz.com).
No necesitas configurar tu entorno local hasta que estés listo.

</docs-callout>

## Antes de comenzar

Para usar Angular CLI, debes estar familiarizado con lo siguiente:

<docs-pill-row>
  <docs-pill href="https://developer.mozilla.org/es/docs/Web/JavaScript" title="JavaScript"/>
  <docs-pill href="https://developer.mozilla.org/es/docs/Web/HTML" title="HTML"/>
  <docs-pill href="https://developer.mozilla.org/es/docs/Web/CSS" title="CSS"/>
</docs-pill-row>

También debes estar familiarizado con el uso de herramientas de interfaz de línea de comandos (CLI) y tener una comprensión general de los shells de comandos.
El conocimiento de [TypeScript](https://www.typescriptlang.org) es útil, pero no es requerido.

## Dependencias

Para instalar Angular CLI en tu sistema local, necesitas instalar [Node.js](https://nodejs.org/).
Angular CLI usa Node y su gestor de paquetes asociado, npm, para instalar y ejecutar herramientas JavaScript fuera del navegador.

[Descarga e instala Node.js](https://nodejs.org/en/download), que incluirá el CLI `npm` también.
Angular requiere una versión [LTS activa o LTS de mantenimiento](https://nodejs.org/en/about/previous-releases) de Node.js.
Consulta la guía de [compatibilidad de versiones de Angular](reference/versions) para más información.

## Instalar el Angular CLI

Para instalar el Angular CLI, abre una ventana de terminal y ejecuta el siguiente comando:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

### Política de ejecución de Powershell

En computadoras cliente con Windows, la ejecución de scripts de PowerShell está deshabilitada por defecto, por lo que el comando anterior puede fallar con un error.
Para permitir la ejecución de scripts de PowerShell, que es necesario para los binarios globales de npm, debes establecer la siguiente <a href="https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies">política de ejecución</a>:

```sh

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

```

Lee cuidadosamente el mensaje mostrado después de ejecutar el comando y sigue las instrucciones. Asegúrate de entender las implicaciones de establecer una política de ejecución.

### Permisos de Unix

En algunas configuraciones tipo Unix, los scripts globales pueden ser propiedad del usuario root, por lo que el comando anterior puede fallar con un error de permisos.
Ejecuta con `sudo` para ejecutar el comando como usuario root e ingresa tu contraseña cuando se te solicite:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     sudo npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     sudo pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     sudo yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     sudo bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

Asegúrate de entender las implicaciones de ejecutar comandos como root.

## Crear un workspace y una aplicación inicial

Desarrollas aplicaciones en el contexto de un **workspace** de Angular.

Para crear un nuevo workspace y una aplicación de inicio inicial, ejecuta el comando CLI `ng new` y proporciona el nombre `my-app`, como se muestra aquí, luego responde las preguntas sobre las características a incluir:

```shell

ng new my-app

```

El Angular CLI instala los paquetes npm de Angular necesarios y otras dependencias.
Esto puede tomar unos minutos.

El CLI crea un nuevo workspace y una pequeña aplicación de bienvenida en un nuevo directorio con el mismo nombre que el workspace, lista para ejecutarse.
Navega al nuevo directorio para que los comandos subsiguientes usen este workspace.

```shell

cd my-app

```

## Ejecutar la aplicación

El Angular CLI incluye un servidor de desarrollo, para que puedas construir y servir tu aplicación localmente. Ejecuta el siguiente comando:

```shell

ng serve --open

```

El comando `ng serve` lanza el servidor, observa tus archivos, así como reconstruye la aplicación y recarga el navegador a medida que haces cambios en esos archivos.

La opción `--open` (o simplemente `-o`) abre automáticamente tu navegador en `http://localhost:4200/` para ver la aplicación generada.

## Workspaces y archivos de proyecto

El comando [`ng new`](cli/new) crea una carpeta de [workspace de Angular](reference/configs/workspace-config) y genera una nueva aplicación dentro de ella.
Un workspace puede contener múltiples aplicaciones y librerías.
La aplicación inicial creada por el comando [`ng new`](cli/new) está en el directorio raíz del workspace.
Cuando generas una aplicación o librería adicional en un workspace existente, va a una subcarpeta `projects/` por defecto.

Una aplicación recién generada contiene los archivos fuente para un componente raíz y una plantilla.
Cada aplicación tiene una carpeta `src` que contiene sus componentes, datos y recursos.

Puedes editar los archivos generados directamente, o agregar y modificarlos usando comandos CLI.
Usa el comando [`ng generate`](cli/generate) para agregar nuevos archivos para componentes adicionales, directivas, pipes, servicios y más.
Los comandos como [`ng add`](cli/add) y [`ng generate`](cli/generate), que crean u operan en aplicaciones y librerías, deben ejecutarse
desde dentro de un workspace. Por el contrario, los comandos como `ng new` deben ejecutarse _fuera_ de un workspace porque crearán uno nuevo.

## Siguientes pasos

- Aprende más sobre la [estructura de archivos](reference/configs/file-structure) y [configuración](reference/configs/workspace-config) del workspace generado.

- Prueba tu nueva aplicación con [`ng test`](cli/test).

- Genera código repetitivo como componentes, directivas y pipes con [`ng generate`](cli/generate).

- Despliega tu nueva aplicación y hazla disponible para usuarios reales con [`ng deploy`](cli/deploy).

- Configura y ejecuta pruebas end-to-end de tu aplicación con [`ng e2e`](cli/e2e).
