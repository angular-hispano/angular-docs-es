# Importar y usar componentes

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee esa primero si eres nuevo en Angular.

Angular admite dos formas de hacer que un componente esté disponible para otros componentes: como componente standalone o en un `NgModule`.

## Componentes standalone

Un **componente standalone** es un componente que establece `standalone: true` en los metadatos de su componente.
Los componentes standalone importan directamente otros componentes, directivas y pipes usados en sus
plantillas:

<docs-code language="ts" highlight="[2, [8, 9]]">
@Component({
  standalone: true,
  selector: 'profile-photo',
})
export class ProfilePhoto { }

@Component({
  standalone: true,
  imports: [ProfilePhoto],
  template: `<profile-photo />`
})
export class UserProfile { }
</docs-code>

Los componentes standalone son directamente importables en otros componentes standalone.

El equipo de Angular recomienda usar componentes standalone para todo desarrollo nuevo.

## NgModules

El código de Angular anterior a los componentes standalone usa `NgModule` como mecanismo para importar y
usar otros componentes. Consulta la [guía completa de `NgModule`](guide/ngmodules) para más detalles.
