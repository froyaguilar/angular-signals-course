import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

@Component({
  selector: 'app-queries-decorator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Consultas con Decoradores (Forma antigua)</h2>
    <input #inputRef type="text" placeholder="Escribe algo…" (input)="readValue()" />
    <p>Valor = {{ value }}</p>
  `
})
export class QueriesDecoratorComponent implements AfterViewInit {
  /**
   * ❌ @ViewChild: Decorador tradicional para obtener una referencia del DOM.
   * Por defecto, el valor es undefined hasta que se completa la fase AfterViewInit.
   */
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  private cdr = inject(ChangeDetectorRef);
  value = '';

  ngAfterViewInit() {
    /**
     * ❌ Debemos esperar obligatoriamente a AfterViewInit para acceder a la referencia.
     */
    console.log('El elemento input ya está listo:', this.inputRef);
  }

  readValue() {
    /**
     * ❌ Lectura manual y disparo manual de la detección de cambios.
     * Al usar OnPush, si actualizamos una propiedad normal de forma manual,
     * debemos avisar a Angular que revise la vista.
     */
    this.value = this.inputRef.nativeElement.value;
    this.cdr.markForCheck();
  }
}
