# Propiedades de salida (output) de componentes

Cuando trabajas con componentes, puede ser necesario notificar a otros componentes que algo ha sucedido. Quizás se ha hecho clic en un botón, se ha agregado/eliminado un elemento de una lista o ha ocurrido alguna otra actualización importante. En este escenario, los componentes necesitan comunicarse con componentes padres.

Angular usa la función `output()` para habilitar este tipo de comportamiento.

NOTA: Aprende más sobre [eventos personalizados en la guía de outputs](/guide/components/outputs).

En esta actividad, aprenderás cómo usar la función `output()` para comunicarte con componentes.

<hr />

Para crear la ruta de comunicación de componentes hijos a padres, usa la función `output` para inicializar una propiedad de clase.

<docs-code header="child.ts" language="ts">
@Component({...})
class Child {
  incrementCountEvent = output<number>();
}
</docs-code>

Ahora el componente puede generar eventos que pueden ser escuchados por el componente padre. Dispara eventos llamando al método `emit`:

<docs-code header="child.ts" language="ts">
class Child {
  ...

onClick() {
this.count++;
this.incrementCountEvent.emit(this.count);
}
}
</docs-code>

La función `emit` generará un evento con el mismo tipo que el definido por `output`.

Bien, es tu turno de intentarlo. Completa el código siguiendo estas tareas:

<docs-workflow>

<docs-step title="Agrega una propiedad `output()`">
Actualiza `child.ts` agregando una propiedad de salida llamada `addItemEvent`, asegúrate de establecer el tipo de output como `string`.
</docs-step>

<docs-step title="Completa el método `addItem`">
En `child.ts` actualiza el método `addItem`; usa el siguiente código como lógica:

<docs-code header="child.ts" highlight="[2]" language="ts">
addItem() {
  this.addItemEvent.emit('🐢');
}
</docs-code>

</docs-step>

<docs-step title="Actualiza la plantilla de `App`">
En `app.ts` actualiza la plantilla para escuchar el evento emitido agregando el siguiente código:

```angular-html
<app-child (addItemEvent)="addItem($event)" />
```

Ahora, el botón "Add Item" agrega un nuevo elemento a la lista cada vez que se hace clic.

</docs-step>

</docs-workflow>

Vaya, en este punto has completado los fundamentos de componentes - impresionante 👏

Sigue aprendiendo para descubrir más características increíbles de Angular.
