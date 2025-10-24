# Visión general de component harnesses

Un <strong>component harness</strong> es una clase que permite a las pruebas interactuar con componentes de la manera en que un usuario final lo hace a través de una API soportada. Puedes crear test harnesses para cualquier componente, desde pequeños widgets reutilizables hasta páginas completas.

Los harnesses ofrecen varios beneficios:

- Hacen que las pruebas sean menos frágiles al aislarse contra detalles de implementación de un componente, como su estructura DOM
- Hacen que las pruebas se vuelvan más legibles y más fáciles de mantener
- Pueden usarse en múltiples entornos de pruebas

<docs-code language="typescript">
// Ejemplo de prueba con un harness para un componente llamado MyButtonComponent
it('should load button with exact text', async () => {
  const button = await loader.getHarness(MyButtonComponentHarness);
  expect(await button.getText()).toBe('Confirm');
});
</docs-code>

Los component harnesses son especialmente útiles para widgets de UI compartidos. Los desarrolladores a menudo escriben pruebas que dependen de detalles privados de implementación de widgets, como estructura DOM y clases CSS. Esas dependencias hacen que las pruebas sean frágiles y difíciles de mantener. Los harnesses ofrecen una alternativa— una API soportada que interactúa con el widget de la misma manera que un usuario final lo hace. Los cambios de implementación del widget ahora se vuelven menos propensos a romper las pruebas de usuario. Por ejemplo, [Angular Material](https://material.angular.dev/components/categories) proporciona un test harness para cada componente en la librería.

Los component harnesses soportan múltiples entornos de pruebas. Puedes usar la misma implementación de harness en pruebas tanto unitarias como end-to-end. Los autores de pruebas solo necesitan aprender una API y los autores de componentes no tienen que mantener implementaciones de prueba unitaria y end-to-end separadas.

Muchos desarrolladores pueden categorizarse por una de las siguientes categorías de tipo de desarrollador: autores de pruebas, autores de component harness y autores de entornos de harness. Usa la tabla a continuación para encontrar la sección más relevante en esta guía basada en estas categorías:

| Tipo de Desarrollador              | Descripción                                                                                                                                                                                                                                                                                            | Sección Relevante                                                                                             |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| Autores de pruebas                | Desarrolladores que usan component harnesses escritos por alguien más para probar su aplicación. Por ejemplo, esto podría ser un desarrollador de aplicaciones que usa un componente de menú de terceros y necesita interactuar con el menú en una prueba unitaria.                                                                       | [Usar component harnesses en pruebas](guide/testing/using-component-harnesses)                                |
| Autores de component harness   | Desarrolladores que mantienen algunos componentes Angular reutilizables y quieren crear un test harness para que sus usuarios lo usen en sus pruebas. Por ejemplo, un autor de una librería de componentes Angular de terceros o un desarrollador que mantiene un conjunto de componentes comunes para una aplicación Angular grande.             | [Crear component harnesses para tus componentes](guide/testing/creating-component-harnesses)               |
| Autores de entornos de harness | Desarrolladores que quieren agregar soporte para usar component harnesses en entornos de pruebas adicionales. Para información sobre entornos de pruebas soportados de forma inmediata, consulta los [entornos de test harness y loaders](guide/testing/using-component-harnesses#test-harness-environments-and-loaders). | [Agregar soporte para entornos de pruebas adicionales](guide/testing/component-harnesses-testing-environments) |

Para la referencia completa de la API, consulta la [página de referencia de la API de component harness del CDK de Angular](/api#angular_cdk_testing).
