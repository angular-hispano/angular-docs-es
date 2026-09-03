# Depuración y solución de problemas de inyección de dependencias

Los problemas de inyección de dependencias (DI) suelen originarse en errores de configuración, problemas de alcance o patrones de uso incorrectos. Esta guía te ayuda a identificar y resolver los problemas comunes de DI que encuentran los desarrolladores.

## Errores comunes y soluciones {#common-pitfalls-and-solutions}

### Servicios no disponibles donde se esperan {#services-not-available-where-expected}

Uno de los problemas de DI más comunes ocurre cuando intentas inyectar un servicio pero Angular no puede encontrarlo en el inyector actual ni en ningún inyector padre. Esto suele suceder cuando el servicio se provee en el alcance equivocado o no se provee en absoluto.

#### Discrepancia en el alcance del proveedor {#provider-scope-mismatch}

Cuando provees un servicio en el arreglo `providers` de un componente, Angular crea una instancia en el inyector de ese componente. Esta instancia solo está disponible para ese componente y sus hijos. Los componentes padres y hermanos no pueden acceder a ella porque usan inyectores diferentes.

```angular-ts {header: 'child-view.ts'}
import {Component} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-child',
  template: '<p>Child</p>',
  providers: [DataStore], // Solo disponible en este componente y sus hijos
})
export class ChildView {}
```

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-parent',
  template: '<app-child />',
})
export class ParentView {
  private dataService = inject(DataStore); // ERROR: No disponible para el padre
}
```

Angular solo busca hacia arriba en la jerarquía, nunca hacia abajo. Los componentes padres no pueden acceder a servicios provistos en componentes hijos.

**Solución:** Provee el servicio en un nivel superior (aplicación o componente padre).

```ts {prefer}
import {Service} from '@angular/core';

@Service()
export class DataStore {
  // Disponible en todas partes
}
```

TIP: `@Service` hace que los servicios estén disponibles en todas partes y habilita el tree-shaking. Si no quieres que su alcance sea toda la aplicación, especifica `autoProvided: false`.

#### Servicios y rutas con lazy loading {#services-and-lazy-loaded-routes}

Cuando provees un servicio en el arreglo `providers` de una ruta con lazy loading, Angular crea un inyector hijo para esa ruta. Este inyector y sus servicios solo están disponibles después de que la ruta se carga. Los componentes de las partes de tu aplicación que se cargan de forma anticipada no pueden acceder a estos servicios porque usan inyectores diferentes que existen antes de que se cree el inyector de la ruta con lazy loading.

```ts {header: 'feature.routes.ts'}
import {Routes} from '@angular/router';
import {FeatureClient} from './feature-client';

export const featureRoutes: Routes = [
  {
    path: 'feature',
    providers: [FeatureClient],
    loadComponent: () => import('./feature-view'),
  },
];
```

```angular-ts {header: 'eager-view.ts'}
import {Component, inject} from '@angular/core';
import {FeatureClient} from './feature-client';

@Component({
  selector: 'app-eager',
  template: '<p>Eager Component</p>',
})
export class EagerView {
  private featureService = inject(FeatureClient); // ERROR: Todavía no disponible
}
```

Las rutas con lazy loading crean inyectores hijos que solo están disponibles después de que la ruta se carga.

NOTE: Por defecto, los inyectores de ruta y sus servicios persisten incluso después de navegar fuera de la ruta. No se destruyen hasta que la aplicación se cierra. Para la limpieza automática de inyectores de ruta sin usar, consulta [personalizar el comportamiento de rutas](guide/routing/customizing-route-behavior#experimental-automatic-cleanup-of-unused-route-injectors).

**Solución:** Usa `@Service` para los servicios que necesitan compartirse a través de los límites de lazy loading.

```ts {prefer, header: 'Provee en root los servicios compartidos'}
import {Service} from '@angular/core';

