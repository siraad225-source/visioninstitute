
import { GoogleGenAI } from "@google/genai";
import { StudentResult, StudentProfile } from "../types";

export const getAcademicAdvice = async (student: StudentProfile, results: StudentResult[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const resultsString = results.map(r => `${r.subject}: ${r.score}% (${r.grade})`).join(", ");
  
  const prompt = `
    Student: ${student.fullName}
    Course: ${student.course}
    Results: ${resultsString}
    
    As an expert academic advisor, provide a professional, encouraging summary of the student's performance in 3 short paragraphs. 
    1. Highlight their strengths based on the highest scores.
    2. Identify areas for improvement based on the lowest scores.
    3. Suggest future career paths matching these skills (especially Microsoft Office and Web skills).
    Keep it formal and high-end.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Your results are impressive! Keep focusing on your core strengths while polishing your technical skills in areas with room for growth.";
  }
};
