import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { $, argv, chalk, YAML } from 'zx';
import { parseBlocks, headingSkeleton, sections, sectionKey, KIND } from './blocks.mjs';

/**
 * Convierte "este archivo está desactualizado" en una orden de trabajo concreta:
 * qué bloques del español hay que tocar, con su antes y su después.
 *
 * El principio es leer mucho y escribir poco. La orden NO recorta el contexto:
 * apunta a los documentos completos en ambos idiomas, porque la traducción
 * existente es la mejor referencia disponible sobre qué terminología, registro y
 * convenciones usa ESE documento. Lo que sí se acota es la escritura: cada item
 * es una edición puntual sobre un bloque identificado verbatim.
 *
 * Uso:
 *   npx zx tools/plan-translation.mjs guide/components/selectors.md
 *   npx zx tools/plan-translation.mjs --all
 *   npx zx tools/plan-translation.mjs --all --json
 */

$.verbose = false;

const CONTENT = 'adev-es/src/content';
const OUT_DIR = '.translation-plan';
const ROOT = resolve(import.meta.dirname, '..');

// Por encima de este tamaño el bloque deja de ser una unidad razonable de
// edición y el archivo se manda a revisión manual en vez de fingir precisión.
const MAX_BLOCK_LINES = 60;
// Por encima de esto el cambio es una reestructuración, no un delta.
const MAX_CHANGED_BLOCKS = 8;

try {
  const targets = argv.all ? await staleFiles() : [normalize(argv._[0])];
  if (!targets[0]) {
    console.error(chalk.red('Indica un archivo o usa --all'));
    process.exit(1);
  }

  const results = [];
  for (const md of targets) {
    results.push(await planFile(md));
  }

  if (argv.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    summarize(results);
  }

  process.exit(results.some((r) => r.status === 'error') ? 1 : 0);
} catch (err) {
  console.error(chalk.red(err.stack ?? err));
  process.exit(1);
}

/* ------------------------------------------------------------------ */

function normalize(p) {
  if (!p) return null;
  return p.startsWith(CONTENT) ? p : `${CONTENT}/${p}`;
}

/** Los archivos que `check-translations` marca como desactualizados. */
async function staleFiles() {
  const out = await $`npx zx tools/check-translations.mjs --json`.nothrow();
  const data = JSON.parse(out.stdout);
  return data.stale.map((s) => s.file);
}

/**
 * El commit desde el que medir. Tiene que ser el más reciente que tocó el `.md`
 * Y el `.en.md`: si solo se exige el `.md`, un commit de mantenimiento sobre la
 * traducción mueve la referencia y el trabajo pendiente desaparece en silencio.
 */
async function baselineFor(md, en) {
  const commits = (await $`git log --format=%H -- ${md}`.nothrow()).stdout.trim().split('\n').filter(Boolean);
  for (const c of commits) {
    const touched = (await $`git show --name-only --format= ${c} -- ${en}`.nothrow()).stdout.trim();
    if (touched) return c;
  }
  // Sin commit conjunto, el origen es donde nació el snapshot inglés.
  const first = (await $`git log --format=%H --diff-filter=A -- ${en}`.nothrow()).stdout.trim().split('\n').pop();
  return first || null;
}