@Service()
export class FeatureClient {
  // Disponible en todas partes, incluso antes del lazy load
}
```

Si el servicio debe cargarse con lazy loading pero seguir disponible para los componentes de carga anticipada, inyéctalo solo donde sea necesario y usa inyección opcional para manejar su disponibilidad.

### Múltiples instancias en lugar de singletons {#multiple-instances-instead-of-singletons}

Esperas una única instancia compartida (singleton) pero obtienes instancias separadas en diferentes componentes.

#### Proveer en el componente en lugar de en root {#providing-in-component-instead-of-root}

Cuando agregas un servicio al arreglo `providers` de un componente, Angular crea una nueva instancia de ese servicio por cada instancia del componente. Cada componente obtiene su propia instancia separada del servicio, lo que significa que los cambios en un componente no afectan a la instancia del servicio en otros componentes. Esto suele ser inesperado cuando quieres estado compartido en toda tu aplicación.

```angular-ts {avoid, header: 'Un proveedor a nivel de componente crea múltiples instancias'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
  providers: [UserClient], // ¡Crea una nueva instancia por componente!
})
export class UserProfile {
  private userService = inject(UserClient);
}

@Component({
  selector: 'app-settings',
  template: '<p>Settings</p>',
  providers: [UserClient], // ¡Instancia diferente!
})
export class UserSettings {
  private userService = inject(UserClient);
}
```

Cada componente obtiene su propia instancia de `UserClient`. Los cambios en un componente no afectan al otro.

**Solución:** Usa `@Service` para los singletons.

```ts {prefer, header: 'Singleton a nivel de root'}
import {Injectable} from '@angular/core';

@Service()
export class UserClient {
  // Una única instancia compartida entre todos los componentes
}
```

#### Cuando las múltiples instancias son intencionales {#when-multiple-instances-are-intentional}

A veces quieres instancias separadas por componente para manejar estado específico del componente.

```angular-ts {header: 'Intencional: estado con alcance de componente'}
import {Injectable, signal} from '@angular/core';

@Injectable() // Sin providedIn: debe proveerse explícitamente
export class FormStateStore {
  private formData = signal({});

  setData(data: any) {
    this.formData.set(data);
  }

  getData() {
    return this.formData();
  }
}

@Component({
  selector: 'app-user-form',
  template: '<form>...</form>',
  providers: [FormStateStore], // Cada formulario obtiene su propio estado
})
export class UserForm {
  private formState = inject(FormStateStore);
}
```

Este patrón es útil para:

- Gestión del estado de formularios (cada formulario tiene estado aislado)
- Caché específica de componente
- Datos temporales que no deberían compartirse

### Uso incorrecto de inject() {#incorrect-inject-usage}

La función `inject()` solo funciona en contextos específicos durante la construcción de la clase y la ejecución de factories.

#### Usar inject() en lifecycle hooks {#using-inject-in-lifecycle-hooks}

Cuando llamas a la función `inject()` dentro de lifecycle hooks como `ngOnInit()`, `ngAfterViewInit()` o `ngOnDestroy()`, Angular lanza un error porque estos métodos se ejecutan fuera del contexto de inyección. El contexto de inyección solo está disponible durante la ejecución síncrona de la construcción de la clase, que ocurre antes de que se llamen los lifecycle hooks.

```angular-ts {avoid, header: 'inject() en ngOnInit'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  userName = '';

  ngOnInit() {
    const userService = inject(UserClient); // ERROR: No es un contexto de inyección
    this.userName = userService.getUser().name;
  }
}
```

**Solución:** Captura las dependencias y deriva los valores en los inicializadores de campos.

```angular-ts {prefer, header: 'Deriva los valores en los inicializadores de campos'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient);
  userName = this.userService.getUser().name;
}
```

#### Usar el Injector para inyección diferida {#using-the-injector-for-deferred-injection}

Cuando necesitas obtener servicios fuera de un contexto de inyección, usa el `Injector` capturado directamente con `injector.get()`:

```angular-ts
import {Component, inject, Injector} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<button (click)="delayedLoad()">Load Later</button>',
})
export class UserProfile {
  private injector = inject(Injector);

