# Reaccionando a cambios de signal con effect

Ahora que has aprendido [cómo consultar elementos hijos con signal queries](/tutorials/signals/9-query-child-elements-with-signal-queries), exploremos cómo reaccionar a cambios de signal con efectos. Los efectos son funciones que se ejecutan automáticamente cuando sus dependencias cambian, lo que los hace perfectos para efectos secundarios como logging, manipulación del DOM o llamadas a API.

**Importante: Los efectos deberían ser la última API a la que recurras.** Siempre prefiere `computed()` para valores derivados y `linkedSignal()` para valores que pueden ser tanto derivados como establecidos manualmente. Si te encuentras copiando datos de un signal a otro con un efecto, es una señal de que deberías mover tu fuente de verdad más arriba y usar `computed()` o `linkedSignal()` en su lugar. Los efectos son mejores para sincronizar estado de signal con APIs imperativas que no son signals.

En esta actividad, aprenderás cómo usar la función `effect()` apropiadamente para efectos secundarios legítimos que responden a cambios de signal.

<hr />

Tienes una aplicación de gestor de temas con signals ya configurados. Ahora agregarás efectos para reaccionar automáticamente a cambios de signal.

<docs-workflow>

<docs-step title="Importa la función effect">
Agrega `effect` a tus importaciones existentes.

```ts
// Agregar effect a las importaciones existentes
import {Component, signal, computed, effect, ChangeDetectionStrategy} from '@angular/core';
```

La función `effect` crea un efecto secundario reactivo que se ejecuta automáticamente cuando cualquier signal que lee cambia.
</docs-step>

<docs-step title="Crea un efecto para almacenamiento local">
Agrega un efecto que guarde automáticamente el tema en localStorage cuando cambie.

```ts
constructor() {
  // Guardar tema en localStorage cada vez que cambie
  effect(() => {
    localStorage.setItem('theme', this.theme());
    console.log('Theme saved to localStorage:', this.theme());
  });
}
```

Este efecto se ejecuta cada vez que el signal del tema cambia, persistiendo automáticamente la preferencia del usuario.
</docs-step>

<docs-step title="Crea un efecto para registrar actividad del usuario">
Agrega un efecto que registre cuando el usuario inicia o cierra sesión.

```ts
constructor() {
  // ... efecto anterior

  // Registrar cambios de actividad del usuario
  effect(() => {
    const status = this.isLoggedIn() ? 'logged in' : 'logged out';
    const user = this.username();
    console.log(`User ${user} is ${status}`);
  });
}
```

Este efecto demuestra cómo los efectos pueden leer múltiples signals y reaccionar a cambios en cualquiera de ellos.
</docs-step>

<docs-step title="Crea un efecto con limpieza">
Agrega un efecto que configure un temporizador y se limpie cuando el componente sea destruido.

```ts
constructor() {
  // ... efectos anteriores

  // Efecto de temporizador con limpieza
  effect((onCleanup) => {
    const interval = setInterval(() => {
      console.log('Timer tick - Current theme:', this.theme());
    }, 5000);

    // Limpiar el intervalo cuando el efecto sea destruido
    onCleanup(() => {
      clearInterval(interval);
      console.log('Timer cleaned up');
    });
  });
}
```

Este efecto demuestra cómo limpiar recursos cuando los efectos son destruidos o re-ejecutados.
</docs-step>

<docs-step title="Prueba los efectos">
Abre la consola del navegador e interactúa con la aplicación:

- **Toggle Theme** - Observa los guardados en localStorage y los logs del temporizador
- **Login/Logout** - Observa el registro de actividad del usuario
- **Watch Timer** - Observa el registro periódico del tema cada 5 segundos

¡Los efectos se ejecutan automáticamente cada vez que sus signals rastreados cambian!
</docs-step>

</docs-workflow>

¡Excelente! Ahora has aprendido cómo usar efectos con signals. Conceptos clave para recordar:

- **Los efectos son reactivos**: Se ejecutan automáticamente cuando cualquier signal que leen cambia
- **Solo efectos secundarios**: Perfectos para logging, manipulación del DOM, llamadas a API y sincronización con APIs imperativas
- **Limpieza**: Usa el callback `onCleanup` para limpiar recursos como temporizadores o suscripciones
- **Seguimiento automático**: Los efectos rastrean automáticamente qué signals leen y se re-ejecutan cuando esos signals cambian

**Recuerda: ¡Usa los efectos con moderación!** Los ejemplos en esta lección (sincronización con localStorage, logging, temporizadores) son usos apropiados. Evita los efectos para:

- Derivar valores de otros signals - usa `computed()` en su lugar
- Crear estado derivado editable - usa `linkedSignal()` en su lugar
- Copiar datos entre signals - reestructura para usar una fuente de verdad compartida

Los efectos son poderosos pero deberían ser tu último recurso cuando `computed()` y `linkedSignal()` no pueden resolver tu caso de uso.
