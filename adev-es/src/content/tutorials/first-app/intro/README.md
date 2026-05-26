# Construye tu primera aplicación Angular

Este tutorial consiste en lecciones que introducen los conceptos de Angular que necesitas conocer para comenzar a programar en Angular.

Puedes hacer tantas como quieras, o pocas, y puedes hacerlas en cualquier orden.

ÚTIL: ¿Prefieres video? También tenemos un [curso completo en YouTube](https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF&si=1q9889ulHp8VZ0e7) para este tutorial.

<docs-video src="https://www.youtube.com/embed/xAT0lHYhHMY?si=cKUW_MGn3MesFT7o"/>

## Antes de comenzar

Para obtener la mejor experiencia con este tutorial, revisa estos requisitos para asegurarte de que tienes lo necesario para tener éxito.

### Tu experiencia

Las lecciones en este tutorial asumen que tienes experiencia con lo siguiente:

1. Has creado una página web HTML editando el HTML directamente.
1. Has programado contenido de sitios web en JavaScript.
1. Has leído contenido de hojas de estilo en cascada (CSS) y entiendes cómo se usan los selectores.
1. Has usado instrucciones de línea de comandos para realizar tareas en tu computadora.

### Tu equipo

Estas lecciones se pueden completar usando una instalación local de las herramientas de Angular o en nuestro editor integrado. El desarrollo local de Angular se puede completar en sistemas Windows, MacOS o Linux.

NOTA: Busca alertas como esta, que señalan pasos que pueden ser solo para tu editor local.

## Vista previa conceptual de tu primera aplicación Angular

Las lecciones en este tutorial crean una aplicación Angular que lista casas en renta y muestra los detalles de casas individuales.
Esta aplicación utiliza características que son comunes a muchas aplicaciones Angular.

<img alt="Resultado de la página de inicio de la aplicación de viviendas" src="assets/images/tutorials/first-app/homes-app-landing-page.png">

## Entorno de desarrollo local

NOTA: ¡Este paso es solo para tu entorno local!

Realiza estos pasos en una herramienta de línea de comandos en la computadora que quieras usar para este tutorial.

<docs-workflow>

<docs-step title="Identifica la versión de `node.js` que Angular requiere">
Angular requiere una versión LTS activa o LTS de mantenimiento de Node. Confirmemos tu versión de `node.js`. Para obtener información sobre los requisitos de versión específicos, consulta la propiedad engines en el [archivo package.json](https://unpkg.com/browse/@angular/core@15.1.5/package.json).

Desde una ventana de **Terminal**:

1. Ejecuta el siguiente comando: `node --version`
1. Confirma que el número de versión mostrado cumple con los requisitos.
   </docs-step>

<docs-step title="Instala la versión correcta de `node.js` para Angular">
Si no tienes una versión de `node.js` instalada, sigue las [instrucciones de instalación en nodejs.org](https://nodejs.org/en/download/)
</docs-step>

<docs-step title="Instala la última versión de Angular">
Con `node.js` y `npm` instalados, el siguiente paso es instalar el [Angular CLI](tools/cli) que proporciona herramientas para el desarrollo efectivo de Angular.

Desde una ventana de **Terminal** ejecuta el siguiente comando: `npm install -g @angular/cli`.
</docs-step>

<docs-step title="Instala el entorno de desarrollo integrado (IDE)">
Eres libre de usar cualquier herramienta que prefieras para construir aplicaciones con Angular. Recomendamos lo siguiente:

1. [Visual Studio Code](https://code.visualstudio.com/)
2. Como paso opcional pero recomendado, puedes mejorar aún más tu experiencia de desarrollo instalando el [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
3. [WebStorm](https://www.jetbrains.com/webstorm/)
   </docs-step>

<docs-step title="Opcional: configura tu IDE con IA">

En caso de que estés siguiendo este tutorial en tu IDE con IA preferido, [consulta las reglas de prompt y mejores prácticas de Angular](/ai/develop-with-ai).

</docs-step>

</docs-workflow>

Para obtener más información sobre los temas cubiertos en esta lección, visita:

<docs-pill-row>
  <docs-pill href="/overview" title="¿Qué es Angular?"/>
  <docs-pill href="/tools/cli/setup-local" title="Configuración del entorno local y espacio de trabajo"/>
  <docs-pill href="/cli" title="Referencia del CLI de Angular"/>
</docs-pill-row>
