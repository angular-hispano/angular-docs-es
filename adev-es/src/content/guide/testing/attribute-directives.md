
# Probar directivas de atributo

Una *directiva de atributo* modifica el comportamiento de un elemento, componente u otra directiva.
Su nombre refleja la forma en que se aplica la directiva: como un atributo en un elemento host.

## Probar la `HighlightDirective`

La `HighlightDirective` de la aplicación de muestra establece el color de fondo de un elemento basado en un color vinculado a datos o un color predeterminado \(lightgray\).
También establece una propiedad personalizada del elemento \(`customProperty`\) a `true` sin otra razón que mostrar que puede hacerlo.

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.ts"/>

Se usa en toda la aplicación, quizás más simplemente en el `AboutComponent`:

<docs-code header="app/about/about.component.ts" path="adev/src/content/examples/testing/src/app/about/about.component.ts"/>

Probar el uso específico de la `HighlightDirective` dentro del `AboutComponent` requiere solo las técnicas exploradas en la sección ["Pruebas de componentes anidados"](guide/testing/components-scenarios#nested-component-tests) de [Escenarios de prueba de componentes](guide/testing/components-scenarios).

<docs-code header="app/about/about.component.spec.ts" path="adev/src/content/examples/testing/src/app/about/about.component.spec.ts" visibleRegion="tests"/>

Sin embargo, probar un solo caso de uso es poco probable que explore el rango completo de las capacidades de una directiva.
Encontrar y probar todos los componentes que usan la directiva es tedioso, frágil y casi tan poco probable de ofrecer cobertura completa.

Las *pruebas solo de clase* podrían ser útiles, pero las directivas de atributo como esta tienden a manipular el DOM.
Las pruebas unitarias aisladas no tocan el DOM y, por lo tanto, no inspiran confianza en la eficacia de la directiva.

Una mejor solución es crear un componente de prueba artificial que demuestre todas las formas de aplicar la directiva.

<docs-code header="app/shared/highlight.directive.spec.ts (TestComponent)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="test-component"/>

<img alt="HighlightDirective spec en acción" src="assets/images/guide/testing/highlight-directive-spec.png">

ÚTIL: El caso `<input>` vincula la `HighlightDirective` al nombre de un valor de color en el cuadro de entrada.
El valor inicial es la palabra "cyan" que debería ser el color de fondo del cuadro de entrada.

Aquí hay algunas pruebas de este componente:

<docs-code header="app/shared/highlight.directive.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="selected-tests"/>

Algunas técnicas son dignas de mención:

* El predicado `By.directive` es una excelente manera de obtener los elementos que tienen esta directiva *cuando sus tipos de elemento son desconocidos*
* La [pseudo-clase `:not`](https://developer.mozilla.org/docs/Web/CSS/:not) en `By.css('h2:not([highlight])')` ayuda a encontrar elementos `<h2>` que *no* tienen la directiva.
    `By.css('*:not([highlight])')` encuentra *cualquier* elemento que no tenga la directiva.

* `DebugElement.styles` permite el acceso a los estilos del elemento incluso en ausencia de un navegador real, gracias a la abstracción `DebugElement`.
    Pero siéntete libre de explotar el `nativeElement` cuando eso parezca más fácil o más claro que la abstracción.

* Angular agrega una directiva al injector del elemento al que se aplica.
    La prueba para el color predeterminado usa el injector del segundo `<h2>` para obtener su instancia de `HighlightDirective` y su `defaultColor`.

* `DebugElement.properties` permite el acceso a la propiedad personalizada artificial que se establece por la directiva