  delayedLoad() {
    setTimeout(() => {
      const userService = this.injector.get(UserClient);
      console.log(userService.getUser());
    }, 1000);
  }
}
```

#### Usar runInInjectionContext para callbacks {#using-runininjectioncontext-for-callbacks}

Usa `runInInjectionContext()` cuando necesites permitir que **otro código** llame a `inject()`. Esto es útil cuando aceptas callbacks que podrían usar inyección de dependencias:

```angular-ts
import {Component, inject, Injector, input} from '@angular/core';

@Component({
  selector: 'app-data-loader',
  template: '<button (click)="load()">Load</button>',
})
export class DataLoader {
  private injector = inject(Injector);
  onLoad = input<() => void>();

  load() {
    const callback = this.onLoad();
    if (callback) {
      // Permite que el callback use inject()
      this.injector.runInInjectionContext(callback);
    }
  }
}
```

El método `runInInjectionContext()` crea un contexto de inyección temporal, permitiendo que el código dentro del callback llame a `inject()`.

IMPORTANT: Siempre que sea posible, captura las dependencias a nivel de clase. Usa `injector.get()` para obtenciones diferidas simples, y `runInInjectionContext()` solo cuando código externo necesite llamar a `inject()`.

TIP: Usa `assertInInjectionContext()` para verificar que tu código se ejecuta en un contexto de inyección válido. Esto es útil al crear funciones reutilizables que llaman a `inject()`. Consulta [Verificar el contexto](guide/di/dependency-injection-context#asserts-the-context) para más detalles.

### Confusión entre providers y viewProviders {#providers-vs-viewproviders-confusion}

La diferencia entre `providers` y `viewProviders` afecta a los escenarios de proyección de contenido.

#### Entendiendo la diferencia {#understanding-the-difference}

**providers:** Disponible para la plantilla del componente Y para cualquier contenido proyectado dentro del componente (ng-content).

**viewProviders:** Solo disponible para la plantilla del componente, NO para el contenido proyectado.

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  providers: [ThemeStore], // Disponible para los hijos de contenido
})
export class ParentView {
  protected themeService = inject(ThemeStore);
}

@Component({
  selector: 'app-parent-view',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  viewProviders: [ThemeStore], // NO disponible para los hijos de contenido
})
export class ParentViewOnly {
  protected themeService = inject(ThemeStore);
}
```

```angular-ts {header: 'child-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-child',
  template: '<p>Child theme: {{theme()}}</p>',
})
export class ChildView {
  private themeService = inject(ThemeStore, {optional: true});
  theme = () => this.themeService?.theme() ?? 'none';
}
```

```angular-ts {header: 'app.ts'}
@Component({
  selector: 'app-root',
  template: `
    <app-parent>
      <app-child />
      <!-- Puede acceder a ThemeStore -->
    </app-parent>

    <app-parent-view>
      <app-child />
      <!-- No puede acceder a ThemeStore -->
    </app-parent-view>
  `,
})
export class App {}
```

**Cuando se proyecta dentro de `app-parent`:** El componente hijo puede inyectar `ThemeStore` porque `providers` lo hace disponible para el contenido proyectado.

**Cuando se proyecta dentro de `app-parent-view`:** El componente hijo no puede inyectar `ThemeStore` porque `viewProviders` lo restringe únicamente a la plantilla del padre.

#### Elegir entre providers y viewProviders {#choosing-between-providers-and-viewproviders}

Usa `providers` cuando:

- El servicio debe estar disponible para el contenido proyectado
- Quieres que los hijos de contenido accedan al servicio
- Provees servicios de propósito general

Usa `viewProviders` cuando:

- El servicio solo debe estar disponible para la plantilla de tu componente
- Quieres ocultar detalles de implementación al contenido proyectado
- Provees servicios internos que no deberían filtrarse hacia afuera

**Recomendación por defecto:** Usa `providers` a menos que tengas una razón específica para restringir el acceso con `viewProviders`.

### Problemas con InjectionToken {#injectiontoken-issues}

Al usar `InjectionToken` para dependencias que no son clases, los desarrolladores suelen encontrar problemas relacionados con la identidad del token, la seguridad de tipos y la configuración de proveedores. Estos problemas suelen originarse en cómo JavaScript maneja la identidad de los objetos y cómo TypeScript infiere los tipos.

