# Otras tareas comunes de enrutamiento

Esta guía cubre algunas otras tareas comunes asociadas con el uso de Angular router en tu aplicación.

## Obtener información de la ruta

A menudo, cuando un usuario navega por tu aplicación, quieres pasar información de un componente a otro.
Por ejemplo, considera una aplicación que muestra una lista de compras de artículos de comestibles.
Cada elemento en la lista tiene un `id` único.
Para editar un elemento, los usuarios hacen clic en un botón Editar, que abre un componente `EditGroceryItem`.
Quieres que ese componente recupere el `id` del artículo de comestible para que pueda mostrar la información correcta al usuario.

Usa una ruta para pasar este tipo de información a los componentes de tu aplicación.
Para hacerlo, usas la funcionalidad [`withComponentInputBinding`](api/router/withComponentInputBinding) con `provideRouter` o la opción `bindToComponentInputs` de `RouterModule.forRoot`.

Para obtener información de una ruta:

<docs-workflow>

<docs-step title="Agregar `withComponentInputBinding`">

Agrega la funcionalidad `withComponentInputBinding` al método `provideRouter`.

```ts
providers: [
  provideRouter(appRoutes, withComponentInputBinding()),
]
```

</docs-step>

<docs-step title="Agregar un `input` al componente">

Actualiza el componente para que tenga una propiedad `input()` que coincida con el nombre del parámetro.

```ts
id = input.required<string>()
hero = computed(() => this.service.getHero(id));
```

</docs-step>
<docs-step title="Opcional: Usar un valor predeterminado">
El router asigna valores a todas las entradas según la ruta actual cuando `withComponentInputBinding` está habilitado.
El router asigna `undefined` si no hay datos de ruta que coincidan con la clave de entrada, como cuando falta un parámetro de consulta opcional.
Debes incluir `undefined` en el tipo del `input` cuando existe la posibilidad de que una entrada no coincida con la ruta.

Proporciona un valor predeterminado usando la opción `transform` en el input o gestionando un estado local con un `linkedSignal`.

```ts
id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});
// o
id = input<string|undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());
```

</docs-step>
</docs-workflow>

NOTA: Puedes vincular todos los datos de ruta con pares clave-valor a las entradas del componente: datos de ruta estáticos o resueltos, parámetros de ruta, parámetros de matriz y parámetros de consulta.
Si deseas usar la información de ruta del componente padre, necesitarás configurar la opción `paramsInheritanceStrategy` del router:
`withRouterConfig({paramsInheritanceStrategy: 'always'})`

## Mostrar una página 404

Para mostrar una página 404, configura una [ruta comodín](guide/routing/common-router-tasks#setting-up-wildcard-routes) con la propiedad `component` establecida en el componente que deseas usar para tu página 404 de la siguiente manera:

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '**', component: PageNotFoundComponent },  // Ruta comodín para una página 404
];
```

La última ruta con el `path` de `**` es una ruta comodín.
El router selecciona esta ruta si la URL solicitada no coincide con ninguna de las rutas anteriores en la lista y envía al usuario al `PageNotFoundComponent`.

## Array de parámetros de enlace

Un array de parámetros de enlace contiene los siguientes ingredientes para la navegación del router:

- La ruta del camino al componente de destino
- Parámetros de ruta requeridos y opcionales que van en la URL de la ruta

Vincula la directiva `RouterLink` a tal array de esta manera:

```angular-html
<a [routerLink]="['/heroes']">Heroes</a>
```

Lo siguiente es un array de dos elementos al especificar un parámetro de ruta:

```angular-html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span>{{ hero.name }}
</a>
```

Proporciona parámetros de ruta opcionales en un objeto, como en `{ foo: 'foo' }`:

```angular-html
<a [routerLink]="['/crisis-center', { foo: 'foo' }]">Crisis Center</a>
```

Estos tres ejemplos cubren las necesidades de una aplicación con un nivel de enrutamiento.
Sin embargo, con un router hijo, como en el centro de crisis, creas nuevas posibilidades de array de enlaces.

El siguiente ejemplo mínimo de `RouterLink` se basa en una ruta hija predeterminada especificada para el centro de crisis.

```angular-html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

Revisa lo siguiente:

- El primer elemento en el array identifica la ruta padre \(`/crisis-center`\)
- No hay parámetros para esta ruta padre
- No hay un valor predeterminado para la ruta hija, por lo que necesitas elegir uno
- Estás navegando al `CrisisListComponent`, cuya ruta es `/`, pero no necesitas agregar explícitamente la barra diagonal

Considera el siguiente enlace de router que navega desde la raíz de la aplicación hasta el Dragon Crisis:

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- El primer elemento en el array identifica la ruta padre \(`/crisis-center`\)
- No hay parámetros para esta ruta padre
- El segundo elemento identifica los detalles de la ruta hija sobre una crisis en particular \(`/:id`\)
- La ruta hija de detalles requiere un parámetro de ruta `id`
- Agregaste el `id` del Dragon Crisis como el segundo elemento en el array \(`1`\)
- La ruta resultante es `/crisis-center/1`

También podrías redefinir la plantilla de `AppComponent` con rutas del Crisis Center exclusivamente:

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', { foo: 'foo' }]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
```

En resumen, puedes escribir aplicaciones con uno, dos o más niveles de enrutamiento.
El array de parámetros de enlace ofrece la flexibilidad para representar cualquier profundidad de enrutamiento y cualquier secuencia legal de rutas, parámetros de router \(requeridos\) y objetos de parámetros de ruta \(opcionales\).

## `LocationStrategy` y estilos de URL del navegador

Cuando el router navega a una nueva vista de componente, actualiza la ubicación y el historial del navegador con una URL para esa vista.

Los navegadores modernos HTML5 soportan [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state'), una técnica que cambia la ubicación y el historial de un navegador sin disparar una petición de página al servidor.
El router puede componer una URL "natural" que es indistinguible de una que de otro modo requeriría una carga de página.

Aquí está la URL del Crisis Center en este estilo "HTML5 pushState":

```text
localhost:3002/crisis-center
```

Los navegadores más antiguos envían peticiones de página al servidor cuando la URL de ubicación cambia, a menos que el cambio ocurra después de un "#" \(llamado "hash"\).
Los routers pueden aprovechar esta excepción componiendo URLs de ruta dentro de la aplicación con hashes.
Aquí hay una "URL hash" que enruta al Crisis Center.

```text
localhost:3002/src/#/crisis-center
```

El router soporta ambos estilos con dos proveedores `LocationStrategy`:

| Providers              | Details                                       |
| :--------------------- | :-------------------------------------------- |
| `PathLocationStrategy` | El estilo predeterminado "HTML5 pushState".   |
| `HashLocationStrategy` | El estilo "hash URL".                        |

La función `RouterModule.forRoot()` establece el `LocationStrategy` al `PathLocationStrategy`, lo que lo convierte en la estrategia predeterminada.
También tienes la opción de cambiar al `HashLocationStrategy` con una sobrescritura durante el proceso de bootstrapping.

ÚTIL: Para más información sobre proveedores y el proceso de bootstrap, consulta [Inyección de Dependencias](guide/di/dependency-injection-providers).
