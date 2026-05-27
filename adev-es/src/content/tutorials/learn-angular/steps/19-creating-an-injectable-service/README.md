# Creando un servicio inyectable

La inyección de dependencias (DI) en Angular es una de las características más poderosas del framework. Considera la inyección de dependencias como la capacidad de Angular para _proveer_ los recursos que necesitas para tu aplicación en tiempo de ejecución. Una dependencia podría ser un servicio o algún otro recurso.

NOTA: Aprende más sobre [inyección de dependencias en la guía esencial](/essentials/dependency-injection).

En esta actividad, aprenderás cómo crear un servicio `injectable`.

<hr>

Una forma de usar un servicio es como una manera de interactuar con datos y APIs. Para hacer que un servicio sea reutilizable, debes mantener la lógica en el servicio y compartirlo a lo largo de la aplicación cuando sea necesario.

Para hacer que un servicio sea elegible para ser inyectado por el sistema DI, usa el decorador `@Injectable`. Por ejemplo:

<docs-code language="ts" highlight="[1, 2, 3]">
@Injectable({
  providedIn: 'root'
})
class UserService {
  // methods to retrieve and return data
}
</docs-code>

El decorador `@Injectable` notifica al sistema DI que `UserService` está disponible para ser solicitado en una clase. `providedIn` establece el ámbito en el que este recurso está disponible. Por ahora, es suficiente entender que `providedIn: 'root'` significa que `UserService` está disponible para toda la aplicación.

Bien, intenta tú:

<docs-workflow>

<docs-step title="Agrega el decorador `@Injectable`">
Actualiza el código en `car.service.ts` agregando el decorador `@Injectable`.
</docs-step>

<docs-step title="Configura el decorador">
Los valores en el objeto pasado al decorador se consideran la configuración del decorador.
<br>
Actualiza el decorador `@Injectable` en `car.service.ts` para incluir la configuración `providedIn: 'root'`.

CONSEJO: Usa el ejemplo anterior para encontrar la sintaxis correcta.

</docs-step>

</docs-workflow>

Bien hecho 👍 ese servicio ahora es `injectable` y puede participar en la diversión. Ahora que el servicio es `injectable`, intentemos inyectarlo en un componente 👉
