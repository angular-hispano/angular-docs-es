## Efectos {#effects}

Las signals son útiles porque notifican a los consumidores interesados cuando cambian. Un **efecto** es una operación que se ejecuta siempre que uno o más valores de signals cambian. Puedes crear un efecto con la función `effect`:

```ts
import {effect} from '@angular/core';

effect(() => {
  console.log(`El contador actual es: ${count()}`);
});
```

Los efectos siempre se ejecutan **al menos una vez.** Cuando un efecto se ejecuta, rastrea cualquier lectura de valores de signals. Siempre que alguno de estos valores de signals cambia, el efecto se ejecuta de nuevo. De forma similar a las signals computadas, los efectos rastrean sus dependencias dinámicamente y solo rastrean las signals que fueron leídas en la ejecución más reciente.

Los efectos siempre se ejecutan de forma **asíncrona**, durante el proceso de detección de cambios.

### Casos de uso para efectos {#use-cases-for-effects}

Los efectos deberían ser la última API a la que recurras. Prefiere siempre `computed()` para valores derivados y `linkedSignal()` para valores que pueden ser tanto derivados como establecidos manualmente. Si te encuentras copiando datos de una signal a otra con un efecto, es un indicio de que deberías mover tu fuente de verdad más arriba y usar `computed()` o `linkedSignal()` en su lugar. Los efectos son ideales para sincronizar el estado de las signals con APIs imperativas que no usan signals.

TIP: No hay situaciones en las que un efecto sea bueno, solo situaciones en las que es apropiado.

- Registrar valores de signals, ya sea para analítica o como herramienta de depuración.
- Mantener datos sincronizados con distintos tipos de almacenamiento: `window.localStorage`, session storage, cookies, etc.
- Agregar comportamiento personalizado del DOM que no puede expresarse con la sintaxis de plantillas.
- Realizar renderizado personalizado en un elemento `<canvas>`, una biblioteca de gráficos u otra biblioteca de interfaz de usuario de terceros.

<docs-callout critical title="Cuándo no usar efectos">
Evita usar efectos para propagar cambios de estado. Esto puede provocar errores `ExpressionChangedAfterItHasBeenChecked`, actualizaciones circulares infinitas o ciclos de detección de cambios innecesarios.

En su lugar, usa signals `computed` para modelar estado que depende de otro estado.
</docs-callout>

### Contexto de inyección {#injection-context}

Por defecto, solo puedes crear un `effect()` dentro de un [contexto de inyección](guide/di/dependency-injection-context) (donde tienes acceso a la función `inject`). La forma más fácil de cumplir este requisito es llamar a `effect` dentro del `constructor` de un componente, directiva o servicio:

```ts
@Component(/* ... */)
export class EffectiveCounter {
  readonly count = signal(0);

  constructor() {
    // Registra un nuevo efecto.
    effect(() => {
      console.log(`El contador es: ${this.count()}`);
    });
  }
}
```

Para crear un efecto fuera del constructor, puedes pasar un `Injector` a `effect` a través de sus opciones:

```ts
@Component(/* ... */)
export class EffectiveCounter {
  readonly count = signal(0);
  private injector = inject(Injector);

  initializeLogging(): void {
    effect(
      () => {
        console.log(`El contador es: ${this.count()}`);
      },
      {injector: this.injector},
    );
  }
}
```

### Ejecución de efectos {#execution-of-effects}

Angular define implícitamente dos comportamientos para sus efectos según el contexto en el que fueron creados.

Un "efecto de vista" (_View Effect_) es un `effect` creado en el contexto de la instanciación de un componente. Esto incluye efectos creados por servicios que están vinculados a inyectores de componentes.<br>
Un "efecto raíz" (_Root Effect_) se crea en el contexto de la instanciación de un servicio provisto en la raíz.

La ejecución de ambos tipos de `effect` está vinculada al proceso de detección de cambios.

- Los "efectos de vista" se ejecutan _antes_ de que el proceso de detección de cambios verifique su componente correspondiente.
- Los "efectos raíz" se ejecutan antes de que el proceso de detección de cambios verifique todos los componentes.

En ambos casos, si al menos una de las dependencias del efecto cambió durante su ejecución, el efecto volverá a ejecutarse antes de continuar con el proceso de detección de cambios.

### Destruir efectos {#destroying-effects}

Cuando un componente o directiva se destruye, Angular limpia automáticamente cualquier efecto asociado.

Un `effect` puede crearse en dos contextos distintos que afectan cuándo se destruye:

- Un "efecto de vista" se destruye cuando se destruye el componente.
- Un "efecto raíz" se destruye cuando se destruye la aplicación.

Los efectos devuelven un `EffectRef`. Puedes usar el método `destroy` de esa referencia para eliminar manualmente un efecto. Puedes combinarlo con la opción `manualCleanup` al crear un efecto para desactivar la limpieza automática. Ten cuidado de destruir realmente esos efectos cuando ya no sean necesarios.

### Funciones de limpieza de efectos {#effect-cleanup-functions}

