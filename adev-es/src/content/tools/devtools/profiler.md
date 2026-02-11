# Perfila tu aplicación

La pestaña **Profiler** te permite visualizar la ejecución de la detección de cambios de Angular.
Esto es útil para determinar cuándo y cómo la detección de cambios impacta el rendimiento de tu aplicación.

<img src="assets/images/guide/devtools/profiler.png" alt="Una captura de pantalla de la pestaña 'Profiler' que dice 'Click the play button to start a new recording, or upload a json file containing profiler data.' Al lado hay un botón de grabación para comenzar a grabar un nuevo perfil y un selector de archivos para seleccionar un perfil existente.">

La pestaña Profiler te permite comenzar a perfilar la aplicación actual o importar un perfil existente de una ejecución anterior.
Para comenzar a perfilar tu aplicación, pasa el cursor sobre el círculo en la esquina superior izquierda dentro de la pestaña **Profiler** y haz clic en **Start recording**.

Durante la creación de perfiles, Angular DevTools captura eventos de ejecución, como la detección de cambios y la ejecución de hooks de ciclo de vida.
Interactúa con tu aplicación para activar la detección de cambios y generar datos que Angular DevTools pueda usar.
Para finalizar la grabación, haz clic en el círculo nuevamente para **Stop recording**.

También puedes importar una grabación existente.
Lee más sobre esta característica en la sección [Importar grabación](tools/devtools#import-and-export-recordings).

## Comprende la ejecución de tu aplicación

Después de grabar o importar un perfil, Angular DevTools muestra una visualización de los ciclos de detección de cambios.

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="Una captura de pantalla de la pestaña 'Profiler' después de que un perfil ha sido grabado o cargado. Muestra un gráfico de barras ilustrando varios ciclos de detección de cambios con texto que dice 'Select a bar to preview a particular change detection cycle'.">

Cada barra en la secuencia representa un ciclo de detección de cambios en tu aplicación.
Cuanto más alta sea una barra, más tiempo pasó la aplicación ejecutando la detección de cambios en ese ciclo.
Cuando seleccionas una barra, DevTools muestra información útil sobre ella incluyendo:

- Un gráfico de barras con todos los componentes y directivas que capturó durante este ciclo
- Cuánto tiempo pasó Angular ejecutando la detección de cambios en este ciclo.
- Una tasa de cuadros estimada según la experiencia del usuario (si está por debajo de 60fps)

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="Una captura de pantalla de la pestaña 'Profiler'. Una sola barra ha sido seleccionada por el usuario y un menú desplegable cercano muestra 'Bar chart', mostrando un segundo gráfico de barras debajo. El nuevo gráfico tiene dos barras que ocupan la mayor parte del espacio, una etiquetada `TodosComponent` y la otra etiquetada `NgForOf`. Las otras barras son lo suficientemente pequeñas como para ser insignificantes en comparación.">

## Comprende la ejecución de componentes

El gráfico de barras que se muestra después de hacer clic en un ciclo de detección de cambios muestra una vista detallada sobre cuánto tiempo pasó tu aplicación ejecutando la detección de cambios en ese componente o directiva en particular.

Este ejemplo muestra el tiempo total empleado por la directiva `NgForOf` y qué método fue llamado en ella.

<img src="assets/images/guide/devtools/directive-details.png" alt="Una captura de pantalla de la pestaña 'Profiler' donde la barra `NgForOf` está seleccionada. Una vista detallada de `NgForOf` es visible a la derecha donde lista 'Total time spent: 1.76 ms'. Incluye exactamente una fila, listando `NgForOf` como directiva con un método `ngDoCheck` que tomó 1.76 ms. También incluye una lista etiquetada 'Parent Hierarchy' que contiene los componentes padre de esta directiva.">

## Vistas jerárquicas

<img src="assets/images/guide/devtools/flame-graph-view.png" alt="Una captura de pantalla de la pestaña 'Profiler'. Una sola barra ha sido seleccionada por el usuario y un menú desplegable cercano ahora muestra 'Flame graph', mostrando un gráfico de llamas debajo. El gráfico de llamas comienza con una fila llamada 'Entire application' y otra fila llamada 'AppComponent'. Debajo de esas, las filas comienzan a dividirse en múltiples elementos, comenzando con `[RouterOutlet]` y `DemoAppComponent` en la tercera fila. Algunas capas más profundo, una celda está resaltada en rojo.">

También puedes visualizar la ejecución de la detección de cambios en una vista similar a un gráfico de llamas.

Cada mosaico en el gráfico representa un elemento en la pantalla en una posición específica en el árbol de renderización.
Por ejemplo, considera un ciclo de detección de cambios donde un `LoggedOutUserComponent` es eliminado y en su lugar Angular renderizó un `LoggedInUserComponent`. En este escenario, ambos componentes se mostrarán en el mismo mosaico.

El eje x representa el tiempo total que tomó renderizar este ciclo de detección de cambios.
El eje y representa la jerarquía de elementos. Ejecutar la detección de cambios para un elemento requiere renderizar sus directivas y componentes hijos.
Juntos, este gráfico visualiza qué componentes están tomando más tiempo en renderizar y hacia dónde va ese tiempo.

Cada mosaico está coloreado dependiendo de cuánto tiempo pasó Angular ahí.
Angular DevTools determina la intensidad del color por el tiempo empleado relativo al mosaico donde la renderización tomó más tiempo.

Cuando haces clic en un mosaico determinado, verás detalles sobre él en el panel de la derecha.
Hacer doble clic en el mosaico lo amplía para que puedas ver más fácilmente sus hijos anidados.

## Depurar la detección de cambios y componentes `OnPush`

Normalmente, el gráfico visualiza el tiempo que toma _renderizar_ una aplicación, para cualquier marco de detección de cambios dado. Sin embargo, algunos componentes como los componentes `OnPush` solo se re-renderizarán si sus propiedades de entrada cambian. Puede ser útil visualizar el gráfico de llamas sin estos componentes para marcos particulares.

Para visualizar solo los componentes en un marco de detección de cambios que pasaron por el proceso de detección de cambios, selecciona la casilla **Change detection** en la parte superior, encima del gráfico de llamas.

Esta vista resalta todos los componentes que pasaron por la detección de cambios y muestra en gris aquellos que no lo hicieron, como los componentes `OnPush` que no se re-renderizaron.

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando una visualización de gráfico de llamas de un ciclo de detección de cambios. Una casilla etiquetada 'Show only change detection' ahora está marcada. El gráfico de llamas se ve muy similar al anterior, sin embargo el color de los componentes ha cambiado de naranja a azul. Varios mosaicos etiquetados `[RouterOutlet]` ya no están resaltados con ningún color.">

## Importar y exportar grabaciones

Haz clic en el botón **Save Profile** en la esquina superior derecha de una sesión de perfilado grabada para exportarla como un archivo JSON y guardarla en el disco.
Después, importa el archivo en la vista inicial del profiler haciendo clic en la entrada **Choose file**.

<img src="assets/images/guide/devtools/save-profile.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando ciclos de detección de cambios. En el lado derecho un botón 'Save Profile' es visible.">
