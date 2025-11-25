"use client"

import { useState } from "react"
import { Plus, Search, Utensils, Apple, Coffee, Moon, Edit, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  time: string
  quantity: number
  baseCalories: number
  baseProtein: number
  baseCarbs: number
  baseFats: number
}

interface MealCategory {
  id: string
  name: string
  icon: any
  meals: Meal[]
  totalCalories: number
  color: string
}

interface FoodItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  portion: string
}

const foodDatabase: FoodItem[] = [
  // Proteínas Animais
  { name: "Peito de frango grelhado", calories: 165, protein: 31, carbs: 0, fats: 3.6, portion: "100g" },
  { name: "Filé de tilápia", calories: 96, protein: 20, carbs: 0, fats: 1.7, portion: "100g" },
  { name: "Salmão grelhado", calories: 206, protein: 22, carbs: 0, fats: 13, portion: "100g" },
  { name: "Atum em lata", calories: 116, protein: 26, carbs: 0, fats: 0.8, portion: "100g" },
  { name: "Ovo cozido", calories: 155, protein: 13, carbs: 1.1, fats: 11, portion: "100g (2 ovos)" },
  { name: "Carne moída magra", calories: 250, protein: 26, carbs: 0, fats: 15, portion: "100g" },
  { name: "Patinho bovino", calories: 140, protein: 23, carbs: 0, fats: 5, portion: "100g" },
  { name: "Peito de peru fatiado", calories: 84, protein: 17, carbs: 2, fats: 1, portion: "100g" },
  { name: "Filé mignon", calories: 179, protein: 27, carbs: 0, fats: 7.5, portion: "100g" },
  { name: "Frango desfiado", calories: 165, protein: 31, carbs: 0, fats: 3.6, portion: "100g" },
  { name: "Camarão", calories: 99, protein: 24, carbs: 0.2, fats: 0.3, portion: "100g" },
  { name: "Bacalhau", calories: 82, protein: 18, carbs: 0, fats: 0.7, portion: "100g" },
  { name: "Sardinha em lata", calories: 208, protein: 25, carbs: 0, fats: 11, portion: "100g" },
  { name: "Atum fresco grelhado", calories: 144, protein: 23, carbs: 0, fats: 5, portion: "100g" },
  { name: "Picanha magra", calories: 210, protein: 26, carbs: 0, fats: 11, portion: "100g" },
  
  // Proteínas Vegetais
  { name: "Whey Protein", calories: 120, protein: 24, carbs: 3, fats: 1.5, portion: "30g (1 scoop)" },
  { name: "Tofu", calories: 76, protein: 8, carbs: 1.9, fats: 4.8, portion: "100g" },
  { name: "Grão de bico cozido", calories: 164, protein: 8.9, carbs: 27, fats: 2.6, portion: "100g" },
  { name: "Lentilha cozida", calories: 116, protein: 9, carbs: 20, fats: 0.4, portion: "100g" },
  { name: "Feijão preto cozido", calories: 132, protein: 8.9, carbs: 24, fats: 0.5, portion: "100g" },
  { name: "Feijão carioca cozido", calories: 76, protein: 4.8, carbs: 13.6, fats: 0.5, portion: "100g" },
  { name: "Ervilha cozida", calories: 81, protein: 5.4, carbs: 14, fats: 0.4, portion: "100g" },
  { name: "Soja texturizada", calories: 336, protein: 52, carbs: 30, fats: 1.2, portion: "100g" },
  { name: "Edamame", calories: 122, protein: 11, carbs: 10, fats: 5, portion: "100g" },
  { name: "Tempeh", calories: 193, protein: 19, carbs: 9, fats: 11, portion: "100g" },
  
  // Carboidratos Complexos
  { name: "Arroz branco cozido", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, portion: "100g" },
  { name: "Arroz integral cozido", calories: 123, protein: 2.6, carbs: 25.6, fats: 1, portion: "100g" },
  { name: "Batata doce cozida", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, portion: "100g" },
  { name: "Batata inglesa cozida", calories: 87, protein: 2, carbs: 20, fats: 0.1, portion: "100g" },
  { name: "Macarrão integral cozido", calories: 124, protein: 5, carbs: 26, fats: 0.5, portion: "100g" },
  { name: "Pão integral", calories: 247, protein: 13, carbs: 41, fats: 3.4, portion: "100g (3 fatias)" },
  { name: "Aveia em flocos", calories: 389, protein: 17, carbs: 66, fats: 7, portion: "100g" },
  { name: "Tapioca", calories: 358, protein: 0.2, carbs: 88, fats: 0.02, portion: "100g" },
  { name: "Quinoa cozida", calories: 120, protein: 4.4, carbs: 21, fats: 1.9, portion: "100g" },
  { name: "Mandioca cozida", calories: 125, protein: 0.6, carbs: 30, fats: 0.3, portion: "100g" },
  { name: "Inhame cozido", calories: 118, protein: 1.5, carbs: 28, fats: 0.2, portion: "100g" },
  { name: "Cuscuz marroquino", calories: 112, protein: 3.8, carbs: 23, fats: 0.2, portion: "100g" },
  { name: "Pão francês", calories: 300, protein: 9, carbs: 58, fats: 3.6, portion: "100g (2 unidades)" },
  { name: "Pão de forma integral", calories: 253, protein: 12, carbs: 43, fats: 3.5, portion: "100g" },
  { name: "Macarrão de arroz", calories: 109, protein: 0.9, carbs: 24, fats: 0.2, portion: "100g" },
  
  // Frutas
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, portion: "100g (1 unidade)" },
  { name: "Maçã", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, portion: "100g (1 unidade)" },
  { name: "Morango", calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, portion: "100g" },
  { name: "Abacaxi", calories: 50, protein: 0.5, carbs: 13, fats: 0.1, portion: "100g" },
  { name: "Manga", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, portion: "100g" },
  { name: "Laranja", calories: 47, protein: 0.9, carbs: 12, fats: 0.1, portion: "100g (1 unidade)" },
  { name: "Uva", calories: 69, protein: 0.7, carbs: 18, fats: 0.2, portion: "100g" },
  { name: "Melancia", calories: 30, protein: 0.6, carbs: 8, fats: 0.2, portion: "100g" },
  { name: "Mamão", calories: 43, protein: 0.5, carbs: 11, fats: 0.3, portion: "100g" },
  { name: "Pera", calories: 57, protein: 0.4, carbs: 15, fats: 0.1, portion: "100g (1 unidade)" },
  { name: "Kiwi", calories: 61, protein: 1.1, carbs: 15, fats: 0.5, portion: "100g" },
  { name: "Melão", calories: 34, protein: 0.8, carbs: 8, fats: 0.2, portion: "100g" },
  { name: "Abacate", calories: 160, protein: 2, carbs: 8.5, fats: 15, portion: "100g" },
  { name: "Goiaba", calories: 68, protein: 2.6, carbs: 14, fats: 1, portion: "100g" },
  { name: "Tangerina", calories: 53, protein: 0.8, carbs: 13, fats: 0.3, portion: "100g" },
  
  // Vegetais e Verduras
  { name: "Brócolis cozido", calories: 35, protein: 2.4, carbs: 7, fats: 0.4, portion: "100g" },
  { name: "Couve-flor cozida", calories: 23, protein: 1.8, carbs: 4.7, fats: 0.2, portion: "100g" },
  { name: "Espinafre cozido", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.3, portion: "100g" },
  { name: "Alface", calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2, portion: "100g" },
  { name: "Tomate", calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, portion: "100g" },
  { name: "Cenoura cozida", calories: 35, protein: 0.8, carbs: 8.2, fats: 0.2, portion: "100g" },
  { name: "Abobrinha cozida", calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3, portion: "100g" },
  { name: "Pepino", calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, portion: "100g" },
  { name: "Rúcula", calories: 25, protein: 2.6, carbs: 3.7, fats: 0.7, portion: "100g" },
  { name: "Couve", calories: 49, protein: 4.3, carbs: 10, fats: 0.9, portion: "100g" },
  { name: "Beterraba cozida", calories: 44, protein: 1.7, carbs: 10, fats: 0.2, portion: "100g" },
  { name: "Berinjela cozida", calories: 25, protein: 1, carbs: 6, fats: 0.2, portion: "100g" },
  { name: "Pimentão", calories: 20, protein: 0.9, carbs: 4.6, fats: 0.2, portion: "100g" },
  { name: "Cebola", calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1, portion: "100g" },
  { name: "Vagem cozida", calories: 31, protein: 1.8, carbs: 7, fats: 0.1, portion: "100g" },
  
  // Gorduras Saudáveis
  { name: "Azeite de oliva", calories: 884, protein: 0, carbs: 0, fats: 100, portion: "100ml (7 colheres)" },
  { name: "Amendoim", calories: 567, protein: 26, carbs: 16, fats: 49, portion: "100g" },
  { name: "Castanha de caju", calories: 553, protein: 18, carbs: 30, fats: 44, portion: "100g" },
  { name: "Pasta de amendoim", calories: 588, protein: 25, carbs: 20, fats: 50, portion: "100g (5 colheres)" },
  { name: "Castanha do Pará", calories: 656, protein: 14, carbs: 12, fats: 66, portion: "100g" },
  { name: "Amêndoas", calories: 579, protein: 21, carbs: 22, fats: 50, portion: "100g" },
  { name: "Nozes", calories: 654, protein: 15, carbs: 14, fats: 65, portion: "100g" },
  { name: "Avelã", calories: 628, protein: 15, carbs: 17, fats: 61, portion: "100g" },
  { name: "Pistache", calories: 560, protein: 20, carbs: 28, fats: 45, portion: "100g" },
  { name: "Óleo de coco", calories: 862, protein: 0, carbs: 0, fats: 100, portion: "100ml" },
  { name: "Linhaça", calories: 534, protein: 18, carbs: 29, fats: 42, portion: "100g" },
  { name: "Chia", calories: 486, protein: 17, carbs: 42, fats: 31, portion: "100g" },
  
  // Laticínios
  { name: "Iogurte grego natural", calories: 59, protein: 10, carbs: 3.6, fats: 0.4, portion: "100g" },
  { name: "Leite desnatado", calories: 34, protein: 3.4, carbs: 5, fats: 0.1, portion: "100ml" },
  { name: "Leite integral", calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, portion: "100ml" },
  { name: "Queijo cottage", calories: 98, protein: 11, carbs: 3.4, fats: 4.3, portion: "100g" },
  { name: "Queijo minas frescal", calories: 264, protein: 17.4, carbs: 3, fats: 20.8, portion: "100g" },
  { name: "Requeijão light", calories: 140, protein: 8, carbs: 4, fats: 10, portion: "100g" },
  { name: "Iogurte natural", calories: 61, protein: 3.5, carbs: 4.7, fats: 3.3, portion: "100g" },
  { name: "Queijo ricota", calories: 174, protein: 11, carbs: 3.4, fats: 13, portion: "100g" },
  { name: "Leite de amêndoas", calories: 17, protein: 0.6, carbs: 0.6, fats: 1.1, portion: "100ml" },
  { name: "Leite de coco", calories: 230, protein: 2.3, carbs: 6, fats: 24, portion: "100ml" },
  
  // Lanches e Snacks Saudáveis
  { name: "Granola", calories: 471, protein: 13, carbs: 64, fats: 18, portion: "100g" },
  { name: "Barra de proteína", calories: 200, protein: 20, carbs: 22, fats: 5, portion: "60g (1 unidade)" },
  { name: "Barra de cereal", calories: 380, protein: 6, carbs: 70, fats: 10, portion: "100g" },
  { name: "Mix de castanhas", calories: 607, protein: 20, carbs: 21, fats: 54, portion: "100g" },
  { name: "Pipoca sem óleo", calories: 387, protein: 13, carbs: 78, fats: 4.5, portion: "100g" },
  { name: "Biscoito integral", calories: 440, protein: 9, carbs: 68, fats: 15, portion: "100g" },
  { name: "Torrada integral", calories: 373, protein: 12, carbs: 72, fats: 4.5, portion: "100g" },
  
  // Bebidas
  { name: "Café preto", calories: 2, protein: 0.3, carbs: 0, fats: 0, portion: "100ml" },
  { name: "Chá verde", calories: 1, protein: 0, carbs: 0, fats: 0, portion: "100ml" },
  { name: "Suco de laranja natural", calories: 45, protein: 0.7, carbs: 10, fats: 0.2, portion: "100ml" },
  { name: "Água de coco", calories: 19, protein: 0.7, carbs: 3.7, fats: 0.2, portion: "100ml" },
  { name: "Shake de proteína", calories: 150, protein: 25, carbs: 10, fats: 2, portion: "250ml" },
  
  // Outros
  { name: "Mel", calories: 304, protein: 0.3, carbs: 82, fats: 0, portion: "100g" },
  { name: "Geleia sem açúcar", calories: 56, protein: 0.4, carbs: 13, fats: 0.1, portion: "100g" },
  { name: "Molho de tomate caseiro", calories: 29, protein: 1.2, carbs: 6.7, fats: 0.2, portion: "100g" },
  { name: "Hummus", calories: 166, protein: 8, carbs: 14, fats: 10, portion: "100g" },
  { name: "Guacamole", calories: 150, protein: 2, carbs: 9, fats: 14, portion: "100g" }
]

