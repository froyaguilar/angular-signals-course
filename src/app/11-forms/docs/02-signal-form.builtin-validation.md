# Signal Forms: Validadores Síncronos Integrados

> **⚠️ ADVERTENCIA: API EXPERIMENTAL**
>
> La API de Signal Forms (`@angular/forms/signals`) es **experimental** a partir de Angular 21.2.5. La API es inestable y **no debe usarse en producción**.

Signal Forms incluye un conjunto de validadores integrados comunes que puedes aplicar directamente al definir tu formulario.

Cuando utilizas la sintaxis `form(signal, callback)`, aplicas los validadores llamándolos dentro de la función de retorno (callback). Estas funciones reciben un objeto `path` (ruta) al control como su primer argumento.

## 1. Aplicación de Validadores en el Componente

En esta sintaxis, el segundo argumento de la función `form()` es un callback. Este callback recibe un objeto `path` que actúa como un "mapa" de los controles definidos en tu señal de datos.

Simplemente llamas a las funciones validadoras (como `required` o `minLength`) y les pasas la ruta del control (por ejemplo, `path.username`).

```typescript
// En tu componente.ts
import { Component, signal } from "@angular/core";
import { Field, form, maxLength, pattern, minLength, required } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form-validation',
  standalone: true,
  imports: [JsonPipe, Field],
  templateUrl: './signal-form-validation.component.html'
})
export class SignalFormBuiltinValidationComponent {

  user = signal({
    username: '',
    email: '',
  });

  // 1. La variable 'form' es un Signal<SignalFormGroup>
  form = form(this.user, path => {
    // 2. Aplica validadores al control 'username'
    required(path.username, { message: 'El nombre de usuario es obligatorio' });
    minLength(path.username, 3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' });
    maxLength(path.username, 10, { message: 'El nombre de usuario debe tener como máximo 10 caracteres' });
    
    // 3. Aplica validadores al control 'email'
    required(path.email);
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, { 
      message: 'Introduce un formato de correo electrónico válido' 
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

## 2. Lectura de Errores en la Plantilla

Para mostrar errores de validación, lees el estado de los controles individuales.

- Dado que `form` es un signal, accedes al grupo con `form()`.
- Accedes al control con `form().username`.
- Dado que el control también es un signal, lo invocas para obtener su estado: `form().username()`.
- Lees los errores con el signal `.errors()`.

**Ejemplo HTML:**

```html
<input [field]="form().username" id="user-id" placeholder="nombre de usuario"/>
<input [field]="form().email" id="user-username" placeholder="correo electrónico"/>

<button (click)="save()" [disabled]="form().invalid()">ENVIAR</button>

<pre>Valor del Formulario: {{form().value() | json}}</pre>

<button (click)="resetForm()">Restablecer Formulario</button>

@if(form().invalid()){
  <h2> Errores usando json </h2>
  <pre style="color:red">username: {{ form().username().errors() | json }}</pre>
  <pre style="color:red">email: {{ form().email().errors() | json }}</pre>

  <h2> Mensajes de error individuales para username </h2>
  @let usernameErrors = form().username().errors();

  @for (error of usernameErrors; track $index) {
    <li>{{error.message}}</li>
  }
}
```

## 3. Validadores Integrados Comunes

Todos los validadores síncronos aceptan un objeto opcional `ValidatorOptions` (por ejemplo, `{ message: '...' }`) como último argumento para proporcionar un mensaje de error personalizado.

- `required(path, options?)`  
  Comprueba que el valor del control no sea nulo, indefinido o una cadena vacía.

- `requiredTrue(path, options?)`  
  Comprueba que el valor del control sea estrictamente `true`. (Útil para casillas de "Acepto los términos").

- `minLength(path, length, options?)`  
  Comprueba que la longitud del valor de la cadena sea mayor o igual a `length`.

- `maxLength(path, length, options?)`  
  Comprueba que la longitud del valor de la cadena sea menor o igual a `length`.

- `email(path, options?)`  
  Comprueba que el valor de la cadena coincida con una expresión regular básica de formato de correo electrónico.

- `pattern(path, regex, options?)`  
  Comprueba que el valor de la cadena coincida con la RegExp (expresión regular) proporcionada.

- `min(path, minValue, options?)`  
  Comprueba que el valor numérico sea mayor o igual a `minValue`.

- `max(path, maxValue, options?)`  
  Comprueba que el valor numérico sea menor o igual a `maxValue`.