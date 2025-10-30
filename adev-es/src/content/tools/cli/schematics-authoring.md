# Creación de schematics

Puedes crear tus propios schematics para operar en proyectos Angular.
Los desarrolladores de librerías típicamente empaquetan schematics con sus librerías para integrarlos con el Angular CLI.
También puedes crear schematics independientes para manipular los archivos y construcciones en aplicaciones Angular como una forma de personalizarlos para tu entorno de desarrollo y hacerlos conformes a tus estándares y restricciones.
Los schematics pueden encadenarse, ejecutando otros schematics para realizar operaciones complejas.

Manipular el código en una aplicación tiene el potencial de ser tanto muy poderoso como correspondientemente peligroso.
Por ejemplo, crear un archivo que ya existe sería un error, y si se aplicara inmediatamente, descartaría todos los otros cambios aplicados hasta ahora.
Las herramientas de Angular Schematics protegen contra efectos secundarios y errores creando un sistema de archivos virtual.
Un schematic describe un flujo de transformaciones que se pueden aplicar al sistema de archivos virtual.
Cuando un schematic se ejecuta, las transformaciones se registran en memoria, y solo se aplican en el sistema de archivos real una vez que se confirma que son válidas.

## Conceptos de Schematics

La API pública para schematics define clases que representan los conceptos básicos.

* El sistema de archivos virtual está representado por un `Tree`.
    La estructura de datos `Tree` contiene una *base* \(un conjunto de archivos que ya existe\) y un *área de staging* \(una lista de cambios a aplicar a la base\).
    Al hacer modificaciones, no cambias realmente la base, sino que agregas esas modificaciones al área de staging.

* Un objeto `Rule` define una función que toma un `Tree`, aplica transformaciones, y devuelve un nuevo `Tree`.
    El archivo principal para un schematic, `index.ts`, define un conjunto de reglas que implementan la lógica del schematic.

* Una transformación está representada por una `Action`.
    Hay cuatro tipos de acción: `Create`, `Rename`, `Overwrite` y `Delete`.

* Cada schematic se ejecuta en un contexto, representado por un objeto `SchematicContext`.

El objeto de contexto pasado a una regla proporciona acceso a funciones utilitarias y metadata que el schematic podría necesitar para trabajar, incluyendo una API de logging para ayudar con la depuración.
El contexto también define una *estrategia de fusión* que determina cómo se fusionan los cambios desde el árbol en staging en el árbol base.
Un cambio puede ser aceptado o ignorado, o lanzar una excepción.

### Definiendo reglas y acciones

Cuando creas un nuevo schematic en blanco con el [CLI de Schematics](#schematics-cli), la función de entrada generada es una *factory de regla*.
Un objeto `RuleFactory` define una función de orden superior que crea una `Rule`.

<docs-code header="index.ts" language="typescript">

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

// No tienes que exportar la función como predeterminada.
// También puedes tener más de una factory de regla por archivo.
export function helloWorld(_options: any): Rule {
 return (tree: Tree,_context: SchematicContext) => {
   return tree;
 };
}

</docs-code>

Tus reglas pueden hacer cambios a tus proyectos llamando a herramientas externas e implementando lógica.
Necesitas una regla, por ejemplo, para definir cómo una plantilla en el schematic debe ser fusionada en el proyecto host.

Las reglas pueden hacer uso de utilidades proporcionadas con el paquete `@schematics/angular`.
Busca funciones helper para trabajar con módulos, dependencias, TypeScript, AST, JSON, workspaces y proyectos del Angular CLI, y más.

<docs-code header="index.ts" language="typescript">

import {
  JsonAstObject,
  JsonObject,
  JsonValue,
  Path,
  normalize,
  parseJsonAst,
  strings,
} from '@angular-devkit/core';

</docs-code>

### Definiendo opciones de entrada con un esquema e interfaces

Las reglas pueden recopilar valores de opción del llamador e inyectarlos en plantillas.
Las opciones disponibles para tus reglas, con sus valores permitidos y predeterminados, se definen en el archivo de esquema JSON del schematic, `<schematic>/schema.json`.
Define tipos de datos variables o enumerados para el esquema usando interfaces TypeScript.

El esquema define los tipos y valores predeterminados de variables usadas en el schematic.
Por ejemplo, el hipotético schematic "Hello World" podría tener el siguiente esquema.

<docs-code header="src/hello-world/schema.json" language="json">

{
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "default": "world"
        },
        "useColor": {
            "type": "boolean"
        }
    }
}
</docs-code>

