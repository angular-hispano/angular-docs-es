<docs-decorative-header title="Inyección de dependencias en Angular" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

La Inyección de Dependencias (DI) es un patrón de diseño usado para organizar y compartir código a través de una aplicación.
</docs-decorative-header>

CONSEJO: Consulta los [Fundamentos](essentials/dependency-injection) de Angular antes de sumergirte en esta guía completa.

A medida que una aplicación crece, los desarrolladores a menudo necesitan reutilizar y compartir características en diferentes partes del código base. [La Inyección de Dependencias (DI)](https://es.wikipedia.org/wiki/Inyecci%C3%B3n_de_dependencias) es un patrón de diseño usado para organizar y compartir código a través de una aplicación permitiéndote "inyectar" características en diferentes partes.

La inyección de dependencias es un patrón popular porque permite a los desarrolladores abordar desafíos comunes como:

- **Mejor mantenibilidad del código**: La inyección de dependencias permite una separación más limpia de responsabilidades que facilita la refactorización y reduce la duplicación de código.
- **Escalabilidad**: La funcionalidad modular puede reutilizarse en múltiples contextos y permite un escalado más fácil.
- **Mejor testing**: DI permite que las pruebas unitarias usen fácilmente [dobles de prueba](https://es.wikipedia.org/wiki/Test_double) para situaciones en las que usar una implementación real no es práctico.

## ¿Cómo funciona la inyección de dependencias en Angular?

Una dependencia es cualquier objeto, valor, función o servicio que una clase necesita para funcionar pero que no crea por sí misma. En otras palabras, crea una relación entre diferentes partes de tu aplicación ya que no funcionaría sin la dependencia.

Hay dos formas en que el código interactúa con cualquier sistema de inyección de dependencias:

- El código puede _proporcionar_, o hacer disponibles, valores.
- El código puede _inyectar_, o solicitar, esos valores como dependencias.

"Valores", en este contexto, pueden ser cualquier valor de JavaScript, incluyendo objetos y funciones. Los tipos comunes de dependencias inyectadas incluyen:

- **Valores de configuración**: Constantes específicas del entorno, URLs de API, flags de características, etc.
- **Fábricas**: Funciones que crean objetos o valores basados en condiciones de tiempo de ejecución
- **Servicios**: Clases que proporcionan funcionalidad común, lógica de negocio o estado

Los componentes y directivas de Angular participan automáticamente en DI, lo que significa que pueden inyectar dependencias _y_ están disponibles para ser inyectados.

## ¿Qué son los servicios?

Un _servicio_ de Angular es una clase TypeScript decorada con `@Injectable`, que hace que una instancia de la clase esté disponible para ser inyectada como dependencia. Los servicios son la forma más común de compartir datos y funcionalidad a través de una aplicación.

Los tipos comunes de servicios incluyen:

- **Clientes de datos:** Abstrae los detalles de hacer solicitudes a un servidor para recuperación y mutación de datos
- **Gestión de estado:** Define estado compartido a través de múltiples componentes o páginas
- **Autenticación y autorización:** Gestiona la autenticación de usuarios, almacenamiento de tokens y control de acceso
- **Registro y manejo de errores:** Establece una API común para registrar o comunicar estados de error al usuario
- **Manejo y envío de eventos:** Maneja eventos o notificaciones que no están asociados con un componente específico, o para enviar eventos y notificaciones a componentes, siguiendo el [patrón observador](https://es.wikipedia.org/wiki/Observador_(patr%C3%B3n_de_dise%C3%B1o))
- **Funciones de utilidad:** Ofrece funciones de utilidad reutilizables como formateo de datos, validación o cálculos

El siguiente ejemplo declara un servicio llamado `AnalyticsLogger`:

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString()
    })
  }
}
```

NOTA: La opción `providedIn: 'root'` hace que este servicio esté disponible en toda tu aplicación como un singleton. Este es el enfoque recomendado para la mayoría de los servicios.

## Inyectando dependencias con `inject()`

Puedes inyectar dependencias usando la función `inject()` de Angular.

Aquí hay un ejemplo de una barra de navegación que inyecta `AnalyticsLogger` y el servicio `Router` de Angular para permitir a los usuarios navegar a una página diferente mientras rastrea el evento.

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsLogger } from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `
    <a href="#" (click)="navigateToDetail($event)">Detail Page</a>
  `,
})
export class NavbarComponent {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### ¿Dónde se puede usar `inject()`?

Puedes inyectar dependencias durante la construcción de un componente, directiva o servicio. La llamada a `inject` puede aparecer en el `constructor` o en un inicializador de campo. Aquí hay algunos ejemplos comunes:

```ts
@Component({...})
export class MyComponent {
  // ✅ En inicializador de campo de clase
  private service = inject(MyService);

  // ✅ En cuerpo del constructor
  private anotherService: MyService;

  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

```ts
@Directive({...})
export class MyDirective {
  // ✅ En inicializador de campo de clase
  private element = inject(ElementRef);
}
```

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MyService {
  // ✅ En un servicio
  private http = inject(HttpClient);
}
```

```ts
export const authGuard = () => {
  // ✅ En un guard de ruta
  const auth = inject(AuthService);
  return auth.isAuthenticated();
}
```

Angular usa el término "contexto de inyección" para describir cualquier lugar en tu código donde puedes llamar a `inject`. Aunque la construcción de componentes, directivas y servicios es la más común, consulta [contextos de inyección](/guide/di/dependency-injection-context) para más detalles.

Para más información, consulta la [documentación de la API inject](api/core/inject#usage-notes).

## Próximos pasos

Ahora que entiendes los fundamentos de la inyección de dependencias en Angular, estás listo para aprender cómo crear tus propios servicios.

La siguiente guía, [Creando y usando servicios](guide/di/creating-and-using-services), te mostrará:

- Cómo crear un servicio con Angular CLI o manualmente
- Cómo funciona el patrón `providedIn: 'root'`
- Cómo inyectar servicios en componentes y otros servicios

Esto cubre el caso de uso más común para servicios en aplicaciones Angular.
