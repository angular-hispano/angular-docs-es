# Controles Personalizados

NOTA: Esta guía asume familiaridad con [Fundamentos de Signal Forms](essentials/signal-forms).

Los controles de formulario integrados del navegador (como input, select, textarea) manejan casos comunes, pero las aplicaciones a menudo necesitan entradas especializadas. Un selector de fecha con UI de calendario, un editor de texto enriquecido con barra de herramientas de formato, o un selector de etiquetas con autocompletado, todos requieren implementaciones personalizadas.

Signal Forms funciona con cualquier componente que implemente interfaces específicas. Una **interfaz de control** define las propiedades y signals que permiten a tu componente comunicarse con el sistema de formularios. Cuando tu componente implementa una de estas interfaces, la directiva `[formField]` conecta automáticamente tu control al estado del formulario, validación, y enlace de datos.

## Creando un control personalizado básico {#creating-a-basic-custom-control}

Empecemos con una implementación mínima y agreguemos características según sea necesario.

### Control de entrada mínimo {#minimal-input-control}

Un input personalizado básico solo necesita implementar la interfaz `FormValueControl` y definir el signal modelo `value` requerido.

```angular-ts
import { Component, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-basic-input',
  template: `
    <div class="basic-input">
      <input
        type="text"
        [value]="value()"
        (input)="value.set(($event.target as HTMLInputElement).value)"
        placeholder="Enter text..."
      />
    </div>
  `,
})
export class BasicInput implements FormValueControl<string> {
  /** The current input value */
  value = model('');
}
```

### Control de checkbox mínimo {#minimal-checkbox-control}

Un control estilo checkbox necesita dos cosas:

1. Implementar la interfaz `FormCheckboxControl` para que la directiva `Field` lo reconozca como un control de formulario
2. Proporcionar un signal modelo `checked`

```angular-ts
import { Component, model, ChangeDetectionStrategy } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'app-basic-toggle',
  template: `
    <button
      type="button"
      [class.active]="checked()"
      (click)="toggle()"
    >
      <span class="toggle-slider"></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicToggle implements FormCheckboxControl {
  /** Whether the toggle is checked */
  checked = model<boolean>(false);

  toggle() {
    this.checked.update(val => !val);
  }
}
```

### Usando tu control personalizado {#using-your-custom-control}

Una vez que hayas creado un control, puedes usarlo en cualquier lugar donde usarías un input integrado agregándole la directiva `Field`:

```angular-ts
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {form, FormField, required } from '@angular/forms/signals';
import { BasicInput } from './basic-input';
import { BasicToggle } from './basic-toggle';

