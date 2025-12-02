# Fusionar traducciones en la aplicación

Para fusionar las traducciones completas en tu proyecto, realiza las siguientes acciones

1. Usa el [CLI de Angular][CliMain] para compilar una copia de los archivos distribuibles de tu proyecto
1. Usa la opción `"localize"` para reemplazar todos los mensajes i18n con las traducciones válidas y compilar una variante localizada de la aplicación.
   Una aplicación variante es una copia completa de los archivos distribuibles de tu aplicación traducida para una sola configuración regional.

Después de fusionar las traducciones, sirve cada copia distribuible de la aplicación usando detección de idioma del lado del servidor o subdirectorios diferentes.

ÚTIL: Para más información sobre cómo servir cada copia distribuible de la aplicación, consulta [desplegar múltiples configuraciones regionales](guide/i18n/deploy).

Para una traducción en tiempo de compilación de la aplicación, el proceso de compilación usa compilación por adelantado (AOT) para producir una aplicación pequeña, rápida y lista para ejecutarse.

ÚTIL: Para una explicación detallada del proceso de compilación, consulta [Compilar y servir aplicaciones Angular][GuideBuild].
El proceso de compilación funciona con archivos de traducción en formato `.xlf` o en otro formato que Angular entienda, como `.xtb`.
Para más información sobre formatos de archivos de traducción usados por Angular, consulta [Cambiar el formato del archivo del idioma fuente][GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]

Para compilar una copia distribuible separada de la aplicación para cada configuración regional, [define las configuraciones regionales en la configuración de compilación][GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration] en el archivo [`angular.json`][GuideWorkspaceConfig] de configuración de compilación del espacio de trabajo de tu proyecto.

Este método acorta el proceso de compilación al eliminar el requisito de realizar una compilación completa de la aplicación para cada configuración regional.

Para [generar variantes de la aplicación para cada configuración regional][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale], usa la opción `"localize"` en el archivo [`angular.json`][GuideWorkspaceConfig] de configuración de compilación.
Además, para [compilar desde la línea de comandos][GuideI18nCommonMergeBuildFromTheCommandLine], usa el comando [`build`][CliBuild] del [CLI de Angular][CliMain] con la opción `--localize`.

ÚTIL: Opcionalmente, [aplica opciones de compilación específicas para solo una configuración regional][GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale] para una configuración personalizada.

## Definir configuraciones regionales en la configuración de compilación

Usa la opción de proyecto `i18n` en el archivo [`angular.json`][GuideWorkspaceConfig] de configuración de compilación del espacio de trabajo de tu proyecto para definir configuraciones regionales para un proyecto.

Las siguientes subopciones identifican el idioma fuente e indican al compilador dónde encontrar traducciones compatibles para el proyecto.

| Subopción      | Detalles                                                                                            |
|:-------------- |:--------------------------------------------------------------------------------------------------- |
| `sourceLocale` | La configuración regional que usas dentro del código fuente de la aplicación \(`en-US` por defecto\) |
| `locales`      | Un mapa de identificadores de configuración regional a archivos de traducción                         |

### Ejemplo de `angular.json` para `en-US` y `fr`

Por ejemplo, el siguiente extracto de un archivo [`angular.json`][GuideWorkspaceConfig] de configuración de compilación del espacio de trabajo establece la configuración regional de origen en `en-US` y proporciona la ruta al archivo de traducción de la configuración regional francesa \(`fr`\).

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="locale-config"/>

## Generar variantes de la aplicación para cada configuración regional

Para usar tu definición de configuraciones regionales en la configuración de compilación, usa la opción `"localize"` en el archivo [`angular.json`][GuideWorkspaceConfig] para indicar al CLI qué configuraciones regionales generar para la compilación.

- Establece `"localize"` en `true` para todas las configuraciones regionales definidas previamente en la configuración de compilación.
- Establece `"localize"` en un array con un subconjunto de los identificadores de configuración regional definidos previamente para compilar solo esas versiones.
- Establece `"localize"` en `false` para deshabilitar la localización y no generar versiones específicas por configuración regional.

ÚTIL: Se requiere compilación por adelantado (AOT) para localizar las plantillas de componentes.

Si cambiaste esta configuración, establece `"aot"` en `true` para usar AOT.

ÚTIL: Debido a las complejidades de despliegue de i18n y la necesidad de minimizar el tiempo de reconstrucción, el servidor de desarrollo solo admite localizar una sola configuración regional a la vez.
Si configuras la opción `"localize"` en `true`, defines más de una configuración regional y usas `ng serve`, se producirá un error.
Si deseas desarrollar con una configuración regional específica, establece la opción `"localize"` a una configuración regional específica.
Por ejemplo, para francés \(`fr`\), especifica `"localize": ["fr"]`.

