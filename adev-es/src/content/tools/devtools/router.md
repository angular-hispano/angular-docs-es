# Inspeccionar el árbol del Router

La pestaña **Router Tree** te permite visualizar el árbol de routing de tu aplicación. Puedes explorar cómo se anidan las rutas y ver los detalles de rutas específicas.

<img src="assets/images/guide/devtools/router-tree.png" alt="Una captura de pantalla de la pestaña 'Router Tree' en Angular DevTools mostrando un árbol de rutas configuradas. Las rutas activas se resaltan en verde, mientras que las inactivas están en blanco.">

### Ver los detalles de una ruta {#view-route-details}

Cuando seleccionas una ruta específica en el árbol, Angular DevTools muestra sus propiedades en la barra lateral derecha. Esta información incluye:

- **Path**: La ruta URL de la ruta. Si la ruta usa un matcher de URL personalizado, DevTools muestra **Matcher** en su lugar.
- **Component**: El componente renderizado para esta ruta. Si la ruta es una redirección, DevTools muestra el destino de **Redirect to** en su lugar.
- **Path Match**: La estrategia de coincidencia de ruta (`prefix` o `full`), si está configurada.
- **Data**: Datos estáticos asociados a la ruta, mostrados como un árbol JSON.
- **Resolvers**: Los resolvers de la ruta, mostrados como pares clave-valor.
- **Guards**: Cualquier guard configurado en la ruta, agrupado por tipo — `canActivate`, `canActivateChild`, `canDeactivate` y `canMatch`.
- **Providers**: Proveedores a nivel de ruta, si están configurados.
- **Title**: El título de la ruta, si está configurado.
- **RunGuardsAndResolvers**: La estrategia de re-ejecución de guards y resolvers, si está configurada.
- **Active**: Si esta ruta está activa actualmente.
- **Auxiliary**: Indica si la ruta es una ruta auxiliar (por ejemplo, en un outlet con nombre).
- **Lazy**: Indica si la ruta se carga de forma diferida.

Note: Propiedades como Path Match, Data, Resolvers, Guards, Providers, Title y RunGuardsAndResolvers solo aparecen en la barra lateral cuando están configuradas en la ruta seleccionada.

### Navegar a una ruta específica {#navigate-to-a-specific-route}

Puedes activar fácilmente una navegación directamente desde DevTools. Mientras inspeccionas los detalles de una ruta en la barra lateral derecha, haz clic en el icono **Navigate** junto a la cadena de la ruta. Esto hace que el router de Angular navegue a esa URL en tu aplicación.

<img src="assets/images/guide/devtools/router-tree-navigate.png" alt="Una captura de pantalla mostrando el tooltip 'Navigate to' sobre la ruta en la barra lateral 'Routes Details'.">