#### Confusión con la identidad del token {#token-identity-confusion}

Cuando creas una nueva instancia de `InjectionToken`, JavaScript crea un objeto único en memoria. Incluso si creas otro `InjectionToken` con exactamente la misma cadena de descripción, es un objeto completamente diferente. Angular usa la identidad del objeto token (no su descripción) para emparejar proveedores con puntos de inyección, así que los tokens con la misma descripción pero distinta identidad de objeto no pueden acceder a los valores del otro.

```ts {header: 'config.token.ts'}
import {InjectionToken} from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app config');
```

```ts {header: 'app.config.ts'}
import {APP_CONFIG} from './config.token';

export const appConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
};

bootstrapApplication(App, {
  providers: [{provide: APP_CONFIG, useValue: appConfig}],
});
```

```angular-ts {avoid, header: 'feature-view.ts'}
// Creando un nuevo token con la misma descripción
import {InjectionToken, inject} from '@angular/core';
import {AppConfig} from './config.token';

const APP_CONFIG = new InjectionToken<AppConfig>('app config');

@Component({
  selector: 'app-feature',
  template: '<p>Feature</p>',
})
export class FeatureView {
  private config = inject(APP_CONFIG); // ERROR: ¡Instancia de token diferente!
}
```

Aunque ambos tokens tienen la descripción `'app config'`, son objetos diferentes. Angular compara los tokens por referencia, no por descripción.

**Solución:** Importa la misma instancia del token.

```angular-ts {prefer, header: 'feature-view.ts'}
import {inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from './config.token';

@Component({
  selector: 'app-feature',
  template: '<p>API: {{config.apiUrl}}</p>',
})
export class FeatureView {
  protected config = inject(APP_CONFIG); // Funciona: misma instancia del token
}
```

TIP: Exporta siempre los tokens desde un archivo compartido e impórtalos en todos los lugares donde se necesiten. Nunca crees múltiples instancias de `InjectionToken` con la misma descripción.

#### Intentar inyectar interfaces {#trying-to-inject-interfaces}

Cuando defines una interfaz de TypeScript, esta solo existe durante la compilación para la verificación de tipos. TypeScript elimina todas las definiciones de interfaces al compilar a JavaScript, así que en tiempo de ejecución no hay ningún objeto que Angular pueda usar como token de inyección. Si intentas inyectar un tipo de interfaz, Angular no tiene nada con qué emparejar la configuración del proveedor.

```angular-ts {avoid, header: "No se puede inyectar una interfaz"}
interface UserConfig {
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
})
export class UserProfile {
  // ERROR: Las interfaces no existen en tiempo de ejecución
  constructor(private config: UserConfig) {}
}
```

**Solución:** Usa `InjectionToken` para tipos de interfaz.

```angular-ts {prefer, header: 'Usa InjectionToken para interfaces'}
import {InjectionToken, inject} from '@angular/core';

interface UserConfig {
  name: string;
  email: string;
}

export const USER_CONFIG = new InjectionToken<UserConfig>('user configuration');

// Provee la configuración
bootstrapApplication(App, {
  providers: [
    {
      provide: USER_CONFIG,
      useValue: {name: 'Alice', email: 'alice@example.com'},
    },
  ],
});

// Inyecta usando el token
@Component({
  selector: 'app-profile',
  template: '<p>User: {{config.name}}</p>',
})
export class UserProfile {
  protected config = inject(USER_CONFIG);
}
```

El `InjectionToken` existe en tiempo de ejecución y puede usarse para la inyección, mientras que la interfaz `UserConfig` proporciona seguridad de tipos durante el desarrollo.

### Dependencias circulares {#circular-dependencies}

Las dependencias circulares ocurren cuando los servicios se inyectan entre sí, creando un ciclo que Angular no puede resolver. Para explicaciones detalladas y ejemplos de código, consulta [NG0200: Dependencia circular](errors/NG0200).

**Estrategias de resolución** (en orden de preferencia):