export default function NutritionTab() {
  const [mealCategories, setMealCategories] = useState<MealCategory[]>([
    {
      id: "breakfast",
      name: "Café da Manhã",
      icon: Coffee,
      meals: [
        {
          id: "1",
          name: "Ovos mexidos",
          calories: 233,
          protein: 19.5,
          carbs: 1.65,
          fats: 16.5,
          time: "08:00",
          quantity: 150,
          baseCalories: 155,
          baseProtein: 13,
          baseCarbs: 1.1,
          baseFats: 11
        },
        {
          id: "2",
          name: "Pão integral",
          calories: 164,
          protein: 8.6,
          carbs: 27.3,
          fats: 2.3,
          time: "08:00",
          quantity: 66,
          baseCalories: 247,
          baseProtein: 13,
          baseCarbs: 41,
          baseFats: 3.4
        }
      ],
      totalCalories: 397,
      color: "from-yellow-500 to-amber-500"
    },
    {
      id: "lunch",
      name: "Almoço",
      icon: Utensils,
      meals: [
        {
          id: "3",
          name: "Peito de frango grelhado",
          calories: 330,
          protein: 62,
          carbs: 0,
          fats: 7.2,
          time: "12:30",
          quantity: 200,
          baseCalories: 165,
          baseProtein: 31,
          baseCarbs: 0,
          baseFats: 3.6
        },
        {
          id: "4",
          name: "Arroz integral",
          calories: 185,
          protein: 3.9,
          carbs: 38.4,
          fats: 1.5,
          time: "12:30",
          quantity: 150,
          baseCalories: 123,
          baseProtein: 2.6,
          baseCarbs: 25.6,
          baseFats: 1
        },
        {
          id: "5",
          name: "Brócolis",
          calories: 35,
          protein: 2.4,
          carbs: 7,
          fats: 0.4,
          time: "12:30",
          quantity: 100,
          baseCalories: 35,
          baseProtein: 2.4,
          baseCarbs: 7,
          baseFats: 0.4
        }
      ],
      totalCalories: 550,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "snack",
      name: "Lanche",
      icon: Apple,
      meals: [
        {
          id: "6",
          name: "Whey Protein",
          calories: 120,
          protein: 24,
          carbs: 3,
          fats: 1.5,
          time: "16:00",
          quantity: 30,
          baseCalories: 120,
          baseProtein: 24,
          baseCarbs: 3,
          baseFats: 1.5
        },
        {
          id: "7",
          name: "Banana",
          calories: 89,
          protein: 1.1,
          carbs: 23,
          fats: 0.3,
          time: "16:00",
          quantity: 100,
          baseCalories: 89,
          baseProtein: 1.1,
          baseCarbs: 23,
          baseFats: 0.3
        }
      ],
      totalCalories: 209,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "dinner",
      name: "Jantar",
      icon: Moon,
      meals: [
        {
          id: "8",
          name: "Salmão grelhado",
          calories: 309,
          protein: 33,
          carbs: 0,
          fats: 19.5,
          time: "19:30",
          quantity: 150,
          baseCalories: 206,
          baseProtein: 22,
          baseCarbs: 0,
          baseFats: 13
        }
      ],
      totalCalories: 309,
      color: "from-blue-500 to-indigo-500"
    }
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)
  const [isEditMealOpen, setIsEditMealOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [editQuantity, setEditQuantity] = useState(100)

  const totalCalories = mealCategories.reduce((sum, cat) => sum + cat.totalCalories, 0)
  const totalProtein = mealCategories.reduce((sum, cat) => 
    sum + cat.meals.reduce((mealSum, meal) => mealSum + meal.protein, 0), 0
  )
  const totalCarbs = mealCategories.reduce((sum, cat) => 
    sum + cat.meals.reduce((mealSum, meal) => mealSum + meal.carbs, 0), 0
  )
  const totalFats = mealCategories.reduce((sum, cat) => 
    sum + cat.meals.reduce((mealSum, meal) => mealSum + meal.fats, 0), 0
  )

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addFoodToMeal = (food: FoodItem, categoryId: string) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      quantity: 100,
      baseCalories: food.calories,
      baseProtein: food.protein,
      baseCarbs: food.carbs,
      baseFats: food.fats
    }

    setMealCategories(mealCategories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          meals: [...cat.meals, newMeal],
          totalCalories: cat.totalCalories + food.calories
        }
      }
      return cat
    }))

    setIsAddMealOpen(false)
    setSearchQuery("")
  }

  const openEditMeal = (meal: Meal, categoryId: string) => {
    setEditingMeal(meal)
    setEditQuantity(meal.quantity)
    setSelectedCategory(categoryId)
    setIsEditMealOpen(true)
  }

  const updateMealQuantity = () => {
    if (!editingMeal) return

    const multiplier = editQuantity / 100

    setMealCategories(mealCategories.map(cat => {
      if (cat.id === selectedCategory) {
        const updatedMeals = cat.meals.map(meal => {
          if (meal.id === editingMeal.id) {
            return {
              ...meal,
              quantity: editQuantity,
              calories: Math.round(meal.baseCalories * multiplier),
              protein: Math.round(meal.baseProtein * multiplier * 10) / 10,
              carbs: Math.round(meal.baseCarbs * multiplier * 10) / 10,
              fats: Math.round(meal.baseFats * multiplier * 10) / 10
            }
          }
          return meal
        })

        const newTotalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0)

        return {
          ...cat,
          meals: updatedMeals,
          totalCalories: newTotalCalories
        }
      }
      return cat
    }))

    setIsEditMealOpen(false)
    setEditingMeal(null)
  }

  const deleteMeal = (mealId: string, categoryId: string) => {
    setMealCategories(mealCategories.map(cat => {
      if (cat.id === categoryId) {
        const updatedMeals = cat.meals.filter(meal => meal.id !== mealId)
        const newTotalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0)

        return {
          ...cat,
          meals: updatedMeals,
          totalCalories: newTotalCalories
        }
      }
      return cat
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Nutrição</h2>
        <p className="text-gray-400">Registre suas refeições diárias</p>
      </div>

      {/* Daily Summary */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Resumo do Dia</h3>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {Math.round(totalCalories)} kcal
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
              <div className="text-xl font-bold text-blue-400">{Math.round(totalProtein)}g</div>
              <div className="text-xs text-gray-400">Proteínas</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
              <div className="text-xl font-bold text-green-400">{Math.round(totalCarbs)}g</div>
              <div className="text-xs text-gray-400">Carboidratos</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
              <div className="text-xl font-bold text-yellow-400">{Math.round(totalFats)}g</div>
              <div className="text-xs text-gray-400">Gorduras</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meal Categories */}
      <div className="space-y-4">
        {mealCategories.map((category) => (
          <Card key={category.id} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                    <category.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">{category.name}</h3>
                </div>
                <span className="text-sm text-gray-400">{Math.round(category.totalCalories)} kcal</span>
              </div>

              {/* Meals List */}
              {category.meals.length > 0 ? (
                <div className="space-y-2">
                  {category.meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-white truncate">{meal.name}</div>
                        <div className="text-xs text-gray-400">
                          {meal.quantity}g • P: {Math.round(meal.protein)}g • C: {Math.round(meal.carbs)}g • G: {Math.round(meal.fats)}g
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="text-right">
                          <div className={`font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                            {Math.round(meal.calories)}
                          </div>
                          <div className="text-xs text-gray-400">kcal</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditMeal(meal, category.id)}
                          className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMeal(meal.id, category.id)}
                          className="h-8 w-8 p-0 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  Nenhuma refeição registrada
                </div>
              )}

              {/* Add Meal Button */}
              <Dialog open={isAddMealOpen && selectedCategory === category.id} onOpenChange={(open) => {
                setIsAddMealOpen(open)
                if (open) setSelectedCategory(category.id)
              }}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full border-white/10 bg-gradient-to-r ${category.color} bg-clip-text text-transparent hover:bg-white/5 rounded-xl`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Alimento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-950 border border-white/10 text-white max-h-[80vh] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Adicionar Alimento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar alimento..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-900 border-white/10 text-white rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredFoods.map((food, index) => (
                        <button
                          key={index}
                          onClick={() => addFoodToMeal(food, category.id)}
                          className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-white">{food.name}</div>
                              <div className="text-xs text-gray-400">
                                {food.portion} • P: {food.protein}g C: {food.carbs}g G: {food.fats}g
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                                {food.calories}
                              </div>
                              <div className="text-xs text-gray-400">kcal</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Meal Dialog */}
      <Dialog open={isEditMealOpen} onOpenChange={setIsEditMealOpen}>
        <DialogContent className="bg-gray-950 border border-white/10 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Refeição</DialogTitle>
          </DialogHeader>
          {editingMeal && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Alimento</Label>
                <p className="text-lg font-semibold text-white mt-1">{editingMeal.name}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Quantidade (gramas)</Label>
                <Input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(Number(e.target.value))}
                  className="bg-gray-900 border-white/10 text-white rounded-xl"
                  min="1"
                />
              </div>

              <div className="p-4 bg-gray-900 rounded-xl space-y-2">
                <h4 className="font-semibold text-white">Valores Nutricionais ({editQuantity}g)</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Calorias:</span>
                    <span className="text-white ml-2 font-semibold">
                      {Math.round(editingMeal.baseCalories * (editQuantity / 100))} kcal
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Proteínas:</span>
                    <span className="text-blue-400 ml-2 font-semibold">
                      {Math.round(editingMeal.baseProtein * (editQuantity / 100) * 10) / 10}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Carboidratos:</span>
                    <span className="text-green-400 ml-2 font-semibold">
                      {Math.round(editingMeal.baseCarbs * (editQuantity / 100) * 10) / 10}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gorduras:</span>
                    <span className="text-yellow-400 ml-2 font-semibold">
                      {Math.round(editingMeal.baseFats * (editQuantity / 100) * 10) / 10}g
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditMealOpen(false)}
                  className="flex-1 border-gray-500/30 bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 hover:border-gray-500/50 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={updateMealQuantity}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
