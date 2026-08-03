# Escenarios de prueba de componentes

Esta guía explora casos de uso comunes de prueba de componentes.

## Binding de componentes {#component-binding}

En la aplicación de ejemplo, el componente `Banner` presenta texto de título estático en la plantilla HTML.

Después de algunos cambios, el componente `Banner` presenta un título dinámico vinculándose a la propiedad `title` del componente como esto.

```angular-ts {header="banner.ts"}
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-banner',
  template: '<h1>{{ title() }}</h1>',
  styles: ['h1 { color: green; font-size: 350%}'],
})
export class Banner {
  title = signal('Test Tour of Heroes');
}
```

Por mínimo que sea esto, decides agregar una prueba para confirmar que el componente realmente muestra el contenido correcto donde crees que debería.

### Consultar por el `<h1>` {#query-for-the-h1}

Escribirás una secuencia de pruebas que inspeccionan el valor del elemento `<h1>` que envuelve el binding de interpolación de la propiedad _title_.

Actualizas el `beforeEach` para encontrar ese elemento con un `querySelector` HTML estándar y asignarlo a la variable `h1`.

```ts {header: "banner.component.spec.ts"}
let component: Banner;
let fixture: ComponentFixture<Banner>;
let h1: HTMLElement;

beforeEach(() => {
  fixture = TestBed.createComponent(Banner);
  component = fixture.componentInstance; // instancia de prueba de Banner
  h1 = fixture.nativeElement.querySelector('h1');
});
```

### `createComponent()` no vincula datos {#createcomponent-does-not-bind-data}

Para tu primera prueba te gustaría ver que la pantalla muestra el `title` predeterminado.
Tu instinto es escribir una prueba que inmediatamente inspecciona el `<h1>` así:

```ts
it('should display original title', () => {
  expect(h1.textContent).toContain(component.title());
});
```

_Esa prueba falla_ con el mensaje:

```shell {hideCopy}
expected '' to contain 'Test Tour of Heroes'.
```

El binding ocurre cuando Angular realiza **detección de cambios**.

En producción, la detección de cambios se activa automáticamente cuando Angular crea un componente o el usuario ingresa una pulsación de tecla, por ejemplo.

El `TestBed.createComponent` no desencadena detección de cambios síncronamente; un hecho confirmado en la prueba revisada:

```ts
it('no title in the DOM after createComponent()', () => {
  expect(h1.textContent).toEqual('');
});
```

### `whenStable()` {#whenstable}

Puedes decirle al `TestBed` que espere a que se ejecute la detección de cambios con `await fixture.whenStable()`.
Solo entonces el `<h1>` tiene el título esperado.

```ts
it('should display original title', async () => {
  await fixture.whenStable();
  expect(h1.textContent).toContain(component.title());
});
```

La detección de cambios retrasada es intencional y útil.
Le da al probador una oportunidad de inspeccionar y cambiar el estado del componente _antes de que Angular inicie el binding de datos y llame a [hooks de ciclo de vida](guide/components/lifecycle)_.

Aquí hay otra prueba que cambia la propiedad `title` del componente _antes_ de llamar a `fixture.whenStable()`.

```ts
it('should display a different test title', async () => {
  component.title.set('Test Title');
  await fixture.whenStable();
  expect(h1.textContent).toContain('Test Title');
});
```

### Binding de signals a inputs {#binding-signals-to-inputs}

Para reflejar cambios en los inputs y escuchar outputs, puedes vincular dinámicamente signals a inputs y funciones a outputs.

```ts
import {inputBinding, outputBinding} from '@angular/core';

const fixture = TestBed.createComponent(ValueDisplay, {
  bindings: [
    inputBinding('value', value),
    outputBinding('valueChange', () =>  (/* ... */) ),
  ],
});
```

### Cambiar un valor de input con `dispatchEvent()` {#change-an-input-value-with-dispatchevent}

Para simular la entrada del usuario, encuentra el elemento input y establece su propiedad `value`.

Pero hay un paso esencial, intermedio.

Angular no sabe que estableciste la propiedad `value` del elemento input.
No leerá esa propiedad hasta que generes el evento `input` del elemento llamando a `dispatchEvent()`.

El siguiente ejemplo de un componente usando el `TitleCasePipe` demuestra la secuencia adecuada.

