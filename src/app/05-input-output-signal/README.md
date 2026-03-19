# 🔄 Comunicación entre Componentes: Decoradores vs Signals

Angular permite la **comunicación entre componentes** utilizando dos enfoques principales:

- Decoradores tradicionales `@Input()` / `@Output()`.
- Nuevas APIs de Signal `input()` / `output()` (recomendadas para aplicaciones basadas en signals).

A continuación, se presenta una comparación de ambos estilos con ejemplos prácticos.

---

## 🧵 Tradicional: `@Input()` + `@Output()` + `EventEmitter`

El patrón clásico de Angular es imperativo y verboso, y a menudo requiere ganchos de ciclo de vida (lifecycle hooks) como `ngOnChanges`.

### Ejemplo de Componente Hijo

```ts
@Component({
  selector: 'app-child-decorator',
  template: `
    <p>Contador = {{ count }}</p>
    <button (click)="notify()">Notificar al Padre</button>
  `
})
export class ChildDecoratorComponent implements OnChanges {
  @Input() count!: number;
  @Output() increment = new EventEmitter<void>();

  ngOnChanges(ch: SimpleChanges) {
    console.log('🔄 [ngOnChanges] count cambió a', this.count);
  }

  notify() {
    this.increment.emit();
  }
}
```

### Ejemplo de Componente Padre

```ts
@Component({
  selector: 'app-parent-decorator',
  imports: [ChildDecoratorComponent],
  template: `
    <h2>Padre usando decoradores</h2>
    <button (click)="incrementCount()">+1</button>
    <app-child-decorator
      [count]="count"
      (increment)="onIncrement()">
    </app-child-decorator>
  `
})
export class ParentDecoratorComponent {
  count = 0;

  incrementCount() {
    this.count++;
  }

  onIncrement() {
    console.log('🔔 El hijo solicitó un incremento');
    this.count++;
  }
}
```

**Desventajas:**
- Debe declararse manualmente `EventEmitter`.
- Requiere ganchos de ciclo de vida (ej. `ngOnChanges`) para rastrear actualizaciones.
- Mucho código repetitivo (boilerplate) e imperativo.

---

## ✅ Moderno: `input()` y `output()` basados en Signals

La API de signals de Angular simplifica el enlace de entrada/salida utilizando primitivas reactivas.

### Ejemplo de Componente Hijo

```ts
@Component({
  selector: 'app-child-signals',
  template: `
    <p>Contador = {{ count() }}</p>
    <button (click)="notify()">Notificar al Padre</button>
  `
})
export class ChildSignalsComponent {
  readonly count = input<number>();
  readonly increment = output<void>();

  constructor() {
    effect(() => {
      console.log('🔄 [effect] count cambió a', this.count());
    });
  }

  notify() {
    this.increment.emit();
  }
}
```

### Ejemplo de Componente Padre

```ts
@Component({
  selector: 'app-parent-signals',
  imports: [ChildSignalsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Padre usando signals</h2>
    <button (click)="incrementCount()">+1</button>
    <app-child-signals
      [count]="count()"
      (increment)="onIncrement()">
    </app-child-signals>
    <p>El padre ve el contador = {{ count() }}</p>
  `
})
export class ParentSignalsComponent {
  count = signal(0);

  incrementCount() {
    this.count.update(v => v + 1);
  }

  onIncrement() {
    console.log('🔔 [Signal] El hijo solicitó un incremento');
    this.incrementCount();
  }
}
```

**Beneficios:**
- `input()` es reactivo — no es necesario `ngOnChanges`.
- `output()` es ligero — no es necesario `EventEmitter`.
- Se integra con signals y `effect()`.
- Más limpio y declarativo.

---

## ⚖️ Tabla Comparativa

| Característica             | API de Decoradores (`@Input` / `@Output`) | API de Signals (`input` / `output`) |
|----------------------------|------------------------------------------|-------------------------------------|
| Rastreo de entrada reactivo| ❌ Manual con `ngOnChanges`               | ✅ Integrado mediante signals        |
| Emisión de salida          | ❌ Usa `EventEmitter`                     | ✅ Usa `.emit()` estilo signal      |
| Código extra (Boilerplate) | ❌ Más código                             | ✅ Mínimo                           |
| Integración con Signals    | ❌ No es reactivo por defecto             | ✅ Fluida                           |

---

## 📌 Cuándo preferir cada uno

| Caso de Uso                     | Preferir…                |
|---------------------------------|--------------------------|
| Aplicaciones legadas o híbridas | `@Input()` / `@Output()` |
| Nuevas aplicaciones de signals  | `input()` / `output()`   |
| Control preciso de ciclo de vida| API de Decoradores       |
| Comunicación concisa y reactiva | API de Signals           |

---

## 🔚 Resumen

Las entradas/salidas basadas en signals de Angular proporcionan una forma más limpia y reactiva de comunicarse entre componentes, sustituyendo `EventEmitter` y `ngOnChanges` por primitivas declarativas.

Para nuevas aplicaciones basadas en signals, prefiere `input()` y `output()` para reducir el código repetitivo y mejorar la reactividad.
utput()` to reduce boilerplate and improve reactivity.