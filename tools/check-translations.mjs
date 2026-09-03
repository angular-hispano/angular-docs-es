import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { $, chalk, argv, glob } from 'zx';
import { copyTargets, enPathOf, isEnFile, matchesTarget, sourcePathOf } from './lib/targets.mjs';
import { agrupar, esMiscelanea, relativo } from './lib/grouping.mjs';

const ROOT = resolve(import.meta.dirname, '..');

/**
 * Verifica el estado de sincronización de las traducciones.
 *
 * Detecta los cinco estados que `update-origin` puede dejar atrás. Los tres
 * últimos son silenciosos: sin ellos, esos archivos se cuentan como correctos.
 *
 * 1. DESACTUALIZADA — ya traducida, pero el inglés cambió después.
 *    `update-origin` sobrescribe el `.en.md` con el inglés nuevo, así que el
 *    `.en.md` tal como estaba en el commit donde se tocó por última vez el `.md`
 *    es el inglés vigente al traducir. El diff contra el `.en.md` actual es
 *    exactamente lo que falta traducir.
 *
 * 2. SIN TRADUCIR — no existe `.en.md`, así que `update-origin` copió el inglés
 *    directamente al `.md`. Páginas en inglés publicadas en el sitio español.
 *
 * 3. SIN RESPALDO — el `.md` ya está en español pero no tiene `.en.md`. El
 *    próximo `update-origin` la trata como no traducida y le escribe inglés
 *    encima: es pérdida de trabajo, no deuda pendiente.
 *
 * 4. DESPAREJADA — existe el `.en.md` pero no su `.md`. Casi siempre un typo al
 *    crear el respaldo, y deja la traducción sin proteger.
 *
 * 5. HUÉRFANA — el original ya no existe upstream. `update-origin` nunca borra,
 *    así que la página sigue publicada en español pese a haber desaparecido de
 *    angular.dev, y su `.en.md` se compara consigo mismo para siempre.
 *
 * No requiere metadata adicional: el historial de git ya contiene todo.
 *
 * Uso:
 *   npm run check-translations
 *   npm run check-translations -- --ref=refs/tmp/pr192   (verificar otra rama)
 *   npm run check-translations -- --diff                 (mostrar los diffs)
 *   npm run check-translations -- --json                 (salida para automatización)
 *   npm run check-translations -- --issues               (borradores de issue por lote)
 */

$.verbose = false;

const ES_DIR = 'adev-es';
const CONTENT_DIR = `${ES_DIR}/src/content`;

/**
 * Ruta corta para los reportes. Los archivos de contenido pierden el prefijo
 * entero; el resto conserva `src/`, que basta para distinguirlos de un vistazo.
 */
function short(file) {
  return file.startsWith(`${CONTENT_DIR}/`)
    ? file.slice(CONTENT_DIR.length + 1)
    : file.replace(`${ES_DIR}/`, '');
}

/** Agrupa los archivos por sección para que los reportes sean navegables. */
function categorize(path) {
  const p = path.replace(`${CONTENT_DIR}/`, '');
  const [top] = p.split('/');
  const known = [
    'guide',
    'tutorials',
    'reference',
    'best-practices',
    'tools',
    'ecosystem',
    'ai',
    'cli',
    'examples',
  ];
  return known.includes(top) ? top : 'other';
}

