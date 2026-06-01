# Agregar validación a tu formulario

Agregar validación a tu formulario es fundamental para asegurar que los usuarios ingresen datos válidos. Signal Forms usa validadores en una función de esquema que pasas a la función `form()`.

En esta actividad, aprenderás cómo:

- Importar validadores integrados
- Definir una función de esquema para tu formulario
- Aplicar validadores a campos específicos con mensajes de error personalizados

¡Agreguemos validación!

<hr />

<docs-workflow>

<docs-step title="Importa los validadores">
Importa los validadores `required` y `email` desde `@angular/forms/signals`:

```ts
import { form, Field, required, email } from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Agrega una función de esquema a tu formulario">
Actualiza tu llamada a `form()` para incluir una función de esquema como segundo parámetro. La función de esquema recibe un parámetro `fieldPath` que te permite acceder a cada campo:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  // Los validadores irán aquí
});
```

</docs-step>

<docs-step title="Agrega validación al campo email">
Dentro de la función de esquema, agrega validación para el campo email. Usa ambos validadores `required()` y `email()`:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, { message: 'Email is required' });
  email(fieldPath.email, { message: 'Enter a valid email address' });
});
```

La opción `message` proporciona mensajes de error personalizados para los usuarios.
</docs-step>

<docs-step title="Agrega validación al campo password">
Agrega validación para el campo password usando el validador `required()`:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, { message: 'Email is required' });
  email(fieldPath.email, { message: 'Enter a valid email address' });
  required(fieldPath.password, { message: 'Password is required' });
});
```

</docs-step>

</docs-workflow>

¡Perfecto! Has agregado validación a tu formulario. Los validadores se ejecutan automáticamente mientras los usuarios interactúan con el formulario. Cuando la validación falla, el estado del campo reflejará los errores.

A continuación, aprenderás [cómo mostrar errores de validación en la plantilla](/tutorials/signal-forms/4-display-errors)!
