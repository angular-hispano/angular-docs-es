# Drag and drop (arrastrar y soltar)

## Visión General
Esta página describe las directivas de drag and drop que te permiten crear rápidamente interfaces de drag and drop con lo siguiente:
- Arrastre libre
- Crear una lista de elementos arrastrables reordenables
- Transferir elementos arrastrables entre listas
- Animaciones de arrastre
- Bloquear elementos arrastrables a lo largo de un eje o elemento
- Añadir manejadores de arrastre personalizados
- Añadir vistas previas al arrastrar
- Añadir marcadores de posición (placeholders) de arrastre personalizados

Para la referencia completa de la API, consulta la [página de referencia de la API de drag and drop del Angular CDK](api#angular_cdk_drag-drop).

## Antes de comenzar

### Instalación del CDK

El [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) es un conjunto de primitivas de comportamiento para construir componentes. Para usar las directivas de drag and drop, primero instala `@angular/cdk` desde npm. Puedes hacerlo desde tu terminal usando Angular CLI:

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

### Importando drag and drop

Para usar drag and drop, importa lo que necesites de las directivas en tu componente.

<docs-code language="typescript">
import {Component} from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'my-custom-component',
  templateUrl: 'my-custom-component.html',
  standalone: true,
  imports: [CdkDrag],
})
export class DragDropExample {}
</docs-code>

## Crear elementos arrastrables

Puedes hacer que cualquier elemento sea arrastrable agregando la directiva `cdkDrag`. Por defecto, todos los elementos arrastrables soporta arrastre libre.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/overview/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.css"/>
</docs-code-multifile>


## Crear una lista de elementos arrastrables reordenables

Añade la directiva `cdkDropList` a un elemento padre para agrupar elementos arrastrables en una colección reordenable. Esto define dónde se pueden soltar los elementos arrastrables. Los elementos arrastrables en el grupo de la lista (drop list) se reorganizan automáticamente cuando un elemento se mueve.

Las directivas de drag and drop no actualizan tu modelo de datos. Para actualizar el modelo de datos, escucha el evento `cdkDropListDropped` (una vez que el usuario termina de arrastrar) y actualiza el modelo de datos manualmente.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.css"/>
</docs-code-multifile>

Puedes usar el token de inyección `CDK_DROP_LIST` que se puede usar para referenciar instancias de `cdkDropList`. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di) y la [API del token de inyección de lista (drop list)](api/cdk/drag-drop/CDK_DROP_LIST).

## Transferir elementos arrastrables entre listas (drop lists)

La directiva `cdkDropList` soporta transferir elementos arrastrables entre listas conectadas (connected drop lists). Hay dos formas de conectar una o más instancias de `cdkDropList`:
- Establecer la propiedad `cdkDropListConnectedTo` a otra lista (drop list).
- Envolver los elementos en un elemento con el atributo `cdkDropListGroup`.

La directiva `cdkDropListConnectedTo` funciona tanto con una referencia directa a otro `cdkDropList` como referenciando el id de otro contenedor (drop container).

<docs-code language="html">
<!-- This is valid -->
<div cdkDropList #listOne="cdkDropList" [cdkDropListConnectedTo]="[listTwo]"></div>
<div cdkDropList #listTwo="cdkDropList" [cdkDropListConnectedTo]="[listOne]"></div>

<!-- This is valid as well -->
<div cdkDropList id="list-one" [cdkDropListConnectedTo]="['list-two']"></div>
<div cdkDropList id="list-two" [cdkDropListConnectedTo]="['list-one']"></div>
</docs-code>

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.css"/>
</docs-code-multifile>

Usa la directiva `cdkDropListGroup` si tienes un número desconocido de listas conectadas (connected drop lists) para establecer la conexión automáticamente. Cualquier nuevo `cdkDropList` que se agregue bajo un grupo se conecta automáticamente a todas las otras listas.

<docs-code language="html">
<div cdkDropListGroup>
  <!-- Todas las listas aquí estarán conectadas. -->
  @for (list of lists; track list) {
    <div cdkDropList></div>
  }
</div>
</docs-code>

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.css"/>
</docs-code-multifile>

Puedes usar el token de inyección `CDK_DROP_LIST_GROUP` que se puede usar para referenciar instancias de `cdkDropListGroup`. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di) y la [API del token de inyección del grupo de lista (drop list)](api/cdk/drag-drop/CDK_DROP_LIST_GROUP).