async function planFile(md) {
  const en = md.replace(/\.md$/, '.en.md');
  const rel = md.replace(`${CONTENT}/`, '');

  const baseline = await baselineFor(md, en);
  if (!baseline) return { file: md, rel, status: 'error', reason: 'sin baseline en el historial' };

  const enBase = (await $`git show ${baseline}:${en}`.nothrow()).stdout;
  const enNow = (await $`git show HEAD:${en}`.nothrow()).stdout;
  const es = readFileSync(resolve(ROOT, md), 'utf8');

  if (!es.trim()) return { file: md, rel, status: 'error', reason: 'la traducción está vacía' };
  if (enBase === enNow) return { file: md, rel, status: 'sincronizado' };

  const bNow = parseBlocks(enNow);
  const bEs = parseBlocks(es);

  // Verificación 1: el esqueleto de encabezados debe coincidir. Si no, el
  // direccionamiento por sección no es fiable y no se sigue adelante.
  const skelEn = headingSkeleton(bNow);
  const skelEs = headingSkeleton(bEs);
  if (JSON.stringify(skelEn) !== JSON.stringify(skelEs)) {
    return {
      file: md, rel, baseline: baseline.slice(0, 7), status: 'manual',
      reason: `esqueleto de encabezados distinto (inglés ${skelEn.length}, español ${skelEs.length})`,
    };
  }

  const hunks = await hunkRanges(baseline, en);
  const changed = expandToBlocks(hunks, bNow);

  if (changed.length === 0) {
    return { file: md, rel, baseline: baseline.slice(0, 7), status: 'solo-ruido',
             reason: 'los cambios no caen en ningún bloque de contenido' };
  }
  if (changed.length > MAX_CHANGED_BLOCKS) {
    return {
      file: md, rel, baseline: baseline.slice(0, 7), status: 'manual',
      reason: `${changed.length} bloques cambiados: es una reestructuración, no un delta`,
    };
  }

  const secNow = sections(bNow);
  const secEs = sections(bEs);
  const bBase = parseBlocks(enBase);

  const items = [];
  for (const blk of changed) {
    const item = locate(blk, secNow, secEs, bBase);
    items.push(item);
  }

  const blocked = items.filter((i) => i.anchor !== 'confirmada');
  const status = blocked.length ? 'manual' : 'listo';

  const plan = {
    file: md, rel, en, baseline: baseline.slice(0, 7), status,
    blocks: { en: bNow.length, es: bEs.length },
    items,
    ...(blocked.length ? { reason: `${blocked.length} de ${items.length} bloques sin anclaje seguro` } : {}),
  };

  if (status === 'listo') writePlan(plan, es);
  return plan;
}

/** Rangos de líneas tocados, en coordenadas del inglés actual. */
async function hunkRanges(baseline, en) {
  const diff = (await $`git diff -U0 ${baseline} HEAD -- ${en}`.nothrow()).stdout;
  const ranges = [];
  for (const line of diff.split('\n')) {
    const m = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (!m) continue;
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    // Una eliminación pura no ocupa líneas nuevas: se ancla a la frontera.
    ranges.push(count === 0 ? { start, end: start + 1 } : { start, end: start + count - 1 });
  }
  return ranges;
}

/** Expande cada hunk al bloque que lo contiene, sin duplicar. */
function expandToBlocks(ranges, blocks) {
  const hit = new Map();
  for (const r of ranges) {
    for (const b of blocks) {
      if (b.start <= r.end && b.end >= r.start) hit.set(b.start, b);
    }
  }
  return [...hit.values()].sort((a, b) => a.start - b.start);
}

/**
 * Localiza el bloque español que corresponde a un bloque inglés, y confirma el
 * anclaje con verificaciones deterministas. Ante la duda no se adivina: se marca
 * incierto y el archivo no entra al carril automático.
 */
