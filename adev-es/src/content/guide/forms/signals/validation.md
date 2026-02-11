# Validación

Los formularios necesitan validación para asegurar que los usuarios proporcionen datos correctos y completos antes del envío. Sin validación, tendrías que manejar problemas de calidad de datos en el servidor, proporcionar una mala experiencia de usuario con mensajes de error poco claros, y verificar manualmente cada restricción.

Signal Forms proporciona un enfoque de validación basado en esquemas. Las reglas de validación se vinculan a los campos usando una función de esquema, se ejecutan automáticamente cuando los valores cambian, y exponen errores a través de signals de estado de campo. Esto permite una validación reactiva que se actualiza a medida que los usuarios interactúan con el formulario.

<docs-code-multifile preview hideCode path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.css"/>
</docs-code-multifile>

## Fundamentos de validación

La validación en Signal Forms se define a través de una función de esquema pasada como segundo argumento a `form()`.

### La función de esquema

La función de esquema recibe un objeto `SchemaPathTree` que te permite definir tus reglas de validación:

<docs-code
  header="app.ts"
  path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"
  visibleLines="[21,22,23,24,25,26,27]"
  highlight="[23,24,26]"
/>

La función de esquema se ejecuta una vez durante la inicialización del formulario. Las reglas de validación se vinculan a los campos usando el parámetro de ruta de esquema (como `schemaPath.email`, `schemaPath.password`), y la validación se ejecuta automáticamente cuando los valores de los campos cambian.

NOTA: El parámetro callback del esquema (`schemaPath` en estos ejemplos) es un objeto `SchemaPathTree` que proporciona rutas a todos los campos en tu formulario. Puedes nombrar este parámetro como desees.

### Cómo funciona la validación

La validación en Signal Forms sigue este patrón:

1. **Definir reglas de validación en el esquema** - Vincular reglas de validación a los campos en la función de esquema
2. **Ejecución automática** - Las reglas de validación se ejecutan cuando los valores de los campos cambian
3. **Propagación de errores** - Los errores de validación se exponen a través de signals de estado de campo
4. **Actualizaciones reactivas** - La UI se actualiza automáticamente cuando el estado de validación cambia

La validación se ejecuta en cada cambio de valor para campos interactivos. Los campos ocultos y deshabilitados no ejecutan validación - sus reglas de validación se omiten hasta que el campo se vuelve interactivo nuevamente.

### Momento de la validación

Las reglas de validación se ejecutan en este orden:

1. **Validación síncrona** - Todas las reglas de validación síncronas se ejecutan cuando el valor cambia
2. **Validación asíncrona** - Las reglas de validación asíncronas se ejecutan solo después de que todas las reglas de validación síncronas pasen
3. **Actualizaciones de estado de campo** - Los signals `valid()`, `invalid()`, `errors()`, y `pending()` se actualizan

Las reglas de validación síncronas (como `required()`, `email()`) se completan inmediatamente. Las reglas de validación asíncronas (como `validateHttp()`) pueden tomar tiempo y establecen el signal `pending()` en `true` mientras se ejecutan.

Todas las reglas de validación se ejecutan en cada cambio - la validación no se detiene después del primer error. Si un campo tiene reglas de validación `required()` y `email()`, ambas se ejecutan, y ambas pueden producir errores simultáneamente.

## Reglas de validación integradas

Signal Forms proporciona reglas de validación para escenarios de validación comunes. Todas las reglas de validación integradas aceptan un objeto de opciones para mensajes de error personalizados y lógica condicional.

### required()

La regla de validación `required()` asegura que un campo tenga un valor:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required } from '@angular/forms/signals'

@Component({
  selector: 'app-registration',
  imports: [Field],
  template: `
    <form>
      <label>
        Username
        <input [field]="registrationForm.username" />
      </label>

      <label>
        Email
        <input type="email" [field]="registrationForm.email" />
      </label>

      <button type="submit">Register</button>
    </form>
  `
})
export class RegistrationComponent {
  registrationModel = signal({
    username: '',
    email: ''
  })

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' })
    required(schemaPath.email, { message: 'Email is required' })
  })
}
```

Un campo se considera "vacío" cuando:

| Condición                   | Ejemplo |
| --------------------------- | ------- |
| El valor es `null`          | `null`, |
| El valor es una cadena vacía| `''`    |
| El valor es un array vacío  | `[]`    |

Para requisitos condicionales, usa la opción `when`:

```ts
registrationForm = form(this.registrationModel, (schemaPath) => {
  required(schemaPath.promoCode, {
    message: 'Promo code is required for discounts',
    when: ({valueOf}) => valueOf(schemaPath.applyDiscount)
  })
})
```

La regla de validación solo se ejecuta cuando la función `when` devuelve `true`.

### email()

La regla de validación `email()` verifica un formato de email válido:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, email } from '@angular/forms/signals'

@Component({
  selector: 'app-contact',
  imports: [Field],
  template: `
    <form>
      <label>
        Your Email
        <input type="email" [field]="contactForm.email" />
      </label>
    </form>
  `
})
export class ContactComponent {
  contactModel = signal({ email: '' })

  contactForm = form(this.contactModel, (schemaPath) => {
    email(schemaPath.email, { message: 'Please enter a valid email address' })
  })
}
```