@Component({
  imports: [FormField, BasicInput, BasicToggle],
  template: `
    <form>
      <label>
        Email
        <app-basic-input [formField]="registrationForm.email" />
      </label>

      <label>
        Accept terms
        <app-basic-toggle [formField]="registrationForm.acceptTerms" />
      </label>

      <button
        type="submit"
        [disabled]="registrationForm().invalid()"
      >
        Register
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  registrationModel = signal({
    email: '',
    acceptTerms: false
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    required(schemaPath.acceptTerms, { message: 'You must accept the terms' });
  });
}
```

NOTA: El parámetro callback del esquema (`schemaPath` en estos ejemplos) es un objeto `SchemaPathTree` que proporciona rutas a todos los campos en tu formulario. Puedes nombrar este parámetro como desees.

La directiva `[formField]` funciona de manera idéntica para controles personalizados e inputs integrados. Signal Forms los trata igual - la validación se ejecuta, el estado se actualiza, y el enlace de datos funciona automáticamente.

## Entendiendo las interfaces de control {#understanding-control-interfaces}

Ahora que has visto los controles personalizados en acción, exploremos cómo se integran con Signal Forms.

### Interfaces de control {#control-interfaces}

Los componentes `BasicInput` y `BasicToggle` que creaste implementan interfaces de control específicas que le dicen a Signal Forms cómo interactuar con ellos.

#### FormValueControl

`FormValueControl` es la interfaz para la mayoría de tipos de entrada - inputs de texto, inputs de número, selectores de fecha, dropdowns select, y cualquier control que edite un solo valor. Cuando tu componente implementa esta interfaz:

- **Propiedad requerida**: Tu componente debe proporcionar un signal modelo `value`
- **Lo que hace la directiva Field**: Vincula el valor del campo del formulario al signal `value` de tu control

IMPORTANTE: Los controles que implementan `FormValueControl` NO deben tener una propiedad `checked`

#### FormCheckboxControl

`FormCheckboxControl` es la interfaz para controles tipo checkbox - toggles, switches, y cualquier control que represente un estado booleano de encendido/apagado. Cuando tu componente implementa esta interfaz:

- **Propiedad requerida**: Tu componente debe proporcionar un signal modelo `checked`
- **Lo que hace la directiva Field**: Vincula el valor del campo del formulario al signal `checked` de tu control

IMPORTANTE: Los controles que implementan `FormCheckboxControl` NO deben tener una propiedad `value`

### Propiedades de estado opcionales {#optional-state-properties}

Tanto `FormValueControl` como `FormCheckboxControl` extienden `FormUiControl` - una interfaz base que proporciona propiedades opcionales para integrarse con el estado del formulario.

Todas las propiedades son opcionales. Implementa solo lo que tu control necesita.

#### Estado de interacción {#interaction-state}

Rastrea cuando los usuarios interactúan con tu control:

| Propiedad | Propósito                                                     |
| --------- | ------------------------------------------------------------- |
| `touched` | Si el usuario ha interactuado con el campo                    |
| `dirty`   | Si el valor difiere de su estado inicial                      |

#### Estado de validación {#validation-state}

Muestra comentarios de validación a los usuarios:

| Propiedad | Propósito                                   |
| --------- | ------------------------------------------- |
| `errors`  | Array de errores de validación actuales     |
| `valid`   | Si el campo es válido                       |
| `invalid` | Si el campo tiene errores de validación     |
| `pending` | Si la validación asíncrona está en progreso |

#### Estado de disponibilidad {#availability-state}

Controla si los usuarios pueden interactuar con tu campo:

| Propiedad         | Propósito                                                           |
| ----------------- | ------------------------------------------------------------------- |
| `disabled`        | Si el campo está deshabilitado                                      |
| `disabledReasons` | Razones por las que el campo está deshabilitado                     |
| `readonly`        | Si el campo es de solo lectura (visible pero no editable)           |
| `hidden`          | Si el campo está oculto de la vista                                 |

NOTA: `disabledReasons` es un array de objetos `DisabledReason`. Cada objeto tiene una propiedad `field` (referencia al árbol de campo) y una propiedad `message` opcional. Accede al mensaje a través de `reason.message`.

#### Restricciones de validación {#validation-constraints}

Recibe valores de restricción de validación del formulario:

| Propiedad   | Propósito                                                                   |
| ----------- | --------------------------------------------------------------------------- |
| `required`  | Si el campo es requerido                                                    |
| `min`       | Valor numérico mínimo (`undefined` si no hay restricción)                   |
| `max`       | Valor numérico máximo (`undefined` si no hay restricción)                   |
| `minLength` | Longitud mínima de cadena (undefined si no hay restricción)                 |
| `maxLength` | Longitud máxima de cadena (undefined si no hay restricción)                 |
| `pattern`   | Array de patrones de expresión regular a coincidir                          |

#### Metadatos de campo {#field-metadata}

| Propiedad | Propósito                                                                          |
| --------- | ---------------------------------------------------------------------------------- |
| `name`    | El atributo name del campo (que es único entre formularios y aplicaciones)         |

La sección "[Agregando signals de estado](#adding-state-signals)" a continuación muestra cómo implementar estas propiedades en tus controles.

### Cómo funciona la directiva Field {#how-the-formfield-directive-works}

La directiva `[formField]` detecta qué interfaz implementa tu control y automáticamente vincula los signals apropiados:

```angular-ts
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {form, FormField, required } from '@angular/forms/signals';
import { CustomInput } from './custom-input';
import { CustomToggle } from './custom-toggle';

@Component({
  selector: 'app-my-form',
  imports: [FormField, CustomInput, CustomToggle],
  template: `
    <form>
      <app-custom-input [formField]="userForm.username" />
      <app-custom-toggle [formField]="userForm.subscribe" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyForm {
  formModel = signal({
    username: '',
    subscribe: false
  });

  userForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' });
  });
}
```

CONSEJO: Para una cobertura completa de la creación y gestión de modelos de formulario, consulta la [guía de Modelos de Formulario](guide/forms/signals/models).

Cuando vinculas `[formField]="userForm.username"`, la directiva Field:

1. Detecta que tu control implementa `FormValueControl`
2. Accede internamente a `userForm.username().value()` y lo vincula al signal modelo `value` de tu control
3. Vincula signals de estado del formulario (`disabled()`, `errors()`, etc.) a los signals de entrada opcionales de tu control
4. Las actualizaciones ocurren automáticamente a través de la reactividad de signals

## Agregando signals de estado {#adding-state-signals}

Los controles mínimos mostrados arriba funcionan, pero no responden al estado del formulario. Puedes agregar signals de entrada opcionales para hacer que tus controles reaccionen al estado deshabilitado, muestren errores de validación, y rastreen la interacción del usuario.

Aquí hay un ejemplo completo que implementa propiedades de estado comunes:

```angular-ts
import { Component, model, input, ChangeDetectionStrategy } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import type { ValidationError, DisabledReason } from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="text"
          [value]="value()"
          (input)="value.set(($event.target as HTMLInputElement).value)"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.aria-invalid]="invalid()"
          (blur)="touched.set(true)"
        />

        @if (invalid()) {
          <div class="error-messages" role="alert">
            @for (error of errors(); track error) {
              <span class="error">{{ error.message }}</span>
            }
          </div>
        }

        @if (disabled() && disabledReasons().length > 0) {
          <div class="disabled-reasons">
            @for (reason of disabledReasons(); track reason) {
              <span>{{ reason.message }}</span>
            }
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulInput implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly ValidationError.WithField[]>([]);
}
```

Como resultado, puedes usar el control con validación y gestión de estado:

```angular-ts
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {form, FormField, required, email } from '@angular/forms/signals';
import { StatefulInput } from './stateful-input';

