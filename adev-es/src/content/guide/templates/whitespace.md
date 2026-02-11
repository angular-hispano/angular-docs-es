# Espacios en blanco en plantillas

Por defecto, las plantillas de Angular no preservan espacios en blanco que el framework considera innecesarios. Esto ocurre comúnmente en dos situaciones: espacios en blanco entre elementos, y espacios en blanco colapsables dentro de texto.

## Espacios en blanco entre elementos

La mayoría de los desarrolladores prefieren formatear sus plantillas con saltos de línea e indentación para hacer la plantilla legible:

```angular-html
<section>
  <h3>User profile</h3>
  <label>
    User name
    <input>
  </label>
</section>
```

Esta plantilla contiene espacios en blanco entre todos los elementos. El siguiente fragmento muestra el mismo HTML con cada carácter de espacio en blanco reemplazado con el carácter hash (`#`) para resaltar cuánto espacio en blanco está presente:

```angular-html
<!-- Total de espacios en blanco: 20 -->
<section>###<h3>User profile</h3>###<label>#####User name#####<input>###</label>#</section>
```

Preservar los espacios en blanco tal como están escritos en la plantilla resultaría en muchos [nodos de texto](https://developer.mozilla.org/en-US/docs/Web/API/Text) innecesarios y aumentaría la sobrecarga de renderización de la página. Al ignorar estos espacios en blanco entre elementos, Angular realiza menos trabajo al renderizar la plantilla en la página, mejorando el rendimiento general.

## Espacios en blanco colapsables dentro de texto

Cuando tu navegador web renderiza HTML en una página, colapsa múltiples caracteres de espacio en blanco consecutivos a un solo carácter:

```angular-html
<!-- Cómo se ve en la plantilla -->
<p>Hello         world</p>
```

En este ejemplo, el navegador muestra solo un espacio único entre "Hello" y "world".

```angular-html
<!-- Lo que se muestra en el navegador -->
<p>Hello world</p>
```

Consulta [Cómo maneja los espacios en blanco HTML, CSS y el DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace) para más contexto sobre cómo funciona esto.

Angular evita enviar estos caracteres de espacio en blanco innecesarios al navegador en primer lugar colapsándolos a un solo carácter cuando compila la plantilla.

## Preservando espacios en blanco

Puedes indicarle a Angular que preserve los espacios en blanco en una plantilla especificando `preserveWhitespaces: true` en el decorador `@Component` para una plantilla.

```angular-ts
@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})
```

Evita configurar esta opción a menos que sea absolutamente necesario. Preservar espacios en blanco puede hacer que Angular produzca significativamente más nodos durante la renderización, ralentizando tu aplicación.

Puedes adicionalmente usar una entidad HTML especial única de Angular, `&ngsp;`. Esta entidad produce un solo carácter de espacio que se preserva en la salida compilada.
