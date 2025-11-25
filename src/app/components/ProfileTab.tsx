"use client"

import { useState, useEffect, useRef } from "react"
import { User, Mail, Calendar, Ruler, Weight, Target, Trophy, Award, Settings, LogOut, Bell, Lock, Camera } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Traduções
const translations: Record<string, Record<string, string>> = {
  "pt-BR": {
    profile: "Perfil",
    manageInfo: "Gerencie suas informações pessoais",
    edit: "Editar",
    cancel: "Cancelar",
    name: "Nome",
    email: "Email",
    age: "Idade",
    height: "Altura (cm)",
    weight: "Peso (kg)",
    goal: "Objetivo",
    saveChanges: "Salvar Alterações",
    years: "anos",
    cm: "cm",
    kg: "kg",
    notDefined: "Não definido",
    statistics: "Estatísticas",
    completedWorkouts: "Treinos Completos",
    achievements: "Conquistas",
    currentStreak: "Sequência Atual",
    bestStreak: "Melhor Sequência",
    recentAchievements: "Conquistas Recentes",
    firstWeek: "Primeira Semana",
    firstWeekDesc: "Complete 7 dias consecutivos",
    totalStrength: "Força Total",
    totalStrengthDesc: "Complete 50 treinos",
    caloriesBurner: "Queimador de Calorias",
    caloriesBurnerDesc: "Queime 10.000 calorias",
    account: "Conta",
    settings: "Configurações",
    logout: "Sair",
    settingsTitle: "Configurações",
    settingsDesc: "Personalize sua experiência no FitMode.ai",
    units: "Unidades de Medida",
    notifications: "Notificações",
    privacy: "Privacidade",
    privacyDesc: "Seus dados são criptografados e protegidos de acordo com a LGPD.",
    metric: "Métrico (kg, cm)",
    imperial: "Imperial (lb, ft)",
    enabled: "Ativadas",
    disabled: "Desativadas",
    save: "Salvar"
  },
  "en-US": {
    profile: "Profile",
    manageInfo: "Manage your personal information",
    edit: "Edit",
    cancel: "Cancel",
    name: "Name",
    email: "Email",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    goal: "Goal",
    saveChanges: "Save Changes",
    years: "years",
    cm: "cm",
    kg: "kg",
    notDefined: "Not defined",
    statistics: "Statistics",
    completedWorkouts: "Completed Workouts",
    achievements: "Achievements",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    recentAchievements: "Recent Achievements",
    firstWeek: "First Week",
    firstWeekDesc: "Complete 7 consecutive days",
    totalStrength: "Total Strength",
    totalStrengthDesc: "Complete 50 workouts",
    caloriesBurner: "Calories Burner",
    caloriesBurnerDesc: "Burn 10,000 calories",
    account: "Account",
    settings: "Settings",
    logout: "Logout",
    settingsTitle: "Settings",
    settingsDesc: "Customize your FitMode.ai experience",
    units: "Units of Measurement",
    notifications: "Notifications",
    privacy: "Privacy",
    privacyDesc: "Your data is encrypted and protected according to LGPD.",
    metric: "Metric (kg, cm)",
    imperial: "Imperial (lb, ft)",
    enabled: "Enabled",
    disabled: "Disabled",
    save: "Save"
  },
  "es-ES": {
    profile: "Perfil",
    manageInfo: "Administra tu información personal",
    edit: "Editar",
    cancel: "Cancelar",
    name: "Nombre",
    email: "Correo",
    age: "Edad",
    height: "Altura (cm)",
    weight: "Peso (kg)",
    goal: "Objetivo",
    saveChanges: "Guardar Cambios",
    years: "años",
    cm: "cm",
    kg: "kg",
    notDefined: "No definido",
    statistics: "Estadísticas",
    completedWorkouts: "Entrenamientos Completados",
    achievements: "Logros",
    currentStreak: "Racha Actual",
    bestStreak: "Mejor Racha",
    recentAchievements: "Logros Recientes",
    firstWeek: "Primera Semana",
    firstWeekDesc: "Completa 7 días consecutivos",
    totalStrength: "Fuerza Total",
    totalStrengthDesc: "Completa 50 entrenamientos",
    caloriesBurner: "Quemador de Calorías",
    caloriesBurnerDesc: "Quema 10,000 calorías",
    account: "Cuenta",
    settings: "Configuración",
    logout: "Salir",
    settingsTitle: "Configuración",
    settingsDesc: "Personaliza tu experiencia en FitMode.ai",
    units: "Unidades de Medida",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    privacyDesc: "Tus datos están encriptados y protegidos según LGPD.",
    metric: "Métrico (kg, cm)",
    imperial: "Imperial (lb, ft)",
    enabled: "Activadas",
    disabled: "Desactivadas",
    save: "Guardar"
  },
  "fr-FR": {
    profile: "Profil",
    manageInfo: "Gérez vos informations personnelles",
    edit: "Modifier",
    cancel: "Annuler",
    name: "Nom",
    email: "Email",
    age: "Âge",
    height: "Taille (cm)",
    weight: "Poids (kg)",
    goal: "Objectif",
    saveChanges: "Enregistrer les modifications",
    years: "ans",
    cm: "cm",
    kg: "kg",
    notDefined: "Non défini",
    statistics: "Statistiques",
    completedWorkouts: "Entraînements Terminés",
    achievements: "Réalisations",
    currentStreak: "Série Actuelle",
    bestStreak: "Meilleure Série",
    recentAchievements: "Réalisations Récentes",
    firstWeek: "Première Semaine",
    firstWeekDesc: "Complétez 7 jours consécutifs",
    totalStrength: "Force Totale",
    totalStrengthDesc: "Complétez 50 entraînements",
    caloriesBurner: "Brûleur de Calories",
    caloriesBurnerDesc: "Brûlez 10 000 calories",
    account: "Compte",
    settings: "Paramètres",
    logout: "Déconnexion",
    settingsTitle: "Paramètres",
    settingsDesc: "Personnalisez votre expérience FitMode.ai",
    units: "Unités de Mesure",
    notifications: "Notifications",
    privacy: "Confidentialité",
    privacyDesc: "Vos données sont cryptées et protégées selon LGPD.",
    metric: "Métrique (kg, cm)",
    imperial: "Impérial (lb, ft)",
    enabled: "Activées",
    disabled: "Désactivées",
    save: "Enregistrer"
  }
}

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: 0,
    height: 0,
    weight: 0,
    goal: "",
    startDate: ""
  })

  const [settings, setSettings] = useState({
    language: "pt-BR",
    notifications: true,
    units: "metric"
  })

  const [stats] = useState({
    totalWorkouts: 48,
    totalCaloriesBurned: 12450,
    currentStreak: 7,
    longestStreak: 15,
    achievements: 12
  })

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem("fitmode_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Carregar dados do quiz e signup ao montar o componente
  useEffect(() => {
    const quizData = localStorage.getItem("fitmode_quiz_data")
    const signupData = localStorage.getItem("fitmode_signup_data")
    const savedPhoto = localStorage.getItem("fitmode_profile_photo")
    
    if (savedPhoto) {
      setProfilePhoto(savedPhoto)
    }
    
    if (quizData && signupData) {
      const quiz = JSON.parse(quizData)
      const signup = JSON.parse(signupData)
      
      // Extrair dados do diet_preference que contém informações extras
      let dietPreference: any = {}
      try {
        dietPreference = JSON.parse(quiz.diet_preference || "{}")
      } catch (e) {
        console.error("Erro ao parsear diet_preference:", e)
      }

      // Mapear objetivo para texto legível
      const goalMap: Record<string, string> = {
        "weight-loss": "Perder Peso",
        "muscle-gain": "Ganhar Massa Muscular",
        "tone": "Tonificar",
        "endurance": "Aumentar Resistência"
      }

      setProfile({
        name: signup.name || "",
        email: signup.email || "",
        age: dietPreference.age || 0,
        height: dietPreference.height || 0,
        weight: dietPreference.current_weight || 0,
        goal: goalMap[quiz.goal] || quiz.goal || "",
        startDate: new Date().toLocaleDateString("pt-BR")
      })
    }
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const photoUrl = reader.result as string
        setProfilePhoto(photoUrl)
        localStorage.setItem("fitmode_profile_photo", photoUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleSave = () => {
    // Atualizar dados no localStorage
    const signupData = localStorage.getItem("fitmode_signup_data")
    if (signupData) {
      const signup = JSON.parse(signupData)
      signup.name = profile.name
      signup.email = profile.email
      localStorage.setItem("fitmode_signup_data", JSON.stringify(signup))
    }

    const quizData = localStorage.getItem("fitmode_quiz_data")
    if (quizData) {
      const quiz = JSON.parse(quizData)
      let dietPreference: any = {}
      try {
        dietPreference = JSON.parse(quiz.diet_preference || "{}")
      } catch (e) {
        dietPreference = {}
      }
      
      dietPreference.age = profile.age
      dietPreference.height = profile.height
      dietPreference.current_weight = profile.weight
      
      quiz.diet_preference = JSON.stringify(dietPreference)
      localStorage.setItem("fitmode_quiz_data", JSON.stringify(quiz))
    }

    setIsEditing(false)
  }

  const handleLogout = () => {
    // Limpar dados de autenticação
    localStorage.removeItem("fitmode_quiz_completed")
    localStorage.removeItem("fitmode_signup_completed")
    
    // Recarregar a página para voltar ao quiz
    window.location.reload()
  }

  const handleSaveSettings = () => {
    // Salvar configurações no localStorage
    localStorage.setItem("fitmode_settings", JSON.stringify(settings))
    setShowSettings(false)
  }

  const t = translations[settings.language] || translations["pt-BR"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">{t.profile}</h2>
        <p className="text-gray-400">{t.manageInfo}</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <div 
                onClick={handlePhotoClick}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer overflow-hidden group"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-white">{profile.name || "Usuário"}</h3>
              <p className="text-gray-400 flex items-center justify-center sm:justify-start gap-2 text-sm break-all">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">{profile.email || "email@exemplo.com"}</span>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 rounded-xl"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditing ? t.cancel : t.edit}
            </Button>
          </div>

          {/* Editable Fields */}
          {isEditing ? (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">{t.name}</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-gray-800/50 border-white/10 text-white rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t.email}</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-gray-800/50 border-white/10 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">{t.age}</Label>
                  <Input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                    className="bg-gray-800/50 border-white/10 text-white rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t.height}</Label>
                  <Input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                    className="bg-gray-800/50 border-white/10 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">{t.weight}</Label>
                  <Input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                    className="bg-gray-800/50 border-white/10 text-white rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t.goal}</Label>
                  <Input
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                    className="bg-gray-800/50 border-white/10 text-white rounded-xl"
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
              >
                {t.saveChanges}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs text-gray-400">{t.age}</div>
                  <div className="font-semibold text-white">{profile.age || 0} {t.years}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <Ruler className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-xs text-gray-400">{t.height.split(" ")[0]}</div>
                  <div className="font-semibold text-white">{profile.height || 0} {t.cm}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <Weight className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs text-gray-400">{t.weight.split(" ")[0]}</div>
                  <div className="font-semibold text-white">{profile.weight || 0} {t.kg}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <Target className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs text-gray-400">{t.goal}</div>
                  <div className="font-semibold text-white text-xs">{profile.goal || t.notDefined}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Statistics */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">{t.statistics}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalWorkouts}</div>
            <div className="text-xs text-gray-400">{t.completedWorkouts}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.achievements}</div>
            <div className="text-xs text-gray-400">{t.achievements}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
            <div className="text-xs text-gray-400">{t.currentStreak}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">{stats.longestStreak}</div>
            <div className="text-xs text-gray-400">{t.bestStreak}</div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">{t.recentAchievements}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">{t.firstWeek}</div>
              <div className="text-xs text-gray-400">{t.firstWeekDesc}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
              💪
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">{t.totalStrength}</div>
              <div className="text-xs text-gray-400">{t.totalStrengthDesc}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
              🔥
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">{t.caloriesBurner}</div>
              <div className="text-xs text-gray-400">{t.caloriesBurnerDesc}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">{t.account}</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowSettings(true)}
            className="w-full border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 justify-start rounded-xl"
          >
            <Settings className="w-4 h-4 mr-2" />
            {t.settings}
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 justify-start rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.logout}
          </Button>
        </div>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{t.settingsTitle}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {t.settingsDesc}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Unidades de Medida */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                {t.units}
              </Label>
              <Select 
                value={settings.units} 
                onValueChange={(value) => setSettings({ ...settings, units: value })}
              >
                <SelectTrigger className="bg-gray-800/50 border-white/10 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10 rounded-xl">
                  <SelectItem value="metric" className="text-white">{t.metric}</SelectItem>
                  <SelectItem value="imperial" className="text-white">{t.imperial}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notificações */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {t.notifications}
              </Label>
              <Select 
                value={settings.notifications ? "enabled" : "disabled"} 
                onValueChange={(value) => setSettings({ ...settings, notifications: value === "enabled" })}
              >
                <SelectTrigger className="bg-gray-800/50 border-white/10 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10 rounded-xl">
                  <SelectItem value="enabled" className="text-white">{t.enabled}</SelectItem>
                  <SelectItem value="disabled" className="text-white">{t.disabled}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Privacidade */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t.privacy}
              </Label>
              <p className="text-sm text-gray-400">
                {t.privacyDesc}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="flex-1 border-gray-500/30 bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 hover:border-gray-500/50 rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
            >
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
