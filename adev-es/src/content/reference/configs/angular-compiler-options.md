# Opciones del compilador de Angular

Cuando usas la [compilación anticipada (AOT)](tools/cli/aot-compiler), puedes controlar cómo se compila tu aplicación especificando las opciones del compilador de Angular en el [archivo de configuración de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

El objeto de opciones de Angular, `angularCompilerOptions`, es un hermano del objeto `compilerOptions` que proporciona opciones estándar al compilador de TypeScript.

<docs-code header="tsconfig.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.json" visibleRegion="angular-compiler-options"/>

## Herencia de configuración con `extends`

Al igual que el compilador de TypeScript, el compilador AOT de Angular también admite `extends` en la sección `angularCompilerOptions` del archivo de configuración de TypeScript.
La propiedad `extends` se encuentra en el nivel superior, paralela a `compilerOptions` y `angularCompilerOptions`.

Una configuración de TypeScript puede heredar ajustes de otro archivo usando la propiedad `extends`.
Las opciones de configuración del archivo base se cargan primero, luego son sobrescritas por las del archivo de configuración que hereda.

Por ejemplo:

<docs-code header="tsconfig.app.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.app.json" visibleRegion="angular-compiler-options-app"/>

Para más información, consulta el [Manual de TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

## Opciones de plantilla

Las siguientes opciones están disponibles para configurar el compilador AOT de Angular.

### `annotationsAs`

Modifica cómo se emiten las anotaciones específicas de Angular para mejorar el tree-shaking.
Las anotaciones que no son de Angular no se ven afectadas.
Uno de `static fields` o `decorators`. El valor predeterminado es `static fields`.

- De forma predeterminada, el compilador reemplaza los decoradores con un campo estático en la clase, lo que permite a tree-shakers avanzados como [Closure compiler](https://github.com/google/closure-compiler) eliminar clases no utilizadas.
- El valor `decorators` deja los decoradores en su lugar, lo que hace que la compilación sea más rápida.
  TypeScript emite llamadas al helper `__decorate`.
  Usa `--emitDecoratorMetadata` para la reflexión en tiempo de ejecución.

  ÚTIL: Que el código resultante no pueda realizar el tree-shaking correctamente.

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

Cuando es `true`, usa [Tsickle](https://github.com/angular/tsickle) para anotar el JavaScript emitido con comentarios [JSDoc](https://jsdoc.app) requeridos por el [Closure Compiler](https://github.com/google/closure-compiler).
El valor predeterminado es `false`.

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

Especifica el modo de compilación a usar.
Los siguientes modos están disponibles:

| Modos       | Detalles                                                                                                      |
| :---------- | :------------------------------------------------------------------------------------------------------------ |
| `'full'`    | Genera código completamente compilado con AOT según la versión de Angular que se esté utilizando actualmente. |
| `'partial'` | Genera código en una forma estable pero intermedia, adecuada para una biblioteca publicada.                   |

El valor predeterminado es `'full'`.

Para la mayoría de las aplicaciones, `'full'` es el modo de compilación correcto.

Usa `'partial'` para bibliotecas publicadas independientemente, como paquetes NPM.
Las compilaciones con `'partial'` generan un formato estable e intermedio que respalda mejor el uso por parte de aplicaciones compiladas en diferentes versiones de Angular respecto a la biblioteca.
Las bibliotecas construidas en "HEAD" junto a sus aplicaciones y usando la misma versión de Angular, como en un mono-repositorio, pueden usar `'full'` ya que no hay riesgo de asimetría de versiones.

### `disableExpressionLowering`

Cuando es `true`, el valor predeterminado, transforma el código que se usa o podría usarse en una anotación, para permitir que se importe desde módulos de fábrica de plantillas.
Para más información, consulta [reescritura de metadatos](tools/cli/aot-compiler#metadata-rewriting).

Cuando es `false`, deshabilita esta reescritura, lo que requiere que la reescritura se haga manualmente.

### `disableTypeScriptVersionCheck`

Cuando es `true`, el compilador no revisa la versión de TypeScript y no reporta un error cuando se usa una versión no compatible de TypeScript.
No recomendado, ya que las versiones no compatibles de TypeScript pueden tener un comportamiento indefinido.
El valor predeterminado es `false`.

### `enableI18nLegacyMessageIdFormat`

Indica al compilador de plantillas de Angular que cree IDs legacy para los mensajes que están etiquetados en las plantillas por el atributo `i18n`.
Para más información sobre cómo marcar mensajes para su localización, consulta [Marcar texto para traducciones][GuideI18nCommonPrepareMarkTextInComponentTemplate].

Establece esta opción en `false` a menos que tu proyecto dependa de traducciones que se crearon anteriormente usando IDs legacy.
El valor predeterminado es `true`.

Las herramientas de extracción de mensajes previas a Ivy creaban una variedad de formatos legacy para los IDs de mensajes extraídos.
Estos formatos de mensajes tienen algunos problemas, como el manejo de espacios en blanco y la dependencia de información dentro del HTML original de una plantilla.

El nuevo formato de mensaje es más resistente a los cambios de espacios en blanco, es el mismo en todos los formatos de archivo de traducción y se puede crear directamente a partir de llamadas a `$localize`.
Esto permite que los mensajes de `$localize` en el código de la aplicación usen el mismo ID que los mensajes `i18n` idénticos en las plantillas de componentes.

### `enableResourceInlining`

Cuando es `true`, reemplaza las propiedades `templateUrl` y `styleUrls` en todos los decoradores `@Component` con contenido en línea en las propiedades `template` y `styles`.

Cuando se habilita, la salida `.js` de `ngc` no incluye ninguna URL de estilo o de plantilla cargada de forma diferida.

Para proyectos de bibliotecas creados con el Angular CLI, el valor predeterminado de configuración de desarrollo es `true`.

### `enableLegacyTemplate`

Cuando es `true`, habilita el elemento deprecado `<template>` en lugar de `<ng-template>`.
El valor predeterminado es `false`.
Podría ser requerido por algunas bibliotecas de terceros en Angular.

### `flatModuleId`

El ID del módulo a usar para importar un módulo plano \(cuando `flatModuleOutFile` es `true`\).
Las referencias creadas por el compilador de plantillas usan este nombre de módulo al importar símbolos desde el módulo plano.
Se ignora si `flatModuleOutFile` es `false`.

### `flatModuleOutFile`

Cuando es `true`, genera un índice de módulo plano del nombre de archivo dado y los metadatos del módulo plano correspondientes.
Se usa para crear módulos planos que están empaquetados de manera similar a `@angular/core` y `@angular/common`.
Cuando se usa esta opción, el `package.json` de la biblioteca debe referirse al índice del módulo plano creado en lugar del archivo índice de la biblioteca.

Produce solo un archivo `.metadata.json`, que contiene todos los metadatos necesarios para los símbolos exportados desde el índice de la biblioteca.
En los archivos `.ngfactory.js` creados, se usa el índice del módulo plano para importar símbolos. Símbolos que incluyen tanto la API pública del índice de la biblioteca como los símbolos internos ocultos.

De forma predeterminada, se asume que el archivo `.ts` proporcionado en el campo `files` es el índice de la biblioteca.
Si se especifica más de un archivo `.ts`, se usa `libraryIndex` para seleccionar el archivo a usar.
Si se proporciona más de un archivo `.ts` sin un `libraryIndex`, se produce un error.

Se crea un índice de módulo plano `.d.ts` y `.js` con el nombre de `flatModuleOutFile` dado en la misma ubicación que el archivo índice `.d.ts` de la biblioteca.

Por ejemplo, si una biblioteca usa el archivo `public_api.ts` como el índice de la biblioteca del módulo, el campo `files` del `tsconfig.json` sería `["public_api.ts"]`.
La opción `flatModuleOutFile` podría entonces establecerse, por ejemplo, en `"index.js"`, que produce los archivos `index.d.ts` e `index.metadata.json`.
El campo `module` del `package.json` de la biblioteca sería `"index.js"` y el campo `typings` sería `"index.d.ts"`.

### `fullTemplateTypeCheck`

Cuando es `true`, el valor recomendado, habilita la fase de validación de expresiones de enlace del compilador de plantillas. Esta fase usa TypeScript para verificar expresiones de enlace.
Para más información, consulta [Comprobación de tipos en plantillas](tools/cli/template-typecheck).

El valor predeterminado es `false`, pero cuando usas el comando de Angular CLI `ng new --strict`, se establece en `true` en la configuración del nuevo proyecto.

IMPORTANTE: La opción `fullTemplateTypeCheck` ha sido deprecada en Angular 13 a favor de la familia de opciones del compilador `strictTemplates`.

### `generateCodeForLibraries`

Cuando es `true`, crea archivos de fábrica \(`.ngfactory.js` y `.ngstyle.js`\) para los archivos `.d.ts` con un archivo `.metadata.json` correspondiente. El valor predeterminado es `true`.

Cuando es `false`, los archivos de fábrica solo se crean para los archivos `.ts`.
Haz esto cuando uses resúmenes de fábrica.

### `preserveWhitespaces`

Cuando es `false`, el valor predeterminado, elimina nodos de texto en blanco de las plantillas compiladas, lo que da como resultado módulos de fábrica de plantillas emitidos más pequeños.
Establece en `true` para preservar los nodos de texto en blanco.

ÚTIL: Cuando usas la hidratación, se recomienda que uses `preserveWhitespaces: false`, que es el valor predeterminado. Si eliges habilitar la preservación de espacios en blanco agregando `preserveWhitespaces: true` a tu tsconfig, es posible que encuentres problemas con la hidratación. Esta no es todavía una configuración completamente compatible. Asegúrate de que esto también esté configurado de manera coherente entre los archivos tsconfig del servidor y del cliente. Para más detalles, consulta la [guía de hidratación](guide/hydration#preserve-whitespaces).

### `skipMetadataEmit`

Cuando es `true`, no produce archivos `.metadata.json`.
El valor predeterminado es `false`.

Los archivos `.metadata.json` contienen información requerida por el compilador de plantillas a partir de un archivo `.ts` que no se incluye en el archivo `.d.ts` producido por el compilador de TypeScript.
Esta información incluye, por ejemplo, el contenido de anotaciones, como la plantilla de un componente, que TypeScript emite al archivo `.js` pero no al archivo `.d.ts`.

Puedes establecerlo en `true` cuando uses resúmenes de fábrica, porque los resúmenes de fábrica incluyen una copia de la información que está en el archivo `.metadata.json`.

Establécelo en `true` si estás usando la opción `--outFile` de TypeScript, porque los archivos de metadatos no son válidos para este estilo de salida de TypeScript.
La comunidad de Angular no recomienda usar `--outFile` con Angular.
En su lugar, usa un bundler, como [webpack](https://webpack.js.org).

### `skipTemplateCodegen`

Cuando es `true`, no emite los archivos `.ngfactory.js` y `.ngstyle.js`.
Esto desactiva gran parte del compilador de plantillas y deshabilita la notificación de diagnósticos de las plantillas.

Se puede usar para indicar al compilador de plantillas que produzca los archivos `.metadata.json` para distribución con un paquete `npm`. Esto evita la producción de archivos `.ngfactory.js` y `.ngstyle.js` que no se pueden distribuir a `npm`.

Para proyectos de bibliotecas creados con el Angular CLI, el valor predeterminado de configuración de desarrollo es `true`.

### `strictMetadataEmit`

Cuando es `true`, reporta un error al archivo `.metadata.json` si `"skipMetadataEmit"` es `false`.
El valor predeterminado es `false`.
Solo se usa cuando `"skipMetadataEmit"` es `false` y `"skipTemplateCodegen"` es `true`.

Esta opción está diseñada para verificar los archivos `.metadata.json` emitidos para el empaquetado (bundling) con un paquete `npm`.
La validación es estricta y puede emitir errores para los metadatos que nunca producirían un error al ser usados por el compilador de plantillas.
Puedes elegir suprimir el error emitido por esta opción para un símbolo exportado al incluir `@dynamic` en el comentario que documenta el símbolo.

Es válido que los archivos `.metadata.json` contengan errores.
El compilador de plantillas reporta estos errores si los metadatos se usan para determinar el contenido de una anotación.
El recopilador de metadatos no puede predecir los símbolos que están diseñados para su uso en una anotación. Evita proactivamente la inclusión de nodos de error en los metadatos para los símbolos exportados.
El compilador de plantillas luego puede usar los nodos de error para alertar si se usan estos símbolos.

Si el cliente de una biblioteca tiene la intención de usar un símbolo en una anotación, el compilador de plantillas normalmente no reporta esto. Se reporta después de que el cliente realmente usa el símbolo.
Esta opción permite la detección de estos errores durante la fase de compilación de la biblioteca y se usa, por ejemplo, para producir bibliotecas de Angular mismas.

Para proyectos de bibliotecas creados con el Angular CLI, el valor predeterminado de configuración de desarrollo es `true`.

### `strictInjectionParameters`

Cuando es `true`, reporta un error para un parámetro provisto cuyo tipo de inyección no se puede determinar.
Cuando es `false`, los parámetros del constructor de las clases marcadas con `@Injectable` cuyo tipo no se puede resolver producen una advertencia.
El valor recomendado es `true`, pero el valor predeterminado es `false`.

Cuando usas el comando de Angular CLI `ng new --strict`, se establece en `true` en la configuración del proyecto creado.

### `strictTemplates`

Cuando es `true`, habilita la [comprobación estricta de tipos de plantilla](tools/cli/template-typecheck#strict-mode).

Las banderas de rigurosidad que esta opción habilita te permiten activar y desactivar tipos específicos de comprobaciones de tipos de plantilla estrictas.
Consulta [Solución de problemas en plantillas](tools/cli/template-typecheck#troubleshooting-template-errors).

Cuando usas el comando de Angular CLI `ng new --strict`, se establece en `true` en la configuración del nuevo proyecto.

### `strictStandalone`

Cuando es `true`, reporta un error si un componente, directiva o pipe no es standalone.

### `trace`

Cuando es `true`, imprime información de registro adicional al compilar las plantillas.
El valor predeterminado es `false`.

## Opciones de la línea de comandos

La mayoría de las veces, interactúas con el compilador de Angular indirectamente usando el [Angular CLI](reference/configs/angular-compiler-options). Sin embargo, bajo algunas circunstancias cuando depuras ciertos problemas, podrías encontrar útil invocar al compilador de Angular directamente.
Puedes usar el comando `ngc` proporcionado por el paquete npm `@angular/compiler-cli` para llamar al compilador desde la línea de comandos.

El comando `ngc` es una envoltura del comando compilador de TypeScript `tsc`. El compilador de Angular se configura principalmente a través de `tsconfig.json` mientras que el Angular CLI se configura principalmente a través de `angular.json`.

Además del archivo de configuración, también puedes usar las [opciones de línea de comandos de `tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) para configurar `ngc`.

[GuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n/prepare#mark-text-in-component-template "Marcar texto en la plantilla de un componente - Preparar componente para la traducción | Angular"
