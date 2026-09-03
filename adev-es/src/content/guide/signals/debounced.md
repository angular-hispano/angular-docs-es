# Aplicar debounce a signals con `debounced`

IMPORTANT: `debounced` es [experimental](reference/releases#experimental). Está listo para que lo pruebes, pero podría cambiar antes de ser estable.

Usa `debounced` para retrasar la reacción al valor de una signal hasta que deje de cambiar. Devuelve un `Resource` cuyo valor refleja el valor con debounce de la signal fuente.

```angular-ts
import {debounced, resource, signal} from '@angular/core';

@Component({
  template: `
    <input (input)="query.set($event.target.value)" />

    @if (results.isLoading()) {
      <p>Buscando…</p>
    }
    @for (item of results.value(); track item.id) {
      <li>{{ item.name }}</li>
    }
  `,
})
export class Search {
  query = signal('');

  debouncedQuery = debounced(this.query, 300);

  results = resource({
    params: () => this.debouncedQuery.value(),
    loader: ({params}) => fetchResults(params),
  });
}
```

`debounced` recibe la signal fuente y una duración de espera en milisegundos. El `value()` del resource devuelto siempre contiene el último valor asentado, y `status()` te indica si un nuevo valor sigue pendiente.

## Estado durante el debounce {#status-during-debounce}

Mientras el temporizador del debounce está en cuenta regresiva, `status()` es `'loading'` y `value()` devuelve el valor resuelto anteriormente. Cuando el temporizador expira, el resource se asienta en `'resolved'`. Si la signal fuente lanza un error, el resource entra en `'error'` de inmediato; no se ejecuta ningún temporizador.

Consulta [Estado del resource](/guide/signals/resource#resource-status) para ver la lista completa de estados y el comportamiento de `value()` en cada uno.

## Función de espera personalizada {#custom-wait-function}

En lugar de una duración en milisegundos, puedes pasar una función que devuelva un `Promise<void>`. El resource se resuelve cuando la promesa se resuelve. Si la signal fuente cambia antes de que la promesa se asiente, Angular descarta la promesa anterior e inicia una nueva.

```ts
debouncedQuery = debounced(query, (value, lastSnapshot) => {
  // Reintenta de inmediato tras un error en lugar de hacer que el usuario espere de nuevo.
  if (lastSnapshot.status === 'error') return;
  // Las consultas cortas reciben un retraso mayor: probablemente el usuario sigue escribiendo.
  const ms = value.length < 3 ? 500 : 200;
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
});
```

Consulta el tipo `DebounceTimer` en la referencia de la API para más detalles.

## Igualdad {#equality}

Por defecto, `debounced` usa `Object.is` para comparar valores.

Proporciona una función de igualdad personalizada con la opción `equal` cuando la comprobación de identidad predeterminada sea demasiado estricta:

```ts
debouncedFilter = debounced(filter, 200, {
  equal: (a, b) => a.category === b.category && a.minPrice === b.minPrice,
});
```

## Contexto de inyección {#injection-context}

`debounced` debe llamarse dentro de un [contexto de inyección](guide/di/dependency-injection-context). Angular destruye automáticamente el resource con debounce y cancela cualquier temporizador pendiente cuando se destruye el inyector.

Para usar `debounced` fuera de un contexto de inyección, pasa un `Injector` explícito a través de las opciones:

```ts
@Service()
export class SearchService {
  private injector = inject(Injector);

  createDebouncedQuery(query: Signal<string>): Resource<string> {
    return debounced(query, 300, {injector: this.injector});
  }
}
```
