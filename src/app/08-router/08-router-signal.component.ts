import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signals',
  standalone: true,
  template: `
    <h2>Router con Signals</h2>
    <p>ID de Usuario = {{ id() }}</p>
    <button (click)="goNext()">Ir al siguiente</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSignalsComponent {
  /**
   * ✅ Parámetro de ruta 'id' vinculado como un signal.
   * Requiere 'withComponentInputBinding()' en la configuración del router.
   * Usamos transform: numberAttribute para asegurar que sea un número.
   */
  readonly id = input(0, { transform: numberAttribute });

  private router = inject(Router);

  goNext() {
    /**
     * Navegamos al siguiente ID. El input signal 'id' se actualizará automáticamente.
     */
    const nextId = (this.id() ?? 0) + 1;
    this.router.navigateByUrl(`/router-signal/user/${nextId}`);
  }
}


