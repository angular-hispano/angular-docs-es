# Probar Pipes

Puedes probar [pipes](guide/templates/pipes) sin las utilidades de pruebas de Angular.

## Probar el `TitleCasePipe`

Una clase pipe tiene un método, `transform`, que manipula el valor de entrada en un valor de salida transformado.
La implementación de `transform` rara vez interactúa con el DOM.
La mayoría de pipes no tienen dependencia de Angular aparte de los metadata `@Pipe` y una interfaz.

Considera un `TitleCasePipe` que capitaliza la primera letra de cada palabra.
Aquí hay una implementación con una expresión regular.

<docs-code header="app/shared/title-case.pipe.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.ts"/>

Cualquier cosa que use una expresión regular vale la pena probar exhaustivamente.
Usa Jasmine simple para explorar los casos esperados y los casos extremos.

<docs-code header="app/shared/title-case.pipe.spec.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.spec.ts" visibleRegion="excerpt"/>

## Escribir pruebas DOM para soportar una prueba de pipe

Estas son pruebas del pipe *de forma aislada*.
No pueden decir si el `TitleCasePipe` está funcionando correctamente como se aplica en los componentes de la aplicación.

Considera agregar pruebas de componente como esta:

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>
