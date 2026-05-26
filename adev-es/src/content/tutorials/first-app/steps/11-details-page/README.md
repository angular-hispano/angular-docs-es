# Integrar página de detalles en la aplicación

Esta lección del tutorial demuestra cómo conectar la página de detalles a tu aplicación.

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=CbqIpmRpwp5ZZDnu&amp;start=345"/>

IMPORTANTE: Recomendamos usar tu entorno local para aprender routing.

## ¿Qué aprenderás?

Al final de esta lección tu aplicación tendrá soporte para routing hacia la página de detalles.

## Vista previa conceptual de routing con parámetros de ruta

Cada ubicación de vivienda tiene detalles específicos que deberían mostrarse cuando un usuario navega a la página de detalles para ese elemento. Para lograr este objetivo, necesitarás usar parámetros de ruta.

Los parámetros de ruta te permiten incluir información dinámica como parte de la URL de tu ruta. Para identificar qué ubicación de vivienda ha seleccionado un usuario, usarás la propiedad `id` del tipo `HousingLocation`.

<docs-workflow>

<docs-step title="Usando `routerLink` para navegación dinámica">
En la lección 10, agregaste una segunda ruta a `src/app/routes.ts` que incluye un segmento especial que identifica el parámetro de ruta, `id`:

```
'details/:id'
```

En este caso, `:id` es dinámico y cambiará según cómo la ruta sea solicitada por el código.

1. En `src/app/housing-location/housing-location.ts`, agrega una etiqueta de anclaje al elemento `section` e incluye la directiva `routerLink`:

   <docs-code language="angular-ts" header="Agregar anclaje con directiva routerLink a housing-location.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/housing-location/housing-location.ts" visibleLines="[18]"/>

   La directiva `routerLink` permite al router de Angular crear enlaces dinámicos en la aplicación. El valor asignado a `routerLink` es un arreglo con dos entradas: la parte estática de la ruta y los datos dinámicos.

   Para que `routerLink` funcione en la plantilla, agrega una importación a nivel de archivo de `RouterLink` y `RouterOutlet` desde '@angular/router', luego actualiza el arreglo `imports` del componente para incluir tanto `RouterLink` como `RouterOutlet`.

1. En este punto puedes confirmar que el routing funciona en tu aplicación. En el navegador, actualiza la página de inicio y haz clic en el botón "Learn More" para una ubicación de vivienda.

<img alt="página de detalles mostrando el texto 'details works!'" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-1.png">

</docs-step>

<docs-step title="Obtén los parámetros de ruta">
En este paso, obtendrás el parámetro de ruta en el componente `Details`. Actualmente, la aplicación muestra `details works!`. A continuación, actualizarás el código para mostrar el valor `id` pasado usando los parámetros de ruta.

1. En `src/app/details/details.ts` actualiza la plantilla para importar las funciones, clases y servicios que necesitarás usar en `Details`:

<docs-code header="Actualizar importaciones a nivel de archivo" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[1,4]"/>

1. Actualiza la propiedad `template` del decorador `@Component` para mostrar el valor `housingLocationId`:

   ```angular-ts
     template: `<p>details works! {{ housingLocationId }}</p>`,
   ```

1. Actualiza el cuerpo de la clase `Details` con el siguiente código:

   ```ts
   export class Details {
     route: ActivatedRoute = inject(ActivatedRoute);
     housingLocationId = -1;
     constructor() {
       this.housingLocationId = Number(this.route.snapshot.params['id']);
     }
   }
   ```

   Este código le da a `Details` acceso a la funcionalidad del router `ActivatedRoute` que te permite tener acceso a los datos sobre la ruta actual. En el `constructor`, el código convierte el parámetro `id` adquirido de la ruta de string a número.

1. Guarda todos los cambios.

1. En el navegador, haz clic en uno de los enlaces "Learn More" de una ubicación de vivienda y confirma que el valor numérico mostrado en la página coincide con la propiedad `id` para esa ubicación en los datos.
   </docs-step>

<docs-step title="Personaliza el componente `Details`">
Ahora que el routing funciona correctamente en la aplicación, este es un buen momento para actualizar la plantilla de `Details` para mostrar los datos específicos representados por la ubicación de vivienda para el parámetro de ruta.

Para acceder a los datos, agregarás una llamada a `HousingService`.

1. Actualiza el código de la plantilla para que coincida con el siguiente código:

   <docs-code language="angular-ts" header="Actualizar la plantilla de Details en src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[8,29]"/>

   Observa que las propiedades de `housingLocation` se están accediendo con el operador de encadenamiento opcional `?`. Esto asegura que si el valor de `housingLocation` es nulo o indefinido, la aplicación no se bloquee.

1. Actualiza el cuerpo de la clase `Details` para que coincida con el siguiente código:

   <docs-code language="angular-ts" header="Actualizar la clase Details en src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[32,41]"/>

   Ahora el componente tiene el código para mostrar la información correcta basada en la ubicación de vivienda seleccionada. El `constructor` ahora incluye una llamada a `HousingService` para pasar el parámetro de ruta como argumento a la función del servicio `getHousingLocationById`.

1. Copia los siguientes estilos en el archivo `src/app/details/details.css`:

   <docs-code header="Agregar estilos para Details" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.css" visibleLines="[1,71]"/>

   y guarda tus cambios

1. En `Details` usa el archivo `details.css` recién creado como fuente para los estilos:
   <docs-code language="angular-ts" header="Actualizar details.ts para usar el archivo css creado" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[30]"/>

1. En el navegador, actualiza la página y confirma que cuando haces clic en el enlace "Learn More" para una ubicación de vivienda determinada, la página de detalles muestra la información correcta basada en los datos para ese elemento seleccionado.

<img alt="Página de detalles mostrando información de la casa" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-3.png">

</docs-step>

<docs-step title="Verifica la navegación en `Home`">
En una lección anterior actualizaste la plantilla de `App` para incluir un `routerLink`. Agregar ese código actualizó tu aplicación para habilitar la navegación de regreso a `Home` cada vez que se hace clic en el logo.

1.  Confirma que tu código coincide con lo siguiente:

        <docs-code language="angular-ts" header="Confirmar el routerLink en app.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/app.ts" visibleLines="[8,19]"/>

        Tu código ya debería estar actualizado, pero confírmalo para estar seguro.

    </docs-step>

</docs-workflow>

RESUMEN: En esta lección agregaste routing para mostrar páginas de detalles.

Ahora sabes cómo:

- usar parámetros de ruta para pasar datos a una ruta
- usar la directiva `routerLink` para usar datos dinámicos para crear una ruta
- usar parámetros de ruta para recuperar datos de `HousingService` para mostrar información específica de una ubicación de vivienda

Realmente un gran trabajo hasta ahora.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks#accessing-query-parameters-and-fragments" title="Parámetros de Ruta"/>
  <docs-pill href="guide/routing" title="Descripción general de Routing en Angular"/>
  <docs-pill href="guide/routing/common-router-tasks" title="Tareas Comunes de Routing"/>
  <docs-pill href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining" title="Operador de Encadenamiento Opcional"/>
</docs-pill-row>
