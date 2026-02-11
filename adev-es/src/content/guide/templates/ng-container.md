# Agrupando elementos con ng-container

`<ng-container>` es un elemento especial en Angular que agrupa múltiples elementos juntos o marca una ubicación en una plantilla sin renderizar un elemento real en el DOM.

```angular-html
<!-- Plantilla del componente -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- DOM renderizado -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

Puedes aplicar directivas a `<ng-container>` para agregar comportamientos o configuración a una parte de tu plantilla.

Angular ignora todos los enlaces de atributos y event listeners aplicados a `<ng-container>`, incluyendo aquellos aplicados a través de directivas.

## Usando `<ng-container>` para mostrar contenido dinámico

`<ng-container>` puede actuar como un placeholder para renderizar contenido dinámico.

### Renderizando componentes

Puedes usar la directiva integrada de Angular `NgComponentOutlet` para renderizar dinámicamente un componente en la ubicación del `<ng-container>`.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => this.isAdmin() ? AdminProfile : BasicUserProfile);
}
```

En el ejemplo anterior, la directiva `NgComponentOutlet` renderiza dinámicamente `AdminProfile` o `BasicUserProfile` en la ubicación del elemento `<ng-container>`.

### Renderizando fragmentos de plantilla

Puedes usar la directiva integrada de Angular `NgTemplateOutlet` para renderizar dinámicamente un fragmento de plantilla en la ubicación del `<ng-container>`.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />

    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => this.isAdmin() ? this.adminTemplate() : this.basicTemplate());
}
```

En el ejemplo anterior, la directiva `ngTemplateOutlet` renderiza dinámicamente uno de dos fragmentos de plantilla en la ubicación del elemento `<ng-container>`.

Para más información sobre NgTemplateOutlet, consulta la [página de documentación de la API de NgTemplateOutlet](/api/common/NgTemplateOutlet).

## Usando `<ng-container>` con directivas estructurales

También puedes aplicar directivas estructurales a elementos `<ng-container>`. Ejemplos comunes de esto incluyen `ngIf` y `ngFor`.

```angular-html
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic></admin-infographic>
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```

## Usando `<ng-container>` para inyección

Consulta la guía de Inyección de Dependencias para más información sobre el sistema de inyección de dependencias de Angular.

Cuando aplicas una directiva a `<ng-container>`, los elementos descendientes pueden inyectar la directiva o cualquier cosa que la directiva proporcione. Usa esto cuando quieras proporcionar declarativamente un valor a una parte específica de tu plantilla.

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Crea una entrada que acepta 'light' o 'dark', con valor predeterminado 'light'.
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

En el ejemplo anterior, los componentes `ProfilePic` y `UserBio` pueden inyectar la directiva `Theme` y aplicar estilos basados en su `mode`.
