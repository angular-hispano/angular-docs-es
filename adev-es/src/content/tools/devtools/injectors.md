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

Al hacer clic en un inyector que tiene proveedores configurados, se mostrarán esos proveedores en una lista a la derecha de la vista del árbol de inyectores. Aquí puedes ver el token proporcionado y su tipo. El botón a la derecha de cada proveedor te permite registrar el proveedor en la consola.

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="Una captura de pantalla de la pestaña 'Profiler' mostrando cómo los proveedores se hacen visibles cuando se selecciona un inyector.">
