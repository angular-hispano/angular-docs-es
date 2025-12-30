# Notificaciones push

Las notificaciones push son una forma eficaz de involucrar a las personas usuarias.
Gracias a los service workers, las notificaciones pueden entregarse a un dispositivo incluso cuando tu aplicación no está en primer plano.

El service worker de Angular permite mostrar notificaciones push y manejar eventos de clic en las notificaciones.

ÚTIL: Cuando usas el service worker de Angular, las interacciones con notificaciones push se manejan con el servicio `SwPush`.
Para conocer más sobre las APIs del navegador involucradas, consulta [Push API](https://developer.mozilla.org/es/docs/Web/API/Push_API) y [Using the Notifications API](https://developer.mozilla.org/es/docs/Web/API/Notifications_API/Using_the_Notifications_API).

## Payload de la notificación

Invoca notificaciones push enviando un mensaje con un payload válido.
Consulta `SwPush` para obtener orientación.

ÚTIL: En Chrome, puedes probar las notificaciones push sin un backend.
Abre DevTools -> Application -> Service Workers y usa el campo `Push` para enviar un payload de notificación JSON.

## Manejo del clic en la notificación

El comportamiento predeterminado del evento `notificationclick` es cerrar la notificación y notificar a `SwPush.notificationClicks`.

Puedes especificar una operación adicional que se ejecute en `notificationclick` agregando una propiedad `onActionClick` al objeto `data` y proporcionando una entrada `default`.
Esto es especialmente útil cuando no hay clientes abiertos al hacer clic en la notificación.

```json
{
  "notification": {
    "title": "New Notification!",
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow", "url": "foo"}
      }
    }
  }
}
```

### Operaciones

El service worker de Angular admite las siguientes operaciones:

| Operaciones                 | Detalles                                                                                                                                            |
|:--------------------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openWindow`                | Abre una pestaña nueva en la URL especificada.                                                                                                       |
| `focusLastFocusedOrOpen`    | Enfoca el último cliente enfocado. Si no hay ningún cliente abierto, abre una pestaña nueva en la URL especificada.                                  |
| `navigateLastFocusedOrOpen` | Enfoca el último cliente enfocado y lo navega a la URL especificada. Si no hay ningún cliente abierto, abre una pestaña nueva en la URL especificada. |
| `sendRequest`               | Envía una solicitud GET simple a la URL especificada.                                                                                                |

IMPORTANTE: Las URL se resuelven en relación con el scope de registro del service worker.<br />Si un elemento `onActionClick` no define una `url`, se usa el scope de registro del service worker.

### Acciones

Las acciones ofrecen una forma de personalizar cómo puede interactuar la persona usuaria con una notificación.

Usando la propiedad `actions`, puedes definir un conjunto de acciones disponibles.
Cada acción se representa como un botón que la persona usuaria puede pulsar para interactuar con la notificación.

Además, usando la propiedad `onActionClick` en el objeto `data`, puedes vincular cada acción con una operación que se ejecutará cuando se presione el botón correspondiente:

```json
{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Send request in the background"},
      {"action": "other", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
        "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
      }
    }
  }
}
```

IMPORTANTE: Si una acción no tiene una entrada correspondiente en `onActionClick`, la notificación se cierra y `SwPush.notificationClicks` se notifica en los clientes existentes.

## Más sobre los service workers de Angular

También podría interesarte lo siguiente:

<docs-pill-row>

  <docs-pill href="ecosystem/service-workers/communications" title="Comunícate con el Service Worker"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
</docs-pill-row>
