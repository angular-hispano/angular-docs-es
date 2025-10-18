# Configuración del Servidor MCP de Angular CLI

Angular CLI incluye un [servidor de Model Context Protocol (MCP)](https://modelcontextprotocol.io/) experimental que permite a los asistentes de IA en tu entorno de desarrollo interactuar con Angular CLI. Hemos incluido soporte para generación de código potenciado por CLI, agregar paquetes y más.

## Herramientas Disponibles

El servidor MCP de Angular CLI proporciona varias herramientas para asistirte en tu flujo de trabajo de desarrollo. Por defecto, las siguientes herramientas están habilitadas:

| Nombre                 | Descripción                                                                                                                                                                                        | `local-only` | `read-only` |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `get_best_practices`   | Recupera la Guía de Mejores Prácticas de Angular. Esta guía es esencial para asegurar que todo el código se adhiera a los estándares modernos, incluyendo componentes standalone, formularios tipados y flujo de control moderno. |      ✅      |      ✅     |
| `list_projects`        | Lista los nombres de todas las aplicaciones y bibliotecas definidas dentro de un espacio de trabajo de Angular. Lee el archivo de configuración `angular.json` para identificar los proyectos.                                    |      ✅      |      ✅     |
| `search_documentation` | Busca en la documentación oficial de Angular en https://angular.dev. Esta herramienta debe usarse para responder cualquier pregunta sobre Angular, como para APIs, tutoriales y mejores prácticas.               |      ❌      |      ✅     |

## Primeros Pasos

Para comenzar, ejecuta el siguiente comando en tu terminal:

```bash
ng mcp
```

Cuando se ejecuta desde una terminal interactiva, este comando muestra instrucciones sobre cómo configurar un entorno host para usar el servidor MCP. Las siguientes secciones proporcionan configuraciones de ejemplo para varios editores y herramientas populares.

### Cursor

Crea un archivo llamado `.cursor/mcp.json` en la raíz de tu proyecto y agrega la siguiente configuración. También puedes configurarlo globalmente en `~/.cursor/mcp.json`.

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### Firebase Studio

Crea un archivo llamado `.idx/mcp.json` en la raíz de tu proyecto y agrega la siguiente configuración:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### Gemini CLI

Crea un archivo llamado `.gemini/settings.json` en la raíz de tu proyecto y agrega la siguiente configuración:

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### IDEs de JetBrains

En los IDEs de JetBrains (como IntelliJ IDEA o WebStorm), después de instalar el plugin JetBrains AI Assistant, ve a `Settings | Tools | AI Assistant | Model Context Protocol (MCP)`. Agrega un nuevo servidor y selecciona `As JSON`. Pega la siguiente configuración, que no usa una propiedad de nivel superior para la lista de servidores.

```json
{
  "name": "Angular CLI",
  "command": "npx",
  "args": [
    "-y",
    "@angular/cli",
    "mcp"
  ]
}
```

### VS Code

En la raíz de tu proyecto, crea un archivo llamado `.vscode/mcp.json` y agrega la siguiente configuración. Nota el uso de la propiedad `servers`.

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

### Otros IDEs

Para otros IDEs, consulta la documentación de tu IDE para la ubicación adecuada del archivo de configuración MCP (a menudo `mcp.json`). La configuración debe contener el siguiente fragmento.

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## Opciones de Comando

El comando `mcp` puede configurarse con las siguientes opciones pasadas como argumentos en la configuración MCP de tu IDE:

| Opción         | Tipo      | Descripción                                                                                                | Predeterminado |
| :------------- | :-------- | :--------------------------------------------------------------------------------------------------------- | :------ |
| `--read-only`  | `boolean` | Solo registra herramientas que no realizan cambios en el proyecto. Tu editor o agente de codificación aún puede realizar ediciones. | `false` |
| `--local-only` | `boolean` | Solo registra herramientas que no requieren una conexión a internet. Tu editor o agente de codificación aún puede enviar datos a través de la red. | `false` |


Por ejemplo, para ejecutar el servidor en modo de solo lectura en VS Code, actualizarías tu `mcp.json` así:

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp", "--read-only"]
    }
  }
}
```

## Comentarios y Nuevas Ideas

El equipo de Angular agradece tus comentarios sobre las capacidades MCP existentes y cualquier idea que tengas para nuevas herramientas o características. Por favor comparte tus pensamientos abriendo un issue en el [repositorio de GitHub angular/angular](https://github.com/angular/angular/issues).
