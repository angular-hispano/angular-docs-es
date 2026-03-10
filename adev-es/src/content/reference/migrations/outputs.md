# Migración a la función output

Angular introdujo una API mejorada para salidas (outputs) en v17.3 que se considera
lista para producción desde v19. Esta API imita la API `input()` pero no está basada en Signals.
Lee más sobre la función output de eventos personalizados y sus beneficios en la [guía dedicada](guide/components/outputs).

Para apoyar a los proyectos existentes que deseen usar la función output, el equipo de Angular
proporciona una migración automatizada que convierte los eventos personalizados `@Output` a la nueva API `output()`.

Ejecuta el schematic usando el siguiente comando:

```bash
ng generate @angular/core:output-migration
```

## ¿Qué cambia la migración?

1. Los miembros de clase `@Output()` se actualizan a su equivalente `output()`.
2. Las importaciones en el archivo de componentes o directivas, a nivel de módulo TypeScript, también se actualizan.
3. Migra las funciones de las APIs como `event.next()`, cuyo uso no se recomienda, a `event.emit()` y elimina las llamadas a `event.complete()`.

**Antes**

```typescript
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`
})
export class MyComponent {
  @Output() someChange = new EventEmitter<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

**Después**

```typescript
import {Component, output} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`
})
export class MyComponent {
  readonly someChange = output<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

## Opciones de configuración

La migración admite algunas opciones para ajustar la migración a tus necesidades específicas.

### `--path`

Si no se especifica, la migración te pedirá una ruta y actualizará todo tu espacio de trabajo de Angular CLI.
Puedes limitar la migración a un subdirectorio específico usando esta opción.

### `--analysis-dir`

En proyectos grandes puedes usar esta opción para reducir la cantidad de archivos que se analizan.
Por defecto, la migración analiza todo el espacio de trabajo, independientemente de la opción `--path`, para
actualizar todas las referencias afectadas por una migración de `@Output()`.

Con esta opción, puedes limitar el análisis a una subcarpeta. Ten en cuenta que esto significa que cualquier
referencia fuera de este directorio se omite silenciosamente, lo que podría romper tu compilación.

Usa estas opciones como se muestra a continuación:

```bash
ng generate @angular/core:output-migration --path src/app/sub-folder
```

## Excepciones

En algunos casos, la migración no tocará el código.
Una de estas excepciones es el caso donde el evento se usa con el método `pipe()`.
El siguiente código no será migrado:

```typescript
export class MyDialogComponent {
  @Output() close = new EventEmitter<void>();
  doSome(): void {
    this.close.complete();
  }
  otherThing(): void {
    this.close.pipe();
  }
}
```
