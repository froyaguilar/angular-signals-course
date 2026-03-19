import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-child-signals',
  standalone: true,
  template: `
    <p>Contador = {{ count() }}</p>
    <!-- Sin boilerplate: solo llama a .emit() en el OutputEmitterRef -->
    <button (click)="notify()">Notificar al Padre</button>
  `
})
export class ChildSignalsComponent {
  /**
   * ✅ input(): Crea un InputSignal que se actualiza automáticamente.
   * Es de solo lectura dentro del componente.
   */
  readonly count = input<number>(0);

  /**
   * ✅ output(): Alternativa ligera a EventEmitter.
   * Sigue el mismo patrón de nombres que los signals.
   */
  readonly increment = output<void>();

  constructor() {
    /**
     * ✅ Seguimiento de dependencias automático.
     * Ya no necesitamos ngOnChanges para reaccionar a cambios en los inputs.
     */
    effect(() => {
      console.log('🔄 [Efecto] El contador cambió a', this.count());
    });
  }

  notify() {
    /**
     * ✅ emit(): Funciona de forma similar al tradicional, pero más ligero.
     */
    this.increment.emit();
  }
}

@Component({
  selector: 'app-parent-signals',
  standalone: true,
  imports: [ChildSignalsComponent],
  // Con Signals, OnPush es el valor por defecto recomendado para el mejor rendimiento.
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Padre usando Signals (Forma moderna)</h2>
    <!-- Actualización reactiva del signal; la UI se marca para revisión automáticamente -->
    <button (click)="incrementCount()">+1 desde Padre</button>
    
    <!-- Pasamos el valor del signal. Angular rastrea la dependencia. -->
    <app-child-signals
      [count]="count()"
      (increment)="onIncrement()">
    </app-child-signals>
    <p>El padre ve el contador = {{ count() }}</p>
  `
})
export class ParentSignalsComponent {
  /**
   * ✅ signal(): Estado base de la aplicación.
   */
  count = signal(0);

  incrementCount() {
    this.count.update(v => v + 1);
  }

  onIncrement() {
    console.log('🔔 [Signal] El hijo solicitó un incremento');
    this.incrementCount();
  }
}
