# Leer estado de ruta

El Router de Angular te permite leer y usar información asociada con una ruta para crear componentes responsivos y conscientes del contexto.

## Obtener información sobre la ruta actual con ActivatedRoute

`ActivatedRoute` es un servicio de `@angular/router` que proporciona toda la información asociada con la ruta actual.

```angular-ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
})
export class ProductComponent {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute);
  }
}
```

El `ActivatedRoute` puede proporcionar diferente información sobre la ruta. Algunas propiedades comunes incluyen:

| Propiedad     | Detalles                                                                                                                                      |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`         | Un `Observable` de las rutas de ruta, representadas como un array de strings para cada parte de la ruta de ruta.                             |
| `data`        | Un `Observable` que contiene el objeto `data` proporcionado para la ruta. También contiene cualquier valor resuelto del guard de resolución. |
| `params`      | Un `Observable` que contiene los parámetros requeridos y opcionales específicos de la ruta.                                                  |
| `queryParams` | Un `Observable` que contiene los parámetros de consulta disponibles para todas las rutas.                                                    |

Consulta los [docs de la API de `ActivatedRoute`](/api/router/ActivatedRoute) para una lista completa de lo que puedes acceder dentro de la ruta.

## Entendiendo snapshots de ruta

Las navegaciones de página son eventos a lo largo del tiempo, y puedes acceder al estado del router en un momento dado recuperando un snapshot de ruta.

Los snapshots de ruta contienen información esencial sobre la ruta, incluyendo sus parámetros, datos y rutas hijas. Además, los snapshots son estáticos y no reflejarán cambios futuros.

Aquí hay un ejemplo de cómo accederías a un snapshot de ruta:

```angular-ts
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({ ... })
export class UserProfileComponent {
  readonly userId: string;
  private route = inject(ActivatedRoute);

  constructor() {
    // URL de ejemplo: https://www.angular.dev/users/123?role=admin&status=active#contact

    // Acceder a parámetros de ruta desde snapshot
    this.userId = this.route.snapshot.paramMap.get('id');

    // Acceder a múltiples elementos de ruta
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url,           // https://www.angular.dev
      // Objeto de parámetros de ruta: {id: '123'}
      params: snapshot.params,
      // Objeto de parámetros de consulta: {role: 'admin', status: 'active'}
      queryParams: snapshot.queryParams,  // Parámetros de consulta
    });
  }
}
```

Consulta los [docs de la API de `ActivatedRoute`](/api/router/ActivatedRoute) y los [docs de la API de `ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) para una lista completa de todas las propiedades que puedes acceder.

## Leyendo parámetros en una ruta

Hay tres tipos de parámetros que los desarrolladores pueden utilizar desde una ruta: parámetros de ruta, parámetros de consulta y parámetros de matriz.

### Parámetros de ruta

Los parámetros de ruta te permiten pasar datos a un componente a través de la URL. Esto es útil cuando quieres mostrar contenido específico basado en un identificador en la URL, como un ID de usuario o un ID de producto.

