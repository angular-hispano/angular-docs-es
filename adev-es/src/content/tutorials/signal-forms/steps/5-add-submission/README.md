# Agregar envío de formulario

Finalmente, aprendamos cómo manejar el envío del formulario. Aprenderás cómo usar la función `submit()` para ejecutar operaciones asíncronas cuando el formulario es válido, y deshabilitar el botón de envío cuando el formulario tiene errores.

En esta actividad, aprenderás cómo:

- Importar la función `submit()`
- Crear un método manejador de envío
- Usar `submit()` para ejecutar lógica solo cuando es válido
- Deshabilitar el botón de envío basado en el estado del formulario

¡Completemos el formulario!

<hr />

<docs-workflow>

<docs-step title="Importa la función submit">
Importa la función `submit` desde `@angular/forms/signals`:

```ts
import { form, Field, required, email, submit } from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Agrega el método onSubmit">
En tu clase de componente, agrega un método `onSubmit()` que maneje el envío del formulario:

```ts
onSubmit(event: Event) {
  event.preventDefault();
  submit(this.loginForm, async () => {
    const credentials = this.loginModel();
    console.log('Logging in with:', credentials);
    // Agrega tu lógica de inicio de sesión aquí
  });
}
```

La función `submit()` solo ejecuta tu callback asíncrono si el formulario es válido. También maneja el estado de envío del formulario automáticamente.
</docs-step>

<docs-step title="Enlaza el manejador de envío al formulario">
En tu plantilla, enlaza el método `onSubmit()` al evento submit del formulario:

```html
<form (submit)="onSubmit($event)">
```

</docs-step>

<docs-step title="Deshabilita el botón cuando el formulario es inválido">
Actualiza el botón de envío para que esté deshabilitado cuando el formulario sea inválido:

```html
<button type="submit" [disabled]="loginForm().invalid()">
  Log in
</button>
```

Esto previene el envío cuando el formulario tiene errores de validación.
</docs-step>

</docs-workflow>

¡Felicidades! Has construido un formulario de inicio de sesión completo con Signal Forms.

¿Listo para ver lo que has aprendido y explorar temas avanzados? Continúa a [los siguientes pasos](/tutorials/signal-forms/6-next-steps)!
