# Signal Forms: Built-in Synchronous Validators

> **⚠️ EXPERIMENTAL API WARNING**
>
> The Signal Forms API (`@angular/forms/signals`) is **experimental** as of Angular 21 (RC.0). The API is unstable and **should not be used in production**.

Signal Forms include a set of common, built-in validators that you can apply directly when defining your form.

When using the `form(signal, callback)` syntax, you apply validators by calling them inside the callback function. These functions receive a `path` to the control as their first argument.

## 1. Applying Validators in the Component

In this syntax, the second argument to the `form()` function is a callback. This callback receives a `path` object that acts as a "map" to the controls defined in your data signal.

You simply call the validator functions (like `required` or `minLength`) and pass them the control path (e.g., `path.username`).

```typescript
// In your component.ts
import { Component, signal } from "@angular/core";
import { Field, form, maxLength, pattern, minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form-validation',
  standalone: true,
  imports: [JsonPipe, Field],
  templateUrl: './signal-form-validation.component.html'
})
export class SignalFormBuiltinValidationComponent {

  user = signal({
    username: '',
    email: '',
  });

  // 1. The 'form' variable is a Signal<SignalFormGroup>
  form = form(this.user, path => {
    // 2. Apply validators to the 'username' control
    required(path.username, { message: 'username is required' });
    minLength(path.username, 3, { message: 'username must be at least 3 characters long' });
    maxLength(path.username, 10, { message: 'username must be at most 10 characters long' });
    
    // 3. Apply validators to the 'email' control
    required(path.email);
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, { 
      message: 'Please enter a valid email format' 
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

## 2. Reading Errors in the Template

To display validation errors, you read the state from the individual controls.

- Since `form` is a signal, you access the group with `form()`.
- You access the control with `form().username`.
- Since the control is also a signal, you invoke it to get its state: `form().username()`.
- You read the errors with the `.errors()` signal.

**HTML Example:**

```html
<input [field]="form().username" id="user-id" placeholder="username"/>
<input [field]="form().email" id="user-username" placeholder="email"/>

<button (click)="save()" [disabled]="form().invalid()">SUBMIT</button>

<pre>Form Value: {{form().value() | json}}</pre>

<button (click)="resetForm()">Reset Form</button>

@if(form().invalid()){
  <h2> Errors using json </h2>
  <pre style="color:red">username: {{ form().username().errors() | json }}</pre>
  <pre style="color:red">email: {{ form().email().errors() | json }}</pre>

  <h2> username Errors individual messages </h2>
  @let usernameErrors = form().username().errors();

  @for (error of usernameErrors; track $index) {
    <li>{{error.message}}</li>
  }
}
```

## 3. Common Built-in Validators

All synchronous validators accept an optional `ValidatorOptions` object (e.g., `{ message: '...' }`) as their last argument to provide a custom error message.

- `required(path, options?)`  
  Checks that the control's value is not null, undefined, or an empty string.

- `requiredTrue(path, options?)`  
  Checks that the control's value is strictly `true`. (Useful for "I agree" checkboxes).

- `minLength(path, length, options?)`  
  Checks that the string value's length is greater than or equal to the length.

- `maxLength(path, length, options?)`  
  Checks that the string value's length is less than or equal to the length.

- `email(path, options?)`  
  Checks that the string value matches a basic email format regular expression.

- `pattern(path, regex, options?)`  
  Checks that the string value matches the provided RegExp.

- `min(path, minValue, options?)`  
  Checks that the number value is greater than or equal to `minValue`.

- `max(path, maxValue, options?)`  
  Checks that the number value is less than or equal to `maxValue`.