# Reactividad asíncrona con resources

IMPORTANTE: `resource` es [experimental](reference/releases#experimental). Está listo para que lo pruebes, pero podría cambiar antes de que sea estable.

La mayoría de las APIs de signals son síncronas: `signal`, `computed`, `input`, etc. Sin embargo, las aplicaciones a menudo necesitan manejar datos que están disponibles de forma asíncrona. Un `Resource` te da una forma de incorporar datos asíncronos en el código basado en signals de tu aplicación.

Puedes usar un `Resource` para realizar cualquier tipo de operación asíncrona, pero el caso de uso más común para `Resource` es obtener datos de un servidor. El siguiente ejemplo crea un resource para obtener algunos datos de usuario.

La forma más fácil de crear un `Resource` es la función `resource`.

```typescript
import {resource, Signal} from '@angular/core';

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
| `abortSignal`| Un [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). Consulta [Abortando peticiones](#abortando-peticiones) para más detalles. |

Si el cómputo `params` devuelve `undefined`, la función loader no se ejecuta y el estado del resource se convierte en `'idle'`.

### Abortando peticiones

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

### Recargando

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

## Estado del resource

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

## Obtención de datos reactiva con `httpResource`

[`httpResource`](/guide/http/http-resource) es un wrapper alrededor de `HttpClient` que te da el estado de la petición y la respuesta como signals. Realiza peticiones HTTP a través del stack HTTP de Angular, incluyendo interceptores.
