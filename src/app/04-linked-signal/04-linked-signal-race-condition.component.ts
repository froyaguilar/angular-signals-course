import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-linked-signal-race-condition',
  standalone: true,
  imports: [JsonPipe],
  template: `
   <h1>Punto = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Mover Concurrentemente (+1, +1) dos veces
    </button>
    <p>⚠️ Este componente demuestra una CONDICIÓN DE CARRERA. 
       Las actualizaciones de X e Y están descoordinadas.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedSignalRaceComponent {
  /**
   * Dos signals de escritura independientes.
   */
  readonly x = signal(0);
  readonly y = signal(0);

  /**
   * Un signal computado que combina X e Y.
   * El problema: si intentamos actualizar X e Y de forma asíncrona, 
   * podemos obtener estados intermedios inconsistentes.
   */
  readonly point = computed(() => ({ x: this.x(), y: this.y() }));

  /**
   * Simula movimientos concurrentes. Al usar setTimeout independientes,
   * el orden de ejecución es impredecible y los valores se sobrescriben mal.
   */
  moveConcurrently(dx: number, dy: number) {
    this.move(dx, dy);
    this.move(dx, dy);
  }

  private move(dx: number, dy: number) {
    // Capturamos los valores actuales
    const curX = this.x();
    const curY = this.y();

    // Programamos dos escrituras separadas en tiempos aleatorios
    setTimeout(() => {
      console.log('Estableciendo X a', curX + dx);
      this.x.set(curX + dx);
    }, Math.random() * 500);

    setTimeout(() => {
      console.log('Estableciendo Y a', curY + dy);
      this.y.set(curY + dy);
    }, Math.random() * 500);
  }
}
