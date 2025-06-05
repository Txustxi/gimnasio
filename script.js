// Clase para manejar la generación de rutinas
class TrainingGenerator {
    constructor() {
        this.exercises = null;
        this.exerciseCategories = {
            hipertrofia: [],
            fuerza: [],
            resistencia: [],
            perdida: []
        };
        this.savedPlans = JSON.parse(localStorage.getItem('trainingPlans') || '[]');
        this.loadExercises();
    }

    async loadExercises() {
        try {
            const response = await fetch('./exercises.json');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            this.exercises = data.exercises;
            this.initializeExerciseCategories();
        } catch (error) {
            console.error('Error al cargar ejercicios:', error);
            this.initializeDefaultExercises();
        }
    }

    initializeExerciseCategories() {
        if (!this.exercises) return;

        Object.values(this.exercises).forEach(exercise => {
            if (exercise.tipo === 'Compuesto') {
                this.exerciseCategories.hipertrofia.push(exercise);
                this.exerciseCategories.fuerza.push(exercise);
            }
            
            if (exercise.tipo === 'Aislado') {
                this.exerciseCategories.hipertrofia.push(exercise);
            }

            if (exercise.tipo === 'Cardio') {
                this.exerciseCategories.resistencia.push(exercise);
                this.exerciseCategories.perdida.push(exercise);
            }
        });
    }

