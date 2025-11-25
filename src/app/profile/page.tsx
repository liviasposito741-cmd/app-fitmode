"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Globe, 
  FileText, 
  Shield, 
  Dumbbell, 
  Clock, 
  Bell, 
  Lock, 
  LogOut, 
  Camera,
  Settings,
  ChevronRight,
  Check
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

const EQUIPMENT_LIST = [
  "Esteira",
  "Bicicleta Ergométrica",
  "Elíptico",
  "Leg Press",
  "Supino",
  "Agachamento Livre",
  "Barra Fixa",
  "Paralelas",
  "Halteres",
  "Kettlebells",
  "Banco Ajustável",
  "Polia Alta/Baixa",
  "Smith Machine",
  "Cadeira Extensora",
  "Cadeira Flexora",
  "Remada Sentada",
  "Desenvolvimento",
  "Crucifixo",
]

const LANGUAGES = [
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "en-US", name: "English (US)" },
  { code: "es-ES", name: "Español" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Informações Pessoais
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  
  // Preferências
  const [language, setLanguage] = useState("pt-BR")
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [restTime, setRestTime] = useState([60]) // em segundos
  const [notifications, setNotifications] = useState(true)
  
  // Mensagens
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth")
        return
      }

      setUser(user)
      setEmail(user.email || "")

      // Carregar perfil do usuário
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || "")
        setAvatarUrl(profile.avatar_url || "")
        setPhone(profile.phone || "")
        setBirthDate(profile.birth_date || "")
        setLanguage(profile.language || "pt-BR")
        setSelectedEquipment(profile.available_equipment || [])
        setRestTime([profile.rest_time || 60])
        setNotifications(profile.notifications_enabled ?? true)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePersonalInfo = async () => {
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
          birth_date: birthDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccessMessage("Informações pessoais atualizadas com sucesso!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao salvar informações")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLanguage = async () => {
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          language: language,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccessMessage("Idioma atualizado com sucesso!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao salvar idioma")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEquipment = async () => {
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          available_equipment: selectedEquipment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccessMessage("Equipamentos atualizados com sucesso!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao salvar equipamentos")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveRestTime = async () => {
    setSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          rest_time: restTime[0],
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccessMessage("Tempo de descanso atualizado com sucesso!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao salvar tempo de descanso")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  const formatRestTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ff0000] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-[#1a0000] to-black border-b border-[#ff0000]/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Perfil</h1>
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-white/60 hover:text-white"
            >
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl pb-24">
        {/* Mensagens de Feedback */}
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-xl p-4 text-green-400 animate-in fade-in slide-in-from-top-2">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 animate-in fade-in slide-in-from-top-2">
            {errorMessage}
          </div>
        )}

        {/* Cabeçalho do Perfil */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Foto de Perfil */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff0000] to-[#cc0000] flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#ff0000] rounded-full flex items-center justify-center hover:bg-[#cc0000] transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Nome e Email */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{fullName || "Usuário"}</h2>
              <p className="text-white/60 mb-4">{email}</p>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
                onClick={() => {}}
              >
                <Settings className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#ff0000]" />
            Informações Pessoais
          </h3>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white/80">Nome Completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-black/50 border-white/20 text-white"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                value={email}
                disabled
                className="bg-black/30 border-white/10 text-white/50 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 bg-black/50 border-white/20 text-white"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-white/80">Data de Nascimento</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="pl-11 bg-black/50 border-white/20 text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleSavePersonalInfo}
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-semibold"
            >
              {saving ? "Salvando..." : "Salvar Informações"}
            </Button>
          </div>
        </div>

        {/* Preferências de Idioma */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#ff0000]" />
            Preferências de Idioma
          </h3>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white/80">Idioma do Aplicativo</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/20">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-white/5">
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSaveLanguage}
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-semibold"
            >
              {saving ? "Salvando..." : "Confirmar Idioma"}
            </Button>
          </div>
        </div>

        {/* Termos e Privacidade */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ff0000]" />
            Termos e Privacidade
          </h3>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/terms")}
              className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-white/60" />
                <span className="text-white">Termos de Serviço</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            <button
              onClick={() => router.push("/privacy")}
              className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-white/60" />
                <span className="text-white">Política de Privacidade</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            <p className="text-sm text-white/60 text-center mt-4">
              Ao utilizar o FitMode.ai, você concorda com nossos termos de serviço e política de privacidade.
            </p>
          </div>
        </div>

        {/* Equipamentos Disponíveis */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#ff0000]" />
            Equipamentos Disponíveis
          </h3>
          
          <p className="text-sm text-white/60 mb-6">
            Marque os equipamentos que você tem acesso na sua academia ou em casa. Isso ajudará a personalizar seus treinos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {EQUIPMENT_LIST.map((equipment) => (
              <div
                key={equipment}
                className="flex items-center gap-3 p-3 bg-black/30 hover:bg-black/50 rounded-xl transition-colors cursor-pointer"
                onClick={() => handleToggleEquipment(equipment)}
              >
                <Checkbox
                  checked={selectedEquipment.includes(equipment)}
                  onCheckedChange={() => handleToggleEquipment(equipment)}
                  className="border-white/20 data-[state=checked]:bg-[#ff0000] data-[state=checked]:border-[#ff0000]"
                />
                <label className="text-white cursor-pointer flex-1">
                  {equipment}
                </label>
                {selectedEquipment.includes(equipment) && (
                  <Check className="w-4 h-4 text-[#ff0000]" />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleSaveEquipment}
            disabled={saving}
            className="w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-semibold"
          >
            {saving ? "Salvando..." : "Atualizar Equipamentos"}
          </Button>
        </div>

        {/* Tempo de Descanso */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#ff0000]" />
            Tempo de Descanso Entre Séries
          </h3>
          
          <p className="text-sm text-white/60 mb-6">
            Configure o tempo de descanso padrão entre as séries. Essa configuração será aplicada automaticamente nos seus treinos.
          </p>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Tempo de Descanso</Label>
                <span className="text-2xl font-bold text-[#ff0000]">
                  {formatRestTime(restTime[0])}
                </span>
              </div>
              
              <Slider
                value={restTime}
                onValueChange={setRestTime}
                min={30}
                max={180}
                step={15}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-white/40">
                <span>30s</span>
                <span>1m</span>
                <span>2m</span>
                <span>3m</span>
              </div>
            </div>

            <Button
              onClick={handleSaveRestTime}
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-semibold"
            >
              {saving ? "Salvando..." : "Salvar Tempo de Descanso"}
            </Button>
          </div>
        </div>

        {/* Configurações Adicionais */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#ff0000]" />
            Configurações Adicionais
          </h3>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/change-password")}
              className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-white/60" />
                <span className="text-white">Alterar Senha</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            <button
              onClick={() => {}}
              className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-white/60" />
                <span className="text-white">Notificações</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">
                  {notifications ? "Ativadas" : "Desativadas"}
                </span>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-semibold">Sair da Conta</span>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400/60" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
