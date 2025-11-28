# Desplegar múltiples configuraciones regionales

Si `myapp` es el directorio que contiene los archivos distribuibles de tu proyecto, normalmente haces que diferentes versiones estén disponibles para diferentes configuraciones regionales en directorios de configuración regional.
Por ejemplo, tu versión en francés está ubicada en el directorio `myapp/fr` y la versión en español está ubicada en el directorio `myapp/es`.

La etiqueta HTML `base` con el atributo `href` especifica el URI base, o URL, para enlaces relativos.
Si estableces la opción `"localize"` en el archivo de configuración de compilación del espacio de trabajo [`angular.json`][GuideWorkspaceConfig] a `true` o a un array de IDs de configuración regional, el CLI ajusta el `href` base para cada versión de la aplicación.
Para ajustar el `href` base para cada versión de la aplicación, el CLI agrega la configuración regional al `"subPath"` configurado.
Especifica el `"subPath"` para cada configuración regional en tu archivo de configuración de compilación del espacio de trabajo [`angular.json`][GuideWorkspaceConfig].
El siguiente ejemplo muestra `"subPath"` establecido como una cadena vacía.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="i18n-subPath"/>

## Configurar un servidor

El despliegue típico de múltiples idiomas sirve cada idioma desde un subdirectorio diferente.
Los usuarios son redirigidos al idioma preferido definido en el navegador usando el encabezado HTTP `Accept-Language`.
Si el usuario no ha definido un idioma preferido, o si el idioma preferido no está disponible, entonces el servidor recurre al idioma predeterminado.
Para cambiar el idioma, cambia tu ubicación actual a otro subdirectorio.
El cambio de subdirectorio a menudo ocurre usando un menú implementado en la aplicación.

Para más información sobre cómo desplegar aplicaciones a un servidor remoto, consulta [Despliegue][GuideDeployment].

IMPORTANTE: Si estás usando [Renderizado del servidor](guide/ssr) con `outputMode` establecido en `server`, Angular maneja automáticamente la redirección dinámicamente basándose en el encabezado HTTP `Accept-Language`. Esto simplifica el despliegue al eliminar la necesidad de ajustes manuales del servidor o configuración.

### Ejemplo de Nginx

El siguiente ejemplo muestra una configuración de Nginx.

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### Ejemplo de Apache

El siguiente ejemplo muestra una configuración de Apache.

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment 'Deployment | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
