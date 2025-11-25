"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Check, Sparkles, Heart, Activity, Target, Clock, AlertCircle, User, Dumbbell, Home as HomeIcon, Weight, TrendingUp, Calendar, Award } from "lucide-react"

interface QuizAnswer {
  question: string
  answer: string | string[] | number
}

interface QuizTabProps {
  onComplete: () => void
}

export default function QuizTab({ onComplete }: QuizTabProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showSummary, setShowSummary] = useState(false)

  const questions = [
    {
      id: "welcome",
      type: "welcome",
      title: "Bem-vindo ao FitMode.ai! 🎯",
      description: "Estamos animados em ajudá-lo a alcançar seus objetivos fitness!",
      content: "Este quiz rápido (5-7 minutos) nos ajudará a criar um treino 100% personalizado para você. Suas respostas honestas são essenciais para garantir os melhores resultados e um treino seguro e eficaz."
    },
    {
      id: "personal-info",
      type: "personal-info",
      question: "Informações Pessoais",
      subtitle: "Nos conte um pouco sobre você"
    },
    {
      id: "gender",
      type: "gender",
      question: "Qual é o seu gênero?",
      subtitle: "Isso nos ajuda a personalizar melhor seu treino",
      options: [
        { 
          value: "male", 
          label: "Masculino",
          image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop"
        },
        { 
          value: "female", 
          label: "Feminino",
          image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=500&fit=crop"
        }
      ]
    },
    {
      id: "goals",
      type: "visual-single",
      question: "Qual é seu principal objetivo?",
      options: [
        { 
          value: "weight-loss", 
          label: "Perder Peso", 
          icon: Target,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          description: "Queimar gordura e definir"
        },
        { 
          value: "muscle-gain", 
          label: "Ganhar Massa Muscular", 
          icon: Activity,
          image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
          description: "Hipertrofia e força"
        },
        { 
          value: "tone", 
          label: "Tonificar", 
          icon: Heart,
          image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
          description: "Definição muscular"
        },
        { 
          value: "endurance", 
          label: "Aumentar Resistência", 
          icon: TrendingUp,
          image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop",
          description: "Condicionamento físico"
        }
      ]
    },
    {
      id: "gym-type",
      type: "single",
      question: "Onde você treina?",
      options: [
        { value: "chain-gym", label: "Academia de Rede", icon: Dumbbell, description: "Equipamentos completos" },
        { value: "small-gym", label: "Academia Pequena", icon: Dumbbell, description: "Equipamentos básicos" },
        { value: "home", label: "Em Casa", icon: HomeIcon, description: "Com equipamentos" },
        { value: "bodyweight", label: "Apenas Peso Corporal", icon: User, description: "Sem equipamentos" }
      ]
    },
    {
      id: "body-areas",
      type: "muscle-groups",
      question: "Quais músculos você deseja desenvolver?",
      subtitle: "Selecione todos que se aplicam",
      options: [
        { value: "chest", label: "Peito" },
        { value: "shoulder", label: "Ombro" },
        { value: "back", label: "Costas" },
        { value: "biceps", label: "Bíceps" },
        { value: "triceps", label: "Tríceps" },
        { value: "forearm", label: "Antebraço" },
        { value: "abs", label: "Abdômen" },
        { value: "glutes", label: "Glúteo" },
        { value: "quadriceps", label: "Quadríceps" },
        { value: "hamstring", label: "Posterior de Coxa" },
        { value: "calf", label: "Panturrilha" }
      ]
    },
    {
      id: "weight-goal",
      type: "weight-goal",
      question: "Qual é sua meta de peso?",
      subtitle: "Defina seu peso atual e desejado"
    },
    {
      id: "activity-level",
      type: "single",
      question: "Qual seu nível atual de atividade física?",
      options: [
        { value: "sedentary", label: "Sedentário", description: "Pouca ou nenhuma atividade" },
        { value: "light", label: "Leve", description: "Exercício 1-2x por semana" },
        { value: "moderate", label: "Moderado", description: "Exercício 3-4x por semana" },
        { value: "active", label: "Ativo", description: "Exercício 5-6x por semana" }
      ]
    },
    {
      id: "health-conditions",
      type: "multiple",
      question: "Você tem alguma condição de saúde ou limitação física?",
      subtitle: "Isso nos ajuda a adaptar os exercícios (opcional)",
      options: [
        { value: "knee", label: "Problemas no joelho", icon: AlertCircle },
        { value: "back", label: "Problemas nas costas", icon: AlertCircle },
        { value: "shoulder", label: "Problemas no ombro", icon: AlertCircle },
        { value: "heart", label: "Condições cardíacas", icon: AlertCircle },
        { value: "none", label: "Nenhuma limitação" }
      ],
      skippable: true
    },
    {
      id: "experience",
      type: "single",
      question: "Qual sua experiência com treinos?",
      options: [
        { value: "beginner", label: "Iniciante", description: "Nunca treinei ou parei há muito tempo" },
        { value: "intermediate", label: "Intermediário", description: "Treino há alguns meses" },
        { value: "advanced", label: "Avançado", description: "Treino há mais de 1 ano" }
      ]
    },
    {
      id: "available-days",
      type: "single",
      question: "Quantos dias por semana você pode treinar?",
      options: [
        { value: "3", label: "3 dias", description: "Iniciante" },
        { value: "4", label: "4 dias", description: "Intermediário" },
        { value: "5", label: "5 dias", description: "Avançado" },
        { value: "6", label: "6 dias", description: "Expert" }
      ]
    }
  ]

  const handleAnswer = (questionId: string, answer: string | string[] | number) => {
    const newAnswers = [...answers]
    const existingIndex = newAnswers.findIndex(a => a.question === questionId)
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex].answer = answer
    } else {
      newAnswers.push({ question: questionId, answer })
    }
    
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const saveQuizAndProceed = () => {
    try {
      const weightGoal = answers.find(a => a.question === "weight-goal")?.answer as any
      const personalInfo = answers.find(a => a.question === "personal-info")?.answer as any
      const gender = answers.find(a => a.question === "gender")?.answer as string || ""
      const gymType = answers.find(a => a.question === "gym-type")?.answer as string || ""
      const bodyAreas = answers.find(a => a.question === "body-areas")?.answer as string[] || []
      
      // Salvar dados do quiz no localStorage para usar após o cadastro
      const quizData = {
        goal: answers.find(a => a.question === "goals")?.answer as string || "",
        activity_level: answers.find(a => a.question === "activity-level")?.answer as string || "",
        health_conditions: answers.find(a => a.question === "health-conditions")?.answer as string[] || [],
        exercise_preferences: bodyAreas,
        experience_level: answers.find(a => a.question === "experience")?.answer as string || "",
        available_days: parseInt(answers.find(a => a.question === "available-days")?.answer as string || "3"),
        workout_duration: "45-60min",
        diet_preference: JSON.stringify({
          gender,
          gym_type: gymType,
          body_areas: bodyAreas,
          current_weight: weightGoal?.current || 0,
          target_weight: weightGoal?.target || 0,
          weight_deadline: weightGoal?.deadline || "",
          age: personalInfo?.age || 0,
          height: personalInfo?.height || 0
        })
      }

      localStorage.setItem("fitmode_quiz_data", JSON.stringify(quizData))
      localStorage.setItem("fitmode_quiz_completed", "true")
      
      // Ir para tela de cadastro
      onComplete()
    } catch (error) {
      console.error("Erro ao salvar quiz:", error)
      alert("Erro ao salvar suas respostas. Tente novamente.")
    }
  }

  const currentQuestion = questions[currentStep]
  const currentAnswer = answers.find(a => a.question === currentQuestion.id)?.answer

  const canProceed = currentQuestion.type === "welcome" || 
                     currentQuestion.skippable || 
                     (currentAnswer && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true))

  if (showSummary) {
    return <QuizSummary answers={answers} questions={questions} onSave={saveQuizAndProceed} />
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-sm text-[#ff0000] font-medium">
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff0000] to-[#ff4444] transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1">
          {currentQuestion.type === "welcome" ? (
            <WelcomeScreen 
              title={currentQuestion.title}
              description={currentQuestion.description}
              content={currentQuestion.content}
            />
          ) : currentQuestion.type === "personal-info" ? (
            <PersonalInfoQuestion
              question={currentQuestion.question}
              subtitle={currentQuestion.subtitle}
              value={currentAnswer as any}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          ) : currentQuestion.type === "gender" ? (
            <GenderQuestion
              question={currentQuestion.question}
              subtitle={currentQuestion.subtitle}
              options={currentQuestion.options}
              selectedValue={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          ) : currentQuestion.type === "visual-single" ? (
            <VisualSingleChoice
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedValue={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          ) : currentQuestion.type === "muscle-groups" ? (
            <MuscleGroupsQuestion
              question={currentQuestion.question}
              subtitle={currentQuestion.subtitle}
              options={currentQuestion.options}
              selectedValues={Array.isArray(currentAnswer) ? currentAnswer : []}
              onChange={(values) => handleAnswer(currentQuestion.id, values)}
            />
          ) : currentQuestion.type === "weight-goal" ? (
            <WeightGoalQuestion
              question={currentQuestion.question}
              subtitle={currentQuestion.subtitle}
              value={currentAnswer as any}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          ) : currentQuestion.type === "multiple" ? (
            <MultipleChoiceQuestion
              question={currentQuestion.question}
              subtitle={currentQuestion.subtitle}
              options={currentQuestion.options}
              selectedValues={Array.isArray(currentAnswer) ? currentAnswer : []}
              onChange={(values) => handleAnswer(currentQuestion.id, values)}
            />
          ) : (
            <SingleChoiceQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedValue={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-8">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
          )}
          
          {currentQuestion.skippable && !canProceed && (
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
            >
              Pular
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              canProceed
                ? "bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#ff2222] hover:to-[#dd0000] text-white shadow-lg shadow-[#ff0000]/20"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {currentStep === questions.length - 1 ? "Finalizar" : "Continuar"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function WelcomeScreen({ title, description, content }: { title: string, description: string, content: string }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#ff0000] to-[#cc0000] rounded-2xl flex items-center justify-center">
        <Award className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="text-xl text-white">{description}</p>
      </div>
      
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
        <p className="text-white leading-relaxed">{content}</p>
      </div>

      <div className="flex items-center justify-center gap-8 pt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#ff0000]" />
          <span className="text-sm text-white">5-7 minutos</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#ff0000]" />
          <span className="text-sm text-white">100% Personalizado</span>
        </div>
      </div>
    </div>
  )
}

function PersonalInfoQuestion({ 
  question, 
  subtitle,
  value,
  onChange 
}: { 
  question: string
  subtitle?: string
  value: any
  onChange: (value: any) => void
}) {
  const [age, setAge] = useState(value?.age || "")
  const [height, setHeight] = useState(value?.height || "")

  const handleChange = (field: string, val: string) => {
    const newValue = {
      age: field === "age" ? val : age,
      height: field === "height" ? val : height
    }
    
    if (field === "age") setAge(val)
    if (field === "height") setHeight(val)
    
    onChange(newValue)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-white">{question}</h2>
        {subtitle && <p className="text-white">{subtitle}</p>}
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Idade (anos)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={age}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="25"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Altura (cm)
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={height}
                onChange={(e) => handleChange("height", e.target.value)}
                placeholder="175"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GenderQuestion({ 
  question, 
  subtitle,
  options, 
  selectedValue, 
  onChange 
}: { 
  question: string
  subtitle?: string
  options: any[]
  selectedValue: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-white">{question}</h2>
        {subtitle && <p className="text-white">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`relative overflow-hidden rounded-2xl border-4 transition-all ${
                isSelected
                  ? "border-[#ff0000] shadow-2xl shadow-[#ff0000]/30"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="relative h-80">
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isSelected 
                    ? "from-[#ff0000] via-[#ff0000]/50 to-transparent" 
                    : "from-black via-black/50 to-transparent"
                }`} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{option.label}</h3>
                    {isSelected && (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-[#ff0000]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function VisualSingleChoice({ 
  question, 
  options, 
  selectedValue, 
  onChange 
}: { 
  question: string
  options: any[]
  selectedValue: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">{question}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          const Icon = option.icon
          
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-[#ff0000] shadow-lg shadow-[#ff0000]/20"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="relative h-48">
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className={`absolute inset-0 ${
                  isSelected 
                    ? "bg-[#ff0000]/40" 
                    : "bg-black/40"
                }`} />
              </div>
              <div className="p-4 bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-[#ff0000]" />}
                    <h3 className="font-bold text-white">{option.label}</h3>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-[#ff0000]" />
                  )}
                </div>
                <p className="text-sm text-white text-left">{option.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MuscleGroupsQuestion({ 
  question, 
  subtitle,
  options, 
  selectedValues, 
  onChange 
}: { 
  question: string
  subtitle?: string
  options: any[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}) {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-white">{question}</h2>
        {subtitle && <p className="text-white">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value)
          
          return (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-[#ff0000] bg-[#ff0000]/10 shadow-lg shadow-[#ff0000]/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <h3 className={`font-bold text-center ${isSelected ? "text-[#ff0000]" : "text-white"}`}>
                  {option.label}
                </h3>
                {isSelected && (
                  <Check className="w-5 h-5 text-[#ff0000]" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WeightGoalQuestion({ 
  question, 
  subtitle,
  value,
  onChange 
}: { 
  question: string
  subtitle?: string
  value: any
  onChange: (value: any) => void
}) {
  const [current, setCurrent] = useState(value?.current || "")
  const [target, setTarget] = useState(value?.target || "")
  const [deadline, setDeadline] = useState(value?.deadline || "")

  const handleChange = (field: string, val: string) => {
    const newValue = {
      current: field === "current" ? val : current,
      target: field === "target" ? val : target,
      deadline: field === "deadline" ? val : deadline
    }
    
    if (field === "current") setCurrent(val)
    if (field === "target") setTarget(val)
    if (field === "deadline") setDeadline(val)
    
    onChange(newValue)
  }

  const difference = target && current ? parseFloat(target) - parseFloat(current) : 0
  const isGain = difference > 0
  const isLoss = difference < 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-white">{question}</h2>
        {subtitle && <p className="text-white">{subtitle}</p>}
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Peso Atual (kg)
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={current}
                onChange={(e) => handleChange("current", e.target.value)}
                placeholder="70"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Peso Desejado (kg)
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={target}
                onChange={(e) => handleChange("target", e.target.value)}
                placeholder="65"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Prazo para Alcançar (meses)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              placeholder="3"
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ff0000] focus:outline-none"
            />
          </div>
        </div>

        {current && target && (
          <div className="bg-[#ff0000]/10 border border-[#ff0000]/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className={`w-6 h-6 ${isLoss ? "rotate-180" : ""} text-[#ff0000]`} />
              <div>
                <p className="text-white font-medium">
                  {isGain ? "Ganho" : "Perda"} de {Math.abs(difference).toFixed(1)} kg
                </p>
                {deadline && (
                  <p className="text-sm text-white">
                    Meta: {(Math.abs(difference) / parseFloat(deadline)).toFixed(2)} kg por mês
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MultipleChoiceQuestion({ 
  question, 
  subtitle, 
  options, 
  selectedValues, 
  onChange 
}: { 
  question: string
  subtitle?: string
  options: any[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}) {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-white">{question}</h2>
        {subtitle && <p className="text-white">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value)
          const Icon = option.icon
          
          return (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-[#ff0000] bg-[#ff0000]/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="flex items-start gap-3">
                {Icon && <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? "text-[#ff0000]" : "text-gray-400"}`} />}
                <div className="flex-1">
                  <div className="font-medium text-white">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-white mt-1">{option.description}</div>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-[#ff0000]" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SingleChoiceQuestion({ 
  question, 
  options, 
  selectedValue, 
  onChange 
}: { 
  question: string
  options: any[]
  selectedValue: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{question}</h2>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          const Icon = option.icon
          
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-[#ff0000] bg-[#ff0000]/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {Icon && <Icon className={`w-5 h-5 mt-1 ${isSelected ? "text-[#ff0000]" : "text-gray-400"}`} />}
                  <div className="flex-1">
                    <div className="font-medium text-lg text-white">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-white mt-1">{option.description}</div>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-[#ff0000] mt-1" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function QuizSummary({ answers, questions, onSave }: { answers: QuizAnswer[], questions: any[], onSave: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#ff0000] to-[#cc0000] rounded-2xl flex items-center justify-center">
            <Award className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white">Quiz Concluído! 🎉</h2>
          <p className="text-white max-w-2xl mx-auto">
            Perfeito! Agora vamos criar sua conta para salvar suas informações e gerar seu treino personalizado.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-4 text-white">Resumo das suas respostas:</h3>
          
          {answers.filter(a => a.question !== "welcome").map((answer, index) => {
            const question = questions.find(q => q.id === answer.question)
            if (!question) return null
            
            let displayAnswer = ""
            
            if (question.id === "personal-info" && typeof answer.answer === "object") {
              const personalData = answer.answer as any
              displayAnswer = `${personalData.age} anos, ${personalData.height} cm`
            } else if (question.id === "weight-goal" && typeof answer.answer === "object") {
              const weightData = answer.answer as any
              displayAnswer = `Atual: ${weightData.current}kg → Meta: ${weightData.target}kg (${weightData.deadline} meses)`
            } else if (Array.isArray(answer.answer)) {
              displayAnswer = answer.answer.map(a => {
                const opt = question.options?.find((o: any) => o.value === a)
                return opt?.label || a
              }).join(", ")
            } else {
              const opt = question.options?.find((o: any) => o.value === answer.answer)
              displayAnswer = opt?.label || String(answer.answer)
            }
            
            return (
              <div key={index} className="pb-4 border-b border-gray-700 last:border-0">
                <div className="text-sm text-white mb-1">{question.question}</div>
                <div className="text-white font-medium">{displayAnswer}</div>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-[#ff0000]/10 to-[#cc0000]/10 border border-[#ff0000]/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-[#ff0000] mt-1" />
            <div>
              <h4 className="font-bold text-lg mb-2 text-white">Próximo passo: Criar sua conta</h4>
              <p className="text-white">
                Crie sua conta para salvar suas respostas e ter acesso ao seu treino personalizado gerado por IA!
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={onSave}
          className="w-full py-4 bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#ff2222] hover:to-[#dd0000] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#ff0000]/20"
        >
          Continuar para Cadastro
        </button>
      </div>
    </div>
  )
}
