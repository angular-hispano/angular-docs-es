# Patrón App shell

El [patrón App shell](https://developer.chrome.com/blog/app-shell) es una forma de renderizar una parte de tu aplicación usando una ruta en tiempo de compilación.
Puede mejorar la experiencia de usuario al lanzar rápidamente una página estática renderizada (un esqueleto común a todas las páginas) mientras el navegador descarga la versión completa del cliente y cambia a ella automáticamente cuando el código termina de cargar.

Esto brinda a las personas usuarias un primer render significativo de tu aplicación que aparece rápidamente porque el navegador puede mostrar el HTML y el CSS sin necesidad de inicializar JavaScript.

<docs-workflow>
<docs-step title="Preparar la aplicación">
Hazlo con el siguiente comando de Angular CLI:

```shell
ng new my-app
```

Para una aplicación existente, debes agregar manualmente el `Router` y definir un `<router-outlet>` dentro de tu aplicación.
</docs-step>
<docs-step title="Crear el shell de la aplicación">
Usa Angular CLI para crear automáticamente el shell de la aplicación.

```shell
ng generate app-shell
```

Para obtener más información sobre este comando, consulta [App shell command](cli/generate/app-shell).

El comando actualiza el código de la aplicación y agrega archivos adicionales a la estructura del proyecto.

<docs-code language="text">
src
├── app
│ ├── app.config.server.ts # configuración de la aplicación del servidor
│ └── app-shell # componente app-shell
│   ├── app-shell.component.html
│   ├── app-shell.component.scss
│   ├── app-shell.component.spec.ts
│   └── app-shell.component.ts
└── main.server.ts # arranque principal de la aplicación del servidor
</docs-code>

<docs-step title="Verificar que la aplicación se construye con el contenido del shell">

```shell
ng build --configuration=development
```

O usa la configuración de producción.

```shell
ng build
```

Para verificar el resultado de la compilación, abre <code class="no-auto-link">dist/my-app/browser/index.html</code>.
Busca el texto predeterminado `app-shell works!` para confirmar que la ruta del shell de la aplicación se renderizó como parte de la salida.
</docs-step>
</docs-workflow>
