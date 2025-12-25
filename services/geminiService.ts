
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan } from "../types.ts";

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
        systemInstruction: "你是一位資深的學習教練。回覆應保持專業且親切。請使用繁體中文回覆。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            suggestedPace: { type: Type.STRING }
          },
          required: ["advice", "difficulty", "suggestedPace"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    return {
      advice: "每天持續學習是成功的關鍵！",
      difficulty: "Moderate",
      suggestedPace: "每日穩定進度"
    };
  }
};
