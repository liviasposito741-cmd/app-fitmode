"use client"

import { useState } from "react"
import { TrendingUp, Calendar, Flame, Target, Award, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProgressTab() {
  // Mock data for charts
  const weeklyWorkouts = [
    { day: "Seg", completed: true },
    { day: "Ter", completed: true },
    { day: "Qua", completed: false },
    { day: "Qui", completed: true },
    { day: "Sex", completed: true },
    { day: "Sáb", completed: false },
    { day: "Dom", completed: false }
  ]

  const calorieBalance = [
    { day: "Seg", consumed: 2100, burned: 450 },
    { day: "Ter", consumed: 1950, burned: 380 },
    { day: "Qua", consumed: 2200, burned: 0 },
    { day: "Qui", consumed: 1850, burned: 420 },
    { day: "Sex", consumed: 2050, burned: 500 },
    { day: "Sáb", consumed: 2300, burned: 0 },
    { day: "Dom", consumed: 1900, burned: 0 }
  ]

  const weeklyProgress = [
    { week: "Sem 1", workouts: 3, calories: 1200 },
    { week: "Sem 2", workouts: 4, calories: 1600 },
    { week: "Sem 3", workouts: 3, calories: 1350 },
    { week: "Sem 4", workouts: 5, calories: 2100 }
  ]

  const achievements = [
    { id: 1, name: "Primeira Semana", icon: "🎯", unlocked: true },
    { id: 2, name: "10 Treinos", icon: "💪", unlocked: true },
    { id: 3, name: "Mês Completo", icon: "🔥", unlocked: true },
    { id: 4, name: "50 Treinos", icon: "⭐", unlocked: false },
    { id: 5, name: "100 Treinos", icon: "🏆", unlocked: false },
    { id: 6, name: "Ano Completo", icon: "👑", unlocked: false }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Seu Progresso</h2>
        <p className="text-gray-400">Acompanhe sua evolução</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">4</div>
              <div className="text-xs text-gray-400">Treinos esta semana</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">1,750</div>
              <div className="text-xs text-gray-400">Calorias queimadas</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Workout Chart */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
          <Calendar className="w-5 h-5 text-blue-400" />
          Frequência de Treinos
        </h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyWorkouts.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 w-full flex items-end">
                <div
                  className={`w-full rounded-t-xl transition-all ${
                    day.completed
                      ? "bg-gradient-to-t from-blue-500 to-purple-600"
                      : "bg-gray-800"
                  }`}
                  style={{ height: day.completed ? "100%" : "20%" }}
                />
              </div>
              <span className="text-xs text-gray-400">{day.day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Calorie Balance Chart */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
          <Flame className="w-5 h-5 text-orange-400" />
          Balanço Calórico
        </h3>
        <div className="space-y-3">
          {calorieBalance.map((day, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{day.day}</span>
                <span className="text-white font-medium">
                  {day.consumed - day.burned} kcal
                </span>
              </div>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${(day.consumed / 2500) * 100}%` }}
                />
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-500"
                  style={{ width: `${(day.burned / 2500) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            <span className="text-xs text-gray-400">Consumidas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
            <span className="text-xs text-gray-400">Queimadas</span>
          </div>
        </div>
      </Card>

      {/* Weekly Performance */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-purple-400" />
          Desempenho Semanal
        </h3>
        <div className="space-y-4">
          {weeklyProgress.map((week, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{week.week}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">{week.workouts} treinos</span>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {week.calories} kcal
                  </span>
                </div>
              </div>
              <Progress
                value={(week.workouts / 5) * 100}
                className="h-2 bg-gray-800"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
          <Award className="w-5 h-5 text-yellow-400" />
          Conquistas
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                  : "bg-gray-800/50 opacity-50"
              }`}
            >
              <div className="text-2xl sm:text-3xl">{achievement.icon}</div>
              <div className="text-xs text-center text-white">
                {achievement.name}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
