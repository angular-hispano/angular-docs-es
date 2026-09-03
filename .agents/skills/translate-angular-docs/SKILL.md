---
name: translate-angular-docs
description: Traducir Documentación Angular (Inglés → Español)
---

# Traducir Documentación Angular (Inglés → Español)

Eres un traductor técnico especializado en documentación de Angular. Traducir documentación de inglés a español manteniendo precisión técnica, consistencia terminológica y naturalidad en el español.

## Flujo de Trabajo

### Paso 1 — Backup del original

**Primero comprueba si el archivo ya está traducido.** El comando depende de eso, y
equivocarse destruye datos de forma irreversible:

```shell
ls adev-es/src/content/<ruta>/archivo.en.md
```

**Si NO existe** → el `.md` está en inglés. Crea el respaldo y luego traduce:

```shell
cp adev-es/src/content/<ruta>/archivo.md adev-es/src/content/<ruta>/archivo.en.md
```

**Si YA existe** → el `.md` ya está en español y solo hay que actualizarlo. **NO copies
nada.** Ese `cp` escribiría español sobre el `.en.md`, que es el único registro de qué
inglés se tradujo. Sin él, `check-translations` deja de poder detectar cambios en ese
archivo **para siempre**. Trabaja directo sobre el `.md` y deja el `.en.md` intacto:
`update-origin` ya lo actualizó con el inglés nuevo.

- `archivo.en.md` → Original en inglés (respaldo — lo mantiene `update-origin`)
- `archivo.md` → Traducción al español (editar este)

> [!IMPORTANT]
> Toda traducción necesita su `.en.md`, incluso las parciales. Sin él, el próximo
> `update-origin` sobrescribe tu traducción con el inglés y el trabajo se pierde sin
> aviso (`tools/update-origin.mjs:76-81`).

### Paso 2 — Leer el archivo completo

Lee todo el contenido antes de empezar. Identifica:

- Bloques de código (NO traducir el código, SÍ los comentarios)
- Etiquetas especiales `<docs-*>`
- Encabezados con anchors que tengan enlaces internos

### Paso 3 — Traducir

Traduce párrafo por párrafo, no palabra por palabra. Aplica las reglas de vocabulario de este documento.

**Alineación de líneas:** Intenta mantener el mismo número de líneas entre el original y la traducción para facilitar diffs futuros.

### Paso 4 — Fijar los anchors al traducir encabezados

**El texto del encabezado se traduce; su anchor no.** Al traducir un encabezado,
conserva el anchor inglés con la sintaxis `{#anchor}`:

```markdown
<!-- original -->
### Actively supported versions

<!-- traducción -->
### Versiones con soporte activo {#actively-supported-versions}
```

Sin eso, el anchor pasa a derivarse del español (`#versiones-con-soporte-activo`)
y **todos los enlaces que apuntaban a ese encabezado se rompen** — incluidos los
de otras páginas que tú no estás tocando. El build de Angular valida los enlaces
internos y **aborta**:

```
Error: Link target "reference/releases#actively-supported-versions" in
adev/src/content/reference/versions.md does not exist in the defined guide routes.
```

No es opcional ni cosmético: 285 archivos de `adev-es` ya lo hacen. Si el
encabezado inglés ya traía su propio `{#...}`, cópialo tal cual.

**Los enlaces internos de la propia página también apuntan al anchor inglés.**
Si traduces «Deprecation policy» y enlazas a él desde otro párrafo, el enlace
sigue siendo `[política de deprecación](#deprecation-policy)`, no
`(#política-de-deprecación)`. El build valida los anchors dentro del documento y
también aborta ahí:

```
Error: The file "adev/src/content/reference/releases.md" contains an anchor link
to "about:blank#política-de-deprecación" which does not exist in the document.
```

Comprueba también quién enlaza hacia la página que traduces:

```shell
grep -rn "<ruta-sin-extensión>#" adev-es/src/content origin/adev/src/content
```

Si algún enlace entrante apunta a un anchor que ya no existe, el arreglo correcto
es fijar el anchor en tu encabezado, no reescribir el enlace de la otra página.

