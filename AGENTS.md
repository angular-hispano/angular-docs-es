---
trigger: always_on
---

Este repositorio es la traducción al español de la documentación de Angular
(angular.dev → angular.lat). Esta guía es para agentes de IA que trabajen aquí.

**Escribe siempre en español**: commits, PRs, issues, comentarios de código y
respuestas. El proyecto entero está en español.

## Cómo está montado

No es una copia del sitio, es una **capa de traducción**:

- `origin/` — submódulo con el `angular/angular` en inglés, fijado a un SHA.
- `adev-es/` — solo lo traducido. El build copia `origin` entero y superpone
  `adev-es` encima, así que lo que no esté traducido sale en inglés y no rompe.
- `xxx.md` es la traducción; `xxx.en.md` es el inglés del que se partió.

Ese respaldo `.en.*` **no es opcional**: es lo único que le dice a
`update-origin` que el archivo ya está traducido. Sin él, la siguiente
sincronización le escribe el inglés encima sin aviso. Vale para cualquier
extensión, no solo `.md` — la navegación y el pie de página son `.ts` y `.html`.

## Comandos

```shell
npm run check-translations    # qué falta traducir y qué se desactualizó
npm run lint-glossary         # terminología contra glosario.yml
npm run plan-translation      # qué bloques tocar en una traducción desactualizada
npm run verify-translation    # comprueba que solo se tocó lo previsto
npm test                      # tests de las herramientas
npm run build                 # compila el sitio
```

## Documentación

- [CONTRIBUTING.md](CONTRIBUTING.md) — flujo completo. Anclas útiles:
  [`#respaldo`](CONTRIBUTING.md#respaldo),
  [`#actualizar`](CONTRIBUTING.md#actualizar),
  [`#antes-del-pr`](CONTRIBUTING.md#antes-del-pr).
- [UPDATE-ORIGIN.md](UPDATE-ORIGIN.md) — sincronizar con una versión nueva.
- [glosario.yml](glosario.yml) — reglas de terminología, cada una con su motivo.

## Reglas que rompen cosas si se ignoran

- **`.md` y `.en.md` van en el mismo commit.** Separarlos deja el archivo
  marcado como desactualizado de forma permanente: la detección busca el commit
  que tocó ambos.
- **No repitas `cp archivo.md archivo.en.md`** si el `.en.md` ya existe.
  Escribirías español sobre el respaldo y se perdería el registro del original.
- **Los prefijos de alerta se quedan en inglés**: `NOTE:`, `TIP:`, `IMPORTANT:`,
  `HELPFUL:`, `CRITICAL:`, `SUMMARY:`, `QUESTION:`. Son claves del tokenizer de
  adev, no prosa; traducirlas hace que el aviso se renderice como párrafo plano.
  Traduce solo el texto que sigue.
- **No traduzcas código, rutas, URLs ni nombres de API.** Sí los comentarios
  dentro del código y los atributos con prosa visible (`title=`, `header=`).
- **Mantén el número de líneas** entre el original y la traducción cuando se
  pueda: es lo que hace legibles los diffs futuros.

## Al actualizar una traducción desactualizada

No se retraduce: se aplica solo el cambio que ocurrió en inglés. Lee el
documento completo en ambos idiomas —la traducción existente es la mejor
referencia de terminología y registro— pero edita únicamente los bloques que
indique `plan-translation`.

## Issues y PRs

- Usa la CLI `gh`.
- Los issues de traducción se agrupan **por sección**, no uno por archivo, y
  siguen la convención del repo: `Traducir - Guías de X`, `Actualizar - X`,
  con prefijo de versión cuando aplica: `[Angular 22.1] Traducir …`.
- Etiqueta siempre con `docs-translation`.
- Antes de crear issues, comprueba con `gh issue list` qué existe ya: el repo
  los mantiene a mano y duplicarlos es peor que no crearlos.

## Skills

Viven en `.agents/skills/<nombre>/SKILL.md`, que es el nombre neutro y el que
lee Antigravity directamente.

`.claude/skills` es un **enlace simbólico** a esa carpeta: Claude Code espera su
propia ruta pero usa el mismo formato, así que no hay copias que sincronizar. Si
añades un skill, aparece en ambos sitios solo.
