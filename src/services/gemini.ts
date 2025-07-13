import axios from 'axios';
import type { StudyPlan, Quiz, Question } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private static async generateContent(prompt: string): Promise<string> {
    try {
      const response = await axios.post<GeminiResponse>(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }
      );

      return response.data.candidates[0]?.content.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content');
    }
  }

  static async generateStudyPlan(topic: string): Promise<StudyPlan> {
    const prompt = `Create a detailed study plan for the topic: "${topic}". 
    Return a JSON object with the following structure:
    {
      "topic": "string",
      "subtopics": [
        {
          "title": "string",
          "keyPoints": ["string"],
          "timeAllocation": number (in minutes),
          "resources": [
            {
              "type": "video" | "book" | "article",
              "title": "string",
              "url": "string (optional)"
            }
          ]
        }
      ],
      "totalTime": number (total minutes)
    }
    
    Make the study plan comprehensive but realistic. Include 3-5 subtopics with clear key points and time allocations.`;

    try {
      const response = await this.generateContent(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const planData = JSON.parse(jsonMatch[0]);
        return {
          id: crypto.randomUUID(),
          topic: planData.topic,
          subtopics: planData.subtopics,
          totalTime: planData.totalTime,
          createdAt: new Date()
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw error;
    }
  }

  static async generateQuiz(topic: string, notes?: string): Promise<Quiz> {
    const prompt = `Create a quiz for the topic: "${topic}". 
    ${notes ? `Use these notes as reference: ${notes}` : ''}
    
    Generate 10 multiple choice questions. Return a JSON object with this structure:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": number (0-3, index of correct option),
          "explanation": "string"
        }
      ]
    }
    
    Make questions challenging but fair. Each question should have 4 options with only one correct answer.`;

    try {
      const response = await this.generateContent(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);
        const questions: Question[] = quizData.questions.map((q: any) => ({
          id: crypto.randomUUID(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));
        
        return {
          id: crypto.randomUUID(),
          topic,
          questions,
          createdAt: new Date()
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }
}