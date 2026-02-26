<docs-decorative-header title="Formularios con Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

IMPORTANTE: Signal Forms son [experimental](/reference/releases#experimental). La API puede cambiar en versiones futuras. Evita usar APIs experimentales en aplicaciones de producción sin comprender los riesgos.

Signal Forms es una biblioteca experimental que te permite gestionar el estado de formularios en aplicaciones de Angular construyendo sobre la base reactiva de signals. Con enlace bidireccional automático, acceso a campos con seguridad de tipos y validación basada en esquemas, Signal Forms te ayudan a crear formularios robustos.

CONSEJO: Para una introducción rápida a Signal Forms, consulta la [guía esencial de Signal Forms](essentials/signal-forms).

## ¿Por qué Signal Forms?

Construir formularios en aplicaciones web implica gestionar varias preocupaciones interconectadas: rastrear valores de campos, validar la entrada del usuario, manejar estados de error y mantener la interfaz de usuario sincronizada con tu modelo de datos. Gestionar estas preocupaciones por separado crea código repetitivo y complejidad.

Signal Forms abordan estos desafíos mediante:

- **Sincronización automática del estado** - Sincroniza automáticamente el modelo de datos del formulario con los campos del formulario vinculados
- **Proporcionar seguridad de tipos** - Soporta esquemas y enlaces completamente seguros de tipos entre tus controles de interfaz de usuario y el modelo de datos
- **Centralizar la lógica de validación** - Define todas las reglas de validación en un solo lugar usando un esquema de validación

Signal Forms funcionan mejor en aplicaciones nuevas construidas con signals. Si estás trabajando con una aplicación existente que usa formularios reactivos, o si necesitas garantías de estabilidad en producción, los formularios reactivos siguen siendo una opción sólida.

<!-- TODO: UNCOMMENT SECTION BELOW WHEN AVAILABLE -->
<!-- NOTE: If you're coming from template or reactive forms, you may be interested in our [comparison guide](guide/forms/signals/comparison). -->

## Requisitos previos

Signal Forms requieren:

- Angular v21 o superior

## Configuración

Signal Forms ya están incluidos en el paquete `@angular/forms`. Importa las funciones y directivas necesarias desde `@angular/forms/signals`:

```ts
import { form, Field, required, email } from '@angular/forms/signals'
```

La directiva `Field` debe importarse en cualquier componente que vincule campos de formulario a inputs HTML:

```ts
@Component({
  // ...
  imports: [Field],
})
```

<!-- TODO: UNCOMMENT SECTION BELOW WHEN AVAILABLE -->
<!-- ## Next steps

To learn more about how Signal Forms work, check out the following guides:

<docs-pill-row>
  <docs-pill href="essentials/signal-forms" title="Signal forms essentials" />
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
</docs-pill-row> -->
