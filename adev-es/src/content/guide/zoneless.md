# Angular sin ZoneJS (Zoneless)

## ¿Por qué usar Zoneless?

Las principales ventajas de eliminar ZoneJS como dependencia son:

- **Rendimiento mejorado**: ZoneJS usa eventos del DOM y tareas asíncronas como indicadores de cuándo el estado de la aplicación _podría_ haberse actualizado y posteriormente activa la sincronización de la aplicación para ejecutar la detección de cambios en las vistas de la aplicación. ZoneJS no tiene conocimiento de si el estado de la aplicación realmente cambió, por lo que esta sincronización se activa con más frecuencia de la necesaria.
- **Mejores Core Web Vitals**: ZoneJS trae una cantidad considerable de sobrecarga, tanto en tamaño de payload como en costo de tiempo de inicio.
- **Mejor experiencia de depuración**: ZoneJS hace que depurar código sea más difícil. Los stack traces son más difíciles de entender con ZoneJS. También es difícil entender cuándo el código falla como resultado de estar fuera de la Angular Zone.
- **Mejor compatibilidad con el ecosistema**: ZoneJS funciona parcheando APIs del navegador, pero no tiene automáticamente parches para cada nueva API del navegador. Algunas APIs no pueden ser parcheadas efectivamente, como `async`/`await`, y tienen que ser convertidas a versiones anteriores para funcionar con ZoneJS. A veces, las bibliotecas en el ecosistema también son incompatibles con la forma en que ZoneJS parchea las APIs nativas. Eliminar ZoneJS como dependencia asegura mejor compatibilidad a largo plazo al remover una fuente de complejidad, monkey patching y mantenimiento continuo.

## Habilitar Zoneless en una aplicación

```typescript
// bootstrap standalone
bootstrapApplication(MyApp, {providers: [
  provideZonelessChangeDetection(),
]});

// bootstrap con NgModule
platformBrowser().bootstrapModule(AppModule);
@NgModule({
  providers: [provideZonelessChangeDetection()]
})
export class AppModule {}
```

## Eliminar ZoneJS

Las aplicaciones Zoneless deberían eliminar ZoneJS completamente de la compilación para reducir el tamaño del bundle. ZoneJS típicamente se carga a través de la opción `polyfills` en `angular.json`, tanto en los targets `build` como `test`. Elimina `zone.js` y `zone.js/testing` de ambos para removerlo de la compilación. Los proyectos que usan un archivo `polyfills.ts` explícito deberían eliminar `import 'zone.js';` e `import 'zone.js/testing';` del archivo.

Después de eliminar ZoneJS de la compilación, ya no hay necesidad de tener `zone.js` como dependencia y el paquete puede ser eliminado completamente:

```shell
npm uninstall zone.js
```

## Requisitos para compatibilidad con Zoneless

Angular depende de notificaciones de las APIs principales para determinar cuándo ejecutar la detección de cambios y en qué vistas.
Estas notificaciones incluyen:

- `ChangeDetectorRef.markForCheck` (llamado automáticamente por `AsyncPipe`)
- `ComponentRef.setInput`
- Actualizar un signal que se lee en una plantilla
- Callbacks de listeners de host o plantilla enlazados
- Adjuntar una vista que fue marcada como dirty por alguno de los anteriores

### Componentes compatibles con `OnPush`

