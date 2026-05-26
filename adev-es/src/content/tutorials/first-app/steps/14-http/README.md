# Agregar comunicación HTTP a tu app

Este tutorial demuestra cómo integrar HTTP y una API en tu aplicación.

Hasta este punto, tu aplicación ha leído datos de un arreglo estático en un servicio Angular. El siguiente paso es usar un servidor JSON con el que tu aplicación se comunicará a través de HTTP. La solicitud HTTP simulará la experiencia de trabajar con datos de un servidor.

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k"/>

IMPORTANTE: Recomendamos usar tu entorno local para este paso del tutorial.

## ¿Qué aprenderás?

Tu aplicación usará datos de un servidor JSON

<docs-workflow>

<docs-step title="Configura el servidor JSON">
JSON Server es una herramienta de código abierto usada para crear APIs REST simuladas. Lo usarás para servir los datos de ubicación de vivienda que actualmente están almacenados en el servicio de vivienda.

1. Instala `json-server` desde npm usando el siguiente comando.

   ```bash
   npm install -g json-server
   ```

1. En el directorio raíz de tu proyecto, crea un archivo llamado `db.json`. Aquí es donde almacenarás los datos para el `json-server`.

1. Abre `db.json` y copia el siguiente código en el archivo

   ```json
   {
     "locations": [
       {
         "id": 0,
         "name": "Acme Fresh Start Housing",
         "city": "Chicago",
         "state": "IL",
         "photo": "https://angular.dev/assets/images/tutorials/common/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
         "availableUnits": 4,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 1,
         "name": "A113 Transitional Housing",
         "city": "Santa Monica",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/brandon-griggs-wR11KBaB86U-unsplash.jpg",
         "availableUnits": 0,
         "wifi": false,
         "laundry": true
       },
       {
         "id": 2,
         "name": "Warm Beds Housing Support",
         "city": "Juneau",
         "state": "AK",
         "photo": "https://angular.dev/assets/images/tutorials/common/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
         "availableUnits": 1,
         "wifi": false,
         "laundry": false
       },
       {
         "id": 3,
         "name": "Homesteady Housing",
         "city": "Chicago",
         "state": "IL",
         "photo": "https://angular.dev/assets/images/tutorials/common/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
         "availableUnits": 1,
         "wifi": true,
         "laundry": false
       },
       {
         "id": 4,
         "name": "Happy Homes Group",
         "city": "Gary",
         "state": "IN",
         "photo": "https://angular.dev/assets/images/tutorials/common/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
         "availableUnits": 1,
         "wifi": true,
         "laundry": false
       },
       {
         "id": 5,
         "name": "Hopeful Apartment Group",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
         "availableUnits": 2,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 6,
         "name": "Seriously Safe Towns",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
         "availableUnits": 5,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 7,
         "name": "Hopeful Housing Solutions",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/r-architecture-GGupkreKwxA-unsplash.jpg",
         "availableUnits": 2,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 8,
         "name": "Seriously Safe Towns",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/saru-robert-9rP3mxf8qWI-unsplash.jpg",
         "availableUnits": 10,
         "wifi": false,
         "laundry": false
       },
       {
         "id": 9,
         "name": "Capital Safe Towns",
         "city": "Portland",
         "state": "OR",
         "photo": "https://angular.dev/assets/images/tutorials/common/webaliser-_TPTXZd9mOo-unsplash.jpg",
         "availableUnits": 6,
         "wifi": true,
         "laundry": true
       }
     ]
   }
   ```

1. Guarda este archivo.

1. Es hora de probar tu configuración. Desde la línea de comandos, en la raíz de tu proyecto, ejecuta los siguientes comandos.

```bash
json-server --watch db.json
```

1. En tu navegador web, navega a `http://localhost:3000/locations` y confirma que la respuesta incluya los datos almacenados en `db.json`.

Si tienes algún problema con tu configuración, puedes encontrar más detalles en la [documentación oficial](https://www.npmjs.com/package/json-server).
</docs-step>

<docs-step title="Actualiza el servicio para usar el servidor web en lugar del arreglo local">
La fuente de datos ha sido configurada, el siguiente paso es actualizar tu aplicación web para conectarse a ella y usar los datos.

1. En `src/app/housing.service.ts`, realiza los siguientes cambios:

1. Actualiza el código para eliminar la propiedad `housingLocationList` y el arreglo que contiene los datos, así como la propiedad `baseUrl`.

1. Agrega una propiedad string llamada `url` y establece su valor en `'http://localhost:3000/locations'`

   <docs-code header="Agregar propiedad url a housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[8]"/>

   Este código resultará en errores en el resto del archivo porque depende de la propiedad `housingLocationList`. Vamos a actualizar los métodos del servicio a continuación.

1. Actualiza la función `getAllHousingLocations` para hacer una llamada al servidor web que configuraste.

    <docs-code header="Actualizar el método getAllHousingLocations en housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[10,13]"/>

   El código ahora usa código asíncrono para hacer una solicitud **GET** a través de HTTP.

   ÚTIL: Para este ejemplo, el código usa `fetch`. Para casos de uso más avanzados, considera usar `HttpClient` proporcionado por Angular.

1. Actualiza la función `getHousingLocationsById` para hacer una llamada al servidor web que configuraste.

   ÚTIL: Observa que el método `fetch` ha sido actualizado para _consultar_ los datos de una ubicación con un valor de propiedad `id` coincidente. Consulta [Parámetro de Búsqueda en URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/search) para más información.

    <docs-code header="Actualizar el método getHousingLocationById en housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[15,19]"/>

1. Una vez que todas las actualizaciones estén completas, tu servicio actualizado debería coincidir con el siguiente código.

<docs-code header="Versión final de housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[1,25]" />

</docs-step>

<docs-step title="Actualiza los componentes para usar llamadas asíncronas al servicio de vivienda">
El servidor ahora está leyendo datos desde la solicitud HTTP, pero los componentes que dependen del servicio ahora tienen errores porque fueron programados para usar la versión síncrona del servicio.

1. En `src/app/home/home.ts`, actualiza el `constructor` para usar la nueva versión asíncrona del método `getAllHousingLocations`.

<docs-code header="Actualizar constructor en home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/home/home.ts" visibleLines="[29,36]"/>

1. En `src/app/details/details.ts`, actualiza el `constructor` para usar la nueva versión asíncrona del método `getHousingLocationById`.

<docs-code header="Actualizar constructor en details.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/details/details.ts" visibleLines="[59,64]"/>

1. Guarda tu código.

1. Abre la aplicación en el navegador y confirma que se ejecuta sin errores.
   </docs-step>

</docs-workflow>

NOTA: Esta lección depende de la API `fetch` del navegador. Para soporte de interceptores, consulta la [documentación de HttpClient](/guide/http)

RESUMEN: En esta lección, actualizaste tu aplicación para usar un servidor web local (`json-server`) y usar métodos de servicio asíncronos para recuperar datos.

¡Felicitaciones! Has completado exitosamente este tutorial y estás listo para continuar tu viaje construyendo aplicaciones Angular aún más complejas.

Si deseas aprender más, considera completar algunos de los otros [tutoriales](tutorials) y [guías](overview) de Angular para desarrolladores.