```ts
it('should convert hero name to Title Case', async () => {
  const hostElement = fixture.nativeElement;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simula al usuario ingresando un nuevo nombre en el input
  nameInput.value = 'quick BROWN  fOx';

  // Genera un evento DOM para que Angular se entere del cambio de valor del input.
  nameInput.dispatchEvent(new Event('input'));

  // Espera a que Angular actualice el binding de visualización a través del pipe title
  await fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Componente con una dependencia {#component-with-a-dependency}

Los componentes a menudo tienen dependencias de servicio.

El componente `Welcome` muestra un mensaje de bienvenida al usuario autenticado.
Sabe quién es el usuario basado en una propiedad del `UserAuthentication` inyectado:

```angular-ts
import {Component, inject, OnInit, signal} from '@angular/core';
import {UserAuthentication} from '../model/user.authentication';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{ welcome() }}</i></h3>',
})
export class Welcome {
  private userAuth = inject(UserAuthentication);
  welcome = signal(
    this.userAuth.isLoggedIn() ? `Welcome, ${this.userAuth.user().name}` : 'Please log in.',
  );
}
```

El componente `Welcome` tiene lógica de decisión que interactúa con el servicio, lógica que hace que este componente valga la pena probar.

### Proporcionar dobles de prueba de servicio {#provide-service-test-doubles}

Un _componente-bajo-prueba_ no tiene que ser proporcionado con servicios reales.

Inyectar el `UserAuthentication` real podría ser difícil.
El servicio real podría pedirle al usuario credenciales de inicio de sesión e intentar llegar a un servidor de autenticación.
Estos comportamientos pueden ser difíciles de interceptar. Ten en cuenta que usar dobles de prueba hace que la prueba se comporte diferente de la producción, así que úsalos con moderación.

### Obtener servicios inyectados {#get-injected-services}

Las pruebas necesitan acceso al `UserAuthentication` inyectado en el `Welcome`.

Angular tiene un sistema de inyección jerárquico.
Puede haber inyectores en múltiples niveles, desde el inyector raíz creado por el `TestBed` hacia abajo a través del árbol de componentes.

La forma más segura de obtener el servicio inyectado, la forma que **_siempre funciona_**,
es **obtenerlo del inyector del **_componente-bajo-prueba_**.
El inyector del componente es una propiedad del `DebugElement` del fixture.

```ts
// UserAuthentication realmente inyectado en el componente
userAuth = fixture.debugElement.injector.get(UserAuthentication);
```

ÚTIL: Esto _usualmente_ no es necesario. Los servicios a menudo se proporcionan en la raíz o los overrides del TestBed y pueden recuperarse más fácilmente con `TestBed.inject()` (ver abajo).

### `TestBed.inject()` {#testbedinject}

Esto es más fácil de recordar y menos verboso que recuperar un servicio usando el `DebugElement` del fixture.

En este conjunto de pruebas, el _único_ proveedor de `UserAuthentication` es el módulo de pruebas raíz, así que es seguro llamar a `TestBed.inject()` así:

```ts
userAuth = TestBed.inject(UserAuthentication);
```

ÚTIL: Para un caso de uso en el que `TestBed.inject()` no funciona, consulta la sección [_Sobrescribir providers de componentes_](#override-component-providers) que explica cuándo y por qué debes obtener el servicio del inyector del componente en su lugar.

### Configuración final y pruebas {#final-setup-and-tests}

Aquí está el `beforeEach()` completo, usando `TestBed.inject()`:

```ts
let fixture: ComponentFixture<Welcome>;
let comp: Welcome;
let userAuth: UserAuthentication; // el servicio inyectado por TestBed
let el: HTMLElement; // el elemento DOM con el mensaje de bienvenida

beforeEach(() => {
  fixture = TestBed.createComponent(Welcome);
  comp = fixture.componentInstance;

  // UserAuthentication desde el inyector raíz
  userAuth = TestBed.inject(UserAuthentication);

  //  obtiene el elemento "welcome" por selector CSS (por ejemplo, por nombre de clase)
  el = fixture.nativeElement.querySelector('.welcome');
});
```

Y aquí hay algunas pruebas:

```ts
it('should welcome the user', async () => {
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, '"Welcome ..."').toContain('Welcome');
  expect(content, 'expected name').toContain('Test User');
});

it('should welcome "Bubba"', async () => {
  userAuth.user.set({name: 'Bubba'}); // el mensaje de bienvenida aún no se ha mostrado
  await fixture.whenStable();

  expect(el.textContent).toContain('Bubba');
});

it('should request login if not logged in', async () => {
  userAuth.isLoggedIn.set(false); // el mensaje de bienvenida aún no se ha mostrado
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, 'not welcomed').not.toContain('Welcome');
  expect(content, '"log in"').toMatch(/log in/i);
});
```

La primera es una prueba de cordura; confirma que el `UserAuthentication` se llama y funciona.

ÚTIL: El 2do argumento de `expect` \(por ejemplo, `'expected name'`\) es una etiqueta de falla opcional.
Si la expectativa falla, Vitest agrega esta etiqueta al mensaje de falla de la expectativa.
En una spec con múltiples expectativas, puede ayudar a aclarar qué salió mal y cuál expectativa falló.

Las pruebas restantes confirman la lógica del componente cuando el servicio retorna diferentes valores.
La segunda prueba valida el efecto de cambiar el nombre del usuario.
La tercera prueba verifica que el componente muestra el mensaje adecuado cuando no hay un usuario autenticado.

## Componente con servicio async {#component-with-async-service}

En este ejemplo, la plantilla del componente `About` aloja un componente `Twain`.
El componente `Twain` muestra citas de Mark Twain.

```angular-html
<p class="twain">
  <i>{{ quote | async }}</i>
</p>
<button type="button" (click)="getQuote()">Next quote</button>
@if (errorMessage()) {
  <p class="error">{{ errorMessage() }}</p>
}
```

ÚTIL: El valor de la propiedad `quote` del componente pasa a través de un `AsyncPipe`.
Eso significa que la propiedad retorna una `Promise` o un `Observable`.

En este ejemplo, el método `TwainQuotes.getQuote()` te indica que la propiedad `quote` retorna un `Observable`.

```ts
getQuote() {
  this.errorMessage.set('');
  this.quote = this.twainQuotes.getQuote().pipe(
    startWith('...'),
    catchError((err: any) => {
      this.errorMessage.set(err.message || err.toString());
      return of('...'); // restablece el mensaje al valor de placeholder
    }),
  );
}
```

El componente `Twain` obtiene citas de un `TwainQuotes` inyectado.
El componente inicia el `Observable` retornado con un valor de placeholder \(`'...'`\), antes de que el servicio pueda retornar su primera cita.

El `catchError` intercepta errores del servicio, prepara un mensaje de error, y retorna el valor de placeholder en el canal de éxito.

Estas son todas características que querrás probar.

### Probar mockeando solicitudes HTTP con el `HttpTestingController`. {#testing-by-mocking-http-requests-with-the-httptestingcontroller}

Al probar un componente, solo debería importar la API pública del servicio.
En general, las pruebas mismas no deberían hacer llamadas a servidores remotos.
Deberían emular tales llamadas.

En el caso de que tu servicio async dependa de `HttpClient` para cargar datos remotos, se recomienda retornar respuestas mock a nivel HTTP con el `HttpTestingController`.

Para más detalles sobre cómo mockear el `HttpBackend`, consulta la [guía dedicada](guide/http/testing).

### Probar proporcionando una implementación stub de un servicio. {#testing-by-providing-a-stubbed-implementation-of-a-service}

Cuando no es posible mockear solicitudes async a nivel HTTP, una alternativa es aprovechar spies.

La configuración en este `app/twain/twain-quotes.spec.ts` muestra una forma de hacerlo:

```ts {header: "twain.spec.ts"}
class TwainQuotesStub implements TwainQuotes {
  private testQuote = 'Test Quote';

