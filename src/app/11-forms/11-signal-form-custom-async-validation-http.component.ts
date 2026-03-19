import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { Field, customError, form, maxLength, pattern, validateHttp, minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-signal-form-custom-async-validation-http',
  standalone: true,
  imports: [JsonPipe, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Validaciones HTTP (validateHttp)</h2>

    <div>
      <input [field]="form().username" id="user-id" placeholder="Nombre de usuario"/>
      
      @if (form().username.pending()) {
         <small style="color: blue;">🔍 Comprobando disponibilidad en servidor...</small>
      }

      @if (form().username.invalid() && form().username.touched()) {
        <div style="color: red;">
          @for (error of form().username.errors(); track $index) {
            <small>{{ error.message }}</small><br>
          }
        </div>
      }
    </div>

    <button (click)="save()" [disabled]="form().invalid() || form().pending()">Enviar</button>

    <hr>
    <h3>Respuesta del Servidor:</h3>
    <pre>{{ form().username.errors() | json }}</pre>
  `
})
export class SignalFormCustomAsyncValidationHttpComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user, path => {
    required(path.username, { message: 'Obligatorio' });

    /**
     * ✅ validateHttp(): Especializado en validaciones que requieren una petición HTTP GET.
     * Simplifica el uso de validateAsync cuando solo necesitamos consultar un endpoint.
     */
    validateHttp(path.username, {
      /**
       * Define la URL de la petición. Si devuelve undefined, la petición no se realiza.
       */
      request: ({ value }) => value() 
        ? `https://jsonplaceholder.typicode.com/users?username=${value()}` 
        : undefined,
      
      /**
       * Procesa la respuesta exitosa para determinar si hay errores de validación.
       */
      onSuccess: (result: any[]) => result && result.length
          ? [customError({ kind: 'usuarioNoDisponible', message: 'Este nombre de usuario ya está en uso' })]
          : [],
      
      /**
       * Procesa errores de red.
       */
      onError: () => [customError({ kind: 'errorRed', message: 'Error de conexión con el servidor' })],
    });
  });

  save(): void {
    console.log('Enviando:', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }
}
