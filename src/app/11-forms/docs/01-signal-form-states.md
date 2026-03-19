# Signal Forms: Entendiendo los Estados del Formulario

> **⚠️ ADVERTENCIA: API EXPERIMENTAL**
>
> La API de Signal Forms (`@angular/forms/signals`) es **experimental** a partir de Angular 21.2.5. La API es inestable y **no debe usarse en producción**.

Signal Forms no solo rastrean el `value` (valor), sino también el *state* (estado) de la interacción del usuario. Esto es crucial para escenarios como mostrar mensajes de error solo después de que se ha "tocado" un campo (touched) o para habilitar/deshabilitar el botón de "Enviar" basado en la validez del formulario.

Todos estos estados son **signals**, por lo que tu plantilla puede reaccionar a ellos instantáneamente.

## Estados de Interacción Principales

- **`dirty`**: Un `Signal<boolean>`.
  - Es `true` si el usuario ha **cambiado el valor** en el campo.
  - Estado relacionado: **`pristine`** (el valor no ha cambiado).
  - **¿Cómo cambia?**: El estado pasa de `pristine` a `dirty` cuando el usuario modifica el valor del campo por primera vez.

- **`touched`**: Un `Signal<boolean>`.
  - Es `true` si el usuario ha puesto el foco en el campo y luego lo ha abandonado (evento "blur").
  - Estado relacionado: **`untouched`**.
  - **¿Cómo cambia?**: El estado pasa de `untouched` a `touched` cuando el usuario entra y sale del campo (por ejemplo, haciendo clic dentro y luego fuera).

> Nota: Estos estados no son estrictamente opuestos; representan diferentes aspectos del ciclo de vida de un control de formulario. Un control puede estar a la vez pristine y untouched, o dirty y touched, dependiendo de la interacción del usuario.

## Estados de Validación Principales

- **`invalid`**: Un `Signal<boolean>`.
  - Es `true` si el formulario o un control no cumple con alguna de sus reglas de validación.
  - Nota: El estado opuesto no es simplemente `valid`. Un control puede no ser ni `invalid` ni `valid` si aún no ha sido validado (por ejemplo, si está en estado `pending`).
- **`pending`**: Un `Signal<boolean>`.
  - Es `true` si un validador asíncrono (como `validateHttp` o `validateAsync`) se está ejecutando actualmente.

## Accediendo a los Estados en la Plantilla

Puedes comprobar el estado en dos niveles: el **formulario completo** o un **control individual**.

### 1. Estado a Nivel de Formulario

Cuando creas un formulario con `form = form(this.user)`, la variable `form` es un `SignalFormGroup`. Sus señales de estado (como `invalid` o `dirty`) reflejan el estado combinado de todos sus hijos.

- `form.invalid()`: ¿Es *todo el formulario* inválido? (Devuelve `true` si *cualquier* control hijo es inválido).
- `form.dirty()`: ¿Ha cambiado *algún* valor en el formulario?
- `form.touched()`: ¿El usuario ha *tocado* algún control en el formulario?

Esto se utiliza comúnmente para deshabilitar el botón de envío:

```html
<button [disabled]="form.invalid()">ENVIAR</button>
```

### 2. Estado a Nivel de Control

Accedes a un control individual como una propiedad del objeto del formulario. Ese control tiene su propio conjunto de señales de estado.

- `form.username.invalid()`: ¿Es inválido solo el nombre de usuario (username)?
- `form.username.dirty()`: ¿Ha cambiado solo el nombre de usuario?
- `form.username.touched()`: ¿Ha tocado el usuario el campo del nombre de usuario?

Esto es útil para mostrar errores en el momento adecuado (por ejemplo, mostrar solo si se ha tocado y es inválido).

## Restablecer el Estado

Puedes restablecer el valor del formulario y todos sus estados de interacción a su estado original (pristine, untouched) llamando al método `reset()`:

```typescript
resetForm() {
  this.form.reset();
}
```

## Ejemplo de Componente

Aquí tienes un ejemplo funcional de un componente utilizando Signal Forms:

```typescript
import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  standalone: true,
  imports: [JsonPipe, Field],
  template: `
    <input [field]="form.username" id="user-id" placeholder="nombre de usuario"/>
    <input [field]="form.email" id="user-username" placeholder="correo electrónico"/>
    
    <button (click)="save()" [disabled]="form.invalid()">ENVIAR</button>

    <hr>
      <pre>Formulario Dirty (sucio): {{ form.dirty() | json }}</pre>
      <pre>Formulario Touched (tocado): {{ form.touched() | json }}</pre>
    <hr>

    <hr>
      <pre>username Dirty: {{ form.username.dirty() | json }}</pre>
      <pre>username Touched: {{ form.username.touched() | json }}</pre>
    <hr>
      <pre>email Dirty: {{ form.email.dirty() | json }}</pre>
      <pre>email Touched: {{ form.email.touched() | json }}</pre>

    <pre>Valor del Formulario: {{ form.value() | json }}</pre>

    <button (click)="resetForm()">Restablecer Formulario</button>
  `
})
export class SignalFormStatesComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user);

  save(): void {
    console.log('Formulario enviado', this.form.value());
  }

  resetForm() {
    this.form.reset();
  }
}
```