### Arrastre selectivo

Por defecto, un usuario puede mover elementos `cdkDrag` de un contenedor a otro contenedor conectado. Para un control más granular sobre qué elementos se pueden soltar en un contenedor, usa `cdkDropListEnterPredicate`. Angular llama al predicado cada vez que un elemento arrastrable entra en un nuevo contenedor. Dependiendo de si el predicado devuelve true o false, el elemento puede o no ser permitido en el nuevo contenedor.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.css"/>
</docs-code-multifile>

## Adjuntar datos

Puedes asociar algunos datos arbitrarios tanto con `cdkDrag` como con `cdkDropList` estableciendo `cdkDragData` o `cdkDropListData`, respectivamente. Puedes vincular a los eventos disparados desde ambas directivas que incluirán estos datos, permitiéndote identificar fácilmente el origen de la interacción de arrastre o soltar.

<docs-code language="html">
@for (list of lists; track list) {
  <div cdkDropList [cdkDropListData]="list" (cdkDropListDropped)="drop($event)">
    @for (item of list; track item) {
      <div cdkDrag [cdkDragData]="item"></div>
    }
  </div>
}
</docs-code>

## Personalizaciones de arrastre

### Personalizar el manejador de arrastre

Por defecto, el usuario puede arrastrar todo el elemento `cdkDrag` para moverlo. Para restringir al usuario a que solo pueda hacerlo usando un elemento manejador, añade la directiva `cdkDragHandle` a un elemento dentro de `cdkDrag`. Puedes tener tantos elementos `cdkDragHandle` como desees.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.css"/>
</docs-code-multifile>


Puedes usar el token de inyección `CDK_DRAG_HANDLE` que se puede usar para referenciar instancias de `cdkDragHandle`. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di) y la [API del token de inyección de manejador de arrastre](api/cdk/drag-drop/CDK_DRAG_HANDLE).

### Personalizar vista previa de arrastre

Un elemento de vista previa se vuelve visible cuando un elemento `cdkDrag` está siendo arrastrado. Por defecto, la vista previa es un clon del elemento original posicionado junto al cursor del usuario.

Para personalizar la vista previa, proporciona una plantilla personalizada a través de `*cdkDragPreview`. La vista previa personalizada no coincidirá con el tamaño del elemento original arrastrado ya que no se hacen suposiciones sobre el contenido del elemento. Para que coincida con el tamaño del elemento para la vista previa de arrastre, pasa true al input `matchSize`.

El elemento clonado elimina su atributo id para evitar tener múltiples elementos con el mismo id en la página. Esto hará que cualquier CSS que apunte a ese id no se aplique.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.css"/>
</docs-code-multifile>

Puedes usar el token de inyección `CDK_DRAG_PREVIEW` que se puede usar para referenciar instancias de `cdkDragPreview`. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di) y la [API del token de inyección de vista previa de arrastre](api/cdk/drag-drop/CDK_DRAG_PREVIEW).

### Personalizar punto de inserción de arrastre 

Por defecto, Angular inserta la vista previa de `cdkDrag` en el `<body>` de la página para evitar problemas con el posicionamiento y el desbordamiento. Esto puede no ser deseable en algunos casos porque la vista previa no tendrá sus estilos heredados aplicados.

Puedes cambiar dónde Angular inserta la vista previa usando el input `cdkDragPreviewContainer` en `cdkDrag`. Los valores posibles son:

| Valor                         | Descripción                                                                             | Ventajas                                                                                                                  | Desventajas                                                                                                                                                             |
|:---                           |:---                                                                                     |:---                                                                                                                         |:---                                                                                                                                                                       |
| `global`                      | Valor por defecto. Angular inserta la vista previa en el <body> o en el shadow root (shadow root (raíz de sombra)) más cercano.  | La vista previa no se verá afectada por `z-index` o `overflow: hidden`. Tampoco afectará selectores `:nth-child` y layouts flex. | No retiene estilos heredados.                                                                                                                                          |
| `parent`                      | Angular inserta la vista previa dentro del padre del elemento que está siendo arrastrado.     | La vista previa hereda los mismos estilos que el elemento arrastrado.                                                                    | La vista previa puede ser recortada por `overflow: hidden` o colocada debajo de otros elementos debido a `z-index`. Además, puede afectar selectores `:nth-child` y algunos layouts flex. |
| `ElementRef` or `HTMLElement` | Angular inserta la vista previa en el elemento especificado.                                 | PLa vista previa hereda estilos del elemento contenedor especificado.                                                               | La vista previa puede ser recortada por `overflow: hidden` o colocada debajo de otros elementos debido a `z-index`. Además, puede afectar selectores `:nth-child` y algunos layouts flex. |

