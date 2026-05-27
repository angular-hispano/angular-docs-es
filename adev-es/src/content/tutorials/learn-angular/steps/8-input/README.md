# Propiedades de entrada (input) de componentes

A veces el desarrollo de aplicaciones requiere que envíes datos a un componente. Estos datos pueden usarse para personalizar un componente o quizás enviar información de un componente padre a un componente hijo.

Angular usa un concepto llamado `input`. Esto es similar a `props` en otros frameworks. Para crear una propiedad `input`, usa la función `input()`.

NOTA: Aprende más sobre [aceptar datos con propiedades input en la guía de inputs](/guide/components/inputs).

En esta actividad, aprenderás cómo usar la función `input()` para enviar información a componentes.

<hr>

Para crear una propiedad `input`, agrega la función `input()` para inicializar una propiedad de una clase de componente:

<docs-code header="user.ts" language="ts">
class User {
  occupation = input<string>();
}
</docs-code>

Cuando estés listo para pasar un valor a través de un `input`, los valores pueden establecerse en plantillas usando la sintaxis de atributos. Aquí hay un ejemplo:

<docs-code header="app.ts" language="angular-ts" highlight="[3]">
@Component({
  ...
  template: `<app-user occupation="Angular Developer"></app-user>`
})
export class App {}
</docs-code>

La función `input` devuelve un `InputSignal`. Puedes leer el valor llamando al signal.

<docs-code header="user.ts" language="angular-ts">
@Component({
  ...
  template: `<p>The user's occupation is {{occupation()}}</p>`
})
</docs-code>

<docs-workflow>

<docs-step title="Define una propiedad `input()`">
Actualiza el código en `user.ts` para definir una propiedad `input` en `User` llamada `name` y especifica el tipo `string`. Por ahora, no establezcas un valor inicial e invoca `input()` sin argumentos. Asegúrate de actualizar la plantilla para invocar e interpolar la propiedad `name` al final de la oración.
</docs-step>

<docs-step title="Pasa un valor a la propiedad `input`">
Actualiza el código en `app.ts` para enviar la propiedad `name` con un valor de `"Simran"`.
<br>

Cuando el código se haya actualizado correctamente, la aplicación mostrará `The user's name is Simran`.
</docs-step>

</docs-workflow>

Si bien esto es excelente, es solo una dirección de la comunicación entre componentes. ¿Qué sucede si deseas enviar información y datos a un componente padre desde un componente hijo? Revisa la siguiente lección para descubrirlo.

P.D. lo estás haciendo muy bien - sigue así 🎉
