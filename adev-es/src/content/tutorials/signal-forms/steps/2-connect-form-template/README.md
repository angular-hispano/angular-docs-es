# Conectar tu formulario a la plantilla

Ahora, necesitas conectar tu formulario a la plantilla usando la directiva `[field]`. Esto crea un enlace bidireccional de datos entre tu modelo de formulario y los elementos de entrada.

En esta lección, aprenderás cómo:

- Importar la directiva `Field`
- Usar la directiva `[field]` para enlazar campos del formulario a inputs
- Conectar inputs de texto y checkboxes a tu formulario
- Mostrar los valores de los campos del formulario en la plantilla

¡Conectemos la plantilla!

<hr />

<docs-workflow>

<docs-step title="Importa la directiva Field">
Importa la directiva `Field` desde `@angular/forms/signals` y agrégala al arreglo imports de tu componente:

```ts
import { form, Field } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

</docs-step>

<docs-step title="Enlaza el campo email">
En tu plantilla, agrega la directiva `[field]` al input de email:

```html
<input type="email" [field]="loginForm.email" />
```

La expresión `loginForm.email` accede al campo email desde tu formulario.
</docs-step>

<docs-step title="Enlaza el campo password">
Agrega la directiva `[field]` al input de password:

```html
<input type="password" [field]="loginForm.password" />
```

</docs-step>

<docs-step title="Enlaza el campo checkbox">
Agrega la directiva `[field]` al input checkbox:

```html
<input type="checkbox" [field]="loginForm.rememberMe" />
```

</docs-step>

<docs-step title="Muestra los valores del formulario">
Debajo del formulario, hay una sección de depuración para mostrar los valores actuales del formulario. Muestra cada valor de campo usando `.value()`:

```html
<p>Email: {{ loginForm.email().value() }}</p>
<p>Password: {{ loginForm.password().value() ? '••••••••' : '(empty)' }}</p>
<p>Remember me: {{ loginForm.rememberMe().value() ? 'Yes' : 'No' }}</p>
```

Los valores de los campos del formulario son signals, por lo que los valores mostrados se actualizan automáticamente mientras escribes.
</docs-step>

</docs-workflow>

¡Excelente trabajo! Has conectado tu formulario a la plantilla y mostrado los valores del formulario. La directiva `[field]` maneja el enlace bidireccional de datos automáticamente — mientras escribes, el signal `loginModel` se actualiza, y los valores mostrados se actualizan inmediatamente.

A continuación, aprenderás [cómo agregar validación a tu formulario](/tutorials/signal-forms/3-add-validation)!
