# Diagnósticos Extendidos

Existen muchos patrones de código que son técnicamente válidos para el compilador o el tiempo de ejecución, pero que pueden tener matices o advertencias complejas.
Estos patrones pueden no tener el efecto esperado por el desarrollador, lo que frecuentemente genera errores.
El compilador de Angular incluye "diagnósticos extendidos" que identifican muchos de estos patrones, con el fin de advertir a los desarrolladores sobre los posibles problemas y hacer cumplir las mejores prácticas comunes en una base de código.

## Diagnósticos

Actualmente, Angular admite los siguientes diagnósticos extendidos:

| Código   | Nombre                                                                |
| :------- | :-------------------------------------------------------------------- |
| `NG8101` | [`invalidBananaInBox`](extended-diagnostics/NG8101)                   |
| `NG8102` | [`nullishCoalescingNotNullable`](extended-diagnostics/NG8102)         |
| `NG8103` | [`missingControlFlowDirective`](extended-diagnostics/NG8103)          |
| `NG8104` | [`textAttributeNotBinding`](extended-diagnostics/NG8104)              |
| `NG8105` | [`missingNgForOfLet`](extended-diagnostics/NG8105)                    |
| `NG8106` | [`suffixNotSupported`](extended-diagnostics/NG8106)                   |
| `NG8107` | [`optionalChainNotNullable`](extended-diagnostics/NG8107)             |
| `NG8108` | [`skipHydrationNotStatic`](extended-diagnostics/NG8108)               |
| `NG8109` | [`interpolatedSignalNotInvoked`](extended-diagnostics/NG8109)         |
| `NG8111` | [`uninvokedFunctionInEventBinding`](extended-diagnostics/NG8111)      |
| `NG8113` | [`unusedStandaloneImports`](extended-diagnostics/NG8113)              |
| `NG8114` | [`unparenthesizedNullishCoalescing`](extended-diagnostics/NG8114)     |
| `NG8115` | [`uninvokedTrackFunction`](extended-diagnostics/NG8115)               |
| `NG8116` | [`missingStructuralDirective`](extended-diagnostics/NG8116)           |
| `NG8117` | [`uninvokedFunctionInTextInterpolation`](extended-diagnostics/NG8117) |
| `NG8021` | [`deferTriggerMisconfiguration`](extended-diagnostics/NG8021)         |

## Configuración

Los diagnósticos extendidos son advertencias por defecto y no bloquean la compilación.
Cada diagnóstico puede configurarse como:

| Categoría de error | Efecto                                                                                                                                                                          |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `warning`          | Predeterminado - El compilador emite el diagnóstico como advertencia pero no bloquea la compilación. El compilador seguirá existiendo con código de estado 0, incluso si se emiten advertencias. |
| `error`            | El compilador emite el diagnóstico como un error y falla la compilación. El compilador saldrá con un código de estado distinto de cero si se emite uno o más errores.          |
| `suppress`         | El compilador _no_ emite el diagnóstico en absoluto.                                                                                                                            |

La severidad de las verificaciones puede configurarse como una [opción del compilador de Angular](reference/configs/angular-compiler-options):

```json

{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      "checks": {
        "invalidBananaInBox": "suppress"
      },
      "defaultCategory": "error"
    }
  }
}
```

El campo `checks` mapea el nombre de los diagnósticos individuales a su categoría asociada.
Consulta [Diagnósticos](#diagnósticos) para obtener una lista completa de los diagnósticos extendidos y el nombre a usar para configurarlos.

El campo `defaultCategory` se usa para cualquier diagnóstico que no esté listado explícitamente en `checks`.
Si no se establece, dichos diagnósticos se tratarán como `warning`.

Los diagnósticos extendidos se emitirán cuando [`strictTemplates`](tools/cli/template-typecheck#strict-mode) esté habilitado.
Esto es necesario para permitir que el compilador comprenda mejor los tipos de plantillas de Angular y proporcione diagnósticos precisos y significativos.

## Versionado semántico

El equipo de Angular tiene la intención de agregar o habilitar nuevos diagnósticos extendidos en versiones **menores** de Angular (consulta [semver](https://docs.npmjs.com/about-semantic-versioning)).
Esto significa que actualizar Angular puede mostrar nuevas advertencias en tu base de código existente.
Esto permite al equipo entregar características más rápidamente y hacer los diagnósticos extendidos más accesibles a los desarrolladores.

Sin embargo, establecer `"defaultCategory": "error"` promoverá dichas advertencias a errores graves.
Esto puede causar que una actualización de versión menor introduzca errores de compilación, lo que puede verse como un cambio disruptivo no conforme con semver.
Cualquier nuevo diagnóstico puede suprimirse o degradarse a advertencias a través de la [configuración](#configuración) anterior, por lo que el impacto de un nuevo diagnóstico debería ser mínimo para los proyectos que tratan los diagnósticos extendidos como errores por defecto.
Usar error como valor predeterminado es una herramienta muy poderosa; solo ten en cuenta esta advertencia de semver al decidir si `error` es el valor predeterminado correcto para tu proyecto.

## Nuevos diagnósticos

El equipo de Angular siempre está abierto a sugerencias sobre nuevos diagnósticos que podrían agregarse.
Los diagnósticos extendidos generalmente deben:

- Detectar un error de desarrollador común y no obvio con las plantillas de Angular
- Articular claramente por qué este patrón puede llevar a errores o comportamientos no deseados
- Sugerir una o más soluciones claras
- Tener una tasa de falsos positivos baja, preferiblemente cero
- Aplicarse a la gran mayoría de las aplicaciones Angular (no específico a una librería no oficial)
- Mejorar la corrección o el rendimiento del programa (no el estilo; esa responsabilidad recae en un linter)

Si tienes una idea para un diagnóstico extendido que cumpla estos criterios, considera presentar una [solicitud de característica](https://github.com/angular/angular/issues/new?template=2-feature-request.yaml).
