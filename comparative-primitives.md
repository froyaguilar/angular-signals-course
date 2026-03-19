# Introducción a las Primitivas de Señales de Angular y Recursos Asíncronos

El sistema de reactividad de Angular se basa en un conjunto de potentes primitivas que permiten a los desarrolladores gestionar el estado y los efectos secundarios con un control y una eficiencia granulares. Estas primitivas varían en términos de su granularidad de reactividad, mutabilidad, tiempo de ejecución y casos de uso típicos. Algunas son partes fundamentales y estables del modelo reactivo central de Angular desde la versión 16, mientras que otras son características experimentales o próximas diseñadas para ampliar las capacidades, especialmente en lo que respecta al estado anidado y las operaciones asíncronas.

Comprender las diferencias entre estas primitivas ayuda a elegir la herramienta adecuada para modelar el estado, los datos derivados, los efectos reactivos o la integración con fuentes de datos asíncronas como peticiones HTTP u Observables.

A continuación, se presenta una breve descripción de cada primitiva y recurso, seguida de una tabla comparativa detallada.

---

### Breves explicaciones de las primitivas y APIs

- **signal()**  
  La primitiva reactiva fundamental que representa una unidad de estado. Contiene un valor que se puede leer y mutar. Los cambios en el signal notifican a todos los dependientes inmediatamente.

- **computed()**  
  Un valor derivado de solo lectura que se recalcula automáticamente cada vez que cambia cualquiera de sus señales dependientes. Ayuda a modelar valores calculados a partir de otros datos reactivos sin actualizaciones manuales.

- **effect()**  
  Ejecuta lógica reactiva imperativa siempre que cambian sus dependencias. Los efectos son ideales para realizar efectos secundarios como actualizar el DOM o realizar registros (logging) cuando se actualizan los datos reactivos.

- **linkedSignal()**  
  Una primitiva flexible que permite definir una lógica personalizada de obtención (getter) y establecimiento (setter) mientras se preserva el seguimiento reactivo. Útil para estados complejos o computados que necesitan un comportamiento de mutación controlado.

- **toSignal()**  
  Convierte fuentes reactivas externas, como Observables de RxJS o Promesas, en señales de Angular, tendiendo un puente entre el sistema reactivo de Angular y otras librerías o APIs reactivas.

- **afterRenderEffect()**  
  Similar a `effect()`, pero difiere la ejecución hasta después de que Angular haya completado el renderizado y la actualización del DOM. Esto es útil cuando la lógica reactiva depende del estado actualizado del DOM.

- **projectedSignal()**  
  Proporciona acceso reactivo y mutación a una única propiedad de nivel superior de un signal de objeto. Permite una reactividad granular centrada en propiedades específicas del objeto. Actualmente experimental.

- **deepSignal()**
  Extiende la reactividad a mayor profundidad en las propiedades de objetos anidados, rastreando los cambios en cualquier nivel anidado dentro de un objeto. Permite actualizaciones granulares sin reemplazar todo el objeto. Experimental.

- **structuralSignal()**  
  Rastrea los cambios en toda la referencia del objeto, ignorando las mutaciones internas. Útil cuando los cambios de identidad importan más que las mutaciones profundas. Experimental.

- **asReadonly()**  
  Envuelve un signal existente para proporcionar una interfaz de solo lectura, evitando la mutación externa pero permitiendo lecturas reactivas.

- **resource** (experimental)  
  Una primitiva reactiva diseñada para gestionar lógica asíncrona que depende de señales. Devuelve una variable reactiva que se actualiza a medida que se completan las operaciones asíncronas, con cancelación y seguimiento automáticos.

- **httpResource** (experimental)  
  Una versión especializada de `resource` que envuelve el `HttpClient` de Angular para realizar peticiones HTTP reactivas con soporte para caché y cancelación.

---

# Tabla Comparativa de Primitivas de Señales y Recursos de Angular

