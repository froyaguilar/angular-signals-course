import { ChangeDetectionStrategy, Component, WritableSignal, effect, signal } from '@angular/core';

@Component({
  selector: 'app-counter-effect',
  standalone: true,
  template: `
    <h1>Contador: {{ count() }}</h1>
    <button (click)="increment()">Incrementar</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterEffectComponent {
  /**
   * Signal de escritura para llevar la cuenta.
   */
  readonly count: WritableSignal<number> = signal(0);

  /**
   * Un efecto (effect) es una operación que se ejecuta cada vez que 
   * cambian los signals que consume.
   * Se usa para efectos secundarios (side-effects) como:
   * - Sincronizar con el almacenamiento local (localStorage).
   * - Manipulación manual del DOM o APIs del navegador (ej. cambiar el título).
   * - Logging o telemetría.
   */
  private readonly logAndTitleEffect = effect(() => {
    const current = this.count();
    
    // Efecto secundario #1: Registro en consola
    console.log(`🟢 [Efecto] El contador cambió a ${current}`);
    
    // Efecto secundario #2: Actualizar el título de la página
    if (typeof document !== 'undefined') {
      document.title = `Contador: ${current}`;
    }
  });

  increment() {
    /**
     * Al actualizar el signal, Angular programa la ejecución del efecto
     * para que corra después de la detección de cambios.
     */
    this.count.update(currentValue => currentValue + 1);
  }
}
