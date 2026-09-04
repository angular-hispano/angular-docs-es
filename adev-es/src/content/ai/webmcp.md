# WebMCP

Web Model Context Protocol (WebMCP) es un [estándar web emergente](https://github.com/webmachinelearning/webmcp/) que permite a las aplicaciones web exponer herramientas estructuradas directamente a los agentes de IA que se ejecutan de forma nativa en el navegador. Las herramientas definidas por una aplicación permiten a los asistentes de IA interactuar con ella directamente, proporcionando capacidades adicionales al agente y reduciendo la necesidad de interacciones con el DOM.

Por ejemplo, una aplicación para registrar un nuevo usuario podría proporcionar una herramienta WebMCP para que el agente de IA del navegador cree el usuario directamente, en lugar de obligar al agente a pasar por una compleja interfaz de asistente mediante interacciones con el DOM.

Angular proporciona soporte experimental para WebMCP, permitiéndote registrar fácilmente herramientas vinculadas al ciclo de vida de la inyección de dependencias de tu aplicación y convertir automáticamente tus Signal Forms en herramientas listas para IA.

IMPORTANT: La especificación de WebMCP está en una etapa muy temprana de su ciclo de vida y sufre cambios frecuentes. Por ello, el soporte de WebMCP en Angular es actualmente [**experimental**](reference/releases#experimental). Las APIs están sujetas a cambios incluso fuera de las versiones mayores.

## Proporcionar herramientas para la aplicación {#provide-tools-for-the-application}

Usa [`provideExperimentalWebMcpTools`](api/core/provideExperimentalWebMcpTools) en la configuración de tu aplicación para registrar herramientas durante todo el ciclo de vida de la aplicación. Las herramientas proporcionadas de esta forma se registran automáticamente cuando la aplicación se inicializa y se cancela su registro cuando la aplicación se destruye.

El callback `execute` se invoca en el contexto de inyección del `Injector` asociado, lo que significa que puedes usar [`inject`](api/core/inject) para inyectar servicios directamente.

```ts {header:"main.ts"}
import {Service, inject, provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

@Service()
class Greeter {
  sayHello(): string {
    return 'Hello agent!';
  }
}

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'greet',
        description: 'Greets the agent.',
        inputSchema: {type: 'object', properties: {}},
        execute: () => {
          const greeter = inject(Greeter);

          return {content: [{type: 'text', text: greeter.sayHello()}]};
        },
      },
    ]),
  ],
});
```

### Definir los parámetros de una herramienta {#define-tool-parameters}

Cuando una herramienta requiere entrada del asistente de IA, define los argumentos esperados dentro de `inputSchema` usando la sintaxis de [JSON Schema](https://json-schema.org/). Angular infiere automáticamente los tipos de los parámetros que se pasan a tu callback `execute` a partir de la definición del esquema.

```ts {header:"main.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'searchCatalog',
        description: 'Searches the store catalog for products matching a query.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search keywords.',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        execute: ({query, maxResults}) => {
          // El tipo de `query` se infiere como `string`.
          // El tipo de `maxResults` se infiere como `number | undefined`.

          // Considera validar esto en tiempo de ejecución, ya que las entradas podrían no validarse contra el esquema.
          if (typeof query !== 'string') throw new Error(`Bad query: ${query}`);
          if (typeof maxResults !== 'number' && maxResults !== undefined)
            throw new Error(`Bad maxResults: ${maxResults}`);

          const limit = maxResults ?? 5;
          return {
            content: [{type: 'text', text: `Returning up to ${limit} results for "${query}".`}],
          };
        },
      },
    ]),
  ],
});
```

TIP: Usa `required: ['param1', 'param2', ...]` para eliminar `undefined` de los tipos de esos parámetros y usa `additionalProperties: false` para restringir el tipo del objeto de argumentos únicamente a estos parámetros.

## Proporcionar herramientas para una ruta {#provide-tools-for-a-route}

Al construir aplicaciones complejas, puede que solo quieras que ciertas herramientas estén disponibles cuando el usuario está viendo rutas específicas. Puedes lograrlo proporcionando herramientas directamente en las definiciones de rutas.

```ts {header:"routes.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    providers: [
      provideExperimentalWebMcpTools([
        {
          name: 'exportDashboardReports',
          description: 'Exports the current dashboard analytics.',
          inputSchema: {type: 'object', properties: {}},
          execute: () => ({
            content: [{type: 'text', text: 'Dashboard export successfully triggered.'}],
          }),
        },
      ]),
    ],
  },
];
```

NOTE: Al registrar herramientas en una ruta en particular, considera configurar el router para usar [`withExperimentalAutoCleanupInjectors`](api/router/withExperimentalAutoCleanupInjectors) y así asegurar que se _cancele el registro_ de las herramientas automáticamente cuando el usuario salga de la ruta. Sin esta opción, las herramientas WebMCP declaradas en rutas seguirán siendo accesibles para los agentes de IA incluso después de que el usuario haya navegado a una ruta diferente.

```ts {header:"app.config.ts"}
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withExperimentalAutoCleanupInjectors} from '@angular/router';
import {routes} from './routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withExperimentalAutoCleanupInjectors())],
};
```

## Proporcionar herramientas dentro de servicios {#provide-tools-within-services}

Para casos de uso dinámicos, la función [`declareExperimentalWebMcpTool`](api/core/declareExperimentalWebMcpTool) registra una herramienta directamente dentro de un contexto de inyección y cancela su registro automáticamente cuando ese contexto se destruye.

```ts {header:"counter.ts"}
import {Service, declareExperimentalWebMcpTool, signal, inject} from '@angular/core';

@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      inputSchema: {type: 'object', properties: {}},
      execute: () => ({
        content: [{type: 'text', text: `The count is: ${this.count()}.`}],
      }),
    });
  }
}
```

Aunque `declareExperimentalWebMcpTool` funciona en cualquier contexto de inyección, ten cuidado con las [colisiones de nombres](#name-collisions) y prefiere usarla en servicios raíz.

## Herramientas implícitas en Signal Forms {#implicit-tools-in-signal-forms}

Puedes crear una herramienta WebMCP de forma implícita a partir de un [Signal Form](essentials/signal-forms) existente de Angular con una configuración mínima. Angular convierte tus modelos de formulario en herramientas WebMCP completas, dando soporte de forma efectiva a formularios altamente dinámicos sin que tengas que escribir manualmente esquemas JSON ni manejadores de eventos.

### Habilitar la característica de formularios WebMCP {#enable-the-webmcp-forms-feature}

Primero, añade [`provideExperimentalWebMcpForms`](api/forms/signals/provideExperimentalWebMcpForms) a los proveedores raíz de tu aplicación:

```ts {header:"main.ts"}
import {bootstrapApplication} from '@angular/platform-browser';
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [provideExperimentalWebMcpForms()],
});
```

### Habilitar un Signal Form {#opt-in-a-signal-form}

Segundo, al definir un Signal Form usando [`form`](api/forms/signals/form), pasa la opción de configuración `experimentalWebMcpTool` para habilitar una herramienta WebMCP implícita. Angular inspeccionará el modelo de datos de tu formulario y generará automáticamente un esquema JSON para los agentes de IA conectados.

```ts {header:"user-registration.ts"}
import {Component, signal} from '@angular/core';
import {form, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
})
export class UserRegistration {
  private readonly model = signal({
    firstName: '',
    lastName: '',
    age: 0,
    hobbies: ['Web Development'],
  });

  readonly userForm = form(
    this.model,
    (f) => {
      required(f.firstName, {message: 'First name is mandatory.'});
      required(f.lastName, {message: 'Last name is mandatory.'});
    },
    {
      // Registra implícitamente una herramienta WebMCP llamada `registerUser` con parámetros derivados de `model`.
      experimentalWebMcpTool: {
        name: 'registerUser',
        description: 'Registers a new user.',
      },
      submission: {
        action: async (formValue) => {
          console.log('Submitting user:', formValue);
          // ...
        },
      },
    },
  );
}
```

En este ejemplo, Angular genera una herramienta WebMCP con un esquema JSON que:

1. incluye `firstName`, `lastName`, `age` y `hobbies` como parámetros inferidos a partir del valor inicial del signal `model`.
2. define `firstName` y `lastName` como campos _requeridos_, según se infiere del validador [`required`](api/forms/signals/required).
3. define `hobbies` como un arreglo de strings, permitiendo al agente proporcionar una cantidad arbitraria de hobbies.

Además de inferir el esquema de entrada, Angular también conecta la herramienta WebMCP con la lógica de validación y el manejador de envío del formulario. Esto significa que el agente observará cualquier error de validación provocado por sus entradas o cualquier fallo que ocurra durante el envío, lo que le permite corregirse a sí mismo y potencialmente reintentar.

NOTE: Los validadores asíncronos _no_ se ejecutan y deben manejarse en la acción de envío.

#### Restricciones {#constraints}

Angular infiere el esquema WebMCP a partir del valor inicial de tu modelo de formulario. Esto requiere:

- Valores iniciales concretos (`''`, `0`, `false`): Angular no puede inferir tipos de datos a partir de `null` o `undefined`.
- Arreglos no vacíos (`['Hello!']`): Angular no puede inferir tipos de datos a partir de un arreglo vacío y requiere al menos un valor inicial.

## Mejores prácticas {#best-practices}

Ten en cuenta las siguientes mejores prácticas:

### Colisiones de nombres {#name-collisions}

WebMCP requiere que cada herramienta tenga un nombre único y lanzará un error si el mismo nombre de herramienta se registra varias veces. Esto significa que llamar a `declareExperimentalWebMcpTool` o `provideExperimentalWebMcpTools` en un contexto donde podrían registrarse varias veces (como el constructor de un componente) puede provocar errores en tiempo de ejecución.

Siempre que sea posible, prefiere colocar las herramientas en los proveedores de la aplicación, en los proveedores de rutas o en servicios raíz. Al colocar herramientas en un componente, incluyendo las [herramientas implícitas en Signal Forms](#implicit-tools-in-signal-forms), asegúrate de que ese componente se renderice en la página como máximo _una vez_ en cualquier momento dado.

### Validar las entradas de las herramientas {#validate-tool-inputs}

Angular no proporciona ninguna validación implícita de que las entradas proporcionadas por un agente coincidan realmente con el esquema JSON definido. Considera validar explícitamente los argumentos de la función `execute` antes de usarlos para garantizar la fiabilidad.

### Pruebas {#testing}

Considera usar una implementación mock de WebMCP como [`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill) para realizar pruebas unitarias de tus herramientas de forma efectiva.
