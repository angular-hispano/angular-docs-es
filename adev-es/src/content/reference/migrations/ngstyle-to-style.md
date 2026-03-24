# Migración de NgStyle a enlaces de estilo

Este schematic migra los usos de la directiva NgStyle a enlaces de estilo en tu aplicación.
Solo migrará los usos que se consideren seguros de migrar.

Ejecuta el schematic usando el siguiente comando:

```bash
ng generate @angular/core:ngstyle-to-style
```

#### Antes

```html
<div [ngStyle]="{'background-color': 'red'}">
```

#### Después

```html
<div [style]="{'background-color': 'red'}">
```

## Opciones de configuración

La migración admite algunas opciones para ajustar la migración a tus necesidades específicas.

### `--best-effort-mode`

Por defecto, la migración evita migrar los usos de referencias de objetos de `NgStyle`.
Cuando la bandera `--best-effort-mode` está habilitada, las instancias de `ngStyle` vinculadas a referencias de objetos también se migran.
Esto puede ser inseguro de migrar, por ejemplo si el objeto vinculado es mutado.

```html
<div [ngStyle]="styleObject"></div>
```

a

```html
<div [style]="styleObject"></div>
```
