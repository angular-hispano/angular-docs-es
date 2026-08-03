# Gestión de estado de campos

El estado de campos de Signal Forms te permite reaccionar a las interacciones del usuario proporcionando signals reactivos para el estado de validación (como `valid`, `invalid`, `errors`), rastreo de interacción (como `touched`, `dirty`) y disponibilidad (como `disabled`, `hidden`).

## Entendiendo el estado de campos {#understanding-field-state}

Cuando creas un formulario con la función [`form()`](api/forms/signals/form), retorna un **field tree** - una estructura de objeto que refleja tu modelo de formulario. Cada campo en el árbol es accesible mediante notación de punto (como [`form.email`](api/forms/signals/form#email)).

### Accediendo al estado del campo {#accessing-field-state}

Cuando llamas a cualquier campo en el field tree como una función (como [`form.email()`](api/forms/signals/form#email)), retorna un objeto `FieldState` que contiene signals reactivos que rastrean la validación del campo, interacción y estado de disponibilidad. Por ejemplo, el signal `invalid()` te dice si el campo tiene errores de validación:

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField, required, email } from '@angular/forms/signals'

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <input type="email" [formField]="registrationForm.email" />

    @if (registrationForm.email().invalid()) {
      <p class="error">Email has validation errors:</p>
      <ul>
        @for (error of registrationForm.email().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  `
})
export class Registration {
  registrationModel = signal({
    email: '',
    password: ''
  })

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' })
    email(schemaPath.email, { message: 'Enter a valid email address' })
  })
}
```

En este ejemplo, la plantilla verifica `registrationForm.email().invalid()` para determinar si se debe mostrar un mensaje de error.

### Signals de estado de campo {#field-state-signals}

El signal más comúnmente usado es `value()`, un `WritableSignal` que proporciona acceso al valor actual del campo:

```ts
const emailValue = registrationForm.email().value()
console.log(emailValue) // Current email string
```

Más allá de `value()`, el estado del campo incluye signals para validación, rastreo de interacción y control de disponibilidad:

| Categoría                                     | Signal       | Descripción                                                                                            |
| --------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| **[Estado de validación](#validation-state)** | `valid()`    | El campo pasa todas las reglas de validación y no tiene validadores pendientes                        |
|                                               | `invalid()`  | El campo tiene errores de validación                                                                   |
|                                               | `errors()`   | Array de objetos de error de validación                                                               |
|                                               | `pending()`  | Validación asíncrona en progreso                                                                       |
| **[Estado de interacción](#interaction-state)** | `touched()`  | El usuario ha enfocado y desenfocado el campo (si es interactivo)                                     |
|                                               | `dirty()`    | El usuario ha modificado el campo (si es interactivo), incluso si el valor coincide con el estado inicial |
| **[Estado de disponibilidad](#availability-state)** | `disabled()` | El campo está deshabilitado y no afecta el estado del formulario padre                                |
|                                               | `hidden()`   | Indica que el campo debe estar oculto; la visibilidad en la plantilla se controla con `@if`           |
|                                               | `readonly()` | El campo es de solo lectura y no afecta el estado del formulario padre                                |

Estos signals te permiten construir experiencias de usuario de formularios responsivas que reaccionan al comportamiento del usuario. Las secciones a continuación exploran cada categoría en detalle.

## Estado de validación {#validation-state}

Los signals de estado de validación te indican si un campo es válido y qué errores contiene.

NOTA: Esta guía se enfoca en **usar** el estado de validación en tus plantillas y lógica (como leer `valid()`, `invalid()`, `errors()` para mostrar retroalimentación). Para información sobre **definir** reglas de validación y crear validadores personalizados, consulta la [guía de Validación](guide/forms/signals/validation).

### Verificando validez {#checking-validity}

Usa `valid()` e `invalid()` para verificar el estado de validación:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().invalid()) {
      <p class="error">Email is invalid</p>
    } @if (loginForm.email().valid()) {
      <p class="success">Email looks good</p>
    }
  `
})
export class Login {
  loginModel = signal({ email: '', password: '' })
  loginForm = form(this.loginModel)
}
```

| Signal      | Retorna `true` cuando                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| `valid()`   | El campo pasa todas las reglas de validación y no tiene validadores pendientes |
| `invalid()` | El campo tiene errores de validación                                          |

Al verificar validez en código, usa `invalid()` en lugar de `!valid()` si quieres distinguir entre "tiene errores" y "validación pendiente". La razón de esto es que tanto `valid()` como `invalid()` pueden ser `false` simultáneamente cuando la validación asíncrona está pendiente porque el campo no es válido aún ya que la validación no está completa y tampoco es inválido ya que no se han encontrado errores todavía.

### Leyendo errores de validación {#reading-validation-errors}

Accede al array de errores de validación con `errors()`. Cada objeto de error contiene:

| Propiedad | Descripción                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| `kind`      | La regla de validación que falló (como "required" o "email")                   |
| `message`   | Mensaje de error legible opcional                                              |
| `fieldTree` | Referencia al `FieldTree` donde ocurrió el error                               |

NOTA: La propiedad `message` es opcional. Los validadores pueden proporcionar mensajes de error personalizados, pero si no se especifica, puede que necesites mapear los valores de `kind` de error a tus propios mensajes.

Aquí hay un ejemplo de cómo mostrar errores en tu plantilla:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().errors().length > 0) {
      <div class="errors">
        @for (error of loginForm.email().errors(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `
})
```

Este enfoque recorre todos los errores de un campo, mostrando cada mensaje de error al usuario.

### Validación pendiente {#pending-validation}

El signal `pending()` indica que la validación asíncrona está en progreso:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="signupForm.email" />

    @if (signupForm.email().pending()) {
      <p>Checking if email is available...</p>
    }

    @if (signupForm.email().invalid() && !signupForm.email().pending()) {
      <p>Email is already taken</p>
    }
  `
})
```

Este signal te permite mostrar estados de carga mientras se ejecuta la validación asíncrona.

## Estado de interacción {#interaction-state}

El estado de interacción rastrea si los usuarios han interactuado con los campos, habilitando patrones como "mostrar errores solo después de que el usuario haya tocado un campo".

### Estado touched {#touched-state}

El signal `touched()` rastrea si un usuario ha enfocado y luego desenfocado un campo, o si el campo ha sido marcado como touched programáticamente. Solo los campos interactivos pueden volverse touched; los campos ocultos, deshabilitados y de solo lectura no se vuelven touched desde interacciones del usuario ni desde `markAsTouched()`.

Cuando necesitas una acción a nivel de sección para revelar errores de validación dentro de esa sección, llama a `markAsTouched()` en el campo de la sección. El valor por defecto de `skipDescendants` es `false`, por lo que la llamada marca el campo de la sección y cada campo descendiente como touched.

Por ejemplo, un flujo de checkout puede validar la sección de envío antes de permitir al usuario continuar al siguiente paso:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-checkout-shipping',
  imports: [FormField],
  template: `
    <label>
      Name
      <input [formField]="checkoutForm.shipping.name" />
    </label>
    @if (checkoutForm.shipping.name().touched() && checkoutForm.shipping.name().invalid()) {
      <p>{{ checkoutForm.shipping.name().errors()[0].message }}</p>
    }

    <label>
      Address
      <input [formField]="checkoutForm.shipping.address" />
    </label>
    @if (checkoutForm.shipping.address().touched() && checkoutForm.shipping.address().invalid()) {
      <p>{{ checkoutForm.shipping.address().errors()[0].message }}</p>
    }

    <button type="button" (click)="continueToPayment()">Continue</button>

    @if (showPayment() && checkoutForm.shipping().valid()) {
      <p>Ready for payment.</p>
    }
  `,
})
export class CheckoutShipping {
  checkoutModel = signal({
    shipping: {
      name: '',
      address: '',
    },
  });

  showPayment = signal(false);

  checkoutForm = form(this.checkoutModel, (schemaPath) => {
    required(schemaPath.shipping.name, {message: 'Enter a name'});
    required(schemaPath.shipping.address, {message: 'Enter an address'});
  });

  continueToPayment() {
    this.checkoutForm.shipping().markAsTouched();

    if (this.checkoutForm.shipping().invalid()) {
      return;
    }

    this.showPayment.set(true);
  }
}
```

Cuando `continueToPayment()` llama a `markAsTouched()` en `checkoutForm.shipping()`, usa el comportamiento por defecto `skipDescendants: false`. Angular marca `shipping`, `shipping.name` y `shipping.address` como touched, por lo que los mensajes de error `touched() && invalid()` de los hijos se vuelven visibles antes de que se envíe todo el formulario.

NOTA: Pasa `{skipDescendants: true}` solo cuando el campo que recibe la llamada debe volverse touched sin cambiar el estado touched de sus descendientes.

### Estado dirty {#dirty-state}

Los formularios a menudo necesitan detectar si los datos realmente han cambiado - por ejemplo, para advertir a los usuarios sobre cambios no guardados o para habilitar un botón de guardar solo cuando sea necesario. El signal `dirty()` rastrea si el usuario ha modificado el campo.

El signal `dirty()` se vuelve `true` cuando el usuario modifica el valor de un campo interactivo, y permanece `true` incluso si el valor se cambia de vuelta para coincidir con el valor inicial:

```angular-ts
@Component({
  template: `
    <form>
      <input [formField]="profileForm.name" />
      <input [formField]="profileForm.bio" />

      @if (profileForm().dirty()) {
        <p class="warning">You have unsaved changes</p>
      }
    </form>
  `
})
export class Profile {
  profileModel = signal({ name: 'Alice', bio: 'Developer' })
  profileForm = form(this.profileModel)
}
```

Usa `dirty()` para advertencias de "cambios no guardados" o para habilitar botones de guardar solo cuando los datos hayan cambiado.

### Touched vs dirty

Estos signals rastrean diferentes interacciones del usuario:

| Signal      | Cuándo se vuelve true                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `touched()` | El usuario ha enfocado y desenfocado un campo interactivo (incluso si no cambiaron nada)                                          |
| `dirty()`   | El usuario ha modificado un campo interactivo (incluso si nunca lo desenfocaron, e incluso si el valor actual coincide con el inicial) |

Un campo puede estar en diferentes combinaciones:

| Estado                   | Escenario                                                           |
| ------------------------ | ------------------------------------------------------------------- |
| Touched pero no dirty    | El usuario enfocó y desenfocó el campo pero no hizo cambios         |
| Ambos touched y dirty    | El usuario enfocó el campo, cambió el valor y lo desenfocó          |

NOTA: Los campos ocultos, deshabilitados y de solo lectura no son interactivos - no se vuelven touched o dirty desde interacciones del usuario.

## Estado de disponibilidad {#availability-state}

Los signals de estado de disponibilidad controlan si los campos son interactivos, editables o visibles. Los campos deshabilitados, ocultos y de solo lectura no son interactivos. No afectan si su formulario padre es válido, touched o dirty.

### Campos deshabilitados {#disabled-fields}

El signal `disabled()` indica si un campo acepta entrada del usuario. Los campos deshabilitados aparecen en la interfaz de usuario pero los usuarios no pueden interactuar con ellos.

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField, disabled } from '@angular/forms/signals'

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <!-- TIP: The `[formField]` directive automatically binds the `disabled` attribute based on the field's `disabled()` state, so you don't need to manually add `[disabled]="field().disabled()"` -->
    <input [formField]="orderForm.couponCode" />

    @if (orderForm.couponCode().disabled()) {
      <p class="info">Coupon code is only available for orders over $50</p>
    }
  `
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: ''
  })

  orderForm = form(this.orderModel, schemaPath => {
    disabled(schemaPath.couponCode, ({valueOf}) => valueOf(schemaPath.total) < 50)
  })
}
```

En este ejemplo, usamos `valueOf(schemaPath.total)` para verificar el valor del campo `total` para determinar si `couponCode` debe estar deshabilitado.

NOTA: El parámetro de callback de esquema (`schemaPath` en estos ejemplos) es un objeto `SchemaPathTree` que proporciona rutas a todos los campos en tu formulario. Puedes nombrar este parámetro como desees.

Al definir reglas como `disabled()`, `hidden()` o `readonly()`, el callback de lógica recibe un objeto `FieldContext` que típicamente se desestructura (como `({valueOf})`). Dos métodos comúnmente usados en reglas de validación son:

- `valueOf(schemaPath.otherField)` - Lee el valor de otro campo en el formulario
- `value()` - Un signal que contiene el valor del campo al que se aplica la regla

Los campos deshabilitados no contribuyen al estado de validación del formulario padre. Incluso si un campo deshabilitado sería inválido, el formulario padre aún puede ser válido. El estado `disabled()` afecta la interactividad y validación, pero no cambia el valor del campo.

### Campos ocultos {#hidden-fields}

El signal `hidden()` indica si un campo está condicionalmente oculto. Usa `hidden()` con `@if` para mostrar u ocultar campos según condiciones:

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField, hidden } from '@angular/forms/signals'

@Component({
  selector: 'app-profile',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="profileForm.isPublic" />
      Make profile public
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        Public URL
        <input [formField]="profileForm.publicUrl" />
      </label>
    }
  `
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: ''
  })

  profileForm = form(this.profileModel, schemaPath => {
    hidden(schemaPath.publicUrl, ({valueOf}) => !valueOf(schemaPath.isPublic))
  })
}
```

Los campos ocultos no participan en la validación. Si un campo requerido está oculto, no impedirá el envío del formulario. El estado `hidden()` afecta la disponibilidad y validación, pero no cambia el valor del campo.

### Campos de solo lectura {#readonly-fields}

El signal `readonly()` indica si un campo es de solo lectura. Los campos de solo lectura muestran su valor pero los usuarios no pueden editarlos:

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField, readonly } from '@angular/forms/signals'

@Component({
  selector: 'app-account',
  imports: [FormField],
  template: `
    <label>
      Username (cannot be changed)
      <input [formField]="accountForm.username" />
    </label>

    <label>
      Email
      <input [formField]="accountForm.email" />
    </label>
  `
})
export class Account {
  accountModel = signal({
    username: 'johndoe',
    email: 'john@example.com'
  })

  accountForm = form(this.accountModel, schemaPath => {
    readonly(schemaPath.username)
  })
}
```

NOTA: La directiva `[formField]` vincula automáticamente el atributo `readonly` basándose en el estado `readonly()` del campo, por lo que no necesitas agregar manualmente `[readonly]="field().readonly()"`.

Al igual que los campos deshabilitados y ocultos, los campos de solo lectura no son interactivos y no afectan el estado del formulario padre. El estado `readonly()` afecta la editabilidad y validación, pero no cambia el valor del campo.

### Cuándo usar cada uno {#when-to-use-each}

| Estado       | Usar cuando                                                                       | Usuario puede verlo | Usuario puede interactuar | Contribuye a la validación |
| ------------ | --------------------------------------------------------------------------------- | ------------------- | ------------------------- | -------------------------- |
| `disabled()` | El campo está temporalmente no disponible (como basándose en otros valores de campos) | Sí                  | No                        | No                         |
| `hidden()`   | El campo no es relevante en el contexto actual                                    | No (con @if)        | No                        | No                         |
| `readonly()` | El valor debe ser visible pero no editable                                        | Sí                  | No                        | No                         |

## Estado a nivel de formulario {#form-level-state}

El formulario raíz también es un campo en el field tree. Cuando lo llamas como una función, también retorna un objeto `FieldState` que agrega el estado de todos los campos hijos.

### Accediendo al estado del formulario {#accessing-form-state}

```angular-ts
@Component({
  template: `
    <form>
      <input [formField]="loginForm.email" />
      <input [formField]="loginForm.password" />

      <button [disabled]="!loginForm().valid()">Sign In</button>
    </form>
  `
})
export class Login {
  loginModel = signal({ email: '', password: '' })
  loginForm = form(this.loginModel)
}
```

En este ejemplo, el formulario es válido solo cuando todos los campos hijos son válidos. Esto te permite habilitar/deshabilitar botones de envío basándote en la validez general del formulario.

### Signals a nivel de formulario {#form-level-signals}

Debido a que el formulario raíz es un campo, tiene los mismos signals (como `valid()`, `invalid()`, `touched()`, `dirty()`, etc.).

| Signal      | Comportamiento a nivel de formulario                                             |
| ----------- | -------------------------------------------------------------------------------- |
| `valid()`   | Todos los campos interactivos son válidos y no hay validadores pendientes       |
| `invalid()` | Al menos un campo interactivo tiene errores de validación                       |
| `pending()` | Al menos un campo interactivo tiene validación asíncrona pendiente              |
| `touched()` | El formulario, o al menos un descendiente interactivo, está touched             |
| `dirty()`   | El usuario ha modificado al menos un campo interactivo                          |

### Cuándo usar a nivel de formulario vs a nivel de campo {#when-to-use-form-level-vs-field-level}

**Usa estado a nivel de formulario para:**

- Estado habilitado/deshabilitado del botón de envío
- Estado del botón "Guardar"
- Verificaciones generales de validez del formulario
- Advertencias de cambios no guardados

**Usa estado a nivel de campo para:**

- Mensajes de error de campos individuales
- Estilo específico del campo
- Retroalimentación de validación por campo
- Disponibilidad condicional de campos

## Propagación de estado {#state-propagation}

El estado del campo se propaga desde los campos hijos hacia arriba a través de grupos de campos padre hasta el formulario raíz.

### Cómo el estado hijo afecta a los formularios padre {#how-child-state-affects-parent-forms}

Cuando un campo hijo se vuelve inválido, su grupo de campos padre se vuelve inválido, y también lo hace el formulario raíz. Cuando un hijo se vuelve touched o dirty, el grupo de campos padre y el formulario raíz reflejan ese cambio. Esta agregación te permite verificar la validez en cualquier nivel - campo o formulario completo.

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: ''
  },
  address: {
    street: '',
    city: ''
  }
})

