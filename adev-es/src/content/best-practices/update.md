# Manteniendo tus proyectos Angular actualizados

Al igual que la Web y todo el ecosistema web, Angular está mejorando continuamente.
Angular equilibra la mejora continua con un fuerte enfoque en la estabilidad y en hacer las actualizaciones directas.
Mantener tu aplicación Angular actualizada te permite aprovechar las nuevas funcionalidades de vanguardia, así como optimizaciones y correcciones de errores.

Este documento contiene información y recursos para ayudarte a mantener tus aplicaciones y bibliotecas Angular actualizadas.

Para información sobre nuestra política y prácticas de versionado —incluyendo prácticas de soporte y deprecación, así como el calendario de lanzamientos— consulta [Versionado y lanzamientos de Angular](reference/releases 'Versionado y lanzamientos de Angular').

ÚTIL: Si actualmente estás usando AngularJS, consulta [Actualizando desde AngularJS](https://angular.io/guide/upgrade 'Actualizando desde Angular JS').
_AngularJS_ es el nombre para todas las versiones v1.x de Angular.

## Recibiendo notificaciones de nuevos lanzamientos

Para recibir notificaciones cuando nuevos lanzamientos estén disponibles, sigue a [@angular](https://x.com/angular '@angular en X') en X (anteriormente Twitter) o suscríbete al [blog de Angular](https://blog.angular.dev 'Blog de Angular').

## Aprendiendo sobre nuevas funcionalidades

¿Qué hay de nuevo? ¿Qué ha cambiado? Compartimos las cosas más importantes que necesitas saber en el blog de Angular en [anuncios de lanzamiento](https://blog.angular.dev/ 'Blog de Angular - anuncios de lanzamiento').

Para revisar una lista completa de cambios, organizados por versión, consulta el [registro de cambios de Angular](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Registro de cambios de Angular').

## Verificando tu versión de Angular

Para verificar la versión de Angular de tu aplicación usa el comando `ng version` desde dentro del directorio de tu proyecto.

## Encontrando la versión actual de Angular

La versión estable más reciente lanzada de Angular aparece [en npm](https://www.npmjs.com/package/@angular/core 'Angular en npm') bajo "Version." Por ejemplo, `16.2.4`.

También puedes encontrar la versión más actual de Angular usando el comando CLI [`ng update`](cli/update).
Por defecto, [`ng update`](cli/update)(sin argumentos adicionales) lista las actualizaciones que están disponibles para ti.

## Actualizando tu entorno y aplicaciones

Para hacer la actualización sencilla, proporcionamos instrucciones completas en la [Guía de Actualización de Angular](update-guide) interactiva.

La Guía de Actualización de Angular proporciona instrucciones de actualización personalizadas, basadas en las versiones actuales y objetivo que especifiques.
Incluye rutas de actualización básicas y avanzadas, para coincidir con la complejidad de tus aplicaciones.
También incluye información de solución de problemas y cualquier cambio manual recomendado para ayudarte a aprovechar al máximo el nuevo lanzamiento.

Para actualizaciones simples, el comando CLI [`ng update`](cli/update) es todo lo que necesitas.
Sin argumentos adicionales, [`ng update`](cli/update) lista las actualizaciones que están disponibles para ti y proporciona pasos recomendados para actualizar tu aplicación a la versión más actual.

[Versionado y Lanzamientos de Angular](reference/releases#versioning 'Prácticas de Lanzamiento de Angular, Versionado') describe el nivel de cambio que puedes esperar basado en el número de versión de un lanzamiento.
También describe las rutas de actualización soportadas.

## Resumen de recursos

- Anuncios de lanzamiento:
    [Blog de Angular - anuncios de lanzamiento](https://blog.angular.dev/ 'Anuncios del blog de Angular sobre lanzamientos recientes')

- Detalles de lanzamiento:
    [Registro de cambios de Angular](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Registro de cambios de Angular')

- Instrucciones de actualización:
    [Guía de Actualización de Angular](update-guide)

- Referencia del comando de actualización:
    [Referencia del comando `ng update` de Angular CLI](cli/update)

- Prácticas de versionado, lanzamiento, soporte y deprecación:
    [Versionado y lanzamientos de Angular](reference/releases 'Versionado y lanzamientos de Angular')
