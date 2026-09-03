---
name: batch-translate
description: Traducir múltiples archivos de documentación Angular en lote
---

# Batch Translation Agent

Traduce múltiples archivos de documentación Angular del inglés al español de forma secuencial. Para cada archivo aplica el mismo proceso que `/translate-angular-docs`.

## Cuándo usar este agent

- Tienes una lista de archivos relacionados (ej. todos los guides de forms)
- Quieres procesar una carpeta completa o sección
- Necesitas un reporte de qué se tradujo y qué quedó pendiente

## Uso

Pasa una lista de archivos o describe la sección a traducir:

```
/batch-translate guide/forms/overview.md guide/forms/reactive-forms.md guide/forms/validation.md
```

O con una descripción:
```
/batch-translate todos los archivos sin traducir en reference/configs/
```

---

## Proceso para cada archivo

### 1. Verificar estado

Antes de traducir, comprueba si el archivo ya está traducido:
- Si existe `archivo.en.md` → el `archivo.md` ya fue traducido (saltar o confirmar con el usuario)
- Si no existe `archivo.en.md` → el `archivo.md` está en inglés, proceder

### 2. Crear backup

```bash
cp adev-es/src/content/<ruta>/archivo.md adev-es/src/content/<ruta>/archivo.en.md
```

### 3. Leer el archivo original

Lee el contenido completo antes de traducir.

### 4. Traducir

Aplica todas las reglas del skill `/translate-angular-docs`:
- Respeta el glosario de términos
- Mantén el código intacto (traduce solo los comentarios)
- Preserva el formato markdown
- Mantén alineación de líneas cuando sea posible
- Traduce las etiquetas `<docs-*>` correctamente

### 5. Escribir la traducción

Sobreescribe `archivo.md` con la traducción.

### 6. Verificar anchors

Si se tradujeron encabezados con enlaces internos, actualiza los anchors.

### 7. Stage en git

```bash
git add adev-es/src/content/<ruta>/archivo.md adev-es/src/content/<ruta>/archivo.en.md
```

---

## Reglas del batch

- **Procesar secuencialmente**, un archivo a la vez (no en paralelo)
- **Confirmar antes de empezar** si la lista tiene más de 5 archivos
- **No mezclar archivos** de carpetas muy distintas en un mismo commit
- **Pausar si hay duda** sobre algún término técnico no listado en el glosario — preguntar al usuario

---

## Reporte final

Al terminar, entrega un resumen con este formato:

```
## Resumen de traducción

✅ Traducidos (N archivos):
  - guide/forms/overview.md
  - guide/forms/reactive-forms.md

⏭️ Omitidos (ya tenían .en.md):
  - guide/forms/validation.md

❌ Con problemas:
  - guide/forms/template-driven.md → razón

## Próximos pasos

git commit -m "translate: translations for forms guides"
```

---

## Commit al finalizar el lote

Agrupa los archivos de la misma sección en un solo commit:

```bash
# Formato:
git commit -m "translate: translations for <sección>"

# Ejemplos:
# translate: translations for forms guides
# translate: translations for reference configs section
# translate: complete translation of routing guides
```

Si los archivos son de secciones distintas, haz commits separados por sección.
