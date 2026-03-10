# Migración a rutas con lazy loading

Este schematic ayuda a los desarrolladores a convertir rutas de componentes cargadas de forma eager a rutas con lazy loading. Esto permite que el proceso de compilación divida el bundle de producción en fragmentos más pequeños, para evitar un bundle JS grande que incluya todas las rutas, lo que afecta negativamente la carga inicial de la página de una aplicación.

Ejecuta el schematic usando el siguiente comando:

```shell
ng generate @angular/core:route-lazy-loading
```

### Opción de configuración `path`

Por defecto, la migración recorrerá toda la aplicación. Si quieres aplicar esta migración a un subconjunto de los archivos, puedes pasar el argumento path como se muestra a continuación:

```shell
ng generate @angular/core:route-lazy-loading --path src/app/sub-component
```

El valor del parámetro path es una ruta relativa dentro del proyecto.

### ¿Cómo funciona?

El schematic intentará encontrar todos los lugares donde se definen las rutas de la aplicación:

- `RouterModule.forRoot` y `RouterModule.forChild`
- `Router.resetConfig`
- `provideRouter`
- `provideRoutes`
- variables de tipo `Routes` o `Route[]` (por ejemplo, `const routes: Routes = [{...}]`)

La migración verificará todos los componentes en las rutas, comprobará si son standalone y están cargados de forma eager, y en ese caso los convertirá a rutas con lazy loading.

#### Antes

```typescript
// app.module.ts
import {HomeComponent} from './home/home.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // HomeComponent es standalone y está cargado de forma eager
        component: HomeComponent,
      },
    ]),
  ],
})
export class AppModule {}
```

#### Después

```typescript
// app.module.ts
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // ↓ HomeComponent ahora se carga de forma diferida
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
      },
    ]),
  ],
})
export class AppModule {}
```

Esta migración también recopilará información sobre todos los componentes declarados en NgModules y mostrará la lista de rutas que los usan (incluida la ubicación correspondiente del archivo). Considera hacer esos componentes standalone y ejecutar esta migración nuevamente. Puedes usar una migración existente ([consulta](reference/migrations/standalone)) para convertir esos componentes a standalone.
