import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-signal-form-states',
  standalone: true,
  imports: [JsonPipe, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Estados del Formulario (Signals)</h2>

    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
      <input [field]="form().username" id="user-id" placeholder="Nombre de usuario"/>
      <input [field]="form().email" id="user-username" placeholder="Email"/>
      <button (click)="save()" [disabled]="form().invalid()">Enviar</button>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
      <section style="background: #f0f0f0; padding: 1rem; border-radius: 4px;">
        <h3>Estado Global</h3>
        <p><strong>Sucio (Dirty):</strong> {{ form().dirty() }}</p>
        <p><strong>Tocado (Touched):</strong> {{ form().touched() }}</p>
        <p><strong>Válido (Valid):</strong> {{ form().valid() }}</p>
      </section>

      <section style="background: #e0f7fa; padding: 1rem; border-radius: 4px;">
        <h3>Estado de 'username'</h3>
        <p><strong>Sucio:</strong> {{ form().username.dirty() }}</p>
        <p><strong>Tocado:</strong> {{ form().username.touched() }}</p>
      </section>
    </div>

    <hr>
    <button (click)="resetForm()">Reiniciar Formulario</button>
  `
})
export class SignalFormStatesComponent {
  user = signal({
    username: '',
    email: '',
  });

  /**
   * El objeto de formulario expone signals para cada estado.
   */
  form = form(this.user);

  save(): void {
    console.log('Enviado:', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }
}
