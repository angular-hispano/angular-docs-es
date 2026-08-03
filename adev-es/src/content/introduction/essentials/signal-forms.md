<docs-decorative-header title="Formularios con signals" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

Signal Forms gestiona el estado de formularios usando signals en Angular para proporcionar sincronización automática entre tu modelo de datos y la interfaz de usuario con Signals en Angular.

Esta guía te lleva a través de los conceptos básicos para crear formularios con Signal Forms. Así es como funciona:

## Creando tu primer formulario {#creating-your-first-form}

### 1. Crea un modelo de formulario con `signal()` {#1-create-a-form-model-with-signal}

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

### 2. Pasa el modelo de formulario a `form()` para crear un `FieldTree` {#2-pass-the-form-model-to-form-to-create-a-fieldtree}

Luego, pasas tu modelo de formulario a la función `form()` para crear un **field tree** (árbol de campos) - una estructura de objetos que refleja la forma de tu modelo, permitiéndote acceder a los campos con notación de punto.
Tanto el objeto raíz del formulario como sus propiedades anidadas son nodos `FieldTree`:

```ts
const loginForm = form(loginModel);

loginForm; // es un FieldTree
loginForm.email; // también es un FieldTree
```

### 3. Vincula inputs HTML con la directiva `[formField]` {#3-bind-html-inputs-with-formfield-directive}

A continuación, vinculas tus inputs HTML al formulario usando la directiva `[formField]`, que crea enlace bidireccional entre ellos:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

Como resultado, los cambios del usuario (como escribir en el campo) actualizan automáticamente el formulario.

NOTA: La directiva `[formField]` también sincroniza el estado del campo para atributos como `required`, `disabled` y `readonly` cuando corresponde.

### 4. Lee el estado con signals de `FieldTree` {#4-read-state-with-fieldtree-signals}

Puedes acceder al estado de cualquier parte del árbol llamando al nodo `FieldTree` como una función. Esto devuelve un objeto de estado que contiene signals reactivos para el valor, estado de validación y estado de interacción:

```ts
loginForm(); // Devuelve el estado de todo el formulario
loginForm.email(); // Devuelve el estado del campo email
```

Para leer el valor actual, accede al signal `value()`:

```html
<!-- Renderiza valores que se actualizan automáticamente mientras el usuario escribe -->
<p>Form value: {{ loginForm().value() | json }}</p>
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Obtiene el valor actual
const currentEmail = loginForm.email().value();
```

### 5. Actualiza valores con `set()` {#5-update-values-with-set}

Puedes actualizar programáticamente valores usando el método `value.set()` en cualquier nodo. Esto actualiza tanto el `FieldTree` como el signal del modelo subyacente:

```ts
// Actualiza el valor programáticamente
loginForm.email().value.set('alice@wonderland.com');
```

Como resultado, tanto el valor del campo como el signal del modelo se actualizan automáticamente:

```ts
// El signal del modelo también se actualiza
console.log(loginModel().email); // 'alice@wonderland.com'
```

### Ejemplo completo {#complete-example}

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## Uso básico {#basic-usage}

La directiva `[formField]` funciona con todos los tipos de input HTML estándar. Aquí están los patrones más comunes:

### Inputs de texto {#text-inputs}

Los inputs de texto funcionan con varios atributos `type` y textareas:

```html
<!-- Text y email -->
<input type="text" [formField]="form.name" />
<input type="email" [formField]="form.email" />
```

#### Números {#numbers}

Los inputs numéricos convierten automáticamente entre strings y números:

```html
<!-- Number - convierte automáticamente al tipo number -->
<input type="number" [formField]="form.age" />
```

#### Fecha y hora {#date-and-time}

Los inputs de fecha almacenan valores como strings `YYYY-MM-DD`, y los inputs de hora usan formato `HH:mm`:

```html
<!-- Date y time - almacena como strings en formato ISO -->
<input type="date" [formField]="form.eventDate" />
<input type="time" [formField]="form.eventTime" />
```

