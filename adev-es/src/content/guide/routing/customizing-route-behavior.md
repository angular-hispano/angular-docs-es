# Personalizando el comportamiento de rutas

Angular Router proporciona puntos de extensión poderosos que te permiten personalizar cómo se comportan las rutas en tu aplicación. Si bien el comportamiento de enrutamiento predeterminado funciona bien para la mayoría de las aplicaciones, requisitos específicos a menudo demandan implementaciones personalizadas para optimización del rendimiento, manejo especializado de URLs o lógica de enrutamiento compleja.

La personalización de rutas puede volverse valiosa cuando tu aplicación necesita:

- **Preservación del estado del componente** a través de navegaciones para evitar volver a obtener datos
- **Carga estratégica de módulos lazy** basada en el comportamiento del usuario o condiciones de red
- **Integración de URLs externas** o manejo de rutas de Angular junto con sistemas legacy
- **Coincidencia dinámica de rutas** basada en condiciones de tiempo de ejecución más allá de patrones de
  ruta simples

NOTA: Antes de implementar estrategias personalizadas, asegúrate de que el comportamiento predeterminado del router no satisfaga tus necesidades. El enrutamiento predeterminado en Angular está optimizado para casos de uso comunes y proporciona el mejor balance de rendimiento y simplicidad. Personalizar estrategias de ruta puede crear complejidad adicional en el código y tener implicaciones de rendimiento en el uso de memoria si no se gestiona cuidadosamente.

## Opciones de configuración del router

`withRouterConfig` o `RouterModule.forRoot` permite proporcionar opciones adicionales de `RouterConfigOptions` para ajustar el comportamiento del Router.

### Manejar navegaciones canceladas

`canceledNavigationResolution` controla cómo el Router restaura el historial del navegador cuando se cancela una navegación. El valor predeterminado es `'replace'`, que revierte a la URL previa a la navegación con `location.replaceState`. En la práctica, esto significa que cada vez que la barra de direcciones ya se ha actualizado para la navegación, como con los botones de retroceso o avance del navegador, la entrada del historial se sobrescribe con el "rollback" si la navegación falla o es rechazada por un guard.
Cambiar a `'computed'` mantiene el índice del historial en vuelo sincronizado con la navegación de Angular, por lo que cancelar una navegación del botón de retroceso dispara una navegación hacia adelante (y viceversa) para volver a la página original.

Esta configuración es más útil cuando tu aplicación usa `urlUpdateStrategy: 'eager'` o cuando los guards cancelan frecuentemente navegaciones popstate iniciadas por el navegador.

```ts
provideRouter(routes, withRouterConfig({ canceledNavigationResolution: 'computed' }));
```

### Reaccionar a navegaciones de la misma URL

`onSameUrlNavigation` configura qué debe suceder cuando el usuario solicita navegar a la URL actual. El valor predeterminado `'ignore'` omite el trabajo, mientras que `'reload'` vuelve a ejecutar guards y resolvers y actualiza las instancias de componentes.

Esto es útil cuando quieres que los clics repetidos en un filtro de lista, elemento de navegación izquierda o botón de actualización disparen una nueva recuperación de datos aunque la URL no cambie.

```ts
provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' }));
```

También puedes controlar este comportamiento en navegaciones individuales en lugar de globalmente. Esto te permite mantener el valor predeterminado de `'ignore'` mientras habilitas selectivamente el comportamiento de recarga para casos de uso específicos:

```ts
router.navigate(['/some-path'], { onSameUrlNavigation: 'reload' });
```

### Controlar la herencia de parámetros

`paramsInheritanceStrategy` define cómo fluyen los parámetros y datos de ruta desde las rutas padre.

Con el valor predeterminado `'emptyOnly'`, las rutas hijas heredan parámetros solo cuando su ruta está vacía o el padre no declara un componente.

```ts
provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }));
```

```ts
export const routes: Routes = [
  {
    path: 'org/:orgId',
    component: Organization,
    children: [
      {
        path: 'projects/:projectId',
        component: Project,
        children: [
          {
            path: 'customers/:customerId',
            component: Customer
          }
        ]
      }
    ]
  }
];
```

```ts
@Component({ /* ... */})
export class CustomerComponent {
  private route = inject(ActivatedRoute);

  orgId = this.route.parent?.parent?.snapshot.params['orgId'];
  projectId = this.route.parent?.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

Usar `'always'` asegura que los parámetros de matriz, datos de ruta y valores resueltos estén disponibles más abajo en el árbol de rutas—útil cuando compartes identificadores contextuales entre áreas de características como `/org/:orgId/projects/:projectId/customers/:customerId`.

```ts
@Component({ /* ... */})
export class CustomerComponent {
  private route = inject(ActivatedRoute);

