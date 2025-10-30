# Escenarios de prueba de componentes

Esta guía explora casos de uso comunes de prueba de componentes.

## Binding de componentes

En la aplicación de ejemplo, el `BannerComponent` presenta texto de título estático en la plantilla HTML.

Después de algunos cambios, el `BannerComponent` presenta un título dinámico vinculándose a la propiedad `title` del componente como esto.

<docs-code header="app/banner/banner.component.ts" path="adev/src/content/examples/testing/src/app/banner/banner.component.ts" visibleRegion="component"/>

Por mínimo que sea esto, decides agregar una prueba para confirmar que el componente realmente muestra el contenido correcto donde crees que debería.

### Consultar por el `<h1>`

Escribirás una secuencia de pruebas que inspeccionan el valor del elemento `<h1>` que envuelve el binding de interpolación de la propiedad *title*.

Actualizas el `beforeEach` para encontrar ese elemento con un `querySelector` HTML estándar y asignarlo a la variable `h1`.

<docs-code header="app/banner/banner.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="setup"/>

### `createComponent()` no vincula datos

Para tu primera prueba te gustaría ver que la pantalla muestra el `title` predeterminado.
Tu instinto es escribir una prueba que inmediatamente inspecciona el `<h1>` así:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default-v1"/>

*Esa prueba falla* con el mensaje:

<docs-code language="javascript">

expected '' to contain 'Test Tour of Heroes'.

</docs-code>

El binding ocurre cuando Angular realiza **detección de cambios**.

En producción, la detección de cambios se activa automáticamente cuando Angular crea un componente o el usuario ingresa una pulsación de tecla, por ejemplo.

El `TestBed.createComponent` no desencadena detección de cambios por defecto; un hecho confirmado en la prueba revisada:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="test-w-o-detect-changes"/>

### `detectChanges()`

Puedes decirle al `TestBed` que realice binding de datos llamando a `fixture.detectChanges()`.
Solo entonces el `<h1>` tiene el título esperado.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default"/>

La detección de cambios retrasada es intencional y útil.
Le da al probador una oportunidad de inspeccionar y cambiar el estado del componente *antes de que Angular inicie el binding de datos y llame a [hooks de ciclo de vida](guide/components/lifecycle)*.

Aquí hay otra prueba que cambia la propiedad `title` del componente *antes* de llamar a `fixture.detectChanges()`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="after-change"/>

### Detección automática de cambios

Las pruebas de `BannerComponent` llaman frecuentemente a `detectChanges`.
Muchos probadores prefieren que el entorno de prueba de Angular ejecute la detección de cambios automáticamente como lo hace en producción.

Eso es posible configurando el `TestBed` con el provider `ComponentFixtureAutoDetect`.
Primero impórtalo de la librería utilitaria de testing:

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (import)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="import-ComponentFixtureAutoDetect"/>

Luego agrégalo al array `providers` de la configuración del módulo de testing:

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect"/>

ÚTIL: También puedes usar la función `fixture.autoDetectChanges()` en su lugar si solo quieres habilitar la detección automática de cambios después de hacer actualizaciones al estado del componente del fixture. Además, la detección automática de cambios está activada por defecto cuando usas `provideZonelessChangeDetection` y desactivarla no es recomendado.

Aquí hay tres pruebas que ilustran cómo funciona la detección automática de cambios.

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect-tests"/>

La primera prueba muestra el beneficio de la detección automática de cambios.

La segunda y tercera prueba revelan una limitación importante.
El entorno de testing de Angular no ejecuta detección de cambios síncronamente cuando las actualizaciones ocurren dentro del caso de prueba que cambió el `title` del componente.
La prueba debe llamar a `await fixture.whenStable` para esperar otra ronda de detección de cambios.

ÚTIL: Angular no sabe sobre actualizaciones directas a valores que no son signals. La forma más fácil de asegurar que la detección de cambios se programe es usar signals para valores leídos en la plantilla.

### Cambiar un valor de input con `dispatchEvent()`

Para simular la entrada del usuario, encuentra el elemento input y establece su propiedad `value`.

Pero hay un paso esencial, intermedio.

Angular no sabe que estableciste la propiedad `value` del elemento input.
No leerá esa propiedad hasta que generes el evento `input` del elemento llamando a `dispatchEvent()`.

El siguiente ejemplo demuestra la secuencia adecuada.

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>

## Componente con archivos externos

El `BannerComponent` precedente está definido con una *plantilla inline* y *css inline*, especificados en las propiedades `@Component.template` y `@Component.styles` respectivamente.

Muchos componentes especifican *plantillas externas* y *css externo* con las propiedades `@Component.templateUrl` y `@Component.styleUrls` respectivamente, como lo hace la siguiente variante de `BannerComponent`.

<docs-code header="app/banner/banner-external.component.ts (metadata)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.ts" visibleRegion="metadata"/>

Esta sintaxis le dice al compilador de Angular que lea los archivos externos durante la compilación del componente.

