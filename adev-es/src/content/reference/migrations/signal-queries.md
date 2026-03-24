# Migración a signal queries

Angular introdujo APIs mejoradas para consultas que se consideran
listas para producción desde v19.
Lee más sobre los signal queries y sus beneficios en la [guía dedicada](guide/signals/queries).

Para apoyar a los equipos existentes que deseen usar signal queries, el equipo de Angular
proporciona una migración automatizada que convierte los campos de consulta de decoradores existentes a la nueva API.

Ejecuta el schematic usando el siguiente comando:

```bash
ng generate @angular/core:signal-queries-migration
```

Alternativamente, la migración está disponible como una [acción de refactorización de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) en VSCode.
Instala la última versión de la extensión de VSCode y haz clic en, por ejemplo, un campo `@ViewChild`.
Consulta más detalles en la sección [a continuación](#extensión-de-vscode).

## ¿Qué cambia la migración?

1. Los miembros de clase `@ViewChild()`, `@ViewChildren`, `@ContentChild` y `@ContentChildren`
   se actualizan a sus equivalentes con signals.
2. Las referencias en tu aplicación a las consultas migradas se actualizan para llamar al signal.
   - Esto incluye referencias en plantillas, host bindings o código TypeScript.

**Antes**

```typescript
import {Component, ContentChild} from '@angular/core';

@Component({
  template: `Has ref: {{someRef ? 'Yes' : 'No'}}`
})
export class MyComponent {
  @ContentChild('someRef') ref: ElementRef|undefined = undefined;

  someMethod(): void {
    if (this.ref) {
      this.ref.nativeElement;
    }
  }
}
```

**Después**

```typescript
import {Component, contentChild} from '@angular/core';

@Component({
  template: `Has ref: {{someRef() ? 'Yes' : 'No'}}`
})
export class MyComponent {
  readonly ref = contentChild<ElementRef>('someRef');

  someMethod(): void {
    const ref = this.ref();
    if (ref) {
      ref.nativeElement;
    }
  }
}
```

## Opciones de configuración

La migración admite algunas opciones para ajustar la migración a tus necesidades específicas.

### `--path`

Por defecto, la migración actualizará todo tu espacio de trabajo de Angular CLI.
Puedes limitar la migración a un subdirectorio específico usando esta opción.

### `--best-effort-mode`

Por defecto, la migración omite las consultas que no se pueden migrar de forma segura.
La migración intenta refactorizar el código de la forma más segura posible.

Cuando la bandera `--best-effort-mode` está habilitada, la migración intenta de forma agresiva
migrar tanto como sea posible, incluso si pudiera romper tu compilación.

### `--insert-todos`

Cuando está habilitado, la migración agregará TODOs a las consultas que no pudieron migrarse.
Los TODOs incluirán el razonamiento de por qué se omitieron las consultas. Por ejemplo:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the query. This prevents migration.
@ViewChild('ref') ref?: ElementRef;
```

### `--analysis-dir`

En proyectos grandes puedes usar esta opción para reducir la cantidad de archivos que se analizan.
Por defecto, la migración analiza todo el espacio de trabajo, independientemente de la opción `--path`, para
actualizar todas las referencias afectadas por la migración de una declaración de consulta.

Con esta opción, puedes limitar el análisis a una subcarpeta. Ten en cuenta que esto significa que cualquier
referencia fuera de este directorio se omite silenciosamente, lo que podría romper tu compilación.

## Extensión de VSCode

![Captura de pantalla de la extensión de VSCode haciendo clic en un campo `@ViewChild`](assets/images/migrations/signal-queries-vscode.png 'Captura de pantalla de la extensión de VSCode haciendo clic en un campo `@ViewChild`.')

La migración está disponible como una [acción de refactorización de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) en VSCode.

Para usar la migración a través de VSCode, instala la última versión de la extensión de VSCode y haz clic en:

- un campo `@ViewChild`, `@ViewChildren`, `@ContentChild` o `@ContentChildren`.
- o, en una directiva/componente

Luego, espera a que aparezca el botón de refactorización amarillo (lightbulb) de VSCode.
A través de este botón puedes seleccionar la migración de signal queries.
