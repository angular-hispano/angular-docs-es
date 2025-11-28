# Schematics para librerías

Cuando creas una librería Angular, puedes proporcionarla y empaquetarla con schematics que la integren con el Angular CLI.
Con tus schematics, tus usuarios pueden usar `ng add` para instalar una versión inicial de tu librería,
`ng generate` para crear artefactos definidos en tu librería, y `ng update` para ajustar su proyecto para una nueva versión de tu librería que introduce cambios disruptivos.

Todos los tres tipos de schematics pueden ser parte de una colección que empaquetas con tu librería.

## Creando una colección de schematics

Para iniciar una colección, necesitas crear los archivos schematic.
Los siguientes pasos te muestran cómo agregar soporte inicial sin modificar ningún archivo de proyecto.

1. En la carpeta raíz de tu librería, crea una carpeta `schematics`.
1. En la carpeta `schematics/`, crea una carpeta `ng-add` para tu primer schematic.
1. En el nivel raíz de la carpeta `schematics`, crea un archivo `collection.json`.
1. Edita el archivo `collection.json` para definir el esquema inicial para tu colección.

   <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.1.json"/>
   - La ruta `$schema` es relativa al esquema de colección Angular Devkit.
   - El objeto `schematics` describe los schematics con nombre que son parte de esta colección.
   - La primera entrada es para un schematic llamado `ng-add`.
     Contiene la descripción, y apunta a la función factory que se llama cuando tu schematic se ejecuta.

1. En el archivo `package.json` del proyecto de tu librería, agrega una entrada "schematics" con la ruta a tu archivo de esquema.
    El Angular CLI usa esta entrada para encontrar schematics con nombre en tu colección cuando ejecuta comandos.

<docs-code header="projects/my-lib/package.json (Schematics Collection Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="collection"/>

El esquema inicial que has creado le dice al CLI dónde encontrar el schematic que soporta el comando `ng add`.
Ahora estás listo para crear ese schematic.

## Proporcionando soporte de instalación

Un schematic para el comando `ng add` puede mejorar el proceso de instalación inicial para tus usuarios.
Los siguientes pasos definen este tipo de schematic.

1. Ve a la carpeta `<lib-root>/schematics/ng-add`.
1. Crea el archivo principal, `index.ts`.
1. Abre `index.ts` y agrega el código fuente para tu función factory schematic.

<docs-code header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"/>

El Angular CLI instalará la última versión de la librería automáticamente, y este ejemplo va un paso más allá agregando el `MyLibModule` a la raíz de la aplicación. La función `addRootImport` acepta un callback que necesita devolver un bloque de código. Puedes escribir cualquier código dentro de la cadena etiquetada con la función `code` y cualquier símbolo externo tiene que estar envuelto con la función `external` para asegurar que se generen las declaraciones de importación apropiadas.

### Definir tipo de dependencia

Usa la opción `save` de `ng-add` para configurar si la librería debería agregarse a las `dependencies`, las `devDependencies`, o no guardarse en absoluto en el archivo de configuración `package.json` del proyecto.

<docs-code header="projects/my-lib/package.json (ng-add Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="ng-add"/>

Los valores posibles son:

| Valores              | Detalles |
|:---                 |:---     |
| `false`             | No agregar el paquete a `package.json` |
| `true`              | Agregar el paquete a las dependencies     |
| `"dependencies"`    | Agregar el paquete a las dependencies     |
| `"devDependencies"` | Agregar el paquete a las devDependencies  |

## Construyendo tus schematics

Para empaquetar tus schematics junto con tu librería, debes configurar la librería para construir los schematics por separado, luego agregarlos al bundle.
Debes construir tus schematics _después_ de construir tu librería, para que se coloquen en el directorio correcto.

- Tu librería necesita un archivo de configuración TypeScript personalizado con instrucciones sobre cómo compilar tus schematics en tu librería distribuida
- Para agregar los schematics al bundle de la librería, agrega scripts al archivo `package.json` de la librería

Supón que tienes un proyecto de librería `my-lib` en tu workspace Angular.
Para decirle a la librería cómo construir los schematics, agrega un archivo `tsconfig.schematics.json` junto al archivo generado `tsconfig.lib.json` que configura la construcción de la librería.

1. Edita el archivo `tsconfig.schematics.json` para agregar el siguiente contenido.

   <docs-code header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"/>

   | Options   | Details                                                                                                          |
   | :-------- | :--------------------------------------------------------------------------------------------------------------- |
   | `rootDir` | Especifica que tu carpeta `schematics` contiene los archivos de entrada a compilar.                                 |
   | `outDir`  | Mapea a la carpeta de salida de la librería. Por defecto, esta es la carpeta `dist/my-lib` en la raíz de tu workspace. |