La regla de validación `email()` usa una expresión regular de formato de email estándar. Acepta direcciones como `user@example.com` pero rechaza direcciones malformadas como `user@` o `@example.com`.

### min() y max()

Las reglas de validación `min()` y `max()` funcionan con valores numéricos:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, min, max } from '@angular/forms/signals'

@Component({
  selector: 'app-age-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Age
        <input type="number" [field]="ageForm.age" />
      </label>

      <label>
        Rating (1-5)
        <input type="number" [field]="ageForm.rating" />
      </label>
    </form>
  `
})
export class AgeFormComponent {
  ageModel = signal({
    age: 0,
    rating: 0
  })

  ageForm = form(this.ageModel, (schemaPath) => {
    min(schemaPath.age, 18, { message: 'You must be at least 18 years old' })
    max(schemaPath.age, 120, { message: 'Please enter a valid age' })

    min(schemaPath.rating, 1, { message: 'Rating must be at least 1' })
    max(schemaPath.rating, 5, { message: 'Rating cannot exceed 5' })
  })
}
```

Puedes usar valores computed para restricciones dinámicas:

```ts
ageForm = form(this.ageModel, (schemaPath) => {
  min(schemaPath.participants, () => this.minimumRequired(), {
    message: 'Not enough participants'
  })
})
```

### minLength() y maxLength()

Las reglas de validación `minLength()` y `maxLength()` funcionan con cadenas y arrays:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, minLength, maxLength } from '@angular/forms/signals'

@Component({
  selector: 'app-password-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Password
        <input type="password" [field]="passwordForm.password" />
      </label>

      <label>
        Bio
        <textarea [field]="passwordForm.bio"></textarea>
      </label>
    </form>
  `
})
export class PasswordFormComponent {
  passwordModel = signal({
    password: '',
    bio: ''
  })

  passwordForm = form(this.passwordModel, (schemaPath) => {
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' })
    maxLength(schemaPath.password, 100, { message: 'Password is too long' })

    maxLength(schemaPath.bio, 500, { message: 'Bio cannot exceed 500 characters' })
  })
}
```

Para cadenas, "longitud" significa el número de caracteres. Para arrays, "longitud" significa el número de elementos.

### pattern()

La regla de validación `pattern()` valida contra una expresión regular:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, pattern } from '@angular/forms/signals'

@Component({
  selector: 'app-phone-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Phone Number
        <input [field]="phoneForm.phone" placeholder="555-123-4567" />
      </label>

      <label>
        Postal Code
        <input [field]="phoneForm.postalCode" placeholder="12345" />
      </label>
    </form>
  `
})
export class PhoneFormComponent {
  phoneModel = signal({
    phone: '',
    postalCode: ''
  })

  phoneForm = form(this.phoneModel, (schemaPath) => {
    pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, {
      message: 'Phone must be in format: 555-123-4567'
    })

    pattern(schemaPath.postalCode, /^\d{5}$/, {
      message: 'Postal code must be 5 digits'
    })
  })
}
```

Patrones comunes:

| Tipo de Patrón       | Expresión Regular       | Ejemplo      |
| -------------------- | ----------------------- | ------------ |
| Teléfono             | `/^\d{3}-\d{3}-\d{4}$/` | 555-123-4567 |
| Código postal (US)   | `/^\d{5}$/`             | 12345        |
| Alfanumérico         | `/^[a-zA-Z0-9]+$/`      | abc123       |
| Seguro para URL      | `/^[a-zA-Z0-9_-]+$/`    | my-url_123   |

## Errores de validación

Cuando las reglas de validación fallan, producen objetos de error que describen qué salió mal. Entender la estructura de errores te ayuda a proporcionar comentarios claros a los usuarios.

<!-- TODO: Uncomment when field state management guide is published

NOTA: Esta sección cubre los errores que producen las reglas de validación. Para mostrar y usar errores de validación en tu UI, consulta la [guía de Gestión de Estado de Campo](guide/forms/signals/field-state-management). -->

### Estructura del error

Cada objeto de error de validación contiene estas propiedades:

| Propiedad | Descripción                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `kind`    | La regla de validación que falló (ej., "required", "email", "minLength")   |
| `message` | Mensaje de error legible opcional                                           |

Las reglas de validación integradas establecen automáticamente la propiedad `kind`. La propiedad `message` es opcional - puedes proporcionar mensajes personalizados a través de las opciones de regla de validación.

### Mensajes de error personalizados

Todas las reglas de validación integradas aceptan una opción `message` para texto de error personalizado:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required, minLength } from '@angular/forms/signals'

@Component({
  selector: 'app-signup',
  imports: [Field],
  template: `
    <form>
      <label>
        Username
        <input [field]="signupForm.username" />
      </label>

      <label>
        Password
        <input type="password" [field]="signupForm.password" />
      </label>
    </form>
  `
})
export class SignupComponent {
  signupModel = signal({
    username: '',
    password: ''
  })

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'Please choose a username'
    })

    required(schemaPath.password, {
      message: 'Password cannot be empty'
    })
    minLength(schemaPath.password, 12, {
      message: 'Password must be at least 12 characters for security'
    })
  })
}
```

Los mensajes personalizados deben ser claros, específicos, y decirle a los usuarios cómo solucionar el problema. En lugar de "Invalid input", usa "Password must be at least 12 characters for security".

### Múltiples errores por campo

Cuando un campo tiene múltiples reglas de validación, cada regla de validación se ejecuta independientemente y puede producir un error:

```ts
signupForm = form(this.signupModel, (schemaPath) => {
  required(schemaPath.email, { message: 'Email is required' })
  email(schemaPath.email, { message: 'Enter a valid email address' })
  minLength(schemaPath.email, 5, { message: 'Email is too short' })
})
```

Si el campo de email está vacío, solo aparece el error de `required()`. Si el usuario escribe "a@b", aparecen ambos errores de `email()` y `minLength()`. Todas las reglas de validación se ejecutan - la validación no se detiene después del primer fallo.

CONSEJO: Usa el patrón `touched() && invalid()` en tus plantillas para evitar que los errores aparezcan antes de que los usuarios hayan interactuado con un campo. Para una guía completa sobre cómo mostrar errores de validación, consulta la [guía de Gestión de Estado de Campo](guide/forms/signals/field-state-management#conditional-error-display).

## Reglas de validación personalizadas

Aunque las reglas de validación integradas manejan casos comunes, a menudo necesitarás lógica de validación personalizada para reglas de negocio, formatos complejos, o restricciones específicas del dominio.

### Usando validate()

La función `validate()` crea reglas de validación personalizadas. Recibe una función validadora que accede al contexto del campo y devuelve:

| Valor de Retorno      | Significado       |
| --------------------- | ----------------- |
| Objeto de error       | El valor es inválido |
| `null` o `undefined`  | El valor es válido   |

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, validate } from '@angular/forms/signals'

@Component({
  selector: 'app-url-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Website URL
        <input [field]="urlForm.website" />
      </label>
    </form>
  `
})
export class UrlFormComponent {
  urlModel = signal({ website: '' })

