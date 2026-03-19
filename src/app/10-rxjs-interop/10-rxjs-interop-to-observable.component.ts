import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-signal-to-observable',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>RxJS Interop: de Signal a Observable</h2>
    
    <!-- Usamos el pipe async para suscribirnos al Observable en el template -->
    @let valorAsync = value$ | async;
    
    <p>Valor (vía Observable) = {{ valorAsync }}</p>
    
    <button (click)="incrementar()">Incrementar Signal</button>
  `
})
export class SignalToRxJSComponent {
  /**
   * Un signal reactivo básico.
   */
  readonly value = signal(0);

  /**
   * ✅ toObservable(): Convierte un Signal en un Observable de RxJS.
   * Útil cuando necesitas integrar signals con librerías o APIs basadas en RxJS
   * (como algunos operadores complejos de filtrado o debounce).
   */
  readonly value$ = toObservable(this.value);

  incrementar() {
    this.value.set(this.value() + 1);
  }
}
