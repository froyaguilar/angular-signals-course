import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { Field, customError, form, maxLength, pattern, validate, minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-signal-form-custom-validation',
  standalone: true,
  imports: [JsonPipe, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Validaciones Personalizadas (Custom)</h2>

    <div>
      <input [field]="form().username" id="user-id" placeholder="Usuario"/>
      @if (form().username.invalid() && form().username.touched()) {
        <div style="color: red;">
          @for (error of form().username.errors(); track $index) {
            <small>{{ error.message }}</small><br>
          }
        </div>
      }
    </div>

    <div>
      <input [field]="form().email" id="user-username" placeholder="Email"/>
    </div>

    <button (click)="save()" [disabled]="form().invalid()">Enviar</button>
    <button (click)="resetForm()">Reiniciar</button>

    <hr>
    <h3>Errores Actuales:</h3>
    <pre>{{ form().errors() | json }}</pre>
  `
})
export class SignalFormCustomValidationComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user, path => {
    required(path.username, { message: 'Requerido' });
    minLength(path.username, 3, { message: 'Mínimo 3' });
    
    required(path.email);
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

    /**
     * ✅ validate(): Permite añadir lógica de validación personalizada sincrónica.
     * Recibe el campo y debe devolver un objeto de error o null.
     */
    validate(path.username, (field) => {
      const nombresProhibidos = ['admin', 'root', 'superusuario'];

      if (!nombresProhibidos.includes(field.value().toLowerCase())) {
        return null;
      }

      /**
       * ✅ customError(): Utilidad para generar un objeto de error estandarizado.
       */
      return customError({
        kind: 'nombreProhibido',
        message: 'Este nombre de usuario está reservado y no se puede usar',
      });
    });
  });

  save(): void {
    console.log('Formulario enviado:', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }
}
