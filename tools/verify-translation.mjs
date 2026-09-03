import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { $, argv, chalk } from 'zx';
import { parseBlocks, headingSkeleton, KIND } from './blocks.mjs';

/**
 * Comprueba que una edición incremental hizo exactamente lo que declaró.
 *
 * El chequeo que da valor a todo el flujo es el de AISLAMIENTO: cada línea
 * modificada del español debe caer dentro de un bloque que la orden autorizó
 * tocar. Es lo que convierte "no rompas el resto del archivo" de promesa del
 * prompt en invariante verificado — y es justo lo que angular-ja no tiene.
 *
 * Uso:
 *   npx zx tools/verify-translation.mjs guide/components/selectors.md
 */

$.verbose = false;

const CONTENT = 'adev-es/src/content';
const OUT_DIR = '.translation-plan';
const ROOT = resolve(import.meta.dirname, '..');

try {
  const rel = (argv._[0] ?? '').replace(`${CONTENT}/`, '');
  if (!rel) {
    console.error(chalk.red('Indica el archivo, p. ej. guide/components/selectors.md'));
    process.exit(1);
  }

  const sidecar = resolve(ROOT, OUT_DIR, `${rel}.json`);
  if (!existsSync(sidecar)) {
    console.error(chalk.red(`No hay orden de trabajo para ${rel}.`));
    console.error(chalk.dim(`Genérala con: npx zx tools/plan-translation.mjs ${rel}`));
    process.exit(1);
  }

  const plan = JSON.parse(readFileSync(sidecar, 'utf8'));
  const checks = [];

  checks.push(await isolation(plan));
  checks.push(structure(plan));
  checks.push(anchors(plan));
  checks.push(await glossary(plan));

  report(rel, checks);
  process.exit(checks.some((c) => c.status === 'fail') ? 1 : 0);
} catch (err) {
  console.error(chalk.red(err.stack ?? err));
  process.exit(1);
}

/* ------------------------------------------------------------------ */

/**
 * E1 · AISLAMIENTO. Todo hunk del diff español debe caer dentro de un rango
 * autorizado. Un solo byte fuera y falla.
 *
 * Se comprueba contra el árbol de trabajo, así que corre en local antes de
 * commitear. Es un guardarraíl contra el error, no contra la mala fe: nada
 * impide regenerar la orden después de editar.
 */
async function isolation(plan) {
  const diff = (await $`git diff -U0 -- ${plan.file}`.nothrow()).stdout;

  if (!diff.trim()) {
    return { name: 'aislamiento', status: 'skip', detail: 'sin cambios en el árbol de trabajo' };
  }

  // Se usan las coordenadas del lado VIEJO del diff, no del nuevo. Los rangos
  // autorizados se registraron contra el archivo tal como estaba antes de
  // editar, así que el lado viejo se corresponde exactamente con ellos y no hace
  // falta ninguna tolerancia por desplazamiento de líneas.
  const touched = [];
  for (const line of diff.split('\n')) {
    const m = line.match(/^@@ -(\d+)(?:,(\d+))? \+\d+(?:,\d+)? @@/);
    if (!m) continue;
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    // Una inserción pura no ocupa líneas viejas: se ancla a la frontera, que
    // git reporta como la línea anterior al punto de inserción.
    touched.push(count === 0 ? { start, end: start + 1, insert: true } : { start, end: start + count - 1 });
  }

  const allowed = plan.ranges;
  const outside = touched.filter((t) => !allowed.some((a) => t.start <= a.end && t.end >= a.start));

  if (outside.length) {
    return {
      name: 'aislamiento',
      status: 'fail',
      detail: `${outside.length} cambio(s) fuera de los bloques autorizados`,
      lines: outside.map((o) => `líneas ${o.start}-${o.end}`),
      hint: 'La traducción se modificó donde la orden no lo permitía. Revisa el diff.',
    };
  }

  return { name: 'aislamiento', status: 'pass', detail: `${touched.length} hunk(s), todos dentro de lo autorizado` };
}

