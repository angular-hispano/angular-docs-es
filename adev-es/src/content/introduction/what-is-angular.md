<docs-decorative-header title="¿Qué es Angular?" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

<big style="margin-top: 2em">
Angular es un framework que permite a los desarrolladores crear aplicaciones rápidas y fiables.
</big>

Mantenido por un equipo dedicado en Google, Angular ofrece un amplio conjunto de herramientas, API y
librerias para simplificar y optimizar su flujo de trabajo de desarrollo. Angular te da
una plataforma sólida en la que construir aplicaciones rápidas y fiables que escalan con el tamaño de
su equipo y el tamaño de tu base de código.

**¿Quieres ver algún código?** Revisa nuestros [Esenciales](essentials) para una rápida visión general 
de lo que es usar Angular, o inicia con el [Tutorial](tutorials/learn-angular) si prefieres seguir 
instrucciones paso a paso.

## Características que impulsan tu desarrollo

<docs-card-container>
  <docs-card title="Mantenga su base de código organizada con un modelo de componente dogmático y un sistema de inyección de dependencia flexible" 
  href="guide/components" link="Comienza con los componentes">
  Los componentes de Angular facilitan la división del código en partes bien encapsuladas.

  La inyección de dependencia versátil te ayuda a mantener tu código modular, débilmente acoplado y
  comprobable.
  </docs-card>
  <docs-card title="Obtenga actualizaciones de estado rápidas con reactividad granular basada en Signals" href="guide/signals" link="Explora Angular Signals">
  Nuestro modelo de reactividad granular, combinado con optimizaciones en tiempo de compilación, simplifica el desarrollo y ayuda a crear aplicaciones más rápidas por defecto.

  Rastrea de forma granular cómo y dónde se usa el estado en toda la aplicación, lo que le da al framework el poder de renderizar actualizaciones rápidas a través de instrucciones altamente optimizadas.
  </docs-card>
  <docs-card title="Compla sus objetivos de rendimiento con SSR, SSG, hidratación y carga diferida de próxima generación" href="guide/ssr" link="Lee sobre SSR">
    Angular soporta renderizado del lado del servidor (SSR) y generación de sitio estático (SSG) junto
    con hidratación de DOM completa. Los bloques `@defer` en plantillas hacen que sea fácil de dividir declarativamente
    sus plantillas en partes perezosas.
  </docs-card>
  <docs-card title="Garantiza que todo funcione en conjunto con los módulos propios de Angular para 
  formularios, rutas y más">
  [Router de Angular](guide/routing) proporciona un kit de herramientas de navegación rico en características, incluyendo soporte
  para guardias de ruta, resolución de datos, carga lenta y mucho más.

  [Forms module de Angular](guide/forms) proporciona un sistema estandarizado para la participación y validación de formularios.
  </docs-card>
</docs-card-container>

## Desarrolla aplicaciones más rápido que nunca

<docs-card-container>
  <docs-card title="Construye, sirve, prueba e implementa sin esfuerzo con Angular CLI" href="tools/cli" link="Angular CLI">
  Angular CLI hace que tu proyecto se ejecute en menos de un minuto con los comandos que necesitas
  para convertirla en una aplicación desplegada en producción.
  </docs-card>
  <docs-card title="Depura, analiza y optimiza visualmente tu código con la extensión del navegador Angular DevTools" href="tools/devtools" link="Angular DevTools">
  Angular DevTools se integra con las herramientas para desarrolladores de tu navegador. 
  Te ayuda a depurar y analizar tu aplicación, incluyendo un inspector del árbol de componentes,
  una vista del árbol de inyección de dependencias y un gráfico de llamas perfilado de rendimiento personalizado.
  </docs-card>
  <docs-card title="No te pierdas nunca una versión con ng update" href="cli/update" link="ng update">
  `ng update` de Angular CLI ejecuta transformaciones automatizadas de código que manejan automáticamente los cambios
  disruptivos habituales, simplificando drásticamente las actualizaciones de versiones principales. Mantenerse actualizado
  con la última versión garantiza que tu aplicación sea lo más rápida y segura posible.
  </docs-card>
  <docs-card title="Mantente productivo con la integración de IDE en tu editor favorito" href="tools/language-service" link="Language service">
  Los servicios de lenguaje IDE de Angular potencian el autocompletado de código, la navegación, 
  la refactorización y el diagnóstico en tiempo real en su editor favorito.
  </docs-card>
</docs-card-container>

## Desplega con confianza

<docs-card-container>
  <docs-card title="Verificado commit por commit contra el colosal monorepo de Google" href="https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext" link="Aprenda acerca del monorepo de Google">
  Cada commit de Angular se verifica contra cientos de miles de pruebas en el repositorio de código interno de Google, 
  que representan innumerables escenarios del mundo real.

  Angular está comprometido con la estabilidad para algunos de los productos más grandes de Google, incluido Google Cloud.
  Este compromiso garantiza que los cambios estén bien probados, sean compatibles con versiones anteriores e incluyan
  herramientas de migración siempre que sea posible.
  </docs-card>
  <docs-card title="Políticas de soporte claras y calendario de lanzamientos predecible" href="reference/releases" link="Versiones de Angular & Lanzamientos">
  El calendario de lanzamientos predecible y basado en el tiempo de Angular le brinda a tu organización confianza
  en la estabilidad y compatibilidad con versiones anteriores del framework. Las ventanas de soporte a largo plazo (LTS)
  garantizan que obtengas correcciones de seguridad críticas cuando las necesitas. Las herramientas de actualización 
  propias de Angular, las guías y los esquemas de migración automatizados ayudan a mantener tus aplicaciones actualizadas
  con los últimos avances del framework y la plataforma web.
  </docs-card>
