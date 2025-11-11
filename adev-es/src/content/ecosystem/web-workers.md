# Procesamiento en segundo plano con web workers

Los [web workers](https://developer.mozilla.org/es/docs/Web/API/Web_Workers_API) te permiten ejecutar cálculos con uso intensivo de CPU en un hilo en segundo plano, liberando el hilo principal para actualizar la interfaz de usuario.
Las aplicaciones que realizan muchos cálculos, como generar dibujos de diseño asistido por computadora (CAD) o llevar a cabo operaciones geométricas complejas, pueden usar web workers para aumentar el rendimiento.

ÚTIL: Angular CLI no permite ejecutarse a sí mismo dentro de un web worker.

## Agregar un web worker

Para agregar un web worker a un proyecto existente, usa el comando `ng generate` de Angular CLI.

<docs-code language="shell">

ng generate web-worker <location>

</docs-code>

Puedes agregar un web worker en cualquier parte de tu aplicación.
Por ejemplo, para agregar un web worker al componente raíz, `src/app/app.component.ts`, ejecuta el siguiente comando.

<docs-code language="shell">

ng generate web-worker app

</docs-code>

El comando realiza las siguientes acciones.

1. Configura tu proyecto para usar web workers, si aún no lo estaba.
1. Agrega el siguiente código base en `src/app/app.worker.ts` para recibir mensajes.

    <docs-code language="typescript" header="src/app/app.worker.ts">

    addEventListener('message', ({ data }) => {
      const response = `worker response to ${data}`;
      postMessage(response);
    });

    </docs-code>

1. Agrega el siguiente siguiente código base en `src/app/app.component.ts` para usar el worker.

    <docs-code language="typescript" header="src/app/app.component.ts">

    if (typeof Worker !== 'undefined') {
      // Crear uno nuevo
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web workers no están soportados en este entorno.
      // Debes agregar un plan alternativo para que tu programa siga funcionando correctamente.
    }

    </docs-code>

Después de crear este siguiente código base, debes refactorizar tu código para usar el web worker enviando y recibiendo mensajes.

IMPORTANTE: Algunos entornos o plataformas, como `@angular/platform-server` utilizado en el [renderizado del lado del servidor](guide/ssr), no soportan web workers.

Para asegurarte de que tu aplicación funcione en estos entornos, debes proporcionar un mecanismo alternativo para realizar los cálculos que, de otro modo, ejecutaría el worker.
