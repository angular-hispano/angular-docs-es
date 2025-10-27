# Compilación Ahead-of-time (AOT)

Una aplicación Angular consiste principalmente de componentes y sus plantillas HTML.
Debido a que los componentes y plantillas proporcionados por Angular no pueden ser entendidos directamente por el navegador, las aplicaciones Angular requieren un proceso de compilación antes de que puedan ejecutarse en un navegador.

El compilador ahead-of-time (AOT) de Angular convierte tu código HTML y TypeScript de Angular en código JavaScript eficiente durante la fase de construcción *antes* de que el navegador descargue y ejecute ese código.
Compilar tu aplicación durante el proceso de construcción proporciona un renderizado más rápido en el navegador.

Esta guía explica cómo especificar metadata y aplicar las opciones de compilador disponibles para compilar tus aplicaciones eficientemente usando el compilador AOT.

ÚTIL: [Mira a Alex Rickabaugh explicar el compilador de Angular](https://www.youtube.com/watch?v=anphffaCZrQ) en AngularConnect 2019.

Aquí hay algunas razones por las que podrías querer usar AOT.

| Razones                                 | Detalles |
|:---                                     |:---     |
| Renderizado más rápido                        | Con AOT, el navegador descarga una versión precompilada de la aplicación. El navegador carga código ejecutable para que pueda renderizar la aplicación inmediatamente, sin esperar a compilar la aplicación primero.                                       |
| Menos peticiones asíncronas             | El compilador *inlinea* las plantillas HTML externas y hojas de estilo CSS dentro del JavaScript de la aplicación, eliminando peticiones ajax separadas para esos archivos fuente.                                                                                  |
| Tamaño de descarga del framework Angular más pequeño | No hay necesidad de descargar el compilador de Angular si la aplicación ya está compilada. El compilador es aproximadamente la mitad de Angular mismo, por lo que omitirlo reduce dramáticamente la carga útil de la aplicación.                                              |
| Detectar errores de plantilla más temprano          | El compilador AOT detecta y reporta errores de enlace de plantilla durante el paso de construcción antes de que los usuarios puedan verlos.                                                                                                                                      |
| Mejor seguridad                         | AOT compila plantillas HTML y componentes en archivos JavaScript mucho antes de que se sirvan al cliente. Sin plantillas para leer y sin evaluación riesgosa de HTML o JavaScript del lado del cliente, hay menos oportunidades para ataques de inyección. |

## Eligiendo un compilador

Angular ofrece dos formas de compilar tu aplicación:

| Compilador Angular       | Detalles |
|:---                   |:---     |
| Just-in-Time \(JIT\)  | Compila tu aplicación en el navegador en tiempo de ejecución. Este era el predeterminado hasta Angular 8.        |
| Ahead-of-Time \(AOT\) | Compila tu aplicación y librerías en tiempo de construcción. Este es el predeterminado a partir de Angular 9. |

Cuando ejecutas los comandos CLI [`ng build`](cli/build) \(solo construcción\) o [`ng serve`](cli/serve) \(construir y servir localmente\), el tipo de compilación \(JIT o AOT\) depende del valor de la propiedad `aot` en tu configuración de construcción especificada en `angular.json`.
Por defecto, `aot` está establecido en `true` para nuevas aplicaciones CLI.

Consulta la [referencia de comandos CLI](cli) y [Construyendo y sirviendo aplicaciones Angular](tools/cli/build) para más información.

## Cómo funciona AOT

El compilador AOT de Angular extrae **metadata** para interpretar las partes de la aplicación que Angular se supone que debe administrar.
Puedes especificar la metadata explícitamente en **decorators** como `@Component()`, o implícitamente en las declaraciones del constructor de las clases decoradas.
La metadata le dice a Angular cómo construir instancias de las clases de tu aplicación e interactuar con ellas en tiempo de ejecución.

En el siguiente ejemplo, el objeto metadata `@Component()` y el constructor de la clase le dicen a Angular cómo crear y mostrar una instancia de `TypicalComponent`.

<docs-code language="typescript">

@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>'
})
export class TypicalComponent {
  data = input.required<TypicalData>();
  private someService = inject(SomeService);
}

</docs-code>

El compilador de Angular extrae la metadata *una vez* y genera una *factory* para `TypicalComponent`.
Cuando necesita crear una instancia de `TypicalComponent`, Angular llama a la factory, que produce un nuevo elemento visual, vinculado a una nueva instancia de la clase del componente con su dependencia inyectada.