const userForm = form(userModel)

// If firstName is invalid, profile is invalid
userForm.profile.firstName().invalid() === true
// → userForm.profile().invalid() === true
// → userForm().invalid() === true
```

### Campos ocultos, deshabilitados y de solo lectura {#hidden-disabled-and-readonly-fields}

Los campos ocultos, deshabilitados y de solo lectura no son interactivos y no afectan el estado del formulario padre:

```ts
const orderModel = signal({
  customerName: '',
  requiresShipping: false,
  shippingAddress: ''
})

const orderForm = form(orderModel, schemaPath => {
  hidden(schemaPath.shippingAddress, ({valueOf}) => !valueOf(schemaPath.requiresShipping))
})
```

En este ejemplo, cuando `shippingAddress` está oculto, no afecta la validez del formulario. Como resultado, incluso si `shippingAddress` está vacío y es requerido, el formulario puede ser válido.

Este comportamiento evita que los campos ocultos, deshabilitados o de solo lectura bloqueen el envío del formulario o afecten el estado de validación, touched y dirty.

## Usando estado en plantillas {#using-state-in-templates}

Los signals de estado de campo se integran perfectamente con las plantillas de Angular, habilitando experiencias de usuario de formularios reactivos sin manejo manual de eventos.

### Visualización condicional de errores {#conditional-error-display}

Muestra errores solo después de que un usuario haya interactuado con un campo:

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField, email } from '@angular/forms/signals'

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <label>
      Email
      <input type="email" [formField]="signupForm.email" />
    </label>

    @if (signupForm.email().touched() && signupForm.email().invalid()) {
      <p class="error">{{ signupForm.email().errors()[0].message }}</p>
    }
  `
})
export class Signup {
  signupModel = signal({ email: '', password: '' })

