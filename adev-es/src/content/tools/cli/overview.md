# El Angular CLI

El Angular CLI es una herramienta de interfaz de línea de comandos que te permite crear, desarrollar, probar, desplegar y mantener aplicaciones Angular directamente desde un shell de comandos.

Angular CLI se publica en npm como el paquete `@angular/cli` e incluye un binario llamado `ng`. Los comandos que invocan `ng` están usando el Angular CLI.

<docs-callout title="Prueba Angular sin configuración local">

Si eres nuevo en Angular, es posible que quieras comenzar con [¡Pruébalo ahora!](tutorials/learn-angular), que introduce los fundamentos de Angular en el contexto de una aplicación de tienda en línea básica lista para examinar y modificar.
Este tutorial standalone aprovecha el entorno interactivo de desarrollo en línea [StackBlitz](https://stackblitz.com).
No necesitas configurar tu entorno local hasta que estés listo.

</docs-callout>

<docs-card-container>
  <docs-card title="Primeros Pasos" link="Comenzar" href="tools/cli/setup-local">
    Instala Angular CLI para crear y construir tu primera aplicación.
  </docs-card>
  <docs-card title="Referencia de Comandos" link="Aprende Más" href="cli">
    Descubre comandos CLI para ser más productivo con Angular.
  </docs-card>
  <docs-card title="Schematics" link="Aprende Más" href="tools/cli/schematics">
    Crea y ejecuta schematics para generar y modificar archivos fuente en tu aplicación automáticamente.
  </docs-card>
  <docs-card title="Builders" link="Aprende Más" href="tools/cli/cli-builder">
    Crea y ejecuta builders para realizar transformaciones complejas desde tu código fuente a salidas de construcción generadas.
  </docs-card>
</docs-card-container>

## Sintaxis del lenguaje de comandos del CLI

Angular CLI sigue aproximadamente las convenciones Unix/POSIX para la sintaxis de opciones.

### Opciones booleanas

Las opciones booleanas tienen dos formas: `--this-option` establece la bandera en `true`, `--no-this-option` la establece en `false`.
También puedes usar `--this-option=false` o `--this-option=true`.
Si no se proporciona ninguna opción, la bandera permanece en su estado predeterminado, como se indica en la documentación de referencia.

### Opciones de array

Las opciones de array se pueden proporcionar en dos formas: `--option value1 value2` o `--option value1 --option value2`.

### Opciones de clave/valor

Algunas opciones como `--define` esperan un array de pares `key=value` como sus valores.
Al igual que las opciones de array, las opciones de clave/valor se pueden proporcionar en dos formas:
`--define 'KEY_1="value1"' KEY_2=true` o `--define 'KEY_1="value1"' --define KEY_2=true`.

### Rutas relativas

Las opciones que especifican archivos pueden darse como rutas absolutas, o como rutas relativas al directorio de trabajo actual, que generalmente es la raíz del workspace o del proyecto.
