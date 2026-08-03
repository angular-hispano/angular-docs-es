# Probar directivas de atributo

Una _directiva de atributo_ modifica el comportamiento de un elemento, componente u otra directiva.
Su nombre refleja la forma en que se aplica la directiva: como un atributo en un elemento host.

## Probar la directiva `Highlight` {#testing-the-highlight-directive}

La directiva `Highlight` de la aplicación de muestra establece el color de fondo de un elemento basado en un color vinculado a datos o un color predeterminado \(lightgray\).
También establece una propiedad personalizada del elemento \(`customProperty`\) a `true` sin otra razón que mostrar que puede hacerlo.

```ts
import {Directive, inject, input} from '@angular/core';

/**
 * Set backgroundColor for the attached element to highlight color
 * and set the element's customProperty attribute to true
 */
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'bgColor() || defaultColor',
  },
})
export class Highlight {
  readonly defaultColor = 'rgb(211, 211, 211)'; // lightgray

  readonly bgColor = input('', {alias: 'highlight'});
}
```

Se usa en toda la aplicación, quizás más simplemente en el componente `About`:

```ts
@Component({
  imports: [Twain, Highlight],
  template: `
    <h2 highlight="skyblue">About</h2>
    <h3>Quote of the day:</h3>
    <twain-quote />
  `,
})
export class About {}
```

Probar el uso específico de la directiva `Highlight` dentro del componente `About` requiere solo las técnicas exploradas en la sección ["Pruebas de componentes anidados"](guide/testing/components-scenarios#routed-components) de [Escenarios de prueba de componentes](guide/testing/components-scenarios).

```ts
let fixture: ComponentFixture<About>;

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [TwainService, UserService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  fixture = TestBed.createComponent(About);
  await fixture.whenStable();
});

it('should have skyblue <h2>', () => {
  const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
  const bgColor = h2.style.backgroundColor;
  expect(bgColor).toBe('skyblue');
});
```

Sin embargo, probar un solo caso de uso es poco probable que explore el rango completo de las capacidades de una directiva.
Encontrar y probar todos los componentes que usan la directiva es tedioso, frágil y casi tan poco probable de ofrecer cobertura completa.

Las _pruebas solo de clase_ podrían ser útiles, pero las directivas de atributo como esta tienden a manipular el DOM.
Las pruebas unitarias aisladas no tocan el DOM y, por lo tanto, no inspiran confianza en la eficacia de la directiva.

Una mejor solución es crear un componente de prueba artificial que demuestre todas las formas de aplicar la directiva.

```angular-ts
@Component({
  imports: [Highlight],
  template: `
    <h2 highlight="yellow">Something Yellow</h2>
    <h2 highlight>The Default (Gray)</h2>
    <h2>No Highlight</h2>
    <input #box [highlight]="box.value" value="cyan" />
  `,
})
class Test {}
```

<img alt="HighlightDirective spec en acción" src="assets/images/guide/testing/highlight-directive-spec.png">

ÚTIL: El caso `<input>` vincula la `Highlight` al nombre de un valor de color en el cuadro de entrada.
El valor inicial es la palabra "cyan" que debería ser el color de fondo del cuadro de entrada.

Aquí hay algunas pruebas de este componente:

```ts
let fixture: ComponentFixture<Test>;
let des: DebugElement[]; // los tres elementos con la directiva

beforeEach(async () => {
  fixture = TestBed.createComponent(Test);
  await fixture.whenStable();

  // todos los elementos con un Highlight adjunto
  des = fixture.debugElement.queryAll(By.directive(Highlight));
});

// pruebas de color
it('should have three highlighted elements', () => {
  expect(des.length).toBe(3);
});

it('should color 1st <h2> background "yellow"', () => {
  const bgColor = des[0].nativeElement.style.backgroundColor;
  expect(bgColor).toBe('yellow');
});

it('should color 2nd <h2> background w/ default color', () => {
  const dir = des[1].injector.get(Highlight);
  const bgColor = des[1].nativeElement.style.backgroundColor;
  expect(bgColor).toBe(dir.defaultColor);
});

it('should bind <input> background to value color', async () => {
  // más fácil trabajar con nativeElement
  const input = des[2].nativeElement as HTMLInputElement;
  expect(input.style.backgroundColor, 'initial backgroundColor').toBe('cyan');

  input.value = 'green';

  // Despacha un evento DOM para que Angular responda al cambio de valor del input.
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();

  expect(input.style.backgroundColor, 'changed backgroundColor').toBe('green');
});

it('bare <h2> should not have a backgroundColor', () => {
  // el h2 sin la directiva Highlight
  const bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));

  expect(bareH2.styles.backgroundColor).toBeUndefined();
});
```

Algunas técnicas son dignas de mención:

- El predicado `By.directive` es una excelente manera de obtener los elementos que tienen esta directiva _cuando sus tipos de elemento son desconocidos_
- La [pseudo-clase `:not`](https://developer.mozilla.org/docs/Web/CSS/:not) en `By.css('h2:not([highlight])')` ayuda a encontrar elementos `<h2>` que _no_ tienen la directiva.
  `By.css('*:not([highlight])')` encuentra _cualquier_ elemento que no tenga la directiva.

- `DebugElement.styles` permite el acceso a los estilos del elemento incluso en ausencia de un navegador real, gracias a la abstracción `DebugElement`.
  Pero siéntete libre de explotar el `nativeElement` cuando eso parezca más fácil o más claro que la abstracción.

- Angular agrega una directiva al injector del elemento al que se aplica.
  La prueba para el color predeterminado usa el injector del segundo `<h2>` para obtener su instancia de `Highlight` y su `defaultColor`.

- `DebugElement.properties` permite el acceso a la propiedad personalizada artificial que se establece por la directiva

## Probar una directiva en aislamiento {#testing-a-directive-in-isolation}

Una directiva no puede construirse a través de TestBed; debe renderizarse a través de la plantilla de un componente para comportarse correctamente.
La directiva `Highlight` puede probarse de esta manera, usando el input de un componente de prueba local para controlar la directiva.

```ts
@Component({
  imports: [Highlight],
  template: `<p [highlight]="color()">{{ color() }}</p>`,
})
class Test {
  readonly color = input('');
}

describe('Highlight', () => {
  let fixture: ComponentFixture<Test>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Test);
    await fixture.whenStable();
  });

  it('should use the specified color once an input is provided', async () => {
    fixture.componentRef.setInput('color', 'blue');
    await fixture.whenStable();

    const p = fixture.nativeElement.querySelector('p');
    expect(p.style.backgroundColor).toBe('blue');
  });
});
```
