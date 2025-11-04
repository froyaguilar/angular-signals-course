import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';

import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  imports: [JsonPipe, Field],
  template: `

    <input [field]="form.username" id="user-id" placeholder="username"/>
    <input [field]="form.email" id="user-username" placeholder="email"/>
    <button (click)="save()">SUBMIT</button>

    <pre>Form Value: {{ form().value() | json }}</pre>
    <pre>Data Signal: {{ user() | json }}</pre>

    <button (click)="updateUsingSignal()">Update using signal</button>
    <button (click)="updateUsingForm()">Update using form</button>
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

  // Populate Signal Forms.
  updateUsingSignal(){
    this.user.set( { username: 'Carlos', email: 'carlos@dottech.io'});
  }

  updateUsingForm(){
    this.form().value.set({ username: 'Alvaro', email: 'alvaro@dottech.io'})
  }
}
