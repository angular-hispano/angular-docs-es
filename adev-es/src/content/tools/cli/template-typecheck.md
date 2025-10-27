# Verificación de tipos de plantilla

## Visión general de la verificación de tipos de plantilla

Así como TypeScript captura errores de tipo en tu código, Angular verifica las expresiones y enlaces dentro de las plantillas de tu aplicación y puede reportar cualquier error de tipo que encuentre.
Angular actualmente tiene tres modos de hacer esto, dependiendo del valor de las banderas `fullTemplateTypeCheck` y `strictTemplates` en las [opciones del compilador de Angular](reference/configs/angular-compiler-options).

### Modo básico

En el modo de verificación de tipos más básico, con la bandera `fullTemplateTypeCheck` establecida en `false`, Angular valida solo expresiones de nivel superior en una plantilla.

Si escribes `<map [city]="user.address.city">`, el compilador verifica lo siguiente:

* `user` es una propiedad en la clase del componente
* `user` es un objeto con una propiedad address
* `user.address` es un objeto con una propiedad city

El compilador no verifica que el valor de `user.address.city` sea asignable a la entrada city del componente `<map>`.

El compilador también tiene algunas limitaciones importantes en este modo:

* Importantemente, no verifica vistas incrustadas, como `*ngIf`, `*ngFor`, u otras vistas incrustadas `<ng-template>`.
* No determina los tipos de `#refs`, los resultados de pipes, o el tipo de `$event` en enlaces de eventos.

En muchos casos, estas cosas terminan siendo de tipo `any`, lo que puede causar que partes subsiguientes de la expresión no se verifiquen.

### Modo completo

Si la bandera `fullTemplateTypeCheck` está establecida en `true`, Angular es más agresivo en su verificación de tipos dentro de plantillas.
En particular:

* Las vistas incrustadas \(como aquellas dentro de un `*ngIf` o `*ngFor`\) son verificadas
* Los pipes tienen el tipo de retorno correcto
* Las referencias locales a directivas y pipes tienen el tipo correcto \(excepto por cualquier parámetro genérico, que será `any`\)

Lo siguiente todavía tiene tipo `any`.

* Referencias locales a elementos DOM
* El objeto `$event`
* Expresiones de navegación segura

IMPORTANTE: La bandera `fullTemplateTypeCheck` ha sido deprecada en Angular 13.
La familia de opciones de compilador `strictTemplates` debería usarse en su lugar.

### Modo estricto

Angular mantiene el comportamiento de la bandera `fullTemplateTypeCheck`, e introduce un tercer "modo estricto".
El modo estricto es un superconjunto del modo completo, y se accede estableciendo la bandera `strictTemplates` en true.
Esta bandera reemplaza la bandera `fullTemplateTypeCheck`.

Además del comportamiento del modo completo, Angular hace lo siguiente:

* Verifica que los enlaces de componente/directiva sean asignables a sus `input()`s
* Obedece la bandera `strictNullChecks` de TypeScript al validar el modo precedente
* Infiere el tipo correcto de componentes/directivas, incluyendo genéricos
* Infiere tipos de contexto de plantilla donde está configurado \(por ejemplo, permitiendo verificación de tipos correcta de `NgFor`\)
* Infiere el tipo correcto de `$event` en enlaces de eventos de componente/directiva, DOM y animación
* Infiere el tipo correcto de referencias locales a elementos DOM, basado en el nombre de etiqueta \(por ejemplo, el tipo que `document.createElement` devolvería para esa etiqueta\)

## Verificación de `*ngFor`

Los tres modos de verificación de tipos tratan las vistas incrustadas de manera diferente.
Considera el siguiente ejemplo.

<docs-code language="typescript" header="User interface">

interface User {
  name: string;
  address: {
    city: string;
    state: string;
  }
}

</docs-code>

<docs-code language="html">

<div *ngFor="let user of users">
  <h2>{{config.title}}</h2>
  <span>City: {{user.address.city}}</span>
</div>

</docs-code>

El `<h2>` y el `<span>` están en la vista incrustada `*ngFor`.
En modo básico, Angular no verifica ninguno de ellos.
Sin embargo, en modo completo, Angular verifica que `config` y `user` existan y asume un tipo de `any`.
En modo estricto, Angular sabe que el `user` en el `<span>` tiene un tipo de `User`, y que `address` es un objeto con una propiedad `city` de tipo `string`.

## Solución de problemas de errores de plantilla

