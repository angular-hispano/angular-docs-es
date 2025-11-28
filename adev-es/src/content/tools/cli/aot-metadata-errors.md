# Errores de metadata AOT

Los siguientes son errores de metadata que puedes encontrar, con explicaciones y correcciones sugeridas.

## Forma de expresión no soportada

ÚTIL: El compilador encontró una expresión que no entendió mientras evaluaba metadata de Angular.

Características del lenguaje fuera de la [sintaxis de expresión restringida](tools/cli/aot-compiler#limitaciones-de-sintaxis-de-expresiones) del compilador
pueden producir este error, como se ve en el siguiente ejemplo:

```ts
// ERROR
export class Fooish { … }
…
const prop = typeof Fooish; // typeof no es válido en metadata
  …
  // notación de corchetes no es válida en metadata
  { provide: 'token', useValue: { [prop]: 'value' } };
  …
```

Puedes usar `typeof` y notación de corchetes en código de aplicación normal.
Simplemente no puedes usar esas características dentro de expresiones que definen metadata de Angular.

Evita este error ciñéndote a la [sintaxis de expresión restringida](tools/cli/aot-compiler#limitaciones-de-sintaxis-de-expresiones) del compilador
al escribir metadata de Angular
y ten cuidado con características de TypeScript nuevas o inusuales.

## Referencia a un símbolo local (no exportado)

ÚTIL: Referencia a un símbolo local \(no exportado\) 'nombre del símbolo'. Considera exportar el símbolo.

El compilador encontró una referencia a un símbolo definido localmente que no fue exportado o no fue inicializado.

Aquí hay un ejemplo de `provider` del problema.

```ts

// ERROR
let foo: number; // ni exportado ni inicializado

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}

```

El compilador genera la factory del componente, que incluye el código del provider `useValue`, en un módulo separado. *Ese* módulo factory no puede regresar a *este* módulo fuente para acceder a la variable local \(no exportada\) `foo`.

Podrías arreglar el problema inicializando `foo`.

```ts
let foo = 42; // inicializado
```

El compilador [plegará](tools/cli/aot-compiler#code-folding) la expresión en el provider como si hubieras escrito esto.

```ts
providers: [
  { provide: Foo, useValue: 42 }
]
```

Alternativamente, puedes arreglarlo exportando `foo` con la expectativa de que `foo` será asignado en tiempo de ejecución cuando realmente conozcas su valor.

```
// CORREGIDO
export let foo: number; // exportado

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```

Agregar `export` a menudo funciona para variables referenciadas en metadata como `providers` y `animations` porque el compilador puede generar _referencias_ a las variables exportadas en estas expresiones. No necesita los _valores_ de esas variables.

Agregar `export` no funciona cuando el compilador necesita el _valor real_
para generar código.
Por ejemplo, no funciona para la propiedad `template`.

```
// ERROR
export let someTemplate: string; // exportado pero no inicializado

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

El compilador necesita el valor de la propiedad `template` _ahora mismo_ para generar la factory del componente.
La referencia a la variable sola es insuficiente.
Prefijar la declaración con `export` simplemente produce un nuevo error, "[`Solo variables y constantes inicializadas pueden ser referenciadas`](#solo-variables-y-constantes-inicializadas)".

## Solo variables y constantes inicializadas

ÚTIL: _Solo variables y constantes inicializadas pueden ser referenciadas porque el valor de esta variable es necesario por el compilador de plantilla._

El compilador encontró una referencia a una variable exportada o campo estático que no fue inicializado.
Necesita el valor de esa variable para generar código.

El siguiente ejemplo intenta establecer la propiedad `template` del componente al valor de la variable exportada `someTemplate` que está declarada pero _no asignada_.

```ts
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

También obtendrías este error si importaste `someTemplate` de algún otro módulo y descuidaste inicializarlo allí.

```ts
// ERROR - no inicializado allí tampoco
import { someTemplate } from './config';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

El compilador no puede esperar hasta tiempo de ejecución para obtener la información de la plantilla.
Debe derivar estáticamente el valor de la variable `someTemplate` del código fuente para que pueda generar la factory del componente, que incluye instrucciones para construir el elemento basado en la plantilla.

Para corregir este error, proporciona el valor inicial de la variable en una cláusula inicializadora *en la misma línea*.

```ts
// CORREGIDO
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

## Referencia a una clase no exportada

ÚTIL: _Referencia a una clase no exportada `<class name>`._
_Considera exportar la clase._

La metadata referenció una clase que no fue exportada.

Por ejemplo, puedes haber definido una clase y usarla como un token de inyección en un array de providers pero descuidaste exportar esa clase.

```ts
// ERROR
abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

Angular genera una factory de clase en un módulo separado y esa factory [solo puede acceder a clases exportadas](tools/cli/aot-compiler#símbolos-public-o-protected).
Para corregir este error, exporta la clase referenciada.

```ts
// CORREGIDO
export abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

## Referencia a una función no exportada

ÚTIL: _La metadata referenció una función que no fue exportada._

Por ejemplo, puedes haber establecido una propiedad `useFactory` de providers a una función definida localmente que descuidaste exportar.

```ts
// ERROR
function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

Angular genera una factory de clase en un módulo separado y esa factory [solo puede acceder a funciones exportadas](tools/cli/aot-compiler#símbolos-public-o-protected).
Para corregir este error, exporta la función.

```ts
// CORREGIDO
export function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

## Llamadas a funciones no son soportadas

ÚTIL: _Las llamadas a funciones no son soportadas. Considera reemplazar la función o lambda con una referencia a una función exportada._

El compilador actualmente no soporta [expresiones de función o funciones lambda](tools/cli/aot-compiler#sin-funciones-flecha).
Por ejemplo, no puedes establecer el `useFactory` de un provider a una función anónima o función flecha como esta.

```ts
// ERROR
  …
  providers: [
    { provide: MyStrategy, useFactory: function() { … } },
    { provide: OtherStrategy, useFactory: () => { … } }
  ]
  …
```

También obtienes este error si llamas a una función o método en el `useValue` de un provider.

```ts
// ERROR
import { calculateValue } from './utilities';

  …
  providers: [
    { provide: SomeValue, useValue: calculateValue() }
  ]
  …
```

Para corregir este error, exporta una función del módulo y refiere a la función en un provider `useFactory` en su lugar.

```ts
// CORREGIDO
import { calculateValue } from './utilities';

export function myStrategy() { … }
export function otherStrategy() { … }
export function someValueFactory() {
  return calculateValue();
}
  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy },
    { provide: OtherStrategy, useFactory: otherStrategy },
    { provide: SomeValue, useFactory: someValueFactory }
  ]
  …
```

## Variable o constante desestructurada no soportada

ÚTIL: _Referenciar una variable o constante desestructurada exportada no es soportado por el compilador de plantilla. Considera simplificar esto para evitar desestructuración._

El compilador no soporta referencias a variables asignadas por [desestructuración](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring).

Por ejemplo, no puedes escribir algo como esto:

```ts
// ERROR
import { configuration } from './configuration';

// asignación desestructurada a foo y bar
const {foo, bar} = configuration;
  …
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  …
```

Para corregir este error, refiere a valores no desestructurados.

```ts
// CORREGIDO
import { configuration } from './configuration';
  …
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  …
```

## No se pudo resolver el tipo

ÚTIL: _El compilador encontró un tipo y no puede determinar qué módulo exporta ese tipo._

Esto puede suceder si te refieres a un tipo ambiente.
Por ejemplo, el tipo `Window` es un tipo ambiente declarado en el archivo global `.d.ts`.

Obtendrás un error si lo refieres en el constructor del componente, que el compilador debe analizar estáticamente.

```ts
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { … }
}
```

TypeScript entiende los tipos ambiente así que no los importas.
El compilador de Angular no entiende un tipo que descuidas exportar o importar.

En este caso, el compilador no entiende cómo inyectar algo con el token `Window`.

No te refieras a tipos ambiente en expresiones de metadata.

Si debes inyectar una instancia de un tipo ambiente,
puedes solucionar el problema en cuatro pasos:

1. Crea un token de inyección para una instancia del tipo ambiente.
1. Crea una función factory que devuelva esa instancia.
1. Agrega un provider `useFactory` con esa función factory.
1. Usa `@Inject` para inyectar la instancia.

Aquí hay un ejemplo ilustrativo.

```ts
// CORREGIDO
import { Inject } from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

@Component({
  …
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (@Inject(WINDOW) private win: Window) { … }
}
```

El tipo `Window` en el constructor ya no es un problema para el compilador porque
usa el `@Inject(WINDOW)` para generar el código de inyección.

Angular hace algo similar con el token `DOCUMENT` así que puedes inyectar el objeto `document` del navegador \(o una abstracción de él, dependiendo de la plataforma en la que la aplicación se ejecuta\).

```ts
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({ … })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { … }
}
```

## Se esperaba un nombre

ÚTIL: _El compilador esperaba un nombre en una expresión que estaba evaluando._

Esto puede suceder si usas un número como nombre de propiedad como en el siguiente ejemplo.

```ts
// ERROR
provider: [{ provide: Foo, useValue: { 0: 'test' } }]
```

Cambia el nombre de la propiedad a algo no numérico.

```ts
// CORREGIDO
provider: [{ provide: Foo, useValue: { '0': 'test' } }]
```

## Nombre de miembro enum no soportado

ÚTIL: _Angular no pudo determinar el valor del [miembro enum](https://www.typescriptlang.org/docs/handbook/enums.html) que referenciaste en metadata._

El compilador puede entender valores enum simples pero no valores complejos como aquellos derivados de propiedades computadas.

```ts
// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computado
}

  …
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // malo
  ]
  …
```

Evita referirte a enums con inicializadores complicados o propiedades computadas.

## Expresiones de plantilla etiquetada no son soportadas

ÚTIL: _Las expresiones de plantilla etiquetada no son soportadas en metadata._

El compilador encontró una [expresión de plantilla etiquetada](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) de JavaScript ES2015 como la siguiente.

```ts

// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template ${expression} string`;
 …
 template: '<div>' + raw + '</div>'
 …

```

[`String.raw()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/raw) es una _función tag_ nativa de JavaScript ES2015.

El compilador AOT no soporta expresiones de plantilla etiquetada; evítalas en expresiones de metadata.

## Se esperaba referencia a símbolo

ÚTIL: _El compilador esperaba una referencia a un símbolo en la ubicación especificada en el mensaje de error._

Este error puede ocurrir si usas una expresión en la cláusula `extends` de una clase.

<!--todo: Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495). -->