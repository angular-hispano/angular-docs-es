# Preparar un componente para traducción

Para preparar tu proyecto para traducción, completa las siguientes acciones.

- Usa el atributo `i18n` para marcar texto en plantillas de componentes
- Usa el atributo `i18n-` para marcar cadenas de texto de atributos en plantillas de componentes
- Usa la cadena de mensaje etiquetada `$localize` para marcar cadenas de texto en código de componentes

## Marcar texto en la plantilla del componente

En una plantilla de componente, los metadatos i18n son el valor del atributo `i18n`.

<docs-code language="html">
<element i18n="{i18n_metadata}">{string_to_translate}</element>
</docs-code>

Usa el atributo `i18n` para marcar un mensaje de texto estático en tus plantillas de componentes para traducción.
Colócalo en cada etiqueta de elemento que contenga texto fijo que quieras traducir.

ÚTIL: El atributo `i18n` es un atributo personalizado que las herramientas y compiladores de Angular reconocen.

### Ejemplo de `i18n`

La siguiente etiqueta `<h1>` muestra un saludo simple en inglés, "Hello i18n!".

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="greeting"/>

Para marcar el saludo para traducción, agrega el atributo `i18n` a la etiqueta `<h1>`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute"/>


### Usando la declaración condicional con `i18n`

La siguiente etiqueta `<div>` mostrará texto traducido como parte de `div` y `aria-label` según el estado del interruptor (toggle).

<docs-code-multifile>
    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html"  visibleRegion="i18n-conditional"/>
    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/i18n/src/app/app.component.ts" visibleLines="[[14,21],[33,37]]"/>
</docs-code-multifile>

### Traducir texto en línea sin un elemento HTML

Usa el elemento `<ng-container>` para asociar un comportamiento de traducción para texto específico sin cambiar la forma en que se muestra el texto.

ÚTIL: Cada elemento HTML crea un nuevo elemento DOM.
Para evitar crear un nuevo elemento DOM, envuelve el texto en un elemento `<ng-container>`.
El siguiente ejemplo muestra el elemento `<ng-container>` transformado en un comentario HTML no visible.

<docs-code path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-ng-container"/>

## Marcar atributos de elementos para traducción

En una plantilla de componente, los metadatos i18n son el valor del atributo `i18n-{attribute_name}`.

<docs-code language="html">
<element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" />
</docs-code>

Los atributos de elementos HTML incluyen texto que debe traducirse junto con el resto del texto mostrado en la plantilla del componente.

Usa `i18n-{attribute_name}` con cualquier atributo de cualquier elemento y reemplaza `{attribute_name}` con el nombre del atributo.
Usa la siguiente sintaxis para asignar un significado, descripción e ID personalizado.

<!--todo: replace with docs-code -->

<docs-code language="html">
i18n-{attribute_name}="{meaning}|{description}@@{id}"
</docs-code>

### Ejemplo de `i18n-title`

Para traducir el título de una imagen, revisa este ejemplo.
El siguiente ejemplo muestra una imagen con un atributo `title`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-title"/>

Para marcar el atributo title para traducción, completa la siguiente acción.

1. Agrega el atributo `i18n-title`

   El siguiente ejemplo muestra cómo marcar el atributo `title` en la etiqueta `img` agregando `i18n-title`.

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-title-translate"/>

## Marcar texto en el código del componente

En el código del componente, el texto fuente de traducción y los metadatos están rodeados por caracteres de acento grave \(<code>&#96;</code>\).

Usa la cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize] para marcar una cadena en tu código para traducción.

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`string_to_translate`;
</docs-code>

Los metadatos i18n están rodeados por caracteres de dos puntos \(`:`\) y preceden al texto fuente de traducción.

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`:{i18n_metadata}:string_to_translate`
</docs-code>

### Incluir texto interpolado

