import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * ✅ Configuración global de la aplicación Angular.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Habilita la detección de cambios basada en zonas con coalescencia de eventos
     * para mejorar el rendimiento.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * Configuración del Router:
     * - withComponentInputBinding(): Permite que los parámetros de ruta se vinculen
     *   automáticamente a los 'input()' de los componentes.
     */
    provideRouter(routes, withComponentInputBinding()),

    /**
     * Habilita la hidratación en el cliente para aplicaciones SSR/Prerender.
     */
    provideClientHydration(withEventReplay()),

    /**
     * Provee el cliente HTTP para realizar peticiones externas.
     */
    provideHttpClient()
  ]
};
