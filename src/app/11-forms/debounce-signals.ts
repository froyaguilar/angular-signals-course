// Credits: https://www.learnbydo.ing/courses/angular/basics/signals-forms

import { Injector, Signal, assertInInjectionContext, inject, runInInjectionContext } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

import { debounceTime } from "rxjs";

export const debounceSignal = <T>(sig: Signal<T>, debounce = 400, injector?: Injector) => {
  !injector && assertInInjectionContext(debounceSignal);
  injector ??= inject(Injector);
  return runInInjectionContext(injector, () => {
    return toSignal(toObservable(sig, { injector }).pipe(debounceTime(debounce)), {
      initialValue: sig(),
      injector,
    });
  });
};