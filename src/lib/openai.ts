"use client"

import OpenAI from "openai"

// Configuração do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Necessário para uso no cliente
})

// Interface para dados do usuário
interface UserProfile {
  age?: number
  weight?: number
  height?: number
  goal?: string
  focusedMuscles?: string[]
  weeklyFrequency?: number
  availableTime?: string
}

// Interface para treino gerado
interface GeneratedWorkout {
  exercises: Array<{
    name: string
    sets: number
    reps: string
    muscleGroup: string
    caloriesBurn: number
  }>
  totalDuration: number
  totalCalories: number
}

// Interface para análise nutricional
interface NutritionalAnalysis {
  calories: number
  protein: number
  carbs: number
  fats: number
  portion: string
  suggestions?: string[]
}

/**
 * Gera treino personalizado usando OpenAI
 */
export async function generatePersonalizedWorkout(
  userProfile: UserProfile
): Promise<GeneratedWorkout> {
  try {
    const prompt = `
Você é um personal trainer expert. Crie um treino personalizado baseado nos seguintes dados:

- Idade: ${userProfile.age || "não informada"}
- Peso: ${userProfile.weight || "não informado"}kg
- Altura: ${userProfile.height || "não informada"}cm
- Objetivo: ${userProfile.goal || "ganho de massa"}
- Músculos focados: ${userProfile.focusedMuscles?.join(", ") || "todos"}
- Frequência semanal: ${userProfile.weeklyFrequency || 3}x por semana
- Tempo disponível: ${userProfile.availableTime || "45-60"} minutos

IMPORTANTE:
- Foque PRINCIPALMENTE nos músculos: ${userProfile.focusedMuscles?.join(", ")}
- Se o treino é de "ombro e quadríceps", inclua APENAS exercícios desses grupos
- Quantidade de exercícios proporcional ao tempo disponível
- Cada exercício deve ter: nome, séries (3-4), repetições (8-15), grupo muscular, calorias queimadas (estimativa)

Retorne APENAS um JSON válido no formato:
{
  "exercises": [
    {
      "name": "Nome do exercício",
      "sets": 4,
      "reps": "8-12",
      "muscleGroup": "chest|shoulder|back|biceps|triceps|quadriceps|hamstring|glutes|abs|calf",
      "caloriesBurn": 45
    }
  ],
  "totalDuration": 45,
  "totalCalories": 350
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um personal trainer expert que cria treinos personalizados. Sempre retorne JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("Resposta vazia da OpenAI")
    }

    const workout = JSON.parse(content)
    return workout
  } catch (error) {
    console.error("Erro ao gerar treino com OpenAI:", error)
    throw error
  }
}

/**
 * Analisa informações nutricionais de um alimento usando OpenAI
 */
export async function analyzeFood(
  foodName: string,
  portion?: string
): Promise<NutritionalAnalysis> {
  try {
    console.log("🔍 Iniciando análise do alimento:", foodName)
    
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error("Chave da API OpenAI não configurada")
    }

    const prompt = `Analise as informações nutricionais do seguinte alimento:

Alimento: ${foodName}
Porção: ${portion || "porção padrão (100g ou 1 unidade)"}

Retorne APENAS um JSON válido com as informações nutricionais PRECISAS baseadas em dados reais:
{
  "calories": número de calorias (número inteiro),
  "protein": gramas de proteína (número com 1 casa decimal),
  "carbs": gramas de carboidratos (número com 1 casa decimal),
  "fats": gramas de gordura (número com 1 casa decimal),
  "portion": "porção analisada (ex: 100g, 1 unidade, 1 xícara)",
  "suggestions": ["dica nutricional 1", "dica nutricional 2"]
}

IMPORTANTE: Seja preciso e baseie-se em dados nutricionais reais e confiáveis.`

    console.log("📤 Enviando requisição para OpenAI...")

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um nutricionista expert que analisa alimentos com precisão. Sempre retorne JSON válido com dados nutricionais precisos baseados em fontes confiáveis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    console.log("📥 Resposta recebida da OpenAI")

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("Resposta vazia da OpenAI")
    }

    console.log("📄 Conteúdo da resposta:", content)

    const analysis = JSON.parse(content)
    
    // Validação dos dados
    if (typeof analysis.calories !== 'number' || 
        typeof analysis.protein !== 'number' || 
        typeof analysis.carbs !== 'number' || 
        typeof analysis.fats !== 'number') {
      throw new Error("Dados nutricionais inválidos recebidos da API")
    }

    console.log("✅ Análise concluída com sucesso:", analysis)
    
    return analysis
  } catch (error: any) {
    console.error("❌ Erro detalhado ao analisar alimento:", error)
    
    // Mensagens de erro mais específicas
    if (error.message?.includes("API key")) {
      throw new Error("Chave da API OpenAI inválida ou não configurada")
    } else if (error.message?.includes("quota")) {
      throw new Error("Limite de uso da API OpenAI excedido")
    } else if (error.message?.includes("network")) {
      throw new Error("Erro de conexão com a API OpenAI")
    }
    
    throw error
  }
}

/**
 * Calcula meta de calorias personalizada usando OpenAI
 */
export async function calculateCalorieGoal(
  userProfile: UserProfile
): Promise<number> {
  try {
    const prompt = `
Calcule a meta de calorias diárias para:

- Idade: ${userProfile.age}
- Peso: ${userProfile.weight}kg
- Altura: ${userProfile.height}cm
- Objetivo: ${userProfile.goal}
- Frequência de treino: ${userProfile.weeklyFrequency}x por semana

Objetivos:
- "weight-loss": déficit calórico para perda de peso
- "muscle-gain": superávit calórico para ganho de massa
- "maintenance": manutenção do peso atual

Use a fórmula de Harris-Benedict e ajuste baseado no objetivo e nível de atividade.

Retorne APENAS um JSON válido:
{
  "dailyCalories": número inteiro de calorias,
  "explanation": "breve explicação do cálculo"
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um nutricionista expert em cálculo de necessidades calóricas. Sempre retorne JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("Resposta vazia da OpenAI")
    }

    const result = JSON.parse(content)
    return result.dailyCalories
  } catch (error) {
    console.error("Erro ao calcular meta de calorias com OpenAI:", error)
    throw error
  }
}

