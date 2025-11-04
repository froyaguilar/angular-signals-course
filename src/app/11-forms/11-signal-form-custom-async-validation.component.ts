import { Component, resource, signal } from "@angular/core";
import { Field, customError, form, maxLength, pattern, validateAsync } from '@angular/forms/signals';
import { minLength, required, } from '@angular/forms/signals';

import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  imports: [JsonPipe, Field],
  template: `
    <input [field]="form.username" id="user-id" placeholder="username"/>
    <input [field]="form.email" id="user-username" placeholder="email"/>
    <button (click)="save()" [disabled]="form().invalid()">SUBMIT</button>
    <hr>
    @if (form.username().pending()) {
       <small>Comprobando disponibilidad de {{ form.username().value() }}...</small>
    }

    <pre>Form Value: {{form().value() | json}}</pre>
    <button (click)="resetForm()">Reset Form</button>

    <!-- Field level errors -->
     @if(form().invalid()){
      <h2> Errors </h2>
      <pre style="color:red">username: {{ form.username().errors() | json }}</pre>
      <pre style="color:red">email: {{ form.email().errors() | json }}</pre>

      <h2> username Errors individual messages </h2>
      @let usernameErrors = form.username().errors();

      @for (error of usernameErrors; track $index) {
        <li>{{error.message}}</li>
      }

  }`
})
export class SignalFormCustomAsyncValidationComponent {
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

    validateAsync(path.username, {
      params: (ctx) => ({
        value: ctx.value(),
        category: ctx.value().length < 5 ? 'short' : 'long' as 'long' | 'short',
      }),
      factory: (params) => resource({
        params,
        loader: ({ params }) =>  this.getBannedListApi(params.category),
      }),
      onError: () => customError({ kind: 'asyncError', message: 'The validation could not be completed' }),
      onSuccess: (bannedList , ctx) => {
        // bannedList is the array fetched from the API (ej. ["admin", "root", "support"])
        // ctx.value() is the current value of the input (ej. "admin")
        if (!bannedList.includes(ctx.value())) {
          return null;
        }

        return customError({
          kind: 'usernamesForbidden',
          message: `"${ctx.value()}" is not allowed (banned list) ("${bannedList.join(', ')}`
        });
      }
    });
  });


  getBannedListApi(category: 'short' | 'long'): Promise<string[]> {
    console.log(`FACTORY: Loading list '${category}'...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const lists = {
          short: ['a', 'b', 'c'],
          long: ['admin', 'root', 'support']
        };
        resolve(lists[category]);
      }, 1000);
    });
  }

  save(): void {
    console.log('Form submitted', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }

}
