# Usar Tailwind CSS con Angular

[Tailwind CSS](https://tailwindcss.com/) es un framework CSS de utilidades que se puede usar para construir sitios web modernos sin salir de tu HTML. Esta guía te mostrará cómo configurar Tailwind CSS en tu proyecto Angular.

## Configuración automatizada con `ng add`

Angular CLI proporciona una forma simplificada de integrar Tailwind CSS en tu proyecto usando el comando `ng add`. Este comando instala automáticamente los paquetes necesarios, configura Tailwind CSS y actualiza la configuración de compilación de tu proyecto.

Primero, navega al directorio raíz de tu proyecto Angular en una terminal y ejecuta el siguiente comando:

```shell
ng add tailwindcss
```

Este comando realiza las siguientes acciones:

- Instala `tailwindcss` y sus dependencias.
- Configura el proyecto para usar Tailwind CSS.
- Agrega la declaración `@import` de Tailwind CSS a tus estilos.

Después de ejecutar `ng add tailwindcss`, puedes comenzar inmediatamente a usar las clases de utilidad de Tailwind en las plantillas de tus componentes.

## Configuración manual (Método alternativo)

Si prefieres configurar Tailwind CSS manualmente, sigue estos pasos:

### 1. Crear un proyecto Angular

Primero, crea un nuevo proyecto Angular si aún no tienes uno configurado.

```shell
ng new my-project
cd my-project
```

### 2. Instalar Tailwind CSS

A continuación, abre una terminal en el directorio raíz de tu proyecto Angular y ejecuta el siguiente comando para instalar Tailwind CSS y sus dependencias:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
</docs-code-multifile>

### 3. Configurar los plugins de PostCSS

A continuación, agrega un archivo `.postcssrc.json` en la raíz del proyecto.
Agrega el plugin `@tailwindcss/postcss` a tu configuración de PostCSS.

```json {header: '.postcssrc.json'}

{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 4. Importar Tailwind CSS

Agrega un `@import` a `./src/styles.css` que importe Tailwind CSS.

<docs-code language="css" header="src/styles.css">
@import "tailwindcss";
</docs-code>

Si estás usando SCSS, agrega `@use` a `./src/styles.scss`.

<docs-code language="scss" header="src/styles.scss">
@use "tailwindcss";
</docs-code>

### 5. Comenzar a usar Tailwind en tu proyecto

Ahora puedes comenzar a usar las clases de utilidad de Tailwind en las plantillas de tus componentes para estilizar tu aplicación. Ejecuta el proceso de compilación con `ng serve` y deberías ver el encabezado estilizado.

Por ejemplo, puedes agregar lo siguiente a tu archivo `app.html`:

```html
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
```

## Recursos adicionales

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
