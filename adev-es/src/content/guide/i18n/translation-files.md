# Trabajar con archivos de traducción

Después de preparar un componente para traducción, usa el comando [`extract-i18n`][CliExtractI18n] del [CLI de Angular][CliMain] para extraer el texto marcado en el componente a un archivo de *idioma fuente*.

El texto marcado incluye texto marcado con `i18n`, atributos marcados con `i18n-`*atributo*, y texto etiquetado con `$localize` como se describe en [Preparar un componente para traducción][GuideI18nCommonPrepare].

Completa los siguientes pasos para crear y actualizar archivos de traducción para tu proyecto.

1. [Extrae el archivo de idioma fuente][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
    1. Opcionalmente, cambia la ubicación, el formato y el nombre.
1. Copia el archivo de idioma fuente para [crear un archivo de traducción para cada idioma][GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage].
1. [Traduce cada archivo de traducción][GuideI18nCommonTranslationFilesTranslateEachTranslationFile].
1. Traduce por separado los plurales y las expresiones alternativas.
    1. [Traduce los plurales][GuideI18nCommonTranslationFilesTranslatePlurals].
    1. [Traduce las expresiones alternativas][GuideI18nCommonTranslationFilesTranslateAlternateExpressions].
    1. [Traduce las expresiones anidadas][GuideI18nCommonTranslationFilesTranslateNestedExpressions].

## Extraer el archivo de idioma fuente

Para extraer el archivo de idioma fuente, completa las siguientes acciones.

1. Abre una ventana de terminal.
1. Cambia al directorio raíz de tu proyecto.
1. Ejecuta el siguiente comando del CLI.

    <docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-default"/>

El comando `extract-i18n` crea un archivo de idioma fuente llamado `messages.xlf` en el directorio raíz de tu proyecto.
Para más información sobre el Formato de Intercambio de Localización XML \(XLIFF, versión 1.2\), consulta [XLIFF][WikipediaWikiXliff].

Usa las siguientes opciones del comando [`extract-i18n`][CliExtractI18n] para cambiar la ubicación, el formato y el nombre del archivo de idioma fuente.

| Opción de comando  | Detalles |
|:---             |:---     |
| `--format`      | Establece el formato del archivo de salida    |
| `--out-file`    | Establece el nombre del archivo de salida     |
| `--output-path` | Establece la ruta del directorio de salida    |

### Cambiar la ubicación del archivo de idioma fuente

Para crear un archivo en el directorio `src/locale`, especifica la ruta de salida como una opción.

#### Ejemplo de `extract-i18n --output-path`

El siguiente ejemplo especifica la ruta de salida como una opción.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-output-path"/>

### Cambiar el formato del archivo de idioma fuente

El comando `extract-i18n` crea archivos en los siguientes formatos de traducción.

| Formato de traducción | Detalles                                                                                                      | Extensión de archivo |
|:---                |:---                                                                                                              |:---            |
| ARB                | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]           | `.arb`            |
| JSON               | [JavaScript Object Notation][JsonMain]                                                                           | `.json`           |
| XLIFF 1.2          | [XML Localization Interchange File Format, version 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml]                | `.xlf`            |
| XLIFF 2            | [XML Localization Interchange File Format, version 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf`            |
| XMB                | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]                                 | `.xmb` \(`.xtb`\) |

Especifica el formato de traducción explícitamente con la opción de comando `--format`.

ÚTIL: El formato XMB genera archivos de idioma fuente `.xmb`, pero usa archivos de traducción `.xtb`.

#### Ejemplo de `extract-i18n --format`

El siguiente ejemplo demuestra varios formatos de traducción.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-formats"/>

### Cambiar el nombre del archivo de idioma fuente

Para cambiar el nombre del archivo de idioma fuente generado por la herramienta de extracción, usa la opción de comando `--out-file`.

#### Ejemplo de `extract-i18n --out-file`

El siguiente ejemplo demuestra cómo nombrar el archivo de salida.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-out-file"/>

## Crear un archivo de traducción para cada idioma

Para crear un archivo de traducción para una configuración regional o idioma, completa las siguientes acciones.

1. [Extrae el archivo de idioma fuente][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
1. Haz una copia del archivo de idioma fuente para crear un archivo de *traducción* para cada idioma.
1. Cambia el nombre del archivo de *traducción* para agregar la configuración regional.

    <docs-code language="file">

    messages.xlf --> messages.{locale}.xlf

    </docs-code>

1. Crea un nuevo directorio en la raíz de tu proyecto llamado `locale`.

    <docs-code language="file">

    src/locale

    </docs-code>

1. Mueve el archivo de *traducción* al nuevo directorio.
1. Envía el archivo de *traducción* a tu traductor.
1. Repite los pasos anteriores para cada idioma que quieras agregar a tu aplicación.

### Ejemplo de `extract-i18n` para francés

Por ejemplo, para crear un archivo de traducción al francés, completa las siguientes acciones.

1. Ejecuta el comando `extract-i18n`.
1. Haz una copia del archivo de idioma fuente `messages.xlf`.
1. Cambia el nombre de la copia a `messages.fr.xlf` para la traducción al francés \(`fr`\).
1. Mueve el archivo de traducción `fr` al directorio `src/locale`.
1. Envía el archivo de traducción `fr` al traductor.

## Traducir cada archivo de traducción

A menos que seas fluido en el idioma y tengas tiempo para editar traducciones, probablemente completarás los siguientes pasos.

1. Envía cada archivo de traducción a un traductor.
1. El traductor usa un editor de archivos XLIFF para completar las siguientes acciones.
    1. Crear la traducción.
    1. Editar la traducción.

### Ejemplo del proceso de traducción para francés

Para demostrar el proceso, revisa el archivo `messages.fr.xlf` en la [Aplicación de ejemplo de internacionalización de Angular][GuideI18nExample].  La [Aplicación de ejemplo de internacionalización de Angular][GuideI18nExample] incluye una traducción al francés para que la edites sin un editor XLIFF especial ni conocimiento de francés.

Las siguientes acciones describen el proceso de traducción para francés.

1. Abre `messages.fr.xlf` y encuentra el primer elemento `<trans-unit>`.
    Esta es una *unidad de traducción*, también conocida como *nodo de texto*, que representa la traducción de la etiqueta de saludo `<h1>` que fue previamente marcada con el atributo `i18n`.

    <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello-before"/>

    El `id="introductionHeader"` es un [ID personalizado][GuideI18nOptionalManageMarkedText], pero sin el prefijo `@@` requerido en el HTML fuente.

1. Duplica el elemento `<source>... </source>` en el nodo de texto, cámbiale el nombre a `target` y luego reemplaza el contenido con el texto en francés.

    <docs-code header="src/locale/messages.fr.xlf (<trans-unit>, after translation)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello"/>

    En una traducción más compleja, la información y el contexto en los [elementos de descripción y significado][GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] te ayudan a elegir las palabras correctas para la traducción.

1. Traduce los otros nodos de texto.
    El siguiente ejemplo muestra la forma de traducir.

    <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-other-nodes"/>

IMPORTANTE: No cambies los IDs de las unidades de traducción.
Cada atributo `id` es generado por Angular y depende del contenido del texto del componente y del significado asignado.

Si cambias el texto o el significado, entonces el atributo `id` cambia.
Para más información sobre cómo gestionar actualizaciones de texto e IDs, consulta [IDs personalizados][GuideI18nOptionalManageMarkedText].

## Traducir plurales

Agrega o elimina casos de plural según sea necesario para cada idioma.

ÚTIL: Para reglas de plural por idioma, consulta [Reglas de plural de CLDR][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml].

### Ejemplo de `minute` `plural`

Para traducir un `plural`, traduce los valores de coincidencia del formato ICU.

* `just now`
* `one minute ago`
* `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

El siguiente ejemplo muestra la forma de traducir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-plural"/>

## Traducir expresiones alternativas

Angular también extrae expresiones ICU `select` alternativas como unidades de traducción separadas.

### Ejemplo de `gender` `select`

El siguiente ejemplo muestra una expresión ICU `select` en la plantilla del componente.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

En este ejemplo, Angular extrae la expresión en dos unidades de traducción.
La primera contiene el texto fuera de la cláusula `select` y usa un marcador de posición para `select` \(`<x id="ICU">`\):

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-1"/>

IMPORTANTE: Cuando traduzcas el texto, mueve el marcador de posición si es necesario, pero no lo elimines.
Si eliminas el marcador de posición, la expresión ICU se elimina de tu aplicación traducida.

El siguiente ejemplo muestra la segunda unidad de traducción que contiene la cláusula `select`.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-2"/>

El siguiente ejemplo muestra ambas unidades de traducción después de completar la traducción.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-select"/>

## Traducir expresiones anidadas

Angular trata una expresión anidada de la misma manera que una expresión alternativa.
Angular extrae la expresión en dos unidades de traducción.

### Ejemplo de `plural` anidado

El siguiente ejemplo muestra la primera unidad de traducción que contiene el texto fuera de la expresión anidada.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-1"/>

El siguiente ejemplo muestra la segunda unidad de traducción que contiene la expresión anidada completa.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-2"/>

El siguiente ejemplo muestra ambas unidades de traducción después de traducir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested"/>

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/i18n/merge" title="Fusionar traducciones en la aplicación"/>
</docs-pill-row>

[CliMain]: cli "CLI Overview and Command Reference | Angular"
[CliExtractI18n]: cli/extract-i18n "ng extract-i18n | CLI | Angular"

[GuideI18nCommonPrepare]: guide/i18n/prepare "Prepare component for translation | Angular"
[GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n/prepare#add-helpful-descriptions-and-meanings "Add helpful descriptions and meanings - Prepare component for translation | Angular"

[GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n/translation-files#create-a-translation-file-for-each-language "Create a translation file for each language - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n/translation-files#extract-the-source-language-file "Extract the source language file - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n/translation-files#translate-alternate-expressions "Translate alternate expressions - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n/translation-files#translate-each-translation-file "Translate each translation file - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n/translation-files#translate-nested-expressions "Translate nested expressions - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n/translation-files#translate-plurals "Translate plurals - Work with translation files | Angular"

[GuideI18nExample]: guide/i18n/example "Example Angular Internationalization application | Angular"

[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text "Manage marked text with custom IDs | Angular"

[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification "ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub"

[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://cldr.unicode.org/index/cldr-spec/plural-rules "Language Plural Rules - CLDR Charts | Unicode | GitHub"

[JsonMain]: https://www.json.org "Introducing JSON | JSON"

[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html "XLIFF Version 1.2 Specification | Oasis Open Docs"
[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html "XLIFF Version 2.0 | Oasis Open Docs"

[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb "XMB | CLDR - Unicode Common Locale Data Repository | Unicode"

[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF "XLIFF | Wikipedia"
