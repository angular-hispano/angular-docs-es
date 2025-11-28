# Realizando solicitudes HTTP

`HttpClient` tiene métodos correspondientes a los diferentes verbos HTTP utilizados para hacer solicitudes, tanto para cargar datos como para aplicar mutaciones en el servidor. Cada método devuelve un [RxJS `Observable`](https://rxjs.dev/guide/observable) que, al suscribirse, envía la solicitud y luego emite los resultados cuando el servidor responde.

NOTA: Los `Observable`s creados por `HttpClient` pueden suscribirse cualquier número de veces y harán una nueva solicitud al backend por cada suscripción.

A través de un objeto de opciones pasado al método de solicitud, se pueden ajustar varias propiedades de la solicitud y del tipo de respuesta devuelta.

## Obteniendo datos JSON

Obtener datos de un backend con frecuencia requiere hacer una solicitud GET usando el método [`HttpClient.get()`](api/common/http/HttpClient#get). Este método toma dos argumentos: la URL del endpoint como string desde donde obtener los datos, y un objeto de *opciones opcionales* para configurar la solicitud.

Por ejemplo, para obtener datos de configuración de una API hipotética usando el método `HttpClient.get()`:

```ts
http.get<Config>('/api/config').subscribe(config => {
  // procesar la configuración.
});
```

Observa el argumento de tipo genérico que especifica que los datos devueltos por el servidor serán de tipo `Config`. Este argumento es opcional, y si lo omites, los datos devueltos tendrán tipo `Object`.

CONSEJO: Cuando trabajes con datos de estructura incierta y valores potencialmente `undefined` o `null`, considera usar el tipo `unknown` en lugar de `Object` como tipo de respuesta.

CRÍTICO: El tipo genérico de los métodos de solicitud es una **afirmación** de tipo sobre los datos devueltos por el servidor. `HttpClient` no verifica que los datos de retorno reales coincidan con este tipo.

## Obteniendo otros tipos de datos

Por defecto, `HttpClient` asume que los servidores devolverán datos JSON. Cuando interactúes con una API que no sea JSON, puedes decirle a `HttpClient` qué tipo de respuesta esperar y devolver al hacer la solicitud. Esto se hace con la opción `responseType`.

| **`Valor de responseType`** | **Tipo de respuesta devuelto**                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'json'` (por defecto) | Datos JSON del tipo genérico dado                                                                                                                           |
| `'text'`               | Cadena de texto (string)                                                                                                                                    |
| `'arraybuffer'`        | [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene los bytes de respuesta sin procesar |
| `'blob'`               | una instancia [`Blob`](https://developer.mozilla.org/es/docs/Web/API/Blob)                                                                                  |

Por ejemplo, puedes pedirle al `HttpClient` que descargue los bytes sin procesar de una imagen `.jpeg` en un `ArrayBuffer`:

```ts
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe(buffer => {
  console.log('La imagen tiene ' + buffer.byteLength + ' bytes de tamaño');
});
```

<docs-callout important title="Valor literal para `responseType">
Debido a que el valor de `responseType` afecta el tipo devuelto por `HttpClient`, debe tener un tipo literal y no un tipo `string`.

Esto sucede automáticamente si el objeto de opciones pasado al método de solicitud es un objeto literal, pero si estás extrayendo las opciones de solicitud a una variable o método auxiliar, podrías necesitar especificarlo explícitamente como literal, por ejemplo: `responseType: 'text' as const`.
</docs-callout>

## Modificando el estado del servidor

Las APIs del servidor que realizan mutaciones con frecuencia requieren hacer solicitudes POST con un cuerpo de solicitud que especifique el nuevo estado o el cambio a realizar.

El método [`HttpClient.post()`](api/common/http/HttpClient#post) se comporta de manera similar a `get()`, y acepta un argumento `body` adicional antes de sus opciones:

```ts
http.post<Config>('/api/config', newConfig).subscribe(config => {
  console.log('Configuración actualizada:', config);
});
```

Se pueden proporcionar muchos tipos diferentes de valores como `body` de la solicitud, y `HttpClient` los serializará en consecuencia:

| **Tipo de `body`** | **Serializado as** |
| - | - |
| string | Texto plano |
| number, boolean, array, u objeto plano | JSON |
| [`ArrayBuffer`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | datos sin procesar del buffer |
| [`Blob`](https://developer.mozilla.org/es/docs/Web/API/Blob) | datos sin procesar con el tipo de contenido del `Blob` |
| [`FormData`](https://developer.mozilla.org/es/docs/Web/API/FormData) | datos codificados `multipart/form-data` |
| [`HttpParams`](api/common/http/HttpParams) o [`URLSearchParams`](https://developer.mozilla.org/es/docs/Web/API/URLSearchParams) | string formateado `application/x-www-form-urlencoded` |

IMPORTANTE: Recuerda hacer `.subscribe()` a los `Observable`s de solicitudes de mutación para realmente ejecutar la solicitud.

## Configurando parámetros de URL

Especifica los parámetros de solicitud que deben incluirse en la URL de la solicitud usando la opción `params`.

Pasar un objeto literal es la forma más simple de configurar parámetros de URL:

```ts
http.get('/api/config', {
  params: {filter: 'all'},
}).subscribe(config => {
  // ...
});
```

Alternativamente, puedes pasar una instancia de `HttpParams` si necesitas más control sobre la construcción o serialización de los parámetros.

IMPORTANTE: Las instancias de `HttpParams` son _inmutables_ y no se pueden cambiar directamente. En su lugar, los métodos de mutación como `append()` devuelven una nueva instancia de `HttpParams` con la mutación aplicada.

```ts
const baseParams = new HttpParams().set('filter', 'all');

http.get('/api/config', {
  params: baseParams.set('details', 'enabled'),
}).subscribe(config => {
  // ...
});
```

Puedes instanciar `HttpParams` con un `HttpParameterCodec` personalizado que determine cómo `HttpClient` codificará los parámetros en la URL.

### Codificación personalizada de parámetros

Por defecto, `HttpParams` utiliza el [`HttpUrlEncodingCodec`](api/common/http/HttpUrlEncodingCodec) incorporado para codificar y decodificar las claves y valores de los parámetros.

Puedes proporcionar tu propia implementación de [`HttpParameterCodec`](api/common/http/HttpParameterCodec) para personalizar cómo se aplica la codificación y decodificación.

```ts
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { inject } from '@angular/core';

export class CustomHttpParamEncoder  implements HttpParameterCodec {
  encodeKey(key: string): string   {
     return encodeURIComponent(key); 
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

export class ApiService {
  private http = inject(HttpClient);

  search() {
    const params = new HttpParams({
      encoder: new CustomHttpParamEncoder(),
    })
    .set('email', 'dev+alerts@example.com')
    .set('q', 'a & b? c/d = e');

    return this.http.get('/api/items', { params });
  }
}
```

## Configurando encabezados de solicitud

Especifica los encabezados de solicitud que deben incluirse en la solicitud usando la opción `headers`.

Pasar un objeto literal es la forma más simple de configurar encabezados de solicitud:

```ts
http.get('/api/config', {
  headers: {
    'X-Debug-Level': 'verbose',
  }
}).subscribe(config => {
  // ...
});
```

Alternativamente, pasa una instancia de `HttpHeaders` si necesitas más control sobre la construcción de encabezados

IMPORTANTE: Las instancias de `HttpHeaders` son _inmutables_ y no se pueden cambiar directamente. En su lugar, los métodos de mutación como `append()` devuelven una nueva instancia de `HttpHeaders` con la mutación aplicada.

```ts
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http.get<Config>('/api/config', {
  headers: baseHeaders.set('X-Debug-Level', 'verbose'),
}).subscribe(config => {
  // ...
});
```

## Interactuando con los eventos de respuesta del servidor

Por conveniencia, `HttpClient` devuelve por defecto un `Observable` con los datos de la respuesta (el body). A veces es útil examinar la respuesta completa, por ejemplo, para obtener cabeceras específicas.

Para acceder a toda la respuesta, establece la opción `observe` en `'response'`:

```ts
http.get<Config>('/api/config', {observe: 'response'}).subscribe(res => {
  console.log('Estado de respuesta:', res.status);
  console.log('Cuerpo:', res.body);
});
```

<docs-callout important title="Valor literal para `observe`">
Debido a que el valor de `observe` afecta el tipo devuelto por `HttpClient`, debe tener un tipo literal y no un tipo `string`.

Esto sucede automáticamente si el objeto de opciones pasado al método de solicitud es un objeto literal, pero si estás extrayendo las opciones de solicitud a una variable o método auxiliar, podrías necesitar especificarlo explícitamente como literal, por ejemplo: `observe: 'response' as const`.
</docs-callout>

## Recibiendo eventos de progreso sin procesar

Además del cuerpo de la respuesta o el objeto de respuesta, `HttpClient` también puede devolver una secuencia de _eventos_ sin procesar que corresponden a momentos específicos en el ciclo de vida de la solicitud. Estos eventos incluyen cuando se envía la solicitud, cuando se devuelve el encabezado de respuesta, y cuando el cuerpo está completo. Estos eventos también pueden incluir _eventos de progreso_ que reportan el estado de carga y descarga para cuerpos de solicitud o respuesta grandes.

Los eventos de progreso están deshabilitados por defecto (ya que tienen un costo de rendimiento) pero se pueden habilitar con la opción `reportProgress`.

NOTA: La implementación opcional `fetch` de `HttpClient` no reporta eventos de progreso de _carga_.

Para observar la secuencia de eventos, establece la opción `observe` en `'events'`:

```ts
http.post('/api/upload', myData, {
  reportProgress: true,
  observe: 'events',
}).subscribe(event => {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      console.log('Cargados ' + event.loaded + ' de ' + event.total + ' bytes');
      break;
    case HttpEventType.Response:
      console.log('¡Carga finalizada!');
      break;
  }
});
```

<docs-callout important title="Valor literal para `observe`">
Debido a que el valor de `observe` afecta el tipo devuelto por `HttpClient`, debe tener un tipo literal y no un tipo `string`.

Esto sucede automáticamente si el objeto de opciones pasado al método de solicitud es un objeto literal, pero si estás extrayendo las opciones de solicitud a una variable o método auxiliar, podrías necesitar especificarlo explícitamente como literal, como `observe: 'events' as const`.
</docs-callout>

Cada `HttpEvent` reportado en la secuencia de eventos tiene un `type` que distingue lo que representa el evento:

| **Valor de `type`** | **Significado del evento** |
| - | - |
| `HttpEventType.Sent` | La solicitud ha sido enviada al servidor |
| `HttpEventType.UploadProgress` | Un `HttpUploadProgressEvent` reportando progreso en la carga del cuerpo de la solicitud |
| `HttpEventType.ResponseHeader` | Se ha recibido el encabezado de la respuesta, incluyendo estado y encabezados |
| `HttpEventType.DownloadProgress` | Un `HttpDownloadProgressEvent` que reporta el progreso de la descarga del cuerpo de la respuesta |
| `HttpEventType.Response` | Se ha recibido toda la respuesta, incluyendo el cuerpo de la respuesta |
| `HttpEventType.User` | Un evento personalizado de un interceptor Http.

## Manejando fallos de solicitud

Hay tres formas en que una solicitud HTTP puede fallar:

* Un error de red o conexión puede impedir que la solicitud llegue al servidor backend.
* Una solicitud no respondió a tiempo cuando se configuró la opción de tiempo de espera (timeout).
* El backend puede recibir la solicitud pero fallar al procesarla, y devolver una respuesta de error.

`HttpClient` captura todos tipos de errores mencionados anteriormente en un `HttpErrorResponse` que devuelve a través del canal de error del `Observable`. Los errores de red tienen un código de `status` de `0` y un `error` que es una instancia de [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent). Los errores del backend tienen el código de `status` fallido devuelto por el backend, y la respuesta de error como `error`. Inspecciona la respuesta para identificar la causa del error y la acción apropiada para manejar el error.

La [librería RxJS](https://rxjs.dev/) ofrece varios operadores que pueden ser útiles para el manejo de errores.

Puedes usar el operador `catchError` para transformar una respuesta de error en un valor para la UI. Este valor puede decirle a la UI que muestre una página o valor de error, y capturar la causa del error si es necesario.

A veces, errores transitorios como interrupciones de red pueden hacer que una solicitud falle inesperadamente, y simplemente reintentar la solicitud permitirá que tenga éxito. RxJS proporciona varios operadores de *reintento* que automáticamente se re-suscriben a un `Observable` fallido bajo ciertas condiciones. Por ejemplo, el operador `retry()` automáticamente intentará re-suscribirse un número especificado de veces.

### Tiempos de esperar (Timeouts)

Para establecer un tiempo de espera para una solicitud, puedes configurar la opción `timeout` con un número de milisegundos junto con otras opciones de la solicitud. Si la solicitud al backend no se completa dentro del tiempo especificado, la solicitud se abortará y se emitirá un error.

NOTA: El timeout solo se aplica a la solicitud HTTP al backend en sí. No es un tiempo de espera para toda la cadena de manejo de la solicitud. Por lo tanto, esta opción no se ve afectada por ningún retraso introducido por los interceptores.

```ts
http.get('/api/config', {
  timeout: 3000,
}).subscribe({
  next: config => {
    console.log('Configuración obtenida con éxito:', config);
  },
  error: err => {
    // Si la solicitud supera el tiempo de espera, se habrá emitido un error.
  }
});
```

## Opciones avanzadas de Fetch

Al usar el proveedor `withFetch()`, el `HttpClient` de Angular proporciona acceso a opciones avanzadas de la API Fetch que pueden mejorar el rendimiento y la experiencia del usuario. Estas opciones solo están disponibles cuando se utiliza el backend Fetch.

### Opciones de Fetch

Las siguientes opciones permiten un control detallado sobre el comportamiento de la solicitud al usar el backend Fetch.

#### Conexiones Keep-alive

La opción `keepalive` permite que una solicitud continúe incluso si la página que la inició se cierra. Esto es útil para solicitudes de analíticas o registro que deben completarse aunque el usuario navegue fuera de la página.

```ts
http.post('/api/analytics', analyticsData, {
  keepalive: true
}).subscribe();
```

#### Control de caché HTTP

La opción `cache` controla cómo interactúa la solicitud con la caché HTTP del navegador, lo que puede mejorar significativamente el rendimiento en solicitudes repetidas.

```ts
// Usar respuesta en caché sin importar su antigüedad
http.get('/api/config', {
  cache: 'force-cache'
}).subscribe(config => {
  // ...
});

// Siempre obtener del network, ignorando la caché
http.get('/api/live-data', {
  cache: 'no-cache'
}).subscribe(data => {
  // ...
});

// Usar solo la respuesta en caché, falla si no está en caché
http.get('/api/static-data', {
  cache: 'only-if-cached'
}).subscribe(data => {
  // ...
});
```

#### Prioridad de solicitud para Core Web Vitals

La opción `priority` permite indicar la importancia relativa de una solicitud, ayudando a los navegadores a optimizar la carga de recursos para mejorar los Core Web Vitals.

```ts
// Alta prioridad para recursos críticos
http.get('/api/user-profile', {
  priority: 'high'
}).subscribe(profile => {
  // ...
});

// Baja prioridad para recursos no críticos
http.get('/api/recommendations', {
  priority: 'low'
}).subscribe(recommendations => {
  // ...
});

// Prioridad automática (por defecto), el navegador decide
http.get('/api/settings', {
  priority: 'auto'
}).subscribe(settings => {
  // ...
});
```

Valores disponibles para `priority`:

- `'high'`: Prioridad alta, se carga pronto (por ejemplo, datos críticos del usuario, contenido que se ve sin hacer scroll)
- `'low'`: Prioridad baja, se carga cuando los recursos están disponibles (por ejemplo, análisis, datos de precarga)
- `'auto'`: El navegador determina la prioridad basándose en el contexto de la solicitud (valor por defecto)

CONSEJO: Usa `priority: 'high'` para solicitudes que afectan Largest Contentful Paint (LCP) y `priority: 'low'` para solicitudes que no impactan la experiencia inicial del usuario.

#### Modo de solicitud

La opción `mode` controla cómo se manejan las solicitudes cross-origin y determina el tipo de respuesta.

```ts
// Solo solicitudes same-origin
http.get('/api/local-data', {
  mode: 'same-origin'
}).subscribe(data => {
  // ...
});

// Solicitudes CORS habilitadas cross-origin
http.get('https://api.external.com/data', {
  mode: 'cors'
}).subscribe(data => {
  // ...
});

// Modo no-CORS para solicitudes simples cross-origin
http.get('https://external-api.com/public-data', {
  mode: 'no-cors'
}).subscribe(data => {
  // ...
});
```

Valores disponibles para `mode`:

- `'same-origin'`: Solo permite solicitudes same-origin, falla si es cross-origin
- `'cors'`: Permite solicitudes cross-origin con CORS (por defecto)
- `'no-cors'`: Permite solicitudes simples cross-origin sin CORS, la respuesta es opaca

CONSEJO: Usa `mode: 'same-origin'` para solicitudes sensibles que nunca deberían ser cross-origin.

#### Manejo de redirecciones

La opción `redirect` especifica cómo manejar respuestas de redirección del servidor.

```ts
// Seguir redirecciones automáticamente (comportamiento por defecto)
http.get('/api/resource', {
  redirect: 'follow'
}).subscribe(data => {
  // ...
});

// Prevenir redirecciones automáticas
http.get('/api/resource', {
  redirect: 'manual'
}).subscribe(response => {
  // Manejar la redirección manualmente
});

// Tratar redirecciones como errores
http.get('/api/resource', {
  redirect: 'error'
}).subscribe({
  next: data => {
    // Respuesta exitosa
  },
  error: err => {
    // Las redirecciones activarán este manejador de errores
  }
});
```

Valores disponibles para `redirect`:

- `'follow'`: Seguir redirecciones automáticamente (por defecto)
- `'error'`: Tratar redirecciones como errores
- `'manual'`: No seguir redirecciones automáticamente, devolver la respuesta de redirección

CONSEJO: Usa `redirect: 'manual'` cuando necesites manejar redirecciones con lógica personalizada.

#### Manejo de credenciales

La opción `credentials` controla si se envían cookies, encabezados de autorización y otras credenciales en solicitudes cross-origin. Esto es importante para escenarios de autenticación.

```ts
// Incluir credenciales en solicitudes cross-origin
http.get('https://api.example.com/protected-data', {
  credentials: 'include'
}).subscribe(data => {
  // ...
});

// Nunca enviar credenciales (por defecto en cross-origin)
http.get('https://api.example.com/public-data', {
  credentials: 'omit'
}).subscribe(data => {
  // ...
});

// Enviar credenciales solo para solicitudes same-origin
http.get('/api/user-data', {
  credentials: 'same-origin'
}).subscribe(data => {
  // ...
});

// withCredentials sobrescribe la opción credentials
http.get('https://api.example.com/data', {
  credentials: 'omit',        // Será ignorado
  withCredentials: true       // Fuerza credentials: 'include'
}).subscribe(data => {
  // La solicitud incluirá credenciales aunque credentials sea 'omit'
});

// Enfoque legado (todavía soportado)
http.get('https://api.example.com/data', {
  withCredentials: true
}).subscribe(data => {
  // Equivalente a credentials: 'include'
});
```

IMPORTANTE: La opción `withCredentials` tiene prioridad sobre `credentials`. Si se especifican ambas, `withCredentials: true` siempre resultará en `credentials: 'include'`, sin importar el valor explícito de `credentials`.

Valores disponibles para `credentials`:

- `'omit'`: Nunca enviar credenciales
- `'same-origin'`: Enviar credenciales solo para solicitudes same-origin (por defecto)
- `'include'`: Siempre enviar credenciales, incluso en solicitudes cross-origin

CONSEJO: Usa `credentials: 'include'` cuando necesites enviar cookies o encabezados de autenticación a un dominio diferente que soporte CORS. Evita mezclar `credentials` y `withCredentials` para no generar confusión.

#### Referente (Referrer)

La opción `referrer` permite controlar qué información de referencia se envía con la solicitud, importante por motivos de privacidad y seguridad.

```ts
// Enviar una URL específica como referrer
http.get('/api/data', {
  referrer: 'https://example.com/page'
}).subscribe(data => {
  // ...
});

// Usar la página actual como referrer (por defecto)
http.get('/api/analytics', {
  referrer: 'about:client'
}).subscribe(data => {
  // ...
});
```

La opción `referrer` acepta:

- Una cadena de URL válida: establece la URL de referrer a enviar
- Una cadena vacía `''`: No envía información de referrer
- `'about:client'`: Utiliza el referrer (la URL de la página actual).

CONSEJO: Usa `referrer: ''` para solicitudes sensibles donde no quieres filtrar la URL de la página que refirió la solicitud.

#### Política de referrer

La opción `referrerPolicy` controla cuánta información de referrer, la URL de la página que realiza la solicitud, se envía junto con una solicitud HTTP. Esta configuración afecta tanto la privacidad como los análisis, permitiéndote equilibrar la visibilidad de datos con consideraciones de seguridad.

```ts
// No enviar información de referrer independientemente de la página actual
http.get('/api/data', {
  referrerPolicy: 'no-referrer'
}).subscribe();

// Enviar solo el origen (por ejemplo, https://example.com)
http.get('/api/analytics', {
  referrerPolicy: 'origin'
}).subscribe();
```

La opción `referrerPolicy` acepta:

- `'no-referrer'`: Nunca envía el encabezado `Referer`.
- `'no-referrer-when-downgrade'`: Envía el referrer para solicitudes same-origin y seguras (HTTPS→HTTPS), pero lo omite al navegar desde un origen seguro a uno menos seguro (HTTPS→HTTP).
- `'origin'`: Envía solo el origen (esquema, host, puerto) del referrer, omitiendo información de ruta y consulta.
- `'origin-when-cross-origin'`: Envía la URL completa para solicitudes same-origin, pero solo el origen para solicitudes cross-origin.
- `'same-origin'`: Envía la URL completa para solicitudes same-origin y ningún referrer para solicitudes cross-origin.
- `'strict-origin'`: Envía solo el origen, y solo si el nivel de seguridad del protocolo no se degrada (por ejemplo, HTTPS→HTTPS). Omite el referrer en caso de degradación.
- `'strict-origin-when-cross-origin'`: Comportamiento predeterminado del navegador. Envía la URL completa para solicitudes same-origin, el origen para solicitudes cross-origin cuando no hay degradación, y omite el referrer en caso de degradación.
- `'unsafe-url'`: Siempre envía la URL completa (incluyendo ruta y consulta). Esto puede exponer datos sensibles y debe usarse con precaución.

CONSEJO: Prefiere valores conservadores como `'no-referrer'`, `'origin'`, o `'strict-origin-when-cross-origin'` para solicitudes sensibles a la privacidad.

#### Integridad (Integrity)

La opción `integrity` permite verificar que la respuesta no ha sido alterada, proporcionando un hash criptográfico del contenido esperado. Esto es útil al cargar scripts u otros recursos desde CDNs.

```ts
// Verificar integridad de la respuesta con hash SHA-256
http.get('/api/script.js', {
  integrity: 'sha256-ABC123...',
  responseType: 'text'
}).subscribe(script => {
  // El contenido del script se verifica contra el hash
});
```

IMPORTANTE: La opción `integrity` requiere una coincidencia exacta entre el contenido de la respuesta y el hash proporcionado. Si el contenido no coincide, la solicitud fallará con un error de red.

CONSEJO: Usa integridad de subrecursos (subresource integrity) al cargar recursos críticos de fuentes externas para asegurar que no han sido modificados. Genera los hashes usando herramientas como `openssl`.

## `Observable`s Http

Cada método de solicitud en `HttpClient` construye y devuelve un `Observable` del tipo de respuesta solicitado. Entender cómo funcionan estos `Observable`s es importante al usar `HttpClient`.

`HttpClient` produce lo que RxJS llama `Observable`s "fríos", lo que significa que no ocurre ninguna solicitud real hasta que se suscribe al `Observable`. Solo entonces se envía realmente la solicitud al servidor. Suscribirse al mismo `Observable` múltiples veces activará múltiples solicitudes al backend. Cada suscripción es independiente.

CONSEJO: Puedes pensar en los `Observable`s de `HttpClient` como _planos_ para solicitudes reales del servidor.

Una vez suscrito, cancelar la suscripción abortará la solicitud en progreso. Esto es muy útil si el `Observable` se suscribe a través del pipe `async`, ya que automáticamente cancelará la solicitud si el usuario navega fuera de la página actual. Además, si usas el `Observable` con un combinador RxJS como `switchMap`, esta cancelación limpiará cualquier solicitud obsoleta.

Una vez que la respuesta regresa, los `Observable`s de `HttpClient` usualmente se completan (aunque los interceptores pueden influir en esto).

Debido a la finalización automática, generalmente no hay riesgo de fugas de memoria si las suscripciones de `HttpClient` no se limpian. Sin embargo, como con cualquier operación asíncrona, recomendamos encarecidamente que limpies las suscripciones cuando el componente que las usa se destruya, ya que el callback de suscripción podría ejecutarse y encontrar errores cuando intente interactuar con el componente destruido.

CONSEJO: Usar el pipe `async` o la operación `toSignal` para suscribirse a `Observable`s asegura que las suscripciones se eliminen correctamente.

## Mejores prácticas

Aunque `HttpClient` puede ser inyectado y usado directamente desde los componentes, generalmente se recomienda que crees servicios reutilizables e inyectables que aíslen y encapsulen la lógica de acceso a datos. Por ejemplo, este `UserService` encapsula la lógica para solicitar datos de un usuario por su id:

```ts
@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```

Dentro de un componente, puedes combinar `@if` con el `async` pipe para renderizar la interfaz de usuario para los datos solo después de que hayan terminado de cargarse:

```ts
import { AsyncPipe } from '@angular/common';
@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Nombre: {{ user.name }}</p>
      <p>Biografía: {{ user.biography }}</p>
    }
  `,
})
export class UserProfileComponent {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor(): void {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
```
