## Why Use Signal Forms? (Advantages and Problems Solved)

> **⚠️ EXPERIMENTAL API WARNING**
>
> As of Angular 21 (RC.0), the Signal Forms API (`@angular/forms/signals`) is **experimental**. It should not be used in production. Its purpose is to gather feedback, and the API is subject to change.

Signal Forms are a complete reimagining of forms in Angular, built natively on the framework's new reactive primitive: **Signals**.

### What Problems Do They Solve and Why Use Them?

Signal Forms aren't just "Reactive Forms with Signals." They solve fundamental issues from previous implementations and align with the future direction of Angular.

#### 1. "Glitch-Free" Reactivity and Efficiency
This is the most important advantage.

* **The Problem:** In Reactive Forms, if you update a value, a `valueChanges` event fires. If you have another field that depends on that value (e.g., a `total` field depending on `subtotal`), *another* event fires. This can cause multiple change detection cycles and unnecessary re-renders, a problem known as a "glitch."
* **The Solution (Signals):** Signals are designed to be "glitch-free." When you update a value, Angular knows exactly which parts of your application (which `computed` signals or DOM nodes) depend on it. It updates everything in a single, atomic pass. **This means your form is faster and more efficient by default.**

#### 2. Change Detection Without `zone.js`
Reactive Forms rely on `zone.js` to know when a form has been updated and when to re-render the view.

* **The Problem:** `zone.js` is a heavy dependency that patches browser APIs. The future direction of Angular is to become *Zoneless* for better performance and smaller bundle sizes.
* **The Solution (Signals):** Signal Forms don't need `zone.js`. When a signal's value changes (e.g., `form.value()`), Angular knows *exactly* which part of the DOM to update, without needing a global change detection mechanism.

#### 3. Declarative and Simpler API
The experimental API (`form(signal, path => ...)` is designed to be more declarative and less verbose than Reactive Forms.

* **The Problem:** Reactive Forms require significant boilerplate (`FormBuilder.group`, `FormArray`, `Validators.required`, etc.). Asynchronous validation (`AsyncValidatorFn`) is complex and heavily reliant on RxJS.
* **The Solution (Signals):** The new API integrates validation more cleanly.
    * **Built-in Async Validation:** Functions like **`validateHttp`** and **`validateAsync`** are designed to be "plug-and-play," managing `pending` states and `resource` loading for you.
    * **Clear Sync Validation:** Validators (`required`, `minLength`) are applied directly, and their error messages are easier to manage.

#### 4. Reduced Reliance on RxJS
While RxJS is incredibly powerful, its learning curve is steep, and for simple forms, it can be overkill.

* **The Problem:** Reactive Forms *require* an understanding of Observables to handle changes (`valueChanges`) or async validation.
* **The Solution (Signals):** Signal Forms remove this dependency. The state is not an `Observable`; it's a `Signal`. You react to changes using `computed` or `effect`, which are simpler concepts. (Note: `HttpClient` will still return Observables, but the forms API helps abstract this away).

### Summary: Why Should You Use Them (in the future)?

You will want to use Signal Forms because they will be the **native, faster, and most efficient** way to handle state in a modern (Zoneless) Angular application.

* **Performance:** Better performance by avoiding unnecessary change detection cycles.
* **Simplicity:** A cleaner, more integrated API for validation, especially asynchronous validation.
* **The Future:** It is the direction the framework is moving, aligning everything with Signal-based reactivity.

## Angular Forms Comparison

| Feature | Template-Driven (TDF) | Reactive Forms (RF) | Signal Forms (Experimental) |
| :--- | :--- | :--- | :--- |
| **Source of Truth** | The template (HTML) | The component (TypeScript) | The component (Signals) |
| **Setup** | Minimal (import `FormsModule`) | Explicit (import `ReactiveFormsModule`, use `FormBuilder`, `FormGroup`, `FormControl`) | Explicit (import `Field`, `form`, from `@angular/forms/signals`) |
| **Data Flow** | Two-way (`[(ngModel)]`) | One-way (model to view) | Reactive (Signal-based) |
| **Validation** | In the template (HTML attributes) | In the component (functions) | In the component (functions) |
| **Async Validation**| Complex (requires custom directives) | Supported (Observables) | Natively supported (`validateHttp`, `validateAsync`) |
| **Testing** | Difficult (requires `ComponentFixture`) | Easy (can instantiate the class directly) | Easy (can instantiate the class directly) |
| **Scalability** | Low (best for simple forms) | High (ideal for complex forms) | High (designed for reactivity and scalability) |
| **Ideal Use Case** | Very simple forms (e.g., login, newsletter) | Enterprise, dynamic, or complex forms | Modern, 100% Signal-based apps (Angular 21+) |
| **Status Angular 21 (RC.0)** | Stable | Stable | **Experimental (Do not use in production)** |

## Más información

- [Intro to Signal Forms](./docs/00-signal-form-basic.md)
- [Signal Forms States](./docs/01-signal-form-states.md)
- [Built-in Validation](./docs/02-signal-form.builtin-validation.md)
- [Custom Validation](./docs/03-signal-form-custom-validation.md)
- [Async Validation using Http (validateHttp)](./docs/04-signal-form-async-validation-http.md)
- [Async Validation (validateAsync)](./docs/05-signal-form-async-validation.md)
