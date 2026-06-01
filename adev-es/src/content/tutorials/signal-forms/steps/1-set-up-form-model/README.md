# Configurar el modelo del formulario

Todo Signal Form comienza con un modelo de datos del formulario — un signal que define la forma de tus datos y almacena los datos de tu formulario.

En esta lección, aprenderás cómo:

- Definir una interfaz TypeScript para los datos de tu formulario
- Crear un signal para mantener los valores del formulario
- Usar la función `form()` para crear un Signal Form

¡Construyamos la base para nuestro formulario de inicio de sesión!

<hr />

<docs-workflow>

<docs-step title="Define la interfaz LoginData">
Crea una interfaz TypeScript que defina la estructura de los datos de tu formulario de inicio de sesión. El formulario tendrá:

- Un campo `email` (string)
- Un campo `password` (string)
- Un campo `rememberMe` (boolean)

```ts
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

Agrega esta interfaz sobre el decorador `@Component`.
</docs-step>

<docs-step title="Importa signal y form">
Importa la función `signal` desde `@angular/core` y la función `form` desde `@angular/forms/signals`:

```ts
import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Crea el signal del modelo del formulario">
En tu clase de componente, crea un signal `loginModel` con valores iniciales. Usa la interfaz `LoginData` como parámetro de tipo:

```ts
loginModel = signal<LoginData>({
  email: '',
  password: '',
  rememberMe: false,
});
```

Los valores iniciales comienzan como strings vacíos para los campos de texto y `false` para el checkbox.
</docs-step>

<docs-step title="Crea el formulario">
Ahora crea el formulario pasando tu signal modelo a la función `form()`:

```ts
loginForm = form(this.loginModel);
```

La función `form()` crea un formulario a partir de tu modelo, dándote acceso al estado del campo y la validación.
</docs-step>

</docs-workflow>

¡Excelente! Has configurado tu modelo de formulario. El signal `loginModel` mantiene los datos de tu formulario, y `loginForm` proporciona acceso a cada campo con seguridad de tipos.

A continuación, aprenderás [cómo conectar tu formulario a la plantilla](/tutorials/signal-forms/2-connect-form-template)!
