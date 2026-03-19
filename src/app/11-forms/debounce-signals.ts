// Créditos: https://www.learnbydo.ing/courses/angular/basics/signals-forms

import { Injector, Signal, assertInInjectionContext, inject, runInInjectionContext } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";

/**
 * ✅ debounceSignal: Utilidad para debouncing (retraso) de un signal.
 * Útil para evitar disparar demasiadas validaciones o peticiones HTTP
 * mientras el usuario escribe.
 * 
 * @param sig El signal original a observar.
 * @param debounce El tiempo de espera en ms (por defecto 400).
 * @param injector El inyector de dependencias (opcional).
 */
export const debounceSignal = <T>(sig: Signal<T>, debounce = 400, injector?: Injector) => {
  !injector && assertInInjectionContext(debounceSignal);
  injector ??= inject(Injector);
  
  return runInInjectionContext(injector, () => {
    // Convertimos el signal a observable, aplicamos debounceTime y volvemos a signal.
    return toSignal(
      toObservable(sig, { injector }).pipe(debounceTime(debounce)), 
      {
        initialValue: sig(),
        injector,
      }
    );
  });
};