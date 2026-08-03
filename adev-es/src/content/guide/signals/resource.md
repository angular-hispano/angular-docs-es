# Reactividad asíncrona con resources

Todas las APIs de signals son síncronas: `signal`, `computed`, `input`, etc. Sin embargo, las aplicaciones a menudo necesitan manejar datos que están disponibles de forma asíncrona. Un `Resource` te da una forma de incorporar datos asíncronos en el código basado en signals de tu aplicación y aún así permitirte acceder a sus datos de forma síncrona.

Puedes usar un `Resource` para realizar cualquier tipo de operación asíncrona, pero el caso de uso más común para `Resource` es obtener datos de un servidor. El siguiente ejemplo crea un resource para obtener algunos datos de usuario.

La forma más fácil de crear un `Resource` es la función `resource`.

```typescript
import {computed, resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Define un cómputo reactivo.
  // El valor params se recalcula siempre que cualquier signal leído cambie.
  params: () => ({id: userId()}),

  // Define un loader asíncrono que obtiene datos.
  // El resource llama a esta función cada vez que el valor de `params` cambia.
  loader: ({params}) => fetchUser(params),
});

// Crea un signal computed basado en el resultado de la función loader del resource.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` sirve 2 propósitos:
    // - Actúa como type guard para remover `undefined` del tipo
    // - Protege contra leer un `value` que lanza cuando el resource está en estado de error
    return userResource.value().firstName;
  }

  // fallback en caso de que el valor del resource sea `undefined` o si el resource está en estado de error
  return undefined;
});
```

La función `resource` acepta un objeto `ResourceOptions` con dos propiedades principales: `params` y `loader`.

La propiedad `params` define un cómputo reactivo que produce un valor de parámetro. Siempre que las signals leídas en este cómputo cambien, el resource produce un nuevo valor de parámetro, similar a `computed`.

La propiedad `loader` define un `ResourceLoader` — una función asíncrona que obtiene algún estado. El resource llama al loader cada vez que el cómputo `params` produce un nuevo valor, pasando ese valor al loader. Consulta la sección [Resource loaders](#resource-loaders) a continuación para más detalles.

`Resource` tiene un signal `value` que contiene los resultados del loader.

## Resource loaders

Cuando creas un resource, especificas un `ResourceLoader`. Este loader es una función asíncrona que acepta un solo parámetro: un objeto `ResourceLoaderParams`: y devuelve un valor.

El objeto `ResourceLoaderParams` contiene tres propiedades: `params`, `previous`, y `abortSignal`.

| Propiedad    | Descripción                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params`     | El valor del cómputo `params` del resource.                                                                                                      |
| `previous`   | Un objeto con una propiedad `status`, que contiene el `ResourceStatus` anterior.                                                                 |
| `abortSignal`| Un [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). Consulta [Abortando peticiones](#aborting-requests) para más detalles. |

Si el cómputo `params` devuelve `undefined`, la función loader no se ejecuta y el estado del resource se convierte en `'idle'`.

### Resources de streaming {#streaming-resources}

Algunas fuentes de datos asíncronas producen múltiples valores a lo largo del tiempo en lugar de devolver un único resultado. Ejemplos incluyen WebSockets, Server-Sent Events (SSE) y listeners `onSnapshot` de Firestore.

Usa `stream` para estas fuentes de datos que se actualizan continuamente. A diferencia de `loader`, que se resuelve una vez por cada petición, `stream` devuelve una signal cuyo valor puede seguir actualizándose a medida que llegan nuevos datos.

Usa `loader` para operaciones asíncronas de una sola vez, como obtener datos de un endpoint HTTP.

```typescript
const userUpdates = signal({value: 'Alice'});

const userResource = resource({
  stream: () => userUpdates,
});

// Más tarde, cuando llegan nuevos datos:
userUpdates.set({value: 'Bob'});
```

### Abortando peticiones {#aborting-requests}

Un resource aborta una operación de carga pendiente si el cómputo `params` cambia mientras el resource está cargando.

Puedes usar el `abortSignal` en `ResourceLoaderParams` para responder a peticiones abortados. Por ejemplo, la función nativa `fetch` acepta un `AbortSignal`:

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch cancela cualquier petición HTTP pendiente cuando el `AbortSignal` dado
    // indica que la petición ha sido abortada.
    return fetch(`users/${params.id}`, {signal: abortSignal});
  },
});
```

Consulta [`AbortSignal` en MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) para más detalles sobre cancelación de peticiones con `AbortSignal`.

### Recargando {#reloading}

Puedes activar programáticamente el `loader` de un resource llamando al método `reload`.

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

// ...

userResource.reload();
```

