# Creando y usando servicios

Los servicios son piezas de código reutilizables que pueden compartirse a través de tu aplicación Angular. Típicamente manejan la obtención de datos, lógica de negocio u otra funcionalidad que múltiples componentes necesitan acceder.

## Creando un servicio

Puedes crear un servicio con el [Angular CLI](tools/cli) con el siguiente comando:

```bash
ng generate service CUSTOM_NAME
```

Esto crea un archivo dedicado `CUSTOM_NAME.ts` en tu directorio `src`.

También puedes crear manualmente un servicio añadiendo el decorador `@Injectable()` a una clase TypeScript. Esto le indica a Angular que el servicio puede ser inyectado como una dependencia.

Aquí hay un ejemplo de un servicio que permite a los usuarios agregar y solicitar datos:

```ts
// 📄 src/app/basic-data-store.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasicDataStore {
  private data: string[] = []

  addData(item: string): void {
   this.data.push(item)
  }

  getData(): string[] {
    return [...this.data]
  }
}
```

## Cómo los servicios se vuelven disponibles

Cuando usas `@Injectable({ providedIn: 'root' })` en tu servicio, Angular:

- **Crea una única instancia** (singleton) para toda tu aplicación
- **Lo hace disponible en todas partes** sin ninguna configuración adicional
- **Habilita tree-shaking** para que el servicio solo se incluya en tu bundle de JavaScript si realmente se usa

Este es el enfoque recomendado para la mayoría de los servicios.

## Inyectando un servicio

Una vez que has creado un servicio con `providedIn: 'root'`, puedes inyectarlo en cualquier parte de tu aplicación usando la función `inject()` de `@angular/core`.

### Inyectando en un componente

```angular-ts
import { Component, inject } from '@angular/core';
import { BasicDataStore } from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">
        Add more data
      </button>
    </div>
  `
})
export class ExampleComponent {
  dataStore = inject(BasicDataStore);
}
```

### Inyectando en otro servicio

```ts
import { inject, Injectable } from '@angular/core';
import { AdvancedDataStore } from './advanced-data-store';

@Injectable({
  providedIn: 'root',
})
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

## Próximos pasos

Aunque `providedIn: 'root'` cubre la mayoría de los casos de uso, Angular ofrece formas adicionales de proveer servicios para escenarios especializados:

- **Instancias específicas de componente** - Cuando los componentes necesitan sus propias instancias aisladas de servicio
- **Configuración manual** - Para servicios que requieren configuración en tiempo de ejecución
- **Proveedores factory** - Para creación dinámica de servicios basada en condiciones de tiempo de ejecución
- **Proveedores de valor** - Para proveer objetos de configuración o constantes

Puedes aprender más sobre estos patrones avanzados en la siguiente guía: [definiendo proveedores de dependencias](/guide/di/defining-dependency-providers).
