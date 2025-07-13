import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  StudyPlan, 
  Quiz, 
  Question, 
  Subtopic, 
  Resource, 
  ApiResponse,
  GeminiResponse 
} from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the generative model
const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// Generate study plan from topic
export const generateStudyPlan = async (
  topic: string, 
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  userId: string
): Promise<ApiResponse<StudyPlan>> => {
  try {
    const model = getModel();
    
    const prompt = `Create a comprehensive study plan for the topic: "${topic}"
    
    Difficulty level: ${difficulty}
    
    Please provide a structured response in the following JSON format:
    {
      "topic": "${topic}",
      "difficulty": "${difficulty}",
      "estimatedDuration": [total hours as number],
      "subtopics": [
        {
          "title": "Subtopic Title",
          "description": "Brief description of what this subtopic covers",
          "keyConcepts": ["concept1", "concept2", "concept3"],
          "suggestedTimeAllocation": [minutes as number],
          "resources": [
            {
              "title": "Resource Title",
              "type": "video|article|book|practice",
              "url": "optional URL if applicable",
              "description": "Brief description of the resource"
            }
          ]
        }
      ]
    }
    
    Make sure to:
    1. Break down the topic into 5-8 logical subtopics
    2. Provide practical key concepts for each subtopic
    3. Suggest realistic time allocations (total should match estimatedDuration)
    4. Include diverse resource types (videos, articles, books, practice exercises)
    5. Adjust complexity based on difficulty level
    6. Focus on practical, actionable learning objectives
    
    Respond only with valid JSON, no additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const studyPlanData = JSON.parse(text);
      
      // Validate and process the response
      const subtopics: Subtopic[] = studyPlanData.subtopics.map((subtopic: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: subtopic.title,
        description: subtopic.description,
        keyConcepts: subtopic.keyConcepts || [],
        suggestedTimeAllocation: subtopic.suggestedTimeAllocation || 30,
        resources: subtopic.resources.map((resource: any, resourceIndex: number) => ({
          id: `${Date.now()}-${index}-${resourceIndex}`,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          description: resource.description,
        })),
        completed: false,
      }));
      
      const studyPlan: StudyPlan = {
        id: Date.now().toString(),
        topic: studyPlanData.topic,
        subtopics,
        estimatedDuration: studyPlanData.estimatedDuration || 10,
        difficulty,
        createdAt: new Date(),
        userId,
        completed: false,
      };
      
      return { success: true, data: studyPlan };
    } catch (parseError) {
      console.error('Failed to parse study plan JSON:', parseError);
      return { success: false, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Generate study plan error:', error);
    return { success: false, error: 'Failed to generate study plan' };
  }
};

// Generate quiz from topic or notes
export const generateQuiz = async (
  topic: string, 
  userId: string,
  notes?: string, 
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  questionCount: number = 5
): Promise<ApiResponse<Quiz>> => {
  try {
    const model = getModel();
    
    const prompt = `Create a multiple-choice quiz for the topic: "${topic}"
    
    ${notes ? `Additional context/notes: ${notes}` : ''}
    
    Difficulty level: ${difficulty}
    Number of questions: ${questionCount}
    
    Please provide a structured response in the following JSON format:
    {
      "title": "Quiz Title",
      "topic": "${topic}",
      "questions": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": [index of correct option, 0-3],
          "explanation": "Explanation of why this is correct",
          "difficulty": "${difficulty}"
        }
      ]
    }
    
    Requirements:
    1. Create exactly ${questionCount} questions
    2. Each question should have 4 options (A, B, C, D)
    3. Only one correct answer per question
    4. Provide clear explanations for correct answers
    5. Questions should be relevant to the topic
    6. Adjust complexity based on difficulty level
    7. Make distractors plausible but clearly wrong
    8. Cover different aspects of the topic
    
    Respond only with valid JSON, no additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const quizData = JSON.parse(text);
      
      // Validate and process the response
      const questions: Question[] = quizData.questions.map((q: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer || 0,
        explanation: q.explanation || '',
        difficulty: q.difficulty || difficulty,
      }));
      
      const quiz: Quiz = {
        id: Date.now().toString(),
        title: quizData.title || `${topic} Quiz`,
        topic,
        questions,
        createdAt: new Date(),
        userId,
        completed: false,
        attempts: [],
      };
      
      return { success: true, data: quiz };
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      return { success: false, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Generate quiz error:', error);
    return { success: false, error: 'Failed to generate quiz' };
  }
};

