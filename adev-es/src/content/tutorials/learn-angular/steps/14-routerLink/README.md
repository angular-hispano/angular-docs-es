# Usando RouterLink para navegación

En el estado actual de la app, la página completa se recarga cuando hacemos clic en un enlace interno que existe dentro de la app. Si bien esto puede no parecer significativo con una app pequeña, puede tener implicaciones de rendimiento para páginas más grandes con más contenido donde los usuarios tienen que descargar recursos nuevamente y ejecutar cálculos otra vez.

NOTA: Aprende más sobre [agregar rutas a tu aplicación en la guía detallada](/guide/routing/common-router-tasks#add-your-routes-to-your-application).

En esta actividad, aprenderás cómo aprovechar la directiva `RouterLink` para aprovechar al máximo el Router de Angular.

<hr>

<docs-workflow>

<docs-step title="Importa la directiva `RouterLink`">

En `app.ts` agrega la importación de la directiva `RouterLink` a la declaración de importación existente desde `@angular/router` y agrégala al arreglo `imports` del decorador de tu componente.

```ts
...
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  ...
})
```

</docs-step>

<docs-step title="Agrega un `routerLink` a la plantilla">

Para usar la directiva `RouterLink`, reemplaza los atributos `href` con `routerLink`. Actualiza la plantilla con este cambio.

```angular-ts
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  ...
  template: `
    ...
    <a routerLink="/">Home</a>
    <a routerLink="/user">User</a>
    ...
  `,
  imports: [RouterLink, RouterOutlet],
})
```

</docs-step>

</docs-workflow>

Cuando hagas clic en los enlaces de navegación ahora, no deberías ver parpadeos y solo el contenido de la página en sí (es decir, `router-outlet`) cambiará 🎉

Excelente trabajo aprendiendo sobre routing con Angular. Esto es solo la superficie de la API del `Router`, para aprender más consulta la [Documentación del Router de Angular](guide/routing).
