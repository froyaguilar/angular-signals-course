# Obtención de Datos Asíncronos en Angular: APIs Clásicas vs Signals

## 📦 API HTTP Clásica con HttpClient

**¿Qué es?**
La API `HttpClient` de `@angular/common/http` es la forma tradicional de realizar peticiones HTTP en Angular, basada en RxJS y Observables.

### ✅ Ventajas
- Control total sobre el manejo de peticiones/respuestas.
- Funciona bien con los operadores de RxJS.
- Altamente flexible y probada en batalla.

### ❌ Desventajas
- Código repetitivo (suscripciones, limpieza).
- Se requiere activar manualmente la detección de cambios (`markForCheck()`).
- No hay cancelación automática ni seguimiento del estado de forma nativa.

### 🧠 Conceptos Clave
- Debes usar `subscribe()` para iniciar la petición HTTP.
- Actualizar manualmente el estado del componente en caso de éxito/error.
- Los componentes OnPush requieren `ChangeDetectorRef` para detectar los cambios.

### 🧪 Ejemplo

```typescript
@Component({
  selector: 'app-classic-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Obtención de Todos Clásica</h2>
    @if (loading) { <p>Cargando...</p> }
    @if (error) { <p>Error: {{ error }}</p> }
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
  todos: Array<{ id: number; title: string }> = [];
  loading = false;
  error?: string;

  private sub!: Subscription;
  readonly http = inject(HttpClient);
  readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() { this.load(); }

  private load() {
    this.loading = true;
    this.error = undefined;
    this.cdr.markForCheck();

    this.sub = this.http.get<Array<{ id: number; title: string }>>(
      'https://jsonplaceholder.typicode.com/posts'
    ).subscribe({
      next: data => {
        this.todos = data;
        this.loading = false;
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
    this.sub.unsubscribe();
    this.load();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
```

---

## 🌊 API `resource()` (Angular Signals)

**¿Qué es?**
`resource()` es una nueva API en Angular para la obtención reactiva de datos asíncronos con limpieza automática y seguimiento de estado. Está orientada a signals.

### ✅ Ventajas
- Rastrea los estados de carga, error y valor de forma nativa.
- Cancela automáticamente las peticiones obsoletas.
- Diseñada para componentes OnPush y aplicaciones que priorizan signals.
- Función `reload()` integrada.

### ❌ Desventajas
- No está integrada con el cliente HTTP de Angular por defecto (usa `fetch()`).
- Procesamiento manual de datos y manejo de errores.

### 🧠 Conceptos Clave
- Acepta un signal `params()` y una función `loader()`.
- Se invalida y vuelve a ejecutar automáticamente al cambiar los signals de los parámetros.
- Proporciona `.value()`, `.isLoading()`, `.error()`, `.status()` y `.reload()`.

### 🧪 Ejemplo

```typescript
@Component({
  selector: 'app-resource-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Obtención de Todos con Resource</h2>
    @if(todos.isLoading()) { <p>Cargando...</p> }
    @if(todos.error()) { <p>Error: {{ todos.error() }}</p> }
    @if(todos.value()) {
      <ul>
        @for (todo of todos.value(); track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    <button (click)="todos.reload()">Recargar</button>
    <button (click)="reloadWithSignal()">Recargar con Signal</button>
    <p>Estado: {{ todos.status() }}</p>
    <p>Error: {{ todos.error() | json }}</p>
  `
})
export class ResourceTodosComponent {
  readonly signalToReload = signal(1);

  readonly todos = resource({
    params: () => ({ id: this.signalToReload() }),
    loader: async ({ params, abortSignal }) => {
      console.log(`Cargando id ${params.id}`);
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
        signal: abortSignal
      });
      return await res.json();
    }
  });

  reloadWithSignal() {
    this.signalToReload.update(n => n + 1);
  }
}
```

---

## ⚡ API `httpResource()` (Angular + HttpClient)

**¿Qué es?**
`httpResource()` envuelve `HttpClient` para una integración directa con la detección de cambios basada en signals de Angular. Piensa en ello como `resource()` + `HttpClient`.

### ✅ Ventajas
- Sintaxis más limpia utilizando el familiar `HttpClient` internamente.
- Funciona perfectamente con Signals y detección de cambios OnPush.
- Maneja automáticamente el estado de la petición y la cancelación.
- Proporciona `.value()`, `.isLoading()`, `.error()`, `.reload()`, etc.

### ❌ Desventajas
- Control menos granular que el `HttpClient` clásico.
- Puede sentirse como una "caja negra" al depurar flujos complejos.

### 🧠 Conceptos Clave
- Utiliza `httpResource(() => config)` con `url`, `method`, `headers`, etc.
- Proporciona selectores reactivos para el estado y el valor.
- Fácil de implementar en aplicaciones Angular reactivas.

### 🧪 Ejemplo

```typescript
@Component({
  selector: 'app-http-resource-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Todos con HTTP Resource</h2>
    @if(todos.isLoading()) { <p>Cargando...</p> }
    @if(todos.error()) { <p>Error: {{ todos.error() }}</p> }
    @if(todos.value()) {
      <ul>
        @for (todo of todos.value(); track todo.id) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    }
    <button (click)="todos.reload()">Recargar</button>
    <p>Estado: {{ todos.status() }}</p>
    <p>Error: {{ todos.error() | json }}</p>
  `
})
export class HttpResourceTodosComponent {
  readonly todos = httpResource<Array<{ id: number; title: string }>>(
    () => ({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET'
    }),
    {
      defaultValue: []
    }
  );
}
```

---

## 🧾 Tabla de Resumen

| Característica         | HttpClient (Clásico) | `resource()` | `httpResource()` |
|------------------------|:--------------------:|:------------:|:----------------:|
| Signals Reactivos      | ❌ No                | ✅ Sí        | ✅ Sí            |
| Usa HttpClient         | ✅ Sí                | ❌ No (fetch)| ✅ Sí            |
| Aborto/Limpieza Auto   | ❌ Manual            | ✅ Sí        | ✅ Sí            |
| Gestión de Estado Integ.| ❌ Manual            | ✅ Sí        | ✅ Sí            |
| Seguro para ChangeDetection| ❌ markForCheck() | ✅ Sí        | ✅ Sí            |
| Soporte para Recargado | ❌ Manual            | ✅ reload()  | ✅ reload()      |
| Cabeceras/Config Pers. | ✅ Sí                | ✅ (manual)  | ✅ Fácil         |
