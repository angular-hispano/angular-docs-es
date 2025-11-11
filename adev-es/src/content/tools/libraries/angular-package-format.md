# Formato de paquete Angular

Este documento describe el formato de paquete Angular \(APF\).
APF es una especificación específica de Angular para la estructura y formato de paquetes npm que es usada por todos los paquetes propios de Angular \(`@angular/core`, `@angular/material`, etc.\) y la mayoría de las librerías de Angular de terceros.

APF permite que un paquete funcione sin problemas en la mayoría de los escenarios comunes que usan Angular.
Los paquetes que usan APF son compatibles con las herramientas ofrecidas por el equipo de Angular así como con el ecosistema JavaScript más amplio.
Se recomienda que los desarrolladores de librerías de terceros sigan el mismo formato de paquete npm.

ÚTIL: APF tiene versiones junto con el resto de Angular, y cada versión mayor mejora el formato de paquete.
Puedes encontrar las versiones de la especificación anteriores a v13 en este [documento de google](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

## ¿Por qué especificar un formato de paquete?

En el panorama actual de JavaScript, los desarrolladores consumen paquetes de muchas maneras diferentes, usando muchos toolchains diferentes \(webpack, Rollup, esbuild, etc.\).
Estas herramientas pueden entender y requerir diferentes entradas - algunas herramientas pueden procesar la última versión del lenguaje ES, mientras que otras pueden beneficiarse de consumir directamente una versión más antigua de ES.

El formato de distribución de Angular soporta todas las herramientas de desarrollo y flujos de trabajo comúnmente usados, y agrega énfasis en optimizaciones que resultan ya sea en un tamaño de carga útil de aplicación más pequeño o un ciclo de iteración de desarrollo más rápido \(tiempo de compilación\).

Los desarrolladores pueden confiar en Angular CLI y [ng-packagr](https://github.com/ng-packagr/ng-packagr) \(una herramienta de compilación que usa Angular CLI\) para producir paquetes en el formato de paquete Angular.
Consulta la guía [Creando librerías](tools/libraries/creating-libraries) para más detalles.

## Diseño de archivos

El siguiente ejemplo muestra una versión simplificada del diseño de archivos del paquete `@angular/core`, con una explicación para cada archivo en el paquete.

```markdown
node_modules/@angular/core
├── README.md
├── package.json
├── index.d.ts
├── fesm2022
│   ├── core.mjs
│   ├── core.mjs.map
│   ├── testing.mjs
│   └── testing.mjs.map
└── testing
    └── index.d.ts
```

Esta tabla describe el diseño de archivos bajo `node_modules/@angular/core` anotado para describir el propósito de archivos y directorios:

| Archivos                                                                                                                                                     | Propósito |
|:---                                                                                                                                                       |:---     |
| `README.md`                                                                                                                                               | README del paquete, usado por la interfaz web de npmjs.                                                                                                                                                                          |
| `package.json`                                                                                                                                            | `package.json` principal, describiendo el paquete en sí así como todos los puntos de entrada disponibles y formatos de código. Este archivo contiene el mapeo "exports" usado por runtimes y herramientas para realizar resolución de módulos. |
| `index.d.ts`                                                                                                                                               | `.d.ts` empaquetado para el punto de entrada principal `@angular/core`.                                                                                                                                                                    |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | Código para todos los puntos de entrada en formato ES2022 aplanado \(FESM\), junto con mapas de código fuente.                                                                                                                           |
| `testing/`                                                                                                                                                | Directorio representando el punto de entrada "testing".                                                                                                                                                               |
| `testing/index.d.ts`                                                                                                                                    | `.d.ts` empaquetado para el punto de entrada `@angular/core/testing`.                                                                                                                                                                     |

## `package.json`

El `package.json` principal contiene metadatos importantes del paquete, incluyendo lo siguiente:

* [Declara](#esm-declaration) que el paquete está en formato de módulo EcmaScript \(ESM\)
* Contiene un [campo `"exports"`](#exports) que define los formatos de código fuente disponibles de todos los puntos de entrada
* Contiene [claves](#legacy-resolution-keys) que definen los formatos de código fuente disponibles del punto de entrada principal `@angular/core`, para herramientas que no entienden `"exports"`.
    Estas claves se consideran deprecadas, y podrían eliminarse a medida que el soporte para `"exports"` se implemente en todo el ecosistema.

* Declara si el paquete contiene [efectos secundarios](#side-effects)

### Declaración ESM

El `package.json` de nivel superior contiene la clave:

<docs-code language="javascript">

{
  "type": "module"
}

</docs-code>

Esto informa a los resolvers que el código dentro del paquete está usando módulos EcmaScript en oposición a módulos CommonJS.

### `"exports"`

El campo `"exports"` tiene la siguiente estructura:

<docs-code language="javascript">

"exports": {
  "./schematics/*": {
    "default": "./schematics/*.js"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./core.d.ts",
    "default": "./fesm2022/core.mjs"
  },
  "./testing": {
    "types": "./testing/testing.d.ts",
    "default": "./fesm2022/testing.mjs"
  }
}

</docs-code>

De interés principal son las claves `"."` y `"./testing"`, que definen los formatos de código disponibles para el punto de entrada principal `@angular/core` y el punto de entrada secundario `@angular/core/testing`, respectivamente.
Para cada punto de entrada, los formatos disponibles son:

| Formatos                   | Detalles |
|:---                       |:---     |
| Tipados \(archivos `.d.ts`\) | Los archivos `.d.ts` son usados por TypeScript cuando se depende de un paquete dado.                                                                                                           |
| `default`               | Código ES2022 aplanado en una sola fuente.

Las herramientas que conocen estas claves pueden seleccionar preferentemente un formato de código deseable desde `"exports"`.

Las librerías pueden querer exponer archivos estáticos adicionales que no están capturados por las exportaciones de los puntos de entrada basados en JavaScript, como mixins de Sass o CSS pre-compilado.

Para más información, consulta [Gestionando recursos en una librería](tools/libraries/creating-libraries#managing-assets-in-a-library).

### Claves de resolución heredadas

Además de `"exports"`, el `package.json` de nivel superior también define claves de resolución de módulos heredadas para resolvers que no soportan `"exports"`.
Para `@angular/core` estas son:

<docs-code language="javascript">

{
  "module": "./fesm2022/core.mjs",
  "typings": "./core.d.ts",
}

</docs-code>

Como se muestra en el fragmento de código anterior, un resolver de módulos puede usar estas claves para cargar un formato de código específico.

### Efectos secundarios

La última función de `package.json` es declarar si el paquete tiene [efectos secundarios](#sideeffects-flag).

<docs-code language="javascript">

{
  "sideEffects": false
}

</docs-code>

La mayoría de los paquetes de Angular no deberían depender de efectos secundarios de nivel superior, y por lo tanto deberían incluir esta declaración.

## Puntos de entrada y división de código

Los paquetes en el formato de paquete Angular contienen un punto de entrada principal y cero o más puntos de entrada secundarios \(por ejemplo, `@angular/common/http`\).
Los puntos de entrada sirven para varias funciones.

1. Definen los especificadores de módulo desde los cuales los usuarios importan código \(por ejemplo, `@angular/core` y `@angular/core/testing`\).

    Los usuarios típicamente perciben estos puntos de entrada como grupos distintos de símbolos, con diferentes propósitos o capacidades.

    Puntos de entrada específicos podrían usarse solo para propósitos especiales, como pruebas.
    Tales APIs pueden separarse del punto de entrada principal para reducir la posibilidad de que se usen accidental o incorrectamente.

1. Definen la granularidad a la que el código puede cargarse de forma diferida.

    Muchas herramientas de compilación modernas solo son capaces de "dividir código" \(también conocido como lazy loading\) a nivel de módulo ES.
    El formato de paquete Angular usa principalmente un único módulo ES "aplanado" por punto de entrada. Esto significa que la mayoría de las herramientas de compilación no pueden dividir código con un único punto de entrada en múltiples fragmentos de salida.

La regla general para paquetes APF es usar puntos de entrada para los conjuntos más pequeños posibles de código lógicamente conectado.
Por ejemplo, el paquete Angular Material publica cada componente lógico o conjunto de componentes como un punto de entrada separado - uno para Button, uno para Tabs, etc.
Esto permite que cada componente de Material se cargue de forma diferida por separado, si se desea.

No todas las librerías requieren tal granularidad.
La mayoría de las librerías con un único propósito lógico deberían publicarse como un único punto de entrada.
`@angular/core` por ejemplo usa un único punto de entrada para el runtime, porque el runtime de Angular generalmente se usa como una sola entidad.

### Resolución de puntos de entrada secundarios

Los puntos de entrada secundarios pueden resolverse a través del campo `"exports"` del `package.json` para el paquete.

## README.md

El archivo README en formato Markdown que se usa para mostrar la descripción de un paquete en npm y GitHub.

Ejemplo de contenido README del paquete @angular/core:

<docs-code language="html">

Angular
&equals;&equals;&equals;&equals;&equals;&equals;&equals;

The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

License: MIT

</docs-code>

## Compilación parcial

Las librerías en el formato de paquete Angular deben publicarse en modo "compilación parcial".
Este es un modo de compilación para `ngc` que produce código Angular compilado que no está vinculado a una versión específica del runtime de Angular, en contraste con la compilación completa usada para aplicaciones, donde las versiones del compilador y runtime de Angular deben coincidir exactamente.

Para compilar parcialmente código Angular, usa la bandera `compilationMode` en la propiedad `angularCompilerOptions` de tu `tsconfig.json`:

<docs-code language="javascript">

{
  …
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}

</docs-code>

El código de librería compilado parcialmente se convierte luego a código completamente compilado durante el proceso de compilación de la aplicación por el Angular CLI.

Si tu pipeline de compilación no usa el Angular CLI, consulta la guía [Consumiendo código partial ivy fuera del Angular CLI](tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli).

## Optimizaciones

### Aplanamiento de módulos ES

El formato de paquete Angular especifica que el código se publique en formato de módulo ES "aplanado".
Esto reduce significativamente el tiempo de compilación de aplicaciones de Angular así como el tiempo de descarga y análisis del bundle final de la aplicación.
Por favor revisa el excelente post ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) de Nolan Lawson.

El compilador de Angular puede generar archivos de módulos ES índice. Herramientas como Rollup pueden usar estos archivos para generar módulos aplanados en un formato de archivo *Módulo ES Aplanado* (FESM).

FESM es un formato de archivo creado aplanando todos los módulos ES accesibles desde un punto de entrada en un único módulo ES.
Se forma siguiendo todas las importaciones desde un paquete y copiando ese código en un único archivo mientras se preservan todas las exportaciones públicas de ES y se eliminan todas las importaciones privadas.

El nombre abreviado, FESM, pronunciado *fe-som*, puede ir seguido de un número como FESM2020.
El número se refiere al nivel de lenguaje del JavaScript dentro del módulo.
Por lo tanto, un archivo FESM2022 sería ESM+ES2022 e incluiría declaraciones de importación/exportación y código fuente ES2022.

Para generar un archivo índice de módulo ES aplanado, usa las siguientes opciones de configuración en tu archivo tsconfig.json:

<docs-code language="javascript">

{
  "compilerOptions": {
    …
    "module": "esnext",
    "target": "es2022",
    …
  },
  "angularCompilerOptions": {
    …
    "flatModuleOutFile": "my-ui-lib.js",
    "flatModuleId": "my-ui-lib"
  }
}

</docs-code>

Una vez que el archivo índice \(por ejemplo, `my-ui-lib.js`\) es generado por ngc, bundlers y optimizadores como Rollup pueden usarse para producir el archivo ESM aplanado.

### Bandera "sideEffects"

Por defecto, los módulos EcmaScript tienen efectos secundarios: importar desde un módulo asegura que cualquier código en el nivel superior de ese módulo debería ejecutarse.
Esto es a menudo indeseable, ya que la mayoría del código con efectos secundarios en módulos típicos no es verdaderamente con efectos secundarios, sino que solo afecta símbolos específicos.
Si esos símbolos no se importan y usan, a menudo es deseable eliminarlos en un proceso de optimización conocido como tree-shaking, y el código con efectos secundarios puede prevenir esto.

Herramientas de compilación como webpack soportan una bandera que permite que los paquetes declaren que no dependen de código con efectos secundarios en el nivel superior de sus módulos, dando a las herramientas más libertad para hacer tree-shaking del código del paquete.
El resultado final de estas optimizaciones debería ser un tamaño de bundle más pequeño y mejor distribución de código en fragmentos de bundle después de la división de código.
Esta optimización puede romper tu código si contiene efectos secundarios no locales - esto sin embargo no es común en aplicaciones de Angular y generalmente es un signo de mal diseño.
La recomendación es que todos los paquetes reclamen el estado libre de efectos secundarios estableciendo la propiedad `sideEffects` en `false`, y que los desarrolladores sigan la [Guía de estilo de Angular](/style-guide) que naturalmente resulta en código sin efectos secundarios no locales.

Más información: [documentación de webpack sobre efectos secundarios](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### Nivel de lenguaje ES2022

ES2022 es ahora el nivel de lenguaje predeterminado que es consumido por Angular CLI y otras herramientas.
El Angular CLI reduce el nivel del bundle a un nivel de lenguaje que es soportado por todos los navegadores objetivo en tiempo de compilación de la aplicación.

### Empaquetado de d.ts / aplanamiento de definiciones de tipo

A partir de APF v8, se recomienda empaquetar definiciones de TypeScript.
El empaquetado de definiciones de tipo puede acelerar significativamente las compilaciones para los usuarios, especialmente si hay muchos archivos fuente `.ts` individuales en tu librería.

Angular usa [`rollup-plugin-dts`](https://github.com/Swatinem/rollup-plugin-dts) para aplanar archivos `.d.ts` (usando `rollup`, similar a cómo se crean los archivos FESM).

Usar rollup para empaquetado de `.d.ts` es beneficioso ya que soporta división de código entre puntos de entrada.
Por ejemplo, considera que tienes múltiples puntos de entrada que dependen del mismo tipo compartido, se crearía un archivo `.d.ts` compartido junto con los archivos `.d.ts` aplanados más grandes.
Esto es deseable y evita duplicación de tipos.

### Tslib

A partir de APF v10, se recomienda agregar tslib como una dependencia directa de tu punto de entrada principal.
Esto es porque la versión de tslib está vinculada a la versión de TypeScript usada para compilar tu librería.

## Ejemplos

<docs-pill-row>
  <docs-pill href="https://unpkg.com/browse/@angular/core@17.0.0/" title="@angular/core package"/>
  <docs-pill href="https://unpkg.com/browse/@angular/material@17.0.0/" title="@angular/material package"/>
</docs-pill-row>

## Definición de términos

Los siguientes términos se usan a lo largo de este documento intencionalmente.
En esta sección están las definiciones de todos ellos para proporcionar claridad adicional.

### Paquete

El conjunto más pequeño de archivos que se publican en NPM y se instalan juntos, por ejemplo `@angular/core`.
Este paquete incluye un manifiesto llamado package.json, código fuente compilado, archivos de definición de TypeScript, mapas de código fuente, metadatos, etc.
El paquete se instala con `npm install @angular/core`.

### Símbolo

Una clase, función, constante o variable contenida en un módulo y opcionalmente hecha visible al mundo externo a través de una exportación de módulo.

### Módulo

Abreviatura de módulos EcmaScript.
Un archivo que contiene declaraciones que importan y exportan símbolos.
Esto es idéntico a la definición de módulos en la especificación EcmaScript.

### ESM

Abreviatura de módulos EcmaScript \(ver arriba\).

### FESM

Abreviatura de módulos ES aplanados y consiste en un formato de archivo creado aplanando todos los módulos ES accesibles desde un punto de entrada en un único módulo ES.

### ID de módulo

El identificador de un módulo usado en las declaraciones de importación \(por ejemplo, `@angular/core`\).
El ID a menudo mapea directamente a una ruta en el sistema de archivos, pero esto no siempre es el caso debido a varias estrategias de resolución de módulos.

### Especificador de módulo

Un identificador de módulo \(ver arriba\).

### Estrategia de resolución de módulos

Algoritmo usado para convertir IDs de módulo a rutas en el sistema de archivos.
Node.js tiene uno que está bien especificado y ampliamente usado, TypeScript soporta varias estrategias de resolución de módulos, [Closure Compiler](https://developers.google.com/closure/compiler) tiene otra estrategia diferente.

### Formato de módulo

Especificación de la sintaxis del módulo que cubre como mínimo la sintaxis para importar y exportar desde un archivo.
Formatos de módulo comunes son CommonJS \(CJS, típicamente usado para aplicaciones Node.js\) o módulos EcmaScript \(ESM\).
El formato de módulo indica solo el empaquetado de los módulos individuales, pero no las características del lenguaje JavaScript usadas para formar el contenido del módulo.
Debido a esto, el equipo de Angular a menudo usa el especificador de nivel de lenguaje como un sufijo al formato de módulo, \(por ejemplo, ESM+ES2022 especifica que el módulo está en formato ESM y contiene código ES2022\).

### Bundle

Un artefacto en forma de un único archivo JS, producido por una herramienta de compilación \(por ejemplo, [webpack](https://webpack.js.org) o [Rollup](https://rollupjs.org)\) que contiene símbolos originados en uno o más módulos.
Los bundles son una solución alternativa específica del navegador que reduce la carga de red que sería causada si los navegadores comenzaran a descargar cientos si no decenas de miles de archivos.
Node.js típicamente no usa bundles.
Formatos de bundle comunes son UMD y System.register.

### Nivel de lenguaje

El lenguaje del código \(ES2022\).
Independiente del formato de módulo.

### Punto de entrada

Un módulo destinado a ser importado por el usuario.
Se referencia por un ID de módulo único y exporta la API pública referenciada por ese ID de módulo.
Un ejemplo es `@angular/core` o `@angular/core/testing`.
Ambos puntos de entrada existen en el paquete `@angular/core`, pero exportan diferentes símbolos.
Un paquete puede tener muchos puntos de entrada.

### Importación profunda

Un proceso de recuperar símbolos de módulos que no son puntos de entrada.
Estos IDs de módulo generalmente se consideran APIs privadas que pueden cambiar durante la vida del proyecto o mientras se crea el bundle para el paquete dado.

### Importación de nivel superior

Una importación proveniente de un punto de entrada.
Las importaciones de nivel superior disponibles son las que definen la API pública y están expuestas en módulos "@angular/name", como `@angular/core` o `@angular/common`.

### Tree-shaking

El proceso de identificar y eliminar código no usado por una aplicación - también conocido como eliminación de código muerto.
Esta es una optimización global realizada a nivel de aplicación usando herramientas como [Rollup](https://rollupjs.org), [Closure Compiler](https://developers.google.com/closure/compiler), o [Terser](https://github.com/terser/terser).

### Compilador AOT

El compilador Ahead of Time para Angular.

### Definiciones de tipo aplanadas

Las definiciones de TypeScript empaquetadas generadas desde [API Extractor](https://api-extractor.com).
