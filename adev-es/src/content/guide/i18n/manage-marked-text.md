# Gestionar texto marcado con IDs personalizados

El extractor de Angular genera un archivo con una entrada de unidad de traducción en cada uno de los siguientes casos.

* Cada atributo `i18n` en una plantilla de componente
* Cada cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize] en el código del componente

Como se describe en [Cómo los significados controlan la extracción y la fusión de texto][GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges], Angular asigna a cada unidad de traducción un ID único.

El siguiente ejemplo muestra unidades de traducción con IDs únicos.

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="generated-id"/>

Cuando cambias el texto traducible, el extractor genera un nuevo ID para esa unidad de traducción.
En la mayoría de los casos, los cambios en el texto fuente también requieren un cambio en la traducción.
Por lo tanto, usar un nuevo ID mantiene el cambio de texto sincronizado con las traducciones.

Sin embargo, algunos sistemas de traducción requieren una forma o sintaxis específica para el ID.
Para cumplir con este requisito, usa un ID personalizado para marcar texto.
La mayoría de los desarrolladores no necesitan usar un ID personalizado.
Si deseas usar una sintaxis única para transmitir metadatos adicionales, usa un ID personalizado.
Los metadatos adicionales pueden incluir la biblioteca, el componente o el área de la aplicación en la que aparece el texto.

Para especificar un ID personalizado en el atributo `i18n` o en la cadena de mensaje etiquetada [`$localize`][ApiLocalizeInitLocalize], usa el prefijo `@@`.
El siguiente ejemplo define el ID personalizado `introductionHeader` en un elemento de encabezado.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-solo-id"/>

El siguiente ejemplo define el ID personalizado `introductionHeader` para una variable.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText1 = $localize`:@@introductionHeader:Hello i18n!`;

</docs-code>

Cuando especificas un ID personalizado, el extractor genera una unidad de traducción con el ID personalizado.

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="custom-id"/>

Si cambias el texto, el extractor no cambia el ID.
Como resultado, no tienes que dar el paso adicional de actualizar la traducción.
La desventaja de usar IDs personalizados es que si cambias el texto, tu traducción puede quedar desincronizada con el texto fuente recién cambiado.

## Usar un ID personalizado con una descripción

Usa un ID personalizado en combinación con una descripción y un significado para ayudar aún más al traductor.

El siguiente ejemplo incluye una descripción, seguida del ID personalizado.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-id"/>

El siguiente ejemplo define el ID personalizado `introductionHeader` y una descripción para una variable.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText2 = $localize`:An introduction header for this sample@@introductionHeader:Hello i18n!`;

</docs-code>

El siguiente ejemplo agrega un significado.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning-and-id"/>

El siguiente ejemplo define el ID personalizado `introductionHeader` para una variable.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText3 = $localize`:site header|An introduction header for this sample@@introductionHeader:Hello i18n!`;

</docs-code>

### Definir IDs personalizados únicos

Asegúrate de definir IDs personalizados que sean únicos.
Si usas el mismo ID para dos elementos de texto diferentes, la herramienta de extracción extrae solo el primero y Angular usa la misma traducción en lugar de ambos elementos de texto originales.

Por ejemplo, en el siguiente fragmento de código se define el mismo ID personalizado `myId` para dos elementos de texto diferentes.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-duplicate-custom-id"/>

Lo siguiente muestra la traducción en francés.

<docs-code header="src/locale/messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="i18n-duplicate-custom-id"/>

Ambos elementos ahora usan la misma traducción \(`Bonjour`\), porque ambos fueron definidos con el mismo ID personalizado.

<docs-code path="adev/src/content/examples/i18n/doc-files/rendered-output.html"/>

[ApiLocalizeInitLocalize]: api/localize/init/$localize "$localize | init - localize - API | Angular"

[GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n/prepare#h1-example "How meanings control text extraction and merges - Prepare components for translations | Angular"
