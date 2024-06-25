<docs-decorative-header title="Manejo de la Interacción del Usuario" imgSrc="adev/src/assets/images/overview.svg"> <!-- markdownlint-disable-line -->
Maneje la interacción del usuario en su aplicación.
</docs-decorative-header>

La capacidad de manejar la interacción del usuario y luego trabajar con ella es uno de los aspectos clave de la construcción de aplicaciones dinámicas. En esta guía, veremos la interacción básica del usuario: El manejo de eventos.

## Manejo de Eventos

Puede agregar un controlador de eventos a un elemento mediante:

1. Agregando un atributo con el nombre de los eventos entre parentesis
2. Especifique qué instrucción JavaScript desea ejecutar cuando se active

```html
<button (click)="save()">Guardar</button>
```

Por ejemplo, si quisiéramos crear un botón que ejecute la función `transformText` cuando se produzca el evento `click`, se vería de la siguiente manera:

```ts
// text-transformer.component.ts
@Component({
  standalone: true,
  selector: 'text-transformer',
  template: `
    <p>{{ announcement }}</p>
    <button (click)="transformText()">Abracadabra!</button>
  `,
})
export class TextTransformer {
  announcement = 'Hola de nuevo Angular!';

  transformText() {
    this.announcement = this.announcement.toUpperCase();
  }
}
```

Otros ejemplos comunes de detectores de eventos incluyen:

- `<input (keyup)="validateInput()" />`
- `<input (keydown)="updateInput()" />`

### $event

Si necesitas acceder al objeto [event](https://developer.mozilla.org/en-US/docs/Web/API/Event) Angular proporciona una variable `$event` implícita que puede pasar a una función:

```html
<button (click)="createUser($event)">Enviar</button>
```

## Siguiente Paso

<docs-pill-row>
  <docs-pill title="Compartiendo Lógica" href="essentials/sharing-logic" />
</docs-pill-row>
