import { ChangeDetectionStrategy, Component, signal, viewChild, AfterViewInit } from '@angular/core';
import { outputFromObservable, outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-child-ticker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="border: 1px dashed orange; padding: 1rem;">
      <h3>Componente Hijo (Ticker)</h3>
      <p>Emitiendo tick cada 2 segundos...</p>
    </div>
  `
})
export class ChildTickerComponent {
  /**
   * ✅ outputFromObservable(): Crea un Output a partir de un Observable.
   * El padre puede suscribirse a este output usando la sintaxis normal (tick)="...".
   */
  readonly tick = outputFromObservable(interval(2000));
}

@Component({
  selector: 'app-tick-demo',
  standalone: true,
  imports: [CommonModule, ChildTickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="border: 2px solid #555; padding: 1.5rem; border-radius: 8px;">
      <h2>Demo Interop: RxJS ↔ Signals (Outputs)</h2>

      <!-- El hijo emite ticks. Podríamos capturarlos aquí con (tick)="actualizar($event)" -->
      <app-child-ticker></app-child-ticker>

      @if (parentTick() !== undefined) {
        <p style="font-weight: bold; color: green;">
          El Padre recibió el tick = {{ parentTick() }}
        </p>
      }
    </div>
  `
})
export class TickDemoComponent implements AfterViewInit {
  /**
   * ✅ viewChild.required(): Obtiene la instancia del hijo como un Signal.
   */
  private childCmp = viewChild.required(ChildTickerComponent);

  /**
   * Signal para guardar el valor recibido.
   */
  parentTick = signal<number | undefined>(undefined);

  ngAfterViewInit() {
    /**
     * ✅ outputToObservable(): Convierte un OutputRef (como 'tick') en un Observable.
     * ✅ takeUntilDestroyed(): Operador de interop que limpia la suscripción automáticamente
     * al destruir el componente.
     */
    outputToObservable(this.childCmp().tick)
      .pipe(takeUntilDestroyed())
      .subscribe(v => {
        console.log('Tick recibido en el padre:', v);
        this.parentTick.set(v);
      });
  }
}