1. **Reestructurar** - Extrae la lógica compartida a un tercer servicio, rompiendo el ciclo
2. **Usar eventos** - Reemplaza las dependencias directas con comunicación basada en eventos (como `Subject`)
3. **Inyección diferida** - Usa `Injector.get()` para diferir una dependencia (último recurso)

NOTE: No uses `forwardRef()` para dependencias circulares entre servicios; solo resuelve importaciones circulares en configuraciones de componentes standalone.

## Depurando la resolución de dependencias {#debugging-dependency-resolution}

### Entendiendo el proceso de resolución {#understanding-the-resolution-process}

Angular resuelve las dependencias recorriendo hacia arriba la jerarquía de inyectores. Cuando ocurre un `NullInjectorError`, entender este orden de búsqueda te ayuda a identificar dónde agregar el proveedor que falta.

Angular busca en este orden:

1. **Inyector de elemento** - El componente o directiva actual
2. **Inyectores de elementos padres** - Hacia arriba por el árbol del DOM a través de los componentes padres
3. **Inyector de entorno** - El inyector de la ruta o de la aplicación
4. **NullInjector** - Lanza `NullInjectorError` si no se encuentra

Cuando ves un `NullInjectorError`, el servicio no está provisto en ningún nivel al que el componente pueda acceder. Verifica que:

- El servicio tiene `@Service()`, o
- El servicio tiene `@Injectable({providedIn: 'root'})`, o
- El servicio está en un arreglo `providers` al que el componente puede llegar

Puedes modificar este comportamiento de búsqueda con modificadores de resolución como `self`, `skipSelf`, `host` y `optional`. Para una cobertura completa de las reglas y modificadores de resolución, consulta la [guía de inyectores jerárquicos](guide/di/hierarchical-dependency-injection).

### Usando Angular DevTools {#using-angular-devtools}

Angular DevTools incluye un inspector del árbol de inyectores que visualiza toda la jerarquía de inyectores y muestra qué proveedores están disponibles en cada nivel. Para la instalación y el uso general, consulta la [documentación de inyectores de Angular DevTools](tools/devtools/injectors).

Al depurar problemas de DI, usa DevTools para responder estas preguntas:

- **¿Está provisto el servicio?** Selecciona el componente que falla al inyectar y comprueba si el servicio aparece en la sección Injector.
- **¿En qué nivel?** Recorre hacia arriba el árbol de componentes para encontrar dónde se provee realmente el servicio (nivel de componente, ruta o aplicación).
- **¿Múltiples instancias?** Si un servicio singleton aparece en múltiples inyectores de componente, probablemente esté provisto en arreglos `providers` de componentes en lugar de usar `@Service` o `providedIn: 'root'`.

Si un servicio nunca aparece en ningún inyector, verifica que tiene el decorador `@Service` o que está listado en un arreglo `providers`.

### Registro y rastreo de la inyección {#logging-and-tracing-injection}

Cuando DevTools no es suficiente, usa registros (logs) para rastrear el comportamiento de la inyección.

#### Registrar la creación de servicios {#logging-service-creation}

Agrega registros en consola a los constructores de los servicios para ver cuándo se crean.

```ts
import {Service} from '@angular/core';

@Service()
export class UserClient {
  constructor() {
    console.log('UserClient created');
    console.trace(); // Muestra la pila de llamadas
  }

  getUser() {
    return {name: 'Alice'};
  }
}
```

Cuando el servicio se crea, verás el mensaje de registro y un stack trace que muestra dónde ocurrió la inyección.

**Qué buscar:**

- ¿Cuántas veces se llama al constructor? (debería ser una vez para los singletons)
- ¿En qué parte del código se está inyectando? (revisa el stack trace)
- ¿Se crea en el momento esperado? (arranque de la aplicación vs. de forma diferida)

#### Comprobar la disponibilidad de un servicio {#checking-service-availability}

