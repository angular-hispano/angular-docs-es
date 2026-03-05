<docs-decorative-header title="Listbox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox pattern"/>
  <docs-pill href="/api?query=listbox#angular_aria_listbox" title="Listbox API Reference"/>
</docs-pill-row>

## Visión general

Una directiva que muestra una lista de opciones para que los usuarios seleccionen, soportando navegación por teclado, selección simple o múltiple, y soporte para lectores de pantalla.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso

Listbox es una directiva fundamental utilizada por los patrones [Select](guide/aria/select), [Multiselect](guide/aria/multiselect) y [Autocomplete](guide/aria/autocomplete). Para la mayoría de las necesidades de dropdown, usa esos patrones documentados en su lugar.

Considera usar listbox directamente cuando:

- **Construir componentes de selección personalizados** - Crear interfaces especializadas con comportamiento específico
- **Listas de selección visibles** - Mostrar elementos seleccionables directamente en la página (no en dropdowns)
- **Patrones de integración personalizados** - Integrar con requisitos únicos de popup o diseño

Evita listbox cuando:

- **Se necesitan menús de navegación** - Usa la directiva [Menu](guide/aria/menu) para acciones y comandos

## Características

El listbox de Angular proporciona una implementación de lista completamente accesible con:

- **Navegación por Teclado** - Navega por opciones con teclas de flecha, selecciona con Enter o Espacio
- **Soporte para Lectores de Pantalla** - Atributos ARIA integrados incluyendo role="listbox"
- **Selección Simple o Múltiple** - El atributo `multi` controla el modo de selección
- **Horizontal o Vertical** - Atributo `orientation` para dirección de diseño
- **Búsqueda por Escritura** - Escribe caracteres para saltar a opciones coincidentes
- **Reactividad Basada en Signals** - Gestión de estado reactivo usando signals de Angular

## Ejemplos

### Listbox básico

Las aplicaciones a veces necesitan listas seleccionables visibles directamente en la página en lugar de ocultas en un dropdown. Un listbox independiente proporciona navegación por teclado y selección para estas interfaces de lista visibles.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

El signal del modelo `values` proporciona enlace bidireccional a los elementos seleccionados. Con `selectionMode="explicit"`, los usuarios presionan Espacio o Enter para seleccionar opciones. Para patrones de dropdown que combinan listbox con combobox y posicionamiento de overlay, consulta el patrón [Select](guide/aria/select).

### Listbox horizontal

Las listas a veces funcionan mejor horizontalmente, como interfaces tipo toolbar o selecciones estilo pestañas. El atributo `orientation` cambia tanto el diseño como la dirección de navegación por teclado.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Con `orientation="horizontal"`, las teclas de flecha izquierda y derecha navegan entre opciones en lugar de arriba y abajo. El listbox maneja automáticamente idiomas de derecha a izquierda (RTL) invirtiendo la dirección de navegación.

### Modos de selección

Listbox soporta dos modos de selección que controlan cuándo los elementos se seleccionan. Elige el modo que coincida con el patrón de interacción de tu interfaz.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/app.html" />
</docs-code-multifile>

El modo `'follow'` selecciona automáticamente el elemento enfocado, proporcionando interacción más rápida cuando la selección cambia frecuentemente. El modo `'explicit'` requiere Espacio o Enter para confirmar la selección, previniendo cambios accidentales mientras se navega. Los patrones de dropdown típicamente usan el modo `'follow'` para selección simple.

## APIs

### Directiva Listbox

La directiva `ngListbox` crea una lista accesible de opciones seleccionables.

#### Inputs

| Propiedad        | Tipo                               | Por defecto  | Descripción                                           |
| ---------------- | ---------------------------------- | ------------ | ----------------------------------------------------- |
| `id`             | `string`                           | auto         | Identificador único para el listbox                   |
| `multi`          | `boolean`                          | `false`      | Habilita selección múltiple                           |
| `orientation`    | `'vertical'` \| `'horizontal'`     | `'vertical'` | Dirección de diseño de la lista                       |
| `wrap`           | `boolean`                          | `true`       | Si el foco se envuelve en los bordes de la lista      |
| `selectionMode`  | `'follow'` \| `'explicit'`         | `'follow'`   | Cómo se activa la selección                           |
| `focusMode`      | `'roving'` \| `'activedescendant'` | `'roving'`   | Estrategia de gestión de foco                         |
| `softDisabled`   | `boolean`                          | `true`       | Si los elementos deshabilitados son enfocables        |
| `disabled`       | `boolean`                          | `false`      | Deshabilita todo el listbox                           |
| `readonly`       | `boolean`                          | `false`      | Hace el listbox de solo lectura                       |
| `typeaheadDelay` | `number`                           | `500`        | Milisegundos antes de que se reinicie la búsqueda     |

#### Model

| Propiedad | Tipo  | Descripción                                          |
| --------- | ----- | ---------------------------------------------------- |
| `values`  | `V[]` | Array enlazable bidireccionalmente de valores seleccionados |

#### Signals

| Propiedad | Tipo          | Descripción                                 |
| --------- | ------------- | ------------------------------------------- |
| `values`  | `Signal<V[]>` | Valores seleccionados actualmente como signal |

#### Métodos

| Método                     | Parámetros                        | Descripción                                    |
| -------------------------- | --------------------------------- | ---------------------------------------------- |
| `scrollActiveItemIntoView` | `options?: ScrollIntoViewOptions` | Desplaza el elemento activo a la vista         |
| `gotoFirst`                | none                              | Navega al primer elemento del listbox          |

### Directiva Option

La directiva `ngOption` marca un elemento dentro de un listbox.

#### Inputs

| Propiedad  | Tipo      | Por defecto | Descripción                                             |
| ---------- | --------- | ----------- | ------------------------------------------------------- |
| `id`       | `string`  | auto        | Identificador único para la opción                      |
| `value`    | `V`       | -           | El valor asociado con esta opción (requerido)           |
| `label`    | `string`  | -           | Etiqueta opcional para lectores de pantalla             |
| `disabled` | `boolean` | `false`     | Si esta opción está deshabilitada                       |

#### Signals

| Propiedad  | Tipo              | Descripción                           |
| ---------- | ----------------- | ------------------------------------- |
| `selected` | `Signal<boolean>` | Si esta opción está seleccionada      |
| `active`   | `Signal<boolean>` | Si esta opción tiene el foco          |

### Patrones relacionados

Listbox es usado por estos patrones de dropdown documentados:

- **[Select](guide/aria/select)** - Patrón de dropdown de selección simple usando combobox de solo lectura + listbox
- **[Multiselect](guide/aria/multiselect)** - Patrón de dropdown de selección múltiple usando combobox de solo lectura + listbox con `multi`
- **[Autocomplete](guide/aria/autocomplete)** - Patrón de dropdown filtrable usando combobox + listbox

Para patrones completos de dropdown con trigger, popup y posicionamiento de overlay, consulta esas guías de patrones en lugar de usar listbox solo.

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox ARIA pattern"/>
  <docs-pill href="/api/aria/listbox/Listbox" title="Listbox API Reference"/>
</docs-pill-row>
