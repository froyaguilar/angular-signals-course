# 👁️ Consultas de Vista basadas en Signals en Angular

Angular ahora admite **consultas de vista basadas en signals**, lo que permite hacer referencia a elementos del DOM o componentes utilizando **signals** en lugar de decoradores como `@ViewChild`. Este enfoque mejora la **reactividad**, simplifica los **problemas de sincronización** y se alinea mejor con `ChangeDetectionStrategy.OnPush`.

---

## 🔎 ¿Qué son las Consultas de Vista de Signal?

Las consultas de signal como `viewChild`, `contentChild`, `viewChildren` y `contentChildren` son **funciones** que devuelven **`Signal<T | null>`** o **`Signal<T[]>`**. Sustituyen a las consultas basadas en decoradores de Angular como `@ViewChild()` y `@ContentChild()`.

| Consulta Clásica (Decorador) | Consulta de Signal (Función) |
|------------------------------|-------------------------------|
| `@ViewChild(...)`            | `viewChild(...)`              |
| `@ContentChild(...)`         | `contentChild(...)`           |
| `@ViewChildren(...)`         | `viewChildren(...)`           |
| `@ContentChildren(...)`      | `contentChildren(...)`        |

> 💡 Estas funciones son completamente **reactivas** y devuelven **signals** que se actualizan cuando los elementos consultados cambian.

---

## 🧱 Ejemplo 1: `@ViewChild` Clásico + `ChangeDetectorRef`

```ts
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
  selector: 'app-no-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #inputRef type="text" placeholder="Escribe algo…" (input)="readValue()" />
    <p>Valor = {{ value }}</p>
  `
})
export class QueriesDecoratorComponent implements AfterViewInit {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  value = '';

  ngAfterViewInit() {
    console.log('📦 El input está listo:', this.inputRef);
  }

  readValue() {
    // ❌ Lectura manual + detección de cambios manual
    this.value = this.inputRef.nativeElement.value;
    this.cdr.markForCheck(); // Necesario con OnPush
  }
}
```

**Inconvenientes:**
- Requiere `AfterViewInit` para acceder al elemento.
- Se necesita la detección de cambios manual (`markForCheck()`).
- No se alinea bien con los signals ni con las actualizaciones reactivas de la interfaz de usuario.

---

## ✅ Ejemplo 2: `viewChild()` con Signals

```ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild
} from '@angular/core';

@Component({
  selector: 'app-with-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #inputRef type="text" placeholder="Escribe algo…" (input)="onInput($event)" />
    <p>Valor = {{ value() }}</p>
  `
})
export class QueriesSignalsComponent {
  // ✅ viewChild devuelve un Signal<ElementRef | null>
  readonly inputRef = viewChild('inputRef', { read: ElementRef });

  // ✅ Signal de escritura para mantener el valor de entrada
  readonly value = signal('');

  onInput(event: Event): void {
    const inputElement = this.inputRef();
    if (inputElement) {
      this.value.set(inputElement.nativeElement.value);
    }
  }
}
```

**Ventajas:**
- No se necesita `ngAfterViewInit` — `inputRef()` pasa a ser no nulo automáticamente cuando está listo.
- Reacciona a los cambios del DOM de forma declarativa.
- Totalmente compatible con `ChangeDetectionStrategy.OnPush`.
- Se alinea con la dirección de Angular de priorizar los signals.

---

## 💡 Tabla de Resumen

| Característica               | `@ViewChild`         | `viewChild()` (Signal)   |
|------------------------------|----------------------|--------------------------|
| Reactividad                  | ❌ Estática           | ✅ `Signal<T>` reactivo   |
| Sincronización necesaria (`AfterViewInit`)| ✅ Requerida | ❌ No es necesaria      |
| Adecuado para Signals        | ❌ Sincronización manual | ✅ Totalmente compatible  |
| Funciona con OnPush          | ⚠️ Necesita `markForCheck()` | ✅ Automático            |

---

## 🧠 Cuándo usarlo

Usa `viewChild`, `viewChildren`, etc. siempre que trabajes con signals, OnPush o aplicaciones reactivas.

Todavía puedes usar el estilo de decorador en código no reactivo, pero las consultas de signal están más preparadas para el futuro y son más limpias para las interfaces de usuario dinámicas.