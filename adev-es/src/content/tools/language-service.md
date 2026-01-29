# Angular Language Service

El Angular Language Service proporciona a los editores de código una forma de obtener autocompletado, errores, sugerencias y navegación dentro de las plantillas de Angular.
Funciona con plantillas externas en archivos HTML separados, y también con plantillas en línea.

## Configurando opciones del compilador para el Angular Language Service

Para habilitar las características más recientes del Language Service, configura la opción `strictTemplates` en `tsconfig.json` estableciendo `strictTemplates` a `true`, como se muestra en el siguiente ejemplo:

```json

"angularCompilerOptions": {
  "strictTemplates": true
}

```

Para más información, consulta la guía de [opciones del compilador de Angular](reference/configs/angular-compiler-options).

## Características

Tu editor detecta automáticamente que estás abriendo un archivo de Angular.
Luego usa el Angular Language Service para leer tu archivo `tsconfig.json`, encontrar todas las plantillas que tienes en tu aplicación, y proporcionar servicios de lenguaje para cualquier plantilla que abras.

Los servicios de lenguaje incluyen:

- Listas de autocompletado
- Mensajes de diagnóstico AOT
- Información rápida
- Ir a la definición

### Autocompletado

El autocompletado puede acelerar tu tiempo de desarrollo proporcionándote posibilidades contextuales y sugerencias mientras escribes.
Este ejemplo muestra el autocompletado en una interpolación.
Mientras escribes, puedes presionar tab para completar.

<img alt="autocompletado" src="assets/images/guide/language-service/language-completion.gif">

También hay autocompletado dentro de los elementos.
Cualquier elemento que tengas como selector de componente aparecerá en la lista de autocompletado.

### Verificación de errores

El Angular Language Service puede advertirte de errores en tu código.
En este ejemplo, Angular no sabe qué es `orders` ni de dónde viene.

<img alt="verificación de errores" src="assets/images/guide/language-service/language-error.gif">

### Información rápida y navegación

La característica de información rápida te permite pasar el cursor para ver de dónde vienen los componentes, directivas y módulos.
Luego puedes hacer clic en "Go to definition" o presionar F12 para ir directamente a la definición.

<img alt="navegación" src="assets/images/guide/language-service/language-navigation.gif">

## Angular Language Service en tu editor

