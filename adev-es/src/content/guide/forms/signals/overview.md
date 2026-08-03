<docs-decorative-header title="Formularios con Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Signal Forms es una librería que te permite gestionar el estado de formularios en aplicaciones de Angular construyendo sobre la base reactiva de signals. Con enlace bidireccional automático, acceso a campos con seguridad de tipos y validación basada en esquemas, Signal Forms te ayudan a crear formularios robustos.

CONSEJO: Para una introducción rápida a Signal Forms, consulta la [guía esencial de Signal Forms](essentials/signal-forms).

## ¿Por qué Signal Forms? {#why-signal-forms}

Construir formularios en aplicaciones web implica gestionar varias preocupaciones interconectadas: rastrear valores de campos, validar la entrada del usuario, manejar estados de error y mantener la interfaz de usuario sincronizada con tu modelo de datos. Gestionar estas preocupaciones por separado crea código repetitivo y complejidad.

Signal Forms abordan estos desafíos mediante:

- **Sincronización automática del estado** - Sincroniza automáticamente el modelo de datos del formulario con los campos del formulario vinculados
- **Proporcionar seguridad de tipos** - Soporta esquemas y enlaces completamente seguros de tipos entre tus controles de interfaz de usuario y el modelo de datos
- **Centralizar la lógica de validación** - Define todas las reglas de validación en un solo lugar usando un esquema de validación

Signal Forms funcionan mejor en aplicaciones nuevas construidas con signals. Si estás trabajando con una aplicación existente que usa formularios reactivos, o si necesitas garantías de estabilidad en producción, los formularios reactivos siguen siendo una opción sólida.

NOTA: Si vienes de formularios de plantilla o reactivos, puede que te interese la [guía de comparación](guide/forms/signals/comparison).

## Requisitos previos {#prerequisites}

Signal Forms requieren:

- Angular v21 o superior

## Configuración {#setup}

Signal Forms ya están incluidos en el paquete `@angular/forms`. Importa las funciones y directivas necesarias desde `@angular/forms/signals`:

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

La directiva `FormField` debe importarse en cualquier componente que vincule campos de formulario a inputs HTML:

```ts
@Component({
  // ...
  imports: [FormField],
})
```

## Próximos pasos {#next-steps}

<docs-pill-row>
  <docs-pill href="guide/forms/signals/model-design" title="Diseñando tu modelo de formulario" />
  <docs-pill href="guide/forms/signals/comparison" title="Comparación con otros sistemas de formularios" />
</docs-pill-row>
