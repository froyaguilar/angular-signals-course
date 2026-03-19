import { Component } from "@angular/core";
import { DefaultChangeDetectionComponent } from "./default-change-detection-child.component";

@Component({
  selector: 'app-parent-direct',
  standalone: true,
  imports: [DefaultChangeDetectionComponent],
  template: `
    <!-- La mutación de un objeto no cambia su referencia, pero con CD Default no importa -->
    <button (click)="mutateUser()">Mutar user.name</button>
    <app-child [user]="user"></app-child>
  `
})
export class ParentDirectComponent {
  /**
   * Objeto plano.
   */
  user = { name: 'Carlos' };

  /**
   * Modificamos una propiedad interna del objeto.
   * La referencia del objeto 'user' sigue siendo la misma.
   * En la estrategia Default, el componente hijo detectará el cambio y se actualizará.
   */
  mutateUser() {
    this.user.name = 'Carlos Actualizado';
    console.log('Mutación de user.name realizada');
  }
}