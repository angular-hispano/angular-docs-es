# Directivas estructurales

Las directivas estructurales son directivas aplicadas a un elemento `<ng-template>` que renderizan condicionalmente o repetidamente el contenido de ese `<ng-template>`.

## Caso de uso de ejemplo

En esta guía construirás una directiva estructural que obtiene datos de una fuente de datos dada y renderiza su plantilla cuando esos datos están disponibles. Esta directiva se llama `SelectDirective`, después de la palabra clave SQL `SELECT`, y coincide con un selector de atributo `[select]`.

`SelectDirective` tendrá una entrada que nombra la fuente de datos a usar, que llamarás `selectFrom`. El prefijo `select` para esta entrada es importante para la [sintaxis abreviada](#sintaxis-abreviada-de-directivas-estructurales). La directiva instanciará su `<ng-template>` con un contexto de plantilla que proporciona los datos seleccionados.

El siguiente es un ejemplo de cómo se vería usar esta directiva directamente en un `<ng-template>`:

```angular-html
<ng-template select let-data [selectFrom]="source">
  <p>Los datos son: {{ data }}</p>
</ng-template>
```

La directiva estructural puede esperar a que los datos estén disponibles y luego renderizar su `<ng-template>`.

ÚTIL: Ten en cuenta que el elemento `<ng-template>` de Angular define una plantilla que no renderiza nada por defecto, si simplemente envuelves elementos en un `<ng-template>` sin aplicar una directiva estructural, esos elementos no se renderizarán.

Para más información, consulta la documentación de la [API ng-template](api/core/ng-template).

## Sintaxis abreviada de directivas estructurales

Angular soporta una sintaxis abreviada para directivas estructurales que evita la necesidad de escribir explícitamente un elemento `<ng-template>`.

Las directivas estructurales pueden aplicarse directamente en un elemento anteponiendo un asterisco (`*`) al selector de la directiva, por ejemplo: `*select`. Angular transforma el asterisco delante de una directiva estructural en un `<ng-template>` que aloja la directiva y envuelve el elemento y sus descendientes.

Puedes usar esto con `SelectDirective` de la siguiente manera:

```angular-html
<p *select="let data from source">Los datos son: {{data}}</p>
```

Este ejemplo muestra la flexibilidad de la sintaxis abreviada de directivas estructurales, que a veces se llama _microsintaxis_.

Cuando se usa de esta manera, solo la directiva estructural y sus enlaces se aplican al `<ng-template>`. Cualquier otro atributo o enlace en la etiqueta `<p>` se deja intacto. Por ejemplo, estas dos formas son equivalentes:

```angular-html
<!-- Sintaxis abreviada: -->
<p class="data-view" *select="let data from source">Los datos son: {{data}}</p>

<!-- Sintaxis de forma larga: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">Los datos son: {{data}}</p>
</ng-template>
```

La sintaxis abreviada se expande a través de un conjunto de convenciones. Una [gramática](#referencia-de-sintaxis-de-directivas-estructurales) más completa se define a continuación, pero en el ejemplo anterior, esta transformación puede explicarse de la siguiente manera:

La primera parte de la expresión `*select` es `let data`, que declara una variable de plantilla `data`. Como no sigue ninguna asignación, la variable de plantilla se vincula a la propiedad del contexto de plantilla `$implicit`.

La segunda pieza de sintaxis es un par clave-expresión, `from source`. `from` es una clave de enlace y `source` es una expresión de plantilla regular. Las claves de enlace se mapean a propiedades transformándolas a PascalCase y anteponiendo el selector de la directiva estructural. La clave `from` se mapea a `selectFrom`, que luego se vincula a la expresión `source`. Por eso muchas directivas estructurales tendrán entradas que están todas prefijadas con el selector de la directiva estructural.

## Una directiva estructural por elemento

Solo puedes aplicar una directiva estructural por elemento cuando usas la sintaxis abreviada. Esto es porque solo hay un elemento `<ng-template>` en el que se desenvuelve esa directiva. Múltiples directivas requerirían múltiples `<ng-template>` anidados, y no está claro cuál directiva debería ser la primera. `<ng-container>` puede usarse para crear capas de envoltorio cuando múltiples directivas estructurales necesitan aplicarse alrededor del mismo elemento DOM físico o componente, lo que permite al usuario definir la estructura anidada.

## Creando una directiva estructural

Esta sección te guía a través de la creación de `SelectDirective`.

<docs-workflow>
<docs-step title="Generar la directiva">
Usando Angular CLI, ejecuta el siguiente comando, donde `select` es el nombre de la directiva:

```shell
ng generate directive select
```

Angular crea la clase de directiva y especifica el selector CSS, `[select]`, que identifica la directiva en una plantilla.
</docs-step>
<docs-step title="Convertir la directiva estructural">
Importa `TemplateRef` y `ViewContainerRef`. Inyecta `TemplateRef` y `ViewContainerRef` en la directiva como propiedades privadas.

```ts
import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}

```

</docs-step>
<docs-step title="Añadir la entrada 'selectFrom'">
Añade una propiedad `selectFrom` `input()`.

```ts
export class SelectDirective {
  // ...

  selectFrom = input.required<DataSource>();
}
```

</docs-step>
<docs-step title="Añadir la lógica de negocio">
Con `SelectDirective` ahora estructurada como una directiva estructural con su entrada, ahora puedes añadir la lógica para obtener los datos y renderizar la plantilla con ellos:

```ts
export class SelectDirective {
  // ...

  async ngOnInit() {
    const data = await this.selectFrom.load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // Crear la vista embebida con un objeto de contexto que contiene
      // los datos a través de la clave `$implicit`.
      $implicit: data,
    });
  }
}
```

</docs-step>
</docs-workflow>

¡Y listo! `SelectDirective` está funcionando. Un paso de seguimiento podría ser [añadir soporte de verificación de tipos de plantilla](#tipando-el-contexto-de-la-directiva).

## Referencia de sintaxis de directivas estructurales

Cuando escribas tus propias directivas estructurales, usa la siguiente sintaxis:

<docs-code hideCopy language="typescript">

_:prefix="( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )_"

</docs-code>

Los siguientes patrones describen cada parte de la gramática de directivas estructurales:

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| Palabra clave  | Detalles                                             |
| :------------- | :--------------------------------------------------- |
| `prefix`        | Clave de atributo HTML                               |
| `key`          | Clave de atributo HTML                               |
| `local`        | Nombre de variable local usado en la plantilla       |
| `export`       | Valor exportado por la directiva bajo un nombre dado |
| `expression`   | Expresión estándar de Angular                        |

### Cómo Angular traduce la sintaxis abreviada

Angular translates structural directive shorthand into the normal binding syntax as follows:

| Shorthand                      | Translation                                                   |
|:------------------------------ |:------------------------------------------------------------- |
| `prefix` and naked `expression` | `[prefix]="expression"`                                        |
| `keyExp`                       | `[prefixKey]="expression"` (The `prefix` is added to the `key`) |
| `let local`                    | `let-local="export"`                                          |

## Ejemplos de sintaxis abreviada

La siguiente tabla proporciona ejemplos de sintaxis abreviada:

| Sintaxis abreviada                                                        | Cómo Angular interpreta la sintaxis                                                                           |
|:------------------------------------------------------------------------- |:------------------------------------------------------------------------------------------------------------- |
| `*myDir="let item of [1,2,3]"`                                            | `<ng-template myDir let-item [myDirOf]="[1, 2, 3]">`                                                          |
| `*myDir="let item of [1,2,3] as items; trackBy: myTrack; index as i"`     | `<ng-template myDir let-item [myDirOf]="[1,2,3]" let-items="myDirOf" [myDirTrackBy]="myTrack" let-i="index">` |
| `*ngComponentOutlet="componentClass";`                                    | `<ng-template [ngComponentOutlet]="componentClass">`                                                          |
| `*ngComponentOutlet="componentClass; inputs: myInputs";`                  | `<ng-template [ngComponentOutlet]="componentClass" [ngComponentOutletInputs]="myInputs">`                     |
| `*myDir="exp as value"`                                                   | `<ng-template [myDir]="exp" let-value="myDir">`                                                               |

## Mejorando la verificación de tipos de plantilla para directivas personalizadas

Puedes mejorar la verificación de tipos de plantilla para directivas personalizadas añadiendo guardias de plantilla a tu definición de directiva.
Estos guardias ayudan al verificador de tipos de plantilla de Angular a encontrar errores en la plantilla en tiempo de compilación, lo que puede evitar errores en tiempo de ejecución.
Dos tipos diferentes de guardias son posibles:

- `ngTemplateGuard_(input)` te permite controlar cómo una expresión de entrada debe estrecharse basándose en el tipo de una entrada específica.
- `ngTemplateContextGuard` se usa para determinar el tipo del objeto de contexto para la plantilla, basándose en el tipo de la directiva misma.

Esta sección proporciona ejemplos de ambos tipos de guardias.
Para más información, consulta [Verificación de tipos de plantilla](tools/cli/template-typecheck "Guía de verificación de tipos de plantilla").

### Estrechamiento de tipos con guardias de plantilla

Una directiva estructural en una plantilla controla si esa plantilla se renderiza en tiempo de ejecución. Algunas directivas estructurales quieren realizar estrechamiento de tipos basándose en el tipo de expresión de entrada.

Hay dos estrechamientos que son posibles con guardias de entrada:

- Estrechar la expresión de entrada basándose en una función de aserción de tipo TypeScript.
- Estrechar la expresión de entrada basándose en su veracidad.

Para estrechar la expresión de entrada definiendo una función de aserción de tipo:

```ts
// Esta directiva solo renderiza su plantilla si el actor es un usuario.
// Quieres aseverar que dentro de la plantilla, el tipo de la expresión `actor`
// se estrecha a `User`.
@Directive(...)
class ActorIsUser {
  actor = input<User | Robot>();

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User | Robot): expr is User {
    // La declaración de retorno es innecesaria en la práctica, pero incluida para
    // prevenir errores de TypeScript.
    return true;
  }
}
```

La verificación de tipos se comportará dentro de la plantilla como si `ngTemplateGuard_actor` hubiera sido aseverada en la expresión vinculada a la entrada.

Algunas directivas solo renderizan sus plantillas cuando una entrada es veraz. No es posible capturar la semántica completa de veracidad en una función de aserción de tipo, por lo que en su lugar se puede usar un tipo literal de `'binding'` para señalar al verificador de tipos de plantilla que la expresión de enlace misma debería usarse como guardián:

```ts
@Directive(...)
class CustomIf {
  condition = input.required<boolean>();

  static ngTemplateGuard_condition: 'binding';
}
```

El verificador de tipos de plantilla se comportará como si la expresión vinculada a `condition` fuera aseverada como veraz dentro de la plantilla.

### Tipando el contexto de la directiva

Si tu directiva estructural proporciona un contexto a la plantilla instanciada, puedes tiparlo correctamente dentro de la plantilla proporcionando una función de aserción de tipo estática `ngTemplateContextGuard`. Esta función puede usar el tipo de la directiva para derivar el tipo del contexto, lo que es útil cuando el tipo de la directiva es genérico.

Para `SelectDirective` descrita anteriormente, puedes implementar un `ngTemplateContextGuard` para especificar correctamente el tipo de datos, incluso si la fuente de datos es genérica.

```ts
// Declarar una interfaz para el contexto de la plantilla:
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // El tipo genérico `T` de la directiva se inferirá del tipo `DataSource`
  // pasado a la entrada.
  selectFrom = input.required<DataSource<T>>();

  // Estrechar el tipo del contexto usando el tipo genérico de la directiva.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // Como antes, el cuerpo del guardia no se usa en tiempo de ejecución, e incluido solo para evitar
    // errores de TypeScript.
    return true;
  }
}
```
