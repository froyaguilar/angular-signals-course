# Signal Forms: Validación Asíncrona Avanzada con `validateAsync`

> **⚠️ ADVERTENCIA: API EXPERIMENTAL**
>
> La API de Signal Forms (`@angular/forms/signals`) es **experimental** a partir de Angular 21.2.5. La API es inestable y **no debe usarse en producción**.

## ¿Qué es `validateAsync`?

Mientras que `validateHttp` es un ayudante sencillo para peticiones `GET`, **`validateAsync`** es la herramienta potente y de bajo nivel para manejar *cualquier* lógica de validación asíncrona personalizada.

Su propósito principal es **separar la carga de recursos de la lógica de validación**:
* **Carga de Recursos:** Obtención de datos de los que *depende* el validador (por ejemplo, una lista de palabras prohibidas o la configuración del usuario desde una base de datos).
* **Lógica de Validación:** La comprobación real (por ejemplo, "¿está el valor actual en esta lista prohibida?").

Esta separación es muy eficiente. El `factory` (cargador) solo se vuelve a ejecutar cuando cambian sus dependencias, mientras que el `onSuccess` (validador) puede ejecutarse instantáneamente con cada pulsación de tecla utilizando el recurso *en caché*.

Al igual que otros validadores asíncronos, también gestiona automáticamente el estado **`pending`** (pendiente) del control (`Signal<boolean>`), que es `true` mientras el `factory` está obteniendo el recurso.

---

## Explicación del Objeto `validateAsync`

`validateAsync` se configura con un objeto que define un flujo claro paso a paso:

1.  **`params: (ctx) => TParams | undefined`**
    * **El Activador.** Esta función se ejecuta **cada vez que cambia el valor del control**.
    * Recibe el contexto del control (`ctx`), que incluye `ctx.value()`.
    * Su trabajo es devolver un objeto de parámetros que el `factory` necesitará. Si devuelve `undefined`, el validador se detiene y no se ejecuta.

2.  **`factory: (params$) => ResourceRef<TResult>`**
    * **El Cargador.** Esta función se ejecuta **solo cuando cambia el objeto `params` (del paso 1)**.
    * Recibe los `params` como un signal (`params$`).
    * Su trabajo es obtener el recurso asíncrono (por ejemplo, realizar una llamada que devuelva una `Promise` u `Observable`).
    * **Debe** devolver un `ResourceRef`, que se crea utilizando la función de ayuda `resource()`.

3.  **`resource(options)`**
    * Esta es una función de ayuda (importada de `@angular/core`) que el `factory` utiliza para envolver la llamada asíncrona.
    * Le pasas un objeto de opciones, comúnmente:
        * `params`: El signal de parámetros del `factory` (por ejemplo, `params$()`).
        * `loader`: Una función que recibe los parámetros resueltos y devuelve la `Promise` u `Observable` (por ejemplo, `({ params }) => this.getBannedListApi(params.category)`).

4.  **`onSuccess: (resource: TResult, ctx) => ValidationErrors | null`**
    * **La Lógica de Validación.** Esta función se ejecuta **después** de que la promesa del `factory` se resuelva con éxito.
    * Recibe el `resource` (los datos cargados, por ejemplo, la lista prohibida) y el `ctx` (el contexto del control).
    * *También* se ejecuta (síncronamente) cada vez que cambia el valor del control *después* de que se haya cargado el recurso, utilizando el recurso en caché.
    * Aquí es donde comparas `ctx.value()` con el `resource` y devuelves `null` (si es válido) o un `customError` (si es inválido).

5.  **`onError: (error) => ValidationErrors`**
    * **El Manejador de Errores.** Esto se ejecuta *solo* si el `loader` del `factory` (la `Promise` u `Observable`) falla (por ejemplo, si es rechazada o ocurre un error HTTP 500).
    * Debe devolver un `customError` para poner el control en un estado de error.

---

## Explicación del Ejemplo de Código

El componente en este directorio (`signal-form-custom-async-validation.component.ts`) demuestra perfectamente este flujo.

* La función **`params`** es inteligente: se ejecuta con cada pulsación de tecla para comprobar `ctx.value().length` y devuelve dinámicamente una `category` (`'short'` o `'long'`).
* El **`factory`** solo se ejecuta cuando esta `category` *cambia* (por ejemplo, cuando la longitud de la entrada cruza los 5 caracteres). Utiliza `resource` y su `loader` para llamar a `getBannedListApi`.
* La función **`onSuccess`** recibe la `bannedList` (la `string[]` devuelta por el `factory`) y realiza la lógica de validación real (`bannedList.includes(ctx.value())`) instantáneamente en cada pulsación de tecla, utilizando la lista en caché.

### Uso en la Plantilla

La plantilla (`signal-form.component.html`) muestra cómo usar los estados proporcionados por el validador.

* **Vinculación:** La vinculación `[field]` debe acceder al control a través del signal `form()`:
    ```html
    <input [field]="form().username" placeholder="nombre de usuario"/>
    ```
* **Estado Pendiente:** El signal `pending()` se utiliza para mostrar un mensaje de carga:
    ```html
    @if (form().username().pending()) {
      <small>Comprobando disponibilidad de {{ form().username().value() }}...</small>
    }
    ```
* **Visualización de Errores:** El signal `errors()` contendrá el `customError` devuelto desde `onSuccess` o `onError`, que luego se muestra en el bucle `@for`.
    ```html
    @let usernameErrors = form().username().errors();

    @for (error of usernameErrors; track $index) {
      <li>{{error.message}}</li>
    }
    ```