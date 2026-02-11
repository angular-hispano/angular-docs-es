# Carga diferida con `@defer`

Las vistas diferibles, también conocidas como bloques `@defer`, reducen el tamaño del bundle inicial de tu aplicación al diferir la carga de código que no es estrictamente necesario para la renderización inicial de una página. Esto a menudo resulta en una carga inicial más rápida y una mejora en Core Web Vitals (CWV), principalmente Largest Contentful Paint (LCP) y Time to First Byte (TTFB).

Para usar esta característica, puedes envolver declarativamente una sección de tu plantilla en un bloque @defer:

```angular-html
@defer {
  <large-component />
}
```

El código de cualquier componente, directiva y pipe dentro del bloque `@defer` se divide en un archivo JavaScript separado y se carga solo cuando es necesario, después de que el resto de la plantilla haya sido renderizada.

Las vistas diferibles soportan una variedad de triggers, opciones de precarga, y sub-bloques para la gestión de estados de placeholder, carga y error.

## ¿Qué dependencias se difieren?

Los componentes, directivas, pipes y cualquier estilo CSS de componente pueden ser diferidos al cargar una aplicación.

Para que las dependencias dentro de un bloque `@defer` sean diferidas, necesitan cumplir dos condiciones:

1. **Deben ser standalone.** Las dependencias no standalone no pueden ser diferidas y aún se cargan de forma eager, incluso si están dentro de bloques `@defer`.
1. **No pueden ser referenciadas fuera de los bloques `@defer` dentro del mismo archivo.** Si son referenciadas fuera del bloque `@defer` o referenciadas dentro de consultas ViewChild, las dependencias se cargarán de forma eager.

Las dependencias _transitivas_ de los componentes, directivas y pipes usados en el bloque `@defer` no necesitan estrictamente ser standalone; las dependencias transitivas aún pueden ser declaradas en un `NgModule` y participar en la carga diferida.

El compilador de Angular produce una declaración de [importación dinámica](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) para cada componente, directiva y pipe usado en el bloque `@defer`. El contenido principal del bloque se renderiza después de que todas las importaciones se resuelvan. Angular no garantiza ningún orden particular para estas importaciones.

## Cómo gestionar diferentes etapas de la carga diferida

Los bloques `@defer` tienen varios sub-bloques para permitirte manejar elegantemente diferentes etapas en el proceso de carga diferida.

### `@defer`