@Component({
  imports: [FormField, StatefulInput],
  template: `
    <form>
      <label>
        Email
        <app-stateful-input [formField]="loginForm.email" />
      </label>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  loginModel = signal({ email: '' });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
  });
}
```

Cuando el usuario escribe un email inválido, la directiva FormField actualiza automáticamente `invalid()` y `errors()`. Tu control puede mostrar los comentarios de validación.

### Trabajando con `debounce('blur')` {#working-with-debounceblur}

La regla [`debounce('blur')`](api/forms/signals/debounce) retrasa las actualizaciones desde la UI al modelo del formulario hasta que el campo pierde el foco, en lugar de aplicarlas en cada pulsación de tecla. Los controles integrados reportan un blur al formulario automáticamente. Un control personalizado solo participa si emite su output `touch` en respuesta al [evento nativo `blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event):

```angular-ts
import {Component, model, output} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-custom-input',
  template: `
    <input
      type="text"
      [value]="value()"
      (input)="value.set($event.target.value)"
      (blur)="touch.emit()"
    />
  `,
})
export class CustomInput implements FormValueControl<string> {
  value = model('');
  touch = output<void>();
}
```

Con el output `touch` en su lugar, `debounce('blur')` se comporta igual para tu control que para los inputs integrados:

```angular-ts
import {Component, signal} from '@angular/core';
import {debounce, form, FormField} from '@angular/forms/signals';
import {CustomInput} from './custom-input';

@Component({
  selector: 'app-root',
  imports: [CustomInput, FormField],
  template: `<app-custom-input [formField]="userForm.name" />`,
})
export class App {
  userModel = signal({name: ''});

  userForm = form(this.userModel, (schemaPath) => {
    debounce(schemaPath.name, 'blur');
  });
}
```

IMPORTANTE: Emite `touch` en `blur` (cuando el foco sale del control), no en `focus`. Sin el output `touch`, el campo nunca se registra como desenfocado, por lo que `debounce('blur')` no tiene efecto en tu control.

## Transformación de valores {#value-transformation}

Los controles a veces muestran valores de manera diferente a como el modelo del formulario los almacena - un selector de fecha podría mostrar "January 15, 2024" mientras almacena "2024-01-15", o un input de moneda podría mostrar "$1,234.56" mientras almacena 1234.56.

Usa `linkedSignal()` (de `@angular/core`) para transformar el valor del modelo para visualización, y maneja eventos de entrada para parsear la entrada del usuario de vuelta al formato de almacenamiento:

```angular-ts
import {formatCurrency} from '@angular/common';
import {ChangeDetectionStrategy, Component, linkedSignal, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-currency-input',
  template: `
    <input
      type="text"
      [value]="displayValue()"
      (input)="displayValue.set($event.target.value)"
      (blur)="updateModel()"
    />
  `,
})
export class CurrencyInput implements FormValueControl<number> {
  // Almacena el valor numérico (1234.56)
  readonly value = model.required<number>();

