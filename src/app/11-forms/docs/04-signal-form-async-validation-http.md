# Signal Forms: Async Validation with `validateHttp`

> **⚠️ EXPERIMENTAL API WARNING**
>
> The Signal Forms API (`@angular/forms/signals`) is **experimental** as of Angular 21 (RC.0). The API is unstable and **should not be used in production**.

Signal Forms provide a powerful helper function, **`validateHttp`**, to handle common asynchronous validation scenarios, such as checking if a value is valid by making an HTTP `GET` request (e.g., "is this username already taken?"). This helper manages `HttpClient`, debouncing, and the `pending` state for you.

## 1. Key Function and Properties

### `validateHttp(path, options)`

Call this function inside the `form()` validation callback, just like synchronous validators.

- **`path`**: The path to the control to validate (e.g., `path.username`).
- **`options`**: An object to configure the HTTP request and response handling.

#### The `options` Object

- **`request: ({ value }) => string | undefined`**
  - Receives the control's context, including its `value` as a `Signal`.
  - Executed every time the value changes (after a default debounce).
  - Return the **URL string** to be called, or `undefined` to skip validation (e.g., for empty fields).

- **`onSuccess: (response: any) => ValidationErrors | null`**
  - Called if the HTTP request is **successful** (e.g., HTTP 200).
  - Return `null` or `[]` if the value is **valid**.
  - Return an error (or array of errors), typically using `customError`, if the value is **invalid**.

- **`onError: (error: HttpErrorResponse) => ValidationErrors`**
  - Called if the HTTP request **fails** (e.g., HTTP 404, 500, or a network error).
  - Return an error array, usually to indicate a network issue.

## 2. The `pending` State

`validateHttp` automatically manages the control's **`pending`** state.

- `form().username().pending()`: Returns `true` while the HTTP request is in-flight.
- Useful for showing loading spinners or disabling the submit button.

## 3. Component Setup Example

In this example, `validateHttp` is attached to `path.username`. It queries the public `jsonplaceholder` API. If the `onSuccess` callback receives a non-empty array (meaning a user with that name was found), it returns a `customError`.

```typescript
import { Component, signal } from "@angular/core";
import { 
  Field, 
  customError, 
  form, 
  maxLength, 
  pattern, 
  validateHttp
} from '@angular/forms/signals';
import { minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'signal-form-async',
  standalone: true,
  imports: [JsonPipe, Field, HttpClientModule],
  templateUrl: './signal-form-async.component.html'
})
export class SignalFormCustomAsyncValidationHttpComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user, path => {
    required(path.username, { message: 'username is required' });
    minLength(path.username, 3, { message: 'username must be at least 3 characters long' });
    required(path.email);
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

    validateHttp(path.username, {
      request: ({ value }) =>
        value() ? `https://jsonplaceholder.typicode.com/users?username=${value()}` : undefined,
      onSuccess: (result: any[]) =>
        result && result.length
          ? [customError({ kind: 'usernameNotAvailable', message: 'Username already taken' })]
          : [],
      onError: (res: any) =>
        [customError({ kind: 'NetworkError', message: 'Network Error' })]
    });
  });

  save(): void {
    console.log('Form submitted', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }
}
```

## 4. Template Example

The template uses `form().username` for bindings and state access, since `form` is a `Signal<SignalFormGroup>`.

```html
<input [field]="form().username" id="user-id" placeholder="username"/>
<input [field]="form().email" id="user-username" placeholder="email"/>

<button (click)="save()" [disabled]="form().invalid() || form().pending()">
  SUBMIT
</button>

<hr>
@if (form().username().pending()) {
   <small>Checking availability for {{ form().username().value() }}...</small>
}

<pre>Form Value: {{form().value() | json}}</pre>
<button (click)="resetForm()">Reset Form</button>

@if(form().invalid()){
  <h2> Errors </h2>
  <pre style="color:red">username: {{ form().username().errors() | json }}</pre>
  <pre style="color:red">email: {{ form().email().errors() | json }}</pre>

  <h2> username Errors individual messages </h2>
  @let usernameErrors = form().username().errors();

  @for (error of usernameErrors; track $index) {
    <li>{{error.message}}</li>
  }
}
```