  getQuote() {
    return of(this.testQuote);
  }

  // ... Implementa todo lo necesario para conformarse a la API
}

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  fixture = TestBed.createComponent(Twain);
  component = fixture.componentInstance;
  await fixture.whenStable();
  quoteEl = fixture.nativeElement.querySelector('.twain');
});
```

Fíjate en cómo la implementación stub reemplaza a la original.

```ts
TestBed.configureTestingModule({
  providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
});
```

El stub está diseñado de tal manera que cualquier componente o servicio que lo inyecte recibirá la implementación stub.
Significa que cualquier llamada a `getQuote` recibe un observable con una cita de prueba.

A diferencia del método `getQuote()` real, este spy evita el servidor y retorna un observable síncrono cuyo valor está disponible inmediatamente.

### Prueba async con timers falsos de Vitest {#async-test-with-a-vitest-fake-timers}

Para mockear funciones asíncronas como `setTimeout` o `Promise`s, puedes aprovechar los timers falsos de Vitest para controlar cuándo se ejecutan.

```ts
it('should display error when TwainQuotes service fails', async () => {
  class TwainQuotesStub implements TwainQuotes {
    getQuote() {
      return defer(() => {
        return new Promise<string>((_, reject) => {
          setTimeout(() => reject('TwainService test failure'));
        });
      });
    }

    // ... Implementa todo lo necesario para conformarse a la API
  }

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  vi.useFakeTimers(); // configurando los timers falsos
  const fixture = TestBed.createComponent(TwainComponent);

  // el renderizado no es async, necesitamos hacer flush
  await vi.runAllTimersAsync();

  await expect(fixture.nativeElement.querySelector('.error')!.textContent).toMatch(/test failure/);
  expect(fixture.nativeElement.querySelector('.twain')!.textContent).toBe('...');

  vi.useRealTimers(); // restablece a la ejecución async regular
});
```

### Más pruebas async {#more-async-tests}

Con el servicio stub retornando observables async, la mayoría de tus pruebas también tendrán que ser async.

Aquí hay una prueba que demuestra el flujo de datos que esperarías en el mundo real.

```ts
it('should show quote after getQuote', async () => {
  class MockTwainQuotes implements TwainQuotes {
    private subject = new Subject<string>();

    getQuote() {
      return this.subject.asObservable();
    }

    emit(val: string) {
      this.subject.next(val);
    }
  }

  it('should show quote after getQuote (success)', async () => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [{provide: TwainQuotes, useClass: MockTwainQuotes}],
    });

    const fixture = TestBed.createComponent(TwainComponent);
    const twainQuotes = TestBed.inject(TwainQuotes) as MockTwainQuotes;
    await vi.runAllTimersAsync(); // renderiza antes de que se reciba la cita

    const quoteEl = fixture.nativeElement.querySelector('.twain');
    expect(quoteEl.textContent).toBe('...');

    twainQuotes.emit('Twain Quote'); // emite la cita
    await vi.runAllTimersAsync(); // renderiza con la cita recibida

    expect(quoteEl.textContent).toBe('Twain Quote');
    expect(fixture.nativeElement.querySelector('.error')).toBeNull();

    vi.useRealTimers();
  });
});
```

Nota cómo el elemento de la cita muestra el valor de placeholder \(`'...'`\) en el primer renderizado.
La primera cita aún no ha llegado.

Luego puedes afirmar que el elemento de la cita muestra el texto esperado.

### Pruebas async con `zone.js` y `fakeAsync` {#async-tests-with-zonejs-and-fakeasync}

La función auxiliar `fakeAsync` es otro reloj mock que se basa en parchear APIs asíncronas con `zone.js`. Se usaba comúnmente en aplicaciones basadas en `zone.js` para pruebas. Ya no se recomienda el uso de `fakeAsync`.

CONSEJO: Prefiere usar estrategias de pruebas async nativas u otros timers falsos (también llamados relojes mock) como los de Vitest o Jasmine.

IMPORTANTE: `fakeAsync` no se puede usar con el test runner de Vitest ya que no se aplica ningún parche de `zone.js` para este runner.

## Componente con inputs y outputs {#component-with-inputs-and-outputs}

Un componente con inputs y outputs típicamente aparece dentro de la plantilla de vista de un componente host.
El host usa un property binding para establecer la propiedad input y un event binding para escuchar eventos generados por la propiedad output.

El objetivo de la prueba es verificar que tales bindings funcionan como se espera.
Las pruebas deberían establecer valores de input y escuchar eventos de output.

El componente `DashboardHero` es un pequeño ejemplo de un componente en este rol.
Muestra un héroe individual proporcionado por el componente `Dashboard`.
Hacer clic en ese héroe le dice al componente `Dashboard` que el usuario ha seleccionado al héroe.

El componente `DashboardHero` está incrustado en la plantilla del componente `Dashboard` así:

```angular-html
@for (hero of heroes; track hero) {
  <dashboard-hero class="col-1-4" [hero]="hero" (selected)="gotoDetail($event)" />
}
```

El componente `DashboardHero` aparece en un bloque `@for`, que establece la propiedad input `hero` de cada componente al valor del bucle y escucha el evento `selected` del componente.

Aquí está la definición completa del componente:

```angular-ts
@Component({
  selector: 'dashboard-hero',
  imports: [UpperCasePipe],
  template: `
    <button type="button" (click)="click()" class="hero">
      {{ hero().name | uppercase }}
    </button>
  `,
})
export class DashboardHero {
  readonly hero = input.required<Hero>();
  readonly selected = output<Hero>();