  urlForm = form(this.urlModel, (schemaPath) => {
    validate(schemaPath.website, ({value}) => {
      if (!value().startsWith('https://')) {
        return {
          kind: 'https',
          message: 'URL must start with https://'
        }
      }

      return null
    })
  })
}
```

La función validadora recibe un objeto `FieldContext` con:

| Propiedad       | Tipo       | Descripción                                        |
| --------------- | ---------- | -------------------------------------------------- |
| `value`         | Signal     | Signal que contiene el valor actual del campo      |
| `state`         | FieldState | La referencia al estado del campo                  |
| `field`         | FieldTree  | La referencia al árbol de campo                    |
| `valueOf()`     | Método     | Obtener el valor de otro campo por ruta            |
| `stateOf()`     | Método     | Obtener el estado de otro campo por ruta           |
| `fieldTreeOf()` | Método     | Obtener el árbol de campo de otro campo por ruta   |
| `pathKeys`      | Signal     | Claves de ruta desde la raíz hasta el campo actual |

NOTA: Los campos hijos también tienen un signal `key`, y los campos de elementos de array tienen tanto `key` como `index` signals.

Devuelve un objeto de error con `kind` y `message` cuando la validación falla. Devuelve `null` o `undefined` cuando la validación pasa.

### Reglas de validación reutilizables

Crea funciones de reglas de validación reutilizables envolviendo `validate()`:

```ts
function url(field: any, options?: { message?: string }) {
  validate(field, ({value}) => {
    try {
      new URL(value())
      return null
    } catch {
      return {
        kind: 'url',
        message: options?.message || 'Enter a valid URL'
      }
    }
  })
}

