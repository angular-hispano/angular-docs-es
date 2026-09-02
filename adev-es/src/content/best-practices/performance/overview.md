# Rendimiento

Angular incluye muchas optimizaciones listas para usar, pero a medida que las aplicaciones crecen, puede que necesites ajustar tanto la rapidez con la que carga tu aplicación como la capacidad de respuesta que ofrece durante su uso. Estas guías cubren las herramientas y técnicas que Angular proporciona para ayudarte a construir aplicaciones rápidas.

## Rendimiento de carga {#loading-performance}

El rendimiento de carga determina qué tan rápido tu aplicación se vuelve visible e interactiva. Una carga lenta afecta directamente a las [Core Web Vitals](https://web.dev/vitals/) como Largest Contentful Paint (LCP) y Time to First Byte (TTFB).

| Técnica                                                                                                 | Qué hace                                                                                                                                                                                                                                         | Cuándo usarla                                                                                             |
| :------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| [Rutas con carga diferida](best-practices/performance/lazy-loaded-routes#lazily-loaded-components-and-routes) | Pospone la carga de los componentes de ruta hasta la navegación, reduciendo el tamaño del bundle inicial                                                                                                                                   | Aplicaciones con múltiples rutas donde no todas se necesitan en la carga inicial                          |
| [Carga diferida con `@defer`](best-practices/performance/defer)                                         | Divide los componentes en bundles separados que se cargan bajo demanda                                                                                                                                                                           | Componentes no visibles en el renderizado inicial, bibliotecas de terceros pesadas, contenido bajo el pliegue |
| [Lazy loading de servicios con `injectAsync`](guide/di/lazy-loading-services)                           | Divide los servicios poco usados en chunks separados y los carga bajo demanda                                                                                                                                                                    | Servicios respaldados por bibliotecas grandes o funcionalidades de uso poco frecuente                     |
| [Optimización de imágenes](best-practices/performance/image-optimization)                               | Prioriza las imágenes LCP, carga las demás de forma diferida y genera atributos `srcset` responsivos                                                                                                                                              | Cualquier aplicación que muestre imágenes                                                                 |
| [Renderizado del lado del servidor](best-practices/performance/ssr)                                     | Renderiza las páginas en el servidor para un primer pintado más rápido y mejor SEO, con [hidratación](guide/hydration) para restaurar la interactividad e [hidratación incremental](guide/incremental-hydration) para posponer la hidratación de secciones hasta que se necesiten | Aplicaciones con mucho contenido, páginas que necesitan indexación en motores de búsqueda                 |

## Rendimiento en tiempo de ejecución {#runtime-performance}

El rendimiento en tiempo de ejecución determina qué tan fluida se siente tu aplicación después de cargar. El sistema de detección de cambios de Angular mantiene el DOM sincronizado con tus datos, y optimizar cómo y cuándo se ejecuta es la principal palanca para mejorar el rendimiento en tiempo de ejecución.

| Técnica                                                                | Qué hace                                                                                                                 | Cuándo usarla                                                                                          |
| :--------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| [Detección de cambios zoneless](guide/zoneless)                        | Elimina la sobrecarga de ZoneJS y activa la detección de cambios solo cuando las signals o los eventos indican un cambio | Aplicaciones nuevas (predeterminado en Angular v21+), o aplicaciones existentes listas para migrar     |
| [Cálculos lentos](best-practices/slow-computations)                    | Identifica y optimiza expresiones de plantilla y hooks de ciclo de vida costosos                                         | El perfilado revela componentes específicos que causan ciclos de detección de cambios lentos           |
| [Omitir subárboles de componentes](best-practices/skipping-subtrees)   | Usa la detección de cambios `OnPush` para omitir árboles de componentes sin cambios                                      | Aplicaciones que necesitan un control más fino sobre la detección de cambios                           |
| [Contaminación de zona](best-practices/zone-pollution)                 | Evita la detección de cambios innecesaria causada por bibliotecas de terceros o temporizadores                            | Aplicaciones basadas en zonas donde el perfilado revela ciclos de detección de cambios excesivos       |

## Medir el rendimiento {#measuring-performance}

Identificar qué optimizar es tan importante como saber cómo optimizarlo. Angular se integra con las herramientas de desarrollo del navegador para ayudarte a encontrar cuellos de botella.

| Herramienta                                                                | Qué hace                                                                                                                                                                                                              |
| :------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Perfilado con Chrome DevTools](best-practices/profiling-with-chrome-devtools) | Registra datos de rendimiento específicos de Angular junto con el perfilado del navegador, con gráficos de llamas codificados por colores que muestran el renderizado de componentes, los ciclos de detección de cambios y los hooks de ciclo de vida |
| [Angular DevTools](tools/devtools)                                         | Una extensión del navegador que proporciona un inspector del árbol de componentes y un profiler para visualizar los ciclos de detección de cambios                                                                    |

## Qué optimizar primero {#what-to-optimize-first}

Si no sabes por dónde empezar, primero perfila tu aplicación usando la [pista de Angular en Chrome DevTools](best-practices/profiling-with-chrome-devtools) para identificar cuellos de botella específicos.

Como punto de partida general:

- **Carga inicial lenta** — Usa [`@defer`](best-practices/performance/defer) para separar los componentes grandes del bundle principal, [`NgOptimizedImage`](best-practices/performance/image-optimization) para priorizar las imágenes sobre el pliegue, y el [renderizado del lado del servidor](best-practices/performance/ssr) para entregar el contenido más rápido.
- **Interacciones lentas después de la carga** — Comprueba si la [detección de cambios zoneless](guide/zoneless) está habilitada, busca [cálculos lentos](best-practices/slow-computations) en plantillas o hooks de ciclo de vida, y considera [`OnPush`](best-practices/skipping-subtrees) para reducir la detección de cambios innecesaria.
