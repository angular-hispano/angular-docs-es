# Agent Skills

Las Agent Skills son instrucciones y capacidades especializadas, específicas de un dominio, diseñadas para agentes de IA como Gemini CLI. Estas skills proporcionan guía arquitectónica, generan código Angular idiomático y ayudan a hacer scaffolding de nuevos proyectos usando las mejores prácticas modernas.

Al usar Agent Skills, puedes asegurarte de que el agente de IA con el que trabajas tenga la información más actualizada sobre las convenciones de Angular, los modelos de reactividad (como Signals) y la estructura de proyectos.

## Skills disponibles {#available-skills}

El equipo de Angular mantiene una colección de skills oficiales que se actualizan regularmente para mantenerse sincronizadas con las últimas mejoras del framework.

| Skill                   | Descripción                                                                                                                                                                                                                                                                                                                 |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`angular-developer`** | Genera código Angular y proporciona guía arquitectónica. Útil para crear componentes, servicios, u obtener mejores prácticas sobre reactividad (signals, linkedSignal, resource), formularios, inyección de dependencias, enrutamiento, SSR, accesibilidad (ARIA), animaciones, estilos, pruebas o herramientas de CLI. |
| **`angular-new-app`**   | Crea una nueva aplicación Angular usando Angular CLI. Proporciona pautas importantes para configurar y estructurar eficazmente una aplicación Angular moderna.                                                                                                                                                              |

## Usar Agent Skills {#using-agent-skills}

Las Agent Skills están diseñadas para usarse con herramientas de programación agénticas como [Gemini CLI](https://geminicli.com/docs/cli/skills/), [Antigravity](https://antigravity.google/docs/skills) y más. Activar una skill carga las instrucciones y recursos específicos necesarios para esa tarea.

Para usar estas skills en tu propio entorno, puedes seguir las instrucciones de tu herramienta específica o usar una herramienta de la comunidad como [skills.sh](https://skills.sh/).

```bash
npx skills add https://github.com/angular/skills
```
