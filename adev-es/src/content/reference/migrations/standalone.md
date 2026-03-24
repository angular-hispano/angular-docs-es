# Migrar un proyecto Angular existente a standalone

Los **componentes standalone** ofrecen una forma simplificada de construir aplicaciones Angular. Los componentes, directivas y pipes standalone buscan simplificar la experiencia de desarrollo al reducir la necesidad de `NgModule`s. Las aplicaciones existentes pueden adoptar de forma opcional e incremental el nuevo estilo standalone sin ningún cambio disruptivo.

<docs-video src="https://www.youtube.com/embed/x5PZwb4XurU" title="Primeros pasos con componentes standalone"/>

Este schematic ayuda a transformar componentes, directivas y pipes en proyectos existentes para que sean standalone. El schematic intenta transformar la mayor cantidad de código posible de forma automática, pero puede requerir algunas correcciones manuales por parte del autor del proyecto.

Ejecuta el schematic usando el siguiente comando:

```shell
ng generate @angular/core:standalone
```

## Antes de actualizar

Antes de usar el schematic, asegúrate de que el proyecto:

1. Use Angular 15.2.0 o posterior.
2. Se compile sin errores de compilación.
3. Esté en una rama Git limpia y todo el trabajo esté guardado.

## Opciones del schematic

| Opción | Detalles                                                                                                                           |
| :----- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `mode` | La transformación a realizar. Consulta [Modos de migración](#modos-de-migración) a continuación para detalles sobre las opciones disponibles. |
| `path` | La ruta a migrar, relativa a la raíz del proyecto. Puedes usar esta opción para migrar secciones de tu proyecto de forma incremental. |

## Pasos de la migración

El proceso de migración se compone de tres pasos. Deberás ejecutarlo varias veces y verificar manualmente que el proyecto se compile y funcione como se espera.

NOTA: Aunque el schematic puede actualizar la mayor parte del código automáticamente, algunos casos extremos requieren intervención del desarrollador.
Debes planificar aplicar correcciones manuales después de cada paso de la migración. Además, el nuevo código generado por el schematic puede no coincidir con las reglas de formato de tu código.

Ejecuta la migración en el orden indicado a continuación, verificando que tu código se compile y ejecute entre cada paso:

1. Ejecuta `ng g @angular/core:standalone` y selecciona "Convert all components, directives and pipes to standalone"
2. Ejecuta `ng g @angular/core:standalone` y selecciona "Remove unnecessary NgModule classes"
3. Ejecuta `ng g @angular/core:standalone` y selecciona "Bootstrap the project using standalone APIs"
4. Ejecuta las verificaciones de linting y formato, corrige los fallos y confirma el resultado

## Después de la migración

¡Felicitaciones, tu aplicación ha sido convertida a standalone! Estos son algunos pasos opcionales de seguimiento que puedes realizar ahora:

- Encuentra y elimina las declaraciones `NgModule` restantes: dado que el paso ["Eliminar NgModules innecesarios"](#eliminar-ngmodules-innecesarios) no puede eliminar todos los módulos automáticamente, es posible que tengas que eliminar las declaraciones restantes manualmente.
- Ejecuta las pruebas unitarias del proyecto y corrige los fallos.
- Ejecuta los formateadores de código, si el proyecto usa formato automático.
- Ejecuta los linters en tu proyecto y corrige las nuevas advertencias. Algunos linters admiten una bandera `--fix` que puede resolver algunas advertencias automáticamente.

## Modos de migración

La migración tiene los siguientes modos:

1. Convertir declaraciones a standalone.
2. Eliminar NgModules innecesarios.
3. Cambiar a la API de bootstrap standalone.
   Debes ejecutar estas migraciones en el orden indicado.

### Convertir declaraciones a standalone

En este modo, la migración convierte todos los componentes, directivas y pipes a standalone eliminando `standalone: false` y agregando dependencias a su array `imports`.

ÚTIL: El schematic ignora los NgModules que hacen bootstrap de un componente durante este paso, ya que probablemente son módulos raíz usados por `bootstrapModule` en lugar del `bootstrapApplication` compatible con standalone. El schematic convierte estas declaraciones automáticamente como parte del paso ["Cambiar a la API de bootstrap standalone"](#cambiar-a-la-api-de-bootstrap-standalone).

**Antes:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule],
  declarations: [GreeterComponent],
  exports: [GreeterComponent]
})
export class SharedModule {}
```

```typescript
// greeter.component.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  standalone: false,
})
export class GreeterComponent {
  showGreeting = true;
}
```

**Después:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule, GreeterComponent],
  exports: [GreeterComponent]
})
export class SharedModule {}
```