Usa inyección opcional con registros para determinar si un servicio está disponible.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});

  constructor() {
    if (this.userService) {
      console.log('UserClient available:', this.userService);
    } else {
      console.warn('UserClient NOT available');
      console.trace(); // Muestra dónde intentamos inyectar
    }
  }
}
```

Este patrón te ayuda a verificar si un servicio está disponible sin que la aplicación falle.

#### Registrar los modificadores de resolución {#logging-resolution-modifiers}

Prueba diferentes estrategias de resolución con registros.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
  providers: [UserClient],
})
export class DebugView {
  // Intenta obtener la instancia local
  private localService = inject(UserClient, {self: true, optional: true});

  // Intenta obtener la instancia del padre
  private parentService = inject(UserClient, {
    skipSelf: true,
    optional: true,
  });

  constructor() {
    console.log('Local instance:', this.localService);
    console.log('Parent instance:', this.parentService);
    console.log('Same instance?', this.localService === this.parentService);
  }
}
```

Esto te muestra qué instancias están disponibles en los distintos niveles de inyectores.

### Flujo de trabajo de depuración {#debugging-workflow}

Cuando la DI falla, sigue este enfoque sistemático:

**Paso 1: Lee el mensaje de error**

- Identifica el código de error (NG0200, NG0203, etc.)
- Lee la ruta de dependencias
- Anota qué token falló

**Paso 2: Revisa lo básico**

- ¿El servicio tiene `@Service` o `@Injectable()`?
- Si usas `@Injectable`, ¿`providedIn` está configurado correctamente?
- ¿Las importaciones son correctas?
- ¿El archivo está incluido en la compilación?

**Paso 3: Verifica el contexto de inyección**

- ¿Se llama a `inject()` en un contexto válido?
- Revisa problemas de asincronía (await, setTimeout, promesas)
- Verifica el momento (no después de la destrucción)

**Paso 4: Usa herramientas de depuración**

- Abre Angular DevTools
- Revisa la jerarquía de inyectores
- Agrega registros en consola a los constructores
- Usa inyección opcional para probar la disponibilidad

**Paso 5: Simplifica y aísla**

- Elimina las dependencias una por una
- Prueba en un componente mínimo
- Revisa cada nivel de inyector por separado
- Crea un caso de reproducción

## Referencia de errores de DI {#di-error-reference}

Esta sección proporciona información detallada sobre códigos de error de DI específicos de Angular que puedes encontrar. Úsala como referencia cuando veas estos errores en tu consola.

### NullInjectorError: No provider for [Service] {#nullinjectorerror-no-provider-for-service}

**Código de error:** Ninguno (se muestra como `NullInjectorError`)

Este error ocurre cuando Angular no puede encontrar un proveedor para un token en la jerarquía de inyectores. El mensaje de error incluye una ruta de dependencias que muestra dónde se intentó la inyección.

```
NullInjectorError: No provider for UserClient!
  Dependency path: App -> AuthClient -> UserClient
```

La ruta de dependencias muestra que `App` inyectó `AuthClient`, que intentó inyectar `UserClient`, pero no se encontró ningún proveedor.

#### Falta el decorador `@Service ` o `@Injectable` {#missing-the-service-or-injectable-decorator}

La causa más común es olvidar el decorador `@Service` o `@Injectable()` en una clase de servicio.