Si el archivo afecta la navegación del sitio, revisa:

```
adev-es/src/app/routing/sub-navigation-data.ts
```

### Paso 5 — Checklist de calidad

Ejecuta el checklist al final de este documento antes de entregar.

---

## Reglas de Vocabulario

### 1. Términos que NO se traducen (siempre en inglés)

`standalone` · `bootstrap` · `DOM` · `shadow DOM` · `shadow tree` · `shadow root` · `framework` · `tree-shaking` · `API` · `drag and drop` · `drop list` · `callback` · `placeholder` · `scaffold` / `scaffolding` · `toolchain` · `CDK` · `lazy loading` · `eager loading` · `keyframes` · `easing` · `DevOps` · `mock` · `stub` · `spy` · `fixture` · `test bed` · `harness` · `polyfill` · `shim` · `middleware` · `pipeline` · `endpoint` · `trigger` _(contexto de animaciones)_ · `host bindings`

### 2. Términos Híbridos

En texto narrativo usa la traducción española. En código, nombres de API y decoradores mantén el inglés.

| Término         | Narrativo (ES)                               | Código/API (EN)                     |
| --------------- | -------------------------------------------- | ----------------------------------- |
| component       | componente                                   | `@Component`, `component`           |
| directive       | directiva                                    | `@Directive`, `directive`           |
| template        | plantilla                                    | `template:`                         |
| decorator       | decorador                                    | `@Component()`, `@Input()`          |
| input           | entrada(s)                                   | `input()`, `inputs:`, `@Input()`    |
| output          | salida(s)                                    | `output()`, `outputs:`, `@Output()` |
| provider        | proveedor(es)                                | `providers:`, `provider`            |
| style           | estilo(s)                                    | `styles:`, `style`                  |
| animation       | animación(es)                                | `animations:`, `animation`          |
| trigger         | disparador (general) / trigger (animaciones) | `trigger()`                         |
| state           | estado(s)                                    | `state()`, `state:`                 |
| transition      | transición(es)                               | `transition()`                      |
| form            | formulario(s)                                | `form`, `FormGroup`, `FormControl`  |
| control         | control(es)                                  | `FormControl`, `control`            |
| validator       | validador(es)                                | `Validators`, `validator`           |
| pipe            | pipe(s)                                      | `@Pipe`, `pipe`                     |
| module          | módulo(s)                                    | `@NgModule`, `module`               |
| route / routing | ruta(s) / enrutamiento                       | `Route`, `Router`, `routing`        |
| signal          | signal(s) _(preferir sobre "señal")_         | `signal()`                          |
| computed        | computed _(preferir sobre "calculado")_      | `computed()`                        |
| guard           | guard _(preferir sobre "guardia")_           | `CanActivate`, etc.                 |

### 3. Traducciones Consistentes

