import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { glob } from 'zx';
import { copyTargets, enPathOf, isEnFile, sourcePathOf } from './lib/targets.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const ORIGIN = resolve(ROOT, 'origin/adev');

test('enPathOf inserta .en antes de la extensión', () => {
  assert.equal(enPathOf('src/content/guide/x.md'), 'src/content/guide/x.en.md');
  assert.equal(enPathOf('src/app/footer.component.html'), 'src/app/footer.component.en.html');
  assert.equal(enPathOf('src/app/nav-data.ts'), 'src/app/nav-data.en.ts');
});

test('sourcePathOf revierte enPathOf', () => {
  for (const f of ['a/b.md', 'a/b.component.html', 'a/b.ts']) {
    assert.equal(sourcePathOf(enPathOf(f)), f);
  }
});

test('isEnFile reconoce respaldos de cualquier extensión', () => {
  assert.ok(isEnFile('x.en.md'));
  assert.ok(isEnFile('footer.component.en.html'));
  assert.ok(isEnFile('nav.en.ts'));
  assert.ok(!isEnFile('x.md'));
  assert.ok(!isEnFile('footer.component.html'));
});

test('un nombre con .en. intermedio no se confunde con un respaldo', () => {
  // `enPathOf` siempre pone `.en` justo antes de la última extensión, así que
  // solo esa posición cuenta.
  assert.ok(!isEnFile('guide/i18n.en.us/x.md'));
});

// Este es el test que importa: valida que lo que declaramos copiar existe de
// verdad. Es la comprobación que habría evitado que los objetivos quedaran
// desalineados durante meses sin que nadie se enterara.
test(
  'todos los objetivos de copia coinciden con archivos del origin',
  { skip: !existsSync(ORIGIN) && 'submódulo origin no inicializado' },
  async () => {
    const vacios = [];
    for (const target of copyTargets) {
      const files = await glob(target, { cwd: ORIGIN, caseSensitiveMatch: true });
      if (files.length === 0) vacios.push(target);
    }
    assert.deepEqual(
      vacios,
      [],
      `objetivos que no coinciden con nada (¿upstream los movió?):\n${vacios.map((t) => `  ${JSON.stringify(t)}`).join('\n')}`
    );
  }
);
