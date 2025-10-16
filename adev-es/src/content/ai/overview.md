<!-- TODO: need an Angular + AI logo -->
<docs-decorative-header title="Construir con IA" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
Construye aplicaciones con IA. Desarrolla más rápido con IA.
</docs-decorative-header>

ÚTIL: ¿Buscas comenzar a construir en tu IDE favorito con IA? <br>Consulta nuestras [reglas de prompts y mejores prácticas](/ai/develop-with-ai).

La Inteligencia Artificial Generativa (GenAI) con modelos de lenguaje extenso (LLMs) permite la creación de experiencias de aplicación sofisticadas y atractivas, incluyendo contenido personalizado, recomendaciones inteligentes, generación y comprensión de medios, resúmenes de información y funcionalidad dinámica.

Desarrollar características como estas habría requerido previamente una experiencia profunda en el dominio y un esfuerzo de ingeniería significativo. Sin embargo, nuevos productos y SDKs están reduciendo la barrera de entrada. Angular es ideal para integrar IA en tu aplicación web como resultado de:

* Las robustas APIs de plantillas de Angular permiten la creación de interfaces de usuario dinámicas y claramente compuestas a partir de contenido generado
* Arquitectura sólida basada en señales diseñada para gestionar dinámicamente datos y estado
* Angular se integra perfectamente con SDKs y APIs de IA

