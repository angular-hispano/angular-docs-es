import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { YAML } from 'zx';
import { mask, lintText, selectFiles } from './lib/glossary.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const { rules } = YAML.parse(readFileSync(resolve(ROOT, 'glosario.yml'), 'utf8'));

const hits = (text) => lintText('t.md', text, rules).map((f) => f.expected);
const ruleFor = (expected) => rules.filter((r) => r.expected === expected);

// --- enmascarado ---

test('no aplica el glosario dentro de bloques de código', () => {
  assert.deepEqual(hits('```ts\nconst librería = 1;\n```'), []);
});

test('no aplica dentro de código en línea', () => {
  assert.deepEqual(hits('Usa `librería` como nombre.'), []);
});

test('no aplica en destinos de enlace', () => {
  assert.deepEqual(hits('Ver [guía](/es/librería/overview).'), []);
});

test('no aplica dentro de docs-code', () => {
  assert.deepEqual(hits('<docs-code language="ts">\nlibrería\n</docs-code>'), []);
});

test('sí aplica en prosa junto a código en línea', () => {
  assert.deepEqual(hits('La librería `@angular/core` es esencial.'), ['biblioteca']);
});

test('el enmascarado conserva los números de línea', () => {
  const text = 'uno\n```\ndos\ntres\n```\nla librería aquí';
  const [f] = lintText('t.md', text, rules);
  assert.equal(f.line, 6);
});

// --- el bug de los límites de palabra ---

test('señal marca la API pero no las palabras que empiezan igual', () => {
  const r = ruleFor('signal');
  assert.equal(lintText('t.md', 'La señal se emite.', r).length, 1, 'debe marcar "señal"');

  for (const palabra of ['señalar', 'señalización', 'señalan', 'Señala', 'señalado']) {
    assert.equal(
      lintText('t.md', `Esto sirve para ${palabra} el cambio.`, r).length,
      0,
      `no debe marcar "${palabra}" — con --fix lo reescribiría mal`
    );
  }
});

test('señales marca el plural de la API pero no derivados', () => {
  const r = ruleFor('signals');
  assert.equal(lintText('t.md', 'Las señales son reactivas.', r).length, 1);
  assert.equal(lintText('t.md', 'Hay señales visuales claras.', r).length, 1, 'aquí sí es ambiguo, se marca');
  assert.equal(lintText('t.md', 'La señalización del error.', r).length, 0);
});

test('librería no dispara dos veces sobre el plural', () => {
  const f = lintText('t.md', 'Usa librerías modernas.', rules);
  assert.deepEqual(f.map((x) => x.expected), ['bibliotecas']);
});

// --- prefijos de alerta ---

test('marca los prefijos de alerta traducidos al principio de línea', () => {
  assert.deepEqual(hits('NOTA: esto es importante.'), ['NOTE:']);
  assert.deepEqual(hits('ÚTIL: un consejo.'), ['HELPFUL:']);
});

test('no marca la palabra suelta fuera del prefijo', () => {
  assert.deepEqual(hits('Toma nota: esto no es un callout.'), []);
});

// --- salud del propio glosario ---

test('todas las reglas compilan y traen su motivo', () => {
  for (const r of rules) {
    assert.doesNotThrow(() => new RegExp(r.pattern, 'giu'), `patrón inválido: ${r.pattern}`);
    assert.ok(r.expected, `regla sin expected: ${r.pattern}`);
    assert.ok(r.reason, `regla sin reason: ${r.pattern}`);
  }
});

test('ninguna regla marca su propia forma correcta', () => {
  // Una regla que coincide con lo que propone haría bucle infinito con --fix.
  for (const r of rules) {
    const found = lintText('t.md', r.expected, [r]);
    assert.equal(found.length, 0, `la regla ${r.pattern} marca su propio expected "${r.expected}"`);
  }
});

// Los atributos HTML llevan rutas e identificadores: si no se enmascaran,
// cualquier regla sobre una palabra que aparezca en una ruta dispara sola.
test('no aplica dentro de atributos de ruta', () => {
  assert.deepEqual(hits('<docs-pill href="tools/cli/librería-x"/>'), []);
  assert.deepEqual(hits('<a href="/es/señal/overview">enlace</a>'), []);
  assert.deepEqual(hits('<docs-code path="src/librería/app.ts"/>'), []);
});

// title, header y label llevan prosa que sí se traduce: en el corpus hay
// 237 de 237 `<docs-step title>` traducidos.
test('SÍ aplica en los atributos que llevan prosa visible', () => {
  assert.deepEqual(hits('<docs-callout title="Nombrando tu librería">'), ['biblioteca']);
  assert.deepEqual(hits('<docs-step title="Instala la librería">'), ['biblioteca']);
});

test('sí aplica al texto visible junto a un atributo', () => {
  assert.deepEqual(hits('<a href="/x/librería">esta librería es útil</a>'), ['biblioteca']);
});

test('no aplica en definiciones de enlace de referencia', () => {
  assert.deepEqual(hits('[GuiaX]: tools/cli/librería-y "Título"'), []);
});

// --- selección de archivos ---

const ALL = [
  'adev-es/src/content/ai/webmcp.md',
  'adev-es/src/content/guide/di/lazy-loading-services.md',
  'adev-es/src/content/reference/releases.md',
];

test('sin filtros revisa todas las traducciones', () => {
  assert.deepEqual(selectFiles(ALL, []), { files: ALL, unmatched: [] });
});

test('acepta varias rutas a la vez, no solo la primera', () => {
  const { files, unmatched } = selectFiles(ALL, [
    'adev-es/src/content/ai/webmcp.md',
    'adev-es/src/content/reference/releases.md',
  ]);
  assert.deepEqual(files, [ALL[0], ALL[2]]);
  assert.deepEqual(unmatched, []);
});

test('delata la ruta que no casa con ninguna traducción', () => {
  const { unmatched } = selectFiles(ALL, ['guide/di', 'reference/no-existe.md']);
  assert.deepEqual(unmatched, ['reference/no-existe.md']);
});

test('no cuenta un archivo dos veces aunque casen dos filtros', () => {
  const { files } = selectFiles(ALL, ['ai/', 'webmcp']);
  assert.deepEqual(files, [ALL[0]]);
});