</docs-card-container>

## Trabaja a cualquier escala

<docs-card-container>
  <docs-card title="Llega a usuarios de todo el mundo con soporte para internacionalización" href="guide/i18n" link="Internacionalización">
  Las funciones de internacionalización de Angular gestionan las traducciones y el formato de mensajes,
  incluido el soporte para la sintaxis ICU estándar Unicode.
  </docs-card>
  <docs-card title="Protege a tus usuarios con seguridad por defecto" href="best-practices/security" link="Seguridad">
  En colaboración con los ingenieros de seguridad de primer nivel de Google, Angular tiene como objetivo
  hacer que el desarrollo sea seguro por defecto. Las funciones de seguridad integradas, como la sanitización de HTML
  y la compatibilidad con tipos de confianza, ayudan a proteger a tus usuarios de vulnerabilidades comunes
  como el scripting entre sitios (XSS) y la falsificación de solicitudes entre sitios (CSRF).
  </docs-card>
  <docs-card title="Mantenga equipos grandes productivos con Vite y esbuild" href="tools/cli/esbuild" link="ESBuild y Vite">
  Angular CLI incorpora una tubería de compilación rápida y moderna utilizando Vite y ESBuild. Los desarrolladores reportan
  tiempos de compilación de menos de un minuto para proyectos con cientos de miles de líneas de código.
  </docs-card>
  <docs-card title="Probado en algunas de las aplicaciones web más grandes de Google">
  Grandes productos de Google se basan en la arquitectura de Angular y contribuyen al desarrollo de nuevas
  funciones que mejoran aún más la escalabilidad de Angular, desde [Google Fonts](https://fonts.google.com/) hasta [Google Cloud](https://console.cloud.google.com).
  </docs-card>
</docs-card-container>

## Código abierto primero

<docs-card-container>
  <docs-card title="Creado de forma abierta en GitHub" href="https://github.com/angular/angular" link="Estrella de nuestro GitHub">
  Tienes curiosidad por saber en qué estamos trabajando? Todos los PR (Solicitudes de fusión) y commits (Confirmaciones)  están disponibles en nuestro GitHub ¿Te encuentras con un problema o error? Clasificamos los problemas de GitHub con regularidad para asegurarnos de ser receptivos y comprometidos con nuestra comunidad, y resolver los problemas del mundo real a los que te enfrentas.
  </docs-card>
  <docs-card title="Construido con transparencia" href="roadmap" link="Lea nuestro hoja de ruta">
  Nuestro equipo publica una hoja de ruta de nuestro trabajo actual y futuro, y valora tus comentarios. Publicamos Solicitudes de Comentarios (RFCs, por sus siglas en inglés) para recopilar opiniones sobre cambios de características más importantes y garantizar que la voz de la comunidad sea escuchada mientras se define la dirección futura de Angular.
  </docs-card>
</docs-card-container>

## Una comunidad próspera

<docs-card-container>
  <docs-card title="Cursos, blogs and recursos" href="https://devlibrary.withgoogle.com/products/angular?sort=added" link="Echa un vistazo a DevLibrary">
  Nuestra comunidad está compuesta por talentosos desarrolladores, escritores, instructores, podcasters y más. La librería de Google para desarrolladores es solo una muestra de los recursos de alta calidad disponibles para desarrolladores nuevos y experimentados para seguir desarrollando.
  </docs-card>
  <docs-card title="Código abierto" href="https://github.com/angular/angular/blob/main/CONTRIBUTING.md" link="Contribuir a Angular">
  Estamos agradecidos por los colaboradores de código abierto que hacen de Angular un mejor framework para todos. Desde la corrección de un error en los documentos, a la adición de características importantes, animamos a cualquier persona interesada a empezar en nuestro GitHub.
  </docs-card>
  <docs-card title="Alianzas comunitarias" href="https://developers.google.com/community/experts/directory?specialization=angular" link="Conozca a los GDE de Angular">
  Nuestro equipo se asocia con individuos, educadores y empresas para garantizar que estamos apoyando a los desarrolladores de manera consistente. Angular Google Developer Experts (GDE) representa a los líderes de la comunidad en todo el mundo educando, organizando y desarrollando con Angular. Las asociaciones empresariales ayudan a garantizar que Angular se adapte bien a los líderes de la industria tecnológica.
  </docs-card>
  <docs-card title="Alianzas con otras tecnologías de Google">
  Angular se asocia estrechamente con otras tecnologías y equipos de Google para mejorar la web.

  Nuestra asociación continua con Aurora de Chrome explora activamente las mejoras en la experiencia del usuario a través de la web, el desarrollo de optimizaciones de rendimiento integradas como NgOptimizedImage y mejoras en Angular Core Web Vitals.

  También estamos trabajando con [Firebase](https://firebase.google.com/), [Tensorflow](https://www.tensorflow.org/), [Flutter](https://flutter.dev/), [Material Design](https://m3.material.io/), y [Google Cloud](https://cloud.google.com/) para asegurar que proporcionamos integraciones significativas a través del flujo de trabajo del desarrollador.
  </docs-card>
</docs-card-container>

<docs-callout title="Únete al movimiento!">
  <docs-pill-row>
    <docs-pill href="roadmap" title="Lea la hoja de ruta de Angular"/>
    <docs-pill href="playground" title="Pruebe nuestro playground"/>
    <docs-pill href="tutorials" title="Aprender con tutoriales"/>
    <docs-pill href="https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF" title="Vea nuestro curso de YouTube"/>
    <docs-pill href="api" title="Referencia a nuestras API"/>
  </docs-pill-row>
</docs-callout>

