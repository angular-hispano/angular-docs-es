<!-- TODO: need an Angular + AI logo -->

<docs-decorative-header title="Construye con IA" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
Construye aplicaciones potenciadas por IA. Desarrolla más rápido con IA.
</docs-decorative-header>

CONSEJO: ¿Buscas comenzar a construir en tu IDE potenciado por IA favorito? <br>Consulta nuestras [reglas de prompts y mejores prácticas](/ai/develop-with-ai).

La IA generativa (GenAI) con modelos de lenguaje grandes (LLMs) permite la creación de experiencias de aplicación sofisticadas y atractivas, incluyendo contenido personalizado, recomendaciones inteligentes, generación y comprensión de medios, resúmenes de información y funcionalidad dinámica.

Desarrollar características como estas habría requerido previamente experiencia profunda en el dominio y un esfuerzo de ingeniería significativo. Sin embargo, nuevos productos y SDKs están bajando la barrera de entrada. Angular es ideal para integrar IA en tu aplicación web como resultado de:

- Las APIs de plantillas robustas de Angular permiten la creación de interfaces de usuario dinámicas, claramente compuestas y hechas a partir de contenido generado
- Arquitectura sólida basada en signals diseñada para gestionar dinámicamente datos y estado
- Angular se integra perfectamente con SDKs y APIs de IA

