# Consulta elementos hijos con signal queries

Ahora que has aprendido [cómo usar signals con directivas](/tutorials/signals/8-using-signals-with-directives), exploremos las APIs de consulta basadas en signals. Estas proporcionan una forma reactiva de acceder e interactuar con componentes y directivas hijos. Tanto los componentes como las directivas pueden realizar consultas mientras también pueden ser consultados ellos mismos. A diferencia del tradicional ViewChild, las signal queries se actualizan automáticamente y proporcionan acceso seguro con tipos a componentes y directivas hijos.

En esta actividad, agregarás consultas viewChild para interactuar con componentes hijos programáticamente.

<hr />

<docs-workflow>

<docs-step title="Agrega la importación de viewChild">
Primero, agrega la importación de `viewChild` para acceder a componentes hijos en `app.ts`.

```ts
import {Component, signal, computed, viewChild, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Crea consultas viewChild">
Agrega consultas viewChild al componente App para acceder a componentes hijos.

```ts
// APIs de consulta para acceder a componentes hijos
firstProduct = viewChild(ProductCard);
cartSummary = viewChild(CartSummary);
```

Estas consultas crean signals que referencian instancias de componentes hijos.
</docs-step>

<docs-step title="Implementa métodos del padre">
Usa las consultas viewChild para llamar métodos en componentes hijos en `app.ts`:

```ts
showFirstProductDetails() {
  const product = this.firstProduct();
  if (product) {
    product.highlight();
  }
}

initiateCheckout() {
  const summary = this.cartSummary();
  if (summary) {
    summary.initiateCheckout();
  }
}
```

</docs-step>

<docs-step title="Prueba las interacciones">
Los botones de control ahora deberían funcionar:

- **"Show First Product Details"** - Llama a `highlight()` en el ProductCard
- **"Initiate Checkout"** - Llama a `initiateCheckout()` en el CartSummary

Haz clic en los botones para ver cómo las consultas viewChild permiten que los componentes padre controlen el comportamiento de los hijos.
</docs-step>

</docs-workflow>

¡Perfecto! Has aprendido cómo usar las APIs de consulta basadas en signals para la interacción con componentes hijos.

En la próxima lección, aprenderás sobre [cómo reaccionar a cambios de signal con effect](/tutorials/signals/10-reacting-to-signal-changes-with-effect)!
