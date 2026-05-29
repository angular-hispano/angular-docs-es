# Usando signals con servicios

Ahora que has aprendido [cómo usar el enlace bidireccional con model signals](/tutorials/signals/6-two-way-binding-with-model-signals), exploremos cómo usar signals con servicios de Angular. Los servicios son perfectos para compartir estado reactivo entre múltiples componentes, y los signals hacen esto aún más poderoso al proporcionar detección de cambios automática y patrones reactivos limpios.

En esta actividad, aprenderás cómo crear un carrito de compras (cart store) con signals que permita que el componente de visualización del carrito reaccione a los cambios de estado automáticamente.

<hr />

<docs-workflow>

<docs-step title="Agrega signals del cart store">
Agrega signals de solo lectura y computed para hacer reactivo el estado del carrito en `cart-store.ts`.

```ts
// Agregar la importación de computed
import {Injectable, signal, computed} from '@angular/core';

// Luego agrega estos signals a la clase:

// Signals de solo lectura
readonly cartItems = this.items.asReadonly();

// Computed signals
readonly totalQuantity = computed(() => {
  return this.items().reduce((sum, item) => sum + item.quantity, 0);
});

readonly totalPrice = computed(() => {
  return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

Estos signals permiten a los componentes acceder reactivamente a los datos del carrito y los totales calculados. El método `asReadonly()` evita que código externo modifique los items del carrito directamente, mientras que `computed()` crea estado derivado que se actualiza automáticamente cuando el signal fuente cambia.
</docs-step>

<docs-step title="Completa los métodos de actualización de cantidad">
El componente de visualización del carrito en `cart-display.ts` ya usa los signals del cart store en su plantilla. Completa los métodos de actualización de cantidad para modificar los items del carrito:

```ts
increaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem) {
    this.cartStore.updateQuantity(id, currentItem.quantity + 1);
  }
}

decreaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem && currentItem.quantity > 1) {
    this.cartStore.updateQuantity(id, currentItem.quantity - 1);
  }
}
```

Estos métodos leen el estado actual del carrito usando `cartItems()` y actualizan las cantidades a través de los métodos del store. ¡La UI se actualiza automáticamente cuando los signals cambian!
</docs-step>

<docs-step title="Actualiza el componente principal de la app">
Actualiza el componente principal de la app en `app.ts` para usar el servicio del carrito y mostrar el componente del carrito.

```angular-ts
import {Component, inject} from '@angular/core';
import {CartStore} from './cart-store';
import {CartDisplay} from './cart-display';

@Component({
  selector: 'app-root',
  imports: [CartDisplay],
  template: `
    <div class="shopping-app">
      <header>
        <h1>Signals with Services Demo</h1>
        <div class="cart-badge">
          Cart: {{ cartStore.totalQuantity() }} items (\${{ cartStore.totalPrice() }})
        </div>
      </header>

      <main>
        <cart-display></cart-display>
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  cartStore = inject(CartStore);
}
```

</docs-step>

</docs-workflow>

¡Excelente! Ahora has aprendido cómo usar signals con servicios. Conceptos clave para recordar:

- **Signals a nivel de servicio**: Los servicios pueden usar signals para gestionar estado reactivo
- **Inyección de dependencias**: Usa `inject()` para acceder a servicios con signals en componentes
- **Computed signals en servicios**: Crea estado derivado que se actualiza automáticamente
- **Signals de solo lectura**: Expone versiones de solo lectura de los signals para prevenir mutaciones externas

En la próxima lección, aprenderás sobre [cómo usar signals con directivas](/tutorials/signals/8-using-signals-with-directives)!