/**
 * Gera plano semanal de treinos usando OpenAI
 */
export async function generateWeeklyPlan(
  userProfile: UserProfile
): Promise<any[]> {
  try {
    const prompt = `
Crie um plano semanal de treinos para:

- Objetivo: ${userProfile.goal}
- Músculos focados: ${userProfile.focusedMuscles?.join(", ")}
- Frequência: ${userProfile.weeklyFrequency}x por semana
- Tempo por treino: ${userProfile.availableTime} minutos

REGRAS IMPORTANTES:
1. Distribua os treinos nos dias corretos (Segunda a Sábado)
2. FOQUE nos músculos preferidos: ${userProfile.focusedMuscles?.join(", ")}
3. Se o treino é "Ombro e Quadríceps", inclua APENAS exercícios desses grupos
4. Não esqueça nenhum grupo muscular importante
5. Respeite o tempo disponível

Retorne APENAS um JSON válido:
{
  "weeklyPlan": [
    {
      "day": "Segunda",
      "dayNumber": 1,
      "focus": "Peito e Tríceps",
      "exercises": [...] (mesmo formato do treino individual)
    }
  ]
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um personal trainer expert que cria planos semanais. Sempre retorne JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("Resposta vazia da OpenAI")
    }

    const result = JSON.parse(content)
    return result.weeklyPlan
  } catch (error) {
    console.error("Erro ao gerar plano semanal com OpenAI:", error)
    throw error
  }
}

export default openai
