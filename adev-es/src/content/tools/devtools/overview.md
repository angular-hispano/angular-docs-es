# Descripción general de DevTools

Angular DevTools es una extensión de navegador que proporciona capacidades de depuración y creación de perfiles para aplicaciones de Angular.

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

Instala Angular DevTools desde la [Chrome Web Store](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh) o desde [Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/).

Puedes abrir Chrome o Firefox DevTools en cualquier página web presionando <kbd>F12</kbd> o <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd> (Windows o Linux) y <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> o <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd> (Mac).
Una vez que las DevTools del navegador estén abiertas y Angular DevTools esté instalado, puedes encontrarlo en la pestaña "Angular".

ÚTIL: La página de nueva pestaña de Chrome no ejecuta extensiones instaladas, por lo que la pestaña de Angular no aparecerá en DevTools. Visita cualquier otra página para verla.

<img src="assets/images/guide/devtools/devtools.png" alt="Una descripción general de Angular DevTools mostrando un árbol de componentes para una aplicación.">

## Abre tu aplicación

Cuando abras la extensión, verás tres pestañas adicionales:

| Pestañas                                      | Detalles                                                                                                                |
| :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [Componentes](tools/devtools/component)    | Te permite explorar los componentes y directivas en tu aplicación y previsualizar o editar su estado.                    |
| [Profiler](tools/devtools/profiler)       | Te permite perfilar tu aplicación y entender cuál es el cuello de botella de rendimiento durante la ejecución de la detección de cambios. |
| [Árbol de Inyectores](tools/devtools/injectors) | Te permite visualizar la jerarquía de inyectores de entorno y de elementos.                                                      |

Otras pestañas como `Router Tree` o `Transfer State` son experimentales y pueden habilitarse a través de la configuración de devtools, y aún no están documentadas.

ÚTIL: Para usuarios de navegadores basados en Chromium, puede interesarte la [integración con el panel de rendimiento](/best-practices/profiling-with-chrome-devtools).

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="Una captura de pantalla de la parte superior de Angular DevTools ilustrando dos pestañas en la esquina superior izquierda, una etiquetada 'Components' y otra etiquetada 'Profiler'.">

En la esquina superior derecha de Angular DevTools encontrarás el botón de información que abre un popover.
El popover de información contiene, entre otros datos, qué versión de Angular se está ejecutando en la página así como la versión de devtools.

### Aplicación de Angular no detectada

Si ves un mensaje de error "Angular application not detected" al abrir Angular DevTools, esto significa que no puede comunicarse con una aplicación de Angular en la página.
La razón más común es que la página web que estás inspeccionando no contiene una aplicación de Angular.
Verifica que estás inspeccionando la página web correcta y que la aplicación de Angular se está ejecutando.

### Detectamos una aplicación compilada con configuración de producción

Si ves un mensaje de error "We detected an application built with production configuration. Angular DevTools only supports development builds.", esto significa que se encontró una aplicación de Angular en la página, pero fue compilada con optimizaciones de producción.
Al compilar para producción, Angular CLI elimina varias características de depuración para minimizar la cantidad de JavaScript en la página y mejorar el rendimiento. Esto incluye las características necesarias para comunicarse con DevTools.

Para ejecutar DevTools, necesitas compilar tu aplicación con las optimizaciones deshabilitadas. `ng serve` hace esto por defecto.
Si necesitas depurar una aplicación desplegada, deshabilita las optimizaciones en tu compilación con la [opción de configuración `optimization`](reference/configs/workspace-config#optimization-configuration) (`{"optimization": false}`).
