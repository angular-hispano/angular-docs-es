# Prerenderización (SSG)

La prerenderización, comúnmente conocida como Generación de Sitios Estáticos (SSG), representa el método por el cual las páginas se renderizan como archivos HTML estáticos durante el proceso de compilación.

La prerenderización mantiene los mismos beneficios de rendimiento del [renderizado del lado del servidor (SSR)](guide/ssr#why-use-server-side-rendering), pero logra un menor Time to First Byte (TTFB), mejorando en última instancia la experiencia del usuario. La distinción clave radica en su enfoque: las páginas se sirven como contenido estático y no hay renderización basada en peticiones.

Cuando los datos necesarios para la renderización del lado del servidor son consistentes para todos los usuarios, la estrategia de prerenderización surge como una alternativa valiosa. En lugar de renderizar páginas dinámicamente para cada petición del usuario, la prerenderización adopta un enfoque proactivo al renderizarlas de antemano.

## Cómo prerenderizar una página

Para prerenderizar una página estática, añade las capacidades de SSR a tu aplicación con el siguiente comando del CLI de Angular:

<docs-code language="shell">

ng add @angular/ssr

</docs-code>

<div class="alert is-helpful">

Para crear una aplicación con capacidades de prerenderización desde el principio, usa el comando [`ng new --ssr`](tools/cli/setup-local).

</div>

Una vez que SSR esté añadido, puedes generar las páginas estáticas ejecutando el comando de compilación:

<docs-code language="shell">

ng build

</docs-code>

### Opciones de compilación para prerenderizar

La opción `prerender` del builder de la aplicación puede ser un booleano o un objeto para una configuración más detallada. Cuando la opción es `false`, no se realiza ninguna prerenderización. Cuando es `true`, todas las opciones usan el valor predeterminado. Cuando es un objeto, cada opción puede configurarse individualmente.

| Opciones         | Detalles                                                                                                                                                                                        | Valor predeterminado |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| `discoverRoutes` | Si el builder debe procesar la configuración del Router de Angular para encontrar todas las rutas sin parámetros y prerenderizarlas.                                                             | `true`               |
| `routesFile`     | La ruta a un archivo que contiene una lista de todas las rutas a prerenderizar, separadas por saltos de línea. Esta opción es útil si deseas prerenderizar rutas con URLs parametrizadas. |                      |

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "prerender": {
              "discoverRoutes": false
            }
          }
        }
      }
    }
  }
}

</docs-code>

### Prerenderización de rutas parametrizadas

Puedes prerenderizar rutas parametrizadas usando la opción `routesFile`. Un ejemplo de una ruta parametrizada es `product/:id`, donde `id` se proporciona de forma dinámica. Para especificar estas rutas, deben listarse en un archivo de texto, con cada ruta en una línea separada.

Para una aplicación con un gran número de rutas parametrizadas, considera generar este archivo usando un script antes de ejecutar `ng build`.

<docs-code header="routes.txt" language="text">

/products/1
/products/555

</docs-code>

Con las rutas especificadas en el archivo `routes.txt`, usa la opción `routesFile` para configurar el builder y prerenderizar las rutas de productos.

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "prerender": {
              "routesFile": "routes.txt"
            }
          }
        }
      }
    }
  }
}

</docs-code>

Esto configura `ng build` para prerenderizar `/products/1` y `/products/555` en tiempo de compilación.