function locate(blk, secNow, secEs, bBase) {
  const si = secNow.findIndex((s) => s.blocks.includes(blk) || s.heading === blk);
  const sec = secNow[si];
  const key = sectionKey(sec, si);

  // La sección española se busca por ancla si la hay; si no, por posición.
  let esIdx = key.startsWith('#') ? secEs.findIndex((s, i) => sectionKey(s, i) === key) : si;
  const esSec = secEs[esIdx];

  const base = {
    kind: blk.kind,
    lines: `${blk.start}-${blk.end}`,
    section: sec?.heading?.meta.title ?? '(preámbulo)',
    sectionKey: key,
    enNow: blk.text,
    enBefore: matchInBase(blk, bBase),
  };

  if (!esSec) return { ...base, anchor: 'incierta', why: `sección ${key} no existe en español` };

  // El encabezado mismo es su propio bloque.
  if (sec.heading === blk) {
    if (!esSec.heading) return { ...base, anchor: 'incierta', why: 'sin encabezado español' };
    return { ...base, anchor: 'confirmada', esLines: `${esSec.heading.start}-${esSec.heading.end}`, es: esSec.heading.text };
  }

  // Verificación 2: misma cantidad de bloques en la sección.
  if (sec.blocks.length !== esSec.blocks.length) {
    return { ...base, anchor: 'incierta',
             why: `la sección tiene ${sec.blocks.length} bloques en inglés y ${esSec.blocks.length} en español` };
  }

  const pos = sec.blocks.indexOf(blk);
  const esBlk = esSec.blocks[pos];

  // Verificación 3: mismo tipo de bloque en la misma posición.
  if (esBlk.kind !== blk.kind) {
    return { ...base, anchor: 'incierta', why: `posición ${pos}: inglés ${blk.kind}, español ${esBlk.kind}` };
  }
  if (blk.kind === KIND.CONTAINER && esBlk.meta.tag !== blk.meta.tag) {
    return { ...base, anchor: 'incierta', why: `contenedor distinto: ${blk.meta.tag} vs ${esBlk.meta.tag}` };
  }

  if (esBlk.end - esBlk.start + 1 > MAX_BLOCK_LINES) {
    return { ...base, anchor: 'incierta', why: `bloque de ${esBlk.end - esBlk.start + 1} líneas: demasiado grande para editar a ciegas` };
  }

  return { ...base, anchor: 'confirmada', esLines: `${esBlk.start}-${esBlk.end}`, es: esBlk.text, unique: isUnique(esBlk.text) };

  function isUnique(text) {
    // `Edit` exige coincidencia única; si el bloque se repite hay que ampliarlo.
    const all = secEs.flatMap((s) => s.blocks).filter((b) => b.text === text);
    return all.length === 1;
  }
}

/** El mismo bloque en el inglés anterior, para mostrar qué cambió. */
function matchInBase(blk, bBase) {
  const exact = bBase.find((b) => b.text === blk.text);
  if (exact) return null; // no cambió
  // Heurística: el bloque más parecido del mismo tipo cerca de la misma posición.
  const same = bBase.filter((b) => b.kind === blk.kind);
  let best = null;
  let bestScore = 0;
  for (const b of same) {
    const score = similarity(b.text, blk.text);
    if (score > bestScore) { bestScore = score; best = b; }
  }
  return bestScore > 0.35 ? best.text : null;
}

function similarity(a, b) {
  const wa = new Set(a.split(/\s+/));
  const wb = new Set(b.split(/\s+/));
  const inter = [...wa].filter((w) => wb.has(w)).length;
  return inter / Math.max(wa.size, wb.size, 1);
}

/* ------------------------------------------------------------------ */

