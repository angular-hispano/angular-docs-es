# Pipeline de compilación personalizada

Al compilar una aplicación Angular, recomendamos enfáticamente usar Angular CLI para aprovechar su funcionalidad de actualizaciones dependientes de la estructura y la abstracción del sistema de compilación. De esta manera, tus proyectos se benefician de las mejoras más recientes en seguridad, rendimiento y APIs, además de obtener mejoras de compilación transparentes.

Esta página explora los **casos de uso poco comunes** en los que necesitas un pipeline de compilación personalizado que no utiliza Angular CLI. Todas las herramientas listadas a continuación son plugins de compilación de código abierto mantenidos por miembros de la comunidad de Angular. Para conocer más sobre su modelo de soporte y estado de mantenimiento, revisa su documentación y las URL de sus repositorios en GitHub.

## ¿Cuándo deberías usar un pipeline de compilación personalizado?

Existen algunos casos muy específicos en los que podrías querer mantener un pipeline de compilación personalizado. Por ejemplo:

* Tienes una aplicación existente que utiliza una herramienta diferente y quieres agregar Angular
* Estás fuertemente acoplado a [module federation](https://module-federation.io/) y no puedes adoptar la [native federation](https://www.npmjs.com/package/@angular-architects/native-federation) independiente del empaquetador
* Quieres crear un experimento de corta duración usando tu herramienta de compilación favorita

## ¿Cuáles son las opciones?

Actualmente, existen dos herramientas comunitarias bien soportadas que te permiten crear un pipeline de compilación personalizado mediante un [plugin de Vite](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) y un [plugin de Rspack](https://www.npmjs.com/package/@nx/angular-rspack). Ambos utilizan las abstracciones subyacentes que impulsan Angular CLI. Te permiten crear un pipeline de compilación flexible, pero requieren mantenimiento manual y no proporcionan una experiencia de actualización automática.

### Rspack

Rspack es un empaquetador basado en Rust que busca ofrecer compatibilidad con el ecosistema de plugins de webpack.

Si tu proyecto está fuertemente acoplado al ecosistema de webpack y depende en gran medida de una configuración personalizada de webpack, puedes aprovechar Rspack para mejorar los tiempos de compilación.

Puedes obtener más información sobre Angular Rspack en el [sitio de documentación](https://nx.dev/recipes/angular/rspack/introduction) del proyecto.

### Vite

Vite es una herramienta de compilación frontend que busca ofrecer una experiencia de desarrollo más rápida y liviana para proyectos web modernos. Además, Vite es extensible gracias a su sistema de plugins, que permite a distintos ecosistemas construir integraciones con Vite, como Vitest para pruebas unitarias y en el navegador, Storybook para crear componentes de forma aislada y más. Angular CLI también usa Vite como su servidor de desarrollo.

El [plugin de Vite para Angular de AnalogJS](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) habilita la adopción de Angular en un proyecto o framework que usa Vite o se construye sobre Vite. Esto puede implicar desarrollar y compilar un proyecto Angular directamente con Vite, o agregar Angular a un proyecto o pipeline existente. Un ejemplo es integrar componentes de UI de Angular en un sitio de documentación usando [Astro y Starlight](https://analogjs.org/docs/packages/astro-angular/overview).

Puedes aprender más sobre AnalogJS y cómo usar el plugin en su [página de documentación](https://analogjs.org/docs/packages/vite-plugin-angular/overview).
