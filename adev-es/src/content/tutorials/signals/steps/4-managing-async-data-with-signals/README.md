# Gestionando datos asíncronos con signals usando la API de Resources

Ahora que has aprendido [cómo derivar estado con linked signals](/tutorials/signals/3-deriving-state-with-linked-signals), exploremos cómo manejar datos asíncronos con la API de Resource. La API de Resource proporciona una forma potente de gestionar operaciones asíncronas usando signals, con estados de carga integrados, manejo de errores y gestión de solicitudes.

En esta actividad, aprenderás cómo usar la función `resource()` para cargar datos de forma asíncrona y cómo manejar diferentes estados de operaciones asíncronas construyendo un cargador de perfil de usuario que demuestra la API de Resource en acción.

<hr />

<docs-workflow>

<docs-step title="Importa la función resource y la API">
Agrega `resource` a tus importaciones existentes e importa la función de API falsa.

```ts
// Agregar resource a las importaciones existentes
import {Component, signal, computed, resource, ChangeDetectionStrategy} from '@angular/core';
// Importar función de API mock
import {loadUser} from './user-api';
```

</docs-step>

<docs-step title="Crea un resource para datos de usuario">
Agrega una propiedad en la clase del componente que cree un resource para cargar datos de usuario basados en un signal de ID de usuario.

```ts
userId = signal(1);

userResource = resource({
  params: () => ({ id: this.userId() }),
  loader: (params) => loadUser(params.params.id)
});
```

</docs-step>

<docs-step title="Agrega métodos para interactuar con el resource">
Agrega métodos para cambiar el ID de usuario y recargar el resource.

```ts
loadUser(id: number) {
  this.userId.set(id);
}

reloadUser() {
  this.userResource.reload();
}
```

Cambiar el signal de params automáticamente dispara una recarga, o puedes recargar manualmente con `reload()`.
</docs-step>

<docs-step title="Crea computed signals para los estados del resource">
Agrega computed signals para acceder a diferentes estados del resource.

```ts
isLoading = computed(() => this.userResource.status() === 'loading');
hasError = computed(() => this.userResource.status() === 'error');
```

Los resources proporcionan un signal `status()` que puede ser 'loading', 'success' o 'error', un signal `value()` para los datos cargados y un método `hasValue()` que verifica de forma segura si los datos están disponibles.
</docs-step>

<docs-step title="Conecta los botones y muestra los estados del resource">
La estructura de la plantilla ya está proporcionada. Ahora conecta todo:

Parte 1. **Agrega manejadores de clic a los botones:**

```html
<button (click)="loadUser(1)">Load User 1</button>
<button (click)="loadUser(2)">Load User 2</button>
<button (click)="loadUser(999)">Load Invalid User</button>
<button (click)="reloadUser()">Reload</button>
```

Parte 2. **Reemplaza el placeholder con el manejo de estado del resource:**

```angular-html
@if (isLoading()) {
  <p>Loading user...</p>
} @else if (hasError()) {
  <p class="error">Error: {{ userResource.error()?.message }}</p>
} @else if (userResource.hasValue()) {
  <div class="user-info">
    <h3>{{ userResource.value().name }}</h3>
    <p>{{ userResource.value().email }}</p>
  </div>
}
```

El resource proporciona diferentes métodos para verificar su estado:

- `isLoading()` - verdadero cuando está obteniendo datos
- `hasError()` - verdadero cuando ocurrió un error
- `userResource.hasValue()` - verdadero cuando los datos están disponibles
- `userResource.value()` - accede a los datos cargados
- `userResource.error()` - accede a la información del error

</docs-step>

</docs-workflow>

¡Excelente! Ahora has aprendido cómo usar la API de Resource con signals. Conceptos clave para recordar:

- **Los resources son reactivos**: Se recargan automáticamente cuando los params cambian
- **Gestión de estado integrada**: Los resources proporcionan signals `status()`, `value()` y `error()`
- **Limpieza automática**: Los resources manejan la cancelación y limpieza de solicitudes automáticamente
- **Control manual**: Puedes recargar o abortar solicitudes manualmente cuando sea necesario

En la próxima lección, aprenderás [cómo pasar datos a componentes con input signals](/tutorials/signals/5-component-communication-with-signals)!
