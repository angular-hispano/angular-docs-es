# Scripts personalizados de service worker

Aunque el service worker de Angular ofrece excelentes capacidades, es posible que necesites agregar funcionalidad personalizada, como manejar notificaciones push, sincronización en segundo plano u otros eventos de service worker. Puedes crear un script de service worker personalizado que importe y amplíe el service worker de Angular.

## Crear un service worker personalizado

Para crear un service worker personalizado que extienda la funcionalidad de Angular:

1. Crea un archivo de service worker personalizado (por ejemplo, `custom-sw.js`) en tu directorio `src`:

```js
// Importa el service worker de Angular
importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  // Agrega un manejador personalizado para el clic en notificaciones
  self.addEventListener('notificationclick', (event) => {
    console.log('Manejador personalizado de clic en notificaciones');
    console.log('Detalles de la notificación:', event.notification);
    
    // Gestiona el clic en la notificación: abre la URL si está disponible
    if (clients.openWindow && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
      console.log('Abriendo URL:', event.notification.data.url);
    }
  });

  // Agrega un manejador personalizado para sincronización en segundo plano
  self.addEventListener('sync', (event) => {
    console.log('Manejador personalizado de sincronización en segundo plano');
    
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });

  function doBackgroundSync() {
    // Implementa aquí la lógica de sincronización en segundo plano
    return fetch('https://example.com/api/sync')
      .then(response => response.json())
      .then(data => console.log('Sincronización en segundo plano completa:', data))
      .catch(error => console.error('La sincronización en segundo plano falló:', error));
  }
})();
```

2. Actualiza tu archivo `angular.json` para usar el service worker personalizado:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              },
              "app/src/custom-sw.js"
            ]
          }
        }
      }
    }
  }
}
```

3. Configura el registro del service worker para usar tu script personalizado:

```ts
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('custom-sw.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

### Mejores prácticas para service workers personalizados

Al extender el service worker de Angular:

- **Importa siempre primero el service worker de Angular** mediante `importScripts('./ngsw-worker.js')` para asegurarte de conservar toda la funcionalidad de caché y actualización.
- **Envuelve tu código personalizado en un IIFE** (Immediately Invoked Function Expression) para evitar contaminar el ámbito global.
- **Usa `event.waitUntil()`** en las operaciones asíncronas para garantizar que finalicen antes de que el service worker se termine.
- **Prueba exhaustivamente** en entornos de desarrollo y producción.
- **Maneja los errores con cuidado** para evitar que tu código personalizado rompa la funcionalidad del service worker de Angular.

### Casos de uso comunes

Los service workers personalizados se utilizan con frecuencia para:

- **Notificaciones push**: manejar mensajes push entrantes y mostrar notificaciones
- **Sincronización en segundo plano**: sincronizar datos cuando se restablece la conexión de red  
- **Navegación personalizada**: gestionar escenarios especiales de routing o páginas offline
