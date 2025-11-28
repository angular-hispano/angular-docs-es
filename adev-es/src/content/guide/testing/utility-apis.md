# APIs utilitarias de pruebas

NOTA: Aunque esta guía se está actualizando para Vitest, algunas descripciones y ejemplos de APIs utilitarias se presentan actualmente en el contexto de Karma/Jasmine. Estamos trabajando activamente para proporcionar equivalentes de Vitest y orientación actualizada donde sea aplicable.

Esta página describe las características de pruebas de Angular más útiles.

Las utilidades de pruebas de Angular incluyen el `TestBed`, el `ComponentFixture` y un puñado de funciones que controlan el entorno de prueba.
Las clases [`TestBed`](#resumen-de-la-clase-testbed) y [`ComponentFixture`](#el-componentfixture) se cubren por separado.

Aquí hay un resumen de las funciones independientes, en orden de utilidad probable:

| Función                      | Detalles                                                                                                                                                                                                                                                                   |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inject`                     | Inyecta uno o más servicios del inyector `TestBed` actual en una función de prueba. No puede inyectar un servicio proporcionado por el componente mismo. Ver discusión de [debugElement.injector](guide/testing/components-scenarios#get-injected-services).               |
| `ComponentFixtureAutoDetect` | Un token de provider para un servicio que activa la [detección automática de cambios](guide/testing/components-scenarios#automatic-change-detection).                                                                                                                      |
| `getTestBed`                 | Obtiene la instancia actual del `TestBed`. Usualmente innecesario porque los métodos de clase estáticos de la clase `TestBed` son típicamente suficientes. La instancia `TestBed` expone algunos miembros raramente usados que no están disponibles como métodos estáticos. |

Para manejar escenarios asíncronos complejos o probar aplicaciones basadas en Zone.js heredadas, consulta la guía de [Utilidades de pruebas de Zone.js](guide/testing/zone-js-testing-utilities).

## Resumen de la clase `TestBed`

La clase `TestBed` es una de las utilidades principales de pruebas de Angular.
Su API es bastante grande y puede ser abrumadora hasta que la hayas explorado, un poco a la vez.
Lee la parte temprana de esta guía primero para obtener lo básico antes de intentar absorber la API completa.

La definición de módulo pasada a `configureTestingModule` es un subconjunto de las propiedades de metadata `@NgModule`.

<docs-code language="javascript">

type TestModuleMetadata = {
providers?: any[];
declarations?: any[];
imports?: any[];
schemas?: Array<SchemaMetadata | any[]>;
};

</docs-code>

Cada método override toma un `MetadataOverride<T>` donde `T` es el tipo de metadata apropiado para el método, es decir, el parámetro de un `@NgModule`, `@Component`, `@Directive` o `@Pipe`.

<docs-code language="javascript">

type MetadataOverride<T> = {
add?: Partial<T>;
remove?: Partial<T>;
set?: Partial<T>;
};

</docs-code>

La API del `TestBed` consiste en métodos de clase estáticos que actualizan o referencian una instancia _global_ del `TestBed`.

Internamente, todos los métodos estáticos cubren métodos de la instancia `TestBed` de runtime actual, que también es retornada por la función `getTestBed()`.

Llama a los métodos `TestBed` _dentro_ de un `beforeEach()` para asegurar un comienzo fresco antes de cada prueba individual.

Aquí están los métodos estáticos más importantes, en orden de utilidad probable.

| Métodos                 | Detalles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|:------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureTestingModule` | Los shims de testing \(`karma-test-shim`, `browser-test-shim`\) establecen el [entorno de prueba inicial](guide/testing) y un módulo de testing predeterminado. El módulo de testing predeterminado está configurado con declarativas básicas y algunos sustitutos de servicio de Angular que cada probador necesita. <br /> Llama a `configureTestingModule` para refinar la configuración del módulo de testing para un conjunto particular de pruebas agregando y eliminando imports, declarations \(de componentes, directivas y pipes\), y providers.                                                                                                                            |
| `compileComponents`     | Compila el módulo de testing de forma asíncrona después de que hayas terminado de configurarlo. **Debes** llamar a este método si _alguno_ de los componentes del módulo de testing tiene un `templateUrl` o `styleUrls` porque obtener archivos de plantilla y estilo del componente es necesariamente asíncrono. Ver [compileComponents](guide/testing/components-scenarios#calling-compilecomponents). <br /> Después de llamar a `compileComponents`, la configuración del `TestBed` se congela durante la duración del spec actual.                                |                              |
| `createComponent<T>`    | Crea una instancia de un componente de tipo `T` basado en la configuración actual del `TestBed`. Después de llamar a `createComponent`, la configuración del `TestBed` se congela durante la duración del spec actual.                                                                                                                                                                                                                                                                                  |
| `overrideModule`        | Reemplaza metadata para el `NgModule` dado. Recuerda que los módulos pueden importar otros módulos. El método `overrideModule` puede llegar profundamente al módulo de testing actual para modificar uno de estos módulos internos.                                                                                                                                                                                                                                                                               |
| `overrideComponent`     | Reemplaza metadata para la clase de componente dada, que podría estar anidada profundamente dentro de un módulo interno.                                                                                                                                                                                                                                                                                                                                                                                      |
| `overrideDirective`     | Reemplaza metadata para la clase de directiva dada, que podría estar anidada profundamente dentro de un módulo interno.                                                                                                                                                                                                                                                                                                                                                                                      |
| `overridePipe`          | Reemplaza metadata para la clase de pipe dada, que podría estar anidada profundamente dentro de un módulo interno.                                                                                                                                                                                                                                                                                                                                                                                           |

|
| `inject` | Recupera un servicio del inyector `TestBed` actual. La función `inject` es a menudo adecuada para este propósito. Pero `inject` lanza un error si no puede proporcionar el servicio. <br /> ¿Qué pasa si el servicio es opcional? <br /> El método `TestBed.inject()` toma un segundo parámetro opcional, el objeto a retornar si Angular no puede encontrar el provider \(`null` en este ejemplo\): <docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="testbed-get-w-null"/> Después de llamar a `TestBed.inject`, la configuración del `TestBed` se congela durante la duración del spec actual. |
|
| `initTestEnvironment` | Inicializa el entorno de testing para toda la ejecución de pruebas. <br /> Los shims de testing \(`karma-test-shim`, `browser-test-shim`\) lo llaman por ti así que raramente hay una razón para que lo llames tú mismo. <br /> Llama a este método _exactamente una vez_. Para cambiar este predeterminado en medio de una ejecución de pruebas, llama primero a `resetTestEnvironment`. <br /> Especifica la factory del compilador de Angular, un `PlatformRef`, y un módulo de testing de Angular predeterminado. Alternativas para plataformas no-navegador están disponibles en la forma general `@angular/platform-<platform_name>/testing/<platform_name>`. |
| `resetTestEnvironment` | Reinicia el entorno de prueba inicial, incluyendo el módulo de testing predeterminado. |

Algunos de los métodos de instancia del `TestBed` no están cubiertos por métodos de _clase_ `TestBed` estáticos.
Estos rara vez se necesitan.

## El `ComponentFixture`

El `TestBed.createComponent<T>` crea una instancia del componente `T` y retorna un `ComponentFixture` fuertemente tipado para ese componente.

Las propiedades y métodos del `ComponentFixture` proporcionan acceso al componente, su representación DOM y aspectos de su entorno Angular.

### Propiedades de `ComponentFixture`

Aquí están las propiedades más importantes para los probadores, en orden de utilidad probable.

| Propiedades         | Detalles                                                                                                                                                                                                                                                                                                      |
|:------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `componentInstance` | La instancia de la clase del componente creada por `TestBed.createComponent`.                                                                                                                                                                                                                                 |
| `debugElement`      | El `DebugElement` asociado con el elemento raíz del componente. <br /> El `debugElement` proporciona información sobre el componente y su elemento DOM durante la prueba y depuración. Es una propiedad crítica para los probadores. Los miembros más interesantes se cubren [abajo](#debugelement). |
| `nativeElement`     | El elemento DOM nativo en la raíz del componente.                                                                                                                                                                                                                                                             |
| `changeDetectorRef` | El `ChangeDetectorRef` para el componente. <br /> El `ChangeDetectorRef` es más valioso cuando se prueba un componente que tiene el método `ChangeDetectionStrategy.OnPush` o la detección de cambios del componente está bajo tu control programático.                                                       |

### Métodos de `ComponentFixture`

Los métodos _fixture_ hacen que Angular realice ciertas tareas en el árbol de componentes.
Llama a estos métodos para desencadenar comportamiento de Angular en respuesta a una acción de usuario simulada.

Aquí están los métodos más útiles para los probadores.

| Métodos             | Detalles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|:------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detectChanges`     | Desencadena un ciclo de detección de cambios para el componente. <br /> Llámalo para inicializar el componente \(llama a `ngOnInit`\) y después de que tu código de prueba cambie los valores de propiedad vinculados a datos del componente. Angular no puede ver que has cambiado `personComponent.name` y no actualizará el binding `name` hasta que llames a `detectChanges`. <br /> Ejecuta `checkNoChanges` después para confirmar que no hay actualizaciones circulares a menos que se llame como `detectChanges(false)`;                                                                                                                               |
| `autoDetectChanges` | Establece esto a `true` cuando quieras que el fixture detecte cambios automáticamente. <br /> Cuando autodetect es `true`, el test fixture llama a `detectChanges` inmediatamente después de crear el componente. Luego escucha eventos de zona pertinentes y llama a `detectChanges` en consecuencia. Cuando tu código de prueba modifica valores de propiedad del componente directamente, probablemente aún tengas que llamar a `fixture.detectChanges` para desencadenar actualizaciones de binding de datos. <br /> El predeterminado es `false`. Los probadores que prefieren control fino sobre el comportamiento de prueba tienden a mantenerlo en `false`. |
| `checkNoChanges`    | Ejecuta una ejecución de detección de cambios para asegurarse de que no hay cambios pendientes. Lanza excepciones si los hay.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `isStable`          | Si el fixture es actualmente _estable_, retorna `true`. Si hay tareas async que no se han completado, retorna `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `whenStable`        | Retorna una promesa que se resuelve cuando el fixture es estable. <br /> Para reanudar las pruebas después de la finalización de actividad asíncrona o detección de cambios asíncrona, engancha esa promesa. Ver [whenStable](guide/testing/components-scenarios#whenstable).                                                                                                                                                                                                                                                                                                                                                                                   |
| `destroy`           | Desencadena la destrucción del componente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

#### `DebugElement`

El `DebugElement` proporciona información crucial sobre la representación DOM del componente.

Desde el `DebugElement` del componente raíz de prueba retornado por `fixture.debugElement`, puedes caminar \(y consultar\) todo el subárbol de elementos y componentes del fixture.

Aquí están los miembros más útiles de `DebugElement` para los probadores, en orden aproximado de utilidad:

| Miembros              | Detalles                                                                                                                                                                                                                                                                                                                                                                                                      |
|:--------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeElement`       | El elemento DOM correspondiente en el navegador                                                                                                                                                                                                                                                                                                                                                               |
| `query`               | Llamar a `query(predicate: Predicate<DebugElement>)` retorna el primer `DebugElement` que coincide con el predicate a cualquier profundidad en el subárbol.                                                                                                                                                                                                                                                           |
| `queryAll`            | Llamar a `queryAll(predicate: Predicate<DebugElement>)` retorna todos los `DebugElements` que coinciden con el predicate a cualquier profundidad en el subárbol.                                                                                                                                                                                                                                                           |
| `injector`            | El inyector de dependencias del host. Por ejemplo, el inyector de instancia del componente del elemento raíz.                                                                                                                                                                                                                                                                                                 |
| `componentInstance`   | La propia instancia del componente del elemento, si tiene una.                                                                                                                                                                                                                                                                                                                                                |
| `context`             | Un objeto que proporciona contexto padre para este elemento. A menudo una instancia de componente ancestro que gobierna este elemento. <br /> Cuando un elemento se repite dentro de un bloque `@for`, el contexto es un `RepeaterContext` cuya propiedad `$implicit` es el valor de la instancia de la fila. Por ejemplo, el `hero` en `@for(hero of heroes; ...)`.                                           |
| `children`            | Los hijos `DebugElement` inmediatos. Camina el árbol descendiendo a través de `children`.  `DebugElement` también tiene `childNodes`, una lista de objetos `DebugNode`. `DebugElement` deriva de objetos `DebugNode` y a menudo hay más nodos que elementos. Los probadores usualmente pueden ignorar nodos planos.                                                                                           |
| `parent`              | El padre `DebugElement`. Null si este es el elemento raíz.                                                                                                                                                                                                                                                                                                                                                    |
| `name`                | El nombre de tag del elemento, si es un elemento.                                                                                                                                                                                                                                                                                                                                                             |
| `triggerEventHandler` | Desencadena el evento por su nombre si hay un listener correspondiente en la colección `listeners` del elemento. El segundo parámetro es el _objeto evento_ esperado por el handler. Ver [triggerEventHandler](guide/testing/components-scenarios#trigger-event-handler). <br /> Si el evento carece de un listener o hay algún otro problema, considera llamar a `nativeElement.dispatchEvent(eventObject)`. |
| `listeners`           | Los callbacks adjuntos a las propiedades `@Output` del componente y/o las propiedades de evento del elemento.                                                                                                                                                                                                                                                                                                 |
| `providerTokens`      | Los tokens de lookup del inyector de este componente. Incluye el componente mismo más los tokens que el componente lista en su metadata `providers`.                                                                                                                                                                                                                                                          |
| `source`              | Dónde encontrar este elemento en la plantilla del componente fuente.                                                                                                                                                                                                                                                                                                                                          |
| `references`          | Diccionario de objetos asociados con variables locales de plantilla \(por ejemplo, `#foo`\), con clave del nombre de la variable local.                                                                                                                                                                                                                                                                       |

Los métodos `DebugElement.query(predicate)` y `DebugElement.queryAll(predicate)` toman un predicate que filtra el subárbol del elemento fuente para coincidencias `DebugElement`.

El predicate es cualquier método que toma un `DebugElement` y retorna un valor _truthy_.
El siguiente ejemplo encuentra todos los `DebugElements` con una referencia a una variable local de plantilla llamada "content":

<docs-code header="demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="custom-predicate"/>

La clase `By` de Angular tiene tres métodos estáticos para predicates comunes:

| Método estático           | Detalles                                                                           |
|:------------------------- |:---------------------------------------------------------------------------------- |
| `By.all`                  | Retorna todos los elementos                                                        |
| `By.css(selector)`        | Retorna elementos con selectores CSS coincidentes                                  |
| `By.directive(directive)` | Retorna elementos que Angular coincidió con una instancia de la clase de directiva |

<docs-code header="hero-list.component.spec.ts" path="adev/src/content/examples/testing/src/app/hero/hero-list.component.spec.ts" visibleRegion="by"/>
