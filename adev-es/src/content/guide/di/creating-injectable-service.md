# Creando un servicio inyectable

Un servicio es una categoría amplia que abarca cualquier valor, función o característica que una aplicación necesita.
Un servicio es típicamente una clase con un propósito específico y bien definido.
Un componente es un tipo de clase que puede usar DI.

Angular distingue los componentes de los servicios para aumentar la modularidad y reutilización.
Al separar las características relacionadas con la vista de un componente de otros tipos de procesamiento, puedes hacer que tus clases de componente sean eficientes y ligeras.

Idealmente, el trabajo de un componente es habilitar la experiencia del usuario y nada más.
Un componente debe presentar propiedades y métodos para el enlace de datos, para mediar entre la vista (renderizada por la plantilla) y la lógica de la aplicación (que a menudo incluye alguna noción de un modelo).

Un componente puede delegar ciertas tareas a los servicios, como obtener datos del servidor, validar la entrada del usuario o registrar directamente en la consola.
Al definir tales tareas de procesamiento en una clase de servicio inyectable, haces que esas tareas estén disponibles para cualquier componente.
También puedes hacer que tu aplicación sea más adaptable configurando diferentes proveedores del mismo tipo de servicio, según sea apropiado en diferentes circunstancias.

Angular no hace cumplir estos principios.
Angular te ayuda a seguir estos principios haciendo que sea fácil factorizar la lógica de tu aplicación en servicios y hacer que esos servicios estén disponibles para los componentes a través de DI.

## Ejemplos de servicios

Aquí tienes un ejemplo de una clase de servicio que registra en la consola del navegador:

<docs-code header="src/app/logger.service.ts (class)" language="typescript">
export class Logger {
  log(msg: unknown) { console.log(msg); }
  error(msg: unknown) { console.error(msg); }
  warn(msg: unknown) { console.warn(msg); }
}
</docs-code>

Los servicios pueden depender de otros servicios.
Por ejemplo, aquí tienes un `HeroService` que depende del servicio `Logger`, y también usa `BackendService` para obtener héroes.
Ese servicio a su vez podría depender del servicio `HttpClient` para obtener héroes de forma asíncrona desde un servidor:

<docs-code header="src/app/hero.service.ts" language="typescript"
           highlight="[7,8,12,13]">
import { inject } from "@angular/core";

export class HeroService {
  private heroes: Hero[] = [];

  private backend = inject(BackendService);
  private logger = inject(Logger);

  async getHeroes() {
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Obtenidos ${this.heroes.length} héroes.`);
    return this.heroes;
  }
}
</docs-code>

## Creando un servicio inyectable con el CLI

El Angular CLI proporciona un comando para crear un nuevo servicio. En el siguiente ejemplo, agregas un nuevo servicio a una aplicación existente.

Para generar una nueva clase `HeroService` en la carpeta `src/app/heroes`, sigue estos pasos:

1. Ejecuta este comando [Angular CLI](/tools/cli):

<docs-code language="sh">
ng generate service heroes/hero
</docs-code>

Este comando crea el siguiente `HeroService` por defecto:

<docs-code header="src/app/heroes/hero.service.ts (CLI-generated)" language="typescript">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {}
</docs-code>

El decorador `@Injectable()` especifica que Angular puede usar esta clase en el sistema DI.
Los metadatos, `providedIn: 'root'`, significan que el `HeroService` se provee en toda la aplicación.

Agrega un método `getHeroes()` que devuelva los héroes de `mock.heroes.ts` para obtener los datos simulados de héroes:

<docs-code header="src/app/heroes/hero.service.ts" language="typescript">
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';

@Injectable({
  // declara que este servicio debe ser creado
  // por el inyector de la aplicación raíz.
  providedIn: 'root',
})
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
</docs-code>

Para claridad y mantenibilidad, se recomienda que definas componentes y servicios en archivos separados.

## Inyectando servicios

Para inyectar un servicio como dependencia en un componente, puedes declarar un campo de clase que represente la dependencia y usar la función `inject` de Angular para inicializarlo.

El siguiente ejemplo especifica el `HeroService` en el `HeroListComponent`.
El tipo de `heroService` es `HeroService`.

<docs-code header="src/app/heroes/hero-list.component.ts" language="typescript">
import { inject } from "@angular/core";

export class HeroListComponent {
  private heroService = inject(HeroService);
}
</docs-code>

También es posible inyectar un servicio en un componente usando el constructor del componente:

<docs-code header="src/app/heroes/hero-list.component.ts (constructor signature)" language="typescript">
  constructor(private heroService: HeroService)
</docs-code>

El método `inject` puede ser usado tanto en clases como en funciones, mientras que el método constructor naturalmente solo puede ser usado en un constructor de clase. Sin embargo, en cualquier caso una dependencia solo puede ser inyectada en un [contexto de inyección](guide/di/dependency-injection-context) válido, usualmente en la construcción o inicialización de un componente.

## Inyectando servicios en otros servicios

Cuando un servicio depende de otro servicio, sigue el mismo patrón que inyectar en un componente.
En el siguiente ejemplo, `HeroService` depende de un servicio `Logger` para reportar sus actividades:

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[3,9,12]">
import { inject, Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Logger } from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private logger = inject(Logger);

  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
</docs-code>

En este ejemplo, el método `getHeroes()` usa el servicio `Logger` registrando un mensaje cuando obtiene héroes.

## Próximos pasos

<docs-pill-row>
  <docs-pill href="/guide/di/dependency-injection-providers" title="Configurando proveedores de dependencias"/>
  <docs-pill href="/guide/di/dependency-injection-providers#using-an-injectiontoken-object" title="`InjectionTokens`"/>
</docs-pill-row>
