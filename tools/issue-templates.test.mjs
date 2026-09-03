import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { YAML } from 'zx';

/**
 * Un formulario de issue con el esquema mal cae en silencio: GitHub lo ignora y
 * ofrece un issue en blanco, así que el error solo se nota cuando alguien abre
 * uno y no trae ni etiqueta ni estructura. Estos tests lo hacen ruidoso.
 */

const DIR = resolve(import.meta.dirname, '../.github/ISSUE_TEMPLATE');
const TIPOS = ['markdown', 'input', 'textarea', 'dropdown', 'checkboxes'];

const archivos = readdirSync(DIR).filter((f) => f.endsWith('.yml'));
const formularios = archivos
  .filter((f) => f !== 'config.yml')
  .map((f) => [f, YAML.parse(readFileSync(resolve(DIR, f), 'utf8'))]);

// Uno solo, a propósito: el 93 % de los issues del repo son de traducción, y las
// dos variantes (traducir / actualizar) comparten estructura. Un selector con
// varias entradas restaría visibilidad a la única que se usa.
test('hay formularios y todos parsean', () => {
  assert.ok(formularios.length >= 1, 'no hay ningún formulario');
});

test('el formulario distingue traducir de actualizar', () => {
  const [, d] = formularios.find(([f]) => f === 'traducir.yml');
  const tipo = d.body.find((c) => c.id === 'tipo');
  assert.equal(tipo?.type, 'dropdown', 'falta el desplegable de tipo');
  assert.equal(tipo.attributes.options.length, 2);
});

test('cada formulario trae los campos que exige GitHub', () => {
  for (const [f, d] of formularios) {
    for (const k of ['name', 'description', 'body']) {
      assert.ok(d[k], `${f}: falta "${k}"`);
    }
    assert.ok(Array.isArray(d.body) && d.body.length, `${f}: body vacío`);
  }
});

test('todos los tipos de campo son válidos', () => {
  for (const [f, d] of formularios) {
    for (const campo of d.body) {
      assert.ok(TIPOS.includes(campo.type), `${f}: tipo desconocido "${campo.type}"`);
    }
  }
});

test('los campos que no son markdown llevan id y label', () => {
  for (const [f, d] of formularios) {
    for (const campo of d.body.filter((c) => c.type !== 'markdown')) {
      assert.ok(campo.id, `${f}: campo sin id`);
      assert.ok(campo.attributes?.label, `${f}: campo "${campo.id}" sin label`);
    }
  }
});

// El 17 % de los issues del repo no tiene etiqueta, incluidos los seis más
// recientes. Las plantillas existen en parte para que eso deje de pasar.
test('todos los formularios aplican la etiqueta docs-translation', () => {
  for (const [f, d] of formularios) {
    assert.ok(Array.isArray(d.labels), `${f}: sin labels`);
    assert.ok(d.labels.includes('docs-translation'), `${f}: no aplica docs-translation`);
  }
});

test('todos prerrellenan el título con su prefijo', () => {
  for (const [f, d] of formularios) {
    assert.match(d.title ?? '', /^\S.* - $/, `${f}: título "${d.title}" no sigue "Verbo - "`);
  }
});

test('cada formulario pide al menos un dato obligatorio', () => {
  for (const [f, d] of formularios) {
    const req = d.body.filter((c) => c.validations?.required);
    assert.ok(req.length, `${f}: nada obligatorio, se pueden abrir issues vacíos`);
  }
});

test('config.yml es válido y deja abrir issues en blanco', () => {
  const c = YAML.parse(readFileSync(resolve(DIR, 'config.yml'), 'utf8'));
  assert.equal(typeof c.blank_issues_enabled, 'boolean');
  assert.ok(Array.isArray(c.contact_links));
  for (const l of c.contact_links) {
    assert.ok(l.name && l.url && l.about, `enlace incompleto: ${JSON.stringify(l)}`);
    assert.match(l.url, /^https:\/\//, `${l.name}: la URL debe ser absoluta`);
  }
});

test('los enlaces del cuerpo son absolutos', () => {
  // Un enlace relativo se resuelve contra /issues/new y rompe con facilidad.
  for (const [f, d] of formularios) {
    for (const campo of d.body.filter((c) => c.type === 'markdown')) {
      const relativos = [...campo.attributes.value.matchAll(/\]\((?!https?:)([^)]+)\)/g)];
      assert.deepEqual(relativos.map((m) => m[1]), [], `${f}: enlace relativo`);
    }
  }
});
