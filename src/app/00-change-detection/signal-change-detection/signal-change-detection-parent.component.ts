import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { SignalChildComponent } from "./signal-change-detection-child.component";

@Component({
  selector: 'app-parent-signal',
  standalone: true,
  imports: [SignalChildComponent],
  template: `
    <button (click)="changeUser()">Cambiar usuario</button>
    <!-- Pasamos el valor del signal al componente hijo.
         Angular rastrea que el hijo depende de este signal. -->
    <app-child-signal [user]="userSignal()"></app-child-signal>
  `,
  // Usamos OnPush también en el padre para máxima eficiencia.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalParentComponent {
  /**
   * Signal que contiene el objeto usuario.
   */
  userSignal = signal({ name: 'Carlos' });

  /**
   * Al usar .set(), notificamos a todos los consumidores (incluyendo la plantilla
   * y el componente hijo) que el valor ha cambiado.
   */
  changeUser() {
    this.userSignal.set({ name: 'Nombre ' + Math.random().toFixed(2) });
  }
}