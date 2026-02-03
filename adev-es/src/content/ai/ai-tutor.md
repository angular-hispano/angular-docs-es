# Tutor de IA de Angular

El Tutor de IA de Angular está diseñado para guiarte interactivamente paso a paso a través de la construcción de una aplicación Angular moderna y completa desde cero. Aprenderás los patrones más recientes y las mejores prácticas construyendo un proyecto real y tangible: una **"Caja de Recetas Inteligente"** para crear y gestionar recetas.

Nuestro objetivo es fomentar el pensamiento crítico y ayudarte a retener lo que aprendes. En lugar de simplemente darte código, el tutor explicará conceptos, te mostrará ejemplos y luego te dará ejercicios específicos del proyecto para que los resuelvas por tu cuenta.

## Primeros Pasos

Puedes acceder al tutor de IA a través del [servidor MCP de Angular](ai/mcp).

1. [Instala](ai/mcp#get-started) el servidor MCP de Angular
2. Crea un nuevo proyecto Angular `ng new <nombre-proyecto>`
3. Navega a tu nuevo proyecto (`cd <nombre-proyecto>`) en un editor o herramienta con IA, como [Gemini CLI](https://geminicli.com/)
4. Ingresa un prompt como `inicia el Tutor de IA de Angular`
   ![Una captura de pantalla que demuestra cómo iniciar el Tutor de IA de Angular en Gemini CLI.](assets/images/launch-ai-tutor.png 'Iniciar el Tutor de IA de Angular')

## Usando el Tutor de IA

Cada módulo comienza con una breve explicación del concepto.
![Una captura de pantalla del Tutor de IA de Angular presentando una breve explicación del concepto.](assets/images/ai-tutor-preview-1.png 'Explicación del Tutor de IA de Angular')
Si es aplicable, el tutor presentará un ejemplo de código para demostrar el concepto.
![Una captura de pantalla del Tutor de IA de Angular mostrando un ejemplo de código.](assets/images/ai-tutor-preview-2.png 'Ejemplo de código del Tutor de IA de Angular')
El tutor también proporcionará un ejercicio abierto para probar tu comprensión.
![Una captura de pantalla del Tutor de IA de Angular proporcionando un ejercicio.](assets/images/ai-tutor-preview-3.png 'Ejercicio del Tutor de IA de Angular')
Finalmente, el tutor verificará tu trabajo antes de pasar al siguiente módulo.
![Una captura de pantalla del Tutor de IA de Angular verificando el trabajo del usuario.](assets/images/ai-tutor-preview-4.png 'Verificación del Tutor de IA de Angular')

## Cómo Funciona: El Ciclo de Aprendizaje

Para cada nuevo tema, seguirás un ciclo de aprendizaje que enfatiza el pensamiento crítico para ayudarte a retener mejor lo que aprendes.

1. **Aprende el Concepto:** El tutor explicará brevemente una característica central de Angular y te mostrará un ejemplo de código genérico para ilustrarla.
2. **Aplica tu Conocimiento:** Inmediatamente obtendrás un ejercicio práctico. El tutor presenta estos ejercicios a alto nivel con objetivos y resultados esperados, animándote a pensar en la solución por ti mismo.
3. **Obtén Retroalimentación y Apoyo:** Cuando estés listo, avísale al tutor. Este **leerá automáticamente los archivos de tu proyecto** para verificar que tu solución sea correcta. Si te quedas atascado, tienes el control completo. Puedes pedir una **"pista"** para más orientación, u obtener instrucciones paso a paso escribiendo **"guía detallada"** o **"instrucciones paso a paso"**.

Una vez que hayas tenido éxito, el tutor pasará directamente al siguiente tema. También puedes pedirle al tutor más información sobre un tema o hacer cualquier pregunta relacionada con Angular en cualquier momento.

---

## **Características y Comandos**

Tienes el control de tu experiencia de aprendizaje. Usa estas características en cualquier momento:

### **Salir y Volver**

Siéntete libre de tomar un descanso. Tu progreso está vinculado al código de tu proyecto. Cuando regreses para una nueva sesión, el tutor analizará automáticamente tus archivos para determinar exactamente dónde lo dejaste, permitiéndote retomar sin problemas justo donde estabas.

**Consejo Pro:** Recomendamos encarecidamente usar Git para guardar tu progreso. Después de completar un módulo, es una buena idea hacer commit de tus cambios (por ejemplo, `git commit -m "Complete Phase 1, Module 8"`). Esto actúa como un punto de control personal al que siempre puedes volver.

### **Ajusta tu Nivel de Experiencia**

Puedes establecer tu nivel de experiencia en **Principiante (1-3)**, **Intermedio (4-7)**, o **Experimentado (8-10)**. Puedes cambiar esta configuración en cualquier momento durante tu sesión, y el tutor adaptará inmediatamente su estilo de enseñanza para coincidir.

**Ejemplos de Prompts:**

- "Establece mi nivel de experiencia en principiante."
- "Cambia mi calificación a 8."

### **Ver el Plan de Aprendizaje Completo**

¿Quieres ver el panorama general o verificar qué tan lejos has llegado? Solo pide la tabla de contenidos.

**Ejemplos de Prompts:**

- "¿Dónde estamos?"
- "Muestra la tabla de contenidos."
- "Muestra el plan."

El tutor mostrará el plan de aprendizaje completo y marcará tu ubicación actual.

### **Una Nota sobre los Estilos**

El tutor aplicará estilos básicos a tu aplicación para mantener las cosas con un aspecto limpio. Te animamos encarecidamente a aplicar tus propios estilos para hacer la aplicación tuya.

### **Saltar el Módulo Actual**

Si prefieres pasar al siguiente tema en el camino de aprendizaje, puedes pedirle al tutor que salte el ejercicio actual.

**Ejemplos de Prompts:**

- "Omite esta sección."
- "Auto-completa este paso por mí."

El tutor pedirá confirmación y luego te presentará la solución de código completa para el módulo actual e intentará aplicar automáticamente cualquier actualización requerida para asegurar que puedas continuar sin problemas con el siguiente módulo.

### **Saltar a Cualquier Tema**

Si quieres aprender sobre un tema específico fuera de orden (por ejemplo, saltar de los básicos a formularios), puedes hacerlo. El tutor proporcionará el código necesario para actualizar tu proyecto al punto de inicio correcto para el módulo seleccionado e intentará aplicar automáticamente cualquier actualización requerida.

**Ejemplos de Prompts:**

- "Llévame a la lección de formularios."
- "Quiero aprender sobre Route Guards ahora."
- "Salta a la sección sobre Servicios."

---

## **Solución de Problemas**

Si el tutor no responde correctamente o sospechas un problema con tu aplicación, aquí hay algunas cosas que puedes intentar:

1. **Escribe "continuar":** Esto a menudo puede impulsar al tutor a continuar al siguiente paso en caso de que se quede atascado.
2. **Corrige al Tutor:** Si el tutor se equivoca sobre tu progreso (por ejemplo, dice que estás en el Módulo 3 pero has completado el Módulo 8), simplemente díselo. Por ejemplo: _"En realidad estoy en el Módulo 8."_ El tutor reevaluará tu código y se ajustará.
3. **Verifica tu UI:** Si quieres confirmar cómo debería verse la interfaz de usuario de tu aplicación, solo pregúntale al tutor. Por ejemplo: _"¿Qué debería ver en mi UI?"_
4. **Recarga la Ventana del Navegador:** Una actualización puede resolver muchos problemas relacionados con tu aplicación.
5. **Reinicio Completo del Navegador:** Los errores a veces solo se muestran en la consola de desarrollador del navegador. Un reinicio completo puede ayudar a limpiar problemas subyacentes relacionados con la aplicación.
6. **Inicia un Nuevo Chat:** Siempre puedes iniciar un nuevo chat para eliminar el historial existente y comenzar de nuevo. El tutor leerá tus archivos para encontrar el último paso en el que estabas.

## **Tu Viaje de Aprendizaje: El Camino por Fases**

Construirás tu aplicación a lo largo de un viaje de cuatro fases. Puedes seguir este camino de principio a fin para crear una aplicación Angular completa y totalmente funcional. Cada módulo se construye lógicamente sobre el anterior, llevándote desde los básicos hasta características avanzadas del mundo real.

**Una Nota sobre la Configuración Automatizada:** Algunos módulos requieren un paso de configuración, como crear interfaces o datos de prueba. En estos casos, el tutor te presentará el código e instrucciones de archivo. Serás responsable de crear y modificar estos archivos según las instrucciones antes de que comience el ejercicio.

### **Fase 1: Fundamentos de Angular**

- **Módulo 1:** Primeros Pasos
- **Módulo 2:** Texto Dinámico con Interpolación
- **Módulo 3:** Escuchadores de Eventos (`(click)`)

### **Fase 2: Estado y Signals**

- **Módulo 4:** Gestión de Estado con Writable Signals (Parte 1: `set`)
- **Módulo 5:** Gestión de Estado con Writable Signals (Parte 2: `update`)
- **Módulo 6:** Computed Signals

### **Fase 3: Arquitectura de Componentes**

- **Módulo 7:** Enlace de Plantilla (Propiedades y Atributos)
- **Módulo 8:** Creando y Anidando Componentes
- **Módulo 9:** Entradas de Componentes con Signals
- **Módulo 10:** Estilizando Componentes
- **Módulo 11:** Renderizado de Listas con `@for`
- **Módulo 12:** Renderizado Condicional con `@if`

### **Fase 4: Características Avanzadas y Arquitectura**

- **Módulo 13:** Enlace Bidireccional
- **Módulo 14:** Servicios e Inyección de Dependencias (DI)
- **Módulo 15:** Enrutamiento Básico
- **Módulo 16:** Introducción a los Formularios
- **Módulo 17:** Introducción a Angular Material

---

## **Una Nota sobre IA y Retroalimentación**

Este tutor está impulsado por un Modelo de Lenguaje Grande (LLM). Aunque hemos trabajado arduamente para hacerlo un experto, las IAs pueden cometer errores. Si encuentras una explicación o ejemplo de código que parece incorrecto, por favor háganoslo saber. Puedes corregir al tutor, y este usará tu retroalimentación para ajustar su respuesta.

Para cualquier error técnico o solicitud de características, por favor [envía un issue](https://github.com/angular/angular-cli/issues).
