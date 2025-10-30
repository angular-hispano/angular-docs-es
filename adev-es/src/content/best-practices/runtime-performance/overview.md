# Optimización del rendimiento en tiempo de ejecución

La renderización rápida es crítica para Angular y hemos construido el framework con muchas optimizaciones en mente para ayudarte a desarrollar aplicaciones de alto rendimiento. Para entender mejor el rendimiento de tu aplicación, ofrecemos [Angular DevTools](tools/devtools) y una [guía en video](https://www.youtube.com/watch?v=FjyX_hkscII) sobre cómo usar Chrome DevTools para perfilado. En esta sección cubrimos las técnicas de optimización de rendimiento más comunes.

**Change detection** es el proceso a través del cual Angular verifica si el estado de tu aplicación ha cambiado, y si algún DOM necesita ser actualizado. A alto nivel, Angular recorre tus componentes de arriba hacia abajo, buscando cambios. Angular ejecuta su mecanismo de change detection periódicamente para que los cambios en el modelo de datos se reflejen en la vista de la aplicación. El change detection puede ser disparado manual o a través de un evento asíncrono (por ejemplo, una interacción del usuario o la finalización de un XMLHttpRequest).

El change detection está altamente optimizado y es eficiente, pero aún puede causar ralentizaciones si la aplicación lo ejecuta con demasiada frecuencia.

En esta guía, aprenderás cómo controlar y optimizar el mecanismo de change detection omitiendo partes de tu aplicación y ejecutando change detection solo cuando sea necesario.

Mira este video si prefieres aprender más sobre optimizaciones de rendimiento en formato multimedia:

<docs-video src="https://www.youtube.com/embed/f8sA-i6gkGQ"/>
