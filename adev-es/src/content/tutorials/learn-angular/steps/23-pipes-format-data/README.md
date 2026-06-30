# Formateando datos con pipes

Puedes llevar tu uso de pipes aún más lejos configurándolos. Los pipes pueden configurarse pasándoles opciones.

NOTA: Aprende más sobre [formatear datos con pipes en la guía detallada](/guide/templates/pipes).

En esta actividad, trabajarás con algunos pipes y parámetros de pipes.

<hr>

Para pasar parámetros a un pipe, usa la sintaxis `:` seguida del valor del parámetro. Aquí hay un ejemplo:

```ts
template: `{{ date | date:'medium' }}`;
```

El resultado es `Jun 15, 2015, 9:43:11 PM`.

Es hora de personalizar la salida de algunos pipes:

<docs-workflow>

<docs-step title="Formatea un número con `DecimalPipe`">

En `app.ts`, actualiza la plantilla para incluir el parámetro del pipe `decimal`.

<docs-code language="ts" highlight="[3]">
template: `
  ...
  <li>Number with "decimal" {{ num | number:"3.2-2" }}</li>
`
</docs-code>

NOTA: ¿Qué es ese formato? El parámetro para `DecimalPipe` se llama `digitsInfo`, este parámetro usa el formato: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

</docs-step>

<docs-step title="Formatea una fecha con `DatePipe`">

Ahora, actualiza la plantilla para usar el pipe `date`.

<docs-code language="ts" highlight="[3]">
template: `
  ...
  <li>Date with "date" {{ birthday | date: 'medium' }}</li>
`
</docs-code>

Para más diversión, prueba algunos parámetros diferentes para `date`. Puedes encontrar más información en la [documentación de Angular](guide/templates/pipes).

</docs-step>

<docs-step title="Formatea una moneda con `CurrencyPipe`">

Para tu última tarea, actualiza la plantilla para usar el pipe `currency`.

<docs-code language="ts" highlight="[3]">
template: `
  ...
  <li>Currency with "currency" {{ cost | currency }}</li>
`
</docs-code>

También puedes probar diferentes parámetros para `currency`. Puedes encontrar más información en la [documentación de Angular](guide/templates/pipes).

</docs-step>

</docs-workflow>

Excelente trabajo con pipes. Has progresado muy bien hasta ahora.

Hay incluso más pipes integrados que puedes usar en tus aplicaciones. Puedes encontrar la lista en la [documentación de Angular](guide/templates/pipes).

En caso de que los pipes integrados no cubran tus necesidades, también puedes crear un pipe personalizado. Revisa la siguiente lección para descubrir más.
