# Guía de estilo de código Angular

## Introducción

Esta guía cubre un rango de convenciones de estilo para código de aplicaciones Angular. Estas recomendaciones no son requeridas para que Angular funcione, sino que establecen un conjunto de prácticas de codificación que promueven la consistencia en el ecosistema Angular. Un conjunto consistente de prácticas hace más fácil compartir código y moverse entre proyectos.

Esta guía _no_ cubre TypeScript o prácticas generales de codificación no relacionadas con Angular. Para TypeScript, consulta la [guía de estilo TypeScript de Google](https://google.github.io/styleguide/tsguide.html).

### En caso de duda, prefiere la consistencia

Siempre que te encuentres con una situación en la que estas reglas contradigan el estilo de un archivo particular, prioriza mantener la consistencia dentro de un archivo. Mezclar diferentes convenciones de estilo en un solo archivo crea más confusión que divergir de las recomendaciones en esta guía.

## Nomenclatura

### Separa palabras en nombres de archivo con guiones

Separa palabras dentro de un nombre de archivo con guiones (`-`). Por ejemplo, un componente llamado `UserProfile` tiene un nombre de archivo `user-profile.ts`.

### Usa el mismo nombre para las pruebas de un archivo con `.spec` al final

Para pruebas unitarias, termina los nombres de archivo con `.spec.ts`. Por ejemplo, el archivo de prueba unitaria para el componente `UserProfile` tiene el nombre de archivo `user-profile.spec.ts`.

### Haz coincidir nombres de archivo con el identificador TypeScript dentro

Los nombres de archivo generalmente deben describir el contenido del código en el archivo. Cuando el archivo contiene una clase TypeScript, el nombre del archivo debe reflejar ese nombre de clase. Por ejemplo, un archivo que contiene un componente llamado `UserProfile` tiene el nombre `user-profile.ts`.

Si el archivo contiene más de un identificador nombrable principal, elige un nombre que describa el tema común del código dentro. Si el código en un archivo no encaja dentro de un tema común o área de funcionalidad, considera dividir el código en diferentes archivos. Evita nombres de archivo demasiado genéricos como `helpers.ts`, `utils.ts`, o `common.ts`.

### Usa el mismo nombre de archivo para el TypeScript, plantilla y estilos de un componente

Los componentes típicamente consisten en un archivo TypeScript, un archivo de plantilla y un archivo de estilo. Estos archivos deben compartir el mismo nombre con diferentes extensiones de archivo. Por ejemplo, un componente `UserProfile` puede tener los archivos `user-profile.ts`, `user-profile.html`, y `user-profile.css`.

Si un componente tiene más de un archivo de estilo, agrega al nombre palabras adicionales que describan los estilos específicos de ese archivo. Por ejemplo, `UserProfile` podría tener archivos de estilo `user-profile-settings.css` y `user-profile-subscription.css`.

## Estructura del proyecto

### Todo el código de la aplicación va en un directorio llamado `src`

Todo tu código UI de Angular (TypeScript, HTML, y estilos) debe vivir dentro de un directorio llamado `src`. El código que no está relacionado con la UI, como archivos de configuración o scripts, debe vivir fuera del directorio `src`.

Esto mantiene el directorio raíz de la aplicación consistente entre diferentes proyectos Angular y crea una separación clara entre el código UI y otro código en tu proyecto.

### Inicia tu aplicación en un archivo llamado `main.ts` directamente dentro de `src`

El código para iniciar, o hacer **bootstrap**, de una aplicación Angular debe siempre vivir en un archivo llamado `main.ts`. Esto representa el punto de entrada principal a la aplicación.

### Agrupa archivos estrechamente relacionados juntos en el mismo directorio

Los componentes de Angular consisten en un archivo TypeScript y, opcionalmente, una plantilla y uno o más archivos de estilo. Debes agrupar estos juntos en el mismo directorio.

Las pruebas unitarias deben vivir en el mismo directorio que el código bajo prueba. Evita recolectar pruebas no relacionadas en un solo directorio `tests`.

### Organiza tu proyecto por áreas de funcionalidad

Organiza tu proyecto en subdirectorios basados en las características de tu aplicación o temas comunes al código en esos directorios. Por ejemplo, la estructura del proyecto para un sitio de cine, MovieReel, podría verse así:

```
src/
├─ movie-reel/
│ ├─ show-times/
│ │ ├─ film-calendar/
│ │ ├─ film-details/
│ ├─ reserve-tickets/
│ │ ├─ payment-info/
│ │ ├─ purchase-confirmation/
```

Evita crear subdirectorios basados en el tipo de código que vive en esos directorios. Por ejemplo, evita crear directorios como `components`, `directives`, y `services`.

Evita poner tantos archivos en un directorio que se vuelva difícil de leer o navegar. A medida que el número de archivos en un directorio crece, considera dividir aún más en subdirectorios adicionales.

### Un concepto por archivo

Prefiere enfocar archivos fuente en un solo _concepto_. Para clases Angular específicamente, esto usualmente significa un componente, directiva, o servicio por archivo. Sin embargo, está bien si un archivo contiene más de un componente o directiva si tus clases son relativamente pequeñas y se vinculan juntas como parte de un solo concepto.

En caso de duda, ve con el enfoque que lleve a archivos más pequeños.

## Inyección de dependencias

### Prefiere la función `inject` sobre inyección de parámetros de constructor

Prefiere usar la función `inject` sobre inyectar parámetros de constructor. La función `inject` funciona de la misma manera que la inyección de parámetros de constructor, pero ofrece varias ventajas de estilo:

*   `inject` es generalmente más legible, especialmente cuando una clase inyecta muchas dependencias.
*   Es más directo sintácticamente agregar comentarios a dependencias inyectadas
*   `inject` ofrece mejor inferencia de tipos.
*   Al apuntar a ES2022+ con [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields), puedes evitar separar la declaración e inicialización de campos cuando los campos leen dependencias inyectadas.

[Puedes refactorizar código existente a `inject` con una herramienta automática](reference/migrations/inject-function).

## Componentes y directivas

### Eligiendo selectores de componentes

Consulta la [guía de Componentes para detalles sobre cómo elegir selectores de componentes](guide/components/selectors#choosing-a-selector).

### Nombrando miembros de componentes y directivas

Consulta la guía de Componentes para detalles sobre [nombrar propiedades de entrada](guide/components/inputs#choosing-input-names) y [nombrar propiedades de salida](guide/components/outputs#choosing-event-names).

### Eligiendo selectores de directivas

Las directivas deben usar el mismo [prefijo específico de aplicación](guide/components/selectors#selector-prefixes) que tus componentes.

Al usar un selector de atributo para una directiva, usa un nombre de atributo camelCase. Por ejemplo, si tu aplicación se llama "MovieReel" y construyes una directiva que agrega un tooltip a un elemento, podrías usar el selector `[mrTooltip]`.

### Agrupa propiedades específicas de Angular antes de los métodos

Los componentes y directivas deben agrupar las propiedades específicas de Angular juntas, típicamente cerca de la parte superior de la declaración de clase. Esto incluye dependencias inyectadas, entradas, salidas y consultas. Define estas y otras propiedades antes de los métodos de la clase.

Esta práctica hace más fácil encontrar las APIs de plantilla y dependencias de la clase.

### Mantén componentes y directivas enfocados en la presentación

El código dentro de tus componentes y directivas generalmente debe relacionarse con la UI mostrada en la página. Para código que tiene sentido por sí solo, desacoplado de la UI, prefiere refactorizar a otros archivos. Por ejemplo, puedes factorizar reglas de validación de formularios o transformaciones de datos en funciones o clases separadas.

### Evita lógica demasiado compleja en plantillas

Las plantillas de Angular están diseñadas para acomodar [expresiones similares a JavaScript](guide/templates/expression-syntax). Debes aprovechar estas expresiones para capturar lógica relativamente directa directamente en expresiones de plantilla.

Sin embargo, cuando el código en una plantilla se vuelve demasiado complejo, refactoriza la lógica al código TypeScript (típicamente con un [computed](guide/signals#computed-signals)).

No hay una regla única y rápida que determine qué constituye "complejo". Usa tu mejor juicio.

### Usa `protected` en miembros de clase que solo son usados por la plantilla de un componente

Los miembros públicos de la clase de un componente intrínsecamente definen una API pública que es accesible vía inyección de dependencias y [consultas](guide/components/queries). Prefiere acceso `protected` para cualquier miembro que esté destinado a ser leído desde la plantilla del componente.

```ts
@Component({
  ...,
  template: `<p>{{ fullName() }}</p>`,
})
export class UserProfile {
  firstName = input();
  lastName = input();

// `fullName` no es parte de la API pública del componente, pero se usa en la plantilla.
  protected fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### Usa `readonly` para propiedades que no deben cambiar

Marca propiedades de componentes y directivas inicializadas por Angular como `readonly`. Esto incluye propiedades inicializadas por `input`, `model`, `output`, y consultas. El modificador de acceso readonly asegura que el valor establecido por Angular no sea sobrescrito.

```ts
@Component({/* ... */})
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();
}
```

Para componentes y directivas que usan las APIs basadas en decoradores `@Input`, `@Output`, y consultas, este consejo aplica a propiedades de salida y consultas, pero no a propiedades de entrada.

```ts
@Component({/* ... */})
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### Prefiere `class` y `style` sobre `ngClass` y `ngStyle`

Prefiere enlaces `class` y `style` sobre usar las directivas [`NgClass`](/api/common/NgClass) y [`NgStyle`](/api/common/NgStyle).

```html
<!-- PREFERIR -->
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
<!-- O -->
<div [class]="{admin: isAdmin, dense: density === 'high'}">


<!-- EVITAR -->
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
```

Tanto los enlaces `class` como `style` usan una sintaxis más directa que se alinea estrechamente con los atributos HTML estándar. Esto hace tus plantillas más fáciles de leer y entender, especialmente para desarrolladores familiarizados con HTML básico.

Adicionalmente, las directivas `NgClass` y `NgStyle` incurren en un costo de rendimiento adicional comparado con la sintaxis integrada de enlace `class` y `style`.

Para más detalles, consulta la [guía de enlaces](/guide/templates/binding#css-class-and-style-property-bindings)

### Nombra manejadores de eventos por lo que _hacen_, no por el evento disparador

Prefiere nombrar manejadores de eventos por la acción que realizan en lugar de por el evento disparador:

```html
<!-- PREFERIR -->
<button (click)="saveUserData()">Save</button>

<!-- EVITAR -->
<button (click)="handleClick()">Save</button>
```

Usar nombres significativos como este hace más fácil saber qué hace un evento al leer la plantilla.

Para eventos de teclado, puedes usar los modificadores de eventos de tecla de Angular con nombres de manejadores específicos:

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

A veces, la lógica de manejo de eventos es especialmente larga o compleja, haciendo impráctico declarar un solo manejador bien nombrado. En estos casos, está bien volver a un nombre como 'handleKeydown' y luego delegar a comportamientos más específicos basados en los detalles del evento:

```ts

@Component({/* ... */})
class RichText {
  handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'B') {
        this.activateBold();
      } else if (event.key === 'I') {
        this.activateItalic();
      }
// ...
    }
  }
}
```

### Mantén métodos de ciclo de vida simples

Evita poner lógica larga o compleja dentro de hooks de ciclo de vida como `ngOnInit`. En su lugar, prefiere crear métodos bien nombrados para contener esa lógica y luego _llamar esos métodos_ en tus hooks de ciclo de vida. Los nombres de hooks de ciclo de vida describen _cuándo_ se ejecutan, lo que significa que el código dentro no tiene un nombre significativo que describa qué está haciendo el código dentro.

```typescript
// PREFERIR
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}

// EVITAR
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...y todo el resto del código que se desplegaría de estos métodos.
}
```

### Usa interfaces de hooks de ciclo de vida

Angular proporciona una interfaz TypeScript para cada método de ciclo de vida. Al agregar un hook de ciclo de vida a tu clase, importa e `implementa` estas interfaces para asegurar que los métodos estén nombrados correctamente.

```ts
import {Component, OnInit} from '@angular/core';

@Component({/* ... */})
export class UserProfile implements OnInit {

  // La interfaz `OnInit` asegura que este método esté nombrado correctamente.
  ngOnInit() { /* ... */ }
}
```