function phoneNumber(field: any, options?: { message?: string }) {
  validate(field, ({value}) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/

    if (!phoneRegex.test(value())) {
      return {
        kind: 'phoneNumber',
        message: options?.message || 'Phone must be in format: 555-123-4567'
      }
    }

    return null
  })
}
```

Puedes usar reglas de validación personalizadas igual que las reglas de validación integradas:

```ts
urlForm = form(this.urlModel, (schemaPath) => {
  url(schemaPath.website, { message: 'Please enter a valid website URL' })
  phoneNumber(schemaPath.phone)
})
```

## Validación entre campos

La validación entre campos compara o relaciona valores de múltiples campos.

Un escenario común para validación entre campos es la confirmación de contraseña:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required, minLength, validate } from '@angular/forms/signals'

@Component({
  selector: 'app-password-change',
  imports: [Field],
  template: `
    <form>
      <label>
        New Password
        <input type="password" [field]="passwordForm.password" />
      </label>

      <label>
        Confirm Password
        <input type="password" [field]="passwordForm.confirmPassword" />
      </label>

      <button type="submit">Change Password</button>
    </form>
  `
})
export class PasswordChangeComponent {
  passwordModel = signal({
    password: '',
    confirmPassword: ''
  })

  passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, { message: 'Password is required' })
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' })

    required(schemaPath.confirmPassword, { message: 'Please confirm your password' })

    validate(schemaPath.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value()
      const password = valueOf(schemaPath.password)

      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match'
        }
      }

      return null
    })
  })
}
```

La regla de validación de confirmación accede al valor del campo de contraseña usando `valueOf(schemaPath.password)` y lo compara con el valor de confirmación. Esta regla de validación se ejecuta de forma reactiva - si cualquiera de las contraseñas cambia, la validación se vuelve a ejecutar automáticamente.

## Validación asíncrona

La validación asíncrona maneja validación que requiere fuentes de datos externas, como verificar la disponibilidad de nombre de usuario en un servidor o validar contra una API.

### Usando validateHttp()

La función `validateHttp()` realiza validación basada en HTTP:

```angular-ts
import { Component, signal, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { form, Field, required, validateHttp } from '@angular/forms/signals'

@Component({
  selector: 'app-username-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Username
        <input [field]="usernameForm.username" />

        @if (usernameForm.username().pending()) {
          <span class="checking">Checking availability...</span>
        }
      </label>
    </form>
  `
})
export class UsernameFormComponent {
  http = inject(HttpClient)

  usernameModel = signal({ username: '' })

  usernameForm = form(this.usernameModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' })

    validateHttp(schemaPath.username, {
      request: ({value}) => `/api/check-username?username=${value()}`,
      onSuccess: (response: any) => {
        if (response.taken) {
          return {
            kind: 'usernameTaken',
            message: 'Username is already taken'
          }
        }
        return null
      },
      onError: (error) => ({
        kind: 'networkError',
        message: 'Could not verify username availability'
      })
    })
  })
}
```

La regla de validación `validateHttp()`:

1. Llama a la URL o petición devuelta por la función `request`
2. Mapea la respuesta exitosa a un error de validación o `null` usando `onSuccess`
3. Maneja fallos de petición (errores de red, errores HTTP) usando `onError`
4. Establece `pending()` en `true` mientras la petición está en progreso
5. Solo se ejecuta después de que todas las reglas de validación síncronas pasen

### Estado pendiente

Mientras se ejecuta la validación asíncrona, el signal `pending()` del campo devuelve `true`. Usa esto para mostrar indicadores de carga:

```ts
@if (form.username().pending()) {
  <span class="spinner">Checking...</span>
}
```

El signal `valid()` devuelve `false` mientras la validación está pendiente, incluso si aún no hay errores. El signal `invalid()` solo devuelve `true` si existen errores.

## Próximos pasos

Esta guía cubrió la creación y aplicación de reglas de validación. Las guías relacionadas exploran otros aspectos de Signal Forms:

- [Guía de Modelos de Formulario](guide/forms/signals/models) - Creando y actualizando modelos de formulario
  <!-- TODO: Uncomment when Field State Management guide is published -->
  <!-- - [Guía de Gestión de Estado de Campo](guide/forms/signals/field-state-management) - Usando estado de validación en plantillas y mostrando errores -->
