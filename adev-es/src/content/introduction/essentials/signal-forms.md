<docs-decorative-header title="Formularios con signals" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

IMPORTANTE: Signal Forms es [experimental](/reference/releases#experimental). La API puede cambiar en versiones futuras. Evita usar APIs experimentales en aplicaciones de producción sin entender los riesgos.

Signal Forms gestiona el estado de formularios usando signals en Angular para proporcionar sincronización automática entre tu modelo de datos y la interfaz de usuario con Signals en Angular.

Esta guía te lleva a través de los conceptos básicos para crear formularios con Signal Forms. Así es como funciona:

## Creando tu primer formulario

### 1. Crea un modelo de formulario con `signal()`

Cada formulario comienza creando un signal que mantiene el modelo de datos de tu formulario:

```ts
interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

### 2. Pasa el modelo de formulario a `form()` para crear un `FieldTree`

Luego, pasas tu modelo de formulario a la función `form()` para crear un **field tree** (árbol de campos) - una estructura de objetos que refleja la forma de tu modelo, permitiéndote acceder a los campos con notación de punto:

```ts
const loginForm = form(loginModel);

// Accede a los campos directamente por nombre de propiedad
loginForm.email
loginForm.password
```

### 3. Vincula inputs HTML con la directiva `[field]`

A continuación, vinculas tus inputs HTML al formulario usando la directiva `[field]`, que crea enlace bidireccional entre ellos:

```html
<input type="email" [field]="loginForm.email" />
<input type="password" [field]="loginForm.password" />
```

Como resultado, los cambios del usuario (como escribir en el campo) actualizan automáticamente el formulario.

NOTA: La directiva `[field]` también sincroniza el estado del campo para atributos como `required`, `disabled` y `readonly` cuando corresponde.

### 4. Lee valores de campo con `value()`

Puedes acceder al estado del campo llamando al campo como una función. Esto devuelve un objeto `FieldState` que contiene signals reactivos para el valor del campo, estado de validación y estado de interacción:

```ts
loginForm.email() // Devuelve FieldState con value(), valid(), touched(), etc.
```

Para leer el valor actual del campo, accede al signal `value()`:

```html
<!-- Renderiza el valor del formulario que se actualiza automáticamente mientras el usuario escribe -->
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Obtiene el valor actual
const currentEmail = loginForm.email().value();
```

### 5. Actualiza valores de campo con `set()`

Puedes actualizar programáticamente el valor de un campo usando el método `value.set()`. Esto actualiza tanto el campo como el signal del modelo subyacente:

```ts
// Actualiza el valor programáticamente
loginForm.email().value.set('alice@wonderland.com');
```

Como resultado, tanto el valor del campo como el signal del modelo se actualizan automáticamente:

```ts
// El signal del modelo también se actualiza
console.log(loginModel().email); // 'alice@wonderland.com'
```

Aquí tienes un ejemplo completo:

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## Uso básico

La directiva `[field]` funciona con todos los tipos de input HTML estándar. Aquí están los patrones más comunes:

### Inputs de texto

Los inputs de texto funcionan con varios atributos `type` y textareas:

```html
<!-- Text y email -->
<input type="text" [field]="form.name" />
<input type="email" [field]="form.email" />
```

#### Números

Los inputs numéricos convierten automáticamente entre strings y números:

```html
<!-- Number - convierte automáticamente al tipo number -->
<input type="number" [field]="form.age" />
```

#### Fecha y hora

Los inputs de fecha almacenan valores como strings `YYYY-MM-DD`, y los inputs de hora usan formato `HH:mm`:

```html
<!-- Date y time - almacena como strings en formato ISO -->
<input type="date" [field]="form.eventDate" />
<input type="time" [field]="form.eventTime" />
```

Si necesitas convertir strings de fecha a objetos Date, puedes hacerlo pasando el valor del campo a `Date()`:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### Texto multilínea

Los textareas funcionan de la misma manera que los inputs de texto:

```html
<!-- Textarea -->
<textarea [field]="form.message" rows="4"></textarea>
```

### Checkboxes

Los checkboxes se vinculan a valores booleanos:

```html
<!-- Checkbox único -->
<label>
  <input type="checkbox" [field]="form.agreeToTerms" />
  Acepto los términos
</label>
```

#### Múltiples checkboxes

Para múltiples opciones, crea un `field` booleano separado para cada una:

```html
<label>
  <input type="checkbox" [field]="form.emailNotifications" />
  Notificaciones por email
</label>
<label>
  <input type="checkbox" [field]="form.smsNotifications" />
  Notificaciones por SMS
</label>
```

### Botones de radio

Los botones de radio funcionan de manera similar a los checkboxes. Mientras los botones de radio usen el mismo valor `[field]`, Signal Forms vinculará automáticamente el mismo atributo `name` a todos ellos:

```html
<label>
  <input type="radio" value="free" [field]="form.plan" />
  Gratis
</label>
<label>
  <input type="radio" value="premium" [field]="form.plan" />
  Premium
</label>
```

Cuando un usuario selecciona un botón de radio, el `field` del formulario almacena el valor del atributo `value` de ese botón de radio. Por ejemplo, seleccionar "Premium" establece `form.plan().value()` a `"premium"`.

### Menús desplegables select

Los elementos select funcionan con opciones tanto estáticas como dinámicas:

```html
<!-- Opciones estáticas -->
<select [field]="form.country">
  <option value="">Selecciona un país</option>
  <option value="us">Estados Unidos</option>
  <option value="ca">Canadá</option>
</select>

<!-- Opciones dinámicas con @for -->
<select [field]="form.productId">
  <option value="">Selecciona un producto</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTA: Select múltiple (`<select multiple>`) no está soportado por la directiva `[field]` en este momento.

## Validación y estado

Signal Forms proporciona validadores integrados que puedes aplicar a los campos de tu formulario. Para agregar validación, pasa una función de esquema como segundo argumento a `form()`:

```ts
const loginForm = form(loginModel, (schemaPath) => {
  debounce(schemaPath.email, 500);
  required(schemaPath.email);
  email(schemaPath.email);
});
```

La función de esquema recibe un parámetro **schema path** que proporciona rutas a tus campos para configurar reglas de validación.

Los validadores comunes incluyen:

- **`required()`** - Asegura que el campo tenga un valor
- **`email()`** - Valida formato de email
- **`min()`** / **`max()`** - Valida rangos numéricos
- **`minLength()`** / **`maxLength()`** - Valida longitud de string o colección
- **`pattern()`** - Valida contra un patrón regex

También puedes personalizar mensajes de error pasando un objeto de opciones como segundo argumento al validador:

```ts
required(schemaPath.email, { message: 'El email es requerido' });
email(schemaPath.email, { message: 'Por favor ingresa un email válido' });
```

Cada campo de formulario expone su estado de validación a través de signals. Por ejemplo, puedes verificar `field().valid()` para ver si la validación pasa, `field().touched()` para ver si el usuario ha interactuado con él, y `field().errors()` para obtener la lista de errores de validación.

Aquí tienes un ejemplo completo:

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

### Signals de Estado de Campo

Cada `field()` proporciona estos signals de estado:

| Estado       | Descripción                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| `valid()`    | Devuelve `true` si el campo pasa todas las reglas de validación                |
| `touched()`  | Devuelve `true` si el usuario ha enfocado y desenfocado el campo               |
| `dirty()`    | Devuelve `true` si el usuario ha cambiado el valor                             |
| `disabled()` | Devuelve `true` si el campo está deshabilitado                                  |
| `readonly()` | Devuelve `true` si el campo es de solo lectura                                  |
| `pending()`  | Devuelve `true` si la validación asíncrona está en progreso                     |
| `errors()`   | Devuelve un array de errores de validación con propiedades `kind` y `message`  |

## Siguientes pasos

Para aprender más sobre Signal Forms y cómo funciona, consulta las guías detalladas:

- [Visión general](guide/forms/signals/overview) - Introducción a Signal Forms y cuándo usarlos
- [Modelos de formulario](guide/forms/signals/models) - Creando y gestionando datos de formularios con signals
- [Gestión de estado de campo](guide/forms/signals/field-state-management) - Trabajando con estado de validación, seguimiento de interacción y visibilidad de campos
- [Validación](guide/forms/signals/validation) - Validadores integrados, reglas de validación personalizadas y validación asíncrona
