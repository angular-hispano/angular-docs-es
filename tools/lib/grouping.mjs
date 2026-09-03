/**
 * Agrupa archivos pendientes en lotes del tamaño de un issue.
 *
 * La regla sale de cómo agrupa el repo: por carpeta. El matiz es qué hacer con
 * las carpetas que solo aportan un archivo — sin él, los tutoriales se
 * desintegran, porque cada paso vive en su propia carpeta
 * (`tutorials/learn-angular/steps/11-optimizing-images/README.md`) y 31 archivos
 * darían 31 grupos de uno.
 *
 * Se resuelve subiendo de nivel: un grupo que no llega al mínimo cede sus
 * archivos a la carpeta padre, y se repite hasta que nadie más pueda subir. Lo
 * que llega a la raíz sin agrupar es el cajón de misceláneas.
 */

const MINIMO = 2;

const padre = (ruta) => (ruta.includes('/') ? ruta.slice(0, ruta.lastIndexOf('/')) : '');

/**
 * @param {string[]} paths rutas relativas al directorio de contenido
 * @param {number} minimo archivos mínimos para que un grupo se sostenga
 * @returns {Array<{carpeta: string, archivos: string[]}>} de mayor a menor
 */
export function agrupar(paths, minimo = MINIMO) {
  const grupo = new Map(paths.map((p) => [p, padre(p)]));

  for (;;) {
    const cuenta = new Map();
    for (const c of grupo.values()) cuenta.set(c, (cuenta.get(c) ?? 0) + 1);

    let cambió = false;
    for (const [p, c] of grupo) {
      // La raíz no tiene padre: lo que llega ahí se queda como misceláneas.
      if (c !== '' && cuenta.get(c) < minimo) {
        grupo.set(p, padre(c));
        cambió = true;
      }
    }
    if (!cambió) break;
  }

  const salida = new Map();
  for (const [p, c] of grupo) {
    if (!salida.has(c)) salida.set(c, []);
    salida.get(c).push(p);
  }

  return [...salida.entries()]
    .map(([carpeta, archivos]) => ({ carpeta, archivos: archivos.sort() }))
    .sort((a, b) => b.archivos.length - a.archivos.length || a.carpeta.localeCompare(b.carpeta));
}

/** ¿Es el cajón de sueltos? */
export const esMiscelanea = (grupo) => grupo.carpeta === '';

/**
 * Recorta el prefijo común para que la lista del issue se lea sin ruido: dentro
 * de un grupo la carpeta ya está en el título.
 */
export function relativo(archivo, carpeta) {
  return carpeta && archivo.startsWith(`${carpeta}/`) ? archivo.slice(carpeta.length + 1) : archivo;
}