Una forma de asegurar que un componente está usando los mecanismos de notificación correctos mencionados arriba es usar [ChangeDetectionStrategy.OnPush](/best-practices/skipping-subtrees#using-onpush).

La estrategia de detección de cambios `OnPush` no es requerida, pero es un paso recomendado hacia la compatibilidad con zoneless para componentes de aplicación. No siempre es posible para componentes de biblioteca usar `ChangeDetectionStrategy.OnPush`.
Cuando un componente de biblioteca es host para componentes de usuario que podrían usar `ChangeDetectionStrategy.Default`, no puede usar `OnPush` porque eso evitaría que el componente hijo se actualice si no es compatible con `OnPush` y depende de ZoneJS para activar la detección de cambios. Los componentes pueden usar la estrategia `Default` siempre que notifiquen a Angular cuando la detección de cambios necesita ejecutarse (llamando a `markForCheck`, usando signals, `AsyncPipe`, etc.).
Ser host para un componente de usuario significa usar una API como `ViewContainerRef.createComponent` y no solo alojar una porción de una plantilla de un componente de usuario (es decir, proyección de contenido o usar un template ref como entrada).

### Eliminar `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable`, `NgZone.isStable` o `NgZone.onStable`

Las aplicaciones y bibliotecas necesitan eliminar los usos de `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable` y `NgZone.onStable`.
Estos observables nunca emitirán cuando una aplicación habilita la detección de cambios zoneless.
De manera similar, `NgZone.isStable` siempre será `true` y no debería usarse como condición para la ejecución de código.

Los observables `NgZone.onMicrotaskEmpty` y `NgZone.onStable` se usan más frecuentemente para esperar a que Angular complete la detección de cambios antes de realizar una tarea. En su lugar, estos pueden ser reemplazados por `afterNextRender` si necesitan esperar una sola detección de cambios o `afterEveryRender` si hay alguna condición que podría abarcar varias rondas de detección de cambios. En otros casos, estos observables se usaban porque resultaban familiares y tenían un timing similar a lo que se necesitaba. Se pueden usar APIs del DOM más directas en su lugar, como `MutationObserver` cuando el código necesita esperar cierto estado del DOM (en lugar de esperarlo indirectamente a través de los hooks de renderizado de Angular).

<docs-callout title="NgZone.run y NgZone.runOutsideAngular son compatibles con Zoneless">
`NgZone.run` y `NgZone.runOutsideAngular` no necesitan ser eliminados para que el código sea compatible con aplicaciones Zoneless. De hecho, eliminar estas llamadas puede llevar a regresiones de rendimiento para bibliotecas que se usan en aplicaciones que aún dependen de ZoneJS.
</docs-callout>

### `PendingTasks` para Server Side Rendering (SSR)

Si estás usando SSR con Angular, puede que sepas que depende de ZoneJS para ayudar a determinar cuándo la aplicación está "estable" y puede ser serializada. Si hay tareas asíncronas que deberían prevenir la serialización, una aplicación que no usa ZoneJS debe hacer que Angular esté al tanto de estas con el servicio [PendingTasks](/api/core/PendingTasks). La serialización esperará hasta el primer momento en que todas las tareas pendientes hayan sido eliminadas.

Los dos usos más directos de las tareas pendientes son el método `run`:

```typescript
const taskService = inject(PendingTasks);
taskService.run(async () => {
  const someResult = await doSomeWorkThatNeedsToBeRendered();
  this.someState.set(someResult);
});
```

Para casos de uso más complicados, puedes agregar y eliminar manualmente una tarea pendiente:

```typescript
const taskService = inject(PendingTasks);
const taskCleanup = taskService.add();
try {
  await doSomeWorkThatNeedsToBeRendered();
} catch {
  // manejar error
} finally {
  taskCleanup();
}
```

Además, el helper [pendingUntilEvent](/api/core/rxjs-interop/pendingUntilEvent#) en `rxjs-interop` asegura que la aplicación permanezca inestable hasta que el observable emita, complete, tenga un error o se cancele la suscripción.

```typescript
readonly myObservableState = someObservable.pipe(pendingUntilEvent());
```

El framework también usa este servicio internamente para prevenir la serialización hasta que las tareas asíncronas estén completas. Estas incluyen, pero no se limitan a, una navegación del Router en curso y una petición de `HttpClient` incompleta.

## Pruebas y Depuración

### Usar Zoneless en `TestBed`

La función provider de zoneless también puede usarse con `TestBed` para ayudar a asegurar que los componentes bajo prueba sean compatibles con una aplicación Angular Zoneless.

```typescript
TestBed.configureTestingModule({
  providers: [provideZonelessChangeDetection()]
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

Para asegurar que las pruebas tengan el comportamiento más similar al código de producción, evita usar `fixture.detectChanges()` cuando sea posible. Esto fuerza la ejecución de la detección de cambios cuando Angular de otra manera no habría programado la detección de cambios. Las pruebas deberían asegurar que estas notificaciones están ocurriendo y permitir que Angular maneje cuándo sincronizar el estado en lugar de forzarlo manualmente en la prueba.

Para suites de pruebas existentes, usar `fixture.detectChanges()` es un patrón común y probablemente no vale el esfuerzo de convertirlas a `await fixture.whenStable()`. `TestBed` aún aplicará que el componente del fixture sea compatible con `OnPush` y lanzará `ExpressionChangedAfterItHasBeenCheckedError` si encuentra que los valores de la plantilla fueron actualizados sin una notificación de cambio (es decir, `fixture.componentInstance.someValue = 'newValue';`).
Si el componente se usa en producción, este problema debería abordarse actualizando el componente para usar signals para el estado o llamar a `ChangeDetectorRef.markForCheck()`.
Si el componente solo se usa como wrapper de prueba y nunca se usa en una aplicación, es aceptable usar `fixture.changeDetectorRef.markForCheck()`.

### Verificación en modo debug para asegurar que las actualizaciones se detectan

Angular también proporciona una herramienta adicional para ayudar a verificar que una aplicación está haciendo actualizaciones al estado de una manera compatible con zoneless. `provideCheckNoChangesConfig({exhaustive: true, interval: <milliseconds>})` puede usarse para verificar periódicamente que ningún enlace ha sido actualizado sin una notificación. Angular lanza `ExpressionChangedAfterItHasBeenCheckedError` si hay un enlace actualizado que no se habría refrescado por la detección de cambios zoneless.
