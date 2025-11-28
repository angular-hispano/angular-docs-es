# Formatear datos según la configuración regional

Angular proporciona los siguientes [pipes](guide/templates/pipes) integrados de transformación de datos.
Los pipes de transformación de datos usan el token [`LOCALE_ID`][ApiCoreLocaleId] para formatear datos basándose en las reglas de cada configuración regional.

| Pipe de transformación de datos         | Detalles                                              |
|:--------------------------------------- |:----------------------------------------------------- |
| [`DatePipe`][ApiCommonDatepipe]         | Formatea un valor de fecha.                           |
| [`CurrencyPipe`][ApiCommonCurrencypipe] | Transforma un número en una cadena de moneda.         |
| [`DecimalPipe`][ApiCommonDecimalpipe]   | Transforma un número en una cadena de número decimal. |
| [`PercentPipe`][ApiCommonPercentpipe]   | Transforma un número en una cadena de porcentaje.     |

## Usar DatePipe para mostrar la fecha actual

Para mostrar la fecha actual en el formato de la configuración regional actual, usa el siguiente formato para el `DatePipe`.

<!--todo: replace with docs-code -->

<docs-code language="typescript">

{{ today | date }}

</docs-code>

## Sobrescribir la configuración regional actual para CurrencyPipe

Agrega el parámetro `locale` al pipe para sobrescribir el valor actual del token `LOCALE_ID`.

Para forzar que la moneda use inglés americano \(`en-US`\), usa el siguiente formato para el `CurrencyPipe`

<!--todo: replace with docs-code -->

<docs-code language="typescript">

{{ amount | currency : 'en-US' }}

</docs-code>

ÚTIL: La configuración regional especificada para el `CurrencyPipe` sobrescribe el token `LOCALE_ID` global de tu aplicación.

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/i18n/prepare" title="Preparar un componente para traducción"/>
</docs-pill-row>

[ApiCommonCurrencypipe]: api/common/CurrencyPipe "CurrencyPipe | Common - API | Angular"
[ApiCommonDatepipe]: api/common/DatePipe "DatePipe | Common - API | Angular"
[ApiCommonDecimalpipe]: api/common/DecimalPipe "DecimalPipe | Common - API | Angular"
[ApiCommonPercentpipe]: api/common/PercentPipe "PercentPipe | Common - API | Angular"
[ApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"
