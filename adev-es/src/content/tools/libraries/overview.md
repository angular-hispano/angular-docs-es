# Visión general de las librerías de Angular

Muchas aplicaciones necesitan resolver los mismos problemas generales, como presentar una interfaz de usuario unificada, presentar datos y permitir la entrada de datos.
Los desarrolladores pueden crear soluciones generales para dominios particulares que pueden ser adaptadas para reutilización en diferentes aplicaciones.
Tales soluciones pueden construirse como _librerías_ de Angular y estas librerías pueden publicarse y compartirse como _paquetes npm_.

Una librería de Angular es un proyecto de Angular que difiere de una aplicación en que no puede ejecutarse por sí sola.
Una librería debe importarse y usarse en una aplicación.

Las librerías extienden las características base de Angular.
Por ejemplo, para agregar [formularios reactivos](guide/forms/reactive-forms) a una aplicación, agrega el paquete de la librería usando `ng add @angular/forms`, luego importa el `ReactiveFormsModule` desde la librería `@angular/forms` en el código de tu aplicación.
De manera similar, agregar la librería de [service worker](ecosystem/service-workers) a una aplicación de Angular es uno de los pasos para convertir una aplicación en una [Aplicación Web Progresiva](https://developers.google.com/web/progressive-web-apps) \(PWA\).
[Angular Material](https://material.angular.dev) es un ejemplo de una librería grande y de propósito general que proporciona componentes de interfaz de usuario sofisticados, reutilizables y adaptables.

Cualquier desarrollador de aplicaciones puede usar estas y otras librerías que han sido publicadas como paquetes npm por el equipo de Angular o por terceros.
Consulta [Usando librerías publicadas](tools/libraries/using-libraries).

ÚTIL: Las librerías están destinadas a ser usadas por aplicaciones de Angular. Para agregar características de Angular a aplicaciones web que no son Angular, usa [elementos personalizados de Angular](guide/elements).

## Creando librerías

Si has desarrollado características que son adecuadas para reutilización, puedes crear tus propias librerías.
Estas librerías pueden usarse localmente en tu espacio de trabajo, o puedes publicarlas como [paquetes npm](reference/configs/npm-packages) para compartirlas con otros proyectos u otros desarrolladores de Angular.
Estos paquetes pueden publicarse en el registro de npm, un registro privado de npm Enterprise, o un sistema privado de gestión de paquetes que soporte paquetes npm.
Consulta [Creando librerías](tools/libraries/creating-libraries).

Decidir empaquetar características como una librería es una decisión arquitectónica. Es comparable a decidir si una característica es un componente o un servicio, o decidir el alcance de un componente.

Empaquetar características como una librería fuerza a que los artefactos en la librería estén desacoplados de la lógica de negocio de la aplicación.
Esto puede ayudar a evitar varias malas prácticas o errores arquitectónicos que pueden dificultar el desacoplamiento y reutilización del código en el futuro.

Poner código en una librería separada es más complejo que simplemente poner todo en una aplicación.
Requiere más inversión en tiempo y reflexión para gestionar, mantener y actualizar la librería.
Esta complejidad puede valer la pena cuando la librería está siendo usada en múltiples aplicaciones.