// Cambios que no afectan la traducción: migración de markup y normalización de
// enlaces que upstream aplica masivamente.
const NOISE_PATTERNS = [/^\s*<\/?docs-code[^>]*>\s*$/, /^\s*```/, /^\s*$/];
const URL_NOISE = /https:\/\/angular\.dev\//;

try {
  const ref = argv.ref ?? 'HEAD';

  const all = await listFiles(ref);
  const present = new Set(all);

  // El alcance sale de los mismos objetivos que copia `update-origin`, para que
  // ambas herramientas nunca discrepen sobre qué está en juego. Se calcula sobre
  // la lista de archivos de la referencia, no sobre el disco: al auditar una
  // rama, sus archivos nuevos tienen que contar.
  const sources = all.filter(
    (f) => !isEnFile(f) && copyTargets.some((t) => matchesTarget(f.replace(`${ES_DIR}/`, ''), t))
  );
  const originFiles = await listOrigin(ref);

  const stale = [];
  const untranslated = [];
  const unprotected = [];
  const orphans = [];
  const unpaired = [];
  const skipped = [];
  let synced = 0;

  // Desparejado: un respaldo cuyo `.md` no existe. Casi siempre es un typo en el
  // nombre al crearlo, y el efecto es doble y silencioso: la traducción queda sin
  // protección frente a `update-origin`, y el respaldo nunca se actualiza. Es
  // exactamente lo que pasó con translations-files.en.md.
  for (const f of all) {
    if (!isEnFile(f)) continue;
    if (!present.has(sourcePathOf(f))) unpaired.push(f);
  }

  // Huérfano: existe en adev-es pero ya no en el original.
  //
  // Se recorre TODO adev-es, no solo lo que se copia: un archivo puede haber
  // entrado legítimamente en su día —como un recurso localizado— y quedarse
  // atrás cuando upstream rediseñó. El build lo compila igual (BUILD.bazel usa
  // glob sobre src/**), así que viaja a producción como HTML inalcanzable.
  //
  // Los respaldos .en.* se saltan a propósito: no existen upstream por diseño.
  // Cuando su traducción es huérfana, se borran junto a ella.
  const orphanSet = new Set();
  if (originFiles) {
    for (const f of all) {
      if (isEnFile(f)) continue;
      if (!originFiles.has(f.replace(`${ES_DIR}/`, ''))) {
        orphans.push(f);
        orphanSet.add(f);
      }
    }
  }

  const live = ref === 'HEAD';

  for (const md of sources) {
    const en = enPathOf(md);

    // Ya contabilizada como huérfana arriba. Sin este corte acabaría además en
    // "sin traducir", pidiéndole a la comunidad que traduzca una página muerta.
    if (orphanSet.has(md)) continue;

    if (!present.has(en)) {
      // Sin respaldo hay dos situaciones muy distintas: que el archivo siga
      // igual que en el original (pendiente, lo normal), o que ya se haya
      // adaptado y le falte el `.en.*`. Lo segundo es pérdida de trabajo
      // inminente: el próximo `update-origin` lo trata como pendiente y le
      // escribe encima, y eso vale para cualquier extensión, no solo .md.
      //
      // Comparar contra el original es exacto. La detección de idioma queda de
      // respaldo para cuando el submódulo no está: no sabe clasificar un
      // archivo sin prosa, y por eso links.ts —adaptado a los enlaces de
      // Angular Hispano— pasaba por pendiente.
      const original = resolve(ROOT, 'origin/adev', md.replace(`${ES_DIR}/`, ''));
      let adaptado;
      if (live && existsSync(original)) {
        adaptado = readFileSync(original, 'utf8') !== readFileSync(resolve(ROOT, md), 'utf8');
      } else {
        const text = live
          ? readFileSync(resolve(ROOT, md), 'utf8')
          : (await $`git show ${ref}:${md}`.nothrow()).stdout;
        adaptado = looksSpanish(text);
      }
      (adaptado ? unprotected : untranslated).push(md);
      continue;
    }

    const base = await baselineFor(md, en, ref);
    if (!base) {
      skipped.push({ file: md, why: 'sin baseline en el historial' });
      continue;
    }

    const before = (await $`git rev-parse ${base.sha}:${en}`.nothrow()).stdout.trim();

    // Sobre HEAD se compara contra el ÁRBOL DE TRABAJO, no contra el commit.
    // `update-origin` deja los `.en.md` modificados sin commitear, y leer HEAD
    // hacía que el reporte dijera "todo sincronizado" justo después de traer
    // los cambios del original — el momento con más trabajo pendiente.
    const now = live
      ? (await $`git hash-object ${en}`.nothrow()).stdout.trim()
      : (await $`git rev-parse ${ref}:${en}`.nothrow()).stdout.trim();

    if (!before || !now) {
      skipped.push({ file: md, why: 'no se pudo leer el blob del original' });
      continue;
    }

    if (before === now) {
      synced++;
      continue;
    }

    const diff = live
      ? (await $`git diff ${base.sha} -- ${en}`.nothrow()).stdout
      : (await $`git diff ${base.sha} ${ref} -- ${en}`.nothrow()).stdout;
    stale.push({
      file: en,
      source: md,
      category: categorize(md),
      since: base.sha.slice(0, 7),
      baselineKind: base.kind,
      ...classify(diff),
    });
  }

  const payload = { stale, untranslated, unprotected, orphans, unpaired, skipped, synced,
                    analyzed: sources, originAvailable: originFiles !== null };

  if (argv.json) {
    reportJson(payload);
  } else if (argv.issues) {
    reportIssues(payload);
  } else {
    report({ ...payload, ref });
  }

  const blocking =
    stale.filter((s) => s.prose > 0).length +
    untranslated.length + unprotected.length + orphans.length + unpaired.length;
  process.exit(blocking > 0 ? 1 : 0);
} catch (err) {
  console.error(chalk.red(err));
  process.exit(1);
}

/**
 * Lista los archivos traducibles de `adev-es`.
 *
 * Sobre el árbol de trabajo incluye los NO trackeados, porque justo después de
 * `update-origin` las páginas nuevas todavía no están commiteadas: listarlas
 * solo con `ls-tree` hacía que el reporte dijera que todo está bien
 * precisamente en el momento en que más trabajo pendiente hay.
 */
async function listFiles(ref) {
  const split = (s) => s.trim().split('\n').filter(Boolean);

  if (ref !== 'HEAD') {
    return split((await $`git ls-tree -r --name-only ${ref} -- ${ES_DIR}`).stdout);
  }

  const tracked = split((await $`git ls-files --cached -- ${ES_DIR}`).stdout);
  const untracked = split((await $`git ls-files --others --exclude-standard -- ${ES_DIR}`).stdout);
  return [...new Set([...tracked, ...untracked])].sort();
}

/**
 * Los archivos del original, para detectar huérfanos: los que existían en
 * `adev-es` pero ya no están upstream.
 *
 * Devuelve null si el submódulo no está inicializado. Se avisa en el reporte en
 * vez de dar el chequeo por bueno: no poder comprobarlo no es lo mismo que no
 * tener huérfanos.
 */
async function listOrigin(ref) {
  const dir = resolve(ROOT, 'origin/adev');
  if (!existsSync(dir)) return null;

  // El submódulo montado corresponde a HEAD. Si se audita otra referencia que
  // apunta a un origin distinto —un PR que sube de versión, por ejemplo—,
  // comparar contra el que está en disco marcaría como huérfano todo lo que esa
  // versión añadió. Mejor no responder que responder mal.
  if (ref !== 'HEAD') {
    const here = (await $`git rev-parse HEAD:origin`.nothrow()).stdout.trim();
    const there = (await $`git rev-parse ${ref}:origin`.nothrow()).stdout.trim();
    if (here && there && here !== there) return null;
  }

  // Se listan TODOS los archivos del original, no solo los que se copian. La
  // pregunta que hay que poder responder es "¿esta ruta existe upstream?", y
  // limitarla a los objetivos de copia daría falsos positivos con cualquier
  // archivo de adev-es que viva fuera de ellos.
  const files = await glob('**/*', { cwd: dir, onlyFiles: true });
  return files.length ? new Set(files) : null;
}

/**
 * ¿El texto está en español? Heurística por palabras funcionales, que en prosa
 * técnica separa los dos idiomas con holgura. Se exige margen claro para no
 * marcar como traducido un archivo inglés que cite algo en español.
 */
function looksSpanish(text) {
  const body = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<docs-[\s\S]*?>/g, ' ')
    .toLowerCase();

  const count = (words) =>
    words.reduce((n, w) => n + (body.match(new RegExp(`\\b${w}\\b`, 'g')) ?? []).length, 0);

  const es = count(['que', 'para', 'los', 'las', 'con', 'una', 'del', 'este', 'cuando', 'puedes', 'debes', 'como']);
  const en = count(['the', 'and', 'you', 'this', 'with', 'for', 'that', 'from', 'can', 'your']);

  return es > 5 && es > en * 1.5;
}

/**
 * El commit desde el que medir: el más reciente que tocó el `.md` Y el `.en.md`.
 *
 * Exigir ambos no es un detalle. Si solo se pide el `.md`, cualquier commit de
 * mantenimiento sobre la traducción —un typo, un enlace— adelanta la referencia
 * y todo el inglés que había cambiado antes deja de contarse. El archivo pasa a
 * "sincronizado" sin que nadie lo haya traducido. Ya ocurrió: `01c0889`
 * (chore: remove Twitter/X references) tocó varios `.md` sin sus `.en.md`.
 *
 * Se resuelve con una sola pasada de `git log` sobre ambas rutas.
 */
async function baselineFor(md, en, ref) {
  const out = (await $`git log --format=%x00%H --name-only ${ref} -- ${md} ${en}`.nothrow()).stdout;

  for (const entry of out.split('\0')) {
    const lines = entry.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const [sha, ...files] = lines;
    if (files.includes(md) && files.includes(en)) return { sha, kind: 'ambos' };
  }

  // Sin commit conjunto, la referencia es donde nació el snapshot inglés: desde
  // ahí, todo cambio del original es trabajo pendiente.
  const added = (await $`git log --format=%H --diff-filter=A ${ref} -- ${en}`.nothrow()).stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .pop();

  return added ? { sha: added, kind: 'alta-del-snapshot' } : null;
}

/**
 * Separa los cambios de prosa real del ruido de formato, para que el reporte
 * sea accionable en vez de un conteo de líneas inflado. Es una heurística
 * deliberadamente conservadora: prefiere marcar de más que dejar pasar algo.
 */
function classify(diff) {
  const lines = diff.split('\n').filter((l) => /^[+-]/.test(l) && !/^[+-]{3}/.test(l));

  let prose = 0;
  let noise = 0;

  for (const line of lines) {
    const content = line.slice(1);
    if (NOISE_PATTERNS.some((p) => p.test(content)) || URL_NOISE.test(content)) {
      noise++;
    } else {
      prose++;
    }
  }

  return { prose, noise, diff };
}

/**
 * Salida legible por máquina, para el workflow que sincroniza los issues.
 * Solo incluye los desactualizados con cambios de prosa: los que solo cambiaron
 * de formato no ameritan abrirle un issue a nadie.
 */
function reportJson({ stale, untranslated, unprotected, orphans, unpaired, skipped, synced, analyzed, originAvailable }) {
  console.log(
    JSON.stringify(
      {
        synced,
        analyzed: analyzed.length,
        skipped,
        originAvailable,
        unprotected: unprotected.map((f) => ({ path: short(f), file: f })),
        orphans: orphans.map((f) => ({ path: short(f), file: f })),
        unpaired: unpaired.map((f) => ({ path: short(f), file: f })),
        stale: stale
          .filter((s) => s.prose > 0)
          .map(({ source, category, since, prose, noise, diff }) => ({
            path: source.replace(`${CONTENT_DIR}/`, ''),
            file: source,
            category,
            since,
            prose,
            noise,
            diff,
          })),
        untranslated: untranslated.map((f) => ({
          path: short(f),
          file: f,
          category: categorize(f),
        })),
      },
      null,
      2
    )
  );
}

/**
 * Borradores de issue, agrupados como los agrupa el repo: por carpeta, subiendo
 * de nivel cuando una no reúne suficientes archivos. No crea nada — el título
 * final lo pone una persona, porque nombrar la sección («Guías de Errores») es
 * una decisión editorial que un script no acierta.
 */
function reportIssues({ stale, untranslated }) {
  const lotes = [
    ['Traducir', untranslated.map((f) => ({ path: short(f) }))],
    ['Actualizar', stale.filter((s) => s.prose > 0).map((s) => ({ path: short(s.source), prosa: s.prose }))],
  ];

  for (const [verbo, items] of lotes) {
    if (!items.length) continue;
    const porRuta = new Map(items.map((i) => [i.path, i]));
    const grupos = agrupar(items.map((i) => i.path));

    console.log(chalk.cyan(`\n${'═'.repeat(64)}`));
    console.log(chalk.cyan(`${verbo.toUpperCase()}  ·  ${items.length} archivos  →  ${grupos.length} issues`));
    console.log(chalk.cyan('═'.repeat(64)));

    for (const g of grupos) {
      const nombre = esMiscelanea(g) ? 'páginas sueltas' : g.carpeta;
      console.log(`\n${chalk.bold(`${verbo} - `)}${chalk.dim(`«${nombre}» ← renombra esto`)}`);
      console.log(chalk.dim(`etiqueta: docs-translation · ${g.archivos.length} archivos\n`));

      if (verbo === 'Actualizar') {
        console.log('El original cambió después de traducirse. No hay que retraducir:');
        console.log('solo aplicar al español el cambio que ocurrió en inglés.\n');
      }

      for (const a of g.archivos) {
        const it = porRuta.get(a);
        const sufijo = it.prosa ? chalk.dim(`  (${it.prosa} líneas)`) : '';
        console.log(`- [ ] \`${relativo(a, g.carpeta)}\`${sufijo}`);
      }
    }
  }
  console.log();
}

