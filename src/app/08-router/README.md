# 🚦 Angular Router: Enfoque Clásico vs Signals

Angular 17+ introduce las **entradas de ruta basadas en signals**, haciendo que el enrutamiento sea más reactivo, conciso y amigable con `ChangeDetectionStrategy.OnPush`.

Esta guía compara el **enrutamiento clásico con `ActivatedRoute`** con la **nueva vinculación de entrada basada en signals** utilizando `input()`.

---

## 🧭 Router de Angular Clásico con `ActivatedRoute`

```ts
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-classic',
  template: `
    <h2>Router Clásico</h2>
    <p>ID de Usuario = {{ userId }}</p>
    <button (click)="goNext()">Ir al siguiente usuario</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserClassicComponent implements OnInit, OnDestroy {
  userId!: number;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private subs = new Subscription();

  ngOnInit() {
    this.subs.add(this.route.paramMap.subscribe(pm => {
      this.userId = +pm.get('id')!;
      this.cdr.markForCheck(); // 🛠️ Notificación manual para renderizar
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  goNext() {
    this.userId = this.userId + 1;
    this.router.navigateByUrl(`/router-without-signal/user/${this.userId}`);
  }
}
```

**⚠️ Inconvenientes:**
- Requiere gestión de suscripciones (código repetitivo).
- Se necesita `markForCheck()` manual para actualizar la interfaz con OnPush.
- Más imperativo, menos reactivo.

---

## ✅ Enrutamiento basado en Signals con `input()`

```ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signals',
  template: `
    <h2>Router con Signals</h2>
    <p>ID de Usuario = {{ id() }}</p>
    <button (click)="goNext()">Ir al siguiente</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSignalsComponent {
  // ✅ Mapea automáticamente el parámetro de ruta `id` como un signal
  readonly id = input(0, { transform: numberAttribute });

  private router = inject(Router);

  goNext() {
    this.router.navigateByUrl(`/router-signal/user/${(this.id() ?? 0) + 1}`);
  }
}
```

## ⚙️ Configuración del Router basado en Signals

Este fragmento muestra cómo mapear parámetros a entradas del componente:

```ts
// app.routes.ts
export const routes: Routes = [
  {
    path: 'router-signal/user/:id',
    component: UserSignalsComponent,
    // La configuración global 'withComponentInputBinding' suele ser suficiente
  }
];
```

## 🛠️ Configuración con `withComponentInputBinding` en `app.config.ts`

Para habilitar esto globalmente, Angular Router proporciona `withComponentInputBinding`. Esto vincula los parámetros de ruta a los `input()` de los componentes por defecto.

Actualiza tu configuración de router:

```ts
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};
```

**Cómo funciona:**
- Todos los parámetros de ruta se mapean automáticamente a las entradas (`input`) de los componentes usando signals.
- No es necesario especificar la propiedad `input` para cada ruta individualmente.
- Los componentes simplemente usan `input()` para parámetros de ruta reactivos.

**Tip:**
Aún puedes sobrescribir o personalizar las vinculaciones de entrada por ruta si es necesario.

**💡 Ventajas:**
- No se necesita lógica de suscripción manual.
- `id()` es un signal reactivo — funciona perfectamente con OnPush.
- Se actualiza automáticamente cuando cambia el parámetro de ruta.
- Soporta transformaciones (ej. `numberAttribute`) de forma nativa.

---

## 📌 Resumen: Patrones de Enrutamiento

| Característica               | Router Clásico           | Router basado en Signals |
|------------------------------|--------------------------|--------------------------|
| Parámetro de ruta reactivo   | ❌ Suscripción manual    | ✅ Signal mediante `input()`|
| Actualización auto con OnPush| ❌ Necesita `markForCheck`| ✅ Funciona de forma natural|
| Transformación de tipos      | ❌ Manual                | ✅ Con `{ transform }`   |
| Código extra (Boilerplate)   | Alto                     | Bajo                     |
 High                    | Low                      |