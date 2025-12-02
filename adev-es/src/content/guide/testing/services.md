# Probar servicios

NOTA: Aunque esta guía se está actualizando para Vitest, algunos ejemplos de código actualmente usan sintaxis y APIs de Karma/Jasmine. Estamos trabajando activamente para proporcionar equivalentes de Vitest donde sea aplicable.

Para verificar que tus servicios están funcionando como pretendes, puedes escribir pruebas específicamente para ellos.

Los servicios son a menudo los archivos más sencillos de probar unitariamente.
Aquí hay algunas pruebas unitarias síncronas y asíncronas del `ValueService` escritas sin ayuda de las utilidades de pruebas de Angular.

<docs-code header="demo.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="ValueService"/>

## Probar servicios con el `TestBed`

Tu aplicación depende de la [inyección de dependencias (DI)](guide/di) de Angular para crear servicios.
Cuando un servicio tiene un servicio dependiente, DI encuentra o crea ese servicio dependiente.
Y si ese servicio dependiente tiene sus propias dependencias, DI las encuentra-o-crea también.

Como _consumidor_ del servicio, no te preocupas por nada de esto.
No te preocupas por el orden de los argumentos del constructor o cómo se crean.

Como _probador_ del servicio, debes al menos pensar sobre el primer nivel de dependencias del servicio pero _puedes_ dejar que Angular DI haga la creación del servicio y se ocupe del orden de los argumentos del constructor cuando usas la utilidad de pruebas `TestBed` para proporcionar y crear servicios.

## Angular `TestBed`

El `TestBed` es la más importante de las utilidades de pruebas de Angular.
El `TestBed` crea un módulo _test_ de Angular construido dinámicamente que emula un [@NgModule](guide/ngmodules) de Angular.

El método `TestBed.configureTestingModule()` toma un objeto de metadata que puede tener la mayoría de las propiedades de un [@NgModule](guide/ngmodules).

Para probar un servicio, estableces la propiedad de metadata `providers` con un array de los servicios que probarás o simularás.

<docs-code header="demo.testbed.spec.ts (proporcionar ValueService en beforeEach)" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-before-each"/>

Luego inyéctalo dentro de una prueba llamando a `TestBed.inject()` con la clase del servicio como argumento.

CONSEJO: `TestBed.get()` fue deprecado a partir de la versión 9 de Angular.
Para ayudar a minimizar cambios disruptivos, Angular introduce una nueva función llamada `TestBed.inject()`, que deberías usar en su lugar.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-it"/>

O dentro del `beforeEach()` si prefieres inyectar el servicio como parte de tu configuración.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-before-each"> </docs-code>

Cuando pruebes un servicio con una dependencia, proporciona el mock en el array `providers`.

En el siguiente ejemplo, el mock es un objeto spy.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-before-each"/>

La prueba consume ese spy de la misma manera que lo hizo antes.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-it"/>

## Probar sin `beforeEach()`

La mayoría de suites de prueba en esta guía llaman a `beforeEach()` para establecer las precondiciones para cada prueba `it()` y dependen del `TestBed` para crear clases e inyectar servicios.

Hay otra escuela de pruebas que nunca llama a `beforeEach()` y prefiere crear clases explícitamente en lugar de usar el `TestBed`.

Aquí está cómo podrías reescribir una de las pruebas de `MasterService` en ese estilo.

Comienza poniendo código preparatorio reutilizable en una función *setup* en lugar de `beforeEach()`.

<docs-code header="demo.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup"/>

La función `setup()` retorna un objeto literal con las variables, como `masterService`, que una prueba podría referenciar.
No defines variables _semi-globales_ \(por ejemplo, `let masterService: MasterService`\) en el cuerpo del `describe()`.

Luego cada prueba invoca `setup()` en su primera línea, antes de continuar con pasos que manipulan el sujeto de prueba y afirman expectativas.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-test"/>

Nota cómo la prueba usa [_asignación por desestructuración_](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) para extraer las variables de setup que necesita.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup-call"/>

Muchos desarrolladores sienten que este enfoque es más limpio y más explícito que el estilo tradicional de `beforeEach()`.

Aunque esta guía de pruebas sigue el estilo tradicional y los [schematics por defecto del CLI](https://github.com/angular/angular-cli) generan archivos de prueba con `beforeEach()` y `TestBed`, siéntete libre de adoptar _este enfoque alternativo_ en tus propios proyectos.

## Probar servicios HTTP

Los servicios de datos que hacen llamadas HTTP a servidores remotos típicamente inyectan y delegan al servicio [`HttpClient`](guide/http/testing) de Angular para llamadas XHR.

Puedes probar un servicio de datos con un spy de `HttpClient` inyectado como probarías cualquier servicio con una dependencia.

<docs-code header="hero.service.spec.ts (pruebas con spies)" path="adev/src/content/examples/testing/src/app/model/hero.service.spec.ts" visibleRegion="test-with-spies"/>

IMPORTANTE: Los métodos de `HeroService` retornan `Observables`.
Debes _suscribirte_ a un observable para \(a\) hacer que se ejecute y \(b\) afirmar que el método tiene éxito o falla.

El método `subscribe()` toma un callback de éxito \(`next`\) y uno de fallo \(`error`\).
Asegúrate de proporcionar _ambos_ callbacks para que captures errores.
Descuidar hacerlo produce un error asíncrono no capturado de observable que el test runner probablemente atribuirá a una prueba completamente diferente.

## `HttpClientTestingModule`

Las interacciones extendidas entre un servicio de datos y el `HttpClient` pueden ser complejas y difíciles de simular con spies.

El `HttpClientTestingModule` puede hacer que estos escenarios de pruebas sean más manejables.

Mientras que la _muestra de código_ que acompaña esta guía demuestra `HttpClientTestingModule`, esta página difiere a la [guía de Http](guide/http/testing), que cubre pruebas con el `HttpClientTestingModule` en detalle.
