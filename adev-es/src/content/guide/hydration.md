# Hidratación

## ¿Qué es la hidratación?

La hidratación es el proceso que restaura la aplicación renderizada en el servidor en el cliente. Esto incluye cosas como la reutilización de las estructuras del DOM renderizadas en el servidor, la persistencia del estado de la aplicación, la transferencia de datos de la aplicación que ya fueron recuperados por el servidor, y otros procesos.

## ¿Por qué es importante la hidratación?

La hidratación mejora el rendimiento de la aplicación al evitar trabajo adicional para recrear nodos del DOM. En su lugar, Angular intenta hacer coincidir los elementos del DOM existentes con la estructura de la aplicación en tiempo de ejecución y reutiliza los nodos del DOM cuando es posible. Esto resulta en una mejora del rendimiento que puede medirse usando estadísticas de [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/), como la reducción del First Input Delay ([FID](https://web.dev/fid/)) y el Largest Contentful Paint ([LCP](https://web.dev/lcp/)), así como el Cumulative Layout Shift ([CLS](https://web.dev/cls/)). Mejorar estos números también afecta aspectos como el rendimiento de SEO.

Sin la hidratación habilitada, las aplicaciones Angular con renderización en el servidor destruirán y volverán a renderizar el DOM de la aplicación, lo que puede resultar en un parpadeo visible en la UI. Esta re-renderización puede afectar negativamente a los [Core Web Vitals](https://web.dev/learn-core-web-vitals/) como el [LCP](https://web.dev/lcp/) y causar un desplazamiento del diseño. Habilitar la hidratación permite reutilizar el DOM existente y previene el parpadeo.

## ¿Cómo se habilita la hidratación en Angular?

La hidratación solo puede habilitarse para aplicaciones con renderización en el servidor (SSR). Sigue la [Guía de Angular SSR](guide/ssr) para habilitar la renderización en el servidor primero.

### Usando Angular CLI

Si has utilizado Angular CLI para habilitar SSR (ya sea habilitándolo durante la creación de la aplicación o posteriormente mediante `ng add @angular/ssr`), el código que habilita la hidratación ya debería estar incluido en tu aplicación.

### Configuración manual

Si tienes una configuración personalizada y no usaste Angular CLI para habilitar SSR, puedes habilitar la hidratación manualmente visitando tu componente o módulo principal de la aplicación e importando `provideClientHydration` desde `@angular/platform-browser`. Luego agregarás ese proveedor a la lista de proveedores de bootstrap de tu aplicación.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```

Alternativamente, si estás usando NgModules, agregarías `provideClientHydration` a la lista de proveedores de tu módulo raíz de la aplicación.

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANTE: Asegúrate de que la llamada a `provideClientHydration()` también esté incluida en un conjunto de proveedores que se use para hacer el bootstrap de la aplicación en el **servidor**. En aplicaciones con la estructura de proyecto predeterminada (generada por el comando `ng new`), agregar una llamada al `AppModule` raíz debería ser suficiente, ya que este módulo es importado por el módulo del servidor. Si usas una configuración personalizada, agrega la llamada a `provideClientHydration()` a la lista de proveedores en la configuración de bootstrap del servidor.

### Verificar que la hidratación está habilitada

Después de haber configurado la hidratación y haber iniciado tu servidor, carga tu aplicación en el navegador.

ÚTIL: Probablemente necesitarás corregir instancias de Manipulación Directa del DOM antes de que la hidratación funcione completamente, ya sea cambiando a construcciones de Angular o usando `ngSkipHydration`. Consulta [Restricciones](#restricciones), [Manipulación Directa del DOM](#manipulación-directa-del-dom) y [Cómo omitir la hidratación para componentes específicos](#cómo-omitir-la-hidratación-para-componentes-específicos) para más detalles.

Al ejecutar una aplicación en modo de desarrollo, puedes confirmar que la hidratación está habilitada abriendo las Herramientas para Desarrolladores en tu navegador y viendo la consola. Deberías ver un mensaje que incluye estadísticas relacionadas con la hidratación, como el número de componentes y nodos hidratados. Angular calcula las estadísticas basándose en todos los componentes renderizados en una página, incluyendo los que provienen de bibliotecas de terceros.

También puedes usar la [extensión de navegador Angular DevTools](tools/devtools) para ver el estado de hidratación de los componentes en una página. Angular DevTools también permite habilitar una superposición para indicar qué partes de la página fueron hidratadas. Si hay un error de discrepancia de hidratación, DevTools también resaltará el componente que causó el error.

## Captura y reproducción de eventos

Cuando una aplicación se renderiza en el servidor, es visible en el navegador tan pronto como se carga el HTML producido. Los usuarios pueden asumir que pueden interactuar con la página, pero los escuchadores de eventos no se adjuntan hasta que la hidratación se completa. A partir de v18, puedes habilitar la característica de Reproducción de Eventos que permite capturar todos los eventos que ocurren antes de la hidratación y reproducir esos eventos una vez que la hidratación se ha completado. Puedes habilitarla usando la función `withEventReplay()`, por ejemplo:

```typescript
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
```

### Cómo funciona la reproducción de eventos

La Reproducción de Eventos es una característica que mejora la experiencia del usuario al capturar los eventos del usuario que se activaron antes de que el proceso de hidratación se complete. Luego esos eventos se reproducen, garantizando que ninguna de esas interacciones se pierda.

La Reproducción de Eventos se divide en tres fases principales:

- **Captura de interacciones del usuario**<br>
  Antes de la **Hidratación**, la Reproducción de Eventos captura y almacena todas las interacciones que el usuario puede realizar, como clics y otros eventos nativos del navegador.

- **Almacenamiento de eventos**<br>
  El **Event Contract** mantiene en memoria todas las interacciones registradas en el paso anterior, asegurando que no se pierdan para su posterior reproducción.

- **Relanzamiento de eventos**<br>
  Una vez que la **Hidratación** se completa, Angular re-invoca los eventos capturados.

La reproducción de eventos soporta _eventos nativos del navegador_, por ejemplo `click`, `mouseover` y `focusin`. Si deseas aprender más sobre JSAction, la biblioteca que impulsa la reproducción de eventos, puedes leer más [en el readme](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch#readme).

---

Esta característica garantiza una experiencia de usuario consistente, evitando que las acciones del usuario realizadas antes de la Hidratación sean ignoradas. NOTA: si tienes la [hidratación incremental](guide/incremental-hydration) habilitada, la reproducción de eventos se habilita automáticamente bajo el capó.

## Restricciones

La hidratación impone algunas restricciones en tu aplicación que no están presentes sin la hidratación habilitada. Tu aplicación debe tener la misma estructura de DOM generada tanto en el servidor como en el cliente. El proceso de hidratación espera que el árbol del DOM tenga la misma estructura en ambos lugares. Esto también incluye espacios en blanco y nodos de comentario que Angular produce durante la renderización en el servidor. Esos espacios en blanco y nodos deben estar presentes en el HTML generado por el proceso de renderización en el servidor.

IMPORTANTE: El HTML producido por la operación de renderización en el servidor **no debe** ser alterado entre el servidor y el cliente.

Si hay una discrepancia entre las estructuras del árbol del DOM del servidor y del cliente, el proceso de hidratación encontrará problemas al intentar hacer coincidir lo que se esperaba con lo que realmente está presente en el DOM. Los componentes que realizan manipulación directa del DOM usando APIs nativas del DOM son la causa más común.

### Manipulación Directa del DOM

Si tienes componentes que manipulan el DOM usando APIs nativas del DOM o usan `innerHTML` u `outerHTML`, el proceso de hidratación encontrará errores. Los casos específicos donde la manipulación del DOM es un problema son situaciones como acceder al `document`, consultar elementos específicos e inyectar nodos adicionales usando `appendChild`. Desconectar nodos del DOM y moverlos a otras ubicaciones también resultará en errores.

Esto se debe a que Angular desconoce estos cambios en el DOM y no puede resolverlos durante el proceso de hidratación. Angular esperará una cierta estructura, pero encontrará una estructura diferente al intentar hidratar. Esta discrepancia resultará en un fallo de hidratación y lanzará un error de discrepancia del DOM ([ver abajo](#errores)).

Lo mejor es refactorizar tu componente para evitar este tipo de manipulación del DOM. Intenta usar las APIs de Angular para realizar este trabajo, si puedes. Si no puedes refactorizar este comportamiento, usa el atributo `ngSkipHydration` ([descrito abajo](#cómo-omitir-la-hidratación-para-componentes-específicos)) hasta que puedas refactorizar hacia una solución compatible con la hidratación.

### Estructura HTML válida

Hay algunos casos donde si tienes una plantilla de componente que no tiene estructura HTML válida, esto podría resultar en un error de discrepancia del DOM durante la hidratación.

Como ejemplo, aquí están algunos de los casos más comunes de este problema.

- `<table>` sin un `<tbody>`
- `<div>` dentro de un `<p>`
- `<a>` dentro de otro `<a>`

Si no estás seguro de si tu HTML es válido, puedes usar un [validador de sintaxis](https://validator.w3.org/) para verificarlo.

NOTA: Aunque el estándar HTML no requiere el elemento `<tbody>` dentro de las tablas, los navegadores modernos crean automáticamente un elemento `<tbody>` en tablas que no lo declaran. Debido a esta inconsistencia, siempre declara explícitamente un elemento `<tbody>` en las tablas para evitar errores de hidratación.

### Configuración de Preservación de Espacios en Blanco

Cuando se usa la característica de hidratación, recomendamos usar la configuración predeterminada de `false` para `preserveWhitespaces`. Si esta configuración no está en tu tsconfig, el valor será `false` y no se requieren cambios. Si eliges habilitar la preservación de espacios en blanco agregando `preserveWhitespaces: true` a tu tsconfig, es posible que encuentres problemas con la hidratación. Esta no es todavía una configuración completamente soportada.

ÚTIL: Asegúrate de que esta configuración esté establecida **de forma consistente** en `tsconfig.server.json` para tu servidor y en `tsconfig.app.json` para tus compilaciones del navegador. Un valor inconsistente causará que la hidratación falle.

Si eliges establecer esta configuración en tu tsconfig, recomendamos establecerla solo en `tsconfig.app.json`, de la cual `tsconfig.server.json` la heredará de forma predeterminada.

### Zone.js personalizado o Noop aún no son compatibles

La hidratación depende de una señal de Zone.js cuando se vuelve estable dentro de una aplicación, para que Angular pueda iniciar el proceso de serialización en el servidor o la limpieza post-hidratación en el cliente para eliminar los nodos del DOM que permanecieron sin reclamar.

Proporcionar una implementación personalizada o "noop" de Zone.js puede llevar a un tiempo diferente para el evento "stable", activando así la serialización o la limpieza demasiado pronto o demasiado tarde. Esta no es todavía una configuración completamente soportada y puede que necesites ajustar el tiempo del evento `onStable` en la implementación personalizada de Zone.js.

## Errores

Hay varios errores relacionados con la hidratación que puedes encontrar, desde discrepancias de nodos hasta casos donde `ngSkipHydration` fue usado en un nodo host inválido. El caso de error más común que puede ocurrir se debe a la manipulación directa del DOM usando APIs nativas, lo que resulta en que la hidratación no puede encontrar o hacer coincidir la estructura del árbol del DOM esperada en el cliente que fue renderizada por el servidor. El otro caso donde puedes encontrar este tipo de error fue mencionado en la sección [Estructura HTML válida](#estructura-html-válida) anterior. Por lo tanto, asegúrate de que el HTML en tus plantillas use estructura válida y evitarás ese caso de error.

Para una referencia completa de los errores relacionados con la hidratación, visita la [Guía de Referencia de Errores](/errors).

## Cómo omitir la hidratación para componentes específicos

Algunos componentes pueden no funcionar correctamente con la hidratación habilitada debido a algunos de los problemas mencionados anteriormente, como la [Manipulación Directa del DOM](#manipulación-directa-del-dom). Como solución alternativa, puedes agregar el atributo `ngSkipHydration` a la etiqueta de un componente para omitir la hidratación del componente completo.

```angular-html
<app-example ngSkipHydration />
```

Alternativamente, puedes establecer `ngSkipHydration` como un host binding.

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```

El atributo `ngSkipHydration` forzará a Angular a omitir la hidratación del componente completo y sus hijos. Usar este atributo significa que el componente se comportará como si la hidratación no estuviera habilitada, lo que significa que se destruirá y volverá a renderizarse.

ÚTIL: Esto solucionará los problemas de renderización, pero significa que para este componente (y sus hijos), no obtienes los beneficios de la hidratación. Necesitarás ajustar la implementación de tu componente para evitar patrones que rompan la hidratación (es decir, la Manipulación Directa del DOM) para poder eliminar la anotación de omisión de hidratación.

El atributo `ngSkipHydration` solo puede usarse en nodos host de componentes. Angular lanza un error si este atributo se agrega a otros nodos.

Ten en cuenta que agregar el atributo `ngSkipHydration` a tu componente raíz de la aplicación deshabilitaría efectivamente la hidratación para toda tu aplicación. Sé cuidadoso y reflexivo al usar este atributo. Está pensado como una solución alternativa de último recurso. Los componentes que rompen la hidratación deben considerarse errores que necesitan ser corregidos.

## Tiempo de Hidratación y Estabilidad de la Aplicación

La estabilidad de la aplicación es una parte importante del proceso de hidratación. La hidratación y cualquier proceso post-hidratación solo ocurren una vez que la aplicación ha reportado estabilidad. Hay varias formas en que la estabilidad puede retrasarse. Los ejemplos incluyen la configuración de timeouts e intervalos, promesas sin resolver y microtareas pendientes. En esos casos, puedes encontrar el error [La aplicación permanece inestable](errors/NG0506), que indica que tu aplicación no ha alcanzado el estado estable después de 10 segundos. Si descubres que tu aplicación no se está hidratando de inmediato, examina qué está afectando la estabilidad de la aplicación y refactoriza para evitar causar estos retrasos.

## I18N

ÚTIL: De forma predeterminada, Angular omitirá la hidratación para los componentes que usan bloques i18n, efectivamente re-renderizando esos componentes desde cero.

Para habilitar la hidratación para bloques i18n, puedes agregar [`withI18nSupport`](/api/platform-browser/withI18nSupport) a tu llamada a `provideClientHydration`.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withI18nSupport())]
});
```

## Renderización consistente entre el servidor y el cliente

Evita introducir bloques `@if` y otros condicionales que muestren contenido diferente al renderizar en el servidor en comparación con el cliente, como usar un bloque `@if` con la función `isPlatformBrowser` de Angular. Estas diferencias de renderización causan desplazamientos del diseño, afectando negativamente la experiencia del usuario final y los core web vitals.

## Bibliotecas de Terceros con Manipulación del DOM

Hay varias bibliotecas de terceros que dependen de la manipulación del DOM para poder renderizar. Los gráficos D3 son un ejemplo claro. Estas bibliotecas funcionaban sin hidratación, pero pueden causar errores de discrepancia del DOM cuando la hidratación está habilitada. Por ahora, si encuentras errores de discrepancia del DOM usando una de estas bibliotecas, puedes agregar el atributo `ngSkipHydration` al componente que renderiza usando esa biblioteca.

## Scripts de Terceros con Manipulación del DOM

Muchos scripts de terceros, como rastreadores de anuncios y análisis, modifican el DOM antes de que la hidratación pueda ocurrir. Estos scripts pueden causar errores de hidratación porque la página ya no coincide con la estructura esperada por Angular. Prefiere diferir este tipo de script hasta después de la hidratación siempre que sea posible. Considera usar [`AfterNextRender`](api/core/afterNextRender) para retrasar el script hasta que los procesos post-hidratación hayan ocurrido.

## Hidratación Incremental

La hidratación incremental es una forma avanzada de hidratación que permite un control más granular sobre cuándo ocurre la hidratación. Consulta la [guía de hidratación incremental](guide/incremental-hydration) para más información.
