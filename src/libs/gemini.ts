// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import processEnv from "../../env";

const genAI = new GoogleGenerativeAI(processEnv.GEMINI_API_KEY);

export const parserModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    }
});