Consulta ejemplos de archivos de esquema para los schematics de comandos del Angular CLI en [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).

### Prompts de Schematic

Los *prompts* de schematic introducen interacción de usuario en la ejecución del schematic.
Configura opciones del schematic para mostrar una pregunta personalizable al usuario.
Los prompts se muestran antes de la ejecución del schematic, que luego usa la respuesta como el valor para la opción.
Esto permite a los usuarios dirigir la operación del schematic sin requerir conocimiento profundo del espectro completo de opciones disponibles.

El schematic "Hello World" podría, por ejemplo, preguntarle al usuario su nombre, y mostrar ese nombre en lugar del nombre predeterminado "world".
Para definir tal prompt, agrega una propiedad `x-prompt` al esquema para la variable `name`.

Similarmente, puedes agregar un prompt para dejar que el usuario decida si el schematic usa color al ejecutar su acción hello.
El esquema con ambos prompts sería el siguiente.

<docs-code header="src/hello-world/schema.json" language="json">

{
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "default": "world",
            "x-prompt": "What is your name?"
        },
        "useColor": {
            "type": "boolean",
            "x-prompt": "Would you like the response in color?"
        }
    }
}
</docs-code>

#### Sintaxis corta de prompt

Estos ejemplos usan una forma abreviada de la sintaxis de prompt, proporcionando solo el texto de la pregunta.
En la mayoría de los casos, esto es todo lo que se requiere.
Nota sin embargo, que los dos prompts esperan diferentes tipos de entrada.
Cuando se usa la forma abreviada, el tipo más apropiado se selecciona automáticamente basado en el esquema de la propiedad.
En el ejemplo, el prompt `name` usa el tipo `input` porque es una propiedad string.
El prompt `useColor` usa un tipo `confirmation` porque es una propiedad Boolean.
En este caso, "yes" corresponde a `true` y "no" corresponde a `false`.

Hay tres tipos de entrada soportados.

| Tipo de entrada   | Detalles |
|:---          |:----    |
| confirmation | Una pregunta de sí o no; ideal para opciones Boolean.   |
| input        | Entrada textual; ideal para opciones string o number. |
| list         | Un conjunto predefinido de valores permitidos.                |

En la forma corta, el tipo se infiere del tipo y restricciones de la propiedad.

| Esquema de propiedad | Tipo de prompt |
|:---             |:---         |
| "type": "boolean"  | confirmation \("yes"=`true`, "no"=`false`\)  |
| "type": "string"   | input                                        |
| "type": "number"   | input \(solo números válidos aceptados\)        |
| "type": "integer"  | input \(solo números válidos aceptados\)        |
| "enum": […] | list \(miembros enum se convierten en selecciones de lista\) |

En el siguiente ejemplo, la propiedad toma un valor enumerado, por lo que el schematic automáticamente elige el tipo list, y crea un menú desde los valores posibles.

<docs-code header="schema.json" language="json">

"style": {
  "description": "The file extension or preprocessor to use for style files.",
  "type": "string",
  "default": "css",
  "enum": [
    "css",
    "scss",
    "sass",
    "less",
    "styl"
  ],
  "x-prompt": "Which stylesheet format would you like to use?"
}

</docs-code>

El runtime de prompt automáticamente valida la respuesta proporcionada contra las restricciones proporcionadas en el esquema JSON.
Si el valor no es aceptable, se le solicita al usuario un nuevo valor.
Esto asegura que cualquier valor pasado al schematic cumpla con las expectativas de la implementación del schematic, para que no necesites agregar verificaciones adicionales dentro del código del schematic.

#### Sintaxis larga de prompt

