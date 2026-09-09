import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBlocks, headingSkeleton, sections, blockAt, KIND } from './blocks.mjs';

const kinds = (md) => parseBlocks(md).map((b) => b.kind);
const texts = (md) => parseBlocks(md).map((b) => b.text);

test('separa párrafos por línea en blanco', () => {
  assert.deepEqual(kinds('uno\n\ndos\n\ntres'), ['paragraph', 'paragraph', 'paragraph']);
});

test('un fence es un solo bloque aunque contenga líneas en blanco', () => {
  const md = '```ts\nconst a = 1;\n\nconst b = 2;\n```';
  const blocks = parseBlocks(md);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].kind, KIND.FENCE);
  assert.equal(blocks[0].meta.lang, 'ts');
  assert.equal(blocks[0].end, 5);
});

test('un fence con atributos conserva solo el lenguaje', () => {
  const blocks = parseBlocks("```angular-ts {header:'app.ts'}\nx\n```");
  assert.equal(blocks[0].meta.lang, 'angular-ts');
});

test('no confunde un ``` interno de mayor longitud', () => {
  const md = '````md\n```ts\nx\n```\n````';
  assert.equal(parseBlocks(md).length, 1);
});

// --- las tres formas de <docs-*> que existen en el corpus ---

test('docs-code autocerrado en una línea', () => {
  const md = '<docs-code path="a.ts" />\n\notro';
  const b = parseBlocks(md);
  assert.equal(b.length, 2);
  assert.equal(b[0].kind, KIND.CONTAINER);
  assert.equal(b[0].end, 1);
});

test('docs-code emparejado', () => {
  const md = '<docs-code language="shell">\n  ng add x\n</docs-code>';
  const b = parseBlocks(md);
  assert.equal(b.length, 1);
  assert.equal(b[0].meta.tag, 'docs-code');
  assert.equal(b[0].end, 3);
});

test('docs-code autocerrado con atributos multilínea', () => {
  const md = '<docs-code\n  path="a.ts"\n  header="A"\n/>\n\nsiguiente';
  const b = parseBlocks(md);
  assert.equal(b.length, 2, 'la etiqueta multilínea debe ser un único bloque');
  assert.equal(b[0].end, 4);
  assert.equal(b[1].text, 'siguiente');
});

test('docs-code-multifile anidando docs-code', () => {
  const md = [
    '<docs-code-multifile path="x.ts">',
    '  <docs-code header="a" path="a.html"/>',
    '  <docs-code header="b" path="b.ts"/>',
    '</docs-code-multifile>',
  ].join('\n');
  const b = parseBlocks(md);
  assert.equal(b.length, 1, 'el contenedor externo absorbe los internos');
  assert.equal(b[0].meta.tag, 'docs-code-multifile');
});

test('contenedor con línea en blanco dentro no se parte', () => {
  const md = '<docs-callout>\nuno\n\ndos\n</docs-callout>';
  assert.equal(parseBlocks(md).length, 1);
});

test('contenedor sin cerrar llega al final sin colgarse', () => {
  const b = parseBlocks('<docs-step title="x">\ncontenido\nmás');
  assert.equal(b.length, 1);
  assert.equal(b[0].end, 3);
});

// --- encabezados y anclas ---

test('el encabezado es un bloque de una línea', () => {
  const b = parseBlocks('# Título\ntexto pegado');
  assert.equal(b.length, 2);
  assert.equal(b[0].kind, KIND.HEADING);
  assert.equal(b[0].meta.level, 1);
  assert.equal(b[1].text, 'texto pegado');
});

test('extrae el ancla explícita', () => {
  const b = parseBlocks('## Primeros pasos {#get-started}');
  assert.equal(b[0].meta.anchor, 'get-started');
});

test('el esqueleto usa el ancla cuando existe y la posición cuando no', () => {
  const es = parseBlocks('# A {#a}\n\ntexto\n\n## B {#b}');
  const en = parseBlocks('# A {#a}\n\nprose\n\n## B {#b}');
  assert.deepEqual(headingSkeleton(es), headingSkeleton(en));
  assert.deepEqual(headingSkeleton(es), ['1#a', '2#b']);
});

test('el esqueleto detecta divergencia estructural', () => {
  const a = headingSkeleton(parseBlocks('# X\n\n## Y'));
  const b = headingSkeleton(parseBlocks('# X\n\n### Y'));
  assert.notDeepEqual(a, b);
});

// --- listas y tablas ---

test('distingue listas y tablas de párrafos', () => {
  assert.deepEqual(kinds('- uno\n- dos\n\n| a | b |\n|---|---|\n\nprosa'), ['list', 'table', 'paragraph']);
});

// --- secciones y localización ---

test('agrupa bloques en secciones por encabezado', () => {
  const b = parseBlocks('# A\n\nuno\n\n## B\n\ndos\n\ntres');
  const s = sections(b);
  assert.equal(s.length, 2);
  assert.equal(s[0].blocks.length, 1);
  assert.equal(s[1].blocks.length, 2);
});

test('el texto previo a cualquier encabezado forma su propia sección', () => {
  const s = sections(parseBlocks('intro suelta\n\n# A\n\nuno'));
  assert.equal(s.length, 2);
  assert.equal(s[0].heading, null);
});

test('blockAt localiza el bloque que contiene una línea', () => {
  const b = parseBlocks('uno\n\ndos\n\ntres');
  assert.equal(blockAt(b, 3).text, 'dos');
  assert.equal(blockAt(b, 2), null, 'la línea en blanco no pertenece a ningún bloque');
});

// --- invariante de rangos ---

test('los rangos son contiguos, no se solapan y cubren todo el contenido', () => {
  const md = '# T\n\npárrafo\n\n```ts\nx\n```\n\n<docs-code a="1" />\n\n- l1\n- l2';
  const b = parseBlocks(md);
  for (let i = 1; i < b.length; i++) {
    assert.ok(b[i].start > b[i - 1].end, `bloque ${i} se solapa con el anterior`);
  }
  const lines = md.split('\n');
  const covered = new Set();
  for (const blk of b) for (let l = blk.start; l <= blk.end; l++) covered.add(l);
  lines.forEach((line, idx) => {
    if (line.trim() !== '') {
      assert.ok(covered.has(idx + 1), `línea ${idx + 1} sin cubrir: ${JSON.stringify(line)}`);
    }
  });
});

test('el texto de cada bloque coincide con sus líneas declaradas', () => {
  const md = '# T\n\npárrafo largo\ncon dos líneas\n\n```ts\nx\n```';
  const lines = md.split('\n');
  for (const b of parseBlocks(md)) {
    assert.equal(b.text, lines.slice(b.start - 1, b.end).join('\n'));
  }
});
