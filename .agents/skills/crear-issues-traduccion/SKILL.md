---
name: crear-issues-traduccion
description: Crear los issues de traducción del pendiente, con título, etiquetas y criterios de aceptación según la convención del repo
---

# Crear issues de traducción

Convierte el pendiente detectado en issues de GitHub bien formados. El agrupado
lo calcula la herramienta; lo que aporta este skill es lo que un script no
acierta: **nombrar** cada lote y escribir sus criterios de aceptación.

## Paso 1 — Obtener el pendiente agrupado

```shell
npm run check-translations -- --issues
```

Devuelve lotes ya agrupados por carpeta, subiendo de nivel cuando una carpeta no
reúne suficientes archivos. Cada lote sale marcado con `← renombra esto`: ese es
tu trabajo.

Si necesitas los datos crudos —para contar, filtrar o ver los diffs—:

```shell
npm run check-translations -- --json
```

## Paso 2 — Comprobar qué ya existe

**Antes de crear nada.** El repo mantiene estos issues a mano y duplicarlos es
peor que no crearlos:

```shell
gh issue list --state open --limit 100 --search "traducir OR actualizar"
```

Si un lote ya tiene issue, no lo abras de nuevo. Si el issue existe pero le
faltan archivos que ahora sí detectamos, **coméntalo** en vez de abrir otro.

## Paso 3 — Componer el título

Cuatro patrones, todos sacados del historial del repo:

| Situación | Patrón | Ejemplos reales |
| --- | --- | --- |
| Una carpeta de guías | `Traducir - Guías de <X>` | Guías de Errores · Guías de SSR · Guías de Componentes |
| Un solo documento | `Traducir - Guía de <X>` | Guía de Seguridad · Guía de Tailwind · Guía Zoneless |
| Un tutorial | `Traducir - Tutorial <X>` | Tutorial Signals · Tutorial Learn Angular |
| Página con nombre propio | `Traducir - <Nombre>` | Press Kit · Roadmap · Releases |

Para traducciones desactualizadas, cambia el verbo: `Actualizar - Pasos del
tutorial Learn Angular`.

Si las páginas las trae una versión nueva de Angular, antepón la versión:
`[Angular 22.1] Traducir guías de Signal Forms`.

### Cómo nombrar la sección

La misma regla del glosario: **el descriptor va en español, el nombre de
producto o API se queda en inglés.**

- `reference/errors` → **Guías de Errores**
- `guide/forms/signals` → **Guías de Signal Forms** (no «Formularios de Señales»)
- `guide/di` → **Guías de Inyección de Dependencias**
- `tools/devtools` → **Guías de Devtools**
- `guide/zoneless` → **Guía Zoneless**

Ante la duda, **mira cómo se llama esa sección en el menú**: ahí ya está
traducida y decidida por alguien.

```shell
grep -n "label:" adev-es/src/app/routing/navigation-entries/index.ts | grep -i <sección>
```

Ese archivo es la mejor referencia de estilo que hay. Por ejemplo:

| En el menú | Qué enseña |
| --- | --- |
| `Enciclopedia de Errores` | el descriptor se traduce |
| `Inyección de Dependencias` | término establecido, en español |
| `Estado dependiente con linkedSignal` | el nombre de la API se queda en inglés |

Nunca uses la ruta como título. `reference/errors` es el dato de entrada, no el
nombre.

## Paso 4 — Elegir etiquetas

- `docs-translation` — **siempre**. El 17 % de los issues del repo no la tiene, y
  por eso las búsquedas por etiqueta no son fiables.
- `good first issue` — solo si el lote es pequeño (1–3 archivos), sin bloques de
  código complejos y sin terminología nueva.
- `help wanted` — cuando el lote es grande y conviene repartirlo.

No inventes etiquetas: usa las que existen (`gh label list`).

## Paso 5 — Escribir el cuerpo

Estructura fija:

```markdown
<una frase de contexto: de dónde salen estas páginas>

## Archivos

- [ ] `archivo.md`
- [ ] `otro.md`

## Criterios de aceptación

- [ ] Cada archivo tiene su `.en.md` con el original en inglés
- [ ] `npm run lint-glossary` no reporta problemas en los archivos tocados
- [ ] `npm run check-translations` ya no los lista
- [ ] Los prefijos de alerta (`NOTE:`, `TIP:`, `IMPORTANT:`…) siguen en inglés
- [ ] `.md` y `.en.md` van en el mismo commit
```

Para un lote de **actualización** los criterios cambian, porque el trabajo es otro:

```markdown
## Criterios de aceptación

- [ ] Solo se tocaron los bloques que cambiaron en el original
- [ ] `npm run verify-translation -- <ruta>` pasa en cada archivo
- [ ] `npm run check-translations` ya no los lista
- [ ] `.md` y `.en.md` van en el mismo commit
```

### Sobre los criterios

Son verificables con un comando, a propósito. Un criterio como «la traducción
suena natural» no se puede marcar como cumplido sin discutir; «`lint-glossary`
no reporta problemas» sí.

En los lotes de actualización, incluye el conteo de líneas por archivo que da la
herramienta: distingue el trabajo de dos minutos del de media hora y ayuda a
repartir.

## Paso 6 — Crear el issue

```shell
gh issue create \
  --title "Traducir - Guías de Errores" \
  --label docs-translation \
  --body-file cuerpo.md
```

Usa `--body-file`: pasar markdown largo con `--body` se rompe con las comillas y
los saltos de línea.

> [!IMPORTANT]
> Crear issues es una acción visible para toda la comunidad. **Enseña los
> borradores y espera confirmación antes de ejecutar `gh issue create`**, incluso
> si te pidieron crearlos. Un lote mal agrupado o mal nombrado hay que cerrarlo a
> mano después.

## Qué no hacer

- **No abrir un issue por archivo.** El repo agrupa por sección; 31 issues para
  31 archivos es ruido que nadie atiende.
- **No mezclar traducir con actualizar** en el mismo issue: el procedimiento es
  distinto y los criterios de aceptación también.
- **No incluir archivos huérfanos.** Si `check-translations` los lista como
  huérfanos, esas páginas ya no existen en el original: hay que borrarlas, no
  traducirlas.
- **No usar la ruta como título.**
