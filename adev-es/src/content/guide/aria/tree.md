<docs-decorative-header title="Tree">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" title="Tree ARIA pattern"/>
  <docs-pill href="/api/aria/tree/Tree" title="Tree API Reference"/>
</docs-pill-row>

## Visión general

Un árbol muestra datos jerárquicos donde los elementos pueden expandirse para revelar hijos o colapsar para ocultarlos. Los usuarios navegan con teclas de flecha, expanden y colapsan nodos y opcionalmente seleccionan elementos para escenarios de navegación o selección de datos.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
</docs-code-multifile>

## Uso

Los árboles funcionan bien para mostrar datos jerárquicos donde los usuarios necesitan navegar a través de estructuras anidadas.

**Usa árboles cuando:**

- Construir navegación de sistema de archivos
- Mostrar jerarquías de carpetas y documentos
- Crear estructuras de menú anidadas
- Mostrar organigramas
- Navegar datos jerárquicos
- Implementar navegación de sitio con secciones anidadas

**Evita árboles cuando:**

- Mostrar listas planas (usa [Listbox](guide/aria/listbox) en su lugar)
- Mostrar tablas de datos (usa [Grid](guide/aria/grid) en su lugar)
- Crear dropdowns simples (usa [Select](guide/aria/select) en su lugar)
- Construir navegación breadcrumb (usa patrones breadcrumb)

## Características

- **Navegación jerárquica** - Estructura de árbol anidada con funcionalidad de expandir y colapsar
- **Modos de selección** - Selección simple o múltiple con comportamiento explícito o de seguir foco
- **La selección sigue al foco** - Selección automática opcional cuando el foco cambia
- **Navegación por teclado** - Teclas de flecha, Home, End y búsqueda typeahead
- **Expandir/colapsar** - Flechas Derecha/Izquierda o Enter para alternar nodos padre
- **Elementos deshabilitados** - Deshabilitar nodos específicos con gestión de foco
- **Modos de foco** - Estrategias de foco roving tabindex o activedescendant
- **Soporte RTL** - Navegación para idiomas de derecha a izquierda

## Ejemplos

### Árbol de navegación

Usa un árbol para navegación donde hacer clic en elementos activa acciones en lugar de seleccionarlos.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Establece `[nav]="true"` para habilitar el modo de navegación. Esto usa `aria-current` para indicar la página actual en lugar de selección.

### Selección simple

Habilita selección simple para escenarios donde los usuarios eligen un elemento del árbol.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Deja `[multi]="false"` (el valor predeterminado) para selección simple. Los usuarios presionan Espacio para seleccionar el elemento enfocado.

### Multi-selección

Permite a los usuarios seleccionar múltiples elementos del árbol.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Establece `[multi]="true"` en el árbol. Los usuarios seleccionan elementos individualmente con Espacio o seleccionan rangos con Shift+teclas de flecha.

### La selección sigue al foco

Cuando la selección sigue al foco, el elemento enfocado se selecciona automáticamente. Esto simplifica la interacción para escenarios de navegación.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Establece `[selectionMode]="'follow'"` en el árbol. La selección se actualiza automáticamente mientras los usuarios navegan con teclas de flecha.

### Elementos de árbol deshabilitados

Deshabilita nodos de árbol específicos para prevenir interacción. Controla si los elementos deshabilitados pueden recibir foco.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Cuando `[softDisabled]="true"` en el árbol, los elementos deshabilitados pueden recibir foco pero no pueden ser activados o seleccionados. Cuando `[softDisabled]="false"`, los elementos deshabilitados se omiten durante la navegación por teclado.

## APIs

### Tree

La directiva contenedor que gestiona navegación y selección jerárquica.

#### Inputs

| Propiedad       | Tipo                             | Por defecto  | Descripción                                                      |
| --------------- | -------------------------------- | ------------ | ---------------------------------------------------------------- |
| `disabled`      | `boolean`                        | `false`      | Deshabilita todo el árbol                                        |
| `softDisabled`  | `boolean`                        | `true`       | Cuando es `true`, los elementos deshabilitados son enfocables pero no interactivos |
| `multi`         | `boolean`                        | `false`      | Si múltiples elementos pueden ser seleccionados                  |
| `selectionMode` | `'explicit' \| 'follow'`         | `'explicit'` | Si la selección requiere acción explícita o sigue al foco        |
| `nav`           | `boolean`                        | `false`      | Si el árbol está en modo de navegación (usa `aria-current`)      |
| `wrap`          | `boolean`                        | `true`       | Si la navegación por teclado se envuelve del último al primer elemento |
| `focusMode`     | `'roving' \| 'activedescendant'` | `'roving'`   | Estrategia de foco usada por el árbol                            |
| `values`        | `any[]`                          | `[]`         | Valores de elementos seleccionados (soporta enlace bidireccional) |

#### Métodos

| Método           | Parámetros | Descripción                                        |
| ---------------- | ---------- | -------------------------------------------------- |
| `expandAll`      | none       | Expande todos los nodos del árbol                  |
| `collapseAll`    | none       | Colapsa todos los nodos del árbol                  |
| `selectAll`      | none       | Selecciona todos los elementos (solo en modo multi-selección) |
| `clearSelection` | none       | Limpia toda selección                              |

### TreeItem

Un nodo individual en el árbol que puede contener nodos hijo.

#### Inputs

| Propiedad  | Tipo      | Por defecto | Descripción                                                |
| ---------- | --------- | ----------- | ---------------------------------------------------------- |
| `value`    | `any`     | —           | **Requerido.** Valor único para este elemento del árbol    |
| `disabled` | `boolean` | `false`     | Deshabilita este elemento                                  |
| `expanded` | `boolean` | `false`     | Si el nodo está expandido (soporta enlace bidireccional)   |

#### Signals

| Propiedad     | Tipo              | Descripción                                 |
| ------------- | ----------------- | ------------------------------------------- |
| `selected`    | `Signal<boolean>` | Si el elemento está seleccionado            |
| `active`      | `Signal<boolean>` | Si el elemento tiene el foco actualmente    |
| `hasChildren` | `Signal<boolean>` | Si el elemento tiene nodos hijo             |

#### Métodos

| Método     | Parámetros | Descripción                      |
| ---------- | ---------- | -------------------------------- |
| `expand`   | none       | Expande este nodo                |
| `collapse` | none       | Colapsa este nodo                |
| `toggle`   | none       | Alterna el estado de expansión   |

### TreeGroup

Un contenedor para elementos de árbol hijo.

Esta directiva no tiene inputs, outputs ni métodos. Sirve como un contenedor para organizar elementos `ngTreeItem` hijo:

```angular-html
<li ngTreeItem value="parent">
  Parent Item
  <ul ngTreeGroup>
    <li ngTreeItem value="child1">Child 1</li>
    <li ngTreeItem value="child2">Child 2</li>
  </ul>
</li>
```