Con el modo estricto, podrías encontrar errores de plantilla que no surgieron en ninguno de los modos anteriores.
Estos errores a menudo representan desajustes de tipo genuinos en las plantillas que no fueron capturados por las herramientas anteriores.
Si este es el caso, el mensaje de error debería dejar claro dónde en la plantilla ocurre el problema.

También puede haber falsos positivos cuando los tipos de una librería Angular son incompletos o incorrectos, o cuando los tipos no se alinean del todo con las expectativas como en los siguientes casos.

* Cuando los tipos de una librería son incorrectos o incompletos \(por ejemplo, falta `null | undefined` si la librería no fue escrita con `strictNullChecks` en mente\)
* Cuando los tipos de entrada de una librería son demasiado estrechos y la librería no ha agregado metadata apropiada para que Angular lo determine.
    Esto usualmente ocurre con disabled u otras entradas Boolean comunes usadas como atributos, por ejemplo, `<input disabled>`.

* Cuando se usa `$event.target` para eventos DOM \(debido a la posibilidad de propagación de eventos, `$event.target` en los tipos DOM no tiene el tipo que podrías esperar\)

En caso de un falso positivo como estos, hay algunas opciones:

* Usa la función de conversión de tipo `$any()` en ciertos contextos para optar por no verificar tipos para una parte de la expresión
* Deshabilita las verificaciones estrictas completamente estableciendo `strictTemplates: false` en el archivo de configuración TypeScript de la aplicación, `tsconfig.json`
* Deshabilita ciertas operaciones de verificación de tipos individualmente, mientras mantienes rigurosidad en otros aspectos, estableciendo una *bandera de rigurosidad* en `false`
* Si quieres usar `strictTemplates` y `strictNullChecks` juntos, opta por no verificar tipos null estrictamente específicamente para enlaces de entrada usando `strictNullInputTypes`

A menos que se comente lo contrario, cada opción siguiente se establece al valor de `strictTemplates` \(`true` cuando `strictTemplates` es `true` y viceversa, de lo contrario\).

| Bandera de rigurosidad              | Efecto |
|:---                          |:---    |
| `strictInputTypes`           | Si se verifica la asignabilidad de una expresión de enlace al campo `@Input()`. También afecta la inferencia de tipos genéricos de directiva.                                                                                                                                                                                                                                                                                                |
| `strictInputAccessModifiers` | Si se respetan los modificadores de acceso como `private`/`protected`/`readonly` al asignar una expresión de enlace a un `@Input()`. Si se deshabilita, los modificadores de acceso del `@Input` se ignoran; solo se verifica el tipo. Esta opción es `false` por defecto, incluso con `strictTemplates` establecido en `true`.                                                                                                                                  |
| `strictNullInputTypes`       | Si se respeta `strictNullChecks` al verificar enlaces `@Input()` \(según `strictInputTypes`\). Desactivar esto puede ser útil cuando se usa una librería que no fue construida con `strictNullChecks` en mente.                                                                                                                                                                                                                                 |
| `strictAttributeTypes`       | Si se deben verificar enlaces `@Input()` que se hacen usando atributos de texto. Por ejemplo, `<input matInput disabled="true">` \(estableciendo la propiedad `disabled` a la cadena `'true'`\) vs `<input matInput [disabled]="true">` \(estableciendo la propiedad `disabled` al booleano `true`\). |
| `strictSafeNavigationTypes`  | Si el tipo de retorno de operaciones de navegación segura \(por ejemplo, `user?.name` se inferirá correctamente basado en el tipo de `user`\). Si se deshabilita, `user?.name` será de tipo `any`.                                                                                                                                                                                                                                                |
| `strictDomLocalRefTypes`     | Si las referencias locales a elementos DOM tendrán el tipo correcto. Si se deshabilita `ref` será de tipo `any` para `<input #ref>`.                                                                                                                                                                                                                                                                                                            |
| `strictOutputEventTypes`     | Si `$event` tendrá el tipo correcto para enlaces de eventos a `@Output()` de componente/directiva, o a eventos de animación. Si se deshabilita, será `any`.                                                                                                                                                                                                                                                                                |
| `strictDomEventTypes`        | Si `$event` tendrá el tipo correcto para enlaces de eventos a eventos DOM. Si se deshabilita, será `any`.                                                                                                                                                                                                                                                                                                                                |
| `strictContextGenerics`      | Si los parámetros de tipo de componentes genéricos se inferirán correctamente \(incluyendo cualquier límite genérico\). Si se deshabilita, cualquier parámetro de tipo será `any`.                                                                                                                                                                                                                                                                                              |
| `strictLiteralTypes`         | Si los literales de objeto y array declarados en la plantilla tendrán su tipo inferido. Si se deshabilita, el tipo de tales literales será `any`. Esta bandera es `true` cuando *cualquiera* de `fullTemplateTypeCheck` o `strictTemplates` está establecido en `true`.                                                                                                                                                                                            |

