<docs-decorative-header title="Gestión de Datos Dinámicos" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Defina el estado y el comportamiento del componente para gestionar los datos dinámicos.
</docs-decorative-header>

Ahora que hemos aprendido la estructura básica de un componente, aprendamos cómo puede definir los datos (es decir, el estado) y el comportamiento del componente.

## ¿Qué es el estado?

Los componentes le permiten encapsular cuidadosamente la responsabilidad de partes discretas de su aplicación. Por ejemplo, un componente `SignUpForm` podría necesitar llevar un registro de si el formulario es válido o no antes de permitir a los usuarios tomar una acción específica. Como resultado, las diversas propiedades que un componente necesita rastrear a menudo se conoce como "estado."

## Definiendo el estado

Para definir el estado, use [Sintaxis de campos de clase](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) entro de su componente.

Por ejemplo, usando el componente `TodoListItem`, cree dos propiedades que desee rastrear:

1. `taskTitle` — El título de la tarea
2. `isComplete` — Si la tarea está completa o no

```ts
// todo-list-item.component.ts
@Component({ ... })
export class TodoListItem {
  taskTitle = '';
  isComplete = false;
}
```

## Actualizando el estado

Cuando desea actualizar el estado, típicamente se logra definiendo métodos en la clase del componente. Estos métodos pueden acceder a los distintos campos de la clase utilizando la palabra clave `this`.

```ts
// todo-list-item.component.ts
@Component({ ... })
export class TodoListItem {
  taskTitle = '';
  isComplete = false;

  completeTask() {
    this.isComplete = true;
  }

  updateTitle(newTitle: string) {
    this.taskTitle = newTitle;
  }
}
```

## Siguiente paso

Ahora que haz aprendido como declarar y gestionar datos dinámicos, es hora de aprender a usar esos datos dentro de las plantillas.

<docs-pill-row>
  <docs-pill title="Renderizado de Plantillas Dinámicas" href="essentials/rendering-dynamic-templates" />
</docs-pill-row>
