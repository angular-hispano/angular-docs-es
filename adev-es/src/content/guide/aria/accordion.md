<docs-decorative-header title="Accordion">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="Patrón ARIA de Accordion"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="Referencia API de Accordion"/>
</docs-pill-row>

## Visión general

Un accordion organiza contenido relacionado en secciones expandibles y colapsables, reduciendo el desplazamiento de la página y ayudando a los usuarios a enfocarse en la información relevante. Cada sección tiene un botón de activación y un panel de contenido. Al hacer clic en un botón de activación se alterna la visibilidad de su panel asociado.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## Uso

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

## Características

- **Modos de expansión** - Controla si uno o múltiples paneles pueden estar abiertos al mismo tiempo
- **Navegación por teclado** - Navega entre botones de activación usando las teclas de flecha, Inicio y Fin
- **Renderización lazy** - El contenido solo se crea cuando un panel se expande por primera vez, mejorando el rendimiento de carga inicial
- **Estados deshabilitados** - Deshabilita el grupo completo o botones de activación individuales
- **Gestión de foco** - Controla si los elementos deshabilitados pueden recibir foco del teclado
- **Control programático** - Expande, colapsa o alterna paneles desde el código de tu componente
- **Soporte RTL** - Soporte automático para idiomas de derecha a izquierda

## Ejemplos

### Modo de expansión única

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

### Modo de expansión múltiple

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

### Elementos de accordion deshabilitados

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

### Renderización lazy de contenido

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

## APIs

### AccordionGroup

La directiva contenedora que gestiona la navegación por teclado y el comportamiento de expansión para un grupo de elementos de accordion.

#### Inputs

| Propiedad         | Tipo      | Predeterminado | Descripción                                                                                       |
| ----------------- | --------- | -------------- | ------------------------------------------------------------------------------------------------- |
| `disabled`        | `boolean` | `false`        | Deshabilita todos los botones de activación en el grupo                                           |
| `multiExpandable` | `boolean` | `true`         | Si múltiples paneles pueden ser expandidos simultáneamente                                        |
| `softDisabled`    | `boolean` | `true`         | Cuando es `true`, los elementos deshabilitados son focalizables. Cuando es `false`, se omiten    |
| `wrap`            | `boolean` | `false`        | Si la navegación por teclado se envuelve del último al primer elemento y viceversa               |

#### Métodos

| Método        | Parámetros | Descripción                                                                       |
| ------------- | ---------- | --------------------------------------------------------------------------------- |
| `expandAll`   | ninguno    | Expande todos los paneles (solo funciona cuando `multiExpandable` es `true`)     |
| `collapseAll` | ninguno    | Colapsa todos los paneles                                                         |

### AccordionTrigger

La directiva aplicada al elemento button que alterna la visibilidad del panel.

#### Inputs

| Propiedad  | Tipo      | Predeterminado | Descripción                                                                       |
| ---------- | --------- | -------------- | --------------------------------------------------------------------------------- |
| `id`       | `string`  | auto           | Identificador único para el botón de activación                                   |
| `panelId`  | `string`  | —              | **Requerido.** Debe coincidir con el `panelId` del panel asociado                |
| `disabled` | `boolean` | `false`        | Deshabilita este botón de activación                                              |
| `expanded` | `boolean` | `false`        | Si el panel está expandido (soporta enlace bidireccional)                         |

#### Signals

| Propiedad | Tipo              | Descripción                                                |
| --------- | ----------------- | ---------------------------------------------------------- |
| `active`  | `Signal<boolean>` | Si el botón de activación actualmente tiene foco          |

#### Métodos

| Método     | Parámetros | Descripción                                |
| ---------- | ---------- | ------------------------------------------ |
| `expand`   | ninguno    | Expande el panel asociado                  |
| `collapse` | ninguno    | Colapsa el panel asociado                  |
| `toggle`   | ninguno    | Alterna el estado de expansión del panel   |

### AccordionPanel

La directiva aplicada al elemento que contiene el contenido colapsable.

#### Inputs

| Propiedad         | Tipo      | Predeterminado | Descripción                                                                |
| ----------------- | --------- | -------------- | -------------------------------------------------------------------------- |
| `id`              | `string`  | auto           | Identificador único para el panel                                          |
| `panelId`         | `string`  | —              | **Requerido.** Debe coincidir con el `panelId` del botón de activación asociado |
| `preserveContent` | `boolean` | `true`         | Si mantener el contenido en el DOM después de que el panel se colapsa     |

#### Signals

| Propiedad | Tipo              | Descripción                          |
| --------- | ----------------- | ------------------------------------ |
| `visible` | `Signal<boolean>` | Si el panel está actualmente expandido |

#### Métodos

| Método     | Parámetros | Descripción                         |
| ---------- | ---------- | ----------------------------------- |
| `expand`   | ninguno    | Expande este panel                  |
| `collapse` | ninguno    | Colapsa este panel                  |
| `toggle`   | ninguno    | Alterna el estado de expansión      |

### AccordionContent

La directiva estructural aplicada a un `ng-template` dentro de un panel de accordion para habilitar la renderización lazy.

Esta directiva no tiene inputs, outputs ni métodos. Aplícala a un elemento `ng-template`:

```angular-html
<div ngAccordionPanel panelId="item-1">
  <ng-template ngAccordionContent>
    <!-- El contenido aquí se renderiza de forma lazy -->
  </ng-template>
</div>
```
