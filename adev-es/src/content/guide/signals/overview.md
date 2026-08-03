<docs-decorative-header title="Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Las Signals en Angular son un sistema que rastrea granularmente cómo y dónde se usa tu estado a lo largo de una aplicación, permitiendo al framework optimizar las actualizaciones de renderizado.
</docs-decorative-header>

CONSEJO: Revisa los [Fundamentos](essentials/signals) de Angular antes de profundizar en esta guía completa.

## ¿Qué son las Signals? {#what-are-signals}

Una **signal** es un contenedor alrededor de un valor que notifica a los consumidores interesados cuando ese valor cambia. Las signals pueden contener cualquier valor, desde primitivos hasta estructuras de datos complejas.

Lees el valor de una signal llamando a su función getter, lo que permite a Angular rastrear dónde se usa la signal.

Las signals pueden ser Escribibles (_writable_) o Solo Lectura (_read-only_).

### Signals escribibles (_writable_) {#writable-signals}

Las Signals escribibles proporcionan una API para actualizar sus valores directamente. Creas signals escribibles llamando a la función `signal` con el valor inicial de la signal:

```ts
const count = signal(0);

// Las signals son funciones getter - llamarlas lee su valor.
console.log('The count is: ' + count());
```

Para cambiar el valor de una signal escribible, ya sea `.set()` directamente:

```ts
count.set(3);
```

O usa la operación `.update()` para calcular un nuevo valor desde el anterior:

```ts
// Incrementa el contador en 1.
count.update((value) => value + 1);
```

Las signals escribibles tienen el tipo `WritableSignal`.

#### Convertir signals escribibles a solo lectura {#converting-writable-signals-to-readonly}

`WritableSignal` proporciona un método `asReadonly()` que devuelve una versión de solo lectura de la signal. Esto es útil cuando quieres exponer el valor de una signal a los consumidores sin permitirles modificarla directamente:

```ts
@Service()
export class CounterState {
  // Estado escribible privado
  private readonly _count = signal(0);

  readonly count = this._count.asReadonly(); // solo lectura pública

  increment() {
    this._count.update((v) => v + 1);
  }
}

@Component({
  /* ... */
})
export class AwesomeCounter {
  state = inject(CounterState);

  count = this.state.count; // puede leer pero no modificar

  increment() {
    this.state.increment();
  }
}
```

La signal de solo lectura refleja cualquier cambio realizado a la signal escribible original, pero no puede modificarse usando los métodos `set()` o `update()`.

IMPORTANTE: Las signals de solo lectura **no** tienen ningún mecanismo incorporado que evite la mutación profunda de su valor.

### Signals computadas {#computed-signals}

Las **signals computadas** son signals de solo lectura que derivan su valor de otras signals. Defines signals computadas usando la función `computed` y especificando una derivación.

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

La signal `doubleCount` depende de la signal `count`.
Cada vez que la signal `count` se actualiza, Angular sabe que `doubleCount` también necesita actualizarse.

#### Signals computadas se evalúan y memorizan de forma perezosa {#computed-signals-are-both-lazily-evaluated-and-memoized}

La función de derivación de `doubleCount` no se ejecuta para calcular su valor hasta la primera vez que lees `doubleCount`. El valor calculado se almacena en caché, y si lees `doubleCount` nuevamente, devolverá el valor en caché sin recalcular.

Si luego cambias `count`, Angular sabe que el valor en caché de `doubleCount` ya no es válido, y la próxima vez que leas `doubleCount` se calculará su nuevo valor.

Como resultado, puedes realizar de forma segura derivaciones computacionalmente costosas en signals computadas, como filtrar matrices.

#### Signals computadas no son signal escribibles {#computed-signals-are-not-writable-signals}

No puedes asignar valores directamente a una signal computada. Es decir.

```ts
doubleCount.set(3);
```

produce un error de compilación, porque `doubleCount` no es un `WritableSignal`.

#### Las dependencias de las signals computadas son dinámicas  {#computed-signal-dependencies-are-dynamic}

