# Hidratación Incremental

La **hidratación incremental** es un tipo avanzado de [hidratación](guide/hydration) que puede dejar secciones de tu aplicación deshidratadas y activar _incrementalmente_ la hidratación de esas secciones a medida que se necesitan.

## ¿Por qué usar la hidratación incremental?

La hidratación incremental es una mejora de rendimiento que se construye sobre la hidratación completa de la aplicación. Puede producir bundles iniciales más pequeños y al mismo tiempo proporcionar una experiencia de usuario final comparable a la de una hidratación completa de la aplicación. Los bundles más pequeños mejoran los tiempos de carga inicial, reduciendo el [First Input Delay (FID)](https://web.dev/fid) y el [Cumulative Layout Shift (CLS)](https://web.dev/cls).

La hidratación incremental también te permite usar vistas diferibles (`@defer`) para contenido que quizás no podía diferirse antes. Específicamente, ahora puedes usar vistas diferibles para contenido que está sobre el pliegue. Antes de la hidratación incremental, colocar un bloque `@defer` sobre el pliegue resultaba en que el contenido del placeholder se renderizaba y luego era reemplazado por el contenido de la plantilla principal del bloque `@defer`. Esto provocaba un desplazamiento del diseño. La hidratación incremental significa que la plantilla principal del bloque `@defer` se renderizará sin desplazamiento del diseño en la hidratación.

## ¿Cómo se habilita la hidratación incremental en Angular?

Puedes habilitar la hidratación incremental para aplicaciones que ya usan renderización del lado del servidor (SSR) con hidratación. Sigue la [Guía de SSR en Angular](guide/ssr) para habilitar la renderización del lado del servidor y la [Guía de Hidratación en Angular](guide/hydration) para habilitar la hidratación primero.

Habilita la hidratación incremental añadiendo la función `withIncrementalHydration()` al proveedor `provideClientHydration`.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withIncrementalHydration())]
});
```

La hidratación incremental depende del [event replay](guide/hydration#captura-y-reproducción-de-eventos) y lo habilita automáticamente. Si ya tienes `withEventReplay()` en tu lista, puedes eliminarlo de forma segura después de habilitar la hidratación incremental.

## ¿Cómo funciona la hidratación incremental?

La hidratación incremental se construye sobre la [hidratación](guide/hydration) completa de la aplicación, las [vistas diferibles](guide/defer) y el [event replay](guide/hydration#captura-y-reproducción-de-eventos). Con la hidratación incremental, puedes añadir disparadores adicionales a los bloques `@defer` que definen los límites de hidratación incremental. Añadir un disparador `hydrate` a un bloque defer le indica a Angular que debe cargar las dependencias de ese bloque defer durante la renderización del lado del servidor y renderizar la plantilla principal en lugar del `@placeholder`. Al renderizar del lado del cliente, las dependencias siguen siendo diferidas y el contenido del bloque defer permanece deshidratado hasta que su disparador `hydrate` se activa. Ese disparador le indica al bloque defer que obtenga sus dependencias e hidrate el contenido. Cualquier evento del navegador, específicamente aquellos que coinciden con los escuchadores registrados en tu componente, que sean activados por el usuario antes de la hidratación se ponen en cola y se reproducen una vez que el proceso de hidratación se completa.

## Controlando la hidratación del contenido con disparadores

Puedes especificar **disparadores de hidratación** que controlen cuándo Angular carga e hidrata el contenido diferido. Estos son disparadores adicionales que pueden usarse junto con los disparadores regulares de `@defer`.

Cada bloque `@defer` puede tener múltiples disparadores de evento de hidratación, separados por punto y coma (`;`). Angular activa la hidratación cuando _cualquiera_ de los disparadores se activa.

Hay tres tipos de disparadores de hidratación: `hydrate on`, `hydrate when` y `hydrate never`.

### `hydrate on`

`hydrate on` especifica una condición para cuando se activa la hidratación del bloque `@defer`.

Los disparadores disponibles son los siguientes:

| Disparador                                          | Descripción                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`hydrate on idle`](#hydrate-on-idle)               | Se activa cuando el navegador está inactivo.                                    |
| [`hydrate on viewport`](#hydrate-on-viewport)       | Se activa cuando el contenido especificado entra en el viewport                 |
| [`hydrate on interaction`](#hydrate-on-interaction) | Se activa cuando el usuario interactúa con el elemento especificado             |
| [`hydrate on hover`](#hydrate-on-hover)             | Se activa cuando el mouse se desplaza sobre el área especificada                |
| [`hydrate on immediate`](#hydrate-on-immediate)     | Se activa inmediatamente después de que el contenido no diferido termina de renderizarse |
| [`hydrate on timer`](#hydrate-on-timer)             | Se activa después de una duración específica                                    |

#### `hydrate on idle`

El disparador `hydrate on idle` carga las dependencias de la vista diferible e hidrata el contenido una vez que el navegador ha alcanzado un estado inactivo, basándose en `requestIdleCallback`.

```angular-html
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on viewport`

El disparador `hydrate on viewport` carga las dependencias de la vista diferible e hidrata la página correspondiente de la aplicación cuando el contenido especificado entra en el viewport usando la
[API Intersection Observer](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API).

```angular-html
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on interaction`

El disparador `hydrate on interaction` carga las dependencias de la vista diferible e hidrata el contenido cuando el usuario interactúa con el elemento especificado a través de eventos
`click` o `keydown`.

```angular-html
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on hover`

El disparador `hydrate on hover` carga las dependencias de la vista diferible e hidrata el contenido cuando el mouse se ha desplazado sobre el área activada a través de los eventos
`mouseover` y `focusin`.

```angular-html
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on immediate`

El disparador `hydrate on immediate` carga las dependencias de la vista diferible e hidrata el contenido inmediatamente. Esto significa que el bloque diferido se carga tan pronto como todo el demás contenido no diferido termina de renderizarse.

```angular-html
@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on timer`

El disparador `hydrate on timer` carga las dependencias de la vista diferible e hidrata el contenido después de una duración especificada.

```angular-html
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

