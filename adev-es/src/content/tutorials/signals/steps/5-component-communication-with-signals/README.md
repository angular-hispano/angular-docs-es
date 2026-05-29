# Pasando datos a componentes con input signals

Ahora que has aprendido [cómo gestionar datos asíncronos con signals](/tutorials/signals/4-managing-async-data-with-signals), exploremos la API `input()` basada en signals de Angular para pasar datos de componentes padre a hijo, haciendo que el flujo de datos del componente sea más reactivo y eficiente. Si estás familiarizado con las props de componentes de otros frameworks, los inputs son la misma idea.

En esta actividad, agregarás signal inputs a un componente de tarjeta de producto y verás cómo los datos del padre fluyen hacia abajo de forma reactiva.

<hr />

<docs-workflow>

<docs-step title="Agrega signal inputs a ProductCard">
Agrega funciones `input()` de signal para recibir datos en el componente `product-card`.

```ts
// Agregar importaciones para signal inputs
import {Component, input, ChangeDetectionStrategy} from '@angular/core';

// Agregar estos signal inputs
name = input.required<string>();
price = input.required<number>();
available = input<boolean>(true);
```

Observa cómo `input.required()` crea un input que debe ser proporcionado, mientras que `input()` con un valor predeterminado es opcional.
</docs-step>

<docs-step title="Conecta los inputs a la plantilla">
Actualiza la plantilla en `product-card` para mostrar los valores de los signal inputs.

```angular-html
<div class="product-card">
  <h3>{{ name() }}</h3>
  <p class="price">\${{ price() }}</p>
  <p class="status">Status:
    @if (available()) {
      Available
    } @else {
      Out of Stock
    }
  </p>
</div>
```

Los input signals funcionan igual que los signals regulares en las plantillas — llámalos como funciones para acceder a sus valores.
</docs-step>

<docs-step title="Conecta signals del padre a inputs del hijo">
Actualiza el uso de `product-card` en `app.ts` para pasar valores dinámicos de signals en lugar de valores estáticos.

```html
<!-- Cambiar de valores estáticos: -->
<product-card
  name="Static Product"
  price="99"
  available="true"
/>

<!-- A signals dinámicos: -->
<product-card
  [name]="productName()"
  [price]="productPrice()"
  [available]="productAvailable()"
/>
```

Los corchetes `[]` crean enlaces de propiedad que pasan los valores actuales de los signals al hijo.
</docs-step>

<docs-step title="Prueba las actualizaciones reactivas">
Agrega métodos en `app.ts` para actualizar los signals del padre y ver cómo el componente hijo reacciona automáticamente.

```ts
updateProduct() {
  this.productName.set('Updated Product');
  this.productPrice.set(149);
}

toggleAvailability() {
  this.productAvailable.set(!this.productAvailable());
}
```

```html
<!-- Agregar controles para probar la reactividad -->
<div class="controls">
  <button (click)="updateProduct()">Update Product Info</button>
  <button (click)="toggleAvailability()">Toggle Availability</button>
</div>
```

¡Cuando los signals del padre cambian, el componente hijo recibe y muestra automáticamente los nuevos valores!
</docs-step>

</docs-workflow>

¡Excelente! Has aprendido cómo funcionan los signal inputs:

- **Signal inputs** - Usa `input()` y `input.required()` para recibir datos de componentes padre
- **Actualizaciones reactivas** - Los componentes hijo se actualizan automáticamente cuando los valores de los signals del padre cambian
- **Seguridad de tipos** - Los signal inputs proporcionan verificación de tipos completa de TypeScript
- **Valores predeterminados** - Los inputs opcionales pueden tener valores predeterminados mientras que los inputs requeridos deben ser proporcionados

Los signal inputs hacen que la comunicación entre componentes sea más reactiva y eliminan la necesidad de los hooks de ciclo de vida `OnChanges` en muchos casos.

En la próxima lección, aprenderás sobre [el enlace bidireccional con model signals](/tutorials/signals/6-two-way-binding-with-model-signals)!