```ts {avoid, header: 'Falta el decorador'}
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Angular requiere el decorador `@Service()` para generar los metadatos necesarios para la inyección de dependencias.

```ts {prefer, header: 'Incluye @Service'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

NOTE: Las clases con constructores sin argumentos pueden funcionar sin `@Service()`, pero no se recomienda. Incluye siempre el decorador por consistencia y para evitar problemas al agregar dependencias más adelante.

#### Falta la configuración de providedIn {#missing-providedin-configuration}

Un servicio puede tener `@Injectable()` pero no especificar dónde debe proveerse.

```ts {avoid, header: 'Sin providedIn especificado'}
import {Injectable} from '@angular/core';

@Injectable()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Usa el decorador `@Service` para que el servicio esté disponible en toda tu aplicación.

```ts {prefer, header: 'Especifica providedIn'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

El decorador `@Service` hace que el servicio esté disponible en toda la aplicación y habilita el tree-shaking (el servicio se elimina del bundle si nunca se inyecta).

#### Faltan importaciones en un componente standalone {#standalone-component-missing-imports}

En Angular v20+ con componentes standalone, debes importar o proveer explícitamente las dependencias en cada componente.

```angular-ts {avoid, header: 'Falta la importación del servicio'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // ERROR: Sin proveedor
  user = this.userService.getUser();
}
```

Asegúrate de que el servicio use `@Service` o agrégalo al arreglo `providers` del componente.

```angular-ts {prefer, header: 'El servicio usa providedIn: root'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // Funciona: providedIn: 'root'
  user = this.userService.getUser();
}
```

#### Depurar con la ruta de dependencias {#debugging-with-the-dependency-path}

La ruta de dependencias en el mensaje de error muestra la cadena de inyecciones que llevó al fallo.

```
NullInjectorError: No provider for LoggerStore!
  Dependency path: App -> DataStore -> ApiClient -> LoggerStore
```

Esta ruta te dice:

1. `App` inyectó `DataStore`
2. `DataStore` inyectó `ApiClient`
3. `ApiClient` intentó inyectar `LoggerStore`
4. No se encontró ningún proveedor para `LoggerStore`

Empieza tu investigación al final de la cadena (`LoggerStore`) y verifica que tiene la configuración adecuada.

#### Comprobar la disponibilidad del proveedor con inyección opcional {#checking-provider-availability-with-optional-injection}

Usa inyección opcional para comprobar si existe un proveedor sin lanzar un error.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Service available: {{serviceAvailable}}</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});
  serviceAvailable = this.userService !== null;
}
```

La inyección opcional devuelve `null` si no se encuentra ningún proveedor, permitiéndote manejar su ausencia de forma controlada.

### NG0203: inject() must be called from an injection context {#ng0203-inject-must-be-called-from-an-injection-context}

**Código de error:** NG0203

Este error ocurre cuando llamas a `inject()` fuera de un contexto de inyección válido. Angular requiere que `inject()` se llame de forma síncrona durante la construcción de la clase o la ejecución de una factory.

```
NG0203: inject() must be called from an injection context such as a
constructor, a factory function, a field initializer, or a function
used with `runInInjectionContext`.
```

#### Contextos de inyección válidos {#valid-injection-contexts}

Angular permite `inject()` en estos lugares:

1. **Inicializadores de campos de clase**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService = inject(UserClient); // Válido
     user = this.userService.getUser();
   }
   ```

2. **Constructor de la clase**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService: UserClient;

     constructor() {
       this.userService = inject(UserClient); // Válido
     }

     user = this.userService.getUser();
   }
   ```

3. **Funciones factory de proveedores**

   ```ts
   import {inject, InjectionToken} from '@angular/core';
   import {UserClient} from './user-client';

   export const GREETING = new InjectionToken<string>('greeting', {
     factory() {
       const userService = inject(UserClient); // Válido
       const user = userService.getUser();
       return `Hello, ${user.name}`;
     },
   });
   ```

4. **Dentro de runInInjectionContext()**

   ```angular-ts
   import {Component, inject, Injector} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<button (click)="loadUser()">Load User</button>',
   })
   export class UserProfile {
     private injector = inject(Injector);

     loadUser() {
       this.injector.runInInjectionContext(() => {
         const userService = inject(UserClient); // Válido
         console.log(userService.getUser());
       });
     }
   }
   ```

Otros contextos de inyección en los que `inject()` también funciona incluyen:

- [provideAppInitializer](api/core/provideAppInitializer)
- [provideEnvironmentInitializer](api/core/provideEnvironmentInitializer)
- [Guards de ruta](guide/routing/route-guards) funcionales
- [Resolvers de datos](guide/routing/data-resolvers) funcionales

#### Cuándo ocurre este error {#when-this-error-occurs}

Este error ocurre al:

- Llamar a `inject()` en lifecycle hooks (`ngOnInit`, `ngAfterViewInit`, etc.)
- Llamar a `inject()` después de un `await` en funciones asíncronas
- Llamar a `inject()` en callbacks (`setTimeout`, `Promise.then()`, etc.)
- Llamar a `inject()` fuera de la fase de construcción de la clase

Consulta la sección "Uso incorrecto de inject()" para ejemplos detallados y soluciones.

#### Soluciones y alternativas {#solutions-and-workarounds}

**Solución 1:** Captura las dependencias en inicializadores de campos (la más común)

```ts
private userService = inject(UserClient) // Captura a nivel de clase
```

**Solución 2:** Usa `runInInjectionContext()` para callbacks

```ts
private injector = inject(Injector)