Alternativamente, puedes modificar el token de inyección `CDK_DRAG_CONFIG` para actualizar `previewContainer` dentro de la configuración si el valor es `global` o `parent`. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di), la [API del token de inyección de configuración de arrastre](api/cdk/drag-drop/CDK_DRAG_CONFIG), y la [API de configuración de drag and drop](api/cdk/drag-drop/DragDropConfig).

### Personalizar marcador de posición de arrastre 

Mientras un elemento `cdkDrag` está siendo arrastrado, la directiva crea un elemento marcador de posición que muestra dónde se colocará el elemento cuando se suelte. Por defecto, el marcador de posición es un clon del elemento que está siendo arrastrado. Puedes reemplazar el marcador de posición con uno personalizado usando la directiva `*cdkDragPlaceholder`:

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.css"/>
</docs-code-multifile>

Puedes usar el token de inyección `CDK_DRAG_PLACEHOLDER` que se puede usar para referenciar instancias de `cdkDragPlaceholder`. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di) y la [API del token de inyección de marcador de posición de arrastre](api/cdk/drag-drop/CDK_DRAG_PLACEHOLDER).

### Personalizar elemento raíz de arrastre

Establece el atributo `cdkDragRootElement` si hay un elemento que quieres hacer arrastrable pero no tienes acceso directo a él.

El atributo acepta un selector y busca en el DOM hasta encontrar un elemento que coincida con el selector. Si se encuentra un elemento, se vuelve arrastrable. Esto es útil para casos como hacer un diálogo arrastrable.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, puedes modificar el token de inyección `CDK_DRAG_CONFIG` para actualizar `rootElementSelector` dentro de la configuración. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di), la [API del token de inyección de configuración de arrastre](api/cdk/drag-drop/CDK_DRAG_CONFIG), y la [API de configuración de drag and drop](api/cdk/drag-drop/DragDropConfig).

### Establecer la posición DOM de un elemento arrastrable 

Por defecto, los elementos `cdkDrag` que no están en un `cdkDropList` se mueven de su posición DOM normal solo cuando un usuario mueve manualmente el elemento. Usa el input `cdkDragFreeDragPosition` para establecer explícitamente la posición del elemento. Un caso de uso común para esto es restaurar la posición de un elemento arrastrable después de que un usuario ha navegado y luego regresado.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.css"/>
</docs-code-multifile>

### Restrict movement within an element

To stop the user from being able to drag a `cdkDrag` element outside of another element, pass a CSS selector to the `cdkDragBoundary` attribute. This attribute accepts a selector and looks up the DOM until it finds an element that matches it. If a match is found, the element becomes the boundary that the draggable element can't be dragged outside of `cdkDragBoundary` can also be used when `cdkDrag` is placed inside a `cdkDropList`.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.css"/>
</docs-code-multifile>

Alternatively, you can modify the `CDK_DRAG_CONFIG` injection token to update boundaryElement within the config. For more information see the [dependency injection guide](https://angular.dev/guide/di), [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG), and the [drag drop config API](api/cdk/drag-drop/DragDropConfig).

### Restringir movimiento a lo largo de un eje

Por defecto, `cdkDrag` permite movimiento libre en todas las direcciones. Para restringir el arrastre a un eje específico, establece `cdkDragLockAxis` a "x" o "y" en `cdkDrag`. Para restringir el arrastre para múltiples elementos arrastrables dentro de `cdkDropList`, establece `cdkDropListLockAxis` en `cdkDropList` en su lugar.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, puedes modificar el token de inyección `CDK_DRAG_CONFIG` para actualizar `lockAxis` dentro de la configuración. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di), la [API del token de inyección de configuración de arrastre](api/cdk/drag-drop/CDK_DRAG_CONFIG), y la [API de configuración de drag and drop](api/cdk/drag-drop/DragDropConfig).

### Retrasar el arrastre

Por defecto, cuando el usuario presiona su puntero en un `cdkDrag`, comienza la secuencia de arrastre. Este comportamiento puede no ser deseable en casos como elementos arrastrables de pantalla completa en dispositivos táctiles donde el usuario podría activar accidentalmente un evento de arrastre mientras hace scroll en la página.

