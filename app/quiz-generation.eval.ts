import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { evalite } from "evalite";
import { traceAISDKModel } from "evalite/ai-sdk";

const model = anthropic('claude-3-5-haiku-latest');

evalite("Quiz Generation Quality", {
  data: async () => [
    {
      input: `Machine learning is a subset of artificial intelligence that focuses on developing algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience, without being explicitly programmed for every scenario. The field has grown tremendously over the past decade, with applications ranging from image recognition and natural language processing to recommendation systems and autonomous vehicles. Deep learning, a subset of machine learning, has been particularly successful in achieving breakthrough results in various domains.`,
      expected: {
        expectedQuestions: 3,
        mustContainTopics: ["machine learning", "artificial intelligence", "deep learning", "algorithms", "applications"]
      },
    },
    {
      input: `Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, scientific evidence shows that human activities, particularly the emission of greenhouse gases from burning fossil fuels, have been the dominant driver of climate change since the mid-20th century. The effects include rising sea levels, more frequent extreme weather events, and disruptions to ecosystems worldwide.`,
      expected: {
        expectedQuestions: 3,
        mustContainTopics: ["climate change", "greenhouse gases", "fossil fuels", "temperature", "weather"]
      },
    },
    {
      input: `The Renaissance was a period of European cultural, artistic, political and economic rebirth following the Middle Ages. Generally described as taking place from the 14th century to the 17th century, it promoted the rediscovery of classical philosophy, literature and art. Some of the greatest thinkers, authors, statesmen, scientists and artists in human history thrived during this era, while global exploration opened up new lands and cultures to European commerce.`,
      expected: {
        expectedQuestions: 3,
        mustContainTopics: ["Renaissance", "Middle Ages", "14th century", "17th century", "philosophy", "exploration"]
      },
    },
  ],
  task: async (input) => {
    const result = await generateText({
      model: traceAISDKModel(model),
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
      prompt: `Create a multiple choice quiz based on this text:\n\n${input}`,
    });

    try {
      return JSON.parse(result.text);
    } catch (error) {
      return { error: "Failed to parse JSON", raw: result.text };
    }
  },
  scorers: [
    // Check if valid JSON structure is returned
    {
      name: "JSONStructure",
      score: async (output) => {
        if (output.error) return 0;
        if (!output.questions || !Array.isArray(output.questions)) return 0;
        
        const hasValidStructure = output.questions.every((q: any) => 
          q.question && 
          Array.isArray(q.options) && 
          q.options.length === 4 &&
          typeof q.correctAnswer === 'number' &&
          q.correctAnswer >= 0 &&
          q.correctAnswer < 4 &&
          q.explanation
        );
        
        return hasValidStructure ? 1.0 : 0.0;
      },
    },
    // Check if appropriate number of questions generated
    {
      name: "QuestionCount",
      score: async (output, expected) => {
        if (output.error) return 0;
        if (!output.questions) return 0;
        
        const questionCount = output.questions.length;
        // Score based on getting 6-8 questions (as specified in prompt)
        if (questionCount >= 6 && questionCount <= 8) {
          return 1.0;
        } else if (questionCount >= 4 && questionCount <= 10) {
          return 0.7;
        } else {
          return 0.3;
        }
      },
    },
    // Check if questions cover key topics from the text
    {
      name: "TopicCoverage",
      score: async (output, expected) => {
        if (output.error) return 0;
        if (!output.questions) return 0;
        
        const allQuizText = output.questions
          .map((q: any) => `${q.question} ${q.options.join(' ')} ${q.explanation}`)
          .join(' ')
          .toLowerCase();
        
        const expectedTopics = expected.mustContainTopics;
        const coveredTopics = expectedTopics.filter(topic => 
          allQuizText.includes(topic.toLowerCase())
        );
        
        return coveredTopics.length / expectedTopics.length;
      },
    },
    // Check if questions are substantive (not too short)
    {
      name: "QuestionQuality",
      score: async (output) => {
        if (output.error) return 0;
        if (!output.questions) return 0;
        
        const avgQuestionLength = output.questions.reduce((sum: number, q: any) => 
          sum + q.question.split(' ').length, 0) / output.questions.length;
        
        // Good questions should be at least 8-12 words on average
        if (avgQuestionLength >= 8 && avgQuestionLength <= 20) {
          return 1.0;
        } else if (avgQuestionLength >= 5 && avgQuestionLength <= 25) {
          return 0.7;
        } else {
          return 0.3;
        }
      },
    },
  ],
});