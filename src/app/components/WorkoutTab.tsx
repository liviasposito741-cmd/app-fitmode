"use client"

import { useState, useEffect } from "react"
import { Check, Play, RefreshCw, Weight, ChevronDown, ChevronUp, Calendar, Dumbbell, Trophy, Flame, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  videoUrl: string
  completed: boolean
  weights: number[]
  caloriesBurn: number
  muscleGroup: string
}

interface WeeklyWorkout {
  day: string
  dayNumber: number
  focus: string
  exercises: Exercise[]
  isToday: boolean
}

// Banco completo de exercícios por grupo muscular
const exerciseDatabase: Record<string, Exercise[]> = {
  chest: [
    {
      id: "chest-1",
      name: "Supino Reto",
      sets: 4,
      reps: "8-12",
      videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
      completed: false,
      weights: [0, 0, 0, 0],
      caloriesBurn: 45,
      muscleGroup: "chest"
    },
    {
      id: "chest-2",
      name: "Supino Inclinado",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/SrqOu55lrYU",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 38,
      muscleGroup: "chest"
    },
    {
      id: "chest-3",
      name: "Crucifixo com Halteres",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/eozdVDA78K0",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 32,
      muscleGroup: "chest"
    },
    {
      id: "chest-4",
      name: "Flexão de Braço",
      sets: 3,
      reps: "15-20",
      videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 30,
      muscleGroup: "chest"
    }
  ],
  shoulder: [
    {
      id: "shoulder-1",
      name: "Desenvolvimento com Halteres",
      sets: 4,
      reps: "8-12",
      videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
      completed: false,
      weights: [0, 0, 0, 0],
      caloriesBurn: 40,
      muscleGroup: "shoulder"
    },
    {
      id: "shoulder-2",
      name: "Elevação Lateral",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 28,
      muscleGroup: "shoulder"
    },
    {
      id: "shoulder-3",
      name: "Elevação Frontal",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 26,
      muscleGroup: "shoulder"
    },
    {
      id: "shoulder-4",
      name: "Remada Alta",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/Q5zz9tXqnGo",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 30,
      muscleGroup: "shoulder"
    }
  ],
  back: [
    {
      id: "back-1",
      name: "Puxada Frontal",
      sets: 4,
      reps: "8-12",
      videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc",
      completed: false,
      weights: [0, 0, 0, 0],
      caloriesBurn: 42,
      muscleGroup: "back"
    },
    {
      id: "back-2",
      name: "Remada Curvada",
      sets: 4,
      reps: "8-12",
      videoUrl: "https://www.youtube.com/embed/kBWAon7ItDw",
      completed: false,
      weights: [0, 0, 0, 0],
      caloriesBurn: 44,
      muscleGroup: "back"
    },
    {
      id: "back-3",
      name: "Remada Unilateral",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/roCP6wCXPqo",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 36,
      muscleGroup: "back"
    }
  ],
  biceps: [
    {
      id: "biceps-1",
      name: "Rosca Direta",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 25,
      muscleGroup: "biceps"
    },
    {
      id: "biceps-2",
      name: "Rosca Alternada",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/sAq_ocpRh_I",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 24,
      muscleGroup: "biceps"
    },
    {
      id: "biceps-3",
      name: "Rosca Martelo",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/zC3nLlEvin4",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 23,
      muscleGroup: "biceps"
    }
  ],
  triceps: [
    {
      id: "triceps-1",
      name: "Tríceps Testa",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/d_KZxkY_0cM",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 28,
      muscleGroup: "triceps"
    },
    {
      id: "triceps-2",
      name: "Tríceps Corda",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 25,
      muscleGroup: "triceps"
    },
    {
      id: "triceps-3",
      name: "Tríceps Francês",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/nRiJVZDpdL0",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 27,
      muscleGroup: "triceps"
    }
  ],
  forearm: [
    {
      id: "forearm-1",
      name: "Rosca Punho",
      sets: 3,
      reps: "15-20",
      videoUrl: "https://www.youtube.com/embed/uR4Z0U3qYKc",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 18,
      muscleGroup: "forearm"
    }
  ],
  abs: [
    {
      id: "abs-1",
      name: "Abdominal Supra",
      sets: 3,
      reps: "15-20",
      videoUrl: "https://www.youtube.com/embed/Ep-IrJVMUy0",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 22,
      muscleGroup: "abs"
    },
    {
      id: "abs-2",
      name: "Prancha",
      sets: 3,
      reps: "30-60s",
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 20,
      muscleGroup: "abs"
    }
  ],
  glutes: [
    {
      id: "glutes-1",
      name: "Agachamento Livre",
      sets: 4,
      reps: "8-12",
      videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8",
      completed: false,
      weights: [0, 0, 0, 0],
      caloriesBurn: 50,
      muscleGroup: "glutes"
    },
    {
      id: "glutes-2",
      name: "Elevação Pélvica",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/OUgsJ8-Vi0E",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 35,
      muscleGroup: "glutes"
    },
    {
      id: "glutes-3",
      name: "Stiff",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/1uDiW5--rAE",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 38,
      muscleGroup: "glutes"
    }
  ],
  quadriceps: [
    {
      id: "quad-1",
      name: "Leg Press",
      sets: 4,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/IZxyjW7MPJQ",
      completed: false,
      weights: [0, 0, 0, 0],
      caloriesBurn: 48,
      muscleGroup: "quadriceps"
    },
    {
      id: "quad-2",
      name: "Cadeira Extensora",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/YyvSfVjQeL0",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 32,
      muscleGroup: "quadriceps"
    },
    {
      id: "quad-3",
      name: "Agachamento Hack",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/0tn5K9NlCfo",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 42,
      muscleGroup: "quadriceps"
    }
  ],
  hamstring: [
    {
      id: "hamstring-1",
      name: "Mesa Flexora",
      sets: 3,
      reps: "12-15",
      videoUrl: "https://www.youtube.com/embed/1Tq3QdYUuHs",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 30,
      muscleGroup: "hamstring"
    },
    {
      id: "hamstring-2",
      name: "Stiff com Barra",
      sets: 3,
      reps: "10-12",
      videoUrl: "https://www.youtube.com/embed/1uDiW5--rAE",
      completed: false,
      weights: [0, 0, 0],
      caloriesBurn: 38,
      muscleGroup: "hamstring"
    }
  ],
  calf: [
    {
      id: "calf-1",
      name: "Panturrilha em Pé",
      sets: 4,
      reps: "15-20",
      videoUrl: "https://www.youtube.com/embed/gwLzBJYoWlI",
      completed: false,
      weights: [0, 0, 0, 0],
      caloriesBurn: 25,
      muscleGroup: "calf"
    }
  ]
}

