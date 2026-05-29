# Derivando estado con computed signals

Ahora que has aprendido [cómo crear y actualizar signals](/tutorials/signals/1-creating-and-updating-your-first-signal), aprendamos sobre los computed signals. Los computed signals son valores derivados que se actualizan automáticamente cuando sus dependencias cambian. Son perfectos para crear cálculos reactivos basados en otros signals.

En esta actividad, aprenderás cómo usar la función `computed()` para crear estado derivado que se actualiza automáticamente cuando los signals subyacentes cambian.

Mejoremos nuestro sistema de estado de usuario agregando valores computed que deriven información de nuestro signal de estado de usuario. El código inicial ahora incluye tres opciones de estado: `'online'`, `'away'` y `'offline'`.

<hr />

<docs-workflow>

<docs-step title="Importa la función computed">
Agrega `computed` a tus importaciones existentes.

```ts
// Agregar computed a las importaciones existentes
import {Component, signal, computed, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Crea un computed signal para notificaciones">
Agrega un computed signal que determine si las notificaciones deberían estar habilitadas según el estado del usuario.

```ts
notificationsEnabled = computed(() => this.userStatus() === 'online');
```

Este computed signal se recalculará automáticamente cada vez que el signal `userStatus` cambie. Observa cómo llamamos `this.userStatus()` dentro de la función computed para leer el valor del signal.
</docs-step>

<docs-step title="Crea un computed signal para un mensaje descriptivo">
Agrega un computed signal que cree un mensaje descriptivo basado en el estado del usuario.

```ts
statusMessage = computed(() => {
  const status = this.userStatus();
  switch (status) {
    case 'online': return 'Available for meetings and messages';
    case 'away': return 'Temporarily away, will respond soon';
    case 'offline': return 'Not available, check back later';
    default: return 'Status unknown';
  }
});
```

Esto muestra cómo los computed signals pueden manejar lógica más compleja con sentencias switch y transformaciones de strings.
</docs-step>

<docs-step title="Crea un computed signal que calcule disponibilidad de horario laboral">
Agrega un computed signal que calcule si el usuario está dentro de su horario laboral.

```ts
isWithinWorkingHours = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const isWeekday = now.getDay() > 0 && now.getDay() < 6;
  return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
});
```

Esto demuestra cómo los computed signals pueden realizar cálculos y combinar múltiples fuentes de datos. El valor se actualiza automáticamente cuando `userStatus` cambia.
</docs-step>

<docs-step title="Muestra los valores computed en la plantilla">
La plantilla ya tiene placeholders mostrando "Loading...". Reemplázalos con tus computed signals:

1. Para notificaciones, reemplaza `Loading...` con un bloque @if:

```angular-html
@if (notificationsEnabled()) {
  Enabled
} @else {
  Disabled
}
```

2. Para el mensaje, reemplaza `Loading...` con:

```angular-html
{{ statusMessage() }}
```

3. Para horario laboral, reemplaza `Loading...` con un bloque @if:

```angular-html
@if (isWithinWorkingHours()) {
  Yes
} @else {
  No
}
```

Observa cómo los computed signals se llaman igual que los signals regulares — ¡con paréntesis!
</docs-step>

</docs-workflow>

¡Excelente! Ahora has aprendido cómo crear computed signals.

Aquí hay algunos puntos clave para recordar:

- **Los computed signals son reactivos**: Se actualizan automáticamente cuando sus dependencias cambian
- **Son de solo lectura**: No puedes establecer valores computed directamente, se derivan de otros signals
- **Pueden contener lógica compleja**: Úsalos para cálculos, transformaciones y estado derivado
- **Proporcionan una forma de hacer cómputos eficientes basados en estado dinámico**: Angular solo los recalcula cuando sus dependencias realmente cambian

En la próxima lección, aprenderás sobre [una forma diferente de derivar estado con linkedSignals](/tutorials/signals/3-deriving-state-with-linked-signals)!
