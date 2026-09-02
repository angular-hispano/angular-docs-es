<docs-decorative-header title="Roadmap de Angular" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
Descubre cómo el equipo de Angular está impulsando la web.
</docs-decorative-header>

Como proyecto de código abierto, los commits diarios, los PRs y el avance de Angular pueden seguirse en GitHub. Para aumentar la transparencia sobre cómo este trabajo diario se conecta con el futuro del framework, nuestro roadmap reúne la visión actual y los planes futuros del equipo.

Los siguientes proyectos no están asociados a una versión concreta de Angular. Los publicaremos cuando estén terminados y formarán parte de una versión específica según nuestro calendario de lanzamientos, siguiendo el versionado semántico. Por ejemplo, publicamos las funcionalidades en la siguiente versión menor tras completarlas, o en la siguiente versión mayor si incluyen cambios incompatibles.

Actualmente, Angular tiene tres objetivos para el framework:

1. Mejorar la [experiencia de IA para desarrolladores](/ai)
1. Mejorar la [experiencia de desarrollo en Angular](#improving-the-angular-developer-experience)
1. Mejorar el rendimiento del framework

Sigue leyendo para conocer cómo planeamos cumplir estos objetivos con trabajo concreto en cada proyecto.

## Explora el Angular moderno {#explore-modern-angular}

Empieza a desarrollar con las últimas funcionalidades de Angular de nuestro roadmap. Esta lista representa el estado actual de las nuevas funcionalidades de nuestro roadmap:

### Disponibles para experimentar {#available-to-experiment-with}

- [Web MCP](/ai/webmcp)

### Listas para producción {#production-ready}

- [Signal Forms](/guide/forms/signals/overview)
- [Resource API](/guide/signals/resource)
- [httpResource](/api/common/http/httpResource)
- [Detección de cambios zoneless](/guide/zoneless)
- [Linked Signal API](/guide/signals/linked-signal)
- [Hidratación incremental](/guide/incremental-hydration)
- [Effect API](/api/core/effect)
- [Reproducción de eventos con SSR](/api/platform-browser/withEventReplay)
- [Modo de renderizado a nivel de ruta](/guide/ssr)

## Mejorando la experiencia de IA para desarrolladores de Angular {#improving-the-ai-experience-for-angular-developers}

### Llevando lo mejor de la IA a Angular {#bringing-the-best-of-ai-to-angular}

<docs-card-container>
  <docs-card title="Angular potenciado por IA">
  La IA sigue transformando el panorama del desarrollo. Ha cambiado cómo desarrollamos aplicaciones y los tipos de experiencias de usuario que son posibles. Planeamos dar el mejor soporte a la comunidad de desarrolladores en la programación asistida por IA y en la integración de IA en sus aplicaciones.
  </docs-card>
  <docs-card title="Desarrollo con IA">
  El equipo seguirá desarrollando integraciones significativas con herramientas como Google AI Studio, Gemini CLI y otras herramientas agénticas, como los IDEs agénticos al estilo de Antigravity. Planeamos lanzar soluciones que se mantengan al día con una industria que evoluciona rápidamente. Algunos ejemplos incluyen agent skills, nuevas funcionalidades de MCP y SDKs de IA.
  </docs-card>
  <docs-card title="Generación de código">
  [Según nuestra investigación](https://blog.angular.dev/beyond-the-horizon-how-angular-is-embracing-ai-for-next-gen-apps-7a7ed706e1a3), la generación de código para Angular ya es de alta calidad con los LLMs modernos. Seguiremos invirtiendo en mejorar la generación de código para Angular. Esto significa que evaluaremos con regularidad la calidad de la generación de código con los modelos actuales y trabajaremos para mejorarla mediante instrucciones de sistema, documentación y cambios tácticos en el framework. También seguiremos invirtiendo en [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer), nuestra infraestructura de evaluación.
  </docs-card>
  <docs-card title="Experiencias potenciadas por IA">
  Hay una nueva frontera que los desarrolladores de Angular pueden explorar con conceptos nuevos como la generación dinámica de UI. Empezamos construyendo el soporte de Angular para A2UI y buscamos activamente más oportunidades para dar soporte a experiencias de aplicación modernas.
  </docs-card>
</docs-card-container>

## Mejorando la experiencia de desarrollo en Angular {#improving-the-angular-developer-experience}

### Velocidad de desarrollo {#developer-velocity}

<docs-card-container>
  <docs-card title="Compilador">
    Microsoft ha dedicado el último año a portar el compilador de TypeScript a Go, con la promesa de una aceleración de 5 a 10 veces en las compilaciones típicas de TypeScript. Angular tiene quizá una de las integraciones más profundas con el compilador de TypeScript, lo que requerirá cambios arquitectónicos importantes para dar soporte a los nuevos flujos de trabajo basados en tsgo, tanto para el compilador como para el language service.

Estamos en proceso de prototipar y explorar cómo sería este soporte, y entregaremos un compilador de Angular compatible con tsgo que traiga las ventajas de rendimiento del port nativo de Microsoft al ecosistema de Angular.
</docs-card>

  <docs-card title="Mejor compatibilidad con el ecosistema">
    Los desarrolladores mezclan código generado por IA con código escrito a mano, y quieren aprovechar bibliotecas populares e integrar nuevas experiencias con rapidez. Angular quiere integrarse bien en ese ecosistema: los desarrolladores deberían poder usar las herramientas que les gustan y combinar frameworks según sus necesidades.

Como parte de este proyecto, exploraremos el espacio de requisitos de la interoperabilidad entre frameworks y nuestras herramientas de compilación para mejorar nuestra compatibilidad. También queremos ver si podemos contribuir a este espacio ofreciendo soluciones agnósticas del framework a problemas abiertos del ecosistema web, de forma similar a lo que entregamos con el proyecto [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer).

  </docs-card>

  <docs-card title="Componentes">
  En Angular v21, lanzamos Angular Aria en developer preview, con ocho patrones para componentes accesibles y headless. Planeamos promover estos patrones a estable e introducir nuevos patrones donde haga falta. Queremos ofrecer a los desarrolladores una base sólida para crear sus propios componentes con Angular Aria: nosotros ponemos las interacciones y tú aportas el estilo que encaje con tus sistemas de diseño. Los desarrolladores podrán elegir entre crear componentes personalizados con Angular Aria, usar los patrones de interacción del CDK o usar los componentes de Material ya estilizados.

En cuanto a accesibilidad, evaluamos continuamente los componentes y patrones frente a estándares de accesibilidad como WCAG, y trabajamos para corregir cualquier problema que surja de este proceso.
</docs-card>
</docs-card-container>

### Mejorar las herramientas {#improve-tooling}

<docs-card-container>
  <docs-card title="Modernizar las herramientas de pruebas unitarias con ng test">
  Tras el lanzamiento estable de Vitest en Angular v21, ahora es nuestro ejecutor de pruebas principal. Ahora nos centramos en promover a estable nuestra herramienta experimental de migración de Karma a Vitest, así como en investigar nuevas funcionalidades para seguir refinando y mejorando el flujo de trabajo de pruebas de los desarrolladores.
</docs-card>
</docs-card-container>

## Proyectos completados {#completed-projects}

<docs-card-container>

  <docs-card title="Signal Forms" href="/guide/forms/signals/overview" link="Completado en 2026">
  Signal Forms ya es estable. Este nuevo enfoque permite a los desarrolladores gestionar el estado de los formularios usando signals, ofreciendo una experiencia ergonómica de creación de formularios. Promovimos Signal Forms a estable y mejoramos la interoperabilidad con los formularios reactivos, permitiendo a los equipos migrar formularios grandes de forma progresiva a su propio ritmo.
  </docs-card>
  
  <docs-card title="Reactividad" href="/guide/signals" link="Completado en 2026">
  Introdujimos nuevas APIs de signals, `resource()` y `httpResource()`, para un manejo flexible de datos asíncronos. Promovimos estas APIs a estables.
  </docs-card>
  
  <docs-card title="Detección de cambios" href="/api/core/ChangeDetectionStrategy" link="Completado en 2026">
  Con Zoneless ya estable y por defecto, establecimos `OnPush` como estrategia de detección de cambios predeterminada, siguiendo las mejores prácticas actuales. También renombramos `ChangeDetectionStrategy.Default` a `ChangeDetectionStrategy.Eager`.
  
  [Consulta la discusión del RFC para más detalles](https://github.com/angular/angular/discussions/66779).
  </docs-card>

  <docs-card title="Depuración de signals en Angular DevTools" link="Completado en 2026">
  Hemos añadido mejores herramientas para depurar signals usando Angular DevTools. Este cambio incluye una nueva UI para inspeccionar y depurar signals.
  </docs-card>

  <docs-card title="Mejorar HMR (Hot Module Reload)" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306" link="Completado en 2025">
  Trabajamos para lograr un ciclo de edición y recarga más rápido habilitando el reemplazo de módulos en caliente. En Angular v19 publicamos el soporte inicial de HMR para CSS y plantillas, y en v20 promovimos el HMR de plantillas a estable. Seguiremos recopilando comentarios para asegurarnos de atender las necesidades de los desarrolladores antes de marcar este proyecto como completado.
</docs-card>

<docs-card title="Angular zoneless"  link="Completado en Q4 2025">
En v18 publicamos el soporte experimental zoneless en Angular. Permite a los desarrolladores usar el framework sin incluir zone.js en su bundle, lo que mejora el rendimiento, la experiencia de depuración y la interoperabilidad. Como parte del lanzamiento inicial también introdujimos soporte zoneless en Angular CDK y Angular Material.

En v19 introdujimos soporte zoneless en el renderizado del lado del servidor, resolvimos algunos casos límite y creamos un schematic para generar proyectos zoneless. Migramos <a href="https://fonts.google.com/" target="_blank">Google Fonts</a> a zoneless, lo que mejoró el rendimiento y la experiencia de desarrollo, y nos permitió identificar carencias que debíamos resolver antes de pasar esta funcionalidad a developer preview.

Desde Angular v20.2, Angular zoneless es estable e incluye mejoras en el manejo de errores y en el renderizado del lado del servidor.
</docs-card>

<docs-card title="Configuración de rutas en el servidor" link="Completado en Q2 2025"  >
Trabajamos para permitir una configuración de rutas más ergonómica en el servidor. Queremos que sea trivial declarar qué rutas deben renderizarse en el servidor, prerenderizarse o renderizarse en el cliente.

En Angular v19 publicamos en developer preview el modo de renderizado a nivel de ruta, que te permite configurar de forma granular qué rutas quieres que Angular prerenderice, renderice en el servidor o renderice en el cliente. En Angular v20 lo promovimos a estable.
</docs-card>
<docs-card title="Habilitar la hidratación incremental" link="Completado en Q2 2025">
En v17 sacamos la hidratación de developer preview y hemos observado de forma consistente mejoras del 40-50% en LCP. Desde entonces empezamos a prototipar la hidratación incremental y mostramos una demo en el escenario de ng-conf.

En v19 publicamos la hidratación incremental en modo developer preview, impulsada por los bloques `@defer`. ¡En Angular v20 la promovimos a estable!
</docs-card>
<docs-card title="Entregar Angular Signals" link="Completado en Q2 2025" href="https://github.com/angular/angular/discussions/49685">
Este proyecto replantea el modelo de reactividad de Angular introduciendo las signals como primitiva de reactividad. La planificación inicial dio lugar a cientos de discusiones, conversaciones con desarrolladores, sesiones de retroalimentación, estudios de experiencia de usuario y una serie de RFCs que recibieron más de 1.000 comentarios.

En Angular v20 promovimos a estable todas las primitivas fundamentales de reactividad, incluidas signal, effect, linkedSignal, las consultas basadas en signals y las entradas.
</docs-card>
<docs-card title="Soporte para drag and drop bidimensional" link="Completado en Q2 2024" href="https://github.com/angular/components/issues/13372">
Como parte de este proyecto, implementamos soporte para orientación mixta en el drag and drop de Angular CDK. Es una de las funcionalidades más solicitadas del repositorio.
</docs-card>
<docs-card title="Reproducción de eventos con SSR y prerenderizado" link="Completado en Q4 2024" href="api/platform-browser/withEventReplay">
En v18 introdujimos una funcionalidad de reproducción de eventos al usar renderizado del lado del servidor o prerenderizado. Para esta funcionalidad dependemos de la primitiva de despacho de eventos (antes conocida como jsaction) que se ejecuta en Google.com.

En Angular v19 promovimos la reproducción de eventos a estable y la habilitamos por defecto en todos los proyectos nuevos.
</docs-card>
<docs-card title="Integrar el Angular Language Service con los schematics" link="Completado en Q4 2024">
Para facilitar a los desarrolladores el uso de las APIs modernas de Angular, habilitamos la integración entre el language service de Angular y los schematics, lo que te permite refactorizar tu aplicación con un solo clic.
</docs-card>
<docs-card title="Simplificar las importaciones standalone con el Language Service" link="Completado en Q4 2024">
Como parte de esta iniciativa, el language service importa automáticamente componentes y pipes tanto en aplicaciones standalone como basadas en NgModule. Además, hemos añadido un diagnóstico de plantilla que resalta las importaciones sin usar en componentes standalone, lo que debería ayudar a reducir el tamaño de los bundles de las aplicaciones.
</docs-card>
<docs-card title="Variables locales de plantilla" link="Completado en Q3 2024">
Hemos publicado el soporte para variables locales de plantilla en Angular; consulta la [documentación de `@let`](/api/core/@let) para más información.
</docs-card>
<docs-card title="Ampliar la personalización de Angular Material" link="Completado en Q2 2024" href="https://material.angular.dev/guide/theming">
Para ofrecer una mejor personalización de nuestros componentes de Angular Material y habilitar las capacidades de Material 3, colaboraremos con el equipo de Material Design de Google en la definición de APIs de theming basadas en tokens.

En v17.2 compartimos soporte experimental para Angular Material 3 y en v18 lo promovimos a estable.
</docs-card>
<docs-card title="Introducir la carga diferida" link="Completado en Q2 2024" href="https://next.angular.dev/guide/templates/defer">
En v17 publicamos las vistas diferidas en developer preview, que ofrecen una API ergonómica para la carga diferida de código. En v18 habilitamos las vistas diferidas para desarrolladores de bibliotecas y promovimos la API a estable.
</docs-card>
<docs-card title="Soporte de iframe en Angular DevTools" link="Completado en Q2 2024">
Habilitamos la depuración y el perfilado de aplicaciones Angular incrustadas en un iframe dentro de la página.
</docs-card>
<docs-card title="Automatización de la transición de proyectos existentes con renderizado híbrido a esbuild y vite" link="Completado en Q2 2024" href="tools/cli/build-system-migration">
En v17 publicamos un application builder basado en vite y esbuild y lo habilitamos por defecto para los proyectos nuevos. Mejora el tiempo de compilación hasta en un 87% en proyectos que usan renderizado híbrido. Como parte de v18 publicamos schematics y una guía para migrar los proyectos existentes con renderizado híbrido al nuevo pipeline de compilación.
</docs-card>
<docs-card title="Convertir Angular.dev en el hogar oficial de los desarrolladores de Angular" link="Completado en Q2 2024" href="https://goo.gle/angular-dot-dev">
Angular.dev es el nuevo sitio, dominio y hogar del desarrollo con Angular. El nuevo sitio contiene documentación actualizada, tutoriales y orientación que ayudarán a los desarrolladores a construir con las últimas funcionalidades de Angular.
</docs-card>
<docs-card title="Introducir el control de flujo integrado" link="Completado en Q2 2024" href="guide/templates/control-flow">
En v17 publicamos una versión en developer preview de un nuevo control de flujo. Aporta mejoras significativas de rendimiento y una mejor ergonomía al escribir plantillas. También proporcionamos una migración de los `*ngIf`, `*ngFor` y `*ngSwitch` existentes que puedes ejecutar para pasar tu proyecto a la nueva implementación. Desde v18 el control de flujo integrado es estable.
</docs-card>
<docs-card title="Modernizar el tutorial de primeros pasos" link="Completado en Q4 2023">
Durante los dos últimos trimestres, desarrollamos un nuevo tutorial en [video](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF) y en [texto](/tutorials/learn-angular) basado en componentes standalone.
</docs-card>
<docs-card title="Investigar bundlers modernos" link="Completado en Q4 2023" href="guide/hydration">
En Angular v16, publicamos en developer preview un builder basado en esbuild con soporte para `ng build` y `ng serve`. El servidor de desarrollo de `ng serve` usa Vite y una compilación multiarchivo a cargo de esbuild y el compilador de Angular. En v17 sacamos las herramientas de compilación de developer preview y las habilitamos por defecto para los proyectos nuevos.
</docs-card>
<docs-card title="Introducir APIs de depuración de la inyección de dependencias" link="Completado en Q4 2023" href="tools/devtools">
Para mejorar las utilidades de depuración de Angular y Angular DevTools, trabajaremos en APIs que den acceso al runtime de la inyección de dependencias. Como parte del proyecto, expondremos métodos de depuración que nos permitan explorar la jerarquía de inyectores y las dependencias a través de sus proveedores asociados. Desde v17, publicamos una funcionalidad que nos permite engancharnos al ciclo de vida de la inyección de dependencias. También lanzamos una visualización del árbol de inyectores y la inspección de los proveedores declarados dentro de cada nodo individual,
</docs-card>
<docs-card title="Mejorar la documentación y los schematics para componentes standalone" link="Completado en Q4 2023" href="essentials/components">
Publicamos en developer preview la colección de schematics `ng new --standalone`, que te permite crear aplicaciones sin NgModules. En v17 cambiamos el formato de creación de aplicaciones nuevas a las APIs standalone y actualizamos la documentación para reflejar la recomendación. Además, publicamos schematics que permiten actualizar las aplicaciones existentes a componentes, directivas y pipes standalone. Aunque los NgModules seguirán existiendo en el futuro previsible, te recomendamos explorar las ventajas de las nuevas APIs para mejorar la experiencia de desarrollo y beneficiarte de las nuevas funcionalidades que construimos para ellas.
</docs-card>
<docs-card title="Explorar mejoras en la hidratación y el renderizado del lado del servidor" link="Completado en Q4 2023">
En v16, publicamos en developer preview la hidratación completa no destructiva; consulta la [guía de hidratación](guide/hydration) y la [entrada del blog](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) para más información. Ya observamos mejoras significativas en las Core Web Vitals, incluidas [LCP](https://web.dev/lcp) y [CLS](https://web.dev/cls). En pruebas de laboratorio, observamos de forma consistente un LCP un 45% mejor en una aplicación real.

En v17 sacamos la hidratación de developer preview e hicimos una serie de mejoras en el renderizado del lado del servidor, entre ellas: descubrimiento de rutas en tiempo de ejecución para SSG, tiempos de compilación hasta un 87% más rápidos para aplicaciones con renderizado híbrido y un aviso que habilita el renderizado híbrido en los proyectos nuevos.
</docs-card>
<docs-card title="Hidratación completa no destructiva de la aplicación" link="Completado en Q1 2023" href="guide/hydration">
En v16, publicamos en developer preview la hidratación completa no destructiva, que permite a Angular reutilizar los nodos del DOM existentes en una página renderizada en el servidor, en lugar de recrear la aplicación desde cero. Consulta más información en la guía de hidratación.
</docs-card>
<docs-card title="Mejoras en la directiva de imagen" link="Completado en Q1 2023" href="guide/image-optimization">
Publicamos la directiva de imagen de Angular como estable en v15. Introdujimos una nueva funcionalidad de modo fill que permite que las imágenes se ajusten a su contenedor padre en lugar de tener dimensiones explícitas. Durante los dos últimos meses, el equipo de Chrome Aurora adaptó la directiva a v12 y versiones posteriores.
</docs-card>
<docs-card title="Refactorización de la documentación" link="Completado en Q1 2023" href="https://angular.io">
Asegurar que toda la documentación existente encaje en un conjunto consistente de tipos de contenido. Convertir el uso excesivo de documentación con estilo de tutorial en temas independientes. Queremos asegurarnos de que el contenido fuera de los tutoriales principales sea autosuficiente sin estar fuertemente acoplado a una serie de guías. En Q2 2022, refactorizamos el contenido de plantillas e inyección de dependencias. En Q1 2023, mejoramos las guías de HTTP y, con esto, ponemos en pausa el proyecto de refactorización de la documentación.
</docs-card>
<docs-card title="Mejorar el rendimiento de las imágenes" link="Completado en Q4 2022" href="guide/image-optimization">
Los equipos de Aurora y Angular trabajan en la implementación de una directiva de imagen que busca mejorar las Core Web Vitals. Publicamos una versión estable de la directiva de imagen en v15.
</docs-card>
<docs-card title="CSS moderno" link="Completado en Q4 2022" href="https://blog.angular.dev/modern-css-in-angular-layouts-4a259dca9127">
El ecosistema web evoluciona constantemente y queremos reflejar los últimos estándares modernos en Angular. En este proyecto buscamos ofrecer pautas sobre el uso de funcionalidades modernas de CSS en Angular para asegurar que los desarrolladores sigan las mejores prácticas de layout, estilos, etc. Compartimos pautas oficiales para layout y, como parte de la iniciativa, dejamos de publicar flex layout.
</docs-card>
<docs-card title="Soporte para añadir directivas a elementos host" link="Completado en Q4 2022" href="guide/directives/directive-composition-api">
Una petición de larga data es poder añadir directivas a elementos host. Esta funcionalidad permite a los desarrolladores ampliar sus propios componentes con comportamientos adicionales sin usar herencia. En v15 publicamos nuestra API de composición de directivas, que permite enriquecer elementos host con directivas.
</docs-card>
<docs-card title="Mejores stack traces" link="Completado en Q4 2022" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
Los equipos de Angular y Chrome DevTools trabajan juntos para lograr stack traces más legibles en los mensajes de error. En v15 publicamos stack traces mejorados, más relevantes y con enlaces. Como iniciativa de menor prioridad, exploraremos cómo hacer los stack traces más amigables ofreciendo nombres de frames de llamada más precisos para las plantillas.
</docs-card>
<docs-card title="Componentes de Angular Material mejorados al integrar MDC Web" link="Completado en Q4 2022" href="https://material.angular.dev/guide/mdc-migration">
MDC Web es una biblioteca creada por el equipo de Material Design de Google que ofrece primitivas reutilizables para construir componentes de Material Design. El equipo de Angular está incorporando estas primitivas en Angular Material. Usar MDC Web alinea Angular Material más estrechamente con la especificación de Material Design, amplía la accesibilidad, mejora la calidad de los componentes y aumenta la velocidad de nuestro equipo.
</docs-card>
<docs-card title="Implementar APIs para NgModules opcionales" link="Completado en Q4 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
En el proceso de simplificar Angular, trabajamos en introducir APIs que permitan a los desarrolladores inicializar aplicaciones, instanciar componentes y usar el router sin NgModules. Angular v14 introduce en developer preview las APIs para componentes, directivas y pipes standalone. En los próximos trimestres recopilaremos comentarios de los desarrolladores y finalizaremos el proyecto haciendo estables las APIs. Como siguiente paso, trabajaremos en mejorar casos de uso como TestBed, Angular elements, etc.
</docs-card>
<docs-card title="Permitir el enlace a campos protegidos en las plantillas" link="Completado en Q2 2022" href="guide/templates/binding">
Para mejorar la encapsulación de los componentes de Angular, habilitamos el enlace a miembros protegidos de la instancia del componente. De esta forma ya no tendrás que exponer un campo o un método como público para usarlo dentro de tus plantillas.
</docs-card>
<docs-card title="Publicar guías sobre conceptos avanzados" link="Completado en Q2 2022" href="https://angular.io/guide/change-detection">
Desarrollar y publicar una guía en profundidad sobre la detección de cambios. Desarrollar contenido para el perfilado de rendimiento de aplicaciones Angular. Cubrir cómo interactúa la detección de cambios con Zone.js y explicar cuándo se activa, cómo perfilar su duración, así como prácticas comunes para optimizar el rendimiento.
</docs-card>
<docs-card title="Despliegue de tipado estricto para @angular/forms" link="Completado en Q2 2022" href="guide/forms/typed-forms">
En Q4 2021 diseñamos una solución para introducir tipado estricto en los formularios y en Q1 2022 concluimos la correspondiente solicitud de comentarios. Actualmente, implementamos una estrategia de despliegue con un paso de migración automatizado que habilitará las mejoras en los proyectos existentes. Primero probamos la solución con más de 2.500 proyectos en Google para asegurar una ruta de migración fluida para la comunidad externa.
</docs-card>
<docs-card title="Eliminar el View Engine heredado" link="Completado en Q1 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Una vez completada la transición de todas nuestras herramientas internas a Ivy, eliminaremos el View Engine heredado para reducir la carga conceptual de Angular, el tamaño de los paquetes, el costo de mantenimiento y la complejidad del código base.
</docs-card>
<docs-card title="Modelo mental de Angular simplificado con NgModules opcionales" link="Completado en Q1 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Para simplificar el modelo mental de Angular y la curva de aprendizaje, trabajaremos en hacer opcionales los NgModules. Este trabajo permite a los desarrolladores crear componentes standalone e implementar una API alternativa para declarar el ámbito de compilación del componente. Iniciamos este proyecto con discusiones de diseño de alto nivel que recogimos en un RFC.
</docs-card>
<docs-card title="Diseñar el tipado estricto para @angular/forms" link="Completado en Q1 2022" href="guide/forms/typed-forms">
Trabajaremos en encontrar una forma de implementar una comprobación de tipos más estricta para los formularios reactivos con el mínimo de implicaciones incompatibles hacia atrás. De esta forma, permitimos a los desarrolladores detectar más problemas durante el desarrollo, habilitamos un mejor soporte de editores de texto e IDEs, y mejoramos la comprobación de tipos de los formularios reactivos.
</docs-card>
<docs-card title="Mejorar la integración de Angular DevTools con el framework" link="Completado en Q1 2022" href="tools/devtools">
Para mejorar la integración de Angular DevTools con el framework, trabajamos en mover el código base al monorepositorio angular/angular. Esto incluye la transición de Angular DevTools a Bazel y su integración en los procesos existentes y el pipeline de CI.
</docs-card>
<docs-card title="Lanzar diagnósticos avanzados del compilador" link="Completado en Q1 2022" href="extended-diagnostics">
Extender los diagnósticos del compilador de Angular más allá de la comprobación de tipos. Introducir otras comprobaciones de corrección y conformidad para garantizar aún más la corrección y las mejores prácticas.
</docs-card>
<docs-card title="Actualizar nuestra estrategia de pruebas e2e" link="Completado en Q3 2021" href="guide/testing">
Para asegurar una estrategia de pruebas e2e preparada para el futuro, queremos evaluar el estado de Protractor, las innovaciones de la comunidad y las mejores prácticas de e2e, y explorar nuevas oportunidades. Como primeros pasos del esfuerzo, compartimos un RFC y trabajamos con socios para asegurar una integración fluida entre el Angular CLI y las herramientas más avanzadas para pruebas e2e. Como siguiente paso, necesitamos finalizar las recomendaciones y compilar una lista de recursos para la transición.
</docs-card>
<docs-card title="Las bibliotecas de Angular usan Ivy" link="Completado en Q3 2021" href="tools/libraries">
A principios de 2020, compartimos un RFC para la distribución de bibliotecas con Ivy. Tras los valiosos comentarios de la comunidad, desarrollamos el diseño del proyecto. Ahora invertimos en el desarrollo de la distribución de bibliotecas con Ivy, que incluye una actualización del formato de paquete de bibliotecas para usar la compilación de Ivy, desbloquear la deprecación del formato de bibliotecas de View Engine y ngcc.
</docs-card>
<docs-card title="Mejorar los tiempos de prueba y la depuración con el desmontaje automático del entorno de pruebas" link="Completado en Q3 2021" href="guide/testing">
Para mejorar el tiempo de prueba y lograr un mejor aislamiento entre pruebas, queremos cambiar TestBed para que limpie y desmonte automáticamente el entorno de pruebas después de cada ejecución.
</docs-card>
<docs-card title="Deprecar y eliminar el soporte de IE11" link="Completado en Q3 2021" href="https://github.com/angular/angular/issues/41840">
Internet Explorer 11 (IE11) ha impedido que Angular aproveche algunas de las funcionalidades modernas de la plataforma web. Como parte de este proyecto vamos a deprecar y eliminar el soporte de IE11 para abrir el camino a las funcionalidades modernas que ofrecen los navegadores evergreen. Realizamos un RFC para recoger comentarios de la comunidad y decidir los siguientes pasos.
</docs-card>
<docs-card title="Adoptar ES2017+ como lenguaje de salida por defecto" link="Completado en Q3 2021" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
Dar soporte a navegadores modernos nos permite aprovechar la nueva sintaxis de JavaScript, más compacta, expresiva y eficiente. Como parte de este proyecto investigaremos cuáles son los bloqueos para avanzar en este esfuerzo y daremos los pasos necesarios para habilitarlo.
</docs-card>
<docs-card title="Depuración y perfilado de rendimiento acelerados con Angular DevTools" link="Completado en Q2 2021" href="tools/devtools">
Trabajamos en herramientas de desarrollo para Angular que ofrecen utilidades para la depuración y el perfilado de rendimiento. Este proyecto busca ayudar a los desarrolladores a entender la estructura de componentes y la detección de cambios en una aplicación Angular.
</docs-card>
<docs-card title="Simplificar los lanzamientos con un versionado y ramificado consolidados de Angular" link="Completado en Q2 2021" href="reference/releases">
Queremos consolidar las herramientas de gestión de lanzamientos entre los múltiples repositorios de GitHub de Angular (angular/angular, angular/angular-cli y angular/components). Este esfuerzo nos permite reutilizar infraestructura, unificar y simplificar procesos, y mejorar la fiabilidad de nuestro proceso de lanzamiento.
</docs-card>
<docs-card title="Mayor consistencia entre desarrolladores con la estandarización de los mensajes de commit" link="Completado en Q2 2021" href="https://github.com/angular/angular">
Queremos unificar los requisitos y la conformidad de los mensajes de commit en los repositorios de Angular (angular/angular, angular/components y angular/angular-cli) para dar consistencia a nuestro proceso de desarrollo y reutilizar las herramientas de infraestructura.
</docs-card>
<docs-card title="Transición del language service de Angular a Ivy" link="Completado en Q2 2021" href="tools/language-service">
El objetivo de este proyecto es mejorar la experiencia y eliminar la dependencia heredada migrando el language service a Ivy. Hoy el language service sigue usando el compilador y la comprobación de tipos de View Engine, incluso para aplicaciones Ivy. Queremos usar el analizador de plantillas de Ivy y la comprobación de tipos mejorada en el Angular Language Service para que coincida con el comportamiento de la aplicación. Esta migración también es un paso para desbloquear la eliminación de View Engine, lo que simplificará Angular, reducirá el tamaño del paquete npm y mejorará la mantenibilidad del framework.
</docs-card>
<docs-card title="Mayor seguridad con Trusted Types nativos en Angular" link="Completado en Q2 2021" href="best-practices/security">
En colaboración con el equipo de seguridad de Google, añadimos soporte para la nueva API de Trusted Types. Esta API de la plataforma web ayuda a los desarrolladores a construir aplicaciones web más seguras.
</docs-card>
<docs-card title="Velocidad de compilación y tamaños de bundle optimizados con webpack 5 en el Angular CLI" link="Completado en Q2 2021" href="tools/cli/build">
Como parte del lanzamiento de v11, introdujimos una vista previa opcional de webpack 5 en el Angular CLI. Para garantizar la estabilidad, seguiremos iterando sobre la implementación para habilitar mejoras en la velocidad de compilación y el tamaño de los bundles.
</docs-card>
<docs-card title="Aplicaciones más rápidas al incrustar los estilos críticos en aplicaciones Universal" link="Completado en Q1 2021" href="guide/ssr">
Cargar hojas de estilo externas es una operación bloqueante, lo que significa que el navegador no puede empezar a renderizar tu aplicación hasta que carga todo el CSS referenciado. Tener recursos que bloquean el renderizado en la cabecera de una página puede afectar significativamente a su rendimiento de carga, por ejemplo, a su first contentful paint. Para hacer las aplicaciones más rápidas, hemos colaborado con el equipo de Google Chrome en incrustar el CSS crítico y cargar el resto de los estilos de forma asíncrona.
</docs-card>
<docs-card title="Mejorar la depuración con mejores mensajes de error en Angular" link="Completado en Q1 2021" href="errors">
Los mensajes de error suelen aportar poca información accionable para ayudar a los desarrolladores a resolverlos. Hemos trabajado en hacer los mensajes de error más fáciles de encontrar añadiendo códigos asociados, desarrollando guías y otros materiales para asegurar una experiencia de depuración más fluida.
</docs-card>
<docs-card title="Mejor incorporación de desarrolladores con una documentación introductoria renovada" link="Completado en Q1 2021" href="tutorials">
Redefiniremos los recorridos de aprendizaje de los usuarios y renovaremos la documentación introductoria. Expondremos con claridad las ventajas de Angular, cómo explorar sus capacidades y ofreceremos orientación para que los desarrolladores dominen el framework en el menor tiempo posible.
</docs-card>
<docs-card title="Ampliar las mejores prácticas de los component harnesses" link="Completado en Q1 2021" href="https://material.angular.dev/guide/using-component-harnesses">
Angular CDK introdujo el concepto de component test harnesses en Angular en la versión 9. Los test harnesses permiten a los autores de componentes crear APIs soportadas para probar las interacciones de los componentes. Seguimos mejorando esta infraestructura de harnesses y aclarando las mejores prácticas sobre su uso. También trabajamos para impulsar una mayor adopción de los harnesses dentro de Google.
</docs-card>
<docs-card title="Escribir una guía sobre proyección de contenido" link="Completado en Q2 2021" href="https://angular.io/docs">
La proyección de contenido es un concepto central de Angular que no tiene la presencia que merece en la documentación. Como parte de este proyecto queremos identificar los casos de uso y conceptos centrales de la proyección de contenido y documentarlos.
</docs-card>
<docs-card title="Migrar a ESLint" link="Completado en Q4 2020" href="tools/cli">
Con la deprecación de TSLint pasaremos a ESLint. Como parte del proceso, trabajaremos en asegurar la compatibilidad hacia atrás con nuestra configuración recomendada actual de TSLint, implementaremos una estrategia de migración para las aplicaciones Angular existentes e introduciremos nuevas herramientas al toolchain del Angular CLI.
</docs-card>
<docs-card title="Operación Bye Bye Backlog (también conocida como Operación Byelog)" link="Completado en Q4 2020" href="https://github.com/angular/angular/issues">
Estamos invirtiendo activamente hasta el 50% de nuestra capacidad de ingeniería en el triaje de issues y PRs hasta tener una comprensión clara de las necesidades más amplias de la comunidad. Después, dedicaremos hasta el 20% de nuestra capacidad de ingeniería a mantenernos al día con las nuevas contribuciones.
</docs-card>
</docs-card-container>
