# Mostrar errores de validación

Ahora que puedes validar el formulario, es importante mostrar los errores de validación a los usuarios.

En esta actividad, aprenderás cómo:

- Acceder al estado del campo con signals de validación
- Usar `@if` para mostrar errores condicionalmente
- Iterar sobre errores con `@for`
- Mostrar errores solo después de la interacción del usuario

¡Mostremos comentarios de validación!

<hr />

<docs-workflow>

<docs-step title="Agrega visualización de errores para el campo email">
Debajo del input de email, agrega visualización condicional de errores. Esto solo mostrará errores cuando el campo sea tanto inválido como touched:

```html
<label>
  Email
  <input type="email" [field]="loginForm.email" />
</label>
@if (loginForm.email().invalid() && loginForm.email().touched()) {
  <div class="error">
    @for (error of loginForm.email().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

La llamada `loginForm.email()` accede al signal de estado del campo. El método `invalid()` devuelve `true` cuando la validación falla, `touched()` devuelve `true` después de que el usuario ha interactuado con el campo, y `errors()` proporciona un arreglo de errores de validación con sus mensajes personalizados.
</docs-step>

<docs-step title="Agrega visualización de errores para el campo password">
Debajo del input de password, agrega el mismo patrón para errores de password:

```html
<label>
  Password
  <input type="password" [field]="loginForm.password" />
</label>
@if (loginForm.password().invalid() && loginForm.password().touched()) {
  <div class="error">
    @for (error of loginForm.password().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

</docs-step>

</docs-workflow>

¡Excelente! Has agregado visualización de errores a tu formulario. Los errores aparecen solo después de que los usuarios interactúan con un campo, proporcionando comentarios útiles sin ser intrusivos.

A continuación, aprenderás [cómo manejar el envío del formulario](/tutorials/signal-forms/5-add-submission)!
