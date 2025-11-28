<docs-decorative-header title="Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Crear y manejar datos dinámicos.
</docs-decorative-header>

In Angular, you use _signals_ to create and manage state. A signal is a lightweight wrapper around a value.

Usa la función `signal` para crear una signal que mantenga el estado local:

```typescript
import {signal} from '@angular/core';

// Crear una signal con la función `signal`.
const firstName = signal('Morgan');

// Leer el valor de una signal llamandola - las signals son funciones.
console.log(firstName());

// Cambia el valor de esta signal llamando su método `set` con un nuevo valor.
firstName.set('Jaime');

// También puedes usar el método `update` para cambiar el valor
// basado en el valor anterior.
firstName.update(name => name.toUpperCase()); 
```

Angular rastrea dónde se leen las signals y cuándo se actualizan. El framework usa esta información para hacer trabajo adicional, como actualizar el DOM con nuevo estado. Esta capacidad de responder a valores de signals cambiantes a lo largo del tiempo se conoce como *reactividad*.

## Expresiones computadas

Un `computed` es una signal que produce su valor basado en otras signals.

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());

console.log(firstNameCapitalized()); // MORGAN
```

Una signal `computed` es de solo lectura; no tiene un método `set` o `update`. En su lugar, el valor de la signal `computed` cambia automáticamente cuando cualquiera de las signals que lee cambia:

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

## Usando signals en componentes

Usa `signal` y `computed` dentro de tus componentes para crear y manejar el estado:

```typescript
@Component({/* ... */})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  activateTrial() {
    this.isTrial.set(true);
  }
}
```

TIP: ¿Quieres saber más sobre Angular Signals? Consulta la [Guía detallada de Signals](guide/signals) para obtener toda la información.

## Siguiente paso

Ahora que has aprendido cómo declarar y manejar datos dinámicos, es momento de aprender cómo usar esos datos dentro de las plantillas.

<docs-pill-row>
  <docs-pill title="Interfaces dinámicas con plantillas" href="essentials/templates" />
  <docs-pill title="Guía detallada de signals" href="guide/signals" />
</docs-pill-row>
