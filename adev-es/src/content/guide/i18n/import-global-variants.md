# Importar variantes globales de datos de configuración regional

El [CLI de Angular][CliMain] incluye automáticamente datos de configuración regional si ejecutas el comando [`ng build`][CliBuild] con la opción `--localize`.

<!--todo: replace with docs-code -->

```shell
ng build --localize
```

ÚTIL: La instalación inicial de Angular ya contiene datos de configuración regional para inglés en Estados Unidos \(`en-US`\).
El [CLI de Angular][CliMain] incluye automáticamente los datos de configuración regional y establece el valor de `LOCALE_ID` cuando usas la opción `--localize` con el comando [`ng build`][CliBuild].

El paquete `@angular/common` en npm contiene los archivos de datos de configuración regional.
Las variantes globales de los datos de configuración regional están disponibles en `@angular/common/locales/global`.

## Ejemplo de `import` para francés

Por ejemplo, podrías importar las variantes globales para francés \(`fr`\) en `main.ts` donde inicializas la aplicación.

<docs-code header="src/main.ts (import locale)" path="adev/src/content/examples/i18n/src/main.ts" visibleRegion="global-locale"/>

ÚTIL: En una aplicación `NgModules`, lo importarías en tu `app.module`.

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
