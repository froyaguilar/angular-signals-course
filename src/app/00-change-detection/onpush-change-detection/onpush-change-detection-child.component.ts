import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-child-onpush',
  standalone: true,
  template: ` <p>Componente hijo (OnPush): {{ user().name }}</p> `,
  // Estrategia OnPush: Mejora el rendimiento al reducir las revisiones innecesarias.
  // El componente solo se revisa si cambia la referencia de un input o si un signal interno emite.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushChildComponent {
  /**
   * Entrada reactiva (signal). 
   * Gracias a que es un signal, Angular sabe exactamente cuándo actualizar la vista
   * de forma eficiente, incluso con OnPush.
   */
  user = input.required<{ name: string }>();

  /**
   * Se ejecuta cuando cambia la referencia de la entrada.
   */
  ngOnChanges() {
    console.log('OnPushChildComponent ngOnChanges');
  }

  /**
   * Todavía se ejecuta en cada ciclo de detección de cambios de Angular,
   * PERO la vista NO se vuelve a renderizar a menos que Angular detecte cambios reales.
   */
  ngDoCheck() {
    console.log('OnPushChildComponent ngDoCheck');
  }
}
