import { Component, resource, signal, ChangeDetectionStrategy } from "@angular/core";
import { Field, customError, form, maxLength, pattern, validateAsync, minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-signal-form-custom-async-validation',
  standalone: true,
  imports: [JsonPipe, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Validaciones Asíncronas (Async)</h2>

    <div>
      <label for="user-id">Usuario:</label>
      <input [field]="form().username" id="user-id" placeholder="Nombre de usuario"/>
      
      @if (form().username.pending()) {
         <div><small style="color: blue;">⏳ Validando disponibilidad...</small></div>
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
    <pre>Estado del campo: {{ form().username.status() }}</pre>
    <pre>Errores: {{ form().username.errors() | json }}</pre>
  `
})
export class SignalFormCustomAsyncValidationComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user, path => {
    required(path.username, { message: 'El usuario es obligatorio' });
    minLength(path.username, 3, { message: 'Mínimo 3 letras' });

    /**
     * ✅ validateAsync(): Permite validaciones que dependen de procesos asíncronos.
     * Utiliza la API de Resources internamente para manejar el ciclo de vida.
     */
    validateAsync(path.username, {
      /**
       * Parámetros que reactivan la validación.
       */
      params: (ctx) => ({
        value: ctx.value(),
        category: ctx.value().length < 5 ? 'short' : 'long' as 'long' | 'short',
      }),
      /**
       * El cargador asíncrono (usa resource).
       */
      factory: (params) => resource({
        params,
        loader: ({ params }) => this.getBannedListApi(params.category),
      }),
      /**
       * Manejo de errores de red o del proceso.
       */
      onError: () => customError({ kind: 'asyncError', message: 'No se pudo completar la validación' }),
      /**
       * Lógica para determinar si el resultado asíncrono implica un error de validación.
       */
      onSuccess: (bannedList, ctx) => {
        if (!bannedList.includes(ctx.value())) {
          return null; // Válido
        }

        return customError({
          kind: 'usernamesForbidden',
          message: `"${ctx.value()}" está en la lista negra (${bannedList.join(', ')})`
        });
      }
    });
  });

  /**
   * Simulación de una API que devuelve una lista de nombres prohibidos.
   */
  getBannedListApi(category: 'short' | 'long'): Promise<string[]> {
    console.log(`API: Cargando lista '${category}'...`);
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
    console.log('Formulario enviado:', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }
}
