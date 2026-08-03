# Depurar pruebas

Si tus pruebas no están funcionando como esperas, puedes depurarlas tanto en el entorno predeterminado de Node.js como en un navegador real.

## Depurar en Node.js {#debugging-in-nodejs}

Depurar en el entorno predeterminado de Node.js suele ser la forma más rápida de diagnosticar problemas que no están relacionados con APIs específicas del navegador o renderizado.

1.  Ejecuta el comando `ng test` con la bandera `--debug`:
    ```shell
    ng test --debug
    ```
2.  El ejecutor de pruebas se iniciará en modo debug y esperará a que se adjunte un depurador.
3.  Ahora puedes adjuntar tu depurador preferido. Por ejemplo, puedes usar el depurador integrado de Node.js en VS Code o Chrome DevTools para Node.js.

## Depurar en un navegador {#debugging-in-a-browser}

De la misma forma en que inicias una sesión de depuración en Node, puedes usar `ng test` con la bandera `--debug` con Vitest y el [modo navegador](/guide/testing/migrating-to-vitest#5-configure-browser-mode-optional).

El ejecutor de pruebas se iniciará en modo debug y esperará a que abras las herramientas de desarrollador del navegador para depurar las pruebas.
