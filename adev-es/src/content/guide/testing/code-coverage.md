# Cobertura de código

Los reportes de cobertura de código te muestran cualquier parte de tu código base que podría no estar correctamente probada por tus pruebas unitarias.

## Prerrequisitos

Para generar reportes de cobertura de código con Vitest, debes instalar el paquete `@vitest/coverage-v8`:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/coverage-v8
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/coverage-v8
  </docs-code>
</docs-code-multifile>

## Generar un reporte

Para generar un reporte de cobertura, agrega la bandera `--coverage` al comando `ng test`:

```shell
ng test --coverage
```

Después de que se ejecuten las pruebas, el comando crea un nuevo directorio `coverage/` en el proyecto. Abre el archivo `index.html` para ver un reporte con tu código fuente y valores de cobertura de código.

Si quieres crear reportes de cobertura de código cada vez que pruebas, puedes establecer la opción `coverage` en `true` en tu archivo `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true
          }
        }
      }
    }
  }
}
```

## Aplicar umbrales de cobertura de código

Los porcentajes de cobertura de código te permiten estimar cuánto de tu código está probado. Si tu equipo decide sobre una cantidad mínima para ser probada unitariamente, puedes aplicar este mínimo en tu configuración.

Por ejemplo, supón que quieres que la base de código tenga un mínimo de 80% de cobertura de código. Para habilitar esto, agrega la opción `coverageThresholds` a tu archivo `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageThresholds": {
              "statements": 80,
              "branches": 80,
              "functions": 80,
              "lines": 80
            }
          }
        }
      }
    }
  }
}
```

Ahora, si tu cobertura cae por debajo del 80% cuando ejecutas tus pruebas, el comando fallará.

## Configuración avanzada

Puedes configurar varias otras opciones de cobertura en tu archivo `angular.json`:

- `coverageInclude`: Patrones glob de archivos para incluir en el reporte de cobertura.
- `coverageReporters`: Un array de reportes para usar (por ejemplo, `html`, `lcov`, `json`).
- `coverageWatermarks`: Un objeto que especifica marcas de agua `[low, high]` para el reporte HTML, que puede afectar la codificación de colores del reporte.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageReporters": ["html", "lcov"],
            "coverageWatermarks": {
              "statements": [50, 80],
              "branches": [50, 80],
              "functions": [50, 80],
              "lines": [50, 80]
            }
          }
        }
      }
    }
  }
}
```
