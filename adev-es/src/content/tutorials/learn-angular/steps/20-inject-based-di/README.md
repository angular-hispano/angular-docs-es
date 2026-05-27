# Inyección de dependencias basada en inject

Crear un servicio inyectable es la primera parte del sistema de inyección de dependencias (DI) en Angular. ¿Cómo se inyecta un servicio en un componente? Angular tiene una función conveniente llamada `inject()` que puede usarse en el contexto adecuado.

NOTA: Los contextos de inyección están más allá del alcance de este tutorial, pero puedes aprender más en la [guía esencial de inyección de dependencias (DI)](/essentials/dependency-injection) y en la [guía de contexto DI](guide/di/dependency-injection-context).

En esta actividad, aprenderás cómo inyectar un servicio y usarlo en un componente.

<hr>

A menudo es útil inicializar propiedades de clase con valores proporcionados por el sistema DI. Aquí hay un ejemplo:

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCareDashboard {
  petRosterService = inject(PetRosterService);
}
</docs-code>

<docs-workflow>

<docs-step title="Inyecta el `CarService`">

En `app.ts`, usando la función `inject()` inyecta el `CarService` y asígnalo a una propiedad llamada `carService`

NOTA: Observa la diferencia entre la propiedad `carService` y la clase `CarService`.

</docs-step>

<docs-step title="Usa la instancia de `carService`">

Llamar a `inject(CarService)` te dio una instancia del `CarService` que puedes usar en tu aplicación, almacenada en la propiedad `carService`.

Inicializa la propiedad `display` con la siguiente implementación:

```ts
display = this.carService.getCars().join(' ⭐️ ');
```

</docs-step>

<docs-step title="Actualiza la plantilla de `App`">

Actualiza la plantilla del componente en `app.ts` con el siguiente código:

```ts
template: `<p>Car Listing: {{ display }}</p>`,
```

</docs-step>

</docs-workflow>

Acabas de inyectar tu primer servicio en un componente - fantástico esfuerzo.
