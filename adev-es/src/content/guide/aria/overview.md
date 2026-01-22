<docs-decorative-header title="Angular Aria">
</docs-decorative-header>

## ¿Qué es Angular Aria?

Construir componentes accesibles parece sencillo, pero implementarlos según las Directrices de Accesibilidad W3C requiere esfuerzo significativo y experiencia en accesibilidad.

Angular Aria es una colección de directivas headless y accesibles que implementan patrones WAI-ARIA comunes. Las directivas manejan interacciones de teclado, atributos ARIA, gestión de foco y soporte para lectores de pantalla. Todo lo que tienes que hacer es proporcionar la estructura HTML, estilos CSS y lógica de negocio.

## Instalación

```shell
npm install @angular/aria
```

## Demostración

Por ejemplo, tomemos un menú de toolbar. Aunque puede parecer una "simple" fila de botones vinculados con lógica específica, la navegación por teclado y los lectores de pantalla agregan mucha complejidad inesperada para quienes no están familiarizados con la accesibilidad.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

En este escenario, los desarrolladores necesitan considerar:

- **Navegación por teclado**. Los usuarios necesitan abrir el menú con Enter o Espacio, navegar opciones con teclas de flecha, seleccionar con Enter y cerrar con Escape.
- **Los lectores de pantalla** necesitan anunciar el estado del menú, el número de opciones y qué opción tiene el foco.
- **La gestión de foco** necesita moverse lógicamente entre el trigger y los elementos del menú.
- **Los idiomas de derecha a izquierda** requieren la capacidad de navegar en reversa.

## ¿Qué está incluido?

Angular Aria incluye directivas con documentación completa, ejemplos funcionales y referencias de API para patrones interactivos comunes:

### Búsqueda y selección

| Componente                              | Descripción                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| [Autocomplete](guide/aria/autocomplete) | Entrada de texto con sugerencias filtradas que aparecen mientras los usuarios escriben |
| [Listbox](guide/aria/listbox)           | Listas de opciones de selección simple o múltiple con navegación por teclado |
| [Select](guide/aria/select)             | Patrón de dropdown de selección simple con navegación por teclado |
| [Multiselect](guide/aria/multiselect)   | Patrón de dropdown de selección múltiple con visualización compacta |
| [Combobox](guide/aria/combobox)         | Directiva primitiva que coordina una entrada de texto con un popup |

### Navegación y llamadas a acción

| Componente                    | Descripción                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| [Menu](guide/aria/menu)       | Menús desplegables con submenús anidados y atajos de teclado  |
| [Menubar](guide/aria/menubar) | Barra de navegación horizontal para menús de aplicación persistentes |
| [Toolbar](guide/aria/toolbar) | Conjuntos agrupados de controles con navegación lógica por teclado |

### Organización de contenido

| Componente                        | Descripción                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------- |
| [Accordion](guide/aria/accordion) | Paneles de contenido colapsables que pueden expandirse individualmente o exclusivamente |
| [Tabs](guide/aria/tabs)           | Interfaces con pestañas con modos de activación automática o manual          |
| [Tree](guide/aria/tree)           | Listas jerárquicas con funcionalidad de expandir/colapsar                    |
| [Grid](guide/aria/grid)           | Visualización de datos bidimensional con navegación celda por celda por teclado |

## Cuándo usar Angular Aria

Angular Aria funciona bien cuando necesitas componentes interactivos accesibles que sean compatibles con WCAG con estilos personalizados. Los ejemplos incluyen:

- **Construir un sistema de diseño** - Tu equipo mantiene una biblioteca de componentes con estándares visuales específicos que necesitan implementaciones accesibles
- **Bibliotecas de componentes empresariales** - Estás creando componentes reutilizables para múltiples aplicaciones dentro de una organización
- **Requisitos de marca personalizados** - La interfaz necesita coincidir con especificaciones de diseño precisas que las bibliotecas de componentes pre-estilizadas no pueden acomodar fácilmente

## Cuándo no usar Angular Aria

Angular Aria puede no encajar en todos los escenarios:

- **Componentes pre-estilizados** - Si necesitas componentes que se vean completos sin estilos personalizados, usa Angular Material en su lugar
- **Formularios simples** - Los controles de formulario HTML nativos como `<button>` e `<input type="radio">` proporcionan accesibilidad integrada para casos de uso sencillos
- **Prototipado rápido** - Al validar conceptos rápidamente, las bibliotecas de componentes pre-estilizadas reducen el tiempo de desarrollo inicial

## Próximos pasos

Consulta un componente desde el menú lateral o [lista arriba](#qué-está-incluido), o comienza con [Toolbar](guide/aria/toolbar) para ver un ejemplo completo de cómo funcionan las directivas de Angular Aria.
