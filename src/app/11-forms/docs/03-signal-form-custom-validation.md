# Signal Forms: Validadores Síncronos Personalizados

> **⚠️ ADVERTENCIA: API EXPERIMENTAL**  
> La API de Signal Forms (`@angular/forms/signals`) es **experimental** a partir de Angular 21.2.5. La API es inestable y **no debe usarse en producción**.

Aunque los validadores integrados (`required`, `minLength`, etc.) cubren los casos comunes, a menudo necesitarás implementar tu propia lógica de negocio (por ejemplo, "el nombre de usuario no puede ser 'admin'").

Signal Forms proporciona la función **`validate`** para la lógica síncrona personalizada y el ayudante (helper) **`customError`** para crear un objeto de error estandarizado.

---

## 1. Explicación de las Funciones Clave

### `validate(path, validationFn)`

Añade una regla de validación personalizada.

- **`path`**: La ruta al control que quieres validar (por ejemplo, `path.username`).
- **`validationFn`**: Una función de retorno (callback) con tu lógica personalizada. Recibe el contexto del control como argumento.

#### El Callback de Validación: `(childField) => ...`

- **`childField`**: El `ChildFieldContext` (no es el signal en sí). Proporciona acceso a las propiedades y al valor del control.
- **`childField.value()`**: Obtiene el valor actual del control.
- **Valor de Retorno**:
  - Devuelve **`null`** si el control es **válido**.
  - Devuelve un **objeto `ValidationErrors`** si el control es **inválido**.

### `customError(options)`

Ayudante para crear un objeto `ValidationErrors`.

- **`options`**: Un objeto con:
  - **`kind`**: Una clave de cadena legible por máquina para el error (por ejemplo, `usernamesForbidden`).
  - **`message`**: Un mensaje legible por humanos para mostrar en la interfaz.

---

## 2. Configuración del Componente (Aplicando Validación Personalizada)

Añade la función `validate` dentro del callback de `form()`, junto con los validadores integrados.

```typescript
import { Component, signal } from "@angular/core";
import { 
  Field, 
  customError, // Importar customError
  form, 
  maxLength, 
  pattern, 
  validate, // Importar validate
  minLength, 
  required 
} from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form-custom',
  standalone: true,
  imports: [JsonPipe, Field],
  templateUrl: './signal-form-custom.component.html'
})
export class SignalFormCustomValidationComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user, path => {
    required(path.username, { message: 'El nombre de usuario es obligatorio' });
    minLength(path.username, 3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' });
    maxLength(path.username, 10, { message: 'El nombre de usuario debe tener como máximo 10 caracteres' });
    required(path.email);
    pattern(path.email, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

    // Validador Personalizado
    validate(path.username, (childField) => {
      const reservedUsernames = ['admin', 'administrator', 'root'];
      const currentValue = childField.value();
      if (!reservedUsernames.includes(currentValue)) {
        return null; 
      }
      return customError({
        kind: 'usernamesForbidden',
        message: 'El nombre de usuario no puede ser un nombre reservado',
      });
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

---

## 3. Plantilla (Mostrando Errores Personalizados)

La plantilla funciona igual que con los validadores integrados. El signal `errors()` incluirá tu objeto de error personalizado si la validación falla.

```html
<input [field]="form().username" id="user-id" placeholder="nombre de usuario"/>
<input [field]="form().email" id="user-username" placeholder="correo electrónico"/>
<button (click)="save()" [disabled]="form().invalid()">ENVIAR</button>

<pre>Valor del Formulario: {{form().value() | json}}</pre>

<button (click)="resetForm()">Restablecer Formulario</button>

@if(form().invalid()){
  <h2>Errores</h2>
  <pre style="color:red">username: {{ form().username().errors() | json }}</pre>

  <h2>Mensajes de error individuales para username</h2>
  @let usernameErrors = form().username().errors();

  @for (error of usernameErrors; track $index) {
    <li>{{error.message}}</li>
  }
}
```
