# Primeros pasos con service workers

Este documento explica cómo habilitar el soporte del service worker de Angular en proyectos que creaste con la [Angular CLI](tools/cli). Luego utiliza un ejemplo para mostrar un service worker en acción, demostrando la carga y el almacenamiento en caché básico.

## Agregar un service worker a tu proyecto

Para configurar el service worker de Angular en tu proyecto, ejecuta el siguiente comando de la CLI:

```shell

ng add @angular/pwa

```

La CLI configura tu aplicación para usar service workers con las siguientes acciones:

1. Agrega el paquete `@angular/service-worker` a tu proyecto.
1. Habilita el soporte de compilación del service worker en la CLI.
1. Importa y registra el service worker con los proveedores raíz de la aplicación.
1. Actualiza el archivo `index.html`:
    - Incluye un enlace para agregar el archivo `manifest.webmanifest`
    - Agrega una metaetiqueta para `theme-color`
1. Instala archivos de íconos para admitir la aplicación web progresiva (PWA) instalada.
1. Crea el archivo de configuración del service worker llamado [`ngsw-config.json`](ecosystem/service-workers/config),
que especifica los comportamientos de caché y otras configuraciones.

Ahora, compila el proyecto:

```shell

ng build

```

El proyecto de la CLI ya está configurado para usar el service worker de Angular.

## Service worker en acción: un recorrido

Esta sección demuestra un service worker en acción mediante una aplicación de ejemplo. Para habilitar el soporte de service 
worker durante el desarrollo local, usa la configuración de producción con el siguiente comando:

```shell

ng serve --configuration=production

```

Como alternativa, puedes usar el [`http-server package`](https://www.npmjs.com/package/http-server) de
npm, que admite aplicaciones con service worker. Ejecútalo sin instalación usando:

```shell

npx http-server -p 8080 -c-1 dist/<project-name>/browser

```

Esto servirá tu aplicación con soporte de service worker en http://localhost:8080.

### Carga inicial

Con el servidor ejecutándose en el puerto `8080`, apunta tu navegador a `http://localhost:8080`.
Tu aplicación debería cargarse normalmente.

CONSEJO: Cuando pruebes los service workers de Angular, es buena idea usar una ventana de incógnito o privada en tu navegador para asegurarte de que el service worker no termine leyendo un estado residual previo, lo que puede causar un comportamiento inesperado.

ÚTIL: Si no estás usando HTTPS, el service worker solo se registrará cuando accedas a la aplicación en `localhost`.

### Simular un problema de red

Para simular un problema de red, deshabilita la interacción de red para tu aplicación.

En Chrome:

1. Selecciona **Tools** > **Developer Tools** (desde el menú de Chrome en la esquina superior derecha).
1. Ve a la **pestaña Network**.
1. Selecciona **Offline** en el menú desplegable **Throttling**.

<img alt="The offline option in the Network tab is selected" src="assets/images/guide/service-worker/offline-option.png">

Ahora la aplicación no tiene acceso a la red.

Para las aplicaciones que no usan el service worker de Angular, actualizar ahora mostraría la página de Chrome "There is no Internet connection".

Con el service worker de Angular agregado, el comportamiento de la aplicación cambia.
Al actualizar, la página se carga con normalidad.

Mira la pestaña Network para verificar que el service worker esté activo.

<img alt="Requests are marked as from ServiceWorker" src="assets/images/guide/service-worker/sw-active.png">

ÚTIL: En la columna "Size", el estado de las solicitudes es `(ServiceWorker)`.
Esto significa que los recursos no se están cargando desde la red.
En cambio, se cargan desde la caché del service worker.

### ¿Qué se está almacenando en caché?

Observa que todos los archivos que el navegador necesita para renderizar esta aplicación están cacheados.
La configuración predeterminada `ngsw-config.json` está configurada para almacenar en caché los recursos específicos usados por la CLI:

- `index.html`
- `favicon.ico`
- Artefactos de la compilación (bundles JS y CSS)
- Todo lo que esté bajo `assets`
- Imágenes y fuentes directamente bajo el `outputPath` configurado (de forma predeterminada `./dist/<project-name>/`) o `resourcesOutputPath`.
    Consulta la documentación de `ng build` para más información sobre estas opciones.

IMPORTANTE: El `ngsw-config.json` generado incluye una lista limitada de extensiones cacheables para fuentes e imágenes. En algunos casos, quizá quieras modificar el patrón glob para adaptarlo a tus necesidades.

IMPORTANTE: Si `resourcesOutputPath` o las rutas de `assets` se modifican después de generar el archivo de configuración, debes cambiar las rutas manualmente en `ngsw-config.json`.

### Realizar cambios en tu aplicación

Ahora que viste cómo los service workers almacenan en caché tu aplicación, el siguiente paso es comprender cómo funcionan las actualizaciones.
Haz un cambio en la aplicación y observa cómo el service worker instala la actualización:

1. Si estás probando en una ventana de incógnito, abre una segunda pestaña en blanco.
    Esto mantiene viva la ventana de incógnito y el estado de la caché durante la prueba.

1. Cierra la pestaña de la aplicación, pero no la ventana.
    Esto también debería cerrar las DevTools.

1. Detén `http-server` (Ctrl-C).
1. Abre `src/app/app.component.html` para editarlo.
1. Cambia el texto `Welcome to {{title}}!` por `Bienvenue à {{title}}!`.
1. Compila y ejecuta el servidor nuevamente:

```shell
    ng build
    npx http-server -p 8080 -c-1 dist/<project-name>/browser
```

### Actualizar tu aplicación en el navegador

Ahora observa cómo el navegador y el service worker manejan la aplicación actualizada.

1. Abre nuevamente [http://localhost:8080](http://localhost:8080) en la misma ventana.
    ¿Qué sucede?

   <img alt="It still says Welcome to Service Workers!" src="assets/images/guide/service-worker/welcome-msg-en.png">

    ¿Qué salió mal?
    _¡Nada, en realidad!_
    El service worker de Angular está haciendo su trabajo y sirviendo la versión de la aplicación que tiene **instalada**, incluso aunque haya una actualización disponible.
    En aras de la velocidad, el service worker no espera a verificar si hay actualizaciones antes de servir la aplicación que tiene en caché.

    Mira los registros de `http-server` para ver al service worker solicitando `/ngsw.json`.

   ```text
   [2023-09-07T00:37:24.372Z]  "GET /ngsw.json?ngsw-cache-bust=0.9365263935102124" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
   ```

    Así es como el service worker verifica si hay actualizaciones.

1. Actualiza la página.

   <img alt="The text has changed to say Bienvenue à app!" src="assets/images/guide/service-worker/welcome-msg-fr.png">

    El service worker instaló la versión actualizada de tu aplicación _en segundo plano_, y la próxima vez que se carga o recarga la página, el service worker cambia a la versión más reciente.

## Configuración del service worker

Los service workers de Angular admiten opciones de configuración exhaustivas mediante la interfaz `SwRegistrationOptions`, que proporciona control detallado sobre el registro, la caché y la ejecución de scripts.

### Habilitar y deshabilitar service workers

La opción `enabled` controla si se registrará el service worker y si los servicios relacionados intentarán comunicarse con él.

```ts

import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Deshabilitar en desarrollo, habilitar en producción
    }),
  ],
};

```

### Control de caché con updateViaCache

La opción `updateViaCache` controla cómo el navegador consulta la caché HTTP durante las actualizaciones del service worker. Esto brinda control detallado sobre cuándo el navegador obtiene scripts actualizados del service worker y módulos importados.

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      updateViaCache: 'imports',
    }),
  ],
};

