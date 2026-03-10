# Migración a etiquetas auto-cerrables

Las etiquetas auto-cerrables son compatibles con las plantillas de Angular desde [v16](https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d#7065).

Este schematic migra las plantillas de tu aplicación para usar etiquetas auto-cerrables.

Ejecuta el schematic usando el siguiente comando:

```shell
ng generate @angular/core:self-closing-tag
```

#### Antes

<docs-code language="angular-html">

<hello-world></hello-world>

</docs-code>

#### Después

<docs-code language="angular-html">

<hello-world />

</docs-code>
