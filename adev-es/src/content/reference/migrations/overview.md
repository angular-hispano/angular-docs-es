# Migraciones

Aprende cómo puedes migrar tu proyecto Angular existente a las últimas características de forma incremental.

<docs-card-container>
  <docs-card title="Standalone" link="Migrar ahora" href="reference/migrations/standalone">
    Los componentes standalone ofrecen una forma simplificada de construir aplicaciones Angular. Los componentes standalone especifican sus dependencias directamente en lugar de obtenerlas a través de NgModules.
  </docs-card>
  <docs-card title="Sintaxis de flujo de control" link="Migrar ahora" href="reference/migrations/control-flow">
    La sintaxis de flujo de control integrada te permite usar una sintaxis más ergonómica que es cercana a JavaScript y tiene mejor verificación de tipos. Reemplaza la necesidad de importar `CommonModule` para usar funcionalidades como `*ngFor`, `*ngIf` y `*ngSwitch`.
  </docs-card>
  <docs-card title="Función `inject()`" link="Migrar ahora" href="reference/migrations/inject-function">
    La función `inject` de Angular ofrece tipos más precisos y mejor compatibilidad con los decoradores estándar, en comparación con la inyección basada en constructor.
  </docs-card>
  <docs-card title="Rutas con lazy loading" link="Migrar ahora" href="reference/migrations/route-lazy-loading">
    Convierte rutas de componentes cargadas de forma eager a rutas con lazy loading. Esto permite que el proceso de compilación divida los bundles de producción en fragmentos más pequeños, para cargar menos JavaScript en la carga inicial de la página.
  </docs-card>
  <docs-card title="Nueva API `input()`" link="Migrar ahora" href="reference/migrations/signal-inputs">
    Convierte los campos `@Input` existentes a la nueva API de signal input que ya está lista para producción.
  </docs-card>
  <docs-card title="Nueva función `output()`" link="Migrar ahora" href="reference/migrations/outputs">
    Convierte los eventos personalizados `@Output` existentes a la nueva función output que ya está lista para producción.
  </docs-card>
  <docs-card title="Consultas como signal" link="Migrar ahora" href="reference/migrations/signal-queries">
    Convierte los campos de consulta de decoradores existentes a la API mejorada de signal queries. La API ya está lista para producción.
  </docs-card>
  <docs-card title="Limpiar importaciones no utilizadas" link="Pruébalo ahora" href="reference/migrations/cleanup-unused-imports">
    Limpia las importaciones no utilizadas en tu proyecto.
  </docs-card>
  <docs-card title="Etiquetas auto-cerrables" link="Migrar ahora" href="reference/migrations/self-closing-tags">
    Convierte las plantillas de componentes para usar etiquetas auto-cerrables donde sea posible.
  </docs-card>
  <docs-card title="NgClass a enlaces de clase" link="Migrar ahora" href="reference/migrations/ngclass-to-class">
      Convierte las plantillas de componentes para preferir los enlaces de clase sobre las directivas `NgClass` cuando sea posible.
  </docs-card>
  <docs-card title="NgStyle a enlaces de estilo" link="Migrar ahora" href="reference/migrations/ngstyle-to-style">
      Convierte las plantillas de componentes para preferir los enlaces de estilo sobre las directivas `NgStyle` cuando sea posible.
  </docs-card>
  <docs-card title="Migración de RouterTestingModule" link="Migrar ahora" href="reference/migrations/router-testing-module-migration">
    Convierte los usos de `RouterTestingModule` a `RouterModule` en configuraciones de TestBed y agrega `provideLocationMocks()` cuando sea apropiado.
  </docs-card>
  <docs-card title="CommonModule a importaciones standalone" link="Migrar ahora" href="reference/migrations/common-to-standalone">
    Reemplaza las importaciones de `CommonModule` con importaciones de las directivas y pipes individuales utilizados en las plantillas cuando sea posible.
  </docs-card>
</docs-card-container>
