# Descripción general de formularios

Los formularios son una gran parte de muchas aplicaciones porque permiten que tu app acepte entrada del usuario. Aprendamos cómo se manejan los formularios en Angular.

En Angular, hay dos tipos de formularios: template-driven y reactivos. Aprenderás sobre ambos en las próximas actividades.

NOTA: Aprende más sobre [formularios en Angular en la guía detallada](/guide/forms).

En esta actividad, aprenderás cómo configurar un formulario usando el enfoque template-driven.

<hr>

<docs-workflow>

<docs-step title="Crea un campo de entrada">

En `user.ts`, actualiza la plantilla agregando un campo de entrada de texto con el `id` establecido a `framework`, type establecido a `text`.

```angular-html
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" />
</label>
```

</docs-step>

<docs-step title="Importa `FormsModule`">

Para que este formulario use las características de Angular que permiten el enlace de datos a formularios, necesitarás importar el `FormsModule`.

Importa `FormsModule` desde `@angular/forms` y agrégalo al arreglo `imports` de `User`.

<docs-code language="ts" highlight="[2, 7]">
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
...
imports: [FormsModule],
})
export class User {}
</docs-code>

</docs-step>

<docs-step title="Agrega enlace al valor del input">

`FormsModule` tiene una directiva llamada `ngModel` que enlaza el valor del input a una propiedad en tu clase.

Actualiza el input para usar la directiva `ngModel`, específicamente con la siguiente sintaxis `[(ngModel)]="favoriteFramework"` para enlazar a la propiedad `favoriteFramework`.

<docs-code language="html" highlight="[3]">
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
</label>
</docs-code>

Después de hacer los cambios, intenta ingresar un valor en el campo de entrada. Nota cómo se actualiza en la pantalla (sí, muy interesante).

NOTA: La sintaxis `[()]` se conoce como "banana in a box" pero representa el enlace bidireccional: enlace de propiedad y enlace de evento. Aprende más en la [documentación de Angular sobre enlace bidireccional de datos](guide/templates/two-way-binding).

</docs-step>

</docs-workflow>

Has dado un primer paso importante hacia la construcción de formularios con Angular.

Buen trabajo. ¡Mantengamos el impulso!
