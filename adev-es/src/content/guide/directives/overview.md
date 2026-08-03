<docs-decorative-header title="Directivas" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Las directivas añaden comportamiento a elementos y componentes en tus aplicaciones Angular.
</docs-decorative-header>

Una directiva puede cambiar cómo se ve un elemento, cómo se comporta o cómo encaja en el DOM. Angular incluye varias directivas integradas y puedes escribir las tuyas propias.

## Cuándo usar una directiva {#when-to-use-a-directive}

Las directivas son más efectivas cuando encapsulan comportamiento **reutilizable** que quieres aplicar a un elemento o componente existente.

Algunos ejemplos comunes incluyen:

- Aplicar la misma apariencia o comportamiento en muchos elementos, como auto-focus o un tooltip.
- Leer o escribir en el DOM, atributos o clases del elemento host.
- Añadir comportamiento a un componente que no posees sin cambiar su código fuente.

Si necesitas renderizar tu propio marcado o gestionar una parte de la UI con su propia plantilla, usa un [componente](guide/components), una directiva especializada con su propia plantilla.

## Un ejemplo rápido {#a-quick-example}

Supón que quieres que los elementos se resalten cuando el usuario pase el mouse sobre ellos, cambiando su color de fondo a amarillo. En lugar de repetir la misma lógica de manejo de eventos en cada elemento, puedes empaquetar ese comportamiento en una directiva y aplicarla donde la necesites.

La siguiente directiva `appHighlight` establece el color de fondo del elemento host cuando el mouse entra y lo limpia cuando el mouse sale:

```ts
import {Directive, signal} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[style.background-color]': 'isHovered() ? "yellow" : null',
  },
})
export class HighlightDirective {
  protected isHovered = signal(false);
}
```

Los metadatos `host` escuchan eventos del mouse para actualizar la signal `isHovered`, y enlazan el estilo `background-color` del elemento host al valor de la signal.

Aplica la directiva añadiendo su selector como atributo en un elemento:

```angular-html
<p appHighlight>¡Resáltame!</p>
```

Cada elemento que lleve el atributo `appHighlight` obtiene el mismo comportamiento al pasar el mouse, con la lógica definida en un solo lugar.

## Tipos de directivas {#types-of-directives}

Angular tiene tres tipos principales de directivas:

| Tipo de directiva                                               | Detalles                                                                                  |
| :-------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| [Componentes](guide/components)                                 | Definen UI reutilizable con su propia plantilla.                                          |
| [Directivas de atributo](guide/directives/attribute-directives) | Cambian la apariencia o comportamiento de un elemento, componente u otra directiva.       |
| [Directivas estructurales](guide/directives/structural-directives) | Cambian el diseño del DOM añadiendo y eliminando elementos del DOM.                    |

## Siguientes pasos {#whats-next}

Aprende más sobre cada tipo de directiva en las siguientes guías.

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="Directivas de atributo"/>
  <docs-pill href="guide/directives/structural-directives" title="Directivas estructurales"/>
  <docs-pill href="guide/directives/directive-composition-api" title="API de composición de directivas"/>
</docs-pill-row>
