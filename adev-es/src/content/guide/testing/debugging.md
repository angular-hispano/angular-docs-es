# Depurar pruebas

Si tus pruebas no están funcionando como esperas, puedes depurarlas tanto en el entorno predeterminado de Node.js como en un navegador real.

## Depurar en Node.js

Depurar en el entorno predeterminado de Node.js suele ser la forma más rápida de diagnosticar problemas que no están relacionados con APIs específicas del navegador o renderizado.

1.  Ejecuta el comando `ng test` con la bandera `--debug`:
    ```shell
    ng test --debug
    ```
2.  El ejecutor de pruebas se iniciará en modo debug y esperará a que se adjunte un depurador.
3.  Ahora puedes adjuntar tu depurador preferido. Por ejemplo, puedes usar el depurador integrado de Node.js en VS Code o Chrome DevTools para Node.js.

## Depurar en un navegador

Depurar en un navegador se recomienda para pruebas que dependen del DOM u otras APIs específicas del navegador. Este enfoque te permite usar las herramientas de desarrollador del propio navegador.

1.  Asegúrate de tener un proveedor de navegador instalado. Consulta [Ejecutar pruebas en un navegador](guide/testing/overview#ejecutar-pruebas-en-un-navegador) para instrucciones de configuración.
2.  Ejecuta el comando `ng test` con las banderas `--browsers` y `--debug`:
    ```shell
    ng test --browsers=chromium --debug
    ```
3.  Este comando ejecuta las pruebas en un navegador con interfaz gráfica y lo mantiene abierto después de que las pruebas terminen, permitiéndote inspeccionar la salida.
4.  Abre las **Herramientas de Desarrollador** del navegador. En Windows, presiona `Ctrl-Shift-I`. En macOS, presiona `Command-Option-I`.
5.  Ve a la pestaña **Sources**.
6.  Usa `Control/Command-P` para buscar y abrir tu archivo de prueba.
7.  Establece un breakpoint en tu prueba.
8.  Recarga la interfaz del ejecutor de pruebas en el navegador. La ejecución ahora se detendrá en tu breakpoint.
