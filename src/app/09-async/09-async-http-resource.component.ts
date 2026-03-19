import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-http-resource-todos',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Obtención de Todos (httpResource)</h2>
    
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
    
    <hr>
    <p>Estado actual: <strong>{{ todos.status() }}</strong></p>
  `
})
export class HttpResourceTodosComponent {
  /**
   * ✅ httpResource(): Una especialización de resource() optimizada para HttpClient.
   * Simplifica las peticiones HTTP integrándolas directamente con el modelo de Signals.
   */
  readonly todos = httpResource<Array<{ id: number; title: string }>>(
    () => ({
      url: 'https://jsonplaceholder.typicode.com/todos',
      method: 'GET'
    }),
    {
      defaultValue: [] // Valor inicial mientras se realiza la primera carga
    }
  );
}