| Inglés                     | Español                                               |
| -------------------------- | ----------------------------------------------------- |
| host element               | elemento host                                         |
| binding                    | enlace (narrativo)                                    |
| property binding           | enlace de propiedad                                   |
| attribute binding          | enlace de atributo                                    |
| event binding              | enlace de evento                                      |
| two-way binding            | enlace bidireccional                                  |
| lifecycle hooks            | hooks de ciclo de vida                                |
| dependency injection       | inyección de dependencias                             |
| inject (verbo)             | inyectar                                              |
| injector                   | inyector                                              |
| service                    | servicio                                              |
| render (verbo)             | renderizar                                            |
| rendering                  | renderización                                         |
| compile                    | compilar                                              |
| compilation                | compilación                                           |
| runtime                    | tiempo de ejecución                                   |
| build time                 | tiempo de compilación                                 |
| build (CLI)                | compilar (en contexto de `ng build`)                  |
| encapsulation              | encapsulación                                         |
| view encapsulation         | encapsulación de vista                                |
| event listener             | escuchador de eventos                                 |
| event handler              | manejador de eventos                                  |
| query / queries            | consulta(s)                                           |
| effect                     | efecto(s)                                             |
| subscription               | suscripción                                           |
| subscribe                  | suscribirse                                           |
| emit                       | emitir                                                |
| observable                 | observable                                            |
| library                    | biblioteca (**NO** "librería" — librería = bookstore) |
| environment                | entorno                                               |
| deployment                 | despliegue                                            |
| hydration                  | hidratación                                           |
| workspace                  | espacio de trabajo                                    |
| overview                   | visión general                                        |
| getting started            | primeros pasos                                        |
| best practices             | mejores prácticas                                     |
| accessibility              | accesibilidad                                         |
| security                   | seguridad                                             |
| migration                  | migración                                             |
| deprecated                 | deprecado/a                                           |
| legacy                     | legacy _(preferir sobre "heredado")_                  |
| bundle                     | bundle _(preferir sobre "paquete")_                   |
| chunk                      | chunk _(preferir sobre "fragmento")_                  |
| resolver                   | resolver                                              |
| interceptor                | interceptor                                           |
| schematic                  | schematic                                             |
| performance                | rendimiento                                           |
| cache                      | caché                                                 |
| payload                    | payload                                               |
| request                    | petición / solicitud                                  |
| response                   | respuesta                                             |
| reusable                   | reutilizable                                          |
| boilerplate                | código repetitivo / boilerplate                       |
| breaking change            | cambio disruptivo                                     |
| feature                    | característica / funcionalidad                        |
| authoring                  | crear / desarrollar (**NO** "autorizar")              |
| profiling                  | perfilado                                             |
| interop / interoperability | interoperabilidad                                     |
| selector                   | selector                                              |
| metadata                   | metadatos                                             |
| consumer                   | consumidor                                            |
| instance                   | instancia                                             |
| attribute directive        | directiva de atributo                                 |
| host directive             | directiva host                                        |
| structural directive       | directiva estructural                                 |
| alias                      | alias                                                  |
| view query                 | consulta de vista                                     |
| content query              | consulta de contenido                                 |
| observer                   | observador                                            |
| broadcast (verbo)          | difundir / transmitir                                 |
| reactive                   | reactivo/a                                            |
| immutable                  | inmutable                                             |
| mutable                    | mutable                                               |
| token                      | token                                                 |
| injection token            | token de inyección                                    |
| wrapper                    | envoltorio / wrapper _(según contexto)_               |
| helper                     | helper _(preferir sobre "ayudante" en código)_        |
| utility                    | utilidad                                              |
| entry component            | componente de entrada                                 |
| preload                    | precargar                                             |
| asset                      | recurso / asset _(según contexto)_                    |
| project                    | proyecto                                              |
| builder                    | builder / constructor _(según contexto)_              |
| architect                  | architect                                             |
| fallback                   | alternativa / fallback _(según contexto)_             |
| enhancement                | mejora                                                |
| bugfix                     | corrección de error / bugfix                          |
| workaround                 | solución alternativa / workaround                     |
| benchmark                  | benchmark / punto de referencia                       |
| session                    | sesión                                                |
| storage                    | almacenamiento                                        |
| cookie                     | cookie                                                 |
| header                     | encabezado / header _(según contexto)_                |
| composable                 | componible                                            |
| draggable                  | arrastrable                                           |
| droppable                  | soltable                                              |
| sortable                   | ordenable                                             |
| resizable                  | redimensionable                                       |
| end-to-end (E2E)           | de extremo a extremo                                  |
| style guide                | guía de estilo                                        |
| validation                 | validación                                            |
| custom controls            | controles personalizados                              |
| field state                | estado de campo                                       |

### 4. Frases y Verbos Comunes