Puedes retrasar la secuencia de arrastre usando el input `cdkDragStartDelay`. El input espera a que el usuario mantenga presionado su puntero durante el número especificado de milisegundos antes de arrastrar el elemento.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.css"/>
</docs-code-multifile>

Alternatively, you can modify the `CDK_DRAG_CONFIG` injection token to update dragStartDelay within the config. For more information see the [dependency injection guide](https://angular.dev/guide/di), [drag config injection token API](api/cdk/drag-drop/CDK_DRAG_CONFIG), and the [drag drop config API](api/cdk/drag-drop/DragDropConfig).

### Deshabilitar el arrastre 

Si quieres deshabilitar el arrastre para un elemento de arrastre particular, establece el input `cdkDragDisabled` en un elemento `cdkDrag` a true o false. Puedes deshabilitar una lista completa usando el input `cdkDropListDisabled` en un `cdkDropList`. También es posible deshabilitar una manija específica a través de `cdkDragHandleDisabled` en `cdkDragHandle`.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, puedes modificar el token de inyección `CDK_DRAG_CONFIG` para actualizar `draggingDisabled` dentro de la configuración. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di), la [API del token de inyección de configuración de arrastre](api/cdk/drag-drop/CDK_DRAG_CONFIG), y la [API de configuración de drag and drop](api/cdk/drag-drop/DragDropConfig).

## Personalizaciones de ordenamiento

### Orientación de lista

Por defecto, la directiva `cdkDropList` asume que las listas son verticales. Esto se puede cambiar estableciendo la propiedad `cdkDropListOrientation` a horizontal.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, puedes modificar el token de inyección `CDK_DRAG_CONFIG` para actualizar `listOrientation` dentro de la configuración. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di), la [API del token de inyección de configuración de arrastre](api/cdk/drag-drop/CDK_DRAG_CONFIG), y la [API de configuración de drag and drop](api/cdk/drag-drop/DragDropConfig).

### Envoltura de la lista

Por defecto, el `cdkDropList` ordena los elementos arrastrables moviéndolos usando una transformación CSS. Esto permite que el ordenamiento sea animado, lo que proporciona una mejor experiencia de usuario. Sin embargo, esto también viene con la desventaja de que la lista (drop list) funciona solo en una dirección: vertical u horizontalmente.

Si tienes una lista ordenable que necesita envolverse en nuevas líneas, puedes establecer el atributo `cdkDropListOrientation` a `mixed`. Esto hace que la lista use una estrategia diferente de ordenamiento de elementos que implica moverlos en el DOM. Sin embargo, la lista ya no puede animar la acción de ordenamiento.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.css"/>
</docs-code-multifile>

### Ordenamiento selectivo

Por defecto, los elementos `cdkDrag` se ordenan en cualquier posición dentro de un `cdkDropList`. Para cambiar este comportamiento, establece el atributo `cdkDropListSortPredicate` que toma una función. La función predicado se llama cada vez que un elemento arrastrable está a punto de ser movido a un nuevo índice dentro de la lista (drop list). Si el predicado devuelve true, el elemento se moverá al nuevo índice, de lo contrario mantendrá su posición actual.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.css"/>
</docs-code-multifile>


### Deshabilitar ordenamiento 

