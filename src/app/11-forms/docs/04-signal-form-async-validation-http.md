# Signal Forms: Validación Asíncrona con `validateHttp`

> **⚠️ ADVERTENCIA: API EXPERIMENTAL**
>
> La API de Signal Forms (`@angular/forms/signals`) es **experimental** a partir de Angular 21.2.5. La API es inestable y **no debe usarse en producción**.

Signal Forms proporciona una potente función de ayuda, **`validateHttp`**, para manejar escenarios comunes de validación asíncrona, como comprobar si un valor es válido realizando una petición HTTP `GET` (por ejemplo, "¿está este nombre de usuario ya en uso?"). Este ayudante gestiona el `HttpClient`, el debounce (tiempo de espera) y el estado `pending` (pendiente) por ti.

## 1. Función y Propiedades Clave

### `validateHttp(path, options)`

Llama a esta función dentro del callback de validación de `form()`, al igual que los validadores síncronos.

- **`path`**: La ruta al control que quieres validar (por ejemplo, `path.username`).
- **`options`**: Un objeto para configurar la petición HTTP y el manejo de la respuesta.

#### El Objeto `options`

- **`request: ({ value }) => string | undefined`**
  - Recibe el contexto del control, incluyendo su `value` como un `Signal`.
  - Se ejecuta cada vez que cambia el valor (después de un debounce predeterminado).
  - Devuelve la **cadena URL** a llamar, o `undefined` para omitir la validación (por ejemplo, para campos vacíos).

- **`onSuccess: (response: any) => ValidationErrors | null`**
  - Se llama si la petición HTTP tiene **éxito** (por ejemplo, HTTP 200).
  - Devuelve `null` o `[]` si el valor es **válido**.
  - Devuelve un error (o conjunto de errores), típicamente usando `customError`, si el valor es **inválido**.

- **`onError: (error: HttpErrorResponse) => ValidationErrors`**
  - Se llama si la petición HTTP **falla** (por ejemplo, HTTP 404, 500 o un error de red).
  - Devuelve un array de errores, generalmente para indicar un problema de red.

## 2. El Estado `pending`

`validateHttp` gestiona automáticamente el estado **`pending`** del control.

- `form().username().pending()`: Devuelve `true` mientras la petición HTTP está en curso.
- Útil para mostrar indicadores de carga o deshabilitar el botón de envío.

## 3. Ejemplo de Configuración del Componente

En este ejemplo, `validateHttp` se asocia a `path.username`. Realiza una consulta a la API pública de `jsonplaceholder`. Si el callback `onSuccess` recibe un array no vacío (lo que significa que se encontró un usuario con ese nombre), devuelve un `customError`.

```typescript
import { Component, signal } from "@angular/core";
import { 
  Field, 
  customError, 
  form, 
  maxLength, 
  pattern, 
  validateHttp
} from '@angular/forms/signals';
import { minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'signal-form-async',
  standalone: true,
  imports: [JsonPipe, Field, HttpClientModule],
  templateUrl: './signal-form-async.component.html'
})
export class SignalFormCustomAsyncValidationHttpComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user, path => {
    required(path.username, { message: 'El nombre de usuario es obligatorio' });
    minLength(path.username, 3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' });
    required(path.email);
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

    validateHttp(path.username, {
      request: ({ value }) =>
        value() ? `https://jsonplaceholder.typicode.com/users?username=${value()}` : undefined,
      onSuccess: (result: any[]) =>
        result && result.length
          ? [customError({ kind: 'usernameNotAvailable', message: 'El nombre de usuario ya está en uso' })]
          : [],
      onError: (res: any) =>
        [customError({ kind: 'NetworkError', message: 'Error de red' })]
    });
  });

  save(): void {
    console.log('Formulario enviado', this.form().value());
  }

  resetForm(){
    this.form().reset();
  }
}
```

## 4. Ejemplo de Plantilla

La plantilla utiliza `form().username` para las vinculaciones y el acceso al estado, ya que `form` es un `Signal<SignalFormGroup>`.

```html
<input [field]="form().username" id="user-id" placeholder="nombre de usuario"/>
<input [field]="form().email" id="user-username" placeholder="correo electrónico"/>

<button (click)="save()" [disabled]="form().invalid() || form().pending()">
  ENVIAR
</button>

<hr>
@if (form().username().pending()) {
   <small>Comprobando disponibilidad para {{ form().username().value() }}...</small>
}

<pre>Valor del Formulario: {{form().value() | json}}</pre>
<button (click)="resetForm()">Restablecer Formulario</button>

@if(form().invalid()){
  <h2> Errores </h2>
  <pre style="color:red">username: {{ form().username().errors() | json }}</pre>
  <pre style="color:red">email: {{ form().email().errors() | json }}</pre>

  <h2> Mensajes de error individuales para username </h2>
  @let usernameErrors = form().username().errors();

  @for (error of usernameErrors; track $index) {
    <li>{{error.message}}</li>
  }
}
```
