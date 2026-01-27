# Sintaxis de Expresiones

Las expresiones de Angular están basadas en JavaScript, pero difieren en algunos aspectos clave. Esta guía recorre las similitudes y diferencias entre las expresiones de Angular y JavaScript estándar.

## Literales de valor

Angular soporta un subconjunto de [valores literales](https://developer.mozilla.org/en-US/docs/Glossary/Literal) de JavaScript.

### Literales de valor soportados

| Tipo de literal | Valores de ejemplo                  |
| --------------- | ----------------------------------- |
| String          | `'Hello'`, `"World"`                |
| Boolean         | `true`, `false`                     |
| Number          | `123`, `3.14`                       |
| Object          | `{name: 'Alice'}`                   |
| Array           | `['Onion', 'Cheese', 'Garlic']`     |
| null            | `null`                              |
| Template string | `` `Hello ${name}` ``               |
| RegExp          | `/\d+/`                             |

### Literales de valor no soportados

| Tipo de literal | Valores de ejemplo |
| --------------- | ------------------ |
| BigInt          | `1n`               |

## Globales

Las expresiones de Angular soportan los siguientes [globales](https://developer.mozilla.org/en-US/docs/Glossary/Global_object):

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

No se soportan otros globales de JavaScript. Los globales comunes de JavaScript incluyen `Number`, `Boolean`, `NaN`, `Infinity`, `parseInt`, y más.

## Variables locales

Angular automáticamente hace disponibles variables locales especiales para usar en expresiones en contextos específicos. Estas variables especiales siempre comienzan con el carácter de signo de dólar (`$`).

Por ejemplo, los bloques `@for` hacen disponibles varias variables locales correspondientes a información sobre el bucle, como `$index`.

## ¿Qué operadores están soportados?

### Operadores soportados

Angular soporta los siguientes operadores de JavaScript estándar.

| Operador                         | Ejemplo(s)                                     |
| -------------------------------- | ---------------------------------------------- |
| Add / Concatenate                | `1 + 2`                                        |
| Subtract                         | `52 - 3`                                       |
| Multiply                         | `41 * 6`                                       |
| Divide                           | `20 / 4`                                       |
| Remainder (Modulo)               | `17 % 5`                                       |
| Exponentiation                   | `10 ** 3`                                      |
| Parenthesis                      | `9 * (8 + 4)`                                  |
| Conditional (Ternary)            | `a > b ? true : false`                         |
| And (Logical)                    | `&&`                                           |
| Or (Logical)                     | `\|\|`                                         |
| Not (Logical)                    | `!`                                            |
| Nullish Coalescing               | `possiblyNullValue ?? 'default'`               |
| Comparison Operators             | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==`, `!=` |
| Unary Negation                   | `-x`                                           |
| Unary Plus                       | `+y`                                           |
| Property Accessor                | `person['name']`                               |
| Assignment                       | `a = b`                                        |
| Addition Assignment              | `a += b`                                       |
| Subtraction Assignment           | `a -= b`                                       |
| Multiplication Assignment        | `a *= b`                                       |
| Division Assignment              | `a /= b`                                       |
| Remainder Assignment             | `a %= b`                                       |
| Exponentiation Assignment        | `a **= b`                                      |
| Logical AND Assignment           | `a &&= b`                                      |
| Logical OR Assignment            | `a \|\|= b`                                    |
| Nullish Coalescing Assignment    | `a ??= b`                                      |

Las expresiones de Angular también soportan adicionalmente los siguientes operadores no estándar:

| Operador                                  | Ejemplo(s)                     |
| ----------------------------------------- | ------------------------------ |
| [Pipe](/guide/templates/pipes)            | `{{ total \| currency }}`      |
| Optional chaining\*                       | `someObj.someProp?.nestedProp` |
| Non-null assertion (TypeScript)           | `someObj!.someProp`            |

NOTA: El optional chaining se comporta de manera diferente a la versión estándar de JavaScript en que si el lado izquierdo del operador optional chaining de Angular es `null` o `undefined`, retorna `null` en lugar de `undefined`.

### Operadores no soportados

| Operador                    | Ejemplo(s)                        |
| --------------------------- | --------------------------------- |
| All bitwise operators       | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| Object destructuring        | `const { name } = person`         |
| Array destructuring         | `const [firstItem] = items`       |
| Comma operator              | `x = (x++, x)`                    |
| instanceof                  | `car instanceof Automobile`       |
| new                         | `new Car()`                       |

## Contexto léxico para expresiones

Las expresiones de Angular se evalúan dentro del contexto de la clase del componente así como de cualquier [variable de plantilla](/guide/templates/variables), locales y globales relevantes.

Al referirse a miembros de la clase del componente, `this` siempre está implícito. Sin embargo, si una plantilla declara una [variable de plantilla](guide/templates/variables) con el mismo nombre que un miembro, la variable oculta ese miembro. Puedes referenciar inequívocamente tal miembro de clase usando explícitamente `this.`. Esto puede ser útil al crear una declaración `@let` que oculta un miembro de clase, por ejemplo, para propósitos de estrechamiento de signals.

## Declaraciones

En términos generales, las declaraciones no están soportadas en las expresiones de Angular. Esto incluye, pero no se limita a:

| Declaraciones   | Ejemplo(s)                                  |
| --------------- | ------------------------------------------- |
| Variables       | `let label = 'abc'`, `const item = 'apple'` |
| Functions       | `function myCustomFunction() { }`           |
| Arrow Functions | `() => { }`                                 |
| Classes         | `class Rectangle { }`                       |

# Declaraciones de event listeners

Los manejadores de eventos son **declaraciones** en lugar de expresiones. Aunque soportan toda la misma sintaxis que las expresiones de Angular, hay dos diferencias clave:

1. Las declaraciones **sí soportan** operadores de asignación (pero no asignaciones destructivas)
1. Las declaraciones **no soportan** pipes