someCallback() {
  this.injector.runInInjectionContext(() => {
    const service = inject(MyClient)
  })
}
```

**Solución 3:** Pasa las dependencias como parámetros en lugar de inyectarlas

```ts
// En lugar de inyectar dentro de un callback
setTimeout(() => {
  const service = inject(MyClient) // ERROR
}, 1000)

// Captura primero, luego usa
private service = inject(MyClient)

setTimeout(() => {
  this.service.doSomething() // Usa la referencia capturada
}, 1000)
```

### NG0200: Circular dependency detected {#ng0200-circular-dependency-detected}

**Código de error:** NG0200

Este error ocurre cuando dos o más servicios dependen entre sí, creando una dependencia circular que Angular no puede resolver.

```
NG0200: Circular dependency in DI detected for AuthClient
  Dependency path: AuthClient -> UserClient -> AuthClient
```

La ruta de dependencias muestra el ciclo: `AuthClient` depende de `UserClient`, que a su vez depende de `AuthClient`.

#### Entendiendo el error {#understanding-the-error}

Angular crea instancias de servicios llamando a sus constructores e inyectando sus dependencias. Cuando los servicios dependen entre sí de forma circular, Angular no puede determinar cuál crear primero.

#### Causas comunes {#common-causes}

- Dependencia circular directa (Servicio A → Servicio B → Servicio A)
- Dependencia circular indirecta (Servicio A → Servicio B → Servicio C → Servicio A)
- Ciclos de importación en archivos de módulos que además tienen dependencias entre servicios

#### Estrategias de resolución {#resolution-strategies}

Consulta la sección "Dependencias circulares" para ejemplos detallados y soluciones:

1. **Reestructurar** - Extrae la lógica compartida a un tercer servicio (recomendado)
2. **Usar eventos** - Reemplaza las dependencias directas con comunicación basada en eventos
3. **Inyección diferida** - Usa `Injector.get()` para diferir una dependencia (último recurso)

NO uses `forwardRef()` para dependencias circulares entre servicios. Solo resuelve importaciones circulares en configuraciones de componentes.

### Otros códigos de error de DI {#other-di-error-codes}

Para explicaciones detalladas y soluciones de estos errores, consulta la [referencia de errores de Angular](errors):

| Código de error         | Descripción                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| [NG0204](errors/NG0204) | No se pueden resolver todos los parámetros - falta el decorador `@Injectable()`                   |
| [NG0205](errors/NG0205) | Inyector ya destruido - acceso a servicios después de la destrucción del componente               |
| [NG0207](errors/NG0207) | EnvironmentProviders en el contexto equivocado - uso de `provideHttpClient()` en providers de componente |

## Próximos pasos {#next-steps}

Cuando encuentres errores de DI, recuerda:

1. Leer con atención el mensaje de error y la ruta de dependencias
2. Verificar la configuración básica (decoradores, `providedIn`, importaciones)
3. Revisar el contexto de inyección y el momento en que ocurre
4. Usar DevTools y registros para investigar
5. Simplificar y aislar el problema

Para una comprensión más profunda de temas específicos sobre inyección de dependencias, consulta:

- [Entendiendo la inyección de dependencias](guide/di) - Conceptos y patrones fundamentales de DI
- [Inyección de dependencias jerárquica](guide/di/hierarchical-dependency-injection) - Cómo funciona la jerarquía de inyectores
- [Pruebas con inyección de dependencias](guide/testing) - Uso de TestBed y mocking de dependencias
