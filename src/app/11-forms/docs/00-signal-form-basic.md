# Signal Forms: Uso Básico (Sincronización Bidireccional de Datos)
> **⚠️ ADVERTENCIA: API EXPERIMENTAL**
>
> La API de Signal Forms (`@angular/forms/signals`) es **experimental** a partir de Angular 21.2.5. La API es inestable y **no debe usarse en producción**. Está destinada únicamente a fines de evaluación y retroalimentación.

Esta guía cubre el caso de uso más básico de Signal Forms: la creación de un formulario que se sincroniza directamente con un `signal` existente en tu componente.

## Concepto Clave: `form(signal)`

La función `form()` se puede inicializar pasando un `signal` existente que contenga tu modelo de datos.

Al hacer esto, Angular crea una **sincronización bidireccional** entre el estado del formulario y tu señal original:

- Los cambios en la señal original actualizarán el formulario.
- Los cambios en el formulario (por ejemplo, la entrada del usuario) actualizarán la señal original.

---

## 1. Configuración del Componente

Primero, define tus datos como un `signal`. Luego, crea el formulario pasando esa señal a la función `form()`.

```typescript
import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  standalone: true,
  imports: [JsonPipe, Field], // 'Field' es necesario para la vinculación [field]
})
export class SignalFormBasicComponent {
  // 1. Esta es tu señal de datos "fuente de verdad"
  user = signal({
    username: '',
    email: '',
  });

  // 2. Crea el formulario vinculándolo a la señal 'user'
  // Esto establece la sincronización bidireccional (two-way sync).
  form = form(this.user);
}
```

## 2. Vinculación en la Plantilla con `[field]`

En la plantilla, importa la directiva `Field` para usar la vinculación `[field]`. Puedes acceder a los controles del formulario directamente como propiedades de la variable del formulario (por ejemplo, `form.username`):

```html
<input [field]="form.username" id="user-id" placeholder="username"/>
<input [field]="form.email" id="user-username" placeholder="email"/>

<pre>Valor del Formulario: {{ form().value() | json }}</pre>
<pre>Señal de Datos: {{ user() | json }}</pre>
```

## 3. Sincronización Bidireccional en Acción

El ejemplo demuestra la sincronización bidireccional con dos métodos de actualización:

### Camino 1: Actualizar la Señal del Formulario

Este método actualiza directamente la señal del valor interno del formulario. Debido a que el formulario está vinculado a `this.user`, la señal del usuario también se actualiza automáticamente.

```typescript
updateUsingForm() {
  // Esto actualiza el formulario, lo que a su vez activa la actualización de 'this.user'
  this.form().value.set({ username: 'Alvaro', email: 'alvaro@dottech.io' });
}
```

### Camino 2: Actualizar la Señal de Origen

Este método actualiza la señal `user` original. Debido a que el formulario está vinculado a ella, el formulario también se actualiza automáticamente y los cambios aparecen en los campos de entrada.

```typescript
updateUsingSignal() {
  // Esto actualiza 'this.user', lo que a su vez actualiza el formulario
  this.user.set({ username: 'Carlos', email: 'carlos@dottech.io' });
}
```

La entrada del usuario (teclear en la caja) funciona igual que el Camino 1: actualiza la señal del formulario, que luego sincroniza ese cambio de vuelta a la señal original del usuario.

---

## Ejemplo de Código Completo

Este es el componente funcional completo:

```typescript
import { Component, signal } from "@angular/core";
import { Field, form } from '@angular/forms/signals';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'signal-form',
  standalone: true,
  imports: [JsonPipe, Field],
  template: `
    <form (ngSubmit)="save()">
      <input [field]="form.username" id="user-id" placeholder="nombre de usuario"/>
      <input [field]="form.email" id="user-username" placeholder="correo electrónico"/>
      <button type="submit">ENVIAR</button>
    </form>

    <hr>
    <pre>Valor del Formulario: {{ form().value() | json }}</pre>
    <pre>Señal de Datos: {{ user() | json }}</pre>

    <button (click)="updateUsingSignal()" type="button">Actualizar usando señal</button>
    <button (click)="updateUsingForm()" type="button">Actualizar usando formulario</button>
  `
})
export class SignalFormBasicComponent {
  user = signal({
    username: '',
    email: '',
  });

  form = form(this.user);

  save(): void {
    console.log('Formulario enviado', this.form().value());
  }

  updateUsingSignal() {
    this.user.set({ username: 'Carlos', email: 'carlos@dottech.io' });
  }

  updateUsingForm() {
    this.form().value.set({ username: 'Alvaro', email: 'alvaro@dottech.io' });
  }
}
```
