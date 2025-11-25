"use client"

import { useState, useEffect } from "react"
import { Utensils, Users, TrendingUp, Home, Award, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HomeTab from "./components/HomeTab"
import WorkoutTab from "./components/WorkoutTab"
import NutritionTab from "./components/NutritionTab"
import CommunityTab from "./components/CommunityTab"
import ProgressTab from "./components/ProgressTab"
import ProfileTab from "./components/ProfileTab"
import QuizTab from "./components/QuizTab"
import SignupTab from "./components/SignupTab"

export default function FitModeApp() {
  const [activeTab, setActiveTab] = useState("quiz")
  const [showQuiz, setShowQuiz] = useState(true)
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    const hasCompletedQuiz = localStorage.getItem("fitmode_quiz_completed")
    const hasCompletedSignup = localStorage.getItem("fitmode_signup_completed")
    
    if (hasCompletedSignup) {
      setShowQuiz(false)
      setShowSignup(false)
      setActiveTab("home")
    } else if (hasCompletedQuiz) {
      setShowQuiz(false)
      setShowSignup(true)
      setActiveTab("signup")
    }
  }, [])

  const handleQuizComplete = () => {
    setShowQuiz(false)
    setShowSignup(true)
    setActiveTab("signup")
  }

  const handleSignupComplete = () => {
    setShowSignup(false)
    setActiveTab("home")
  }

  const handleNavigateToWorkout = () => {
    setActiveTab("workout")
  }

  // Se ainda está no quiz ou signup, não mostrar navegação
  const showNavigation = !showQuiz && !showSignup

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FitMode.ai
              </h1>
            </div>
            {showNavigation && (
              <button 
                onClick={() => setActiveTab("profile")}
                className="p-2 hover:bg-white/5 rounded-xl transition-all"
              >
                <User className="w-6 h-6 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {showQuiz ? (
          <QuizTab onComplete={handleQuizComplete} />
        ) : showSignup ? (
          <SignupTab onComplete={handleSignupComplete} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="home" className="mt-0">
              <HomeTab onNavigateToWorkout={handleNavigateToWorkout} />
            </TabsContent>
            
            <TabsContent value="workout" className="mt-0">
              <WorkoutTab />
            </TabsContent>
            
            <TabsContent value="nutrition" className="mt-0">
              <NutritionTab />
            </TabsContent>
            
            <TabsContent value="community" className="mt-0">
              <CommunityTab />
            </TabsContent>
            
            <TabsContent value="progress" className="mt-0">
              <ProgressTab />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <ProfileTab />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Bottom Navigation - Apenas quando não está no quiz ou signup */}
      {showNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              <NavButton
                icon={Home}
                label="Início"
                active={activeTab === "home"}
                onClick={() => setActiveTab("home")}
              />
              <NavButton
                icon={Award}
                label="Treino"
                active={activeTab === "workout"}
                onClick={() => setActiveTab("workout")}
              />
              <NavButton
                icon={Utensils}
                label="Nutrição"
                active={activeTab === "nutrition"}
                onClick={() => setActiveTab("nutrition")}
              />
              <NavButton
                icon={Users}
                label="Comunidade"
                active={activeTab === "community"}
                onClick={() => setActiveTab("community")}
              />
              <NavButton
                icon={TrendingUp}
                label="Progresso"
                active={activeTab === "progress"}
                onClick={() => setActiveTab("progress")}
              />
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}

function NavButton({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
        active 
          ? "text-blue-400 bg-blue-500/10" 
          : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
