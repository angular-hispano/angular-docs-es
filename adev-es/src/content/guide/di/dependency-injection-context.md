# Contexto de inyección

El sistema de inyección de dependencias (DI) se basa internamente en un contexto de tiempo de ejecución donde el inyector actual está disponible.

Esto significa que los inyectores solo pueden funcionar cuando el código se ejecuta en dicho contexto.

El contexto de inyección está disponible en estas situaciones:

- Durante la construcción (vía el `constructor`) de una clase siendo instanciada por el sistema DI, como un `@Injectable` o `@Component`.
- En el inicializador para campos de dichas clases.
- En la función de fábrica especificada para `useFactory` de un `Provider` o un `@Injectable`.
- En la función `factory` especificada para un `InjectionToken`.
- Dentro de un Stack frame que se ejecuta en un contexto de inyección.

Saber cuándo estás en un contexto de inyección te permitirá usar la función [`inject`](api/core/inject) para inyectar instancias.

NOTA: Para ejemplos básicos de usar `inject()` en constructores de clase e inicializadores de campos, consulta la [guía de resumen](/guide/di#where-can-inject-be-used).

## Stack frame en contexto

Algunas APIs están diseñadas para ejecutarse en un contexto de inyección. Este es el caso, por ejemplo, con los guards del router. Esto permite el uso de [`inject`](api/core/inject) dentro de la función guard para acceder a un servicio.

Aquí tienes un ejemplo para `CanActivateFn`

```ts {highlight: [3]}
const canActivateTeam: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
  };
```

## Ejecutar dentro de un contexto de inyección

Cuando quieres ejecutar una función dada en un contexto de inyección sin estar ya en uno, puedes hacerlo con `runInInjectionContext`.
Esto requiere acceso a un inyector dado, como el `EnvironmentInjector`, por ejemplo:

```ts {highlight: [9], header: "hero.service.ts"}
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Haz lo que necesites con el servicio inyectado
    });
  }
}
```

Ten en cuenta que `inject` devolverá una instancia solo si el inyector puede resolver el token requerido.

## Afirmar el contexto

Angular proporciona la función auxiliar `assertInInjectionContext` para afirmar que el contexto actual es un contexto de inyección y lanza un error claro si no lo es. Pasa una referencia a la función que llama para que el mensaje de error apunte al punto de entrada de la API correcto. Esto produce un mensaje más claro y accionable que el error genérico de inyección predeterminado.

```ts
import { ElementRef, assertInInjectionContext, inject } from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
    assertInInjectionContext(injectNativeElement);
    return inject(ElementRef).nativeElement;
}
```

Puedes llamar a esta función auxiliar **desde un contexto de inyección** (constructor, inicializador de campo, fábrica de proveedor, o código ejecutado vía `runInInjectionContext`):

```ts
import { Component, inject } from '@angular/core';
import { injectNativeElement } from './dom-helpers';

@Component({ /* … */ })
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // El inicializador de campo se ejecuta en un contexto de inyección.

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // Falla: se ejecuta fuera de un contexto de inyección.
  }
}
```

## Usando DI fuera de un contexto

Llamar a [`inject`](api/core/inject) o llamar a `assertInInjectionContext` fuera de un contexto de inyección lanzará [error NG0203](/errors/NG0203).