Incluye [interpolaciones](guide/templates/binding#render-dynamic-text-with-text-interpolation) en una cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize].

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`string_to_translate ${variable_name}`;
</docs-code>

### Nombrar el marcador de posición (placeholder) de la interpolación

<docs-code language="typescript">
$localize`string_to_translate ${variable_name}:placeholder_name:`;
</docs-code>

### Sintaxis condicional para traducciones

<docs-code language="typescript">
return this.show ? $localize`Show Tabs` : $localize`Hide tabs`;
</docs-code>



## Metadatos i18n para traducción

<!--todo: replace with docs-code -->

<docs-code language="html">
{meaning}|{description}@@{custom_id}
</docs-code>

Los siguientes parámetros proporcionan contexto e información adicional para reducir la confusión de tu traductor.

| Parámetro de metadatos | Detalles                                                                    |
| :----------------- | :------------------------------------------------------------------------------ |
| ID personalizado   | Proporciona un identificador personalizado                                      |
| Descripción        | Proporciona información adicional o contexto                                    |
| Significado        | Proporciona el significado o intención del texto dentro del contexto específico |

Para información adicional sobre IDs personalizados, consulta [Gestionar texto marcado con IDs personalizados][GuideI18nOptionalManageMarkedText].

### Agregar descripciones y significados útiles

Para traducir un mensaje de texto con precisión, proporciona información adicional o contexto para el traductor.

Agrega una _descripción_ del mensaje de texto como valor del atributo `i18n` o cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize].

El siguiente ejemplo muestra el valor del atributo `i18n`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-desc"/>

El siguiente ejemplo muestra el valor de la cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize] con una descripción.

<!--todo: replace with docs-code -->

<docs-code language="typescript">

$localize`:An introduction header for this sample:Hello i18n!`;

</docs-code>

El traductor también puede necesitar conocer el significado o intención del mensaje de texto dentro de este contexto particular de la aplicación, para traducirlo de la misma manera que otro texto con el mismo significado.
Comienza el valor del atributo `i18n` con el _significado_ y sepáralo de la _descripción_ con el carácter `|`: `{meaning}|{description}`.

#### Ejemplo de `h1`

Por ejemplo, puedes querer especificar que la etiqueta `<h1>` es un encabezado de sitio que necesitas traducir de la misma manera, ya sea que se use como encabezado o se haga referencia en otra sección del texto.

El siguiente ejemplo muestra cómo especificar que la etiqueta `<h1>` debe traducirse como un encabezado o referenciarse en otro lugar.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning"/>

El resultado es que cualquier texto marcado con `site header`, como _significado_, se traduce exactamente de la misma manera.

El siguiente ejemplo de código muestra el valor de la cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize] con un significado y una descripción.

<!--todo: replace with docs-code -->

<docs-code language="typescript">

$localize`:site header|An introduction header for this sample:Hello i18n!`;

</docs-code>

<docs-callout title="Cómo los significados controlan la extracción y fusión de texto">

La herramienta de extracción de Angular genera una entrada de unidad de traducción para cada atributo `i18n` en una plantilla.
La herramienta de extracción de Angular asigna a cada unidad de traducción un ID único basado en el _significado_ y la _descripción_.

ÚTIL: Para más información sobre la herramienta de extracción de Angular, consulta [Trabajar con archivos de traducción](guide/i18n/translation-files).

Los mismos elementos de texto con diferentes _significados_ se extraen con IDs diferentes.
Por ejemplo, si la palabra "right" usa las siguientes dos definiciones en dos ubicaciones diferentes, la palabra se traduce de manera diferente y se fusiona de nuevo en la aplicación como entradas de traducción diferentes.

- `correct` como en "you are right" (estás en lo correcto)
- `direction` como en "turn right" (gira a la derecha)

Si los mismos elementos de texto cumplen las siguientes condiciones, los elementos de texto se extraen solo una vez y usan el mismo ID.

- Mismo significado o definición
- Diferentes descripciones

Esa única entrada de traducción se fusiona de nuevo en la aplicación dondequiera que aparezcan los mismos elementos de texto.

</docs-callout>

## Expresiones ICU

Las expresiones ICU te ayudan a marcar texto alternativo en plantillas de componentes para cumplir condiciones.
Una expresión ICU incluye una propiedad del componente, una cláusula ICU y las declaraciones de caso rodeadas por caracteres de llave de apertura \(`{`\) y llave de cierre \(`}`\).

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, icu_clause, case_statements }

