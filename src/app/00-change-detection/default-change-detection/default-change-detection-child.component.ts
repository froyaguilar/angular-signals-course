import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'app-child',
  standalone: true,
  template: `
    <p>Componente hijo: {{ user().name }}</p>
  `,
  // Estrategia por defecto: El componente se revisa en cada ciclo de detección de cambios.
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultChangeDetectionComponent {
  /**
   * Entrada reactiva utilizando la nueva API de signals (input).
   * Es obligatoria (.required), lo que garantiza que el componente siempre reciba un usuario.
   */
  user = input.required<{ name: string }>();

  /**
   * Se ejecuta cuando cambian las entradas del componente.
   */
  ngOnChanges() {
    console.log('DefaultChangeDetectionComponent ngOnChanges');
  }

  /**
   * Se ejecuta en cada ciclo de detección de cambios iniciado por Angular.
   * Con ChangeDetectionStrategy.Default, esto sucede con frecuencia (clics, timers, etc).
   */
  ngDoCheck() {
    console.log('DefaultChangeDetectionComponent ngDoCheck');
  }
}