
# Descubrir cuánto código estás probando

Angular CLI puede ejecutar pruebas unitarias y crear reportes de cobertura de código.
Los reportes de cobertura de código te muestran cualquier parte de tu código base que podría no estar correctamente probada por tus pruebas unitarias.

Para generar un reporte de cobertura ejecuta el siguiente comando en la raíz de tu proyecto.

<docs-code language="shell">
ng test --no-watch --code-coverage
</docs-code>

Cuando las pruebas estén completas, el comando crea un nuevo directorio `/coverage` en el proyecto.
Abre el archivo `index.html` para ver un reporte con tu código fuente y valores de cobertura de código.

Si quieres crear reportes de cobertura de código cada vez que pruebas, establece la siguiente opción en el archivo de configuración de Angular CLI, `angular.json`:

<docs-code language="json">
"test": {
  "options": {
    "codeCoverage": true
  }
}
</docs-code>

## Aplicación de cobertura de código

Los porcentajes de cobertura de código te permiten estimar cuánto de tu código está probado.
Si tu equipo decide sobre una cantidad mínima establecida para ser probada unitariamente, aplica este mínimo con Angular CLI.

Por ejemplo, supón que quieres que la base de código tenga un mínimo de 80% de cobertura de código.
Para habilitar esto, abre el archivo de configuración de la plataforma de pruebas [Karma](https://karma-runner.github.io), `karma.conf.js`, y agrega la propiedad `check` en la clave `coverageReporter:`.

<docs-code language="javascript">
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
</docs-code>

ÚTIL: Lee más sobre crear y ajustar la configuración de Karma en la [guía de pruebas](guide/testing#configuration).

La propiedad `check` hace que la herramienta aplique un mínimo de 80% de cobertura de código cuando las pruebas unitarias se ejecutan en el proyecto.

Lee más sobre opciones de configuración de cobertura en la [documentación de karma coverage](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md).