Si necesitas convertir strings de fecha a objetos Date, puedes hacerlo pasando el valor del campo a `Date()`:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### Texto multilínea {#multiline-text}

Los textareas funcionan de la misma manera que los inputs de texto:

```html
<!-- Textarea -->
<textarea [formField]="form.message" rows="4"></textarea>
```

### Checkboxes

Los checkboxes se vinculan a valores booleanos:

```html
<!-- Checkbox único -->
<label>
  <input type="checkbox" [formField]="form.agreeToTerms" />
  Acepto los términos
</label>
```

#### Múltiples checkboxes {#multiple-checkboxes}

Para múltiples opciones, crea un `field` booleano separado para cada una:

```html
<label>
  <input type="checkbox" [formField]="form.emailNotifications" />
  Notificaciones por email
</label>
<label>
  <input type="checkbox" [formField]="form.smsNotifications" />
  Notificaciones por SMS
</label>
```

### Botones de radio {#radio-buttons}

Los botones de radio funcionan de manera similar a los checkboxes. Mientras los botones de radio usen el mismo valor `[formField]`, Signal Forms vinculará automáticamente el mismo atributo `name` a todos ellos:

```html
<label>
  <input type="radio" value="free" [formField]="form.plan" />
  Gratis
</label>
<label>
  <input type="radio" value="premium" [formField]="form.plan" />
  Premium
</label>
```

Cuando un usuario selecciona un botón de radio, el `field` del formulario almacena el valor del atributo `value` de ese botón de radio. Por ejemplo, seleccionar "Premium" establece `form.plan().value()` a `"premium"`.

### Menús desplegables select {#select-dropdowns}

Los elementos select funcionan con opciones tanto estáticas como dinámicas:

```html
<!-- Opciones estáticas -->
<select [formField]="form.country">
  <option value="">Selecciona un país</option>
  <option value="us">Estados Unidos</option>
  <option value="ca">Canadá</option>
</select>

<!-- Opciones dinámicas con @for -->
<select [formField]="form.productId">
  <option value="">Selecciona un producto</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTA: Select múltiple (`<select multiple>`) no está soportado por la directiva `[formField]` en este momento.

## Validación y estado {#validation-and-state}

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

### Signals de estado de `FieldTree` {#fieldtree-state-signals}

Cada nodo del árbol, incluyendo el objeto raíz del formulario, proporciona los mismos signals para rastrear su estado. Dado que cada nodo es un `FieldTree`, la API para monitorear validez e interacción es idéntica en todos los niveles.

| Estado       | Descripción                                                                              |
| ------------ | ---------------------------------------------------------------------------------------- |
| `valid()`    | Devuelve `true` si el nodo pasa todas las reglas de validación                          |
| `invalid()`  | Devuelve `true` si hay errores de validación                                            |
| `pending()`  | Devuelve `true` si la validación asíncrona está en progreso                             |
| `touched()`  | Devuelve `true` si el usuario ha enfocado y desenfocado el campo o cualquier campo hijo |
| `dirty()`    | Devuelve `true` si el valor ha sido cambiado por el usuario                             |
| `disabled()` | Devuelve `true` si el nodo está deshabilitado                                           |
| `readonly()` | Devuelve `true` si el nodo es de solo lectura                                           |
| `errors()`   | Devuelve un array de errores de validación con propiedades `kind` y `message`           |

### Ejemplo completo {#complete-example-1}

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

## Siguientes pasos {#next-steps}

Para aprender más sobre Signal Forms y cómo funciona, consulta las guías detalladas:

- [Visión general](guide/forms/signals/overview) - Introducción a Signal Forms y cuándo usarlos
- [Modelos de formulario](guide/forms/signals/models) - Creando y gestionando datos de formularios con signals
- [Gestión de estado de campo](guide/forms/signals/field-state-management) - Trabajando con estado de validación, seguimiento de interacción y visibilidad de campos
- [Validación](guide/forms/signals/validation) - Validadores integrados, reglas de validación personalizadas y validación asíncrona
