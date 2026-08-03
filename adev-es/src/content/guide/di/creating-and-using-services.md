# Creando y usando servicios

Los servicios son piezas de código reutilizables que puedes compartir a través de tu aplicación Angular. Comúnmente se usan para manejar la obtención de datos, lógica de negocio u otra funcionalidad que múltiples componentes necesitan acceder.

## Creando un servicio {#creating-a-service}

Puedes crear un servicio usando el [Angular CLI](tools/cli) con el siguiente comando:

```bash
ng generate service CUSTOM_NAME
```

Este comando crea un archivo dedicado `CUSTOM_NAME.ts` en tu directorio `src`.

También puedes crear manualmente un servicio añadiendo el decorador `@Service()` a una clase TypeScript. Esto le indica a Angular que puedes usar esa clase como una dependencia inyectable.

El siguiente ejemplo define un servicio que permite a los usuarios agregar y recuperar datos:

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

## Cómo los servicios se vuelven disponibles {#how-services-become-available}

Los servicios se proveen en el nivel raíz por defecto. Cuando un servicio se provee globalmente, Angular garantiza tres beneficios principales:

- **Instancia Singleton:** Crea una única instancia compartida para toda la aplicación.
- **Disponibilidad Global:** Accesible automáticamente en cualquier parte sin registro manual de proveedores.
- **Tree-shakability:** Garantiza que el servicio se excluya del bundle de producción final si tu código nunca lo usa explícitamente.

### Usando el decorador `@Service` vs `@Injectable` {#using-the-service-vs-injectable-decorator}

El decorador `@Service` sirve como una forma moderna y ergonómica del tradicional `@Injectable({ providedIn: 'root' })`.

Usa esta referencia rápida para decidir qué decorador se adapta a tu escenario:

| Característica / Requisito                          | `@Service` | `@Injectable`                           |
| --------------------------------------------------- | ---------- | --------------------------------------- |
| **Soporte para la función `inject()`**              | Sí         | Sí                                      |
| **DI basada en constructor**                        | ❌ No      | Sí                                      |
| **Proveedor singleton raíz implícito**              | Sí         | ❌ No (requiere `{providedIn: 'root'}`) |
| **Claves de proveedor avanzadas (`useClass`, etc.)** | ❌ No     | Sí                                      |
| **Factories de inicialización personalizadas**      | Sí         | Sí                                      |
| **Scopes no raíz (`platform`, etc.)**               | ❌ No      | Sí                                      |

### Reemplazar la implementación con una factory {#replacing-the-implementation-with-a-factory}

Si necesitas controlar cómo se crea el singleton, por ejemplo, para intercambiar una implementación diferente según el entorno, pasa una función `factory`.

La factory se ejecuta en un [contexto de inyección](guide/di/dependency-injection-context), por lo que puedes usar [`inject()`](api/core/inject) dentro de ella para leer otras dependencias.

El siguiente servicio `Analytics` es un no-op localmente para que los eventos no contaminen la consola durante el desarrollo. En producción, la factory lee un token `ANALYTICS_ENABLED` y retorna una subclase `GoogleAnalytics` que reenvía eventos al rastreador real:

```ts {header: "src/app/analytics.ts"}
import {inject, InjectionToken, Service} from '@angular/core';
import {ANALYTICS_ENABLED} from './token';

@Service({
  factory: () => (inject(ANALYTICS_ENABLED) ? new GoogleAnalytics() : new Analytics()),
})
export class Analytics {
  track(event: string, payload?: Record<string, unknown>) {
    // No-op por defecto.
  }
}

class GoogleAnalytics extends Analytics {
  override track(event: string, payload?: Record<string, unknown>) {
    // Envía un evento de analytics a Google Analytics
  }
}
```

NOTA: La opción `factory` reemplaza las opciones `useClass`, `useValue`, `useExisting` y `useFactory` de `@Injectable`. Si necesitas alguna de ellas, continúa usando `@Injectable`.

### Deshabilitar el provisionamiento automático {#opting-out-of-automatic-provisioning}

Por defecto, `@Service` provee la clase en el inyector raíz. Si deseas proveerla manualmente, por ejemplo, para limitarla a una ruta o componente específico, establece `autoProvided: false`:

```ts {header: "src/app/analytics-logger.ts"}
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

Eres entonces responsable de agregar el servicio a un array `providers`, igual que con un `@Injectable()` normal.

### Cuándo usar `@Service` vs `@Injectable` {#when-to-use-service-vs-injectable}

Usa `@Service` cuando estés creando una nueva clase singleton que usa `inject()` para sus dependencias. Continúa usando `@Injectable` cuando necesites cualquiera de lo siguiente:

- **Inyección de dependencias basada en constructor.** `@Service` solo soporta la función [`inject()`](api/core/inject).
- **Configuración avanzada de proveedores** como `useClass`, `useValue`, `useExisting` o `useFactory`. `@Service` expone una única opción `factory` en su lugar.
- **Scopes no raíz** como `providedIn: 'platform'`.

## Inyectando un servicio {#injecting-a-service}

Una vez que has creado un servicio, puedes inyectarlo en cualquier parte de tu aplicación usando la función `inject()` de `@angular/core`.

### Inyectando en un componente {#injecting-into-a-component}

```angular-ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### Inyectando en otro servicio {#injecting-into-another-service}

```ts
import {inject, Service} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Service()
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## Próximos pasos {#next-steps}

Aunque `providedIn: 'root'` cubre la mayoría de los casos de uso, Angular también proporciona formas adicionales de configurar servicios para escenarios más especializados:

- **Instancias específicas de componente** - Cuando los componentes necesitan sus propias instancias aisladas de servicio
- **Configuración manual** - Para servicios que requieren configuración en tiempo de ejecución
- **Proveedores factory** - Para creación dinámica de servicios basada en condiciones de tiempo de ejecución
- **Proveedores de valor** - Para proveer objetos de configuración o constantes

Puedes aprender más sobre estos patrones avanzados en la siguiente guía: [definiendo proveedores de dependencias](/guide/di/defining-dependency-providers).
