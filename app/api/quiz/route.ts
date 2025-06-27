import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const model = anthropic('claude-3-5-haiku-latest');

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Define allowed MIME types and file size limit
    const allowedMimeTypes = [
      'text/plain',
      'text/csv',
      'text/markdown',
      'text/x-markdown',
      'application/json',
      'application/xml',
      'text/xml'
    ];
    
    const maxFileSize = 5 * 1024 * 1024; // 5MB limit

    // Validate file type
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed types: ${allowedMimeTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const text = await file.text();
    
    if (!text.trim()) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      );
    }

    const result = await generateText({
      model,
      system: `You are a helpful assistant that creates educational multiple-choice quizzes.
        
        Create 6-8 multiple choice questions based on the provided text. Each question should:
        - Test important concepts, facts, or ideas from the text
        - Have exactly 4 answer options (A, B, C, D)
        - Have only one clearly correct answer
        - Include a brief explanation of why the correct answer is right
        
        Return your response as valid JSON in this format:
        {
          "questions": [
            {
              "question": "What is...",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": 1,
              "explanation": "The correct answer is B because..."
            }
          ]
        }
        
        Make sure the JSON is properly formatted and parseable.`,
      prompt: `Create a multiple choice quiz based on this text:\n\n${text}`,
    });

    let quizData;
    try {
      quizData = JSON.parse(result.text);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        { error: 'Failed to generate valid quiz format' },
        { status: 500 }
      );
    }

    // Validate quiz structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return NextResponse.json(
        { error: 'Invalid quiz structure' },
        { status: 500 }
      );
    }

    // Validate each question's correctAnswer is within valid range
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      if (typeof question.correctAnswer !== 'number' || 
          question.correctAnswer < 0 || 
          question.correctAnswer > 3) {
        return NextResponse.json(
          { error: `Question ${i + 1} has invalid correctAnswer: must be a number between 0 and 3` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      filename: file.name,
      wordCount: text.split(/\s+/).length,
      questions: quizData.questions,
      totalQuestions: quizData.questions.length
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}