Esta guía demuestra cómo puedes usar [Genkit](/ai#build-ai-powered-applications-with-genkit-and-angular), [Firebase AI Logic](/ai#build-ai-powered-applications-with-firebase-ai-logic-and-angular) y la [API de Gemini](/ai#build-ai-powered-applications-with-gemini-api-and-angular) para infundir tus aplicaciones Angular con IA hoy. Esta guía te ayudará a comenzar tu viaje de desarrollo de aplicaciones web con IA explicando cómo empezar a integrar IA en aplicaciones Angular. Esta guía también comparte recursos, como kits de inicio, ejemplo de código y recetas para flujos de trabajo comunes, que puedes usar para ponerte al día rápidamente.

Para comenzar, debes tener una comprensión básica de Angular. ¿Nuevo en Angular? Prueba nuestra [guía de fundamentos](/essentials) o nuestros [tutoriales de inicio](/tutorials).

NOTA: Si bien esta página presenta integraciones y ejemplos con productos de IA de Google, herramientas como Genkit son agnósticas del modelo y te permiten elegir tu propio modelo. En muchos casos, los ejemplos y las muestras de código son aplicables a otras soluciones de terceros.

## Comenzando
Construir aplicaciones con IA es un campo nuevo y en rápido desarrollo. Puede ser desafiante decidir por dónde empezar y qué tecnologías elegir. La siguiente sección proporciona tres opciones para elegir:

1. *Genkit* te da la opción de [modelo compatible e interfaz con una API unificada](https://genkit.dev) para construir aplicaciones full-stack. Ideal para aplicaciones que requieren lógica de IA sofisticada en el backend, como recomendaciones personalizadas.

1. *Firebase AI Logic* proporciona una API segura del lado del cliente para los modelos de Google para construir aplicaciones solo del lado del cliente o aplicaciones móviles. Mejor para características de IA interactivas directamente en el navegador, como análisis de texto en tiempo real o chatbots básicos.

1. *Gemini API* te permite construir una aplicación que usa los métodos y funcionalidad expuestos a través de la superficie de la API directamente, mejor para aplicaciones full-stack. Adecuada para aplicaciones que necesitan control directo sobre modelos de IA, como generación de imágenes personalizadas o procesamiento profundo de datos.

### Construye aplicaciones impulsadas por IA con Genkit y Angular
[Genkit](https://genkit.dev) es un kit de herramientas de código abierto diseñado para ayudarte a construir características con IA en aplicaciones web y móviles. Ofrece una interfaz unificada para integrar modelos de IA de Google, OpenAI, Anthropic, Ollama y más, para que puedas explorar y elegir los mejores modelos para tus necesidades. Como solución del lado del servidor, tus aplicaciones web necesitan un entorno de servidor compatible, como un servidor basado en node para integrarse con Genkit. Construir una aplicación full-stack usando Angular SSR te proporciona el código inicial del lado del servidor, por ejemplo.

Aquí hay ejemplos de cómo construir con Genkit y Angular:

* [Kit de inicio de Aplicaciones Agénticas con Genkit y Angular](https://github.com/angular/examples/tree/main/genkit-angular-starter-kit)— ¿Nuevo en la construcción con IA? Comienza aquí con una aplicación básica que presenta un flujo de trabajo agéntico. Lugar perfecto para comenzar tu primera experiencia de construcción con IA.

* [Usa Genkit en una aplicación Angular](https://genkit.dev/docs/angular/)— Construye una aplicación básica que usa Genkit Flows, Angular y Gemini 2.5 Flash. Este tutorial paso a paso te guía a través de la creación de una aplicación Angular full-stack con características de IA.

* [Aplicación de Generador de Historias Dinámico](https://github.com/angular/examples/tree/main/genkit-angular-story-generator)— Aprende a construir una aplicación Angular agéntica con Genkit, Gemini e Imagen 3 para generar dinámicamente una historia basada en la interacción del usuario con hermosos paneles de imágenes que acompañan los eventos que ocurren. Comienza aquí si deseas experimentar con un caso de uso más avanzado.

  Este ejemplo también tiene un tutorial en video detallado de la funcionalidad:
    * [Ver "Building Agentic Apps with Angular and Genkit live!"](https://youtube.com/live/mx7yZoIa2n4?feature=share)
    * [Ver "Building Agentic Apps with Angular and Genkit live! PT 2"](https://youtube.com/live/YR6LN5_o3B0?feature=share)

* [Construyendo aplicaciones agénticas con Firebase y Google Cloud (Ejemplo Barista)](https://developers.google.com/solutions/learn/agentic-barista) - Aprende cómo construir una aplicación agéntica para ordenar café con Firebase y Google Cloud. Este ejemplo usa tanto Firebase AI Logic como Genkit.

### Construye aplicaciones con IA con Firebase AI Logic y Angular
[Firebase AI Logic](https://firebase.google.com/products/vertex-ai-in-firebase) proporciona una forma segura de interactuar con Vertex AI Gemini API o Imagen API directamente desde tus aplicaciones web y móviles. Esto es atractivo para los desarrolladores de Angular ya que las aplicaciones pueden ser full-stack o solo del lado del cliente. Si estás desarrollando una aplicación solo del lado del cliente, Firebase AI Logic es una buena opción para incorporar IA en tus aplicaciones web.

Aquí hay un ejemplo de cómo construir con Firebase AI Logic y Angular:
* [Kit de inicio Firebase AI Logic x Angular](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example) - Usa este kit de inicio para construir una aplicación de comercio electrónico con un agente de chat que puede realizar tareas. Comienza aquí si no tienes experiencia construyendo con Firebase AI Logic y Angular.

  Este ejemplo incluye un [tutorial en video detallado que explica la funcionalidad y demuestra cómo agregar nuevas características](https://youtube.com/live/4vfDz2al_BI).

### Construye aplicaciones con IA con Gemini API y Angular
La [API de Gemini](https://ai.google.dev/gemini-api/docs) proporciona acceso a modelos de última generación de Google que soportan audio, imágenes, video y entrada de texto. Estos modelos están optimizados para casos de uso específicos, [aprende más en el sitio de documentación de la API de Gemini](https://ai.google.dev/gemini-api/docs/models).

* [Plantilla de aplicación Angular de Editor de Texto con IA](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-text-editor) - Usa esta plantilla para comenzar con un editor de texto completamente funcional con características impulsadas por IA como refinar texto, expandir texto y formalizar texto. Este es un buen punto de partida para ganar experiencia llamando a la API de Gemini vía HTTP.

* [Plantilla de aplicación Chatbot con IA](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-chatbot) - Esta plantilla comienza con una interfaz de usuario de chatbot que se comunica con la API de Gemini vía HTTP.

## Mejores Prácticas
### Conectarse a proveedores de modelos y mantener tus credenciales API seguras
Al conectarse a proveedores de modelos, es importante mantener tus secretos de API seguros. *Nunca pongas tu clave API en un archivo que se envíe al cliente, como `environments.ts`*.

La arquitectura de tu aplicación determina qué APIs y herramientas de IA elegir. Específicamente, elige en función de si tu aplicación es del lado del cliente o del lado del servidor. Herramientas como Firebase AI Logic proporcionan una conexión segura a las APIs de modelos para código del lado del cliente. Si deseas usar una API diferente a Firebase AI Logic o prefieres usar un proveedor de modelo diferente, considera crear un servidor proxy o incluso [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) para servir como proxy y no exponer tus claves API.

Para un ejemplo de conexión usando una aplicación del lado del cliente, consulta el código: [repositorio de ejemplo Firebase AI Logic Angular](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example).

Para conexiones del lado del servidor a APIs de modelos que requieren claves API, prefiere usar un administrador de secretos o variable de entorno, no `environments.ts`. Debes seguir las mejores prácticas estándar para asegurar claves API y credenciales. Firebase ahora proporciona un nuevo administrador de secretos con las últimas actualizaciones de Firebase App Hosting. Para aprender más, [consulta la documentación oficial](https://firebase.google.com/docs/app-hosting/configure).

Para un ejemplo de conexión del lado del servidor en una aplicación full-stack, consulta el código: [repositorio Angular AI Example (Genkit and Angular Story Generator)](https://github.com/angular/examples/tree/main/genkit-angular-story-generator).

### Usa la llamada a herramientas para mejorar aplicaciones
Si deseas construir flujos de trabajo agénticos, donde los agentes pueden actuar y usar herramientas para resolver problemas basados en prompts, usa "llamada a herramientas" (tool calling). La llamada a herramientas, también conocido como llamada a función (function calling), es una forma de proporcionar a los LLMs la capacidad de hacer solicitudes de vuelta a la aplicación que lo llamó. Como desarrollador, defines qué herramientas están disponibles y tienes el control de cómo o cuándo se llaman las herramientas.

La llamada a herramientas mejora aún más tus aplicaciones web expandiendo tu integración de IA más allá de un chatbot de estilo pregunta y respuesta. De hecho, puedes empoderar a tu modelo para solicitar llamadas a funciones usando la API de llamada de funciones de tu proveedor de modelos. Las herramientas disponibles se pueden usar para realizar acciones más complejas dentro del contexto de tu aplicación.

En el [ejemplo de comercio electrónico](https://github.com/angular/examples/blob/main/vertex-ai-firebase-angular-example/src/app/ai.service.ts#L88) del [repositorio de ejemplos de Angular](https://github.com/angular/examples), el LLM solicita hacer llamadas a funciones para el inventario con el fin de obtener el contexto necesario para realizar tareas más complejas, como calcular cuánto costará un grupo de artículos en la tienda. El alcance de la API disponible depende de ti como desarrollador, al igual que si llamar o no una función solicitada por el LLM. Mantienes el control del flujo de ejecución. Puedes exponer funciones específicas de un servicio, por ejemplo, pero no todas las funciones de ese servicio.

### Manejo de respuestas no determinísticas
Debido a que los modelos pueden devolver resultados no determinísticos, tus aplicaciones deben diseñarse con eso en mente. Aquí hay algunas estrategias que puedes usar en la implementación de tu aplicación:
* Ajusta los prompts y parámetros del modelo (como [temperature](https://ai.google.dev/gemini-api/docs/prompting-strategies)) para respuestas más o menos determinísticas. Puedes [obtener más información en la sección de estrategias de prompting](https://ai.google.dev/gemini-api/docs/prompting-strategies) de [ai.google.dev](https://ai.google.dev/).
* Usa la estrategia "humano en el bucle" donde un humano verifica las salidas antes de proceder en un flujo de trabajo. Construye los flujos de trabajo de tu aplicación para permitir que los operadores (humanos u otros modelos) verifiquen las salidas y confirmen decisiones clave.
* Emplea la llamada a herramientas (o funciones) y restricciones de esquema para guiar y restringir las respuestas del modelo a formatos predefinidos, aumentando la previsibilidad de las respuestas.

Incluso considerando estas estrategias y técnicas, deben incorporarse respaldos sensatos en el diseño de tu aplicación. Sigue los estándares existentes de resiliencia de aplicaciones. Por ejemplo, no es aceptable que una aplicación falle si un recurso o API no está disponible. En ese escenario, se muestra un mensaje de error al usuario y, si es aplicable, también se muestran opciones para los próximos pasos. Construir aplicaciones con IA requiere la misma consideración. Confirma que la respuesta esté alineada con la salida esperada y proporciona un "aterrizaje seguro" en caso de que no esté alineada mediante [degradación elegante](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation). Esto también se aplica a interrupciones de API para proveedores de LLM.

Considera este ejemplo: El proveedor de LLM no está respondiendo. Una estrategia potencial para manejar la interrupción es:
* Guardar la respuesta del usuario para usar en un escenario de reintento (ahora o más tarde)
* Alertar al usuario sobre la interrupción con un mensaje apropiado que no revele información sensible
* Reanudar la conversación más tarde una vez que los servicios estén disponibles nuevamente.

## Próximos pasos

Para aprender sobre prompts de LLM y configuración de IDE con IA, consulta las siguientes guías:

<docs-pill-row>
  <docs-pill href="ai/develop-with-ai" title="Prompts de LLM y configuración de IDE"/>
</docs-pill-row>
