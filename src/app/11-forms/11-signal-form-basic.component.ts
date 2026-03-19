import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-signal-form-basic',
  standalone: true,
  imports: [JsonPipe, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Formularios Reactivos con Signals (Básico)</h2>

    <div>
      <label for="user-id">Nombre de usuario:</label>
      <input [field]="form().username" id="user-id" placeholder="Usuario"/>
    </div>

    <div>
      <label for="user-email">Email:</label>
      <input [field]="form().email" id="user-email" placeholder="Email"/>
    </div>

    <button (click)="save()">Enviar (Submit)</button>

    <hr>
    <h3>Estado del Formulario:</h3>
    <pre>Valor del Formulario: {{ form().value() | json }}</pre>
    <pre>Signal de Datos (user): {{ user() | json }}</pre>

    <button (click)="updateUsingSignal()">Actualizar usando el Signal</button>
    <button (click)="updateUsingForm()">Actualizar usando el Formulario</button>
  `
})
export class SignalFormBasicComponent {
  /**
   * ✅ El signal de datos sirve como fuente de la verdad para el formulario.
   */
  user = signal({
    username: '',
    email: '',
  });

  /**
   * ✅ form(): Crea un objeto de formulario reactivo basado en un signal.
   * Cualquier cambio en 'user' se reflejará en el formulario y viceversa.
   */
  form = form(this.user);

  save(): void {
    console.log('Formulario enviado:', this.form().value());
  }

  /**
   * Al actualizar el signal original, el formulario se actualiza automáticamente.
   */
  updateUsingSignal(){
    this.user.set({ username: 'Carlos', email: 'carlos@ejemplo.com'});
  }

  /**
   * También podemos actualizar el valor directamente a través de la API del formulario.
   */
  updateUsingForm(){
    this.form().value.set({ username: 'Alvaro', email: 'alvaro@ejemplo.com'})
  }
}
