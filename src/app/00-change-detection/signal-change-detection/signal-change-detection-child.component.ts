import { ChangeDetectionStrategy, Component, input, signal } from "@angular/core";

@Component({
  selector: 'app-child-signal',
  standalone: true,
  // La combinación de OnPush + Signals es el estándar de oro para el rendimiento en Angular moderno.
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <p>Nombre de usuario desde input: {{ user().name }}</p>
      <p>Contador local: {{ counter() }}</p>
      <button (click)="increment()">Incrementar contador local</button>
    </div>
  `
})
export class SignalChildComponent {
  /**
   * Entrada reactiva (signal).
   */
  user = input.required<{ name: string }>();

  /**
   * Estado local del componente manejado con un signal.
   * Al actualizarse, Angular marca automáticamente este componente para su revisión,
   * sin necesidad de revisar todo el árbol de componentes.
   */
  counter = signal(0);

  increment() {
    this.counter.update(count => count + 1);
  }

  /**
   * ngDoCheck se dispara cuando Angular inicia un ciclo de detección de cambios.
   */
  ngDoCheck() {
    console.log('Ciclo de CD en SignalChildComponent');
  }
}