"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, Eye, EyeOff, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Verificar se completou o quiz
        const { data: profile } = await supabase
          .from("profiles")
          .select("quiz_completed")
          .eq("id", data.user.id)
          .single()

        if (profile?.quiz_completed) {
          router.push("/app")
        } else {
          router.push("/quiz")
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        // Criar perfil
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            quiz_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          // Redirecionar para o quiz
          router.push("/quiz")
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/quiz`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login social.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background com imagem de agachamento */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1920&h=1080&fit=crop&q=80" 
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Cabeçalho com Logo e Slogan */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff0000] to-[#cc0000] rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50">
              <span className="text-3xl font-black text-white">FM</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            FitMode.ai
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Transforme seu Corpo, Transforme Sua Vida
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Tabs Login/Cadastro */}
          <div className="flex gap-2 mb-8">
            <Button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setError("")
              }}
              className={`flex-1 py-6 text-base font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white shadow-lg shadow-red-500/30"
                  : "bg-transparent border border-white/20 text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              Entrar
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setError("")
              }}
              className={`flex-1 py-6 text-base font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white shadow-lg shadow-red-500/30"
                  : "bg-transparent border border-white/20 text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              Criar Conta
            </Button>
          </div>

          {/* Opções de Login Social */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-6 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Gmail
            </Button>

            <Button
              type="button"
              onClick={() => handleSocialLogin("apple")}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-6 flex items-center justify-center gap-3 border border-white/20 transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continuar com Apple
            </Button>
          </div>

          {/* Divisor */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1a1a] text-white/60">ou continue com email</span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white font-medium">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="pl-11 py-6 bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000]/20 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 py-6 bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000]/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 pr-11 py-6 bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000]/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Link Esqueceu a Senha */}
            {isLogin && (
              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#ff0000] hover:text-[#cc0000] font-medium transition-colors"
                >
                  Esqueceu a Senha?
                </Link>
              </div>
            )}

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            {/* Botão de Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-bold py-6 text-lg shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Carregando...
                </span>
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          {/* Mensagem de Segurança */}
          <div className="mt-6 flex items-center justify-center gap-2 text-white/60 text-xs">
            <Shield className="w-4 h-4" />
            <span>Suas informações estão seguras conosco</span>
          </div>

          {/* Toggle Login/Cadastro */}
          <div className="mt-6 text-center text-sm text-white/80">
            {isLogin ? (
              <p>
                Não tem conta?{" "}
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setError("")
                  }}
                  className="text-[#ff0000] hover:text-[#cc0000] font-semibold transition-colors"
                >
                  Criar conta
                </button>
              </p>
            ) : (
              <p>
                Já tem uma conta?{" "}
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setError("")
                  }}
                  className="text-[#ff0000] hover:text-[#cc0000] font-semibold transition-colors"
                >
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Rodapé com Links Legais */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-white/40 text-xs">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/terms" className="text-white/60 hover:text-white underline transition-colors">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-white/60 hover:text-white underline transition-colors">
              Política de Privacidade
            </Link>
          </p>
          <p className="text-white/60 text-sm italic font-light">
            "O corpo alcança o que a mente acredita"
          </p>
        </div>
      </div>
    </div>
  )
}
