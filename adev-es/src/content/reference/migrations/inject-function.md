# Migración a la función `inject`

La función `inject` de Angular ofrece tipos más precisos y mejor compatibilidad con los decoradores estándar, en comparación con la inyección basada en constructor.

Este schematic convierte la inyección basada en constructor en tus clases para usar la función `inject` en su lugar.

Ejecuta el schematic usando el siguiente comando:

```shell
ng generate @angular/core:inject
```

#### Antes

```typescript
import { Component, Inject, Optional } from '@angular/core';
import { MyService } from './service';
import { DI_TOKEN } from './token';

@Component()
export class MyComp {
  constructor(
    private service: MyService,
    @Inject(DI_TOKEN) @Optional() readonly token: string
  ) {}
}
```

#### Después

```typescript
import { Component, inject } from '@angular/core';
import { MyService } from './service';
import { DI_TOKEN } from './token';

@Component()
export class MyComp {
  private service = inject(MyService);
  readonly token = inject(DI_TOKEN, { optional: true });
}
```

## Opciones de migración

La migración incluye varias opciones para personalizar su salida.

### `path`

Determina qué sub-ruta de tu proyecto debe migrarse. Pasa `.` o déjalo en blanco para
migrar todo el directorio.

### `migrateAbstractClasses`

Angular no valida que los parámetros de las clases abstractas sean inyectables. Esto significa que la
migración no puede migrarlos de forma confiable a `inject` sin arriesgarse a errores, razón por la que están
deshabilitados por defecto. Habilita esta opción si quieres que las clases abstractas sean migradas, pero ten en cuenta
que es posible que tengas que **corregir algunos errores manualmente**.

### `backwardsCompatibleConstructors`

Por defecto, la migración intenta limpiar el código tanto como sea posible, lo que incluye eliminar
parámetros del constructor, o incluso el constructor completo si no incluye ningún código.
En algunos casos esto puede provocar errores de compilación cuando clases con decoradores de Angular heredan de
otras clases con decoradores de Angular. Si habilitas esta opción, la migración generará una
firma de constructor adicional para mantener la compatibilidad con versiones anteriores, a expensas de más código.

#### Antes

```typescript
import { Component } from '@angular/core';
import { MyService } from './service';

@Component()
export class MyComp {
  constructor(private service: MyService) {}
}
```

#### Después

```typescript
import { Component } from '@angular/core';
import { MyService } from './service';

@Component()
export class MyComp {
private service = inject(MyService);

/\*_ Insertado por la migración inject() de Angular para compatibilidad con versiones anteriores _/
constructor(...args: unknown[]);

constructor() {}
}
```

### `nonNullableOptional`

Si la inyección falla para un parámetro con el decorador `@Optional()`, Angular devuelve `null`, lo que
significa que el tipo real de cualquier parámetro `@Optional()` será `| null`. Sin embargo, debido a que los decoradores
no pueden influir en sus tipos, hay mucho código existente cuyo tipo es incorrecto. El tipo se
corrige en `inject()`, lo que puede provocar que aparezcan nuevos errores de compilación. Si habilitas esta opción,
la migración producirá una aserción non-null después de la llamada a `inject()` para coincidir con el tipo anterior,
a expensas de potencialmente ocultar errores de tipo.

**NOTA:** las aserciones non-null no se agregarán a parámetros que ya estén tipados como anulables,
porque el código que depende de ellos probablemente ya tiene en cuenta su anulabilidad.

#### Antes

```typescript
import { Component, Inject, Optional } from '@angular/core';
import { TOKEN_ONE, TOKEN_TWO } from './token';

@Component()
export class MyComp {
  constructor(
    @Inject(TOKEN_ONE) @Optional() private tokenOne: number,
    @Inject(TOKEN_TWO) @Optional() private tokenTwo: string | null
  ) {}
}
```

#### Después

```typescript
import { Component, inject } from '@angular/core';
import { TOKEN_ONE, TOKEN_TWO } from './token';

@Component()
export class MyComp {
  // Nota el `!` al final.
  private tokenOne = inject(TOKEN_ONE, { optional: true })!;

  // No tiene `!` al final, porque el tipo ya era anulable.
  private tokenTwo = inject(TOKEN_TWO, { optional: true });
}
```
