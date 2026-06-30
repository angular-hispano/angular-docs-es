# Definiendo una ruta

Ahora que has configurado la app para usar el Router de Angular, necesitas definir las rutas.

NOTA: Aprende más sobre [definir una ruta básica en la guía detallada](/guide/routing/common-router-tasks#defining-a-basic-route).

En esta actividad, aprenderás cómo agregar y configurar rutas en tu app.

<hr>

<docs-workflow>

<docs-step title="Define una ruta en `app.routes.ts`">

En tu app, hay dos páginas para mostrar: (1) Página de Inicio (Home Page) y (2) Página de Usuario (User Page).

Para definir una ruta, agrega un objeto de ruta al arreglo `routes` en `app.routes.ts` que contenga:

- El `path` de la ruta (que automáticamente comienza en la ruta raíz, es decir, `/`)
- El `component` que deseas que la ruta muestre

```ts
import {Routes} from '@angular/router';
import {Home} from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
];
```

El código anterior es un ejemplo de cómo se puede agregar `Home` como una ruta. Ahora continúa e implementa esto junto con `User` en el playground.

Usa `'user'` para el path de `User`.

</docs-step>

<docs-step title="Agrega título a la definición de ruta">

Además de definir las rutas correctamente, el Router de Angular también te permite establecer el título de la página cuando los usuarios navegan, agregando la propiedad `title` a cada ruta.

En `app.routes.ts`, agrega la propiedad `title` a la ruta predeterminada (`path: ''`) y a la ruta `user`. Aquí hay un ejemplo:

<docs-code language="ts" highlight="[8]">
import {Routes} from '@angular/router';
import {Home} from './home/home';

export const routes: Routes = [
{
path: '',
title: 'App Home Page',
component: Home,
},
];
</docs-code>

</docs-step>

</docs-workflow>

En esta actividad, has aprendido cómo definir y configurar rutas en tu app de Angular. Buen trabajo. 🙌

El viaje para habilitar completamente el enrutamiento en tu app está casi completo, sigue adelante.
