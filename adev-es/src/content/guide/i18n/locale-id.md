# Referirse a configuraciones regionales por ID

Angular usa el *identificador de configuración regional* Unicode \(Unicode locale ID\) para encontrar los datos de configuración regional correctos para la internacionalización de cadenas de texto.

<docs-callout title="ID de configuración regional Unicode">

* Un ID de configuración regional se ajusta a la [especificación central del Unicode Common Locale Data Repository (CLDR)][UnicodeCldrDevelopmentCoreSpecification].
    Para más información sobre los IDs de configuración regional, consulta [Identificadores de Idioma y Configuración Regional Unicode][UnicodeCldrDevelopmentCoreSpecificationLocaleIDs].

* CLDR y Angular usan [etiquetas BCP 47][RfcEditorInfoBcp47] como base para el ID de configuración regional

</docs-callout>

Un ID de configuración regional especifica el idioma, país y un código opcional para variantes o subdivisiones adicionales.
Un ID de configuración regional consiste en el identificador de idioma, un carácter guión \(`-`\) y la extensión de configuración regional.

<docs-code language="html">
{language_id}-{locale_extension}
</docs-code>

ÚTIL: Para traducir con precisión tu proyecto Angular, debes decidir qué idiomas y configuraciones regionales vas a usar para la internacionalización.

Muchos países comparten el mismo idioma, pero difieren en el uso.
Las diferencias incluyen gramática, puntuación, formatos de moneda, números decimales, fechas, etc.

Para los ejemplos en esta guía, usa los siguientes idiomas y configuraciones regionales.

| Idioma   | Configuración regional   | ID de configuración regional Unicode |
|:---      |:---                      |:---               |
| Inglés   | Canadá                   | `en-CA`           |
| Inglés   | Estados Unidos de América| `en-US`           |
| Francés  | Canadá                   | `fr-CA`           |
| Francés  | Francia                  | `fr-FR`           |

El [repositorio de Angular][GithubAngularAngularTreeMasterPackagesCommonLocales] incluye configuraciones regionales comunes.

<docs-callout>
Para una lista de códigos de idioma, consulta [ISO 639-2](https://www.loc.gov/standards/iso639-2).
</docs-callout>

## Establecer el ID de configuración regional de origen

Usa el CLI de Angular para establecer el idioma de origen en el que estás escribiendo en la plantilla del componente y el código.

Por defecto, Angular usa `en-US` como la configuración regional de origen de tu proyecto.

Para cambiar la configuración regional de origen de tu proyecto para la compilación, completa las siguientes acciones.

1. Abre el archivo de configuración de compilación del espacio de trabajo [`angular.json`][GuideWorkspaceConfig].
2. Agrega o modifica el campo `sourceLocale` dentro de la sección `i18n`:
```json
{
  "projects": {
    "your-project": {
      "i18n": {
        "sourceLocale": "ca"  // Usa el código de configuración regional deseado
      }
    }
  }
}
```

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/i18n/format-data-locale" title="Formatear datos según la configuración regional"/>
</docs-pill-row>

[GuideWorkspaceConfig]: reference/configs/workspace-config "Angular workspace configuration | Angular"

[GithubAngularAngularTreeMasterPackagesCommonLocales]: <https://github.com/angular/angular/tree/main/packages/common/locales> "angular/packages/common/locales | angular/angular | GitHub"

[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 "BCP 47 | RFC Editor"

[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/index/cldr-spec "Core Specification | Unicode CLDR Project"

[UnicodeCldrDevelopmentCoreSpecificationLocaleID]: https://cldr.unicode.org/index/cldr-spec/picking-the-right-language-code "Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project"
