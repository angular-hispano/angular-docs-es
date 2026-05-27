# Descripción general de enrutamiento (Routing)

Para la mayoría de las aplicaciones, llega un punto donde la app requiere más de una sola página. Cuando ese momento llega inevitablemente, el enrutamiento (routing) se convierte en una gran parte de la historia de rendimiento para los usuarios.

NOTA: Aprende más sobre [enrutamiento en la guía detallada](/guide/routing).

En esta actividad, aprenderás cómo configurar tu app para usar el Router de Angular.

<hr>

<docs-workflow>

<docs-step title="Crea un archivo app.routes.ts">

Dentro de `app.routes.ts`, realiza los siguientes cambios:

1. Importa `Routes` desde el paquete `@angular/router`.
2. Exporta una constante llamada `routes` de tipo `Routes`, asígnale `[]` como valor.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="Agrega routing al proveedor">

En `app.config.ts`, configura la app para usar el Router de Angular con los siguientes pasos:

1. Importa la función `provideRouter` desde `@angular/router`.
1. Importa `routes` desde `./app.routes.ts`.
1. Llama a la función `provideRouter` con `routes` pasada como argumento en el arreglo `providers`.

<docs-code language="ts" highlight="[2,3,6]">
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
providers: [provideRouter(routes)],
};
</docs-code>

</docs-step>

<docs-step title="Importa `RouterOutlet` en el componente">

Finalmente, para asegurarte de que tu app esté lista para usar el Router de Angular, necesitas indicarle a la app dónde esperas que el router muestre el contenido deseado. Logra eso usando la directiva `RouterOutlet` desde `@angular/router`.

Actualiza la plantilla de `App` agregando `<router-outlet />`

<docs-code language="angular-ts" highlight="[11]">
import {RouterOutlet} from '@angular/router';

@Component({
...
template: `     <nav>
      <a href="/">Home</a>
      |
      <a href="/user">User</a>
    </nav>
    <router-outlet />
  `,
imports: [RouterOutlet],
})
export class App {}
</docs-code>

</docs-step>

</docs-workflow>

Tu app ahora está configurada para usar el Router de Angular. ¡Buen trabajo! 🙌

Mantén el impulso para aprender el siguiente paso: definir las rutas para nuestra app.