</docs-code>

La propiedad del componente define la variable.
Una cláusula ICU define el tipo de texto condicional.

| Cláusula ICU                                                           | Detalles                                                             |
| :------------------------------------------------------------------- | :------------------------------------------------------------------ |
| [`plural`][GuideI18nCommonPrepareMarkPlurals]                        | Marca el uso de números plurales                                      |
| [`select`][GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | Marca opciones para texto alternativo basado en tus valores de cadena definidos |

Para simplificar la traducción, usa cláusulas de Componentes Internacionales para Unicode \(cláusulas ICU\) con expresiones regulares.

ÚTIL: Las cláusulas ICU se adhieren al [Formato de Mensaje ICU][GithubUnicodeOrgIcuUserguideFormatParseMessages] especificado en las [reglas de pluralización CLDR][UnicodeCldrIndexCldrSpecPluralRules].

### Marcar plurales

Diferentes idiomas tienen diferentes reglas de pluralización que aumentan la dificultad de traducción.
Debido a que otras configuraciones regionales expresan la cardinalidad de manera diferente, puedes necesitar establecer categorías de pluralización que no se alineen con el inglés.
Usa la cláusula `plural` para marcar expresiones que pueden no ser significativas si se traducen palabra por palabra.

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, plural, pluralization_categories }

</docs-code>

Después de la categoría de pluralización, ingresa el texto predeterminado \(inglés\) rodeado por caracteres de llave de apertura \(`{`\) y llave de cierre \(`}`\).

<!--todo: replace with docs-code -->

<docs-code language="html">

pluralization_category { }

</docs-code>

Las siguientes categorías de pluralización están disponibles para inglés y pueden cambiar según la configuración regional.

| Categoría de pluralización | Detalles                    | Ejemplo                    |
| :--------------------- | :------------------------- | :------------------------- |
| `zero`                 | La cantidad es cero           | `=0 { }` <br /> `zero { }` |
| `one`                  | La cantidad es 1              | `=1 { }` <br /> `one { }`  |
| `two`                  | La cantidad es 2              | `=2 { }` <br /> `two { }`  |
| `few`                  | La cantidad es 2 o más      | `few { }`                  |
| `many`                 | La cantidad es un número grande | `many { }`                 |
| `other`                | La cantidad predeterminada       | `other { }`                |

Si ninguna de las categorías de pluralización coincide, Angular usa `other` para coincidir con la opción de respaldo estándar para una categoría faltante.

<!--todo: replace with docs-code -->

<docs-code language="html">

other { default_quantity }

</docs-code>

ÚTIL: Para más información sobre categorías de pluralización, consulta [Elegir nombres de categorías plurales][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames] en [CLDR - Repositorio Común de Datos de Configuración Regional Unicode][UnicodeCldrMain].

<docs-callout header='Contexto: Las configuraciones regionales pueden no soportar algunas categorías de pluralización'>

Muchas configuraciones regionales no soportan algunas de las categorías de pluralización.
La configuración regional predeterminada \(`en-US`\) usa una función `plural()` muy simple que no soporta la categoría de pluralización `few`.
Otra configuración regional con una función `plural()` simple es `es`.
El siguiente ejemplo de código muestra la función [`plural()` de en-US][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18].

<docs-code path="adev/src/content/examples/i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy/>

La función `plural()` solo retorna 1 \(`one`\) o 5 \(`other`\).
La categoría `few` nunca coincide.

</docs-callout>

#### Ejemplo de `minutes`

Si quieres mostrar la siguiente frase en inglés, donde `x` es un número.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated x minutes ago

</docs-code>

Y también quieres mostrar las siguientes frases según la cardinalidad de `x`.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated just now

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated one minute ago

</docs-code>

