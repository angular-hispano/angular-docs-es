# Optimizando el tamaño de la aplicación con tokens de inyección ligeros

Esta página proporciona una visión conceptual de una técnica de inyección de dependencias que se recomienda para desarrolladores de librerías.
Diseñar tu librería con *tokens de inyección ligeros* ayuda a optimizar el tamaño del paquete de las aplicaciones cliente que usan tu librería.

Puedes gestionar la estructura de dependencias entre tus componentes y servicios inyectables para optimizar el tamaño del paquete usando proveedores tree-shakable.
Esto normalmente asegura que si un componente o servicio provisto nunca se usa realmente por la aplicación, el compilador puede eliminar su código del paquete.

Debido a la forma en que Angular almacena los tokens de inyección, es posible que tal componente o servicio no utilizado termine en el paquete de todas formas.
Esta página describe un patrón de diseño de inyección de dependencias que soporta tree-shaking adecuado usando tokens de inyección ligeros.

El patrón de diseño de tokens de inyección ligeros es especialmente importante para desarrolladores de librerías.
Asegura que cuando una aplicación usa solo algunas de las capacidades de tu librería, el código no utilizado puede ser eliminado del paquete de la aplicación cliente.

Cuando una aplicación usa tu librería, puede haber algunos servicios que tu librería suministra que la aplicación cliente no usa.
En este caso, el desarrollador de la aplicación debería esperar que ese servicio sea tree-shaken, y no contribuya al tamaño de la aplicación compilada.
Como el desarrollador de la aplicación no puede conocer o remediar un problema de tree-shaking en la librería, es responsabilidad del desarrollador de la librería hacerlo.
Para prevenir la retención de componentes no utilizados, tu librería debería usar el patrón de diseño de tokens de inyección ligeros.

## Cuándo se retienen los tokens

Para explicar mejor la condición bajo la cual ocurre la retención de tokens, considera una librería que proporciona un componente library-card.
Este componente contiene un cuerpo y puede contener un encabezado opcional:

<docs-code language="html">

<lib-card>;
  <lib-header>…</lib-header>;
</lib-card>;

</docs-code>

En una implementación probable, el componente `<lib-card>` usa `@ContentChild()` o `@ContentChildren()` para obtener `<lib-header>` y `<lib-body>`, como en el siguiente ejemplo:

<docs-code language="typescript" highlight="[12]">
@Component({
  selector: 'lib-header',
  …,
})
class LibHeaderComponent {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCardComponent {
  @ContentChild(LibHeaderComponent) header: LibHeaderComponent|null = null;
}

</docs-code>

Dado que `<lib-header>` es opcional, el elemento puede aparecer en la plantilla en su forma mínima, `<lib-card></lib-card>`.
En este caso, `<lib-header>` no se usa y esperarías que sea tree-shaken, pero eso no es lo que sucede.
Esto es porque `LibCardComponent` en realidad contiene dos referencias al `LibHeaderComponent`:

<docs-code language="typescript">
@ContentChild(LibHeaderComponent) header: LibHeaderComponent;
</docs-code>

* Una de estas referencias está en la *posición de tipo*: es decir, especifica `LibHeaderComponent` como un tipo: `header: LibHeaderComponent;`.
* La otra referencia está en la *posición de valor*: es decir, LibHeaderComponent es el valor del decorador de parámetro `@ContentChild()`: `@ContentChild(LibHeaderComponent)`.

El compilador maneja las referencias de tokens en estas posiciones de manera diferente:

* El compilador borra las referencias de *posición de tipo* después de la conversión desde TypeScript, por lo que no tienen impacto en tree-shaking.
* El compilador debe mantener las referencias de *posición de valor* en tiempo de ejecución, lo que **previene** que el componente sea tree-shaken.

En el ejemplo, el compilador retiene el token `LibHeaderComponent` que ocurre en la posición de valor.
Esto previene que el componente referenciado sea tree-shaken, incluso si la aplicación no usa realmente `<lib-header>` en ningún lugar.
Si el código, plantilla y estilos de `LibHeaderComponent` se combinan para volverse demasiado grandes, incluirlo innecesariamente puede aumentar significativamente el tamaño de la aplicación cliente.

## Cuándo usar el patrón de token de inyección ligero

El problema de tree-shaking surge cuando un componente se usa como un token de inyección.
Hay dos casos cuando eso puede suceder:

* El token se usa en la posición de valor de una [consulta de contenido](guide/components/queries#content-queries).
* El token se usa como un especificador de tipo para inyección de constructor.

En el siguiente ejemplo, ambos usos del token `OtherComponent` causan retención de `OtherComponent`, previniendo que sea tree-shaken cuando no se usa:

<docs-code language="typescript" highlight="[[2],[4]]">
class MyComponent {
  constructor(@Optional() other: OtherComponent) {}

  @ContentChild(OtherComponent) other: OtherComponent|null;
}
</docs-code>

Aunque los tokens usados solo como especificadores de tipo se eliminan cuando se convierten a JavaScript, todos los tokens usados para inyección de dependencias se necesitan en tiempo de ejecución.
Estos efectivamente cambian `constructor(@Optional() other: OtherComponent)` a `constructor(@Optional() @Inject(OtherComponent) other)`.
El token ahora está en una posición de valor, lo que causa que el tree-shaker mantenga la referencia.

ÚTIL: Las librerías deberían usar [proveedores tree-shakable](guide/di/dependency-injection#providing-dependency) para todos los servicios, proporcionando dependencias a nivel raíz en lugar de en componentes o módulos.

## Usando tokens de inyección ligeros

El patrón de diseño de token de inyección ligero consiste en usar una pequeña clase abstracta como un token de inyección, y proporcionar la implementación real en una etapa posterior.
La clase abstracta se retiene, no es tree-shaken, pero es pequeña y no tiene un impacto material en el tamaño de la aplicación.

El siguiente ejemplo muestra cómo esto funciona para el `LibHeaderComponent`:

<docs-code language="typescript" language="[[1],[6],[17]]">
abstract class LibHeaderToken {}

@Component({
  selector: 'lib-header',
  providers: [
    {provide: LibHeaderToken, useExisting: LibHeaderComponent}
  ]
  …,
})
class LibHeaderComponent extends LibHeaderToken {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCardComponent {
  @ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;
}
</docs-code>

En este ejemplo, la implementación de `LibCardComponent` ya no se refiere a `LibHeaderComponent` ni en la posición de tipo ni en la posición de valor.
Esto permite que ocurra tree-shaking completo de `LibHeaderComponent`.
El `LibHeaderToken` se retiene, pero es solo una declaración de clase, sin implementación concreta.
Es pequeño y no impacta materialmente el tamaño de la aplicación cuando se retiene después de la compilación.

En su lugar, `LibHeaderComponent` mismo implementa la clase abstracta `LibHeaderToken`.
Puedes usar de forma segura ese token como el proveedor en la definición del componente, permitiendo que Angular inyecte correctamente el tipo concreto.

Para resumir, el patrón de token de inyección ligero consiste en lo siguiente:

1. Un token de inyección ligero que se representa como una clase abstracta.
1. Una definición de componente que implementa la clase abstracta.
1. Inyección del patrón ligero, usando `@ContentChild()` o `@ContentChildren()`.
1. Un proveedor en la implementación del token de inyección ligero que asocia el token de inyección ligero con la implementación.

### Usar el token de inyección ligero para definición de API

Un componente que inyecta un token de inyección ligero podría necesitar invocar un método en la clase inyectada.
El token ahora es una clase abstracta. Como el componente inyectable implementa esa clase, también debes declarar un método abstracto en la clase abstracta del token de inyección ligero.
La implementación del método, con toda su sobrecarga de código, reside en el componente inyectable que puede ser tree-shaken.
Esto permite que el padre se comunique con el hijo, si está presente, de una manera type-safe.

Por ejemplo, el `LibCardComponent` ahora consulta `LibHeaderToken` en lugar de `LibHeaderComponent`.
El siguiente ejemplo muestra cómo el patrón permite que `LibCardComponent` se comunique con el `LibHeaderComponent` sin referirse realmente a `LibHeaderComponent`:

<docs-code language="typescript" highlight="[[3],[13,16],[27]]">
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
  selector: 'lib-header',
  providers: [
    {provide: LibHeaderToken, useExisting: LibHeaderComponent}
  ]
  …,
})
class LibHeaderComponent extends LibHeaderToken {
  doSomething(): void {
    // Implementación concreta de `doSomething`
  }
}

@Component({
  selector: 'lib-card',
  …,
})
class LibCardComponent implement AfterContentInit {
  @ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;

  ngAfterContentInit(): void {
    if (this.header !== null) {
      this.header?.doSomething();
    }
  }
}
</docs-code>

En este ejemplo, el padre consulta el token para obtener el componente hijo, y almacena la referencia del componente resultante si está presente.
Antes de llamar un método en el hijo, el componente padre verifica si el componente hijo está presente.
Si el componente hijo ha sido tree-shaken, no hay referencia en tiempo de ejecución a él, y no hay llamada a su método.

### Nombrar tu token de inyección ligero

Los tokens de inyección ligeros solo son útiles con componentes.
La guía de estilo de Angular sugiere que nombres los componentes usando el sufijo "Component".
El ejemplo "LibHeaderComponent" sigue esta convención.

Deberías mantener la relación entre el componente y su token mientras aún los distingues.
El estilo recomendado es usar el nombre base del componente con el sufijo "`Token`" para nombrar tus tokens de inyección ligeros: "`LibHeaderToken`."
