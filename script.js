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
            const response = await fetch('exercises.json');
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
        const exercisesPerDay = Math.max(3, Math.ceil(exercisesPool.length / days));
        let exerciseIndex = 0;

        for (let day = 1; day <= days; day++) {
            plan += `<div class="day">
                <h4>Día ${day}</h4>
                <div class="exercises-list">`;

            const dayExercises = [];
            for (let i = 0; i < exercisesPerDay; i++) {
                if (exerciseIndex >= exercisesPool.length) {
                    exerciseIndex = 0;
                    exercisesPool = this.shuffleArray([...exercisesPool]);
                }
                dayExercises.push(exercisesPool[exerciseIndex]);
                exerciseIndex++;
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
        plan += recommendations;
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