Usa marcado HTML e [interpolaciones](guide/templates/binding#render-dynamic-text-with-text-interpolation).
El siguiente ejemplo de código muestra cómo usar la cláusula `plural` para expresar las tres situaciones anteriores en un elemento `<span>`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-plural"/>

Revisa los siguientes detalles en el ejemplo de código anterior.

| Parámetros                        | Detalles                                                                                                               |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `minutes`                         | El primer parámetro especifica que la propiedad del componente es `minutes` y determina el número de minutos.               |
| `plural`                          | El segundo parámetro especifica que la cláusula ICU es `plural`.                                                            |
| `=0 {just now}`                   | Para cero minutos, la categoría de pluralización es `=0`. El valor es `just now`.                                        |
| `=1 {one minute}`                 | Para un minuto, la categoría de pluralización es `=1`. El valor es `one minute`.                                        |
| `other {{{minutes}} minutes ago}` | Para cualquier cardinalidad no coincidente, la categoría de pluralización predeterminada es `other`. El valor es `{{minutes}} minutes ago`. |

`{{minutes}}` es una [interpolación](guide/templates/binding#render-dynamic-text-with-text-interpolation).

### Marcar alternativas y expresiones anidadas

La cláusula `select` marca opciones para texto alternativo basado en tus valores de cadena definidos.

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, select, selection_categories }

</docs-code>

Traduce todas las alternativas para mostrar texto alternativo basado en el valor de una variable.

Después de la categoría de selección, ingresa el texto \(inglés\) rodeado por caracteres de llave de apertura \(`{`\) y llave de cierre \(`}`\).

<!--todo: replace with docs-code -->

<docs-code language="html">

selection_category { text }

</docs-code>

Diferentes configuraciones regionales tienen diferentes construcciones gramaticales que aumentan la dificultad de traducción.
Usa marcado HTML.
Si ninguna de las categorías de selección coincide, Angular usa `other` para coincidir con la opción de respaldo estándar para una categoría faltante.

<!--todo: replace with docs-code -->

<docs-code language="html">

other { default_value }

</docs-code>

#### Ejemplo de `gender`

Si quieres mostrar la siguiente frase en inglés.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is other

</docs-code>

Y también quieres mostrar las siguientes frases según la propiedad `gender` del componente.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is female

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is male

</docs-code>

El siguiente ejemplo de código muestra cómo vincular la propiedad `gender` del componente y usar la cláusula `select` para expresar las tres situaciones anteriores en un elemento `<span>`.

La propiedad `gender` vincula las salidas a cada uno de los siguientes valores de cadena.

| Valor  | Valor en inglés |
| :----- | :------------ |
| female | `female`      |
| male   | `male`        |
| other  | `other`       |

La cláusula `select` asigna los valores a las traducciones apropiadas.
El siguiente ejemplo de código muestra la propiedad `gender` usada con la cláusula select.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

#### Ejemplo de `gender` y `minutes`

Combina diferentes cláusulas juntas, como las cláusulas `plural` y `select`.
El siguiente ejemplo de código muestra cláusulas anidadas basadas en los ejemplos de `gender` y `minutes`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-nested"/>

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/i18n/translation-files" title="Trabajar con archivos de traducción"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API  | Angular'
[GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]: guide/i18n/prepare#mark-alternates-and-nested-expressions 'Mark alternates and nested expressions - Prepare templates for translation | Angular'
[GuideI18nCommonPrepareMarkPlurals]: guide/i18n/prepare#mark-plurals 'Mark plurals - Prepare component for translation | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text 'Manage marked text with custom IDs | Angular'
[GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18]: https://github.com/angular/angular/blob/ecffc3557fe1bff9718c01277498e877ca44588d/packages/core/src/i18n/locale_en.ts#L14-L18 'Line 14 to 18 - angular/packages/core/src/i18n/locale_en.ts | angular/angular | GitHub'
[GithubUnicodeOrgIcuUserguideFormatParseMessages]: https://unicode-org.github.io/icu/userguide/format_parse/messages 'ICU Message Format - ICU Documentation | Unicode | GitHub'
[UnicodeCldrMain]: https://cldr.unicode.org 'Unicode CLDR Project'
[UnicodeCldrIndexCldrSpecPluralRules]: http://cldr.unicode.org/index/cldr-spec/plural-rules 'Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names 'Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
