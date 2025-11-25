"use client"

import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff, Check, LogIn } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface SignupTabProps {
  onComplete: () => void
}

export default function SignupTab({ onComplete }: SignupTabProps) {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!isLogin && !formData.name.trim()) {
      setError("Por favor, insira seu nome")
      return false
    }
    if (!formData.email.trim()) {
      setError("Por favor, insira seu email")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email inválido")
      return false
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return false
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return false
    }
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (loginError) throw loginError

      if (data.user) {
        // Marcar como completo
        localStorage.setItem("fitmode_signup_completed", "true")
        onComplete()
      }
    } catch (err: any) {
      console.error("Erro no login:", err)
      setError(err.message || "Email ou senha incorretos")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // Recuperar dados do quiz do localStorage
      const quizData = localStorage.getItem("fitmode_quiz_data")
      
      // Criar conta no Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Salvar dados do signup no localStorage
        localStorage.setItem("fitmode_signup_data", JSON.stringify({
          name: formData.name,
          email: formData.email
        }))

        // Criar perfil
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            quiz_completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) throw profileError

        // Se houver dados do quiz, salvar
        if (quizData) {
          const parsedQuizData = JSON.parse(quizData)
          const { error: quizError } = await supabase
            .from("quiz_responses")
            .insert({
              ...parsedQuizData,
              user_id: authData.user.id,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString()
            })

          if (quizError) console.error("Erro ao salvar quiz:", quizError)
        }

        // Marcar cadastro como completo
        localStorage.setItem("fitmode_signup_completed", "true")
        
        // Redirecionar para início
        onComplete()
      }
    } catch (err: any) {
      console.error("Erro no cadastro:", err)
      setError(err.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = () => {
    const password = formData.password
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 6) return { strength: 1, label: "Fraca", color: "bg-red-500" }
    if (password.length < 10) return { strength: 2, label: "Média", color: "bg-yellow-500" }
    return { strength: 3, label: "Forte", color: "bg-green-500" }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#ff0000] to-[#cc0000] rounded-2xl flex items-center justify-center p-2">
            <Image
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/57198311-af09-4a78-8e26-a51e48043eba.jpg"
              alt="FitMode.ai Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
            </h2>
            <p className="text-white">
              {isLogin 
                ? "Entre com suas credenciais para continuar" 
                : "Complete seu cadastro para começar sua jornada fitness"}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
            {/* Nome - apenas no cadastro */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-12 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Indicador de força da senha - apenas no cadastro */}
              {!isLogin && formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= strength.strength ? strength.color : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs text-white">Senha {strength.label}</p>
                  )}
                </div>
              )}
            </div>

            {/* Confirmar Senha - apenas no cadastro */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Confirme sua senha"
                    className="w-full pl-10 pr-12 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Indicador de senhas coincidentes */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">Senhas coincidem</span>
                      </>
                    ) : (
                      <span className="text-xs text-red-500">As senhas não coincidem</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Botão Principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#ff2222] hover:to-[#dd0000] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#ff0000]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isLogin ? "Entrando..." : "Criando conta...") : (isLogin ? "Entrar" : "Criar Conta")}
          </button>

          {/* Toggle entre Login e Cadastro */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
              className="text-[#ff0000] hover:underline font-medium flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? (
                <>
                  <User className="w-4 h-4" />
                  Não tem conta? Cadastre-se
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Já tenho conta
                </>
              )}
            </button>
          </div>

          {/* Termos - apenas no cadastro */}
          {!isLogin && (
            <p className="text-xs text-center text-white">
              Ao criar uma conta, você concorda com nossos{" "}
              <button type="button" className="text-[#ff0000] hover:underline">
                Termos de Serviço
              </button>{" "}
              e{" "}
              <button type="button" className="text-[#ff0000] hover:underline">
                Política de Privacidade
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
