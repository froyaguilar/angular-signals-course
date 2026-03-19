import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resource-todos',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Obtención de Todos (API Resource)</h2>
    
    @if(todos.isLoading()) {
      <p>Cargando...</p>
    }
    
    @if(todos.error()) {
      <p>Error: {{ todos.error() | json }}</p>
    }
    
    @if(todos.value()) {
      <ul>
        @for (todo of todos.value(); track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    
    <button (click)="todos.reload()">Recargar (reload())</button>
    <button (click)="incrementId()">Recargar cambiando Signal ({{ idParaCargar() }})</button>
    
    <hr>
    <p>Estado actual: <strong>{{ todos.status() }}</strong></p>
    <!-- El estado puede ser: idle, loading, error, etc. -->
  `
})
export class ResourceTodosComponent {
  /**
   * Un signal que usaremos como parámetro para el recurso.
   */
  readonly idParaCargar = signal(1);

  /**
   * ✅ resource(): La nueva API para manejar asincronía de forma nativa con Signals.
   * Maneja automáticamente el estado de carga, errores y el valor final.
   */
  readonly todos = resource({
    /**
     * Los parámetros son reactivos. Si algun signal dentro de params() cambia,
     * el loader se ejecutará de nuevo automáticamente.
     */
    request: () => ({ id: this.idParaCargar() }),
    
    /**
     * El cargador (loader) es una función asíncrona que recibe los parámetros
     * y un abortSignal para cancelar peticiones obsoletas.
     */
    loader: async ({ request, abortSignal }) => {
      console.log(`Cargando ID ${request.id}, abortSignal abortado: ${abortSignal.aborted}`);
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        signal: abortSignal,
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      
      return await response.json();
    },
  });

  incrementId() {
    /**
     * Al actualizar este signal, el resource 'todos' detecta el cambio
     * y vuelve a cargar los datos automáticamente.
     */
    this.idParaCargar.update(n => n + 1);
  }
}
