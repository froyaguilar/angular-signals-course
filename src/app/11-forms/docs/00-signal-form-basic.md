# Signal Forms: Basic Usage (Two-Way Data Sync)

> **⚠️ EXPERIMENTAL API WARNING**
>
> The Signal Forms API (`@angular/forms/signals`) is **experimental** as of Angular 21 (RC.0). The API is unstable and **should not be used in production**. It is intended for evaluation and feedback purposes only.

This guide covers the most basic use case for Signal Forms: creating a form that is directly synchronized with an existing `signal` in your component.

## Core Concept: `form(signal)`

The `form()` function can be initialized by passing an existing `signal` that holds your data model.

When you do this, Angular creates a **two-way synchronization** between the form's state and your original signal.

* Changes to the original signal will update the form.
* Changes to the form (e.g., user input) will update the original signal.

---

## 1. Component Setup

In the component, you first define your data as a `signal`. Then, you create the form by passing that signal to the `form()` function.

```typescript
// In your component.ts
import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  standalone: true,
  imports: [JsonPipe, Field], // 'Field' is required for the [field] binding
  // ...
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
  
  // ...
}