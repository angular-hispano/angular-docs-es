# Configuración del Servidor MCP de Angular CLI

Angular CLI incluye un servidor de Model Context Protocol (MCP) que permite a los asistentes de IA (como Cursor, Antigravity, JetBrains AI, etc.) interactuar directamente con Angular CLI. Proporciona herramientas para generación de código, análisis del workspace, y ejecución de builds/pruebas.

<docs-callout title="Integración con Angular AI Agent Skills">
  Si tu entorno host soporta Agent Skills personalizados (como Antigravity), puedes combinar el servidor MCP de Angular CLI con las [Angular AI Skills](https://angular.dev/ai/agent-skills) oficiales. Mientras que las skills proporcionan al agente guía detallada a nivel de instrucción y estándares de codificación, el servidor MCP proporciona las herramientas de acción (como compilar, ejecutar pruebas y analizar workspaces) para ejecutar esas pautas, resultando en un agente de desarrollo completo y poderoso.
</docs-callout>

## Get Started

Para usar el servidor MCP, configura tu entorno host (IDE o CLI) para ejecutar `npx @angular/cli mcp`.

<docs-tab-group>
  <docs-tab label="Antigravity IDE">
    Crea un archivo llamado `.antigravity/mcp.json` en la raíz de tu proyecto:

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

  </docs-tab>

  <docs-tab label="Cursor">
    Crea `.cursor/mcp.json` en la raíz del proyecto (o globalmente en `~/.cursor/mcp.json`):

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

  </docs-tab>

  <docs-tab label="VS Code">
    Crea `.vscode/mcp.json`:

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

  </docs-tab>
</docs-tab-group>

## Herramientas Disponibles (Por Defecto) {#available-tools-default}

Cuando el servidor MCP está habilitado, los agentes de IA tienen acceso a las siguientes herramientas:

| Nombre                       | Descripción                                                                                               |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `ai_tutor`                    | Inicia un tutor de Angular interactivo potenciado por IA.                                                   |
| `devserver.start`             | Inicia de forma asíncrona un servidor de desarrollo (`ng serve`). Retorna inmediatamente.                   |
| `devserver.stop`              | Detiene el servidor de desarrollo.                                                                          |
| `devserver.wait_for_build`    | Retorna los logs del build más reciente en un servidor de desarrollo en ejecución.                          |
| `get_best_practices`          | Recupera la Guía de Mejores Prácticas de Angular (crucial para componentes standalone, formularios tipados, etc.). |
| `list_projects`               | Lista todas las aplicaciones y bibliotecas en el workspace leyendo `angular.json`.                          |
| `onpush_zoneless_migration`   | Analiza código y proporciona un plan para migrarlo a detección de cambios `OnPush` (prerrequisito para zoneless). |
| `run_target`                  | Ejecuta un target configurado (ej. build, test, lint, e2e, deploy).                                         |
| `search_documentation`        | Busca en la documentación oficial en `https://angular.dev`.                                                 |

## Flujos de Trabajo Comunes {#common-workflows}

Estos flujos de trabajo demuestran cómo los asistentes de IA coordinan diferentes herramientas MCP para lograr automáticamente historias de desarrollo complejas.

### 1. Ajuste de Rendimiento: Migración a Zoneless & OnPush {#1-performance-tuning-zoneless--onpush-migration}

El agente de IA optimiza el rendimiento de la detección de cambios y migra componentes a un estado listo para zoneless.

1. **Descubrir el Workspace**: El agente de IA llama a `list_projects` para localizar componentes, proyectos y configuraciones de estilo/prueba en el workspace.
2. **Modernización de Schematics (Prerrequisito)**: El agente de IA ejecuta cualquier migración de signals prerrequisito usando comandos estándar de `ng generate` (ej. Signal Inputs, Signal Queries).
3. **Planificar la Migración**: El agente de IA llama a `onpush_zoneless_migration` con la ruta absoluta del directorio o archivo de componente.
4. **Aplicar Cambios**: El agente de IA aplica automáticamente el cambio accionable único retornado por la herramienta al código base.
5. **Verificar Cambios**: El agente de IA ejecuta pruebas unitarias llamando a `run_target` con el parámetro target establecido a `"test"`.
6. **Repetir**: El agente de IA llama a `onpush_zoneless_migration` nuevamente para obtener el siguiente paso, repitiendo hasta que la herramienta indique que la migración está completa.

### 2. Desarrollo de Características & Ciclo TDD {#2-feature-development--tdd-loop}

El agente de IA automatiza la investigación, implementación y verificación al desarrollar nuevas características.

1. **Investigación de API y Sintaxis**: El agente de IA usa `search_documentation` para buscar APIs de Angular o reglas de sintaxis (ej. opciones del bloque `@defer`).
2. **Cargar Estándares de Codificación**: El agente de IA llama a `get_best_practices` con la ruta del workspace para cargar reglas de codificación alineadas con la versión de Angular.
3. **Iniciar Servidor de Desarrollo Local**: El agente de IA inicia un servidor en segundo plano llamando a `devserver.start`.
4. **Monitorear el Build**: El agente de IA usa `devserver.wait_for_build` para observar los logs del build y asegurar que la compilación tenga éxito mientras edita el código.
5. **Escribir y Ejecutar Pruebas**: El agente de IA identifica el framework de pruebas del proyecto (ej. Jasmine, Jest, Vitest) vía `list_projects`, escribe el archivo de prueba correspondiente, y ejecuta las pruebas usando `run_target` con `"test"`.
6. **Detener el Servidor de Desarrollo**: Al terminar, el agente de IA detiene el servidor de desarrollo activo llamando a `devserver.stop`.

### 3. Onboarding y Aprendizaje para Desarrolladores {#3-developer-onboarding-and-learning}

El agente de IA guía al desarrollador a través de conceptos de Angular en un sandbox interactivo.

1. **Descubrir Proyectos**: El agente de IA llama a `list_projects` para escanear el workspace e identificar la estructura del código base.
2. **Lanzar el Tutor**: El agente de IA ejecuta `ai_tutor` para cargar las instrucciones del currículo, la persona y las pautas de tutoría.
3. **Seguir el Currículo**: El agente de IA guía al usuario a través del currículo, explicando conceptos e instruyéndolo sobre qué componentes construir o modificar.
4. **Implementar y Verificar**: El agente de IA ayuda a implementar el código del sandbox y verifica los cambios usando `run_target` con `"test"` o `"build"`.

## Opciones de Comando {#command-options}

Puedes pasar argumentos al servidor MCP en el array `args` de tu configuración:

- `--read-only`: Solo registra herramientas que no modifican el proyecto.
- `--local-only`: Solo registra herramientas que no requieren una conexión a internet.

Ejemplo para modo de solo lectura:

```json
"args": ["-y", "@angular/cli", "mcp", "--read-only"]
```