| API / Primitiva         | Granularidad de Reactividad      | ¿Mutable?      | Fase de Ejecución / Activador      | Origen / Qué hace                                   | Cuándo se ejecuta / Notifica                       | Tipo de Seguimiento de Dependencias                   | Compatibilidad Mínima (Estado)          |
|------------------------|--------------------------------|--------------|----------------------------------|-----------------------------------------------------|---------------------------------------------------|-------------------------------------------------------|-----------------------------------------|
| **signal()**           | Global (todo el valor)          | ✅ Sí       | Reactivo inmediato                | Estado base                                         | En `set()` / `update()`                            | Seguimiento automático al leer                        | Core (Angular 16+)                      |
| **computed()**         | Derivado (dependencias auto.)   | ❌ No        | Reactivo inmediato                | Valor derivado                                      | Cuando cambian las dependencias                   | Seguimiento automático dentro de `computed`           | Core (Angular 16+)                      |
| **effect()**           | Basado en las dependencias      | N/A          | Reactivo inmediato                | Lógica reactiva imperativa                        | Cada vez que cambian las dependencias             | Seguimiento automático de dependencias                | Core (Angular 16+)                      |
| **afterRenderEffect()**| Basado en dep. de lectura       | N/A          | **Post-render (DOM listo)**      | Efecto que espera a la actualización del DOM        | Tras el renderizado / vaciado (flush) del DOM     | Seguimiento auto.; ejecución post-render              | Core (Angular 19+)                      |
| **linkedSignal()**     | Compuesta / personalizada       | ✅ Sí       | Reactivo inmediato                | Signal con getter/setter personalizado              | Al leer/escribir                                  | Seguimiento de lectura auto.; escritura personalizada | Core (Angular 19+)                      |
| **toSignal()**         | Varía según la fuente           | — (solo lectura)| Reactivo inmediato                | Convierte Observables, Promesas, etc. en Signals   | Cuando cambia la fuente sincronizada             | Seguimiento desde fuente externa                      | Core (Angular 19+)                      |
| **projectedSignal()*** | Propiedad de primer nivel       | ✅ Sí       | Reactivo inmediato                | Manipula una propiedad específica de un objeto padre| Cuando cambian esa propiedad                      | Seguimiento limitado a la clave específica            | En PR (experimental) — no estable aún   |
| **deepSignal()***      | Propiedad de objeto anidado     | ✅ Sí       | Reactivo inmediato                | Manipula una propiedad anidada                      | Cuando cambia la propiedad anidada                | Seguimiento en la ruta específica                     | En PR (experimental) — no estable aún   |
| **structuralSignal()***| Objeto completo (referencia)    | ❌ No directo| Reactivo inmediato                | Vista de todo el objeto, ignora cambios granulares | Solo si cambia la referencia del objeto           | Seguimiento de referencia completa                    | En PR (experimental) — no estable aún   |
| **asReadonly()**       | Misma que el signal de origen   | ❌ No        | Misma que el origen               | Signal de solo lectura                              | Misma que el signal original                      | Seguimiento auto.; evita escrituras externas          | Core (Angular 16+)                      |


# Tabla Comparativa de Primitivas de Recursos de Angular 

| API / Primitiva         | Granularidad de Reactividad      | ¿Mutable?      | Fase de Ejecución / Activador      | Origen / Qué hace                                   | Cuándo se ejecuta / Notifica                       | Tipo de Seguimiento de Dependencias                   | Compatibilidad Mínima (Estado)          |
|------------------------|--------------------------------|--------------|----------------------------------|-----------------------------------------------------|---------------------------------------------------|-------------------------------------------------------|-----------------------------------------|
| **resource** (experimental)      | Variable (valor del recurso)    | —            | Reactivo (depende de señales)    | Ejecuta lógica asíncrona basada en señales         | Cuando cambia `params()` del recurso               | Seguimiento desde el signal de origen                 | Experimental (Angular 20+)               |
| **httpResource** (experimental)  | Variable (httpResource)         | —            | Reactivo (depende de señales)    | Envoltura sobre HttpClient para peticiones reactivas| Cuando cambia el signal de origen                 | Seguimiento de signal + HTTP                          | Experimental (Angular 20+)               |

