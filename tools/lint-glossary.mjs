import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { $, argv, chalk, glob, YAML } from 'zx';
import { lintText } from './lib/glossary.mjs';

/**
 * Verifica la consistencia terminológica de las traducciones al español.
 *
 * Las reglas viven en `glosario.yml`, con el mismo formato `expected`/`pattern`
 * que usa angular-ja en su `prh.yml`.
 *
 * Igual que el `.textlintrc` de angular-ja, ignora las zonas donde el
 * vocabulario español no aplica: bloques de código, código en línea, enlaces,
 * rutas de archivo y anchors explícitos `{#id}`.
 *
 * Uso:
 *   npm run lint-glossary                 (todas las traducciones)
 *   npm run lint-glossary -- guide/forms  (solo una ruta)
 */

$.verbose = false;

const CONTENT_DIR = 'adev-es/src/content';
const ROOT = resolve(import.meta.dirname, '..');

try {
  const raw = await readFile(resolve(ROOT, 'glosario.yml'), 'utf8');
  const { rules } = YAML.parse(raw);

  const filter = argv._[0];
  const all = await glob([`${CONTENT_DIR}/**/*.md`, `!${CONTENT_DIR}/**/*.en.md`], { cwd: ROOT });
  const files = filter ? all.filter((f) => f.includes(filter)) : all;

  const findings = [];

  for (const file of files) {
    const text = await readFile(resolve(ROOT, file), 'utf8');
    findings.push(...lintText(file, text, rules));
  }

  if (argv.json) {
    console.log(JSON.stringify({ scanned: files.length, findings }, null, 2));
  } else {
    report(findings, files.length);
  }
  process.exit(findings.length > 0 ? 1 : 0);
} catch (err) {
  console.error(chalk.red(err));
  process.exit(1);
}

function report(findings, scanned) {
  if (findings.length === 0) {
    console.log(chalk.green(`\n✔ Sin problemas de terminología en ${scanned} archivos.\n`));
    return;
  }

  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }

  console.log(chalk.cyan(`\nRevisión de terminología · ${scanned} archivos\n`));

  for (const [file, items] of byFile) {
    console.log(chalk.bold(file.replace(`${CONTENT_DIR}/`, '')));
    for (const f of items) {
      console.log(
        `  ${chalk.dim(`${f.line}:${f.col}`)}  ${chalk.red(f.found)} → ${chalk.green(f.expected)}`
      );
      console.log(chalk.dim(`         ${f.reason}`));
    }
    console.log();
  }

  console.log(chalk.red(`${findings.length} problemas en ${byFile.size} archivos.\n`));
}