// Explain a concept
export const explainConcept = async (
  concept: string, 
  context?: string,
  level: 'simple' | 'detailed' | 'advanced' = 'detailed'
): Promise<ApiResponse<string>> => {
  try {
    const model = getModel();
    
    const prompt = `Explain the concept: "${concept}"
    
    ${context ? `Context: ${context}` : ''}
    
    Explanation level: ${level}
    
    Please provide a clear, ${level} explanation that is:
    1. Easy to understand
    2. Accurate and factual
    3. Well-structured with key points
    4. Includes examples when helpful
    5. Appropriate for the requested level
    
    ${level === 'simple' ? 'Use simple language and avoid jargon.' : ''}
    ${level === 'advanced' ? 'Include technical details and advanced concepts.' : ''}
    
    Format your response in markdown for better readability.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return { success: true, data: text };
  } catch (error) {
    console.error('Explain concept error:', error);
    return { success: false, error: 'Failed to explain concept' };
  }
};

// Summarize notes or text
export const summarizeText = async (
  text: string, 
  summaryType: 'brief' | 'detailed' | 'bullet-points' = 'brief'
): Promise<ApiResponse<string>> => {
  try {
    const model = getModel();
    
    const prompt = `Summarize the following text in ${summaryType} format:
    
    ${text}
    
    Requirements:
    1. Capture all key points and main ideas
    2. Maintain accuracy and context
    3. Use ${summaryType} format
    4. Make it easy to understand and review
    
    ${summaryType === 'brief' ? 'Keep it concise, maximum 2-3 paragraphs.' : ''}
    ${summaryType === 'bullet-points' ? 'Use bullet points to organize key information.' : ''}
    ${summaryType === 'detailed' ? 'Provide comprehensive coverage of all important points.' : ''}
    
    Format your response in markdown for better readability.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return { success: true, data: responseText };
  } catch (error) {
    console.error('Summarize text error:', error);
    return { success: false, error: 'Failed to summarize text' };
  }
};

