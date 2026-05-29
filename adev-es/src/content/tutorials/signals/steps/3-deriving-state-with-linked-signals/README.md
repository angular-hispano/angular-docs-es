# Derivando estado con linked signals

Ahora que has aprendido [cómo derivar estado con computed signals](/tutorials/signals/2-deriving-state-with-computed-signals), creaste un computed signal para `notificationsEnabled` que seguía automáticamente tu estado de usuario. Pero ¿qué pasa si los usuarios quieren deshabilitar manualmente las notificaciones incluso cuando están en línea? Ahí es donde entran los linked signals.

Los linked signals son signals editables que mantienen una conexión reactiva con sus signals fuente. Son perfectos para crear estado que normalmente sigue un cómputo pero puede ser anulado cuando sea necesario.

En esta actividad, aprenderás cómo `linkedSignal()` se diferencia de `computed()` mejorando el computed `notificationsEnabled` del sistema de estado de usuario anterior a un linked signal editable.

<hr />

<docs-workflow>

<docs-step title="Importa la función linkedSignal">
Agrega `linkedSignal` a tus importaciones existentes.

```ts
// Agregar linkedSignal a las importaciones existentes
import {Component, signal, computed, linkedSignal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Convierte computed a linkedSignal con la misma expresión">
Reemplaza el computed `notificationsEnabled` con un linkedSignal usando exactamente la misma expresión:

```ts
// Anteriormente (de la lección 2):
// notificationsEnabled = computed(() => this.userStatus() === 'online');

// Ahora con linkedSignal - misma expresión, pero editable:
notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');
```

La expresión es idéntica, pero linkedSignal crea un signal editable. Se seguirá actualizando automáticamente cuando `userStatus` cambie, pero también puedes establecerlo manualmente.
</docs-step>

<docs-step title="Agrega un método para alternar notificaciones manualmente">
Agrega un método para demostrar que los linked signals pueden escribirse directamente:

```ts
toggleNotifications() {
  // Esto funciona con linkedSignal pero daría error con computed!
  this.notificationsEnabled.set(!this.notificationsEnabled());
}
```

Esta es la diferencia clave: los computed signals son de solo lectura, pero los linked signals pueden actualizarse manualmente mientras mantienen su conexión reactiva.
</docs-step>

<docs-step title="Actualiza la plantilla para agregar control manual de notificaciones">
Actualiza tu plantilla para agregar un botón de alternancia para notificaciones:

```angular-html
<div class="status-info">
  <div class="notifications">
    <strong>Notifications:</strong>
    @if (notificationsEnabled()) {
      Enabled
    } @else {
      Disabled
    }
    <button (click)="toggleNotifications()" class="override-btn">
      @if (notificationsEnabled()) {
        Disable
      } @else {
        Enable
      }
    </button>
  </div>
  <!-- los divs existentes de mensaje y horario laboral permanecen -->
</div>
```

</docs-step>

<docs-step title="Observa el comportamiento reactivo">
Ahora prueba el comportamiento:

1. Cambia el estado del usuario - observa cómo `notificationsEnabled` se actualiza automáticamente
2. Alterna manualmente las notificaciones - anula el valor computed
3. Cambia el estado nuevamente - el linked signal se re-sincroniza con su cómputo

¡Esto demuestra que los linked signals mantienen su conexión reactiva incluso después de ser establecidos manualmente!
</docs-step>

</docs-workflow>

¡Excelente! Has aprendido las diferencias clave entre computed y linked signals:

- **Computed signals**: Solo lectura, siempre derivados de otros signals
- **Linked signals**: Editables, pueden ser tanto derivados como actualizados manualmente
- **Usa computed cuando**: El valor siempre debe ser calculado
- **Usa linkedSignal cuando**: Necesitas un cómputo predeterminado que pueda ser anulado

En la próxima lección, aprenderás [cómo gestionar datos asíncronos con signals](/tutorials/signals/4-managing-async-data-with-signals)!