  click() {
    this.selected.emit(this.hero());
  }
}
```

Aunque probar un componente tan simple como este tiene poco valor intrínseco, vale la pena saber cómo.
Usa uno de estos enfoques:

- Pruébalo como es usado por el componente `Dashboard`
- Pruébalo como un componente standalone
- Pruébalo como es usado por un sustituto del componente `Dashboard`

El objetivo inmediato es probar el componente `DashboardHero`, no el componente `Dashboard`, así que, prueba la segunda y tercera opciones.

### Probar `DashboardHero` standalone {#test-the-dashboardhero-component-standalone}

Aquí está la parte principal de la configuración del archivo spec.

```ts
let fixture: ComponentFixture<DashboardHero>;
let comp: DashboardHero;
let heroDe: DebugElement;
let heroEl: HTMLElement;
let expectedHero: Hero;

beforeEach(async () => {
  fixture = TestBed.createComponent(DashboardHero);
  comp = fixture.componentInstance;

  // encuentra el DebugElement y el elemento del héroe
  heroDe = fixture.debugElement.query(By.css('.hero'));
  heroEl = heroDe.nativeElement;

  // mockea el héroe suministrado por el componente padre
  expectedHero = {id: 42, name: 'Test Name'};

  // simula al padre estableciendo la propiedad input con ese héroe
  fixture.componentRef.setInput('hero', expectedHero);

  // espera al binding de datos inicial
  await fixture.whenStable();
});
```

Nota cómo el código de configuración asigna un héroe de prueba \(`expectedHero`\) a la propiedad `hero` del componente, emulando la forma en que el `Dashboard` lo establecería usando el property binding en su repeater.

La siguiente prueba verifica que el nombre del héroe se propaga a la plantilla usando un binding.

```ts
it('should display hero name in uppercase', () => {
  const expectedPipedName = expectedHero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});
```

Porque la plantilla pasa el nombre del héroe a través del `UpperCasePipe` de Angular, la prueba debe coincidir el valor del elemento con el nombre en mayúsculas.

### Hacer clic {#clicking}

Hacer clic en el héroe debería generar un evento `selected` que el componente host \(`Dashboard` presumiblemente\) puede escuchar:

```ts
it('should raise selected event when clicked (triggerEventHandler)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroDe.triggerEventHandler('click');
  expect(selectedHero).toBe(expectedHero);
});
```

La propiedad `selected` del componente retorna un `EventEmitter`, que se parece a un `Observable` síncrono de RxJS para los consumidores.
La prueba se suscribe a él _explícitamente_ igual que el componente host lo hace _implícitamente_.

Si el componente se comporta como se espera, hacer clic en el elemento del héroe debería decirle a la propiedad `selected` del componente que emita el objeto `hero`.

La prueba detecta ese evento a través de su suscripción a `selected`.

### `triggerEventHandler` {#triggereventhandler}

El `heroDe` en la prueba anterior es un `DebugElement` que representa el `<div>` del héroe.

Tiene propiedades y métodos de Angular que abstraen la interacción con el elemento nativo.
Esta prueba llama al `DebugElement.triggerEventHandler` con el nombre de evento "click".
El binding de evento "click" responde llamando a `DashboardHero.click()`.

El `DebugElement.triggerEventHandler` de Angular puede generar _cualquier evento vinculado a datos_ por su _nombre de evento_.
El segundo parámetro es el objeto evento pasado al handler.

La prueba generó un evento "click".

```ts
heroDe.triggerEventHandler('click');
```

En este caso, la prueba asume correctamente que el handler de evento en tiempo de ejecución, el método `click()` del componente, no le importa el objeto evento.

ÚTIL: Otros handlers son menos indulgentes.
Por ejemplo, la directiva `RouterLink` espera un objeto con una propiedad `button` que identifica qué botón del mouse, si alguno, se presionó durante el clic.
La directiva `RouterLink` lanza un error si falta el objeto evento.

### Hacer clic en el elemento {#click-the-element}

La siguiente alternativa de prueba llama al método `click()` propio del elemento nativo, que es perfectamente fino para *este componente*.

```ts
it('should raise selected event when clicked (element.click)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroEl.click();
  expect(selectedHero).toBe(expectedHero);
});
```

### Helper `click()` {#click-helper}

Hacer clic en un botón, un anchor, o un elemento HTML arbitrario es una tarea de prueba común.

Haz eso consistente y directo encapsulando el proceso de _disparar clics_ en un helper como la siguiente función `click()`:

```ts
/** Eventos de botón para pasar a `DebugElement.triggerEventHandler` para el handler de evento RouterLink */
export const ButtonClickEvents = {
  left: {button: 0},
  right: {button: 2},
};