  // Almacena el valor de visualización ("1,234.56")
  readonly displayValue = linkedSignal(() => formatCurrency(this.value(), 'en', 'USD'));

  // Actualiza el modelo desde el valor de visualización.
  updateModel() {
    this.value.set(parseCurrency(this.displayValue()));
  }
}

// Convierte un string de moneda a número (ej. "USD1,234.56" -> 1234.56).
function parseCurrency(value: string): number {
  return parseFloat(value.replace(/^[^\d-]+/, '').replace(/,/g, ''));
}
```

## Integración de validación {#validation-integration}

Los controles muestran el estado de validación pero no realizan validación. La validación ocurre en el esquema del formulario - tu control recibe signals `invalid()` y `errors()` de la directiva FormField y los muestra (como se muestra en el ejemplo de StatefulInput arriba).

La directiva FormField también pasa valores de restricción de validación como `required`, `min`, `max`, `minLength`, `maxLength`, y `pattern`. Tu control puede usarlos para mejorar la UI:

```ts
export class NumberInput implements FormValueControl<number> {
  value = model<number>(0);

  // Constraint values from schema validation rules
  required = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
}
```

Cuando agregas reglas de validación `min()` y `max()` al esquema, la directiva FormField pasa estos valores a tu control. Úsalos para aplicar atributos HTML5 o mostrar sugerencias de restricción en tu plantilla.

IMPORTANTE: No implementes lógica de validación en tu control. Define reglas de validación en el esquema del formulario y deja que tu control muestre los resultados:

```ts {avoid}
// Evitar: Validación en el control
export class BadControl implements FormValueControl<string> {
  value = model<string>('');
  isValid() {
    return this.value().length >= 8;
  } // Don't do this!
}
```

```ts {prefer}
// Bien: Validación en el esquema, el control muestra resultados
accountForm = form(this.accountModel, (schemaPath) => {
  minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
});
```

## Hacer controles reutilizables {#making-controls-reusable}

Un control personalizado a menudo lleva expectativas implícitas sobre la validación. Un input de email necesita reglas `required` y `email` en cada formulario que lo use. En lugar de depender de que cada consumidor redeclare esas reglas, empaqueta un esquema complementario junto con el control y exporta ambos desde el mismo módulo:

```ts {header: 'email-input.ts'}
import {schema, required, email} from '@angular/forms/signals';

export const emailFieldSchema = schema<string>((path) => {
  required(path, {message: 'Email is required'});
  email(path, {message: 'Enter a valid email address'});
});
```

Un consumidor importa el esquema complementario y lo compone en su formulario con `apply()`:

```ts {header: 'registration.ts'}
import {form, apply} from '@angular/forms/signals';
import {emailFieldSchema} from './email-input';

registrationForm = form(this.registrationModel, (path) => {
  apply(path.email, emailFieldSchema);
});
```

`apply()` combina las reglas del esquema complementario en el formulario padre en la ruta especificada. El consumidor aún puede agregar más reglas al mismo campo porque `apply()` se compone con otras reglas en lugar de reemplazarlas. Consulta la [guía de Esquemas](guide/forms/signals/schemas) para cobertura completa de `schema()`, `apply()`, y composición condicional con `applyWhen()`.

### Consideraciones de diseño {#design-considerations}

El modelo del consumidor debe inicializar cada campo con un valor definido. En Signal Forms, `undefined` significa la ausencia de un campo y no un valor vacío. Para un control de email reutilizable, eso significa que el consumidor debe usar `''` como valor inicial, y no dejar la propiedad sin definir. Consulta la [guía de Modelos de formulario](guide/forms/signals/models) para más detalles sobre la elección de valores iniciales.

Además, los controles no deben registrar sus propios effects para gestión de estado. El sistema de formularios gestiona el estado de campo a través de effects internos. Esto significa que tu control recibe actualizaciones de estado a través de signals de input. Si un control necesita transformar valores, usa `linkedSignal()` como se muestra en la sección "[Transformación de valores](#value-transformation)" en lugar de un `effect()`.

## Próximos pasos {#next-steps}

Esta guía cubrió la construcción de controles personalizados que se integran con Signal Forms. Las guías relacionadas exploran otros aspectos de Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Modelos de formulario" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Gestión de estado de campo" />
  <docs-pill href="guide/forms/signals/validation" title="Validación" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Trabajando con arrays" /> -->
</docs-pill-row>
