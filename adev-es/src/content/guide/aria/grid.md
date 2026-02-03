<docs-decorative-header title="Grid">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="Patrón ARIA de Grid"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="Referencia API de Grid"/>
</docs-pill-row>

## Visión general

Un grid permite a los usuarios navegar datos bidimensionales o elementos interactivos usando teclas de flecha direccionales, Inicio, Fin y Página Arriba/Abajo. Los grids funcionan para tablas de datos, calendarios, hojas de cálculo y patrones de diseño que agrupan elementos interactivos relacionados.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## Uso

Los grids funcionan bien para datos o elementos interactivos organizados en filas y columnas donde los usuarios necesitan navegación por teclado en múltiples direcciones.

**Usa grids cuando:**

- Construyas tablas de datos interactivas con celdas editables o seleccionables
- Crees calendarios o selectores de fecha
- Implementes interfaces similares a hojas de cálculo
- Agrupes elementos interactivos (botones, checkboxes) para reducir las paradas de tabulación en una página
- Construyas interfaces que requieren navegación bidimensional por teclado

**Evita grids cuando:**

- Muestres tablas simples de solo lectura (usa el elemento semántico HTML `<table>` en su lugar)
- Muestres listas de una sola columna (usa [Listbox](guide/aria/listbox) en su lugar)
- Muestres datos jerárquicos (usa [Tree](guide/aria/tree) en su lugar)
- Construyas formularios sin diseño tabular (usa controles de formulario estándar)

## Características

- **Navegación bidimensional** - Las teclas de flecha se mueven entre celdas en todas las direcciones
- **Modos de foco** - Elige entre estrategias de foco de roving tabindex o activedescendant
- **Soporte de selección** - Selección de celda opcional con modos de selección única o múltiple
- **Comportamiento de envoltura** - Configura cómo se envuelve la navegación en los bordes del grid (continuous, loop o nowrap)
- **Selección de rango** - Selecciona múltiples celdas con teclas modificadoras o arrastrando
- **Estados deshabilitados** - Deshabilita el grid completo o celdas individuales
- **Soporte RTL** - Navegación automática para idiomas de derecha a izquierda

## Ejemplos

### Grid de tabla de datos

Usa un grid para tablas interactivas donde los usuarios necesitan navegar entre celdas usando teclas de flecha. Este ejemplo muestra una tabla de datos básica con navegación por teclado.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Aplica la directiva `ngGrid` al elemento table, `ngGridRow` a cada fila y `ngGridCell` a cada celda.

### Grid de calendario

Los calendarios son un caso de uso común para grids. Este ejemplo muestra una vista de mes donde los usuarios navegan fechas usando teclas de flecha.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Los usuarios pueden activar una fecha presionando Enter o Espacio cuando están enfocados en una celda.

### Grid de diseño

Usa un grid de diseño para agrupar elementos interactivos y reducir las paradas de tabulación. Este ejemplo muestra un grid de botones tipo píldora.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

En lugar de tabular a través de cada botón, los usuarios navegan con teclas de flecha y solo un botón recibe foco de tabulación.

### Modos de selección y foco

Habilita la selección con `[enableSelection]="true"` y configura cómo interactúan el foco y la selección.

```angular-html
<table ngGrid
       [enableSelection]="true"
       [selectionMode]="'explicit'"
       [multi]="true"
       [focusMode]="'roving'">
  <tr ngGridRow>
    <td ngGridCell>Celda 1</td>
    <td ngGridCell>Celda 2</td>
  </tr>
</table>
```

**Modos de selección:**

- `follow`: La celda enfocada se selecciona automáticamente
- `explicit`: Los usuarios seleccionan celdas con Espacio o clic

**Modos de foco:**

- `roving`: El foco se mueve a las celdas usando `tabindex` (mejor para grids simples)
- `activedescendant`: El foco permanece en el contenedor del grid, `aria-activedescendant` indica la celda activa (mejor para desplazamiento virtual)

## APIs

### Grid

La directiva contenedora que proporciona navegación por teclado y gestión de foco para filas y celdas.

#### Inputs

| Propiedad              | Tipo                                 | Predeterminado | Descripción                                                                             |
| ---------------------- | ------------------------------------ | -------------- | --------------------------------------------------------------------------------------- |
| `enableSelection`      | `boolean`                            | `false`        | Si la selección está habilitada para el grid                                            |
| `disabled`             | `boolean`                            | `false`        | Deshabilita el grid completo                                                            |
| `softDisabled`         | `boolean`                            | `true`         | Cuando es `true`, las celdas deshabilitadas son focalizables pero no interactivas       |
| `focusMode`            | `'roving' \| 'activedescendant'`     | `'roving'`     | Estrategia de foco usada por el grid                                                    |
| `rowWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`       | Comportamiento de envoltura de navegación a lo largo de las filas                       |
| `colWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`       | Comportamiento de envoltura de navegación a lo largo de las columnas                    |
| `multi`                | `boolean`                            | `false`        | Si múltiples celdas pueden ser seleccionadas                                            |
| `selectionMode`        | `'follow' \| 'explicit'`             | `'follow'`     | Si la selección sigue al foco o requiere acción explícita                               |
| `enableRangeSelection` | `boolean`                            | `false`        | Habilita selecciones de rango con teclas modificadoras o arrastrando                    |

### GridRow

Representa una fila dentro de un grid y sirve como contenedor para celdas de grid.

#### Inputs

| Propiedad  | Tipo     | Predeterminado | Descripción                           |
| ---------- | -------- | -------------- | ------------------------------------- |
| `rowIndex` | `number` | auto           | El índice de esta fila dentro del grid |

### GridCell

Representa una celda individual dentro de una fila de grid.

#### Inputs

| Propiedad     | Tipo                         | Predeterminado | Descripción                                                                 |
| ------------- | ---------------------------- | -------------- | --------------------------------------------------------------------------- |
| `id`          | `string`                     | auto           | Identificador único para la celda                                           |
| `role`        | `string`                     | `'gridcell'`   | Rol de la celda: `gridcell`, `columnheader` o `rowheader`                   |
| `disabled`    | `boolean`                    | `false`        | Deshabilita esta celda                                                      |
| `selected`    | `boolean`                    | `false`        | Si la celda está seleccionada (soporta enlace bidireccional)                |
| `selectable`  | `boolean`                    | `true`         | Si la celda puede ser seleccionada                                          |
| `rowSpan`     | `number`                     | —              | Número de filas que abarca la celda                                         |
| `colSpan`     | `number`                     | —              | Número de columnas que abarca la celda                                      |
| `rowIndex`    | `number`                     | —              | Índice de fila de la celda                                                  |
| `colIndex`    | `number`                     | —              | Índice de columna de la celda                                               |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | Orientación para widgets dentro de la celda                                 |
| `wrap`        | `boolean`                    | `true`         | Si la navegación de widgets se envuelve dentro de la celda                  |

#### Signals

| Propiedad | Tipo              | Descripción                              |
| --------- | ----------------- | ---------------------------------------- |
| `active`  | `Signal<boolean>` | Si la celda actualmente tiene foco       |