    // Baraja un arreglo aleatoriamente
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    initializeDefaultExercises() {
        this.exercises = {
            "Sentadilla": {
                "nombre": "Sentadilla",
                "musculo": "Piernas",
                "tipo": "Compuesto",
                "dificultad": 3,
                "descripcion": "Ejercicio compuesto fundamental que trabaja principalmente cuádriceps, glúteos, isquiotibiales y espalda.",
                "ejecucion": [
                    "1. Coloca la barra en el soporte a la altura de los hombros.",
                    "2. Posiciona los pies a la anchura de los hombros y agarra la barra con las manos separadas al ancho de los hombros.",
                    "3. Retira la barra del soporte y da un paso atrás.",
                    "4. Mantén la espalda recta y la mirada al frente.",
                    "5. Flexiona las rodillas y baja el cuerpo como si fueras a sentarte en una silla.",
                    "6. Mantén los pies firmes en el suelo y la espalda recta durante todo el movimiento.",
                    "7. Baja hasta que las rodillas formen un ángulo de 90 grados aproximadamente.",
                    "8. Sube de nuevo empujando con los pies y extendiendo las rodillas.",
                    "9. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén la espalda recta y el pecho alto durante todo el movimiento.",
                    "No dejes que las rodillas se pasen de los dedos del pie.",
                    "Si eres principiante, comienza sin peso o con un peso ligero.",
                    "Enfócate en la técnica antes que en el peso."
                ]
            },
            "Press de Banca": {
                "nombre": "Press de Banca",
                "musculo": "Pecho",
                "tipo": "Compuesto",
                "dificultad": 3,
                "descripcion": "Ejercicio fundamental para trabajar el pecho, tríceps y hombros.",
                "ejecucion": [
                    "1. Acuéstate en el banco y agarra la barra con las manos separadas al ancho de los hombros.",
                    "2. Retira la barra del soporte y extiende los brazos sobre el pecho.",
                    "3. Mantén los pies firmes en el suelo y la espalda pegada al banco.",
                    "4. Baja la barra controladamente hasta que toque suavemente el pecho.",
                    "5. Mantén los codos ligeramente por debajo de la barra durante el descenso.",
                    "6. Empuja la barra hacia arriba con fuerza hasta extender completamente los brazos.",
                    "7. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén los pies firmes en el suelo durante todo el movimiento.",
                    "No rebotes la barra en el pecho.",
                    "Mantén los codos ligeramente por debajo de la barra durante el descenso.",
                    "Si eres principiante, comienza con un peso ligero o sin peso."
                ]
            },
            "Peso Muerto": {
                "nombre": "Peso Muerto",
                "musculo": "Espalda",
                "tipo": "Compuesto",
                "dificultad": 4,
                "descripcion": "Ejercicio compuesto que trabaja toda la espalda, glúteos, piernas y core.",
                "ejecucion": [
                    "1. Coloca la barra en el suelo y posiciona los pies a la anchura de los hombros.",
                    "2. Agarra la barra con las manos separadas al ancho de los hombros.",
                    "3. Mantén la espalda recta y la mirada al frente.",
                    "4. Sujeta la barra con firmeza y extiende las rodillas y caderas simultáneamente.",
                    "5. Levanta la barra manteniendo la espalda recta y los hombros hacia atrás.",
                    "6. Mantén el peso cerca del cuerpo durante el ascenso.",
                    "7. Baja el peso controladamente hasta que la barra toque el suelo.",
                    "8. Mantén la espalda recta durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén la espalda recta y el pecho alto durante todo el movimiento.",
                    "No redondees la espalda en ningún momento.",
                    "Mantén el peso cerca del cuerpo durante todo el movimiento.",
                    "Si eres principiante, comienza con un peso ligero y enfócate en la técnica."
                ]
            },
            "Fondos": {
                "nombre": "Fondos",
                "musculo": "Tríceps",
                "tipo": "Aislado",
                "dificultad": 2,
                "descripcion": "Ejercicio excelente para trabajar los tríceps y hombros.",
                "ejecucion": [
                    "1. Coloca las manos en las barras de los fondos, a la anchura de los hombros.",
                    "2. Extiende los brazos y levanta el cuerpo.",
                    "3. Mantén los codos ligeramente flexionados y la espalda recta.",
                    "4. Baja el cuerpo controladamente flexionando los codos.",
                    "5. Mantén los codos pegados al cuerpo durante el descenso.",
                    "6. Baja hasta que los codos formen un ángulo de 90 grados aproximadamente.",
                    "7. Sube de nuevo extendiendo los brazos completamente.",
                    "8. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén los codos pegados al cuerpo durante todo el movimiento.",
                    "No te dejes caer, baja controladamente.",
                    "Si eres principiante, comienza con asistencia o con un peso ligero.",
                    "Mantén el tronco recto durante todo el movimiento."
                ]
            },
            "Curl de Bíceps": {
                "nombre": "Curl de Bíceps",
                "musculo": "Bíceps",
                "tipo": "Aislado",
                "dificultad": 2,
                "descripcion": "Ejercicio fundamental para trabajar los bíceps.",
                "ejecucion": [
                    "1. Coloca los pies a la anchura de los hombros y agarra la barra con las manos separadas al ancho de los hombros.",
                    "2. Mantén los brazos extendidos y la espalda recta.",
                    "3. Baja la barra controladamente hasta que los brazos estén completamente extendidos.",
                    "4. Mantén los codos fijos durante todo el movimiento.",
                    "5. Sube la barra hasta que los bíceps estén completamente contraídos.",
                    "6. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén los codos fijos durante todo el movimiento.",
                    "No te balancees para levantar más peso.",
                    "Mantén el control durante todo el movimiento.",
                    "Si eres principiante, comienza con un peso ligero."
                ]
            },
            "Pullover": {
                "nombre": "Pullover",
                "musculo": "Pecho",
                "tipo": "Aislado",
                "dificultad": 2,
                "descripcion": "Ejercicio excelente para trabajar el pecho y espalda.",
                "ejecucion": [
                    "1. Acuéstate en el banco y agarra la barra con las manos separadas al ancho de los hombros.",
                    "2. Extiende los brazos hacia atrás manteniendo los codos ligeramente flexionados.",
                    "3. Baja la barra controladamente hasta que los brazos estén completamente extendidos.",
                    "4. Mantén los codos fijos durante todo el movimiento.",
                    "5. Sube la barra hasta que los brazos estén extendidos sobre el pecho.",
                    "6. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén los codos ligeramente flexionados durante todo el movimiento.",
                    "No te balancees para levantar más peso.",
                    "Mantén el control durante todo el descenso.",
                    "Si eres principiante, comienza con un peso ligero."
                ]
            },
            "Prensa de Piernas": {
                "nombre": "Prensa de Piernas",
                "musculo": "Piernas",
                "tipo": "Aislado",
                "dificultad": 2,
                "descripcion": "Ejercicio excelente para trabajar cuádriceps y glúteos.",
                "ejecucion": [
                    "1. Siéntate en la máquina de prensa y coloca los pies en la plataforma.",
                    "2. Mantén los pies a la anchura de los hombros.",
                    "3. Mantén la espalda pegada al respaldo y los pies firmes.",
                    "4. Flexiona las rodillas y baja la plataforma controladamente.",
                    "5. Mantén los pies firmes en la plataforma durante todo el movimiento.",
                    "6. Sube la plataforma empujando con los pies y extendiendo las rodillas.",
                    "7. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén los pies firmes en la plataforma durante todo el movimiento.",
                    "No dejes que las rodillas se pasen de los dedos del pie.",
                    "Mantén la espalda pegada al respaldo.",
                    "Si eres principiante, comienza con un peso ligero."
                ]
            },
            "Curl Martillo": {
                "nombre": "Curl Martillo",
                "musculo": "Bíceps",
                "tipo": "Aislado",
                "dificultad": 2,
                "descripcion": "Ejercicio excelente para trabajar los bíceps y los músculos del antebrazo.",
                "ejecucion": [
                    "1. Coloca los pies a la anchura de los hombros y agarra las mancuernas con las palmas hacia dentro.",
                    "2. Mantén los brazos extendidos y la espalda recta.",
                    "3. Baja las mancuernas controladamente hasta que los brazos estén completamente extendidos.",
                    "4. Mantén los codos fijos durante todo el movimiento.",
                    "5. Sube las mancuernas hasta que los bíceps estén completamente contraídos.",
                    "6. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén los codos fijos durante todo el movimiento.",
                    "No te balancees para levantar más peso.",
                    "Mantén el control durante todo el movimiento.",
                    "Si eres principiante, comienza con un peso ligero."
                ]
            },
            "Front Squat": {
                "nombre": "Front Squat",
                "musculo": "Piernas",
                "tipo": "Compuesto",
                "dificultad": 4,
                "descripcion": "Variante de la sentadilla que trabaja principalmente cuádriceps y core.",
                "ejecucion": [
                    "1. Coloca la barra en el soporte a la altura de los hombros.",
                    "2. Posiciona los pies a la anchura de los hombros y agarra la barra con las manos separadas al ancho de los hombros.",
                    "3. Retira la barra del soporte y da un paso atrás.",
                    "4. Mantén la espalda recta y la mirada al frente.",
                    "5. Flexiona las rodillas y baja el cuerpo como si fueras a sentarte en una silla.",
                    "6. Mantén los pies firmes en el suelo y la espalda recta durante todo el movimiento.",
                    "7. Baja hasta que las rodillas formen un ángulo de 90 grados aproximadamente.",
                    "8. Sube de nuevo empujando con los pies y extendiendo las rodillas.",
                    "9. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén la espalda recta y el pecho alto durante todo el movimiento.",
                    "No dejes que las rodillas se pasen de los dedos del pie.",
                    "Si eres principiante, comienza sin peso o con un peso ligero.",
                    "Enfócate en la técnica antes que en el peso."
                ]
            },
            "Overhead Press": {
                "nombre": "Overhead Press",
                "musculo": "Hombros",
                "tipo": "Compuesto",
                "dificultad": 4,
                "descripcion": "Ejercicio excelente para trabajar los hombros y tríceps.",
                "ejecucion": [
                    "1. Coloca la barra en el soporte a la altura de los hombros.",
                    "2. Agarra la barra con las manos separadas al ancho de los hombros.",
                    "3. Retira la barra del soporte y da un paso atrás.",
                    "4. Mantén la espalda recta y la mirada al frente.",
                    "5. Levanta la barra controladamente hasta que los brazos estén completamente extendidos.",
                    "6. Mantén los codos ligeramente flexionados durante el ascenso.",
                    "7. Baja la barra controladamente hasta que toque suavemente el pecho.",
                    "8. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén la espalda recta y el pecho alto durante todo el movimiento.",
                    "No te balancees para levantar más peso.",
                    "Mantén los codos ligeramente flexionados durante el ascenso.",
                    "Si eres principiante, comienza con un peso ligero."
                ]
            },
            "Burpees": {
                "nombre": "Burpees",
                "musculo": "Completo",
                "tipo": "Cardio",
                "dificultad": 3,
                "descripcion": "Ejercicio de alta intensidad que trabaja todo el cuerpo.",
                "ejecucion": [
                    "1. Inicia en posición de pie.",
                    "2. Agáchate y coloca las manos en el suelo.",
                    "3. Salta las piernas hacia atrás entrando en posición de flexión.",
                    "4. Realiza una flexión.",
                    "5. Salta las piernas hacia adelante.",
                    "6. Salta hacia arriba extendiendo los brazos.",
                    "7. Aterrizar suavemente y repetir el movimiento."
                ],
                "consejos": [
                    "Mantén el control durante todo el movimiento.",
                    "Si eres principiante, puedes omitir el salto inicial.",
                    "Mantén el core activo durante todo el movimiento.",
                    "Enfócate en la técnica antes que en la velocidad."
                ]
            },
            "Mountain Climbers": {
                "nombre": "Mountain Climbers",
                "musculo": "Completo",
                "tipo": "Cardio",
                "dificultad": 3,
                "descripcion": "Ejercicio de alta intensidad que trabaja todo el cuerpo.",
                "ejecucion": [
                    "1. Inicia en posición de flexión.",
                    "2. Mantén la espalda recta y los brazos extendidos.",
                    "3. Alterna las piernas rápidamente como si estuvieras corriendo.",
                    "4. Mantén el core activo durante todo el movimiento.",
                    "5. Mantén una cadencia constante.",
                    "6. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén la espalda recta durante todo el movimiento.",
                    "Si eres principiante, puedes empezar con un ritmo más lento.",
                    "Mantén el core activo durante todo el movimiento.",
                    "Enfócate en la técnica antes que en la velocidad."
                ]
            },
            "Jumping Jacks": {
                "nombre": "Jumping Jacks",
                "musculo": "Completo",
                "tipo": "Cardio",
                "dificultad": 2,
                "descripcion": "Ejercicio de calentamiento y cardio básico.",
                "ejecucion": [
                    "1. Inicia en posición de pie con los brazos a los lados.",
                    "2. Salta y separa los pies mientras elevas los brazos.",
                    "3. Salta y junta los pies mientras bajas los brazos.",
                    "4. Mantén el core activo durante todo el movimiento.",
                    "5. Mantén una cadencia constante.",
                    "6. Mantén el control durante todo el movimiento."
                ],
                "consejos": [
                    "Mantén la espalda recta durante todo el movimiento.",
                    "Si eres principiante, puedes empezar sin saltar.",
                    "Mantén el core activo durante todo el movimiento.",
                    "Enfócate en la técnica antes que en la velocidad."
                ]
            }
        };
        this.initializeExerciseCategories();
    }

