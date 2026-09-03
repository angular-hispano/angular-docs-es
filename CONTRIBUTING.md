# Guía de Contribución - angular-docs-es

¡Gracias por tu interés en contribuir a la documentación de Angular en español! Esta guía te ayudará a empezar.

## Tabla de Contenidos

- [Introducción](#introducción)
- [Glosario de Términos de GitHub](#glosario-de-términos-de-github)
- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Flujo de Trabajo para Contribuciones](#flujo-de-trabajo-para-contribuciones)
- [Configuración del Entorno Local](#configuración-del-entorno-local)
- [Directrices para la Traducción](#directrices-para-la-traducción)
- [Comandos Disponibles](#comandos-disponibles)
- [Solución de Problemas](#solución-de-problemas)
- [Recomendaciones](#recomendaciones)

## Introducción

Este proyecto es una traducción colaborativa de la documentación oficial de Angular al español, con el objetivo de hacer que los recursos de aprendizaje sean más accesibles para la comunidad hispanohablante.

## Glosario de Términos de GitHub

Si no estás familiarizado con GitHub, aquí te explicamos los términos más comunes que usaremos:

| Término | Significado |
|---------|-------------|
| **Fork** | Crear una copia completa de un repositorio en tu cuenta de GitHub. Te permite trabajar en tu propia versión sin afectar el proyecto original. |
| **Clone** | Descargar una copia del repositorio a tu computadora local. |
| **Branch** | Una rama es una versión paralela del código. Te permite trabajar en cambios sin afectar la rama principal (`main`). |
| **Commit** | Guardar cambios en tu repositorio local con un mensaje descriptivo. Es como una "fotografía" del estado de tu código en un momento específico. |
| **Push** | Enviar tus commits locales al repositorio remoto en GitHub. |
| **Pull** | Traer cambios desde el repositorio remoto a tu repositorio local. |
| **Pull Request (PR)** | Una solicitud para que tus cambios sean revisados e incorporados al proyecto original. Es donde se revisa y discute tu contribución. |
| **Issue** | Un problema, sugerencia o tarea pendiente. Se usa para rastrear el trabajo que debe hacerse. |
| **Merge** | Combinar cambios de una rama en otra. Por ejemplo, incorporar tu pull request a la rama `main`. |
| **Upstream** | El repositorio original del cual hiciste fork. Se usa para mantener tu fork actualizado. |
| **Remote** | Una versión del repositorio alojada en un servidor (como GitHub), a diferencia de tu copia local. |

> **Consejo:** No te preocupes si estos términos son nuevos para ti. Los irás aprendiendo mientras contribuyes al proyecto.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Git** (versión 2.0 o superior)
- **Node.js** (versión 16.13 o superior - recomendado 20+)
- **npm** (incluido con Node.js)
- **pnpm** (versión específica - ver [paso 4](#4-instalar-pnpm))
- Conocimientos básicos de:
  - Git y GitHub (fork, clone, commit, pull request)
  - Markdown
  - Angular (preferiblemente)

## Estructura del Proyecto

El proyecto está organizado en dos directorios principales:

### `origin/`
Submódulo de Git que apunta al repositorio oficial de `angular/angular`. Contiene el código fuente y documentación original en inglés.

### `adev-es/`
Contiene los archivos traducidos y personalizados para la versión en español:

```
adev-es/
├── src/
│   ├── app/           # Archivos personalizados de la app (navegación, footer, etc.)
│   └── content/       # 📝 Documentación en Markdown (¡traduce aquí!)
│       ├── best-practices/
│       ├── ecosystem/
│       ├── guide/
│       ├── introduction/
│       ├── reference/
│       ├── tools/
│       ├── error.md
│       └── kitchen-sink.md
```

### `build/`
Directorio generado automáticamente que combina los archivos de `origin/` con las traducciones de `adev-es/`.

## Flujo de Trabajo para Contribuciones

### 1. Verificar trabajo en progreso

Antes de comenzar a traducir, revisa los [issues con la etiqueta `docs-translation`](https://github.com/angular-hispano/angular-docs-es/labels/docs-translation) para asegurarte de que nadie más esté trabajando en el mismo archivo.

### 2. Crear un issue

Si deseas traducir un documento nuevo:

1. Ve a [GitHub Issues](https://github.com/angular-hispano/angular-docs-es/issues)
2. Crea un nuevo issue usando la plantilla de traducción
3. Indica qué archivo vas a traducir
4. Espera la asignación antes de comenzar

### 3. Hacer fork del repositorio

1. Haz clic en el botón "Fork" en la parte superior derecha del repositorio
2. Esto crea una copia del proyecto en tu cuenta de GitHub

### 4. Trabajar en tu traducción

1. Clona tu fork (ver [Configuración del Entorno Local](#configuración-del-entorno-local))
2. Crea un branch para tu traducción:
   ```bash
   git checkout -b translate-components-guide
   ```
3. Realiza tu traducción siguiendo las [Directrices para la Traducción](#directrices-para-la-traducción)
4. Prueba tus cambios localmente con `npm start`

### 5. Enviar Pull Request

1. Haz push de los cambios a tu fork:
   ```bash
   git add adev-es/src/content/guide/components.md adev-es/src/content/guide/components.en.md
   git commit -m "translate: components guide"
   git push origin translate-components-guide
   ```

   El mensaje del commit va **en inglés**, con prefijo `translate:` y
   `Fixes #<issue>` en el cuerpo. Lo que se traduce es la documentación, no el
   historial. Y el `.md` y su `.en.md` **en el mismo commit**: separarlos deja el
   archivo marcado como desactualizado de forma permanente.
2. Ve a tu fork en GitHub
3. Haz clic en "Compare & pull request"
4. Completa la descripción del PR con detalles de tu traducción
5. Espera la revisión del equipo

## Configuración del Entorno Local

### 1. Clonar tu fork

```bash
git clone git@github.com:TU-USUARIO/angular-docs-es.git
cd angular-docs-es
```

**Nota:** Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

### 2. Agregar el repositorio original como upstream (opcional pero recomendado)

```bash
git remote add upstream git@github.com:angular-hispano/angular-docs-es.git
```

Esto te permitirá mantener tu fork actualizado:

```bash
git fetch upstream
git merge upstream/main
```

### 3. Sincronizar el submódulo de origin

Este repositorio utiliza submódulos de Git para integrarse con el repositorio original de Angular:

```bash
git submodule sync
git submodule update --init
```

### 4. Instalar pnpm

Este proyecto requiere `pnpm` en una versión específica. La versión exacta se encuentra definida en `origin/package.json` bajo el campo `packageManager`.

**Opción A: Instalación con npm**

```bash
npm install -g pnpm@10.17.1
```

**Opción B: Instalación con Corepack (recomendado para Node.js 16.13+)**

```bash
corepack enable
corepack prepare pnpm@10.17.1 --activate
```

**Verificar instalación:**

```bash
pnpm --version
# Debería mostrar: 10.17.1
```

**⚠️ Importante:** Es crucial usar la versión exacta especificada en `origin/package.json` para garantizar la compatibilidad con el lockfile de pnpm y evitar errores durante la compilación.

### 5. Instalar dependencias

```bash
npm install
```

Este comando instala las dependencias del proyecto raíz definidas en `package.json`.

### 6. Iniciar el servidor de desarrollo

```bash
npm start
```

Este comando:
- Inicia el servidor local de desarrollo
- Abre automáticamente el navegador cuando esté listo
- Reconstruye automáticamente `adev-es` cuando cambias un archivo
- Te permite traducir mientras ves el resultado en tiempo real

**Primera vez o problemas de caché:**

Si es la primera vez que inicias el servidor, o si experimentas problemas de caché, ejecuta:

```bash
npm start -- --init
```

La opción `--init` reinicializa el directorio `build` desde cero.

### 7. Compilar para producción

Para generar una versión optimizada de producción:

```bash
npm run build
```

El resultado de la compilación se genera en la carpeta `build/dist`. 

## Directrices para la Traducción

### Guarda el original como archivo `.en.md` {#respaldo}

Cada traducción vive junto a un respaldo del original:

| Archivo | Qué contiene |
| --- | --- |
| `guide/x.md` | la traducción al español |
| `guide/x.en.md` | el inglés a partir del cual se tradujo |

Ese respaldo **no es opcional ni decorativo**: es lo único que le dice a
`update-origin` que ese archivo ya está traducido. Sin él, la próxima
sincronización con Angular lo trata como pendiente y le escribe el inglés
encima, sin aviso y en medio de un commit de cientos de archivos.

Además es lo que permite detectar después qué cambió en el original, comparando
el respaldo de entonces con el de ahora.

#### Al traducir una página nueva

```shell
# 1. Comprueba primero si ya tiene respaldo
ls adev-es/src/content/<ruta>.en.md

# 2. Si NO existe, créalo antes de tocar nada
cp adev-es/src/content/<ruta>.md adev-es/src/content/<ruta>.en.md

# 3. Ahora traduce el .md
```

> [!WARNING]
> Si el `.en.md` **ya existe**, no ejecutes ese `cp`. Escribirías español encima
> del respaldo y se perdería el registro de qué inglés se tradujo, dejando el
> archivo fuera de la detección para siempre.

Esto vale también para traducciones parciales: un archivo a medio traducir
necesita su respaldo igual que uno completo.

### Actualizar una traducción desactualizada {#actualizar}

Cuando Angular cambia una página que ya estaba traducida, **no se retraduce**:
se aplica al español únicamente el cambio que ocurrió en inglés. El resto de la
página ya está bien, y suele tener correcciones acumuladas que una retraducción
tiraría.

```shell
# Qué está desactualizado y desde cuándo
npm run check-translations

# Qué bloques hay que tocar, con su texto exacto
npm run plan-translation -- <ruta>.md

# Después de editar: comprueba que no se tocó nada más
npm run verify-translation -- <ruta>.md
```

`plan-translation` te dice a qué te enfrentas:

| Respuesta | Qué significa |
| --- | --- |
| `listo` | son cambios acotados; edita solo los bloques que lista |
| `manual` | es una reestructuración, no un delta: traduce esa sección entera, con la traducción actual delante como referencia de estilo |
| `solo-ruido` | el cambio no afecta al español (reformateo, URLs); no hay nada que hacer |

`verify-translation` comprueba cuatro cosas: que las líneas modificadas caigan
dentro de los bloques previstos, que la estructura siga correspondiendo al
original, que los enlaces internos resuelvan, y la terminología de lo que
tocaste.

### Antes de abrir el PR {#antes-del-pr}

```shell
npm run lint-glossary -- <ruta>   # terminología
npm run check-translations        # que el archivo ya no aparezca pendiente
```

Y commitea **`.md` y `.en.md` en el mismo commit**. Separarlos deja el archivo
marcado como desactualizado de forma permanente, porque la detección busca el
commit donde se tocaron ambos.

### Traduce el encabezado, conserva su anchor {#anchors}

El texto de un encabezado se traduce; el anchor por el que se le enlaza, no.
Fíjalo con `{#anchor}` usando el del inglés:

```markdown
<!-- original -->
### Actively supported versions

<!-- traducción -->
### Versiones con soporte activo {#actively-supported-versions}
```

Si no lo fijas, el anchor pasa a derivarse del español y **se rompen todos los
enlaces que apuntaban a ese encabezado**, incluidos los de páginas que no estás
tocando. El build valida los enlaces internos y falla:

```
Error: Link target "reference/releases#actively-supported-versions" in
adev/src/content/reference/versions.md does not exist in the defined guide routes.
```

**Los enlaces internos de la propia página también apuntan al anchor inglés:**
`[política de deprecación](#deprecation-policy)`, no `(#política-de-deprecación)`.
El build también valida esos y aborta:

```
Error: The file "adev/src/content/reference/releases.md" contains an anchor link
to "about:blank#política-de-deprecación" which does not exist in the document.
```

Antes de dar por buena una página, mira quién enlaza hacia ella:

```shell
grep -rn "reference/releases#" adev-es/src/content origin/adev/src/content
```

El arreglo correcto es fijar el anchor en tu encabezado, no reescribir el enlace
de la otra página.

### Alinear saltos de línea

Siempre que sea posible, mantén el mismo número de líneas entre el archivo original y la traducción. Esto facilita:
- La comparación con herramientas de diff
- La detección de cambios cuando se actualiza el origen
- La revisión del código

**Ejemplo:**

```markdown
<!-- Original (líneas 10-12) -->
Angular is a platform and framework for building
single-page client applications using HTML and
TypeScript.

<!-- Traducción (líneas 10-12) - mantener 3 líneas -->
Angular es una plataforma y marco de trabajo para
construir aplicaciones de cliente de una sola página
usando HTML y TypeScript.
```

### Términos técnicos

Algunos términos es mejor mantenerlos en inglés por ser ampliamente reconocidos en la comunidad de desarrollo:

**Mantener en inglés:**
- Component, Service, Directive, Pipe, Decorator, Signal
- TypeScript, JavaScript, HTML, CSS
- Framework
- Build, Deploy
- Términos de Git/GitHub: commit, push, pull, merge, branch, fork, issue, pull request

**Traducir al español:**
- Application → Aplicación
- Development → Desarrollo
- Tutorial → Tutorial
- Guide → Guía
- Feature → Característica/Funcionalidad
- Testing → Pruebas
- Debug → Depurar

> **Nota:** Cuando tengas dudas sobre un término, revisa traducciones existentes en el proyecto para mantener la consistencia.

### Ejemplos de código

- **SÍ traduce** las descripciones y explicaciones alrededor del código
- **SÍ traduce** los comentarios explicativos dentro del código (que explican qué hace algo)
- **NO traduzcas** nombres de variables, funciones, clases o propiedades en el código
- **NO traduzcas** comentarios técnicos con términos específicos de Angular (Component, Service, etc.)

**Ejemplo:**

```typescript
// ❌ NO traducir así:
export class HeroeComponent {
  // Este es el nombre del héroe
  nombreHeroe = 'Superman';
}

// ✅ SÍ traducir así:
export class HeroComponent {
  // El nombre del héroe que se muestra en la interfaz
  heroName = 'Superman';
}
```

> **Consejo:** Traduce los comentarios que ayudan a entender la lógica, pero mantén los términos técnicos en inglés.

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo con hot-reload |
| `npm start -- --init` | Reinicializa el build y luego inicia servidor |
| `npm run build` | Compila el proyecto para producción |
| `npm run update-origin` | Actualiza el submódulo origin a la última versión |
| `npm run check-translations` | Qué falta por traducir y qué se desactualizó |
| `npm run check-translations -- --issues` | Lo mismo, agrupado en lotes del tamaño de un issue |
| `npm run lint-glossary` | Revisa la terminología contra `glosario.yml` |
| `npm run plan-translation` | Qué bloques tocar en una traducción desactualizada |
| `npm run verify-translation` | Comprueba que solo se tocó lo previsto |
| `npm test` | Tests de las herramientas |
| `npm run deploy:staging` | Despliega a Firebase Hosting (staging) |
| `npm run deploy:prod` | Despliega a Firebase Hosting (producción) |

## Solución de Problemas

### Error: "No se puede encontrar el módulo pnpm"

**Problema:** El comando `npm run build` falla porque no encuentra pnpm.

**Solución:**
```bash
# Verifica que pnpm esté instalado
pnpm --version

# Si no está instalado o tiene versión incorrecta
npm install -g pnpm@10.17.1

# Verifica nuevamente
pnpm --version  # Debe mostrar 10.17.1
```

### Error: Submódulo no inicializado

**Problema:** El directorio `origin/` está vacío o falta contenido.

**Solución:**
```bash
git submodule sync
git submodule update --init --recursive
```

### Error: Caché corrupto o construcción inconsistente

**Problema:** Los cambios no se reflejan o aparecen errores extraños al compilar.

**Solución:**
```bash
# Limpia todo y reinicia
rm -rf build/ node_modules/
npm install
npm start -- --init
```

### El navegador no se abre automáticamente

**Problema:** El servidor inicia pero el navegador no se abre.

**Solución:**
Abre manualmente tu navegador en `http://localhost:4201`

## Recomendaciones

### Buenas prácticas de Git

- **Haz fork del repositorio** para mantener tu espacio de trabajo limpio y ordenado
- **Crea branches descriptivos** en inglés y con guiones: 
  - ✅ `translate-directives-guides`
  - ✅ `translate-http-client`
  - ✅ `fix-typos-signals`
  - ❌ `traduccion/guide-components` (evitar español)
  - ❌ `fix` o `update` (muy genérico)

- **Commits atómicos**: Un commit por concepto/archivo traducido

- **Mensajes de commit en inglés**: Seguimos las convenciones internacionales de open source
  ```bash
  # Formato: <tipo>: <descripción breve en inglés>
  
  # Para traducciones completas
  git commit -m "translate: translations for directives guides"
  git commit -m "translate: complete translation of components guide"
  
  # Para traducciones parciales
  git commit -m "translate: partial translation of pipes guide (basics section)"
  
  # Para correcciones
  git commit -m "fix: typos in signals overview"
  git commit -m "fix: broken links in routing guide"
  
  # Para actualizaciones
  git commit -m "docs: update contributing guidelines"
  ```

**Tipos de commit comunes:**
- `translate:` - Nuevas traducciones
- `fix:` - Correcciones de errores, typos, enlaces rotos
- `docs:` - Cambios en documentación del proyecto (como CONTRIBUTING.md)
- `chore:` - Tareas de mantenimiento, actualizaciones de dependencias

**Convenciones adicionales:**
- Usa minúsculas en el mensaje del commit
- Mantén el mensaje corto y descriptivo (idealmente menos de 72 caracteres)
- No termines el mensaje con punto
- Si necesitas más detalles, agrégalos en el cuerpo del commit:
  ```bash
  git commit -m "translate: complete translation of pipes guide" -m "Includes all examples and code snippets. Added translations for built-in pipes section."
  ```

> **Nota:** Mantenemos los commits en inglés para seguir las convenciones internacionales de proyectos open source y facilitar la colaboración con la comunidad global.

### Firma tus commits (recomendado)

Firmar commits ayuda a mantener la integridad y seguridad del código base:

```bash
# Configurar GPG (una sola vez)
git config --global user.signingkey TU_GPG_KEY_ID
git config --global commit.gpgsign true

# Los commits futuros se firmarán automáticamente
git commit -m "translate: complete translation of overview guide"
```

[Guía para configurar GPG en GitHub](https://docs.github.com/es/authentication/managing-commit-signature-verification)

### Calidad de la traducción

- **Lee el contexto completo** antes de traducir
- **Mantén el tono técnico** pero accesible
- **Revisa tu ortografía y gramática**
- **Prueba los ejemplos** si es posible
- **Pide feedback** cuando tengas dudas

### Comunicación

- **Comenta en el issue** si tienes dudas o necesitas ayuda
- **Actualiza el issue** con tu progreso
- **Sé receptivo al feedback** en las revisiones del PR
- **Agradece a los revisores** - son voluntarios como tú

## Recursos Útiles

- [Documentación oficial de Angular](https://angular.dev)
- [Repositorio angular/angular](https://github.com/angular/angular)
- [Guía de Markdown](https://www.markdownguide.org/basic-syntax/)
- [Convenciones para commits](https://www.conventionalcommits.org/es/)
- [Cómo usar Git y GitHub](https://docs.github.com/es/get-started)

---

## ¡Gracias por tu Colaboración! 🎉

Esperamos que te unas a nosotros en este esfuerzo por hacer que la documentación de Angular sea más accesible para la comunidad hispanohablante. Cada traducción, por pequeña que sea, hace una gran diferencia.

**¿Preguntas?** Abre un [issue](https://github.com/angular-hispano/angular-docs-es/issues) o únete a la conversación.

¡Feliz traducción! 🚀
