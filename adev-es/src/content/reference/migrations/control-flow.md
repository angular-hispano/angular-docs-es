# Migración a la sintaxis de flujo de control

La [sintaxis de flujo de control](guide/templates/control-flow) está disponible desde Angular v17. La nueva sintaxis está integrada en la plantilla, por lo que ya no necesitas importar `CommonModule`.

Este schematic migra todo el código existente en tu aplicación para usar la nueva sintaxis de flujo de control.

Ejecuta el schematic usando el siguiente comando:

```shell
ng generate @angular/core:control-flow
```

## Cambios con ruptura {#breaking-changes}

### Reutilización de vistas en `@for` {#for-view-reuse}

Al usar el bloque `@for`, si una propiedad usada en la expresión `track` cambia pero la referencia al objeto permanece igual (modificación en el lugar), Angular actualiza los bindings de la vista (incluidas las entradas de componentes) en lugar de destruir y recrear el elemento.

Esto difiere de `*ngFor`, que ejecutaría un remontaje (destrucción y recreación) del elemento en un escenario similar si la función `trackBy` devolvía un valor diferente.