  signupForm = form(this.signupModel, schemaPath => {
    email(schemaPath.email)
  })
}
```

Este patrón evita mostrar errores antes de que los usuarios hayan tenido la oportunidad de interactuar con el campo. Los errores aparecen solo después de que el usuario haya enfocado y luego salido del campo.

### Disponibilidad condicional de campos {#conditional-field-availability}

Usa el signal `hidden()` con `@if` para mostrar u ocultar campos condicionalmente:

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField, hidden } from '@angular/forms/signals'

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="orderForm.requiresShipping" />
      Requires shipping
    </label>

    @if (!orderForm.shippingAddress().hidden()) {
      <label>
        Shipping Address
        <input [formField]="orderForm.shippingAddress" />
      </label>
    }
  `
})
export class Order {
  orderModel = signal({
    requiresShipping: false,
    shippingAddress: ''
  })

  orderForm = form(this.orderModel, schemaPath => {
    hidden(schemaPath.shippingAddress, ({valueOf}) => !valueOf(schemaPath.requiresShipping))
  })
}
```

Los campos ocultos no participan en la validación, permitiendo que el formulario se envíe incluso si el campo oculto sería inválido de lo contrario.

### Rastreo de valores en campos de array {#tracking-values-for-array-fields}

En Signal Forms, un bloque `@for` sobre un conjunto de campos debe rastrearse por identidad del campo.

```angular-ts
@Component({
  imports: [FormField],
  template: `
    @for (field of form.emails; track field) {
      <input [formField]="field" />
    }
  `,
})
export class App {
  formModel = signal({emails: ['john.doe@mail.com', 'max.musterman@mail.com']});
  form = form(this.formModel);
}
```

El sistema de formularios ya rastrea los valores del modelo dentro del array y mantiene una identidad estable de los campos que crea automáticamente.

Cuando un elemento cambia, puede representar una nueva entidad lógica incluso si algunas de sus propiedades parecen iguales. Rastrear por identidad asegura que el framework lo trate como un elemento distinto en lugar de reutilizar elementos UI existentes. Esto evita que elementos con estado, como inputs de formulario, se compartan incorrectamente y mantiene los enlaces alineados con la parte correcta del modelo.

## Usando estado de campo en lógica de componentes {#using-field-state-in-component-logic}

Los signals de estado de campo funcionan con las primitivas reactivas de Angular como `computed()` y `effect()` para lógica de formularios avanzada.

### Verificaciones de validación antes del envío {#validation-checks-before-submission}

Verifica la validez del formulario en métodos del componente:

```ts
export class Registration {
  registrationModel = signal({
    username: '',
    email: '',
    password: ''
  })

