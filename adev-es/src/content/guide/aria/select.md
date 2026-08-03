<docs-decorative-header title="Select">
</docs-decorative-header>

## Visión general {#overview}

Un patrón que combina combobox de solo lectura con listbox para crear dropdowns de selección simple con navegación por teclado y soporte para lectores de pantalla.

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

## Uso {#usage}

El patrón de select funciona mejor cuando los usuarios necesitan elegir un único valor de un conjunto familiar de opciones.

Considera usar este patrón cuando:

- **La lista de opciones es fija** (menos de 20 elementos) - Los usuarios pueden escanear y elegir sin filtrar
- **Las opciones son familiares** - Los usuarios reconocen las opciones sin necesidad de buscar
- **Los formularios necesitan campos estándar** - Selección de país, estado, categoría o status
- **Configuraciones y ajustes** - Menús desplegables para preferencias u opciones
- **Etiquetas de opciones claras** - Cada opción tiene un nombre distinto y escaneable

Evita este patrón cuando:

- **La lista tiene más de 20 elementos** - Usa el [patrón Autocomplete](guide/aria/autocomplete) para mejor filtrado
- **Los usuarios necesitan buscar opciones** - [Autocomplete](guide/aria/autocomplete) proporciona entrada de texto y filtrado
- **Se necesita selección múltiple** - Usa el [patrón Multiselect](guide/aria/multiselect) en su lugar
- **Existen muy pocas opciones (2-3)** - Los botones de radio proporcionan mejor visibilidad de todas las opciones

## Características {#features}

El patrón de select combina directivas [Combobox](guide/aria/combobox) y [Listbox](guide/aria/listbox) para proporcionar un dropdown completamente accesible con:

- **Navegación por Teclado** - Navega por opciones con teclas de flecha, selecciona con Enter, cierra con Escape
- **Soporte para Lectores de Pantalla** - Atributos ARIA integrados para tecnologías asistivas
- **Visualización Personalizada** - Muestra valores seleccionados con iconos, formato o contenido enriquecido
- **Reactividad Basada en Signals** - Gestión de estado reactivo usando signals de Angular
- **Posicionamiento Inteligente** - CDK Overlay maneja bordes de viewport y desplazamiento
- **Soporte de Texto Bidireccional** - Maneja automáticamente idiomas de derecha a izquierda (RTL)

## Ejemplos {#examples}

### Select básico {#basic-select}

Los usuarios necesitan un dropdown estándar para elegir de una lista de valores. Un combobox de solo lectura emparejado con un listbox proporciona la experiencia familiar de select con soporte de accesibilidad completo.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

El atributo `readonly` en `ngCombobox` previene entrada de texto mientras preserva la navegación por teclado. Los usuarios interactúan con el dropdown usando teclas de flecha y Enter, justo como un elemento select nativo.

### Select con visualización personalizada {#select-with-custom-display}

Las opciones a menudo necesitan indicadores visuales como iconos o badges para ayudar a los usuarios a identificar opciones rápidamente. Las plantillas personalizadas dentro de las opciones permiten formato enriquecido mientras se mantiene la accesibilidad.

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

Cada opción muestra un icono junto a la etiqueta. El valor seleccionado se actualiza para mostrar el icono y texto de la opción elegida, proporcionando retroalimentación visual clara.

### Select deshabilitado {#disabled-select}

Los selects pueden ser deshabilitados para prevenir interacción del usuario cuando ciertas condiciones de formulario no se cumplen. El estado deshabilitado proporciona retroalimentación visual y previene interacción por teclado.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Cuando está deshabilitado, el select muestra un estado visual deshabilitado y bloquea toda interacción del usuario. Los lectores de pantalla anuncian el estado deshabilitado a usuarios de tecnología asistiva.

## Testing

El patrón select puede probarse usando una combinación de `ComboboxHarness` y `ListboxHarness` de `@angular/aria/combobox/testing` y `@angular/aria/listbox/testing`.
Aquí hay un ejemplo de cómo usar los harnesses para probar un componente select:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MySelectComponent} from './my-select'; // Tu componente

describe('MySelectComponent', () => {
  let fixture: ComponentFixture<MySelectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MySelectComponent],
    });

    fixture = TestBed.createComponent(MySelectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting an option', async () => {
    // Carga el harness del combobox (que actúa como el trigger del select)
    const select = await loader.getHarness(ComboboxHarness);

    // Verifica que está cerrado inicialmente
    expect(await select.isOpen()).toBe(false);

    // Abre el dropdown
    await select.open();
    expect(await select.isOpen()).toBe(true);

    // Obtiene el harness del listbox desde el popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();
    expect(options.length).toBe(3);

    // Hace clic en la segunda opción
    await options[1].click();

    // Verifica que el dropdown se cerró y el valor se actualizó
    expect(await select.isOpen()).toBe(false);
    expect(await (await select.host()).text()).toContain('Option 2');
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

### Posicionamiento {#positioning}

El patrón de select se integra con [CDK Overlay](https://material.angular.io/cdk/overlay/overview) para posicionamiento inteligente. Usa `cdkConnectedOverlay` para manejar bordes de viewport y desplazamiento automáticamente.