Hay casos donde los elementos arrastrables pueden ser arrastrados de un `cdkDropList` a otro, sin embargo, el usuario no debería poder ordenarlos dentro de la lista de origen. Para estos casos, agrega el atributo `cdkDropListSortingDisabled` para evitar que los elementos arrastrables en un `cdkDropList` se ordenen. Esto preserva la posición inicial del elemento arrastrado en la lista de origen si no se arrastra a una nueva posición válida.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, puedes modificar el token de inyección `CDK_DRAG_CONFIG` para actualizar `sortingDisabled` dentro de la configuración. Para más información consulta la [guía de inyección de dependencias](https://angular.dev/guide/di), la [API del token de inyección de configuración de arrastre](api/cdk/drag-drop/CDK_DRAG_CONFIG), y la [API de configuración de drag and drop](api/cdk/drag-drop/DragDropConfig).

### Copying items between lists

By default, when an item is dragged from one list to another, it is moved out of its original list. However, you can configure the directives to copy the item, leaving the original item in the source list.

To enable copying, you can set the `cdkDropListHasAnchor` input. This tells the `cdkDropList` to create an "anchor" element that stays in the original container and doesn't move with the item. If the user moves the item back into the original container, the anchor is removed automatically. The anchor element can be styled by targeting the `.cdk-drag-anchor` CSS class.

Combining `cdkDropListHasAnchor` with `cdkDropListSortingDisabled` makes it possible to construct a list from which a user can copy items without being able to reorder the source list (e.g. a product list and a shopping cart).

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.css"/>
</docs-code-multifile>

## Personalizar animaciones

Drag and drop soporta animaciones tanto para:
- Ordenar un elemento arrastrable dentro de una lista
- Mover el elemento arrastrable desde la posición donde el usuario lo soltó a la posición final dentro de la lista

Para configurar tus animaciones, define una transición CSS que apunte a la propiedad transform. Las siguientes clases se pueden usar para animaciones:

| Nombre de la clase CSS      | Resultado de añadir la transición                                                                                                                                                                                 |
|:---                 |:---                                                                                                                                                                                                         |
| .cdk-drag           | Anima los elementos arrastrables a medida que se ordenan.                                                                                                                                                        |
| .cdk-drag-animating | Animar el elemento arrastrable desde su posición soltada a la posición final dentro del `cdkDropList`.<br><br>Esta clase CSS se aplica a un elemento `cdkDrag` solo cuando la acción de arrastre se ha detenido.  |

## Styling

Tanto las directivas `cdkDrag` como `cdkDropList` solo aplican estilos esenciales necesarios para la funcionalidad. Las aplicaciones pueden personalizar sus estilos apuntando a estas clases CSS especificadas.


| Nombre de la clase CSS            | Descripción                                                                                                                                                                                                                                                                                             |
|:---                       |:---                                                                                                                                                                                                                                                                                                     |
| .cdk-drop-list            | Selector para los elementos contenedores de `cdkDropList`.                                                                                                                                                                                                                                                      |
| .cdk-drag                 | Selector para elementos `cdkDrag`.                                                                                                                                                                                                                                                                        |
| .cdk-drag-disabled        | Selector para elementos `cdkDrag` deshabilitados.                                                                                                                                                                                                                                                               |
| .cdk-drag-handle          | Selector para el elemento host del `cdkDragHandle`.                                                                                                                                                                                                                                                   |
| .cdk-drag-preview         | Selector para el elemento de vista previa de arrastre. Este es el elemento que aparece junto al cursor cuando un usuario arrastra un elemento en una lista ordenable.<br><br>El elemento se ve exactamente como el elemento que está siendo arrastrado a menos que se personalice con una plantilla personalizada a través de `*cdkDragPreview`.                   |
| .cdk-drag-placeholder     | Selector para el elemento marcador de posición de arrastre. Este es el elemento que se muestra en el lugar donde el elemento arrastrable será arrastrado una vez que termine la acción de arrastre.<br><br>Este elemento se ve exactamente como el elemento que está siendo ordenado a menos que se personalice con la directiva cdkDragPlaceholder. |
| .cdk-drop-list-dragging   | Selector para el elemento contenedor de `cdkDropList` que tiene un elemento arrastrable actualmente siendo arrastrado.                                                                                                                                                                                                      |
| .cdk-drop-list-disabled   | Selector para elementos contenedores de `cdkDropList` que están deshabilitados.                                                                                                                                                                                                                                        |
| .cdk-drop-list-receiving  | Selector para el elemento contenedor de `cdkDropList` que tiene un elemento arrastrable que puede recibir de una lista de soltar conectada que está actualmente siendo arrastrado.                                                                                                                                                    |
| .cdk-drag-anchor          | Selector para elemento de aclaje que se crea cuado `cdkDropListHasAnchor` está habilitado. Este elemento indica la posición desde la cual comenzó el arrastre del elemento                          |

## Arrastrado en un contenedor desplazable

Si tus elementos arrastrables están dentro de un contenedor desplazable (por ejemplo, un `div` con `overflow: auto`), el desplazamiento automático no funcionará a menos que el contenedor desplazable tenga la directiva `cdkScrollable`. Sin esta directiva, el CDK no puede detectar ni controlar el comportamiento de desplazamiento del contenedor durante las operaciones de arrastre.

## Integraciones con otros componentes

La funcionalidad de arrastrar y soltar del CDK puede integrarse con diferentes componentes. Los casos de uso más comunes incluyen componentes `MatTable` ordenables y componentes `MatTabGroup` ordenables.
