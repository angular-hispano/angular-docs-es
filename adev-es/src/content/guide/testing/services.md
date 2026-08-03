# Probar servicios

Los servicios típicamente contienen la lógica de negocio de tu aplicación en la que dependen los componentes. Probar servicios verifica que la lógica funcione correctamente en aislamiento, independiente de cualquier componente o plantilla.

Esta guía usa [Vitest](https://vitest.dev/), que los proyectos de Angular CLI incluyen por defecto. Para más información sobre la configuración de pruebas, consulta la [guía de resumen de pruebas](guide/testing#set-up-for-testing).

## Probando un servicio {#testing-a-service}

Considera un servicio `Calculator` que realiza aritmética básica:

```ts { header: 'calculator.ts' }
import {Service} from '@angular/core';

@Service()
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

Para probar este servicio, configura un `TestBed`, que es la utilidad de pruebas de Angular para crear un entorno de pruebas aislado para cada prueba. Establece la inyección de dependencias y te permite recuperar instancias de servicio — simulando cómo Angular conecta las cosas en una aplicación real.

```ts { header: 'calculator.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';
import {Calculator} from './calculator';

describe('Calculator', () => {
  let service: Calculator;

  beforeEach(() => {
    // Inyecta el servicio Calculator que está disponible para Angular
    // porque el servicio usa `providedIn: 'root'`
    service = TestBed.inject(Calculator);
  });

  it('suma dos números', () => {
    expect(service.add(1, 2)).toBe(3);
  });

  it('resta dos números', () => {
    expect(service.subtract(5, 3)).toBe(2);
  });
});
```

En el ejemplo anterior, el bloque `beforeEach` inyecta una nueva instancia del servicio antes de cada prueba. Esto garantiza que cada prueba se ejecute en aislamiento sin estado filtrado de pruebas anteriores.

## Probando servicios con dependencias {#testing-services-with-dependencies}

La mayoría de los servicios dependen de otros servicios para funcionar correctamente. Por defecto, `TestBed` proporciona las implementaciones reales de estas dependencias, lo que significa que tus pruebas ejercen los caminos de código reales que usa tu aplicación. Sin embargo, a veces una dependencia puede ser compleja, lenta o impredecible. En esos casos, puedes sustituirla con un reemplazo controlado.

Considera un servicio `OrderTotal` que depende de un `TaxCalculator` para calcular el precio final de un pedido:

```ts { header: 'tax-calculator.ts' }
import {Service} from '@angular/core';

@Service()
export class TaxCalculator {
  calculate(subtotal: number): number {
    return subtotal * 0.05;
  }
}
```

```ts { header: 'order-total.ts' }
import {inject, Service} from '@angular/core';
import {TaxCalculator} from './tax-calculator';

@Service()
export class OrderTotal {
  private taxCalculator = inject(TaxCalculator);

  total(subtotal: number): number {
    return subtotal + this.taxCalculator.calculate(subtotal);
  }
}
```

En este ejemplo, `OrderTotal` usa `inject()` para solicitar `TaxCalculator` al sistema de inyección de dependencias de Angular. Por defecto, `TestBed` proporciona el `TaxCalculator` real, que es perfecto para cálculos simples como este. Sin embargo, si `TaxCalculator` involucrara lógica compleja, solicitudes de red o resultados impredecibles, podrías querer sustituirlo con un reemplazo controlado.

### Reemplazar una dependencia con un stub {#replacing-a-dependency-with-a-stub}

Un stub es una forma de reemplazar una dependencia o método con uno que retorna valores predecibles, lo que puede hacer que los resultados de las pruebas sean más fáciles de verificar.

Para probar `OrderTotal` sin depender del `TaxCalculator` real, puedes proporcionar un stub en la configuración de `TestBed`.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

// El tipo de utilidad `Mocked` de Vitest garantiza que el stub sea type-safe,
// mientras que `vi.fn()` crea una función mock para cada método
const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    // `mockReturnValue` establece un valor de retorno controlado para el stub
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      // El array `providers` acepta un objeto proveedor donde `provide`
      // especifica la dependencia a reemplazar y `useValue` define el stub
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  it('agrega impuesto al subtotal', () => {
    expect(service.total(100)).toBe(105);
  });
});
```

Con este stub, cuando `OrderTotal` solicite `TaxCalculator`, el `TestBed` sabrá que debe usar el `taxCalculatorStub` en su lugar. Como el stub siempre retorna 5, la prueba verifica que `OrderTotal` agregue correctamente el valor del impuesto al subtotal independientemente de si la tasa de impuesto cambia en `TaxCalculator`.

### Verificando interacciones con spies {#verifying-interactions-with-spies}

Un stub controla lo que retorna una dependencia, pero a veces también necesitas verificar que un servicio llamó a su dependencia con los argumentos correctos. Esto se puede lograr con spies, que rastrean cómo se llama a una función. Con Vitest, esta funcionalidad está integrada en `vi.fn()` y te permite hacer afirmaciones sobre las interacciones entre servicios.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  afterEach(() => {
    taxCalculatorStub.calculate.mockClear();
  });

  it('agrega impuesto al subtotal', () => {
    expect(service.total(100)).toBe(105);
  });

  // Verificar la interacción con un spy
  it('llama al calculador de impuestos', () => {
    service.total(100);
    expect(taxCalculatorStub.calculate).toHaveBeenCalledExactlyOnceWith(100);
  });
});
```

La nueva prueba verifica que `OrderTotal` llamó a `TaxCalculator.calculate` al calcular el total. Esto es útil para verificar que la interacción entre servicios ocurrió correctamente.

## Probando servicios HTTP {#testing-http-services}

Muchos servicios usan el `HttpClient` de Angular para obtener datos de un servidor. Angular proporciona utilidades de prueba dedicadas para `HttpClient` que te permiten controlar las respuestas HTTP sin realizar solicitudes de red reales.

Para más detalles sobre probar servicios que usan `HttpClient`, consulta la [guía de pruebas HTTP](guide/http/testing).