  // Todos los parámetros padre están disponibles directamente
  orgId = this.route.snapshot.params['orgId'];
  projectId = this.route.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

### Decidir cuándo se actualiza la URL

`urlUpdateStrategy` determina cuándo Angular escribe en la barra de direcciones del navegador. El valor predeterminado `'deferred'` espera una navegación exitosa antes de cambiar la URL. Usa `'eager'` para actualizar inmediatamente cuando comienza la navegación. Las actualizaciones eager facilitan mostrar la URL intentada si la navegación falla debido a guards o errores, pero pueden mostrar brevemente una URL en progreso si tienes guards de larga duración.

Considera esto cuando tu pipeline de análisis necesita ver la ruta intentada incluso si los guards la bloquean.

```ts
provideRouter(routes, withRouterConfig({ urlUpdateStrategy: 'eager' }));
```

### Elegir el manejo predeterminado de parámetros de consulta

`defaultQueryParamsHandling` establece el comportamiento de respaldo para `Router.createUrlTree` cuando la llamada no especifica `queryParamsHandling`. `'replace'` es el valor predeterminado y reemplaza la cadena de consulta existente. `'merge'` combina los valores proporcionados con los actuales, y `'preserve'` mantiene los parámetros de consulta existentes a menos que proporciones explícitamente nuevos.

```ts
provideRouter(routes, withRouterConfig({ defaultQueryParamsHandling: 'merge' }));
```

Esto es especialmente útil para páginas de búsqueda y filtros para retener automáticamente los filtros existentes cuando se proporcionan parámetros adicionales.

Angular Router expone cuatro áreas principales para personalización:

<docs-pill-row>
  <docs-pill href="#estrategia-de-reutilización-de-rutas" title="Estrategia de reutilización de rutas"/>
  <docs-pill href="#estrategia-de-precarga" title="Estrategia de precarga"/>
  <docs-pill href="#estrategia-de-manejo-de-url" title="Estrategia de manejo de URL"/>
  <docs-pill href="#matchers-de-ruta-personalizados" title="Matchers de ruta personalizados"/>
</docs-pill-row>

## Estrategia de reutilización de rutas

La estrategia de reutilización de rutas controla si Angular destruye y recrea componentes durante la navegación o los preserva para reutilizarlos. Por defecto, Angular destruye instancias de componentes al navegar fuera de una ruta y crea nuevas instancias al navegar de regreso.

### Cuándo implementar reutilización de rutas

Las estrategias personalizadas de reutilización de rutas benefician a aplicaciones que necesitan:

- **Preservación del estado de formularios** - Mantener formularios parcialmente completados cuando los usuarios navegan fuera y regresan
- **Retención de datos costosos** - Evitar volver a obtener grandes conjuntos de datos o cálculos complejos
- **Mantenimiento de la posición del scroll** - Preservar posiciones de scroll en listas largas o implementaciones de scroll infinito
- **Interfaces tipo pestaña** - Mantener el estado del componente al cambiar entre pestañas

### Creando una estrategia personalizada de reutilización de rutas

La clase `RouteReuseStrategy` de Angular te permite personalizar el comportamiento de navegación a través del concepto de "handles de ruta desconectados".

Los "handles de ruta desconectados" son la forma de Angular de almacenar instancias de componentes y toda su jerarquía de vistas. Cuando una ruta se desconecta, Angular preserva la instancia del componente, sus componentes hijos y todo el estado asociado en memoria. Este estado preservado puede ser reconectado posteriormente al navegar de regreso a la ruta.

La clase `RouteReuseStrategy` proporciona cinco métodos que controlan el ciclo de vida de los componentes de ruta:

| Método                                                               | Descripción                                                                                                       |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [`shouldDetach`](api/router/RouteReuseStrategy#shouldDetach)         | Determina si una ruta debe almacenarse para reutilización posterior al navegar fuera                             |
| [`store`](api/router/RouteReuseStrategy#store)                       | Almacena el handle de ruta desconectado cuando `shouldDetach` retorna true                                       |
| [`shouldAttach`](api/router/RouteReuseStrategy#shouldAttach)         | Determina si una ruta almacenada debe reconectarse al navegar a ella                                             |
| [`retrieve`](api/router/RouteReuseStrategy#retrieve)                 | Retorna el handle de ruta previamente almacenado para reconexión                                                 |
| [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute) | Determina si el router debe reutilizar la instancia de ruta actual en lugar de destruirla durante la navegación |

El siguiente ejemplo demuestra una estrategia personalizada de reutilización de rutas que preserva selectivamente el estado del componente basado en metadatos de ruta:

```ts
import { RouteReuseStrategy, Route, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Determina si una ruta debe almacenarse para reutilización posterior
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Almacena el handle de ruta desconectado cuando shouldDetach retorna true
    if (handle && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Verifica si una ruta almacenada debe reconectarse
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Retorna el handle de ruta almacenado para reconexión
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true ? this.handlers.get(key) ?? null : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Determina si el router debe reutilizar la instancia de ruta actual
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }
}
```

NOTA: Evita usar la ruta path como clave cuando hay guards `canMatch` involucrados, ya que puede llevar a entradas duplicadas.

### Configurando una ruta para usar una estrategia personalizada de reutilización

Las rutas pueden optar por el comportamiento de reutilización a través de metadatos de configuración de ruta. Este enfoque mantiene la lógica de reutilización separada del código del componente, facilitando el ajuste del comportamiento sin modificar componentes:

```ts
export const routes: Routes = [
  {
    path: 'products',
    component: ProductListComponent,
    data: { reuse: true }  // El estado del componente persiste a través de navegaciones
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    // Sin flag de reutilización - el componente se recrea en cada navegación
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { reuse: true }  // Preserva resultados de búsqueda y estado de filtros
  }
];
```

También puedes configurar una estrategia personalizada de reutilización de rutas a nivel de aplicación a través del sistema de inyección de dependencias de Angular. En este caso, Angular crea una única instancia de la estrategia que gestiona todas las decisiones de reutilización de rutas en toda la aplicación:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
};
```

## Estrategia de precarga

Las estrategias de precarga determinan cuándo Angular carga módulos de ruta con lazy loading en segundo plano. Si bien el lazy loading mejora el tiempo de carga inicial al diferir las descargas de módulos, los usuarios aún experimentan un retraso al navegar por primera vez a una ruta lazy. Las estrategias de precarga eliminan este retraso cargando módulos antes de que los usuarios los soliciten.

### Estrategias de precarga integradas

Angular proporciona dos estrategias de precarga listas para usar:

| Estrategia                                          | Descripción                                                                                                             |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [`NoPreloading`](api/router/NoPreloading)           | La estrategia predeterminada que deshabilita toda precarga. En otras palabras, los módulos solo se cargan cuando los usuarios navegan a ellos |
| [`PreloadAllModules`](api/router/PreloadAllModules) | Carga todos los módulos con lazy loading inmediatamente después de la navegación inicial                               |

La estrategia `PreloadAllModules` puede configurarse de la siguiente manera:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    )
  ]
};
```

La estrategia `PreloadAllModules` funciona bien para aplicaciones pequeñas a medianas donde descargar todos los módulos no impacta significativamente el rendimiento. Sin embargo, las aplicaciones más grandes con muchos módulos de características podrían beneficiarse de una precarga más selectiva.

### Creando una estrategia de precarga personalizada

Las estrategias personalizadas de precarga implementan la interfaz `PreloadingStrategy`, que requiere un único método `preload`. Este método recibe la configuración de ruta y una función que dispara la carga real del módulo. La estrategia retorna un Observable que emite cuando la precarga se completa o un Observable vacío para omitir la precarga:

```ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Solo precargar rutas marcadas con data: { preload: true }
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

Esta estrategia selectiva verifica los metadatos de ruta para determinar el comportamiento de precarga. Las rutas pueden optar por la precarga a través de su configuración:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    data: { preload: true }  // Precargar inmediatamente después de la navegación inicial
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes'),
    data: { preload: false } // Solo cargar cuando el usuario navega a reports
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes')
    // Sin flag de precarga - no se precargará
  }
];
```

### Consideraciones de rendimiento para la precarga

La precarga impacta tanto el uso de red como el consumo de memoria. Cada módulo precargado consume ancho de banda y aumenta la huella de memoria de la aplicación. Los usuarios móviles con conexiones medidas podrían preferir una precarga mínima, mientras que los usuarios de escritorio en redes rápidas pueden manejar estrategias de precarga agresivas.

El timing de la precarga también importa. La precarga inmediata después de la carga inicial podría competir con otros recursos críticos como imágenes o llamadas a API. Las estrategias deberían considerar el comportamiento post-carga de la aplicación y coordinarse con otras tareas en segundo plano para evitar la degradación del rendimiento.

Los límites de recursos del navegador también afectan el comportamiento de precarga. Los navegadores limitan las conexiones HTTP concurrentes, por lo que la precarga agresiva podría hacer cola detrás de otras peticiones. Los service workers pueden ayudar proporcionando control detallado sobre el almacenamiento en caché y las peticiones de red, complementando la estrategia de precarga.

## Estrategia de manejo de URL

Las estrategias de manejo de URL determinan qué URLs procesa el router de Angular versus cuáles ignora. Por defecto, Angular intenta manejar todos los eventos de navegación dentro de la aplicación, pero las aplicaciones del mundo real a menudo necesitan coexistir con otros sistemas, manejar enlaces externos o integrarse con aplicaciones legacy que gestionan sus propias rutas.

La clase `UrlHandlingStrategy` te da control sobre este límite entre rutas gestionadas por Angular y URLs externas. Esto se vuelve esencial al migrar aplicaciones a Angular de forma incremental o cuando las aplicaciones Angular necesitan compartir espacio de URL con otros frameworks.

### Implementando una estrategia personalizada de manejo de URL

Las estrategias personalizadas de manejo de URL extienden la clase `UrlHandlingStrategy` e implementan tres métodos. El método `shouldProcessUrl` determina si Angular debe manejar una URL dada, `extract` retorna la porción de la URL que Angular debe procesar, y `merge` combina el fragmento de URL con el resto de la URL:

```ts
import { Injectable } from '@angular/core';
import { UrlHandlingStrategy, UrlTree } from '@angular/router';

@Injectable()
export class CustomUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree): boolean {
    // Solo manejar URLs que comienzan con /app o /admin
    return url.toString().startsWith('/app') ||
           url.toString().startsWith('/admin');
  }

  extract(url: UrlTree): UrlTree {
    // Retornar la URL sin cambios si debemos procesarla
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    // Combinar el fragmento de URL con el resto de la URL
    return newUrlPart;
  }
}
```

Esta estrategia crea límites claros en el espacio de URL. Angular maneja rutas `/app` y `/admin` mientras ignora todo lo demás. Este patrón funciona bien al migrar aplicaciones legacy donde Angular controla secciones específicas mientras el sistema legacy mantiene otras.

### Configurando una estrategia personalizada de manejo de URL

Puedes registrar una estrategia personalizada a través del sistema de inyección de dependencias de Angular:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { UrlHandlingStrategy } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy }
  ]
};
```

## Matchers de ruta personalizados

Por defecto, el router de Angular itera a través de las rutas en el orden en que están definidas, intentando hacer coincidir la ruta URL contra el patrón de ruta de cada ruta. Soporta segmentos estáticos, segmentos parametrizados (`:id`) y comodines (`**`). La primera ruta que coincide gana, y el router deja de buscar.

Cuando las aplicaciones requieren lógica de coincidencia más sofisticada basada en condiciones de tiempo de ejecución, patrones de URL complejos u otras reglas personalizadas, los matchers personalizados proporcionan esta flexibilidad sin comprometer la simplicidad de las rutas estándar.

El router evalúa los matchers personalizados durante la fase de coincidencia de rutas, antes de que ocurra la coincidencia de rutas. Cuando un matcher retorna una coincidencia exitosa, también puede extraer parámetros de la URL, haciéndolos disponibles al componente activado al igual que los parámetros de ruta estándar.

### Creando un matcher personalizado

Un matcher personalizado es una función que recibe segmentos de URL y retorna ya sea un resultado de coincidencia con segmentos consumidos y parámetros, o null para indicar que no hay coincidencia. La función matcher se ejecuta antes de que Angular evalúe la propiedad path de la ruta:

```ts
import { Route, UrlSegment, UrlSegmentGroup, UrlMatchResult } from '@angular/router';

export function customMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route
): UrlMatchResult | null {
  // Lógica de coincidencia aquí
  if (matchSuccessful) {
    return {
      consumed: segments,
      posParams: {
        paramName: new UrlSegment('paramValue', {})
      }
    };
  }
  return null;
}
```

### Implementando enrutamiento basado en versiones

Considera un sitio de documentación de API que necesita enrutar basándose en números de versión en la URL. Diferentes versiones podrían tener diferentes estructuras de componentes o conjuntos de características:

```ts
import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';

