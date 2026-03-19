import { Component, ChangeDetectionStrategy } from '@angular/core';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ticker-to-signal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>RxJS Interop: de Observable a Signal</h2>
    <p>Contador (Signal) = {{ counter() }}</p>
    <p><small>Este valor proviene de un Observable (interval) convertido a Signal.</small></p>
  `
})
export class TickerSignalsComponent {
  /**
   * Un Observable de RxJS que emite un número cada segundo.
   */
  private counter$ = interval(1000);

  /**
   * ✅ toSignal(): Convierte un Observable en un Signal de solo lectura.
   * Se suscribe automáticamente y se cancela cuando el componente se destruye.
   * Proporcionamos initialValue para que el signal siempre tenga un valor definido.
   */
  readonly counter = toSignal(this.counter$, { initialValue: 0 });
}
