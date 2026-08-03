# Modelos de formularios

Los modelos de formularios son la base de Signal Forms, sirviendo como la única fuente de verdad para los datos de tu formulario. Esta guía explora cómo crear modelos de formularios, actualizarlos y diseñarlos para mantenerlos fácilmente.

NOTA: Los modelos de formularios son distintos del signal `model()` de Angular usado para enlace bidireccional de componentes. Un modelo de formulario es un signal editable que almacena datos de formularios, mientras que `model()` crea inputs/outputs para comunicación entre componentes padre/hijo.

## Qué resuelven los modelos de formularios {#what-form-models-solve}

Los formularios requieren gestionar datos que cambian con el tiempo. Sin una estructura clara, estos datos pueden dispersarse en propiedades del componente, dificultando el rastreo de cambios, la validación de entradas o el envío de datos a un servidor.

Los modelos de formularios resuelven esto centralizando los datos del formulario en un único signal editable. Cuando el modelo se actualiza, el formulario refleja automáticamente esos cambios. Cuando los usuarios interactúan con el formulario, el modelo se actualiza en consecuencia.

## Creando modelos {#creating-models}

Un modelo de formulario es un signal editable creado con la función `signal()` de Angular. El signal contiene un objeto que representa la estructura de datos de tu formulario.

```angular-ts
import { Component, signal } from '@angular/core'
import {form, FormField} from '@angular/forms/signals'

@Component({
  selector: 'app-login',
  imports: [FormField],
  template: `
    <input type="email" [formField]="loginForm.email" />
    <input type="password" [formField]="loginForm.password" />
  `
})
export class LoginComponent {
  loginModel = signal({
    email: '',
    password: ''
  })

  loginForm = form(this.loginModel)
}
```

La función `form()` acepta el signal del modelo y crea un **field tree** - una estructura de objeto especial que refleja la forma de tu modelo. El field tree es tanto navegable (accede a campos hijos con notación de punto como `loginForm.email`) como invocable (llama a un campo como una función para acceder a su estado).

La directiva `[formField]` vincula cada elemento input a su campo correspondiente en el field tree, habilitando sincronización bidireccional automática entre la interfaz de usuario y el modelo.

### Estructuras de modelo soportadas {#supported-model-structures}

Signal Forms construye el field tree recorriendo tu modelo. Los objetos y arrays que recorre (la **capa estructural**) deben ser objetos y arrays JavaScript simples. Los valores en las **hojas** (posiciones sin campos anidados) son usualmente primitivos (strings, números, booleanos) o `null`. Los inputs nativos `date`, `month`, `time`, y `week` también aceptan `Date`, y los controles personalizados pueden aceptar cualquier tipo de valor que entiendan.

```ts {prefer, header: 'Estructura simple'}
interface UserFormModel {
  name: string;
  birthday: Date | null;
  preferences: {
    theme: string;
    notifications: boolean;
  };
  tags: string[];
}

const userModel = signal<UserFormModel>({
  name: '',
  birthday: null,
  preferences: {
    theme: 'dark',
    notifications: true,
  },
  tags: [],
});
```

IMPORTANTE: Las instancias de clases, `Map` y `Set` **no están soportadas en la capa estructural**, aunque TypeScript los aceptará. Signal Forms no valida la forma del modelo en tiempo de ejecución, por lo que el framework acepta estos valores sin lanzar errores, pero produce comportamiento incorrecto de diferentes maneras según la forma:

- **Las instancias de clases** pierden su prototipo en la primera escritura porque Signal Forms hace copias superficiales de los objetos padre al actualizar. Los métodos, getters y verificaciones `instanceof` desaparecen después.
- **Los objetos no extensibles o congelados dentro de arrays** lanzan errores cuando Signal Forms asigna un símbolo de rastreo para preservar la identidad de los elementos entre reordenamientos.
- **`Map` y `Set`** producen field trees vacíos, porque Signal Forms enumera hijos con `Object.keys`.