// Generate study tips
export const generateStudyTips = async (
  topic: string, 
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading',
  timeAvailable?: number // in minutes
): Promise<ApiResponse<string[]>> => {
  try {
    const model = getModel();
    
    const prompt = `Generate personalized study tips for: "${topic}"
    
    ${learningStyle ? `Learning style preference: ${learningStyle}` : ''}
    ${timeAvailable ? `Available study time: ${timeAvailable} minutes` : ''}
    
    Please provide 8-10 practical study tips in JSON array format:
    ["tip1", "tip2", "tip3", ...]
    
    Tips should be:
    1. Actionable and specific
    2. Tailored to the topic
    3. Appropriate for the learning style (if specified)
    4. Time-conscious (if time specified)
    5. Evidence-based study techniques
    6. Practical and implementable
    
    Focus on effective study strategies like active recall, spaced repetition, etc.
    
    Respond only with a JSON array, no additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const tips = JSON.parse(text);
      return { success: true, data: tips };
    } catch (parseError) {
      console.error('Failed to parse study tips JSON:', parseError);
      return { success: false, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Generate study tips error:', error);
    return { success: false, error: 'Failed to generate study tips' };
  }
};

// Generate flashcards
export const generateFlashcards = async (
  topic: string, 
  notes?: string, 
  cardCount: number = 10
): Promise<ApiResponse<{ front: string; back: string }[]>> => {
  try {
    const model = getModel();
    
    const prompt = `Create flashcards for the topic: "${topic}"
    
    ${notes ? `Additional context/notes: ${notes}` : ''}
    
    Number of cards: ${cardCount}
    
    Please provide flashcards in the following JSON format:
    [
      {
        "front": "Question or term",
        "back": "Answer or definition"
      }
    ]
    
    Requirements:
    1. Create exactly ${cardCount} flashcards
    2. Cover key concepts and important details
    3. Front should be clear questions or terms
    4. Back should provide complete, accurate answers
    5. Include a mix of definitions, explanations, and examples
    6. Make cards suitable for spaced repetition
    
    Respond only with valid JSON array, no additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const flashcards = JSON.parse(text);
      return { success: true, data: flashcards };
    } catch (parseError) {
      console.error('Failed to parse flashcards JSON:', parseError);
      return { success: false, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Generate flashcards error:', error);
    return { success: false, error: 'Failed to generate flashcards' };
  }
};

// Evaluate quiz answers and provide feedback
export const evaluateQuizAnswers = async (
  quiz: Quiz, 
  userAnswers: number[]
): Promise<ApiResponse<{ score: number; feedback: string; detailedFeedback: string[] }>> => {
  try {
    const model = getModel();
    
    const questionsWithAnswers = quiz.questions.map((question, index) => ({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswers[index],
      isCorrect: userAnswers[index] === question.correctAnswer,
    }));
    
    const score = questionsWithAnswers.filter(q => q.isCorrect).length;
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    const prompt = `Evaluate this quiz performance and provide feedback:
    
    Quiz Topic: ${quiz.topic}
    Score: ${score}/${quiz.questions.length} (${percentage}%)
    
    Questions and answers:
    ${questionsWithAnswers.map((q, index) => `
    Question ${index + 1}: ${q.question}
    Options: ${q.options.join(', ')}
    Correct Answer: ${q.options[q.correctAnswer]}
    User Answer: ${q.options[q.userAnswer]}
    Result: ${q.isCorrect ? 'Correct' : 'Incorrect'}
    `).join('\n')}
    
    Please provide:
    1. Overall feedback on performance
    2. Specific feedback for each question (especially incorrect ones)
    3. Suggestions for improvement
    4. Areas to focus on for future study
    
    Format as JSON:
    {
      "overallFeedback": "General feedback on performance",
      "detailedFeedback": [
        "Feedback for question 1",
        "Feedback for question 2",
        ...
      ],
      "improvementSuggestions": "Suggestions for improvement"
    }
    
    Respond only with valid JSON, no additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const feedbackData = JSON.parse(text);
      return { 
        success: true, 
        data: {
          score: percentage,
          feedback: feedbackData.overallFeedback + '\n\n' + feedbackData.improvementSuggestions,
          detailedFeedback: feedbackData.detailedFeedback,
        }
      };
    } catch (parseError) {
      console.error('Failed to parse feedback JSON:', parseError);
      return { 
        success: true, 
        data: {
          score: percentage,
          feedback: `You scored ${score}/${quiz.questions.length} (${percentage}%). Keep practicing to improve!`,
          detailedFeedback: questionsWithAnswers.map(q => 
            q.isCorrect ? 'Correct!' : `Incorrect. The correct answer was: ${q.options[q.correctAnswer]}`
          ),
        }
      };
    }
  } catch (error) {
    console.error('Evaluate quiz answers error:', error);
    return { success: false, error: 'Failed to evaluate quiz answers' };
  }
};

// Check if Gemini API is configured
export const isGeminiApiConfigured = (): boolean => {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== '');
};

// Generate learning path recommendations
export const generateLearningPath = async (
  currentTopic: string, 
  goals: string[], 
  timeframe: string // e.g., "2 weeks", "1 month"
): Promise<ApiResponse<string[]>> => {
  try {
    const model = getModel();
    
    const prompt = `Create a learning path for someone studying: "${currentTopic}"
    
    Learning goals: ${goals.join(', ')}
    Timeframe: ${timeframe}
    
    Please provide a step-by-step learning path in JSON array format:
    ["step1", "step2", "step3", ...]
    
    Each step should be:
    1. Specific and actionable
    2. Build upon previous steps
    3. Be achievable within the timeframe
    4. Include recommended resources or activities
    5. Progressive in difficulty
    
    Respond only with a JSON array, no additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const path = JSON.parse(text);
      return { success: true, data: path };
    } catch (parseError) {
      console.error('Failed to parse learning path JSON:', parseError);
      return { success: false, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Generate learning path error:', error);
    return { success: false, error: 'Failed to generate learning path' };
  }
};

// Generate study schedule
export const generateStudySchedule = async (
  topics: string[], 
  availableHours: number, 
  preferences: { 
    sessionLength: number; // in minutes
    breakLength: number; // in minutes
    preferredTimes: string[]; // e.g., ["morning", "afternoon"]
  }
): Promise<ApiResponse<{ schedule: any[]; tips: string[] }>> => {
  try {
    const model = getModel();
    
    const prompt = `Create a study schedule for the following topics: ${topics.join(', ')}
    
    Available hours per day: ${availableHours}
    Preferred session length: ${preferences.sessionLength} minutes
    Break length: ${preferences.breakLength} minutes
    Preferred times: ${preferences.preferredTimes.join(', ')}
    
    Please provide a structured schedule in JSON format:
    {
      "schedule": [
        {
          "day": "Monday",
          "sessions": [
            {
              "time": "9:00 AM - 10:30 AM",
              "topic": "Topic name",
              "activity": "Specific activity",
              "duration": 90
            }
          ]
        }
      ],
      "tips": ["tip1", "tip2", "tip3"]
    }
    
    Requirements:
    1. Create a weekly schedule
    2. Respect session and break lengths
    3. Distribute topics evenly
    4. Include variety in activities
    5. Consider spaced repetition
    6. Include review sessions
    
    Respond only with valid JSON, no additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const scheduleData = JSON.parse(text);
      return { success: true, data: scheduleData };
    } catch (parseError) {
      console.error('Failed to parse schedule JSON:', parseError);
      return { success: false, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Generate study schedule error:', error);
    return { success: false, error: 'Failed to generate study schedule' };
  }
};

// Test AI connection
export const testGeminiConnection = async (): Promise<ApiResponse<string>> => {
  try {
    const model = getModel();
    const result = await model.generateContent('Say "Hello, I am working correctly!" if you can receive this message.');
    const response = await result.response;
    const text = response.text();
    
    return { success: true, data: text };
  } catch (error) {
    console.error('Test Gemini connection error:', error);
    return { success: false, error: 'Failed to connect to Gemini API' };
  }
};