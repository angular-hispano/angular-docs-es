# Configuración avanzada de componentes

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee eso primero si eres nuevo en Angular.

## ChangeDetectionStrategy

El decorador `@Component` acepta una opción `changeDetection` que controla el **modo de
detección de cambios** del componente. Hay dos opciones de modo de detección de cambios.

**`ChangeDetectionStrategy.Default`** es, como era de esperar, la estrategia por defecto. En este modo,
Angular verifica si el DOM del componente necesita una actualización cada vez que cualquier actividad puede haber ocurrido
en toda la aplicación. Las actividades que desencadenan esta verificación incluyen interacción del usuario, respuesta de red,
temporizadores, y más.

**`ChangeDetectionStrategy.OnPush`** es un modo opcional que reduce la cantidad de verificación que Angular
necesita realizar. En este modo, el framework solo verifica si el DOM de un componente necesita una actualización cuando:

- Un input del componente ha cambiado como resultado de un enlace en una plantilla, o
- Un event listener en este componente se ejecuta
- El componente es explícitamente marcado para verificación, a través de `ChangeDetectorRef.markForCheck` o algo que lo envuelve, como `AsyncPipe`.

Además, cuando un componente OnPush es verificado, Angular _también_ verifica todos sus componentes
ancestros, atravesando hacia arriba a través del árbol de la aplicación.

## PreserveWhitespaces

Por defecto, Angular elimina y colapsa los espacios en blanco superfluos en las plantillas, más comúnmente de
saltos de línea e indentación. Puedes cambiar esta configuración estableciendo explícitamente `preserveWhitespaces` a
`true` en los metadatos del componente.

## Esquemas de elementos personalizados

Por defecto, Angular lanza un error cuando encuentra un elemento HTML desconocido. Puedes
deshabilitar este comportamiento para un componente incluyendo `CUSTOM_ELEMENTS_SCHEMA` en la propiedad `schemas`
en los metadatos de tu componente.

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component></some-unknown-component>'
})
export class ComponentWithCustomElements { }
```

Angular no soporta ningún otro esquema en este momento.
