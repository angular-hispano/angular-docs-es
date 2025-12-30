# Cancelar suscripciones con `takeUntilDestroyed`

CONSEJO: Esta guía supone que ya estás familiarizado con el [ciclo de vida de componentes y directivas](guide/components/lifecycle).

El operador `takeUntilDestroyed`, de `@angular/core/rxjs-interop`, proporciona una forma concisa y confiable de cancelar automáticamente la suscripción a un Observable cuando un componente o directiva se destruye. Esto evita las fugas de memoria habituales con suscripciones de RxJS. Funciona de manera similar al operador [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) de RxJS pero sin necesidad de un `Subject` adicional.

```typescript
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NotificationDispatcher, CustomPopupShower} from './some-shared-project-code';

@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);

  constructor() {
    // Esta suscripción al Observable `notifications` se da de baja automáticamente
    // cuando el componente `UserProfile` se destruye.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed()).subscribe(message => {
      this.popup.show(message);
    });
  }
}
```

El operador `takeUntilDestroyed` acepta un único argumento opcional [`DestroyRef`](/api/core/DestroyRef). El operador usa `DestroyRef` para saber cuándo el componente o la directiva se han destruido. Puedes omitir este argumento cuando llames a `takeUntilDestroyed` en un [contexto de inyección](https://angular.dev/guide/di/dependency-injection-context), normalmente el constructor de un componente o directiva. Proporciona siempre un `DestroyRef` si tu código puede llamar a `takeUntilDestroyed` fuera de un contexto de inyección.

```typescript
@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);
  private destroyRef = inject(DestroyRef);

  startListeningToNotifications() {
    // Pasa siempre un `DestroyRef` si llamas a `takeUntilDestroyed` fuera
    // de un contexto de inyección.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(message => {
      this.popup.show(message);
    });
  }
}
```