function report({ stale, untranslated, unprotected, orphans, unpaired, skipped, synced, analyzed, originAvailable, ref }) {
  const relevant = stale.filter((s) => s.prose > 0);
  const cosmetic = stale.filter((s) => s.prose === 0);

  console.log(chalk.cyan(`\nEstado de traducciones · ${ref}\n`));

  // Se enseña qué se vigiló, no solo qué falló. Si un tipo de archivo deja de
  // estar en el alcance —como pasó con la interfaz del sitio durante meses— un
  // reporte que solo lista problemas se ve idéntico a uno correcto.
  const byExt = {};
  for (const f of analyzed) {
    const ext = f.match(/\.([^.]+)$/)?.[1] ?? '?';
    byExt[ext] = (byExt[ext] ?? 0) + 1;
  }
  const scope = Object.entries(byExt)
    .sort((a, b) => b[1] - a[1])
    .map(([ext, n]) => `${n} ${ext}`)
    .join(' · ');
  console.log(chalk.dim(`  Vigilando ${analyzed.length} archivos: ${scope}\n`));

  console.log(`  ${chalk.green('✔')} Sincronizadas:   ${synced}`);
  console.log(`  ${chalk.yellow('~')} Solo formato:    ${cosmetic.length}`);
  console.log(`  ${chalk.red('✘')} Desactualizadas: ${relevant.length}`);
  console.log(`  ${chalk.red('✘')} Sin traducir:    ${untranslated.length}`);
  if (unprotected.length) console.log(`  ${chalk.red('!')} Sin respaldo:    ${unprotected.length}`);
  if (unpaired.length) console.log(`  ${chalk.red('!')} Desparejadas:    ${unpaired.length}`);
  if (orphans.length) console.log(`  ${chalk.red('✘')} Huérfanas:       ${orphans.length}`);
  if (skipped.length) console.log(`  ${chalk.magenta('?')} Sin analizar:    ${skipped.length}`);
  console.log();

  // Lo más urgente primero: esto es pérdida de trabajo, no deuda pendiente.
  if (unprotected.length) {
    console.log(chalk.red.bold('Sin respaldo — el próximo update-origin los destruye:\n'));
    for (const f of unprotected) {
      console.log(`  ${short(f)}`);
      console.log(chalk.dim(`    ya está adaptado pero le falta su ${enPathOf(short(f)).split('/').pop()}`));
      console.log(chalk.dim(`    arréglalo: git show <commit-anterior-al-sync>:${f} > ${f.replace(/\.md$/, '.en.md')}\n`));
    }
  }

  if (unpaired.length) {
    console.log(chalk.red.bold('Desparejadas — respaldo sin su traducción:\n'));
    for (const f of unpaired) {
      console.log(`  ${short(f)}`);
      console.log(chalk.dim(`    no existe ${short(f).replace(/\.en\.md$/, '.md')} — casi siempre es un typo en el nombre`));
    }
    console.log(chalk.dim('\n  Mientras no emparejen, la traducción queda sin proteger y el respaldo'));
    console.log(chalk.dim('  nunca se actualiza.\n'));
  }

  if (orphans.length) {
    console.log(chalk.red.bold('Huérfanas — ya no existen en el original:\n'));
    for (const f of orphans) console.log(`  ${short(f)}`);
    console.log(chalk.dim('\n  Upstream las eliminó o renombró. update-origin nunca borra, así que'));
    console.log(chalk.dim('  siguen publicadas en el sitio español y se cuentan como sincronizadas.\n'));
  }

  if (!originAvailable) {
    console.log(chalk.yellow('No se comprobó si hay archivos huérfanos.'));
    console.log(
      chalk.dim(
        ref === 'HEAD'
          ? '  El submódulo origin no está inicializado: git submodule update --init\n'
          : `  ${ref} apunta a otra versión del original que la que hay en disco.\n`
      )
    );
  }

  // Nunca en silencio: un archivo que no se pudo analizar no está sincronizado,
  // y dejarlo caer haría que su issue se cerrara como "ya está al día".
  if (skipped.length) {
    console.log(chalk.magenta.bold('Sin analizar — revisar a mano:\n'));
    for (const s of skipped) console.log(`  ${short(s.file)} ${chalk.dim(`· ${s.why}`)}`);
    console.log();
  }

  if (relevant.length) {
    console.log(chalk.red.bold('Desactualizadas — el inglés cambió después de traducir:\n'));
    for (const s of relevant) {
      console.log(`  ${chalk.bold(short(s.file))}`);
      console.log(chalk.dim(`    ${s.prose} líneas de prosa, ${s.noise} de formato · desde ${s.since}`));
      // Sobre HEAD se omite el segundo extremo a propósito, para que el diff
      // incluya los cambios del árbol de trabajo que aún no están commiteados.
      console.log(chalk.dim(`    git diff ${s.since} ${ref === 'HEAD' ? '' : `${ref} `}-- ${s.file}\n`));
    }
  }

  if (untranslated.length) {
    console.log(chalk.red.bold('Sin traducir — inglés publicado en el sitio español:\n'));
    for (const f of untranslated) console.log(`  ${short(f)}`);
    console.log();
  }

  if (cosmetic.length) {
    console.log(chalk.yellow('Solo cambios de formato en el original (probablemente ignorables):\n'));
    for (const s of cosmetic) console.log(chalk.dim(`  ${short(s.file)} (${s.noise} líneas)`));
    console.log();
  }

  if (argv.diff && relevant.length) {
    console.log(chalk.cyan('─'.repeat(60)));
    for (const s of relevant) {
      console.log(chalk.bold(`\n${s.file}\n`));
      console.log(s.diff);
    }
  }
}
