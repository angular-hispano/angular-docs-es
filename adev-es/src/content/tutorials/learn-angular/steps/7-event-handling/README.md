# Manejo de eventos

El manejo de eventos permite funcionalidades interactivas en aplicaciones web. Te brinda la capacidad como desarrollador de responder a acciones del usuario como clics de botones, envíos de formularios y más.

NOTA: Aprende más sobre [manejar la interacción del usuario en la guía esencial](/essentials/templates#handling-user-interaction).

En esta actividad, aprenderás cómo agregar un manejador de eventos.

<hr />

En Angular, te enlazas a eventos con la sintaxis de paréntesis `()`. En un elemento dado, envuelve el evento al que deseas enlazarte entre paréntesis y establece un manejador de eventos. Considera este ejemplo con un `button`:

```angular-ts
@Component({
  ...
  template: `<button (click)="greet()">`
})
export class App {
  greet() {
    console.log('Hello, there 👋');
  }
}
```

En este ejemplo, la función `greet()` se ejecutará cada vez que se haga clic en el botón. Ten en cuenta que la sintaxis `greet()` incluye el paréntesis final.

Bien, es tu turno de intentarlo:

<docs-workflow>

<docs-step title="Agrega un manejador de eventos">
Agrega la función manejadora de eventos `showSecretMessage()` en la clase `App`. Usa el siguiente código como implementación:

```ts
showSecretMessage() {
  this.message = 'Way to go 🚀';
}
```

</docs-step>

<docs-step title="Enlaza al evento de la plantilla">
Actualiza el código de la plantilla en `app.ts` para enlazarte al evento `mouseover` del elemento `section`.

```angular-html
<section (mouseover)="showSecretMessage()">
```

</docs-step>

</docs-workflow>

Y con unos pocos pasos en el código has creado tu primer manejador de eventos en Angular. Parece que te estás volviendo bastante hábil en esto, sigue con el buen trabajo.