    async generatePlan(data) {
        if (!this.exercises) {
            await this.loadExercises();
            if (!this.exercises) {
                return 'Error: No se pudieron cargar los ejercicios';
            }
        }

        const goal = data.goal;
        const experience = data.experience;
        const days = parseInt(data.days);
        const timePerSession = parseInt(data.time);
        
        // Obtener ejercicios para el objetivo seleccionado
        const exercisesForGoal = this.exerciseCategories[goal];
        if (!exercisesForGoal || exercisesForGoal.length === 0) {
            return 'Error: No hay ejercicios disponibles para este objetivo';
        }

        // Filtrar ejercicios según nivel de experiencia
        const minDifficulty = experience === 'principiante' ? 1 : 
                            experience === 'intermedio' ? 2 : 3;
        let filteredExercises = exercisesForGoal.filter(ex => ex.dificultad >= minDifficulty);

        if (filteredExercises.length === 0) {
            return 'Error: No hay ejercicios disponibles para tu nivel de experiencia';
        }

        // Calcular series, repeticiones y descansos basados en objetivo
        const sets = experience === 'principiante' ? 3 : 
                    experience === 'intermedio' ? 4 : 5;
        
        const reps = goal === 'fuerza' ? 3 : 
                    goal === 'hipertrofia' ? 8 : 
                    goal === 'resistencia' ? 12 : 15;

        const rest = goal === 'fuerza' ? '3-4 minutos' :
                    goal === 'hipertrofia' ? '2-3 minutos' :
                    '1-2 minutos';

        // Cantidad fija de ejercicios por día
        const exercisesPerDay = 8;

        // Distribuir ejercicios por días
        let plan = `<div class="training-plan">
            <h3>Tu Rutina Semanal</h3>
            <p><strong>Nivel de experiencia:</strong> ${experience}</p>
            <p><strong>Objetivo:</strong> ${goal}</p>
            <p><strong>Días de entrenamiento:</strong> ${days}</p>
            <p><strong>Tiempo por sesión:</strong> ${timePerSession} minutos</p>
        `;

        // Mezclar y preparar ejercicios
        let exercisesPool = this.shuffleArray([...filteredExercises]);

        let exerciseIndex = 0;

        for (let day = 1; day <= days; day++) {
            plan += `<div class="training-day">
                <h4>Día ${day}</h4>
                <div class="warmup">
                    <h5>Calentamiento</h5>
                    <ul>
                        <li>5-10 minutos de cardio ligero</li>
                        <li>Movilidad articular y activaciones</li>
                    </ul>
                </div>
                <div class="exercises-list">`;

            const dayExercises = [];
            while (dayExercises.length < exercisesPerDay) {
                if (exerciseIndex >= exercisesPool.length) {
                    exerciseIndex = 0;
                    exercisesPool = this.shuffleArray([...filteredExercises]);
                }

                const candidate = exercisesPool[exerciseIndex];
                exerciseIndex++;

                if (!dayExercises.some(ex => ex.nombre === candidate.nombre)) {
                    dayExercises.push(candidate);
                }
            }

            dayExercises.forEach(exercise => {
                const executionSteps = exercise.ejecucion ? exercise.ejecucion.map(step => `<li>${step}</li>`).join('') : '';
                const tips = exercise.consejos ? exercise.consejos.map(tip => `<li>${tip}</li>`).join('') : '';

                plan += `<div class="exercise">
                    <h5>${exercise.nombre}</h5>
                    <p><strong>Músculos:</strong> ${exercise.musculo}</p>
                    <p><strong>Tipo:</strong> ${exercise.tipo}</p>
                    <p><strong>Series/Repeticiones:</strong> ${sets}x${reps}</p>
                    <p><strong>Descanso:</strong> ${rest}</p>
                    ${exercise.ejecucion ? `<div class="execution">
                        <h6>Ejecución:</h6>
                        <ol>
                            ${executionSteps}
                        </ol>
                    </div>` : ''}
                    ${exercise.consejos ? `<div class="tips">
                        <h6>Consejos:</h6>
                        <ul>
                            ${tips}
                        </ul>
                    </div>` : ''}
                </div>`;
            });

            plan += `</div>
                <div class="cooldown">
                    <h5>Vuelta a la calma</h5>
                    <ul>
                        <li>Estiramientos estáticos 5-10 minutos</li>
                        <li>Respiración controlada</li>
                    </ul>
                </div>
            </div>`;
        }

        // Agregar recomendaciones generales
        const recommendations = `
            <div class="recommendations">
                <h4>Recomendaciones Generales</h4>
                <ul>
                    <li>Realiza un calentamiento adecuado antes de cada sesión.</li>
                    <li>Mantén una buena técnica en todos los ejercicios.</li>
                    <li>Escucha a tu cuerpo y no te fuerces más allá de tus límites.</li>
                    <li>Progresiona gradualmente en peso y volumen.</li>
                    <li>Mantén una buena hidratación y alimentación.</li>
                    <li>Duerme bien para una mejor recuperación.</li>
                </ul>
            </div>
        `;

        plan += `${recommendations}</div>`;
        return plan;
    }

