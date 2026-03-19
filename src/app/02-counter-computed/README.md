# Tutorial: Uso de Signals `computed` en Angular

Los signals `computed` en Angular te permiten derivar el estado de forma reactiva basándote en otros signals. Este tutorial explica cómo utilizar signals `computed`, basándose en el ejemplo `02-counter-computed`.

---

## 🛠️ ¿Qué son los Signals `computed`?

Un signal `computed` es una señal derivada cuyo valor depende de otros signals. Recalcula su valor solo cuando los signals de los que depende cambian, garantizando actualizaciones eficientes y perezosas (lazy).

### Características Clave

1. **Evaluación Perezosa (Lazy)**: Solo se recalcula cuando es necesario.
2. **Memoización**: Evita recalculos innecesarios almacenando el resultado en caché.
3. **Actualizaciones Reactivas**: Se actualiza automáticamente cuando cambian los signals dependientes.

---

## 🔍 Resumen del Ejemplo

En este ejemplo, gestionamos un contador y derivamos estados adicionales utilizando signals `computed`:

1. Un signal de escritura (`count1`) almacena el valor del contador.
2. Un signal computado (`doubleCount`) calcula el doble del valor del contador.
3. Otro signal computado (`label`) genera un mensaje dinámico basado en el valor del contador.

---

## 📄 Desglose del Código

### Código del Componente

```typescript
@Component({
  selector: 'dottech-counter-signal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>count0 (propiedad normal) = {{ count0 }}</h1>
    <h1>count1 (signal de escritura) = {{ count1() }}</h1>
    <h1>count2 (signal de solo lectura) = {{ count2() }}</h1>
    <h1>doubleCount (computed) = {{ doubleCount() }}</h1>
    <h1>label (computed) = {{ label() }}</h1>

    <button (click)="increment()">Incrementar</button>
  `
})
export class CounterComputedComponent {
  count0: number = 0; // Propiedad normal
  readonly count1: WritableSignal<number> = signal(0); // Signal de escritura
  readonly count2: Signal<number> = this.count1.asReadonly(); // Signal de solo lectura

  // Signal computado para el doble del valor de count1
  readonly doubleCount: Signal<number> = computed(() => this.count1() * 2);

  // Signal computado para una etiqueta dinámica
  readonly label: Signal<string> = computed(() => {
    return this.count1() === 0
      ? 'Aún no has hecho clic'
      : `¡Has hecho clic ${this.count1()} ${this.count1() === 1 ? 'vez' : 'veces'}!`;
  });

  increment() {
    console.log('Actualizando contadores…');
    this.count0 += 1; // Incrementa la propiedad normal
    this.count1.update(v => v + 1); // Incrementa el signal de escritura
  }
}
```

---

## 🧠 Conceptos Clave

### 1️⃣ Signal de Escritura (`count1`)

- **Cómo funciona**: Almacena el valor del contador y se puede actualizar usando `.set()` o `.update()`.
- **Uso**: Actúa como la fuente para los signals computados.

### 2️⃣ Signal Computado (`doubleCount`)

- **Cómo funciona**: Calcula el doble del valor de `count1`.
- **Ventajas**: Se desarrolla automáticamente cuando `count1` cambia.

```typescript
readonly doubleCount: Signal<number> = computed(() => this.count1() * 2);
```

### 3️⃣ Signal Computado con Lógica Condicional (`label`)

- **Cómo funciona**: Genera un mensaje dinámico basado en el valor de `count1`.
- **Ventajas**: Recalcula eficientemente solo cuando `count1` cambia.

```typescript
readonly label: Signal<string> = computed(() => {
  return this.count1() === 0
    ? 'Aún no has hecho clic'
    : `¡Has hecho clic ${this.count1()} ${this.count1() === 1 ? 'vez' : 'veces'}!`;
});
```

---

## 🚀 Cómo usar Signals `computed`

### Paso 1: Crear un Signal de Escritura

```typescript
const count1 = signal<number>(0);
```

### Paso 2: Definir un Signal `computed`

```typescript
const doubleCount = computed(() => count1() * 2);
```

### Paso 3: Usar el Signal `computed` en la Plantilla

```html
<h1>{{ doubleCount() }}</h1>
```

### Paso 4: Actualizar la Señal Fuente

```typescript
count1.update(value => value + 1);
```

El signal `computed` (`doubleCount`) se actualizará automáticamente cuando `count1` cambie.

---

## 📝 Resumen

| Característica         | Signal de Escritura (`count1`) | Signal Computado (`doubleCount`, `label`) |
|------------------------|--------------------------------|-------------------------------------------|
| Actualizaciones Reactivas| ✅ Sí                          | ✅ Sí                                     |
| Dispara Detección de Cambios | ✅ Sí                       | ✅ Sí                                     |
| Evaluación Perezosa    | ❌ No                          | ✅ Sí                                     |
| Memoización            | ❌ No                          | ✅ Sí                                     |

---

## ✅ Conclusiones

- Usa **Signals de Escritura** para almacenar y actualizar el estado.
- Usa **Signals Computados** para derivar el estado de forma reactiva y eficiente.
- Los signals computados se integran perfectamente con la detección de cambios de Angular, lo que los hace ideales para estados derivados dinámicos.

¡Explora el ejemplo en `src/app/02-counter-computed` para ver estos conceptos en acción!