Si aún tienes problemas después de solucionar problemas con estas banderas, vuelve al modo completo deshabilitando `strictTemplates`.

Si eso no funciona, una opción de último recurso es desactivar el modo completo completamente con `fullTemplateTypeCheck: false`.

Un error de verificación de tipos que no puedes resolver con ninguno de los métodos recomendados puede ser el resultado de un bug en el verificador de tipos de plantilla mismo.
Si obtienes errores que requieren volver al modo básico, es probable que sea tal bug.
Si esto sucede, [abre un issue](https://github.com/angular/angular/issues) para que el equipo pueda abordarlo.

## Entradas y verificación de tipos

El verificador de tipos de plantilla verifica si el tipo de una expresión de enlace es compatible con el de la entrada de directiva correspondiente.
Como ejemplo, considera el siguiente componente:

<docs-code language="typescript">

export interface User {
  name: string;
}

@Component({
  selector: 'user-detail',
  template: '{{ user.name }}',
})
export class UserDetailComponent {
  user = input.required<User>();
}

</docs-code>

La plantilla de `AppComponent` usa este componente como sigue:

<docs-code language="typescript">

@Component({
  selector: 'app-root',
  template: '<user-detail [user]="selectedUser"></user-detail>',
})
export class AppComponent {
  selectedUser: User | null = null;
}

</docs-code>

Aquí, durante la verificación de tipos de la plantilla para `AppComponent`, el enlace `[user]="selectedUser"` corresponde con la entrada `UserDetailComponent.user`.
Por lo tanto, Angular asigna la propiedad `selectedUser` a `UserDetailComponent.user`, lo que resultaría en un error si sus tipos fueran incompatibles.
TypeScript verifica la asignación según su sistema de tipos, obedeciendo banderas como `strictNullChecks` como están configuradas en la aplicación.

Evita errores de tipo en tiempo de ejecución proporcionando requisitos de tipo más específicos en la plantilla al verificador de tipos de plantilla.
Haz que los requisitos de tipo de entrada para tus propias directivas sean lo más específicos posible proporcionando funciones de guardia de plantilla en la definición de la directiva.
Consulta [Mejorando la verificación de tipos de plantilla para directivas personalizadas](guide/directives/structural-directives#directive-type-checks) en esta guía.

### Verificaciones null estrictas

Cuando habilitas `strictTemplates` y la bandera TypeScript `strictNullChecks`, pueden ocurrir errores de verificación de tipos para ciertas situaciones que podrían no evitarse fácilmente.
Por ejemplo:

* Un valor nullable que está enlazado a una directiva de una librería que no tenía `strictNullChecks` habilitado.

    Para una librería compilada sin `strictNullChecks`, sus archivos de declaración no indicarán si un campo puede ser `null` o no.
    Para situaciones donde la librería maneja `null` correctamente, esto es problemático, ya que el compilador verificará un valor nullable contra los archivos de declaración que omiten el tipo `null`.
    Como tal, el compilador produce un error de verificación de tipos porque se adhiere a `strictNullChecks`.

* Usar el pipe `async` con un Observable que sabes que emitirá sincrónicamente.

    El pipe `async` actualmente asume que el Observable al que se suscribe puede ser asíncrono, lo que significa que es posible que aún no haya un valor disponible.
    En ese caso, aún tiene que devolver algo —que es `null`.
    En otras palabras, el tipo de retorno del pipe `async` incluye `null`, lo que podría resultar en errores en situaciones donde se sabe que el Observable emite un valor no nullable sincrónicamente.

Hay dos soluciones potenciales para los problemas anteriores:

* En la plantilla, incluye el operador de aserción no null `!` al final de una expresión nullable, como

    <docs-code hideCopy language="html">

    <user-detail [user]="user!"></user-detail>

    </docs-code>

    En este ejemplo, el compilador ignora incompatibilidades de tipo en nulabilidad, al igual que en código TypeScript.
    En el caso del pipe `async`, nota que la expresión necesita estar envuelta en paréntesis, como en

    <docs-code hideCopy language="html">

    <user-detail [user]="(user$ | async)!"></user-detail>

    </docs-code>

* Deshabilita verificaciones null estrictas en plantillas Angular completamente.

    Cuando `strictTemplates` está habilitado, aún es posible deshabilitar ciertos aspectos de la verificación de tipos.
    Establecer la opción `strictNullInputTypes` en `false` deshabilita verificaciones null estrictas dentro de plantillas Angular.
    Esta bandera se aplica para todos los componentes que son parte de la aplicación.

### Consejo para autores de librerías

Como autor de librería, puedes tomar varias medidas para proporcionar una experiencia óptima para tus usuarios.
Primero, habilitar `strictNullChecks` e incluir `null` en el tipo de una entrada, según corresponda, comunica a tus consumidores si pueden proporcionar un valor nullable o no.
Adicionalmente, es posible proporcionar pistas de tipo específicas para el verificador de tipos de plantilla.
Consulta [Mejorando la verificación de tipos de plantilla para directivas personalizadas](guide/directives/structural-directives#directive-type-checks), y [Coerción de setter de entrada](#input-setter-coercion).

## Coerción de setter de entrada

Ocasionalmente es deseable que la propiedad `input()` de una directiva o componente altere el valor enlazado a ella, típicamente usando una función `transform` para la entrada.
Como ejemplo, considera este componente de botón personalizado:

Considera la siguiente directiva:

<docs-code language="typescript">

@Component({
  selector: 'submit-button',
  template: `
    <div class="wrapper">
      <button [disabled]="disabled">Submit</button>
    </div>
  `,
})
class SubmitButton {
  disabled = input.required({transform: booleanAttribute });
}

</docs-code>

Aquí, la entrada `disabled` del componente se pasa al `<button>` en la plantilla.
Todo esto funciona como se espera, siempre que un valor `boolean` esté enlazado a la entrada.
Pero, supón que un consumidor usa esta entrada en la plantilla como un atributo:

<docs-code language="html">

<submit-button disabled></submit-button>

</docs-code>

Esto tiene el mismo efecto que el enlace:

<docs-code language="html">

<submit-button [disabled]="''"></submit-button>

</docs-code>

En tiempo de ejecución, la entrada se establecerá a la cadena vacía, que no es un valor `boolean`.
Las librerías de componentes Angular que lidian con este problema a menudo "coercionan" el valor al tipo correcto en el setter:

<docs-code language="typescript">

set disabled(value: boolean) {
  this._disabled = (value === '') || value;
}

</docs-code>

Sería ideal cambiar el tipo de `value` aquí, de `boolean` a `boolean|''`, para que coincida con el conjunto de valores que realmente son aceptados por el setter.
TypeScript anterior a la versión 4.3 requiere que tanto el getter como el setter tengan el mismo tipo, por lo que si el getter debe devolver un `boolean` entonces el setter está atascado con el tipo más estrecho.

Si el consumidor tiene habilitada la verificación de tipos más estricta de Angular para plantillas, esto crea un problema: la cadena vacía \(`''`\) no es realmente asignable al campo `disabled`, lo que crea un error de tipo cuando se usa la forma de atributo.

Como solución a este problema, Angular soporta verificar un tipo más amplio y permisivo para `@Input()` que el declarado para el campo de entrada mismo.
Habilita esto agregando una propiedad estática con el prefijo `ngAcceptInputType_` a la clase del componente:

<docs-code language="typescript">

class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = (value === '') || value;
  }

  static ngAcceptInputType_disabled: boolean|'';
}

</docs-code>

Desde TypeScript 4.3, el setter podría haberse declarado para aceptar `boolean|''` como tipo, haciendo obsoleto el campo de coerción de setter de entrada.
Como tal, los campos de coerción de setters de entrada han sido deprecados.

Este campo no necesita tener un valor.
Su existencia comunica al verificador de tipos de Angular que la entrada `disabled` debería considerarse como aceptando enlaces que coincidan con el tipo `boolean|''`.
El sufijo debe ser el nombre del *campo* `@Input`.

Se debe tener cuidado de que si un override `ngAcceptInputType_` está presente para una entrada dada, entonces el setter debería poder manejar cualquier valor del tipo sobrescrito.

## Deshabilitando verificación de tipos usando `$any()`

Deshabilita la verificación de una expresión de enlace rodeando la expresión en una llamada a la pseudo-función de conversión `$any()`.
El compilador la trata como una conversión al tipo `any` al igual que en TypeScript cuando se usa una conversión `<any>` o `as any`.

En el siguiente ejemplo, convertir `person` al tipo `any` suprime el error `Property address does not exist`.

<docs-code language="typescript">

@Component({
  selector: 'my-component',
  template: '{{$any(person).address.street}}'
})
class MyComponent {
  person?: Person;
}

</docs-code>
