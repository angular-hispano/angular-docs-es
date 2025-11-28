<docs-decorative-header title="Plantillas" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Usar la sintaxis de plantillas de Angular para crear interfaces de usuario dinámicas.
</docs-decorative-header>

Las plantillas de componentes no son solo HTML estático pueden usar datos de tu clase de componente y configurar manejadores para la interacción del usuario.

## Mostrar texto dinámico

En Angular, un _binding_ crea una conexión dinámica entre la plantilla de un componente y sus datos. Esta conexión asegura que los cambios en los datos del componente actualicen automáticamente la plantilla renderizada.

Puedes crear un binding para mostrar texto dinámico en una plantilla usando llaves dobles:

```angular-ts
@Component({
  selector: 'user-profile',
  template: `<h1>Perfil {{userName()}}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

Cuando Angular renderiza el componente, verás:

```html
<h1>Perfil para pro_programmer_123</h1>
```

Angular mantiene automáticamente el binding actualizado cuando el valor de la signal cambia. Construyendo 
sobre el ejemplo anterior, si actualizamos el valor de la siganl `userName`:

```typescript
this.userName.set('cool_coder_789');
```

La página renderizada se actualiza para reflejar el nuevo valor:

```html
<h1>Perfil para cool_coder_789</h1>
```

## Estableciendo propiedades y atributos dinámicos

Angular soporta binding de valores dinámicos en propiedades del DOM con corchetes:

```angular-ts
@Component({
  /*...*/
  // Establecer la propiedad `disabled` del botón basada en el valor de `isValidUserId`.
  template: `<button [disabled]="isValidUserId()">Guardar cambios</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

También puedes hacer binding a *atributos* HTML prefijando el nombre del atributo con `attr.`:

```angular-html
<!-- Hacer binding del atributo `role` en el elemento `<ul>` al valor de `listRole`. -->
<ul [attr.role]="listRole()">
```

Angular actualiza automáticamente las propiedades y atributos del DOM cuando el valor vinculado cambia.

## Manejar la interacción del usuario

Angular te permite agregar event listeners a un elemento en tu plantilla con paréntesis:

```angular-ts
@Component({
  /*...*/
  // Agregar un manejador de evento 'click' que llama al método `cancelSubscription`. 
  template: `<button (click)="cancelSubscription()">Cancelar suscripción</button>`,
})
export class UserProfile {
  /* ... */
  
  cancelSubscription() { /* Tu código de manejo de eventos va aquí. */  }
}
```

Si necesitas pasar el objeto [event](https://developer.mozilla.org/es/docs/Web/API/Event) a tu listener, puedes usar la variable integrada `$event` de Angular dentro de la llamada de función:

```angular-ts
@Component({
  /*...*/
  // Agregar un manejador de evento 'click' que llama al método `cancelSubscription`. 
  template: `<button (click)="cancelSubscription($event)">Cancelar suscripción</button>`,
})
export class UserProfile {
  /* ... */
  
  cancelSubscription(event: Event) { /* Tu código de manejo de eventos va aquí. */  }
}
```

## Flujo de control con `@if` y `@for`

Puedes ocultar y mostrar condicionalmente partes de una plantilla con el bloque `@if` de Angular:

```angular-html
<h1>Perfil de usuario</h1>

@if (isAdmin()) {
  <h2>Configuración de administrador</h2>
  <!-- ... -->
}
```

El bloque `@if` también soporta un bloque `@else` opcional:

```angular-html
<h1>Perfil de usuario</h1>

@if (isAdmin()) {
  <h2>Configuración de administrador</h2>
  <!-- ... -->
} @else {
  <h2>Configuración de usuario</h2>
  <!-- ... -->  
}
```

Puedes repetir parte de una plantilla múltiples veces con el bloque `@for` de Angular:

```angular-html
<h1>Perfil de usuario</h1>

<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{badge.name}}</li>
  }
</ul>
```

Angular usa la palabra clave `track`, mostrada en el ejemplo anterior, para asociar datos con los elementos del DOM creados por `@for`. Ve [_¿Por qué es importante track en bloques @for?_](guide/templates/control-flow#why-is-track-in-for-blocks-important) para más información.

¿Quieres saber más sobre plantillas Angular? Consulta la [Guía detallada de Plantillas](guide/templates) para todos los detalles.

## Siguiente paso

Ahora que la aplicación ya cuenta con datos dinámicos y plantillas, es momento de aprender cómo mejorar las plantillas ocultando o mostrando elementos de forma condicional, iterando sobre listas de elementos y más.

<docs-pill-row>
  <docs-pill title="Diseño modular con inyección de dependencias" href="essentials/dependency-injection" />
  <docs-pill title="Guía detallada de plantillas" href="guide/templates" />
</docs-pill-row>
