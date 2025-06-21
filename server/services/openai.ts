import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  lesson?: {
    character?: string;
    romanji?: string;
    meaning?: string;
    example?: string;
  };
}

export async function generateChatResponse(userMessage: string, userId: number): Promise<ChatResponse> {
  try {
    const prompt = `You are Nihongo Sensei, a friendly and encouraging Japanese language teacher chatbot. 
    
    The user said: "${userMessage}"
    
    Respond as a helpful Japanese language teacher. If the user asks about Japanese, provide educational content.
    If they want to practice, give them exercises. If they need encouragement, be supportive.
    
    Include Japanese characters when relevant, always with romanji and English translations.
    
    Respond with JSON in this format:
    {
      "message": "Your response message",
      "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
      "lesson": {
        "character": "Japanese character if teaching one",
        "romanji": "romanji pronunciation",
        "meaning": "English meaning",
        "example": "example usage"
      }
    }
    
    Keep responses encouraging, educational, and culturally appropriate.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      message: result.message || "こんにちは！How can I help you learn Japanese today?",
      suggestions: result.suggestions || ["Learn Hiragana", "Practice Vocabulary", "Cultural Facts"],
      lesson: result.lesson || undefined
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "Sorry, I'm having trouble right now. Let's practice some basic Japanese! こんにちは (konnichiwa) means hello!",
      suggestions: ["Learn Hiragana", "Practice Vocabulary", "Cultural Facts"]
    };
  }
}

export async function generateQuizQuestions(type: string, difficulty: number, count: number = 5): Promise<any[]> {
  try {
    const prompt = `Generate ${count} Japanese language quiz questions for ${type} at difficulty level ${difficulty} (1-5).
    
    Return JSON array with this format:
    [
      {
        "question": "What does あ mean?",
        "options": ["a", "i", "u", "e"],
        "correct": 0,
        "explanation": "あ is the first hiragana character, pronounced 'a'"
      }
    ]
    
    Make questions educational and progressively challenging.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
    return result.questions || [];
  } catch (error) {
    console.error("Quiz generation error:", error);
    return [];
  }
}

export async function analyzeLearningProgress(userStats: any): Promise<string> {
  try {
    const prompt = `Analyze this Japanese learner's progress and provide encouraging feedback with specific recommendations:
    
    Stats: ${JSON.stringify(userStats)}
    
    Provide personalized advice in a supportive tone, mentioning specific areas to focus on.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "Keep up the great work learning Japanese!";
  } catch (error) {
    console.error("Progress analysis error:", error);
    return "You're making great progress! Keep practicing regularly to improve your Japanese skills.";
  }
}
