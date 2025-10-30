# Agregar el paquete localize

Para aprovechar las características de localización de Angular, usa el [CLI de Angular][CliMain] para agregar el paquete `@angular/localize` a tu proyecto.

Para agregar el paquete `@angular/localize`, usa el siguiente comando para actualizar los archivos `package.json` y de configuración de TypeScript en tu proyecto.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="add-localize"/>

Esto agrega `types: ["@angular/localize"]` en los archivos de configuración de TypeScript.
También agrega la línea `/// <reference types="@angular/localize" />` al inicio del archivo `main.ts`, que es la referencia a la definición de tipos.

ÚTIL: Para más información sobre los archivos `package.json` y `tsconfig.json`, consulta [Dependencias npm del espacio de trabajo][GuideNpmPackages] y [Configuración de TypeScript][GuideTsConfig]. Para aprender sobre las directivas Triple-slash visita el [Manual de TypeScript](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-).

Si `@angular/localize` no está instalado e intentas construir una versión localizada de tu proyecto (por ejemplo, mientras usas los atributos `i18n` en templates), el [CLI de Angular][CliMain] generará un error que contendrá los pasos que puedes seguir para habilitar i18n en tu proyecto.

## Opciones

| OPCIÓN           | DESCRIPCIÓN | TIPO DE VALOR | VALOR PREDETERMINADO
|:---              |:---    |:------     |:------
| `--project`      | El nombre del proyecto. | `string` |
| `--use-at-runtime` | Si se establece, entonces `$localize` puede usarse en runtime. Además `@angular/localize` se incluye en la sección `dependencies` de `package.json`, en lugar de `devDependencies`, que es el valor predeterminado.  | `boolean` | `false`

Para más opciones disponibles, consulta `ng add` en el [CLI de Angular][CliMain].

## Próximos pasos

<docs-pill-row>
  <docs-pill href="guide/i18n/locale-id" title="Referirse a configuraciones regionales por ID"/>
</docs-pill-row>

[CliMain]: cli "CLI Overview and Command Reference | Angular"

[GuideNpmPackages]: reference/configs/npm-packages "Workspace npm dependencies | Angular"

[GuideTsConfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html "TypeScript Configuration"
