---
name: translate-delta
description: Aplicar a la traducción española solo los cambios del original en inglés, sin retraducir el archivo
---

# Traducir el delta, no el archivo

Cuando el original en inglés cambia, la traducción española **no se rehace**: se le aplica
únicamente el cambio. El resto del archivo ya está bien y suele contener refinamiento humano
acumulado que retraducir destruiría.

Este skill es para archivos **ya traducidos que quedaron desactualizados**. Para traducir un
archivo desde cero usa [`translate-angular-docs`](../translate-angular-docs/SKILL.md).

## El principio: leer mucho, escribir poco

| | |
| --- | --- |
| Lo que **lees** | el documento completo, en ambos idiomas |
| Lo que **escribes** | solo los bloques que la orden autoriza |

Leer entero es barato — la mediana del corpus son ~1.200 tokens — y es lo que evita la deriva
terminológica: te dice qué convenciones usa **ese** documento en concreto. Lo que está acotado
es la escritura.

## Flujo

### Paso 1 — Generar la orden de trabajo

```shell
npx zx tools/plan-translation.mjs <ruta/del/archivo.md>
```

Produce `.translation-plan/<ruta>.md` con los bloques a tocar. Estados posibles:

- `listo` → sigue con el paso 2
- `manual` → el anclaje no es seguro (esqueleto distinto, demasiados bloques, reestructuración).
  **No lo fuerces.** Escala a revisión humana; el mecanismo incremental no aplica aquí.
- `solo-ruido` → el cambio inglés no toca contenido. No hay nada que hacer.

### Paso 2 — Leer antes de escribir

Lee **completos**, con la herramienta Read:

1. El `.md` español — es tu referencia de estilo, registro y terminología.
2. El `.en.md` inglés — para entender el contexto del cambio.
3. La orden en `.translation-plan/`.

### Paso 3 — Aplicar cada edición

Una llamada `Edit` por item. El `old_string` es el bloque **«Español actual» copiado verbatim**
de la orden; el `new_string` es ese mismo bloque con el cambio mínimo aplicado.

Esto es una tarea de **edición**, no de traducción. Tienes el inglés anterior, el inglés nuevo y
el español actual: reproduce en español el mismo cambio que ocurrió en inglés, tocando lo menos
posible.

Si `Edit` falla por coincidencia no única, amplía el `old_string` con el bloque anterior. Si
falla por no encontrar el texto, **detente**: significa que el archivo no está como la orden
supone, y seguir corrompería el documento.

### Paso 4 — Declarar el resultado

Para cada item, di explícitamente cuál de estos fue:

| Resultado | Cuándo |
| --- | --- |
| `editado` | se aplicó el cambio |
| `sin-cambio` | el cambio inglés no afecta al español: reflujo de párrafo, migración de `<docs-code>` a fence, normalización de URL |
| `ya-aplicado` | la traducción ya reflejaba el cambio |
| `no-puedo` | no es seguro; escala a humano |

> [!WARNING]
> En un item `sin-cambio`, **no copies el inglés al español**. Es la forma más fácil de publicar
> inglés en la página española, y ninguna verificación estructural lo detecta.

### Paso 5 — Verificar

```shell
npx zx tools/verify-translation.mjs <ruta/del/archivo.md>
```

Comprueba cuatro cosas. Si alguna falla, **no commitees**:

- **aislamiento** — toda línea modificada cae dentro de un bloque autorizado
- **estructura** — el esqueleto de encabezados, el número de bloques y las etiquetas `<docs-*>`
  siguen correspondiendo al inglés
- **anclas** — los enlaces internos `#slug` resuelven contra encabezados que existen
- **glosario** — terminología correcta en las líneas que tocaste (la deuda heredada se reporta
  pero no bloquea)

### Paso 6 — Commitear

`.md` y `.en.md` **en el mismo commit**. Romper ese invariante deja el archivo marcado como
desactualizado para siempre: es exactamente el origen del falso positivo de `selectors.md`.

## Reglas de edición

Aplica el glosario de [`translate-angular-docs`](../translate-angular-docs/SKILL.md), más estas
específicas del delta:

| Regla | Por qué |
| --- | --- |
| No cambies la estructura markdown ni el número de bloques | El direccionamiento futuro depende de ello |
| Mantén el mismo número de líneas que el bloque inglés nuevo | Sostiene la paridad del 91 % del corpus |
| Dentro de fences: traduce comentarios y textos de interfaz, nunca código ni identificadores | Práctica establecida del corpus |
| `title=` y `header=` se traducen si son prosa, **no** si son rutas | 237 de 237 `docs-step title` están traducidos |
| `path=`, `region=`, `visibleRegion=` nunca se traducen | Son identificadores |
| Los encabezados conservan su `{#ancla}` intacta | El ancla es la clave de direccionamiento entre idiomas |
| Prefijos de alerta (`NOTE:`, `TIP:`, `IMPORTANT:`, `HELPFUL:`…) **en inglés** | Son claves del tokenizer, no prosa: traducirlas rompe el renderizado |
| No cambies el destino de un enlace salvo que el diff inglés lo cambie | Hay ~96 enlaces localizados a propósito |

## Cuándo NO usar este skill

- El archivo no tiene `.en.md` → no está traducido; usa `translate-angular-docs`.
- La orden dice `manual` → el anclaje no es fiable.
- El cambio inglés es una reestructuración (más de 8 bloques) → retraducir esa sección con la
  traducción existente delante como referencia sale mejor que parchear.
