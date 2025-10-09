<docs-decorative-header title="Directivas integradas" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Las directivas son clases que añaden comportamiento adicional a elementos en tus aplicaciones Angular.
</docs-decorative-header>

Usa las directivas integradas de Angular para gestionar formularios, listas, estilos y lo que ven los usuarios.

Los diferentes tipos de directivas de Angular son los siguientes:

| Tipos de Directivas                                              | Detalles                                                                             |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| [Componentes](guide/components)                                  | Se usan con una plantilla. Este tipo de directiva es el tipo de directiva más común. |
| [Directivas de atributo](#directivas-de-atributo-integradas)     | Cambian la apariencia o comportamiento de un elemento, componente u otra directiva.  |
| [Structural directives](/guide/directives/structural-directives) | Cambia el diseño del DOM agregando y eliminando elementos del DOM..    

Esta guía cubre las [directivas de atributo integradas](#directivas-de-atributo-integradas).

## Directivas de atributo integradas

Las directivas de atributo escuchan y modifican el comportamiento de otros elementos HTML, atributos, propiedades y componentes.

Las directivas de atributo más comunes son las siguientes:

| Directivas comunes                                             | Detalles                                                              |
| :------------------------------------------------------------- | :-------------------------------------------------------------------- |
| [`NgClass`](#añadiendo-y-eliminando-clases-con-ngclass)        | Añade y elimina un conjunto de clases CSS.                            |
| [`NgStyle`](#configurando-estilos-en-línea-con-ngstyle)        | Añade y elimina un conjunto de estilos HTML.                          |
| [`NgModel`](guide/forms/template-driven-forms)                 | Añade enlace de datos bidireccional a un elemento de formulario HTML. |

ÚTIL: Las directivas integradas usan solo APIs públicas. No tienen acceso especial a ninguna API privada que otras directivas no puedan acceder.

## Añadiendo y eliminando clases con `NgClass`

Añade o elimina múltiples clases CSS simultáneamente con `ngClass`.

ÚTIL: Para añadir o eliminar una _sola_ clase, usa [enlace de clase](guide/templates/class-binding) en lugar de `NgClass`.

### Importar `NgClass` en el componente

Para usar `NgClass`, añádelo a la lista de `imports` del componente.

<docs-code header="src/app/app.component.ts (importación de NgClass)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-class"/>

### Usando `NgClass` con una expresión

En el elemento que quieres estilizar, añade `[ngClass]` y configúralo igual a una expresión.
En este caso, `isSpecial` es un booleano configurado como `true` en `app.component.ts`.
Como `isSpecial` es verdadero, `ngClass` aplica la clase `special` al `<div>`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="special-div"/>

### Usando `NgClass` con un método

1. Para usar `NgClass` con un método, añade el método a la clase del componente.
   En el siguiente ejemplo, `setCurrentClasses()` configura la propiedad `currentClasses` con un objeto que añade o elimina tres clases basándose en el estado `true` o `false` de otras tres propiedades del componente.

   Cada clave del objeto es un nombre de clase CSS.
   Si una clave es `true`, `ngClass` añade la clase.
   Si una clave es `false`, `ngClass` elimina la clase.

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setClasses"/>

1. En la plantilla, añade el enlace de propiedad `ngClass` a `currentClasses` para configurar las clases del elemento:


<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgClass-1"/>

Para este caso de uso, Angular aplica las clases en la inicialización y en caso de cambios causados por reasignar el objeto `currentClasses`.
El ejemplo completo llama a `setCurrentClasses()` inicialmente con `ngOnInit()` cuando el usuario hace clic en el botón `Refresh currentClasses`.
Estos pasos no son necesarios para implementar `ngClass`.

## Configurando estilos en línea con `NgStyle`

ÚTIL: Para añadir o eliminar un _solo_ estilo, usa [enlaces de estilo](guide/templates/binding#css-class-and-style-property-bindings) en lugar de `NgStyle`.

### Importar `NgStyle` en el componente

Para usar `NgStyle`, añádelo a la lista de `imports` del componente.

<docs-code header="src/app/app.component.ts (importación de NgStyle)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-style"/>

Usa `NgStyle` para configurar múltiples estilos en línea simultáneamente, basándose en el estado del componente.

1. Para usar `NgStyle`, añade un método a la clase del componente.

   En el siguiente ejemplo, `setCurrentStyles()` configura la propiedad `currentStyles` con un objeto que define tres estilos, basándose en el estado de otras tres propiedades del componente.

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setStyles"/>

1. Para configurar los estilos del elemento, añade un enlace de propiedad `ngStyle` a `currentStyles`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgStyle-2"/>

Para este caso de uso, Angular aplica los estilos en la inicialización y en caso de cambios.
Para hacer esto, el ejemplo completo llama a `setCurrentStyles()` inicialmente con `ngOnInit()` y cuando las propiedades dependientes cambian a través de un clic de botón.
Sin embargo, estos pasos no son necesarios para implementar `ngStyle` por sí solo.

## Alojando una directiva sin un elemento DOM

El `<ng-container>` de Angular es un elemento de agrupación que no interfiere con estilos o diseño porque Angular no lo pone en el DOM.

Usa `<ng-container>` cuando no hay un solo elemento para alojar la directiva.

Aquí hay un párrafo condicional usando `<ng-container>`.

<docs-code header="src/app/app.component.html (ngif-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="ngif-ngcontainer"/>

<img alt="párrafo ngcontainer con estilo apropiado" src="assets/images/guide/structural-directives/good-paragraph.png">

1. Importa la directiva `ngModel` desde `FormsModule`.

1. Añade `FormsModule` a la sección de imports del módulo Angular relevante.

1. Para excluir condicionalmente una `<option>`, envuelve la `<option>` en un `<ng-container>`.

   <docs-code header="src/app/app.component.html (select-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="select-ngcontainer"/>

   <img alt="las opciones ngcontainer funcionan correctamente" src="assets/images/guide/structural-directives/select-ngcontainer-anim.gif">

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="Directivas de Atributo"/>
  <docs-pill href="guide/directives/structural-directives" title="Directivas Estructurales"/>
  <docs-pill href="guide/directives/directive-composition-api" title="API de composición de directivas"/>
</docs-pill-row>
