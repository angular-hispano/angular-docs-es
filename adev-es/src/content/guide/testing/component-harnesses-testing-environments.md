# Agregar soporte de harness para entornos de pruebas adicionales

## Antes de comenzar

CONSEJO: Esta guía asume que ya leíste la [guía de visión general de component harnesses](guide/testing/component-harnesses-overview). Lee eso primero si eres nuevo en el uso de component harnesses.

### ¿Cuándo tiene sentido agregar soporte para un entorno de prueba?

Para usar component harnesses en los siguientes entornos, puedes usar los dos entornos integrados del CDK de Angular:

- Pruebas unitarias
- Pruebas end-to-end de WebDriver

Para usar un entorno de pruebas soportado, lee la [guía de Crear harnesses para tus componentes](guide/testing/creating-component-harnesses).

De lo contrario, para agregar soporte para otros entornos, necesitas definir cómo interactuar con un elemento DOM y cómo funcionan las interacciones DOM en tu entorno. Continúa leyendo para aprender más.

### Instalación del CDK

El [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) es un conjunto de primitivas de comportamiento para construir componentes. Para usar los component harnesses, primero instala `@angular/cdk` desde npm. Puedes hacer esto desde tu terminal usando Angular CLI:

```shell
ng add @angular/cdk
```

## Crear una implementación de `TestElement`

Cada entorno de prueba debe definir una implementación de `TestElement`. La interfaz `TestElement` sirve como una representación independiente del entorno de un elemento DOM. Permite a los harnesses interactuar con elementos DOM independientemente del entorno subyacente. Porque algunos entornos no soportan interactuar con elementos DOM de forma síncrona (p. ej., WebDriver), todos los métodos `TestElement` son asíncronos, retornando una `Promise` con el resultado de la operación.

`TestElement` ofrece una cantidad de métodos para interactuar con el DOM subyacente como `blur()`, `click()`, `getAttribute()` y más. Consulta la [página de referencia de la API de TestElement](/api/cdk/testing/TestElement) para la lista completa de métodos.

La interfaz `TestElement` consiste en gran medida de métodos que se asemejan a los métodos disponibles en `HTMLElement`. Métodos similares existen en la mayoría de los entornos de prueba, lo que hace que implementar los métodos sea bastante directo. Sin embargo, una diferencia importante a notar al implementar el método `sendKeys`, es que los códigos de tecla en el enum `TestKey` probablemente difieran de los códigos de tecla usados en el entorno de prueba. Los autores de entornos deberían mantener un mapeo de códigos `TestKey` a los códigos usados en el entorno de pruebas particular.

Las implementaciones [UnitTestElement](/api/cdk/testing/testbed/UnitTestElement) y [SeleniumWebDriverElement](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverElement) en el CDK de Angular sirven como buenos ejemplos de implementaciones de esta interfaz.

## Crear una implementación de `HarnessEnvironment`

Los autores de pruebas usan `HarnessEnvironment` para crear instancias de component harness para usar en pruebas. `HarnessEnvironment` es una clase abstracta que debe extenderse para crear una subclase concreta para el nuevo entorno. Al soportar un nuevo entorno de prueba, crea una subclase `HarnessEnvironment` que agregue implementaciones concretas para todos los miembros abstractos.

`HarnessEnvironment` tiene un parámetro de tipo genérico: `HarnessEnvironment<E>`. Este parámetro, `E`, representa el tipo de elemento raw del entorno. Por ejemplo, este parámetro es Element para entornos de prueba unitaria.

Los siguientes son los métodos abstractos que deben implementarse:

| Método                                                       | Descripción                                                                                                                                                          |
| :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstract getDocumentRoot(): E`                              | Obtiene el elemento raíz para el entorno (p. ej., `document.body`).                                                                                                    |
| `abstract createTestElement(element: E): TestElement`        | Crea un `TestElement` para el elemento raw dado.                                                                                                                   |
| `abstract createEnvironment(element: E): HarnessEnvironment` | Crea un `HarnessEnvironment` enraizado en el elemento raw dado.                                                                                                      |
| `abstract getAllRawElements(selector: string): Promise<E[]>` | Obtiene todos los elementos raw bajo el elemento raíz del entorno que coinciden con el selector dado.                                                                  |
| `abstract forceStabilize(): Promise<void>`                   | Obtiene una `Promise` que se resuelve cuando el `NgZone` es estable. Además, si es aplicable, le dice a `NgZone` que se estabilice (p. ej., llamando `flush()` en una prueba `fakeAsync`). |
| `abstract waitForTasksOutsideAngular(): Promise<void>`       | Obtiene una `Promise` que se resuelve cuando la zona padre de `NgZone` es estable.                                                                                           |

Además de implementar los métodos faltantes, esta clase debería proporcionar una forma para que los autores de pruebas obtengan instancias de `ComponentHarness`. Deberías definir un constructor protegido y proporcionar un método estático llamado `loader` que retorne una instancia de `HarnessLoader`. Esto permite a los autores de pruebas escribir código como: `SomeHarnessEnvironment.loader().getHarness(...)`. Dependiendo de las necesidades del entorno particular, la clase puede proporcionar varios métodos estáticos diferentes o requerir que se pasen argumentos. (p. ej., el método `loader` en `TestbedHarnessEnvironment` toma un `ComponentFixture`, y la clase proporciona métodos estáticos adicionales llamados `documentRootLoader` y `harnessForFixture`).

Las implementaciones [`TestbedHarnessEnvironment`](/api/cdk/testing/testbed/TestbedHarnessEnvironment) y [SeleniumWebDriverHarnessEnvironment](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverHarnessEnvironment) en el CDK de Angular sirven como buenos ejemplos de implementaciones de esta interfaz.

## Manejar la detección automática de cambios

Para soportar las APIs `manualChangeDetection` y parallel, tu entorno debería instalar un manejador para el estado de detección automática de cambios.

Cuando tu entorno quiera comenzar a manejar el estado de detección automática de cambios puede llamar a `handleAutoChangeDetectionStatus(handler)`. La función handler recibirá un `AutoChangeDetectionStatus` que tiene dos propiedades `isDisabled` y `onDetectChangesNow()`. Consulta la [página de referencia de la API de AutoChangeDetectionStatus](/api/cdk/testing/AutoChangeDetectionStatus) para más información.
Si tu entorno quiere dejar de manejar el estado de detección automática de cambios puede llamar a `stopHandlingAutoChangeDetectionStatus()`.
