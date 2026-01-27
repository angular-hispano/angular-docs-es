# Agregar escuchadores de eventos

Angular soporta definir escuchadores de eventos en un elemento en tu plantilla especificando el nombre del evento dentro de paréntesis junto con una declaración que se ejecuta cada vez que ocurre el evento.

## Escuchar eventos nativos

Cuando quieres agregar escuchadores de eventos a un elemento HTML, envuelves el evento con paréntesis, `()`, lo que te permite especificar una declaración de escuchador.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class AppComponent{
  updateField(): void {
    console.log('¡Campo actualizado!');
  }
}
```

En este ejemplo, Angular llama a `updateField` cada vez que el elemento `<input>` emite un evento `keyup`.

Puedes agregar escuchadores para cualquier evento nativo, como: `click`, `keydown`, `mouseover`, etc. Para aprender más, consulta [todos los eventos disponibles en elementos en MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element#events).

## Acceder al argumento del evento

En cada escuchador de evento de plantilla, Angular proporciona una variable llamada `$event` que contiene una referencia al objeto del evento.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    console.log(`El usuario presionó: ${event.key}`);
  }
}
```

## Usar modificadores de teclas

Cuando quieres capturar eventos de teclado específicos para una tecla específica, podrías escribir código como el siguiente:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('El usuario presionó enter en el campo de texto.');
    }
  }
}
```

Sin embargo, dado que este es un escenario común, Angular te permite filtrar los eventos especificando una tecla específica usando el carácter de punto (`.`). Al hacerlo, el código se puede simplificar a:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class AppComponent{
  updateField(event: KeyboardEvent): void {
    console.log('El usuario presionó enter en el campo de texto.');
  }
}
```

También puedes agregar modificadores de teclas adicionales:

```angular-html
<!-- Coincide con shift y enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```

Angular soporta los modificadores `alt`, `control`, `meta`, y `shift`.

Puedes especificar la key o code que te gustaría enlazar a eventos de teclado. Los campos key y code son parte nativa del objeto de evento de teclado del navegador. Por defecto, el enlace de eventos asume que quieres usar los [valores Key para eventos de teclado](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values).

Angular también te permite especificar [valores Code para eventos de teclado](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values) proporcionando un sufijo `code` integrado.

```angular-html
<!-- Coincide con alt y shift izquierdo -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```

Esto puede ser útil para manejar eventos de teclado de manera consistente entre diferentes sistemas operativos. Por ejemplo, al usar la tecla Alt en dispositivos MacOS, la propiedad `key` reporta la tecla basada en el carácter ya modificado por la tecla Alt. Esto significa que una combinación como Alt + S reporta un valor de `key` de `'ß'`. La propiedad `code`, sin embargo, corresponde al botón físico o virtual presionado en lugar del carácter producido.

## Prevenir el comportamiento predeterminado del evento

Si tu manejador de eventos debe reemplazar el comportamiento nativo del navegador, puedes usar el [método `preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) del objeto del evento:

```angular-ts
@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class AppComponent{
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('¡Mostrar overlay sin actualizar la URL!');
  }
}
```

Si la declaración del manejador de eventos se evalúa como `false`, Angular automáticamente llama a `preventDefault()`, similar a los [atributos de manejador de eventos nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes). _Siempre prefiere llamar explícitamente a `preventDefault`_, ya que este enfoque hace que la intención del código sea obvia.

## Extender el manejo de eventos

El sistema de eventos de Angular es extensible mediante plugins de eventos personalizados registrados con el token de inyección `EVENT_MANAGER_PLUGINS`.

### Implementar un Event Plugin

Para crear un plugin de eventos personalizado, extiende la clase `EventManagerPlugin` e implementa los métodos requeridos.

```ts
import { Injectable } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Define qué eventos soporta este plugin
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Maneja el registro del evento
  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ) {
    // Analiza el evento: ej., "click.debounce.500"
    // event: "click", delay: 500
    const [event, method , delay = 300 ] = eventName.split('.');

    let timeoutId: number;

    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
          handler(event);
      }, delay);
    };

    element.addEventListener(event, listener);

    // Retorna función de limpieza
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

Registra tu plugin personalizado usando el token `EVENT_MANAGER_PLUGINS` en los proveedores de tu aplicación:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DebounceEventPlugin } from './debounce-event-plugin';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: DebounceEventPlugin,
      multi: true
    }
  ]
});
```

Una vez registrado, puedes usar tu sintaxis de evento personalizada en plantillas, así como con la propiedad `host`:

```angular-ts
@Component({
  template: `
    <input
      type="text"
      (input.debounce.500)="onSearch($event.target.value)"
      placeholder="Search..."
    />
  `,
  ...
})
export class Search {
 onSearch(query: string): void {
    console.log('Buscando:', query);
  }
}
```

```ts
@Component({
  ...,
  host: {
    '(click.debounce.500)': 'handleDebouncedClick()',
  },
})
export class AwesomeCard {
  handleDebouncedClick(): void {
   console.log('¡Clic con debounce!');
  }
}
```
