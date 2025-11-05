# Signal Forms: Basic Usage (Two-Way Data Sync)
> **⚠️ EXPERIMENTAL API WARNING**
>
> The Signal Forms API (`@angular/forms/signals`) is **experimental** as of Angular 21 (RC.0). The API is unstable and **should not be used in production**. It is intended for evaluation and feedback purposes only.

This guide covers the most basic use case for Signal Forms: creating a form that is directly synchronized with an existing `signal` in your component.

## Core Concept: `form(signal)`

The `form()` function can be initialized by passing an existing `signal` that holds your data model.

When you do this, Angular creates a **two-way synchronization** between the form's state and your original signal:

- Changes to the original signal will update the form.
- Changes to the form (e.g., user input) will update the original signal.

---

## 1. Component Setup

First, define your data as a `signal`. Then, create the form by passing that signal to the `form()` function.

```typescript
import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  standalone: true,
  imports: [JsonPipe, Field], // 'Field' is required for the [field] binding
})
export class SignalFormBasicComponent {
  // 1. This is your "source of truth" data signal
  user = signal({
    username: '',
    email: '',
  });

  // 2. Create the form by linking it to the 'user' signal
  // This establishes the two-way sync.
  form = form(this.user);
}
```

## 2. Template Binding with `[field]`

In the template, import the `Field` directive to use the `[field]` binding. You can access the form's controls directly as properties on the form variable (e.g., `form.username`):

```html
<input [field]="form.username" id="user-id" placeholder="username"/>
<input [field]="form.email" id="user-username" placeholder="email"/>

<pre>Form Value: {{ form().value() | json }}</pre>
<pre>Data Signal: {{ user() | json }}</pre>
```

## 3. Two-Way Synchronization in Action

The example demonstrates two-way sync with two update methods:

### Path 1: Updating the Form Signal

This method updates the form's internal value signal directly. Because the form is linked to `this.user`, the user signal is also updated automatically.

```typescript
updateUsingForm() {
  // This updates the form, which in turn updates 'this.user'
  this.form().value.set({ username: 'Alvaro', email: 'alvaro@dottech.io' });
}
```

### Path 2: Updating the Source Signal

This method updates the original `user` signal. Because the form is linked to it, the form also updates automatically, and the changes appear in the input fields.

```typescript
updateUsingSignal() {
  // This updates 'this.user', which in turn updates the form
  this.user.set({ username: 'Carlos', email: 'carlos@dottech.io' });
}
```

User input (typing in the box) works just like Path 1: it updates the form signal, which then syncs that change back to the original user signal.

---

## Full Code Example

This is the complete, functional component:

```typescript
import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  standalone: true,
  imports: [JsonPipe, Field],
  template: `
    <form (ngSubmit)="save()">
      <input [field]="form.username" id="user-id" placeholder="username"/>
      <input [field]="form.email" id="user-username" placeholder="email"/>
      <button type="submit">SUBMIT</button>
    </form>

    <hr>
    <pre>Form Value: {{ form().value() | json }}</pre>
    <pre>Data Signal: {{ user() | json }}</pre>

    <button (click)="updateUsingSignal()" type="button">Update using signal</button>
    <button (click)="updateUsingForm()" type="button">Update using form</button>
  `
})
export class SignalFormBasicComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user);

  save(): void {
    console.log('Form submitted', this.form().value());
  }

  updateUsingSignal() {
    this.user.set({ username: 'Carlos', email: 'carlos@dottech.io' });
  }

  updateUsingForm() {
    this.form().value.set({ username: 'Alvaro', email: 'alvaro@dottech.io' });
  }
}
```
