# Estado dependiente con `linkedSignal`

Puedes usar la función `signal` para gestionar el estado en tu código de Angular. A veces, este estado depende de algún _otro_ estado. Por ejemplo, imagina un componente que permite al usuario seleccionar un método de envío para una orden:

```typescript
@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Por defecto, selecciona la primera opción de envío.
  selectedOption = signal(this.shippingOptions()[0]);

  changeShipping(newOptionIndex: number) {
    this.selectedOption.set(this.shippingOptions()[newOptionIndex]);
  }
}
```

En este ejemplo, `selectedOption` se establece por defecto en la primera opción, pero cambia si el usuario selecciona otra opción. Pero `shippingOptions` es una signal: ¡su valor puede cambiar! Si `shippingOptions` cambia, `selectedOption` puede contener un valor que ya no es una opción válida.

**La función `linkedSignal` te permite crear una signal para gestionar un estado que está intrínsecamente _vinculado_ a otro estado.** Retomando el ejemplo anterior, `linkedSignal` puede reemplazar a `signal`:

```typescript
@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Inicializar selectedOption a la primera opción de envío.
  selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}
```

`linkedSignal` funciona de manera similar a `signal` con una diferencia clave: en lugar de pasar un valor por defecto, pasas una _función de cómputo_, igual que `computed`. Cuando el valor del cómputo cambia, el valor del `linkedSignal` cambia al resultado del cómputo. Esto ayuda a asegurar que el `linkedSignal` siempre tenga un valor válido.

El siguiente ejemplo muestra cómo el valor de un `linkedSignal` puede cambiar basado en su estado vinculado:

```typescript
const shippingOptions = signal(['Ground', 'Air', 'Sea']);
const selectedOption = linkedSignal(() => shippingOptions()[0]);
console.log(selectedOption()); // 'Ground'

selectedOption.set(shippingOptions()[2]);
console.log(selectedOption()); // 'Sea'

shippingOptions.set(['Email', 'Will Call', 'Postal service']);
console.log(selectedOption()); // 'Email'
```

## Considerando el estado anterior

En algunos casos, el cómputo para un `linkedSignal` necesita considerar el valor anterior del `linkedSignal`.

En el ejemplo anterior, `selectedOption` siempre se actualiza de vuelta a la primera opción cuando `shippingOptions` cambia. Puedes, sin embargo, querer preservar la selección del usuario si su opción seleccionada todavía está en algún lugar de la lista. Para lograr esto, puedes crear un `linkedSignal` con una _fuente_ y _cómputo_ separados:

```typescript
interface ShippingMethod {
  id: number;
  name: string;
}

@Component({/* ... */})
export class ShippingMethodPicker {
  constructor() {
    this.changeShipping(2);
    this.changeShippingOptions();
    console.log(this.selectedOption()); // {"id":2,"name":"Postal Service"}
  }

  shippingOptions = signal<ShippingMethod[]>([
    { id: 0, name: 'Ground' },
    { id: 1, name: 'Air' },
    { id: 2, name: 'Sea' },
  ]);

  selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    // `selectedOption` se establece al resultado del `cómputo` siempre que esta `source` cambie.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // Si newOptions contiene la opción previamente seleccionada, preservar esa selección.
      // De lo contrario, usar por defecto la primera opción.
      return (
        newOptions.find((opt) => opt.id === previous?.value.id) ?? newOptions[0]
      );
    },
  });

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }

  changeShippingOptions() {
    this.shippingOptions.set([
      { id: 0, name: 'Email' },
      { id: 1, name: 'Sea' },
      { id: 2, name: 'Postal Service' },
    ]);
  }
}
```

Cuando creas un `linkedSignal`, puedes pasar un objeto con propiedades separadas `source` y `computation` en lugar de proporcionar solo un cómputo.

La `source` puede ser cualquier signal, como un `computed` o `input` de componente. Cuando el valor de `source` cambia, `linkedSignal` actualiza su valor al resultado del `cómputo` proporcionado.

El `computation` es una función que recibe el nuevo valor de `source` y un objeto `previous`. El objeto `previous` tiene dos propiedades — `previous.source` es el valor anterior de `source`, y `previous.value` es el resultado anterior del `cómputo`. Puedes usar estos valores anteriores para decidir el nuevo resultado del cómputo.

ÚTIL: Cuando uses el parámetro `previous`, es necesario proporcionar explícitamente los argumentos de tipo genérico de `linkedSignal`. El primer tipo genérico corresponde con el tipo de `source` y el segundo tipo genérico determina el tipo de salida del `cómputo`.

## Comparación de igualdad personalizada

`linkedSignal`, como cualquier otro signal, puede ser configurado con una función de igualdad personalizada. Esta función es usada por las dependencias aguas abajo para determinar si ese valor del `linkedSignal` (resultado de un cómputo) cambió:

```typescript
const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // Considerar al usuario como el mismo si es el mismo `id`.
  equal: (a, b) => a.id === b.id,
});

// O, si separando `source` y `computation`
const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: user => user,
  equal: (a, b) => a.id === b.id,
});
```
