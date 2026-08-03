# Proyección de contenido con ng-content

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee esa primero si eres nuevo en Angular.

Frecuentemente necesitas crear componentes que actúen como contenedores para diferentes tipos de contenido. Por
ejemplo, puedes querer crear un componente de tarjeta personalizado:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- el contenido de la tarjeta va aquí --> </div>',
})
export class CustomCard {/* ... */}
```

**Puedes usar el elemento `<ng-content>` como marcador de posición para indicar dónde debe ir el contenido**:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content/> </div>',
})
export class CustomCard {/* ... */}
```

CONSEJO: `<ng-content>` funciona de manera similar
al [elemento nativo `<slot>`](https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/slot),
pero con alguna funcionalidad específica de Angular.

Cuando usas un componente con `<ng-content>`, cualquier hijo del elemento host del componente se
renderiza, o **proyecta**, en la ubicación de ese `<ng-content>`:

```angular-ts
// Código fuente del componente
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {/* ... */}
```

```angular-html
<!-- Usando el componente -->
<custom-card>
  <p>Este es el contenido proyectado</p>
</custom-card>
```

```angular-html
<!-- El DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <p>Este es el contenido proyectado</p>
  </div>
</custom-card>
```

Angular se refiere a cualquier hijo de un componente pasado de esta manera como el **contenido** de ese componente. Esto
es distinto de la **vista** del componente, que se refiere a los elementos definidos en la plantilla del componente.

**El elemento `<ng-content>` no es ni un componente ni un elemento DOM**. En su lugar, es un marcador de posición
especial que le dice a Angular dónde renderizar el contenido. El compilador de Angular procesa
todos los elementos `<ng-content>` en tiempo de compilación. No puedes insertar, eliminar o modificar `<ng-content>` en
tiempo de ejecución. No puedes agregar directivas, estilos o atributos arbitrarios a `<ng-content>`.

IMPORTANTE: No debes incluir condicionalmente `<ng-content>` con `@if`, `@for` o `@switch`. Angular siempre
instancia y crea nodos DOM para el contenido renderizado en un marcador de posición `<ng-content>`, incluso si
ese marcador de posición `<ng-content>` está oculto. Para renderizado condicional del contenido del componente,
consulta [Fragmentos de plantilla](api/core/ng-template).

## Múltiples marcadores de posición de contenido {#multiple-content-placeholders}

Angular admite proyectar múltiples elementos diferentes en diferentes marcadores de posición `<ng-content>`
basándose en selectores CSS. Expandiendo el ejemplo de la tarjeta de arriba, podrías crear dos marcadores de posición para
un título de tarjeta y un cuerpo de tarjeta usando el atributo `select`:

```angular-ts
@Component({
  selector: 'card-title',
  template: `<ng-content>card-title</ng-content>`,
})
export class CardTitle {}

@Component({
  selector: 'card-body',
  template: `<ng-content>card-body</ng-content>`,
})
export class CardBody {}
```

```angular-ts
<!-- Plantilla del componente -->
Component({
  selector: 'custom-card',
  template: `
  <div class="card-shadow">
    <ng-content select="card-title"></ng-content>
    <div class="card-divider"></div>
    <ng-content select="card-body"></ng-content>
  </div>
  `,
})
export class CustomCard {}
```

```angular-ts
<!-- Usando el componente -->
@Component({
  selector: 'app-root',
  imports: [CustomCard, CardTitle, CardBody],
  template: `
    <custom-card>
      <card-title>Hola</card-title>
      <card-body>Bienvenido al ejemplo</card-body>
    </custom-card>
`,
})
export class App {}
```

```angular-html
<!-- DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hola</card-title>
    <div class="card-divider"></div>
    <card-body>Bienvenido al ejemplo</card-body>
  </div>
</custom-card>
```

El marcador de posición `<ng-content>` admite los mismos selectores CSS
que los [selectores de componentes](guide/components/selectors).

Si incluyes uno o más marcadores de posición `<ng-content>` con un atributo `select` y
un marcador de posición `<ng-content>` sin un atributo `select`, el último captura todos los elementos que
no coincidieron con un atributo `select`:

```angular-html
<!-- Plantilla del componente -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- captura cualquier cosa excepto "card-title" -->
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- Usando el componente -->
<custom-card>
  <card-title>Hola</card-title>
  <img src="..." />
  <p>Bienvenido al ejemplo</p>
</custom-card>
```

