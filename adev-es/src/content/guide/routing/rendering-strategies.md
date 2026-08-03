# Estrategias de renderización en Angular

Esta guía te ayuda a elegir la estrategia de renderización correcta para diferentes partes de tu aplicación Angular.

## ¿Qué son las estrategias de renderización? {#what-are-rendering-strategies}

Las estrategias de renderización determinan cuándo y dónde se genera el contenido HTML de tu aplicación Angular. Cada estrategia ofrece diferentes compensaciones entre rendimiento de carga inicial de página, interactividad, capacidades de SEO y uso de recursos del servidor.

Angular soporta tres estrategias de renderización principales:

- **Client-Side Rendering (CSR)** - El contenido se renderiza completamente en el navegador
- **Static Site Generation (SSG/Prerendering)** - El contenido se pre-renderiza en tiempo de compilación
- **Server-Side Rendering (SSR)** - El contenido se renderiza en el servidor para la solicitud inicial de una ruta

## Client-Side Rendering (CSR)

**CSR es el valor predeterminado de Angular.** El contenido se renderiza completamente en el navegador después de que JavaScript se carga.

### Cuándo usar CSR {#when-to-use-csr}

✅ Puede ser una buena opción para:

- Aplicaciones interactivas (dashboards, paneles de administración)
- Aplicaciones en tiempo real
- Herramientas internas donde el SEO no importa
- Aplicaciones de página única con estado complejo del lado del cliente

❌ Cuando sea posible, considera evitarlo para:

- Contenido público que necesita SEO
- Páginas donde el rendimiento de carga inicial es crítico

### Compensaciones de CSR {#csr-trade-offs}

| Aspecto           | Impacto                                                   |
| :---------------- | :------------------------------------------------------- |
| **SEO**           | Pobre - contenido no visible para crawlers hasta que JS se ejecuta |
| **Carga inicial** | Más lenta - debe descargar y ejecutar JavaScript primero      |
| **Interactividad** | Inmediata una vez cargada                                    |
| **Necesidades del servidor**  | Mínimas fuera de alguna configuración                    |
| **Complejidad**    | Más simple porque funciona con configuración mínima     |

## Static Site Generation (SSG/Prerendering)

**SSG pre-renderiza páginas en tiempo de compilación** en archivos HTML estáticos. El servidor envía HTML pre-construido para la carga inicial de la página. Después de la hidratación, tu aplicación se ejecuta completamente en el navegador como una SPA tradicional - la navegación subsiguiente, cambios de ruta y llamadas a API ocurren del lado del cliente sin renderización del servidor.

### Cuándo usar SSG {#when-to-use-ssg}

✅ Puede ser una buena opción para:

- Páginas de marketing y landing pages
- Posts de blog y documentación
- Catálogos de productos con contenido estable
- Contenido que no cambia por usuario

❌ Cuando sea posible, considera evitarlo para:

- Contenido específico del usuario
- Datos que cambian frecuentemente
- Información en tiempo real

### Compensaciones de SSG {#ssg-trade-offs}

| Aspecto              | Impacto                                      |
| :------------------ | :------------------------------------------ |
| **SEO**             | Excelente - HTML completo disponible inmediatamente |
| **Carga inicial**    | Más rápida - HTML pre-generado                |
| **Interactividad**   | Después de que se completa la hidratación                   |
| **Necesidades del servidor**    | Ninguna para servir (compatible con CDN)             |
| **Tiempo de compilación**      | Más largo - genera todas las páginas por adelantado        |
| **Actualizaciones de contenido** | Requiere reconstrucción y redespliegue               |

📖 **Implementación:** Consulta [Personalizar prerendering en tiempo de compilación](guide/ssr#customizing-build-time-prerendering-ssg) en la guía de SSR.

## Server-Side Rendering (SSR)

**SSR genera HTML en el servidor para la solicitud inicial de una ruta**, proporcionando contenido dinámico con buen SEO. El servidor renderiza HTML y lo envía al cliente.

Una vez que el cliente renderiza la página, Angular [hidrata](/guide/hydration#what-is-hydration) la aplicación y luego se ejecuta completamente en el navegador como una SPA tradicional - la navegación subsiguiente, cambios de ruta y llamadas a API ocurren del lado del cliente sin renderización adicional del servidor.

### Cuándo usar SSR {#when-to-use-ssr}

✅ Puede ser una buena opción para:

- Páginas de productos de e-commerce (precios/inventario dinámicos)
- Sitios de noticias y feeds de redes sociales
- Contenido personalizado que cambia frecuentemente

❌ Cuando sea posible, considera evitarlo para:

- Contenido estático (usa SSG en su lugar)
- Cuando los costos del servidor son una preocupación

### Compensaciones de SSR {#ssr-trade-offs}

| Aspecto              | Impacto                                              |
| :------------------ | :-------------------------------------------------- |
| **SEO**             | Excelente - HTML completo para crawlers                  |
| **Carga inicial**    | Rápida - visibilidad de contenido inmediata                 |
| **Interactividad**   | Retrasada hasta la hidratación                             |
| **Necesidades del servidor**    | Requiere servidor                                     |
| **Personalización** | Acceso completo al contexto del usuario                         |
| **Costos del servidor**    | Más altos - renderiza en la solicitud inicial de una ruta |

📖 **Implementación:** Consulta [Enrutamiento del servidor](guide/ssr#server-routing) y [Crear componentes compatibles con el servidor](guide/ssr#authoring-server-compatible-components) en la guía de SSR.

## Elegir la estrategia correcta {#choosing-the-right-strategy}

### Matriz de decisión {#decision-matrix}

| Si necesitas...             | Usa esta estrategia | Por qué                                              |
| :------------------------- | :---------------- | :----------------------------------------------- |
| **SEO + Contenido estático**   | SSG               | HTML pre-renderizado, carga más rápida                  |
| **SEO + Contenido dinámico**  | SSR               | Contenido fresco en la solicitud inicial de una ruta |
| **Sin SEO + Interactividad** | CSR               | Más simple, sin servidor necesario                       |
| **Requisitos mixtos**     | Híbrido            | Diferentes estrategias por ruta                   |

## Hacer SSR/SSG interactivo con hidratación {#making-ssrssg-interactive-with-hydration}

Cuando usas SSR o SSG, Angular "hidrata" el HTML renderizado del servidor para hacerlo interactivo.

**Estrategias disponibles:**

- **Hidratación completa** - Toda la aplicación se vuelve interactiva de una vez (predeterminado)
- **Hidratación incremental** - Las partes se vuelven interactivas según sea necesario (mejor rendimiento)
- **Repetición de eventos** - Captura clics antes de que se complete la hidratación

📖 **Aprende más:**

- [Guía de hidratación](guide/hydration) - Configuración completa de hidratación
- [Hidratación incremental](guide/incremental-hydration) - Hidratación avanzada con bloques `@defer`

## Próximos pasos {#next-steps}

<docs-pill-row>
  <docs-pill href="/guide/ssr" title="Server-Side Rendering"/>
  <docs-pill href="/guide/hydration" title="Hydration"/>
  <docs-pill href="/guide/incremental-hydration" title="Incremental Hydration"/>
</docs-pill-row>