1. Para asegurarte de que los archivos fuente de tus schematics se compilen en el bundle de la librería, agrega los siguientes scripts al archivo `package.json` en la carpeta raíz del proyecto de tu librería \(`projects/my-lib`\).

   <docs-code header="projects/my-lib/package.json (Build Scripts)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json"/>
   - El script `build` compila tu schematic usando el archivo personalizado `tsconfig.schematics.json`
   - El script `postbuild` copia los archivos schematic después de que el script `build` completa
   - Tanto el script `build` como el `postbuild` requieren las dependencias `copyfiles` y `typescript`.
     Para instalar las dependencias, navega a la ruta definida en `devDependencies` y ejecuta `npm install` antes de ejecutar los scripts.

## Proporcionando soporte de generación

Puedes agregar un schematic con nombre a tu colección que permita a tus usuarios usar el comando `ng generate` para crear un artefacto que está definido en tu librería.

Supondremos que tu librería define un servicio, `my-service`, que requiere alguna configuración.
Quieres que tus usuarios puedan generarlo usando el siguiente comando CLI.

```shell

ng generate my-lib:my-service

```

Para comenzar, crea una nueva subcarpeta, `my-service`, en la carpeta `schematics`.

### Configurar el nuevo schematic

Cuando agregas un schematic a la colección, tienes que apuntar a él en el esquema de la colección, y proporcionar archivos de configuración para definir opciones que un usuario puede pasar al comando.

1. Edita el archivo `schematics/collection.json` para apuntar a la nueva subcarpeta schematic, e incluir un puntero a un archivo de esquema que especifica las entradas para el nuevo schematic.

<docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.json"/>

1. Ve a la carpeta `<lib-root>/schematics/my-service`.
1. Crea un archivo `schema.json` y define las opciones disponibles para el schematic.

   <docs-code header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"/>
   - _id_: Un ID único para el esquema en la colección.
   - _title_: Una descripción legible para humanos del esquema.
   - _type_: Un descriptor para el tipo proporcionado por las propiedades.
   - _properties_: Un objeto que define las opciones disponibles para el schematic.

    Cada opción asocia una clave con un tipo, descripción y alias opcional.
    El tipo define la forma del valor que esperas, y la descripción se muestra cuando el usuario solicita ayuda de uso para tu schematic.

    Consulta el esquema del workspace para personalizaciones adicionales para opciones schematic.

1. Crea un archivo `schema.ts` y define una interfaz que almacene los valores de las opciones definidas en el archivo `schema.json`.

   <docs-code header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"/>

   | Options | Details                                                                                                                                     |
   | :------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
   | name    | El nombre que quieres proporcionar para el servicio creado.                                                                                       |
   | path    | Sobrescribe la ruta proporcionada al schematic. El valor de ruta predeterminado se basa en el directorio de trabajo actual.                             |
   | project | Proporciona un proyecto específico en el que ejecutar el schematic. En el schematic, puedes proporcionar un valor predeterminado si la opción no es proporcionada por el usuario. |

### Agregar archivos de plantilla

Para agregar artefactos a un proyecto, tu schematic necesita sus propios archivos de plantilla.
Las plantillas schematic soportan sintaxis especial para ejecutar código y sustitución de variables.

1. Crea una carpeta `files/` dentro de la carpeta `schematics/my-service/`.
1. Crea un archivo llamado `__name@dasherize__.service.ts.template` que define una plantilla a usar para generar archivos.
    Esta plantilla generará un servicio que ya tiene el `HttpClient` de Angular inyectado en una propiedad `http`.

   <docs-code lang="typescript" header="projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)">

   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   @Injectable({
   providedIn: 'root'
   })
   export class <%= classify(name) %>Service {
   private http = inject(HttpClient);
   }

   </docs-code>
   - Los métodos `classify` y `dasherize` son funciones utilitarias que tu schematic usa para transformar tu plantilla fuente y nombre de archivo.
   - El `name` se proporciona como una propiedad de tu función factory.
     Es el mismo `name` que definiste en el esquema.

### Agregar la función factory

Ahora que tienes la infraestructura en su lugar, puedes definir la función principal que realiza las modificaciones que necesitas en el proyecto del usuario.

El framework de Schematics proporciona un sistema de plantillas de archivo, que soporta tanto plantillas de ruta como de contenido.
El sistema opera en marcadores de posición definidos dentro de archivos o rutas que se cargan en el `Tree` de entrada.
Los llena usando valores pasados a la `Rule`.

Para detalles de estas estructuras de datos y sintaxis, consulta el [Schematics README](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md).

1. Crea el archivo principal `index.ts` y agrega el código fuente para tu función factory schematic.
1. Primero, importa las definiciones de schematics que necesitarás.
    El framework de Schematics ofrece muchas funciones utilitarias para crear y usar reglas al ejecutar un schematic.

<docs-code header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schematics-imports"/>

1. Importa la interfaz de esquema definida que proporciona la información de tipo para las opciones de tu schematic.

<docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schema-imports"/>

1. Para construir el schematic de generación, comienza con una factory de regla vacía.

<docs-code header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" visibleRegion="factory"/>

Esta factory de regla devuelve el árbol sin modificación.
Las opciones son los valores de opción pasados desde el comando `ng generate`.

## Definir una regla de generación

