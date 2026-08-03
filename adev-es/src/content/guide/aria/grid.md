<docs-decorative-header title="Grid">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="Patrón ARIA de Grid"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="Referencia API de Grid"/>
</docs-pill-row>

## Visión general {#overview}

Un grid permite a los usuarios navegar datos bidimensionales o elementos interactivos usando teclas de flecha direccionales, Inicio, Fin y Página Arriba/Abajo. Los grids funcionan para tablas de datos, calendarios, hojas de cálculo y patrones de diseño que agrupan elementos interactivos relacionados.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## Uso {#usage}

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

## Características {#features}

- **Navegación bidimensional** - Las teclas de flecha se mueven entre celdas en todas las direcciones
- **Modos de foco** - Elige entre estrategias de foco de roving tabindex o activedescendant
- **Soporte de selección** - Selección de celda opcional con modos de selección única o múltiple
- **Comportamiento de envoltura** - Configura cómo se envuelve la navegación en los bordes del grid (continuous, loop o nowrap)
- **Selección de rango** - Selecciona múltiples celdas con teclas modificadoras o arrastrando
- **Estados deshabilitados** - Deshabilita el grid completo o celdas individuales
- **Soporte RTL** - Navegación automática para idiomas de derecha a izquierda

## Ejemplos {#examples}

### Grid de tabla de datos {#data-table-grid}

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

### Grid de calendario {#calendar-grid}

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

### Grid de diseño {#layout-grid}

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

### Modos de selección y foco {#selection-and-focus-modes}

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

## Testing

Angular Aria proporciona harnesses de componentes para probar componentes grid.
Aquí hay un ejemplo de cómo usar los harnesses en una prueba de componente:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {GridHarness} from '@angular/aria/grid/testing';
import {MyGridComponent} from './my-grid'; // Tu componente

describe('MyGridComponent', () => {
  let fixture: ComponentFixture<MyGridComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyGridComponent],
    });

    fixture = TestBed.createComponent(MyGridComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should read cell values and focus cells', async () => {
    const grid = await loader.getHarness(GridHarness);

    // Obtiene el texto de todas las celdas en un array 2D organizado por filas
    const cellTexts = await grid.getCellTextByIndex();
    expect(cellTexts).toEqual([
      ['Cell 1.1', 'Cell 1.2'],
      ['Cell 2.1', 'Cell 2.2'],
    ]);

    // Obtiene una celda específica por texto
    const cells = await grid.getCells({text: 'Cell 1.1'});
    expect(cells.length).toBe(1);
    const cell = cells[0];

    // Verifica el estado de la celda
    expect(await cell.isSelected()).toBe(true);
    expect(await cell.isActive()).toBe(true);

    // Enfoca la celda
    await cell.focus();
    expect(await cell.isFocused()).toBe(true);
  });
});
```

## API reference

Para documentación de API detallada, inspecciona las siguientes referencias de API:

- [`Grid`](/api/aria/grid/Grid)
- [`GridRow`](/api/aria/grid/GridRow)
- [`GridCell`](/api/aria/grid/GridCell)
- [`GridCellWidget`](/api/aria/grid/GridCellWidget)
