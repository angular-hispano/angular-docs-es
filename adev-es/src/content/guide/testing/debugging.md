# Depurar pruebas

Si tus pruebas no están funcionando como esperas, puedes inspeccionarlas y depurarlas en el navegador.

Depura specs en el navegador de la misma manera que depuras una aplicación.

1. Revela la ventana del navegador de Karma.
    Consulta [Configurar testing](guide/testing#set-up-testing) si necesitas ayuda con este paso.

1. Haz clic en el botón **DEBUG** para abrir una nueva pestaña del navegador y re-ejecutar las pruebas.
1. Abre las **Herramientas de Desarrollador** del navegador. En Windows, presiona `Ctrl-Shift-I`. En macOS, presiona `Command-Option-I`.
1. Selecciona la sección **Sources**.
1. Presiona `Control/Command-P`, y luego comienza a escribir el nombre de tu archivo de prueba para abrirlo.
1. Establece un breakpoint en la prueba.
1. Actualiza el navegador, y nota cómo se detiene en el breakpoint.

<img alt="Depuración de Karma" src="assets/images/guide/testing/karma-1st-spec-debug.png">
