# ¿Qué son las vistas diferibles?

Una página Angular completamente renderizada puede contener muchos componentes, directivas y pipes diferentes. Si bien ciertas partes de la página deberían mostrarse al usuario de inmediato, puede haber porciones que pueden esperar para mostrarse hasta más tarde.
Las _vistas diferibles (deferrable views)_ de Angular, usando la sintaxis `@defer`, pueden ayudarte a acelerar tu aplicación indicándole a Angular que espere para descargar el JavaScript de las partes de la página que no necesitan mostrarse de inmediato.

En esta actividad, aprenderás cómo usar vistas diferibles para cargar de forma diferida una sección de la plantilla de tu componente.

<hr>

<docs-workflow>

<docs-step title="Agrega un bloque `@defer` a una sección de una plantilla">
En tu `app.ts`, envuelve el componente `article-comments` con un bloque `@defer` para cargarlo de forma diferida.

<docs-code language="angular-html">
@defer {
  <article-comments />
}
</docs-code>

Por defecto, `@defer` carga el componente `article-comments` cuando el navegador está inactivo.

En la consola de desarrollador de tu navegador, puedes ver que el archivo del chunk lazy `article-comments-component` se carga por separado (Los nombres de archivo específicos pueden cambiar de una ejecución a otra):

<docs-code language="markdown">
Initial chunk files | Names                      |  Raw size
chunk-NNSQHFIE.js   | -                          | 769.00 kB | 
main.js             | main                       | 229.25 kB |

Lazy chunk files | Names | Raw size
chunk-T5UYXUSI.js | article-comments-component | 1.84 kB |
</docs-code>

</docs-step>
</docs-workflow>

¡Excelente trabajo! Has aprendido los conceptos básicos de las vistas diferibles.
