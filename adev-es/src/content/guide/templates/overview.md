<docs-decorative-header title="Sintaxis de plantillas" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
En Angular, una plantilla es un fragmento de HTML.
Usa sintaxis especial dentro de una plantilla para aprovechar muchas de las características de Angular.
</docs-decorative-header>

CONSEJO: Consulta los [Fundamentos](essentials/templates) de Angular antes de sumergirte en esta guía completa.

Cada componente de Angular tiene una **plantilla** que define el [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) que el componente renderiza en la página. Al usar plantillas, Angular es capaz de mantener automáticamente tu página actualizada a medida que los datos cambian.

Las plantillas generalmente se encuentran dentro de la propiedad `template` de un archivo `*.component.ts` o en el archivo `*.component.html`. Para aprender más, consulta la [guía detallada de componentes](/guide/components).

## ¿Cómo funcionan las plantillas?

Las plantillas están basadas en la sintaxis de [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), con características adicionales como funciones de plantilla integradas, enlace de datos, escucha de eventos, variables y más.

Angular compila las plantillas en JavaScript para construir una comprensión interna de tu aplicación. Uno de los beneficios de esto son las optimizaciones de renderización integradas que Angular aplica a tu aplicación automáticamente.

### Diferencias con HTML estándar

Algunas diferencias entre las plantillas y la sintaxis HTML estándar incluyen:

- Los comentarios en el código fuente de la plantilla no se incluyen en la salida renderizada
- Los elementos de componentes y directivas pueden cerrarse automáticamente (por ejemplo, `<UserProfile />`)
- Los atributos con ciertos caracteres (es decir, `[]`, `()`, etc.) tienen un significado especial para Angular. Consulta la [documentación de enlace](guide/templates/binding) y la [documentación de agregar event listeners](guide/templates/event-listeners) para más información.
- El carácter `@` tiene un significado especial para Angular para agregar comportamiento dinámico, como [control de flujo](guide/templates/control-flow), a las plantillas. Puedes incluir un carácter `@` literal escapándolo como un código de entidad HTML (`&commat;` o `&#64;`).
- Angular ignora y colapsa caracteres de espacios en blanco innecesarios. Consulta [espacios en blanco en plantillas](guide/templates/whitespace) para más detalles.
- Angular puede agregar nodos de comentarios a una página como marcadores de posición para contenido dinámico, pero los desarrolladores pueden ignorarlos.

Además, aunque la mayoría de la sintaxis HTML es sintaxis de plantilla válida, Angular no admite el elemento `<script>` en plantillas. Para más información, consulta la página de [Seguridad](best-practices/security).

## ¿Qué sigue?

También podrías estar interesado en lo siguiente:

| Temas                                                                                   | Detalles                                                              |
| :-------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| [Enlace de texto, propiedades y atributos dinámicos](guide/templates/binding)          | Vincula datos dinámicos a texto, propiedades y atributos.             |
| [Agregar event listeners](guide/templates/event-listeners)                     | Responde a eventos en tus plantillas.                                 |
| [Enlace bidireccional](guide/templates/two-way-binding)                                | Vincula un valor y propaga cambios simultáneamente.                   |
| [Control de flujo](guide/templates/control-flow)                                       | Muestra, oculta y repite elementos condicionalmente.                  |
| [Pipes](guide/templates/pipes)                                                          | Transforma datos de forma declarativa.                                |
| [Incrustar contenido hijo con ng-content](guide/templates/ng-content)                  | Controla cómo los componentes renderizan contenido.                   |
| [Crear fragmentos de plantilla con ng-template](guide/templates/ng-template)           | Declara un fragmento de plantilla.                                    |
| [Agrupar elementos con ng-container](guide/templates/ng-container)                     | Agrupa múltiples elementos juntos o marca una ubicación para renderizar. |
| [Variables en plantillas](guide/templates/variables)                                   | Aprende sobre declaraciones de variables.                            |
| [Carga diferida con @defer](guide/templates/defer)                                     | Crea vistas diferibles con `@defer`.                                  |
| [Sintaxis de expresiones](guide/templates/expression-syntax)                           | Aprende similitudes y diferencias entre expresiones de Angular y JavaScript estándar. |
| [Espacios en blanco en plantillas](guide/templates/whitespace)                         | Aprende cómo Angular maneja los espacios en blanco.                  |
