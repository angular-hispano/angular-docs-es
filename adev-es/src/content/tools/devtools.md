# Descripción general de DevTools

Angular DevTools es una extensión de navegador que proporciona capacidades de depuración y creación de perfiles para aplicaciones de Angular.

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

Instala Angular DevTools desde la [Chrome Web Store](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh) o desde [Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/).

Puedes abrir Chrome o Firefox DevTools en cualquier página web presionando <kbd>F12</kbd> o <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd> (Windows o Linux) y <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> o <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd> (Mac).
Una vez que las DevTools del navegador estén abiertas y Angular DevTools esté instalado, puedes encontrarlo en la pestaña "Angular".

ÚTIL: La página de nueva pestaña de Chrome no ejecuta extensiones instaladas, por lo que la pestaña de Angular no aparecerá en DevTools. Visita cualquier otra página para verla.

<img src="assets/images/guide/devtools/devtools.png" alt="Una descripción general de Angular DevTools mostrando un árbol de componentes para una aplicación.">

## Abre tu aplicación

Cuando abras la extensión, verás dos pestañas adicionales:

| Pestañas                                     | Detalles |
|:---                                      |:---     |
| [Components](tools/devtools#debug-your-application) | Te permite explorar los componentes y directivas en tu aplicación y previsualizar o editar su estado.                    |
| [Profiler](tools/devtools#profile-your-application)     | Te permite perfilar tu aplicación y entender cuál es el cuello de botella de rendimiento durante la ejecución de la detección de cambios. |

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="Una captura de pantalla de la parte superior de Angular DevTools ilustrando dos pestañas en la esquina superior izquierda, una etiquetada 'Components' y otra etiquetada 'Profiler'.">

En la esquina superior derecha de Angular DevTools encontrarás qué versión de Angular se está ejecutando en la página, así como el último hash de commit de la extensión.

### Aplicación de Angular no detectada

Si ves un mensaje de error "Angular application not detected" al abrir Angular DevTools, esto significa que no puede comunicarse con una aplicación de Angular en la página.
La razón más común es que la página web que estás inspeccionando no contiene una aplicación de Angular.
Verifica que estás inspeccionando la página web correcta y que la aplicación de Angular se está ejecutando.

### Detectamos una aplicación compilada con configuración de producción

Si ves un mensaje de error "We detected an application built with production configuration. Angular DevTools only supports development builds.", esto significa que se encontró una aplicación de Angular en la página, pero fue compilada con optimizaciones de producción.
Al compilar para producción, Angular CLI elimina varias características de depuración para minimizar la cantidad de JavaScript en la página y mejorar el rendimiento. Esto incluye las características necesarias para comunicarse con DevTools.

Para ejecutar DevTools, necesitas compilar tu aplicación con las optimizaciones deshabilitadas. `ng serve` hace esto por defecto.
Si necesitas depurar una aplicación desplegada, deshabilita las optimizaciones en tu compilación con la [opción de configuración `optimization`](reference/configs/workspace-config#optimization-configuration) (`{"optimization": false}`).

## Depura tu aplicación

La pestaña **Components** te permite explorar la estructura de tu aplicación.
Puedes visualizar las instancias de componentes y directivas en el DOM e inspeccionar o modificar su estado.

### Explora la estructura de la aplicación

El árbol de componentes muestra una relación jerárquica de los *componentes y directivas* dentro de tu aplicación.

<img src="assets/images/guide/devtools/component-explorer.png" alt="Una captura de pantalla de la pestaña 'Components' mostrando un árbol de componentes y directivas de Angular comenzando desde la raíz de la aplicación.">

Haz clic en los componentes o directivas individuales en el explorador de componentes para seleccionarlos y previsualizar sus propiedades.
Angular DevTools muestra las propiedades y metadatos en el lado derecho del árbol de componentes.

Para buscar un componente o directiva por nombre, usa el cuadro de búsqueda encima del árbol de componentes.

<img src="assets/images/guide/devtools/search.png" alt="Una captura de pantalla de la pestaña 'Components'. La barra de filtro inmediatamente debajo de la pestaña está buscando 'todo' y todos los componentes con 'todo' en el nombre están resaltados en el árbol. `app-todos` está actualmente seleccionado y una barra lateral a la derecha muestra información sobre las propiedades del componente. Esto incluye una sección de campos `@Output` y otra sección para otras propiedades.">

### Navegar al nodo host

Para ir al elemento host de un componente o directiva en particular, haz doble clic en él en el explorador de componentes.
Angular DevTools abrirá la pestaña Elements en Chrome o la pestaña Inspector en Firefox, y seleccionará el nodo DOM asociado.

### Navegar al código fuente

Para los componentes, Angular DevTools te permite navegar a la definición del componente en la pestaña Sources (Chrome) y la pestaña Debugger (Firefox).
Después de seleccionar un componente en particular, haz clic en el ícono en la esquina superior derecha de la vista de propiedades:

<img src="assets/images/guide/devtools/navigate-source.png" alt="Una captura de pantalla de la pestaña 'Components'. La vista de propiedades a la derecha es visible para un componente y el ratón descansa en la esquina superior derecha de esa vista sobre un ícono `<>`. Un tooltip adyacente dice 'Open component source'.">

### Actualizar el valor de una propiedad

Al igual que las DevTools del navegador, la vista de propiedades te permite editar el valor de una entrada, salida u otras propiedades.
Haz clic derecho en el valor de la propiedad y si la funcionalidad de edición está disponible para este tipo de valor, aparecerá un campo de texto.
Escribe el nuevo valor y presiona `Enter` para aplicar este valor a la propiedad.

<img src="assets/images/guide/devtools/update-property.png" alt="Una captura de pantalla de la pestaña 'Components' con la vista de propiedades abierta para un componente. Un `@Input` llamado `todo` contiene una propiedad `label` que está actualmente seleccionada y ha sido actualizada manualmente al valor 'Buy milk'.">

### Acceder al componente o directiva seleccionada en la consola

Como atajo en la consola, Angular DevTools proporciona acceso a instancias de componentes o directivas seleccionados recientemente.
Escribe `$ng0` para obtener una referencia a la instancia del componente o directiva actualmente seleccionada, y escribe `$ng1` para la instancia seleccionada previamente, `$ng2` para la instancia seleccionada antes de esa, y así sucesivamente.

<img src="assets/images/guide/devtools/access-console.png" alt="Una captura de pantalla de la pestaña 'Components' con la consola del navegador debajo. En la consola, el usuario ha escrito tres comandos, `$ng0`, `$ng1` y `$ng2` para ver los tres elementos seleccionados más recientemente. Después de cada instrucción, la consola imprime una referencia de componente diferente.">

### Seleccionar una directiva o componente

Similar a las DevTools del navegador, puedes inspeccionar la página para seleccionar un componente o directiva en particular.
Haz clic en el ícono de ***Inspect element*** en la esquina superior izquierda dentro de Angular DevTools y pasa el cursor sobre un elemento DOM en la página.
La extensión reconoce las directivas y/o componentes asociados y te permite seleccionar el elemento correspondiente en el árbol de componentes.

<img src="assets/images/guide/devtools/inspect-element.png" alt="Una captura de pantalla de la pestaña 'Components' con una aplicación Angular de tareas visible. En la esquina superior izquierda de Angular DevTools, un ícono de una pantalla con un ícono de ratón dentro está seleccionado. El ratón descansa sobre un elemento de tarea en la interfaz de la aplicación Angular. El elemento está resaltado con una etiqueta `<TodoComponent>` mostrada en un tooltip adyacente.">

## Perfila tu aplicación

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

### Comprende la ejecución de tu aplicación

Después de grabar o importar un perfil, Angular DevTools muestra una visualización de los ciclos de detección de cambios.

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="Una captura de pantalla de la pestaña 'Profiler' después de que un perfil ha sido grabado o cargado. Muestra un gráfico de barras ilustrando varios ciclos de detección de cambios con texto que dice 'Select a bar to preview a particular change detection cycle'.">

Cada barra en la secuencia representa un ciclo de detección de cambios en tu aplicación.
Cuanto más alta sea una barra, más tiempo pasó la aplicación ejecutando la detección de cambios en ese ciclo.
Cuando seleccionas una barra, DevTools muestra información útil sobre ella incluyendo:

* Un gráfico de barras con todos los componentes y directivas que capturó durante este ciclo
* Cuánto tiempo pasó Angular ejecutando la detección de cambios en este ciclo.
* Una tasa de cuadros estimada según la experiencia del usuario.
* La fuente que activó la detección de cambios.

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="Una captura de pantalla de la pestaña 'Profiler'. Una sola barra ha sido seleccionada por el usuario y un menú desplegable cercano muestra 'Bar chart', mostrando un segundo gráfico de barras debajo. El nuevo gráfico tiene dos barras que ocupan la mayor parte del espacio, una etiquetada `TodosComponent` y la otra etiquetada `NgForOf`. Las otras barras son lo suficientemente pequeñas como para ser insignificantes en comparación.">

### Comprende la ejecución de componentes

El gráfico de barras que se muestra después de hacer clic en un ciclo de detección de cambios muestra una vista detallada sobre cuánto tiempo pasó tu aplicación ejecutando la detección de cambios en ese componente o directiva en particular.

Este ejemplo muestra el tiempo total empleado por la directiva `NgForOf` y qué método fue llamado en ella.

<img src="assets/images/guide/devtools/directive-details.png" alt="Una captura de pantalla de la pestaña 'Profiler' donde la barra `NgForOf` está seleccionada. Una vista detallada de `NgForOf` es visible a la derecha donde lista 'Total time spent: 1.76 ms'. Incluye exactamente una fila, listando `NgForOf` como directiva con un método `ngDoCheck` que tomó 1.76 ms. También incluye una lista etiquetada 'Parent Hierarchy' que contiene los componentes padre de esta directiva.">

### Vistas jerárquicas

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

### Depurar la detección de cambios y componentes `OnPush`

Normalmente, el gráfico visualiza el tiempo que toma *renderizar* una aplicación, para cualquier marco de detección de cambios dado. Sin embargo, algunos componentes como los componentes `OnPush` solo se re-renderizarán si sus propiedades de entrada cambian. Puede ser útil visualizar el gráfico de llamas sin estos componentes para marcos particulares.

Para visualizar solo los componentes en un marco de detección de cambios que pasaron por el proceso de detección de cambios, selecciona la casilla **Change detection** en la parte superior, encima del gráfico de llamas.

Esta vista resalta todos los componentes que pasaron por la detección de cambios y muestra en gris aquellos que no lo hicieron, como los componentes `OnPush` que no se re-renderizaron.

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando una visualización de gráfico de llamas de un ciclo de detección de cambios. Una casilla etiquetada 'Show only change detection' ahora está marcada. El gráfico de llamas se ve muy similar al anterior, sin embargo el color de los componentes ha cambiado de naranja a azul. Varios mosaicos etiquetados `[RouterOutlet]` ya no están resaltados con ningún color.">

### Importar y exportar grabaciones

Haz clic en el botón **Save Profile** en la esquina superior derecha de una sesión de perfilado grabada para exportarla como un archivo JSON y guardarla en el disco.
Después, importa el archivo en la vista inicial del profiler haciendo clic en la entrada **Choose file**.

<img src="assets/images/guide/devtools/save-profile.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando ciclos de detección de cambios. En el lado derecho un botón 'Save Profile' es visible.">

 ## Inspecciona tus inyectores

 NOTA: El Árbol de Inyectores está disponible para aplicaciones de Angular compiladas con la versión 17 o superior.

### Visualiza la jerarquía de inyectores de tu aplicación

 La pestaña **Árbol de Inyectores** te permite explorar la estructura de los inyectores configurados en tu aplicación. Aquí verás dos árboles que representan la [jerarquía de inyectores](guide/di/hierarchical-dependency-injection) de tu aplicación. Un árbol es tu jerarquía de entorno, el otro es tu jerarquía de elementos.

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando la pestaña del árbol de inyectores en Angular Devtools visualizando el gráfico de inyectores para una aplicación de ejemplo.">

 ### Visualiza las rutas de resolución

 Cuando se selecciona un inyector específico, se resalta la ruta que el algoritmo de inyección de dependencias de Angular recorre desde ese inyector hasta la raíz. Para los inyectores de elementos, esto incluye resaltar los inyectores de entorno a los que el algoritmo de inyección de dependencias salta cuando una dependencia no puede ser resuelta en la jerarquía de elementos.

Consulta las [reglas de resolución](guide/di/hierarchical-dependency-injection#resolution-rules) para más detalles sobre cómo Angular resuelve las rutas de resolución.

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando cómo el árbol de inyectores visualiza y resalta las rutas de resolución cuando se selecciona un inyector.">

 ### Visualiza los proveedores del inyector

 Al hacer clic en un inyector que tiene proveedores configurados, se mostrarán esos proveedores en una lista a la derecha de la vista del árbol de inyectores. Aquí puedes ver el token proporcionado y su tipo.

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando cómo los proveedores se hacen visibles cuando se selecciona un inyector.">
