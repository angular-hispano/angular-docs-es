# Usar component harnesses en pruebas

## Antes de comenzar

CONSEJO: Esta guía asume que ya leíste la [guía de visión general de component harnesses](guide/testing/component-harnesses-overview). Lee eso primero si eres nuevo en el uso de component harnesses.

### Instalación del CDK

El [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) es un conjunto de primitivas de comportamiento para construir componentes. Para usar los component harnesses, primero instala `@angular/cdk` desde npm. Puedes hacer esto desde tu terminal usando Angular CLI:

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

## Entornos de test harness y loaders

Puedes usar component test harnesses en diferentes entornos de prueba. El CDK de Angular soporta dos entornos integrados:

- Pruebas unitarias con el `TestBed` de Angular
- Pruebas end-to-end con [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver)

Cada entorno proporciona un <strong>harness loader</strong>. El loader crea las instancias de harness que usas a lo largo de tus pruebas. Consulta abajo para una guía más específica sobre entornos de testing soportados.

Los entornos de testing adicionales requieren bindings personalizados. Consulta la [guía de agregar soporte de harness para entornos de testing adicionales](guide/testing/component-harnesses-testing-environments) para más información.

### Usar el loader de `TestbedHarnessEnvironment` para pruebas unitarias

Para pruebas unitarias puedes crear un harness loader desde [TestbedHarnessEnvironment](/api/cdk/testing/TestbedHarnessEnvironment). Este entorno usa un [component fixture](api/core/testing/ComponentFixture) creado por el `TestBed` de Angular.

Para crear un harness loader enraizado en el elemento raíz del fixture, usa el método `loader()`:

<docs-code language="typescript">
const fixture = TestBed.createComponent(MyComponent);

// Crear un harness loader desde el fixture
const loader = TestbedHarnessEnvironment.loader(fixture);
...

// Usar el loader para obtener instancias de harness
const myComponentHarness = await loader.getHarness(MyComponent);
</docs-code>

Para crear un harness loader para harnesses para elementos que caen fuera del fixture, usa el método `documentRootLoader()`. Por ejemplo, código que muestra un elemento flotante o pop-up a menudo adjunta elementos DOM directamente al body del documento, como el servicio `Overlay` en el CDK de Angular.

También puedes crear un harness loader directamente con `harnessForFixture()` para un harness en el elemento raíz de ese fixture directamente.

### Usar el loader de `SeleniumWebDriverHarnessEnvironment` para pruebas end-to-end

Para pruebas end-to-end basadas en WebDriver puedes crear un harness loader con `SeleniumWebDriverHarnessEnvironment`.

Usa el método `loader()` para obtener la instancia de harness loader para el documento HTML actual, enraizado en el elemento raíz del documento. Este entorno usa un cliente WebDriver.

<docs-code language="typescript">
let wd: webdriver.WebDriver = getMyWebDriverClient();
const loader = SeleniumWebDriverHarnessEnvironment.loader(wd);
...
const myComponentHarness = await loader.getHarness(MyComponent);
</docs-code>

## Usar un harness loader

Las instancias de harness loader corresponden a un elemento DOM específico y se usan para crear instancias de component harness para elementos bajo ese elemento específico.

Para obtener `ComponentHarness` para la primera instancia del elemento, usa el método `getHarness()`. Para obtener todas las instancias de `ComponentHarness`, usa el método `getAllHarnesses()`.

<docs-code language="typescript">
// Obtener harness para la primera instancia del elemento
const myComponentHarness = await loader.getHarness(MyComponent);

// Obtener harnesses para todas las instancias del elemento
const myComponentHarnesses = await loader.getHarnesses(MyComponent);
</docs-code>

Además de `getHarness` y `getAllHarnesses`, `HarnessLoader` tiene varios otros métodos útiles para consultar harnesses:

- `getHarnessAtIndex(...)`: Obtiene el harness para un componente que coincide con el criterio dado en un índice específico.
- `countHarnesses(...)`: Cuenta el número de instancias de componente que coinciden con el criterio dado.
- `hasHarness(...)`: Verifica si al menos una instancia de componente coincide con el criterio dado.

Como ejemplo, considera un componente dialog-button reutilizable que abre un diálogo al hacer clic. Contiene los siguientes componentes, cada uno con un harness correspondiente:

- `MyDialogButton` (compone el `MyButton` y `MyDialog` con una API conveniente)
- `MyButton` (un componente button estándar)
- `MyDialog` (un diálogo adjuntado a `document.body` por `MyDialogButton` al hacer clic)

La siguiente prueba carga harnesses para cada uno de estos componentes:

<docs-code language="typescript">
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.createComponent(MyDialogButton);
  loader = TestbedHarnessEnvironment.loader(fixture);
  rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
  // Cargar un harness para el componente bootstrap con `harnessForFixture`
  dialogButtonHarness =
    await TestbedHarnessEnvironment.harnessForFixture(fixture, MyDialogButtonHarness);

  // El elemento button está dentro del elemento raíz del fixture, así que usamos `loader`.
  const buttonHarness = await loader.getHarness(MyButtonHarness);

  // Hacer clic en el botón para abrir el diálogo
  await buttonHarness.click();

  // El diálogo se adjunta a `document.body`, fuera del elemento raíz del fixture,
  // así que usamos `rootLoader` en este caso.
  const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

  // ... hacer algunas afirmaciones
});
</docs-code>

### Comportamiento de harness en diferentes entornos

Los harnesses pueden no comportarse exactamente igual en todos los entornos. Algunas diferencias son inevitables entre la interacción real del usuario versus los eventos simulados generados en pruebas unitarias. El CDK de Angular hace un mejor esfuerzo para normalizar el comportamiento en la medida posible.

