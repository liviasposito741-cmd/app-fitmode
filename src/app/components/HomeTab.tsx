"use client"

import { useState, useEffect } from "react"
import { Flame, Zap, Target, TrendingUp, ChevronRight, Play, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface HomeTabProps {
  onNavigateToWorkout?: () => void
}

export default function HomeTab({ onNavigateToWorkout }: HomeTabProps) {
  const [caloriesConsumed] = useState(1450)
  const [caloriesBurned] = useState(420)
  const [workoutsThisWeek] = useState(4)
  const [todayWorkout, setTodayWorkout] = useState({
    name: "Treino de Peito e Tríceps",
    exercises: 8,
    duration: 45
  })
  const [caloriesGoal, setCaloriesGoal] = useState(2000)

  // Carregar treino do dia e meta de calorias baseado no quiz
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

      // Obter músculos focados e tempo disponível
      const focusedMuscles = dietPreference.body_areas || []
      const availableTime = quiz.available_time || "30-45"
      const goal = quiz.goal || "muscle-gain"
      
      // Calcular meta de calorias baseado no objetivo
      const weight = dietPreference.current_weight || 70
      const height = dietPreference.height || 170
      const age = dietPreference.age || 25
      
      // Fórmula de Harris-Benedict para TMB (Taxa Metabólica Basal)
      const bmr = 10 * weight + 6.25 * height - 5 * age + 5
      
      // Ajustar baseado no objetivo
      let dailyCalories = bmr * 1.5 // Fator de atividade moderada
      
      if (goal === "weight-loss") {
        dailyCalories = dailyCalories * 0.8 // 20% de déficit
      } else if (goal === "muscle-gain") {
        dailyCalories = dailyCalories * 1.15 // 15% de superávit
      }
      
      setCaloriesGoal(Math.round(dailyCalories))
      
      // Mapear nomes dos grupos musculares
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
      
      // Determinar treino de hoje baseado no dia da semana
      const today = new Date().getDay()
      const weeklyFrequency = parseInt(quiz.weekly_frequency || "3")
      
      let trainingDays: number[] = []
      let splits: string[][] = []
      
      // Definir dias de treino
      switch(weeklyFrequency) {
        case 2:
          trainingDays = [1, 4]
          splits = [[focusedMuscles[0] || "chest"], [focusedMuscles[1] || "back"]]
          break
        case 3:
          trainingDays = [1, 3, 5]
          splits = [
            [focusedMuscles[0] || "chest", "triceps"],
            [focusedMuscles[1] || "back", "biceps"],
            [focusedMuscles[2] || "quadriceps", "hamstring"]
          ]
          break
        case 4:
          trainingDays = [1, 2, 4, 5]
          splits = [
            [focusedMuscles[0] || "chest"],
            [focusedMuscles[1] || "back"],
            [focusedMuscles[2] || "shoulder"],
            ["quadriceps", "hamstring"]
          ]
          break
        case 5:
          trainingDays = [1, 2, 3, 4, 5]
          splits = [
            [focusedMuscles[0] || "chest", "triceps"],
            [focusedMuscles[1] || "back", "biceps"],
            [focusedMuscles[2] || "shoulder"],
            ["quadriceps"],
            ["hamstring", "glutes"]
          ]
          break
        case 6:
          trainingDays = [1, 2, 3, 4, 5, 6]
          splits = [
            ["chest", "triceps"],
            ["back", "biceps"],
            ["quadriceps", "hamstring"],
            ["shoulder", "abs"],
            ["glutes", "calf"],
            ["forearm", "abs"]
          ]
          break
        default:
          trainingDays = [1, 3, 5]
          splits = [
            [focusedMuscles[0] || "chest", "triceps"],
            [focusedMuscles[1] || "back", "biceps"],
            [focusedMuscles[2] || "quadriceps", "hamstring"]
          ]
      }
      
      // Encontrar índice do treino de hoje
      const todayIndex = trainingDays.indexOf(today)
      
      if (todayIndex !== -1) {
        const todaySplit = splits[todayIndex]
        const focusNames = todaySplit.map(m => muscleGroupNames[m] || m).join(" e ")
        
        // Calcular número de exercícios baseado no tempo
        const timeToExercises: Record<string, number> = {
          "15-30": 4,
          "30-45": 6,
          "45-60": 8,
          "60+": 10
        }
        
        const exerciseCount = timeToExercises[availableTime] || 6
        const duration = parseInt(availableTime.split("-")[0]) || 45
        
        setTodayWorkout({
          name: `Treino de ${focusNames}`,
          exercises: exerciseCount,
          duration: duration
        })
      } else {
        setTodayWorkout({
          name: "Dia de Descanso",
          exercises: 0,
          duration: 0
        })
      }
    }
  }, [])

  const caloriesRemaining = caloriesGoal - caloriesConsumed + caloriesBurned
  const progressPercentage = ((caloriesConsumed - caloriesBurned) / caloriesGoal) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Bem-vindo de volta! 💪</h2>
        <p className="text-gray-400">Vamos continuar sua jornada fitness hoje</p>
      </div>

      {/* Daily Energy Balance */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              Balanço Energético
            </h3>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              {caloriesRemaining > 0 ? caloriesRemaining : 0} kcal
            </span>
          </div>

          <Progress value={progressPercentage} className="h-3 bg-gray-800 rounded-full" />

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <div className="text-2xl font-bold text-green-400">{caloriesConsumed}</div>
              <div className="text-xs text-gray-400">Consumidas</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <div className="text-2xl font-bold text-amber-400">{caloriesBurned}</div>
              <div className="text-xs text-gray-400">Queimadas</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-xl">
              <div className="text-2xl font-bold text-blue-400">{caloriesGoal}</div>
              <div className="text-xs text-gray-400">Meta</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{workoutsThisWeek}</div>
              <div className="text-xs text-gray-400">Treinos esta semana</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">87%</div>
              <div className="text-xs text-gray-400">Taxa de conclusão</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Workout */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Treino de Hoje
            </h3>
            {todayWorkout.duration > 0 && (
              <span className="text-sm text-blue-400 font-medium">{todayWorkout.duration} min</span>
            )}
          </div>

          <div className="space-y-3">
            {todayWorkout.duration > 0 ? (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{todayWorkout.name}</div>
                  <div className="text-xs text-gray-400">{todayWorkout.exercises} exercícios • Personalizado</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-800/50 rounded-xl">
                <div className="text-4xl mb-2">😴</div>
                <div className="font-medium text-white">Dia de Descanso</div>
                <div className="text-xs text-gray-400 mt-1">Aproveite para recuperar!</div>
              </div>
            )}
          </div>

          {todayWorkout.duration > 0 && (
            <Button 
              onClick={onNavigateToWorkout}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg"
            >
              Iniciar Treino
            </Button>
          )}
        </div>
      </Card>

      {/* Monthly Challenge */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Desafio do Mês
            </h3>
            <span className="text-sm text-gray-400">12/20 dias</span>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2">20 Treinos em Dezembro</div>
            <Progress value={60} className="h-2 bg-gray-800 rounded-full" />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Recompensa:</span>
            <span className="text-yellow-400 font-semibold">🏆 Medalha de Ouro</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