Si tu aplicación usa clases para modelado de dominio, tradúcelas a objetos simples en el límite del formulario. Consulta [Traducir entre modelo de formulario y modelo de dominio](guide/forms/signals/model-design#translating-between-form-model-and-domain-model).

### Usando tipos de TypeScript {#using-typescript-types}

Aunque TypeScript infiere tipos de literales de objetos, definir tipos explícitos mejora la calidad del código y proporciona mejor soporte de IntelliSense.

```ts
interface LoginData {
  email: string
  password: string
}

export class LoginComponent {
  loginModel = signal<LoginData>({
    email: '',
    password: ''
  })

  loginForm = form(this.loginModel)
}
```

Con tipos explícitos, el field tree proporciona seguridad de tipos completa. Acceder a `loginForm.email` está tipado como `FieldTree<string>`, e intentar acceder a una propiedad inexistente resulta en un error de compilación.

```ts
// TypeScript knows this is FieldTree<string>
const emailField = loginForm.email

// TypeScript error: Property 'username' does not exist
const usernameField = loginForm.username
```

### Inicializando todos los campos {#initializing-all-fields}

Los modelos de formularios deben proporcionar valores iniciales para todos los campos que quieras incluir en el field tree.

```ts
// Good: All fields initialized
const userModel = signal({
  name: '',
  email: '',
  age: 0
})

// Avoid: Missing initial value
const userModel = signal({
  name: '',
  email: ''
  // age field is not defined - cannot access userForm.age
})
```

Para campos opcionales, establécelos explícitamente a `null` o un valor vacío:

```ts
interface UserData {
  name: string
  email: string
  phoneNumber: string | null
}

const userModel = signal<UserData>({
  name: '',
  email: '',
  phoneNumber: null
})
```

ÚTIL: Los controles de texto nativos como `<input type=text>` y `<textarea>` no soportan `null`, usa `''` para representar un valor vacío.

Los campos establecidos a `undefined` se excluyen del field tree. Un modelo con `{value: undefined}` se comporta de manera idéntica a `{}` - acceder al campo retorna `undefined` en lugar de un `FieldTree`.

## Leyendo valores del modelo {#reading-model-values}

Puedes acceder a los valores del formulario de dos maneras: directamente desde el signal del modelo, o a través de campos individuales. Cada enfoque sirve para un propósito diferente.

### Leyendo desde el modelo {#reading-from-the-model}

Accede al signal del modelo cuando necesites los datos completos del formulario, como durante el envío del formulario:

```ts
onSubmit() {
  const formData = this.loginModel();
  console.log(formData.email, formData.password);

  // Send to server
  await this.authService.login(formData);
}
```

El signal del modelo retorna el objeto de datos completo, haciéndolo ideal para operaciones que trabajan con el estado completo del formulario.

### Leyendo desde el estado del campo {#reading-from-field-state}

Cada campo en el field tree es una función. Llamar a un campo retorna un objeto `FieldState` que contiene signals reactivos para el valor del campo, estado de validación y estado de interacción.

Accede al estado del campo cuando trabajes con campos individuales en plantillas o cálculos reactivos:

```angular-ts
@Component({
  template: `
    <p>Current email: {{ loginForm.email().value() }}</p>
    <p>Password length: {{ passwordLength() }}</p>
  `
})
export class LoginComponent {
  loginModel = signal({ email: '', password: '' })
  loginForm = form(this.loginModel)

  passwordLength = computed(() => {
    return this.loginForm.password().value().length
  })
}
```

El estado del campo proporciona signals reactivos para el valor de cada campo, haciéndolo adecuado para mostrar información específica del campo o crear estado derivado.

CONSEJO: El estado del campo incluye muchos más signals además de `value()`, como estado de validación (ej., valid, invalid, errors), rastreo de interacción (ej., touched, dirty) y visibilidad (ej., hidden, disabled).

<!-- TODO: UNCOMMENT BELOW WHEN GUIDE IS AVAILABLE -->
<!-- See the [Field State Management guide](guide/forms/signals/field-state-management) for complete coverage. -->

## Actualizando modelos de formularios programáticamente {#updating-form-models-programmatically}

### Reemplazando modelos de formularios con `set()` {#replacing-form-models-with-set}

Usa `set()` en el modelo de formulario para reemplazar el valor completo:

```ts
loadUserData() {
  this.userModel.set({
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  });
}

resetForm() {
  this.userModel.set({
    name: '',
    email: '',
    age: 0,
  });
}
```

Este enfoque funciona bien cuando cargas datos desde una API o reseteas todo el formulario.

### Actualizar un solo campo directamente con `set()` o `update()` {#update-a-single-field-directly-with-set-or-update}

Usa `set()` en valores de campos individuales para actualizar directamente el estado del campo:

```ts
clearEmail() {
  this.userForm.email().value.set('');
}

incrementAge() {
  this.userForm.age().value.update((currentAge) => currentAge + 1);
}
```

Estas también se conocen como "actualizaciones a nivel de campo". Se propagan automáticamente al signal del modelo y mantienen ambos sincronizados.

### Ejemplo: Cargando datos desde una API {#example-loading-data-from-an-api}

Un patrón común implica obtener datos y poblar el modelo:

```ts
export class UserProfileComponent {
  userModel = signal({
    name: '',
    email: '',
    bio: ''
  })

  userForm = form(this.userModel)
  private userService = inject(UserService)

  ngOnInit() {
    this.loadUserProfile()
  }

  async loadUserProfile() {
    const userData = await this.userService.getUserProfile()
    this.userModel.set(userData)
  }
}
```

Los campos del formulario se actualizan automáticamente cuando el modelo cambia, mostrando los datos obtenidos sin código adicional.

## Enlace bidireccional de datos {#two-way-data-binding}

La directiva `[formField]` crea sincronización bidireccional automática entre el modelo, el estado del formulario y la interfaz de usuario.

### Cómo fluyen los datos {#how-data-flows}

Los cambios fluyen bidireccionalmente:

**Entrada del usuario → Modelo:**

1. El usuario escribe en un elemento input
2. La directiva `[formField]` detecta el cambio
3. El estado del campo se actualiza
4. El signal del modelo se actualiza

**Actualización programática → UI:**

1. El código actualiza el modelo con `set()` o `update()`
2. El signal del modelo notifica a los suscriptores
3. El estado del campo se actualiza
4. La directiva `[formField]` actualiza el elemento input

Esta sincronización ocurre automáticamente. No escribes suscripciones o manejadores de eventos para mantener el modelo y la interfaz de usuario sincronizados.

### Ejemplo: Ambas direcciones {#example-both-directions}

```angular-ts
@Component({
  template: `
    <input type="text" [formField]="userForm.name" />
    <button (click)="setName('Bob')">Set Name to Bob</button>
    <p>Current name: {{ userModel().name }}</p>
  `
})
export class UserComponent {
  userModel = signal({ name: '' })
  userForm = form(this.userModel)

  setName(name: string) {
    this.userForm.name().value.set(name);
    // Input automatically displays 'Bob'
  }
}
```

Cuando el usuario escribe en el input, `userModel().name` se actualiza. Cuando se hace clic en el botón, el valor del input cambia a "Bob". No se requiere código de sincronización manual.

## Patrones de estructura de modelo {#model-structure-patterns}

Los modelos de formularios pueden ser objetos planos o contener objetos anidados y arrays. La estructura que elijas afecta cómo accedes a los campos y organizas la validación.

### Modelos planos vs anidados {#flat-vs-nested-models}

Los modelos de formularios planos mantienen todos los campos en el nivel superior:

```ts
// Flat structure
const userModel = signal({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: ''
})
```

Los modelos anidados agrupan campos relacionados:

```ts
// Nested structure
const userModel = signal({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: ''
  }
})
```

**Usa estructuras planas cuando:**

- Los campos no tienen agrupaciones conceptuales claras
- Quieres acceso más simple a campos (`userForm.city` vs `userForm.address.city`)
- Las reglas de validación abarcan múltiples grupos potenciales

**Usa estructuras anidadas cuando:**

- Los campos forman un grupo conceptual claro (como una dirección)
- Los datos agrupados coinciden con la estructura de tu API
- Quieres validar el grupo como una unidad

### Trabajando con objetos anidados {#working-with-nested-objects}

Puedes acceder a campos anidados siguiendo la ruta del objeto:

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: ''
  },
  settings: {
    theme: 'light',
    notifications: true
  }
})

