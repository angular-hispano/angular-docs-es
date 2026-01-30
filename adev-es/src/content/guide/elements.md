# Visión general de Angular elements

Los _Angular elements_ son componentes de Angular empaquetados como _elementos personalizados_ \(también llamados Web Components\), un estándar web para definir nuevos elementos HTML de manera agnóstica al framework.

Los [elementos personalizados](https://developer.mozilla.org/es/docs/Web/API/Web_components/Using_custom_elements) son una característica de la Plataforma Web disponible en todos los navegadores soportados por Angular.
Un elemento personalizado extiende HTML al permitirte definir una etiqueta cuyo contenido es creado y controlado por código JavaScript.
El navegador mantiene un `CustomElementRegistry` de elementos personalizados definidos, que mapea una clase JavaScript instanciable a una etiqueta HTML.

El paquete `@angular/elements` exporta una API `createCustomElement()` que proporciona un puente desde la interfaz de componentes de Angular y la funcionalidad de detección de cambios hacia la API del DOM incorporada.

Transformar un componente a un elemento personalizado hace toda la infraestructura requerida de Angular disponible para el navegador.
Crear un elemento personalizado es simple y directo, y conecta automáticamente la vista definida por tu componente con la detección de cambios y el enlace de datos, mapeando la funcionalidad de Angular a los equivalentes HTML incorporados correspondientes.

## Usando elementos personalizados

Los elementos personalizados hacen bootstrap de sí mismos - comienzan cuando se agregan al DOM, y se destruyen cuando se eliminan del DOM.
Una vez que un elemento personalizado se agrega al DOM de cualquier página, se ve y comporta como cualquier otro elemento HTML, y no requiere ningún conocimiento especial de términos o convenciones de uso de Angular.

Para agregar el paquete `@angular/elements` a tu espacio de trabajo, ejecuta el siguiente comando:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/elements
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/elements
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/elements
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/elements
  </docs-code>
</docs-code-multifile>

### Cómo funciona

La función `createCustomElement()` convierte un componente en una clase que puede ser registrada con el navegador como un elemento personalizado.
Después de registrar tu clase configurada con el registro de elementos personalizados del navegador, usa el nuevo elemento igual que un elemento HTML incorporado en el contenido que agregas directamente al DOM:

```html

<my-popup message="Use Angular!"></my-popup>

```

Cuando tu elemento personalizado se coloca en una página, el navegador crea una instancia de la clase registrada y la agrega al DOM.
El contenido es proporcionado por la plantilla del componente, que usa la sintaxis de plantillas de Angular, y se renderiza usando los datos del componente y del DOM.
Las propiedades de entrada en el componente corresponden a los atributos de entrada del elemento.

## Transformando componentes a elementos personalizados

Angular proporciona la función `createCustomElement()` para convertir un componente de Angular, junto con sus dependencias, a un elemento personalizado.

El proceso de conversión implementa la interfaz `NgElementConstructor`, y crea una
clase constructora que está configurada para producir una instancia self-bootstrapping de tu componente.

Usa la función nativa del navegador [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) para registrar el constructor configurado y su etiqueta de elemento personalizado asociada con el [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry) del navegador.
Cuando el navegador encuentra la etiqueta del elemento registrado, usa el constructor para crear una instancia del elemento personalizado.

IMPORTANTE: Evita usar el selector del componente como el nombre de etiqueta del elemento personalizado.
Esto puede llevar a comportamiento inesperado, debido a que Angular crea dos instancias del componente para un solo elemento DOM:
Un componente de Angular regular y un segundo usando el elemento personalizado.

### Mapeo

Un elemento personalizado _aloja_ un componente de Angular, proporcionando un puente entre los datos y la lógica definidos en el componente y las APIs estándar del DOM.
Las propiedades y la lógica del componente se mapean directamente a los atributos HTML y al sistema de eventos del navegador.

- La API de creación analiza el componente buscando propiedades de entrada, y define los atributos correspondientes para el elemento personalizado.
  Transforma los nombres de las propiedades para hacerlos compatibles con los elementos personalizados, que no reconocen distinciones de mayúsculas y minúsculas.
  Los nombres de atributos resultantes usan minúsculas separadas por guiones.
  Por ejemplo, para un componente con `inputProp = input({alias: 'myInputProp'})`, el elemento personalizado correspondiente define un atributo `my-input-prop`.

- Los outputs del componente se despachan como [Custom Events](https://developer.mozilla.org/docs/Web/API/CustomEvent) HTML, con el nombre del evento personalizado coincidiendo con el nombre del output.
  Por ejemplo, para un componente con `valueChanged = output()`, el elemento personalizado correspondiente despacha eventos con el nombre "valueChanged", y los datos emitidos se almacenan en la propiedad `detail` del evento.
  Si proporcionas un alias, ese valor se usa; por ejemplo, `clicks = output<string>({alias: 'myClick'});` resulta en despacho de eventos con el nombre "myClick".

Para más información, ve la documentación de Web Components para [Creación de eventos personalizados](https://developer.mozilla.org/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events).

## Ejemplo: Un Servicio de Popup

Anteriormente, cuando querías agregar un componente a una aplicación en tiempo de ejecución, tenías que definir un _componente dinámico_, y luego tendrías que cargarlo, adjuntarlo a un elemento en el DOM, y conectar todas las dependencias, detección de cambios, y manejo de eventos.

Usar un elemento personalizado de Angular hace el proceso más simple y transparente, al proporcionar toda la infraestructura y el framework automáticamente —todo lo que tienes que hacer es definir el tipo de manejo de eventos que quieres.
\(Aún tienes que excluir el componente de la compilación, si no vas a usarlo en tu aplicación.\)

La siguiente aplicación de ejemplo de Servicio de Popup define un componente que puedes cargar dinámicamente o convertir a un elemento personalizado.

| Archivos             | Detalles                                                                                                                                                                                                                              |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `popup.component.ts` | Define un simple elemento pop-up que muestra un mensaje de entrada, con algo de animación y estilos.                                                                                                                                  |
| `popup.service.ts`   | Crea un servicio inyectable que proporciona dos formas diferentes de invocar el `PopupComponent`; como un componente dinámico, o como un elemento personalizado. Nota cuánta más configuración se requiere para el método de carga dinámica. |
| `app.component.ts`   | Define el componente raíz de la aplicación, que usa el `PopupService` para agregar el pop-up al DOM en tiempo de ejecución. Cuando la aplicación se ejecuta, el constructor del componente raíz convierte `PopupComponent` a un elemento personalizado. |

Para comparación, la demo muestra ambos métodos.
Un botón agrega el popup usando el método de carga dinámica, y el otro usa el elemento personalizado.
El resultado es el mismo, pero la preparación es diferente.

<docs-code-multifile>
    <docs-code header="popup.component.ts" path="adev/src/content/examples/elements/src/app/popup.component.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/elements/src/app/app.component.ts"/>
</docs-code-multifile>

## Tipado para elementos personalizados

Las APIs genéricas del DOM, como `document.createElement()` o `document.querySelector()`, devuelven un tipo de elemento que es apropiado para los argumentos especificados.
Por ejemplo, llamar `document.createElement('a')` devuelve un `HTMLAnchorElement`, que TypeScript sabe que tiene una propiedad `href`.
De manera similar, `document.createElement('div')` devuelve un `HTMLDivElement`, que TypeScript sabe que no tiene propiedad `href`.

Cuando se llama con elementos desconocidos, como el nombre de un elemento personalizado \(`popup-element` en nuestro ejemplo\), los métodos devuelven un tipo genérico, como `HTMLElement`, porque TypeScript no puede inferir el tipo correcto del elemento devuelto.

Los elementos personalizados creados con Angular extienden `NgElement` \(que a su vez extiende `HTMLElement`\).
Además, estos elementos personalizados tendrán una propiedad por cada input del componente correspondiente.
Por ejemplo, nuestro `popup-element` tiene una propiedad `message` de tipo `string`.

Hay algunas opciones si quieres obtener tipos correctos para tus elementos personalizados.
Asume que creas un elemento personalizado `my-dialog` basado en el siguiente componente:

```ts

@Component(…)
class MyDialog {
  content =  input(string);
}

```

La forma más directa de obtener tipado preciso es hacer cast del valor de retorno de los métodos DOM relevantes al tipo correcto.
Para eso, usa los tipos `NgElement` y `WithProperties` \(ambos exportados de `@angular/elements`\):

```ts

const aDialog = document.createElement('my-dialog') as NgElement & WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123; // <-- ERROR: TypeScript sabe que esto debería ser un string.
aDialog.body = 'News'; // <-- ERROR: TypeScript sabe que no hay propiedad `body` en `aDialog`.

```

Esta es una buena forma de obtener rápidamente las características de TypeScript, como verificación de tipos y soporte de autocompletado, para tu elemento personalizado.
Pero puede volverse engorroso si lo necesitas en varios lugares, porque tienes que hacer cast del tipo de retorno en cada ocurrencia.

Una forma alternativa, que solo requiere definir el tipo de cada elemento personalizado una vez, es aumentar el `HTMLElementTagNameMap`, que TypeScript usa para inferir el tipo de un elemento devuelto basado en su nombre de etiqueta \(para métodos DOM como `document.createElement()`, `document.querySelector()`, etc.\):

```ts

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    …
  }
}

```

Ahora, TypeScript puede inferir el tipo correcto de la misma forma que lo hace para los elementos incorporados:

```ts

document.createElement('div')               //--> HTMLDivElement (elemento incorporado)
document.querySelector('foo')               //--> Element        (elemento desconocido)
document.createElement('my-dialog')         //--> NgElement & WithProperties<{content: string}> (elemento personalizado)
document.querySelector('my-other-element')  //--> NgElement & WithProperties<{foo: 'bar'}>      (elemento personalizado)

```

## Limitaciones

Se debe tener cuidado al destruir y luego volver a adjuntar elementos personalizados creados con `@angular/elements` debido a problemas con el callback [disconnect()](https://github.com/angular/angular/issues/38778). Los casos donde puedes encontrar este problema son:

- Renderizar un componente en un `ng-if` o `ng-repeat` en AngularJS
- Desconectar y volver a conectar manualmente un elemento al DOM
