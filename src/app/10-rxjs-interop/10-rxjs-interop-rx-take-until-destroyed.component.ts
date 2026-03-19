import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { interval, tap } from 'rxjs';

@Component({
  selector: 'app-take-until-destroyed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  template: `
    <h2>RxJS Interop: takeUntilDestroyed</h2>
    <p>Contador (vía Pipe Async) = {{ counter | async }}</p>
    <p><small>Mira la consola para ver cómo se detiene al destruir el componente.</small></p>
  `
})
export class TakeUntilDestroyedComponent {
  /**
   * Un Observable que emite valores cada 500ms.
   */
  private ticker$ = interval(500).pipe(
    tap(v => console.log('Tick del Observable:', v))
  );

  /**
   * ✅ takeUntilDestroyed(): Operador que completa automáticamente el Observable
   * cuando el contexto de inyección (el componente) se destruye.
   * Evita fugas de memoria sin necesidad de ngOnDestroy ni Subscription.unsubscribe().
   */
  readonly counter = this.ticker$.pipe(takeUntilDestroyed());
}
