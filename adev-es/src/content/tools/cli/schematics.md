# Generando código usando schematics

Un schematic es un generador de código basado en plantillas que soporta lógica compleja.
Es un conjunto de instrucciones para transformar un proyecto de software generando o modificando código.
Los schematics se empaquetan en colecciones y se instalan con npm.

La colección de schematics puede ser una herramienta poderosa para crear, modificar y mantener cualquier proyecto de software, pero es particularmente útil para personalizar proyectos Angular para adaptarse a las necesidades particulares de tu propia organización.
Podrías usar schematics, por ejemplo, para generar patrones UI comúnmente usados o componentes específicos, usando plantillas o diseños predefinidos.
Usa schematics para hacer cumplir reglas y convenciones arquitectónicas, haciendo que tus proyectos sean consistentes e interoperables.

## Schematics para el Angular CLI

Los schematics son parte del ecosistema Angular.
El Angular CLI usa schematics para aplicar transformaciones a un proyecto de aplicación web.
Puedes modificar estos schematics y definir nuevos para hacer cosas como actualizar tu código para corregir cambios disruptivos en una dependencia, por ejemplo, o agregar una nueva opción de configuración o framework a un proyecto existente.

Los schematics que están incluidos en la colección `@schematics/angular` se ejecutan por defecto por los comandos `ng generate` y `ng add`.
El paquete contiene schematics nombrados que configuran las opciones que están disponibles para el CLI para sub-comandos de `ng generate`, como `ng generate component` y `ng generate service`.
Los sub-comandos para `ng generate` son abreviaciones para el schematic correspondiente.
Para especificar y generar un schematic particular, o una colección de schematics, usando la forma larga:

```shell

ng generate my-schematic-collection:my-schematic-name

```

or

```shell

ng generate my-schematic-name --collection collection-name

```

### Configurar schematics del CLI

Un esquema JSON asociado con un schematic le dice al Angular CLI qué opciones están disponibles para comandos y sub-comandos, y determina los valores predeterminados.
Estos valores predeterminados pueden sobrescribirse proporcionando un valor diferente para una opción en la línea de comandos.
Consulta [Configuración del Workspace](reference/configs/workspace-config) para información sobre cómo cambiar los valores predeterminados de las opciones de generación para tu workspace.

Los esquemas JSON para los schematics predeterminados usados por el CLI para generar proyectos y partes de proyectos están recopilados en el paquete [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular).
El esquema describe las opciones disponibles para el CLI para cada uno de los sub-comandos de `ng generate`, como se muestra en la salida de `--help`.

## Desarrollar schematics para librerías

Como desarrollador de librerías, puedes crear tus propias colecciones de schematics personalizados para integrar tu librería con el Angular CLI.

- Un _add schematic_ permite a los desarrolladores instalar tu librería en un workspace Angular usando `ng add`
- Los _generation schematics_ pueden decirle a los sub-comandos de `ng generate` cómo modificar proyectos, agregar configuraciones y scripts, y crear artefactos que están definidos en tu librería
- Un _update schematic_ puede decirle al comando `ng update` cómo actualizar las dependencias de tu librería y ajustar para cambios disruptivos cuando lanzas una nueva versión

Para más detalles sobre cómo se ven estos y cómo crearlos, consulta:

<docs-pill-row>
  <docs-pill href="tools/cli/schematics-authoring" title="Authoring Schematics"/>
  <docs-pill href="tools/cli/schematics-for-libraries" title="Schematics for Libraries"/>
</docs-pill-row>

### Add schematics

Un _add schematic_ típicamente se proporciona con una librería, para que la librería pueda agregarse a un proyecto existente con `ng add`.
El comando `add` usa tu gestor de paquetes para descargar nuevas dependencias e invoca un script de instalación que se implementa como un schematic.

Por ejemplo, el schematic [`@angular/material`](https://material.angular.dev/guide/schematics) le dice al comando `add` que instale y configure Angular Material y temas, y registre nuevos componentes iniciales que pueden crearse con `ng generate`.
Mira este como un ejemplo y modelo para tu propio add schematic.

Las librerías de socios y de terceros también soportan el Angular CLI con add schematics.
Por ejemplo, `@ng-bootstrap/schematics` agrega [ng-bootstrap](https://ng-bootstrap.github.io) a una aplicación, y `@clr/angular` instala y configura [Clarity de VMWare](https://clarity.design/documentation/get-started).

Un _add schematic_ también puede actualizar un proyecto con cambios de configuración, agregar dependencias adicionales \(como polyfills\), o crear código de inicialización específico del paquete.
Por ejemplo, el schematic `@angular/pwa` convierte tu aplicación en una PWA agregando un manifiesto de aplicación y service worker.

### Generation schematics

Los generation schematics son instrucciones para el comando `ng generate`.
Los sub-comandos documentados usan los schematics de generación de Angular predeterminados, pero puedes especificar un schematic diferente \(en lugar de un sub-comando\) para generar un artefacto definido en tu librería.

Angular Material, por ejemplo, proporciona generation schematics para los componentes UI que define.
El siguiente comando usa uno de estos schematics para renderizar un `<mat-table>` de Angular Material que está preconfigurado con un datasource para ordenamiento y paginación.

```shell

ng generate @angular/material:table <component-name>

```

### Update schematics

El comando `ng update` puede usarse para actualizar las dependencias de librerías de tu workspace.
Si no proporcionas opciones o usas la opción de ayuda, el comando examina tu workspace y sugiere librerías para actualizar.

```shell

ng update
We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    --------------------------------------------------------------------------------
    @angular/cdk                       7.2.2 -> 7.3.1           ng update @angular/cdk
    @angular/cli                       7.2.3 -> 7.3.0           ng update @angular/cli
    @angular/core                      7.2.2 -> 7.2.3           ng update @angular/core
    @angular/material                  7.2.2 -> 7.3.1           ng update @angular/material
    rxjs                                      6.3.3 -> 6.4.0           ng update rxjs

```

Si le pasas al comando un conjunto de librerías para actualizar, actualiza esas librerías, sus dependencias peer y las dependencias peer que dependen de ellas.

CONSEJO: Si hay inconsistencias \(por ejemplo, si las dependencias peer no pueden coincidir con un rango [semver](https://semver.io) simple\), el comando genera un error y no cambia nada en el workspace.

Recomendamos que no fuerces una actualización de todas las dependencias por defecto.
Intenta actualizar dependencias específicas primero.

Para más información sobre cómo funciona el comando `ng update`, consulta [Comando Update](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md).

Si creas una nueva versión de tu librería que introduce posibles cambios disruptivos, puedes proporcionar un _update schematic_ para habilitar que el comando `ng update` resuelva automáticamente cualquiera de esos cambios en el proyecto que se está actualizando.

Por ejemplo, supón que quieres actualizar la librería Angular Material.

```shell
ng update @angular/material
```

Este comando actualiza tanto `@angular/material` como su dependencia `@angular/cdk` en el `package.json` de tu workspace.
Si cualquiera de los paquetes contiene un update schematic que cubre la migración desde la versión existente a una nueva versión, el comando ejecuta ese schematic en tu workspace.
