import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild
} from '@angular/core';

@Component({
  selector: 'app-queries-signals',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Consultas con Signals (Forma moderna)</h2>
    <input #inputRef type="text" placeholder="Escribe algo…" (input)="onInput($event)" />
    <p>Valor = {{ value() }}</p>
  `
})
export class QueriesSignalsComponent {
  /**
   * ✅ viewChild(): Versión basada en signals de @ViewChild.
   * Devuelve un Signal que contiene la referencia (o undefined si no existe).
   * No requiere AfterViewInit para ser "seguro" de leer (aunque será undefined antes).
   */
  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  /**
   * ✅ signal para almacenar el valor actual.
   */
  readonly value = signal('');

  onInput(event: Event): void {
    /**
     * ✅ Obtenemos el valor del signal de la referencia.
     */
    const inputElement = this.inputRef();
    if (inputElement) {
      this.value.set(inputElement.nativeElement.value);
    }
  }
}
