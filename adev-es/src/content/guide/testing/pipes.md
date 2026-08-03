# Probar Pipes

Puedes probar [pipes](guide/templates/pipes) sin las utilidades de pruebas de Angular.

## Probar el `TitleCasePipe` {#testing-the-titlecasepipe}

Una clase pipe tiene un método, `transform`, que manipula el valor de entrada en un valor de salida transformado.
La implementación de `transform` rara vez interactúa con el DOM.
La mayoría de pipes no tienen dependencia de Angular aparte de los metadata `@Pipe` y una interfaz.

Considera un `TitleCasePipe` que capitaliza la primera letra de cada palabra.
Aquí hay una implementación con una expresión regular.

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase', pure: true})
/** Transform to Title Case: uppercase the first letter of the words in a string. */
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0
      ? ''
      : input.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
  }
}
```

Cualquier cosa que use una expresión regular vale la pena probar exhaustivamente. Puedes usar técnicas estándar de pruebas unitarias para explorar los casos esperados y los casos extremos.

```ts
describe('TitleCasePipe', () => {
  // Este pipe es una función pura sin estado, por lo que no se necesita BeforeEach
  const pipe = new TitleCasePipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... más pruebas ...
});
```

## Escribir pruebas DOM para soportar una prueba de pipe {#writing-dom-tests-to-support-a-pipe-test}

Estas son pruebas del pipe _de forma aislada_.
No pueden decir si el `TitleCasePipe` está funcionando correctamente como se aplica en los componentes de la aplicación.

Considera agregar pruebas de componente como esta:

```ts
it('should convert hero name to Title Case', async () => {
  // obtener los elementos de input y display del nombre desde el DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simular al usuario ingresando un nuevo nombre en el cuadro de entrada
  nameInput.value = 'quick BROWN  fOx';

  // Despachar un evento DOM para que Angular se entere del cambio de valor del input.
  nameInput.dispatchEvent(new Event('input'));

  // Esperar a que Angular actualice el binding de visualización a través del pipe title
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```
