# Resolviendo la contaminación de zone

**Zone.js** es un mecanismo de señalización que Angular usa para detectar cuándo el estado de una aplicación podría haber cambiado. Captura operaciones asíncronas como `setTimeout`, peticiones de red y escuchadores de eventos. Angular programa el change detection basándose en señales de Zone.js.

En algunos casos, las [tareas](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks) o [microtareas](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks) programadas no hacen ningún cambio en el modelo de datos, lo que hace que ejecutar change detection sea innecesario. Ejemplos comunes son:

* `requestAnimationFrame`, `setTimeout` o `setInterval`
* Programación de tareas o microtareas por bibliotecas de terceros

Esta sección cubre cómo identificar tales condiciones, y cómo ejecutar código fuera de la zone de Angular para evitar llamadas innecesarias de change detection.

## Identificando llamadas innecesarias de change detection

Puedes detectar llamadas innecesarias de change detection usando Angular DevTools. A menudo aparecen como barras consecutivas en la línea de tiempo del perfilador con origen `setTimeout`, `setInterval`, `requestAnimationFrame`, o un manejador de eventos. Cuando tienes llamadas limitadas dentro de tu aplicación de estas APIs, la invocación de change detection usualmente es causada por una biblioteca de terceros.

<img alt="Vista previa del perfilador de Angular DevTools mostrando contaminación de zone" src="assets/images/best-practices/runtime-performance/zone-pollution.png">

En la imagen anterior, hay una serie de llamadas de change detection disparadas por manejadores de eventos asociados con un elemento. Ese es un desafío común al usar componentes de terceros no nativos de Angular, que no alteran el comportamiento predeterminado de `NgZone`.

## Ejecutar tareas fuera de `NgZone`

En tales casos, puedes indicarle a Angular que evite llamar change detection para tareas programadas por un fragmento de código dado usando [NgZone](/api/core/NgZone).

<docs-code header="Ejecutar fuera de la Zone" language='ts' linenums>
import { Component, NgZone, OnInit } from '@angular/core';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates), 500);
  }
}
</docs-code>

El fragmento anterior le indica a Angular que llame `setInterval` fuera de la Zone de Angular y omita ejecutar change detection después de que `pollForUpdates` se ejecute.

Las bibliotecas de terceros comúnmente disparan ciclos innecesarios de change detection cuando sus APIs son invocadas dentro de la zone de Angular. Este fenómeno afecta particularmente a bibliotecas que configuran escuchadores de eventos o inician otras tareas (como temporizadores, peticiones XHR, etc.). Evita estos ciclos adicionales llamando a las APIs de la biblioteca fuera de la zone de Angular:

<docs-code header="Mover la inicialización del gráfico fuera de la Zone" language='ts' linenums>
import { Component, NgZone, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
</docs-code>

Ejecutar `Plotly.newPlot('chart', data);` dentro de `runOutsideAngular` le indica al framework que no debe ejecutar change detection después de la ejecución de tareas programadas por la lógica de inicialización.

Por ejemplo, si `Plotly.newPlot('chart', data)` agrega escuchadores de eventos a un elemento DOM, Angular no ejecuta change detection después de la ejecución de sus manejadores.

Pero a veces, puedes necesitar escuchar eventos despachados por APIs de terceros. En tales casos, es importante recordar que esos escuchadores de eventos también se ejecutarán fuera de la zone de Angular si la lógica de inicialización se realizó allí:

<docs-code header="Verificar si el manejador es llamado fuera de la Zone" language='ts' linenums>
import { Component, NgZone, OnInit, output } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      // Este manejador será llamado fuera de la zone de Angular porque
      // la lógica de inicialización también es llamada fuera de la zone. Para verificar
      // si estamos en la zone de Angular, podemos llamar lo siguiente:
      console.log(NgZone.isInAngularZone());
      this.plotlyClick.emit(event);
    });
  }
}
</docs-code>

Si necesitas despachar eventos a componentes padres y ejecutar lógica específica de actualización de vista, debes considerar volver a entrar a la zone de Angular para indicarle al framework que ejecute change detection o ejecutar change detection manualmente:

<docs-code header="Volver a entrar a la zone de Angular al despachar evento" language='ts' linenums>
import { Component, NgZone, OnInit, output } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      this.ngZone.run(() => {
        this.plotlyClick.emit(event);
      });
    });
  }
}
</docs-code>

El escenario de despachar eventos fuera de la zone de Angular también puede surgir. Es importante recordar que disparar change detection (por ejemplo, manualmente) puede resultar en la creación/actualización de vistas fuera de la zone de Angular.