  registrationForm = form(this.registrationModel)

  async onSubmit() {
    // Wait for any pending async validation
    if (this.registrationForm().pending()) {
      console.log('Waiting for validation...')
      return
    }

    // Guard against invalid submissions
    if (this.registrationForm().invalid()) {
      console.error('Form is invalid')
      return
    }

    const data = this.registrationModel()
    await this.api.register(data)
  }
}
```

Esto asegura que solo datos válidos y completamente validados lleguen a tu API.

### Estado derivado con computed {#derived-state-with-computed}

Crea signals computed basados en el estado del campo para actualizarse automáticamente cuando el estado del campo subyacente cambia:

```ts
export class Password {
  passwordModel = signal({ password: '', confirmPassword: '' })
  passwordForm = form(this.passwordModel)

  // Compute password strength indicator
  passwordStrength = computed(() => {
    const password = this.passwordForm.password().value()
    if (password.length < 8) return 'weak'
    if (password.length < 12) return 'medium'
    return 'strong'
  })

  // Check if all required fields are filled
  allFieldsFilled = computed(() => {
    return (
      this.passwordForm.password().value().length > 0 &&
      this.passwordForm.confirmPassword().value().length > 0
    )
  })
}
```

### Cambios de estado programáticos {#programmatic-state-changes}

Aunque el estado del campo típicamente se actualiza a través de interacciones del usuario (escribir, enfocar, desenfocar), a veces necesitas controlarlo programáticamente. Los escenarios comunes incluyen el envío de formularios y el reseteo de formularios.

#### Envío de formularios {#form-submission}

Signal Forms proporciona una directiva `FormRoot` que simplifica el envío de formularios. Previene automáticamente el comportamiento de envío de formularios por defecto del navegador y establece el atributo `novalidate` en el elemento `<form>`.

```angular-ts
import {FormField, FormRoot} from '@angular/forms/signals';

