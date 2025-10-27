<docs-decorative-header title="Enrutamiento en Angular" imgSrc="adev/src/assets/images/routing.svg"> <!-- markdownlint-disable-line -->
El enrutamiento te ayuda a cambiar lo que el usuario ve en una aplicación de página única.
</docs-decorative-header>

Angular Router (`@angular/router`) es la librería oficial para gestionar la navegación en aplicaciones de Angular y una parte fundamental del framework. Se incluye de forma predeterminada en todos los proyectos creados por Angular CLI.

## ¿Por qué es necesario el enrutamiento en una SPA?

Cuando navegas a una URL en tu navegador web, el navegador normalmente hace una petición de red a un servidor web y muestra la página HTML devuelta. Cuando navegas a una URL diferente, como hacer clic en un enlace, el navegador hace otra petición de red y reemplaza toda la página con una nueva.

Una aplicación de página única (SPA) difiere en que el navegador solo hace una petición a un servidor web para la primera página, el `index.html`. Después de eso, un router del lado del cliente toma el control, controlando qué contenido se muestra según la URL. Cuando un usuario navega a una URL diferente, el router actualiza el contenido de la página en el lugar sin disparar una recarga completa de la página.

## Cómo Angular gestiona el enrutamiento

El enrutamiento en Angular se compone de tres partes principales:

1. **Routes** definen qué componente se muestra cuando un usuario visita una URL específica.
2. **Outlets** son marcadores de posición en tus plantillas que cargan y renderizan dinámicamente componentes según la ruta activa.
3. **Links** proporcionan una forma para que los usuarios naveguen entre diferentes rutas en tu aplicación sin disparar una recarga completa de la página.

Además, la librería de enrutamiento en Angular ofrece funcionalidad adicional como:

- Rutas anidadas
- Navegación programática
- Parámetros de ruta, consultas y comodines
- Información de ruta activada con `ActivatedRoute`
- Efectos de transición de vista
- Navigation guards

## Próximos pasos

Aprende sobre cómo puedes [definir rutas usando Angular router](/guide/routing/define-routes).
