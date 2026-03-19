import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classic-todos',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Obtención de Todos (Clásico con HttpClient)</h2>
    
    @if (loading) {
      <p>Cargando...</p>
    }
    
    @if (error) {
      <p>Error: {{ error }}</p>
    }
    
    @if (!loading && !error) {
      <ul>
        @for (todo of todos; track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    <button (click)="reload()">Recargar</button>
  `
})
export class ClassicTodosComponent implements OnInit, OnDestroy {
  /**
   * Estado gestionado mediante propiedades normales.
   * OnPush no detectará cambios automáticamente al completarse la petición HTTP
   * porque la petición ocurre fuera de la zona de Angular o simplemente no hay
   * un trigger reactivo automático aquí.
   */
  todos: Array<{ id: number; title: string }> = [];
  loading = false;
  error?: string;

  private sub!: Subscription;
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.load();
  }

  private load() {
    this.loading = true;
    this.error = undefined;
    /**
     * ❌ Necesitamos marcar manualmente para revisión ANTES de la petición
     * para mostrar el estado de carga.
     */
    this.cdr.markForCheck();

    this.sub = this.http.get<Array<{ id: number; title: string }>>(
      'https://jsonplaceholder.typicode.com/todos'
    ).subscribe({
      next: data => {
        this.todos = data;
        this.loading = false;
        /**
         * ❌ Y OTRA VEZ después de recibir los datos.
         */
        this.cdr.markForCheck();
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  reload() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.load();
  }

  ngOnDestroy() {
    /**
     * ❌ Siempre debemos limpiar las suscripciones.
     */
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
