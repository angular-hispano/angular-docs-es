# Creando un servicio inyectable

Un servicio es una categoría amplia que abarca cualquier valor, función o característica que tu aplicación necesita.
Un servicio es típicamente una clase con un propósito específico y bien definido.
Un componente es un tipo de clase que puedes usar con inyección de dependencias (DI).

Angular distingue los componentes de los servicios para mejorar la modularidad y reutilización.
Al separar las características relacionadas con la vista de un componente de otros tipos de procesamiento, puedes mantener tus clases de componente eficientes y ligeras.

Idealmente, la responsabilidad de tu componente es habilitar la experiencia del usuario y nada más.
Un componente debe presentar propiedades y métodos para el enlace de datos, para mediar entre la vista (renderizada por la plantilla) y la lógica de la aplicación (que a menudo incluye alguna noción de un modelo).

Puedes delegar tareas de un componente a los servicios, como obtener datos de un servidor, validar la entrada del usuario o registrar en la consola.
Al definir tales tareas en una clase de servicio inyectable, haces que esas capacidades estén disponibles para cualquier componente.
También puedes hacer que tu aplicación sea más adaptable configurando diferentes proveedores para el mismo tipo de servicio según las circunstancias.

Angular no hace cumplir estrictamente estos principios.
Angular te ayuda a seguir estos principios facilitando la organización de la lógica de tu aplicación en servicios y poniendo esos servicios a disposición de los componentes a través de DI.

## Ejemplos de servicios {#service-examples}

Aquí tienes un ejemplo de una clase de servicio que registra en la consola del navegador:

```ts {header: "logger.service.ts (class)"}
export class Logger {
  log(msg: unknown) {
    console.log(msg);
  }
  error(msg: unknown) {
    console.error(msg);
  }
  warn(msg: unknown) {
    console.warn(msg);
  }
}
```

Los servicios pueden depender de otros servicios.
Por ejemplo, aquí tienes un `HeroService` que depende del servicio `Logger`, y también usa `BackendService` para obtener héroes.
Ese servicio a su vez podría depender del servicio `HttpClient` para obtener héroes de forma asíncrona desde un servidor:

```ts {header: "hero.service.ts", highlight="[7,8,12,13]"}
import {inject} from '@angular/core';

export class HeroService {
  private heroes: Hero[] = [];

  private backend = inject(BackendService);
  private logger = inject(Logger);

  async getHeroes() {
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
```

## Creando un servicio inyectable con el CLI {#creating-an-injectable-service-with-the-cli}

El Angular CLI proporciona un comando para crear un nuevo servicio. En el siguiente ejemplo, agregas un nuevo servicio a una aplicación existente.

Para generar una nueva clase `HeroService` en la carpeta `src/app/heroes`, sigue estos pasos:

1. Ejecuta este comando [Angular CLI](/tools/cli):

```sh
ng generate service heroes/hero
```

Este comando crea el siguiente `HeroService` por defecto:

```ts {header: 'heroes/hero.service.ts (CLI-generated)'}
import {Service} from '@angular/core';

@Service()
export class HeroService {}
```

El decorador `@Service()` especifica que Angular puede usar esta clase en el sistema DI y que el `HeroService` está disponible en toda tu aplicación.

Agrega un método `getHeroes()` que devuelva los héroes de `mock.heroes.ts` para obtener los datos simulados de héroes:

```ts {header: 'hero.service.ts'}
import {Service} from '@angular/core';
import {HEROES} from './mock-heroes';

@Service()
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
```

Para claridad y mantenibilidad, se recomienda que definas componentes y servicios en archivos separados.

## Inyectando servicios {#injecting-services}

Para inyectar un servicio en un componente, declara un campo de clase para la dependencia y usa la función [`inject`](/api/core/inject) de Angular para inicializarlo.

El siguiente ejemplo especifica el `HeroService` en el `HeroList`.
El tipo de `heroService` es `HeroService`.

```ts
import {inject} from '@angular/core';

export class HeroList {
  private heroService = inject(HeroService);
}
```

También es posible inyectar un servicio en un componente usando el constructor del componente:

```ts {header: 'hero-list.ts (constructor signature)'}
  constructor(private heroService: HeroService)
```

El método [`inject`](/api/core/inject) puede ser usado tanto en clases como en funciones, mientras que el método constructor naturalmente solo puede ser usado en un constructor de clase. Sin embargo, en ambos casos, solo puedes inyectar una dependencia dentro de un [contexto de inyección](guide/di/dependency-injection-context) válido, típicamente durante la construcción o inicialización de un componente.

## Inyectando servicios en otros servicios {#injecting-services-in-other-services}

Cuando un servicio depende de otro servicio, sigue el mismo patrón que inyectar en un componente.
En el siguiente ejemplo, `HeroService` depende de un servicio `Logger` para reportar sus actividades:

```ts {header: 'hero.service.ts, highlight: [[3],[9],[12]]}
import {inject, Service} from '@angular/core';
import {HEROES} from './mock-heroes';
import {Logger} from '../logger.service';

@Service()
export class HeroService {
  private logger = inject(Logger);

  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
```

En este ejemplo, el método `getHeroes()` usa el servicio `Logger` registrando un mensaje cuando obtiene héroes.

## Próximos pasos {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/di/defining-dependency-providers" title="Configurando proveedores de dependencias"/>
  <docs-pill href="guide/di/defining-dependency-providers#automatic-provision-for-non-class-dependencies" title="`InjectionTokens`"/>
</docs-pill-row>
