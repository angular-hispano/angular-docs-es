# Builders del Angular CLI

Varios comandos del Angular CLI ejecutan un proceso complejo en tu código, como construir, probar o servir tu aplicación.
Los comandos usan una herramienta interna llamada Architect para ejecutar _builders del CLI_, que invocan otra herramienta (bundler, ejecutor de pruebas, servidor) para lograr la tarea deseada.
Los builders personalizados pueden realizar una tarea completamente nueva, o cambiar qué herramienta de terceros es usada por un comando existente.

Este documento explica cómo los builders del CLI se integran con el archivo de configuración del workspace, y muestra cómo puedes crear tu propio builder.

ÚTIL: Encuentra el código de los ejemplos usados aquí en este [repositorio de GitHub](https://github.com/mgechev/cli-builders-demo).

## Builders del CLI

La herramienta interna Architect delega trabajo a funciones manejadoras llamadas _builders_.
Una función manejadora builder recibe dos argumentos:

| Argumento  | Tipo             |
|:---       |:---              |
| `options` | `JSONObject`     |
| `context` | `BuilderContext` |

La separación de preocupaciones aquí es la misma que con [schematics](tools/cli/schematics-authoring), que se usan para otros comandos CLI que tocan tu código (como `ng generate`).

- El objeto `options` es proporcionado por las opciones y configuración del usuario del CLI, mientras que el objeto `context` es proporcionado por la API Builder del CLI automáticamente.
- Además de la información contextual, el objeto `context` también proporciona acceso a un método de programación, `context.scheduleTarget()`.
  El programador ejecuta la función manejadora builder con una configuración de objetivo dada.

La función manejadora builder puede ser síncrona (devolver un valor), asíncrona (devolver una `Promise`), o observar y devolver múltiples valores (devolver un `Observable`).
Los valores de retorno siempre deben ser de tipo `BuilderOutput`.
Este objeto contiene un campo Boolean `success` y un campo `error` opcional que puede contener un mensaje de error.

Angular proporciona algunos builders que son usados por el CLI para comandos como `ng build` y `ng test`.
Las configuraciones de objetivo predeterminadas para estos y otros builders del CLI integrados se pueden encontrar y configurar en la sección "architect" del [archivo de configuración del workspace](reference/configs/workspace-config), `angular.json`.
También, extiende y personaliza Angular creando tus propios builders, que puedes ejecutar directamente usando el [`comando ng run del CLI`](cli/run).

### Estructura de proyecto Builder

Un builder reside en una carpeta de "proyecto" que es similar en estructura a un workspace Angular, con archivos de configuración globales en el nivel superior, y configuración más específica en una carpeta fuente con los archivos de código que definen el comportamiento.
Por ejemplo, tu carpeta `myBuilder` podría contener los siguientes archivos.

| Archivos                    | Propósito                                                                                                   |
|:---                      | :---                                                                                                      |
| `src/my-builder.ts`      | Archivo fuente principal para la definición del builder.                                                              |
| `src/my-builder.spec.ts` | Archivo fuente para pruebas.                                                                                    |
| `src/schema.json`        | Definición de opciones de entrada del builder.                                                                      |
| `builders.json`          | Definición de builders.                                                                                      |
| `package.json`           | Dependencias. Consulta [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json). |
| `tsconfig.json`          | [Configuración TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).              |

Los builders pueden publicarse a `npm`, consulta [Publicando tu Librería](tools/libraries/creating-libraries).

## Creando un builder

Como ejemplo, crea un builder que copia un archivo a una nueva ubicación.
Para crear un builder, usa la función `createBuilder()` del Builder del CLI, y devuelve un objeto `Promise<BuilderOutput>`.

<docs-code header="src/my-builder.ts (builder skeleton)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder-skeleton"/>

Ahora agreguemos algo de lógica a esto.
El siguiente código recupera las rutas de archivo origen y destino de las opciones del usuario y copia el archivo desde el origen al destino \(usando la [versión Promise de la función integrada de NodeJS `copyFile()`](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)\).
Si la operación de copia falla, devuelve un error con un mensaje sobre el problema subyacente.

<docs-code header="src/my-builder.ts (builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder"/>

### Manejando salida

Por defecto, `copyFile()` no imprime nada en la salida estándar o error del proceso.
Si ocurre un error, podría ser difícil entender exactamente qué estaba intentando hacer el builder cuando ocurrió el problema.
Agrega algo de contexto adicional registrando información adicional usando la API `Logger`.
Esto también permite que el builder mismo sea ejecutado en un proceso separado, incluso si la salida estándar y el error están desactivados.

Puedes recuperar una instancia `Logger` del contexto.

<docs-code header="src/my-builder.ts (handling output)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="handling-output"/>

### Reporte de progreso y estado

La API del Builder del CLI incluye herramientas de reporte de progreso y estado, que pueden proporcionar pistas para ciertas funciones e interfaces.

Para reportar progreso, usa el método `context.reportProgress()`, que toma un valor actual, total opcional, y cadena de estado como argumentos.
El total puede ser cualquier número. Por ejemplo, si sabes cuántos archivos tienes que procesar, el total podría ser el número de archivos, y current debería ser el número procesado hasta ahora.
La cadena de estado no se modifica a menos que pases un nuevo valor de cadena.

En nuestro ejemplo, la operación de copia o termina o aún está ejecutándose, por lo que no hay necesidad de un reporte de progreso, pero puedes reportar el estado para que un builder padre que llamó a nuestro builder sepa qué está pasando.
Usa el método `context.reportStatus()` para generar una cadena de estado de cualquier longitud.

ÚTIL: No hay garantía de que una cadena larga se muestre completamente; podría cortarse para ajustarse a la UI que la muestra.

Pasa una cadena vacía para eliminar el estado.

<docs-code header="src/my-builder.ts (progress reporting)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="progress-reporting"/>

## Entrada del Builder

Puedes invocar un builder indirectamente a través de un comando CLI como `ng build`, o directamente con el comando `ng run` del Angular CLI.
En cualquier caso, debes proporcionar entradas requeridas, pero puedes dejar que otras entradas predeterminen valores que están preconfigurados para un _objetivo_ específico, especificado por una [configuración](tools/cli/environments), o establecido en la línea de comandos.

### Validación de entrada

Defines las entradas del builder en un esquema JSON asociado con ese builder.
Similar a los schematics, la herramienta Architect recopila los valores de entrada resueltos en un objeto `options`, y valida sus tipos contra el esquema antes de pasarlos a la función builder.

Para nuestro builder de ejemplo, `options` debería ser un `JsonObject` con dos claves:
un `source` y un `destination`, cada uno de los cuales es una cadena.

Puedes proporcionar el siguiente esquema para validación de tipo de estos valores.

```json {header: "schema.json"}

{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "source": {
      "type": "string"
    },
    "destination": {
      "type": "string"
    }
  }
}
```

ÚTIL: Este es un ejemplo mínimo, pero el uso de un esquema para validación puede ser muy poderoso.
Para más información, consulta el [sitio web de esquemas JSON](http://json-schema.org).

Para vincular nuestra implementación del builder con su esquema y nombre, necesitas crear un archivo de *definición de builder*, al cual puedes apuntar en `package.json`.

Crea un archivo llamado `builders.json` que se vea así:

```json {header: "builders.json"}

{
  "builders": {
    "copy": {
      "implementation": "./dist/my-builder.js",
      "schema": "./src/schema.json",
      "description": "Copies a file."
    }
  }
}
```

En el archivo `package.json`, agrega una clave `builders` que le diga a la herramienta Architect dónde encontrar nuestro archivo de definición de builder.

```json {header: "package.json"}
{
  "name": "@example/copy-file",
  "version": "1.0.0",
  "description": "Builder for copying files",
  "builders": "builders.json",
  "dependencies": {
    "@angular-devkit/architect": "~0.1200.0",
    "@angular-devkit/core": "^12.0.0"
  }
}
```

El nombre oficial de nuestro builder ahora es `@example/copy-file:copy`.
La primera parte de esto es el nombre del paquete y la segunda parte es el nombre del builder como se especifica en el archivo `builders.json`.

Estos valores se acceden en `options.source` y `options.destination`.

<docs-code header="src/my-builder.ts (report status)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="report-status"/>

### Configuración de objetivo

Un builder debe tener un objetivo definido que lo asocie con una configuración de entrada y proyecto específicos.

Los objetivos se definen en el [archivo de configuración del CLI](reference/configs/workspace-config) `angular.json`.
Un objetivo especifica el builder a usar, su configuración de opciones predeterminadas y configuraciones alternativas con nombre.
Architect en el Angular CLI usa la definición de objetivo para resolver opciones de entrada para una ejecución dada.

El archivo `angular.json` tiene una sección para cada proyecto, y la sección "architect" de cada proyecto configura objetivos para builders usados por comandos CLI como 'build', 'test' y 'serve'.
Por defecto, por ejemplo, el comando `ng build` ejecuta el builder `@angular-devkit/build-angular:browser` para realizar la tarea de construcción, y pasa valores de opción predeterminados como se especifica para el objetivo `build` en `angular.json`.

```json {header: "angular.json"}
{
  "myApp": {
    "...": "...",
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:browser",
        "options": {
          "outputPath": "dist/myApp",
          "index": "src/index.html",
          "...": "..."
        },
        "configurations": {
          "production": {
            "fileReplacements": [
              {
                "replace": "src/environments/environment.ts",
                "with": "src/environments/environment.prod.ts"
              }
            ],
            "optimization": true,
            "outputHashing": "all",
            "...": "..."
          }
        }
      },
      "...": "..."
    }
  }
}
```

El comando pasa al builder el conjunto de opciones predeterminadas especificadas en la sección "options".
Si pasas la bandera `--configuration=production`, usa los valores de sobrescritura especificados en la configuración `production`.
Especifica sobrescrituras de opción adicionales individualmente en la línea de comandos.

#### Cadenas de objetivo

El comando genérico `ng run` del CLI toma como su primer argumento una cadena de objetivo de la siguiente forma.

```shell

project:target[:configuration]

```

|               | Detalles |
|:---           |:---     |
| project       | El nombre del proyecto Angular CLI con el que el objetivo está asociado.                                               |
| target        | Una configuración de builder con nombre de la sección `architect` del archivo `angular.json`.                                |
| configuration | (opcional) El nombre de una sobrescritura de configuración específica para el objetivo dado, como se define en el archivo `angular.json`. |

Si tu builder llama a otro builder, podría necesitar leer una cadena de objetivo pasada.
Analiza esta cadena en un objeto usando la función utilitaria `targetFromTargetString()` de `@angular-devkit/architect`.

## Programar y ejecutar

Architect ejecuta builders de forma asíncrona.
Para invocar un builder, programas una tarea para que se ejecute cuando toda la resolución de configuración esté completa.

La función builder no se ejecuta hasta que el programador devuelva un objeto de control `BuilderRun`.
El CLI típicamente programa tareas llamando a la función `context.scheduleTarget()`, y luego resuelve opciones de entrada usando la definición de objetivo en el archivo `angular.json`.

Architect resuelve opciones de entrada para un objetivo dado tomando el objeto de opciones predeterminadas, luego sobrescribiendo valores de la configuración, luego sobrescribiendo más valores del objeto de sobrescrituras pasado a `context.scheduleTarget()`.
Para el Angular CLI, el objeto de sobrescrituras se construye desde argumentos de línea de comandos.

Architect valida los valores de opciones resultantes contra el esquema del builder.
Si las entradas son válidas, Architect crea el contexto y ejecuta el builder.

Para más información consulta [Configuración del Workspace](reference/configs/workspace-config).

ÚTIL: También puedes invocar un builder directamente desde otro builder o prueba llamando a `context.scheduleBuilder()`.
Pasas un objeto `options` directamente al método, y esos valores de opción son validados contra el esquema del builder sin ajuste adicional.

Solo el método `context.scheduleTarget()` resuelve la configuración y sobrescrituras a través del archivo `angular.json`.

### Configuración predeterminada de architect

Creemos un archivo simple `angular.json` que pone las configuraciones de objetivo en contexto.

Puedes publicar el builder a npm (consulta [Publicando tu Librería](tools/libraries/creating-libraries#publishing-your-library)), e instalarlo usando el siguiente comando:

```shell

npm install @example/copy-file

```

Si creas un nuevo proyecto con `ng new builder-test`, el archivo `angular.json` generado se ve algo así, con solo configuraciones de builder predeterminadas.

```json {header: "angular.json"}
{
  "projects": {
    "builder-test": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              "optimization": true,
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

### Agregando un objetivo

Agrega un nuevo objetivo que ejecutará nuestro builder para copiar un archivo.
Este objetivo le dice al builder que copie el archivo `package.json`.

- Agregaremos una nueva sección de objetivo al objeto `architect` para nuestro proyecto
- El objetivo llamado `copy-package` usa nuestro builder, que publicaste a `@example/copy-file`.
- El objeto options proporciona valores predeterminados para las dos entradas que definiste.
  - `source` - El archivo existente que estás copiando.
  - `destination` - La ruta a la que quieres copiar.

< header="angular.json" language="json">

{
"projects": {
"builder-test": {
"architect": {
"copy-package": {
"builder": "@example/copy-file:copy",
"options": {
"source": "package.json",
"destination": "package-copy.json"
}
},

        // Existing targets...
      }
    }

}
}
</docs-code>

### Ejecutando el builder

Para ejecutar nuestro builder con la configuración predeterminada del nuevo objetivo, usa el siguiente comando CLI.

```shell

ng run builder-test:copy-package

```

Esto copia el archivo `package.json` a `package-copy.json`.

Usa argumentos de línea de comandos para sobrescribir los valores predeterminados configurados.
Por ejemplo, para ejecutar con un valor `destination` diferente, usa el siguiente comando CLI.

```shell

ng run builder-test:copy-package --destination=package-other.json

```

Esto copia el archivo a `package-other.json` en lugar de `package-copy.json`.
Debido a que no sobrescribiste la opción _source_, aún copiará desde el archivo `package.json` predeterminado.

## Probando un builder

Usa pruebas de integración para tu builder, de modo que puedas usar el programador Architect para crear un contexto, como en este [ejemplo](https://github.com/mgechev/cli-builders-demo).
En el directorio fuente del builder, crea un nuevo archivo de prueba `my-builder.spec.ts`. La prueba crea nuevas instancias de `JsonSchemaRegistry` (para validación de esquema), `TestingArchitectHost` (una implementación en memoria de `ArchitectHost`), y `Architect`.

Aquí hay un ejemplo de una prueba que ejecuta el builder de copiar archivo.
La prueba usa el builder para copiar el archivo `package.json` y valida que el contenido del archivo copiado sea el mismo que la fuente.

<docs-code header="src/my-builder.spec.ts" path="adev/src/content/examples/cli-builder/src/my-builder.spec.ts"/>

ÚTIL: Al ejecutar esta prueba en tu repositorio, necesitas el paquete [`ts-node`](https://github.com/TypeStrong/ts-node).
Puedes evitar esto renombrando `my-builder.spec.ts` a `my-builder.spec.js`.

### Modo watch

La mayoría de los builders se ejecutan una vez y regresan. Sin embargo, este comportamiento no es completamente compatible con un builder que observa cambios (como un devserver, por ejemplo).
Architect puede soportar modo watch, pero hay algunas cosas a tener en cuenta.

- Para ser usado con modo watch, una función manejadora builder debería devolver un `Observable`.
  Architect se suscribe al `Observable` hasta que completa y podría reutilizarlo si el builder se programa nuevamente con los mismos argumentos.

- El builder siempre debería emitir un objeto `BuilderOutput` después de cada ejecución.
  Una vez que se ha ejecutado, puede entrar en un modo watch, para ser activado por un evento externo.
  Si un evento lo activa para reiniciar, el builder debería ejecutar la función `context.reportRunning()` para decirle a Architect que está ejecutándose nuevamente.
  Esto previene que Architect detenga el builder si otra ejecución está programada.

Cuando tu builder llama a `BuilderRun.stop()` para salir del modo watch, Architect se desuscribe del `Observable` del builder y llama a la lógica de teardown del builder para limpiar.
Este comportamiento también permite que las construcciones de larga duración sean detenidas y limpiadas.

En general, si tu builder está observando un evento externo, deberías separar tu ejecución en tres fases.

| Fases      | Detalles |
|:---        |:---     |
| Ejecución  | La tarea siendo realizada, como invocar un compilador. Esto termina cuando el compilador finaliza y tu builder emite un objeto `BuilderOutput`.                                                                                                  |
| Observando | Entre dos ejecuciones, observa un flujo de eventos externo. Por ejemplo, observa el sistema de archivos para cualquier cambio. Esto termina cuando el compilador reinicia, y `context.reportRunning()` es llamado.                                                          |
| Completado | O la tarea está completamente terminada, como un compilador que necesita ejecutarse varias veces, o la ejecución del builder fue detenida (usando `BuilderRun.stop()`). Architect ejecuta lógica de teardown y se desuscribe del `Observable` de tu builder. |

## Resumen

La API Builder del CLI proporciona un medio de cambiar el comportamiento del Angular CLI usando builders para ejecutar lógica personalizada.

- Los builders pueden ser síncronos o asíncronos, ejecutarse una vez u observar eventos externos, y pueden programar otros builders u objetivos.
- Los builders tienen opciones predeterminadas especificadas en el archivo de configuración `angular.json`, que pueden ser sobrescritas por una configuración alternativa para el objetivo, y sobrescritas adicionalmente por banderas de línea de comandos
- El equipo de Angular recomienda que uses pruebas de integración para probar builders Architect. Usa pruebas unitarias para validar la lógica que el builder ejecuta.
- Si tu builder devuelve un `Observable`, debería limpiar el builder en la lógica de teardown de ese `Observable`.