const userForm = form(userModel)

// Access nested fields
userForm.profile.firstName // FieldTree<string>
userForm.settings.theme // FieldTree<string>
```

En plantillas, vinculas campos anidados de la misma manera que campos de nivel superior:

```angular-ts
@Component({
  template: `
    <input [formField]="userForm.profile.firstName" />
    <input [formField]="userForm.profile.lastName" />

    <select [formField]="userForm.settings.theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `,
})
```

### Trabajando con arrays {#working-with-arrays}

Los modelos pueden incluir arrays para colecciones de elementos:

```ts
const orderModel = signal({
  customerName: '',
  items: [{ product: '', quantity: 0, price: 0 }]
})

const orderForm = form(orderModel)

// Access array items by index
orderForm.items[0].product // FieldTree<string>
orderForm.items[0].quantity // FieldTree<number>
```

Los elementos de arrays que contienen objetos reciben automáticamente identidades de rastreo, lo que ayuda a mantener el estado del campo incluso cuando los elementos cambian de posición en el array. Esto asegura que el estado de validación y las interacciones del usuario persistan correctamente cuando los arrays se reordenan.

<!-- TBD: For dynamic arrays and complex array operations, see the [Working with arrays guide](guide/forms/signals/arrays). -->

## Próximos pasos {#next-steps}

Esta guía cubrió la creación de modelos y la actualización de valores. Las guías relacionadas exploran otros aspectos de Signal Forms:

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="Gestión de estado de campo" />
  <docs-pill href="guide/forms/signals/validation" title="Validación" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Controles personalizados" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Trabajando con arrays" /> -->
</docs-pill-row>
