# Validando formularios

Otro escenario común cuando se trabaja con formularios es la necesidad de validar las entradas para asegurar que los datos correctos se envíen.

NOTA: Aprende más sobre [validación de entrada de formularios en la guía detallada](/guide/forms/reactive-forms#validating-form-input).

En esta actividad, aprenderás cómo validar formularios con formularios reactivos.

<hr>

<docs-workflow>

<docs-step title="Importa Validators">

Angular proporciona un conjunto de herramientas de validación. Para usarlas, primero actualiza el componente para importar `Validators` desde `@angular/forms`.

<docs-code language="ts" highlight="[1]">
import {ReactiveFormsModule, Validators} from '@angular/forms';

@Component({...})
export class App {}
</docs-code>

</docs-step>

<docs-step title="Agrega validación al formulario">

Cada `FormControl` puede recibir los `Validators` que quieras usar para validar los valores del `FormControl`. Por ejemplo, si quieres hacer que el campo `name` en `profileForm` sea obligatorio, entonces usa `Validators.required`.
Para el campo `email` en nuestro formulario Angular, queremos asegurarnos de que no se deje vacío y que siga una estructura de dirección de email válida. Podemos lograr esto combinando los validadores `Validators.required` y `Validators.email` en un arreglo.
Actualiza los `FormControl` de `name` y `email`:

```ts
profileForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

</docs-step>

<docs-step title="Verifica la validación del formulario en la plantilla">

Para determinar si un formulario es válido, la clase `FormGroup` tiene una propiedad `valid`.
Puedes usar esta propiedad para enlazar atributos dinámicamente. Actualiza el botón de `submit` para que se habilite según la validez del formulario.

```angular-html
<button type="submit" [disabled]="!profileForm.valid">Submit</button>
```

</docs-step>

</docs-workflow>

Ahora conoces los conceptos básicos de cómo funciona la validación con formularios reactivos.

Excelente trabajo aprendiendo estos conceptos fundamentales para trabajar con formularios en Angular. Si quieres aprender más, asegúrate de consultar la [documentación de formularios de Angular](guide/forms/form-validation).
