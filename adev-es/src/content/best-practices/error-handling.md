# Errores no manejados en Angular

A medida que tu aplicación Angular se ejecuta, parte de tu código puede lanzar un error. Si no se maneja, estos errores pueden llevar a un comportamiento inesperado y una UI que no responde. Esta guía cubre cómo Angular maneja errores que no son atrapados explícitamente por el código de tu aplicación. Para orientación sobre escribir tu propia lógica de manejo de errores dentro de tu aplicación, consulta las mejores prácticas para el manejo de errores en JavaScript y Angular.

Un principio fundamental en la estrategia de manejo de errores de Angular es que los errores deben ser expuestos a los desarrolladores en el sitio de llamada siempre que sea posible. Este enfoque asegura que el código que inició una operación tenga el contexto necesario para entender el error, manejarlo apropiadamente, y decidir cuál debe ser el estado apropiado de la aplicación. Al hacer visibles los errores en su origen, los desarrolladores pueden implementar manejo de errores que sea específico para la operación fallida y tenga acceso a información relevante para la recuperación o para proporcionar retroalimentación informativa al usuario final. Esto también ayuda a evitar el smell de "Error demasiado general", donde los errores se reportan sin suficiente contexto para entender su causa.

Por ejemplo, considera un componente que obtiene datos de usuario desde una API. El código responsable de hacer la llamada a la API debe incluir manejo de errores (por ejemplo, usando un bloque `try...catch` o el operador `catchError` en RxJS) para gestionar potenciales problemas de red o errores devueltos por la API. Esto permite al componente mostrar un mensaje de error amigable para el usuario o reintentar la petición, en lugar de dejar que el error se propague sin manejar.

## Los errores no manejados son reportados al `ErrorHandler`

Angular reporta errores no manejados al [ErrorHandler](api/core/ErrorHandler) raíz de la aplicación. Al proporcionar un `ErrorHandler` personalizado, proporciónalo en tu `ApplicationConfig` como parte de la llamada a `bootstrapApplication`.

Al construir una aplicación Angular, a menudo escribes código que es llamado automáticamente _por_ el framework. Por ejemplo, Angular es responsable de llamar al constructor de un componente y a los métodos de ciclo de vida cuando ese componente aparece en una plantilla. Cuando el framework ejecuta tu código, no hay lugar donde puedas razonablemente agregar un bloque `try` para manejar errores con gracia. En situaciones como esta, Angular captura errores y los envía al `ErrorHandler`.

Angular _no_ captura errores dentro de APIs que son llamadas directamente por tu código. Por ejemplo, si tienes un servicio con un método que lanza un error y llamas a ese método en tu componente, Angular no capturará automáticamente ese error. Eres responsable de manejarlo usando mecanismos como `try...catch`.

Angular captura errores _asíncronos_ de promesas de usuario u observables solo cuando:

- Hay un contrato explícito para que Angular espere y use el resultado de la operación asíncrona, y
- Cuando los errores no se presentan en el valor de retorno o estado.

Por ejemplo, `AsyncPipe` y `PendingTasks.run` reenvían errores al `ErrorHandler`, mientras que `resource` presenta el error en las propiedades `status` y `error`.

Los errores que Angular reporta al `ErrorHandler` son errores _inesperados_. Estos errores pueden ser irrecuperables o una indicación de que el estado de la aplicación está corrupto. Las aplicaciones deben proporcionar manejo de errores usando bloques `try` u operadores apropiados de manejo de errores (como `catchError` en RxJS) donde ocurre el error siempre que sea posible en lugar de depender del `ErrorHandler`, que se usa con más frecuencia y apropiadamente solo como un mecanismo para reportar errores potencialmente fatales a la infraestructura de seguimiento de errores y logging.

```ts
export class GlobalErrorHandler implements ErrorHandler {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly router = inject(Router);

  handleError(error: any) {
    const url = this.router.url;
    const errorMessage = error?.message ?? 'unknown';

    this.analyticsService.trackEvent({
      eventName: 'exception',
      description: `Screen: ${url} | ${errorMessage}`,
    });

    console.error(GlobalErrorHandler.name, { error });
  }
}

```

### `TestBed` relanza errores por defecto

En muchos casos, `ErrorHandler` puede solo registrar errores y de otra manera permitir que la aplicación continúe ejecutándose. En pruebas, sin embargo, casi siempre quieres exponer estos errores. El `TestBed` de Angular relanza errores inesperados para asegurar que los errores capturados por el framework no puedan ser perdidos o ignorados sin intención. En circunstancias raras, una prueba puede intentar específicamente asegurar que los errores no causen que la aplicación no responda o se bloquee. En estas situaciones, puedes [configurar `TestBed` para _no_ relanzar errores de aplicación](api/core/testing/TestModuleMetadata#rethrowApplicationErrors) con `TestBed.configureTestingModule({rethrowApplicationErrors: false})`.

## Escuchadores globales de errores

Los errores que no son capturados ni por el código de la aplicación ni por la instancia de aplicación del framework pueden alcanzar el alcance global. Los errores que alcanzan el alcance global pueden tener consecuencias no deseadas si no se tienen en cuenta. En entornos que no son navegadores, pueden causar que el proceso se bloquee. En el navegador, estos errores pueden no ser reportados y los visitantes del sitio pueden ver los errores en la consola del navegador. Angular proporciona escuchadores globales para ambos entornos para tener en cuenta estos problemas.

### Renderización del lado del cliente

Agregar [`provideBrowserGlobalErrorListeners()`](/api/core/provideBrowserGlobalErrorListeners) al [ApplicationConfig](guide/di/defining-dependency-providers#application-bootstrap) agrega los escuchadores `'error'` y `'unhandledrejection'` a la ventana del navegador y reenvía esos errores al `ErrorHandler`. El CLI de Angular genera nuevas aplicaciones con este proveedor por defecto. El equipo de Angular recomienda manejar estos errores globales para la mayoría de las aplicaciones, ya sea con los escuchadores integrados del framework o con tus propios escuchadores personalizados. Si proporcionas escuchadores personalizados, puedes eliminar `provideBrowserGlobalErrorListeners`.

### Renderización del lado del servidor e híbrida

Al usar [Angular con SSR](guide/ssr), Angular agrega automáticamente los escuchadores `'unhandledRejection'` y `'uncaughtException'` al proceso del servidor. Estos manejadores previenen que el servidor se bloquee y en su lugar registran los errores capturados en la consola.

IMPORTANTE: Si la aplicación está usando Zone.js, solo se agrega el manejador `'unhandledRejection'`. Cuando Zone.js está presente, los errores dentro de la Zone de la aplicación ya son reenviados al `ErrorHandler` de la aplicación y no alcanzan el proceso del servidor.