Cuando un componente o directiva se destruye, Angular limpia automáticamente cualquier efecto asociado.
Los efectos pueden iniciar operaciones de larga duración, que deberías cancelar si el efecto se destruye o se ejecuta de nuevo antes de que la primera operación termine. Cuando creas un efecto, tu función puede aceptar opcionalmente una función `onCleanup` como primer parámetro. Esta función `onCleanup` te permite registrar un callback que se invoca antes de que comience la siguiente ejecución del efecto, o cuando el efecto se destruye.

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`Hace 1 segundo, el usuario pasó a ser ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

## Efectos secundarios en elementos del DOM {#side-effects-on-dom-elements}

La función `effect` es una herramienta de propósito general para ejecutar código en reacción a cambios de signals. Sin embargo, se ejecuta _antes_ de que Angular actualice el DOM. En algunas situaciones, puede que necesites inspeccionar o modificar el DOM manualmente, o integrar una biblioteca de terceros que requiera acceso directo al DOM.

Para estas situaciones, puedes usar `afterRenderEffect`. Funciona como `effect`, pero se ejecuta después de que Angular haya terminado de renderizar y haya aplicado sus cambios al DOM.

```ts
@Component(/* ... */)
export class MyFancyChart {
  chartData = input.required<ChartData>();
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  chart: ChartInstance;

  constructor() {
    // Se ejecuta una sola vez para crear la instancia del gráfico
    afterNextRender({
      write: () => {
        this.chart = initializeChart(this.canvas().nativeElement(), this.chartData());
      },
    });

    // Se vuelve a ejecutar después de que el DOM se haya actualizado, cada vez que `chartData` cambie
    afterRenderEffect(() => {
      this.chart.updateData(this.chartData());
    });
  }
}
```

En este ejemplo, `afterRenderEffect` se usa para actualizar un gráfico creado por una biblioteca de terceros.

TIP: A menudo no necesitas `afterRenderEffect` para comprobar cambios en el DOM. Cuando sea posible, se prefieren APIs como `ResizeObserver`, `MutationObserver` e `IntersectionObserver` sobre `effect` o `afterRenderEffect`.

### Fases de renderizado {#render-phases}

Acceder al DOM y mutarlo puede afectar el rendimiento de tu aplicación, por ejemplo al provocar demasiados [reflows](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) innecesarios.

Para optimizar esas operaciones, `afterRenderEffect` ofrece cuatro fases para agrupar los callbacks y ejecutarlos en un orden optimizado.

Las fases son:

| Fase             | Descripción                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `earlyRead`      | Usa esta fase para leer del DOM antes de un callback de escritura posterior, por ejemplo para realizar un layout personalizado que el navegador no soporta de forma nativa. Prefiere la fase `read` si la lectura puede esperar.                  |
| `write`          | Usa esta fase para escribir en el DOM. **Nunca** leas del DOM en esta fase.                                                                                                                                                                       |
| `mixedReadWrite` | Usa esta fase para leer y escribir en el DOM simultáneamente. Nunca uses esta fase si es posible dividir el trabajo entre las otras fases.                                                                                                        |
| `read`           | Usa esta fase para leer del DOM. **Nunca** escribas en el DOM en esta fase.                                                                                                                                                                       |

Usar estas fases ayuda a prevenir el layout thrashing y garantiza que tus operaciones sobre el DOM se realicen de forma segura y eficiente.

Puedes especificar la fase pasando un objeto con una propiedad `phase` a `afterRender` o `afterNextRender`:

```ts
afterRenderEffect({
  earlyRead: (cleanupFn) => {
    /* ... */
  },
  write: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  mixedReadWrite: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  read: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
});
```

CRITICAL: Si no especificas la fase, `afterRenderEffect` ejecuta los callbacks durante la fase `mixedReadWrite`. Esto puede empeorar el rendimiento de la aplicación al provocar reflows adicionales del DOM.

#### Ejecución de las fases {#phase-executions}

El callback de la fase `earlyRead` no recibe parámetros. Cada fase posterior recibe el valor de retorno del callback de la fase anterior como una Signal. Puedes usar esto para coordinar el trabajo entre fases.

Los efectos se ejecutan en el siguiente orden de fases:

1. `earlyRead`
2. `write`
3. `mixedReadWrite`
4. `read`

Si una de las fases modifica el valor de una signal rastreada por `afterRenderEffect`, las fases afectadas se ejecutan de nuevo.

#### Limpieza {#cleanup}

Cada fase proporciona una función callback de limpieza como argumento. Los callbacks de limpieza se ejecutan cuando el `afterRenderEffect` se destruye o antes de volver a ejecutar los efectos de fase.

### Consideraciones sobre el renderizado del lado del servidor {#server-side-rendering-caveats}

`afterRenderEffect`, al igual que `afterNextRender`/`afterEveryRender`, solo se ejecuta en el cliente.

NOTE: No se garantiza que los componentes estén [hidratados](/guide/hydration) antes de que se ejecute el callback. Debes tener precaución al leer o escribir directamente el DOM y el layout.
