# Crear harnesses para tus componentes

## Antes de comenzar

CONSEJO: Esta guía asume que ya leíste la [guía de visión general de component harnesses](guide/testing/component-harnesses-overview). Lee eso primero si eres nuevo en el uso de component harnesses.

### ¿Cuándo tiene sentido crear un test harness?

El equipo de Angular recomienda crear component test harnesses para componentes compartidos que se usan en muchos lugares y tienen algo de interactividad de usuario. Esto comúnmente aplica a librerías de widgets y componentes reutilizables similares. Los harnesses son valiosos para estos casos porque proporcionan a los consumidores de estos componentes compartidos una API bien soportada para interactuar con un componente. Las pruebas que usan harnesses pueden evitar depender de detalles de implementación poco confiables de estos componentes compartidos, como estructura DOM y event listeners específicos.

Para componentes que aparecen en solo un lugar, como una página en una aplicación, los harnesses no proporcionan tanto beneficio. En estas situaciones, las pruebas de un componente pueden razonablemente depender de los detalles de implementación de este componente, ya que las pruebas y componentes se actualizan al mismo tiempo. Sin embargo, los harnesses aún proporcionan algo de valor si usarías el harness en pruebas tanto unitarias como end-to-end.

### Instalación del CDK

El [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) es un conjunto de primitivas de comportamiento para construir componentes. Para usar los component harnesses, primero instala `@angular/cdk` desde npm. Puedes hacer esto desde tu terminal usando Angular CLI:

```shell
ng add @angular/cdk
```

## Extender `ComponentHarness`

La clase abstracta `ComponentHarness` es la clase base para todos los component harnesses. Para crear un component harness personalizado, extiende `ComponentHarness` e implementa la propiedad estática `hostSelector`.

La propiedad `hostSelector` identifica elementos en el DOM que coinciden con esta subclase harness. En la mayoría de los casos, el `hostSelector` debería ser el mismo que el selector del `Component` o `Directive` correspondiente. Por ejemplo, considera un componente popup simple:

<docs-code language="typescript">
@Component({
  selector: 'my-popup',
  template: `
    <button (click)="toggle()">{{triggerText()}}</button>
    @if (isOpen()) {
      <div class="my-popup-content"><ng-content></ng-content></div>
    }
  `
})
class MyPopup {
  triggerText = input('');

isOpen = signal(false);

toggle() {
  this.isOpen.update((value) => !value);
}
}
</docs-code>

En este caso, un harness mínimo para el componente se vería como lo siguiente:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';
}
</docs-code>

Aunque las subclases de `ComponentHarness` requieren solo la propiedad `hostSelector`, la mayoría de los harnesses también deberían implementar un método estático `with` para generar instancias de `HarnessPredicate`. La [sección de filtrar harnesses](guide/testing/using-component-harnesses#filtering-harnesses) cubre esto con más detalle.

## Encontrar elementos en el DOM del componente

Cada instancia de una subclase de `ComponentHarness` representa una instancia particular del componente correspondiente. Puedes acceder al elemento host del componente a través del método `host()` de la clase base `ComponentHarness`.

`ComponentHarness` también ofrece varios métodos para localizar elementos dentro del DOM del componente. Estos métodos son `locatorFor()`, `locatorForOptional()` y `locatorForAll()`. Estos métodos crean funciones que encuentran elementos, no encuentran elementos directamente. Este enfoque protege contra el almacenamiento en caché de referencias a elementos desactualizados. Por ejemplo, cuando un bloque `@if` oculta y luego muestra un elemento, el resultado es un nuevo elemento DOM; usar funciones asegura que las pruebas siempre referencien el estado actual del DOM.

Consulta la [página de referencia de la API de ComponentHarness](/api/cdk/testing/ComponentHarness) para la lista completa de detalles de los diferentes métodos `locatorFor`.

Por ejemplo, el ejemplo `MyPopupHarness` discutido arriba podría proporcionar métodos para obtener los elementos trigger y content como sigue:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

// Obtiene el elemento trigger
getTriggerElement = this.locatorFor('button');

// Obtiene el elemento content.
getContentElement = this.locatorForOptional('.my-popup-content');
}
</docs-code>

## Trabajar con instancias de `TestElement`

`TestElement` es una abstracción diseñada para trabajar en diferentes entornos de prueba (Pruebas unitarias, WebDriver, etc). Al usar harnesses, deberías realizar toda interacción DOM a través de esta interfaz. Otros medios de acceder a elementos DOM, como `document.querySelector()`, no funcionan en todos los entornos de prueba.

`TestElement` tiene una cantidad de métodos para interactuar con el DOM subyacente, como `blur()`, `click()`, `getAttribute()` y más. Consulta la [página de referencia de la API de TestElement](/api/cdk/testing/TestElement) para la lista completa de métodos.

