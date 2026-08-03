<docs-decorative-header title="Multiselect">
</docs-decorative-header>

## Visión general {#overview}

Un patrón que combina combobox de solo lectura con listbox habilitado para múltiple selección para crear dropdowns de selección múltiple con navegación por teclado y soporte para lectores de pantalla.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

El patrón de multiselect funciona mejor cuando los usuarios necesitan elegir múltiples elementos relacionados de un conjunto familiar de opciones.

Considera usar este patrón cuando:

- **Los usuarios necesitan múltiples selecciones** - Etiquetas, categorías, filtros o labels donde aplican múltiples opciones
- **La lista de opciones es fija** (menos de 20 elementos) - Los usuarios pueden escanear opciones sin búsqueda
- **Filtrar contenido** - Múltiples criterios pueden estar activos simultáneamente
- **Asignar atributos** - Labels, permisos o características donde múltiples valores tienen sentido
- **Opciones relacionadas** - Opciones que funcionan lógicamente juntas (como seleccionar múltiples miembros del equipo)

Evita este patrón cuando:

- **Solo se necesita selección simple** - Usa el [patrón Select](guide/aria/select) para dropdowns de opción única más simples
- **La lista tiene más de 20 elementos con búsqueda necesaria** - Usa el [patrón Autocomplete](guide/aria/autocomplete) con capacidad de multiselección
- **La mayoría o todas las opciones serán seleccionadas** - Un patrón de checklist proporciona mejor visibilidad
- **Las opciones son opciones binarias independientes** - Las casillas individuales comunican las opciones más claramente

## Características {#features}

El patrón de multiselect combina directivas [Combobox](guide/aria/combobox) y [Listbox](guide/aria/listbox) para proporcionar un dropdown completamente accesible con:

- **Navegación por Teclado** - Navega por opciones con teclas de flecha, alterna con Espacio, cierra con Escape
- **Soporte para Lectores de Pantalla** - Atributos ARIA integrados incluyendo aria-multiselectable
- **Visualización de Conteo de Selección** - Muestra patrón compacto "Item + 2 más" para múltiples selecciones
- **Reactividad Basada en Signals** - Gestión de estado reactivo usando signals de Angular
- **Posicionamiento Inteligente** - CDK Overlay maneja bordes de viewport y desplazamiento
- **Selección Persistente** - Las opciones seleccionadas permanecen visibles con marcas de verificación después de la selección

## Ejemplos {#examples}

### Multiselect básico {#basic-multiselect}

Los usuarios necesitan seleccionar múltiples elementos de una lista de opciones. Un combobox de solo lectura emparejado con un listbox habilitado para multi proporciona funcionalidad de multiselección familiar con soporte de accesibilidad completo.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

El atributo `multi` en `ngListbox` habilita selección múltiple. Presiona Espacio para alternar opciones, y el popup permanece abierto para selecciones adicionales. La visualización muestra el primer elemento seleccionado más un conteo de selecciones restantes.

### Multiselect con visualización personalizada {#multiselect-with-custom-display}

Las opciones a menudo necesitan indicadores visuales como iconos o colores para ayudar a los usuarios a identificar opciones. Las plantillas personalizadas dentro de las opciones permiten formato enriquecido mientras el valor de visualización muestra un resumen compacto.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Cada opción muestra un icono junto a su etiqueta. El valor de visualización se actualiza para mostrar el icono y texto de la primera selección, seguido de un conteo de selecciones adicionales. Las opciones seleccionadas muestran una marca de verificación para retroalimentación visual clara.

### Selección controlada {#controlled-selection}

Los formularios a veces necesitan limitar el número de selecciones o validar opciones de usuario. El control programático sobre la selección habilita estas restricciones mientras mantiene la accesibilidad.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Este ejemplo limita las selecciones a tres elementos. Cuando se alcanza el límite, las opciones no seleccionadas se deshabilitan, previniendo selecciones adicionales. Un mensaje informa a los usuarios sobre la restricción.

## Testing

El patrón multiselect puede probarse usando una combinación de `ComboboxHarness` y `ListboxHarness` de `@angular/aria/combobox/testing` y `@angular/aria/listbox/testing`.
Aquí hay un ejemplo de cómo usar los harnesses para probar un componente multiselect:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyMultiselectComponent} from './my-multiselect'; // Tu componente

describe('MyMultiselectComponent', () => {
  let fixture: ComponentFixture<MyMultiselectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMultiselectComponent],
    });

    fixture = TestBed.createComponent(MyMultiselectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting multiple options', async () => {
    const select = await loader.getHarness(ComboboxHarness);

    // Abre el dropdown
    await select.open();

    // Obtiene el harness del listbox desde el popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    expect(await listbox.isMulti()).toBe(true);

    const options = await listbox.getOptions();

    // Selecciona la primera y segunda opción
    await options[0].click();
    await options[1].click();

    // Verifica que ambas opciones estén seleccionadas
    expect(await options[0].isSelected()).toBe(true);
    expect(await options[1].isSelected()).toBe(true);

    // Cierra el dropdown
    await select.close();

    // Verifica que el valor se actualizó (ej. lista separada por comas o conteo)
    expect(await (await select.host()).text()).toContain('Option 1, Option 2');
  });
});
```

## API reference

Para documentación de API detallada, inspecciona las siguientes referencias de API:

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)
- [`Listbox`](/api/aria/listbox/Listbox)
- [`Option`](/api/aria/listbox/Option)
