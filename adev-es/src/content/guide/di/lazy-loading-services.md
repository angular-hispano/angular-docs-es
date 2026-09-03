# Lazy loading de servicios

IMPORTANT: Para que el lazy loading funcione, el servicio que cargas debe estar auto-provisto. Decóralo con `@Injectable({providedIn: 'root'})` o con [`@Service()`](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator). Sin auto-provisión, Angular no tiene forma de construir el servicio después de cargarlo.

La función `injectAsync` de Angular te permite cargar un servicio bajo demanda, solo cuando realmente se necesita. Esto es útil cuando un servicio depende de una biblioteca grande o de una funcionalidad poco usada, y no quieres pagar su costo en la carga inicial de la página.

Cuando usas `injectAsync`, tu bundler separa el código del servicio en un chunk de JavaScript independiente que se descarga la primera vez que solicitas la instancia. Una vez cargado, Angular resuelve el servicio a través del sistema de DI habitual, así que puede seguir dependiendo de otros inyectables y se comporta como cualquier otro singleton.

## Inyectando un servicio de forma diferida {#lazily-injecting-a-service}

Imagina un `ReportExporter` que depende de una biblioteca pesada de hojas de cálculo. La mayoría de los usuarios abren el reporte; solo unos pocos hacen clic en **Export**. Carga el exportador bajo demanda:

```angular-ts
import {Component, injectAsync} from '@angular/core';

@Component({
  selector: 'app-report',
  template: `<button (click)="export()">Export</button>`,
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter));

  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

La primera llamada a `this.exporter()` dispara la importación dinámica y resuelve el servicio desde DI. Las llamadas siguientes reutilizan la misma promesa, así que el chunk solo se descarga una vez.

Si el servicio cargado con lazy loading es la [exportación por defecto](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export), pasa la importación dinámica directamente; Angular extrae el `default` por ti:

```ts {header: report-exporter.ts}
@Service()
export default class ReportExporter {
  /* … */
}
```

```ts {header: report.ts}
private exporter = injectAsync(() => import('./report-exporter'));
```

## Precargando la dependencia {#prefetching-the-dependency}

Por defecto, el chunk diferido solo se descarga cuando invocas la función devuelta. Puedes iniciar la descarga antes pasando un disparador `prefetch` en las opciones. Un disparador es cualquier función que devuelve una `Promise`; cuando esta se resuelve, Angular pone en marcha el cargador.

Angular incluye `onIdle`, un disparador integrado que espera hasta que el navegador queda inactivo:

```ts
import {Component, injectAsync, onIdle} from '@angular/core';

@Component({
  /* … */
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter), {
    prefetch: onIdle,
  });
}
```

También puedes configurar `onIdle` con un tiempo máximo de espera para que la precarga siempre ocurra dentro de una ventana conocida, incluso en páginas con mucha actividad:

```ts
injectAsync(loader, {prefetch: () => onIdle({timeout: 1_000})});
```

NOTE: La precarga es oportunista. Si el usuario invoca la funcionalidad antes de que se dispare la precarga, Angular carga la dependencia inmediatamente de todos modos y resuelve tu `await` en cuanto está lista.

## Proveer un disparador de precarga personalizado {#provide-a-custom-prefetch-trigger}

Un `PrefetchTrigger` es simplemente una función que devuelve una promesa; el cargador se ejecuta en cuanto la promesa se resuelve. Úsalo para alinear la precarga con tus propios eventos, como un hover o un tick de un planificador:

```ts
import {PrefetchTrigger} from '@angular/core';

export function onHover(target: HTMLElement): PrefetchTrigger {
  return () =>
    new Promise<void>((resolve) => {
      target.addEventListener('pointerenter', () => resolve(), {once: true});
    });
}
```