No expongas instancias de `TestElement` a usuarios de harness a menos que sea un elemento que el consumidor del componente define directamente, como el elemento host del componente. Exponer instancias de `TestElement` para elementos internos lleva a los usuarios a depender de la estructura DOM interna de un componente.

En su lugar, proporciona métodos más enfocados para acciones específicas que el usuario final puede tomar o estado particular que pueden observar. Por ejemplo, `MyPopupHarness` de secciones anteriores podría proporcionar métodos como `toggle` e `isOpen`:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

protected getTriggerElement = this.locatorFor('button');
protected getContentElement = this.locatorForOptional('.my-popup-content');

/\*_ Alterna el estado abierto del popup. _/
async toggle() {
const trigger = await this.getTriggerElement();
return trigger.click();
}

/\*_ Verifica si el popup está abierto. _/
async isOpen() {
const content = await this.getContentElement();
return !!content;
}
}
</docs-code>

## Cargar harnesses para subcomponentes

Los componentes más grandes a menudo componen subcomponentes. Puedes reflejar esta estructura en el harness de un componente también. Cada uno de los métodos `locatorFor` en `ComponentHarness` tiene una firma alternativa que puede usarse para localizar sub-harnesses en lugar de elementos.

Consulta la [página de referencia de la API de ComponentHarness](/api/cdk/testing/ComponentHarness) para la lista completa de los diferentes métodos locatorFor.

Por ejemplo, considera un menú construido usando el popup de arriba:

<docs-code language="typescript">
@Directive({
  selector: 'my-menu-item'
})
class MyMenuItem {}

@Component({
selector: 'my-menu',
template: `     <my-popup>
      <ng-content></ng-content>
    </my-popup>
  `
})
class MyMenu {
triggerText = input('');

@ContentChildren(MyMenuItem) items: QueryList<MyMenuItem>;
}
</docs-code>

El harness para `MyMenu` puede entonces aprovechar otros harnesses para `MyPopup` y `MyMenuItem`:

<docs-code language="typescript">
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

protected getPopupHarness = this.locatorFor(MyPopupHarness);

/\*_ Obtiene los items de menú actualmente mostrados (lista vacía si el menú está cerrado). _/
getItems = this.locatorForAll(MyMenuItemHarness);

/\*_ Alterna el estado abierto del menú. _/
async toggle() {
const popupHarness = await this.getPopupHarness();
return popupHarness.toggle();
}
}

class MyMenuItemHarness extends ComponentHarness {
static hostSelector = 'my-menu-item';
}
</docs-code>

## Filtrar instancias de harness con `HarnessPredicate`

Cuando una página contiene múltiples instancias de un componente particular, es posible que quieras filtrar basado en alguna propiedad del componente para obtener una instancia de componente particular. Por ejemplo, es posible que quieras un botón con algún texto específico, o un menú con un ID específico. La clase `HarnessPredicate` puede capturar criterios como este para una subclase de `ComponentHarness`. Aunque el autor de la prueba puede construir instancias de `HarnessPredicate` manualmente, es más fácil cuando la subclase de `ComponentHarness` proporciona un método helper para construir predicates para filtros comunes.

Deberías crear un método estático `with()` en cada subclase de `ComponentHarness` que retorne un `HarnessPredicate` para esa clase. Esto permite a los autores de pruebas escribir código fácilmente comprensible, p. ej., `loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`. Además de las opciones estándar de selector y ancestor, el método `with` debería agregar cualquier otra opción que tenga sentido para la subclase particular.

Los harnesses que necesitan agregar opciones adicionales deberían extender la interfaz `BaseHarnessFilters` y propiedades opcionales adicionales según sea necesario. `HarnessPredicate` proporciona varios métodos de conveniencia para agregar opciones: `stringMatches()`, `addOption()` y `add()`. Consulta la [página de API de HarnessPredicate](/api/cdk/testing/HarnessPredicate) para la descripción completa.

Por ejemplo, cuando se trabaja con un menú es útil filtrar basado en el texto del trigger y filtrar items de menú basado en su texto:

<docs-code language="typescript">
interface MyMenuHarnessFilters extends BaseHarnessFilters {
/\*_ Filtra basado en el texto del trigger para el menú. _/
triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
/** Filtra basado en el texto del item de menú. */
text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

/\*_ Crea un `HarnessPredicate` usado para localizar un `MyMenuHarness` particular. _/
static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
return new HarnessPredicate(MyMenuHarness, options)
.addOption('trigger text', options.triggerText,
  (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
}

protected getPopupHarness = this.locatorFor(MyPopupHarness);

/\*_ Obtiene el texto del trigger del menú. _/
async getTriggerText(): Promise<string> {
const popupHarness = await this.getPopupHarness();
return popupHarness.getTriggerText();
}
...
}

class MyMenuItemHarness extends ComponentHarness {
static hostSelector = 'my-menu-item';

/\*_ Crea un `HarnessPredicate` usado para localizar un `MyMenuItemHarness` particular. _/
static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
return new HarnessPredicate(MyMenuItemHarness, options)
.addOption('text', options.text,
(harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
}

/\*_ Obtiene el texto del item de menú. _/
async getText(): Promise<string> {
const host = await this.host();
return host.text();
}
}
</docs-code>

Puedes pasar un `HarnessPredicate` en lugar de una clase `ComponentHarness` a cualquiera de las APIs en `HarnessLoader`, `LocatorFactory` o `ComponentHarness`. Esto permite a los autores de pruebas fácilmente dirigirse a una instancia de componente particular al crear una instancia de harness. También permite al autor del harness aprovechar el mismo `HarnessPredicate` para habilitar APIs más poderosas en su clase harness. Por ejemplo, considera el método `getItems` en el `MyMenuHarness` mostrado arriba. Agregar una API de filtrado permite a los usuarios del harness buscar items de menú particulares:

<docs-code language="typescript">
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

/\*_ Obtiene una lista de items en el menú, opcionalmente filtrados basados en el criterio dado. _/
async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
  const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
  return getFilteredItems();
}
...
}
</docs-code>

## Crear `HarnessLoader` para elementos que usan proyección de contenido

Algunos componentes proyectan contenido adicional en la plantilla del componente. Consulta la [guía de proyección de contenido](guide/components/content-projection) para más información.

Agrega una instancia de `HarnessLoader` con alcance al elemento que contiene el `<ng-content>` cuando crees un harness para un componente que usa proyección de contenido. Esto permite al usuario del harness cargar harnesses adicionales para cualquier componente que fue pasado como contenido. `ComponentHarness` tiene varios métodos que pueden usarse para crear instancias de HarnessLoader para casos como este: `harnessLoaderFor()`, `harnessLoaderForOptional()`, `harnessLoaderForAll()`. Consulta la [página de referencia de la API de la interfaz HarnessLoader](/api/cdk/testing/HarnessLoader) para más detalles.

Por ejemplo, el ejemplo `MyPopupHarness` de arriba puede extender `ContentContainerComponentHarness` para agregar soporte para cargar harnesses dentro del `<ng-content>` del componente.

<docs-code language="typescript">
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
</docs-code>

## Acceder a elementos fuera del elemento host del componente

Hay momentos cuando un component harness podría necesitar acceder a elementos fuera del elemento host de su componente correspondiente. Por ejemplo, código que muestra un elemento flotante o pop-up a menudo adjunta elementos DOM directamente al body del documento, como el servicio `Overlay` en el CDK de Angular.

En este caso, `ComponentHarness` proporciona un método que puede usarse para obtener un `LocatorFactory` para el elemento raíz del documento. El `LocatorFactory` soporta la mayoría de las mismas APIs que la clase base `ComponentHarness`, y puede luego usarse para consultar relativo al elemento raíz del documento.

Considera si el componente `MyPopup` arriba usara el overlay del CDK para el contenido del popup, en lugar de un elemento en su propia plantilla. En este caso, `MyPopupHarness` tendría que acceder al elemento content a través del método `documentRootLocatorFactory()` que obtiene una factory locator enraizada en la raíz del documento.

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
static hostSelector = 'my-popup';

/\*_ Obtiene un `HarnessLoader` cuyo elemento raíz es el elemento content del popup. _/
async getHarnessLoaderForContent(): Promise<HarnessLoader> {
const rootLocator = this.documentRootLocatorFactory();
return rootLocator.harnessLoaderFor('my-popup-content');
}
}
</docs-code>

## Esperar tareas asíncronas

Los métodos en `TestElement` automáticamente desencadenan la detección de cambios de Angular y esperan tareas dentro del `NgZone`. En la mayoría de los casos no se requiere esfuerzo especial para que los autores de harness esperen tareas asíncronas. Sin embargo, hay algunos casos extremos donde esto puede no ser suficiente.

Bajo algunas circunstancias, las animaciones de Angular pueden requerir un segundo ciclo de detección de cambios y la subsiguiente estabilización de `NgZone` antes de que los eventos de animación se vacíen completamente. En casos donde esto se necesita, el `ComponentHarness` ofrece un método `forceStabilize()` que puede llamarse para hacer la segunda ronda.

Puedes usar `NgZone.runOutsideAngular()` para programar tareas fuera de NgZone. Llama al método `waitForTasksOutsideAngular()` en el harness correspondiente si necesitas esperar explícitamente tareas fuera de `NgZone` ya que esto no sucede automáticamente.