El CLI carga y registra los datos de configuración regional, coloca cada versión generada en un directorio específico de configuración regional para mantenerla separada de otras versiones y ubica los directorios dentro del `outputPath` configurado para el proyecto.
Para cada variante de aplicación, el atributo `lang` del elemento `html` se establece en la configuración regional.
El CLI también ajusta el HREF base de HTML para cada versión de la aplicación agregando la configuración regional al `baseHref` configurado.

Establece la propiedad `"localize"` como una configuración compartida para heredarla efectivamente en todas las configuraciones.
Además, establece la propiedad para anular otras configuraciones.

### Ejemplo de `angular.json` que incluye todas las configuraciones regionales de la compilación

El siguiente ejemplo muestra la opción `"localize"` establecida en `true` en el archivo [`angular.json`][GuideWorkspaceConfig] de configuración de compilación del espacio de trabajo, de modo que se compilen todas las configuraciones regionales definidas en la configuración de compilación.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-localize-true"/>

## Compilar desde la línea de comandos

Además, usa la opción `--localize` con el comando [`ng build`][CliBuild] y tu configuración `production` existente.
El CLI compila todas las configuraciones regionales definidas en la configuración de compilación.
Si estableces las configuraciones regionales en la configuración de compilación, es similar a cuando estableces la opción `"localize"` en `true`.

ÚTIL: Para más información sobre cómo establecer las configuraciones regionales, consulta [Generar variantes de la aplicación para cada configuración regional][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale].

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="build-localize"/>

## Aplicar opciones específicas de compilación para solo una configuración regional

Para aplicar opciones específicas de compilación a solo una configuración regional, especifica una sola configuración regional para crear una configuración personalizada específica.

IMPORTANTE: Usa el servidor de desarrollo del [CLI de Angular][CliMain] \(`ng serve`\) con una sola configuración regional.

### Ejemplo de compilación para francés

El siguiente ejemplo muestra una configuración personalizada específica para una sola configuración regional.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-single-locale"/>

Pasa esta configuración a los comandos `ng serve` o `ng build`.
El siguiente ejemplo de código muestra cómo servir el archivo de idioma francés.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="serve-french"/>

Para compilaciones de producción, usa composición de configuraciones para ejecutar ambas configuraciones.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="build-production-french"/>

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-production-french" />

## Reportar traducciones faltantes

Cuando falta una traducción, la compilación tiene éxito pero genera una advertencia como `Missing translation for message "{translation_text}"`.
Para configurar el nivel de advertencia que genera el compilador de Angular, especifica uno de los siguientes niveles.

| Nivel de advertencia | Detalles                                                    | Salida                                                 |
|:-------------------- |:----------------------------------------------------------- |:------------------------------------------------------ |
| `error`              | Lanza un error y la compilación falla                       | n/a                                                    |
| `ignore`             | No hace nada                                                | n/a                                                    |
| `warning`            | Muestra la advertencia predeterminada en la consola o shell | `Missing translation for message "{translation_text}"` |

Especifica el nivel de advertencia en la sección `options` para el objetivo `build` de tu archivo [`angular.json`][GuideWorkspaceConfig] de configuración de compilación del espacio de trabajo.

### Ejemplo de advertencia `error` en `angular.json`

El siguiente ejemplo muestra cómo establecer el nivel de advertencia en `error`.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="missing-translation-error" />

ÚTIL: Cuando compilas tu proyecto Angular en una aplicación Angular, las instancias del atributo `i18n` se reemplazan con instancias de la cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize].
Esto significa que tu aplicación Angular se traduce después de la compilación.
Esto también significa que puedes crear versiones localizadas de tu aplicación Angular sin recompilar todo tu proyecto Angular para cada configuración regional.

Cuando traduces tu aplicación Angular, la *transformación de traducción* reemplaza y reordena las partes \(cadenas estáticas y expresiones\) de la cadena literal de plantilla con cadenas de una colección de traducciones.
Para más información, consulta [`$localize`][ApiLocalizeInitLocalize].

TL;DR: Compila una vez, luego traduce para cada configuración regional.

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/i18n/deploy" title="Desplegar múltiples configuraciones regionales"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideBuild]: tools/cli/build 'Building and serving Angular apps | Angular'
[GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n/merge#apply-specific-build-options-for-just-one-locale 'Apply specific build options for just one locale - Merge translations into the application | Angular'
[GuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n/merge#build-from-the-command-line 'Build from the command line - Merge translations into the application | Angular'
[GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n/merge#define-locales-in-the-build-configuration 'Define locales in the build configuration - Merge translations into the application | Angular'
[GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]: guide/i18n/merge#generate-application-variants-for-each-locale 'Generate application variants for each locale - Merge translations into the application | Angular'
[GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]: guide/i18n/translation-files#change-the-source-language-file-format 'Change the source language file format - Work with translation files | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