function writePlan(plan, esText) {
  const glossary = YAML.parse(readFileSync(resolve(ROOT, 'glosario.yml'), 'utf8')).rules;
  const out = resolve(ROOT, OUT_DIR, `${plan.rel}.md`);
  mkdirSync(dirname(out), { recursive: true });

  const L = [];
  L.push(`# Orden de traducción · ${plan.rel}`, '');
  L.push(`- **Editar:** \`${plan.file}\``);
  L.push(`- **Original nuevo:** \`${plan.en}\``);
  L.push(`- **Traducido por última vez en:** \`${plan.baseline}\``);
  L.push(`- **Bloques a tocar:** ${plan.items.length} de ${plan.blocks.es}`, '');

  L.push('## Antes de editar', '');
  L.push('**Lee los dos documentos completos**, no solo los bloques de abajo:', '');
  L.push(`1. \`${plan.file}\` — la traducción viva. Te dice qué terminología, registro y`);
  L.push('   convenciones usa **este** documento en concreto. Espeja lo que ya hace.');
  L.push(`2. \`${plan.en}\` — el original actual, para entender el contexto del cambio.`, '');
  L.push('Leer entero es barato y evita la deriva terminológica. Lo que está acotado es la');
  L.push('**escritura**: solo se tocan los bloques listados, con una llamada `Edit` por item.', '');

  L.push('## Reglas de terminología', '');
  for (const r of glossary) L.push(`- \`${r.pattern}\` → **${r.expected}** — ${r.reason}`);
  L.push('');

  L.push('## Ediciones', '');
  plan.items.forEach((it, n) => {
    L.push(`### ${n + 1}. ${it.section} · líneas ${it.esLines} · \`${it.kind}\``, '');
    if (it.enBefore) {
      L.push('**Inglés anterior** (lo que ya está traducido):', '', '```markdown', it.enBefore, '```', '');
    } else {
      L.push('**Bloque nuevo** — no existía en el original anterior.', '');
    }
    L.push('**Inglés actual** (lo que hay que reflejar):', '', '```markdown', it.enNow, '```', '');
    L.push('**Español actual** — cópialo verbatim como `old_string`:', '', '```markdown', it.es, '```', '');
    if (it.unique === false) {
      L.push('> ⚠️ Este bloque no es único en el archivo. Amplía el `old_string` con el bloque', '');
      L.push('> anterior para que `Edit` pueda identificarlo sin ambigüedad.', '');
    }
    L.push('');
  });

  L.push('## Al terminar', '');
  L.push('Declara para cada item qué hiciste:', '');
  L.push('- `editado` — se aplicó el cambio');
  L.push('- `sin-cambio` — el cambio inglés no afecta al español (reflujo, migración de');
  L.push('  formato, cambio de URL). **No copies el inglés**: deja el bloque como está.');
  L.push('- `ya-aplicado` — la traducción ya reflejaba el cambio');
  L.push('- `no-puedo` — escala a revisión humana', '');
  L.push('Después ejecuta:', '', '```shell', `npx zx tools/verify-translation.mjs ${plan.rel}`, '```', '');

  writeFileSync(out, L.join('\n'));

  // Sidecar para el verificador: los rangos declarados, tomados ANTES de editar.
  // Sin esto no se puede comprobar el aislamiento, porque tras la edición las
  // líneas se desplazan y ya no hay forma de reconstruir qué se autorizó tocar.
  writeFileSync(
    out.replace(/\.md$/, '.json'),
    JSON.stringify(
      {
        file: plan.file,
        en: plan.en,
        baseline: plan.baseline,
        esSha: sha(esText),
        ranges: plan.items.map((it) => {
          const [start, end] = it.esLines.split('-').map(Number);
          return { start, end, kind: it.kind, section: it.section };
        }),
      },
      null,
      2
    )
  );

  plan.planPath = `${OUT_DIR}/${plan.rel}.md`;
}

function sha(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 12);
}

function summarize(results) {
  const icon = { listo: chalk.green('✔'), manual: chalk.yellow('~'), error: chalk.red('✘'),
                 'solo-ruido': chalk.dim('·'), sincronizado: chalk.dim('=') };

  console.log(chalk.cyan('\nÓrdenes de traducción\n'));
  for (const r of results) {
    console.log(`  ${icon[r.status] ?? '?'} ${chalk.bold(r.rel)} ${chalk.dim(r.status)}`);
    if (r.reason) console.log(chalk.dim(`      ${r.reason}`));
    if (r.planPath) {
      console.log(chalk.dim(`      ${r.items.length} bloques de ${r.blocks.es} · ${r.planPath}`));
      for (const it of r.items) {
        console.log(chalk.dim(`        · ${it.section} (${it.kind}, líneas ${it.esLines})`));
      }
    }
  }
  console.log();
}