```

La opción `updateViaCache` acepta los siguientes valores:

- **`'imports'`**: la caché HTTP se consulta para los scripts importados por el service worker, pero no para el script del service worker en sí
- **`'all'`**: la caché HTTP se consulta tanto para el script del service worker como para sus scripts importados  
- **`'none'`**: la caché HTTP no se consulta ni para el script del service worker ni para sus scripts importados

### Compatibilidad con módulos ES mediante la opción type

La opción `type` permite especificar el tipo de script al registrar service workers, lo que brinda soporte a las características de módulos ES en tus scripts de service worker.

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      type: 'module', // Habilita características de módulos ES
    }),
  ],
};

```

La opción `type` acepta los siguientes valores:

- **`'classic'`** (predeterminado): ejecución tradicional de scripts de service worker. No se permiten características de módulos ES como `import` y `export`
- **`'module'`**: registra el script como un módulo ES. Permite usar la sintaxis `import`/`export` y las características de módulos

### Control del alcance de registro

La opción `scope` define el alcance de registro del service worker, determinando qué rango de URL puede controlar.

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      scope: '/app/', // El service worker solo controlará las URL bajo /app/
    }),
  ],
};

```

- Controla qué URL puede interceptar y gestionar el service worker
- De forma predeterminada, el scope es el directorio que contiene el script del service worker
- Se usa al llamar a `ServiceWorkerContainer.register()`

### Configuración de la estrategia de registro

La opción `registrationStrategy` define cuándo se registrará el service worker en el navegador, lo que proporciona control sobre el momento del registro.

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

```

Estrategias de registro disponibles:

- **`'registerWhenStable:timeout'`** (predeterminada: `'registerWhenStable:30000'`): registra tan pronto como la aplicación se estabiliza (sin microtareas/macrotareas pendientes) pero no más tarde que el límite de tiempo especificado en milisegundos
- **`'registerImmediately'`**: registra el service worker de inmediato
- **`'registerWithDelay:timeout'`**: registra con un retraso igual al tiempo especificado en milisegundos

```ts

// Registrar inmediatamente
export const immediateConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ],
};

// Registrar con un retraso de 5 segundos
export const delayedConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWithDelay:5000',
    }),
  ],
};

```

También puedes proporcionar una función fábrica de Observable para un momento personalizado de registro:

```ts
import { timer } from 'rxjs';

export const customConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: () => timer(10_000), // Registrar después de 10 segundos
    }),
  ],
};

```

## Más sobre los service workers de Angular

También podría interesarte lo siguiente:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Archivo de configuración"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunícate con el Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Notificaciones push"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="Patrón App shell"/>
</docs-pill-row>
