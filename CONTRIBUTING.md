# Contribución al proyecto angular-docs-es

## Configuración de origin

- `origin`: Manejo del repositorio `angular/angular`como un submódulo.
- `adev-es`:  Se administra el contenido de la documentación de Angular, aquí se encuentran los archivos traducidos y no traducidos en formato markdown.

## Configuración del directorio de adev

 Básicamente traduce archivos de Markdown en el directorio `content`.  Si es necesario, también puede agregar el código fuente de la aplicación.

```
origin/adev/
├── README.md
├── content # Archivos de recursos de documentación escritos en Markdown, HTML, etc. Traduzca principalmente los archivos aquí.
│   ├── best-pratices 
│   ├── ecosystem
│   ├── guide 
│   ├── introduction
│   ├── references 
│   ├── tools
│   ├── error.md
│   └── kitchen-sink.md
├── app # Contenido de la aplicación de angular.dev
...
```

## Creación de un problema de traducción

 Antes de comenzar el trabajo de traducción, vamos a comprobar si no hay nadie que está tratando de traducir el mismo archivo.  Si miras la etiqueta de [docs-translation](https://github.com/angular-hispano/angular-docs-es/labels/docs-translation), puedes ver el área en la que se está trabajando actualmente en la traducción.  Si desea hacer una nueva traducción, primero cree un [problema en Github](https://github.com/angular-hispano/angular-docs-es/issues) y complete la información de acuerdo con la plantilla.
 
## Crear una solicitud de extracción de traducción

 Empuja los cambios al repositorio donde bifurcaste `angular/angular-docs-es` y envía una solicitud de extracción a la fuente de bifurcación.  Las solicitudes de extracción se revisan y luego se fusionan si no hay problemas.
 
## Directrices para la traducción

 Para traducciones al español, por favor sigue las siguientes pautas.
 
### Guarda el texto original como un archivo.en.md

 Para gestionar el `diff` del texto original después de actualizar el origen, guarda el original en el momento de la traducción como un archivo `xx.en.md`.  Si desea traducir un documento nuevo, copie el archivo `xx.md` escrito en inglés al archivo `xx.en.md` y sobrescriba el archivo `xx.md` con la traducción al español.

 Si la traducción es parcial y no del documento completo, no necesitas duplicar/crear el archivo `xx.en.md` simplemente puedes trabajar sobre el archivo `xx.md` con la traducción al español.

### Alinear la posición de salto de línea con la original

 Siempre que sea posible, alinear el número de líneas en la fuente y la traducción, y ayudar a hacer la comprobación de diferencias más fácil al actualizar.

### Recomendaciones

- Bifurca este repositorio en tu espacio de trabajo de Github para poder colaborar de una manera más limpia y ordenada.

- Se recomienda encarecidamente firmar todos los commits que envíes al repositorio. Esto ayudará a mantener la integridad y la seguridad del código base, y a fomentar un entorno de colaboración más confiable entre los desarrolladores.

## Configura tu entorno local

### 1.  Clonación del repositorio

```
$ git clone git@github.com:angular-hispano/angular-docs-es.git
```

### 2. Sincronizar el repositorio de origen

Este repositorio utiliza submódulos para integrarse con el repositorio de origen (`angular/angular`).

```
$ git submodule sync
$ git submodule update --init
```

### 3. Instalar dependencias

```
$ npm install
```

### 4. Servidor de desarrollo
 
 Al iniciar el servidor local de desarrollo, puede traducir mientras comprueba el resultado de la compilación.

```
$ npm run start
```

 El navegador se iniciará automáticamente cuando el servidor local esté listo `adev-es` será reconstruido automáticamente al cambiar un archivo en el directorio.

  
 ### 5. Construye para producción
 
 Construye el proyecto desplegable con el siguiente comando.

```
$ npm run build
```

Cuando se completa la compilación, el resultado de la compilación se envía al directorio `build/dist/bin/adev/build`. Puedes configurar un servidor de desarrollo con tu herramienta favorita y comprobar los sitios construidos.

## Gracias por tu colaboración!

Esperamos que te unas a nosotros en este esfuerzo por hacer que la documentación de Angular sea más accesible para la comunidad hispanohablante.