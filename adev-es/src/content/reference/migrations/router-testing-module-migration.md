# Migración de RouterTestingModule

Este schematic migra los usos de `RouterTestingModule` dentro de las pruebas a `RouterModule`.

Cuando una prueba importa `SpyLocation` de `@angular/common/testing` y usa la propiedad `urlChanges`, el schematic también agregará `provideLocationMocks()` para preservar el comportamiento original.

Ejecuta el schematic con:

```shell
ng generate @angular/core:router-testing-module-migration
```

## Opciones

| Opción | Detalles                                                                                                                                   |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `path` | La ruta (relativa a la raíz del proyecto) a migrar. Por defecto es `./`. Úsala para migrar de forma incremental un subconjunto de tu proyecto. |

## Ejemplos

### Preservar opciones del router

Antes:

```ts
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledBlocking' })]
    });
  });

});
```

Después:

```ts
import { RouterModule } from '@angular/router';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })]
    });
  });

});
```

### Agregar provideLocationMocks cuando se importa `SpyLocation` y se usa `urlChanges`

Antes:

```ts
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {
  let spy : SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined()
  })
});
```

Después:

```ts
import { RouterModule } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {
  let spy : SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideLocationMocks()]
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined()
  })
});
```