### Interactuar con elementos hijos

Para interactuar con elementos debajo del elemento raíz de este harness loader, usa la instancia `HarnessLoader` de un elemento hijo. Para la primera instancia del elemento hijo, usa el método `getChildLoader()`. Para todas las instancias del elemento hijo, usa el método `getAllChildLoaders()`.

<docs-code language="typescript">
const myComponentHarness = await loader.getHarness(MyComponent);

// Obtener loader para la primera instancia del elemento hijo con selector '.child'
const childLoader = await myComponentHarness.getLoader('.child');

// Obtener loaders para todas las instancias de elementos hijos con selector '.child'
const allChildLoaders = await myComponentHarness.getAllChildLoaders('.child');
</docs-code>

### Filtrar harnesses

Cuando una página contiene múltiples instancias de un componente particular, es posible que quieras filtrar basado en alguna propiedad del componente para obtener una instancia de componente particular. Puedes usar un <strong>harness predicate</strong>, una clase usada para asociar una clase `ComponentHarness` con funciones predicates que pueden usarse para filtrar instancias de componentes, para hacerlo.

Cuando le pides a un `HarnessLoader` un harness, en realidad estás proporcionando una HarnessQuery. Una consulta puede ser una de dos cosas:

- Un constructor de harness. Esto solo obtiene ese harness
- Un `HarnessPredicate`, que obtiene harnesses que están filtrados basados en una o más condiciones

`HarnessPredicate` soporta algunos filtros base (selector, ancestor) que funcionan en cualquier cosa que extienda `ComponentHarness`.

<docs-code language="typescript">
// Ejemplo de cargar un MyButtonComponentHarness con un harness predicate
const disabledButtonPredicate = new HarnessPredicate(MyButtonComponentHarness, {selector: '[disabled]'});
const disabledButton = await loader.getHarness(disabledButtonPredicate);
</docs-code>

Sin embargo, es común que los harnesses implementen un método estático `with()` que acepta opciones de filtrado específicas del componente y retorna un `HarnessPredicate`.

<docs-code language="typescript">
// Ejemplo de cargar un MyButtonComponentHarness con un selector específico
const button = await loader.getHarness(MyButtonComponentHarness.with({selector: 'btn'}))
</docs-code>

Para más detalles consulta la documentación específica del harness ya que las opciones de filtrado adicionales son específicas de cada implementación de harness.

## Usar APIs de test harness

Aunque cada harness define una API específica para su componente correspondiente, todos comparten una clase base común, [ComponentHarness](/api/cdk/testing/ComponentHarness). Esta clase base define una propiedad estática, `hostSelector`, que coincide la clase harness con instancias del componente en el DOM.

Más allá de eso, la API de cualquier harness dado es específica de su componente correspondiente; consulta la documentación del componente para aprender cómo usar un harness específico.

Como ejemplo, lo siguiente es una prueba para un componente que usa el [harness del componente slider de Angular Material](https://material.angular.dev/components/slider/api#MatSliderHarness):

<docs-code language="typescript">
it('should get value of slider thumb', async () => {
  const slider = await loader.getHarness(MatSliderHarness);
  const thumb = await slider.getEndThumb();
  expect(await thumb.getValue()).toBe(50);
});
</docs-code>

## Interoperabilidad con la detección de cambios de Angular

Por defecto, los test harnesses ejecutan la [detección de cambios](https://angular.dev/best-practices/runtime-performance) de Angular antes de leer el estado de un elemento DOM y después de interactuar con un elemento DOM.

Puede haber momentos en que necesites un control más fino sobre la detección de cambios en tus pruebas, como verificar el estado de un componente mientras una operación async está pendiente. En estos casos usa la función `manualChangeDetection` para deshabilitar el manejo automático de detección de cambios para un bloque de código.

<docs-code language="typescript">
it('checks state while async action is in progress', async () => {
  const buttonHarness = loader.getHarness(MyButtonHarness);
  await manualChangeDetection(async () => {
    await buttonHarness.click();
    fixture.detectChanges();
    // Verificar expectativas mientras la operación de clic async está en progreso.
    expect(isProgressSpinnerVisible()).toBe(true);
    await fixture.whenStable();
    // Verificar expectativas después de que la operación de clic async se complete.
    expect(isProgressSpinnerVisible()).toBe(false);
  });
});
</docs-code>

Casi todos los métodos de harness son asíncronos y retornan una `Promise` para soportar lo siguiente:

- Soporte para pruebas unitarias
- Soporte para pruebas end-to-end
- Aislar pruebas contra cambios en comportamiento asíncrono

El equipo de Angular recomienda usar [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) para mejorar la legibilidad de la prueba. Llamar a `await` bloquea la ejecución de tu prueba hasta que la `Promise` asociada se resuelva.

Ocasionalmente, es posible que quieras realizar múltiples acciones simultáneamente y esperar hasta que todas estén hechas en lugar de realizar cada acción secuencialmente. Por ejemplo, leer múltiples propiedades de un solo componente. En estas situaciones usa la función `parallel` para paralelizar las operaciones. La función parallel funciona de manera similar a `Promise.all`, mientras también optimiza las verificaciones de detección de cambios.

<docs-code language="typescript">
it('reads properties in parallel', async () => {
  const checkboxHarness = loader.getHarness(MyCheckboxHarness);
  // Leer las propiedades checked e intermediate simultáneamente.
  const [checked, indeterminate] = await parallel(() => [
    checkboxHarness.isChecked(),
    checkboxHarness.isIndeterminate()
  ]);
  expect(checked).toBe(false);
  expect(indeterminate).toBe(true);
});
</docs-code>