## Estado del resource {#resource-status}

El objeto resource tiene varias propiedades de signal para leer el estado del loader asíncrono.

| Propiedad   | Descripción                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `value`     | El valor más reciente del resource, o `undefined` si no se ha recibido ningún valor.                            |
| `hasValue`  | Si el resource tiene un valor.                                                                                  |
| `error`     | El error más reciente encontrado mientras se ejecutaba el loader del resource, o `undefined` si no ha ocurrido ningún error. |
| `isLoading` | Si el loader del resource está ejecutándose actualmente.                                                        |
| `status`    | El `ResourceStatus` específico del resource, como se describe abajo.                                            |

El `status` de una signal proporciona un `ResourceStatus` específico que describe el estado del resource usando una constante de string.

| Estado        | `value()`         | Descripción                                                                  |
| ------------- | :---------------- | ---------------------------------------------------------------------------- |
| `'idle'`      | `undefined`       | El resource no tiene una peticion válida y el loader no se ha ejecutado.       |
| `'error'`     | `undefined`       | El loader ha encontrado un error.                                            |
| `'loading'`   | `undefined`       | El loader se está ejecutando como resultado de que el valor de `params` haya cambiando. |
| `'reloading'` | Valor anterior    | El loader se está ejecutando como resultado de llamar al método `reload` del resource. |
| `'resolved'`  | Valor resuelto    | El loader ha completado.                                                     |
| `'local'`     | Valor establecido localmente | El valor del resource ha sido establecido localmente mediante `.set()` o `.update()` |

Puedes usar esta información de estado para mostrar condicionalmente elementos de interfaz de usuario, como indicadores de carga y mensajes de error.

## Caché de datos de `resource` con SSR {#caching-resource-data-with-ssr}

Cuando una aplicación se renderiza en el servidor, el loader de un resource se ejecuta una vez para producir el HTML inicial. Durante la hidratación, el navegador normalmente vuelve a ejecutar el mismo loader.

Para reutilizar el resultado del servidor, proporciona un `id` para el resource. Angular almacena el valor resuelto en `TransferState` en el servidor y lo usa en el cliente para inicializar el resource en estado `'resolved'`.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
  id: 'user-unique-id',
});
```

El valor de `id` debe ser único dentro de tu aplicación e idéntico en el servidor y el cliente para que Angular pueda asociar la entrada en caché con el resource que la solicitó.

IMPORTANTE: Debido a que el valor en caché se serializa en el HTML de la página, evita establecer `id` en resources que cargan datos específicos del usuario que activó el renderizado del lado del servidor, especialmente si el HTML renderizado puede ser almacenado en caché o compartido entre usuarios.

## Encadenar resources {#chaining-resources}

A veces un resource depende del resultado de otro. Puedes expresar esta dependencia usando la función `chain` disponible en el objeto de contexto de `params`.

```typescript
import {resource} from '@angular/core';

const userResource = resource({
  params: () => ({id: getUserId()}),
  loader: ({params}) => fetchUser(params),
});