Esta guía demuestra cómo puedes usar [Genkit](/ai#construye-aplicaciones-potenciadas-por-ia-con-genkit-y-angular), [Firebase AI Logic](/ai#construye-aplicaciones-potenciadas-por-ia-con-firebase-ai-logic-y-angular) y la [Gemini API](/ai#construye-aplicaciones-potenciadas-por-ia-con-gemini-api-y-angular) para infundir IA en tus aplicaciones Angular hoy. Esta guía impulsará tu viaje de desarrollo de aplicaciones web potenciadas por IA explicando cómo comenzar a integrar IA en aplicaciones Angular. Esta guía también comparte recursos, como kits de inicio, código de ejemplo y recetas para flujos de trabajo comunes, que puedes usar para ponerte al día rápidamente.

Para comenzar, deberías tener un entendimiento básico de Angular. ¿Nuevo en Angular? Prueba nuestra [guía de elementos esenciales](/essentials) o nuestros [tutoriales de primeros pasos](/tutorials).

NOTA: Aunque esta página presenta integraciones y ejemplos con productos de IA de Google, herramientas como Genkit son agnósticas de modelo y te permiten elegir tu propio modelo. En muchos casos, los ejemplos y muestras de código son aplicables a otras soluciones de terceros.

## Primeros Pasos

Construir aplicaciones potenciadas por IA es un campo nuevo y en rápido desarrollo. Puede ser desafiante decidir dónde empezar y qué tecnologías elegir. La siguiente sección proporciona tres opciones para elegir:

1. _Genkit_ te da la opción de [modelo soportado e interfaz con una API unificada](https://genkit.dev) para construir aplicaciones full-stack. Ideal para aplicaciones que requieren lógica de IA sofisticada en el backend, como recomendaciones personalizadas.

1. _Firebase AI Logic_ proporciona una API segura del lado del cliente para los modelos de Google para construir aplicaciones de solo lado del cliente o aplicaciones móviles. Mejor para características de IA interactivas directamente en el navegador, como análisis de texto en tiempo real o chatbots básicos.

1. _Gemini API_ te permite construir una aplicación que use los métodos y funcionalidades expuestos a través de la superficie de la API directamente, mejor para aplicaciones full-stack. Adecuado para aplicaciones que necesitan control directo sobre modelos de IA, como generación de imágenes personalizadas o procesamiento profundo de datos.

### Construye aplicaciones potenciadas por IA con Genkit y Angular

[Genkit](https://genkit.dev) es un toolkit de código abierto diseñado para ayudarte a construir características potenciadas por IA en aplicaciones web y móviles. Ofrece una interfaz unificada para integrar modelos de IA de Google, OpenAI, Anthropic, Ollama y más, para que puedas explorar y elegir los mejores modelos para tus necesidades. Como solución del lado del servidor, tus aplicaciones web necesitan un entorno de servidor soportado, como un servidor basado en node para integrarse con Genkit. Construir una aplicación full-stack usando Angular SSR te da el código inicial del lado del servidor, por ejemplo.

Aquí hay ejemplos de cómo construir con Genkit y Angular:

- [Aplicaciones Agénticas con Genkit y Angular starter-kit](https://github.com/angular/examples/tree/main/genkit-angular-starter-kit) — ¿Nuevo construyendo con IA? Comienza aquí con una aplicación básica que presenta un flujo de trabajo agéntico. Lugar perfecto para comenzar tu primera experiencia de construcción con IA.

- [Usar Genkit en una aplicación Angular](https://genkit.dev/docs/angular/) — Construye una aplicación básica que usa Genkit Flows, Angular y Gemini 2.5 Flash. Este tutorial paso a paso te guía a través de la creación de una aplicación Angular full-stack con características de IA.

- [Aplicación de Generador de Historias Dinámico](https://github.com/angular/examples/tree/main/genkit-angular-story-generator) — Aprende a construir una aplicación Angular agéntica potenciada por Genkit, Gemini e Imagen 3 para generar dinámicamente una historia basada en la interacción del usuario con hermosos paneles de imagen para acompañar los eventos que ocurren. Comienza aquí si te gustaría experimentar con un caso de uso más avanzado.

  Este ejemplo también tiene un video tutorial en profundidad de la funcionalidad:
  - [Ver "Building Agentic Apps with Angular and Genkit live!"](https://youtube.com/live/mx7yZoIa2n4?feature=share)
  - [Ver "Building Agentic Apps with Angular and Genkit live! PT 2"](https://youtube.com/live/YR6LN5_o3B0?feature=share)

- [Construyendo aplicaciones agénticas con Firebase y Google Cloud (Ejemplo Barista)](https://developers.google.com/solutions/learn/agentic-barista) - Aprende cómo construir una aplicación agéntica de pedidos de café con Firebase y Google Cloud. Este ejemplo usa tanto Firebase AI Logic como Genkit.

- [Creando UIs Dinámicas Impulsadas por el Servidor](https://github.com/angular/examples/tree/main/dynamic-sdui-app) - Aprende a construir aplicaciones Angular agénticas con vistas de UI que se generan en tiempo de ejecución basadas en la entrada del usuario.

  Este ejemplo también tiene un video tutorial en profundidad de la funcionalidad:
  - [Ver "Exploring the future of web apps"](https://www.youtube.com/live/4qargCqOu70?feature=share)

### Construye aplicaciones potenciadas por IA con Firebase AI Logic y Angular

[Firebase AI Logic](https://firebase.google.com/products/vertex-ai-in-firebase) proporciona una forma segura de interactuar con la API de Vertex AI Gemini o la API de Imagen directamente desde tus aplicaciones web y móviles. Esto es atractivo para los desarrolladores de Angular ya que las aplicaciones pueden ser full-stack o de solo lado del cliente. Si estás desarrollando una aplicación de solo lado del cliente, Firebase AI Logic es una buena opción para incorporar IA en tus aplicaciones web.

Aquí hay un ejemplo de cómo construir con Firebase AI Logic y Angular:

- [Firebase AI Logic x Angular Starter Kit](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example) - Usa este starter-kit para construir una aplicación de e-commerce con un agente de chat que puede realizar tareas. Comienza aquí si no tienes experiencia construyendo con Firebase AI Logic y Angular.

  Este ejemplo incluye un [video tutorial en profundidad explicando la funcionalidad y demuestra cómo agregar nuevas características](https://youtube.com/live/4vfDz2al_BI).

### Construye aplicaciones potenciadas por IA con Gemini API y Angular

La [Gemini API](https://ai.google.dev/gemini-api/docs) proporciona acceso a modelos de última generación de Google que soportan entrada de audio, imágenes, video y texto. Estos modelos están optimizados para casos de uso específicos, [aprende más en el sitio de documentación de Gemini API](https://ai.google.dev/gemini-api/docs/models).

- [Plantilla de aplicación Angular de Editor de Texto con IA](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-text-editor) - Usa esta plantilla para comenzar con un editor de texto completamente funcional con características potenciadas por IA como refinar texto, expandir texto y formalizar texto. Este es un buen punto de partida para ganar experiencia llamando a la Gemini API vía HTTP.

- [Plantilla de aplicación de Chatbot con IA](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-chatbot) - Esta plantilla comienza con una interfaz de usuario de chatbot que se comunica con la Gemini API vía HTTP.

## Mejores Prácticas

### Conectarse a proveedores de modelos y mantener tus Credenciales de API Seguras
Cuando te conectas a proveedores de modelos, es importante mantener tus secretos de API seguros. *Nunca pongas tu clave de API en un archivo que se envía al cliente, como `environments.ts`*.

La arquitectura de tu aplicación determina qué APIs y herramientas de IA elegir. Específicamente, elige basándote en si tu aplicación es del lado del cliente o del lado del servidor. Herramientas como Firebase AI Logic proporcionan una conexión segura a las APIs de modelo para código del lado del cliente. Si quieres usar una API diferente a Firebase AI Logic o prefieres usar un proveedor de modelo diferente, considera crear un servidor proxy o incluso [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) para servir como proxy y no exponer tus claves de API.

Para un ejemplo de conexión usando una aplicación del lado del cliente, consulta el código: [repositorio de ejemplo de Firebase AI Logic Angular](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example).

Para conexiones del lado del servidor a APIs de modelo que requieren claves de API, prefiere usar un gestor de secretos o variable de entorno, no `environments.ts`. Deberías seguir las mejores prácticas estándar para asegurar claves de API y credenciales. Firebase ahora proporciona un nuevo gestor de secretos con las últimas actualizaciones de Firebase App Hosting. Para aprender más, [consulta la documentación oficial](https://firebase.google.com/docs/app-hosting/configure).

Para un ejemplo de conexión del lado del servidor en una aplicación full-stack, consulta el código: [repositorio de Angular AI Example (Genkit y Angular Story Generator)](https://github.com/angular/examples/tree/main/genkit-angular-story-generator).

### Usa Tool Calling para mejorar aplicaciones
Si quieres construir flujos de trabajo agénticos, donde los agentes pueden actuar y usar herramientas para resolver problemas basados en prompts, usa "tool calling". Tool calling, también conocido como function calling, es una forma de proporcionar a los LLMs la capacidad de hacer solicitudes de vuelta a la aplicación que lo llamó. Como desarrollador, defines qué herramientas están disponibles y tú tienes el control de cómo o cuándo se llaman las herramientas.

Tool calling mejora aún más tus aplicaciones web expandiendo tu integración de IA más allá de un chatbot de estilo pregunta y respuesta. De hecho, puedes empoderar tu modelo para solicitar llamadas a funciones usando la API de function calling de tu proveedor de modelo. Las herramientas disponibles pueden usarse para realizar acciones más complejas dentro del contexto de tu aplicación.

En el [ejemplo de e-commerce](https://github.com/angular/examples/blob/main/vertex-ai-firebase-angular-example/src/app/ai.service.ts#L88) del [repositorio de ejemplos de Angular](https://github.com/angular/examples), el LLM solicita hacer llamadas a funciones para inventario con el fin de obtener el contexto necesario para realizar tareas más complejas como calcular cuánto costará un grupo de artículos en la tienda. El alcance de la API disponible depende de ti como desarrollador, al igual que si llamar o no a una función solicitada por el LLM. Permaneces en control del flujo de ejecución. Puedes exponer funciones específicas de un servicio, por ejemplo, pero no todas las funciones de ese servicio.

### Manejo de respuestas no determinísticas

Debido a que los modelos pueden devolver resultados no determinísticos, tus aplicaciones deben diseñarse con eso en mente. Aquí hay algunas estrategias que puedes usar en la implementación de tu aplicación:

- Ajusta los prompts y parámetros del modelo (como [temperature](https://ai.google.dev/gemini-api/docs/prompting-strategies)) para respuestas más o menos determinísticas. Puedes [descubrir más en la sección de estrategias de prompting](https://ai.google.dev/gemini-api/docs/prompting-strategies) de [ai.google.dev](https://ai.google.dev/).
- Usa la estrategia "humano en el bucle" donde un humano verifica las salidas antes de proceder en un flujo de trabajo. Construye los flujos de trabajo de tu aplicación para permitir que operadores (humanos u otros modelos) verifiquen salidas y confirmen decisiones clave.
- Emplea tool calling (o function calling) y restricciones de esquema para guiar y restringir las respuestas del modelo a formatos predefinidos, aumentando la previsibilidad de respuestas.

Incluso considerando estas estrategias y técnicas, se deben incorporar alternativas sensatas en el diseño de tu aplicación. Sigue los estándares existentes de resiliencia de aplicación. Por ejemplo, no es aceptable que una aplicación falle si un recurso o API no está disponible. En ese escenario, se muestra un mensaje de error al usuario y, si es aplicable, también se muestran opciones para los siguientes pasos. Construir aplicaciones potenciadas por IA requiere la misma consideración. Confirma que la respuesta esté alineada con la salida esperada y proporciona un "aterrizaje seguro" en caso de que no esté alineada mediante [graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation). Esto también aplica a interrupciones de API de proveedores de LLM.

Considera este ejemplo: El proveedor de LLM no está respondiendo. Una estrategia potencial para manejar la interrupción es:

- Guardar la respuesta del usuario para usar en un escenario de reintento (ahora o en un momento posterior)
- Alertar al usuario sobre la interrupción con un mensaje apropiado que no revele información sensible
- Reanudar la conversación en un momento posterior una vez que los servicios estén disponibles nuevamente.

## Siguientes Pasos

Para aprender sobre prompts de LLM y configuración de IDE con IA, consulta las siguientes guías:

<docs-pill-row>
  <docs-pill href="ai/develop-with-ai" title="LLM prompts and IDE setup"/>
</docs-pill-row>
