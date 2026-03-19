import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { Field, form, maxLength, pattern, minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-signal-form-builtin-validation',
  standalone: true,
  imports: [JsonPipe, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Validaciones Incorporadas (Built-in)</h2>

    <div>
      <input [field]="form().username" id="user-id" placeholder="Usuario"/>
      @if (form().username.invalid() && form().username.touched()) {
        <div style="color: red;">
          @for (error of form().username.errors(); track $index) {
            <small>{{ error.message }}</small>
          }
        </div>
      }
    </div>

    <div>
      <input [field]="form().email" id="user-email" placeholder="Email"/>
      @if (form().email.invalid() && form().email.touched()) {
        <div style="color: red;">
          <small>Email no válido</small>
        </div>
      }
    </div>

    <button (click)="save()" [disabled]="form().invalid()">Enviar</button>
    <button (click)="resetForm()">Reiniciar</button>

    <hr>
    <h3>Resumen de Errores:</h3>
    <pre>¿Formulario inválido?: {{ form().invalid() }}</pre>
    <pre>Errores de Usuario: {{ form().username.errors() | json }}</pre>
  `
})
export class SignalFormBuiltinValidationComponent {
  user = signal({
    username: '',
    email: '',
  });

  /**
   * ✅ Podemos definir validaciones directamente en la configuración del formulario.
   * Angular Proporciona validadores comunes que funcionan con Signals.
   */
  form = form(this.user, path => {
    required(path.username, { message: 'El nombre de usuario es obligatorio' });
    minLength(path.username, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(path.username, 10, { message: 'Máximo 10 caracteres' });
    
    required(path.email, { message: 'El email es obligatorio' });
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, { message: 'Formato de email incorrecto' });
  });

  save(): void {
    if (this.form().valid()) {
      console.log('Formulario válido enviado:', this.form().value());
    }
  }

  resetForm(){
    /**
     * ✅ reset(): Limpia el formulario y sus estados (touched, dirty, etc).
     */
    this.form().reset();
  }
}
