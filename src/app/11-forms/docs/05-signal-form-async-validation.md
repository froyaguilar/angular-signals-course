# Signal Forms: Advanced Async Validation with `validateAsync`

> **⚠️ EXPERIMENTAL API WARNING**
>
> The Signal Forms API (`@angular/forms/signals`) is **experimental** as of Angular 21 (RC.0). The API is unstable and **should not be used in production**.

## What is `validateAsync`?

While `validateHttp` is a simple helper for `GET` requests, **`validateAsync`** is the powerful, low-level tool for handling *any* custom asynchronous validation logic.

Its primary purpose is to **separate resource loading from validation logic**:
* **Resource Loading:** Fetching data that the validator *depends on* (e.g., a list of banned words, user settings from a database).
* **Validation Logic:** The actual check (e.g., "is the current value in this banned list?").

This separation is highly efficient. The `factory` (loader) only re-runs when its dependencies change, while the `onSuccess` (validator) can re-run instantly on every keystroke using the *cached* resource.

Like other async validators, it also automatically manages the control's **`pending`** state (`Signal<boolean>`), which is `true` while the `factory` is fetching the resource.

---

## The `validateAsync` Object Explained

`validateAsync` is configured with an object that defines a clear, step-by-step flow:

1.  **`params: (ctx) => TParams | undefined`**
    * **The Trigger.** This function runs **every time the control's value changes**.
    * It receives the control context (`ctx`), which includes `ctx.value()`.
    * Its job is to return an object of parameters that the `factory` will need. If it returns `undefined`, the validator stops and does not run.

2.  **`factory: (params$) => ResourceRef<TResult>`**
    * **The Loader.** This function runs **only when the `params` object (from step 1) changes**.
    * It receives the `params` as a signal (`params$`).
    * Its job is to fetch the asynchronous resource (e.g., make a `Promise` or `Observable` call).
    * It **must** return a `ResourceRef`, which you create using the `resource()` helper function.

3.  **`resource(options)`**
    * This is a helper function (imported from `@angular/core`) that `factory` uses to wrap the async call.
    * You pass it an options object, most commonly:
        * `params`: The params signal from the `factory` (e.g., `params$()`).
        * `loader`: A function that receives the resolved params and returns the `Promise` or `Observable` (e.g., `({ params }) => this.getBannedListApi(params.category)`).

4.  **`onSuccess: (resource: TResult, ctx) => ValidationErrors | null`**
    * **The Validation Logic.** This function runs **after** the `factory`'s promise resolves successfully.
    * It receives the `resource` (the data loaded, e.g., the banned list) and the `ctx` (the control context).
    * It *also* runs (synchronously) every time the control's value changes *after* the resource has been loaded, using the cached resource.
    * This is where you compare `ctx.value()` against the `resource` and return `null` (if valid) or a `customError` (if invalid).

5.  **`onError: (error) => ValidationErrors`**
    * **The Error Handler.** This runs *only* if the `factory`'s `loader` (the `Promise` or `Observable`) fails (e.g., it's rejected, or an HTTP 500 occurs).
    * It must return a `customError` to place the control in an error state.

---

## Code Example Explanation

The component in this directory (`signal-form-custom-async-validation.component.ts`) demonstrates this flow perfectly.

* The **`params`** function is smart: it runs on every keystroke to check `ctx.value().length` and dynamically returns a `category` (`'short'` or `'long'`).
* The **`factory`** only runs when this `category` *changes* (e.g., when the input length crosses 5 characters). It uses `resource` and its `loader` to call `getBannedListApi`.
* The **`onSuccess`** function receives the `bannedList` (the `string[]` returned from the `factory`) and performs the actual validation logic (`bannedList.includes(ctx.value())`) instantly on every keystroke, using the cached list.

### Template Usage

The template (`signal-form.component.html`) shows how to use the states provided by the validator.

* **Binding:** The `[field]` binding must access the control via the `form()` signal:
    ```html
    <input [field]="form().username" placeholder="username"/>
    ```
* **Pending State:** The `pending()` signal is used to show a loading message:
    ```html
    @if (form().username().pending()) {
      <small>Comprobando disponibilidad de {{ form().username().value() }}...</small>
    }
    ```
* **Error Display:** The `errors()` signal will contain the `customError` returned from `onSuccess` or `onError`, which is then displayed in the `@for` loop.
    ```html
    @let usernameErrors = form().username().errors();

    @for (error of usernameErrors; track $index) {
      <li>{{error.message}}</li>
    }
    ```