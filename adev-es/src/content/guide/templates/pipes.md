# Pipes

## Visión general

Los pipes son un operador especial en las expresiones de plantilla de Angular que te permite transformar datos de forma declarativa en tu plantilla. Los pipes te permiten declarar una función de transformación una vez y luego usar esa transformación a través de múltiples plantillas. Los pipes de Angular usan el carácter de barra vertical (`|`), inspirado en el [pipe de Unix](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>).

NOTA: La sintaxis de pipe de Angular se desvía del JavaScript estándar, que usa el carácter de barra vertical para el [operador OR bit a bit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR). Las expresiones de plantilla de Angular no soportan operadores bit a bit.

Aquí hay un ejemplo usando algunos pipes integrados que Angular proporciona:

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
       <!-- Transforma el nombre de la empresa a title-case y
       transforma la fecha purchasedOn a una cadena con formato regional -->
<h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

	    <!-- Transforma el monto a una cadena con formato de moneda -->
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class ShoppingCartComponent {
  amount = 123.45;
  company = 'acme corporation';
  purchasedOn = '2024-07-08';
}
```

Cuando Angular renderiza el componente, asegurará que el formato de fecha y moneda apropiados se basen en la configuración regional del usuario. Si el usuario está en los Estados Unidos, renderizará:

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

Consulta la [guía en profundidad sobre i18n](/guide/i18n) para aprender más sobre cómo Angular localiza valores.

### Pipes integrados

Angular incluye un conjunto de pipes integrados en el paquete `@angular/common`:

| Nombre                                        | Descripción                                                                                              |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [`AsyncPipe`](api/common/AsyncPipe)           | Lee el valor de una `Promise` o un `Observable` de RxJS.                                                 |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | Transforma un número en una cadena de moneda, formateada según las reglas de configuración regional.     |
| [`DatePipe`](api/common/DatePipe)             | Formatea un valor `Date` según las reglas de configuración regional.                                     |
| [`DecimalPipe`](api/common/DecimalPipe)       | Transforma un número en una cadena con un punto decimal, formateada según las reglas de configuración regional. |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | Mapea un valor a una cadena que pluraliza el valor según las reglas de configuración regional.           |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | Mapea una clave a un selector personalizado que devuelve un valor deseado.                               |
| [`JsonPipe`](api/common/JsonPipe)             | Transforma un objeto a una representación de cadena mediante `JSON.stringify`, destinado a depuración.   |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | Transforma Object o Map en un array de pares clave-valor.                                                |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | Transforma texto a minúsculas.                                                                            |
| [`PercentPipe`](api/common/PercentPipe)       | Transforma un número en una cadena de porcentaje, formateada según las reglas de configuración regional. |
| [`SlicePipe`](api/common/SlicePipe)           | Crea un nuevo Array o String que contiene un subconjunto (slice) de los elementos.                       |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | Transforma texto a title case.                                                                            |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | Transforma texto a mayúsculas.                                                                            |

## Usar pipes

El operador pipe de Angular usa el carácter de barra vertical (`|`), dentro de una expresión de plantilla. El operador pipe es un operador binario: el operando del lado izquierdo es el valor pasado a la función de transformación, y el operando del lado derecho es el nombre del pipe y cualquier argumento adicional (descrito a continuación).

```angular-html
<p>Total: {{ amount | currency }}</p>
```

En este ejemplo, el valor de `amount` se pasa al `CurrencyPipe` donde el nombre del pipe es `currency`. Luego renderiza la moneda predeterminada para la configuración regional del usuario.

### Combinar múltiples pipes en la misma expresión

Puedes aplicar múltiples transformaciones a un valor usando múltiples operadores pipe. Angular ejecuta los pipes de izquierda a derecha.

El siguiente ejemplo demuestra una combinación de pipes para mostrar una fecha localizada en mayúsculas:

```angular-html
<p>The event will occur on {{ scheduledOn | date | uppercase }}.</p>
```

### Pasar parámetros a pipes

Algunos pipes aceptan parámetros para configurar la transformación. Para especificar un parámetro, agrega al nombre del pipe dos puntos (`:`) seguido del valor del parámetro.

Por ejemplo, el `DatePipe` puede tomar parámetros para formatear la fecha de una manera específica.

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm' }}.</p>
```

Algunos pipes pueden aceptar múltiples parámetros. Puedes especificar valores de parámetros adicionales separados por el carácter de dos puntos (`:`).

Por ejemplo, también podemos pasar un segundo parámetro opcional para controlar la zona horaria.

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm':'UTC' }}.</p>
```

## Cómo funcionan los pipes

Conceptualmente, los pipes son funciones que aceptan un valor de entrada y devuelven un valor transformado.

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <main>
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class AppComponent {
  amount = 123.45;
}
```

