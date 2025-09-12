<docs-decorative-header title="Inyección de dependencias en Angular" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
"DI" es un patrón de diseño y mecanismo para crear y entregar algunas partes de una aplicación a otras partes de la aplicación que las requieren.
</docs-decorative-header>

CONSEJO: Consulta los [Fundamentos](essentials/dependency-injection) de Angular antes de sumergirte en esta guía completa.

Cuando desarrollas una parte más pequeña de tu sistema, como un módulo o una clase, es posible que necesites usar características de otras clases. Por ejemplo, es posible que necesites un servicio HTTP para hacer llamadas al backend. La Inyección de Dependencias, o DI, es un patrón de diseño y mecanismo para crear y entregar algunas partes de una aplicación a otras partes de la aplicación que las requieren. Angular soporta este patrón de diseño y puedes usarlo en tus aplicaciones para aumentar la flexibilidad y modularidad.

En Angular, las dependencias son típicamente servicios, pero también pueden ser valores, como cadenas o funciones. Un inyector para una aplicación (creado automáticamente durante la inicizalición) instancia las dependencias cuando es necesario, usando un proveedor configurado del servicio o valor.

## Aprende sobre la inyección de dependencias de Angular

<docs-card-container>
  <docs-card title="Entendiendo la inyección de dependencias" href="/guide/di/dependency-injection">
    Aprende los principios básicos de la inyección de dependencias en Angular.
  </docs-card>
  <docs-card title="Creando e inyectando servicios" href="/guide/di/creating-injectable-service">
    Describe cómo crear un servicio e inyectarlo en otros servicios y componentes.
  </docs-card>
  <docs-card title="Configurando proveedores de dependencias" href="/guide/di/dependency-injection-providers">
    Describe cómo configurar dependencias usando el campo providers en los decoradores @Component y @NgModule. También describe cómo usar InjectionToken para proporcionar e inyectar valores en DI, lo cual puede ser útil cuando quieres usar un valor que no sean clases como dependencias.
  </docs-card>
    <docs-card title="Contexto de inyección" href="/guide/di/dependency-injection-context">
    Describe qué es un contexto de inyección y cómo usar el sistema DI donde lo necesites.
  </docs-card>
  <docs-card title="Inyectores jerárquicos" href="/guide/di/hierarchical-dependency-injection">
    La DI jerárquica te permite compartir dependencias entre diferentes partes de la aplicación solo cuando y si las necesitas. Este es un tema avanzado.
  </docs-card>
</docs-card-container>
