# Configurando proveedores de dependencias

Las secciones anteriores describieron cómo usar instancias de clase como dependencias.
Además de las clases, también puedes usar valores como `boolean`, `string`, `Date` y objetos como dependencias.
Angular proporciona las APIs necesarias para hacer flexible la configuración de dependencias, para que puedas hacer que esos valores estén disponibles en DI.

## Especificando un token de proveedor

Si especificas la clase de servicio como el token de proveedor, el comportamiento por defecto es que el inyector instancie esa clase usando el operador `new`.

En el siguiente ejemplo, el componente de la aplicación provee una instancia de `Logger`:

<docs-code header="src/app/app.component.ts" language="typescript">
providers: [Logger],
</docs-code>

Sin embargo, puedes configurar DI para asociar el token de proveedor `Logger` con una clase diferente o cualquier otro valor.
Así que cuando se inyecte `Logger`, se usará el valor configurado en su lugar.

De hecho, la sintaxis del proveedor de clase es una expresión abreviada que se expande en una configuración de proveedor, definida por la interfaz `Provider`.
Angular expande el valor `providers` en este caso en un objeto de proveedor completo de la siguiente manera:

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: Logger }]
</docs-code>

La configuración de proveedor expandida es un objeto literal con dos propiedades:

- La propiedad `provide` contiene el token que sirve como clave para consumir el valor de la dependencia.
- La segunda propiedad es un objeto de definición de proveedor, que le dice al inyector **cómo** crear el valor de la dependencia. La definición de proveedor puede ser una de las siguientes:
  - `useClass` - esta opción le dice a Angular DI que instancie una clase proveída cuando se inyecte una dependencia
  - `useExisting` - te permite crear un alias de un token y referenciar cualquier existente.
  - `useFactory` - te permite definir una función que construye una dependencia.
  - `useValue` - provee un valor estático que debe ser usado como dependencia.

Las siguientes secciones describen cómo usar las diferentes definiciones de proveedor.

### Proveedores de clase: useClass

La clave de proveedor `useClass` te permite crear y devolver una nueva instancia de la clase especificada.

Puedes usar este tipo de proveedor para sustituir una implementación alternativa para una clase común o por defecto.
La implementación alternativa puede, por ejemplo, implementar una estrategia diferente, extender la clase por defecto, o emular el comportamiento de la clase real en un caso de prueba.

En el siguiente ejemplo, `BetterLogger` sería instanciado cuando se solicite la dependencia `Logger` en un componente o cualquier otra clase:

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: BetterLogger }]
</docs-code>

Si los proveedores de clase alternativa tienen sus propias dependencias, especifica ambos proveedores en la propiedad de metadatos providers del módulo o componente padre:

<docs-code header="src/app/app.component.ts" language="typescript">
[
  UserService, // dependencia necesaria en `EvenBetterLogger`.
  { provide: Logger, useClass: EvenBetterLogger },
]
</docs-code>

En este ejemplo, `EvenBetterLogger` muestra el nombre del usuario en el mensaje de log. Este logger obtiene el usuario de una instancia inyectada de `UserService`:

<docs-code header="src/app/even-better-logger.component.ts" language="typescript"
           highlight="[[3],[6]]">
@Injectable()
export class EvenBetterLogger extends Logger {
  private userService = inject(UserService);