Puedes [definir parámetros de ruta](/guide/routing/define-routes#define-url-paths-with-route-parameters) prefijando el nombre del parámetro con dos puntos (`:`).

```angular-ts
import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: 'product/:id', component: ProductComponent }
];
```

Puedes acceder a los parámetros suscribiéndote a `route.params`.

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Product Details: {{ productId() }}</h1>`,
})
export class ProductDetailComponent {
  productId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Acceder a parámetros de ruta
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }
}
```

### Parámetros de consulta

Los [parámetros de consulta](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) proporcionan una forma flexible de pasar datos opcionales a través de URLs sin afectar la estructura de la ruta. A diferencia de los parámetros de ruta, los parámetros de consulta pueden persistir a través de eventos de navegación y son perfectos para manejar filtrado, ordenamiento, paginación y otros elementos UI con estado.

```angular-ts
// Estructura de parámetro único
// /products?category=electronics
router.navigate(['/products'], {
  queryParams: { category: 'electronics' }
});

// Múltiples parámetros
// /products?category=electronics&sort=price&page=1
router.navigate(['/products'], {
  queryParams: {
    category: 'electronics',
    sort: 'price',
    page: 1
  }
});
```

Puedes acceder a los parámetros de consulta con `route.queryParams`.

Aquí hay un ejemplo de un `ProductListComponent` que actualiza los parámetros de consulta que afectan cómo muestra una lista de productos:

```angular-ts
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <select (change)="updateSort($event)">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <!-- Lista de productos -->
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Acceder a parámetros de consulta de forma reactiva
    this.route.queryParams.subscribe(params => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    // Actualizar URL con nuevo parámetro de consulta
    this.router.navigate([], {
      queryParams: { sort },
      queryParamsHandling: 'merge' // Preservar otros parámetros de consulta
    });
  }
}
```

En este ejemplo, los usuarios pueden usar un elemento select para ordenar la lista de productos por nombre o precio. El manejador de cambio asociado actualiza los parámetros de consulta de la URL, lo que a su vez desencadena un evento de cambio que puede leer los parámetros de consulta actualizados y actualizar la lista de productos.

Para más información, consulta los [docs oficiales sobre QueryParamsHandling](/api/router/QueryParamsHandling).

### Parámetros de matriz

Los parámetros de matriz son parámetros opcionales que pertenecen a un segmento de URL específico, en lugar de aplicarse a toda la ruta. A diferencia de los parámetros de consulta que aparecen después de un `?` y se aplican globalmente, los parámetros de matriz usan punto y coma (`;`) y están limitados a segmentos de ruta individuales.

Los parámetros de matriz son útiles cuando necesitas pasar datos auxiliares a un segmento de ruta específico sin afectar la definición de ruta o el comportamiento de coincidencia. Al igual que los parámetros de consulta, no necesitan estar definidos en tu configuración de ruta.

```ts
// Formato de URL: /path;key=value
// Múltiples parámetros: /path;key1=value1;key2=value2

// Navegar con parámetros de matriz
this.router.navigate(['/awesome-products', { view: 'grid', filter: 'new' }]);
// Resulta en URL: /awesome-products;view=grid;filter=new
```

**Usando ActivatedRoute**

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component(/* ... */)
export class AwesomeProducts  {
  private route = inject(ActivatedRoute);

  constructor() {
    // Acceder a parámetros de matriz vía params
    this.route.params.subscribe((params) => {
      const view = params['view']; // p.ej., 'grid'
      const filter = params['filter']; // p.ej., 'new'
    });
  }
}
```

NOTA: Como alternativa a usar `ActivatedRoute`, los parámetros de matriz también se vinculan a inputs de componente cuando se usa `withComponentInputBinding`.

## Detectar ruta activa actual con RouterLinkActive

Puedes usar la directiva `RouterLinkActive` para estilizar dinámicamente elementos de navegación basándose en la ruta activa actual. Esto es común en elementos de navegación para informar a los usuarios cuál es la ruta activa.

```angular-html
<nav>
  <a class="button"
     routerLink="/about"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    About
  </a> |
  <a class="button"
     routerLink="/settings"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    Settings
  </a>
</nav>
```

En este ejemplo, el Router de Angular aplicará la clase `active-button` al enlace anchor correcto y `ariaCurrentWhenActive` a `page` cuando la URL coincida con el `routerLink` correspondiente.

Si necesitas agregar múltiples clases al elemento, puedes usar un string separado por espacios o un array:

```angular-html
<!-- Sintaxis de string separado por espacios -->
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>

<!-- Sintaxis de array -->
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
```

Cuando especificas un valor para routerLinkActive, también estás definiendo el mismo valor para `ariaCurrentWhenActive`. Esto asegura que los usuarios con discapacidad visual (que pueden no percibir el estilo diferente que se está aplicando) también puedan identificar el botón activo.

Si quieres definir un valor diferente para aria, necesitarás establecer explícitamente el valor usando la directiva `ariaCurrentWhenActive`.

### Estrategia de coincidencia de ruta

Por defecto, `RouterLinkActive` considera cualquier ancestro en la ruta como una coincidencia.

```angular-html
<a [routerLink]="['/user/jane']" routerLinkActive="active-link">
  User
</a>
<a [routerLink]="['/user/jane/role/admin']" routerLinkActive="active-link">
  Role
</a>
```

Cuando el usuario visita `/user/jane/role/admin`, ambos enlaces tendrían la clase `active-link`.

### Solo aplicar RouterLinkActive en coincidencias exactas de ruta

Si solo quieres aplicar la clase en una coincidencia exacta, necesitas proporcionar la directiva `routerLinkActiveOptions` con un objeto de configuración que contenga el valor `exact: true`.

```angular-html
<a [routerLink]="['/user/jane']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  User
</a>
<a [routerLink]="['/user/jane/role/admin']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  Role
</a>
```

Si quieres ser más preciso en cómo se hace coincidir una ruta, vale la pena notar que `exact: true` es en realidad azúcar sintáctica para el conjunto completo de opciones de coincidencia:

```angular-ts
// `exact: true` es equivalente a
{
  paths: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'exact',
}

// `exact: false` es equivalente
{
  paths: 'subset',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'subset',
}
```

Para más información, consulta los docs oficiales para [isActiveMatchOptions](/api/router/IsActiveMatchOptions).

### Aplicar RouterLinkActive a un ancestro

La directiva RouterLinkActive también se puede aplicar a un elemento ancestro para permitir a los desarrolladores estilizar los elementos como deseen.

```angular-html
<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>
```

Para más información, consulta los [docs de la API para RouterLinkActive](/api/router/RouterLinkActive).
