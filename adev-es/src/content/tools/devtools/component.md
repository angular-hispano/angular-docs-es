# Inspeccionar el árbol de componentes

## Depura tu aplicación

La pestaña **Components** te permite explorar la estructura de tu aplicación.
Puedes visualizar las instancias de componentes y directivas en el DOM e inspeccionar o modificar su estado.

### Explora la estructura de la aplicación

El árbol de componentes muestra una relación jerárquica de los _componentes y directivas_ dentro de tu aplicación.

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
Haz clic en el ícono de **_Inspect element_** en la esquina superior izquierda dentro de Angular DevTools y pasa el cursor sobre un elemento DOM en la página.
La extensión reconoce las directivas y/o componentes asociados y te permite seleccionar el elemento correspondiente en el árbol de componentes.

<img src="assets/images/guide/devtools/inspect-element.png" alt="Una captura de pantalla de la pestaña 'Components' con una aplicación Angular de tareas visible. En la esquina superior izquierda de Angular DevTools, un ícono de una pantalla con un ícono de ratón dentro está seleccionado. El ratón descansa sobre un elemento de tarea en la interfaz de la aplicación Angular. El elemento está resaltado con una etiqueta `<TodoComponent>` mostrada en un tooltip adyacente.">

### Inspeccionar vistas diferibles

Junto a las directivas, el árbol de directivas también incluye [bloques `@defer`](/guide/templates/defer).

<img src="assets/images/guide/devtools/defer-block.png" />

Al hacer clic en un bloque defer se muestran más detalles en la barra lateral de propiedades: los diferentes bloques opcionales (por ejemplo `@loading`, `@placeholder` y `@error`), los triggers configurados (triggers de defer, triggers de precarga y triggers de hidratación), y opciones de temporización como los valores `minimum` y `after`.

### Hidratación

Cuando la [hidratación](/guide/hydration) está habilitada en tu aplicación SSR/SSG, el árbol de directivas muestra el estado de hidratación de cada componente.

En caso de errores, se muestra un mensaje de error en el componente afectado.

<img src="assets/images/guide/devtools/hydration-status.png" />

El estado de hidratación también se puede visualizar en la propia aplicación habilitando la superposición.

<img src="assets/images/guide/devtools/hydration-overlay-ecom.png" />

Aquí se muestra una ilustración de las superposiciones de hidratación en una aplicación de ejemplo de tienda Angular.
