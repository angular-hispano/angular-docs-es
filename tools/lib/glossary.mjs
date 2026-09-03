/**
 * Lógica pura del linter de terminología, separada del CLI para poder testearla.
 */

/**
 * Reemplaza por espacios las regiones donde el vocabulario español no aplica,
 * conservando las posiciones para que los números de línea sigan siendo exactos.
 */
export function mask(text) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return text
    .replace(/```[\s\S]*?```/g, blank) // bloques de código
    .replace(/<docs-code[\s\S]*?<\/docs-code>/g, blank) // bloques docs-code
    .replace(/<docs-code[^>]*\/>/g, blank)
    .replace(/`[^`\n]*`/g, blank) // código en línea
    .replace(/\]\([^)\n]*\)/g, blank) // destinos de enlaces
    .replace(/\{#[^}\n]*\}/g, blank) // anchors explícitos
    // Atributos que llevan rutas o identificadores: href="tools/cli/deployment",
    // path="src/overview/app.ts". Sin esto, una regla sobre cualquier palabra que
    // aparezca en una ruta dispara sola.
    //
    // Se excluyen a propósito los que llevan PROSA VISIBLE —title, header, alt,
    // label—: esos se traducen y deben revisarse. En el corpus hay 237 de 237
    // `<docs-step title>` traducidos.
    .replace(
      /\b(href|src|path|region|visibleRegion|preview|id|class|language|highlight)=("[^"\n]*"|'[^'\n]*')/gi,
      blank
    )
    .replace(/^\s*\[[^\]\n]+\]:\s*\S+/gm, blank); // definiciones de enlace
}

/**
 * Aplica las reglas del glosario a un texto.
 *
 * Los patrones se compilan con la bandera `u`, así que pueden usar `\p{L}` para
 * delimitar palabras. Hace falta: el `\b` de JavaScript se define sobre
 * `[A-Za-z0-9_]`, de modo que `ñ` y las vocales acentuadas cuentan como
 * separadores y los límites de palabra caen donde no deben.
 */
export function lintText(file, text, rules) {
  const lines = mask(text).split('\n');
  const found = [];

  for (const rule of rules) {
    const re = new RegExp(rule.pattern, 'giu');
    lines.forEach((line, i) => {
      for (const m of line.matchAll(re)) {
        found.push({
          file,
          line: i + 1,
          col: m.index + 1,
          found: m[0],
          expected: rule.expected,
          reason: rule.reason,
        });
      }
    });
  }

  return found.sort((a, b) => a.line - b.line);
}

/**
 * Selecciona qué traducciones revisar a partir de los filtros de la línea de
 * comandos. Sin filtros, se revisan todas.
 *
 * Devuelve también los filtros que no casaron con nada: un filtro que no
 * encuentra archivos casi siempre es una ruta mal escrita, y darlo por bueno
 * haría pasar la revisión sin haber mirado nada.
 */
export function selectFiles(all, filters) {
  if (filters.length === 0) return { files: all, unmatched: [] };

  const unmatched = filters.filter((p) => !all.some((f) => f.includes(p)));
  const files = all.filter((f) => filters.some((p) => f.includes(p)));

  return { files, unmatched };
}
