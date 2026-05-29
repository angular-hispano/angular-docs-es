# Enlace bidireccional con model signals

Ahora que has aprendido [cómo pasar datos a componentes con input signals](/tutorials/signals/5-component-communication-with-signals), exploremos la API `model()` de Angular para el enlace bidireccional. Los model signals son perfectos para componentes de UI como checkboxes, sliders o controles de formulario personalizados donde el componente necesita tanto recibir un valor como actualizarlo.

En esta actividad, crearás un componente de checkbox personalizado que gestiona su propio estado mientras mantiene sincronizado al padre.

<hr />

<docs-workflow>

<docs-step title="Configura el checkbox personalizado con model signal">
Crea un model signal en el componente `custom-checkbox` que pueda tanto recibir como actualizar el valor del padre.

```ts
// Agregar importaciones para model signals
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';

// Model signal para enlace bidireccional
checked = model.required<boolean>();

// Input opcional para la etiqueta
label = input<string>('');
```

A diferencia de los signals `input()` que son de solo lectura, los signals `model()` pueden ser tanto leídos como escritos.
</docs-step>

<docs-step title="Crea la plantilla del checkbox">
Construye la plantilla del checkbox que responde a clics y actualiza su propio model.

```html
<label class="custom-checkbox">
  <input
    type="checkbox"
    [checked]="checked()"
    (change)="toggle()">
  <span class="checkmark"></span>
  {{ label() }}
</label>
```

El componente lee de su model signal y tiene un método para actualizarlo.
</docs-step>

<docs-step title="Agrega el método toggle">
Implementa el método toggle que actualiza el model signal cuando se hace clic en el checkbox.

```ts
toggle() {
  // ¡Esto actualiza TANTO el estado del componente COMO el model del padre!
  this.checked.set(!this.checked());
}
```

Cuando el componente hijo llama a `this.checked.set()`, automáticamente propaga el cambio de vuelta al padre. Esta es la diferencia clave con los signals `input()`.
</docs-step>

<docs-step title="Configura el enlace bidireccional en el padre">
Primero, descomenta las propiedades y métodos de model signal en `app.ts`:

```ts
// Model signals del padre
agreedToTerms = model(false);
enableNotifications = model(true);

// Métodos para probar el enlace bidireccional
toggleTermsFromParent() {
  this.agreedToTerms.set(!this.agreedToTerms());
}

resetAll() {
  this.agreedToTerms.set(false);
  this.enableNotifications.set(false);
}
```

Luego actualiza la plantilla:

Parte 1. **Descomenta los checkboxes y agrega enlace bidireccional:**

- Reemplaza `___ADD_TWO_WAY_BINDING___` con `[(checked)]="agreedToTerms"` para el primer checkbox
- Reemplaza `___ADD_TWO_WAY_BINDING___` con `[(checked)]="enableNotifications"` para el segundo

Parte 2. **Reemplaza los placeholders `???` con bloques @if:**

```angular-html
@if (agreedToTerms()) {
  Yes
} @else {
  No
}

@if (enableNotifications()) {
  Yes
} @else {
  No
}
```

Parte 3. **Agrega manejadores de clic a los botones:**

```html
<button (click)="toggleTermsFromParent()">Toggle Terms from Parent</button>
<button (click)="resetAll()">Reset All</button>
```

La sintaxis `[(checked)]` crea un enlace bidireccional — los datos fluyen hacia el componente Y los cambios fluyen de vuelta al padre emitiendo un evento que referencia el signal mismo y _no_ llama al getter del signal directamente.
</docs-step>

<docs-step title="Prueba el enlace bidireccional">
Interactúa con tu aplicación para ver el enlace bidireccional en acción:

1. **Haz clic en los checkboxes** - El componente actualiza su propio estado y notifica al padre
2. **Haz clic en "Toggle Terms from Parent"** - Las actualizaciones del padre se propagan al componente
3. **Haz clic en "Reset All"** - El padre reinicia ambos models y los componentes se actualizan automáticamente

¡Tanto el padre como el hijo pueden actualizar el estado compartido, y ambos se mantienen sincronizados automáticamente!
</docs-step>

</docs-workflow>

¡Perfecto! Has aprendido cómo los model signals permiten el enlace bidireccional:

- **Model signals** - Usa `model()` y `model.required()` para valores que pueden ser tanto leídos como escritos
- **Enlace bidireccional** - Usa la sintaxis `[(property)]` para enlazar signals del padre a models del hijo
- **Perfecto para componentes de UI** - Checkboxes, controles de formulario y widgets que necesitan gestionar su propio estado
- **Sincronización automática** - Padre e hijo se mantienen sincronizados sin manejo manual de eventos

**Cuándo usar `model()` vs `input()`:**

- Usa `input()` para datos que solo fluyen hacia abajo (datos de visualización, configuración)
- Usa `model()` para componentes de UI que necesitan actualizar su propio valor (controles de formulario, toggles)

En la próxima lección, aprenderás sobre [cómo usar signals con servicios](/tutorials/signals/7-using-signals-with-services)!
