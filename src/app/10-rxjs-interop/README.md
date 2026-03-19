# Interoperabilidad de RxJS con Angular Signals

Angular proporciona utilidades para **conectar Signals y RxJS**, permitiendo una interoperabilidad fluida en ambas direcciones. Esto es útil para migrar código basado en RxJS o combinar Signals con el ecosistema de RxJS.

El paquete [`@angular/core/rxjs-interop`] incluye las siguientes utilidades:

- [`toSignal()`](#tosignal): Convierte un `Observable` de RxJS en un Signal.
- [`toObservable()`](#toobservable): Convierte un Signal en un `Observable` de RxJS.
- [`takeUntilDestroyed()`](#takeuntildestroyed): Limpieza automática para suscripciones.
- [`rxResource`](#rxresource): Gestión reactiva de recursos.
- [`outputFromObservable` / `outputToObservable`](#outputfromobservable-y-outputtoobservable): Interoperabilidad para las salidas (outputs) de los componentes.

---

## `toSignal()`

**Propósito:** Convertir un `Observable` en un Signal para actualizaciones reactivas de la interfaz de usuario con detección de cambios automática.

**Beneficios:**
- Usa flujos de RxJS dentro de componentes basados en Signals.
- Simplifica los enlaces en las plantillas (templates).
- Soporta `initialValue` y manejo de errores.

**Sintaxis:**
```ts
toSignal<T>(
  observable$: Observable<T>,
  config: {
    initialValue: T;
    requireSync?: boolean;
    manualCleanup?: boolean;
    injector?: Injector;
    onError?: (err: unknown) => void;
  }
): Signal<T>
```

**Ejemplo:**
```ts
import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ticker-signals',
  template: `
    <h2>Ticker con Signals</h2>
    <p>Contador (Signal) = {{ counter() }}</p>
  `
})
export class TickerSignalsComponent {
  private counter$ = interval(1000);
  readonly counter = toSignal(this.counter$, { initialValue: 0 });
}
```
Transforma un Observable `interval()` de RxJS en un Signal. La plantilla reacciona automáticamente a las actualizaciones.

---

## `toObservable()`

**Propósito:** Exponer un Signal como un Observable de RxJS para su uso con operadores de RxJS, librerías o efectos.

**Beneficios:**
- Pasa Signals a servicios o efectos que esperan Observables.
- Compone tuberías (pipelines) reactivas con operadores de RxJS.

**Sintaxis:**
```ts
toObservable<T>(source: Signal<T>): Observable<T>
```

**Ejemplo:**
```ts
import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-signal-to-rxjs',
  imports: [AsyncPipe],
  template: `
    <h2>Signal → Observable</h2>
    @let v = value$ | async;
    @if(v) {
      <p>Valor = {{ v }}</p>
    }
    <button (click)="value.set(value() + 1)">Incrementar</button>
  `
})
export class SignalToRxJSComponent {
  readonly value = signal(0);
  readonly value$ = toObservable(this.value);
}
```
Permite usar el valor del signal dentro de un pipe `async`.

---

## `takeUntilDestroyed()`: Limpieza Automática

**Problema:** Olvidar cancelar la suscripción a los Observables puede causar fugas de memoria (memory leaks).

**Solución:** `takeUntilDestroyed()` cancela automáticamente la suscripción cuando el componente es destruido.

**Ejemplo:**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-take-until-destroyed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h2>Ticker con Cancelación Auto</h2>
    <p>Contador = {{ counter | async }}</p>
  `
})
export class TakeUntilDestroyedComponent {
  private ticker$ = interval(500);
  readonly counter = this.ticker$.pipe(
    takeUntilDestroyed()
  );
}
```
No hay necesidad de lógica de cierre manual ni de `ngOnDestroy`.

**Comparación:**

| Característica             | RxJS Tradicional | Con `takeUntilDestroyed()` |
|----------------------------|------------------|----------------------------|
| Cancelación manual         | Requerida        | Manejada automáticamente   |
| Necesita `ngOnDestroy`     | Sí               | No                         |
| Código extra (Subject)     | Sí               | No                         |
| Limpieza según ciclo de vida| Manual           | Integrada                  |

---

## `rxResource`: Gestión Reactiva de Recursos

**Propósito:** Gestionar recursos asíncronos utilizando flujos de RxJS y signals de Angular.

**Características:**
- Estado de carga.
- Manejo de errores.
- Valor actual.
- Seguimiento automático del estado y detección de cambios.

**Ejemplo:**
```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

interface Post { id: number; title: string; }

@Component({
  selector: 'app-rxresource-todos',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>rxResource: Obtención de Todos</h2>
    @if (posts.isLoading()) {
      <p>Cargando…</p>
    }
    @if (posts.error()) {
      <p>Error: {{ posts.error()?.message }}</p>
    }
    @if (!posts.isLoading() && !posts.error()) {
      <ul>
        @for (p of posts.value(); track p.id) {
          <li>{{ p.title }}</li>
        }
      </ul>
    }
    <button (click)="posts.reload()">Recargar</button>
  `
})
export class RxResourceTodosComponent {
  readonly http = inject(HttpClient);
  readonly posts = rxResource<Post[], void>({
    stream: () => this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts'),
    defaultValue: []
  });
}
```
Signals reactivos para los estados de carga, error y valor. Recarga con `.reload()`.

**Comparación:**

| Característica             | RxJS Clásico | `rxResource`         |
|----------------------------|--------------|----------------------|
| Suscripción manual         | Requerida    | No requerida         |
| Gestión de estado de carga | Manual       | Signal integrado     |
| Manejo de errores          | Manual       | Signal integrado     |
| Detección de cambios       | Manual       | Automática           |
| Recarga de datos           | Manual       | `.reload()` sencillo |

---

## `outputFromObservable` y `outputToObservable`: Interoperabilidad RxJS ↔ Signals

**Propósito:** Conectar Observables de RxJS con `OutputRef` de Angular (salidas de signal).

- `outputFromObservable`: Convierte un Observable en una salida de signal.
- `outputToObservable`: Convierte una salida de signal de nuevo en un Observable.

**Ejemplo:**
```ts
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { outputFromObservable, outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-child-ticker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Ticker Hijo</h3>
    <p>Tick del hijo = {{ tick }}</p>
  `
})
export class ChildTickerComponent {
  readonly tick = outputFromObservable(interval(2000));
}

@Component({
  selector: 'app-tick-demo',
  standalone: true,
  imports: [CommonModule, ChildTickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Demo Interoperabilidad RxJS ↔ Signals</h2>
    <app-child-ticker #child></app-child-ticker>
    @if (parentTick() !== undefined) {
      <p>El padre ve el tick = {{ parentTick() }}</p>
    }
  `
})
export class TickDemoComponent {
  private childCmp = viewChild.required(ChildTickerComponent);
  parentTick = signal<number | undefined>(undefined);

  constructor() {
    outputToObservable(this.childCmp().tick)
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.parentTick.set(value));
  }
}
```
El hijo expone una salida de signal que genera ticks; el padre lo consume como un Observable y actualiza un signal local.

---

## Resumen

Las utilidades de interoperabilidad RxJS de Angular permiten una migración fluida y el uso híbrido de Signals y RxJS:

- Usa `toSignal()` y `toObservable()` para la conversión.
- Usa `takeUntilDestroyed()` para la limpieza automática.
- Usa `rxResource` para la gestión reactiva de recursos.
- Usa `outputFromObservable` y `outputToObservable` para la interoperabilidad de las salidas de componentes.

Estas herramientas te ayudan a migrar progresivamente a Signals o a interconectar con APIs basadas en RxJS en librerías, servicios o aplicaciones existentes.
