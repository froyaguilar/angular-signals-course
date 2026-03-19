# 🌟 Curso de Signals en Angular – Aprende a dominar el Estado Reactivo

Bienvenido al **Curso de Signals en Angular**, tu guía práctica para dominar la nueva **API de Signals** en Angular. Este curso cubre todos los conceptos básicos que necesitas para construir aplicaciones rápidas, reactivas y fáciles de mantener utilizando Signals para la gestión del estado y la detección de cambios.

> 🚀 Ideal para desarrolladores de Angular que quieran modernizar sus conocimientos y avanzar más allá de los patrones tradicionales de RxJS.

---

## 🎥 Mira el curso en YouTube

¿Prefieres aprender con videos? Sigue nuestro **curso gratuito en YouTube**. Los videos están en español 🇪🇸 y están diseñados para que cualquiera pueda seguirlos fácilmente.

📺 [Mira el Video-Curso de Angular Signals en YouTube](https://www.youtube.com/playlist?list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0)

---

## 📁 Estructura del Curso

Cada lección corresponde a una carpeta dentro de `src/app`, nombrada numéricamente (`00`, `01`, `02`, etc.) para mayor claridad y aprendizaje secuencial. Puedes explorar cada ejemplo de forma independiente o seguir el orden sugerido.

| #  | Descripción de la Lección                                                          | Ruta del Código                    | Video         |
|:--:|-------------------------------------------------------------------------------------|:----------------------------------:|:--------------|
| 00 | [Introducción a la Detección de Cambios](src/app/00-change-detection/README.md)     | `src/app/00-change-detection`      | [Enlace](https://youtu.be/rr0AstaFLV8?si=PmZ4skLuZ2s6iyww) |
| 01 | [Signals de Escritura y solo lectura](src/app/01-counter-signal/README.md)        | `src/app/01-counter-signal`        | [Enlace](https://www.youtube.com/watch?v=BcpAFtGm2FY&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=2) |
| 02 | [Computed Signals (Señales Computadas)](src/app/02-counter-computed/README.md)      | `src/app/02-counter-computed`      | [Enlace](https://www.youtube.com/watch?v=-z2hbTBAvdc&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=3) |
| 03 | [Effects (Efectos)](src/app/03-counter-effect/README.md)                          | `src/app/03-counter-effect`        | [Enlace](https://www.youtube.com/watch?v=zT6Kr0eVZxI&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=4) |
| 04 | [API de LinkedSignal](src/app/04-linked-signal/README.md)                         | `src/app/04-linked-signal`         | [Enlace](https://www.youtube.com/watch?v=IHXK4xUU48Q&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=5) |
| 05 | [Entradas/Salidas con Signals (Input/Output)](src/app/05-input-output-signal/README.md) | `src/app/05-input-output-signal`   | [Enlace](https://www.youtube.com/watch?v=emMRF_6GKuw&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=6) |
| 06 | [Doble Enlace de Datos (Two-Way Binding)](src/app/06-double-data-binding/README.md) | `src/app/06-double-data-binding`   | [Enlace](https://www.youtube.com/watch?v=SDDArJ9NaLg&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=7) |
| 07 | [Queries con Signals (ViewChild, etc.)](src/app/07-queries-signal/README.md)       | `src/app/07-queries-signal`        | [Enlace](https://www.youtube.com/watch?v=ypZuNBslT7s&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=8) |
| 08 | [Integración con el Router](src/app/08-router/README.md)                          | `src/app/08-router`                | [Enlace](https://www.youtube.com/watch?v=5FiRABxIo-8&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=9) |
| 09 | [Patrones Asíncronos y Fetching (Resource)](src/app/09-async/README.md)           | `src/app/09-async`                 | [Enlace](https://www.youtube.com/watch?v=0dfp1hCWE1I&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=10) |
| 10 | [Interoperabilidad con RxJS](src/app/10-rxjs-interop/README.md)                    | `src/app/10-rxjs-interop`          | [Enlace](https://www.youtube.com/watch?v=8GHbVGuaFjU&list=PLcrGLrk890EFdWH31N-R8ymPxCGyi29w0&index=11) |
| 11 | [Formularios con Signals](src/app/11-forms/README.md)                             | `src/app/11-signal-forms`          | Próximamente |

---

## 🛠️ Comenzando

Sigue estos pasos para ejecutar el curso localmente en tu máquina:

```bash
# 1. Clonar el repositorio
git clone https://github.com/your-repo/angular-signals-course.git

# 2. Navegar a la carpeta del proyecto
cd angular-signals-course

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
ng serve
```

5. Abre tu navegador y dirígete a `http://localhost:4200`.

## 💡 Consejos

- Puedes saltar a cualquier lección directamente a través de la URL o la navegación de la aplicación.
- Cada carpeta contiene un `README.md` con explicaciones y código en vivo.
- Sigue la serie de videos para ver los ejemplos en tiempo real.

--- 

## 🔍 Visión Comparativa de las Primitivas de Angular Signals

Para profundizar tu comprensión de las primitivas reactivas de Angular, ofrecemos una guía comparativa detallada que cubre la API de Signals y las extensiones experimentales. Esta guía explica su granularidad de reactividad, capacidades de mutación, tiempos de ejecución, casos de uso típicos y estado de madurez.

Puedes explorar esta comparación completa y las explicaciones técnicas en el archivo:

📄 [Guía Comparativa de Primitivas de Angular Signals](comparative-primitives.md)

Este recurso te ayudará a elegir la primitiva correcta para tus necesidades específicas de gestión de estado y a aprovechar todo el poder reactivo de Angular.

---

🎓 **¡Feliz aprendizaje!**  
Si este material te resulta útil, considera darle una ⭐ al repositorio o compartirlo con tu comunidad de Angular.

## 🤝 Colaboraciones

¿Estás interesado en un **taller en vivo**, una **charla técnica** o una **sesión de entrenamiento personalizada** sobre Angular para tu equipo?

Estoy disponible para colaboraciones, formación corporativa, conferencias y creación de contenido relacionado con **Angular**, **desarrollo web moderno** y **mejores prácticas de ingeniería de software**.

Si deseas discutir una posible colaboración, no dudes en contactarme a través del formulario de contacto en mi sitio web:  
🔗 [carloscaballero.io](https://carloscaballero.io)

¡Construyamos algo increíble juntos!
