import { Component, signal } from "@angular/core";
import { Field, form, maxLength, pattern } from '@angular/forms/signals';
import {
  minLength,
  required,
} from '@angular/forms/signals';

import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  imports: [JsonPipe, Field],
  template: `

    <input [field]="form.username" id="user-id" placeholder="username"/>
    <input [field]="form.email" id="user-username" placeholder="email"/>
    <button (click)="save()" [disabled]="form().invalid()">SUBMIT</button>

    <pre>Form Value: {{form().value() | json}}</pre>

    <button (click)="resetForm()">Reset Form</button>


    <!-- Field level errors -->
     @if(form().invalid()){
      <h2> Errors using json </h2>
      <pre style="color:red">username: {{ form.username().errors() | json }}</pre>
      <pre style="color:red">email: {{ form.email().errors() | json }}</pre>

      <h2> username Errors individual messages </h2>
      @let usernameErrors = form.username().errors();

      @for (error of usernameErrors; track $index) {
        <li>{{error.message}}</li>
      }
     }


  `
})
export class SignalFormBuiltinValidationComponent {

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

  });

  save(): void {
    console.log('Form submitted', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }

}
