import { Component } from "@angular/core";
import { DefaultChangeDetectionComponent } from "./default-change-detection-child.component";

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [DefaultChangeDetectionComponent],
  template: `
    <!-- Al hacer clic, se dispara un ciclo de detección de cambios en Angular -->
    <button (click)="changeSomething()">Cambiar algo (sin efecto en la entrada)</button>
    <app-child [user]="user"></app-child>
  `
})
export class ParentComponent {
  /**
   * Objeto plano (no es un signal).
   */
  user = { name: 'Carlos' };

  /**
   * Este método maneja el clic del botón. 
   * En Angular (sin OnPush o Signals), CUALQUIER evento de usuario activa 
   * la detección de cambios en todo el árbol de componentes.
   */
  changeSomething() {
    console.log('Botón clickeado en ParentComponent');
    // Realizamos un cambio que no afecta a la propiedad 'user'.
    // Aun así, verás que el componente hijo se revisa (ngDoCheck se dispara).
    const x = Math.random();
  }
}