export function versionMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  // Hacer coincidir patrones como /v1/docs, /v2.1/docs, /v3.0.1/docs
  if (segments.length >= 2 && segments[0].path.match(/^v\d+(\.\d+)*$/)) {
    return {
      consumed: segments.slice(0, 2),  // Consumir versión y 'docs'
      posParams: {
        version: segments[0],  // Hacer la versión disponible como parámetro
        section: segments[1]   // Hacer la sección disponible también
      }
    };
  }
  return null;
}

// Configuración de rutas
export const routes: Routes = [
  {
    matcher: versionMatcher,
    component: DocumentationComponent
  },
  {
    path: 'latest/docs',
    redirectTo: 'v3/docs'
  }
];
```

El componente recibe los parámetros extraídos a través de inputs de ruta:

```angular-ts
import { Component, input, inject } from '@angular/core';
import { resource } from '@angular/core';

@Component({
  selector: 'app-documentation',
  template: `
    @if (documentation.isLoading()) {
      <div>Cargando documentación...</div>
    } @else if (documentation.error()) {
      <div>Error al cargar documentación</div>
    } @else if (documentation.value(); as docs) {
      <article>{{ docs.content }}</article>
    }
  `
})
export class DocumentationComponent {
  // Los parámetros de ruta se vinculan automáticamente a signal inputs
  version = input.required<string>();  // Recibe el parámetro version
  section = input.required<string>();  // Recibe el parámetro section

