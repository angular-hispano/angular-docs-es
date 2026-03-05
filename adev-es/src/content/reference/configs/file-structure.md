# Estructura de archivos del espacio de trabajo y del proyecto

Tú desarrollas aplicaciones en el contexto de un espacio de trabajo de Angular.
Un espacio de trabajo contiene los archivos para uno o más proyectos.
Un proyecto es el conjunto de archivos que componen una aplicación o una biblioteca componible.

El comando `ng new` del Angular CLI crea un espacio de trabajo.

```shell
ng new my-project
```

Cuando ejecutas este comando, el CLI instala los paquetes npm necesarios de Angular y otras dependencias en un nuevo espacio de trabajo, con una aplicación a nivel raíz llamada _my-project_.

De forma predeterminada, `ng new` crea una aplicación esqueleto inicial en el nivel raíz del espacio de trabajo, junto con sus pruebas de extremo a extremo.
El esqueleto es para una sencilla aplicación de bienvenida que está lista para ejecutarse y es fácil de modificar.
La aplicación a nivel raíz tiene el mismo nombre que el espacio de trabajo, y los archivos fuente residen en la subcarpeta `src/` del espacio de trabajo.

Este comportamiento predeterminado es adecuado para un estilo de desarrollo típico "multi-repo" donde cada aplicación reside en su propio espacio de trabajo.
Se recomienda a principiantes y usuarios intermedios a usar `ng new` para crear un espacio de trabajo separado para cada aplicación.

