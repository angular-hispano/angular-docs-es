# Computaciones lentas

En cada ciclo de change detection, Angular sincrónicamente:

- Evalúa todas las expresiones de plantilla en todos los componentes, a menos que se especifique lo contrario, basándose en la estrategia de detección de cada componente
- Ejecuta los hooks de ciclo de vida `ngDoCheck`, `ngAfterContentChecked`, `ngAfterViewChecked`, y `ngOnChanges`.
  Una sola computación lenta dentro de una plantilla o un hook de ciclo de vida puede ralentizar todo el proceso de change detection porque Angular ejecuta las computaciones secuencialmente.

## Identificando computaciones lentas

Puedes identificar computaciones pesadas con el perfilador de Angular DevTools. En la línea de tiempo de rendimiento, haz clic en una barra para previsualizar un ciclo particular de change detection. Esto muestra un gráfico de barras, que muestra cuánto tiempo pasó el framework en change detection para cada componente. Cuando haces clic en un componente, puedes previsualizar cuánto tiempo pasó Angular evaluando su plantilla y hooks de ciclo de vida.

<img alt="Vista previa del perfilador de Angular DevTools mostrando computación lenta" src="assets/images/best-practices/runtime-performance/slow-computations.png">

Por ejemplo, en la captura de pantalla anterior, el segundo ciclo de change detection grabado está seleccionado. Angular pasó más de 573 ms en este ciclo, con la mayor parte del tiempo gastado en el `EmployeeListComponent`. En el panel de detalles, puedes ver que Angular pasó más de 297 ms evaluando la plantilla del `EmployeeListComponent`.

## Optimizando computaciones lentas

Aquí hay varias técnicas para eliminar computaciones lentas:

- **Optimizar el algoritmo subyacente**. Este es el enfoque recomendado. Si puedes acelerar el algoritmo que está causando el problema, puedes acelerar todo el mecanismo de change detection.
- **Caching usando pipes puros**. Puedes mover la computación pesada a un [pipe](guide/pipes) puro. Angular reevalúa un pipe puro solo si detecta que sus entradas han cambiado, comparado con la vez anterior que Angular lo llamó.
- **Usando memoización**. La [memoización](https://en.wikipedia.org/wiki/Memoization) es una técnica similar a los pipes puros, con la diferencia de que los pipes puros preservan solo el último resultado de la computación donde la memoización podría almacenar múltiples resultados.
- **Evitar repaints/reflows en hooks de ciclo de vida**. Ciertas [operaciones](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) causan que el navegador recalcule sincrónicamente el layout de la página o la vuelva a renderizar. Ya que los reflows y repaints son generalmente lentos, quieres evitar realizarlos en cada ciclo de change detection.

Los pipes puros y la memoización tienen diferentes compensaciones. Los pipes puros son un concepto integrado de Angular comparado con la memoización, que es una práctica general de ingeniería de software para cachear resultados de funciones. La sobrecarga de memoria de la memoización podría ser significativa si invocas la computación pesada frecuentemente con diferentes argumentos.
