# Contexto de inyección

El sistema de inyección de dependencias (DI) se basa internamente en un contexto de tiempo de ejecución donde el inyector actual está disponible.
Esto significa que los inyectores solo pueden funcionar cuando el código se ejecuta en dicho contexto.

El contexto de inyección está disponible en estas situaciones:

* Durante la construcción (vía el `constructor`) de una clase siendo instanciada por el sistema DI, como un `@Injectable` o `@Component`.
* En el inicializador para campos de dichas clases.
* En la función de fábrica especificada para `useFactory` de un `Provider` o un `@Injectable`.
* En la función `factory` especificada para un `InjectionToken`.
* Dentro de un Stack frame que se ejecuta en un contexto de inyección.

Saber cuándo estás en un contexto de inyección te permitirá usar la función [`inject`](api/core/inject) para inyectar instancias.

## Constructores de clase

Cada vez que el sistema DI instancia una clase, lo hace en un contexto de inyección. Esto es manejado por el framework mismo. El constructor de la clase se ejecuta en ese contexto de tiempo de ejecución, lo que también permite la inyección de un token usando la función [`inject`](api/core/inject).

<docs-code language="typescript" highlight="[[3],[6]]">
class MyComponent  {
  private service1: Service1;
  private service2: Service2 = inject(Service2); // In context

  constructor() {
    this.service1 = inject(Service1) // In context
  }
}
</docs-code>

## Stack frame en contexto

Algunas APIs están diseñadas para ejecutarse en un contexto de inyección. Este es el caso, por ejemplo, con los guards del router. Esto permite el uso de [`inject`](api/core/inject) dentro de la función guard para acceder a un servicio.

Aquí tienes un ejemplo para `CanActivateFn`

<docs-code language="typescript" highlight="[3]">
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
</docs-code>

## Ejecutar dentro de un contexto de inyección

Cuando quieres ejecutar una función dada en un contexto de inyección sin estar ya en uno, puedes hacerlo con `runInInjectionContext`.
Esto requiere acceso a un inyector dado, como el `EnvironmentInjector`, por ejemplo:

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[9]">
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Haz lo que necesites con el servicio inyectado
    });
  }
}
</docs-code>

Ten en cuenta que `inject` devolverá una instancia solo si el inyector puede resolver el token requerido.

## Afirma el contexto

Angular proporciona la función auxiliar `assertInInjectionContext` para afirmar que el contexto actual es un contexto de inyección.

## Usando DI fuera de un contexto

Llamar a [`inject`](api/core/inject) o llamar a `assertInInjectionContext` fuera de un contexto de inyección lanzará [error NG0203](/errors/NG0203).
