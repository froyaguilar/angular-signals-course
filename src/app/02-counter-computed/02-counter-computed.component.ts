import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, signal } from '@angular/core';

@Component({
  selector: 'app-counter-computed',
  standalone: true,
  template: `
    <h1>count0 (Propiedad normal) = {{ count0 }}</h1>
    <h1>count1 (Signal de escritura) = {{ count1() }}</h1>
    <h1>count2 (Signal de solo lectura) = {{ count2() }}</h1>
    <h1>doubleCount (Computed - Doble) = {{ doubleCount() }}</h1>
    <h1>etiqueta (Computed - Texto) = {{ label() }}</h1>

    <button (click)="increment()">Incrementar</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComputedComponent {
  // 1️⃣ Propiedad de clase normal. No es reactiva por sí sola con OnPush.
  count0: number = 0;

  // 2️⃣ WritableSignal: Puede usar .set() y .update().
  readonly count1: WritableSignal<number> = signal(0);

  // 3️⃣ Signal de solo lectura: No se puede modificar directamente desde fuera.
  readonly count2: Signal<number> = this.count1.asReadonly();

  // 4️⃣ Signal computado (computed): Deriva un valor basado en otros signals.
  // Se actualiza automáticamente cuando sus dependencias cambian.
  readonly doubleCount: Signal<number> = computed(() => this.count1() * 2);

  // 5️⃣ Signal computado con lógica condicional.
  readonly label: Signal<string> = computed(() => {
    /**
     * Los computed son perezosos (lazy) y eficientes:
     * - Solo se recalculan si los signals que consumen (count1) cambian.
     * - Memorizan el resultado: si se leen varias veces, devuelven el valor cacheado.
     */
    const val = this.count1();
    if (val === 0) {
      return 'Aún no has hecho clic';
    }
    return `¡Has hecho clic ${val} ${val === 1 ? 'vez' : 'veces'}!`;
  });

  increment() {
    console.log('Actualizando contadores…');

    // Incremento normal
    this.count0 += 1;

    /**
     * Actualizamos el signal de escritura. 
     * Esto notificará automáticamente a 'doubleCount' y 'label' 
     * para que se marquen como sucios y se recalculen cuando sea necesario.
     */
    this.count1.update(v => v + 1);

    // Los signals computados no se pueden modificar manualmente.
    // this.doubleCount.set(10); // ❌ Error
  }
}
