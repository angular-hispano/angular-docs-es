# Aceptando datos con propiedades de input

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee esa primero si eres nuevo en Angular.

CONSEJO: Si estás familiarizado con otros frameworks web, las propiedades de input son similares a _props_.

Cuando usas un componente, comúnmente quieres pasarle algunos datos. Un componente especifica los datos que acepta declarando
**inputs**:

```ts {highlight:[5]}
import {Component, input} from '@angular/core';

@Component({/*...*/})
export class CustomSlider {
  // Declara un input llamado 'value' con un valor predeterminado de cero.
  value = input(0);
}
```

Esto te permite enlazar a la propiedad en una plantilla:

```angular-html
<custom-slider [value]="50" />
```

Si un input tiene un valor predeterminado, TypeScript infiere el tipo del valor predeterminado:

```ts
@Component({/*...*/})
export class CustomSlider {
  // TypeScript infiere que este input es un número, devolviendo InputSignal<number>.
  value = input(0);
}
```

Puedes declarar explícitamente un tipo para el input especificando un parámetro genérico a la función.

Si un input sin un valor predeterminado no se establece, su valor es `undefined`:

```ts
@Component({/*...*/})
export class CustomSlider {
  // Produce un InputSignal<number | undefined> porque `value` puede no estar establecido.
  value = input<number>();
}
```

**Angular registra los inputs estáticamente en tiempo de compilación**. Los inputs no se pueden agregar o eliminar en tiempo de ejecución.

La función `input` tiene un significado especial para el compilador de Angular. **Solo puedes llamar a `input` en inicializadores de propiedades de componentes y directivas.**

Al extender una clase de componente, **los inputs son heredados por la clase hija.**

**Los nombres de input distinguen entre mayúsculas y minúsculas.**

## Leer inputs

La función `input` devuelve un `InputSignal`. Puedes leer el valor llamando a la signal:

```ts {highlight:[5]}
import {Component, input, computed} from '@angular/core';

@Component({/*...*/})
export class CustomSlider {
  // Declara un input llamado 'value' con un valor predeterminado de cero.
  value = input(0);

  // Crea una expresión computed que lee el input value
  label = computed(() => `El valor del slider es ${this.value()}`);
}
```

Las signals creadas por la función `input` son de solo lectura.

## Inputs requeridos

Puedes declarar que un input es `required` llamando a `input.required` en lugar de `input`:

```ts {highlight:[3]}
@Component({/*...*/})
export class CustomSlider {
  // Declara un input requerido llamado value. Devuelve un `InputSignal<number>`.
  value = input.required<number>();
}
```

Angular exige que los inputs requeridos _deben_ establecerse cuando el componente se usa en una plantilla. Si intentas usar un componente sin especificar todos sus inputs requeridos, Angular reporta un error en tiempo de compilación.

Los inputs requeridos no incluyen automáticamente `undefined` en el parámetro genérico del `InputSignal` devuelto.

## Configurar inputs

La función `input` acepta un objeto de configuración como segundo parámetro que te permite cambiar la forma en que funciona el input.

### Transformaciones de input

Puedes especificar una función `transform` para cambiar el valor de un input cuando es establecido por Angular.

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  /*...*/
})
export class CustomSlider {
  label = input('', {transform: trimString});
}

function trimString(value: string | undefined): string {
  return value?.trim() ?? '';
}
```

```angular-html
<custom-slider [label]="systemVolume" />
```

En el ejemplo anterior, cada vez que el valor de `systemVolume` cambia, Angular ejecuta `trimString` y establece `label` con el resultado.

El caso de uso más común para las transformaciones de input es aceptar un rango más amplio de tipos de valor en las plantillas, frecuentemente incluyendo `null` y `undefined`.

**La función de transformación de input debe ser analizable estáticamente en tiempo de compilación.** No puedes establecer funciones de transformación condicionalmente o como resultado de una evaluación de expresión.

**Las funciones de transformación de input siempre deben ser [funciones puras](https://en.wikipedia.org/wiki/Pure_function).** Depender de estado fuera de la función de transformación puede llevar a comportamiento impredecible.

#### Verificación de tipos

Cuando especificas una transformación de input, el tipo del parámetro de la función de transformación determina los tipos de valores que se pueden establecer al input en una plantilla.

```ts
@Component({/*...*/})
export class CustomSlider {
  widthPx = input('', {transform: appendPx});
}