```angular-html
<!-- DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hola</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Bienvenido al ejemplo</p>
  </div>
</custom-card>
```

Si un componente no incluye un marcador de posición `<ng-content>` sin un atributo `select`, cualquier
elemento que no coincida con uno de los marcadores de posición del componente no se renderiza en el DOM.

## Contenido de respaldo {#fallback-content}

Angular puede mostrar _contenido de respaldo_ para el marcador de posición `<ng-content>` de un componente si ese componente no tiene ningún contenido hijo coincidente. Puedes especificar contenido de respaldo agregando contenido hijo al propio elemento `<ng-content>`.

```angular-html
<!-- Plantilla del componente -->
<div class="card-shadow">
  <ng-content select="card-title">Título predeterminado</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Cuerpo predeterminado</ng-content>
</div>
```

```angular-html
<!-- Usando el componente -->
<custom-card>
  <card-title>Hola</card-title>
  <!-- No se proporcionó card-body -->
</custom-card>
```

```angular-html
<!-- DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hola</card-title>
    <div class="card-divider"></div>
    Cuerpo predeterminado
  </div>
</custom-card>
```

## Alias de contenido para proyección {#aliasing-content-for-projection}

Angular admite un atributo especial, `ngProjectAs`, que te permite especificar un selector CSS en
cualquier elemento. Siempre que un elemento con `ngProjectAs` se compara contra un marcador de posición `<ng-content>`,
Angular compara contra el valor de `ngProjectAs` en lugar de la identidad del elemento:

```angular-html
<!-- Plantilla del componente -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- Usando el componente -->
<custom-card>
  <h3 ngProjectAs="card-title">Hola</h3>

  <p>Bienvenido al ejemplo</p>
</custom-card>
```

```angular-html
<!-- DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <h3>Hola</h3>
    <div class="card-divider"></div>
    <p>Bienvenido al ejemplo</p>
  </div>
</custom-card>
```

`ngProjectAs` solo admite valores estáticos y no se puede enlazar a expresiones dinámicas.

## Advertencias {#caveats}

### El contenido proyectado vive en la vista del padre {#projected-content-lives-in-the-parents-view}

Aunque el contenido proyectado se _renderiza_ dentro del componente receptor, sigue siendo propiedad del componente que lo declaró. Angular lo rastrea como parte de la vista del padre, lo que tiene un par de efectos secundarios que vale la pena conocer.

**Detección de cambios:** El contenido proyectado se verifica cuando el _padre_ ejecuta la detección de cambios. Si el componente receptor usa `OnPush`, Angular puede saltarse la verificación de la propia plantilla de ese componente — pero no se saltará el contenido proyectado, porque ese pertenece al padre.

```angular-html
<!-- Plantilla del padre (detección de cambios por defecto) -->
<onpush-wrapper>
  <!-- Aún se verifica en cada ciclo del padre, OnPush no ayuda aquí -->
  <expensive-component />
</onpush-wrapper>
```

**Inyección de dependencias:** El contenido proyectado obtiene sus dependencias del injector del padre, no de los `viewProviders` del componente receptor. Consulta [Providers y viewProviders](guide/di/hierarchical-dependency-injection) para más detalles.

### Algunos componentes de librería no soportan hijos proyectados {#some-library-components-dont-support-projected-children}

Ciertos componentes — menús, pestañas, listas — usan `ContentChildren` para encontrar a sus hijos y conectar comportamientos como navegación con teclado, gestión del foco o atributos ARIA. Están escritos asumiendo que son propietarios directos de sus hijos, por lo que proyectar contenido externo en ellos tiende a romper las cosas de maneras sutiles.

Por ejemplo, envolver elementos `<mat-menu-item>` en una capa extra y proyectarlos en `<mat-menu>` puede romper silenciosamente la navegación con teclado y el soporte de lectores de pantalla. La consulta aún encuentra los elementos, pero la configuración interna que los hace interactivos puede no funcionar correctamente cuando los elementos provienen de un contexto de vista diferente.

Si un componente de librería gestiona el comportamiento de sus hijos, consulta su documentación antes de usar proyección de contenido — puede que no sea compatible.
