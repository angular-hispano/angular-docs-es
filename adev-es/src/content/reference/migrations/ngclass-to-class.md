# Migración de NgClass a enlaces de clase

Este schematic migra los usos de la directiva NgClass a enlaces de clase en tu aplicación.
Solo migrará los usos que se consideren seguros de migrar.

Ejecuta el schematic usando el siguiente comando:

```bash
ng generate @angular/core:ngclass-to-class
```

#### Antes

```html
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
```

#### Después

```html
<div [class]="{admin: isAdmin, dense: density === 'high'}">
```

## Opciones de configuración

La migración admite algunas opciones para ajustar la migración a tus necesidades específicas.

### `--migrate-space-separated-key`

Por defecto, la migración evita migrar los usos de `NgClass` en los que las claves de los literales de objeto contienen nombres de clase separados por espacios.
Cuando la bandera `--migrate-space-separated-key` está habilitada, se crea un enlace para cada clave individual.

```html
<div [ngClass]="{'class1 class2': condition}"></div>
```

a

```html
<div [class.class1]="condition" [class.class2]="condition"></div>
```
