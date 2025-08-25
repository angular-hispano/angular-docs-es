<docs-decorative-header title="Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Las Signals en Angular son un sistema que raestrea granularmente cómo y dónde se usa tu estado a lo largo de una aplicación, permitiendo al framework optimizar las actualizaciones de renderizado.
</docs-decorative-header>

SUGERENCIA: Revisa los [Fundamentos](essentials/signals) de Angular antes de profundizar en esta guía completa.

## ¿Qué son las Signals?

Una **signal** es un contenedor alrededor de un valor que notifica a los consumidores interesados cuando ese valor cambia. Las signals pueden contener cualquier valor, desde primitivos hasta estructuras de datos complejas.

Lees el valor de una signal llamando a su función getter, lo que permite a Angular rastrear dónde se usa la signal.

Las signals puede ser Escribibles (_writable_) o Solo Lectura (_read-only_).

### Signals escribibles (_writable_)

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
count.update(value => value + 1);
```

Las signals escribibles tiene el tipo `WritableSignal`.

### Signals computadas

Las **Signals computadas** son signals de solo lectura que derivan su valor de otras signals. Defines signals computadas usando la función `computed` and especificando una derivación.

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```
La signals `doubleCount` depende de la signal `count`.
Cada vez que la signal `count` se actualiza, Angular sabe que `doubleCount` también necesita actualizarse.

#### Signals computadas se evalún y memorizan de forma perezosa

La functión de derivación de `doubleCount` no se ejecuta para calcular su valor hasta la primera que vez que lees `doubleCount`. El valor calculado se almacena en caché, y si lees `doubleCount` nuevamente, devolverá el valor en caché sin recalcular.

Si luego cambias `count`, Angular sabe que el valor en caché de `doubleCount` ya no es válido, y la próxima vez que leas `doubleCount` se calculará su nuevo valor.

Como resultado, puedes realizar de forma segura derivaciones computacionalmente costosas en signals computadas, como filtrar matrices.

#### Signals computadas no son signal escribibles

No puedes asignar valores directamente a una signal computada. Es decir.

```ts
doubleCount.set(3);
```

produce un error de compilación, porque `doubleCount` no es un `WritableSignal`.

#### Las dependencias de las signals computadas son dinámicas 

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

## Leer signals en componentes `OnPush`

Cuando lees una signal dentro de la plantilla de un componente `OnPush`, Angular rastrea la signal como una dependencia de ese componente. Cuando el valor de esa signal cambia, Angular automáticamente [marca](api/core/ChangeDetectorRef#markforcheck) el componente para asegurar que se actualice la próxima vez que se ejecute la detección de cambios. Consulta la guía [Saltando subárboles de componentes](best-practices/skipping-subtrees) para más información sobre componentes `OnPush`.

## Efectos

Las signals son útiles porque notifican a los consumidores interesados cuando cambian. Un **efecto** es una operación que se ejecuta siempre que uno o más valores de signal cambien. Puedes crear un efecto con la función `effect`:

```ts
effect(() => {
  console.log(`El contador actual es: ${count()}`);
});
```

Los efectos siempre se ejecutan **al menos una vez.** Cuando un efecto se ejecuta, rastrea cualquier lectura de valor de signal. Siempre que cualquiera de estos valores de signal cambie, el efecto se ejecuta nuevamente. Similar a las signals computadas, los efectos mantienen un seguimiento de sus dependencias dinámicamente, y solo rastrean signals que fueron leídas en la ejecución más reciente.

Los efectos siempre se ejecutan **asíncronamente**, durante el proceso de detección de cambios.

### Casos de uso para efectos

Los efectos raramente son necesarios en la mayoría del código de aplicación, pero pueden ser útiles en circunstancias específicas. Aquí hay algunos ejemplos de situaciones donde un `effect` podría ser una buena solución:

- Registrar datos que se están mostrando y cuándo cambian, ya sea para análisis o como herramienta de depuración.
- Mantener datos sincronizados con `window.localStorage`.
- Agregar comportamiento DOM personalizado que no se puede expresar con sintaxis de plantilla.
- Realizar renderizado personalizado a un `<canvas>`, librería de gráficos, u otra librería de interfaz de usuario de terceros.

<docs-callout critical title="Cuándo no usar efectos">
Evita usar efectos para propagación de cambios de estado. Esto puede resultar en errores `ExpressionChangedAfterItHasBeenChecked`, actualizaciones circulares infinitas, o ciclos de detección de cambios innecesarios.

En su lugar, usa signals `computed` para modelar estado que depende de otro estado.
</docs-callout>

### Contexto de inyección

Por defecto, solo puedes crear un `effect()` dentro de un [contexto de inyección](guide/di/dependency-injection-context) (donde tienes acceso a la función `inject`). La forma más fácil de satisfacer este requisito es llamar `effect` dentro del `constructor` de un componente, directiva, o servicio:

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor() {
    // Registrar un nuevo efecto.
    effect(() => {
      console.log(`El contador es: ${this.count()}`);
    });
  }
}
```

Alternativamente, puedes asignar el efecto a un campo (que también le da un nombre descriptivo).

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);

  private loggingEffect = effect(() => {
    console.log(`El contador es: ${this.count()}`);
  });
}
```

Para crear un efecto fuera del constructor, puedes pasar un `Injector` a `effect` vía sus opciones:

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  private injector = inject(Injector);

  initializeLogging(): void {
    effect(() => {
      console.log(`El contador es: ${this.count()}`);
    }, {injector: this.injector});
  }
}
```

### Destruir efectos

Cuando creas un efecto, se destruye automáticamente cuando su contexto envolvente se destruye. Esto significa que los efectos creados dentro de componentes se destruyen cuando el componente se destruye. Lo mismo aplica para efectos dentro de directivas, servicios, etc.

Los efectos devuelven un `EffectRef` que puedes usar para destruirlos manualmente, llamando al método `.destroy()`. Puedes combinar esto con la opción `manualCleanup` para crear un efecto que dura hasta que se destruye manualmente. Ten cuidado de realmente limpiar estos efectos cuando ya no se requieran.

## Temas avanzados

### Funciones de igualdad de signals

Cuando creas una signal, puedes opcionalmente proporcionar una función de igualdad, que se usará para verificar si el nuevo valor es realmente diferente al anterior.

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// Aunque esto es una instancia de array diferente, la función de igualdad profunda
// considerará los valores como iguales, y la signal no
// activará ninguna actualización.
data.set(['test']);
```

Las funciones de igualdad pueden ser proporcionadas tanto a signals escribibles como computadas.

ÚTIL: Por defecto, las signals usan igualdad referencial (comparación [`Object.is()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/is)).

### Leer sin rastrear dependencias

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

### Funciones de limpieza de efectos

Los efectos pueden iniciar operaciones de larga duración, que deberías cancelar si el efecto se destruye o se ejecuta nuevamente antes de que la primera operación termine. Cuando creas un efecto, tu función puede opcionalmente aceptar una función `onCleanup` como su primer parámetro. Esta función `onCleanup` te permite registrar un callback que se invoca antes de que comience la próxima ejecución del efecto, o cuando el efecto se destruye.

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`Hace 1 segundo, el usuario se convirtió en ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

## Usar signals con RxJS

Consulta [Interoperabilidad RxJS con Angular signals](ecosystem/rxjs-interop) para detalles sobre interoperabilidad entre signals y RxJS.