/** Simula un clic de elemento. Por defecto usa el evento de clic del botón izquierdo del mouse. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left,
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
```

El primer parámetro es el _elemento-a-hacer-clic_.
Si quieres, pasa un objeto evento personalizado como segundo parámetro.
El predeterminado es un [objeto de evento de mouse de botón izquierdo](https://developer.mozilla.org/docs/Web/API/MouseEvent/button) parcial aceptado por muchos handlers incluyendo la directiva `RouterLink`.

IMPORTANTE: La función helper `click()` **no** es una de las utilidades de prueba de Angular.
Es una función definida en el _código de ejemplo de esta guía_.
Todas las pruebas de ejemplo la usan.
Si te gusta, añádela a tu propia colección de helpers.

Aquí está la prueba anterior, reescrita usando el helper de clic.

```ts
it('should raise selected event when clicked (click helper with DebugElement)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  click(heroDe); // helper de clic con DebugElement

  expect(selectedHero).toBe(expectedHero);
});
```

## Componente dentro de un test host {#component-inside-a-test-host}

Las pruebas anteriores jugaron ellas mismas el rol del componente host `Dashboard`.
Pero, ¿funciona correctamente el componente `DashboardHero` cuando está correctamente vinculado a un componente host?

```angular-ts
@Component({
  imports: [DashboardHero],
  template: ` <dashboard-hero [hero]="hero" (selected)="onSelected($event)" />`,
})
class TestHost {
  hero: Hero = {id: 42, name: 'Test Name'};
  selectedHero: Hero | undefined;

  onSelected(hero: Hero) {
    this.selectedHero = hero;
  }
}
```

El test host establece la propiedad input `hero` del componente con su héroe de prueba.
Vincula el evento `selected` del componente con su handler `onSelected`, que registra el héroe emitido en su propiedad `selectedHero`.

Más adelante, las pruebas podrán revisar `selectedHero` para verificar que el evento `DashboardHero.selected` emitió el héroe esperado.

La configuración para las pruebas de `test-host` es similar a la configuración para las pruebas standalone:

```ts
beforeEach(async () => {
  // crea TestHost en lugar de DashboardHero
  fixture = TestBed.createComponent(TestHost);
  testHost = fixture.componentInstance;
  heroEl = fixture.nativeElement.querySelector('.hero');

  await fixture.whenStable();
});
```

Esta configuración del módulo de pruebas muestra dos diferencias importantes:

- _Crea_ el componente `TestHost` en lugar del `DashboardHero`
- El componente `TestHost` establece el `DashboardHero.hero` con un binding

El `createComponent` retorna un `fixture` que contiene una instancia de `TestHost` en lugar de una instancia de `DashboardHero`.

Crear el `TestHost` tiene el efecto secundario de crear un `DashboardHero` porque este último aparece dentro de la plantilla del primero.
La consulta por el elemento del héroe \(`heroEl`\) aún lo encuentra en el DOM de prueba, aunque en mayor profundidad en el árbol de elementos que antes.

Las pruebas mismas son casi idénticas a la versión standalone:

```ts
it('should display hero name', () => {
  const expectedPipedName = testHost.hero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});

it('should raise selected event when clicked', () => {
  click(heroEl);
  // el héroe seleccionado debería ser el mismo héroe vinculado por datos
  expect(testHost.selectedHero).toBe(testHost.hero);
});
```

Solo la prueba del evento selected difiere.
Confirma que el héroe `DashboardHero` seleccionado realmente encuentra su camino hacia arriba a través del binding de evento hacia el componente host.

## Componente de enrutamiento {#routing-component}

Un _componente de enrutamiento_ es un componente que le dice al `Router` que navegue a otro componente.
El componente `Dashboard` es un _componente de enrutamiento_ porque el usuario puede navegar al componente `HeroDetail` haciendo clic en uno de los _botones de héroe_ en el dashboard.

Angular proporciona helpers de prueba para reducir el código repetitivo y probar más eficazmente código que depende de `HttpClient`. La función `provideRouter` también se puede usar directamente en el módulo de pruebas.

```ts
beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{path: '**', component: Dashboard}]),
      provideHttpClientTesting(),
      HeroService,
    ],
  });
  harness = await RouterTestingHarness.create();
  comp = await harness.navigateByUrl('/', Dashboard);
  TestBed.inject(HttpTestingController).expectOne('api/heroes').flush(getTestHeroes());
});
```

La siguiente prueba hace clic en el héroe mostrado y confirma que navegamos a la URL esperada.

```ts
it('should tell navigate when hero clicked', async () => {
  // obtiene el primer DebugElement <dashboard-hero>
  const heroDe = harness.routeDebugElement!.query(By.css('dashboard-hero'));
  heroDe.triggerEventHandler('selected', comp.heroes[0]);

  // se espera navegar al id del primer héroe del componente
  const id = comp.heroes[0].id;
  expect(TestBed.inject(Router).url, 'should nav to HeroDetail for first hero').toEqual(
    `/heroes/${id}`,
  );
});
```

## Componentes enrutados {#routed-components}

Un _componente enrutado_ es el destino de una navegación del `Router`.
Puede ser más complicado de probar, especialmente cuando la ruta al componente _incluye parámetros_.
El `HeroDetail` es un _componente enrutado_ que es el destino de tal ruta.

Cuando un usuario hace clic en un héroe del _Dashboard_, el `Dashboard` le dice al `Router` que navegue a `heroes/:id`.
El `:id` es un parámetro de ruta cuyo valor es el `id` del héroe a editar.

El `Router` hace coincidir esa URL con una ruta al `HeroDetail`.
Crea un objeto `ActivatedRoute` con la información de enrutamiento y lo inyecta en una nueva instancia del `HeroDetail`.

Aquí están los servicios inyectados en `HeroDetail`:

```ts
private heroDetailService = inject(HeroDetailService);
private route = inject(ActivatedRoute);
private router = inject(Router);
```

El componente `HeroDetail` necesita el parámetro `id` para poder obtener el héroe correspondiente usando el `HeroDetailService`.
El componente tiene que obtener el `id` desde la propiedad `ActivatedRoute.paramMap`, que es un `Observable`.

No puede simplemente referenciar la propiedad `id` de `ActivatedRoute.paramMap`.
El componente tiene que _suscribirse_ al observable `ActivatedRoute.paramMap` y estar preparado para que el `id` cambie durante su vida útil.

```ts
constructor() {
  // obtiene el héroe cuando cambia el parámetro `id`
  this.route.paramMap
    .pipe(takeUntilDestroyed())
    .subscribe((pmap) => this.getHero(pmap.get('id')));
}
```

Las pruebas pueden explorar cómo responde el `HeroDetail` a diferentes valores del parámetro `id` navegando a diferentes rutas.

## Pruebas de componentes anidados {#nested-component-tests}

Las plantillas de componentes a menudo tienen componentes anidados, cuyas plantillas podrían contener aún más componentes.

El árbol de componentes puede ser muy profundo y a veces los componentes anidados no juegan ningún rol en probar el componente en la cima del árbol.

El componente `App`, por ejemplo, muestra una barra de navegación con anchors y sus directivas `RouterLink`.

```angular-html
<app-banner />
<app-welcome />

<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>

<router-outlet />
```

Para validar los enlaces pero no la navegación, no necesitas que el `Router` navegue y no necesitas el `<router-outlet>` para marcar dónde el `Router` inserta _componentes enrutados_.

Los componentes `Banner` y `Welcome` \(indicados por `<app-banner>` y `<app-welcome>`\) también son irrelevantes.

Sin embargo, cualquier prueba que crea el componente `App` en el DOM también crea instancias de estos tres componentes y, si dejas que eso suceda, tendrás que configurar el `TestBed` para crearlos.

Si te olvidas de declararlos, el compilador de Angular no reconocerá las etiquetas `<app-banner>`, `<app-welcome>`, y `<router-outlet>` en la plantilla de `App` y lanzará un error.

Si declaras los componentes reales, también tendrás que declarar _sus_ componentes anidados y proporcionar _todos_ los servicios inyectados en _cualquier_ componente en el árbol.

Esta sección describe dos técnicas para minimizar la configuración.
Úsalas, solas o en combinación, para mantenerte enfocado en probar el componente principal.

### Hacer stub de componentes innecesarios {#stubbing-unneeded-components}

En la primera técnica, creas y declaras versiones stub de los componentes y directiva que juegan poco o ningún rol en las pruebas.

```ts
@Component({selector: 'app-banner', template: ''})
class BannerStub {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStub {}

@Component({selector: 'app-welcome', template: ''})
class WelcomeStub {}
```

Los selectores stub coinciden con los selectores de los componentes reales correspondientes.
Pero sus plantillas y clases están vacías.

Luego decláralos sobrescribiendo los `imports` de tu componente usando `TestBed.overrideComponent`.

```ts
let comp: App;
let fixture: ComponentFixture<App>;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [RouterLink, BannerStub, RouterOutletStub, WelcomeStub],
    },
  });

  fixture = TestBed.createComponent(App);
  comp = fixture.componentInstance;
});
```

ÚTIL: La clave `set` en este ejemplo reemplaza todos los imports existentes de tu componente, asegúrate de importar todas las dependencias, no solo los stubs. Alternativamente puedes usar las claves `remove`/`add` para eliminar y agregar imports selectivamente.

### `NO_ERRORS_SCHEMA` {#no_errors_schema}

En el segundo enfoque, agrega `NO_ERRORS_SCHEMA` a los overrides de metadata de tu componente.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [], // reinicia todos los imports
      schemas: [NO_ERRORS_SCHEMA],
    },
  });
});
```

El `NO_ERRORS_SCHEMA` le dice al compilador de Angular que ignore elementos y atributos no reconocidos.

El compilador reconoce el elemento `<app-root>` y el atributo `routerLink` porque declaraste un `App` correspondiente y `RouterLink` en la configuración de `TestBed`.

Pero el compilador no lanzará un error cuando encuentre `<app-banner>`, `<app-welcome>`, o `<router-outlet>`.
Simplemente los renderiza como etiquetas vacías y el navegador los ignora.

Ya no necesitas los componentes stub.

### Usar ambas técnicas juntas {#use-both-techniques-together}

Estas son técnicas de _Pruebas Superficiales de Componentes_, así llamadas porque reducen la superficie visual del componente a solo aquellos elementos en la plantilla del componente que importan para las pruebas.

El enfoque `NO_ERRORS_SCHEMA` es el más fácil de los dos pero no lo uses en exceso.

El `NO_ERRORS_SCHEMA` también evita que el compilador te informe sobre los componentes y atributos faltantes que omitiste inadvertidamente o escribiste mal.
Podrías desperdiciar horas persiguiendo bugs fantasma que el compilador habría detectado al instante.

El enfoque de _componente stub_ tiene otra ventaja.
Aunque los stubs en _este_ ejemplo estaban vacíos, podrías darles plantillas y clases simplificadas si tus pruebas necesitan interactuar con ellos de alguna manera.

En la práctica combinarás las dos técnicas en la misma configuración, como se ve en este ejemplo.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    remove: {imports: [RouterOutlet, Welcome]},
    set: {schemas: [NO_ERRORS_SCHEMA]},
  });
});
```

El compilador de Angular crea el `BannerStub` para el elemento `<app-banner>` y aplica el `RouterLink` a los anchors con el atributo `routerLink`, pero ignora las etiquetas `<app-welcome>` y `<router-outlet>`.

### `By.directive` y directivas inyectadas {#bydirective-and-injected-directives}

Un poco más de configuración desencadena el binding de datos inicial y obtiene referencias a los enlaces de navegación:

```ts
beforeEach(async () => {
  await fixture.whenStable();

  // encuentra los DebugElements con una RouterLinkStubDirective adjunta
  linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));

  // obtiene las instancias de la directiva de enlace adjunta
  // usando el inyector de cada DebugElement
  routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
});
```

Tres puntos de especial interés:

- Localiza los elementos anchor con una directiva adjunta usando `By.directive`
- La consulta retorna wrappers `DebugElement` alrededor de los elementos coincidentes
- Cada `DebugElement` expone un inyector de dependencias con la instancia específica de la directiva adjunta a ese elemento

Los enlaces del componente `App` a validar son los siguientes:

```angular-html
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>
```

Aquí hay algunas pruebas que confirman que esos enlaces están conectados a las directivas `routerLink` como se espera:

```ts
it('can get RouterLinks from template', () => {
  expect(routerLinks.length, 'should have 3 routerLinks').toBe(3);
  expect(routerLinks[0].href).toBe('/dashboard');
  expect(routerLinks[1].href).toBe('/heroes');
  expect(routerLinks[2].href).toBe('/about');
});

it('can click Heroes link in template', async () => {
  const heroesLinkDe = linkDes[1]; // DebugElement del enlace heroes

  TestBed.inject(Router).resetConfig([{path: '**', children: []}]);
  heroesLinkDe.triggerEventHandler('click', {button: 0});

  await fixture.whenStable();

  expect(TestBed.inject(Router).url).toBe('/heroes');
});
```

## Usar un objeto `page` {#use-a-page-object}

El componente `HeroDetail` es una vista simple con un título, dos campos de héroe, y dos botones.

Pero hay bastante complejidad de plantilla incluso en este formulario simple.

```angular-html
@if (hero) {
  <div>
    <h2>
      <span>{{ hero.name | titlecase }}</span> Details
    </h2>
    <div><span>id: </span>{{ hero.id }}</div>
    <div>
      <label for="name">name: </label>
      <input id="name" [(ngModel)]="hero.name" placeholder="name" />
    </div>
    <button type="button" (click)="save()">Save</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
}
```

Las pruebas que ejercitan el componente necesitan…

- Esperar hasta que llegue un héroe antes de que los elementos aparezcan en el DOM
- Una referencia al texto del título
- Una referencia al input del nombre para inspeccionarlo y establecerlo
- Referencias a los dos botones para poder hacer clic en ellos

Incluso un formulario pequeño como este puede producir un desorden de configuración condicional torturada y selección de elementos CSS.

Doma la complejidad con una clase `Page` que maneja el acceso a las propiedades del componente y encapsula la lógica que las establece.

Aquí hay una clase `Page` así para el `hero-detail.component.spec.ts`

```ts
class Page {
  // las propiedades getter esperan para consultar el DOM hasta que se llamen.
  get buttons() {
    return this.queryAll<HTMLButtonElement>('button');
  }
  get saveBtn() {
    return this.buttons[0];
  }
  get cancelBtn() {
    return this.buttons[1];
  }
  get nameDisplay() {
    return this.query<HTMLElement>('span');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('input');
  }

  //// helpers de consulta ////
  private query<T>(selector: string): T {
    return harness.routeNativeElement!.querySelector(selector)! as T;
  }

  private queryAll<T>(selector: string): T[] {
    return harness.routeNativeElement!.querySelectorAll(selector) as any as T[];
  }
}
```

Ahora los hooks importantes para la manipulación e inspección del componente están organizados de forma ordenada y accesibles desde una instancia de `Page`.

Un método `createComponent` crea un objeto `page` y llena los espacios en blanco una vez que llega el `hero`.

```ts
async function createComponent(id: number) {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${id}`, HeroDetail);
  page = new Page();

  const request = TestBed.inject(HttpTestingController).expectOne(`api/heroes/?id=${id}`);
  const hero = getTestHeroes().find((h) => h.id === Number(id));
  request.flush(hero ? [hero] : []);
  await harness.fixture.whenStable();
}
```

Aquí hay algunas pruebas más del componente `HeroDetail` para reforzar el punto.

```ts
it("should display that hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(expectedHero.name);
});

it('should navigate when click cancel', () => {
  click(page.cancelBtn);
  expect(TestBed.inject(Router).url).toEqual(`/heroes/${expectedHero.id}`);
});

it('should save when click save but not navigate immediately', () => {
  click(page.saveBtn);
  expect(TestBed.inject(HttpTestingController).expectOne({method: 'PUT', url: 'api/heroes'}));
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should navigate when click save and save resolves', async () => {
  click(page.saveBtn);
  await harness.fixture.whenStable();
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should convert hero name to Title Case', async () => {
  // obtiene los elementos del input y de visualización del nombre desde el DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simula al usuario ingresando un nuevo nombre en el input
  nameInput.value = 'quick BROWN  fOx';

  // Genera un evento DOM para que Angular se entere del cambio de valor del input.
  nameInput.dispatchEvent(new Event('input'));

  // Espera a que Angular actualice el binding de visualización a través del pipe title
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Sobrescribir providers de componentes {#override-component-providers}

El `HeroDetail` proporciona su propio `HeroDetailService`.

```ts
@Component({
  /* ... */
  providers: [HeroDetailService],
})
export class HeroDetail {
  private heroDetailService = inject(HeroDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
}
```

No es posible hacer stub del `HeroDetailService` del componente en los `providers` del `TestBed.configureTestingModule`.
Esos son providers para el _módulo de pruebas_, no para el componente.
Preparan el inyector de dependencias a nivel del _fixture_.

Angular crea el componente con su _propio_ inyector, que es un _hijo_ del inyector del fixture.
Registra los providers del componente \(el `HeroDetailService` en este caso\) con el inyector hijo.

Una prueba no puede llegar a los servicios del inyector hijo desde el inyector del fixture.
Y `TestBed.configureTestingModule` tampoco puede configurarlos.

¡Angular ha estado creando nuevas instancias del `HeroDetailService` real todo el tiempo!

ÚTIL: Estas pruebas podrían fallar o agotar el tiempo de espera si el `HeroDetailService` hiciera sus propias llamadas XHR a un servidor remoto.
Podría no haber un servidor remoto al cual llamar.

Afortunadamente, el `HeroDetailService` delega la responsabilidad del acceso a datos remotos a un `HeroService` inyectado.

```ts
@Service()
export class HeroDetailService {
  private heroService = inject(HeroService);
}
```

La configuración de prueba anterior reemplaza el `HeroService` real con un `TestHeroService` que intercepta las solicitudes del servidor y falsifica sus respuestas.

¿Qué pasa si no tienes tanta suerte?
¿Qué pasa si falsificar el `HeroService` es difícil?
¿Qué pasa si `HeroDetailService` hace sus propias solicitudes al servidor?

El método `TestBed.overrideComponent` puede reemplazar los `providers` del componente con _dobles de prueba_ fáciles de manejar como se ve en la siguiente variación de configuración:

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {path: 'heroes', component: HeroList},
        {path: 'heroes/:id', component: HeroDetail},
      ]),
      // ¡El HeroDetailService en este nivel es IRRELEVANTE!
      {provide: HeroDetailService, useValue: {}},
    ],
  }).overrideComponent(HeroDetail, {
    set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
  });
});
```

Nota que `TestBed.configureTestingModule` ya no proporciona un `HeroService` falso porque [no es necesario](#provide-a-spy-stub-herodetailservicespy).

### El método `overrideComponent` {#the-overridecomponent-method}

Enfócate en el método `overrideComponent`.

```ts
.overrideComponent(HeroDetail, {
  set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
});
```

Toma dos argumentos: el tipo de componente a sobrescribir \(`HeroDetail`\) y un objeto de metadata de override.
El [objeto de metadata de override](/guide/testing/utility-apis#testbed-class-summary) es un genérico definido como sigue:

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

Un objeto de metadata de override puede agregar-y-eliminar elementos en propiedades de metadata o reiniciar completamente esas propiedades.
Este ejemplo reinicia la metadata `providers` del componente.

El parámetro de tipo, `T`, es el tipo de metadata que pasarías al decorador `@Component`:

```ts
selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…
```

### Proporcionar un _spy stub_ (`HeroDetailServiceSpy`) {#provide-a-spy-stub-herodetailservicespy}

Este ejemplo reemplaza completamente el array `providers` del componente con un nuevo array que contiene un `HeroDetailServiceSpy`.

El `HeroDetailServiceSpy` es una versión stub del `HeroDetailService` real que falsifica todas las características necesarias de ese servicio.
No inyecta ni delega al `HeroService` de nivel inferior, así que no hay necesidad de proporcionar un doble de prueba para eso.

Las pruebas relacionadas del componente `HeroDetail` afirmarán que los métodos del `HeroDetailService` fueron llamados espiando los métodos del servicio.
En consecuencia, el stub implementa sus métodos como spies:

```ts
import {vi} from 'vitest';

class HeroDetailServiceSpy {
  testHero: Hero = {...testHero};

  /* emite un clon del héroe de prueba */
  getHero = vi.fn(() => asyncData({...this.testHero}));

  /* emite un clon del héroe de prueba, con los cambios fusionados */
  saveHero = vi.fn((hero: Hero) => asyncData(Object.assign(this.testHero, hero)));
}
```

### Las pruebas override {#the-override-tests}

Ahora las pruebas pueden controlar el héroe del componente directamente manipulando el `testHero` del spy-stub y confirmar que los métodos del servicio fueron llamados.

```ts
let hdsSpy: HeroDetailServiceSpy;

beforeEach(async () => {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${testHero.id}`, HeroDetail);
  page = new Page();
  // obtiene el HeroDetailServiceSpy inyectado del componente
  hdsSpy = harness.routeDebugElement!.injector.get(HeroDetailService) as any;

  harness.detectChanges();
});

