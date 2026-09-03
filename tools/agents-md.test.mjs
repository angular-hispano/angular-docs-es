import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * AGENTS.md le dice a un agente qué comandos existen y dónde está la
 * documentación. Si esas referencias se quedan atrás, el agente actúa sobre
 * información falsa sin que nada avise — y a diferencia de una persona, no va a
 * dudar del documento.
 */

const ROOT = resolve(import.meta.dirname, '..');
const doc = readFileSync(resolve(ROOT, 'AGENTS.md'), 'utf8');
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));

test('existe y declara el trigger que esperan las herramientas', () => {
  assert.match(doc, /^---\ntrigger: always_on\n---/, 'falta el frontmatter');
});

test('todos los `npm run` que menciona existen', () => {
  const usados = [...doc.matchAll(/npm run ([a-z-]+)/g)].map((m) => m[1]);
  assert.ok(usados.length >= 5, 'apenas menciona comandos');
  for (const c of new Set(usados)) {
    assert.ok(pkg.scripts[c], `AGENTS.md menciona "npm run ${c}" y no existe`);
  }
});

test('los archivos que enlaza existen', () => {
  const enlaces = [...doc.matchAll(/\]\(([^)#]+\.(?:md|yml))(?:#[\w-]+)?\)/g)].map((m) => m[1]);
  assert.ok(enlaces.length, 'no enlaza nada');
  for (const f of new Set(enlaces)) {
    assert.ok(existsSync(resolve(ROOT, f)), `enlaza ${f}, que no existe`);
  }
});

test('las anclas de CONTRIBUTING que cita existen', () => {
  const contributing = readFileSync(resolve(ROOT, 'CONTRIBUTING.md'), 'utf8');
  const anclas = [...doc.matchAll(/CONTRIBUTING\.md#([\w-]+)/g)].map((m) => m[1]);
  assert.ok(anclas.length, 'no cita ninguna ancla');
  for (const a of new Set(anclas)) {
    assert.ok(contributing.includes(`{#${a}}`), `cita #${a} y CONTRIBUTING no la define`);
  }
});

// Traducir un prefijo que no está en el enum rompe el renderizado del aviso.
// Si upstream añade o quita uno, este test lo detecta antes que un lector.
test('los prefijos de alerta que nombra existen en el tokenizer de adev', () => {
  const src = resolve(ROOT, 'origin/adev/shared-docs/pipeline/shared/marked/extensions/docs-alert.mts');
  if (!existsSync(src)) return; // submódulo sin inicializar

  const claves = [...readFileSync(src, 'utf8').matchAll(/^\s+([A-Z]+)\s*=/gm)].map((m) => m[1]);
  const nombrados = [...doc.matchAll(/`([A-Z]+):`/g)].map((m) => m[1]);

  assert.ok(nombrados.length >= 5, 'apenas nombra prefijos');
  for (const p of new Set(nombrados)) {
    assert.ok(claves.includes(p), `nombra "${p}:" y no está en AlertSeverityLevel`);
  }
});

test('los punteros por herramienta apuntan a AGENTS.md y no duplican', () => {
  for (const f of ['CLAUDE.md']) {
    const p = resolve(ROOT, f);
    assert.ok(existsSync(p), `falta ${f}`);
    const c = readFileSync(p, 'utf8');
    assert.match(c, /AGENTS\.md/, `${f} no apunta a AGENTS.md`);
    assert.ok(c.length < 600, `${f} parece duplicar contenido en vez de apuntar`);
  }
});