/** E2 · ESTRUCTURA. El español debe seguir correspondiendo al inglés actual. */
function structure(plan) {
  const es = readFileSync(resolve(ROOT, plan.file), 'utf8');
  const en = readFileSync(resolve(ROOT, plan.en), 'utf8');

  if (!es.trim()) {
    return { name: 'estructura', status: 'fail', detail: 'el archivo español quedó vacío' };
  }

  const bEs = parseBlocks(es);
  const bEn = parseBlocks(en);
  const problems = [];

  const skEs = headingSkeleton(bEs);
  const skEn = headingSkeleton(bEn);
  if (JSON.stringify(skEs) !== JSON.stringify(skEn)) {
    problems.push(`esqueleto de encabezados: ${skEs.length} en español, ${skEn.length} en inglés`);
  }

  if (bEs.length !== bEn.length) {
    problems.push(`número de bloques: ${bEs.length} en español, ${bEn.length} en inglés`);
  }

  const fences = (es.match(/^\s*(`{3,}|~{3,})/gm) ?? []).length;
  if (fences % 2 !== 0) problems.push(`fences sin balancear (${fences})`);

  const tags = (s) => {
    const c = {};
    for (const m of s.matchAll(/<(docs-[\w-]+)/g)) c[m[1]] = (c[m[1]] ?? 0) + 1;
    return c;
  };
  const tEs = tags(es);
  const tEn = tags(en);
  for (const tag of new Set([...Object.keys(tEs), ...Object.keys(tEn)])) {
    if ((tEs[tag] ?? 0) !== (tEn[tag] ?? 0)) {
      problems.push(`<${tag}>: ${tEs[tag] ?? 0} en español, ${tEn[tag] ?? 0} en inglés`);
    }
  }

  return problems.length
    ? { name: 'estructura', status: 'fail', detail: `${problems.length} divergencia(s)`, lines: problems }
    : { name: 'estructura', status: 'pass', detail: `${bEs.length} bloques, correspondencia intacta` };
}

/**
 * E3 · ANCLAS. Cada fragmento `#slug` interno debe resolver contra un encabezado
 * que exista en el archivo español. No se exige igualdad con el inglés: eso
 * reprobaría los enlaces correctamente localizados.
 */
function anchors(plan) {
  const es = readFileSync(resolve(ROOT, plan.file), 'utf8');
  const blocks = parseBlocks(es);

  const available = new Set();
  for (const b of blocks) {
    if (b.kind !== KIND.HEADING) continue;
    if (b.meta.anchor) available.add(b.meta.anchor);
    available.add(slug(b.meta.title));
  }

  const broken = [];
  for (const m of es.matchAll(/\]\(#([\w-]+)\)/g)) {
    if (!available.has(m[1])) broken.push(m[1]);
  }

  return broken.length
    ? {
        name: 'anclas',
        status: 'fail',
        detail: `${broken.length} enlace(s) interno(s) rotos`,
        lines: broken.map((b) => `#${b}`),
        hint: 'Un fragmento roto es error de build en adev, no una degradación.',
      }
    : { name: 'anclas', status: 'pass', detail: `${available.size} destinos disponibles` };
}

function slug(title) {
  return title
    .replace(/\{#[^}]*\}/g, '')
    .trim()
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

/**
 * E5 · GLOSARIO, solo sobre las líneas que esta edición tocó.
 *
 * Verificar el archivo entero haría fallar cada edición incremental por deuda
 * preexistente que el autor no introdujo — y un chequeo que siempre falla acaba
 * ignorado. La deuda heredada se reporta aparte, sin bloquear.
 */
async function glossary(plan) {
  const rel = plan.file.replace(`${CONTENT}/`, '');
  const out = await $`npx zx tools/lint-glossary.mjs ${rel} --json`.nothrow();

  let findings = [];
  try {
    findings = JSON.parse(out.stdout).findings;
  } catch {
    return { name: 'glosario', status: 'skip', detail: 'no se pudo leer el linter' };
  }

  const touched = await touchedLines(plan.file);
  const introduced = findings.filter((f) => touched.has(f.line));
  const inherited = findings.length - introduced.length;

  const detail = introduced.length
    ? `${introduced.length} problema(s) en las líneas editadas`
    : `sin problemas en lo editado${inherited ? ` (${inherited} heredado(s), no bloquean)` : ''}`;

  return introduced.length
    ? { name: 'glosario', status: 'fail', detail,
        lines: introduced.map((f) => `${f.line}:${f.col} ${f.found} → ${f.expected}`),
        hint: `npx zx tools/lint-glossary.mjs ${rel}` }
    : { name: 'glosario', status: 'pass', detail };
}

/** Números de línea que el árbol de trabajo modificó respecto a HEAD. */
async function touchedLines(file) {
  const diff = (await $`git diff -U0 -- ${file}`.nothrow()).stdout;
  const lines = new Set();
  for (const l of diff.split('\n')) {
    const m = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (!m) continue;
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    for (let i = 0; i < Math.max(count, 1); i++) lines.add(start + i);
  }
  return lines;
}

/* ------------------------------------------------------------------ */

function report(rel, checks) {
  const icon = { pass: chalk.green('✔'), fail: chalk.red('✘'), skip: chalk.dim('·') };
  console.log(chalk.cyan(`\nVerificación · ${rel}\n`));

  for (const c of checks) {
    console.log(`  ${icon[c.status]} ${chalk.bold(c.name.padEnd(12))} ${c.detail}`);
    for (const l of c.lines ?? []) console.log(chalk.dim(`       ${l}`));
    if (c.hint && c.status === 'fail') console.log(chalk.dim(`       → ${c.hint}`));
  }

  const failed = checks.filter((c) => c.status === 'fail');
  console.log();
  console.log(
    failed.length
      ? chalk.red(`  ${failed.length} verificación(es) fallida(s). No commitees así.\n`)
      : chalk.green('  Todo en orden. Recuerda commitear .md y .en.md juntos.\n')
  );
}