```typescript
// greeter.component.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  imports: [NgIf]
})
export class GreeterComponent {
  showGreeting = true;
}
```

### Eliminar NgModules innecesarios

Después de convertir todas las declaraciones a standalone, muchos NgModules pueden eliminarse de forma segura. Este paso elimina dichas declaraciones de módulos y la mayor cantidad de referencias correspondientes posible. Si la migración no puede eliminar una referencia automáticamente, deja el siguiente comentario TODO para que puedas eliminar el NgModule manualmente:

```typescript
/* TODO(standalone-migration): clean up removed NgModule reference manually */
```

La migración considera que un módulo es seguro de eliminar si ese módulo:

- No tiene `declarations`.
- No tiene `providers`.
- No tiene componentes en `bootstrap`.
- No tiene `imports` que referencien un símbolo `ModuleWithProviders` o un módulo que no se pueda eliminar.
- No tiene miembros de clase. Los constructores vacíos se ignoran.

**Antes:**

```typescript
// importer.module.ts
@NgModule({
  imports: [FooComponent, BarPipe],
  exports: [FooComponent, BarPipe]
})
export class ImporterModule {}
```

**Después:**

```typescript
// importer.module.ts
// ¡No existe!
```

### Cambiar a la API de bootstrap standalone

Este paso convierte cualquier uso de `bootstrapModule` al nuevo `bootstrapApplication` basado en standalone. También elimina `standalone: false` del componente raíz y elimina el NgModule raíz. Si el módulo raíz tiene `providers` o `imports`, la migración intenta copiar la mayor parte posible de esta configuración en la nueva llamada de bootstrap.

**Antes:**

```typescript
// ./app/app.module.ts
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// ./app/app.component.ts
@Component({
  selector: 'app',
  template: 'hello',
  standalone: false,
})
export class AppComponent {}
```

```typescript
// ./main.ts
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
```

**Después:**

```typescript
// ./app/app.module.ts
// ¡No existe!
```

```typescript
// ./app/app.component.ts
@Component({
  selector: 'app',
  template: 'hello'
})
export class AppComponent {}
```

```typescript
// ./main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch(e => console.error(e));
```

## Problemas comunes

Algunos problemas comunes que pueden impedir que el schematic funcione correctamente incluyen:

- Errores de compilación - si el proyecto tiene errores de compilación, Angular no puede analizarlo ni migrarlo correctamente.
- Archivos no incluidos en un tsconfig - el schematic determina qué archivos migrar analizando los archivos `tsconfig.json` de tu proyecto. El schematic excluye cualquier archivo no capturado por un tsconfig.
- Código que no puede analizarse estáticamente - el schematic usa análisis estático para entender tu código y determinar dónde hacer cambios. La migración puede omitir cualquier clase con metadatos que no puedan analizarse estáticamente en tiempo de compilación.

## Limitaciones

Debido al tamaño y la complejidad de la migración, hay algunos casos que el schematic no puede manejar:

- Debido a que las pruebas unitarias no se compilan ahead-of-time (AoT), los `imports` agregados a los componentes en las pruebas unitarias podrían no ser del todo correctos.
- El schematic se basa en llamadas directas a las APIs de Angular. El schematic no puede reconocer envoltorios personalizados alrededor de las APIs de Angular. Por ejemplo, si defines una función `customConfigureTestModule` personalizada que envuelve `TestBed.configureTestingModule`, los componentes que declara pueden no ser reconocidos.
