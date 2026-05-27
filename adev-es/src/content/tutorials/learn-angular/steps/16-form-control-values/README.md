# Obteniendo el valor del control de formulario

Ahora que tus formularios están configurados con Angular, el siguiente paso es acceder a los valores de los controles de formulario.

NOTA: Aprende más sobre [agregar un control de formulario básico en la guía detallada](/guide/forms/reactive-forms#adding-a-basic-form-control).

En esta actividad, aprenderás cómo obtener el valor de tu campo de formulario.

<hr>

<docs-workflow>

<docs-step title="Muestra el valor del campo de entrada en la plantilla">

Para mostrar el valor del input en una plantilla, puedes usar la sintaxis de interpolación `{{}}` como cualquier otra propiedad de clase del componente:

<docs-code language="angular-ts" highlight="[5]">
@Component({
  selector: 'app-user',
  template: `
    ...
    <p>Framework: {{ favoriteFramework }}</p>
    <label for="framework">
      Favorite Framework:
      <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
    </label>
  `,
})
export class User {
  favoriteFramework = '';
}
</docs-code>

</docs-step>

<docs-step title="Obtén el valor de un campo de entrada">

Cuando necesites referenciar el valor del campo de entrada en la clase del componente, puedes hacerlo accediendo a la propiedad de la clase con la sintaxis `this`.

<docs-code language="angular-ts" highlight="[15]">
...
@Component({
  selector: 'app-user',
  template: `
    ...
    <button (click)="showFramework()">Show Framework</button>
  `,
  ...
})
export class User {
  favoriteFramework = '';
  ...

showFramework() {
alert(this.favoriteFramework);
}
}
</docs-code>

</docs-step>

</docs-workflow>

Excelente trabajo aprendiendo cómo mostrar los valores de entrada en tu plantilla y acceder a ellos programáticamente.

Es hora de avanzar a la siguiente forma de gestionar formularios en Angular: formularios reactivos. Si deseas aprender más sobre formularios template-driven, consulta la [documentación de formularios de Angular](guide/forms/template-driven-forms).
