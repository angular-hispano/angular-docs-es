# Perfilado con Chrome DevTools

Angular se integra con la [API de extensibilidad de Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/extension) para presentar datos e información específicos del framework directamente en el [panel de rendimiento de Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/overview).

Con la integración habilitada, puedes [grabar un perfil de rendimiento](https://developer.chrome.com/docs/devtools/performance#record) que contiene dos conjuntos de datos:

- Entradas de rendimiento estándar basadas en la comprensión de Chrome de tu código ejecutándose en un navegador, y
- Entradas específicas de Angular contribuidas por el tiempo de ejecución del framework.

Ambos conjuntos de datos se presentan juntos en la misma pestaña, pero en pistas separadas:

<img alt="Pista personalizada de Angular en el perfilador de Chrome DevTools" src="assets/images/best-practices/runtime-performance/angular-perf-in-chrome.png">

Los datos específicos de Angular se expresan en términos de conceptos del framework (componentes, change detection, hooks de ciclo de vida, etc.) junto con llamadas de funciones y métodos de nivel más bajo capturadas por un navegador. Estos dos conjuntos de datos están correlacionados, y puedes cambiar entre las diferentes vistas y niveles de detalle.

Puedes usar la pista de Angular para entender mejor cómo se ejecuta tu código en el navegador, incluyendo:

- Determinar si un bloque de código dado es parte de la aplicación Angular, o si pertenece a otro script ejecutándose en la misma página.
- Identificar cuellos de botella de rendimiento y atribuirlos a componentes o servicios específicos.
- Obtener una visión más profunda del funcionamiento interno de Angular con un desglose visual de cada ciclo de change detection.

## Grabando un perfil {#recording-a-profile}

### Habilitar integración {#enable-integration}

Puedes habilitar el perfilado de Angular de dos maneras:

1. Ejecutar [`ng.enableProfiling()`](api/core/enableProfiling) en el panel de consola de Chrome, o
1. Incluir una llamada a [`enableProfiling()`](api/core/enableProfiling) en el código de inicio de tu aplicación (importado desde `@angular/core`).

NOTA:
El perfilado de Angular funciona exclusivamente en modo de desarrollo.

Aquí hay un ejemplo de cómo puedes habilitar la integración en el bootstrap de la aplicación para capturar todos los eventos posibles:

```ts
import { enableProfiling } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MyApp } from './my-app';

// Activa el perfilado *antes* de iniciar tu aplicación
// para capturar todo el código ejecutado al inicio.
enableProfiling();
bootstrapApplication(MyApp);
```

### Grabar un perfil {#record-a-profile}

Usa el botón **Record** en el panel de rendimiento de Chrome DevTools:

<img alt="Grabando un perfil" src="assets/images/best-practices/runtime-performance/recording-profile-in-chrome.png">

Consulta la [documentación de Chrome DevTools](https://developer.chrome.com/docs/devtools/performance#record) para más detalles sobre la grabación de perfiles.

## Abrir un componente en Angular DevTools {#open-a-component-in-angular-devtools}

Después de grabar un perfil, selecciona un evento de componente en la pista **Angular**.
La pestaña **Summary** puede incluir un enlace de **Component** que usa el esquema de URL `angular-devtools://component/...`.

<img alt="Panel de rendimiento de Chrome DevTools mostrando una pista personalizada de Angular con un evento _MainComponent seleccionado. La pestaña Summary muestra un enlace de Component que usa el esquema de URL angular-devtools://component." src="assets/images/best-practices/runtime-performance/chrome-performance-deep-link.png">

Haz clic en el enlace para abrir Angular DevTools y seleccionar el componente correspondiente en la pestaña **Components**.
Esto te ayuda a pasar de un perfil a nivel del navegador al estado y metadatos del componente para un evento seleccionado.

NOTA: Abrir enlaces de componentes requiere Angular DevTools para Chrome y la bandera experimental `chrome://flags/#enable-devtools-deep-link-via-extensibility-api` de Chrome.

## Interpretando un perfil grabado {#interpreting-a-recorded-profile}

Puedes usar la pista personalizada "Angular" para identificar y diagnosticar rápidamente problemas de rendimiento. Las siguientes secciones describen algunos escenarios comunes de perfilado.

### Diferenciando entre tu aplicación Angular y otras tareas en la misma página {#differentiating-between-your-angular-application-and-other-tasks-on-the-same-page}

Como los datos de Angular y Chrome se presentan en pistas separadas pero correlacionadas, puedes ver cuándo se ejecuta el código de la aplicación Angular en oposición a algún otro procesamiento del navegador (típicamente layout y paint) u otros scripts ejecutándose en la misma página (en este caso la pista personalizada de Angular no tiene ningún dato):

<img alt="Datos de perfil: ejecución de Angular vs. scripts de terceros" src="assets/images/best-practices/runtime-performance/profile-angular-vs-3rd-party.png">

Esto te permite determinar si investigaciones posteriores deben enfocarse en el código de la aplicación Angular o en otras partes de tu código base o dependencias.

### Codificación por colores {#color-coding}

Angular usa colores en el gráfico de llamas para distinguir tipos de tareas:

- 🟦 Azul representa código TypeScript escrito por el desarrollador de la aplicación (por ejemplo: servicios, constructores de componentes y hooks de ciclo de vida, etc.).
- 🟪 Púrpura representa código de plantillas escrito por el desarrollador de la aplicación y transformado por el compilador de Angular.
- 🟩 Verde representa puntos de entrada al código de la aplicación e identifica _razones_ para ejecutar código.

Los siguientes ejemplos ilustran la codificación por colores descrita en varias grabaciones de la vida real.

#### Ejemplo: Bootstrap de la aplicación {#example-application-bootstrapping}

El proceso de bootstrap de la aplicación usualmente consiste en:

- Disparadores marcados en azul, como la llamada a `bootstrapApplication`, instanciación del componente raíz, y change detection inicial
- Varios servicios de DI instanciados durante el bootstrap, marcados en verde.

<img alt="Datos de perfil: bootstrap de la aplicación" src="assets/images/best-practices/runtime-performance/profile-bootstrap-application.png">

#### Ejemplo: Ejecución de componente {#example-component-execution}

El procesamiento de un componente típicamente se representa como un punto de entrada (azul) seguido de su ejecución de plantilla (púrpura). Una plantilla puede, a su vez, disparar la instanciación de directivas y ejecución de hooks de ciclo de vida (verde):

<img alt="Datos de perfil: procesamiento de componente" src="assets/images/best-practices/runtime-performance/profile-component-processing.png">

#### Ejemplo: Change detection {#example-change-detection}

Un ciclo de change detection usualmente consiste en uno o más pases de sincronización de datos (azul), donde cada pase recorre un subconjunto de componentes.

<img alt="Datos de perfil: change detection" src="assets/images/best-practices/runtime-performance/profile-change-detection.png">

Con esta visualización de datos, es posible identificar inmediatamente los componentes que estuvieron involucrados en el change detection y cuáles fueron omitidos (típicamente los componentes `OnPush` que no fueron marcados como dirty).

Adicionalmente, puedes inspeccionar el número de pases de sincronización para un change detection. Tener más de un pase de sincronización sugiere que el estado se actualiza durante el change detection. Debes evitar esto, ya que ralentiza las actualizaciones de la página y puede incluso resultar en bucles infinitos en los peores casos.