El parámetro de duración debe especificarse en milisegundos (`ms`) o segundos (`s`).

### `hydrate when`

El disparador `hydrate when` acepta una expresión condicional personalizada y carga las dependencias de la vista diferible e hidrata el contenido cuando la condición se vuelve verdadera.

```angular-html
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTA: Las condiciones de `hydrate when` solo se activan cuando son el bloque `@defer` deshidratado más externo. La condición proporcionada para el disparador se especifica en el componente padre, que debe existir antes de que pueda activarse. Si el bloque padre está deshidratado, Angular aún no podrá resolver esa expresión.

### `hydrate never`

`hydrate never` permite a los usuarios especificar que el contenido del bloque defer debe permanecer deshidratado indefinidamente, convirtiéndose efectivamente en contenido estático. Ten en cuenta que esto aplica solo a la renderización inicial. Durante una renderización posterior del lado del cliente, un bloque `@defer` con `hydrate never` seguirá obteniendo las dependencias, ya que la hidratación solo aplica a la carga inicial del contenido renderizado del lado del servidor. En el siguiente ejemplo, las renderizaciones posteriores del lado del cliente cargarían las dependencias del bloque `@defer` al entrar en el viewport.

```angular-html
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTA: Usar `hydrate never` evita la hidratación de todo el subárbol anidado de un bloque `@defer` dado. Ningún otro disparador `hydrate` se activa para el contenido anidado dentro de ese bloque.

## Disparadores de hidratación junto con disparadores regulares

Los disparadores de hidratación son disparadores adicionales que se usan junto con los disparadores regulares en un bloque `@defer`. La hidratación es una optimización de carga inicial, lo que significa que los disparadores de hidratación solo aplican a esa carga inicial. Cualquier renderización posterior del lado del cliente seguirá usando el disparador regular.

```angular-html
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder{
  <div>Example Placeholder</div>
}
```

En este ejemplo, en la carga inicial se aplica `hydrate on interaction`. La hidratación se activará al interactuar con el componente `<example-cmp />`. En cualquier carga de página posterior que se renderice del lado del cliente, por ejemplo cuando un usuario hace clic en un `routerLink` que carga una página con este componente, se aplicará `on idle`.

## ¿Cómo funciona la hidratación incremental con bloques `@defer` anidados?

El sistema de componentes y dependencias de Angular es jerárquico, lo que significa que hidratar cualquier componente requiere que todos sus padres también estén hidratados. Por lo tanto, si se activa la hidratación para un bloque `@defer` hijo de un conjunto anidado de bloques `@defer` deshidratados, la hidratación se activa desde el bloque `@defer` deshidratado más externo hasta el hijo activado, y se ejecuta en ese orden.

```angular-html
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder{
  <div>Parent Placeholder</div>
}
```

En el ejemplo anterior, al desplazar el mouse sobre el bloque `@defer` anidado se activa la hidratación. El bloque `@defer` padre con `<parent-block-cmp />` se hidrata primero, luego el bloque `@defer` hijo con `<child-block-cmp />` se hidrata después.

## Restricciones

La hidratación incremental tiene las mismas restricciones que la hidratación completa de la aplicación, incluyendo límites en la manipulación directa del DOM y la necesidad de una estructura HTML válida. Visita la sección de [restricciones de la guía de Hidratación](guide/hydration#restricciones) para más detalles.

## ¿Aún necesito especificar bloques `@placeholder`?

Sí. El contenido del bloque `@placeholder` no se usa para la hidratación incremental, pero un `@placeholder` sigue siendo necesario para los casos de renderización posteriores del lado del cliente. Si tu contenido no estaba en la ruta que fue parte de la carga inicial, entonces cualquier navegación a la ruta que tiene el contenido de tu bloque `@defer` se renderiza como un bloque `@defer` regular. Por lo tanto, el `@placeholder` se renderiza en esos casos de renderización del lado del cliente.
