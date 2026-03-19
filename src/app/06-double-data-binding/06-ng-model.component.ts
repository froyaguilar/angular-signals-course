import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classic-two-way',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Doble enlace clásico con [(ngModel)]</h2>
    <!-- Requiere FormsModule y la directiva ngModel -->
    <input [(ngModel)]="name" placeholder="Introduce tu nombre">
    <p>Hola, {{ name }}!</p>
  `
})
export class ClassicTwoWayComponent {
  /**
   * Propiedad normal vinculada a través de ngModel.
   * No es tan eficiente como los Signals para actualizaciones granulares.
   */
  name: string = '';
}
