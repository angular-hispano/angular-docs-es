# Actualizar el origen al contenido actual de angular.dev

## Flujo de trabajo

Para actualizar el origen que se encuentra en la carpeta `origin` simplemente debes ejecutar el comando `npm run update-origin` y debes pasar como primer argumento el id del commit que deseas actualizar.

Ejemplo: `npm run update-origin 123456789`

Este script se encargara se actualizar de actualizar la carpeta `origin` con el contenido del commit que se le pasa como argumento y adicional actualizara la carpeta `adev-es` si es necesario ya que esa carpeta contiente las guías de la documentación de Angular.

## Migración

### Patrón 1 - Archivos sin traducción

- `form-validation.md` (no traducido)
- `reactive-form.md`
- `structural-directives.md`

Si no hay ningún archivo traducido, se aplicará tal cual.

### Patrón 2 - Archivo con traducción

##### Si el cambio es pequeño

- `form-validation.en.md` (si tiene la extención `en.md` significa que ya está traducido, parcial o totalmente)
- `reactive-form.en.md`
- `structural-directives.en.md`

##### Si el cambio es pequeño

Si algún cambio requiere una nueva traducción, se reflejará en el archivo `xx.en.md`. Puedes agregar la traducción al archivo `xx.md`.

##### Si el cambio es grande

1. Copie el texto original en la parte correspondiente del archivo traducido, dejándolo sin traducir, para que tenga un estado mixto en inglés y español.

2. Cree un problema en Github solicitando traducciones para las partes no traducidas.

### Patrón 3 - Código de aplicación adev

Algunos archivos se han modificado para modificar la aplicación angular.dev.

- `sub-navigation-data.ts`

Si bien no es un archivo de contenido (markdown), manejaremos este archivo de la misma manera que un Markdown ya que debe ser traducido al español.