| Inglés               | Español                                |
| -------------------- | -------------------------------------- |
| Learn more about     | Aprende más sobre                      |
| Note that...         | Ten en cuenta que...                   |
| Keep in mind that... | Ten en cuenta que... / Recuerda que... |
| Make sure to...      | Asegúrate de...                        |
| Under the hood       | Internamente / Bajo el capó            |
| Out of the box       | De forma predeterminada                |
| Before you begin     | Antes de comenzar                      |
| As shown above       | Como se mostró anteriormente           |
| configure            | configurar                             |
| set up               | configurar / establecer                |
| invoke               | invocar                                |
| trigger (general)    | disparar / activar                     |
| fire (event)         | disparar / lanzar                      |
| handle               | manejar / gestionar                    |
| parse                | parsear                                |
| fetch                | obtener / recuperar                    |
| override             | sobrescribir / anular                  |
| bind                 | vincular / enlazar                     |
| dispatch             | despachar / enviar                     |
| validate             | validar                                |
| sanitize             | sanear / sanitizar                     |
| refactor             | refactorizar                           |
| optimize             | optimizar                              |
| debounce             | debounce / anti-rebote                 |
| throttle             | throttle / limitar frecuencia          |
| import               | importar                               |
| export               | exportar                               |
| define               | definir                                |
| declare              | declarar                               |
| initialize           | inicializar                            |
| instantiate          | instanciar                             |
| call                 | llamar                                 |
| process              | procesar                               |
| retrieve             | recuperar / obtener                    |
| update               | actualizar                             |
| modify               | modificar                              |
| extend               | extender                               |
| implement            | implementar                            |
| provide              | proporcionar / proveer                 |
| attach               | adjuntar / anexar                      |
| detach               | desconectar / desvincular              |
| unsubscribe          | cancelar suscripción / desuscribirse   |
| observe              | observar                               |
| watch                | observar / vigilar                     |
| listen (to)          | escuchar                               |
| navigate             | navegar                                |
| redirect             | redirigir                              |
| resolve              | resolver                               |
| reject               | rechazar                               |
| transform            | transformar                            |
| map                  | mapear                                 |
| filter               | filtrar                                |
| reduce               | reducir                                |
| merge                | fusionar / combinar                    |
| split                | dividir / separar                      |
| combine              | combinar                               |
| compose              | componer                               |

### 5. Adjetivos y Estados Técnicos

| Inglés               | Español                     |
| --------------------- | ---------------------------- |
| optional              | opcional                     |
| required              | requerido / obligatorio      |
| default               | predeterminado / por defecto |
| custom                | personalizado                |
| built-in              | integrado / incorporado      |
| external              | externo                      |
| internal              | interno                      |
| public                | público                      |
| private               | privado                      |
| protected             | protegido                    |
| static                | estático                     |
| dynamic               | dinámico                     |
| asynchronous / async  | asíncrono / async            |
| synchronous           | síncrono                     |
| imperative            | imperativo                   |
| declarative           | declarativo                  |
| enabled               | habilitado / activado        |
| disabled              | deshabilitado / desactivado  |
| available             | disponible                   |
| experimental          | experimental                 |
| stable                | estable                      |
| unstable              | inestable                    |
| pending               | pendiente                    |
| resolved              | resuelto                     |
| rejected              | rechazado                    |
| active                | activo                       |
| inactive              | inactivo                     |

---

## Casos Especiales

### Formularios (Forms)

- `touched` → touched _(preferir sobre "tocado")_
- `pristine` → pristine _(preferir sobre "prístino")_
- `dirty` → dirty _(preferir sobre "modificado")_
- `valid` / `invalid` → válido / inválido

### Signals

- `signal` → signal _(puede usar "señal" entre paréntesis la primera vez)_
- `computed` → computed _(no traducir)_
- `effect` → efecto
- `writable signal` → signal editable
- `read-only signal` → signal de solo lectura

### Etiquetas especiales de Angular docs

| Etiqueta                   | Qué hacer                                          |
| -------------------------- | -------------------------------------------------- |
| `<docs-callout>`           | Traducir contenido interno                         |
| `<docs-code header="...">` | Traducir atributo `header` si es texto descriptivo |
| `<docs-step title="...">`  | Traducir atributo `title`                          |
| `NOTE:` `TIP:` `IMPORTANT:` `HELPFUL:` `CRITICAL:` `SUMMARY:` `QUESTION:` `TODO:` `TL;DR:` | **NO traducir el prefijo.** Traducir solo el texto que sigue. |

