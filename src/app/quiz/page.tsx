"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import QuizTab from "../components/QuizTab"
import { Zap } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
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

    // Verificar se já completou o quiz
    const { data: profile } = await supabase
      .from("profiles")
      .select("quiz_completed")
      .eq("id", user.id)
      .single()

    if (profile?.quiz_completed) {
      router.push("/app")
      return
    }

    setUserId(user.id)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <QuizTab userId={userId!} onComplete={() => router.push("/app")} />
    </div>
  )
}
