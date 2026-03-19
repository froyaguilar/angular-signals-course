import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-counter-signal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="border: 2px solid #007bff; padding: 2rem; border-radius: 12px; max-width: 500px; margin: 2rem auto; font-family: 'Segoe UI', sans-serif;">
      <h2 style="color: #007bff; text-align: center;">Fundamentos de Signals</h2>
      
      <div style="background: #f9f9f9; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
        <p><strong>Variable normal:</strong> <span style="font-size: 1.5rem;">{{ count0 }}</span></p>
        <p><small style="color: #c00;">⚠️ No se actualiza automáticamente con OnPush si no incrementamos un Signal.</small></p>
      </div>

      <div style="background: #e7f3ff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
        <p><strong>WritableSignal (Escritura):</strong> <span style="font-size: 1.5rem; color: #007bff;">{{ count1() }}</span></p>
      </div>

      <div style="background: #e9ecef; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
        <p><strong>Signal (Solo lectura):</strong> <span style="font-size: 1.5rem;">{{ count2() }}</span></p>
      </div>

      <div style="text-align: center;">
        <button 
          (click)="increment()"
          style="background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem;"
        >
          Incrementar Todo
        </button>
      </div>
    </div>
  `
})
export class SignalsComponent {
  /**
   * Variable primitiva normal.
   * Al estar en un componente OnPush, si incrementamos esta variable pero NO ocurre
   * nada más (como un cambio en un Input o un Signal), la vista NO se enterará.
   */
  count0: number = 0;

  /**
   * ✅ WritableSignal: La unidad básica de estado reactivo en Angular.
   * Permite lectura reactiva (count1()) y modificación (set, update).
   */
  readonly count1: WritableSignal<number> = signal<number>(0);

  /**
   * ✅ Read-only Signal: Creado a partir de un WritableSignal.
   * Esto es una buena práctica para exponer estado de forma segura, evitando que 
   * otros componentes modifiquen el estado interno arbitrariamente.
   */
  readonly count2: Signal<number> = this.count1.asReadonly();

  increment() {
    console.log(`--- Incrementando contadores ---`);
    
    // Incremento de variable normal
    this.count0 += 1;
    
    /**
     * ✅ .update(): Recibe el valor actual y devuelve el nuevo.
     * Es ideal para operaciones que dependen del estado previo.
     */
    this.count1.update((currentValue) => currentValue + 1);

    /**
     * El signal 'count2' se actualizará automáticamente ya que depende de 'count1'.
     */
  }
}