Este es el bloque principal que define la sección de contenido que se carga de forma lazy. No se renderiza inicialmente: el contenido diferido se carga y renderiza una vez que ocurre el [trigger](/guide/templates/defer#triggers) especificado o se cumple la condición `when`.

Por defecto, un bloque `@defer` se dispara cuando el estado del navegador se vuelve [idle](/guide/templates/defer#idle).

```angular-html
@defer {
  <large-component />
}
```

### Mostrar contenido de placeholder con `@placeholder`

Por defecto, los bloques defer no renderizan ningún contenido antes de ser disparados.

El `@placeholder` es un bloque opcional que declara qué contenido mostrar antes de que se dispare el bloque `@defer`.

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder content</p>
}
```

Aunque es opcional, ciertos triggers pueden requerir la presencia de un `@placeholder` o una [variable de referencia de plantilla](/guide/templates/variables#template-reference-variables) para funcionar. Consulta la sección [Triggers](/guide/templates/defer#triggers) para más detalles.

Angular reemplaza el contenido del placeholder con el contenido principal una vez que la carga se completa. Puedes usar cualquier contenido en la sección de placeholder incluyendo HTML simple, componentes, directivas y pipes. Ten en cuenta que _las dependencias del bloque placeholder se cargan de forma eager_.

El bloque `@placeholder` acepta un parámetro opcional para especificar la cantidad `minimum` de tiempo que este placeholder debería mostrarse después de que el contenido del placeholder se renderice inicialmente.

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

Este parámetro `minimum` se especifica en incrementos de tiempo de milisegundos (ms) o segundos (s). Puedes usar este parámetro para prevenir parpadeos rápidos del contenido del placeholder en caso de que las dependencias diferidas se obtengan rápidamente.

### Mostrar contenido de carga con `@loading`

El bloque `@loading` es un bloque opcional que te permite declarar contenido que se muestra mientras las dependencias diferidas se están cargando. Reemplaza el bloque `@placeholder` una vez que se dispara la carga.

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="loading..." src="loading.gif" />
} @placeholder {
  <p>Placeholder content</p>
}
```

Sus dependencias se cargan de forma eager (similar a `@placeholder`).

El bloque `@loading` acepta dos parámetros opcionales para ayudar a prevenir parpadeos rápidos de contenido que pueden ocurrir cuando las dependencias diferidas se obtienen rápidamente:

- `minimum` - la cantidad mínima de tiempo que este placeholder debería mostrarse
- `after` - la cantidad de tiempo a esperar después de que comienza la carga antes de mostrar la plantilla de carga

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

Ambos parámetros se especifican en incrementos de tiempo de milisegundos (ms) o segundos (s). Además, los temporizadores para ambos parámetros comienzan inmediatamente después de que la carga ha sido disparada.

### Mostrar estado de error cuando falla la carga diferida con `@error`

El bloque `@error` es un bloque opcional que se muestra si la carga diferida falla. Similar a `@placeholder` y `@loading`, las dependencias del bloque @error se cargan de forma eager.

```angular-html
@defer {
  <large-component />
} @error {
  <p>Failed to load large component.</p>
}
```

## Controlar la carga de contenido diferido con triggers

Puedes especificar **triggers** que controlan cuándo Angular carga y muestra el contenido diferido.

Cuando se dispara un bloque `@defer`, reemplaza el contenido del placeholder con contenido cargado de forma lazy.

Se pueden definir múltiples triggers de evento separándolos con punto y coma, `;` y se evaluarán como condiciones OR.

Hay dos tipos de triggers: `on` y `when`.

### `on`

`on` especifica una condición para cuándo se dispara el bloque `@defer`.

Los triggers disponibles son los siguientes:

| Trigger                       | Descripción                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| [`idle`](#idle)               | Se dispara cuando el navegador está en estado idle.                               |
| [`viewport`](#viewport)       | Se dispara cuando el contenido especificado entra al viewport                     |
| [`interaction`](#interaction) | Se dispara cuando el usuario interactúa con el elemento especificado              |
| [`hover`](#hover)             | Se dispara cuando el mouse pasa sobre el área especificada                        |
| [`immediate`](#immediate)     | Se dispara inmediatamente después de que el contenido no diferido haya terminado de renderizarse |
| [`timer`](#timer)             | Se dispara después de una duración específica                                     |

#### `idle`

El trigger `idle` carga el contenido diferido una vez que el navegador ha alcanzado un estado idle, basado en requestIdleCallback. Este es el comportamiento predeterminado con un bloque defer.

```angular-html
<!-- @defer (on idle) es el comportamiento por defecto -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `viewport`

El trigger `viewport` carga el contenido diferido cuando el contenido especificado entra al viewport usando la [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API). El contenido observado puede ser el contenido `@placeholder` o una referencia de elemento explícita.

Por defecto, el `@defer` observa que el placeholder entre al viewport. Los placeholders usados de esta manera deben tener un solo elemento raíz.

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternativamente, puedes especificar una [variable de referencia de plantilla](/guide/templates/variables) en la misma plantilla que el bloque `@defer` como el elemento que se observa para entrar al viewport. Esta variable se pasa como un parámetro en el trigger viewport.

```angular-html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

Si quieres personalizar las opciones del `IntersectionObserver`, el trigger `viewport` soporta pasar un objeto literal. El literal soporta todas las propiedades del segundo parámetro de `IntersectionObserver`, excepto `root`. Al usar la notación de objeto literal, tienes que pasar tu trigger usando la propiedad `trigger`.

```angular-html
<div #greeting>Hello!</div>

<!-- Con opciones y un trigger -->
@defer (on viewport({trigger: greeting, rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
}

<!-- Con opciones y un trigger implícito -->
@defer (on viewport({rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
} @placeholder {
  <div>Implied trigger</div>
}
```

#### `interaction`

El trigger `interaction` carga el contenido diferido cuando el usuario interactúa con el elemento especificado a través de eventos `click` o `keydown`.

Por defecto, el placeholder actúa como el elemento de interacción. Los placeholders usados de esta manera deben tener un solo elemento raíz.

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternativamente, puedes especificar una [variable de referencia de plantilla](/guide/templates/variables) en la misma plantilla que el bloque `@defer` como el elemento que se observa para interacciones. Esta variable se pasa como un parámetro en el trigger viewport.

```angular-html
<div #greeting>Hello!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover`

El trigger `hover` carga el contenido diferido cuando el mouse ha pasado sobre el área disparada a través de los eventos `mouseover` y `focusin`.

Por defecto, el placeholder actúa como el elemento de interacción. Los placeholders usados de esta manera deben tener un solo elemento raíz.

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternativamente, puedes especificar una [variable de referencia de plantilla](/guide/templates/variables) en la misma plantilla que el bloque `@defer` como el elemento que se observa para entrar al viewport. Esta variable se pasa como un parámetro en el trigger viewport.

```angular-html
<div #greeting>Hello!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate`

El trigger `immediate` carga el contenido diferido inmediatamente. Esto significa que el bloque diferido se carga tan pronto como todo el otro contenido no diferido haya terminado de renderizarse.

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `timer`

El trigger `timer` carga el contenido diferido después de una duración especificada.

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

El parámetro de duración debe especificarse en milisegundos (`ms`) o segundos (`s`).

### `when`

El trigger `when` acepta una expresión condicional personalizada y carga el contenido diferido cuando la condición se vuelve truthy.

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Esta es una operación de una sola vez: el bloque `@defer` no vuelve al placeholder si la condición cambia a un valor falsy después de volverse truthy.

## Precargar datos con `prefetch`

Además de especificar una condición que determina cuándo se muestra el contenido diferido, opcionalmente puedes especificar un **trigger de precarga**. Este trigger te permite cargar el JavaScript asociado con el bloque `@defer` antes de que se muestre el contenido diferido.

La precarga habilita comportamientos más avanzados, como permitirte comenzar a precargar recursos antes de que un usuario haya visto o interactuado realmente con un bloque defer, pero podría interactuar con él pronto, haciendo que los recursos estén disponibles más rápido.

Puedes especificar un trigger de precarga de manera similar al trigger principal del bloque, pero prefijado con la palabra clave `prefetch`. El trigger principal del bloque y el trigger de precarga están separados con un carácter de punto y coma (`;`).

En el ejemplo a continuación, la precarga comienza cuando un navegador se vuelve idle y el contenido del bloque se renderiza solo una vez que el usuario interactúa con el placeholder.

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

## Probar bloques `@defer`

Angular proporciona APIs de TestBed para simplificar el proceso de probar bloques `@defer` y disparar diferentes estados durante las pruebas. Por defecto, los bloques `@defer` en las pruebas se ejecutan como un bloque defer se comportaría en una aplicación real. Si quieres avanzar manualmente a través de los estados, puedes cambiar el comportamiento del bloque defer a `Manual` en la configuración de TestBed.

```angular-ts
it('should render a defer block in different states', async () => {
  // configura el comportamiento del bloque defer para iniciar en estado "pausado" para control manual.
  TestBed.configureTestingModule({deferBlockBehavior: DeferBlockBehavior.Manual});
  @Component({
    // ...
    template: `
      @defer {
        <large-component />
      } @placeholder {
        Placeholder
      } @loading {
        Loading...
      }
    `
  })
  class ComponentA {}
  // Crea el fixture del componente.
  const componentFixture = TestBed.createComponent(ComponentA);
  // Obtiene la lista de todos los fixtures de bloques defer y obtiene el primer bloque.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // Renderiza el estado placeholder por defecto.
  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');
  // Renderiza el estado loading y verifica la salida renderizada.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');
  // Renderiza el estado final y verifica la salida.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## ¿Funciona `@defer` con `NgModule`?

Los bloques `@defer` son compatibles tanto con componentes, directivas y pipes basados en standalone como en NgModule. Sin embargo, **solo los componentes, directivas y pipes standalone pueden ser diferidos**. Las dependencias basadas en NgModule no se difieren y se incluyen en el bundle cargado de forma eager.

## Compatibilidad entre bloques `@defer` y Hot Module Reload (HMR)

Cuando Hot Module Replacement (HMR) está activo, todos los chunks de bloque `@defer` se obtienen de forma eager, anulando cualquier trigger configurado. Para restaurar el comportamiento de trigger estándar, debes deshabilitar HMR sirviendo tu aplicación con la bandera `--no-hmr`.

## ¿Cómo funciona `@defer` con server-side rendering (SSR) y static-site generation (SSG)?

Por defecto, al renderizar una aplicación en el servidor (ya sea usando SSR o SSG), los bloques defer siempre renderizan su `@placeholder` (o nada si no se especifica un placeholder) y los triggers no se invocan. En el cliente, el contenido del `@placeholder` se hidrata y los triggers se activan.

Para renderizar el contenido principal de los bloques `@defer` en el servidor (tanto SSR como SSG), puedes habilitar [la característica de Incremental Hydration](/guide/incremental-hydration) y configurar triggers `hydrate` para los bloques necesarios.

## Mejores prácticas para diferir vistas

### Evitar cargas en cascada con bloques `@defer` anidados

Cuando tienes bloques `@defer` anidados, deberían tener diferentes triggers para evitar cargar simultáneamente, lo que causa peticiones en cascada y puede impactar negativamente el rendimiento de carga de la página.

### Evitar cambios de diseño

Evita diferir componentes que son visibles en el viewport del usuario en la carga inicial. Hacer esto puede afectar negativamente Core Web Vitals al causar un aumento en el cumulative layout shift (CLS).

En el caso de que esto sea necesario, evita los triggers `immediate`, `timer`, `viewport`, y triggers `when` personalizados que causan que el contenido se cargue durante la renderización inicial de la página.

### Mantener la accesibilidad en mente

Al usar bloques `@defer`, considera el impacto en usuarios con tecnologías asistivas como lectores de pantalla.
Los lectores de pantalla que se enfocan en una sección diferida leerán inicialmente el contenido del placeholder o de carga, pero pueden no anunciar cambios cuando el contenido diferido se carga.

Para asegurar que los cambios de contenido diferido sean anunciados a los lectores de pantalla, puedes envolver tu bloque `@defer` en un elemento con una región live:

```angular-html
<div aria-live="polite" aria-atomic="true">
  @defer (on timer(2000)) {
    <user-profile [user]="currentUser" />
  } @placeholder {
    Loading user profile...
  } @loading {
    Please wait...
  } @error {
    Failed to load profile
  }
</div>
```

Esto asegura que los cambios sean anunciados al usuario cuando ocurren transiciones (placeholder &rarr; loading &rarr; content/error).