function appendPx(value: number): string {
  return `${value}px`;
}
```

En el ejemplo anterior, el input `widthPx` acepta un `number` mientras que la propiedad `InputSignal` devuelve un `string`.

#### Transformaciones integradas

Angular incluye dos funciones de transformación integradas para los dos escenarios más comunes: convertir valores a booleano y números.

```ts
import {Component, input, booleanAttribute, numberAttribute} from '@angular/core';

@Component({/*...*/})
export class CustomSlider {
  disabled = input(false, {transform: booleanAttribute});
  value = input(0, {transform: numberAttribute});
}
```

`booleanAttribute` imita el comportamiento de los [atributos booleanos](https://developer.mozilla.org/docs/Glossary/Boolean/HTML) estándar de HTML, donde la
_presencia_ del atributo indica un valor "true". Sin embargo, el `booleanAttribute` de Angular trata la cadena literal `"false"` como el booleano `false`.

`numberAttribute` intenta parsear el valor dado a un número, produciendo `NaN` si el parseo falla.

### Alias de input

Puedes especificar la opción `alias` para cambiar el nombre de un input en las plantillas.

```ts {highlight:[3]}
@Component({/*...*/})
export class CustomSlider {
  value = input(0, {alias: 'sliderValue'});
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

Este alias no afecta el uso de la propiedad en código TypeScript.

Aunque generalmente debes evitar usar alias para inputs de componentes, esta característica puede ser útil para renombrar propiedades mientras se preserva un alias para el nombre original o para evitar colisiones con el nombre de propiedades de elementos DOM nativos.

## Model inputs

Los **model inputs** son un tipo especial de input que permiten a un componente propagar nuevos valores de vuelta a su componente padre.

Al crear un componente, puedes definir un model input de manera similar a como creas un input estándar.

Ambos tipos de input permiten a alguien enlazar un valor a la propiedad. Sin embargo, **los model inputs permiten al autor del componente escribir valores en la propiedad**. Si la propiedad está enlazada con un enlace bidireccional, el nuevo valor se propaga a ese enlace.

```ts
@Component({ /* ... */})
export class CustomSlider {
  // Define un model input llamado "value".
  value = model(0);

  increment() {
    // Actualiza el model input con un nuevo valor, propagando el valor a cualquier enlace.
    this.value.update(oldValue => oldValue + 10);
  }
}

@Component({
  /* ... */
  // Usar la sintaxis de enlace bidireccional significa que cualquier cambio al valor del slider
  // se propaga automáticamente de vuelta a la signal `volume`.
  // Nota que este enlace usa la *instancia* de la signal, no el valor de la signal.
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // Crea una signal escribible para el estado local `volume`.
  volume = signal(0);
}
```

En el ejemplo anterior, `CustomSlider` puede escribir valores en su model input `value`, que luego propaga esos valores de vuelta a la signal `volume` en `MediaControls`. Este enlace mantiene los valores de `value` y `volume` sincronizados. Nota que el enlace pasa la instancia de la signal `volume`, no el _valor_ de la signal.

En otros aspectos, los model inputs funcionan de manera similar a los inputs estándar. Puedes leer el valor llamando a la función de signal, incluyendo en contextos reactivos como `computed` y `effect`.

Consulta [Enlace bidireccional](guide/templates/two-way-binding) para más detalles sobre el enlace bidireccional en plantillas.

### Enlace bidireccional con propiedades planas

Puedes enlazar una propiedad JavaScript plana a un model input.

```angular-ts
@Component({
  /* ... */
  // `value` es un model input.
  // La sintaxis de paréntesis dentro de corchetes (también conocida como "banana-in-a-box") crea un enlace bidireccional
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

En el ejemplo anterior, `CustomSlider` puede escribir valores en su model input `value`, que luego propaga esos valores de vuelta a la propiedad `volume` en `MediaControls`. Este enlace mantiene los valores de `value` y `volume` sincronizados.

### Eventos `change` implícitos

Cuando declaras un model input en un componente o directiva, Angular crea automáticamente un [output](guide/components/outputs) correspondiente para ese model. El nombre del output es el nombre del model input con el sufijo "Change".

```ts
@Directive({ /* ... */ })
export class CustomCheckbox {
  // Esto crea automáticamente un output llamado "checkedChange".
  // Se puede suscribir usando `(checkedChange)="handler()"` en la plantilla.
  checked = model(false);
}
```

Angular emite este evento de cambio cada vez que escribes un nuevo valor en el model input llamando a sus métodos `set` o `update`.

Consulta [Eventos personalizados con outputs](guide/components/outputs) para más detalles sobre outputs.

### Personalizar model inputs

Puedes marcar un model input como requerido o proporcionar un alias de la misma manera que un [input estándar](guide/signals/inputs).

Los model inputs no admiten transformaciones de input.

### Cuándo usar model inputs

Usa model inputs cuando quieras que un componente admita enlace bidireccional. Esto es típicamente apropiado cuando un componente existe para modificar un valor basado en la interacción del usuario. Más comúnmente, los controles de formulario personalizados, como un selector de fecha o combobox, deben usar model inputs para su valor principal.

## Elegir nombres de input

Evita elegir nombres de input que colisionen con propiedades en elementos DOM como HTMLElement. Las colisiones de nombres introducen confusión sobre si la propiedad enlazada pertenece al componente o al elemento DOM.

Evita agregar prefijos para inputs de componentes como lo harías con selectores de componentes. Dado que un elemento dado solo puede alojar un componente, se puede asumir que cualquier propiedad personalizada pertenece al componente.

## Declarar inputs con el decorador `@Input`

CONSEJO: Aunque el equipo de Angular recomienda usar la función `input` basada en signals para proyectos nuevos, la API original basada en decoradores `@Input` sigue siendo completamente compatible.

Alternativamente puedes declarar inputs de componente agregando el decorador `@Input` a una propiedad:

```ts {highlight:[3]}
@Component({...})
export class CustomSlider {
  @Input() value = 0;
}
```

Enlazar a un input es lo mismo tanto en inputs basados en signals como en inputs basados en decoradores:

```angular-html
<custom-slider [value]="50" />
```

### Personalizar inputs basados en decoradores

El decorador `@Input` acepta un objeto de configuración que te permite cambiar la forma en que funciona el input.

#### Inputs requeridos

Puedes especificar la opción `required` para exigir que un input dado siempre tenga un valor.

```ts {highlight:[3]}
@Component({...})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
```

Si intentas usar un componente sin especificar todos sus inputs requeridos, Angular reporta un error en tiempo de compilación.

#### Transformaciones de input

Puedes especificar una función `transform` para cambiar el valor de un input cuando es establecido por Angular. Esta función de transformación funciona de manera idéntica a las funciones de transformación para inputs basados en signals descritas anteriormente.

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) {
  return value?.trim() ?? '';
}
```

#### Alias de input

Puedes especificar la opción `alias` para cambiar el nombre de un input en las plantillas.

```ts {highlight:[3]}
@Component({...})
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

El decorador `@Input` también acepta el alias como su primer parámetro en lugar del objeto de configuración.

Los alias de input funcionan de la misma manera que para inputs basados en signals descritos anteriormente.

### Inputs con getters y setters

Cuando usas inputs basados en decoradores, una propiedad implementada con un getter y setter puede ser un input:

```ts
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

  set value(newValue: number) { this.internalValue = newValue; }

  private internalValue = 0;
}
```

Incluso puedes crear un input _de solo escritura_ definiendo solo un setter público:

```ts
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

**Prefiere usar transformaciones de input en lugar de getters y setters** si es posible.

Evita getters y setters complejos o costosos. Angular puede invocar el setter de un input múltiples veces, lo que puede impactar negativamente el rendimiento de la aplicación si el setter realiza comportamientos costosos, como manipulación del DOM.

## Especificar inputs en el decorador `@Component`

Además del decorador `@Input`, también puedes especificar los inputs de un componente con la propiedad `inputs` en el decorador `@Component`. Esto puede ser útil cuando un componente hereda una propiedad de una clase base:

```ts {highlight:[4]}
// `CustomSlider` hereda la propiedad `disabled` de `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
```

Además puedes especificar un alias de input en la lista `inputs` poniendo el alias después de dos puntos en la cadena:

```ts {highlight:[4]}
// `CustomSlider` hereda la propiedad `disabled` de `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
```
