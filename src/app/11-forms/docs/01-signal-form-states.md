# Signal Forms: Understanding Form States

> **⚠️ EXPERIMENTAL API WARNING**
>
> The Signal Forms API (`@angular/forms/signals`) is **experimental** as of Angular 21 (RC.0). The API is unstable and **should not be used in production**.

Signal Forms track not just the `value`, but also the *state* of user interaction. This is crucial for scenarios like showing error messages only after a field has been "touched" or enabling/disabling the "Submit" button based on form validity.

All these states are **signals**, so your template can react to them instantly.

## Core Interaction States

- **`dirty`**: A `Signal<boolean>`.
  - `true` if the user has **changed the value** in the field.
  - Related state: **`pristine`** (the value has not changed).
  - **How does it change?**: The state switches from `pristine` to `dirty` when the user modifies the field's value for the first time.

- **`touched`**: A `Signal<boolean>`.
  - `true` if the user has focused on the field and then left it (the "blur" event).
  - Related state: **`untouched`**.
  - **How does it change?**: The state switches from `untouched` to `touched` when the user enters and then leaves the field (for example, by clicking in and then clicking out).

> Note: These states are not strictly opposites; they represent different aspects of a form control's lifecycle. A control can be both pristine and untouched, or dirty and touched, depending on user interaction.

## Core Validation States

- **`invalid`**: A `Signal<boolean>`.
  - `true` if the form or control fails any of its validation rules.
  - Note: The opposite state is not simply `valid`. A control can be neither `invalid` nor `valid` if it has not been validated yet (for example, if it is in a `pending` state).
- **`pending`**: A `Signal<boolean>`.
  - `true` if an asynchronous validator (like `validateHttp`, `validateAsync`) is currently running.

## Accessing States in the Template

You can check state at two levels: the **entire form** or an **individual control**.

### 1. Form-Level State

When you create a form with `form = form(this.user)`, the `form` variable is a `SignalFormGroup`. Its state signals (like `invalid` or `dirty`) reflect the combined state of all its children.

- `form.invalid()`: Is the *entire form* invalid? (Returns `true` if *any* child control is invalid).
- `form.dirty()`: Has *any* value in the form changed?
- `form.touched()`: Has the user *touched* any control in the form?

This is commonly used to disable the submit button:

```html
<button [disabled]="form.invalid()">SUBMIT</button>
```

### 2. Control-Level State

You access an individual control as a property on the form object. That control has its own set of state signals.

- `form.username.invalid()`: Is only the username invalid?
- `form.username.dirty()`: Has only the username changed?
- `form.username.touched()`: Has the user touched the username field?

This is useful for showing errors at the right time (e.g., only show if touched and invalid).

## Resetting State

You can reset the form's value and all its interaction states back to their original (pristine, untouched) state by calling the `reset()` method:

```typescript
resetForm() {
  this.form.reset();
}
```

## Example Component

Here is a functional example of a component using Signal Forms:

```typescript
import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  standalone: true,
  imports: [JsonPipe, Field],
  template: `
    <input [field]="form.username" id="user-id" placeholder="username"/>
    <input [field]="form.email" id="user-username" placeholder="email"/>
    
    <button (click)="save()" [disabled]="form.invalid()">SUBMIT</button>

    <hr>
      <pre>Form Dirty: {{ form.dirty() | json }}</pre>
      <pre>Form Touched: {{ form.touched() | json }}</pre>
    <hr>

    <hr>
      <pre>username Dirty: {{ form.username.dirty() | json }}</pre>
      <pre>username Touched: {{ form.username.touched() | json }}</pre>
    <hr>
      <pre>email Dirty: {{ form.email.dirty() | json }}</pre>
      <pre>email Touched: {{ form.email.touched() | json }}</pre>

    <pre>Form Value: {{ form.value() | json }}</pre>

    <button (click)="resetForm()">Reset Form</button>
  `
})
export class SignalFormStatesComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user);

  save(): void {
    console.log('Form submitted', this.form.value());
  }

  resetForm() {
    this.form.reset();
  }
}
```
