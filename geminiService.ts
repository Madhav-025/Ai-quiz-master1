
import { GoogleGenAI, Type } from "@google/genai";
import { QuizData, MediaFile } from "./types";

const API_KEY = process.env.API_KEY;



export const generateQuiz = async (text: string, questionCount: number, media?: MediaFile): Promise<QuizData> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Act as an expert educator. Based on the provided content (text notes, textbook image, or PDF document), 
    generate a high-quality multiple-choice quiz. 
    Focus on key concepts, facts, and understanding.
    Generate exactly ${questionCount} questions.
    Each question must have exactly 4 options.
    Provide a clear explanation for the correct answer.
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (text.trim()) {
    parts.push({ text: `Source material (Text): ${text}` });
  }

  if (media) {
    parts.push({
      inlineData: {
        mimeType: media.mimeType,
        data: media.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy title for the quiz" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Exactly 4 options"
                  },
                  correctAnswer: { 
                    type: Type.INTEGER, 
                    description: "Zero-based index of the correct option (0-3)" 
                  },
                  explanation: { type: Type.STRING, description: "Brief explanation of why this answer is correct" }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as QuizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. Please check your content and try again.");
  }
};
