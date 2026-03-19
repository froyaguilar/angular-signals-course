# ¿Por qué usar Signal Forms? (Ventajas y Problemas Resueltos)

> **⚠️ ADVERTENCIA: API EXPERIMENTAL**
>
> A partir de Angular 21, la API de Signal Forms (`@angular/forms/signals`) es **experimental**. No debe utilizarse en producción. Su propósito es recopilar comentarios y la API está sujeta a cambios.

Signal Forms es una reimaginación completa de los formularios en Angular, construida de forma nativa sobre la nueva primitiva reactiva del framework: **Signals**.

### ¿Qué problemas resuelven y por qué usarlos?

Signal Forms no son simplemente "Reactive Forms con Signals". Resuelven problemas fundamentales de implementaciones anteriores y se alinean con la dirección futura de Angular.

#### 1. Reactividad "Glitch-Free" y Eficiencia
Esta es la ventaja más importante.

* **El Problema:** En los Reactive Forms, si actualizas un valor, se dispara un evento `valueChanges`. Si tienes otro campo que depende de ese valor (por ejemplo, un campo `total` que depende de `subtotal`), se dispara *otro* evento. Esto puede causar múltiples ciclos de detección de cambios y renderizaciones innecesarias, un problema conocido como "glitch".
* **La Solución (Signals):** Los Signals están diseñados para ser "glitch-free". Cuando actualizas un valor, Angular sabe exactamente qué partes de tu aplicación (qué señales `computed` o nodos del DOM) dependen de él. Actualiza todo en una sola pasada atómica. **Esto significa que tu formulario es más rápido y eficiente por defecto.**

#### 2. Detección de Cambios sin `zone.js`
Los Reactive Forms dependen de `zone.js` para saber cuándo se ha actualizado un formulario y cuándo volver a renderizar la vista.

* **El Problema:** `zone.js` es una dependencia pesada que parchea las APIs del navegador. La dirección futura de Angular es volverse *Zoneless* para obtener un mejor rendimiento y tamaños de paquete más pequeños.
* **La Solución (Signals):** Signal Forms no necesitan `zone.js`. Cuando el valor de un signal cambia (por ejemplo, `form.value()`), Angular sabe *exactamente* qué parte del DOM actualizar, sin necesidad de un mecanismo de detección de cambios global.

#### 3. API Declarativa y más Simple
La API experimental (`form(signal, path => ...)` está diseñada para ser más declarativa y menos verbosa que los Reactive Forms.

* **El Problema:** Los Reactive Forms requieren una cantidad significativa de código repetitivo (`FormBuilder.group`, `FormArray`, `Validators.required`, etc.). La validación asíncrona (`AsyncValidatorFn`) es compleja y depende en gran medida de RxJS.
* **La Solución (Signals):** La nueva API integra la validación de forma más limpia.
    * **Validación Asíncrona Integrada:** Funciones como **`validateHttp`** y **`validateAsync`** están diseñadas para ser "conectar y usar", gestionando los estados `pending` (pendiente) y la carga de `resource` por ti.
    * **Validación Síncrona Clara:** Los validadores (`required`, `minLength`) se aplican directamente y sus mensajes de error son más fáciles de gestionar.

#### 4. Menor Dependencia de RxJS
Aunque RxJS es increíblemente potente, su curva de aprendizaje es pronunciada y, para formularios sencillos, puede ser excesivo.

* **El Problema:** Los Reactive Forms *requieren* entender los Observables para manejar cambios (`valueChanges`) o validaciones asíncronas.
* **La Solución (Signals):** Signal Forms eliminan esta dependencia. El estado no es un `Observable`; es un `Signal`. Reaccionas a los cambios utilizando `computed` o `effect`, que son conceptos más sencillos. (Nota: `HttpClient` seguirá devolviendo Observables, pero la API de formularios ayuda a abstraer esto).

### Resumen: ¿Por qué deberías usarlos (en el futuro)?

Querrás usar Signal Forms porque serán la forma **nativa, más rápida y más eficiente** de manejar el estado en una aplicación Angular moderna (Zoneless).

* **Rendimiento:** Mejor rendimiento al evitar ciclos de detección de cambios innecesarios.
* **Simplicidad:** Una API más limpia e integrada para la validación, especialmente la validación asíncrona.
* **El Futuro:** Es la dirección en la que se mueve el framework, alineando todo con la reactividad basada en Signals.

## Comparación de Formularios en Angular

| Característica | Template-Driven (TDF) | Reactive Forms (RF) | Signal Forms (Experimental) |
| :--- | :--- | :--- | :--- |
| **Fuente de Verdad** | La plantilla (HTML) | El componente (TypeScript) | El componente (Signals) |
| **Configuración** | Mínima (importar `FormsModule`) | Explícita (importar `ReactiveFormsModule`, usar `FormBuilder`, `FormGroup`, `FormControl`) | Explícita (importar `Field`, `form`, de `@angular/forms/signals`) |
| **Flujo de Datos** | Bidireccional (`[(ngModel)]`) | Unidireccional (del modelo a la vista) | Reactivo (Basado en Signals) |
| **Validación** | En la plantilla (atributos HTML) | En el componente (funciones) | En el componente (funciones) |
| **Validación Asínc.** | Compleja (requiere directivas personaliz.) | Soportada (Observables) | Soportada nativamente (`validateHttp`, `validateAsync`) |
| **Pruebas (Testing)** | Difícil (requiere `ComponentFixture`) | Fácil (se puede instanciar la clase directamente) | Fácil (se puede instanciar la clase directamente) |
| **Escalabilidad** | Baja (mejor para formularios simples) | Alta (ideal para formularios complejos) | Alta (diseñado para la reactividad y escalabilidad) |
| **Caso de Uso Ideal** | Formularios muy simples (ej. login) | Formularios empresariales, dinámicos o complejos | Apps modernas, 100% basadas en Signals (Angular 21+) |
| **Estado en Angular 21.2.5** | Estable | Estable | **Experimental (No usar en producción)** |

## Más información

- [Introducción a Signal Forms](./docs/00-signal-form-basic.md)
- [Estados de Signal Forms](./docs/01-signal-form-states.md)
- [Validación Integrada](./docs/02-signal-form.builtin-validation.md)
- [Validación Personalizada](./docs/03-signal-form-custom-validation.md)
- [Validación Asíncrona con Http (validateHttp)](./docs/04-signal-form-async-validation-http.md)
- [Validación Asíncrona (validateAsync)](./docs/05-signal-form-async-validation.md)
