# Estilos en componentes

CONSEJO: Esta guía asume que ya has leído la [Guía de Fundamentos](essentials). Léela primero si eres nuevo en Angular.

Los componentes pueden incluir opcionalmente estilos CSS que se aplican al DOM de ese componente:

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Tu foto de perfil">`,
  styles: ` img { border-radius: 50%; } `,
})
export class ProfilePhoto { }
</docs-code>

También puedes elegir escribir tus estilos en archivos separados:

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }
</docs-code>

Cuando Angular compila tu componente, estos estilos se emiten junto con la salida JavaScript de tu componente. 
Esto significa que los estilos del componente participan en el sistema de módulos de JavaScript. 
Cuando renderizas un componente Angular, el framework incluye automáticamente sus estilos asociados, 
incluso cuando se carga un componente de forma diferida.

Angular funciona con cualquier herramienta que genere CSS,
incluyendo [Sass](https://sass-lang.com), [less](https://lesscss.org),
y [stylus](https://stylus-lang.com).

## Alcance de estilos

Cada componente tiene una configuración de **encapsulación de vista** que determina cómo el framework delimita el alcance
de los estilos de un componente. Hay 4 modos de encapsulación de vista: `Emulated`, `ShadowDom`, `ExperimentalIsolatedShadowDom`, y `None`.
Puedes especificar el modo en el decorador `@Component`:

<docs-code language="angular-ts" highlight="[3]">
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
</docs-code>

### ViewEncapsulation.Emulated

Por defecto, Angular usa encapsulación emulada para que los estilos de un componente solo se apliquen a elementos 
definidos en la plantilla de ese componente. En este modo, el framework genera un atributo HTML único 
para cada instancia del componente, añade ese atributo a los elementos en la plantilla del componente, 
e inserta ese atributo en los selectores CSS definidos en los estilos de tu componente.

Este modo asegura que los estilos de un componente no se filtren y afecten otros componentes. Sin embargo, 
los estilos globales definidos fuera de un componente aún puede afectar elementos dentro de un componente 
con encapsulación emulada.

En modo emulado, Angular admite
la pseudo-clase [`:host`](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:host).
Aunque la pseudo-clase [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) está
deprecada en navegadores modernos, el compilador de Angular proporciona soporte completo para ella. Ambas pseudo-clases
pueden usarse sin depender de [Shadow DOM](https://developer.mozilla.org/es/docs/Web/API/Web_components/Using_shadow_DOM) nativo.
Durante la compilación, el framework transforma estas pseudo-clases en atributos para que no
cumpla con las reglas de estas pseudo-clases nativas en tiempo de ejecución
(ej. compatibilidad del navegador, especificidad). El modo de encapsulación emulada de Angular no admite ninguna otra pseudo-clase relacionada con Shadow DOM,
como `::shadow` o `::part`.

#### `::ng-deep`

El modo de encapsulación emulada de Angular admite una pseudo-clase personalizada, `::ng-deep`. Aplicar esta pseudo-clase a
una regla CSS deshabilita la encapsulación para esa regla, convirtiéndola efectivamente en un estilo global. 
**El equipo de Angular desaconseja fuertemente el uso nuevo de `::ng-deep`**. Estas APIs permanecen exclusivamente para 
compatibilidad hacia atrás.

### ViewEncapsulation.ShadowDom

Este modo delimita el alcance de los estilos dentro de un componente
usando [la API estándar web de Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM).
Al habilitar este modo, Angular adjunta un shadow root al elemento host del componente y renderiza
la plantilla y los estilos del componente en el árbol de sombra correspondiente.

Los estilos dentro del árbol de sombra no pueden afectar a elementos fuera de ese árbol de sombra.

Habilitar la encapsulación `ShadowDom`, sin embargo, impacta más que el alcance de estilos. Renderizar el
componente en un árbol de sombra afecta la propagación de eventos, la interacción
con [la API `<slot>`](https://developer.mozilla.org/es/docs/Web/API/Web_components/Using_templates_and_slots),
y cómo las herramientas de desarrollador del navegador muestran elementos. Siempre entiende las implicaciones completas de usar
Shadow DOM en tu aplicación antes de habilitar esta opción.

### ViewEncapsulation.ExperimentalIsolatedShadowDom

Se comporta como se describe arriba, excepto que este modo garantiza estrictamente que _solo_ los estilos de ese componente se apliquen a elementos en la
plantilla del componente. Los estilos globales no pueden afectar a elementos en un árbol de sombra y los estilos dentro del
árbol de sombra no pueden afectar a elementos fuera de ese árbol de sombra.

### ViewEncapsulation.None

Este modo deshabilita toda la encapsulación de estilos para el componente. Cualquier estilo asociado con el
componente se comporta como estilos globales.

NOTA: En los modos `Emulated` y `ShadowDom`, Angular no garantiza al 100% que los estilos de tu componente siempre sobrescriban los estilos que vienen de fuera.
Se asume que estos estilos tienen la misma especificidad que los estilos de tu componente en caso de colisión.

## Definir estilos en plantillas

Puedes usar el elemento `<style>` en la plantilla de un componente para definir estilos adicionales. El
modo de encapsulación de vista del componente se aplica a los estilos definidos de esta manera.

Angular no admite enlaces dentro de elementos de estilo.

## Referenciar archivos de estilo externos

Las plantillas de componentes pueden
usar [el elemento `<link>`](https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/link) para
referenciar archivos CSS. Además, tu CSS puede
usar [la regla at `@import`](https://developer.mozilla.org/es/docs/Web/CSS/@import) para referenciar
archivos CSS. Angular trata estas referencias como estilos _externos_. Los estilos externos no se ven afectados por
la encapsulación de vista emulada.