Eso no es un problema cuando ejecutas el comando CLI `ng test` porque *compila la aplicación antes de ejecutar las pruebas*.

Sin embargo, si ejecutas las pruebas en un **entorno no-CLI**, las pruebas de este componente podrían fallar.
Por ejemplo, si ejecutas las pruebas de `BannerComponent` en un entorno de codificación web como [plunker](https://plnkr.co), verás un mensaje como este:

<docs-code hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</docs-code>

Obtienes este mensaje de fallo de prueba cuando el entorno de runtime compila el código fuente *durante las pruebas mismas*.

Para corregir el problema, llama a `compileComponents()` como se explica en la siguiente sección [Llamando compileComponents](#calling-compilecomponents).

## Componente con una dependencia

Los componentes a menudo tienen dependencias de servicio.

El `WelcomeComponent` muestra un mensaje de bienvenida al usuario autenticado.
Sabe quién es el usuario basado en una propiedad del `UserService` inyectado:

<docs-code header="app/welcome/welcome.component.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.ts"/>

El `WelcomeComponent` tiene lógica de decisión que interactúa con el servicio, lógica que hace que este componente valga la pena probar.

### Proporcionar dobles de prueba de servicio

Un *componente-bajo-prueba* no tiene que ser proporcionado con servicios reales.

Inyectar el `UserService` real podría ser difícil.
El servicio real podría pedirle al usuario credenciales de inicio de sesión e intentar llegar a un servidor de autenticación.
Estos comportamientos pueden ser difíciles de interceptar. Ten en cuenta que usar dobles de prueba hace que la prueba se comporte diferente de la producción, así que úsalos con moderación.

### Obtener servicios inyectados

Las pruebas necesitan acceso al `UserService` inyectado en el `WelcomeComponent`.

Angular tiene un sistema de inyección jerárquico.
Puede haber inyectores en múltiples niveles, desde el inyector raíz creado por el `TestBed` hacia abajo a través del árbol de componentes.

La forma más segura de obtener el servicio inyectado, la forma que ***siempre funciona***,
es **obtenerlo del inyector del *componente-bajo-prueba***.
El inyector del componente es una propiedad del `DebugElement` del fixture.

<docs-code header="WelcomeComponent's injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="injected-service"/>

ÚTIL: Esto _usualmente_ no es necesario. Los servicios a menudo se proporcionan en la raíz o los overrides del TestBed y pueden recuperarse más fácilmente con `TestBed.inject()` (ver abajo).

### `TestBed.inject()`

Esto es más fácil de recordar y menos verboso que recuperar un servicio usando el `DebugElement` del fixture.

En esta suite de pruebas, el *único* provider de `UserService` es el módulo de testing raíz, por lo que es seguro llamar a `TestBed.inject()` de la siguiente manera:

<docs-code header="TestBed injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="inject-from-testbed" />

ÚTIL: Para un caso de uso en el que `TestBed.inject()` no funciona, consulta la sección [*Override component providers*](#override-component-providers) que explica cuándo y por qué debes obtener el servicio del inyector del componente en su lugar.

### Configuración final y pruebas

Aquí está el `beforeEach()` completo, usando `TestBed.inject()`:

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="setup"/>

Y aquí hay algunas pruebas:

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="tests"/>

La primera es una prueba de cordura; confirma que el `UserService` es llamado y funciona.

ÚTIL: La función withContext \(por ejemplo, `'expected name'`\) es una etiqueta de fallo opcional.
Si la expectativa falla, Jasmine agrega esta etiqueta al mensaje de fallo de expectativa.
En una spec con múltiples expectativas, puede ayudar a aclarar qué salió mal y qué expectativa falló.

Las pruebas restantes confirman la lógica del componente cuando el servicio retorna diferentes valores.
La segunda prueba valida el efecto de cambiar el nombre del usuario.
La tercera prueba verifica que el componente muestra el mensaje apropiado cuando no hay usuario autenticado.

## Componente con servicio async

En esta muestra, la plantilla `AboutComponent` aloja un `TwainComponent`.
El `TwainComponent` muestra citas de Mark Twain.

<docs-code header="app/twain/twain.component.ts (template)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="template" />

ÚTIL: El valor de la propiedad `quote` del componente pasa a través de un `AsyncPipe`.
Eso significa que la propiedad retorna ya sea una `Promise` o un `Observable`.

En este ejemplo, el método `TwainComponent.getQuote()` te dice que la propiedad `quote` retorna un `Observable`.

<docs-code header="app/twain/twain.component.ts (getQuote)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="get-quote"/>

El `TwainComponent` obtiene citas de un `TwainService` inyectado.
El componente inicia el `Observable` retornado con un valor placeholder \(`'...'`\), antes de que el servicio pueda retornar su primera cita.

El `catchError` intercepta errores de servicio, prepara un mensaje de error, y retorna el valor placeholder en el canal de éxito.

Estas son todas características que querrás probar.

### Probar con un spy

Cuando se prueba un componente, solo la API pública del servicio debería importar.
En general, las pruebas mismas no deberían hacer llamadas a servidores remotos.
Deberían emular tales llamadas.
La configuración en este `app/twain/twain.component.spec.ts` muestra una forma de hacerlo:

<docs-code header="app/twain/twain.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="setup"/>

Enfócate en el spy.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="spy"/>

El spy está diseñado de tal manera que cualquier llamada a `getQuote` recibe un observable con una cita de prueba.
A diferencia del método `getQuote()` real, este spy evita el servidor y retorna un observable síncrono cuyo valor está disponible inmediatamente.

Puedes escribir muchas pruebas útiles con este spy, aunque su `Observable` sea síncrono.

ÚTIL: Es mejor limitar el uso de spies solo a lo que es necesario para la prueba. Crear mocks o spies para más de lo necesario puede ser frágil. A medida que el componente e injectable evolucionan, las pruebas no relacionadas pueden fallar porque ya no simulan suficientes comportamientos que de otro modo no afectarían la prueba.


### Prueba async con `fakeAsync()`

Para usar la funcionalidad `fakeAsync()`, debes importar `zone.js/testing` en tu archivo de configuración de pruebas.
Si creaste tu proyecto con Angular CLI, `zone-testing` ya está importado en `src/test.ts`.

La siguiente prueba confirma el comportamiento esperado cuando el servicio retorna un `ErrorObservable`.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="error-test"/>

ÚTIL: La función `it()` recibe un argumento de la siguiente forma.

<docs-code language="javascript">

fakeAsync(() => { /*test body*/ })

</docs-code>

La función `fakeAsync()` habilita un estilo de codificación lineal ejecutando el cuerpo de la prueba en una `fakeAsync test zone` especial.
El cuerpo de la prueba aparece ser síncrono.
No hay sintaxis anidada \(como un `Promise.then()`\) para interrumpir el flujo de control.

ÚTIL: Limitación: La función `fakeAsync()` no funcionará si el cuerpo de la prueba hace una llamada `XMLHttpRequest` \(XHR\).
Las llamadas XHR dentro de una prueba son raras, pero si necesitas llamar XHR, consulta la sección [`waitForAsync()`](#waitForAsync).

IMPORTANTE: Ten en cuenta que las tareas asíncronas que ocurren dentro de la zona `fakeAsync` necesitan ejecutarse manualmente con `flush` o `tick`. Si intentas esperar a que se completen (es decir, usando `fixture.whenStable`) sin usar los helpers de prueba `fakeAsync` para avanzar el tiempo, tu prueba probablemente fallará. Ver abajo para más información.

### La función `tick()`

Tienes que llamar a [tick()](api/core/testing/tick) para avanzar el reloj virtual.

Llamar a [tick()](api/core/testing/tick) simula el paso del tiempo hasta que todas las actividades asíncronas pendientes terminen.
En este caso, espera al `setTimeout()` del observable.

La función [tick()](api/core/testing/tick) acepta `millis` y `tickOptions` como parámetros. El parámetro `millis` especifica cuánto avanza el reloj virtual y por defecto es `0` si no se proporciona.
Por ejemplo, si tienes un `setTimeout(fn, 100)` en una prueba `fakeAsync()`, necesitas usar `tick(100)` para desencadenar el callback fn.
El parámetro opcional `tickOptions` tiene una propiedad llamada `processNewMacroTasksSynchronously`. La propiedad `processNewMacroTasksSynchronously` representa si invocar nuevas macro tasks generadas al hacer tick y por defecto es `true`.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick"/>

La función [tick()](api/core/testing/tick) es una de las utilidades de testing de Angular que importas con `TestBed`.
Es una compañera de `fakeAsync()` y solo puedes llamarla dentro de un cuerpo `fakeAsync()`.

### tickOptions

En este ejemplo, tienes una nueva macro task, la función `setTimeout` anidada. Por defecto, cuando el `tick` es setTimeout, tanto `outside` como `nested` se desencadenarán.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-sync"/>

En algunos casos, no quieres desencadenar la nueva macro task al hacer tick. Puedes usar `tick(millis, {processNewMacroTasksSynchronously: false})` para no invocar una nueva macro task.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-async"/>

### Comparar fechas dentro de fakeAsync()

`fakeAsync()` simula el paso del tiempo, lo que te permite calcular la diferencia entre fechas dentro de `fakeAsync()`.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-date"/>

### jasmine.clock con fakeAsync()

Jasmine también proporciona una característica `clock` para simular fechas.
Angular ejecuta automáticamente pruebas que se ejecutan después de que se llame `jasmine.clock().install()` dentro de un método `fakeAsync()` hasta que se llame `jasmine.clock().uninstall()`.
`fakeAsync()` no es necesario y lanza un error si se anida.

Por defecto, esta característica está deshabilitada.
Para habilitarla, establece una bandera global antes de importar `zone-testing`.

Si usas Angular CLI, configura esta bandera en `src/test.ts`.

<docs-code language="typescript">

[window as any]('&lowbar;&lowbar;zone&lowbar;symbol__fakeAsyncPatchLock') = true;
import 'zone.js/testing';

</docs-code>

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-clock"/>

### Usar el scheduler de RxJS dentro de fakeAsync()

También puedes usar el scheduler de RxJS en `fakeAsync()` igual que usando `setTimeout()` o `setInterval()`, pero necesitas importar `zone.js/plugins/zone-patch-rxjs-fake-async` para parchear el scheduler de RxJS.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-rxjs"/>

### Soportar más macroTasks

Por defecto, `fakeAsync()` soporta las siguientes macro tasks.

* `setTimeout`
* `setInterval`
* `requestAnimationFrame`
* `webkitRequestAnimationFrame`
* `mozRequestAnimationFrame`

Si ejecutas otras macro tasks como `HTMLCanvasElement.toBlob()`, se lanza un error *"Unknown macroTask scheduled in fake async test"*.

<docs-code-multifile>
    <docs-code header="src/app/shared/canvas.component.spec.ts (failing)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="without-toBlob-macrotask"/>
    <docs-code header="src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="main"/>
</docs-code-multifile>

Si quieres soportar tal caso, necesitas definir la macro task que quieres soportar en `beforeEach()`.
Por ejemplo:

<docs-code header="src/app/shared/canvas.component.spec.ts (excerpt)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="enable-toBlob-macrotask"/>

ÚTIL: Para hacer que el elemento `<canvas>` sea Zone.js-aware en tu aplicación, necesitas importar el parche `zone-patch-canvas` \(ya sea en `polyfills.ts` o en el archivo específico que usa `<canvas>`\):

<docs-code header="src/polyfills.ts or src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="import-canvas-patch"/>

### Observables async

Podrías estar satisfecho con la cobertura de prueba de estas pruebas.

Sin embargo, podrías estar preocupado por el hecho de que el servicio real no se comporta exactamente de esta manera.
El servicio real envía solicitudes a un servidor remoto.
Un servidor toma tiempo en responder y la respuesta ciertamente no estará disponible inmediatamente como en las dos pruebas anteriores.

Tus pruebas reflejarán el mundo real más fielmente si retornas un observable *asíncrono* del spy `getQuote()` así.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-setup"/>

### Helpers de observable async

El observable async fue producido por un helper `asyncData`.
El helper `asyncData` es una función utilitaria que tendrás que escribir tú mismo, o copiar esta de el código de muestra.

<docs-code header="testing/async-observable-helpers.ts" path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-data"/>

El observable de este helper emite el valor `data` en el siguiente turno del motor de JavaScript.

El [operador `defer()` de RxJS](http://reactivex.io/documentation/operators/defer.html) retorna un observable.
Toma una función factory que retorna ya sea una promesa o un observable.
Cuando algo se suscribe al observable de *defer*, agrega el suscriptor a un nuevo observable creado con esa factory.

El operador `defer()` transforma el `Promise.resolve()` en un nuevo observable que, como `HttpClient`, emite una vez y se completa.
Los suscriptores se desuscriben después de recibir el valor de datos.

Hay un helper similar para producir un error async.

<docs-code path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-error"/>

### Más pruebas async

Ahora que el spy `getQuote()` está retornando observables async, la mayoría de tus pruebas tendrán que ser async también.

Aquí hay una prueba `fakeAsync()` que demuestra el flujo de datos que esperarías en el mundo real.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="fake-async-test"/>

Nota que el elemento quote muestra el valor placeholder \(`'...'`\) después de `ngOnInit()`.
La primera cita aún no ha llegado.

Para vaciar la primera cita del observable, llamas a [tick()](api/core/testing/tick).
Luego llamas a `detectChanges()` para decirle a Angular que actualice la pantalla.

Entonces puedes afirmar que el elemento quote muestra el texto esperado.

### Prueba async sin `fakeAsync()`

Aquí está la prueba `fakeAsync()` anterior, reescrita con el `async`.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-test"/>

### `whenStable`

La prueba debe esperar a que el observable `getQuote()` emita la siguiente cita.
En lugar de llamar a [tick()](api/core/testing/tick), llama a `fixture.whenStable()`.

El `fixture.whenStable()` retorna una promesa que se resuelve cuando la cola de tareas del motor de JavaScript se vuelve vacía.
En este ejemplo, la cola de tareas se vuelve vacía cuando el observable emite la primera cita.


## Componente con inputs y outputs

Un componente con inputs y outputs típicamente aparece dentro de la plantilla de vista de un componente host.
El host usa un property binding para establecer la propiedad input y un event binding para escuchar eventos generados por la propiedad output.

El objetivo de testing es verificar que tales bindings funcionen como se espera.
Las pruebas deberían establecer valores de input y escuchar eventos de output.

El `DashboardHeroComponent` es un pequeño ejemplo de un componente en este rol.
Muestra un héroe individual proporcionado por el `DashboardComponent`.
Hacer clic en ese héroe le dice al `DashboardComponent` que el usuario ha seleccionado el héroe.

El `DashboardHeroComponent` está incrustado en la plantilla `DashboardComponent` así:

<docs-code header="app/dashboard/dashboard.component.html (excerpt)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.html" visibleRegion="dashboard-hero"/>

El `DashboardHeroComponent` aparece en un bloque `@for`, que establece la propiedad input `hero` de cada componente al valor de bucle y escucha el evento `selected` del componente.

Aquí está la definición completa del componente:

<docs-code header="app/dashboard/dashboard-hero.component.ts (component)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.ts" visibleRegion="component"/>

Aunque probar un componente tan simple tiene poco valor intrínseco, vale la pena saber cómo.
Usa uno de estos enfoques:

* Probarlo como se usa por `DashboardComponent`
* Probarlo como un componente standalone
* Probarlo como se usa por un sustituto para `DashboardComponent`

El objetivo inmediato es probar el `DashboardHeroComponent`, no el `DashboardComponent`, así que, prueba la segunda y tercera opciones.

### Probar `DashboardHeroComponent` standalone

Aquí está la parte principal de la configuración del archivo spec.

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="setup"/>

Nota cómo el código de configuración asigna un héroe de prueba \(`expectedHero`\) a la propiedad `hero` del componente, emulando la forma en que el `DashboardComponent` lo establecería usando el property binding en su repeater.

La siguiente prueba verifica que el nombre del héroe se propaga a la plantilla usando un binding.

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="name-test"/>

Porque la [plantilla](#dashboard-hero-component) pasa el nombre del héroe a través del `UpperCasePipe` de Angular, la prueba debe coincidir el valor del elemento con el nombre en mayúsculas.

### Hacer clic

Hacer clic en el héroe debería generar un evento `selected` que el componente host \(`DashboardComponent` presumiblemente\) puede escuchar:

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test"/>

La propiedad `selected` del componente retorna un `EventEmitter`, que se ve como un `Observable` síncrono de RxJS para los consumidores.
La prueba se suscribe a él *explícitamente* igual que el componente host lo hace *implícitamente*.

Si el componente se comporta como se espera, hacer clic en el elemento del héroe debería decirle a la propiedad `selected` del componente que emita el objeto `hero`.

La prueba detecta ese evento a través de su suscripción a `selected`.

### `triggerEventHandler`

El `heroDe` en la prueba anterior es un `DebugElement` que representa el `<div>` del héroe.

Tiene propiedades y métodos de Angular que abstraen la interacción con el elemento nativo.
Esta prueba llama al `DebugElement.triggerEventHandler` con el nombre de evento "click".
El binding de evento "click" responde llamando a `DashboardHeroComponent.click()`.

El `DebugElement.triggerEventHandler` de Angular puede generar *cualquier evento vinculado a datos* por su *nombre de evento*.
El segundo parámetro es el objeto de evento pasado al handler.

La prueba desencadenó un evento "click".

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="trigger-event-handler"/>

En este caso, la prueba asume correctamente que el handler de evento de runtime, el método `click()` del componente, no se preocupa por el objeto de evento.

ÚTIL: Otros handlers son menos indulgentes.
Por ejemplo, la directiva `RouterLink` espera un objeto con una propiedad `button` que identifica qué botón del mouse, si alguno, fue presionado durante el clic.
La directiva `RouterLink` lanza un error si el objeto de evento falta.

### Hacer clic en el elemento

La siguiente alternativa de prueba llama al método `click()` propio del elemento nativo, que es perfectamente fino para *este componente*.

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-2"/>

### Helper `click()`

Hacer clic en un botón, un anchor, o un elemento HTML arbitrario es una tarea de prueba común.

Haz eso consistente y directo encapsulando el proceso *click-triggering* en un helper como la siguiente función `click()`:

<docs-code header="testing/index.ts (click helper)" path="adev/src/content/examples/testing/src/testing/index.ts" visibleRegion="click-event"/>

El primer parámetro es el *elemento-a-hacer-clic*.
Si quieres, pasa un objeto de evento personalizado como segundo parámetro.
El predeterminado es un [objeto de evento de mouse de botón izquierdo](https://developer.mozilla.org/docs/Web/API/MouseEvent/button) parcial aceptado por muchos handlers incluyendo la directiva `RouterLink`.

IMPORTANTE: La función helper `click()` **no** es una de las utilidades de testing de Angular.
Es una función definida en el *código de muestra de esta guía*.
Todas las pruebas de muestra la usan.
Si te gusta, agrégala a tu propia colección de helpers.

Aquí está la prueba anterior, reescrita usando el helper click.

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-3"/>

## Componente dentro de un test host

Las pruebas anteriores jugaron el rol del `DashboardComponent` host ellas mismas.
¿Pero funciona correctamente el `DashboardHeroComponent` cuando está correctamente vinculado a datos a un componente host?

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host"/>

El test host establece la propiedad input `hero` del componente con su héroe de prueba.
Vincula el evento `selected` del componente con su handler `onSelected`, que registra el héroe emitido en su propiedad `selectedHero`.

Más tarde, las pruebas podrán verificar `selectedHero` para verificar que el evento `DashboardHeroComponent.selected` emitió el héroe esperado.

La configuración para las pruebas `test-host` es similar a la configuración para las pruebas standalone:

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-setup"/>

Esta configuración de módulo de testing muestra dos diferencias importantes:

* *Crea* el `TestHostComponent` en lugar del `DashboardHeroComponent`
* El `TestHostComponent` establece el `DashboardHeroComponent.hero` con un binding

El `createComponent` retorna un `fixture` que contiene una instancia de `TestHostComponent` en lugar de una instancia de `DashboardHeroComponent`.

Crear el `TestHostComponent` tiene el efecto secundario de crear un `DashboardHeroComponent` porque este último aparece dentro de la plantilla del primero.
La consulta para el elemento héroe \(`heroEl`\) aún lo encuentra en el DOM de prueba, aunque a mayor profundidad en el árbol de elementos que antes.

Las pruebas mismas son casi idénticas a la versión standalone:

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test-host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-tests"/>

Solo la prueba de evento selected difiere.
Confirma que el héroe `DashboardHeroComponent` seleccionado realmente encuentra su camino hacia arriba a través del event binding al componente host.

## Componente de enrutamiento

Un *componente de enrutamiento* es un componente que le dice al `Router` que navegue a otro componente.
El `DashboardComponent` es un *componente de enrutamiento* porque el usuario puede navegar al `HeroDetailComponent` haciendo clic en uno de los *botones de héroe* en el dashboard.

Angular proporciona helpers de prueba para reducir boilerplate y probar más efectivamente código que depende de `HttpClient`. La función `provideRouter` puede usarse directamente en el módulo de prueba también.

<docs-code header="app/dashboard/dashboard.component.spec.ts" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="router-harness"/>

La siguiente prueba hace clic en el héroe mostrado y confirma que navegamos a la URL esperada.

<docs-code header="app/dashboard/dashboard.component.spec.ts (navigate test)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="navigate-test"/>

## Componentes enrutados

Un *componente enrutado* es el destino de una navegación `Router`.
Puede ser más difícil de probar, especialmente cuando la ruta al componente *incluye parámetros*.
El `HeroDetailComponent` es un *componente enrutado* que es el destino de tal ruta.

Cuando un usuario hace clic en un héroe de *Dashboard*, el `DashboardComponent` le dice al `Router` que navegue a `heroes/:id`.
El `:id` es un parámetro de ruta cuyo valor es el `id` del héroe a editar.

El `Router` coincide esa URL con una ruta al `HeroDetailComponent`.
Crea un objeto `ActivatedRoute` con la información de enrutamiento y lo inyecta en una nueva instancia del `HeroDetailComponent`.

Aquí están los servicios inyectados en `HeroDetailComponent`:

<docs-code header="app/hero/hero-detail.component.ts (inject)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="inject"/>

El componente `HeroDetail` necesita el parámetro `id` para poder obtener el héroe correspondiente usando el `HeroDetailService`.
El componente tiene que obtener el `id` de la propiedad `ActivatedRoute.paramMap` que es un `Observable`.

No puede simplemente referenciar la propiedad `id` del `ActivatedRoute.paramMap`.
El componente tiene que *suscribirse* al observable `ActivatedRoute.paramMap` y estar preparado para que el `id` cambie durante su vida útil.

<docs-code header="app/hero/hero-detail.component.ts (constructor)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="ctor"/>

Las pruebas pueden explorar cómo el `HeroDetailComponent` responde a diferentes valores de parámetro `id` navegando a diferentes rutas.

## Pruebas de componentes anidados

Las plantillas de componentes a menudo tienen componentes anidados, cuyas plantillas podrían contener más componentes.

El árbol de componentes puede ser muy profundo y a veces los componentes anidados no juegan ningún rol en probar el componente en la parte superior del árbol.

El `AppComponent`, por ejemplo, muestra una barra de navegación con anchors y sus directivas `RouterLink`.

<docs-code header="app/app.component.html" path="adev/src/content/examples/testing/src/app/app.component.html"/>

Para validar los enlaces pero no la navegación, no necesitas el `Router` para navegar y no necesitas el `<router-outlet>` para marcar dónde el `Router` inserta *componentes enrutados*.

El `BannerComponent` y `WelcomeComponent` \(indicados por `<app-banner>` y `<app-welcome>`\) también son irrelevantes.

Sin embargo, cualquier prueba que cree el `AppComponent` en el DOM también crea instancias de estos tres componentes y, si dejas que eso suceda, tendrás que configurar el `TestBed` para crearlos.

Si descuidas declararlos, el compilador de Angular no reconocerá las etiquetas `<app-banner>`, `<app-welcome>` y `<router-outlet>` en la plantilla `AppComponent` y lanzará un error.

Si declaras los componentes reales, también tendrás que declarar *sus* componentes anidados y proporcionar *todos* los servicios inyectados en *cualquier* componente en el árbol.

Esta sección describe dos técnicas para minimizar la configuración.
Úsalas, solas o en combinación, para mantener el foco en probar el componente primario.

### Hacer stub de componentes innecesarios

En la primera técnica, creas y declaras versiones stub de los componentes y directiva que juegan poco o ningún rol en las pruebas.

<docs-code header="app/app.component.spec.ts (stub declaration)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="component-stubs"/>

Los selectores stub coinciden con los selectores para los componentes reales correspondientes.
Pero sus plantillas y clases están vacías.

Luego declár alos sobrescribiendo los `imports` de tu componente usando `TestBed.overrideComponent`. 

<docs-code header="app/app.component.spec.ts (TestBed stubs)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="testbed-stubs"/>

ÚTIL: La clave `set` en este ejemplo reemplaza todos los imports existentes en tu componente, asegúrate de importar todas las dependencias, no solo los stubs. Alternativamente puedes usar las claves `remove`/`add` para remover y agregar imports selectivamente.

### `NO_ERRORS_SCHEMA`

En el segundo enfoque, agrega `NO_ERRORS_SCHEMA` a los overrides de metadata de tu componente.

<docs-code header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="no-errors-schema"/>

El `NO_ERRORS_SCHEMA` le dice al compilador de Angular que ignore elementos y atributos no reconocidos.

El compilador reconoce el elemento `<app-root>` y el atributo `routerLink` porque declaraste un `AppComponent` y `RouterLink` correspondientes en la configuración del `TestBed`.

Pero el compilador no lanzará un error cuando encuentre `<app-banner>`, `<app-welcome>` o `<router-outlet>`.
Simplemente los renderiza como etiquetas vacías y el navegador los ignora.

Ya no necesitas los componentes stub.

### Usar ambas técnicas juntas

Estas son técnicas para *Shallow Component Testing*, llamadas así porque reducen la superficie visual del componente solo a aquellos elementos en la plantilla del componente que importan para las pruebas.

El enfoque `NO_ERRORS_SCHEMA` es el más fácil de los dos pero no lo uses en exceso.

El `NO_ERRORS_SCHEMA` también evita que el compilador te diga sobre los componentes y atributos faltantes que omitiste inadvertidamente o escribiste mal.
Podrías desperdiciar horas persiguiendo bugs fantasma que el compilador habría capturado en un instante.

El enfoque de *componente stub* tiene otra ventaja.
Aunque los stubs en *este* ejemplo están vacíos, podrías darles plantillas y clases reducidas si tus pruebas necesitan interactuar con ellos de alguna manera.

En la práctica combinarás las dos técnicas en la misma configuración, como se ve en este ejemplo.

<docs-code header="app/app.component.spec.ts (mixed setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="mixed-setup"/>

El compilador de Angular crea el `BannerStubComponent` para el elemento `<app-banner>` y aplica el `RouterLink` a los anchors con el atributo `routerLink`, pero ignora las etiquetas `<app-welcome>` y `<router-outlet>`.

### `By.directive` y directivas inyectadas

Un poco más de configuración desencadena el binding de datos inicial y obtiene referencias a los enlaces de navegación:

<docs-code header="app/app.component.spec.ts (test setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="test-setup"/>

Tres puntos de interés especial:

* Localizar los elementos anchor con una directiva adjunta usando `By.directive`
* La consulta retorna wrappers `DebugElement` alrededor de los elementos coincidentes
* Cada `DebugElement` expone un inyector de dependencias con la instancia específica de la directiva adjunta a ese elemento

Los enlaces del `AppComponent` a validar son los siguientes:

<docs-code header="app/app.component.html (navigation links)" path="adev/src/content/examples/testing/src/app/app.component.html" visibleRegion="links"/>

Aquí hay algunas pruebas que confirman que esos enlaces están conectados a las directivas `routerLink` como se espera:

<docs-code header="app/app.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="tests"/>

## Usar un objeto `page`

El `HeroDetailComponent` es una vista simple con un título, dos campos de héroe y dos botones.

Pero hay bastante complejidad de plantilla incluso en este formulario simple.

<docs-code
  path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"/>

Las pruebas que ejercitan el componente necesitan…

* Esperar hasta que un héroe llegue antes de que los elementos aparezcan en el DOM
* Una referencia al texto del título
* Una referencia al cuadro de entrada de nombre para inspeccionarlo y establecerlo
* Referencias a los dos botones para poder hacer clic en ellos

Incluso un formulario pequeño como este puede producir un lío de configuración condicional tortuosa y selección de elementos CSS.

Domestica la complejidad con una clase `Page` que maneja el acceso a las propiedades del componente y encapsula la lógica que las establece.

Aquí hay tal clase `Page` para el `hero-detail.component.spec.ts`

<docs-code header="app/hero/hero-detail.component.spec.ts (Page)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="page"/>

Ahora los hooks importantes para manipulación e inspección de componentes están organizados ordenadamente y son accesibles desde una instancia de `Page`.

Un método `createComponent` crea un objeto `page` y llena los espacios en blanco una vez que el `hero` llega.

<docs-code header="app/hero/hero-detail.component.spec.ts (createComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="create-component"/>

Aquí hay algunas pruebas más de `HeroDetailComponent` para reforzar el punto.

<docs-code header="app/hero/hero-detail.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="selected-tests"/>

## Override component providers

El `HeroDetailComponent` proporciona su propio `HeroDetailService`.

<docs-code header="app/hero/hero-detail.component.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="prototype"/>

No es posible hacer stub del `HeroDetailService` del componente en los `providers` del `TestBed.configureTestingModule`.
Esos son providers para el *módulo de testing*, no el componente.
Preparan el inyector de dependencias en el *nivel del fixture*.

Angular crea el componente con su *propio* inyector, que es un *hijo* del inyector del fixture.
Registra los providers del componente \(el `HeroDetailService` en este caso\) con el inyector hijo.

Una prueba no puede llegar a servicios del inyector hijo desde el inyector del fixture.
Y `TestBed.configureTestingModule` tampoco puede configurarlos.

¡Angular ha creado nuevas instancias del `HeroDetailService` real todo el tiempo!

ÚTIL: Estas pruebas podrían fallar o agotar el tiempo de espera si el `HeroDetailService` hiciera sus propias llamadas XHR a un servidor remoto.
Podría no haber un servidor remoto al cual llamar.

Afortunadamente, el `HeroDetailService` delega responsabilidad para acceso a datos remotos a un `HeroService` inyectado.

<docs-code header="app/hero/hero-detail.service.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.service.ts" visibleRegion="prototype"/>

La [configuración de prueba anterior](#import-a-feature-module) reemplaza el `HeroService` real con un `TestHeroService` que intercepta solicitudes de servidor y falsifica sus respuestas.

¿Qué pasa si no tienes tanta suerte?
¿Qué pasa si falsificar el `HeroService` es difícil?
¿Qué pasa si `HeroDetailService` hace sus propias solicitudes de servidor?

El método `TestBed.overrideComponent` puede reemplazar los `providers` del componente con *test doubles* fáciles de manejar como se ve en la siguiente variación de configuración:

<docs-code header="app/hero/hero-detail.component.spec.ts (Override setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-override"/>

Nota que `TestBed.configureTestingModule` ya no proporciona un `HeroService` falso porque [no es necesario](#spy-stub).

### El método `overrideComponent`

Enfócate en el método `overrideComponent`.

<docs-code header="app/hero/hero-detail.component.spec.ts (overrideComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-component-method"/>

Toma dos argumentos: el tipo de componente a sobrescribir \(`HeroDetailComponent`\) y un objeto de metadata de override.
El [objeto de metadata de override](guide/testing/utility-apis#metadata-override-object) es un genérico definido como sigue:

<docs-code language="javascript">

type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};

</docs-code>

Un objeto de metadata override puede agregar-y-remover elementos en propiedades de metadata o restablecer completamente esas propiedades.
Este ejemplo restablece los metadata `providers` del componente.

El parámetro de tipo, `T`, es el tipo de metadata que pasarías al decorador `@Component`:

<docs-code language="javascript">

selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…

</docs-code>

### Proporcionar un *spy stub* (`HeroDetailServiceSpy`)

Este ejemplo reemplaza completamente el array `providers` del componente con un nuevo array que contiene un `HeroDetailServiceSpy`.

El `HeroDetailServiceSpy` es una versión stubbed del `HeroDetailService` real que falsifica todas las características necesarias de ese servicio.
No inyecta ni delega al `HeroService` de nivel inferior, por lo que no hay necesidad de proporcionar un test double para eso.

Las pruebas relacionadas con `HeroDetailComponent` afirmarán que los métodos del `HeroDetailService` fueron llamados espiando en los métodos del servicio.
En consecuencia, el stub implementa sus métodos como spies:

<docs-code header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="hds-spy"/>

### Las pruebas override

Ahora las pruebas pueden controlar el héroe del componente directamente manipulando el `testHero` del spy-stub y confirmar que los métodos del servicio fueron llamados.

<docs-code header="app/hero/hero-detail.component.spec.ts (override tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-tests"/>

### Más overrides

El método `TestBed.overrideComponent` puede llamarse múltiples veces para los mismos o diferentes componentes.
El `TestBed` ofrece métodos similares `overrideDirective`, `overrideModule` y `overridePipe` para profundizar y reemplazar partes de estas otras clases.

Explora las opciones y combinaciones por tu cuenta.
