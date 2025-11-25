"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Utensils, Users, TrendingUp, Home, LogOut, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HomeTab from "../components/HomeTab"
import WorkoutTab from "../components/WorkoutTab"
import NutritionTab from "../components/NutritionTab"
import CommunityTab from "../components/CommunityTab"
import ProgressTab from "../components/ProgressTab"

export default function AppPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/auth")
      return
    }

    // Verificar se completou o quiz
    const { data: profile } = await supabase
      .from("profiles")
      .select("quiz_completed")
      .eq("id", user.id)
      .single()

    if (!profile?.quiz_completed) {
      router.push("/quiz")
      return
    }

    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff0000] to-[#cc0000] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Award className="w-10 h-10 text-white" />
          </div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-[#1a0000] to-black border-b border-[#ff0000]/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                FitMode.ai
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-[#ff0000]/10 rounded-lg transition-all"
            >
              <LogOut className="w-6 h-6 text-[#ff0000]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="mt-0">
            <HomeTab userId={user?.id} />
          </TabsContent>
          
          <TabsContent value="workout" className="mt-0">
            <WorkoutTab userId={user?.id} />
          </TabsContent>
          
          <TabsContent value="nutrition" className="mt-0">
            <NutritionTab userId={user?.id} />
          </TabsContent>
          
          <TabsContent value="community" className="mt-0">
            <CommunityTab userId={user?.id} />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            <ProgressTab userId={user?.id} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent border-t border-[#ff0000]/20 backdrop-blur-lg">
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
      className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
        active 
          ? "text-[#ff0000] bg-[#ff0000]/10" 
          : "text-white hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
