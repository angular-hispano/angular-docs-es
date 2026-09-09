import { test } from 'node:test';
import assert from 'node:assert/strict';
import { agrupar, esMiscelanea, relativo } from './lib/grouping.mjs';

const resumen = (paths, min) =>
  agrupar(paths, min).map((g) => [g.carpeta || '(raíz)', g.archivos.length]);

test('los archivos de una misma carpeta forman un grupo', () => {
  assert.deepEqual(resumen(['ai/a.md', 'ai/b.md', 'ai/c.md']), [['ai', 3]]);
});

test('una carpeta con un solo archivo sube de nivel', () => {
  // guide/di aporta 2 y se sostiene; guide/x aporta 1 y sube a guide,
  // donde tampoco llega a 2, así que acaba en misceláneas.
  assert.deepEqual(resumen(['guide/di/a.md', 'guide/di/b.md', 'guide/x/solo.md']), [
    ['guide/di', 2],
    ['(raíz)', 1],
  ]);
});

test('dos carpetas sueltas se juntan en su padre común', () => {
  assert.deepEqual(resumen(['guide/a/uno.md', 'guide/b/dos.md']), [['guide', 2]]);
});

// El caso que motivó la regla: cada paso de un tutorial vive en su propia
// carpeta, así que sin subir de nivel darían un grupo por archivo.
test('los pasos de un tutorial se agrupan en el tutorial', () => {
  const pasos = [
    'tutorials/signals/steps/1-uno/README.md',
    'tutorials/signals/steps/2-dos/README.md',
    'tutorials/signals/steps/3-tres/README.md',
  ];
  assert.deepEqual(resumen(pasos), [['tutorials/signals/steps', 3]]);
});

test('tutoriales distintos no se mezclan si cada uno se sostiene', () => {
  const paths = [
    'tutorials/signals/steps/1/README.md',
    'tutorials/signals/steps/2/README.md',
    'tutorials/forms/steps/1/README.md',
    'tutorials/forms/steps/2/README.md',
  ];
  assert.deepEqual(resumen(paths), [
    ['tutorials/forms/steps', 2],
    ['tutorials/signals/steps', 2],
  ]);
});

test('lo que llega a la raíz sin agrupar queda como misceláneas', () => {
  const g = agrupar(['a.md', 'otra/cosa.md']);
  assert.equal(g.length, 1);
  assert.ok(esMiscelanea(g[0]));
  assert.equal(g[0].archivos.length, 2);
});

test('el mínimo es configurable', () => {
  const paths = ['x/a.md', 'x/b.md', 'x/c.md', 'y/d.md', 'y/e.md'];
  assert.deepEqual(resumen(paths, 3), [['x', 3], ['(raíz)', 2]]);
});

test('ningún archivo se pierde ni se duplica', () => {
  const paths = [
    'reference/errors/NG01.md', 'reference/errors/NG02.md', 'reference/cli.md',
    'guide/forms/signals/a.md', 'guide/forms/signals/b.md', 'events/v21.md',
  ];
  const total = agrupar(paths).flatMap((g) => g.archivos);
  assert.equal(total.length, paths.length);
  assert.deepEqual([...total].sort(), [...paths].sort());
});

test('los grupos salen de mayor a menor', () => {
  const g = agrupar(['a/1.md', 'a/2.md', 'a/3.md', 'b/1.md', 'b/2.md']);
  assert.deepEqual(g.map((x) => x.archivos.length), [3, 2]);
});

test('relativo recorta el prefijo del grupo', () => {
  assert.equal(relativo('tutorials/signals/steps/1-uno/README.md', 'tutorials/signals/steps'), '1-uno/README.md');
  assert.equal(relativo('events/v21.md', ''), 'events/v21.md');
});

test('no entra en bucle con rutas sin carpeta', () => {
  assert.deepEqual(resumen(['a.md', 'b.md']), [['(raíz)', 2]]);
});
