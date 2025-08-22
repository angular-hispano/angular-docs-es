# Entendiendo la comunicación con servicios backend usando HTTP

La mayoría de las applicaciones de front-end necesitan comunicarse con el servidor a través del protocolo HTTP, para descargar o cargar datos y acceder a los servicios de backend. Angular proporciona una API de cliente HTTP para aplicaciones Angular, la clase de servicio `HttpClient` en `@angular/common/http`.

## Características del cliente HTTP

El cliente HTTP ofrece las siguientes características principales:

* La capacidad para solicitar [valores de respuesta tipados](guide/http/making-requests#fetching-json-data)
* [Manejo de errores](guide/http/making-requests#handling-request-failure) optimizado
* [Intercepción](guide/http/interceptors) de solicitudes y respuestas
* [Utilidades de pruebas](guide/http/testing) robustas

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="Configurar HttpClient"/>
  <docs-pill href="guide/http/making-requests" title="Realizando solicitudes HTTP"/>
</docs-pill-row>