> [!WARNING]
> **Los prefijos de alerta son claves del tokenizer, no prosa.**
>
> `adev/shared-docs/pipeline/shared/marked/extensions/docs-alert.mts` solo reconoce
> las claves en inglés. `NOTA:`, `CONSEJO:`, `ÚTIL:` e `IMPORTANTE:` **no matchean**,
> así que el aviso se renderiza como párrafo plano en vez de caja de color.
>
> Hay 423 callouts ya rotos en el corpus por esta causa. angular-ja, con 10 años de
> experiencia, mantiene la clave en inglés y traduce solo el cuerpo:
>
> ```markdown
> HELPFUL: これは、一般的なランタイムエラー...
> ```
>
> Haz lo mismo en español:
>
> ```markdown
> HELPFUL: Este es el equivalente del compilador para el error...
> ```

### Anchors de encabezados

Al traducir un encabezado, el anchor cambia automáticamente. Actualiza los enlaces internos:

```markdown
<!-- Original -->

### Trusting safe values

[ver sección](#trusting-safe-values)

<!-- Traducido -->

### Confiar en valores seguros

[ver sección](#confiar-en-valores-seguros)
```

### Títulos — Patrones comunes

- "Introduction to X" → "Introducción a X"
- "Getting started with X" → "Primeros pasos con X"
- "Understanding X" → "Entendiendo X" / "Comprendiendo X"
- "Working with X" → "Trabajando con X"
- "Advanced X" → "X avanzado/a"
- "X in Angular" → "X en Angular" (**NO** "X de Angular")
- "Building X" → "Construyendo X" / "Creando X"

### Preposición con Angular

- Usar **"en Angular"** → "animaciones en Angular", "routing en Angular"
- Evitar **"de Angular"** (suena posesivo)

---

## Errores Comunes a Evitar

1. **NO** traducir funciones/APIs: `input()` → ~~`entrada()`~~
2. **NO** traducir props de configuración: `providers:` → ~~`proveedores:`~~
3. **NO** traducir dentro de backticks (código): `` `@Component` `` → ~~`` `@Componente` ``~~
4. **NO** usar "de Angular" para contextos: ~~"animaciones de Angular"~~ → "animaciones en Angular"
5. **NO** dejar sin traducir términos del glosario: `library` → ~~`library`~~ → "biblioteca"
6. **NO** usar "librería" para "library": ~~"librerías"~~ → "bibliotecas"
7. **NO** traducir nombres de archivos, rutas, URLs
8. **NO** omitir comentarios en código (sí se traducen)
9. **NO** olvidar actualizar anchors al traducir encabezados
10. **NO** mezclar inconsistentemente: si usas "signal", no cambies a "señal"
11. **NO** usar "construcción" para `build` en CLI: ~~"sistema de construcción"~~ → "sistema de compilación"
12. **NO** confundir "authoring" con "autorizar": "Authoring schematics" → "Crear schematics"

---

## Checklist de Control de Calidad

Antes de finalizar, verifica:

- [ ] **Backup creado:** `archivo.en.md` existe
- [ ] **Código intacto:** ningún bloque de código fue traducido (excepto comentarios)
- [ ] **APIs en inglés:** decoradores, funciones y nombres de API permanecen en inglés
- [ ] **Glosario aplicado:** términos del glosario tienen las traducciones correctas
- [ ] **"NO traducir" respetados:** `standalone`, `bootstrap`, `lazy loading`, etc. en inglés
- [ ] **Markdown intacto:** encabezados, listas, tablas, enlaces, énfasis preservados
- [ ] **Etiquetas `<docs-*>`:** contenido interno traducido, estructura preservada
- [ ] **Archivos y rutas:** sin traducir
- [ ] **Versiones:** en formato original ("Angular 17", no "Angular diecisiete")
- [ ] **Anchors actualizados:** enlaces internos apuntan a los anchors traducidos
- [ ] **Comentarios en código:** traducidos
- [ ] **Naturalidad:** el texto español suena natural, no como traducción literal
- [ ] **Consistencia:** mismo término español para mismo concepto en inglés
- [ ] **Preposición:** "en Angular" en lugar de "de Angular"
- [ ] **Navegación:** si aplica, `sub-navigation-data.ts` actualizado
- [ ] **Git:** archivos `.md` y `.en.md` staged para el commit
