# Usando APIs del DOM

CONSEJO: Esta guía asume que ya has leído la [Guía de Esenciales](essentials). Lee esa primero si eres nuevo en Angular.

Angular maneja la mayoría de la creación, actualización y eliminación del DOM por ti. Sin embargo, raramente podrías necesitar
interactuar directamente con el DOM de un componente. Los componentes pueden inyectar ElementRef para obtener una referencia al
elemento host del componente:

```ts
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```

La propiedad `nativeElement` hace referencia a la instancia del
[Element](https://developer.mozilla.org/es/docs/Web/API/Element) host.

Puedes usar las funciones `afterEveryRender` y `afterNextRender` de Angular para registrar un **callback de renderizado**
que se ejecuta cuando Angular ha terminado de renderizar la página.

```ts
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Enfoca el primer elemento input en este componente.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` y `afterNextRender` deben ser llamados en un _contexto de inyección_, típicamente el
constructor de un componente.

**Evita la manipulación directa del DOM siempre que sea posible.** Siempre prefiere expresar la estructura de tu DOM
en plantillas de componentes y actualizar ese DOM con enlaces.

**Los callbacks de renderizado nunca se ejecutan durante el renderizado del lado del servidor o el pre-renderizado en tiempo de compilación.**

**Nunca manipules directamente el DOM dentro de otros hooks de ciclo de vida de Angular**. Angular no
garantiza que el DOM de un componente esté completamente renderizado en ningún punto que no sea en los callbacks de renderizado.
Además, leer o modificar el DOM durante otros hooks de ciclo de vida puede impactar negativamente el rendimiento de la página
causando [layout thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing).

## Usar el renderer de un componente

Los componentes pueden inyectar una instancia de `Renderer2` para realizar ciertas manipulaciones del DOM que están vinculadas
a otras características de Angular.

Cualquier elemento DOM creado por el `Renderer2` de un componente participa en la
[encapsulación de estilos](guide/components/styling#style-scoping) de ese componente.

Ciertas APIs de `Renderer2` también se vinculan al sistema de animaciones de Angular. Puedes usar el método `setProperty`
para actualizar propiedades de animación sintéticas y el método `listen` para agregar event listeners para
eventos de animación sintéticos. Consulta la guía de [Animaciones](guide/animations) para más detalles.

Aparte de estos dos casos de uso específicos, no hay diferencia entre usar `Renderer2` y las APIs nativas del DOM.
Las APIs de `Renderer2` no admiten manipulación del DOM en contextos de renderizado del lado del servidor o
pre-renderizado en tiempo de compilación.

## Cuándo usar APIs del DOM

Aunque Angular maneja la mayoría de las preocupaciones de renderizado, algunos comportamientos pueden requerir el uso de APIs del DOM. Algunos
casos de uso comunes incluyen:

- Gestionar el foco de elementos
- Medir la geometría de elementos, como con `getBoundingClientRect`
- Leer el contenido de texto de un elemento
- Configurar observadores nativos como
  [`MutationObserver`](https://developer.mozilla.org/es/docs/Web/API/MutationObserver),
  [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) o
  [`IntersectionObserver`](https://developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API).

Evita insertar, eliminar y modificar elementos del DOM. En particular, **nunca establezcas directamente la
propiedad `innerHTML` de un elemento**, lo cual puede hacer que tu aplicación sea vulnerable
a [ataques de cross-site scripting (XSS)](https://developer.mozilla.org/es/docs/Glossary/Cross-site_scripting).
Los enlaces de plantilla de Angular, incluyendo los enlaces para `innerHTML`, incluyen salvaguardas que ayudan
a proteger contra ataques XSS. Consulta la [guía de Seguridad](best-practices/security) para más detalles.
