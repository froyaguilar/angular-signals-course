import { OnPushChildComponent } from "./onpush-change-detection-child.component";
import { Component } from "@angular/core";

@Component({
  selector: 'app-parent-onpush',
  standalone: true,
  imports: [OnPushChildComponent],
  template: `
    <button (click)="mutateUser()">Mutar user.name (No actualiza la vista con OnPush)</button>
    <button (click)="replaceUser()">Reemplazar objeto user (Actualiza la vista con OnPush)</button>
    <app-child-onpush [user]="user"></app-child-onpush>
  `
})
export class OnPushParentComponent {
  /**
   * Objeto plano.
   */
  user = { name: 'Carlos' };

  /**
   * Modificamos una propiedad interna. 
   * Como la referencia del objeto 'user' es la misma, el componente hijo OnPush
   * NO se enterará del cambio y la vista no se actualizará.
   */
  mutateUser() {
    this.user.name = 'Carlos Mutado';
    console.log('Usuario mutado (referencia idéntica)');
  }

  /**
   * Creamos un NUEVO objeto (nueva referencia).
   * Al cambiar la referencia del input, el componente hijo OnPush
   * detecta que debe volver a renderizarse.
   */
  replaceUser() {
    this.user = { name: 'Carlos Reemplazado' };
    console.log('Objeto usuario reemplazado (nueva referencia)');
  }
}