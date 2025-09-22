# Selectores de Componentes

CONSEJO: Esta guía asume que ya has leído la [Guía de Fundamentos](essentials). Léela primero si eres nuevo en Angular.

Cada componente define
un [selector CSS](https://developer.mozilla.org/es/docs/Web/CSS/CSS_selectors) que determina cómo
se usa el componente:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
</docs-code>

Para usar un componente, creas un elemento HTML que coincida con su selector en las plantillas de _otros_ componentes:

<docs-code language="angular-ts" highlight="[3]">
@Component({
  template: `
    <profile-photo />
    <button>Subir una nueva foto de perfil</button>`,
  ...,
})
export class UserProfile { }
</docs-code>

**Angular hace coincidir los selectores estáticamente en tiempo de compilación**. Cambiar el DOM en tiempo de ejecución, ya sea mediante
enlaces de Angular o con APIs del DOM, no afecta los componentes renderizados.

**Un elemento puede coincidir exactamente con un selector de componente.** Si múltiples selectores de componente coinciden con un
solo elemento, Angular genera un error.

**Los selectores de componente distinguen entre mayúsculas y minúsculas.**

## Tipos de selectores

Angular soporta un subconjunto limitado
de [tipos de selectores CSS básicos](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) en
selectores de componente:

| **Tipo de selector**  | **Descripción**                                                                                                 | **Ejemplos**                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Tipo de selector      | Coincide con elementos basándose en su nombre de etiqueta HTML, o nombre de nodo.                                                    | `profile-photo`               |
| Selector de atributo | Coincide con elementos basándose en la presencia de un atributo HTML y, opcionalmente, un valor exacto para ese atributo. | `[dropzone]` `[type="reset"]` |
| Selector de clase    | Coincide con elementos basándose en la presencia de una clase CSS.                                                          | `.menu-item`                  |

Para valores de atributos, Angular soporta la coincidencia con un valor de atributo exacto usando el operador
igual (`=`). Angular no soporta otros operadores de valores de atributos.

Los selectores de componente de Angular no soportan combinadores, incluyendo
el [combinador descendiente](https://developer.mozilla.org/es/docs/Web/CSS/Descendant_combinator)
o [combinador hijo](https://developer.mozilla.org/es/docs/Web/CSS/Child_combinator).

Los selectores de componente de Angular no soportan
especificar [espacios de nombres](https://developer.mozilla.org/docs/Web/SVG/Namespaces_Crash_Course).

### La pseudo-clase `:not`

Angular soporta [la pseudo-clase `:not`](https://developer.mozilla.org/es/docs/Web/CSS/:not).
Puedes agregar esta pseudo-clase a cualquier otro selector para reducir qué elementos coincide
el selector de un componente. Por ejemplo, podrías definir un selector de atributo `[dropzone]` y prevenir
que coincida con elementos `textarea`:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
</docs-code>

Angular no soporta ninguna otra pseudo-clase o pseudo-elemento en selectores de componente.

### Combinando selectores

Puedes combinar múltiples selectores concatenándolos. Por ejemplo, puedes hacer coincidir elementos `<button>`
que especifiquen `type="reset"`:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
</docs-code>

También puedes definir múltiples selectores con una lista separada por comas:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
</docs-code>

Angular crea un componente para cada elemento que coincide con _cualquiera_ de los selectores en la lista.

## Eligiendo un selector

La gran mayoría de componentes deberían usar un nombre de elemento personalizado como su selector. Todos los nombres de
elementos personalizados deberían incluir un guión como se describe
en [la especificación HTML](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name).
Por defecto, Angular genera un error si encuentra un nombre de etiqueta personalizada que no coincide con ningún
componente disponible, previniendo errores debido a nombres de componente mal escritos.

Ver [Configuración avanzada de componentes](guide/components/advanced-configuration) para detalles sobre
usar [elementos personalizados nativos](https://developer.mozilla.org/es/docs/Web/API/Web_components) en
plantillas de Angular.

### Prefijos de selectores

El equipo de Angular recomienda usar un prefijo corto y consistente para todos los componentes personalizados
definidos dentro de tu proyecto. Por ejemplo, si fueras a construir YouTube con Angular, podrías
prefijar tus componentes con `yt-`, con componentes como `yt-menu`, `yt-player`, etc. Hacer espacio de nombres
a tus selectores de esta manera hace inmediatamente claro de dónde viene un componente particular. Por
defecto, el Angular CLI usa `app-`.

Angular usa el prefijo de selector `ng` para sus propias APIs del framework. Nunca uses `ng` como prefijo de
selector para tus propios componentes personalizados.

### Cuándo usar un selector de atributo

Deberías considerar un selector de atributo cuando quieras crear un componente en un elemento nativo estándar.
Por ejemplo, si quieres crear un componente de botón personalizado, puedes aprovechar el
elemento `<button>` estándar usando un selector de atributo:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
</docs-code>

Este enfoque permite a los consumidores del componente usar directamente todas las APIs estándar del elemento
sin trabajo adicional. Esto es especialmente valioso para atributos ARIA como `aria-label`.

Angular no genera errores cuando encuentra atributos personalizados que no coinciden con un componente
disponible. Al usar componentes con selectores de atributo, los consumidores pueden olvidar importar el
componente o su NgModule, resultando en que el componente no se renderice.
Ver [Importando y usando componentes](guide/components/importing) para más información.

Los componentes que definen selectores de atributo deberían usar atributos en minúsculas y con guiones (dash-case).
Puedes seguir la misma recomendación de prefijos descrita arriba.
