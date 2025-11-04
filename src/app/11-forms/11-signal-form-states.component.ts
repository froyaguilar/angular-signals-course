import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';

import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  imports: [JsonPipe, Field],
  template: `
    <input [field]="form.username" id="user-id" placeholder="username"/>
    <input [field]="form.email" id="user-username" placeholder="email"/>
    <button (click)="save()" [disabled]="form().invalid()">SUBMIT</button>

    <hr>
      <pre>Form Dirty:{{form().dirty() | json}}</pre>
      <pre>Form Touched:{{form().touched() | json}}</pre>
    <hr>

    <hr>
      <pre>username Dirty:{{form.username().dirty() | json}}</pre>
      <pre>username Touched:{{form.username().touched() | json}}</pre>
    <hr>
      <pre>email Dirty:{{form.email().dirty() | json}}</pre>
      <pre>email Touched:{{form.email().touched() | json}}</pre>

    <pre>Form Value: {{form().value() | json}}</pre>

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
    console.log('Form submitted', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }

}
