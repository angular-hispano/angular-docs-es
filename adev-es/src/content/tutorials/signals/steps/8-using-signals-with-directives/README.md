# Usando signals con directivas

Ahora que has aprendido [cómo usar signals con servicios](/tutorials/signals/7-using-signals-with-services), exploremos cómo las directivas usan signals. **La buena noticia: los signals funcionan exactamente igual en directivas que en componentes.** La diferencia principal es que, como las directivas no tienen plantillas, usarás principalmente signals en host bindings para actualizar reactivamente el elemento host.

En esta actividad, construirás una directiva de resaltado que demuestra cómo los signals crean comportamiento reactivo en directivas.

<hr />

<docs-workflow>

<docs-step title="Configura signals igual que en un componente">
Importa las funciones de signal y crea tu estado reactivo. Esto funciona exactamente igual que en componentes:

```ts
import {Directive, input, signal, computed} from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  // Signal inputs - ¡igual que en componentes!
  color = input<string>('yellow');
  intensity = input<number>(0.3);

  // Estado interno - ¡igual que en componentes!
  private isHovered = signal(false);

  // Computed signals - ¡igual que en componentes!
  backgroundStyle = computed(() => {
    const baseColor = this.color();
    const alpha = this.isHovered() ? this.intensity() : this.intensity() * 0.5;

    const colorMap: Record<string, string> = {
      'yellow': `rgba(255, 255, 0, ${alpha})`,
      'blue': `rgba(0, 100, 255, ${alpha})`,
      'green': `rgba(0, 200, 0, ${alpha})`,
      'red': `rgba(255, 0, 0, ${alpha})`,
    };

    return colorMap[baseColor] || colorMap['yellow'];
  });
}
```

Observa cómo esto es idéntico a los patrones de componentes — la única diferencia es que estamos en una `@Directive` en lugar de `@Component`.
</docs-step>

<docs-step title="Usa signals en host bindings">
Como las directivas no tienen plantillas, usarás signals en **host bindings** para actualizar reactivamente el elemento host. Agrega la configuración `host` y los manejadores de eventos:

```ts
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'backgroundStyle()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  // ... signals del paso anterior ...

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
```

Los host bindings se re-evalúan automáticamente cuando los signals cambian — ¡igual que los enlaces de plantilla en componentes! Cuando `isHovered` cambia, el computed signal `backgroundStyle` se recalcula y el host binding actualiza el estilo del elemento.
</docs-step>

<docs-step title="Usa la directiva en tu plantilla">
Actualiza la plantilla de la app para demostrar la directiva reactiva:

```angular-ts
template: `
  <div>
    <h1>Directive with Signals</h1>

    <div highlight color="yellow" [intensity]="0.2">
      Hover me - Yellow highlight
    </div>

    <div highlight color="blue" [intensity]="0.4">
      Hover me - Blue highlight
    </div>

    <div highlight color="green" [intensity]="0.6">
      Hover me - Green highlight
    </div>
  </div>
`,
```

¡La directiva aplica automáticamente el resaltado reactivo basado en los signal inputs!
</docs-step>

</docs-workflow>

¡Perfecto! Ahora has visto cómo funcionan los signals con directivas. Algunos puntos clave de esta lección:

- **Los signals son universales** - Todas las APIs de signal (`input()`, `signal()`, `computed()`, `effect()`) funcionan igual en directivas y componentes
- **Los host bindings son el caso de uso principal** - Como las directivas no tienen plantillas, usas signals en host bindings para modificar reactivamente el elemento host
- **Mismos patrones reactivos** - Las actualizaciones de signals disparan la re-evaluación automática de computed signals y host bindings, igual que en las plantillas de componentes

En la próxima lección, [aprenderás cómo consultar elementos hijos con signal queries](/tutorials/signals/9-query-child-elements-with-signal-queries)!
