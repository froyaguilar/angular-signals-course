import { Component, model } from '@angular/core';

@Component({
  selector: 'app-signals-two-way',
  standalone: true,
  imports: [], // Ya no necesitamos FormsModule para el doble enlace básico si usamos model()
  template: `
    <input
      [value]="name()"
      (input)="onInput($event)"
      placeholder="Introduce tu nombre"
    />
    <p>Hola, {{ name() }}</p>
  `,
})
export class SignalsTwoWayComponent {
  /**
   * ✅ model(): Crea un signal que soporta doble enlace de datos (two-way binding).
   * Es tanto una entrada (input) como una salida (output).
   * El nombre del output generado automáticamente es 'nameChange'.
   */
  name = model('');

  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      /**
       * Al actualizar el signal con .set(), notificamos al padre 
       * automáticamente a través del evento 'nameChange'.
       */
      this.name.set(input.value);
    }
  }
}
