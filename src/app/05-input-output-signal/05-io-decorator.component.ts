import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child-decorator',
  standalone: true,
  template: `
    <p>Contador = {{ count }}</p>
    <!-- Emisión imperativa de eventos -->
    <button (click)="notify()">Notificar al Padre</button>
  `
})
export class ChildDecoratorComponent implements OnChanges {
  /**
   * ❌ Input tradicional con decorador. 
   * No es reactivo por sí mismo, depende de ngOnChanges para detectar cambios.
   */
  @Input() count!: number;

  /**
   * ❌ Output tradicional. 
   * Requiere instanciar EventEmitter y manejo manual.
   */
  @Output() increment = new EventEmitter<void>();

  ngOnChanges(ch: SimpleChanges) {
    // ❌ Gancho de ciclo de vida necesario solo para detectar actualizaciones.
    console.log('🔄 [ngOnChanges] El contador cambió a', this.count);
  }

  notify() {
    /**
     * ❌ Llamada manual a .emit()
     */
    this.increment.emit();
  }
}

@Component({
  selector: 'app-parent-decorator',
  standalone: true,
  imports: [ChildDecoratorComponent],
  template: `
    <h2>Padre usando Decoradores (Forma antigua)</h2>
    <!-- Mutación de estado manual; sin seguimiento reactivo fino -->
    <button (click)="incrementCount()">+1 desde Padre</button>
    
    <!-- Debemos vincular tanto el valor como el emisor de eventos -->
    <app-child-decorator
      [count]="count"
      (increment)="onIncrement()">
    </app-child-decorator>
  `
})
export class ParentDecoratorComponent {
  count = 0;

  incrementCount() {
    this.count++;
  }

  onIncrement() {
    console.log('🔔 El hijo solicitó un incremento');
    this.count++;
  }
}


