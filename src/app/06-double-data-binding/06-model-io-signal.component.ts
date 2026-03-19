import {
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-child-model',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="child-box">
      <p>Contador del Hijo = {{ count() }}</p>
      <button (click)="increment()">Incrementar desde el Hijo</button>
    </div>
  `,
  styles: `
      .child-box {
        border: 1px solid #007bff;
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
      }
    `,
})
export class ChildComponent {
  /**
   * ✅ model(): Reemplaza a 'input' y 'output' con un solo signal.
   * Crea automáticamente un input 'count' y un output 'countChange'.
   * 'model.required' indica que el padre DEBE proporcionar un valor.
   */
  readonly count = model.required<number>();

  constructor() {
    /**
     * El efecto funciona igual, ya que 'count' es un Signal al fin y al cabo.
     */
    effect(() => {
      console.log('🔄 [Efecto] El contador del hijo cambió a', this.count());
    });
  }

  increment() {
    /**
     * ✅ En lugar de emitir un evento manualmente, el hijo actualiza el 'model' directamente.
     * Este cambio se propaga automáticamente al padre si se usa doble enlace [(count)].
     */
    this.count.update((v) => v + 1);
  }
}

@Component({
  selector: 'app-parent-model-io',
  standalone: true,
  imports: [ChildComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="parent-box">
      <h2>Padre usando model() para Doble Enlace</h2>
      <button (click)="incrementCount()">+1 desde el Padre</button>

      <!-- Usamos la sintaxis "banana-in-a-box" [(...)] para el doble enlace automático -->
      <app-child-model [(count)]="count"></app-child-model>

      <p class="parent-count">El padre ve el contador = {{ count() }}</p>
    </div>
  `,
  styles: `
      .parent-box {
        border: 2px solid #333;
        padding: 1.5rem;
        border-radius: 8px;
        font-family: sans-serif;
      }
      .parent-count {
        margin-top: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
      }
      button {
        margin: 0.25rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
      }
    `,
})
export class ModelIOSignalComponent {
  /**
   * El signal del padre sigue siendo la fuente de la verdad.
   */
  count = signal(0);

  incrementCount() {
    this.count.update((v) => v + 1);
  }

  // ✅ Ya no necesitamos un método 'onIncrement()' para escuchar eventos del hijo.
  // El doble enlace se encarga de todo.
}
