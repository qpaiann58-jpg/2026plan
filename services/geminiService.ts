
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan, FixedEvent } from "../types.ts";

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
        temperature: 0.2,
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

export const parseSchedule = async (input: string, existingEvents: FixedEvent[]): Promise<FixedEvent[]> => {
  try {
    const existingStr = existingEvents.map(e => `${e.title}: 週${e.dayOfWeek} ${e.startTime}-${e.endTime}`).join(", ");
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      使用者指令："${input}"
      目前已有行程：${existingStr || "無"}
      
      任務：
      1. 如果使用者是說「某個固定時間要做某事」，請直接轉換。
      2. 如果使用者是說「一週幾次、每次幾小時」，請根據目前已有行程的「空檔」，在 07:00 到 24:00 之間自動安排合適的讀書時間。
      3. 盡量避開半夜與深夜。優先選擇早晨 09:00-11:00 或下午 14:00-17:00 的黃金時段。
      
      規則：
      - dayOfWeek: 0(日), 1-6(一至六)。
      - startTime/endTime 格式: HH:mm。
      `,
      config: {
        temperature: 0, // 設定為 0 提升結構化數據生成速度與準確度
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              dayOfWeek: { type: Type.INTEGER },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              isAI: { type: Type.BOOLEAN }
            },
            required: ["title", "dayOfWeek", "startTime", "endTime"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return results.map((r: any) => ({ ...r, id: crypto.randomUUID(), isAI: r.isAI ?? true }));
  } catch (error) {
    console.error("AI Schedule Parsing Error:", error);
    return [];
  }
};