### Fases de compilación

Hay tres fases de compilación AOT.

|     | Fase                  | Detalles                                                                                                                                                                                                                                                                                                        |
|:--- |:---                    |:---                                                                                                                                                                                                                                                                                                            |
| 1   | análisis de código          | En esta fase, el compilador TypeScript y el *recolector AOT* crean una representación del código fuente. El recolector no intenta interpretar la metadata que recolecta. Representa la metadata lo mejor que puede y registra errores cuando detecta una violación de sintaxis de metadata.                              |
| 2   | generación de código        | En esta fase, el `StaticReflector` del compilador interpreta la metadata recolectada en la fase 1, realiza validación adicional de la metadata y lanza un error si detecta una violación de restricción de metadata.                                                                                              |
| 3   | verificación de tipos de plantilla | En esta fase opcional, el *compilador de plantillas* de Angular usa el compilador TypeScript para validar las expresiones de enlace en plantillas. Puedes habilitar esta fase explícitamente estableciendo la opción de configuración `strictTemplates`; consulta [opciones del compilador de Angular](reference/configs/angular-compiler-options). |

### Restricciones de metadata

Escribes metadata en un *subconjunto* de TypeScript que debe cumplir con las siguientes restricciones generales:

* Limita [sintaxis de expresiones](#expression-syntax-limitations) al subconjunto soportado de JavaScript
* Solo referencia símbolos exportados después de [code folding](#code-folding)
* Solo llama [funciones soportadas](#supported-classes-and-functions) por el compilador
* Input/Outputs y miembros de clase enlazados a datos deben ser public o protected.Para pautas e instrucciones adicionales sobre preparar una aplicación para compilación AOT, consulta [Angular: Writing AOT-friendly applications](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f).

ÚTIL: Los errores en la compilación AOT ocurren comúnmente debido a metadata que no cumple con los requisitos del compilador \(como se describe más completamente a continuación\).
Para ayuda en entender y resolver estos problemas, consulta [Errores de Metadata AOT](tools/cli/aot-metadata-errors).

### Configurando la compilación AOT

Puedes proporcionar opciones en el [archivo de configuración TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) que controla el proceso de compilación.
Consulta [opciones del compilador de Angular](reference/configs/angular-compiler-options) para una lista completa de opciones disponibles.

## Fase 1: Análisis de código

El compilador TypeScript hace parte del trabajo analítico de la primera fase.
Emite los *archivos de definición de tipos* `.d.ts` con información de tipos que el compilador AOT necesita para generar código de aplicación.
Al mismo tiempo, el **recolector** AOT analiza la metadata registrada en los decorators de Angular y genera información de metadata en archivos **`.metadata.json`**, uno por archivo `.d.ts`.

Puedes pensar en `.metadata.json` como un diagrama de la estructura general de la metadata de un decorator, representada como un [árbol de sintaxis abstracta (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

ÚTIL: El [schema.ts](https://github.com/angular/angular/blob/main/packages/compiler-cli/src/metadata/schema.ts) de Angular describe el formato JSON como una colección de interfaces TypeScript.

### Limitaciones de sintaxis de expresiones

El recolector AOT solo entiende un subconjunto de JavaScript.
Define objetos metadata con la siguiente sintaxis limitada:

| Sintaxis                    | Ejemplo |
|:---                       |:---     |
| Objeto literal            | `{cherry: true, apple: true, mincemeat: false}`                        |
| Array literal             | `['cherries', 'flour', 'sugar']`                                       |
| Spread en array literal   | `['apples', 'flour', …]`                                               |
| Llamadas                     | `bake(ingredients)`                                                    |
| New                       | `new Oven()`                                                           |
| Acceso a propiedad           | `pie.slice`                                                            |
| Índice de array               | `ingredients[0]`                                                       |
| Referencia de identidad        | `Component`                                                            |
| Una cadena de plantilla         | <code>`pie is ${multiplier} times better than cake`</code> |
| Cadena literal            | `'pi'`                                                                 |
| Número literal            | `3.14153265`                                                           |
| Booleano literal           | `true`                                                                 |
| Null literal              | `null`                                                                 |
| Operador prefijo soportado | `!cake`                                                                |
| Operador binario soportado | `a+b`                                                                  |
| Operador condicional      | `a ? b : c`                                                            |
| Paréntesis               | `(a+b)`                                                                |

Si una expresión usa sintaxis no soportada, el recolector escribe un nodo de error en el archivo `.metadata.json`.
El compilador luego reporta el error si necesita esa pieza de metadata para generar el código de la aplicación.

ÚTIL: Si quieres que `ngc` reporte errores de sintaxis inmediatamente en lugar de producir un archivo `.metadata.json` con errores, establece la opción `strictMetadataEmit` en el archivo de configuración TypeScript.

<docs-code language="json">

"angularCompilerOptions": {
  …
  "strictMetadataEmit" : true
}

</docs-code>

Las librerías de Angular tienen esta opción para asegurar que todos los archivos `.metadata.json` de Angular estén limpios y es una mejor práctica hacer lo mismo al construir tus propias librerías.

### Sin funciones flecha

El compilador AOT no soporta [expresiones de función](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/function)
y [funciones flecha](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions), también llamadas funciones *lambda*.

Considera el siguiente decorator de componente:

<docs-code language="typescript">

@Component({
  …
  providers: [{provide: server, useFactory: () => new Server()}]
})

</docs-code>

El recolector AOT no soporta la función flecha, `() => new Server()`, en una expresión de metadata.
Genera un nodo de error en lugar de la función.
Cuando el compilador luego interpreta este nodo, reporta un error que te invita a convertir la función flecha en una *función exportada*.

Puedes corregir el error convirtiéndolo a esto:

<docs-code language="typescript">

export function serverFactory() {
  return new Server();
}

@Component({
  …
  providers: [{provide: server, useFactory: serverFactory}]
})

</docs-code>

En la versión 5 y posteriores, el compilador realiza automáticamente esta reescritura mientras emite el archivo `.js`.

### Code folding

El compilador solo puede resolver referencias a símbolos ***exportados***.
El recolector, sin embargo, puede evaluar una expresión durante la recolección y registrar el resultado en el `.metadata.json`, en lugar de la expresión original.
Esto te permite hacer un uso limitado de símbolos no exportados dentro de expresiones.

Por ejemplo, el recolector puede evaluar la expresión `1 + 2 + 3 + 4` y reemplazarla con el resultado, `10`.
Este proceso se llama *folding*.
Una expresión que puede reducirse de esta manera es *plegable*.

El recolector puede evaluar referencias a declaraciones `const` locales del módulo y declaraciones `var` y `let` inicializadas, eliminándolas efectivamente del archivo `.metadata.json`.

Considera la siguiente definición de componente:

<docs-code language="typescript">

const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  hero = input.required<Hero>();
}

</docs-code>

El compilador no podría referirse a la constante `template` porque no está exportada.
El recolector, sin embargo, puede plegar la constante `template` en la definición de metadata mediante la inlinización de su contenido.
El efecto es el mismo que si hubieras escrito:

<docs-code language="typescript">

@Component({
  selector: 'app-hero',
  template: '<div>{{hero().name}}</div>'
})
export class HeroComponent {
  hero = input.required<Hero>();
}

</docs-code>

Ya no hay una referencia a `template` y, por lo tanto, nada que moleste al compilador cuando luego interprete la salida del *recolector* en `.metadata.json`.

Puedes llevar este ejemplo un paso más allá incluyendo la constante `template` en otra expresión:

<docs-code language="typescript">

const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero().title}}</div>'
})
export class HeroComponent {
  hero = input.required<Hero>();
}

</docs-code>

El recolector reduce esta expresión a su cadena equivalente *plegada*:

<docs-code language="typescript">

'<div>{{hero().name}}</div><div>{{hero().title}}</div>'

</docs-code>

#### Sintaxis plegable

La siguiente tabla describe qué expresiones el recolector puede y no puede plegar:

| Sintaxis                           | Plegable |
|:---                              |:---      |
| Objeto literal                   | sí                                      |
| Array literal                    | sí                                      |
| Spread en array literal          | no                                       |
| Llamadas                            | no                                       |
| New                              | no                                       |
| Acceso a propiedad                  | sí, si el objetivo es plegable               |
| Índice de array                      | sí, si el objetivo y el índice son plegables    |
| Referencia de identidad               | sí, si es una referencia a un local     |
| Una plantilla sin sustituciones | sí                                      |
| Una plantilla con sustituciones    | sí, si las sustituciones son plegables   |
| Cadena literal                   | sí                                      |
| Número literal                   | sí                                      |
| Booleano literal                  | sí                                      |
| Null literal                     | sí                                      |
| Operador prefijo soportado        | sí, si el operando es plegable              |
| Operador binario soportado        | sí, si tanto izquierda como derecha son plegables |
| Operador condicional             | sí, si la condición es plegable            |
| Paréntesis                      | sí, si la expresión es plegable       |

Si una expresión no es plegable, el recolector la escribe en `.metadata.json` como un [AST](https://en.wikipedia.org/wiki/Abstract*syntax*tree) para que el compilador lo resuelva.

## Fase 2: generación de código

El recolector no intenta entender la metadata que recolecta y genera en `.metadata.json`.
Representa la metadata lo mejor que puede y registra errores cuando detecta una violación de sintaxis de metadata.
Es el trabajo del compilador interpretar el `.metadata.json` en la fase de generación de código.

El compilador entiende todas las formas de sintaxis que el recolector soporta, pero puede rechazar metadata *sintácticamente* correcta si la *semántica* viola las reglas del compilador.

### Símbolos public o protected

El compilador solo puede referenciar *símbolos exportados*.

* Los miembros de clase de componente decorados deben ser public o protected.
    No puedes hacer una propiedad `input()` private.

* Las propiedades enlazadas a datos también deben ser public o protected

### Clases y funciones soportadas

El recolector puede representar una llamada de función o creación de objeto con `new` siempre que la sintaxis sea válida.
El compilador, sin embargo, puede luego rechazar generar una llamada a una función *particular* o creación de un objeto *particular*.

El compilador solo puede crear instancias de ciertas clases, soporta solo decorators principales, y solo soporta llamadas a macros \(funciones o métodos estáticos\) que devuelven expresiones.

| Acción del compilador      | Detalles |
|:---                  |:---     |
| Nuevas instancias        | El compilador solo permite metadata que cree instancias de la clase `InjectionToken` de `@angular/core`.                                            |
| Decorators soportados | El compilador solo soporta metadata para los [decorators de Angular en el módulo `@angular/core`](api/core#decorators).                                   |
| Llamadas de función       | Las funciones factory deben ser funciones exportadas con nombre. El compilador AOT no soporta expresiones lambda \("funciones flecha"\) para funciones factory. |

### Funciones y llamadas de métodos estáticos

El recolector acepta cualquier función o método estático que contenga una sola declaración `return`.
El compilador, sin embargo, solo soporta macros en forma de funciones o métodos estáticos que devuelven una *expresión*.

Por ejemplo, considera la siguiente función:

<docs-code language="typescript">

export function wrapInArray<T>(value: T): T[] {
  return [value];
}

</docs-code>

Puedes llamar a `wrapInArray` en una definición de metadata porque devuelve el valor de una expresión que cumple con el subconjunto restrictivo de JavaScript del compilador.

Podrías usar `wrapInArray()` así:

<docs-code language="typescript">

@NgModule({
  declarations: wrapInArray(TypicalComponent)
})
export class TypicalModule {}

</docs-code>

El compilador trata este uso como si hubieras escrito:

<docs-code language="typescript">

@NgModule({
  declarations: [TypicalComponent]
})
export class TypicalModule {}

</docs-code>

El [`RouterModule`](api/router/RouterModule) de Angular exporta dos métodos estáticos macro, `forRoot` y `forChild`, para ayudar a declarar rutas raíz e hijas.
Revisa el [código fuente](https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L139 "RouterModule.forRoot source code")
de estos métodos para ver cómo los macros pueden simplificar la configuración de [NgModules](guide/ngmodules) complejos.

### Reescritura de metadata

El compilador trata objetos literales que contienen los campos `useClass`, `useValue`, `useFactory` y `data` de manera especial, convirtiendo la expresión que inicializa uno de estos campos en una variable exportada que reemplaza la expresión.
Este proceso de reescribir estas expresiones elimina todas las restricciones sobre lo que puede estar en ellas porque
el compilador no necesita conocer el valor de la expresión — solo necesita ser capaz de generar una referencia al valor.

Podrías escribir algo como:

<docs-code language="typescript">

class TypicalServer {

}

@NgModule({
  providers: [{provide: SERVER, useFactory: () => TypicalServer}]
})
export class TypicalModule {}

</docs-code>

Sin reescritura, esto sería inválido porque las lambdas no están soportadas y `TypicalServer` no está exportado.
Para permitir esto, el compilador automáticamente reescribe esto a algo como:

<docs-code language="typescript">

class TypicalServer {

}

export const θ0 = () => new TypicalServer();

@NgModule({
  providers: [{provide: SERVER, useFactory: θ0}]
})
export class TypicalModule {}

</docs-code>

Esto permite al compilador generar una referencia a `θ0` en la factory sin tener que saber qué contiene el valor de `θ0`.

El compilador hace la reescritura durante la emisión del archivo `.js`.
Sin embargo, no reescribe el archivo `.d.ts`, por lo que TypeScript no lo reconoce como una exportación.
Y no interfiere con la API exportada del módulo ES.

## Fase 3: Verificación de tipos de plantilla

Una de las características más útiles del compilador de Angular es la capacidad de verificar tipos de expresiones dentro de plantillas, y capturar cualquier error antes de que causen fallos en tiempo de ejecución.
En la fase de verificación de tipos de plantilla, el compilador de plantillas de Angular usa el compilador TypeScript para validar las expresiones de enlace en plantillas.

Habilita esta fase explícitamente agregando la opción de compilador `"fullTemplateTypeCheck"` en las `"angularCompilerOptions"` del archivo de configuración TypeScript del proyecto
(consulta [Opciones del Compilador de Angular](reference/configs/angular-compiler-options)).

La validación de plantilla produce mensajes de error cuando se detecta un error de tipo en una expresión de enlace de
plantilla, similar a cómo el compilador TypeScript reporta errores de tipo en el código de un
archivo `.ts`.

Por ejemplo, considera el siguiente componente:

<docs-code language="typescript">

@Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}'
})
class MyComponent {
  person?: Person;
}

