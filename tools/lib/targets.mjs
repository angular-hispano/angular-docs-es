/**
 * Qué se copia desde el original, y por tanto qué se traduce.
 *
 * Es la fuente única para `update-origin` (que copia) y `check-translations`
 * (que vigila). Tenerlo en dos sitios era la causa de que el detector solo
 * mirara `src/content`: la navegación, el footer y la portada se traducen
 * igual, se sincronizan igual, y nadie comprobaba si se habían desactualizado.
 *
 * Cada entrada es un objetivo independiente: un patrón suelto, o un grupo
 * (patrón + sus exclusiones). Se glob-ea entrada por entrada para poder exigir
 * que cada una encuentre al menos un archivo.
 */
export const copyTargets = [
  // Contenido de la documentación
  [
    'src/content/**/*.md',
    '!src/content/**/license.md',
    // No se traducen: readmes de apps de ejemplo y páginas índice sin prosa.
    '!src/content/examples/**/readme.md',
    '!src/content/tutorials/README.md',
    '!src/content/reference/concepts/overview.md',
  ],
  // Navegación
  'src/app/routing/sub-navigation-data.ts',
  'src/app/routing/navigation-entries/index.ts',
  // Interfaz del sitio
  'src/app/core/constants/links.ts',
  'src/app/core/layout/navigation/navigation.component.html',
  'src/app/core/layout/footer/footer.component.html',
  'src/app/features/home/home.component.html',
  'src/app/features/home/components/**/*.html',
];

/**
 * ¿La ruta cae dentro de un objetivo? Trabaja sobre cadenas, no sobre el disco,
 * para poder calcular el alcance de una rama cualquiera —un PR, por ejemplo—
 * sin tener que sacar sus archivos a un directorio.
 *
 * Soporta lo que usan los objetivos: `**`, `*` y la negación con `!`.
 */
export function matchesTarget(file, target) {
  const patterns = Array.isArray(target) ? target : [target];
  let hit = false;

  for (const p of patterns) {
    const negated = p.startsWith('!');
    if (globToRegExp(negated ? p.slice(1) : p).test(file)) {
      if (negated) return false; // una exclusión manda sobre cualquier inclusión
      hit = true;
    }
  }

  return hit;
}

function globToRegExp(pattern) {
  const ANY_SEGMENTS = '\u0000'; // marcador para `**/`
  const ANY_CHARS = '\u0001'; // marcador para `**` suelto

  const rx = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*\//g, ANY_SEGMENTS)
    .replace(/\*\*/g, ANY_CHARS)
    .replace(/\*/g, '[^/]*')
    .replaceAll(ANY_SEGMENTS, '(?:[^/]+/)*')
    .replaceAll(ANY_CHARS, '.*');

  return new RegExp(`^${rx}$`);
}


/** La ruta del respaldo en inglés de un archivo: `x.html` → `x.en.html`. */
export function enPathOf(file) {
  const dot = file.lastIndexOf('.');
  return dot === -1 ? `${file}.en` : `${file.slice(0, dot)}.en${file.slice(dot)}`;
}

/** ¿Es un respaldo en inglés? Vale para cualquier extensión, no solo `.md`. */
export function isEnFile(file) {
  return /\.en\.[^.]+$/.test(file);
}

/** De un respaldo a su traducción: `x.en.html` → `x.html`. */
export function sourcePathOf(enFile) {
  return enFile.replace(/\.en(\.[^.]+)$/, '$1');
}
