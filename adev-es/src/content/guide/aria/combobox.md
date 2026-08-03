<docs-decorative-header title="Combobox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Patrón ARIA de Combobox"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Referencia API de Combobox"/>
</docs-pill-row>

## Visión general {#overview}

Una directiva que coordina un campo de entrada de texto con un popup, proporcionando la directiva primitiva para patrones de autocomplete, select y multiselect.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

Combobox es la directiva primitiva que coordina un campo de entrada de texto con un popup. Proporciona la base para patrones de autocomplete, select y multiselect. Considera usar combobox directamente cuando:

- **Construyas patrones personalizados de autocomplete** - Creando comportamientos especializados de filtrado o sugerencias
- **Crees componentes de selección personalizados** - Desarrollando menús desplegables con requisitos únicos
- **Coordines entrada con popup** - Emparejando entrada de texto con contenido de listbox, tree o dialog
- **Implementes modos de filtro específicos** - Usando comportamientos manual, auto-selección o resaltado

Usa patrones documentados en su lugar cuando:

- Se necesite autocomplete estándar con filtrado - Consulta el [patrón Autocomplete](guide/aria/autocomplete) para ejemplos listos para usar
- Se necesiten menús desplegables de selección única - Consulta el [patrón Select](guide/aria/select) para implementación completa de menú desplegable
- Se necesiten menús desplegables de selección múltiple - Consulta el [patrón Multiselect](guide/aria/multiselect) para multi-selección con visualización compacta

Nota: Las guías de [Autocomplete](guide/aria/autocomplete), [Select](guide/aria/select) y [Multiselect](guide/aria/multiselect) muestran patrones documentados que combinan esta directiva con [Listbox](guide/aria/listbox) para casos de uso específicos.

## Características {#features}

El combobox de Angular proporciona un sistema de coordinación entrada-popup totalmente accesible con:

- **Entrada de Texto con Popup** - Coordina campo de entrada con contenido de popup
- **Tres Modos de Filtro** - Comportamientos manual, auto-selección o resaltado
- **Navegación por Teclado** - Manejo de teclas de flecha, Enter, Escape
- **Soporte para Lectores de Pantalla** - Atributos ARIA integrados incluyendo role="combobox" y aria-expanded
- **Gestión de Popup** - Mostrar/ocultar automático basado en interacción del usuario
- **Reactividad Basada en Signals** - Gestión de estado reactiva usando signals de Angular

## Ejemplos {#examples}

### Autocomplete

Un campo de entrada accesible que filtra y sugiere opciones mientras los usuarios escriben, ayudándoles a encontrar y seleccionar valores de una lista.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

La configuración `filterMode="manual"` proporciona control completo sobre el filtrado y la selección. La entrada actualiza un signal que filtra la lista de opciones. Los usuarios navegan con teclas de flecha y seleccionan con Enter o clic. Este modo proporciona la mayor flexibilidad para lógica de filtrado personalizada. Consulta la [guía de Autocomplete](guide/aria/autocomplete) para patrones de filtrado completos y ejemplos.

### Modo de solo lectura {#readonly-mode}

Un patrón que combina un combobox de solo lectura con listbox para crear menús desplegables de selección única con navegación por teclado y soporte para lectores de pantalla.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

El atributo `readonly` previene la escritura en el campo de entrada. El popup se abre al hacer clic o con teclas de flecha. Los usuarios navegan opciones con teclado y seleccionan con Enter o clic.

Esta configuración proporciona la base para los patrones de [Select](guide/aria/select) y [Multiselect](guide/aria/multiselect). Consulta esas guías para implementaciones completas de menú desplegable con activadores y posicionamiento de overlay.

### Grid de datepicker {#datepicker-grid}

Combobox puede coordinarse con un grid bidimensional para crear datepickers accesibles. Los usuarios navegan fechas dentro de la tabla de grid del calendario usando las teclas de flecha direccionales y confirman la selección con clic, Enter o barra espaciadora.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Popup de diálogo {#dialog-popup}

Los popups a veces necesitan comportamiento modal con un fondo y trampa de foco. La directiva de diálogo de combobox proporciona este patrón para casos de uso especializados.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

La directiva `ngComboboxDialog` crea un popup modal usando el elemento dialog nativo. Esto proporciona comportamiento de fondo y trampa de foco. Usa popups de diálogo cuando la interfaz de selección requiere interacción modal o cuando el contenido del popup es lo suficientemente complejo como para justificar foco a pantalla completa.

## Testing

Angular Aria proporciona un `ComboboxHarness` para probar componentes combobox.
Aquí hay un ejemplo de cómo usar el harness en una prueba de componente:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {MyComboboxComponent} from './my-combobox'; // Tu componente

describe('MyComboboxComponent', () => {
  let fixture: ComponentFixture<MyComboboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyComboboxComponent],
    });

    fixture = TestBed.createComponent(MyComboboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow opening and closing the popup', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Verifica el estado inicial
    expect(await combobox.isOpen()).toBe(false);

    // Abre el popup
    await combobox.open();
    expect(await combobox.isOpen()).toBe(true);

    // Cierra el popup
    await combobox.close();
    expect(await combobox.isOpen()).toBe(false);
  });
});
```

## API reference

Para documentación de API detallada, inspecciona las siguientes referencias de API:

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)

### Patrones y directivas relacionados {#related-patterns-and-directives}

Combobox es la directiva primitiva para estos patrones documentados:

- [Autocomplete](guide/aria/autocomplete) - Patrón de filtrado y sugerencias (coordina la escritura del input con la lista de opciones)
- [Select](guide/aria/select) - Patrón de menú desplegable de selección única (aplicado directamente en triggers de botón no editables)
- [Multiselect](guide/aria/multiselect) - Patrón de selección múltiple (aplicado en triggers no editables con Listbox multi-habilitado)

Combobox típicamente se combina con:

- [Listbox](guide/aria/listbox) - Contenido de popup más común
- [Tree](guide/aria/tree) - Contenido de popup jerárquico (consulta la guía de Tree para ejemplos)
