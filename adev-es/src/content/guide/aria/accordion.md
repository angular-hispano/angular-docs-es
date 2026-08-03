<docs-decorative-header title="Accordion">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="Patrón ARIA de Accordion"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="Referencia API de Accordion"/>
</docs-pill-row>

## Visión general {#overview}

Un accordion organiza contenido relacionado en secciones expandibles y colapsables, reduciendo el desplazamiento de la página y ayudando a los usuarios a enfocarse en la información relevante. Cada sección tiene un botón de activación y un panel de contenido. Al hacer clic en un botón de activación se alterna la visibilidad de su panel asociado.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## Uso {#usage}

Los accordions funcionan bien para organizar contenido en grupos lógicos donde los usuarios típicamente necesitan ver una sección a la vez.

**Usa accordions cuando:**

- Muestres FAQs con múltiples preguntas y respuestas
- Organices formularios largos en secciones manejables
- Reduzcas el desplazamiento en páginas con mucho contenido
- Reveles información relacionada de forma progresiva

**Evita accordions cuando:**

- Construyas menús de navegación (usa el componente [Menu](guide/aria/menu) en su lugar)
- Crees interfaces con pestañas (usa el componente [Tabs](guide/aria/tabs) en su lugar)
- Muestres una sola sección colapsable (usa un patrón de revelación en su lugar)
- Los usuarios necesiten ver múltiples secciones simultáneamente (considera un diseño diferente)

## Características {#features}

- **Modos de expansión** - Controla si uno o múltiples paneles pueden estar abiertos al mismo tiempo
- **Navegación por teclado** - Navega entre botones de activación usando las teclas de flecha, Inicio y Fin
- **Renderización lazy** - El contenido solo se crea cuando un panel se expande por primera vez, mejorando el rendimiento de carga inicial
- **Estados deshabilitados** - Deshabilita el grupo completo o botones de activación individuales
- **Gestión de foco** - Controla si los elementos deshabilitados pueden recibir foco del teclado
- **Control programático** - Expande, colapsa o alterna paneles desde el código de tu componente
- **Soporte RTL** - Soporte automático para idiomas de derecha a izquierda

## Ejemplos {#examples}

### Modo de expansión única {#single-expansion-mode}

Establece `[multiExpandable]="false"` para permitir que solo un panel esté abierto a la vez. Abrir un nuevo panel cierra automáticamente cualquier panel previamente abierto.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Este modo funciona bien para FAQs o situaciones donde quieres que los usuarios se enfoquen en una respuesta a la vez.

### Modo de expansión múltiple {#multiple-expansion-mode}

Establece `[multiExpandable]="true"` para permitir que múltiples paneles estén abiertos simultáneamente. Los usuarios pueden expandir tantos paneles como necesiten sin cerrar otros.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Este modo es útil para secciones de formularios o cuando los usuarios necesitan comparar contenido entre múltiples paneles.

NOTA: El input `multiExpandable` tiene como valor predeterminado `true`. Establécelo en `false` explícitamente si quieres el comportamiento de expansión única.

### Elementos de accordion deshabilitados {#disabled-accordion-items}

Deshabilita botones de activación específicos usando el input `disabled`. Controla cómo se comportan los elementos deshabilitados durante la navegación por teclado usando el input `softDisabled` en el grupo de accordion.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Cuando `[softDisabled]="true"` (el valor predeterminado), los elementos deshabilitados pueden recibir foco pero no pueden activarse. Cuando `[softDisabled]="false"`, los elementos deshabilitados se omiten por completo durante la navegación por teclado.

### Renderización lazy de contenido {#lazy-content-rendering}

Usa la directiva `ngAccordionContent` en un `ng-template` para diferir la renderización del contenido hasta que el panel se expanda por primera vez. Esto mejora el rendimiento para accordions con contenido pesado como imágenes, gráficos o componentes complejos.

```angular-html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger panelId="item-1">
      Texto del Botón de Activación
    </button>
    <div ngAccordionPanel panelId="item-1">
      <ng-template ngAccordionContent>
        <!-- Este contenido solo se renderiza cuando el panel se abre por primera vez -->
        <img src="large-image.jpg" alt="Descripción">
        <app-expensive-component />
      </ng-template>
    </div>
  </div>
</div>
```

Por defecto, el contenido permanece en el DOM después de que el panel se colapsa. Establece `[preserveContent]="false"` para eliminar el contenido del DOM cuando el panel se cierra.

## Testing

Angular Aria proporciona harnesses de componentes para probar componentes de accordion.
Aquí hay un ejemplo de cómo usar los harnesses en una prueba de componente:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {AccordionGroupHarness} from '@angular/aria/accordion/testing';
import {MyAccordionComponent} from './my-accordion'; // Tu componente

describe('MyAccordionComponent', () => {
  let fixture: ComponentFixture<MyAccordionComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAccordionComponent],
    });

    fixture = TestBed.createComponent(MyAccordionComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow expanding panels', async () => {
    // Carga el harness del grupo de accordion
    const group = await loader.getHarness(AccordionGroupHarness);

    // Obtiene todos los accordions individuales (items) en el grupo
    const accordions = await group.getAccordions();
    expect(accordions.length).toBe(3);

    // Verifica el estado inicial (el primero expandido, los demás colapsados)
    expect(await accordions[0].isExpanded()).toBe(true);
    expect(await accordions[1].isExpanded()).toBe(false);

    // Expande el segundo panel
    await accordions[1].expand();

    // Verifica el estado actualizado
    expect(await accordions[1].isExpanded()).toBe(true);
    // Si multiExpandable es false, el primero ahora debería estar colapsado
    expect(await accordions[0].isExpanded()).toBe(false);
  });
});
```

## API reference

Para documentación de API detallada, inspecciona las siguientes referencias de API:

- [`AccordionGroup`](/api/aria/accordion/AccordionGroup)
- [`AccordionTrigger`](/api/aria/accordion/AccordionTrigger)
- [`AccordionPanel`](/api/aria/accordion/AccordionPanel)
- [`AccordionContent`](/api/aria/accordion/AccordionContent)
