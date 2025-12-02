# Directivas de atributo

Cambia la apariencia o comportamiento de elementos DOM y componentes Angular con directivas de atributo.

## Construyendo una directiva de atributo

Esta sección te guía a través de la creación de una directiva de resaltado que establece el color de fondo del elemento host en amarillo.

1. Para crear una directiva, usa el comando CLI [`ng generate directive`](tools/cli/schematics).

   ```shell
   ng generate directive highlight
   ```

   El CLI crea `src/app/highlight.directive.ts`, un archivo de prueba correspondiente `src/app/highlight.directive.spec.ts`.

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.0.ts"/>

   La propiedad de configuración del decorador `@Directive()` especifica el selector de atributo CSS de la directiva, `[appHighlight]`.

1. Importa `ElementRef` desde `@angular/core`.
    `ElementRef` otorga acceso directo al elemento DOM host a través de su propiedad `nativeElement`.

1. Añade `ElementRef` en el `constructor()` de la directiva para [inyectar](guide/di) una referencia al elemento DOM host, el elemento al que aplicas `appHighlight`.

1. Añade lógica a la clase `HighlightDirective` que establece el fondo a amarillo.

    <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

ÚTIL: Las directivas _no_ soportan espacios de nombres.

<docs-code header="app.component.avoid.html (no soportado)" path="adev/src/content/examples/attribute-directives/src/app/app.component.avoid.html" visibleRegion="unsupported"/>

## Aplicando una directiva de atributo

1. Para usar `HighlightDirective`, añade un elemento `<p>` a la plantilla HTML con la directiva como atributo.

    <docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" visibleRegion="applied"/>

Angular crea una instancia de la clase `HighlightDirective` e inyecta una referencia al elemento `<p>` en el constructor de la directiva, que establece el estilo de fondo del elemento `<p>` a amarillo.

## Manejando eventos de usuario

Esta sección te muestra cómo detectar cuando un usuario pasa el mouse sobre o fuera del elemento y responder estableciendo o limpiando el color de resaltado.

1. Configura las vinculaciones de eventos del host usando la propiedad `host` en el decorador `@Directive()`.

    <docs-code header="src/app/highlight.directive.ts (decorador)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="decorator"/>

1. Añade dos manejadores de eventos que responden cuando el mouse entra o sale, cada uno con el decorador `@HostListener()`.

    <docs-code header="highlight.directive.ts (métodos-mouse)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="mouse-methods"/>

Suscríbete a los eventos del elemento del DOM que hospeda una directiva de atributo (en este caso, el `<p>`) configurando los listeners de eventos en la [propiedad host](guide/components/host-elements#binding-to-the-host-element) de la directiva.

ÚTIL: Los manejadores delegan a un método auxiliar, `highlight()`, que establece el color en el elemento DOM host, `el`.

La directiva completa es la siguiente:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

El color de fondo aparece cuando el puntero se desplaza sobre el elemento de párrafo y desaparece cuando el puntero se mueve fuera.

<img alt="Segundo Resaltado" src="assets/images/guide/attribute-directives/highlight-directive-anim.gif">

## Pasando valores a una directiva de atributo

Esta sección te guía a través de establecer el color de resaltado mientras aplicas `HighlightDirective`.

1. En `highlight.directive.ts`, importa `Input` desde `@angular/core`.

<docs-code header="highlight.directive.ts (importaciones)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="imports"/>

2. Añade una propiedad `input` `appHighlight`.

    <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="input"/>

    La función `input()` añade metadatos a la clase que hace que la propiedad `appHighlight` de la directiva esté disponible para enlace.

3. En `app.component.ts`, añade una propiedad `color` al `AppComponent`.

    <docs-code header="app.component.ts (clase)" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.ts" visibleRegion="class"/>

4. Para aplicar simultáneamente la directiva y el color, usa enlace de propiedad con el selector de directiva `appHighlight`, estableciéndolo igual a `color`.

    <docs-code header="src/app/app.component.html (color)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="color"/>

    El enlace de atributo `[appHighlight]` realiza dos tareas:
    - Aplica la directiva de resaltado al elemento `<p>`
    - Establece el color de resaltado de la directiva con un enlace de propiedad

### Estableciendo el valor con entrada de usuario

Esta sección te guía a través de añadir botones de radio para vincular tu elección de color a la directiva `appHighlight`.

1. Añade marcado a `app.component.html` para elegir un color de la siguiente manera:

    <docs-code header="app.component.html (v2)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="v2"/>

1. Revisa `AppComponent.color` para que no tenga valor inicial.

    <docs-code header="app.component.ts (clase)" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" visibleRegion="class"/>

1. En `highlight.directive.ts`, revisa el método `onMouseEnter` para que primero trate de resaltar con `appHighlight` y recurra a `red` si `appHighlight` es `undefined`.

    <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="mouse-enter"/>

1. Ejecuta tu aplicación para verificar que el usuario puede elegir el color con los botones de radio.

    <img alt="Gif animado de la directiva de resaltado refactorizada cambiando color según el botón de radio que selecciona el usuario" src="assets/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

## Enlazando a una segunda propiedad

Esta sección te guía a través de configurar tu aplicación para que el desarrollador pueda establecer el color por defecto.

1. Añade una segunda propiedad `Input()` a `HighlightDirective` llamada `defaultColor`.

    <docs-code header="highlight.directive.ts (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="defaultColor"/>

1. Revisa el `onMouseEnter` de la directiva para que primero trate de resaltar con `appHighlight`, luego con `defaultColor`, y finalmente con `red` si ambas propiedades son `undefined`.

    <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="mouse-enter"/>

1. Para enlazar a `AppComponent.color` y usar "violet" como el color por defecto, añade el siguiente HTML.
    En este caso, el enlace `defaultColor` no usa corchetes, `[]`, porque es estático.

    <docs-code header="app.component.html (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="defaultColor"/>

    Como con los componentes, puedes agreg múltiples enlaces de propiedad de directiva a un elemento host.

El color por defecto es rojo si no hay enlace de color por defecto.
Cuando el usuario elige un color, el color seleccionado se convierte en el color de resaltado activo.

<img alt="Gif animado de la directiva de resaltado final que muestra color rojo sin enlace y violeta con el color por defecto establecido. Cuando el usuario selecciona color, la selección toma precedencia." src="assets/images/guide/attribute-directives/highlight-directive-final-anim.gif">

## Desactivando el procesamiento de Angular con `NgNonBindable`

Para prevenir la evaluación de expresiones en el navegador, añade `ngNonBindable` al elemento host.
`ngNonBindable` desactiva la interpolación, directivas y enlace en plantillas.

En el siguiente ejemplo, la expresión `{{ 1 + 1 }}` se renderiza tal como está en tu editor de código, y no muestra `2`.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable"/>

Aplicar `ngNonBindable` a un elemento detiene el enlace para los elementos hijos de ese elemento.
Sin embargo, `ngNonBindable` aún permite que las directivas funcionen en el elemento donde aplicas `ngNonBindable`.
En el siguiente ejemplo, la directiva `appHighlight` sigue activa pero Angular no evalúa la expresión `{{ 1 + 1 }}`.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable-with-directive"/>

Si aplicas `ngNonBindable` a un elemento padre, Angular desactiva la interpolación y el enlace de cualquier tipo, como enlace de propiedad o enlace de evento, para los hijos del elemento.
