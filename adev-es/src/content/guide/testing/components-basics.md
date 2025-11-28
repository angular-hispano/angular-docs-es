# Fundamentos de probar componentes

Un componente, a diferencia de todas las otras partes de una aplicación Angular, combina una plantilla HTML y una clase TypeScript.
El componente verdaderamente es la plantilla y la clase _trabajando juntas_.
Para probar adecuadamente un componente, deberías probar que trabajen juntos como se pretende.

Tales pruebas requieren crear el elemento host del componente en el DOM del navegador, como hace Angular, e investigar la interacción de la clase del componente con el DOM como se describe en su plantilla.

El `TestBed` de Angular facilita este tipo de pruebas como verás en las siguientes secciones.
Pero en muchos casos, _probar la clase del componente sola_, sin involucramiento del DOM, puede validar mucho del comportamiento del componente de una manera más directa y obvia.

## Pruebas del DOM de componentes

Un componente es más que solo su clase.
Un componente interactúa con el DOM y con otros componentes.
Las clases solas no pueden decirte si el componente va a renderizar correctamente, responder a la entrada y gestos del usuario, o integrarse con sus componentes padre e hijo.

- ¿Está `Lightswitch.clicked()` vinculado a algo de modo que el usuario pueda invocarlo?
- ¿Se muestra el `Lightswitch.message`?
- ¿Puede el usuario realmente seleccionar el héroe mostrado por `DashboardHeroComponent`?
- ¿Se muestra el nombre del héroe como se espera \(como mayúsculas\)?
- ¿Se muestra el mensaje de bienvenida por la plantilla de `WelcomeComponent`?

Estas podrían no ser preguntas problemáticas para los componentes simples precedentes ilustrados.
Pero muchos componentes tienen interacciones complejas con los elementos DOM descritos en sus plantillas, causando que HTML aparezca y desaparezca a medida que el estado del componente cambia.

Para responder estos tipos de preguntas, tienes que crear los elementos DOM asociados con los componentes, debes examinar el DOM para confirmar que el estado del componente se muestra correctamente en los momentos apropiados, y debes simular la interacción del usuario con la pantalla para determinar si esas interacciones hacen que el componente se comporte como se espera.

Para escribir estos tipos de prueba, usarás características adicionales del `TestBed` así como otros helpers de pruebas.

### Pruebas generadas por el CLI

El CLI crea un archivo de prueba inicial para ti por defecto cuando le pides que genere un nuevo componente.

Por ejemplo, el siguiente comando del CLI genera un `BannerComponent` en la carpeta `app/banner` \(con plantilla y estilos inline\):

```shell
ng generate component banner --inline-template --inline-style --module app
```

También genera un archivo de prueba inicial para el componente, `banner-external.component.spec.ts`, que se ve así:

<docs-code header="banner-external.component.spec.ts (inicial)" path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v1"/>

CONSEJO: Porque `compileComponents` es asíncrono, usa la función utilitaria [`waitForAsync`](api/core/testing/waitForAsync) importada de `@angular/core/testing`.