La sintaxis del campo `x-prompt` soporta una forma larga para casos donde requieres personalización y control adicional sobre el prompt.
En esta forma, el valor del campo `x-prompt` es un objeto JSON con subcampos que personalizan el comportamiento del prompt.

| Campo   | Valor de datos |
|:---     |:---        |
| type    | `confirmation`, `input`, o `list` \(seleccionado automáticamente en forma corta\) |
| message | string \(requerido\)                                                         |
| items   | string y/o par de objeto label/value \(solo válido con tipo `list`\)       |

El siguiente ejemplo de la forma larga es del esquema JSON para el schematic que el CLI usa para [generar aplicaciones](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56).
Define el prompt que permite a los usuarios elegir qué preprocesador de estilo quieren usar para la aplicación que se está creando.
Al usar la forma larga, el schematic puede proporcionar formato más explícito de las opciones de menú.

<docs-code header="package/schematics/angular/application/schema.json" language="json">

"style": {
  "description": "The file extension or preprocessor to use for style files.",
  "type": "string",
  "default": "css",
  "enum": [
    "css",
    "scss",
    "sass",
    "less"
  ],
  "x-prompt": {
    "message": "Which stylesheet format would you like to use?",
    "type": "list",
    "items": [
      { "value": "css",  "label": "CSS" },
      { "value": "scss", "label": "SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]" },
      { "value": "sass", "label": "Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]" },
      { "value": "less", "label": "Less   [ https://lesscss.org/                                            ]" }
    ]
  },
},

</docs-code>

#### Esquema x-prompt

El esquema JSON que define las opciones de un schematic soporta extensiones para permitir la definición declarativa de prompts y su respectivo comportamiento.
No se requiere lógica o cambios adicionales al código de un schematic para soportar los prompts.
El siguiente esquema JSON es una descripción completa de la sintaxis de forma larga para el campo `x-prompt`.

<docs-code header="x-prompt schema" language="json">

{
    "oneOf": [
        { "type": "string" },
        {
            "type": "object",
            "properties": {
                "type": { "type": "string" },
                "message": { "type": "string" },
                "items": {
                    "type": "array",
                    "items": {
                        "oneOf": [
                            { "type": "string" },
                            {
                                "type": "object",
                                "properties": {
                                    "label": { "type": "string" },
                                    "value": { }
                                },
                                "required": [ "value" ]
                            }
                        ]
                    }
                }
            },
            "required": [ "message" ]
        }
    ]
}

</docs-code>

## CLI de Schematics

Los schematics vienen con su propia herramienta de línea de comandos.
Usando Node 6.9 o posterior, instala la herramienta de línea de comandos de Schematics globalmente:

<docs-code language="shell">

npm install -g @angular-devkit/schematics-cli

</docs-code>

Esto instala el ejecutable `schematics`, que puedes usar para crear una nueva colección de schematics en su propia carpeta de proyecto, agregar un nuevo schematic a una colección existente, o extender un schematic existente.

En las siguientes secciones, crearás una nueva colección de schematics usando el CLI para introducir los archivos y estructura de archivos, y algunos de los conceptos básicos.

El uso más común de schematics, sin embargo, es integrar una librería Angular con el Angular CLI.
Haz esto creando los archivos schematic directamente dentro del proyecto de librería en un workspace Angular, sin usar el CLI de Schematics.
Consulta [Schematics para Librerías](tools/cli/schematics-for-libraries).

### Creando una colección de schematics

El siguiente comando crea un nuevo schematic llamado `hello-world` en una nueva carpeta de proyecto del mismo nombre.

<docs-code language="shell">

schematics blank --name=hello-world

</docs-code>

El schematic `blank` es proporcionado por el CLI de Schematics.
El comando crea una nueva carpeta de proyecto \(la carpeta raíz para la colección\) y un schematic con nombre inicial en la colección.

Ve a la carpeta de la colección, instala tus dependencias npm, y abre tu nueva colección en tu editor favorito para ver los archivos generados.
Por ejemplo, si estás usando VS Code:

<docs-code language="shell">

cd hello-world
npm install
npm run build
code .

</docs-code>

