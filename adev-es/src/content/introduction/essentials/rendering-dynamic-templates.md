<docs-decorative-header title="Renderizado de Plantillas Dinámicas" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Utilice la sintaxis de plantilla de Angular para crear HTML dinámico.
</docs-decorative-header>

Lo que has aprendido hasta ahora te permite dividir una aplicación en componentes de HTML, pero esto te limita a plantillas estáticas (es decir, contenido que no cambia). El siguiente paso es aprender cómo hacer uso de la sintaxis de plantilla de Angular para crear HTML dinámico.

## Renderizado de Datos Dinámicos

Cuando necesitas mostrar contenido dinámico en tu plantilla, Angular utiliza la sintaxis de doble llave `{{}}` para diferenciar entre contenido estático y dinámico.

Aquí hay un ejemplo simplificado del componente `TodoListItem`.

```ts
@Component({
  selector: 'todo-list-item',
  template: `
    <p>Title: {{ taskTitle }}</p>
  `,
})
export class TodoListItem {
  taskTitle = 'Leer la taza de café';
}
```

Cuando Angular renderiza el componente, verá la salida:

```html
<p>Title: Leer la taza de café</p>
```

Esta sintaxis declara una **interpolación** entre la propiedad de datos dinámicos dentro del HTML. Como resultado, cada vez que los datos cambian, Angular actualizará automáticamente el DOM reflejando el nuevo valor de la propiedad.

## Propiedades Dinámicas

Cuando necesita establecer dinámicamente el valor de las propiedades DOM estándar en un elemento HTML, la propiedad se envuelve entre corchetes para informar a Angular que el valor declarado debe interpretarse como una declaración similar a JavaScript ([con algunas mejoras de Angular](guide/templates/interpolation)) en lugar de una cadena simple.

Por ejemplo, un ejemplo común de actualización dinámica de propiedades en su HTML es determinar si el botón de envío de formulario debe ser deshabilitado en función de si el formulario es válido o no.

Envuelva la propiedad deseada entre corchetes `[]` para decirle a Angular que el valor asignado es dinámico (es decir, no una cadena estática).

```ts
@Component({
  selector: 'sign-up-form',
  template: `
    <button type="submit" [disabled]="formIsInvalid">Enviar</button>
  `,
})
export class SignUpForm {
  formIsInvalid = true;
}
```

En este ejemplo, debido a que `formIsInvalid` es verdadero, el HTML renderizado sería:

```html
<button type="submit" disabled>Enviar</button>
```

## Atributos Dinámicos

En el caso de que desee vincular dinámicamente atributos HTML personalizados (por ejemplo, `aria-`, `data-`, etc.), podría inclinarse a envolver los atributos personalizados con los mismos corchetes `[]`.

```ts
@Component({
  standalone: true,
  template: `
    <button [data-test-id]="testId">CTA Principal</button>
  `,
})
export class AppBanner {
  testId = 'main-cta';
}
```

Desafortunadamente, esto no funcionará porque los atributos HTML personalizados no son propiedades DOM estándar. Para que esto funcione como se pretende, necesitamos anteponer el atributo HTML personalizado con el prefijo `attr. ` .

```ts
@Component({
  standalone: true,
  template: `
    <button [attr.data-test-id]="testId">CTA Principal</button>
  `,
})
export class AppBanner {
  testId = 'main-cta';
}
```

## Siguiente paso

Ahora que tiene plantillas y datos dinámicos en la aplicación, es hora de aprender a mejorar las plantillas ocultando o mostrando condicionalmente ciertos elementos, iterando sobre elementos, y más!

<docs-pill-row>
  <docs-pill title="Condicionales y Bucles" href="essentials/conditionals-and-loops" />
</docs-pill-row>
