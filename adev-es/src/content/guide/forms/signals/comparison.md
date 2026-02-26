# Comparación con otros enfoques de formularios

Angular proporciona tres enfoques para construir formularios: Signal Forms, Reactive Forms, y Template-driven Forms. Cada uno tiene patrones distintos para gestionar estado, validación, y flujo de datos. Esta guía te ayuda a entender las diferencias y elegir el enfoque correcto para tu proyecto.

NOTA: Signal Forms son [experimentales](reference/releases#experimental) a partir de Angular v21. La API puede cambiar antes de estabilizarse.

## Comparación rápida

| Característica          | Signal Forms                       | Reactive Forms                        | Template-driven Forms   |
| ----------------------- | ---------------------------------- | ------------------------------------- | ----------------------- |
| Fuente de verdad        | Signal editable definido por usuario | `FormControl`/`FormGroup`           | Modelo de usuario en componente |
| Seguridad de tipos      | Inferida del modelo                | Explícita con formularios tipados     | Mínima                  |
| Validación              | Esquema con validadores basados en ruta | Lista de validadores pasados a Controls | Basada en directivas  |
| Gestión de estado       | Basada en signals                  | Basada en observables                 | Gestionada por Angular  |
| Configuración           | Signal + función de esquema        | Árbol de FormControl                  | NgModel en plantilla    |
| Mejor para              | Aplicaciones basadas en signals    | Formularios complejos                 | Formularios simples     |
| Curva de aprendizaje    | Media                              | Media-Alta                            | Baja                    |
| Estado                  | Experimental (v21+)                | Estable                               | Estable                 |

## Por ejemplo: Formulario de inicio de sesión

La mejor manera de entender las diferencias es ver el mismo formulario implementado en los tres enfoques.

<docs-code-multifile>
  <docs-code header="Signal forms" path="adev/src/content/examples/signal-forms/src/comparison/app/signal-forms.ts"/>
  <docs-code header="Reactive forms" path="adev/src/content/examples/signal-forms/src/comparison/app/reactive-forms.ts"/>
  <docs-code header="Template-driven forms" path="adev/src/content/examples/signal-forms/src/comparison/app/template-driven-forms.ts"/>
</docs-code-multifile>

## Entendiendo las diferencias

Los tres enfoques toman decisiones de diseño diferentes que afectan cómo escribes y mantienes tus formularios. Estas diferencias provienen de dónde cada enfoque almacena el estado del formulario y cómo gestiona la validación.

### Dónde viven los datos de tu formulario

La diferencia más fundamental es dónde cada enfoque considera la "fuente de verdad" para los valores del formulario.

Signal Forms almacena datos en un signal editable. Cuando necesitas los valores actuales del formulario, llamas al signal:

```ts
const credentials = this.loginModel(); // { email: '...', password: '...' }
```

Esto mantiene los datos de tu formulario en un contenedor reactivo único que notifica automáticamente a Angular cuando los valores cambian. La estructura del formulario refleja exactamente tu modelo de datos.

Reactive Forms almacena datos dentro de instancias de FormControl y FormGroup. Accedes a los valores a través de la jerarquía del formulario:

```ts
const credentials = this.loginForm.value; // { email: '...', password: '...' }
```

Esto separa la gestión del estado del formulario del modelo de datos de tu componente. La estructura del formulario es explícita pero requiere más código de configuración.

Template-driven Forms almacena datos en propiedades del componente. Accedes a los valores directamente:

```ts
const credentials = { email: this.email, password: this.password };
```

Este es el enfoque más directo pero requiere ensamblar manualmente los valores cuando los necesitas. Angular gestiona el estado del formulario a través de directivas en la plantilla.

### Cómo funciona la validación

Cada enfoque define reglas de validación de manera diferente, afectando dónde vive tu lógica de validación y cómo la mantienes.

Signal Forms usa una función de esquema donde vinculas validadores a rutas de campo:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, { message: 'Email is required' });
  email(fieldPath.email, { message: 'Enter a valid email address' });
});
```

Todas las reglas de validación viven juntas en un solo lugar. La función de esquema se ejecuta una vez durante la creación del formulario, y los validadores se ejecutan automáticamente cuando los valores de los campos cambian. Los mensajes de error son parte de la definición de validación.

Reactive Forms adjunta validadores al crear controles:

```ts
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email])
});
```

Los validadores están vinculados a controles individuales en la estructura del formulario. Esto distribuye la validación a través de tu definición de formulario. Los mensajes de error típicamente viven en tu plantilla.

Template-driven Forms usa atributos de directiva en la plantilla:

```html
<input [(ngModel)]="email" required email />
```

Las reglas de validación viven en tu plantilla junto al HTML. Esto mantiene la validación cerca de la UI pero dispersa la lógica entre plantilla y componente.

### Seguridad de tipos y autocompletado

La integración de TypeScript difiere significativamente entre enfoques, afectando cuánto el compilador te ayuda a evitar errores.

Signal Forms infiere tipos de la estructura de tu modelo:

```ts
const loginModel = signal({ email: '', password: '' });
const loginForm = form(loginModel);
// TypeScript knows: loginForm.email exists and returns FieldState<string>
```

Defines la forma de tus datos una vez en el signal, y TypeScript automáticamente sabe qué campos existen y sus tipos. Acceder a `loginForm.username` (que no existe) produce un error de tipo.

Reactive Forms requiere anotaciones de tipo explícitas con formularios tipados:

```ts
const loginForm = new FormGroup({
  email: new FormControl<string>(''),
  password: new FormControl<string>('')
});
// TypeScript knows: loginForm.controls.email is FormControl<string>
```

Especificas tipos para cada control individualmente. TypeScript valida tu estructura de formulario, pero mantienes la información de tipo separada de tu modelo de datos.

Template-driven Forms ofrece seguridad de tipos mínima:

```ts
email = '';
password = '';
// TypeScript only knows these are strings, no form-level typing
```

TypeScript entiende las propiedades de tu componente pero no tiene conocimiento de la estructura del formulario o validación. Pierdes verificación en tiempo de compilación para operaciones de formulario.

## Elige tu enfoque

### Usa Signal Forms si:

- Estás construyendo nuevas aplicaciones basadas en signals (Angular v21+)
- Quieres seguridad de tipos inferida de la estructura de tu modelo
- Te sientes cómodo trabajando con características experimentales
- La validación basada en esquemas te atrae
- Tu equipo está familiarizado con signals

### Usa Reactive Forms si:

- Necesitas estabilidad lista para producción
- Estás construyendo formularios complejos y dinámicos
- Prefieres patrones basados en observables
- Necesitas control detallado sobre el estado del formulario
- Estás trabajando en una base de código existente de reactive forms

### Usa Template-driven Forms si:

- Estás construyendo formularios simples (login, contacto, búsqueda)
- Estás haciendo prototipado rápido
- Tu lógica de formulario es sencilla
- Prefieres mantener la lógica del formulario en plantillas
- Estás trabajando en una base de código existente de template-driven

## Próximos pasos

Para aprender más sobre cada enfoque:

- **Signal Forms**: Consulta la [guía de Visión general](guide/forms/signals/overview) para comenzar, o profundiza en [Modelos de Formulario](guide/forms/signals/models), [Validación](guide/forms/signals/validation), y [Gestión de Estado de Campo](guide/forms/signals/field-state-management)
- **Reactive Forms**: Consulta la [guía de Reactive Forms](guide/forms/reactive-forms) en la documentación de Angular
- **Template-driven Forms**: Consulta la [guía de Template-driven Forms](guide/forms/template-driven-forms) en la documentación de Angular
