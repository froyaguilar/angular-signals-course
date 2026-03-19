# 🔁 Doble Enlace de Datos en Angular: Clásico vs Signals

Angular admite múltiples formas de doble enlace de datos (two-way data binding). Los Signals introducen una forma **reactiva y declarativa** de vincular valores tanto **de padre a hijo** como **de la entrada del usuario al modelo**.

---

## ✅ 1. Clásico `[(ngModel)]` (FormsModule)

El enfoque tradicional utiliza `FormsModule` y la directiva `ngModel`:

### 🔧 `ClassicTwoWayComponent`

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classic-two-way',
  imports: [FormsModule],
  template: `
    <h2>Enlace [(ngModel)] Clásico</h2>
    <input [(ngModel)]="name" placeholder="Introduce tu nombre">
    <p>¡Hola, {{ name }}!</p>
  `
})
export class ClassicTwoWayComponent {
  name: string = '';
}
```

**Notas:**
- ✅ Fácil y declarativo.
- ❌ Requiere FormsModule.
- ❌ No es reactivo con los signals de Angular.
- ❌ No funciona bien con `ChangeDetectionStrategy.OnPush`.

---

## 🆕 2. Signals: Doble Enlace Manual

Utiliza un signal `model()` y conecta manualmente el evento del DOM (`input`) a `set()`.

### 🔧 `SignalsTwoWayComponent`

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <input [value]="name()" (input)="onInput($event)" placeholder="Introduce tu nombre">
    <p>Hola, {{ name() }}</p>
  `
})
export class SignalsTwoWayComponent {
  name = model('');

  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.name.set(input.value);
    }
  }
}
```

**Notas:**
- ✅ Completamente reactivo.
- ✅ No requiere FormsModule.
- ❌ Un poco más de código (manejador de entrada manual).
- ✅ Funciona perfectamente con OnPush.

---

## 💡 3. Signals: Doble Enlace a nivel de Componente con `model()` + `[(...)]`

Sustituye tanto `input()` como `output()` por un único enlace `model()`, y utiliza `[(count)]` en el padre.

### 🧱 `ChildComponent` (con `model.required()`)

```typescript
import { Component, ChangeDetectionStrategy, effect, model } from '@angular/core';

@Component({
  selector: 'app-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="child-box">
      <p>Contador del hijo = {{ count() }}</p>
      <button (click)="increment()">Incrementar desde el Hijo</button>
    </div>
  `
})
export class ChildComponent {
  readonly count = model.required<number>();

  constructor() {
    effect(() => {
      console.log('🔄 [effect] El contador del hijo cambió a', this.count());
    });
  }

  increment() {
    this.count.update(v => v + 1);
  }
}
```

### 🧱 `ParentComponent` usando `[(count)]`

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
  selector: 'app-root',
  imports: [ChildComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="parent-box">
      <h2>Padre usando model()</h2>
      <button (click)="incrementCount()">+1 desde el Padre</button>
      <app-child [(count)]="count"></app-child>
      <p>El padre ve el contador = {{ count() }}</p>
    </div>
  `
})
export class ModelIOSignalComponent {
  count = signal(0);

  incrementCount() {
    this.count.update(v => v + 1);
  }
}
```

**Notas:**
- ✅ Enlace bidireccional súper limpio mediante `[(count)]`.
- ✅ Sin `input`, `output` o `EventEmitter`.
- ✅ Sin `ngOnChanges` ni lógica de sincronización manual.
- ✅ Completamente reactivo y compatible con OnPush.

---

## 🧠 Resumen: ¿Cuál deberías usar?

| Caso de Uso                     | Enfoque Recomendado                 |
|---------------------------------|--------------------------------------|
| App legada con FormsModule      | `[(ngModel)]`                        |
| App reactiva con signals        | `model()` + `[(...)]`                |
| Formularios simples sin boilerplate| Signals manuales + `set()`          |
| Coordinación padre-hijo         | `model.required()` + `[(...)]`       |

---

## 📌 Consejo Final

- ✅ Usa `model()` cuando tanto el padre como el hijo necesiten estar sincronizados bajo el mismo signal.
- ✅ Para la entrada del usuario, los signals te permiten eliminar completamente FormsModule y obtener un control más fino.