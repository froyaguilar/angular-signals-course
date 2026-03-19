import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-classic',
  standalone: true,
  template: `
    <h2>Router Clásico (con Observables)</h2>
    <p>ID de Usuario = {{ userId }}</p>
    <button (click)="goNext()">Ir al siguiente usuario</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserClassicComponent implements OnInit, OnDestroy {
  /**
   * Propiedad normal para almacenar el ID. 
   * No es reactiva, por lo que OnPush no la detectará automáticamente.
   */
  userId!: number;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  /**
   * ❌ Necesitamos gestionar manualmente las suscripciones para evitar fugas de memoria.
   */
  private subs = new Subscription();

  ngOnInit() {
    /**
     * ❌ Los parámetros de la ruta son Observables. 
     * Debemos suscribirnos y luego forzar la detección de cambios.
     */
    this.subs.add(this.route.paramMap.subscribe(pm => {
      this.userId = +pm.get('id')!;
      this.cdr.markForCheck(); // ❌ Necesario con OnPush
    }));
  }

  ngOnDestroy() {
    /**
     * ❌ Limpieza manual obligatoria.
     */
    this.subs.unsubscribe();
  }

  goNext() {
    const nextId = (this.userId || 0) + 1;
    this.router.navigateByUrl(`/router-without-signal/user/${nextId}`);
  }
}
