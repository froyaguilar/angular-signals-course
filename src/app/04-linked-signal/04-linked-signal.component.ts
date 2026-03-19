import { ChangeDetectionStrategy, Component, WritableSignal, linkedSignal, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-linked-signal',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <h1>Punto = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Mover Concurrentemente (+1, +1) dos veces
    </button>
  `,
  // OnPush es ideal aquí ya que manejamos todo con signals.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedSignalComponent {
  /**
   * 1️⃣ Dos signals bases independientes para X e Y.
   */
  readonly x = signal(0);
  readonly y = signal(0);

  /**
   * 2️⃣ linkedSignal: Crea un signal de escritura que se "vincula" a otros.
   * Si 'x' o 'y' cambian, 'point' se reinicia con el nuevo valor calculado.
   * Sin embargo, 'point' también permite ser actualizado manualmente con .set() o .update().
   */
  readonly point = linkedSignal(() => ({
    x: this.x(),
    y: this.y()
  }));

  /**
   * 3️⃣ Simula dos "clics" que ocurren casi al mismo tiempo.
   * Gracias a .update() en un linkedSignal, las actualizaciones son atómicas.
   */
  moveConcurrently(dx: number, dy: number) {
    const updater = () => this.point.update(({ x, y }) => ({ x: x + dx, y: y + dy }));
    
    // Ejecutamos dos actualizaciones con un pequeño retraso aleatorio
    setTimeout(updater, Math.random() * 500);
    setTimeout(updater, Math.random() * 500);
  }
}