# Gestión de estado de campos

El estado de campos de Signal Forms te permite reaccionar a las interacciones del usuario proporcionando signals reactivos para el estado de validación (como `valid`, `invalid`, `errors`), rastreo de interacción (como `touched`, `dirty`) y disponibilidad (como `disabled`, `hidden`).

## Entendiendo el estado de campos

Cuando creas un formulario con la función `form()`, retorna un **field tree** - una estructura de objeto que refleja tu modelo de formulario. Cada campo en el árbol es accesible mediante notación de punto (como `form.email`).

### Accediendo al estado del campo

Cuando llamas a cualquier campo en el field tree como una función (como `form.email()`), retorna un objeto `FieldState` que contiene signals reactivos que rastrean la validación del campo, interacción y estado de disponibilidad. Por ejemplo, el signal `invalid()` te dice si el campo tiene errores de validación:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required, email } from '@angular/forms/signals'

@Component({
  selector: 'app-registration',
  imports: [Field],
  template: `
    <input type="email" [field]="registrationForm.email" />

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

### Signals de estado de campo

El signal más comúnmente usado es `value()`, un [signal editable](guide/forms/signals/models#updating-models) que proporciona acceso al valor actual del campo:

```ts
const emailValue = registrationForm.email().value()
console.log(emailValue) // Current email string
```

Más allá de `value()`, el estado del campo incluye signals para validación, rastreo de interacción y control de disponibilidad:

| Categoría                                     | Signal       | Descripción                                                                                            |
| --------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| **[Estado de validación](#estado-de-validación)** | `valid()`    | El campo pasa todas las reglas de validación y no tiene validadores pendientes                        |
|                                               | `invalid()`  | El campo tiene errores de validación                                                                   |
|                                               | `errors()`   | Array de objetos de error de validación                                                               |
|                                               | `pending()`  | Validación asíncrona en progreso                                                                       |
| **[Estado de interacción](#estado-de-interacción)** | `touched()`  | El usuario ha enfocado y desenfocado el campo (si es interactivo)                                     |
|                                               | `dirty()`    | El usuario ha modificado el campo (si es interactivo), incluso si el valor coincide con el estado inicial |
| **[Estado de disponibilidad](#estado-de-disponibilidad)** | `disabled()` | El campo está deshabilitado y no afecta el estado del formulario padre                                |
|                                               | `hidden()`   | Indica que el campo debe estar oculto; la visibilidad en la plantilla se controla con `@if`           |
|                                               | `readonly()` | El campo es de solo lectura y no afecta el estado del formulario padre                                |

Estos signals te permiten construir experiencias de usuario de formularios responsivas que reaccionan al comportamiento del usuario. Las secciones a continuación exploran cada categoría en detalle.

## Estado de validación

Los signals de estado de validación te indican si un campo es válido y qué errores contiene.

NOTA: Esta guía se enfoca en **usar** el estado de validación en tus plantillas y lógica (como leer `valid()`, `invalid()`, `errors()` para mostrar retroalimentación). Para información sobre **definir** reglas de validación y crear validadores personalizados, consulta la guía de Validación (próximamente).

### Verificando validez

Usa `valid()` e `invalid()` para verificar el estado de validación:

```angular-ts
@Component({
  template: `
    <input type="email" [field]="loginForm.email" />

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

### Leyendo errores de validación

Accede al array de errores de validación con `errors()`. Cada objeto de error contiene:

| Propiedad | Descripción                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| `kind`    | La regla de validación que falló (como "required" o "email")                   |
| `message` | Mensaje de error legible opcional                                              |
| `field`   | Referencia al `FieldTree` donde ocurrió el error                               |

NOTA: La propiedad `message` es opcional. Los validadores pueden proporcionar mensajes de error personalizados, pero si no se especifica, puede que necesites mapear los valores de `kind` de error a tus propios mensajes.

Aquí hay un ejemplo de cómo mostrar errores en tu plantilla:

```angular-ts
@Component({
  template: `
    <input type="email" [field]="loginForm.email" />

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

### Validación pendiente

El signal `pending()` indica que la validación asíncrona está en progreso:

```angular-ts
@Component({
  template: `
    <input type="email" [field]="signupForm.email" />

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

## Estado de interacción

El estado de interacción rastrea si los usuarios han interactuado con los campos, habilitando patrones como "mostrar errores solo después de que el usuario haya tocado un campo".

### Estado touched

El signal `touched()` rastrea si un usuario ha enfocado y luego desenfocado un campo. Se vuelve `true` cuando un usuario enfoca y luego desenfoca un campo a través de interacción del usuario (no programáticamente). Los campos ocultos, deshabilitados y de solo lectura no son interactivos y no se vuelven touched desde interacciones del usuario.

### Estado dirty

Los formularios a menudo necesitan detectar si los datos realmente han cambiado - por ejemplo, para advertir a los usuarios sobre cambios no guardados o para habilitar un botón de guardar solo cuando sea necesario. El signal `dirty()` rastrea si el usuario ha modificado el campo.

El signal `dirty()` se vuelve `true` cuando el usuario modifica el valor de un campo interactivo, y permanece `true` incluso si el valor se cambia de vuelta para coincidir con el valor inicial:

```angular-ts
@Component({
  template: `
    <form>
      <input [field]="profileForm.name" />
      <input [field]="profileForm.bio" />

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

## Estado de disponibilidad

Los signals de estado de disponibilidad controlan si los campos son interactivos, editables o visibles. Los campos deshabilitados, ocultos y de solo lectura no son interactivos. No afectan si su formulario padre es válido, touched o dirty.

### Campos deshabilitados

El signal `disabled()` indica si un campo acepta entrada del usuario. Los campos deshabilitados aparecen en la interfaz de usuario pero los usuarios no pueden interactuar con ellos.

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, disabled } from '@angular/forms/signals'

@Component({
  selector: 'app-order',
  imports: [Field],
  template: `
    <!-- TIP: The `[field]` directive automatically binds the `disabled` attribute based on the field's `disabled()` state, so you don't need to manually add `[disabled]="field().disabled()"` -->
    <input [field]="orderForm.couponCode" />

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

### Campos ocultos

El signal `hidden()` indica si un campo está condicionalmente oculto. Usa `hidden()` con `@if` para mostrar u ocultar campos según condiciones:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, hidden } from '@angular/forms/signals'

@Component({
  selector: 'app-profile',
  imports: [Field],
  template: `
    <label>
      <input type="checkbox" [field]="profileForm.isPublic" />
      Make profile public
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        Public URL
        <input [field]="profileForm.publicUrl" />
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

### Campos de solo lectura

El signal `readonly()` indica si un campo es de solo lectura. Los campos de solo lectura muestran su valor pero los usuarios no pueden editarlos:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, readonly } from '@angular/forms/signals'

@Component({
  selector: 'app-account',
  imports: [Field],
  template: `
    <label>
      Username (cannot be changed)
      <input [field]="accountForm.username" />
    </label>

    <label>
      Email
      <input [field]="accountForm.email" />
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

NOTA: La directiva `[field]` vincula automáticamente el atributo `readonly` basándose en el estado `readonly()` del campo, por lo que no necesitas agregar manualmente `[readonly]="field().readonly()"`.

Al igual que los campos deshabilitados y ocultos, los campos de solo lectura no son interactivos y no afectan el estado del formulario padre. El estado `readonly()` afecta la editabilidad y validación, pero no cambia el valor del campo.

### Cuándo usar cada uno

| Estado       | Usar cuando                                                                       | Usuario puede verlo | Usuario puede interactuar | Contribuye a la validación |
| ------------ | --------------------------------------------------------------------------------- | ------------------- | ------------------------- | -------------------------- |
| `disabled()` | El campo está temporalmente no disponible (como basándose en otros valores de campos) | Sí                  | No                        | No                         |
| `hidden()`   | El campo no es relevante en el contexto actual                                    | No (con @if)        | No                        | No                         |
| `readonly()` | El valor debe ser visible pero no editable                                        | Sí                  | No                        | No                         |

## Estado a nivel de formulario

El formulario raíz también es un campo en el field tree. Cuando lo llamas como una función, también retorna un objeto `FieldState` que agrega el estado de todos los campos hijos.

### Accediendo al estado del formulario

```angular-ts
@Component({
  template: `
    <form>
      <input [field]="loginForm.email" />
      <input [field]="loginForm.password" />

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

### Signals a nivel de formulario

Debido a que el formulario raíz es un campo, tiene los mismos signals (como `valid()`, `invalid()`, `touched()`, `dirty()`, etc.).

| Signal      | Comportamiento a nivel de formulario                                             |
| ----------- | -------------------------------------------------------------------------------- |
| `valid()`   | Todos los campos interactivos son válidos y no hay validadores pendientes       |
| `invalid()` | Al menos un campo interactivo tiene errores de validación                       |
| `pending()` | Al menos un campo interactivo tiene validación asíncrona pendiente              |
| `touched()` | El usuario ha tocado al menos un campo interactivo                              |
| `dirty()`   | El usuario ha modificado al menos un campo interactivo                          |

### Cuándo usar a nivel de formulario vs a nivel de campo

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

## Propagación de estado

El estado del campo se propaga desde los campos hijos hacia arriba a través de grupos de campos padre hasta el formulario raíz.

### Cómo el estado hijo afecta a los formularios padre

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

### Campos ocultos, deshabilitados y de solo lectura

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

## Usando estado en plantillas

Los signals de estado de campo se integran perfectamente con las plantillas de Angular, habilitando experiencias de usuario de formularios reactivos sin manejo manual de eventos.

### Visualización condicional de errores

Muestra errores solo después de que un usuario haya interactuado con un campo:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, email } from '@angular/forms/signals'

@Component({
  selector: 'app-signup',
  imports: [Field],
  template: `
    <label>
      Email
      <input type="email" [field]="signupForm.email" />
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

### Disponibilidad condicional de campos

Usa el signal `hidden()` con `@if` para mostrar u ocultar campos condicionalmente:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, hidden } from '@angular/forms/signals'

@Component({
  selector: 'app-order',
  imports: [Field],
  template: `
    <label>
      <input type="checkbox" [field]="orderForm.requiresShipping" />
      Requires shipping
    </label>

    @if (!orderForm.shippingAddress().hidden()) {
      <label>
        Shipping Address
        <input [field]="orderForm.shippingAddress" />
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

## Usando estado de campo en lógica de componentes

Los signals de estado de campo funcionan con las primitivas reactivas de Angular como `computed()` y `effect()` para lógica de formularios avanzada.

### Verificaciones de validación antes del envío

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

### Estado derivado con computed

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

### Cambios de estado programáticos

Aunque el estado del campo típicamente se actualiza a través de interacciones del usuario (escribir, enfocar, desenfocar), a veces necesitas controlarlo programáticamente. Los escenarios comunes incluyen el envío de formularios y el reseteo de formularios.

#### Envío de formularios

Cuando un usuario envía un formulario, usa la función `submit()` para manejar la validación y revelar errores:

```ts
import { Component, signal } from '@angular/core'
import { form, submit, required, email } from '@angular/forms/signals'

export class Registration {
  registrationModel = signal({ username: '', email: '', password: '' })

  registrationForm = form(this.registrationModel, schemaPath => {
    required(schemaPath.username)
    email(schemaPath.email)
    required(schemaPath.password)
  })

  onSubmit() {
    submit(this.registrationForm, () => {
      this.submitToServer()
    })
  }

  submitToServer() {
    // Send data to server
  }
}
```

La función `submit()` marca automáticamente todos los campos como touched (revelando errores de validación) y solo ejecuta tu callback si el formulario es válido.

#### Reseteando formularios después del envío

Después de enviar exitosamente un formulario, puedes querer devolverlo a su estado inicial - limpiando tanto el historial de interacción del usuario como los valores de los campos. El método `reset()` limpia las banderas touched y dirty pero no cambia los valores de los campos, por lo que necesitas actualizar tu modelo por separado:

```ts
export class Contact {
  contactModel = signal({ name: '', email: '', message: '' })
  contactForm = form(this.contactModel)

  async onSubmit() {
    if (!this.contactForm().valid()) return

    await this.api.sendMessage(this.contactModel())

    // Clear interaction state (touched, dirty)
    this.contactForm().reset()

    // Clear values
    this.contactModel.set({ name: '', email: '', message: '' })
  }
}
```

Este reseteo de dos pasos asegura que el formulario esté listo para nueva entrada sin mostrar mensajes de error obsoletos o indicadores de estado dirty.

## Estilizando basándose en el estado de validación

Puedes aplicar estilos personalizados a tu formulario vinculando clases CSS basándote en el estado de validación:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, email } from '@angular/forms/signals'

@Component({
  template: `
    <input
      type="email"
      [field]="form.email"
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

## Próximos pasos

Aquí hay otras guías relacionadas sobre Signal Forms:

- [Guía de modelos de formularios](guide/forms/signals/models) - Creando modelos y actualizando valores
- Guía de validación - Definiendo reglas de validación y validadores personalizados (próximamente)
