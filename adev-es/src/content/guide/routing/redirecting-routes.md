# Redirigiendo rutas

Las redirecciones de rutas te permiten navegar automáticamente a los usuarios de una ruta a otra. Piénsalo como el reenvío de correo, donde el correo destinado a una dirección se envía a una dirección diferente. Esto es útil para manejar URLs heredadas, implementar rutas predeterminadas o gestionar el control de acceso.

## Cómo configurar redirecciones

Puedes definir redirecciones en tu configuración de rutas con la propiedad `redirectTo`. Esta propiedad acepta un string.

```ts
import { Routes } from '@angular/router';

const routes: Routes = [
  // Redirección simple
  { path: 'marketing', redirectTo: 'newsletter' },

  // Redirección con parámetros de ruta
  { path: 'legacy-user/:id', redirectTo: 'users/:id' },

  // Redirigir cualquier otra URL que no coincida
  // (también conocida como redirección "comodín")
  { path: '**', redirectTo: '/login' }
];
```

En este ejemplo, hay tres redirecciones:

1. Cuando un usuario visita la ruta `/marketing`, es redirigido a `/newsletter`.
2. Cuando un usuario visita cualquier ruta `/legacy-user/:id`, es enrutado a la ruta `/users/:id` correspondiente.
3. Cuando un usuario visita cualquier ruta que no está definida en el router, es redirigido a la página de inicio de sesión debido a la definición de ruta comodín `**`.

## Entendiendo `pathMatch`

La propiedad `pathMatch` en las rutas permite a los desarrolladores controlar cómo Angular hace coincidir una URL con las rutas.

Hay dos valores que `pathMatch` acepta:

| Valor      | Descripción                                        |
| ---------- | -------------------------------------------------- |
| `'full'`   | La ruta URL completa debe coincidir exactamente    |
| `'prefix'` | Solo el comienzo de la URL necesita coincidir     |

Por defecto, todas las redirecciones usan la estrategia `prefix`.

### `pathMatch: 'prefix'`

`pathMatch: 'prefix'` es la estrategia predeterminada e ideal cuando quieres que Angular Router coincida con todas las rutas subsiguientes al disparar una redirección.

```ts
export const routes: Routes = [
  // Esta ruta de redirección es equivalente a…
  { path: 'news', redirectTo: 'blog },

  // Esta ruta de redirección define explícitamente pathMatch
  { path: 'news', redirectTo: 'blog', pathMatch: 'prefix' },
];
```

En este ejemplo, todas las rutas que tienen el prefijo `news` son redirigidas a sus equivalentes `/blog`. Aquí hay algunos ejemplos donde los usuarios son redirigidos al visitar el antiguo prefijo `news`:

- `/news` redirige a `/blog`
- `/news/article` redirige a `/blog/article`
- `/news/article/:id` redirige a `/blog/article/:id`

### `pathMatch: 'full'`

Por otro lado, `pathMatch: 'full'` es útil cuando quieres que Angular Router solo redirija una ruta específica.

```ts
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
```

En este ejemplo, cada vez que el usuario visita la URL raíz (es decir, `''`), el router redirige a ese usuario a la página `'/dashboard'`.

Cualquier página subsiguiente (por ejemplo, `/login`, `/about`, `/product/id`, etc.), es ignorada y no dispara una redirección.

CONSEJO: Ten cuidado al configurar una redirección en la página raíz (es decir, `"/"` o `""`). Si no estableces `pathMatch: 'full'`, el router redirigirá todas las URLs.

Para ilustrar esto aún más, si el ejemplo de `news` de la sección anterior usara `pathMatch: 'full'` en su lugar:

```ts
export const routes: Routes = [
  { path: 'news', redirectTo: '/blog', pathMatch: 'full' },
];
```

Esto significa que:

1. Solo la ruta `/news` será redirigida a `/blog`.
2. Cualquier segmento subsiguiente como `/news/articles` o `/news/articles/1` no redirigiría con el nuevo prefijo `/blog`.

## Redirecciones condicionales

La propiedad `redirectTo` también puede aceptar una función para agregar lógica a cómo los usuarios son redirigidos.

La [función](api/router/RedirectFunction) solo tiene acceso a parte de los datos de [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot) ya que algunos datos no se conocen con precisión en la fase de coincidencia de rutas. Los ejemplos incluyen: títulos resueltos, componentes cargados de forma diferida, etc.

Típicamente retorna un string o [`URLTree`](api/router/UrlTree), pero también puede retornar un observable o promesa.

Aquí hay un ejemplo donde el usuario es redirigido a diferentes menús según la hora del día:

```ts
import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  {
    path: 'restaurant/:location/menu',
    redirectTo: (activatedRouteSnapshot) => {
      const location = activatedRouteSnapshot.params['location'];
      const currentHour = new Date().getHours();

      // Verificar si el usuario solicitó una comida específica mediante parámetro de consulta
      if (activatedRouteSnapshot.queryParams['meal']) {
        return `/restaurant/${location}/menu/${queryParams['meal']}`;
      }

      // Redirección automática según la hora del día
      if (currentHour >= 5 && currentHour < 11) {
        return `/restaurant/${location}/menu/breakfast`;
      } else if (currentHour >= 11 && currentHour < 17) {
        return `/restaurant/${location}/menu/lunch`;
      } else {
        return `/restaurant/${location}/menu/dinner`;
      }
    }
  },

  // Rutas de destino
  { path: 'restaurant/:location/menu/breakfast', component: MenuComponent },
  { path: 'restaurant/:location/menu/lunch', component: MenuComponent },
  { path: 'restaurant/:location/menu/dinner', component: MenuComponent },

  // Redirección predeterminada
  { path: '', redirectTo: '/restaurant/downtown/menu', pathMatch: 'full' }
];
```

Para aprender más, consulta [la documentación de la API para RedirectFunction](api/router/RedirectFunction).

## Próximos pasos

Para más información sobre la propiedad `redirectTo`, consulta la [documentación de la API](api/router/Route#redirectTo).
