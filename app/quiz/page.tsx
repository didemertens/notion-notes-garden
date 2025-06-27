'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, Plus } from 'lucide-react';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type QuizResult = {
  filename: string;
  wordCount: number;
  questions: QuizQuestion[];
  totalQuestions: number;
};

type UserAnswer = {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
};

export default function QuizPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setQuiz(null);
      setError(null);
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/quiz', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      setQuiz(data);
      resetQuiz();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null || !quiz) return;

    const isCorrect = selectedAnswer === quiz.questions[currentQuestion].correctAnswer;
    const newAnswer: UserAnswer = {
      questionIndex: currentQuestion,
      selectedAnswer,
      isCorrect,
    };

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = newAnswer;
    setUserAnswers(updatedAnswers);

    setShowResult(true);
  };

  const handleContinue = () => {
    if (!quiz) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]?.selectedAnswer ?? null);
      setShowResult(false);
    }
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
  };

  const handleNewQuiz = () => {
    setFile(null);
    setQuiz(null);
    setError(null);
    resetQuiz();
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    return Math.round((correctAnswers / userAnswers.length) * 100);
  };

  if (quizCompleted && quiz) {
    const score = calculateScore();
    return (
      <div className="min-h-screen" style={{background: "var(--background)"}}>
        <nav className="nav">
          <div className="nav-content">
            <ul className="nav-links" role="list">
              <li><a href="/">HOME</a></li>
            </ul>
            <div className="handwritten text-lg">
              <a href="/" aria-label="Notes Garden - Go to homepage">Notes Garden</a>
            </div>
            <ul className="nav-links" role="list">
              <li><a href="/quiz">QUIZ MAKER</a></li>
            </ul>
          </div>
        </nav>

        <main style={{padding: "var(--space-m)"} as React.CSSProperties}>
          <div className="wrapper" style={{paddingTop: "var(--space-xl)"} as React.CSSProperties}>
            <div className="stack text-center" style={{"--space": "var(--space-l)", maxWidth: "700px", margin: "0 auto"} as React.CSSProperties}>
              <h1 className="display-serif text-4xl" style={{marginBottom: "var(--space-m)"} as React.CSSProperties}>
                QUIZ COMPLETE!
              </h1>

              <div className="card" style={{padding: "var(--space-l)", textAlign: "center"}}>
                <div className="stack" style={{"--space": "var(--space-m)"} as React.CSSProperties}>
                  <div className="text-6xl" style={{color: score >= 70 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--error)"}}>
                    {score}%
                  </div>
                  <p className="text-lg">
                    You scored {userAnswers.filter(a => a.isCorrect).length} out of {userAnswers.length} questions correctly
                  </p>
                  
                  <div className="cluster justify-center" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                    <button
                      onClick={handleRetakeQuiz}
                      className="btn"
                      style={{
                        background: "var(--primary)",
                        color: "white",
                        border: "2px solid var(--primary-dark)",
                        boxShadow: "0 4px 12px rgba(120, 147, 138, 0.3)",
                      }}
                    >
                      <RotateCcw size={16} />
                      Retake Quiz
                    </button>
                    <button
                      onClick={handleNewQuiz}
                      className="btn"
                      style={{
                        background: "var(--surface)",
                        color: "var(--foreground)",
                        border: "2px solid var(--border)",
                      }}
                    >
                      <Plus size={16} />
                      New Quiz
                    </button>
                  </div>
                </div>
              </div>

              <div className="stack" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                <h2 className="text-2xl font-bold">Review Your Answers</h2>
                {quiz.questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  return (
                    <div key={index} className="card" style={{padding: "var(--space-m)", textAlign: "left"}}>
                      <div className="stack" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                        <div className="cluster justify-between" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                          <h3 className="text-lg font-bold">Question {index + 1}</h3>
                          {userAnswer.isCorrect ? (
                            <CheckCircle size={20} style={{color: "var(--success)"}} />
                          ) : (
                            <XCircle size={20} style={{color: "var(--error)"}} />
                          )}
                        </div>
                        <p className="text-base">{question.question}</p>
                        <div className="stack" style={{"--space": "var(--space-xs)"} as React.CSSProperties}>
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="text-sm"
                              style={{
                                padding: "var(--space-xs)",
                                borderRadius: "4px",
                                background: 
                                  optionIndex === question.correctAnswer ? "var(--success)" :
                                  optionIndex === userAnswer.selectedAnswer && !userAnswer.isCorrect ? "var(--error)" :
                                  "transparent",
                                color: 
                                  optionIndex === question.correctAnswer || 
                                  (optionIndex === userAnswer.selectedAnswer && !userAnswer.isCorrect) ? "white" : "inherit"
                              }}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm" style={{background: "var(--muted)", padding: "var(--space-s)", borderRadius: "4px"}}>
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (quiz && !quizCompleted) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
      <div className="min-h-screen" style={{background: "var(--background)"}}>
        <nav className="nav">
          <div className="nav-content">
            <ul className="nav-links" role="list">
              <li><a href="/">HOME</a></li>
            </ul>
            <div className="handwritten text-lg">
              <a href="/" aria-label="Notes Garden - Go to homepage">Notes Garden</a>
            </div>
            <ul className="nav-links" role="list">
              <li><a href="/quiz">QUIZ MAKER</a></li>
            </ul>
          </div>
        </nav>

        <main style={{padding: "var(--space-m)"} as React.CSSProperties}>
          <div className="wrapper" style={{paddingTop: "var(--space-xl)"} as React.CSSProperties}>
            <div className="stack" style={{"--space": "var(--space-l)", maxWidth: "700px", margin: "0 auto"} as React.CSSProperties}>
              
              {/* Progress bar and New Quiz button */}
              <div className="stack" style={{"--space": "var(--space-xs)"} as React.CSSProperties}>
                <div className="cluster justify-between" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                  <span className="text-sm">Question {currentQuestion + 1} of {quiz.questions.length}</span>
                  <button
                    onClick={handleNewQuiz}
                    className="btn"
                    style={{
                      background: "var(--surface)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                      padding: "var(--space-xs) var(--space-s)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    <Plus size={12} />
                    New Quiz
                  </button>
                  <span className="text-sm">{Math.round(progress)}% Complete</span>
                </div>
                <div style={{background: "var(--muted)", height: "8px", borderRadius: "4px", overflow: "hidden"}}>
                  <div 
                    style={{
                      background: "var(--primary)", 
                      height: "100%", 
                      width: `${progress}%`,
                      transition: "width 300ms ease"
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="card" style={{padding: "var(--space-l)"}}>
                <div className="stack" style={{"--space": "var(--space-m)"} as React.CSSProperties}>
                  <h2 className="text-xl font-bold">{question.question}</h2>
                  
                  <div className="stack" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                    {question.options.map((option, index) => (
                      <label
                        key={index}
                        className="cluster cursor-pointer"
                        style={{
                          "--space": "var(--space-s)",
                          padding: "var(--space-m)",
                          border: "2px solid",
                          borderColor: selectedAnswer === index ? "var(--primary)" : "var(--border)",
                          borderRadius: "8px",
                          background: selectedAnswer === index ? "rgba(var(--primary-rgb), 0.1)" : "var(--surface)",
                          transition: "all 200ms ease"
                        } as React.CSSProperties}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={index}
                          checked={selectedAnswer === index}
                          onChange={() => handleAnswerSelect(index)}
                          disabled={showResult}
                          style={{margin: 0}}
                        />
                        <span className="text-base">
                          <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                        </span>
                      </label>
                    ))}
                  </div>

                  {showResult && (
                    <div 
                      className="card" 
                      style={{
                        padding: "var(--space-m)", 
                        background: userAnswers[currentQuestion]?.isCorrect ? "var(--success)" : "var(--error)",
                        color: "white"
                      }}
                    >
                      <div className="stack" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                        <div className="cluster" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                          {userAnswers[currentQuestion]?.isCorrect ? (
                            <CheckCircle size={20} />
                          ) : (
                            <XCircle size={20} />
                          )}
                          <strong>
                            {userAnswers[currentQuestion]?.isCorrect ? 'Correct!' : 'Incorrect'}
                          </strong>
                        </div>
                        <p className="text-sm">{question.explanation}</p>
                      </div>
                    </div>
                  )}

                  <div className="cluster justify-between" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="btn disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "var(--surface)",
                        color: "var(--foreground)",
                        border: "2px solid var(--border)"
                      }}
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </button>

                    {!showResult ? (
                      <button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswer === null}
                        className="btn disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: selectedAnswer !== null ? "var(--primary)" : "var(--muted)",
                          color: "white",
                          border: "2px solid",
                          borderColor: selectedAnswer !== null ? "var(--primary-dark)" : "var(--muted-dark)"
                        }}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleContinue}
                        className="btn"
                        style={{
                          background: "var(--primary)",
                          color: "white",
                          border: "2px solid var(--primary-dark)"
                        }}
                      >
                        {currentQuestion < quiz.questions.length - 1 ? (
                          <>
                            Next Question
                            <ArrowRight size={16} />
                          </>
                        ) : (
                          'Finish Quiz'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Upload form
  return (
    <div className="min-h-screen" style={{background: "var(--background)"}}>
      <nav className="nav">
        <div className="nav-content">
          <ul className="nav-links" role="list">
            <li><a href="/">HOME</a></li>
          </ul>
          <div className="handwritten text-lg">
            <a href="/" aria-label="Notes Garden - Go to homepage">Notes Garden</a>
          </div>
          <ul className="nav-links" role="list">
            <li><a href="/quiz">QUIZ MAKER</a></li>
          </ul>
        </div>
      </nav>

      <main style={{padding: "var(--space-m)"} as React.CSSProperties}>
        <div className="wrapper" style={{paddingTop: "var(--space-xl)"} as React.CSSProperties}>
          <div className="stack text-center" style={{"--space": "var(--space-l)", maxWidth: "600px", margin: "0 auto"} as React.CSSProperties}>
            <h1 className="display-serif text-4xl" style={{marginBottom: "var(--space-m)"} as React.CSSProperties}>
              QUIZ MAKER
            </h1>
            <p className="text-lg" style={{opacity: 0.9, marginBottom: "var(--space-l)"} as React.CSSProperties}>
              Upload a text file and get an interactive multiple-choice quiz
            </p>

            <form onSubmit={handleSubmit} className="stack" style={{"--space": "var(--space-m)"} as React.CSSProperties}>
              <div className="card" style={{padding: "var(--space-l)", textAlign: "left"}}>
                <label htmlFor="file-upload" className="stack cursor-pointer" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                  <span className="text-base font-bold">Choose Text File</span>
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-primary"
                    style={{
                      borderColor: file ? "var(--primary)" : "var(--muted)",
                      background: file ? "rgba(var(--primary-rgb), 0.05)" : "transparent"
                    }}
                  >
                    {file ? (
                      <div className="stack" style={{"--space": "var(--space-xs)"} as React.CSSProperties}>
                        <FileText size={32} style={{color: "var(--primary)", margin: "0 auto"}} />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs" style={{opacity: 0.7}}>
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ) : (
                      <div className="stack" style={{"--space": "var(--space-xs)"} as React.CSSProperties}>
                        <Upload size={32} style={{color: "var(--muted)", margin: "0 auto"}} />
                        <span className="text-sm">Drop your text file here or click to browse</span>
                        <span id="file-upload-help" className="text-xs" style={{opacity: 0.7}}>
                          Only .txt files are supported
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-describedby="file-upload-help"
                  />
                </label>

                <button
                  type="submit"
                  disabled={!file || isLoading}
                  className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    marginTop: "var(--space-m)",
                    background: !file || isLoading ? "var(--muted)" : "var(--primary)",
                    color: "white",
                    border: "2px solid",
                    borderColor: !file || isLoading ? "var(--muted-dark)" : "var(--primary-dark)",
                    boxShadow: !file || isLoading ? "none" : "0 4px 12px rgba(120, 147, 138, 0.3)",
                    transform: !file || isLoading ? "none" : "translateY(0)",
                  }}
                  onMouseEnter={(e) => {
                    if (!file || isLoading) return;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(120, 147, 138, 0.4)";
                    e.currentTarget.style.background = "var(--primary-dark)";
                  }}
                  onMouseLeave={(e) => {
                    if (!file || isLoading) return;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(120, 147, 138, 0.3)";
                    e.currentTarget.style.background = "var(--primary)";
                  }}
                  aria-describedby={file ? "upload-help" : "upload-error"}
                >
                  {isLoading ? (
                    <span className="cluster" style={{"--space": "var(--space-xs)"} as React.CSSProperties}>
                      <Loader2 size={16} className="animate-spin" />
                      Generating Quiz...
                    </span>
                  ) : (
                    'Create Quiz'
                  )}
                </button>
                <div id="upload-help" className="sr-only">
                  {file ? "File selected and ready to upload" : ""}
                </div>
                <div id="upload-error" className="sr-only">
                  {!file ? "Please select a file first" : ""}
                </div>
              </div>
            </form>

            {error && (
              <div className="card" style={{padding: "var(--space-m)", background: "var(--error)", color: "white"}}>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}