Ahora tienes el framework en su lugar para crear el código que realmente modifica la aplicación del usuario para configurarla para el servicio definido en tu librería.

El workspace Angular donde el usuario instaló tu librería contiene múltiples proyectos \(aplicaciones y librerías\).
El usuario puede especificar el proyecto en la línea de comandos, o dejarlo predeterminado.
En cualquier caso, tu código necesita identificar el proyecto específico al que se está aplicando este schematic, para que puedas recuperar información de la configuración del proyecto.

Haz esto usando el objeto `Tree` que se pasa a la función factory.
Los métodos `Tree` te dan acceso al árbol completo de archivos en tu workspace, permitiéndote leer y escribir archivos durante la ejecución del schematic.

### Obtener la configuración del proyecto

1. Para determinar el proyecto de destino, usa el método `workspaces.readWorkspace` para leer el contenido del archivo de configuración del workspace, `angular.json`.
    Para usar `workspaces.readWorkspace` necesitas crear un `workspaces.WorkspaceHost` desde el `Tree`.
    Agrega el siguiente código a tu función factory.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="workspace"/>

   Asegúrate de verificar que el contexto existe y lanza el error apropiado.

1. Ahora que tienes el nombre del proyecto, úsalo para recuperar la información de configuración específica del proyecto.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="project-info"/>

   El objeto `workspace.projects` contiene toda la información de configuración específica del proyecto.

1. El `options.path` determina dónde se mueven los archivos de plantilla schematic una vez que se aplica el schematic.

    La opción `path` en el esquema del schematic se sustituye por defecto con el directorio de trabajo actual.
    Si el `path` no está definido, usa el `sourceRoot` de la configuración del proyecto junto con el `projectType`.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="path"/>

### Definir la regla

Una `Rule` puede usar archivos de plantilla externos, transformarlos y devolver otro objeto `Rule` con la plantilla transformada.
Usa las plantillas para generar cualquier archivo personalizado requerido para tu schematic.

1. Agrega el siguiente código a tu función factory.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="template"/>

   | Methods            | Details                                                                                                                                                                                                                                          |
   | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `apply()`          | Aplica múltiples reglas a una fuente y devuelve la fuente transformada. Toma 2 argumentos, una fuente y un array de reglas.                                                                                                                     |
   | `url()`            | Lee archivos fuente de tu sistema de archivos, relativo al schematic.                                                                                                                                                                              |
   | `applyTemplates()` | Recibe un argumento de métodos y propiedades que quieres hacer disponibles para la plantilla schematic y los nombres de archivo schematic. Devuelve una `Rule`. Aquí es donde defines los métodos `classify()` y `dasherize()`, y la propiedad `name`. |
   | `classify()`       | Toma un valor y devuelve el valor en título. Por ejemplo, si el nombre proporcionado es `my service`, se devuelve como `MyService`.                                                                                                             |
   | `dasherize()`      | Toma un valor y devuelve el valor en guiones y minúsculas. Por ejemplo, si el nombre proporcionado es MyService, se devuelve como `my-service`.                                                                                                     |
   | `move()`           | Mueve los archivos fuente proporcionados a su destino cuando se aplica el schematic.                                                                                                                                                              |

1. Finalmente, la factory de regla debe devolver una regla.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="chain"/>

   El método `chain()` te permite combinar múltiples reglas en una sola regla, para que puedas realizar múltiples operaciones en un solo schematic.
   Aquí solo estás fusionando las reglas de plantilla con cualquier código ejecutado por el schematic.

Consulta un ejemplo completo de la siguiente función de regla schematic.

<docs-code header="projects/my-lib/schematics/my-service/index.ts" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"/>

Para más información sobre reglas y métodos utilitarios, consulta [Provided Rules](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules).

## Ejecutando tu schematic de librería

Después de construir tu librería y schematics, puedes instalar la colección de schematics para ejecutarla contra tu proyecto.
Los siguientes pasos te muestran cómo generar un servicio usando el schematic que creaste anteriormente.

### Construir tu librería y schematics

Desde la raíz de tu workspace, ejecuta el comando `ng build` para tu librería.

```shell

ng build my-lib

```

Luego, cambias al directorio de tu librería para construir el schematic

```shell

cd projects/my-lib
npm run build

```

### Enlazar la librería

Tu librería y schematics se empaquetan y colocan en la carpeta `dist/my-lib` en la raíz de tu workspace.
Para ejecutar el schematic, necesitas enlazar la librería en tu carpeta `node_modules`.
Desde la raíz de tu workspace, ejecuta el comando `npm link` con la ruta a tu librería distribuible.

```shell

npm link dist/my-lib

```

### Ejecutar el schematic

Ahora que tu librería está instalada, ejecuta el schematic usando el comando `ng generate`.

```shell

ng generate my-lib:my-service --name my-data

```

En la consola, ves que el schematic se ejecutó y el archivo `my-data.service.ts` fue creado en tu carpeta de aplicación.

<docs-code language="shell" hideCopy>

CREATE src/app/my-data.service.ts (208 bytes)

</docs-code>