it('should have called `getHero`', () => {
  expect(hdsSpy.getHero, 'getHero called once').toHaveBeenCalledTimes(1);
});

it("should display stub hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(hdsSpy.testHero.name);
});

it('should save stub hero change', async () => {
  const origName = hdsSpy.testHero.name;
  const newName = 'New Name';

  page.nameInput.value = newName;

  page.nameInput.dispatchEvent(new Event('input')); // avisa a Angular

  expect(component.hero.name, 'component hero has new name').toBe(newName);
  expect(hdsSpy.testHero.name, 'service hero unchanged before save').toBe(origName);

  click(page.saveBtn);
  expect(hdsSpy.saveHero, 'saveHero called once').toHaveBeenCalledTimes(1);

  await harness.fixture.whenStable();
  expect(hdsSpy.testHero.name, 'service hero has new name after save').toBe(newName);
  expect(TestBed.inject(Router).url).toEqual('/heroes');
});
```

### Más overrides {#more-overrides}

El método `TestBed.overrideComponent` puede llamarse múltiples veces para el mismo componente o para componentes diferentes.
El `TestBed` ofrece métodos similares `overrideDirective`, `overrideModule`, y `overridePipe` para profundizar y reemplazar partes de estas otras clases.

Explora las opciones y combinaciones por tu cuenta.
