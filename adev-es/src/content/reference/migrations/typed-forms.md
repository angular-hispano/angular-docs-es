# Migración de formularios tipados

A partir de Angular 14, los formularios reactivos son estrictamente tipados por defecto.

## Descripción general de los formularios tipados

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" title="Formularios tipados en Angular"/>

Con los formularios reactivos de Angular, especificas explícitamente un *modelo de formulario*. Como ejemplo simple, considera este formulario básico de inicio de sesión:

```ts
const login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
});
```

Angular proporciona muchas APIs para interactuar con este `FormGroup`. Por ejemplo, puedes llamar a `login.value`, `login.controls`, `login.patchValue`, etc. (Para una referencia completa de la API, consulta la [documentación de la API](api/forms/FormGroup).)

En versiones anteriores de Angular, la mayoría de estas APIs incluían `any` en algún lugar de sus tipos, e interactuar con la estructura de los controles, o los valores en sí mismos, no era seguro en cuanto a tipos. Por ejemplo, podías escribir el siguiente código inválido:

```ts
const emailDomain = login.value.email.domain;
```

Con los formularios reactivos estrictamente tipados, el código anterior no compila, porque no hay ninguna propiedad `domain` en `email`.

Además de la seguridad añadida, los tipos habilitan una variedad de otras mejoras, como un mejor autocompletado en los IDEs y una forma explícita de especificar la estructura del formulario.

Estas mejoras actualmente solo aplican a los formularios *reactivos* (no a los [formularios *basados en plantilla*](guide/forms/template-driven-forms)).

## Migración automatizada de formularios sin tipo

Al actualizar a Angular 14, una migración incluida reemplazará automáticamente todas las clases de formularios en tu código con versiones sin tipo correspondientes. Por ejemplo, el fragmento anterior se convertiría en:

```ts
const login = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
});
```

Cada símbolo `Untyped` tiene exactamente la misma semántica que en versiones anteriores de Angular, por lo que tu aplicación debería seguir compilando como antes. Al eliminar los prefijos `Untyped`, puedes habilitar los tipos de forma incremental.
