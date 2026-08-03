# Fundamentos de probar componentes

Un componente, a diferencia de todas las demás partes de una aplicación Angular, combina una plantilla HTML y una clase TypeScript.
El componente realmente es la plantilla y la clase _trabajando juntas_.
Para probar adecuadamente un componente, debes probar que funcionan juntas como se pretende.

Estas pruebas requieren crear el elemento host del componente en el DOM del navegador, tal como lo hace Angular, e investigar la interacción de la clase del componente con el DOM tal como se describe en su plantilla.

El `TestBed` de Angular facilita este tipo de pruebas, como verás en las siguientes secciones.
Pero en muchos casos, _probar la clase del componente sola_, sin la participación del DOM, puede validar gran parte del comportamiento del componente de una manera directa y más evidente.

## Pruebas del DOM de componentes {#component-dom-testing}

Un componente es más que solo su clase.
Un componente interactúa con el DOM y con otros componentes.
Las clases por sí solas no pueden decirte si el componente va a renderizarse correctamente, responder a la entrada del usuario y gestos, o integrarse con sus componentes padre e hijo.

- ¿Está `Lightswitch.clicked()` enlazado a algo de modo que el usuario pueda invocarlo?
- ¿Se muestra `Lightswitch.message`?
- ¿Puede el usuario realmente seleccionar el héroe mostrado por el componente `DashboardHero`?
- ¿Se muestra el nombre del héroe como se espera \(como en mayúsculas\)?
- ¿Se muestra el mensaje de bienvenida por la plantilla del componente `Welcome`?

Estas podrían no ser preguntas problemáticas para los componentes simples ilustrados anteriormente.
Pero muchos componentes tienen interacciones complejas con los elementos del DOM descritos en sus plantillas, causando que el HTML aparezca y desaparezca a medida que cambia el estado del componente.

Para responder este tipo de preguntas, tienes que crear los elementos del DOM asociados con los componentes, debes examinar el DOM para confirmar que el estado del componente se muestra correctamente en los momentos apropiados, y debes simular la interacción del usuario con la pantalla para determinar si esas interacciones hacen que el componente se comporte como se espera.

Para escribir este tipo de pruebas, usarás características adicionales de `TestBed` así como otros ayudantes de pruebas.

### Pruebas generadas por el CLI {#cli-generated-tests}

El CLI crea un archivo de prueba inicial para ti de forma predeterminada cuando le pides que genere un nuevo componente.

Por ejemplo, el siguiente comando del CLI genera un componente `Banner` en la carpeta `app/banner` \(con plantilla y estilos inline\):

```shell
ng generate component banner --inline-template --inline-style
```

También genera un archivo de prueba inicial para el componente, `banner.spec.ts`, que se ve así:

```ts
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Banner} from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Reducir la configuración {#reduce-the-setup}

Solo las últimas tres líneas de este archivo realmente prueban el componente y todo lo que hacen es afirmar que Angular puede crear el componente.

El resto del archivo es código de configuración repetitivo que anticipa pruebas más avanzadas que _podrían_ volverse necesarias si el componente evoluciona hacia algo más sustancial.

Aprenderás sobre estas características de prueba avanzadas en las siguientes secciones.
Por ahora, puedes reducir radicalmente este archivo de prueba a un tamaño más manejable:

```ts
describe('Banner (minimal)', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(Banner);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
```

Más adelante llamarás a `TestBed.configureTestingModule()` con imports, providers y más declaraciones para adaptarse a tus necesidades de prueba.
Los métodos opcionales `override` pueden ajustar aún más aspectos de la configuración.

NOTA: `TestBed.compileComponents` solo es necesario cuando se usan bloques `@defer` en los componentes probados.

### `createComponent()`

Después de configurar `TestBed`, llamas a su método `createComponent()`.

```ts
const fixture = TestBed.createComponent(Banner);
```

`TestBed.createComponent()` crea una instancia del componente `Banner`, añade un elemento correspondiente al DOM del ejecutor de pruebas, y retorna un [`ComponentFixture`](#componentfixture).

IMPORTANTE: No reconfigures `TestBed` después de llamar a `createComponent`.

El método `createComponent` congela la definición actual de `TestBed`, cerrándola a configuraciones adicionales.

No puedes llamar a ningún otro método de configuración de `TestBed`, ni `configureTestingModule()`, ni `get()`, ni ninguno de los métodos `override...`.
Si lo intentas, `TestBed` lanza un error.

### `ComponentFixture`

El [`ComponentFixture`](api/core/testing/ComponentFixture) es un harness de pruebas para interactuar con el componente creado y su elemento correspondiente.

Accede a la instancia del componente a través del fixture y confirma que existe con una expectativa:

```ts
const component = fixture.componentInstance;
expect(component).toBeDefined();
```

### `beforeEach()`

Añadirás más pruebas a medida que este componente evolucione.
En lugar de duplicar la configuración de `TestBed` para cada prueba, la refactorizas para extraer la configuración en un `beforeEach()` y algunas variables de apoyo:

```ts
describe('Banner (with beforeEach)', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;

    await fixture.whenStable(); // necesario para esperar la renderización inicial
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

ÚTIL: Al esperar la renderización inicial en el `beforeEach` con `await fixture.whenStable`, las pruebas individuales se vuelven síncronas.

Ahora añade una prueba que obtiene el elemento del componente desde `fixture.nativeElement` y busca el texto esperado.

```ts
it('should contain "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  expect(bannerElement.textContent).toContain('banner works!');
});
```

### Crear una función `setup` {#create-a-setup-function}

Como alternativa a `beforeEach`, también puedes crear una función setup que llamarás en cada prueba.
Una función setup tiene la ventaja de ser personalizable mediante parámetros.

Aquí hay un ejemplo de cómo podría verse una función setup:

```ts
function setup(providers?: StaticProviders[]): ComponentFixture<Banner> {
  TestBed.configureTestingModule({providers});
  return TestBed.createComponent(Banner);
}
```

### `nativeElement`

El valor de `ComponentFixture.nativeElement` tiene el tipo `any`.
Más adelante te encontrarás con `DebugElement.nativeElement`, que también tiene el tipo `any`.

Angular no puede saber en tiempo de compilación qué tipo de elemento HTML es `nativeElement` o si siquiera es un elemento HTML.
La aplicación podría estar ejecutándose en una _plataforma no navegador_, como el servidor o un entorno node, donde el elemento podría tener una API reducida o no existir en absoluto.

Las pruebas en esta guía están diseñadas para ejecutarse en un navegador, así que un valor de `nativeElement` siempre será un `HTMLElement` o una de sus clases derivadas.

Sabiendo que es un `HTMLElement` de algún tipo, usa el `querySelector` HTML estándar para profundizar más en el árbol de elementos.

Aquí hay otra prueba que llama a `HTMLElement.querySelector` para obtener el elemento de párrafo y buscar el texto del banner:

```ts
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

### `DebugElement`

El _fixture_ de Angular proporciona el elemento del componente directamente a través de `fixture.nativeElement`.

```ts
const bannerElement: HTMLElement = fixture.nativeElement;
```

Este es en realidad un método de conveniencia, implementado como `fixture.debugElement.nativeElement`.

```ts
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```

Hay una buena razón para esta ruta indirecta hacia el elemento.

Las propiedades de `nativeElement` dependen del entorno de ejecución.
Podrías estar ejecutando estas pruebas en una plataforma _no navegador_ que no tiene un DOM o cuya emulación de DOM no soporta la API completa de `HTMLElement`.

Angular se basa en la abstracción `DebugElement` para funcionar de forma segura en _todas las plataformas soportadas_.
En lugar de crear un árbol de elementos HTML, Angular crea un árbol `DebugElement` que envuelve los _elementos nativos_ para la plataforma de ejecución.
La propiedad `nativeElement` desenvuelve el `DebugElement` y retorna el objeto de elemento específico de la plataforma.

Debido a que las pruebas de ejemplo de esta guía están diseñadas para ejecutarse solo en un navegador, un `nativeElement` en estas pruebas siempre es un `HTMLElement` cuyos métodos y propiedades familiares puedes explorar dentro de una prueba.

Aquí está la prueba anterior, reimplementada con `fixture.debugElement.nativeElement`:

```ts
it('should find the <p> with fixture.debugElement.nativeElement', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const bannerEl: HTMLElement = bannerDe.nativeElement;
  const p = bannerEl.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

El `DebugElement` tiene otros métodos y propiedades que son útiles en las pruebas, como verás en otras partes de esta guía.

Importas el símbolo `DebugElement` desde la biblioteca core de Angular.

```ts
import {DebugElement} from '@angular/core';
```

### `By.css()`

Aunque las pruebas de esta guía se ejecutan todas en el navegador, algunas aplicaciones podrían ejecutarse en una plataforma diferente al menos parte del tiempo.

Por ejemplo, el componente podría renderizarse primero en el servidor como parte de una estrategia para hacer que la aplicación se inicie más rápido en dispositivos con mala conexión.
El renderizador del lado del servidor podría no soportar la API completa de elementos HTML.
Si no soporta `querySelector`, la prueba anterior podría fallar.

El `DebugElement` ofrece métodos de consulta que funcionan para todas las plataformas soportadas.
Estos métodos de consulta toman una función _predicado_ que retorna `true` cuando un nodo en el árbol `DebugElement` coincide con el criterio de selección.

Creas un _predicado_ con la ayuda de una clase `By` importada desde una biblioteca para la plataforma de ejecución.
Aquí está el import de `By` para la plataforma navegador:

```ts
import {By} from '@angular/platform-browser';
```

El siguiente ejemplo reimplementa la prueba anterior con `DebugElement.query()` y el método `By.css` del navegador.

```ts
it('should find the <p> with fixture.debugElement.query(By.css)', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css('p'));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toEqual('banner works!');
});
```

Algunas observaciones notables:

- El método estático `By.css()` selecciona nodos `DebugElement` con un [selector CSS estándar](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'Selectores CSS').
- La consulta retorna un `DebugElement` para el párrafo.
- Debes desenvolver ese resultado para obtener el elemento de párrafo.

Cuando estás filtrando por selector CSS y solo probando propiedades del _elemento nativo_ de un navegador, el enfoque `By.css` podría ser excesivo.

A menudo es más directo y claro filtrar con un método estándar de `HTMLElement` como `querySelector()` o `querySelectorAll()`.
