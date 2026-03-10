# Migración a signal inputs

Angular introdujo una API mejorada para entradas (inputs) que se considera
lista para producción desde v19.
Lee más sobre los signal inputs y sus beneficios en la [guía dedicada](guide/signals/inputs).

Para apoyar a los equipos existentes que deseen usar signal inputs, el equipo de Angular
proporciona una migración automatizada que convierte los campos `@Input` a la nueva API `input()`.

Ejecuta el schematic usando el siguiente comando:

```bash
ng generate @angular/core:signal-input-migration
```

Alternativamente, la migración está disponible como una [acción de refactorización de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) en VSCode.
Instala la última versión de la extensión de VSCode y haz clic en un campo `@Input`.
Consulta más detalles en la sección [a continuación](#extensión-de-vscode).

## ¿Qué cambia la migración?

1. Los miembros de clase `@Input()` se actualizan a su equivalente signal `input()`.
2. Las referencias a las entradas migradas se actualizan para llamar al signal.
   - Esto incluye referencias en plantillas, host bindings o código TypeScript.

**Antes**

```typescript
import {Component, Input} from '@angular/core';

@Component({
  template: `Name: {{name ?? ''}}`
})
export class MyComponent {
  @Input() name: string|undefined = undefined;

  someMethod(): number {
    if (this.name) {
      return this.name.length;
    }
    return -1;
  }
}
```

**Después**

<docs-code language="angular-ts" highlight="[[4],[7], [10,12]]">
import {Component, input} from '@angular/core';

@Component({
template: `Name: {{name() ?? ''}}`
})
export class MyComponent {
readonly name = input<string>();

someMethod(): number {
const name = this.name();
if (name) {
return name.length;
}
return -1;
}
}
</docs-code>

## Opciones de configuración

La migración admite algunas opciones para ajustar la migración a tus necesidades específicas.

### `--path`

Por defecto, la migración actualizará todo tu espacio de trabajo de Angular CLI.
Puedes limitar la migración a un subdirectorio específico usando esta opción.

### `--best-effort-mode`

Por defecto, la migración omite entradas que no se pueden migrar de forma segura.
La migración intenta refactorizar el código de la forma más segura posible.

Cuando la bandera `--best-effort-mode` está habilitada, la migración intenta de forma agresiva
migrar tanto como sea posible, incluso si pudiera romper tu compilación.

### `--insert-todos`

Cuando está habilitado, la migración agregará TODOs a las entradas que no pudieron migrarse.
Los TODOs incluirán el razonamiento de por qué se omitieron las entradas. Por ejemplo:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the input. This prevents migration.
@Input() myInput = false;
```

### `--analysis-dir`

En proyectos grandes puedes usar esta opción para reducir la cantidad de archivos que se analizan.
Por defecto, la migración analiza todo el espacio de trabajo, independientemente de la opción `--path`, para
actualizar todas las referencias afectadas por una migración de `@Input()`.

Con esta opción, puedes limitar el análisis a una subcarpeta. Ten en cuenta que esto significa que cualquier
referencia fuera de este directorio se omite silenciosamente, lo que podría romper tu compilación.

## Extensión de VSCode

![Captura de pantalla de la extensión de VSCode haciendo clic en un campo `@Input`](assets/images/migrations/signal-inputs-vscode.png 'Captura de pantalla de la extensión de VSCode haciendo clic en un campo `@Input`.')

La migración está disponible como una [acción de refactorización de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) en VSCode.

Para usar la migración a través de VSCode, instala la última versión de la extensión de VSCode y haz clic en:

- un campo `@Input`.
- o, en una directiva/componente

Luego, espera a que aparezca el botón de refactorización amarillo (lightbulb) de VSCode.
A través de este botón puedes seleccionar la migración de signal input.
