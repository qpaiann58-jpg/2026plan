
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyAdvice = async (plan: Omit<StudyPlan, 'id' | 'tasks'>) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `分析以下讀書計劃並給予專業建議：
      科目：${plan.subject}
      類別：${plan.category}
      總頁數：${plan.totalPages}
      開始日期：${plan.startDate}
      結束日期：${plan.endDate}
      `,
      config: {
        systemInstruction: "你是一位資深的學習教練。請根據學生的讀書計畫，分析其難易度，並給出具體的執行策略與鼓勵。回覆應保持專業且親切。請使用繁體中文回覆。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING, description: "具體的讀書策略與建議" },
            difficulty: { type: Type.STRING, description: "難易度評估 (Easy, Moderate, Challenging, Intense)" },
            suggestedPace: { type: Type.STRING, description: "建議的每日讀書節奏描述" }
          },
          required: ["advice", "difficulty", "suggestedPace"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      advice: "保持穩定的節奏，每天持續學習是成功的關鍵！",
      difficulty: "Moderate",
      suggestedPace: "每日穩定進度"
    };
  }
};
