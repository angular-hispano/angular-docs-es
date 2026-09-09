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

## Verificar el estado de las traducciones

Después de actualizar el origen, estos comandos te dicen qué quedó pendiente:

```shell
npm run check-translations   # qué se desincronizó o quedó sin traducir
npm run lint-glossary        # consistencia terminológica del español
```

### `check-translations`

Distingue cinco estados. Los tres últimos son silenciosos: sin ellos, esos archivos se cuentan como correctos.

| Estado | Qué pasó |
| --- | --- |
| **Desactualizada** | Ya traducida, pero el inglés cambió después. El diff contra el `.en.md` del commit donde se tradujo es exactamente lo que falta. Separa la prosa del ruido de formato. |
| **Sin traducir** | No existe `.en.md`, así que `update-origin` copió el inglés directamente al `.md`. |
| **Sin respaldo** | El `.md` ya está en español pero le falta el `.en.md`. El próximo `update-origin` le escribe inglés encima: es pérdida de trabajo, no deuda pendiente. |
| **Desparejada** | Existe el `.en.md` pero no su `.md`. Casi siempre un typo al crear el respaldo. |
| **Huérfana** | Ya no existe en el original. `update-origin` nunca borra, así que sigue publicándose y su `.en.md` se compara consigo mismo para siempre. |

El chequeo de huérfanas necesita el submódulo; si no está inicializado te avisa en vez de dar el resultado por bueno.

Opciones:

```shell
npm run check-translations -- --diff              # mostrar los diffs completos
npm run check-translations -- --ref=<rama>        # verificar otra rama o un PR
```

Para revisar un PR antes de mergearlo:

```shell
git fetch origin pull/<N>/head:refs/tmp/pr<N>
npm run check-translations -- --ref=refs/tmp/pr<N>
```

### Crear los issues

Los issues de traducción se crean **a mano**, agrupados por sección, siguiendo la convención del repo:

```
[Angular 22.1] Traducir guías de Signal Forms
Traducir - Press Kit
```

`check-translations` te da la lista para componerlos, y `--json` la deja en un formato cómodo de recortar:

```shell
npm run check-translations -- --json
```

Se decidió no automatizarlo: agrupar por sección es una decisión editorial que un script no acierta, y un issue generado competiría como segunda fuente de verdad con los que ya se mantienen a mano.

### `lint-glossary`

Verifica que se usen los términos acordados. Las reglas viven en [`glosario.yml`](./glosario.yml) con formato `expected` / `pattern`. Ignora bloques de código, código en línea, enlaces y anchors `{#id}`, donde el vocabulario español no aplica.

Solo contiene términos inequívocos: una regla con falsos positivos hace que el linter se ignore, que es peor que no tenerlo. Los términos que dependen del contexto viven en el glosario completo del skill de traducción.

### Patrón 3 - Código de aplicación adev

Algunos archivos se han modificado para modificar la aplicación angular.dev.

- `sub-navigation-data.ts`

Si bien no es un archivo de contenido (markdown), manejaremos este archivo de la misma manera que un Markdown ya que debe ser traducido al español.