  private docsService = inject(DocumentationService);

  // Resource carga automáticamente documentación cuando version o section cambian
  documentation = resource({
    params: () => {
      if (!this.version() || !this.section()) return;

      return {
        version: this.version(),
        section: this.section()
      }
    },
    loader: ({ params }) => {
      return this.docsService.loadDocumentation(params.version, params.section);
    }
  })
}
```

### Enrutamiento consciente de locale

Las aplicaciones internacionales a menudo codifican información de locale en URLs. Un matcher personalizado puede extraer códigos de locale y enrutar a componentes apropiados mientras hace el locale disponible como parámetro:

```ts
// Locales soportados
const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export function localeMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0) {
    const potentialLocale = segments[0].path;

    if (locales.includes(potentialLocale)) {
      // Esto es un prefijo de locale, consumirlo y continuar coincidiendo
      return {
        consumed: [segments[0]],
        posParams: {
          locale: segments[0]
        }
      };
    } else {
      // Sin prefijo de locale, usar locale predeterminado
      return {
        consumed: [],  // No consumir ningún segmento
        posParams: {
          locale: new UrlSegment('en', {})
        }
      };
    }
  }

  return null;
}
```

### Coincidencia de lógica de negocio compleja

Los matchers personalizados sobresalen en implementar reglas de negocio que serían incómodas de expresar en patrones de ruta. Considera un sitio de comercio electrónico donde las URLs de productos siguen diferentes patrones basados en el tipo de producto:

```ts
export function productMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return null;

  const firstSegment = segments[0].path;

  // Libros: /isbn-1234567890
  if (firstSegment.startsWith('isbn-')) {
    return {
      consumed: [segments[0]],
      posParams: {
        productType: new UrlSegment('book', {}),
        identifier: new UrlSegment(firstSegment.substring(5), {})
      }
    };
  }

  // Electrónicos: /sku/ABC123
  if (firstSegment === 'sku' && segments.length > 1) {
    return {
      consumed: segments.slice(0, 2),
      posParams: {
        productType: new UrlSegment('electronics', {}),
        identifier: segments[1]
      }
    };
  }

  // Ropa: /style/BRAND/ITEM
  if (firstSegment === 'style' && segments.length > 2) {
    return {
      consumed: segments.slice(0, 3),
      posParams: {
        productType: new UrlSegment('clothing', {}),
        brand: segments[1],
        identifier: segments[2]
      }
    };
  }

  return null;
}
```

### Consideraciones de rendimiento para matchers personalizados

Los matchers personalizados se ejecutan para cada intento de navegación hasta que se encuentra una coincidencia. Como resultado, la lógica de coincidencia compleja puede impactar el rendimiento de navegación, especialmente en aplicaciones con muchas rutas. Mantén los matchers enfocados y eficientes:

- Retorna temprano cuando una coincidencia es imposible
- Evita operaciones costosas como llamadas a API o expresiones regulares complejas
- Considera almacenar en caché resultados para patrones de URL repetidos

Si bien los matchers personalizados resuelven requisitos de enrutamiento complejos de manera elegante, el uso excesivo puede hacer que la configuración de rutas sea más difícil de entender y mantener. Reserva los matchers personalizados para escenarios donde la coincidencia de rutas estándar realmente se queda corta.
