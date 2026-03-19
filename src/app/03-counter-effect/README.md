# Tutorial: Uso de `effect` en Angular

La función `effect` en Angular te permite realizar efectos secundarios (side effects) de forma reactiva cada vez que una señal cambia. Este tutorial explica cómo utilizar `effect`, basándose en el ejemplo `03-counter-effect`.

---

## 🛠️ ¿Qué es `effect`?

Un `effect` es un mecanismo reactivo en Angular que ejecuta una función cada vez que los signals de los que depende cambian. Es útil para realizar efectos secundarios como registros en consola (logging), actualizaciones del DOM o interacción con sistemas externos.

### Características Clave

1. **Ejecución Reactiva**: Se ejecuta automáticamente cuando los signals dependientes cambian.
2. **Ejecución Inmediata**: Se ejecuta una vez inmediatamente al ser creado.
3. **Soporte de Limpieza**: Te permite definir lógica de limpieza para suscripciones o recursos externos.

---

## 🔍 Resumen del Ejemplo

En este ejemplo, gestionamos un contador utilizando un signal de escritura (`count`) y registramos sus cambios utilizando un `effect`. Además, el `effect` actualiza el título del documento cada vez que el contador cambia.

---

## 📄 Desglose del Código

### Código del Componente

```typescript
@Component({
  selector: 'dottech-counter-effect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>count (signal de escritura) = {{ count() }}</h1>
    <button (click)="increment()">Incrementar</button>
  `
})
export class CounterEffectComponent {
  // 1️⃣ WritableSignal: mantiene nuestro valor del contador
  readonly count: WritableSignal<number> = signal(0);

  // 2️⃣ Effect: se ejecuta al suscribirse y cada vez que `count` cambie
  private readonly logAndTitleEffect = effect(() => {
    const current = this.count();
    // Efecto secundario #1: log en la consola
    console.log(`🟢 [Effect] count cambió a ${current}`);
    // Efecto secundario #2: actualizar el título del documento
    (document as Document).title = `El contador es ${current}`;
  });

  constructor() {
    // Los effects se ejecutan inmediatamente una vez al crearse:
    // logueará "count cambió a 0" y establecerá el título a "El contador es 0"
  }

  increment() {
    // Actualiza el signal de escritura; dispara el efecto automáticamente
    this.count.update(currentValue => currentValue + 1);
  }
}
```

---

## 🧠 Conceptos Clave

### 1️⃣ Signal de Escritura (`count`)

- **Cómo funciona**: Almacena el valor del contador y se puede actualizar usando `.set()` o `.update()`.
- **Uso**: Actúa como la fuente para el `effect`.

```typescript
readonly count: WritableSignal<number> = signal(0);
```

### 2️⃣ Effect (`logAndTitleEffect`)

- **Cómo funciona**: Ejecuta una función cada vez que el signal `count` cambia.
- **Efectos Secundarios**:
  - Registra el valor actual de `count` en la consola.
  - Actualiza el título del documento para reflejar el valor actual de `count`.

```typescript
private readonly logAndTitleEffect = effect(() => {
  const current = this.count();
  console.log(`🟢 [Effect] count cambió a ${current}`);
  (document as Document).title = `El contador es ${current}`;
});
```

---

## 🚀 Cómo usar `effect`

### Paso 1: Crear un Signal de Escritura

```typescript
const count = signal<number>(0);
```

### Paso 2: Definir un `effect`

```typescript
const logEffect = effect(() => {
  console.log(`El contador ahora es ${count()}`);
});
```

### Paso 3: Disparar el `effect` actualizando el Signal

```typescript
count.update(value => value + 1);
```

El `effect` se ejecutará automáticamente cada vez que `count` cambie.

---

## 📝 Resumen

| Característica         | Signal de Escritura (`count`) | Effect (`logAndTitleEffect`) |
|------------------------|-------------------------------|------------------------------|
| Actualizaciones Reactivas| ✅ Sí                          | ✅ Sí                         |
| Dispara Detección de Cambios | ✅ Sí                       | n/a                          |
| Realiza Efectos Secundarios | ❌ No                          | ✅ Sí                         |
| Soporte de Limpieza     | n/a                           | ✅ Sí                         |

---

## ✅ Conclusiones

- Usa **Signals de Escritura** para almacenar y actualizar el estado.
- Usa **Effects** para realizar efectos secundarios de forma reactiva cuando los signals cambian.
- Los effects se integran perfectamente con la detección de cambios de Angular, lo que los hace ideales para logging, actualizaciones del DOM o interacciones externas.

¡Explora el ejemplo en `src/app/03-counter-effect` para ver estos conceptos en acción!