const companyResource = resource({
  params: ({chain}) => chain(userResource)?.companyId,
  loader: ({params: companyId}) => fetchCompany(companyId),
});
```

Aquí `companyResource` depende del `companyId` del usuario, que solo se conoce una vez que `userResource` ha cargado. `chain(userResource)` lee el valor de `userResource` y propaga automáticamente su estado a `companyResource`:

- Si `userResource` está **idle**, `companyResource` también se convierte en `idle`.
- Si `userResource` está **loading** o **reloading**, `companyResource` entra en estado `loading` y su loader no se ejecuta. Ten en cuenta que durante `reloading`, `chain` no devuelve el valor previamente resuelto.
- Si `userResource` está en estado **error**, `companyResource` también entra en estado `error`.
- Si `userResource` está **resolved** o **local**, `chain` devuelve su valor actual, que `companyResource` usa como sus params.

Cuando `chain` propaga un estado de `userResource` (`idle`, `loading`, `reloading` o `error`), la función params no continúa. Cuando `userResource` está `resolved` o `local`, `chain` devuelve su valor, que puede ser `undefined` en sí mismo. El ejemplo maneja esto con `chain(userResource)?.companyId`, por lo que un valor `undefined` resulta en params `undefined` y `companyResource` se convierte en `idle`.

NOTA: Pasa el valor encadenado directamente como valor de params en lugar de envolverlo en un objeto. Un valor de params como `{companyId: undefined}` sigue siendo un valor definido, por lo que el loader se ejecutaría con un `companyId` `undefined` en lugar de que el resource se convierta en `idle`.

### Encadenamiento vs. leer valores del resource directamente {#chaining-vs-reading-resource-values-directly}

Puede que te tiendas a leer el valor de un resource directamente dentro de `params`:

```typescript {avoid, header: 'Lee value() directamente sin propagación de estado'}
const companyResource = resource({
  params: () => {
    const user = userResource.value(); // puede ser undefined
    return user ? {companyId: user.companyId} : undefined;
  },
  loader: ({params}) => fetchCompany(params.companyId),
});
```

Aunque esto funciona, devolver `undefined` de `params` hace que el resource se convierta en `idle` en lugar de reflejar el estado real del resource upstream. Usar `chain` es preferible porque refleja correctamente los estados `loading` y `error`.

Recurre a `chain` solo cuando el resource downstream realiza su propio trabajo asíncrono que depende del valor upstream. Si solo necesitas derivar un valor de forma síncrona desde un resource, usa `computed` en su lugar.

## Obtención de datos reactiva con `httpResource` {#reactive-data-fetching-with-httpresource}

[`httpResource`](/guide/http/http-resource) es un wrapper alrededor de `HttpClient` que te da el estado de la petición y la respuesta como signals. Realiza peticiones HTTP a través del stack HTTP de Angular, incluyendo interceptores.

## Composición de resources con snapshots {#resource-composition-with-snapshots}

Un `ResourceSnapshot` es una representación estructurada del estado actual de un resource. Cada resource tiene una propiedad `snapshot` que proporciona una signal de su estado actual.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

const userSnapshot = userResource.snapshot;
```

Cada snapshot contiene un `status` y ya sea un `value` o un `error`.

### Componer resources con snapshots {#composing-resources-with-snapshots}

Puedes crear nuevos resources a partir de snapshots usando `resourceFromSnapshots`. Esto permite la composición con APIs de signals como `computed` y `linkedSignal` para transformar el comportamiento del resource.

```ts
import {linkedSignal, resourceFromSnapshots, Resource, ResourceSnapshot} from '@angular/core';

function withPreviousValue<T>(input: Resource<T>): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        // Cuando el resource de entrada entra en estado loading, mantenemos el valor
        // de su estado anterior, si existe.
        return {status: 'loading' as const, value: previous.value.value};
      }

      // De lo contrario, simplemente reenviamos el estado del resource de entrada.
      return snap;
    },
  });

  return resourceFromSnapshots(derived);
}

@Component({
  /*... */
})
export class AwesomeProfile {
  userId = input.required<number>();
  user = withPreviousValue(httpResource(() => `/user/${this.userId()}`));
  // Cuando userId cambia, user.value() mantiene los datos del usuario anterior hasta que se carguen los nuevos
}
```
