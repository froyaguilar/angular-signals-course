# Contador con Signals de Escritura y Solo Lectura

Este ejemplo demuestra cómo utilizar signals de escritura (writable) y de solo lectura (readonly) en Angular para gestionar el estado y disparar la detección de cambios.

## Características Clave

- `WritableSignal`: Una señal que se puede actualizar directamente.
- `ReadonlySignal`: Una señal que proporciona acceso de solo lectura al estado.

## Cómo Funciona

- La señal `count1` es de escritura y se puede actualizar utilizando el método `update`.
- La señal `count2` es una versión de solo lectura de `count1`, garantizando la inmutabilidad para los consumidores.

## Puntos Destacados del Código

- Incrementa el contador utilizando el método `increment`.
- Observa cómo los signals disparan automáticamente la detección de cambios.

## Ruta

`src/app/01-counter-signal`