  override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Mensaje para ${name}: ${message}`);
  }
}
</docs-code>

Angular DI sabe cómo construir la dependencia `UserService`, ya que ha sido configurada arriba y está disponible en el inyector.

### Proveedores de alias: useExisting

La clave de proveedor `useExisting` te permite mapear un token a otro.
En efecto, el primer token es un alias para el servicio asociado con el segundo token, creando dos formas de acceder al mismo objeto de servicio.

En el siguiente ejemplo, el inyector inyecta la instancia singleton de `NewLogger` cuando el componente solicita el logger nuevo o el viejo:
De esta manera, `OldLogger` es un alias para `NewLogger`.

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[4]">
[
  NewLogger,
  // Alias OldLogger con referencia a NewLogger
  { provide: OldLogger, useExisting: NewLogger},
]
</docs-code>

NOTA: Asegúrate de no crear un alias de `OldLogger` a `NewLogger` con `useClass`, ya que esto crea dos instancias diferentes de `NewLogger`.

### Proveedores de fábrica: useFactory

La clave de proveedor `useFactory` te permite crear un objeto de dependencia llamando a una función de fábrica.
Con este enfoque, puedes crear un valor dinámico basado en información disponible en DI y en otros lugares de la aplicación.

En el siguiente ejemplo, solo los usuarios autorizados deberían ver héroes secretos en el `HeroService`.
La autorización puede cambiar durante el curso de una sola sesión de aplicación, como cuando un usuario diferente inicia sesión.

Para mantener la información sensible de seguridad en `UserService` y fuera de `HeroService`, dale al constructor de `HeroService` una bandera booleana para controlar la visualización de héroes secretos:

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[[4],[7]]">
class HeroService {
  constructor(
    private logger: Logger,
    private isAuthorized: boolean) { }

  getHeroes() {
    const auth = this.isAuthorized ? 'autorizado' : 'no autorizado';
    this.logger.log(`Obteniendo héroes para usuario ${auth}.`);
    return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
  }
}
</docs-code>

Para implementar la bandera `isAuthorized`, usa un proveedor de fábrica para crear una nueva instancia de logger para `HeroService`.
Esto es necesario ya que necesitamos pasar manualmente `Logger` al construir el servicio de héroes:

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript">
const heroServiceFactory = (logger: Logger, userService: UserService) =>
  new HeroService(logger, userService.user.isAuthorized);
</docs-code>

La función de fábrica tiene acceso a `UserService`.
Inyectas tanto `Logger` como `UserService` en el proveedor de fábrica para que el inyector pueda pasarlos a la función de fábrica:

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript"
           highlight="[3,4]">
export const heroServiceProvider = {
  provide: HeroService,
  useFactory: heroServiceFactory,
  deps: [Logger, UserService]
};
</docs-code>

- El campo `useFactory` especifica que el proveedor es una función de fábrica cuya implementación es `heroServiceFactory`.
- La propiedad `deps` es un array de tokens de proveedor.
Las clases `Logger` y `UserService` sirven como tokens para sus propios proveedores de clase.
El inyector resuelve estos tokens e inyecta los servicios correspondientes en los parámetros de la función de fábrica `heroServiceFactory` coincidentes, basándose en el orden especificado.

Capturar el proveedor de fábrica en la variable exportada, `heroServiceProvider`, hace que el proveedor de fábrica sea reutilizable.

### Proveedores de valor: useValue

La clave `useValue` te permite asociar un valor estático con un token DI.

Usa esta técnica para proveer constantes de configuración en tiempo de ejecución como direcciones base de sitios web y banderas de características.
También puedes usar un proveedor de valor en una prueba unitaria para proveer datos simulados en lugar de un servicio de datos de producción.

La siguiente sección proporciona más información sobre la clave `useValue`.

## Usando un objeto `InjectionToken`

Usa un objeto `InjectionToken` como token de proveedor para dependencias que no son clases.
El siguiente ejemplo define un token, `APP_CONFIG`. del tipo `InjectionToken`:

<docs-code header="src/app/app.config.ts" language="typescript" highlight="[3]">
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  title: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config description');
</docs-code>

El parámetro de tipo opcional, `<AppConfig>`, y la descripción del token, `descripción de app.config`, especifican el propósito del token.

A continuación, registra el proveedor de dependencia en el componente usando el objeto `InjectionToken` de `APP_CONFIG`:

<docs-code header="src/app/app.component.ts" language="typescript">
const MY_APP_CONFIG_VARIABLE: AppConfig = {
  title: 'Hola',
};

providers: [{ provide: APP_CONFIG, useValue: MY_APP_CONFIG_VARIABLE }]
</docs-code>

Ahora, inyecta el objeto de configuración en el cuerpo del constructor con la función `inject`:

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[2]">
export class AppComponent {
  constructor() {
    const config = inject(APP_CONFIG);
    this.title = config.title;
  }
}
</docs-code>

### Interfaces y DI

Aunque la interfaz `AppConfig` de TypeScript soporta tipado dentro de la clase, la interfaz `AppConfig` no juega ningún papel en DI.
En TypeScript, una interfaz es un artefacto de tiempo de diseño, y no tiene una representación en tiempo de ejecución, o token, que el framework DI pueda usar.

Cuando TypeScript se transpila a JavaScript, la interfaz desaparece porque JavaScript no tiene interfaces.
Como no hay interfaz para que Angular encuentre en tiempo de ejecución, la interfaz no puede ser un token, ni puedes inyectarla:

<docs-code header="src/app/app.component.ts" language="typescript">
// No se puede usar interfaz como token de proveedor
[{ provide: AppConfig, useValue: MY_APP_CONFIG_VARIABLE })]
</docs-code>

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[3]">
export class AppComponent {
  // No se puede inyectar usando la interfaz como el tipo de parámetro
  private config = inject(AppConfig);
}
</docs-code>
