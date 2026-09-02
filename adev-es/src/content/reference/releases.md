# Versionado y lanzamientos de Angular

Reconocemos que necesitas estabilidad del framework Angular.
La estabilidad garantiza que los componentes y bibliotecas reutilizables, los tutoriales, las herramientas y las prácticas aprendidas no queden obsoletos de forma inesperada.
La estabilidad es esencial para que el ecosistema alrededor de Angular prospere.

También compartimos contigo la necesidad de que Angular siga evolucionando.
Nos esforzamos por garantizar que la base sobre la que construyes mejore continuamente y te permita mantenerte al día con el resto del ecosistema web y con las necesidades de tus usuarios.

Este documento contiene las prácticas que seguimos para ofrecerte una plataforma de desarrollo de aplicaciones de vanguardia, equilibrada con estabilidad.
Nos esforzamos por garantizar que los cambios futuros siempre se introduzcan de forma predecible.
Queremos que todos los que dependen de Angular sepan cuándo y cómo se agregan nuevas funcionalidades, y que estén bien preparados cuando se eliminen las obsoletas.

A veces los _cambios disruptivos_ (breaking changes), como la eliminación de APIs o funcionalidades, son necesarios para innovar y mantenerse al día con las mejores prácticas en evolución, los cambios en las dependencias o los cambios en la plataforma web. Estos cambios disruptivos pasan por un proceso de deprecación explicado en nuestra [política de deprecación](#deprecation-policy).

Para que estas transiciones sean lo más sencillas posible, el equipo de Angular asume estos compromisos:

- Trabajamos arduamente para minimizar la cantidad de cambios disruptivos y para proporcionar herramientas de migración cuando sea posible
- Seguimos la política de deprecación descrita aquí, para que tengas tiempo de actualizar tus aplicaciones a las APIs y mejores prácticas más recientes

HELPFUL: Las prácticas descritas en este documento aplican a Angular 2.0 y versiones posteriores.
Si actualmente usas AngularJS, consulta [Actualizar desde AngularJS](https://angular.io/guide/upgrade 'Actualizar desde AngularJS').
_AngularJS_ es el nombre de todas las versiones v1.x de Angular.

## Versionado de Angular {#angular-versioning}

Los números de versión de Angular indican el nivel de cambios que introduce el lanzamiento.
Este uso del [versionado semántico](https://semver.org/ 'Especificación de Versionado Semántico') te ayuda a entender el impacto potencial de actualizar a una nueva versión.

Los números de versión de Angular tienen tres partes: `major.minor.patch`.
Por ejemplo, la versión 7.2.11 indica la versión mayor 7, la versión menor 2 y el nivel de parche 11.

El número de versión se incrementa según el nivel de cambio incluido en el lanzamiento.

| Nivel de cambio    | Detalles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lanzamiento mayor  | Contiene nuevas funcionalidades significativas; se espera cierta asistencia mínima del desarrollador durante la actualización. Al actualizar a un nuevo lanzamiento mayor, es posible que necesites ejecutar scripts de actualización, refactorizar código, ejecutar pruebas adicionales y aprender nuevas APIs.                                                                                                                                                                                      |
| Lanzamiento menor  | Contiene nuevas funcionalidades más pequeñas. Los lanzamientos menores son totalmente compatibles con versiones anteriores; no se espera asistencia del desarrollador durante la actualización, pero opcionalmente puedes modificar tus aplicaciones y bibliotecas para empezar a usar las nuevas APIs, funcionalidades y capacidades que se agregaron en el lanzamiento. Actualizamos las dependencias peer en las versiones menores ampliando las versiones soportadas, pero no exigimos que los proyectos actualicen estas dependencias. |
| Lanzamiento de parche | Lanzamiento de bajo riesgo con correcciones de errores. No se espera asistencia del desarrollador durante la actualización.                                                                                                                                                                                                                                                                                                                                                                         |

HELPFUL: A partir de la versión 7 de Angular, las versiones mayores del núcleo de Angular y del CLI están alineadas.
Esto significa que, para usar el CLI mientras desarrollas una aplicación Angular, la versión de `@angular/core` y la del CLI deben ser la misma.

### Lanzamientos preliminares {#preview-releases}

Te permitimos ver de antemano lo que viene proporcionando prelanzamientos "Next" y Release Candidates \(`rc`\) para cada lanzamiento mayor y menor:

| Tipo de prelanzamiento | Detalles                                                                                                                                                                                              |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next                   | El lanzamiento que está en desarrollo y pruebas activas. El siguiente lanzamiento se indica con una etiqueta de lanzamiento a la que se añade el identificador `-next`, como `8.1.0-next.0`.          |
| Release candidate      | Un lanzamiento con todas sus funcionalidades completas y en fase final de pruebas. Un release candidate se indica con una etiqueta de lanzamiento a la que se añade el identificador `-rc`, como la versión `8.1.0-rc.0`. |

La versión `next` o `rc` más reciente de la documentación está disponible en [next.angular.dev](https://next.angular.dev).

## Frecuencia de lanzamientos {#release-frequency}

Trabajamos para mantener un calendario regular de lanzamientos, de modo que puedas planificar y coordinar tus actualizaciones con la evolución continua de Angular.

HELPFUL: Las fechas se ofrecen como guía general y están sujetas a cambios.

En general, espera el siguiente ciclo de lanzamientos:

- Un lanzamiento mayor cada 12 meses
- De 4 a 6 lanzamientos menores por cada lanzamiento mayor
- Un lanzamiento de parche y una compilación de prelanzamiento \(`next` o `rc`\) casi cada semana

Esta cadencia de lanzamientos da a los desarrolladores más entusiastas acceso a las nuevas funcionalidades tan pronto como están completamente desarrolladas y superan nuestros procesos de revisión de código y pruebas de integración, a la vez que mantiene la estabilidad y confiabilidad de la plataforma para los usuarios en producción que prefieren recibir las funcionalidades después de que hayan sido validadas por Google y por otros desarrolladores que usan las compilaciones de prelanzamiento.

HELPFUL: Hasta Angular v22, Angular tenía un ciclo de lanzamientos mayores de 6 meses, con 1 a 3 lanzamientos menores por cada lanzamiento mayor

## Política y calendario de soporte {#support-policy-and-schedule}

HELPFUL: Las fechas aproximadas se ofrecen como guía general y están sujetas a cambios.

### Calendario de lanzamientos {#release-schedule}

| Versión | Fecha                    |
| :------ | :----------------------- |
| v22.1   | Semana del 2026-07-27    |
| v22.2   | ~ Septiembre de 2026     |
| v22.3   | ~ Noviembre de 2026      |
| v22.4   | ~ Enero de 2027          |
| v22.5   | ~ Marzo de 2027          |
| v23.0   | ~ Junio de 2027          |

### Ventana de soporte {#support-window}

Todos los lanzamientos mayores suelen tener soporte durante 24 meses.

| Etapa de soporte       | Duración del soporte | Detalles                                                                          |
| :--------------------- | :------------------- | :-------------------------------------------------------------------------------- |
| Activo                 | 12 meses             | Se publican actualizaciones y parches programados regularmente                    |
| Largo plazo \(LTS\)    | 12 meses             | Solo se publican [correcciones críticas y parches de seguridad](#lts-fixes) |

### Versiones con soporte activo {#actively-supported-versions}

La siguiente tabla muestra el estado de las versiones de Angular que tienen soporte.

| Versión | Estado | Lanzada    | Fin de activo | Fin de LTS |
| :------ | :----- | :--------- | :------------ | :--------- |
| ^22.0.0 | Activo | 2026-06-03 | 2027-06       | 2028-06    |
| ^21.0.0 | LTS    | 2025-11-19 | 2026-06-03    | 2027-06    |
| ^20.0.0 | LTS    | 2025-05-28 | 2025-11-19    | 2026-11-28 |

Las versiones de Angular de la v2 a la v19 ya no tienen soporte.

### Correcciones LTS {#lts-fixes}

Como regla general, una corrección se considera para una versión LTS si resuelve uno de estos casos:

- Una vulnerabilidad de seguridad recién identificada,
- Una regresión, desde el inicio del LTS, causada por un cambio de terceros, como una nueva versión de un navegador.

## Política de deprecación {#deprecation-policy}

Cuando el equipo de Angular tiene la intención de eliminar una API o funcionalidad, se marca como _deprecada_. Esto ocurre cuando una API queda obsoleta, es reemplazada por otra API o se descontinúa por otro motivo. Las APIs deprecadas siguen disponibles durante su fase de deprecación, que dura como mínimo una versión mayor (aproximadamente un año).

Para ayudar a garantizar que tengas tiempo suficiente y un camino claro para actualizar, esta es nuestra política de deprecación:

| Etapas de deprecación  | Detalles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anuncio                | Anunciamos las APIs y funcionalidades deprecadas en el [registro de cambios](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Registro de cambios de Angular'). Las APIs deprecadas aparecen en la [documentación](api?status=8) ~~tachadas~~. Cuando anunciamos una deprecación, también anunciamos una ruta de actualización recomendada. Además, todas las APIs deprecadas están anotadas con `@deprecated` en la documentación correspondiente, lo que permite a los editores de texto e IDEs mostrar avisos si tu proyecto depende de ellas. |
| Periodo de deprecación | Cuando una API o funcionalidad se deprecia, sigue presente al menos en el siguiente lanzamiento mayor (un periodo de al menos 12 meses). Después de eso, las APIs y funcionalidades deprecadas son candidatas a eliminación. Una deprecación puede anunciarse en cualquier lanzamiento, pero la eliminación de una API o funcionalidad deprecada solo ocurre en un lanzamiento mayor. Hasta que una API o funcionalidad deprecada se elimina, se mantiene de acuerdo con la política de soporte LTS, lo que significa que solo se corrigen problemas críticos y de seguridad. |
| Dependencias npm       | Solo hacemos actualizaciones de dependencias npm que requieran cambios en tus aplicaciones en un lanzamiento mayor. En los lanzamientos menores, actualizamos las dependencias peer ampliando las versiones soportadas, pero no exigimos que los proyectos actualicen estas dependencias hasta una versión mayor futura. Esto significa que, durante los lanzamientos menores de Angular, las actualizaciones de dependencias npm dentro de las aplicaciones y bibliotecas Angular son opcionales.                                              |

## Política de compatibilidad {#compatibility-policy}

Angular es una colección de muchos paquetes, subproyectos y herramientas.
Para evitar el uso accidental de APIs privadas y para que puedas entender claramente qué está cubierto por las prácticas descritas aquí, documentamos qué se considera y qué no se considera nuestra superficie de API pública.
Para más detalles, consulta [Superficie de API pública soportada de Angular](https://github.com/angular/angular/blob/main/contributing-docs/public-api-surface.md 'Superficie de API pública soportada de Angular').

Para garantizar la compatibilidad con versiones anteriores de Angular, ejecutamos una serie de comprobaciones antes de fusionar cualquier cambio:

- Pruebas unitarias y pruebas de integración
- Comparación de las definiciones de tipos de la superficie de API pública antes y después del cambio
- Ejecución de las pruebas de todas las aplicaciones de Google que dependen de Angular

Cualquier cambio en la superficie de API pública se realiza de acuerdo con las políticas de versionado, soporte y deprecación descritas anteriormente. En casos excepcionales, como parches de seguridad críticos, las correcciones pueden introducir cambios incompatibles con versiones anteriores. Estos casos excepcionales van acompañados de un aviso explícito en los canales de comunicación oficiales del framework.

## Política de cambios disruptivos y rutas de actualización {#breaking-change-policy-and-update-paths}

Un cambio disruptivo te exige trabajo porque el estado posterior no es compatible con el estado anterior. Puedes encontrar las raras excepciones a esta regla en la [Política de compatibilidad](#compatibility-policy). Ejemplos de cambios disruptivos son la eliminación de APIs públicas u otros cambios en las definiciones de tipos de Angular, cambios en el momento en que se realizan las llamadas, o la actualización a una nueva versión de una dependencia de Angular que a su vez incluye cambios disruptivos.

Para apoyarte en caso de cambios disruptivos en Angular:

- Seguimos nuestra [política de deprecación](#deprecation-policy) antes de eliminar una API pública
- Ofrecemos automatización de la actualización mediante el comando `ng update`. Proporciona transformaciones de código que a menudo hemos probado de antemano en cientos de miles de proyectos de Google
- Instrucciones paso a paso sobre cómo actualizar de una versión mayor a otra en la ["Guía de actualización de Angular"](update-guide)

Puedes usar `ng update` para pasar a cualquier versión de Angular, siempre que se cumplan los siguientes criterios:

- La versión _a la que_ quieres actualizar tiene soporte.
- La versión _desde la que_ quieres actualizar está a no más de una versión mayor de distancia de la versión a la que
  quieres actualizar.

Por ejemplo, puedes actualizar de la versión 11 a la versión 12, siempre que la versión 12 todavía tenga soporte.
Si quieres actualizar a través de varias versiones mayores, realiza cada actualización de una versión mayor a la vez.
Por ejemplo, para actualizar de la versión 10 a la versión 12:

1. Actualiza de la versión 10 a la versión 11.
1. Actualiza de la versión 11 a la versión 12.

## Developer Preview

Ocasionalmente introducimos nuevas APIs bajo la etiqueta de "Developer Preview". Son APIs totalmente funcionales y pulidas, pero que aún no estamos listos para estabilizar bajo nuestra política de deprecación habitual.

Esto puede deberse a que queremos recopilar comentarios de aplicaciones reales antes de la estabilización, o a que la documentación asociada o las herramientas de migración no están completamente terminadas. Los comentarios se pueden enviar mediante un [issue de GitHub](https://github.com/angular/angular/issues), donde los desarrolladores pueden compartir sus experiencias, reportar errores o sugerir mejoras para ayudar a refinar la funcionalidad.

Las políticas y prácticas descritas en este documento no aplican a las APIs marcadas como Developer Preview. Estas APIs pueden cambiar en cualquier momento, incluso en nuevas versiones de parche del framework. Cada equipo debe decidir por sí mismo si los beneficios de usar APIs en Developer Preview compensan el riesgo de cambios disruptivos fuera de nuestro uso habitual del versionado semántico.

## Experimental

Estas APIs podrían no llegar a ser estables nunca o sufrir cambios significativos antes de estabilizarse.

Las políticas y prácticas descritas en este documento no aplican a las APIs marcadas como experimentales. Estas APIs pueden cambiar en cualquier momento, incluso en nuevas versiones de parche del framework. Cada equipo debe decidir por sí mismo si los beneficios de usar APIs experimentales compensan el riesgo de cambios disruptivos fuera de nuestro uso habitual del versionado semántico.
