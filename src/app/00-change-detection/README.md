# 🧠 Comprendiendo la Detección de Cambios en Angular

La **Detección de Cambios (Change Detection - CD)** de Angular mantiene tu interfaz de usuario sincronizada con tus datos. Esta guía explica los conceptos básicos y compara tres enfoques:

1. **Detección de Cambios Predeterminada (Default)**: Comprueba todos los componentes ante cualquier cambio.
2. **Detección de Cambios OnPush**: Comprueba solo cuando las entradas cambian por referencia.
3. **Signals con Detección de Cambios**: Permite actualizaciones reactivas de grano fino.

---

## ⚙️ ¿Qué es la Detección de Cambios?

La Detección de Cambios es cómo Angular decide cuándo actualizar el DOM. Recorre el árbol de componentes y actualiza los enlaces según sea necesario, basándose en la `ChangeDetectionStrategy` del componente.

---

## 1️⃣ Detección de Cambios Predeterminada (Default)

- Angular comprueba cada componente cada vez que:
  - Ocurren eventos (clics, entradas)
  - Los Observables emiten valores
  - Tareas asíncronas finalizan (`setTimeout`, `Promise.resolve`, etc.)
- Se comprueban todos los componentes, incluso si sus entradas no han cambiado.

**Ejemplo:**

```ts
@Component({
  selector: 'app-child',
  template: `{{ user().name }}`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChangeDetectionDefaultComponent {
  user = input.required<{ name: string }>();
}
```

---

## 2️⃣ Detección de Cambios OnPush

- Angular omite componentes a menos que:
  - Se pase una nueva referencia a un `input()`
  - Se dispare manualmente la detección de cambios

---

## 3️⃣ Signals + OnPush

Los Signals proporcionan un estado reactivo y disparan actualizaciones automáticamente, incluso con OnPush.

**Ejemplo:**

```ts
@Component({
  selector: 'app-child',
  template: `<p>Hijo: {{ user().name }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
  user = input.required<{ name: string }>();
}
```

---

## Resumen de la Tabla

| Acción                | Estrategia Default | Solo OnPush | OnPush + Signals |
|-----------------------|:------------------:|:-----------:|:----------------:|
| Mutar campo de objeto | ✅ Actualiza       | ❌ No        | ✅ Sí             |
| Reemplazar objeto     | ✅ Actualiza       | ✅ Sí       | ✅ Sí             |
| Actualizar señal local| n/a                | ❌ No        | ✅ Sí             |
| markForCheck() manual | ❌ No necesario    | ✅ A veces   | ❌ No necesario   |

---

## ⚡ Ejemplo 3: Signals + OnPush + estado local

Simularemos:
- Un padre enviando un objeto de usuario (como señal) a un hijo.
- El hijo también tiene estado local: como un contador.
- Todo con OnPush, totalmente reactivo, sin CD manual.

**Componente Padre**

```ts
@Component({
  selector: 'app-parent',
  template: `
    <button (click)="changeUser()">Cambiar usuario</button>
    <app-child [user]="userSignal"></app-child>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentComponent {
  userSignal = signal({ name: 'Carlos' });

  changeUser() {
    this.userSignal.set({ name: 'Nuevo Nombre ' + Math.random().toFixed(2) });
  }
}
```

**Componente Hijo (con entrada + estado local)**

```ts
@Component({
  selector: 'app-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <p>Nombre del usuario desde input: {{ user().name }}</p>
      <p>Contador local: {{ counter() }}</p>
      <button (click)="increment()">Incrementar contador local</button>
    </div>
  `
})
export class ChildComponent {
  user = input.required<{ name: string }>();

  // 🔄 Estado local del componente gestionado por una señal
  counter = signal(0);

  increment() {
    this.counter.update(count => count + 1);
  }

  ngDoCheck() {
    console.log('Ciclo de CD del ChildComponent');
  }
}
```

*Nota: He simplificado el README original para que sea más directo y use la sintaxis moderna de `input()` en lugar de la mezcla de decoradores que tenía.*