Solo se rastrean las signal que realmente se leen durante la derivación. Por ejemplo, en este `computed` la signal `count` solo le lee si la signal `showCount` es verdadera:

```ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `El contador es ${count()}.`;
  } else {
    return '¡Nada que ver aquí!';
  }
});
```

Cuando lees `conditionalCount`, si `showCount` es `false` el mensaje `¡Nada que ver aquí!` es retornado _sin_ leer la signal `count`. Esto significa que si más tarde actualizas `count` _no_ resultará en un re-cómputo de `conditionalCount`.

Si estableces `showCount` como `true` y luego lees `conditionalCount` nuevamente, la derivación se re-ejecutará y tomará la rama donde `showCount` es `true`, devolviendo el mensaje que muestra el valor de `count`. Cambiar `count` entonces invalidará el valor en caché de `conditionalCount`.

Ten en cuenta que las dependencias pueden ser removidas durante una derivación así como agregadas. Si más tarde estableces `showCount` de vuelta a `false`, entonces `count` ya no será considerado una dependencia de `conditionalCount`.

## Contextos reactivos {#reactive-contexts}

Un **contexto reactivo** es un estado de tiempo de ejecución en el que Angular monitorea las lecturas de signals para establecer una dependencia. El código que lee la signal es el _consumidor_, y la signal que se lee es el _productor_.

Angular entra automáticamente en un contexto reactivo cuando:

- Ejecuta un callback `effect` o `afterRenderEffect`.
- Evalúa una signal `computed`.
- Evalúa un `linkedSignal`.
- Evalúa la función params o loader de un `resource`.
- Renderiza una plantilla de componente (incluyendo los enlaces en la [propiedad host](guide/components/host-elements#binding-to-the-host-element)).

Durante estas operaciones, Angular crea una conexión _activa_. Si una signal rastreada cambia, Angular _eventualmente_ volverá a ejecutar al consumidor.

### Verificar el contexto reactivo {#asserts-the-reactive-context}

Angular proporciona la función helper `assertNotInReactiveContext` para verificar que el código no se esté ejecutando dentro de un contexto reactivo. Pasa una referencia a la función que llama para que el mensaje de error apunte al punto de entrada correcto de la API si la verificación falla. Esto produce un mensaje de error más claro y accionable que un error genérico de contexto reactivo.

```ts
import {assertNotInReactiveContext} from '@angular/core';

function subscribeToEvents() {
  assertNotInReactiveContext(subscribeToEvents);
  // Seguro para continuar - lógica de suscripción aquí
}
```

### Leer sin rastrear dependencias {#reading-without-tracking-dependencies}

Raramente, puedes querer ejecutar código que puede leer una signal dentro de una función reactiva como `computed` o `effect` _sin_ crear una dependencia.

Por ejemplo, supongamos que cuando `currentUser` cambia, el valor de un `counter` debe ser registrado. Podrías crear un `effect` que lee ambas signals:

```ts
effect(() => {
  console.log(`Usuario establecido a ${currentUser()} y el contador es ${counter()}`);
});
```

Este ejemplo registrará un mensaje cuando _cualquiera_ `currentUser` o `counter` cambie. Sin embargo, si el efecto solo debe ejecutarse cuando `currentUser` cambie, entonces la lectura de `counter` es solo incidental y los cambios a `counter` no deberían registrar un nuevo mensaje.

Puedes prevenir que una lectura de una signal sea rastreada llamando a su getter con `untracked`:

```ts
effect(() => {
  console.log(`Usuario establecido a ${currentUser()} y el contador es ${untracked(counter)}`);
});
```

`untracked` también es útil cuando un efecto necesita invocar algún código externo que no debe ser tratado como una dependencia:

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // Si el `loggingService` lee signals, no serán contadas como
    // dependencias de este efecto.
    this.loggingService.log(`Usuario establecido a ${user}`);
  });
});
```

### Contexto reactivo y operaciones asíncronas {#reactive-context-and-async-operations}

El contexto reactivo solo está activo para código síncrono. Cualquier lectura de signal que ocurra después de un límite asíncrono no será rastreada como dependencia.

```ts {avoid}
effect(async () => {
  const data = await fetchUserData();
  // El contexto reactivo se pierde aquí - theme() no será rastreado
  console.log(`User: ${data.name}, Theme: ${theme()}`);
});
```

Para asegurar que todas las lecturas de signals sean rastreadas, lee las signals antes del `await`. Esto incluye pasarlas como argumentos a la función esperada, ya que los argumentos se evalúan de forma síncrona:

```ts {prefer}
effect(async () => {
  const currentTheme = theme(); // Leer antes del await
  const data = await fetchUserData();
  console.log(`User: ${data.name}, Theme: ${currentTheme}`);
});
```

```ts {prefer}
effect(async () => {
  // También funciona: la signal se lee antes del await (como argumento de función)
  await renderContent(docContent());
});
```

## Derivaciones avanzadas {#advanced-derivations}

Mientras que `computed` maneja derivaciones simples de solo lectura, puedes encontrarte necesitando un estado escribible que dependa de otras signals.
Para más información, consulta la guía [Estado dependiente con linkedSignal](/guide/signals/linked-signal).

Todas las APIs de signals son síncronas — `signal`, `computed`, `input`, etc. Sin embargo, las aplicaciones frecuentemente necesitan lidiar con datos disponibles de forma asíncrona. Un `Resource` te da una forma de incorporar datos asíncronos en el código basado en signals de tu aplicación y aún así permitirte acceder a sus datos de forma síncrona. Para más información, consulta la guía [Reactividad asíncrona con resources](/guide/signals/resource).

## Ejecutar efectos secundarios en APIs no reactivas {#executing-side-effects-on-non-reactive-apis}

Las derivaciones síncronas o asíncronas son recomendadas cuando queremos reaccionar a cambios de estado. Sin embargo, esto no cubre todos los casos de uso posibles, y a veces te encontrarás en una situación donde necesitas reaccionar a cambios de signals en APIs no reactivas. Usa `effect` o `afterRenderEffect` para esos casos de uso específicos. Para más información, consulta la guía [Efectos secundarios para APIs no reactivas](/guide/signals/effect).

## Leer signals en componentes `OnPush` {#reading-signals-in-onpush-components}

Cuando lees una signal dentro de la plantilla de un componente `OnPush`, Angular rastrea la signal como una dependencia de ese componente. Cuando el valor de esa signal cambia, Angular automáticamente [marca](api/core/ChangeDetectorRef#markforcheck) el componente para asegurar que se actualice la próxima vez que se ejecute la detección de cambios. Consulta la guía [Saltando subárboles de componentes](best-practices/skipping-subtrees) para más información sobre componentes `OnPush`.

## Temas avanzados {#advanced-topics}

### Funciones de igualdad de signals {#signal-equality-functions}

Cuando creas una signal, puedes opcionalmente proporcionar una función de igualdad, que se usará para verificar si el nuevo valor es realmente diferente al anterior.

```ts
import isEqual from 'lodash/isEqual';

const data = signal(['test'], {equal: isEqual});

// Aunque esto es una instancia de array diferente, la función de igualdad profunda
// considerará los valores como iguales, y la signal no
// activará ninguna actualización.
data.set(['test']);
```

Las funciones de igualdad pueden ser proporcionadas tanto a signals escribibles como computadas.

CONSEJO: Por defecto, las signals usan igualdad referencial (comparación [`Object.is()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is)).

### Verificación de tipos de signals {#type-checking-signals}

Puedes usar `isSignal` para verificar si un valor es una `Signal`:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isSignal(count); // true
isSignal(doubled); // true
isSignal(42); // false
```

Para verificar específicamente si una signal es escribible, usa `isWritableSignal`:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isWritableSignal(count); // true
isWritableSignal(doubled); // false
```

## Usar signals con RxJS {#using-signals-with-rxjs}

Consulta [Interoperabilidad RxJS con Angular signals](ecosystem/rxjs-interop) para detalles sobre interoperabilidad entre signals y RxJS.