Angular Language Service está actualmente disponible como extensión para [Visual Studio Code](https://code.visualstudio.com), [WebStorm](https://www.jetbrains.com/webstorm), [Sublime Text](https://www.sublimetext.com), [Zed](https://zed.dev), [Neovim](https://neovim.io) y [Eclipse IDE](https://www.eclipse.org/eclipseide).

### Visual Studio Code

En [Visual Studio Code](https://code.visualstudio.com), instala la extensión desde el [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).
Abre el marketplace desde el editor usando el ícono de Extensions en el panel del menú izquierdo, o usa VS Quick Open \(⌘+P en Mac, CTRL+P en Windows\) y escribe "? ext".
En el marketplace, busca la extensión Angular Language Service, y haz clic en el botón **Install**.

La integración de Visual Studio Code con el Angular language service es mantenida y distribuida por el equipo de Angular.

### Visual Studio

En [Visual Studio](https://visualstudio.microsoft.com), instala la extensión desde el [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService).
Abre el marketplace desde el editor seleccionando Extensions en el panel del menú superior, y luego seleccionando Manage Extensions.
En el marketplace, busca la extensión Angular Language Service, y haz clic en el botón **Install**.

La integración de Visual Studio con el Angular language service es mantenida y distribuida por Microsoft con ayuda del equipo de Angular.
Consulta el proyecto [aquí](https://github.com/microsoft/vs-ng-language-service).

### WebStorm

En [WebStorm](https://www.jetbrains.com/webstorm), habilita el plugin [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs).

Desde WebStorm 2019.1, el `@angular/language-service` ya no es necesario y debería ser eliminado de tu `package.json`.

### Sublime Text

En [Sublime Text](https://www.sublimetext.com), el Language Service solo soporta plantillas en línea cuando se instala como plug-in.
Necesitas un plug-in personalizado de Sublime \(o modificaciones al plug-in actual\) para autocompletado en archivos HTML.

Para usar el Language Service para plantillas en línea, primero debes agregar una extensión para permitir TypeScript, luego instalar el plug-in de Angular Language Service.
A partir de TypeScript 2.3, TypeScript tiene un modelo de plug-ins que el language service puede usar.

1. Instala la última versión de TypeScript en un directorio local `node_modules`:

```shell

npm install --save-dev typescript

```

1. Instala el paquete Angular Language Service en la misma ubicación:

```shell

npm install --save-dev @angular/language-service

```

1. Una vez que el paquete esté instalado, agrega lo siguiente a la sección `"compilerOptions"` del `tsconfig.json` de tu proyecto.

   ```json {header:"tsconfig.json"}
   "plugins": [
     {"name": "@angular/language-service"}
   ]
   ```

2. En las preferencias de usuario de tu editor \(`Cmd+,` o `Ctrl+,`\), agrega lo siguiente:

   ```json {header:"Sublime Text user preferences"}

   "typescript-tsdk": "<ruta a tu carpeta>/node_modules/typescript/lib"

   ```

Esto permite que el Angular Language Service proporcione diagnósticos y autocompletado en archivos `.ts`.

### Eclipse IDE

Puedes instalar directamente el paquete "Eclipse IDE for Web and JavaScript developers" que viene con el Angular Language Server incluido, o desde otros paquetes de Eclipse IDE, usa Help > Eclipse Marketplace para encontrar e instalar [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml).

### Neovim

#### Conquer of Completion con Node.js

El Angular Language Service usa el tsserver, que no sigue las especificaciones LSP exactamente. Por lo tanto, si estás usando neovim o vim con JavaScript o TypeScript o Angular, puede que encuentres que [Conquer of Completion](https://github.com/neoclide/coc.nvim) (COC) tiene la implementación más completa del Angular Language Service y el tsserver. Esto es porque COC porta la implementación de VSCode del tsserver que acomoda la implementación del tsserver.

1. [Configura coc.nvim](https://github.com/neoclide/coc.nvim)

2. Configura el Angular Language Service

   Una vez instalado, ejecuta el comando de línea de comandos de vim `CocConfig` para abrir el archivo de configuración `coc-settings.json` y agrega la propiedad angular.

   Asegúrate de sustituir las rutas correctas a tu `node_modules` global de modo que apunten a los directorios que contienen `tsserver` y el `ngserver` respectivamente.

   ```json {header:"Ejemplo de archivo CocConfig coc-settings.json"}
   {
     "languageserver": {
       "angular": {
         "command": "ngserver",
         "args": [
           "--stdio",
           "--tsProbeLocations",
           "/usr/local/lib/node_modules/typescript/lib/CAMBIA/ESTO/A/TU/GLOBAL/NODE_MODULES",
           "--ngProbeLocations",
           "/usr/local/lib/node_modules/@angular/language-server/bin/CAMBIA/ESTO/A/TU/GLOBAL/NODE_MODULES"
         ],
         "filetypes": ["ts", "typescript", "html"],
         "trace.server.verbosity": "verbose"
       }
     }
   }
   ```

ÚTIL: `/usr/local/lib/node_modules/typescript/lib` y `/usr/local/lib/node_modules/@angular/language-server/bin` arriba deberían apuntar a la ubicación de tus node modules globales, que puede ser diferente.

#### LSP integrado de Neovim

Angular Language Service puede ser usado con Neovim usando el plugin [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig).

1. [Instala nvim-lspconfig](https://github.com/neovim/nvim-lspconfig?tab=readme-ov-file#install)

2. [Configura angularls para nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#angularls)

### Zed

En [Zed](https://zed.dev), instala la extensión desde [Extensions: Marketplace](https://zed.dev/extensions/angular).

## Cómo funciona el Language Service

Cuando usas un editor con un language service, el editor inicia un proceso separado de language-service y se comunica con él a través de [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call), usando el [Language Server Protocol](https://microsoft.github.io/language-server-protocol).
Cuando escribes en el editor, el editor envía información al proceso del language-service para rastrear el estado de tu proyecto.

Cuando activas una lista de autocompletado dentro de una plantilla, el editor primero parsea la plantilla en un [árbol de sintaxis abstracta (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) HTML.
El compilador de Angular interpreta ese árbol para determinar el contexto: a qué módulo pertenece la plantilla, el alcance actual, el selector del componente, y dónde está tu cursor en el AST de la plantilla.
Luego puede determinar los símbolos que potencialmente podrían estar en esa posición.

Es un poco más complejo si estás en una interpolación.
Si tienes una interpolación de `{{data.---}}` dentro de un `div` y necesitas la lista de autocompletado después de `data.---`, el compilador no puede usar el AST HTML para encontrar la respuesta.
El AST HTML solo puede decirle al compilador que hay algo de texto con los caracteres "`{{data.---}}`".
Es entonces cuando el parser de plantillas produce un AST de expresión, que reside dentro del AST de la plantilla.
El Angular Language Services entonces mira `data.---` dentro de su contexto, le pregunta al TypeScript Language Service cuáles son los miembros de `data`, y devuelve la lista de posibilidades.

## Más información

- Para información más detallada sobre la implementación, consulta el [código fuente del Angular Language Service](https://github.com/angular/angular/blob/main/packages/language-service/src)
- Para más información sobre las consideraciones y propósitos del diseño, consulta la [documentación de diseño aquí](https://github.com/angular/vscode-ng-language-service/wiki/Design)