El schematic inicial obtiene el mismo nombre que la carpeta del proyecto, y se genera en `src/hello-world`.
Agrega schematics relacionados a esta colección, y modifica el código base generado para definir la funcionalidad de tu schematic.
Cada nombre de schematic debe ser único dentro de la colección.

### Ejecutando un schematic

Usa el comando `schematics` para ejecutar un schematic con nombre.
Proporciona la ruta a la carpeta del proyecto, el nombre del schematic y cualquier opción obligatoria, en el siguiente formato.

<docs-code language="shell">

schematics <path-to-schematics-project>:<schematics-name> --<required-option>=<value>

</docs-code>

La ruta puede ser absoluta o relativa al directorio de trabajo actual donde el comando es ejecutado.
Por ejemplo, para ejecutar el schematic que acabas de generar \(que no tiene opciones requeridas\), usa el siguiente comando.

<docs-code language="shell">

schematics .:hello-world

</docs-code>

### Agregando un schematic a una colección

Para agregar un schematic a una colección existente, usa el mismo comando que usas para iniciar un nuevo proyecto schematics, pero ejecuta el comando dentro de la carpeta del proyecto.

<docs-code language="shell">

cd hello-world
schematics blank --name=goodbye-world

</docs-code>

El comando genera el nuevo schematic con nombre dentro de tu colección, con un archivo principal `index.ts` y su spec de prueba asociado.
También agrega el nombre, descripción y función factory para el nuevo schematic al esquema de la colección en el archivo `collection.json`.

## Contenido de la colección

El nivel superior de la carpeta raíz del proyecto para una colección contiene archivos de configuración, una carpeta `node_modules`, y una carpeta `src/`.
La carpeta `src/` contiene subcarpetas para schematics con nombre en la colección, y un esquema, `collection.json`, que describe los schematics recopilados.
Cada schematic se crea con un nombre, descripción y función factory.

<docs-code language="json">

{
  "$schema":
     "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}

</docs-code>

* La propiedad `$schema` especifica el esquema que el CLI usa para validación.
* La propiedad `schematics` lista schematics con nombre que pertenecen a esta colección.
    Cada schematic tiene una descripción de texto plano, y apunta a la función de entrada generada en el archivo principal.

* La propiedad `factory` apunta a la función de entrada generada.
    En este ejemplo, invocas el schematic `hello-world` llamando a la función factory `helloWorld()`.

* La propiedad opcional `schema` apunta a un archivo de esquema JSON que define las opciones de línea de comandos disponibles para el schematic.
* El array opcional `aliases` especifica una o más cadenas que pueden usarse para invocar el schematic.
    Por ejemplo, el schematic para el comando "generate" del Angular CLI tiene un alias "g", que te permite usar el comando `ng g`.

### Schematics con nombre

Cuando usas el CLI de Schematics para crear un proyecto schematics en blanco, el nuevo schematic en blanco es el primer miembro de la colección, y tiene el mismo nombre que la colección.
Cuando agregas un nuevo schematic con nombre a esta colección, se agrega automáticamente al esquema `collection.json`.

Además del nombre y descripción, cada schematic tiene una propiedad `factory` que identifica el punto de entrada del schematic.
En el ejemplo, invocas la funcionalidad definida del schematic llamando a la función `helloWorld()` en el archivo principal, `hello-world/index.ts`.

<img alt="overview" src="assets/images/guide/schematics/collection-files.gif">

Cada schematic con nombre en la colección tiene las siguientes partes principales.

| Partes          | Detalles |
|:---            |:---     |
| `index.ts`     | Código que define la lógica de transformación para un schematic con nombre.  |
| `schema.json`  | Definición de variable schematic.                                     |
| `schema.d.ts`  | Variables schematic.                                               |
| `files/`       | Archivos de componente/plantilla opcionales a replicar.                    |

Es posible que un schematic proporcione toda su lógica en el archivo `index.ts`, sin plantillas adicionales.
Puedes crear schematics dinámicos para Angular, sin embargo, proporcionando componentes y plantillas en la carpeta `files`, como aquellos en proyectos Angular independientes.
La lógica en el archivo index configura estas plantillas definiendo reglas que inyectan datos y modifican variables.