    savePlan(html, data) {
        const savedPlan = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            data: data,
            html: html
        };

        this.savedPlans.unshift(savedPlan);
        localStorage.setItem('trainingPlans', JSON.stringify(this.savedPlans));
        return savedPlan;
    }

    getSavedPlans() {
        this.savedPlans = JSON.parse(localStorage.getItem('trainingPlans') || '[]');
        return this.savedPlans;
    }

    loadSavedPlans() {
        return JSON.parse(localStorage.getItem('trainingPlans') || '[]');
    }
}

// Manejador de eventos
document.addEventListener('DOMContentLoaded', () => {
    const generator = new TrainingGenerator();
    const form = document.getElementById('trainingForm');
    const resultsSection = document.getElementById('results-section');
    const trainingPlanDiv = document.getElementById('training-plan');
    const exportPDFBtn = document.getElementById('exportPDF');
    const saveBtn = document.getElementById('savePlan');
    const shareBtn = document.getElementById('sharePlan');
    const savedPlansSection = document.getElementById('saved-plans');
    const plansList = document.getElementById('plans-list');

    // Validación de campos
    const validateForm = () => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        let isValid = true;
        const errors = [];

        // Validaciones específicas
        if (data.age < 16 || data.age > 99) {
            errors.push('La edad debe estar entre 16 y 99 años');
        }

        if (data.weight < 30 || data.weight > 300) {
            errors.push('El peso debe estar entre 30 y 300 kg');
        }

        if (data.time < 30 || data.time > 180) {
            errors.push('El tiempo por sesión debe estar entre 30 y 180 minutos');
        }

        // Verificar si todos los campos requeridos están completos
        const requiredFields = ['age', 'gender', 'weight', 'squat', 'bench', 'deadlift', 'experience', 'goal', 'days', 'time'];
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            errors.push('Por favor, completa todos los campos requeridos');
        }

        if (errors.length > 0) {
            isValid = false;
            alert(errors.join('\n'));
        }

        return isValid;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        // Generar plan
        const plan = await generator.generatePlan(data);
        trainingPlanDiv.innerHTML = plan;
        resultsSection.classList.remove('hidden');

        // Mostrar planes guardados
        savedPlansSection.classList.remove('hidden');
        updatePlansList();
    });

    // Exportar a PDF
    exportPDFBtn.addEventListener('click', () => {
        const element = document.getElementById('training-plan');
        const opt = {
            margin: 1,
            filename: 'rutina-entrenamiento.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Guardar plan
    saveBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        const plan = trainingPlanDiv.innerHTML;
        generator.savePlan(plan, data);
        updatePlansList();
        alert('Rutina guardada exitosamente');
    });

    // Compartir plan
    shareBtn.addEventListener('click', () => {
        const plan = trainingPlanDiv.innerHTML;
        const shareData = {
            title: 'Mi Rutina de Entrenamiento',
            text: '¡Comparto mi rutina de entrenamiento personalizada!',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .catch(console.error);
        } else {
            alert('La función de compartir no está disponible en tu navegador');
        }
    });

    // Función para actualizar la lista de planes guardados
    const updatePlansList = () => {
        const plans = generator.getSavedPlans();
        plansList.innerHTML = '';

        plans.forEach(plan => {
            const planCard = document.createElement('div');
            planCard.className = 'plan-card';
            planCard.innerHTML = `
                <h4>Rutina del ${plan.date}</h4>
                <p>Objetivo: ${plan.data.goal}</p>
                <p>Nivel: ${plan.data.experience}</p>
                <p>Días: ${plan.data.days}</p>
                <button class="btn-secondary view-plan" data-id="${plan.id}">
                    <i class="fas fa-eye"></i> Ver Plan
                </button>
            `;
            plansList.appendChild(planCard);
        });

        // Agregar evento para ver planes guardados
        document.querySelectorAll('.view-plan').forEach(button => {
            button.addEventListener('click', (e) => {
                const planId = parseInt(e.target.dataset.id, 10);
                const plan = generator.getSavedPlans().find(p => p.id === planId);
                if (plan) {
                    trainingPlanDiv.innerHTML = plan.html;
                    resultsSection.classList.remove('hidden');
                }
            });
        });
    };

    // Mostrar planes guardados al cargar la página
    updatePlansList();
});