En este ejemplo:

1. `CurrencyPipe` se importa desde `@angular/common`
1. `CurrencyPipe` se agrega al array `imports`
1. Los datos de `amount` se pasan al pipe `currency`

### Precedencia del operador pipe

El operador pipe tiene menor precedencia que otros operadores binarios, incluyendo `+`, `-`, `*`, `/`, `%`, `&&`, `||`, y `??`.

```angular-html
<!-- firstName y lastName se concatenan antes de que el resultado se pase al pipe uppercase -->
{{ firstName + lastName | uppercase }}
```

El operador pipe tiene mayor precedencia que el operador condicional (ternario).

```angular-html
{{ (isAdmin ? 'Access granted' : 'Access denied') | uppercase }}
```

Si la misma expresión se escribiera sin paréntesis:

```angular-html
{{ isAdmin ? 'Access granted' : 'Access denied' | uppercase }}
```

Se analizaría en cambio como:

```angular-html
{{ isAdmin ? 'Access granted' : ('Access denied' | uppercase) }}
```

Siempre usa paréntesis en tus expresiones cuando la precedencia de operadores pueda ser ambigua.

### Detección de cambios con pipes

Por defecto, todos los pipes se consideran `pure`, lo que significa que solo se ejecuta cuando un valor de entrada primitivo (como `String`, `Number`, `Boolean`, o `Symbol`) o una referencia de objeto (como `Array`, `Object`, `Function`, o `Date`) es cambiado. Los pipes puros ofrecen una ventaja de rendimiento porque Angular puede evitar llamar a la función de transformación si el valor pasado no ha cambiado.

Como resultado, esto significa que las mutaciones a propiedades de objetos o elementos de arrays no se detectan a menos que se reemplace toda la referencia de objeto o array con una instancia diferente. Si quieres este nivel de detección de cambios, consulta [detectar cambios dentro de arrays u objetos](#detectar-cambios-dentro-de-arrays-u-objetos).

## Crear pipes personalizados

Puedes definir un pipe personalizado implementando una clase TypeScript con el decorador `@Pipe`. Un pipe debe tener dos cosas:

- Un nombre, especificado en el decorador pipe
- Un método llamado `transform` que realiza la transformación del valor.

La clase TypeScript debería además implementar la interfaz `PipeTransform` para asegurar que satisfaga la firma de tipo para un pipe.

Aquí hay un ejemplo de un pipe personalizado que transforma cadenas a kebab case:

```angular-ts
// kebab-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/ /g, '-');
  }
}
```

### Usar el decorador `@Pipe`

Al crear un pipe personalizado, importa `Pipe` del paquete `@angular/core` y úsalo como decorador para la clase TypeScript.

```angular-ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe {}
```

El decorador `@Pipe` requiere un `name` que controla cómo se usa el pipe en una plantilla.

### Convención de nombres para pipes personalizados

La convención de nombres para pipes personalizados consiste en dos convenciones:

- `name` - se recomienda camelCase. No uses guiones.
- `class name` - versión PascalCase del `name` con `Pipe` agregado al final

### Implementar la interfaz `PipeTransform`

Además del decorador `@Pipe`, los pipes personalizados siempre deben implementar la interfaz `PipeTransform` de `@angular/core`.

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

Implementar esta interfaz asegura que tu clase pipe tenga la estructura correcta.

### Transformar el valor de un pipe

Cada transformación se invoca mediante el método `transform` con el primer parámetro siendo el valor que se pasa y el valor de retorno siendo el valor transformado.

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string): string {
    return `My custom transformation of ${value}.`
  }
}
```

### Agregar parámetros a un pipe personalizado

Puedes agregar parámetros a tu transformación agregando parámetros adicionales al método `transform`:

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`

    if (format === 'uppercase') {
      return msg.toUpperCase()
    } else {
      return msg
    }
  }
}
```

### Detectar cambios dentro de arrays u objetos

Cuando quieres que un pipe detecte cambios dentro de arrays u objetos, debe ser marcado como una función impura pasando la bandera `pure` con un valor de `false`.

Evita crear pipes impuros a menos que sea absolutamente necesario, ya que pueden incurrir en una penalización de rendimiento significativa si se usan sin cuidado.

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinNamesImpure',
  pure: false,
})
export class JoinNamesImpurePipe implements PipeTransform {
  transform(names: string[]): string {
    return names.join();
  }
}
```

Los desarrolladores de Angular a menudo adoptan la convención de incluir `Impure` en el `name` del pipe y el nombre de clase para indicar el potencial problema de rendimiento a otros desarrolladores.
