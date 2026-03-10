# Migración de `ModuleWithProviders`

## ¿Qué hace este schematic?

Algunas librerías de Angular, como `@angular/router` y `@ngrx/store`, implementan APIs que devuelven un tipo llamado `ModuleWithProviders` \(típicamente a través de un método llamado `forRoot()`\).
Este tipo representa un `NgModule` junto con proveedores adicionales.
La versión 9 de Angular depreca el uso de `ModuleWithProviders` sin un tipo genérico explícito, donde el tipo genérico hace referencia al tipo del `NgModule`.

Este schematic agregará un tipo genérico a cualquier uso de `ModuleWithProviders` al que le falte el genérico.
En el ejemplo a continuación, el tipo del `NgModule` es `SomeModule`, por lo que el schematic cambia el tipo a `ModuleWithProviders<SomeModule>`.

### Antes

<docs-code language="typescript">

@NgModule({…})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config}
      ]
    };
  }
}

</docs-code>

### Después

<docs-code language="typescript">

@NgModule({…})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders<SomeModule> {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config }
      ]
    };
  }
}

</docs-code>

En el raro caso de que el schematic no pueda determinar el tipo de `ModuleWithProviders`, es posible que veas que el schematic imprime un comentario TODO para actualizar el código manualmente.

## ¿Por qué es necesaria esta migración?

`ModuleWithProviders` ha tenido el tipo genérico desde la versión 7 de Angular, pero ha sido opcional.
Esto se compilaba porque los archivos `metadata.json` contenían todos los metadatos.
Con Ivy, los archivos `metadata.json` ya no son necesarios, por lo que el framework no puede asumir que se ha proporcionado uno con los tipos necesarios.
En cambio, Ivy se basa en el tipo genérico para `ModuleWithProviders` para obtener la información de tipo correcta.

Por esta razón, la versión 9 de Angular depreca `ModuleWithProviders` sin un tipo genérico.
Una versión futura de Angular eliminará el tipo genérico predeterminado, haciendo obligatorio un tipo explícito.

## ¿Debo agregar el tipo genérico cuando agregue nuevos `ModuleWithProviders` a mi aplicación?

Sí, cada vez que tu código haga referencia al tipo `ModuleWithProviders`, debe tener un tipo genérico que coincida con el `NgModule` real que se devuelve \(por ejemplo, `ModuleWithProviders<MyModule>`\).

## ¿Qué debo hacer si el schematic imprime un comentario TODO?

El schematic imprimirá un comentario TODO en caso de que no pueda detectar el genérico correcto para el tipo `ModuleWithProviders`.
En este caso, querrás agregar manualmente el genérico correcto a `ModuleWithProviders`.
Debe coincidir con el tipo del `NgModule` que se devuelve en el objeto `ModuleWithProviders`.

## ¿Qué significa esto para las librerías?

Las librerías deben agregar el tipo genérico a cualquier uso del tipo `ModuleWithProviders`.
