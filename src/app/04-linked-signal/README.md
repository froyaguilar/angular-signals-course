# 🔗 Tutorial: Uso de `linkedSignal` en Angular

Este tutorial explica cómo utilizar **`linkedSignal`** en Angular y muestra **por qué es útil para gestionar la consistencia en las actualizaciones de estado concurrentes**. Analizaremos dos ejemplos:

- Una condición de carrera (race condition) causada por señales separadas.
- Una solución utilizando `linkedSignal` para actualizaciones atómicas.

---

## 🧠 ¿Qué es `linkedSignal`?

En Angular, `linkedSignal` crea un **signal de escritura derivado** basado en una o más dependencias. Te permite:

- **Leer de señales dependientes**.
- **Escribir una actualización consistente en todas ellas**, de forma atómica.
- Prevenir el **estado inconsistente** en actualizaciones asíncronas o concurrentes.

---

## 🐛 Problema: Condiciones de Carrera con Señales Independientes

Aquí hay un enfoque ingenuo utilizando dos señales separadas `signal()` para `x` e `y`, y una señal `computed()` para su combinación:

### `LinkedSignalRaceComponent`

```ts
@Component({
  selector: 'dottech-linked-signal-race-condition',
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>punto = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Mover Concurrentemente (+1, +1) dos veces
    </button>
  `
})
export class LinkedSignalRaceComponent {
  readonly x = signal(0);
  readonly y = signal(0);

  readonly point = computed(() => ({ x: this.x(), y: this.y() }));

  moveConcurrently(dx: number, dy: number) {
    this.move(dx, dy);
    this.move(dx, dy);
  }

  private move(dx: number, dy: number) {
    const curX = this.x();
    const curY = this.y();

    setTimeout(() => {
      console.log('Estableciendo x a', curX + dx);
      this.x.set(curX + dx);
    }, Math.random() * 1000);

    setTimeout(() => {
      console.log('Estableciendo y a', curY + dy);
      this.y.set(curY + dy);
    }, Math.random() * 1000);
  }
}
```
## ❌ Problema

Si las actualizaciones de `x` e `y` ocurren fuera de orden (debido a `setTimeout`), el `point` computado puede mostrar brevemente un valor inconsistente.
Esta es una condición de carrera clásica en el estado de la interfaz de usuario.

---

## ✅ Solución: Usar `linkedSignal` para Actualizaciones Atómicas

La solución es utilizar `linkedSignal()`, que combina la lectura y la escritura en una única actualización atómica.

### `LinkedSignalComponent`

```ts
@Component({
  selector: 'dottech-linked-signal-race-solution',
  standalone: true,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>punto = {{ point() | json }}</h1>
    <button (click)="moveConcurrently(1, 1)">
      Mover Concurrentemente (+1, +1) dos veces
    </button>
  `
})
export class LinkedSignalComponent {
  readonly x: WritableSignal<number> = signal(0);
  readonly y: WritableSignal<number> = signal(0);

  readonly point: WritableSignal<{ x: number; y: number }> = linkedSignal(() => ({
    x: this.x(),
    y: this.y()
  }));

  moveConcurrently(dx: number, dy: number) {
    const updater = () =>
      this.point.update(({ x, y }) => ({ x: x + dx, y: y + dy }));

    setTimeout(updater, Math.random() * 1000);
    setTimeout(updater, Math.random() * 1000);
  }
}
```

---

## ✅ Beneficios

- `point.update()` lee tanto `x` como `y` a la vez.
- Las actualizaciones se agrupan de forma atómica, garantizando un estado consistente.
- Sin riesgo de lecturas obsoletas o combinaciones inconsistentes.

---

## ✨ Comparación

| Característica               | Señales Independientes + `computed()` | `linkedSignal()`      |
|------------------------------|:------------------------------------:|:---------------------:|
| Actualizaciones seguras asínc.| ❌ No                                 | ✅ Sí                 |
| Consistencia de actualización | ❌ Puede desajustarse                 | ✅ Siempre en sincronía|
| Lectura/escritura atómica     | ❌ Dividida entre señales             | ✅ Unificada           |
| Estado derivado de escritura  | ❌ No directamente                    | ✅ WritableSignal      |

---

## 🧩 Cuándo usar `linkedSignal`

Usa `linkedSignal` cuando:

- Tengas múltiples señales relacionadas que deban mantenerse sincronizadas.
- Necesites valores derivados que puedan actualizarse en un solo paso.
- Quieras evitar condiciones de carrera en entornos asíncronos.
- Estés construyendo modelos de estado componibles con menos errores.

---

## 📝 Resumen

`linkedSignal` es la herramienta adecuada para escenarios de señales avanzados donde la atomicidad, la consistencia y la claridad importan.
Garantiza que los valores reactivos permanezcan coherentes, especialmente bajo actualizaciones concurrentes o asíncronas.