Angular también soporta espacios de trabajo con [múltiples proyectos](#múltiples-proyectos).
Este tipo de entorno de desarrollo es adecuado para usuarios avanzados que están desarrollando bibliotecas componibles,
y para empresas que usan un estilo de desarrollo "monorepo", con un único repositorio y configuración global para todos los proyectos de Angular.

Para configurar un espacio de trabajo monorepo, deberías omitir la creación de la aplicación raíz.
Consulta [Configuración para un espacio de trabajo de múltiples proyectos](#configuración-para-un-espacio-de-trabajo-de-múltiples-proyectos) a continuación.

## Archivos de configuración del espacio de trabajo

Todos los proyectos dentro de un espacio de trabajo comparten una [configuración](reference/configs/workspace-config).
El nivel superior del espacio de trabajo contiene archivos de configuración para todo el espacio de trabajo, archivos de configuración para la aplicación a nivel raíz y subcarpetas para los archivos fuente y de prueba de la aplicación a nivel raíz.

| Archivos de configuración del espacio de trabajo | Propósito                                                                                                                                                                                                                                                                                                                                         |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.editorconfig`                                  | Configuración para editores de código. Consulta [EditorConfig](https://editorconfig.org).                                                                                                                                                                                                                                                         |
| `.gitignore`                                     | Especifica archivos intencionalmente sin seguimiento que [Git](https://git-scm.com) debería ignorar.                                                                                                                                                                                                                                              |
| `README.md`                                      | Documentación para el espacio de trabajo.                                                                                                                                                                                                                                                                                                         |
| `angular.json`                                   | Configuración de CLI para todos los proyectos en el espacio de trabajo, incluyendo opciones de configuración de cómo compilar, servir y probar cada proyecto. Para más detalles, consulta [Configuración del espacio de trabajo de Angular](reference/configs/workspace-config).                                                                  |
| `package.json`                                   | Configura [dependencias de paquetes npm](reference/configs/npm-packages) que están disponibles para todos los proyectos en el espacio de trabajo. Consulta la [documentación de npm](https://docs.npmjs.com/files/package.json) para el formato y contenidos específicos de este archivo.                                                         |
| `package-lock.json`                              | Proporciona información de versión para todos los paquetes instalados en `node_modules` por el cliente npm. Consulta la [documentación de npm](https://docs.npmjs.com/files/package-lock.json) para más detalles.                                                                                                                                 |
| `src/`                                           | Archivos fuente para el proyecto de la aplicación a nivel raíz.                                                                                                                                                                                                                                                                                   |
| `public/`                                        | Contiene imágenes y otros recursos (assets) para ser servidos como archivos estáticos por el servidor de desarrollo y copiados tal cual cuando compilas tu aplicación.                                                                                                                                                                            |
| `node_modules/`                                  | [Paquetes npm](reference/configs/npm-packages) instalados para todo el espacio de trabajo. Las dependencias `node_modules` de todo el espacio de trabajo son visibles para todos los proyectos.                                                                                                                                                   |
| `tsconfig.json`                                  | La configuración base de [TypeScript](https://www.typescriptlang.org) para proyectos en el espacio de trabajo. Todos los demás archivos de configuración heredan de este archivo base. Para más información, consulta la [documentación relevante de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases). |

## Archivos del proyecto de aplicación

De forma predeterminada, el comando del CLI `ng new my-app` crea una carpeta de espacio de trabajo llamada "my-app" y genera un nuevo esqueleto de aplicación en una carpeta `src/` en el nivel superior del espacio de trabajo.
Una aplicación recién generada contiene archivos fuente para un módulo raíz, con un componente raíz y una plantilla.

Cuando la estructura de archivos del espacio de trabajo está en su lugar, puedes usar el comando `ng generate` en la línea de comandos para agregar funcionalidad y datos a la aplicación.
Esta aplicación inicial a nivel raíz es la _aplicación predeterminada_ para los comandos del CLI (a menos que cambies el valor predeterminado después de crear [aplicaciones adicionales](#múltiples-proyectos)).

Para un espacio de trabajo de una sola aplicación, la subcarpeta `src` del espacio de trabajo contiene los archivos fuente (lógica de la aplicación, datos y recursos) para la aplicación raíz.
Para un espacio de trabajo de múltiples proyectos, los proyectos adicionales en la carpeta `projects` contienen una subcarpeta `project-name/src/` con la misma estructura.

### Archivos fuente de la aplicación

Los archivos en el nivel superior de `src/` admiten la ejecución de tu aplicación.
Las subcarpetas contienen la fuente de la aplicación y la configuración específica de la aplicación.

| Archivos de soporte de la aplicación | Propósito                                                                                                                                                                                                                                                                |
| :----------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                               | Contiene los archivos del componente en los que se definen la lógica y los datos de tu aplicación. Consulta los detalles a continuación.                                                                                                                                 |
| `favicon.ico`                        | Un icono para usar en esta aplicación en la barra de marcadores.                                                                                                                                                                                                         |
| `index.html`                         | La página HTML principal que se sirve cuando alguien visita tu sitio. El CLI agrega automáticamente todos los archivos JavaScript y CSS al compilar tu aplicación, por lo que generalmente no necesitas agregar ninguna etiqueta `<script>` o `<link>` aquí manualmente. |
| `main.ts`                            | El punto de entrada principal para tu aplicación.                                                                                                                                                                                                                        |
| `styles.css`                         | Estilos CSS globales aplicados a toda la aplicación.                                                                                                                                                                                                                     |

Dentro de la carpeta `src`, la carpeta `app` contiene la lógica y los datos de tu proyecto.
Los componentes, plantillas y estilos en Angular van aquí.

| Archivos `src/app/`     | Propósito                                                                                                                                                                                                                                                                                      |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.config.ts`         | Define la configuración de la aplicación que indica a Angular cómo ensamblar la aplicación. A medida que agregas más proveedores a la aplicación, deben declararse aquí.<br><br>_Solo se genera cuando se usa la opción `--standalone`._                                                       |
| `app.component.ts`      | Define el componente raíz de la aplicación, llamado `AppComponent`. La vista asociada con este componente raíz se convierte en la raíz de la jerarquía de vistas a medida que agregas componentes y servicios a tu aplicación.                                                                 |
| `app.component.html`    | Define la plantilla HTML asociada con `AppComponent`.                                                                                                                                                                                                                                          |
| `app.component.css`     | Define la hoja de estilo CSS para `AppComponent`.                                                                                                                                                                                                                                              |
| `app.component.spec.ts` | Define una prueba unitaria para `AppComponent`.                                                                                                                                                                                                                                                |
| `app.module.ts`         | Define el módulo raíz, llamado `AppModule`, que indica a Angular cómo ensamblar la aplicación. Inicialmente solo declara el `AppComponent`. A medida que agregas más componentes a la aplicación, deben declararse aquí.<br><br>_Solo se genera cuando se usa la opción `--standalone false`._ |
| `app.routes.ts`         | Define la configuración de enrutamiento de la aplicación.                                                                                                                                                                                                                                      |

### Archivos de configuración de la aplicación

Los archivos de configuración específicos de la aplicación para la aplicación raíz residen en el nivel raíz del espacio de trabajo.
Para un espacio de trabajo de múltiples proyectos, los archivos de configuración específicos del proyecto están en la raíz del proyecto, en `projects/project-name/`.

Los archivos de configuración de [TypeScript](https://www.typescriptlang.org) específicos del proyecto heredan del archivo genérico del espacio de trabajo `tsconfig.json`.

| Archivos de configuración específicos de la aplicación | Propósito                                                                                                                                                                                                                |
| :----------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.app.json`                                    | [Configuración de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) específica de la aplicación, incluyendo [opciones del compilador de Angular](reference/configs/angular-compiler-options). |
| `tsconfig.spec.json`                                   | [Configuración de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) para pruebas de la aplicación.                                                                                            |

## Múltiples proyectos

Un espacio de trabajo de múltiples proyectos es adecuado para una organización que usa un único repositorio y una configuración global para múltiples proyectos de Angular (el modelo "monorepo").
Un espacio de trabajo de múltiples proyectos también admite el desarrollo de bibliotecas.

### Configuración para un espacio de trabajo de múltiples proyectos

Si tienes la intención de tener múltiples proyectos en un espacio de trabajo, puedes omitir la generación inicial de la aplicación cuando creas el espacio de trabajo, y darle al espacio de trabajo un nombre único.
El siguiente comando crea un espacio de trabajo con todos los archivos de configuración de todo el espacio de trabajo, pero sin una aplicación a nivel raíz.

```shell
ng new my-workspace --no-create-application
```

Luego puedes generar aplicaciones y bibliotecas con nombres que sean únicos dentro del espacio de trabajo.

```shell
cd my-workspace
ng generate application my-app
ng generate library my-lib
```

### Estructura de archivos de múltiples proyectos

La primera aplicación generada explícitamente se dirige a la carpeta `projects` junto con los demás proyectos en el espacio de trabajo.
Las bibliotecas recién generadas también se agregan en `projects`.
Cuando creas proyectos de esta manera, la estructura de archivos del espacio de trabajo es completamente coherente con la estructura del [archivo de configuración del espacio de trabajo](reference/configs/workspace-config), `angular.json`.

```markdown
my-workspace/
├── … (archivos de configuración a nivel de espacio de trabajo)
└── projects/ (aplicaciones y bibliotecas)
├── my-app/ (una aplicación generada explícitamente)
│ └── … (código y configuración específicos de la aplicación)
└── my-lib/ (una biblioteca generada)
└── … (código y configuración específicos de la biblioteca)
```

## Archivos de proyecto de biblioteca

Cuando generas una biblioteca usando el CLI (con un comando como `ng generate library my-lib`), los archivos generados van a la carpeta `projects/` del espacio de trabajo.
Para obtener más información acerca de cómo crear tus propias bibliotecas, consulta [Creando bibliotecas](tools/libraries/creating-libraries).

A diferencia de una aplicación, una biblioteca tiene su propio archivo de configuración `package.json`.

Bajo la carpeta `projects/`, la carpeta `my-lib` contiene el código de tu biblioteca.

| Archivos fuente de la biblioteca | Propósito                                                                                                                                                                                                                    |
| :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib`                        | Contiene la lógica y los datos del proyecto de tu biblioteca. Al igual que un proyecto de aplicación, un proyecto de biblioteca puede contener componentes, servicios, módulos, directivas y pipes.                          |
| `src/public-api.ts`              | Especifica todos los archivos que se exportan desde tu biblioteca.                                                                                                                                                           |
| `ng-package.json`                | Archivo de configuración usado por [ng-packagr](https://github.com/ng-packagr/ng-packagr) para compilar tu biblioteca.                                                                                                       |
| `package.json`                   | Configura las [dependencias de paquetes npm](reference/configs/npm-packages) que son obligatorias para esta biblioteca.                                                                                                      |
| `tsconfig.lib.json`              | [Configuración de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) específica de la biblioteca, incluyendo las [opciones del compilador de Angular](reference/configs/angular-compiler-options). |
| `tsconfig.lib.prod.json`         | [Configuración de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) específica de la biblioteca que se usa al compilar la biblioteca en modo de producción.                                       |
| `tsconfig.spec.json`             | [Configuración de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) para pruebas unitarias de la biblioteca.                                                                                      |