@Component({
  imports: [FormRoot, FormField],
  template: `
    <form [formRoot]="registrationForm">
      <input [formField]="registrationForm.username" />
      <input type="email" [formField]="registrationForm.email" />
      <input type="password" [formField]="registrationForm.password" />

      <button type="submit">Register</button>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});

  registrationForm = form(
    this.registrationModel,
    (schemaPath) => {
      required(schemaPath.username);
      email(schemaPath.email);
      required(schemaPath.password);
    },
    {
      submission: {
        action: async () => this.submitToServer(),
      },
    },
  );

  private submitToServer() {
    // Send data to server
  }
}
```

Cuando usas `FormRoot`, al enviar el formulario automáticamente se llama a la función `submit()`, que marca todos los campos como touched (revelando errores de validación) y ejecuta tu callback `action` si el formulario es válido.

También puedes enviar un formulario manualmente, sin usar la directiva, llamando a `submit(this.registrationForm)`. Al llamar explícitamente a la función `submit` de esta manera, puedes pasar un `FormSubmitOptions` para sobreescribir la lógica `submission` por defecto del formulario: `submit(this.registrationForm, {action: () => /* ... */ })`.

#### Reseteando formularios después del envío {#resetting-forms-after-submission}

Después de enviar exitosamente un formulario, puedes querer devolverlo a su estado inicial - limpiando tanto el historial de interacción del usuario como los valores de los campos. El método `reset()` limpia las banderas touched y dirty. También puedes pasar un valor opcional a `reset()` para actualizar los datos del modelo:

```ts
export class Contact {
  private readonly INITIAL_MODEL = {name: '', email: '', message: ''};
  contactModel = signal({...this.INITIAL_MODEL});
  contactForm = form(this.contactModel, {
    submission: {
      action: async (f) => {
        await this.api.sendMessage(this.contactModel());
        // Limpiar estado de interacción (touched, dirty) y resetear a valores iniciales
        f().reset({...this.INITIAL_MODEL});
      },
    },
  });
}
```

Esto asegura que el formulario esté listo para nueva entrada sin mostrar mensajes de error obsoletos o indicadores de estado dirty.

## Estilizando basándose en el estado de validación {#styling-based-on-validation-state}

Puedes aplicar estilos personalizados a tu formulario vinculando clases CSS basándote en el estado de validación:

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField, email } from '@angular/forms/signals'

@Component({
  template: `
    <input
      type="email"
      [formField]="form.email"
      [class.is-invalid]="form.email().touched() && form.email().invalid()"
      [class.is-valid]="form.email().touched() && form.email().valid()"
    />
  `,
  styles: `
    input.is-invalid {
      border: 2px solid red;
      background-color: white;
    }

    input.is-valid {
      border: 2px solid green;
    }
  `
})
export class StyleExample {
  model = signal({ email: '' })

  form = form(this.model, schemaPath => {
    email(schemaPath.email)
  })
}
```

Verificar tanto `touched()` como el estado de validación asegura que los estilos solo aparezcan después de que el usuario haya interactuado con el campo.

## Enfocar un control de formulario enlazado a un campo {#focus-a-form-control-bound-to-a-form-field}

Angular Signal Forms proporciona un método `focusBoundControl()` en el estado del campo que te permite mover programáticamente el [foco](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) al control de formulario asociado con un campo de formulario dado.

Un caso de uso común es mejorar la accesibilidad en el envío de formularios: cuando un formulario es inválido, mostrar mensajes de error y mover automáticamente el foco al primer campo inválido, guiando al usuario para corregirlo.

### Uso básico {#basic-usage}

Dado un formulario de registro:

```ts
@Component({
  /* ... */
})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});
  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username);
    email(schemaPath.email);
    required(schemaPath.password);
  });
}
```

Para mover el foco al control enlazado al campo `email`:

```ts
registrationForm.email().focusBoundControl();
```

### Prevenir el scroll {#preventing-scroll}

Si el control objetivo está fuera del viewport y quieres enfocarlo sin activar un scroll, puedes establecer la opción [preventScroll](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#preventscroll) a `true` al llamar al método `focusBoundControl()`.

```ts
registrationForm.email().focusBoundControl({preventScroll: true});
```

### Enfocar el primer campo inválido al enviar {#focusing-the-first-invalid-field-on-submission}

Usa `errorSummary()` para localizar el primer campo inválido y enfocarlo cuando el usuario envía el formulario con errores:

```ts
onSubmit() {
  const firstError = this.registrationForm().errorSummary()[0];
  if (firstError?.fieldTree) {
    firstError.fieldTree().focusBoundControl();
  } else {
    // proceed with submission
  }
}
```

### Controles personalizados {#custom-controls}

Por defecto, llamar a `focusBoundControl()` en un control personalizado no tiene efecto porque un control personalizado puede contener múltiples inputs nativos. Por ejemplo, un selector de fecha puede contener campos separados para día, mes y año. Como resultado, Angular no puede determinar qué elemento debe recibir el foco ni qué acción realizar.

Para soportar foco programático en un control personalizado, implementa un método `focus()`. Cuando se llama a `focusBoundControl()` en el estado del campo asociado con un control personalizado, Angular llama al método `focus()` del control si está presente.

Considera un input de contraseña personalizado:

```html
<div class="password-block">
  <input type="password" #passwordCtrl [value]="value()" (input)="value.set($event.target.value)" />
</div>
```

```ts
@Component({
  /* ... */
})
export class PasswordInput implements FormValueControl<string> {
  readonly value = model<string>('');
  readonly passwordCtrl = viewChild.required<ElementRef<HTMLInputElement>>('passwordCtrl');

  // Llamado automáticamente cuando se invoca focusBoundControl()
  // en el estado del campo asociado con este control personalizado
  focus(): void {
    this.passwordCtrl().nativeElement.focus();
  }
}
```

## Próximos pasos {#next-steps}

Esta guía cubrió el manejo del estado de validación y disponibilidad, el rastreo de interacciones y la propagación del estado de campos. Las guías relacionadas exploran otros aspectos de Signal Forms:

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Modelos de formulario" />
  <docs-pill href="guide/forms/signals/validation" title="Validación" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Controles personalizados" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Trabajando con arrays" /> -->
</docs-pill-row>
