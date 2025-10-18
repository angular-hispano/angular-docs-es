# Prompts de LLM y configuración de IDE con IA
Generar código con modelos de lenguaje grandes (LLMs) es un área de interés en rápido crecimiento para los desarrolladores. Aunque los LLMs a menudo son capaces de generar código funcional, puede ser un desafío generar código para frameworks en constante evolución como Angular.

Las instrucciones avanzadas y el prompting son un estándar emergente para soportar la generación de código moderna con detalles específicos del dominio. Esta sección contiene contenido y recursos curados para apoyar una generación de código más precisa para Angular y LLMs.

## Prompts Personalizados e Instrucciones del Sistema
Mejora tu experiencia generando código con LLMs usando uno de los siguientes archivos personalizados, específicos del dominio.

NOTA: Estos archivos se actualizarán regularmente manteniéndose al día con las convenciones de Angular.

Aquí hay un conjunto de instrucciones para ayudar a los LLMs a generar código correcto que sigue las mejores prácticas de Angular. Este archivo puede incluirse como instrucciones del sistema para tus herramientas de IA o incluirse junto con tu prompt como contexto.

<docs-code language="md" path="adev/src/context/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">Haz clic aquí para descargar el archivo best-practices.md.</a>

## Archivos de Reglas
Varios editores, como <a href="https://studio.firebase.google.com?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_firebase_studio">Firebase Studio</a> tienen archivos de reglas útiles para proporcionar contexto crítico a los LLMs.

| Entorno/IDE | Archivo de Reglas                                                      | Instrucciones de Instalación                                                                                              |
|:----------------|:----------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------|
| Firebase Studio | <a download href="/assets/context/airules.md" target="_blank">airules.md</a>    | <a href="https://firebase.google.com/docs/studio/set-up-gemini#custom-instructions">Configurar `airules.md`</a>         |
| IDEs potenciados por Copilot | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a>  | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configurar `.github/copilot-instructions.md`</a> |
| Cursor          | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a> | <a href="https://docs.cursor.com/context/rules" target="_blank">Configurar `cursorrules.md`</a>                         |
| IDEs de JetBrains  | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>  | <a href="https://www.jetbrains.com/help/junie/customize-guidelines.html" target="_blank">Configurar `guidelines.md`</a> |
| VS Code | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>  | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configurar `.instructions.md`</a> |
| Windsurf | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>  | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">Configurar `guidelines.md`</a> |

## Configuración del Servidor MCP de Angular CLI
Angular CLI incluye un [servidor de Model Context Protocol (MCP)](https://modelcontextprotocol.io/) experimental que permite a los asistentes de IA en tu entorno de desarrollo interactuar con Angular CLI.

[**Aprende cómo configurar el Servidor MCP de Angular CLI**](/ai/mcp)

## Proporcionando Contexto con `llms.txt`
`llms.txt` es un estándar propuesto para sitios web diseñado para ayudar a los LLMs a entender y procesar mejor su contenido. El equipo de Angular ha desarrollado dos versiones de este archivo para ayudar a los LLMs y herramientas que usan LLMs para generación de código a crear mejor código Angular moderno.


* <a href="/llms.txt" target="_blank">llms.txt</a> - un archivo índice que proporciona enlaces a archivos y recursos clave.
* <a href="/context/llm-files/llms-full.txt" target="_blank">llms-full.txt</a> - un conjunto compilado más robusto de recursos que describen cómo funciona Angular y cómo construir aplicaciones Angular.

Asegúrate de [consultar la página de visión general](/ai) para más información sobre cómo integrar IA en tus aplicaciones Angular.

## Web Codegen Scorer
El equipo de Angular desarrolló y publicó como código abierto el [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer), una herramienta para evaluar y puntuar la calidad del código web generado por IA. Puedes usar esta herramienta para tomar decisiones basadas en evidencia relacionadas con código generado por IA, como ajustar prompts para mejorar la precisión del código generado por LLM para Angular. Estos prompts pueden incluirse como instrucciones del sistema para tus herramientas de IA o como contexto con tu prompt. También puedes usar esta herramienta para comparar la calidad del código producido por diferentes modelos y monitorear la calidad a lo largo del tiempo a medida que los modelos y agentes evolucionan.