Consulta la sección [waitForAsync](guide/testing/components-scenarios#waitForAsync) para más detalles.

### Reducir la configuración

Solo las últimas tres líneas de este archivo realmente prueban el componente y todo lo que hacen es afirmar que Angular puede crear el componente.

El resto del archivo es código de configuración boilerplate anticipando pruebas más avanzadas que _podrían_ volverse necesarias si el componente evoluciona en algo sustancial.

Aprenderás sobre estas características de prueba avanzadas en las siguientes secciones.
Por ahora, puedes reducir radicalmente este archivo de prueba a un tamaño más manejable:

<docs-code header="banner-initial.component.spec.ts (mínimo)" path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v2"/>

En este ejemplo, el objeto de metadata pasado a `TestBed.configureTestingModule` simplemente declara `BannerComponent`, el componente a probar.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="configureTestingModule"/>

CONSEJO: No hay necesidad de declarar o importar nada más.
El módulo de prueba por defecto está pre-configurado con algo como el `BrowserModule` de `@angular/platform-browser`.

Más tarde llamarás a `TestBed.configureTestingModule()` con imports, providers y más declarations para adaptarse a tus necesidades de pruebas.
Métodos `override` opcionales pueden ajustar aún más aspectos de la configuración.

### `createComponent()`

Después de configurar `TestBed`, llamas a su método `createComponent()`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="createComponent"/>

`TestBed.createComponent()` crea una instancia del `BannerComponent`, agrega un elemento correspondiente al DOM del test-runner, y retorna un [`ComponentFixture`](#componentfixture).

IMPORTANTE: No re-configures `TestBed` después de llamar a `createComponent`.

El método `createComponent` congela la definición actual del `TestBed`, cerrándola a más configuración.

No puedes llamar más métodos de configuración del `TestBed`, ni `configureTestingModule()`, ni `get()`, ni ninguno de los métodos `override...`.
Si lo intentas, `TestBed` lanza un error.

### `ComponentFixture`

El [ComponentFixture](api/core/testing/ComponentFixture) es un harness de prueba para interactuar con el componente creado y su elemento correspondiente.

Accede a la instancia del componente a través del fixture y confirma que existe con una expectativa de Jasmine:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="componentInstance"/>

### `beforeEach()`

Agregarás más pruebas a medida que este componente evolucione.
En lugar de duplicar la configuración del `TestBed` para cada prueba, refactoriza para sacar la configuración en un `beforeEach()` de Jasmine y algunas variables de soporte:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v3"/>

Ahora agrega una prueba que obtiene el elemento del componente de `fixture.nativeElement` y busca el texto esperado.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-2"/>

### `nativeElement`

El valor de `ComponentFixture.nativeElement` tiene el tipo `any`.
Más tarde encontrarás el `DebugElement.nativeElement` y también tiene el tipo `any`.

Angular no puede saber en tiempo de compilación qué tipo de elemento HTML es el `nativeElement` o si siquiera es un elemento HTML.
La aplicación podría estar ejecutándose en una *plataforma no-navegador*, como el servidor o un [Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API), donde el elemento podría tener una API disminuida o no existir en absoluto.

Las pruebas en esta guía están diseñadas para ejecutarse en un navegador, por lo que un valor `nativeElement` siempre será un `HTMLElement` o una de sus clases derivadas.

Sabiendo que es un `HTMLElement` de algún tipo, usa el `querySelector` HTML estándar para profundizar en el árbol de elementos.

Aquí hay otra prueba que llama a `HTMLElement.querySelector` para obtener el elemento párrafo y buscar el texto del banner:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-3"/>

### `DebugElement`

El _fixture_ de Angular proporciona el elemento del componente directamente a través del `fixture.nativeElement`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="nativeElement"/>

Esto es en realidad un método de conveniencia, implementado como `fixture.debugElement.nativeElement`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="debugElement-nativeElement"/>

Hay una buena razón para esta ruta indirecta al elemento.

Las propiedades del `nativeElement` dependen del entorno de ejecución.
Podrías estar ejecutando estas pruebas en una plataforma _no-navegador_ que no tiene un DOM o cuya emulación de DOM no soporta la API completa de `HTMLElement`.

Angular depende de la abstracción `DebugElement` para trabajar de forma segura en _todas las plataformas soportadas_.
En lugar de crear un árbol de elementos HTML, Angular crea un árbol `DebugElement` que envuelve los *elementos nativos* para la plataforma de ejecución.
La propiedad `nativeElement` desenvuelve el `DebugElement` y retorna el objeto de elemento específico de la plataforma.

Porque las pruebas de muestra para esta guía están diseñadas para ejecutarse solo en un navegador, un `nativeElement` en estas pruebas es siempre un `HTMLElement` cuyos métodos y propiedades familiares puedes explorar dentro de una prueba.

Aquí está la prueba anterior, re-implementada con `fixture.debugElement.nativeElement`:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-4"/>

El `DebugElement` tiene otros métodos y propiedades que son útiles en pruebas, como verás en otros lugares de esta guía.

Importas el símbolo `DebugElement` de la librería core de Angular.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="import-debug-element"/>

### `By.css()`

Aunque las pruebas en esta guía todas se ejecutan en el navegador, algunas aplicaciones podrían ejecutarse en una plataforma diferente al menos parte del tiempo.

Por ejemplo, el componente podría renderizar primero en el servidor como parte de una estrategia para hacer que la aplicación se inicie más rápido en dispositivos pobremente conectados.
El renderizador del lado del servidor podría no soportar la API completa de elementos HTML.
Si no soporta `querySelector`, la prueba anterior podría fallar.

El `DebugElement` ofrece métodos de consulta que funcionan para todas las plataformas soportadas.
Estos métodos de consulta toman una función *predicate* que retorna `true` cuando un nodo en el árbol `DebugElement` coincide con los criterios de selección.

Creas un *predicate* con la ayuda de una clase `By` importada de una librería para la plataforma de ejecución.
Aquí está el import `By` para la plataforma navegador:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="import-by"/>

El siguiente ejemplo re-implementa la prueba anterior con `DebugElement.query()` y el método `By.css` del navegador.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-5"/>

Algunas observaciones dignas de mención:

- El método estático `By.css()` selecciona nodos `DebugElement` con un [selector CSS estándar](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS selectors').
- La consulta retorna un `DebugElement` para el párrafo.
- Debes desenvolver ese resultado para obtener el elemento párrafo.

Cuando estás filtrando por selector CSS y solo probando propiedades del _elemento nativo_ de un navegador, el enfoque `By.css` podría ser excesivo.

A menudo es más directo y claro filtrar con un método `HTMLElement` estándar como `querySelector()` o `querySelectorAll()`.
