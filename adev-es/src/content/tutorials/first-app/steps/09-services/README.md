# Servicios en Angular

Esta lección del tutorial demuestra cómo crear un servicio Angular y usar inyección de dependencias para incluirlo en tu aplicación.

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=rieGfJawp9xJ00Sz"/>

## ¿Qué aprenderás?

Tu aplicación tiene un servicio para servir los datos a tu aplicación.
Al final de esta lección, el servicio lee datos de datos locales estáticos.
En una lección posterior, actualizarás el servicio para obtener datos de un servicio web.

## Vista previa conceptual de servicios

Este tutorial introduce los servicios Angular y la inyección de dependencias.

### Servicios Angular

Los _servicios Angular_ proporcionan una forma de separar los datos y funciones de la aplicación Angular que pueden ser usados por múltiples componentes en tu aplicación.
Para ser usado por múltiples componentes, un servicio debe hacerse _inyectable_.
Los servicios que son inyectables y utilizados por un componente se convierten en dependencias de ese componente.
El componente depende de esos servicios y no puede funcionar sin ellos.

### Inyección de dependencias

La _inyección de dependencias_ es el mecanismo que gestiona las dependencias de los componentes de una aplicación y los servicios que otros componentes pueden usar.

<docs-workflow>

<docs-step title="Crea un nuevo servicio para tu aplicación">
Este paso crea un servicio inyectable para tu aplicación.

En el panel de **Terminal** de tu IDE:

1. En tu directorio del proyecto, navega al directorio `first-app`.
1. En el directorio `first-app`, ejecuta este comando para crear el nuevo servicio.

```shell
ng generate service housing --skip-tests
```

1. Ejecuta `ng serve` para construir la aplicación y servirla en `http://localhost:4200`.
1. Confirma que la aplicación se construye sin errores.
   Corrige cualquier error antes de continuar al siguiente paso.
   </docs-step>

<docs-step title="Agrega datos estáticos al nuevo servicio">
Este paso agrega algunos datos de ejemplo a tu nuevo servicio.
En una lección posterior, reemplazarás los datos estáticos con una interfaz web para obtener datos como lo harías en una aplicación real.
Por ahora, el nuevo servicio de tu aplicación usa los datos que, hasta ahora, se han creado localmente en `Home`.

En el panel de **Edición** de tu IDE:

1. En `src/app/home/home.ts`, desde `Home`, copia la variable `housingLocationList` y su valor de arreglo.
1. En `src/app/housing.service.ts`:
   1. Dentro de la clase `HousingService`, pega la variable que copiaste de `Home` en el paso anterior.
   1. Dentro de la clase `HousingService`, pega estas funciones después de los datos que acabas de copiar.
      Estas funciones permiten que las dependencias accedan a los datos del servicio.

      <docs-code header="Funciones del servicio en src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[112,118]"/>

      Necesitarás estas funciones en una lección futura. Por ahora, es suficiente entender que estas funciones devuelven ya sea un `HousingLocation` específico por id o la lista completa.

   1. Agrega una importación a nivel de archivo para `HousingLocation`.

   <docs-code header="Importar tipo HousingLocation en src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[2]"/>

1. Confirma que la aplicación se construye sin errores.
   Corrige cualquier error antes de continuar al siguiente paso.
   </docs-step>

<docs-step title="Inyecta el nuevo servicio en `Home`">
Este paso inyecta el nuevo servicio en el `Home` de tu aplicación para que pueda leer los datos de la aplicación desde un servicio.
En una lección posterior, reemplazarás los datos estáticos con una fuente de datos en vivo para obtener datos como lo harías en una aplicación real.

En el panel de **Edición** de tu IDE, en `src/app/home/home.ts`:

1. En la parte superior de `src/app/home/home.ts`, agrega `inject` a los elementos importados desde `@angular/core`. Esto importará la función `inject` en la clase `Home`.

<docs-code language="angular-ts" header="Actualizar src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[1]"/>

1. Agrega una nueva importación a nivel de archivo para `HousingService`:

<docs-code language="angular-ts" header="Agregar importación a src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[4]"/>

1. Desde `Home`, elimina las entradas del arreglo `housingLocationList` y asigna a `housingLocationList` el valor de un arreglo vacío (`[]`). En unos pasos actualizarás el código para obtener los datos desde `HousingService`.

1. En `Home`, agrega el siguiente código para inyectar el nuevo servicio e inicializar los datos para la aplicación. El `constructor` es la primera función que se ejecuta cuando se crea este componente. El código en el `constructor` asignará a `housingLocationList` el valor devuelto por la llamada a `getAllHousingLocations`.

<docs-code language="angular-ts" header="Inicializar datos desde el servicio en src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[23,30]"/>

1. Guarda los cambios en `src/app/home/home.ts` y confirma que tu aplicación se construye sin errores.
   Corrige cualquier error antes de continuar al siguiente paso.
   </docs-step>

</docs-workflow>

RESUMEN: En esta lección, agregaste un servicio Angular a tu aplicación y lo inyectaste en la clase `Home`.
Esto compartmentaliza cómo tu aplicación obtiene sus datos.
Por ahora, el nuevo servicio obtiene sus datos de un arreglo estático de datos.
En una lección posterior, refactorizarás el servicio para obtener sus datos desde un endpoint de API.

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="guide/di/creating-injectable-service" title="Creando un servicio inyectable"/>
  <docs-pill href="guide/di" title="Inyección de dependencias en Angular"/>
  <docs-pill href="cli/generate/service" title="ng generate service"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
