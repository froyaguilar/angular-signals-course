# Signal Forms: Custom Synchronous Validators

> **⚠️ EXPERIMENTAL API WARNING**  
> The Signal Forms API (`@angular/forms/signals`) is **experimental** as of Angular 21 (RC.0). The API is unstable and **should not be used in production**.

While built-in validators (`required`, `minLength`, etc.) cover common cases, you will often need to implement your own business logic (e.g., "username cannot be 'admin'").

Signal Forms provides the **`validate`** function for custom synchronous logic and the **`customError`** helper to create a standardized error object.

---

## 1. Key Functions Explained

### `validate(path, validationFn)`

Adds a custom validation rule.

- **`path`**: The path to the control you want to validate (e.g., `path.username`).
- **`validationFn`**: A callback function with your custom logic. Receives the control's context as its argument.

#### The Validation Callback: `(childField) => ...`

- **`childField`**: The `ChildFieldContext` (not the signal itself). Provides access to the control's properties and value.
- **`childField.value()`**: Gets the control's current value.
- **Return Value**:
  - Return **`null`** if the control is **valid**.
  - Return a **`ValidationErrors` object** if the control is **invalid**.

### `customError(options)`

Helper to create a `ValidationErrors` object.

- **`options`**: An object with:
  - **`kind`**: A machine-readable string key for the error (e.g., `usernamesForbidden`).
  - **`message`**: A human-readable message for display.

---

## 2. Component Setup (Applying Custom Validation)

Add the `validate` function inside the `form()` callback, alongside built-in validators.

```typescript
import { Component, signal } from "@angular/core";
import { 
  Field, 
  customError, // Import customError
  form, 
  maxLength, 
  pattern, 
  validate, // Import validate
  minLength, 
  required 
} from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form-custom',
  standalone: true,
  imports: [JsonPipe, Field],
  templateUrl: './signal-form-custom.component.html'
})
export class SignalFormCustomValidationComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user, path => {
    required(path.username, { message: 'username is required' });
    minLength(path.username, 3, { message: 'username must be at least 3 characters long' });
    maxLength(path.username, 10, { message: 'username must be at most 10 characters long' });
    required(path.email);
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

    // Custom Validator
    validate(path.username, (childField) => {
      const reservedUsernames = ['admin', 'administrator', 'root'];
      const currentValue = childField.value();
      if (!reservedUsernames.includes(currentValue)) {
        return null; 
      }
      return customError({
        kind: 'usernamesForbidden',
        message: 'username cannot be a reserved username',
      });
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

---

## 3. Template (Displaying Custom Errors)

The template works the same as for built-in validators. The `errors()` signal will include your custom error object if validation fails.

```html
<input [field]="form().username" id="user-id" placeholder="username"/>
<input [field]="form().email" id="user-username" placeholder="email"/>
<button (click)="save()" [disabled]="form().invalid()">SUBMIT</button>

<pre>Form Value: {{form().value() | json}}</pre>

<button (click)="resetForm()">Reset Form</button>

@if(form().invalid()){
  <h2>Errors</h2>
  <pre style="color:red">username: {{ form().username().errors() | json }}</pre>

  <h2>username Errors individual messages</h2>
  @let usernameErrors = form().username().errors();

  @for (error of usernameErrors; track $index) {
    <li>{{error.message}}</li>
  }
}
```