// Frases motivacionais
const motivationalQuotes = [
  "Você está mais forte do que ontem! 💪",
  "Cada treino é um passo em direção ao seu objetivo! 🎯",
  "Seu esforço de hoje é o resultado de amanhã! 🔥",
  "Você é imparável! Continue assim! 🚀",
  "Mais um treino concluído com sucesso! 🏆",
  "Seu corpo agradece por cada repetição! 💯",
  "Disciplina é a ponte entre metas e conquistas! ⭐",
  "Você está construindo a melhor versão de si mesmo! 🌟"
]

export default function WorkoutTab() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkout[]>([])
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [showWeekView, setShowWeekView] = useState(false)
  const [showFinishAnimation, setShowFinishAnimation] = useState(false)
  const [workoutSummary, setWorkoutSummary] = useState<any>(null)
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null)

  // Carregar treino personalizado baseado nas preferências do quiz
  useEffect(() => {
    const quizData = localStorage.getItem("fitmode_quiz_data")
    
    if (quizData) {
      const quiz = JSON.parse(quizData)
      let dietPreference: any = {}
      
      try {
        dietPreference = JSON.parse(quiz.diet_preference || "{}")
      } catch (e) {
        console.error("Erro ao parsear diet_preference:", e)
      }

      // Obter músculos focados do quiz (pergunta 5)
      const focusedMuscles = dietPreference.body_areas || []
      
      // Obter frequência semanal do quiz (pergunta 11 - quantidade de treinos na semana)
      const weeklyFrequency = parseInt(quiz.available_days || "3")
      
      // Obter tempo disponível do quiz (pergunta 3)
      const availableTime = quiz.available_time || "30-45"
      
      // Gerar treino personalizado para hoje baseado no tempo disponível
      const personalizedWorkout = generatePersonalizedWorkout(focusedMuscles, availableTime)
      setExercises(personalizedWorkout)

      // Gerar treinos da semana
      const weeklyPlan = generateWeeklyPlan(focusedMuscles, weeklyFrequency, availableTime)
      setWeeklyWorkouts(weeklyPlan)
    } else {
      // Treino padrão caso não tenha quiz
      const defaultWorkout = [
        { ...exerciseDatabase.chest[0] },
        { ...exerciseDatabase.chest[1] },
        { ...exerciseDatabase.triceps[0] },
        { ...exerciseDatabase.triceps[1] }
      ]
      setExercises(defaultWorkout)
      
      // Plano semanal padrão (3x por semana)
      setWeeklyWorkouts([
        { day: "Segunda", dayNumber: 1, focus: "Peito e Tríceps", exercises: defaultWorkout, isToday: true },
        { day: "Quarta", dayNumber: 3, focus: "Costas e Bíceps", exercises: [], isToday: false },
        { day: "Sexta", dayNumber: 5, focus: "Pernas e Ombros", exercises: [], isToday: false }
      ])
    }
  }, [])

  // Função para calcular número de exercícios baseado no tempo disponível
  const calculateExerciseCount = (timeRange: string, focusedCount: number): number => {
    // Tempo disponível -> número de exercícios
    const timeToExercises: Record<string, number> = {
      "15-30": 4,   // 15-30 min: 4 exercícios
      "30-45": 6,   // 30-45 min: 6 exercícios
      "45-60": 8,   // 45-60 min: 8 exercícios
      "60+": 10     // 60+ min: 10 exercícios
    }
    
    const baseCount = timeToExercises[timeRange] || 6
    
    // Ajustar baseado no número de músculos focados
    // Mais músculos focados = mais exercícios para cobrir todos
    const adjustedCount = Math.max(baseCount, focusedCount * 2)
    
    return Math.min(adjustedCount, 12) // Máximo de 12 exercícios
  }

  // Função para gerar plano semanal
  const generateWeeklyPlan = (focusedMuscles: string[], frequency: number, availableTime: string): WeeklyWorkout[] => {
    const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    const today = new Date().getDay()
    
    const weeklyPlan: WeeklyWorkout[] = []
    
    // Definir dias de treino baseado na frequência
    let trainingDays: number[] = []
    
    switch(frequency) {
      case 2:
        trainingDays = [1, 4] // Segunda e Quinta
        break
      case 3:
        trainingDays = [1, 3, 5] // Segunda, Quarta e Sexta
        break
      case 4:
        trainingDays = [1, 2, 4, 5] // Segunda, Terça, Quinta e Sexta
        break
      case 5:
        trainingDays = [1, 2, 3, 4, 5] // Segunda a Sexta
        break
      case 6:
        trainingDays = [1, 2, 3, 4, 5, 6] // Segunda a Sábado
        break
      default:
        trainingDays = [1, 3, 5] // Padrão: 3x por semana
    }

    // Criar divisão de treino baseada nos músculos focados
    const muscleGroupNames: Record<string, string> = {
      chest: "Peito",
      shoulder: "Ombro",
      back: "Costas",
      biceps: "Bíceps",
      triceps: "Tríceps",
      forearm: "Antebraço",
      abs: "Abdômen",
      glutes: "Glúteo",
      quadriceps: "Quadríceps",
      hamstring: "Posterior",
      calf: "Panturrilha"
    }

    // Criar splits de treino
    const splits: string[][] = []
    
    if (frequency <= 3) {
      // Treino ABC - focar nos músculos preferidos
      if (focusedMuscles.length >= 3) {
        splits.push([focusedMuscles[0]])
        splits.push([focusedMuscles[1]])
        splits.push([focusedMuscles[2]])
      } else {
        splits.push([focusedMuscles[0] || "chest", "triceps"])
        splits.push([focusedMuscles[1] || "back", "biceps"])
        splits.push([focusedMuscles[2] || "quadriceps", "hamstring"])
      }
    } else if (frequency <= 5) {
      // Treino ABCDE - mais foco nos músculos preferidos
      focusedMuscles.forEach(muscle => {
        splits.push([muscle])
      })
      // Completar com outros músculos se necessário
      const allMuscles = ["chest", "back", "shoulder", "quadriceps", "hamstring"]
      const remainingMuscles = allMuscles.filter(m => !focusedMuscles.includes(m))
      while (splits.length < frequency) {
        splits.push([remainingMuscles[splits.length - focusedMuscles.length] || "abs"])
      }
    } else {
      // Treino 6x - push/pull/legs com foco
      splits.push([focusedMuscles.includes("chest") ? "chest" : "shoulder", "triceps"])
      splits.push([focusedMuscles.includes("back") ? "back" : "shoulder", "biceps"])
      splits.push([focusedMuscles.includes("quadriceps") ? "quadriceps" : "glutes", "hamstring"])
      splits.push([focusedMuscles.includes("shoulder") ? "shoulder" : "chest", "abs"])
      splits.push(["back", "forearm"])
      splits.push(["glutes", "calf"])
    }

    // Gerar treinos para cada dia
    trainingDays.forEach((dayNum, index) => {
      const split = splits[index % splits.length]
      const focusNames = split.map(m => muscleGroupNames[m] || m).join(" e ")
      const workoutExercises = generateWorkoutForSplit(split, focusedMuscles, availableTime)
      
      weeklyPlan.push({
        day: daysOfWeek[dayNum],
        dayNumber: dayNum,
        focus: focusNames,
        exercises: workoutExercises,
        isToday: dayNum === today
      })
    })

    return weeklyPlan
  }

  // Função para gerar treino para um split específico
  const generateWorkoutForSplit = (split: string[], focusedMuscles: string[], availableTime: string): Exercise[] => {
    const workout: Exercise[] = []
    const targetCount = calculateExerciseCount(availableTime, focusedMuscles.length)
    
    // Distribuir exercícios entre os músculos do split
    const exercisesPerMuscle = Math.ceil(targetCount / split.length)
    
    split.forEach(muscle => {
      const muscleExercises = exerciseDatabase[muscle] || []
      
      // Se é músculo focado, adicionar MAIS exercícios
      const count = focusedMuscles.includes(muscle) 
        ? Math.min(exercisesPerMuscle + 2, muscleExercises.length) // +2 exercícios para músculos focados
        : Math.min(Math.max(1, Math.floor(exercisesPerMuscle / 2)), muscleExercises.length) // Menos para não focados
      
      const exercisesToAdd = muscleExercises.slice(0, count)
      
      exercisesToAdd.forEach(ex => {
        workout.push({ 
          ...ex, 
          id: `${ex.muscleGroup}-${workout.length}`,
          completed: false,
          weights: new Array(ex.sets).fill(0)
        })
      })
    })

    return workout.slice(0, targetCount) // Garantir que não exceda o target
  }

  // Função para gerar treino personalizado
  const generatePersonalizedWorkout = (focusedMuscles: string[], availableTime: string): Exercise[] => {
    const workout: Exercise[] = []
    const targetCount = calculateExerciseCount(availableTime, focusedMuscles.length)
    
    // Se não há músculos focados, retornar treino padrão
    if (!focusedMuscles || focusedMuscles.length === 0) {
      return [
        { ...exerciseDatabase.chest[0] },
        { ...exerciseDatabase.chest[1] },
        { ...exerciseDatabase.triceps[0] },
        { ...exerciseDatabase.triceps[1] }
      ]
    }

    // Calcular quantos exercícios por músculo focado (80% do treino)
    const exercisesForFocused = Math.ceil(targetCount * 0.8)
    const exercisesPerFocusedMuscle = Math.ceil(exercisesForFocused / focusedMuscles.length)
    
    // Adicionar exercícios dos músculos focados
    focusedMuscles.forEach(muscle => {
      const muscleExercises = exerciseDatabase[muscle] || []
      const exercisesToAdd = muscleExercises.slice(0, exercisesPerFocusedMuscle)
      
      exercisesToAdd.forEach(ex => {
        workout.push({ 
          ...ex, 
          id: `${ex.muscleGroup}-${workout.length}`,
          completed: false,
          weights: new Array(ex.sets).fill(0)
        })
      })
    })

    // Adicionar exercícios complementares (20% do treino)
    const allMuscleGroups = Object.keys(exerciseDatabase)
    const complementaryMuscles = allMuscleGroups.filter(m => !focusedMuscles.includes(m))
    
    const remainingSlots = targetCount - workout.length
    
    if (remainingSlots > 0 && complementaryMuscles.length > 0) {
      const exercisesPerComplementary = Math.max(1, Math.floor(remainingSlots / Math.min(complementaryMuscles.length, 2)))
      
      for (let i = 0; i < Math.min(2, complementaryMuscles.length) && workout.length < targetCount; i++) {
        const muscle = complementaryMuscles[i]
        const muscleExercises = exerciseDatabase[muscle] || []
        
        const exercisesToAdd = muscleExercises.slice(0, exercisesPerComplementary)
        exercisesToAdd.forEach(ex => {
          if (workout.length < targetCount) {
            workout.push({ 
              ...ex, 
              id: `${ex.muscleGroup}-${workout.length}`,
              completed: false,
              weights: new Array(ex.sets).fill(0)
            })
          }
        })
      }
    }

    return workout
  }

  const toggleExercise = (id: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ))
  }

  const updateWeight = (exerciseId: string, setIndex: number, weight: number) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const newWeights = [...ex.weights]
        newWeights[setIndex] = weight
        return { ...ex, weights: newWeights }
      }
      return ex
    }))
  }

  const toggleExpand = (id: string) => {
    setExpandedExercise(expandedExercise === id ? null : id)
  }

  const toggleVideo = (id: string) => {
    setPlayingVideo(playingVideo === id ? null : id)
  }

  const replaceExercise = (exerciseId: string) => {
    const currentExercise = exercises.find(ex => ex.id === exerciseId)
    if (!currentExercise) return

    const muscleGroup = currentExercise.muscleGroup
    const alternatives = exerciseDatabase[muscleGroup] || []
    
    // Filtrar exercícios que não estão na lista atual
    const availableAlternatives = alternatives.filter(
      alt => !exercises.some(ex => ex.name === alt.name)
    )

    if (availableAlternatives.length === 0) {
      alert("Não há mais exercícios alternativos disponíveis para este grupo muscular.")
      return
    }

    // Escolher um exercício aleatório das alternativas
    const randomIndex = Math.floor(Math.random() * availableAlternatives.length)
    const newExercise = { ...availableAlternatives[randomIndex] }
    
    // Manter o ID original para preservar a posição
    newExercise.id = exerciseId
    newExercise.completed = false
    newExercise.weights = new Array(newExercise.sets).fill(0)

    // Substituir o exercício na lista
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? newExercise : ex
    ))

    // Fechar o painel expandido após trocar
    setExpandedExercise(null)
    setPlayingVideo(null)
  }

  const handleFinishWorkout = () => {
    // Verificar se todos os exercícios foram completados
    const allCompleted = exercises.every(ex => ex.completed)
    
    if (!allCompleted) {
      const confirmed = window.confirm("Você ainda não completou todos os exercícios. Deseja finalizar mesmo assim?")
      if (!confirmed) return
    }

    // Calcular estatísticas do treino
    const completedExercises = exercises.filter(ex => ex.completed)
    const totalCalories = completedExercises.reduce((sum, ex) => sum + ex.caloriesBurn, 0)
    
    // Calcular tempo médio (estimativa: 3 min por série + 1 min de descanso)
    const totalSets = completedExercises.reduce((sum, ex) => sum + ex.sets, 0)
    const estimatedTime = totalSets * 4 // 4 minutos por série (incluindo descanso)
    
    // Escolher frase motivacional aleatória
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    
    setWorkoutSummary({
      completedExercises: completedExercises.length,
      totalExercises: exercises.length,
      totalCalories,
      estimatedTime,
      motivationalQuote: randomQuote
    })
    
    // Mostrar animação
    setShowFinishAnimation(true)
    
    // Após 3 segundos, mostrar resumo
    setTimeout(() => {
      setShowFinishAnimation(false)
    }, 3000)
  }

  const handleStartNewWorkout = () => {
    setWorkoutSummary(null)
    setExercises(exercises.map(ex => ({ ...ex, completed: false, weights: new Array(ex.sets).fill(0) })))
    setWorkoutStartTime(Date.now())
  }

  const totalCalories = exercises
    .filter(ex => ex.completed)
    .reduce((sum, ex) => sum + ex.caloriesBurn, 0)

  const completedCount = exercises.filter(ex => ex.completed).length

  // Mapear nomes dos grupos musculares para português
  const muscleGroupNames: Record<string, string> = {
    chest: "Peito",
    shoulder: "Ombro",
    back: "Costas",
    biceps: "Bíceps",
    triceps: "Tríceps",
    forearm: "Antebraço",
    abs: "Abdômen",
    glutes: "Glúteo",
    quadriceps: "Quadríceps",
    hamstring: "Posterior",
    calf: "Panturrilha"
  }

  // Animação de finalização
  if (showFinishAnimation) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center space-y-6 animate-pulse">
          <div className="text-8xl">🏆</div>
          <h2 className="text-4xl font-bold text-white">Treino Finalizado!</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-3 h-3 bg-[#ff0000] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-[#ff0000] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-[#ff0000] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Resumo do treino
  if (workoutSummary) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold text-white">Parabéns!</h2>
          <p className="text-xl text-white">{workoutSummary.motivationalQuote}</p>
        </div>

        <Card className="bg-gradient-to-br from-[#1a0000] to-black border-[#ff0000]/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Resumo do Treino</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-[#ff0000]" />
                <span className="text-white">Exercícios Completos</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {workoutSummary.completedExercises}/{workoutSummary.totalExercises}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-white">Calorias Queimadas</span>
              </div>
              <span className="text-2xl font-bold text-orange-500">
                {workoutSummary.totalCalories} kcal
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <span className="text-white">Tempo Estimado</span>
              </div>
              <span className="text-2xl font-bold text-blue-500">
                {workoutSummary.estimatedTime} min
              </span>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleStartNewWorkout}
          className="w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-semibold py-6"
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar Novo Treino
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Treino Personalizado</h2>
        <p className="text-white">Baseado nas suas preferências • {exercises.length} exercícios</p>
      </div>

      {/* Toggle Week View Button */}
      <Button
        onClick={() => setShowWeekView(!showWeekView)}
        variant="outline"
        className="w-full border-[#ff0000]/20 text-[#ff0000] hover:bg-[#ff0000]/10"
      >
        <Calendar className="w-4 h-4 mr-2" />
        {showWeekView ? "Ver Treino de Hoje" : "Ver Treinos da Semana"}
      </Button>

      {/* Weekly View */}
      {showWeekView && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#ff0000]" />
            Planejamento Semanal
          </h3>
          
          {weeklyWorkouts.map((workout, index) => (
            <Card 
              key={index}
              className={`bg-gradient-to-br from-[#1a0000] to-black border-[#ff0000]/20 p-4 ${
                workout.isToday ? "ring-2 ring-[#ff0000]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{workout.day}</h4>
                    {workout.isToday && (
                      <span className="text-xs bg-[#ff0000] text-white px-2 py-1 rounded-full">
                        HOJE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white mt-1">{workout.focus}</p>
                  <p className="text-xs text-white/60 mt-1">
                    {workout.exercises.length} exercícios
                  </p>
                </div>
                <Dumbbell className="w-8 h-8 text-[#ff0000]/40" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Today's Workout View */}
      {!showWeekView && (
        <>
          {/* Progress Summary */}
          <Card className="bg-gradient-to-br from-[#1a0000] to-black border-[#ff0000]/20 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-white">Progresso</div>
                <div className="text-2xl font-bold text-[#ff0000]">
                  {completedCount}/{exercises.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-white">Calorias Queimadas</div>
                <div className="text-2xl font-bold text-green-500">{totalCalories} kcal</div>
              </div>
            </div>
          </Card>

          {/* Exercise List */}
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <Card 
                key={exercise.id}
                className={`bg-gradient-to-br from-[#1a0000] to-black border-[#ff0000]/20 transition-all ${
                  exercise.completed ? "opacity-75" : ""
                }`}
              >
                <div className="p-4">
                  {/* Exercise Header */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={exercise.completed}
                      onCheckedChange={() => toggleExercise(exercise.id)}
                      className="mt-1 border-[#ff0000] data-[state=checked]:bg-[#ff0000] data-[state=checked]:border-[#ff0000]"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold text-white ${exercise.completed ? "line-through text-gray-500" : ""}`}>
                            {exercise.name}
                          </h3>
                          <p className="text-sm text-white">
                            {exercise.sets} séries • {exercise.reps} reps
                          </p>
                          <p className="text-xs text-[#ff0000] mt-1">
                            {muscleGroupNames[exercise.muscleGroup] || exercise.muscleGroup}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleVideo(exercise.id)}
                            className="text-[#ff0000] hover:bg-[#ff0000]/10"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleExpand(exercise.id)}
                            className="text-white hover:bg-white/5"
                          >
                            {expandedExercise === exercise.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Video Player */}
                      {playingVideo === exercise.id && (
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="200"
                            src={exercise.videoUrl}
                            title={exercise.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                        </div>
                      )}

                      {/* Expanded Details */}
                      {expandedExercise === exercise.id && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-[#ff0000]/10">
                          <div className="flex items-center gap-2 text-sm text-white">
                            <Weight className="w-4 h-4" />
                            <span>Registre o peso de cada série:</span>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            {exercise.weights.map((weight, index) => (
                              <div key={index} className="space-y-1">
                                <label className="text-xs text-white">Série {index + 1}</label>
                                <Input
                                  type="number"
                                  value={weight || ""}
                                  onChange={(e) => updateWeight(exercise.id, index, Number(e.target.value))}
                                  placeholder="kg"
                                  className="bg-black/50 border-[#ff0000]/20 text-white text-center"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => replaceExercise(exercise.id)}
                              className="flex-1 border-[#ff0000]/20 text-[#ff0000] hover:bg-[#ff0000]/10"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Trocar Exercício
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleFinishWorkout}
              className="w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-semibold py-6"
            >
              <Check className="w-5 h-5 mr-2" />
              Finalizar Treino
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
