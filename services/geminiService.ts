
import { GoogleGenAI, Type } from "@google/genai";
import { Villager } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getVillagerDialogue(villager: Villager, playerMessage: string = "Hello!") {
  const prompt = `
    You are ${villager.name}, a ${villager.species} villager in a cozy game like Animal Crossing.
    Your personality is ${villager.personality}.
    
    The player says: "${playerMessage}"
    
    Respond as this character. Keep it short (max 2 sentences), cute, and stay in character.
    If personality is 'lazy', talk about snacks or naps.
    If personality is 'cranky', be a bit grumpy but kind-hearted.
    If personality is 'peppy', use lots of exclamation marks and talk about being a pop star.
    
    Provide your response as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            emotion: { type: Type.STRING, description: "One word emotion: happy, surprised, neutral, sleepy, grumpy" }
          },
          required: ["text", "emotion"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Oh, hello there! Nice weather today.", emotion: "happy" };
  }
}

export async function getIslandGreeting(dayTime: string) {
  const prompt = `Write a short, cozy greeting for an Animal Crossing style game. Current time: ${dayTime}. Max 15 words.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch {
    return "Welcome back to your island paradise!";
  }
}
