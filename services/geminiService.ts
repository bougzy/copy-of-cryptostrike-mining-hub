
import { GoogleGenAI, Type } from "@google/genai";
import { MiningInsight, Task } from "../types";

const apiKey = process.env.API_KEY || '';

export const fetchMiningInsights = async (): Promise<MiningInsight[]> => {
  if (!apiKey) {
    console.debug("Gemini API Key missing. Returning static insights.");
    return [
      { topic: "Market Volatility", content: "High volatility detected in BTC/ETH pairs. Consider adjusting your hash distribution.", relevance: 'HIGH' },
      { topic: "Energy Efficiency", content: "Switching to low-power mode during peak hours can increase net profits by 12%.", relevance: 'MEDIUM' },
      { topic: "Cold Storage Strategy", content: "AI suggests transferring accumulated rewards to air-gapped vaults every 0.1 BTC.", relevance: 'LOW' }
    ];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 3 high-quality crypto mining insights or tips for a dashboard. Include a topic, detailed content, and relevance level (HIGH, MEDIUM, LOW).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              content: { type: Type.STRING },
              relevance: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] }
            },
            required: ['topic', 'content', 'relevance']
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching insights:", error);
    return [
      { topic: "Market Volatility", content: "High volatility detected in BTC/ETH pairs. Consider adjusting your hash distribution.", relevance: 'HIGH' },
      { topic: "Energy Efficiency", content: "Switching to low-power mode during peak hours can increase net profits by 12%.", relevance: 'MEDIUM' }
    ];
  }
};

export const generateDailyTasks = async (): Promise<Task[]> => {
  if (!apiKey) {
    console.debug("Gemini API Key missing. Returning static tasks.");
    return [
      { id: '1', title: 'System Check', description: 'Run a full diagnostic on all mining rigs.', reward: 0.005, completed: false, type: 'SYSTEM' },
      { id: '2', title: 'Community Vote', description: 'Vote on the next supported coin protocol.', reward: 0.01, completed: false, type: 'SOCIAL' },
      { id: '3', title: 'Hash Calibration', description: 'Optimize power draw vs hash output on primary rig.', reward: 0.012, completed: false, type: 'AI' },
      { id: '4', title: 'Network Pulse', description: 'Verify connectivity with decentralized pool nodes.', reward: 0.003, completed: false, type: 'SYSTEM' }
    ];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 4 creative 'daily mining tasks' for a crypto app. Tasks should be engaging (e.g., 'Analyze market sentiment', 'Optimize cooling system'). Include a reward amount between 0.001 and 0.05 BTC.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              reward: { type: Type.NUMBER },
              type: { type: Type.STRING, enum: ['AI', 'SYSTEM', 'SOCIAL'] }
            },
            required: ['id', 'title', 'description', 'reward', 'type']
          }
        }
      }
    });

    const tasks = JSON.parse(response.text.trim());
    return tasks.map((t: any) => ({ ...t, completed: false }));
  } catch (error) {
    console.error("Error generating tasks:", error);
    return [
      { id: '1', title: 'System Check', description: 'Run a full diagnostic on all mining rigs.', reward: 0.005, completed: false, type: 'SYSTEM' },
      { id: '2', title: 'Community Vote', description: 'Vote on the next supported coin protocol.', reward: 0.01, completed: false, type: 'SOCIAL' }
    ];
  }
};
