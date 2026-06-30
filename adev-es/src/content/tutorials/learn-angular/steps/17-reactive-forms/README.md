# Formularios reactivos (Reactive Forms)

Cuando quieres gestionar tus formularios programáticamente en lugar de depender puramente de la plantilla, los formularios reactivos son la respuesta.

NOTA: Aprende más sobre [formularios reactivos en la guía detallada](/guide/forms/reactive-forms).

En esta actividad, aprenderás cómo configurar formularios reactivos.

<hr>

<docs-workflow>

<docs-step title="Importa el módulo ReactiveForms">

En `app.ts`, importa `ReactiveFormsModule` desde `@angular/forms` y agrégalo al arreglo `imports` del componente.

```angular-ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <form>
      <label>Name
        <input type="text" />
      </label>
      <label>Email
        <input type="email" />
      </label>
      <button type="submit">Submit</button>
    </form>
  `,
  imports: [ReactiveFormsModule],
})
```

</docs-step>

<docs-step title="Crea el objeto `FormGroup` con FormControls">

Los formularios reactivos usan la clase `FormControl` para representar los controles de formulario (ej., inputs). Angular proporciona la clase `FormGroup` para servir como agrupación de controles de formulario en un objeto útil que hace que manejar formularios grandes sea más conveniente para los desarrolladores.

Agrega `FormControl` y `FormGroup` a la importación desde `@angular/forms` para que puedas crear un FormGroup para cada formulario, con las propiedades `name` y `email` como FormControls.

```ts
import {ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
...
export class App {
  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });
}
```

</docs-step>

<docs-step title="Enlaza el FormGroup y FormControls al formulario">

Cada `FormGroup` debe adjuntarse a un formulario usando la directiva `[formGroup]`.

Además, cada `FormControl` puede adjuntarse con la directiva `formControlName` y asignarse a la propiedad correspondiente. Actualiza la plantilla con el siguiente código de formulario:

```angular-html
<form [formGroup]="profileForm">
  <label>
    Name
    <input type="text" formControlName="name" />
  </label>
  <label>
    Email
    <input type="email" formControlName="email" />
  </label>
  <button type="submit">Submit</button>
</form>
```

</docs-step>

<docs-step title="Maneja la actualización del formulario">

Cuando quieras acceder a datos del `FormGroup`, puedes hacerlo accediendo al valor del `FormGroup`. Actualiza la `template` para mostrar los valores del formulario:

```angular-html
...
<h2>Profile Form</h2>
<p>Name: {{ profileForm.value.name }}</p>
<p>Email: {{ profileForm.value.email }}</p>
```

</docs-step>

<docs-step title="Accede a los valores del FormGroup">
Agrega un nuevo método a la clase del componente llamado `handleSubmit` que usarás más tarde para manejar el envío del formulario.
Este método mostrará valores del formulario, puedes acceder a los valores desde el FormGroup.

En la clase del componente, agrega el método `handleSubmit()` para manejar el envío del formulario.

<docs-code language="ts">
handleSubmit() {
  alert(
    this.profileForm.value.name + ' | ' + this.profileForm.value.email
  );
}
</docs-code>
</docs-step>

<docs-step title="Agrega `ngSubmit` al formulario">
Tienes acceso a los valores del formulario, ahora es momento de manejar el evento de envío y usar el método `handleSubmit`.
Angular tiene un manejador de eventos para este propósito específico llamado `ngSubmit`. Actualiza el elemento del formulario para llamar al método `handleSubmit` cuando se envíe el formulario.

<docs-code language="angular-html" highlight="[3]">
<form
  [formGroup]="profileForm"
  (ngSubmit)="handleSubmit()">
</docs-code>

</docs-step>

</docs-workflow>

Y así de simple, ya sabes cómo trabajar con formularios reactivos en Angular.

Fantástico trabajo con esta actividad. Sigue adelante para aprender sobre validación de formularios.
