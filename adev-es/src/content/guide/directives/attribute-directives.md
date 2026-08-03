# Directivas de atributo

Cambia la apariencia o comportamiento de elementos DOM y componentes Angular con directivas de atributo.

## Usar bindings de plantilla para comportamiento puntual {#use-template-bindings-for-one-off-behavior}

La sintaxis de plantilla de Angular ya cubre cambiar las clases, estilos, propiedades y eventos de un solo elemento:

- Los [bindings de clase y estilo](guide/templates/binding#css-class-and-style-property-bindings) agregan y eliminan clases CSS y estilos en línea.
- Los [bindings de propiedad y atributo](guide/templates/binding) establecen propiedades DOM y atributos HTML.
- Los [escuchadores de eventos](guide/templates/event-listeners) responden a la interacción del usuario.

Las directivas de atributo son útiles cuando quieres empaquetar este tipo de comportamiento en una unidad reutilizable que puedes aplicar a cualquier elemento o componente.

## Construyendo una directiva de atributo {#building-an-attribute-directive}

Esta sección te guía a través de la creación de una directiva de resaltado que establece el color de fondo del elemento host en amarillo.

1. Para crear una directiva, usa el comando CLI [`ng generate directive`](tools/cli/schematics).

   ```shell
   ng generate directive highlight
   ```

   El CLI crea `src/app/highlight.directive.ts`, un archivo de prueba correspondiente `src/app/highlight.directive.spec.ts`.

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

   La propiedad de configuración del decorador `@Directive()` especifica el selector de atributo CSS de la directiva, `[appHighlight]`.

1. Importa `ElementRef` desde `@angular/core`.
    `ElementRef` otorga acceso directo al elemento DOM host a través de su propiedad `nativeElement`.

1. Añade `ElementRef` en el `constructor()` de la directiva para [inyectar](guide/di) una referencia al elemento DOM host, el elemento al que aplicas `appHighlight`.

1. Añade lógica a la clase `HighlightDirective` que establece el fondo a amarillo.

    <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

ÚTIL: Las directivas _no_ soportan espacios de nombres.

```angular-html {avoid}
<p app:Highlight>Esto no es válido</p>
```

## Aplicando una directiva de atributo {#applying-an-attribute-directive}

1. Para usar `HighlightDirective`, añade un elemento `<p>` a la plantilla HTML con la directiva como atributo.

    <docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" visibleRegion="applied"/>

Angular crea una instancia de la clase `HighlightDirective` e inyecta una referencia al elemento `<p>` en el constructor de la directiva, que establece el estilo de fondo del elemento `<p>` a amarillo.

## Manejando eventos de usuario {#handling-user-events}

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

## Aceptando valores de input {#accepting-input-values}

Al igual que los componentes, las directivas aceptan inputs a través de la función [`input()`](guide/components/inputs). Dale al input el mismo nombre que el selector para que un solo enlace aplique la directiva y le pase un valor:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="input"/>

Lee el input llamándolo como un signal, y recurre a un valor por defecto cuando no se establece ningún color:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"/>

En la plantilla, enlaza el valor al selector. Debido a que el input comparte el nombre del selector, `[appHighlight]` tanto aplica la directiva como establece su valor. Aquí el `color` enlazado es una propiedad del componente:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="color"/>

<docs-code header="app.component.ts" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" region="class"/>

Una directiva puede declarar más de un input. La siguiente directiva añade un input `defaultColor`, y luego recurre a través de `appHighlight`, `defaultColor`, y finalmente `red`:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts"/>

Enlaza ambos inputs en el mismo elemento. Debido a que `defaultColor` toma un string estático en lugar de una expresión dinámica, no necesita corchetes:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="defaultColor"/>

## Desactivando el procesamiento de Angular con `NgNonBindable` {#deactivating-angular-processing-with-ngnonbindable}

Para prevenir la evaluación de expresiones en el navegador, añade `ngNonBindable` al elemento host.
`ngNonBindable` desactiva la interpolación, directivas y enlace en plantillas.

En el siguiente ejemplo, la expresión `{{ 1 + 1 }}` se renderiza tal como está en tu editor de código, y no muestra `2`.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable"/>

Aplicar `ngNonBindable` a un elemento detiene el enlace para los elementos hijos de ese elemento.
Sin embargo, `ngNonBindable` aún permite que las directivas funcionen en el elemento donde aplicas `ngNonBindable`.
En el siguiente ejemplo, la directiva `appHighlight` sigue activa pero Angular no evalúa la expresión `{{ 1 + 1 }}`.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable-with-directive"/>

Si aplicas `ngNonBindable` a un elemento padre, Angular desactiva la interpolación y el enlace de cualquier tipo, como enlace de propiedad o enlace de evento, para los hijos del elemento.

## Siguientes pasos {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="Directivas estructurales"/>
  <docs-pill href="guide/directives/directive-composition-api" title="API de composición de directivas"/>
</docs-pill-row>
