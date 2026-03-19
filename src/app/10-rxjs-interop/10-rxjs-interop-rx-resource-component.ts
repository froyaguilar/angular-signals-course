import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

interface Post { id: number; title: string; }

@Component({
  selector: 'app-rx-resource-todos',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Demo rxResource (Observables + Resource)</h2>

    @if (posts.isLoading()) {
      <p>Cargando datos...</p>
    }

    @if (posts.error()) {
      <p style="color: red;">Error: {{ posts.error()?.message }}</p>
    }

    @if (posts.value()) {
      <ul>
        @for (p of posts.value(); track p.id) {
          <li>{{ p.title }}</li>
        }
      </ul>
    }

    <button (click)="posts.reload()">Recargar (reload())</button>
    <p>Estado: {{ posts.status() }}</p>
  `
})
export class RxResourceTodosComponent {
  private http = inject(HttpClient);

  /**
   * ✅ rxResource(): Variante de resource() que utiliza Observables como origen.
   * Internamente se suscribe al observable devuelto por 'stream' y lo expone como Signals.
   */
  readonly posts = rxResource<Post[], void>({
    /**
     * El cargador devuelve un Observable (en este caso de HttpClient).
     */
    loader: () => this.http.get<Post[]>('https://jsonplaceholder.typicode.com/todos'),
    defaultValue: []
  });
}
