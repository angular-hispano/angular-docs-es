# Enlace de propiedad en Angular

El enlace de propiedad en Angular te permite establecer valores para propiedades de elementos HTML, componentes de Angular y más.

Usa el enlace de propiedad para establecer dinámicamente valores de propiedades y atributos. Puedes hacer cosas como alternar funciones de botones, establecer rutas de imágenes programáticamente y compartir valores entre componentes.

NOTA: Aprende más sobre [establecer propiedades y atributos dinámicos en la guía esencial](/essentials/templates#setting-dynamic-properties-and-attributes).

En esta actividad, aprenderás cómo usar el enlace de propiedad en plantillas.

<hr />

Para enlazar a un atributo de un elemento, envuelve el nombre del atributo entre corchetes. Aquí hay un ejemplo:

```angular-html
<img alt="photo" [src]="imageURL">
```

En este ejemplo, el valor del atributo `src` se enlazará a la propiedad de clase `imageURL`. Cualquier valor que tenga `imageURL` se establecerá como el atributo `src` de la etiqueta `img`.

<docs-workflow>

<docs-step title="Agrega una propiedad llamada `isEditable`" header="app.ts" language="ts">
Actualiza el código en `app.ts` agregando una propiedad a la clase `App` llamada `isEditable` con el valor inicial establecido a `true`.

<docs-code highlight="[2]">
export class App {
  isEditable = true;
}
</docs-code>
</docs-step>

<docs-step title="Enlaza a `contentEditable`" header="app.ts" language="ts">
A continuación, enlaza el atributo `contentEditable` del `div` a la propiedad `isEditable` usando la sintaxis <code aria-label="corchetes">[]</code>.

<docs-code highlight="[3]" language="angular-ts">
@Component({
  ...
  template: `<div [contentEditable]="isEditable"></div>`,
})
</docs-code>
</docs-step>

</docs-workflow>

El div ahora es editable. Buen trabajo 👍

El enlace de propiedad es una de las características más poderosas de Angular. Si deseas aprender más, consulta [la documentación de Angular](guide/templates/property-binding).
