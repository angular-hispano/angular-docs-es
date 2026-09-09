/**
 * Segmenta un markdown en bloques.
 *
 * Un bloque es la unidad de direccionamiento del flujo incremental: los hunks de
 * un diff se expanden al bloque que los contiene, y la verificación exige que
 * toda edición caiga dentro de los bloques declarados.
 *
 * Regla de corte: línea en blanco a nivel superior. Nunca se corta dentro de un
 * fence ni de un contenedor `<docs-*>`, porque partirlos produce markdown
 * inválido — es el fallo de diseño de trocear por líneas del diff.
 *
 * Las líneas son 1-indexadas y los rangos inclusivos, para que coincidan con lo
 * que reportan git y los editores.
 */

/** Tipos de bloque. El tipo se usa para confirmar el anclaje entre idiomas. */
export const KIND = {
  HEADING: 'heading',
  FENCE: 'fence',
  CONTAINER: 'container',
  TABLE: 'table',
  LIST: 'list',
  PARAGRAPH: 'paragraph',
};

const FENCE_OPEN = /^(\s*)(`{3,}|~{3,})(.*)$/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*)$/;
const DOCS_OPEN = /^\s*<(docs-[\w-]+)/;
const ANCHOR = /\{#\s*([\w-]+)\s*\}/;

/**
 * @param {string} text
 * @returns {Array<{start:number,end:number,text:string,kind:string,meta:object}>}
 */
export function parseBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() === '') {
      i++;
      continue;
    }

    const start = i;
    let end;
    let kind;
    let meta = {};

    const fence = lines[i].match(FENCE_OPEN);
    const heading = lines[i].match(HEADING);

    if (fence) {
      kind = KIND.FENCE;
      meta.lang = (fence[3] || '').trim().split(/[\s{]/)[0] || null;
      end = closeFence(lines, i, fence[2]);
    } else if (DOCS_OPEN.test(lines[i])) {
      kind = KIND.CONTAINER;
      const tag = lines[i].match(DOCS_OPEN)[1];
      meta.tag = tag;
      end = closeContainer(lines, i, tag);
    } else if (heading) {
      kind = KIND.HEADING;
      meta.level = heading[1].length;
      meta.title = heading[2].trim();
      const anchor = meta.title.match(ANCHOR);
      meta.anchor = anchor ? anchor[1] : null;
      end = i; // un encabezado es siempre un bloque de una línea
    } else {
      end = closeProse(lines, i);
      kind = classifyProse(lines.slice(i, end + 1));
    }

    blocks.push({
      start: start + 1,
      end: end + 1,
      text: lines.slice(start, end + 1).join('\n'),
      kind,
      meta,
    });

    i = end + 1;
  }

  return blocks;
}

/**
 * Busca el cierre de un fence. Solo cierra un fence del mismo carácter y de
 * longitud igual o mayor: es lo que permite anidar ``` dentro de ````, que el
 * corpus usa para mostrar markdown dentro de markdown. Sin cierre, el bloque
 * llega al final del archivo.
 */
function closeFence(lines, open, marker) {
  const char = marker[0] === '`' ? '`' : '~';
  const closer = new RegExp(`^\\s*\\${char}{${marker.length},}\\s*$`);
  for (let i = open + 1; i < lines.length; i++) {
    if (closer.test(lines[i])) return i;
  }
  return lines.length - 1;
}

/**
 * Busca el cierre de un contenedor `<docs-*>`. Hay tres formas en el corpus y
 * las tres tienen que funcionar o el archivo entero cae al carril lento:
 *
 *   <docs-code path="x" />                    autocerrado en una línea
 *   <docs-code>…</docs-code>                  emparejado
 *   <docs-code\n  path="x"\n/>                autocerrado con atributos multilínea
 */
function closeContainer(lines, open, tag) {
  // Primero hay que ver dónde termina la etiqueta de apertura, que puede
  // abarcar varias líneas.
  let tagEnd = -1;
  let selfClosing = false;
  let buf = '';

  for (let i = open; i < lines.length; i++) {
    buf += lines[i];
    const gt = buf.indexOf('>');
    if (gt !== -1) {
      tagEnd = i;
      selfClosing = buf[gt - 1] === '/';
      break;
    }
    buf += '\n';
  }

  if (tagEnd === -1) return lines.length - 1; // etiqueta sin cerrar
  if (selfClosing) return tagEnd;

  // Emparejado: contar anidamiento del mismo tag.
  const openRe = new RegExp(`<${tag}(?![\\w-])`, 'g');
  const closeRe = new RegExp(`</${tag}\\s*>`, 'g');
  let depth = 0;

  for (let i = open; i < lines.length; i++) {
    const line = lines[i];
    depth += (line.match(openRe) || []).length;
    // Las aperturas autocerradas no aumentan la profundidad.
    depth -= (line.match(new RegExp(`<${tag}(?![\\w-])[^>]*/>`, 'g')) || []).length;
    depth -= (line.match(closeRe) || []).length;
    if (i >= tagEnd && depth <= 0) return i;
  }

  return lines.length - 1; // contenedor sin cerrar
}

/** La prosa termina en la primera línea en blanco. */
function closeProse(lines, open) {
  let i = open;
  while (i + 1 < lines.length && lines[i + 1].trim() !== '') {
    // Un fence o un <docs-*> que arranca sin línea en blanco antes corta aquí.
    if (FENCE_OPEN.test(lines[i + 1]) || DOCS_OPEN.test(lines[i + 1]) || HEADING.test(lines[i + 1])) {
      break;
    }
    i++;
  }
  return i;
}

function classifyProse(chunk) {
  const first = chunk[0].trim();
  if (first.startsWith('|')) return KIND.TABLE;
  if (/^([-*+]|\d+\.)\s/.test(first)) return KIND.LIST;
  return KIND.PARAGRAPH;
}

/**
 * Esqueleto de encabezados: la firma estructural que debe coincidir entre el
 * `.md` y el `.en.md`. Usa el ancla `{#id}` cuando existe, porque es idéntica en
 * ambos idiomas por diseño; si no, cae al nivel + posición.
 */
export function headingSkeleton(blocks) {
  return blocks
    .filter((b) => b.kind === KIND.HEADING)
    .map((b, idx) => (b.meta.anchor ? `${b.meta.level}#${b.meta.anchor}` : `${b.meta.level}@${idx}`));
}

/**
 * Divide los bloques en secciones. Una sección arranca en cada encabezado y
 * contiene los bloques hasta el siguiente. Es la unidad de anclaje.
 */
export function sections(blocks) {
  const out = [];
  let current = { heading: null, blocks: [] };

  for (const b of blocks) {
    if (b.kind === KIND.HEADING) {
      if (current.heading || current.blocks.length) out.push(current);
      current = { heading: b, blocks: [] };
    } else {
      current.blocks.push(b);
    }
  }
  if (current.heading || current.blocks.length) out.push(current);

  return out;
}

/** Clave estable de una sección, para emparejar español con inglés. */
export function sectionKey(section, index) {
  if (!section.heading) return `@preamble`;
  return section.heading.meta.anchor ? `#${section.heading.meta.anchor}` : `@${index}`;
}

/** El bloque que contiene una línea dada (1-indexada). */
export function blockAt(blocks, line) {
  return blocks.find((b) => line >= b.start && line <= b.end) ?? null;
}