</docs-code>

Esto produce el siguiente error:

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?

</docs-code>

El nombre de archivo reportado en el mensaje de error, `my.component.ts.MyComponent.html`, es un archivo sintético
generado por el compilador de plantillas que contiene los contenidos de la plantilla de la clase `MyComponent`.
El compilador nunca escribe este archivo en el disco.
Los números de línea y columna son relativos a la cadena de plantilla en la anotación `@Component` de la clase, `MyComponent` en este caso.
Si un componente usa `templateUrl` en lugar de `template`, los errores se reportan en el archivo HTML referenciado por el `templateUrl` en lugar de un archivo sintético.

La ubicación del error es el comienzo del nodo de texto que contiene la expresión de interpolación con el error.
Si el error está en un enlace de atributo como `[value]="person.address.street"`, la ubicación del error
es la ubicación del atributo que contiene el error.

La validación usa el verificador de tipos TypeScript y las opciones suministradas al compilador TypeScript para controlar qué tan detallada es la validación de tipos.
Por ejemplo, si se especifica `strictTypeChecks`, el error

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'

</docs-code>

se reporta además del mensaje de error anterior.

### Reducción de tipos

La expresión usada en una directiva `ngIf` se usa para reducir uniones de tipos en el
compilador de plantillas de Angular, de la misma manera que la expresión `if` lo hace en TypeScript.
Por ejemplo, para evitar el error `Object is possibly 'undefined'` en la plantilla anterior, modifícala para solo emitir la interpolación si el valor de `person` está inicializado como se muestra a continuación:

<docs-code language="typescript">

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.address.street}} </span>'
})
class MyComponent {
  person?: Person;
}

</docs-code>

Usar `*ngIf` permite al compilador TypeScript inferir que el `person` usado en la expresión de enlace nunca será `undefined`.

Para más información sobre reducción de tipos de entrada, consulta [Mejorando la verificación de tipos de plantilla para directivas personalizadas](guide/directives/structural-directives#directive-type-checks).

### Operador de aserción de tipo no nulo

Usa el operador de aserción de tipo no nulo para suprimir el error `Object is possibly 'undefined'` cuando es inconveniente usar `*ngIf` o cuando alguna restricción en el componente asegura que la expresión siempre es no nula cuando la expresión de enlace es interpolada.

En el siguiente ejemplo, las propiedades `person` y `address` siempre se establecen juntas, lo que implica que `address` siempre es no nulo si `person` es no nulo.
No hay una manera conveniente de describir esta restricción a TypeScript y al compilador de plantillas, pero el error se suprime en el ejemplo usando `address!.street`.

<docs-code language="typescript">

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.name}} lives on {{address!.street}} </span>'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

</docs-code>

El operador de aserción no nulo debe usarse con moderación ya que la refactorización del componente podría romper esta restricción.

En este ejemplo se recomienda incluir la verificación de `address` en el `*ngIf` como se muestra a continuación:

<docs-code language="typescript">

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person &amp;&amp; address"> {{person.name}} lives on {{address.street}} </span>'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

</docs-code>
