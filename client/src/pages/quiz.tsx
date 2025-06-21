import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, XCircle, Trophy, Clock, Star, RotateCcw } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  answers: (number | null)[];
  score: number;
  isComplete: boolean;
  timeLeft: number;
  quizStarted: boolean;
}

export default function Quiz() {
  const [quizType, setQuizType] = useState("hiragana");
  const [difficulty, setDifficulty] = useState(1);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    score: 0,
    isComplete: false,
    timeLeft: 300, // 5 minutes
    quizStarted: false,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: quizHistory } = useQuery({
    queryKey: ["/api/quiz/history"],
  });

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/quiz/generate?type=${quizType}&difficulty=${difficulty}&count=10`, {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to generate quiz");
      return response.json() as Promise<QuizQuestion[]>;
    },
    onSuccess: (questions) => {
      setQuizState({
        questions,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        answers: new Array(questions.length).fill(null),
        score: 0,
        isComplete: false,
        timeLeft: 300,
        quizStarted: true,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate quiz questions. Please try again.",
        variant: "destructive",
      });
    }
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (quizData: { score: number; totalQuestions: number; type: string }) => {
      const response = await apiRequest("POST", "/api/quiz/submit", quizData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Quiz Completed!",
        description: `You scored ${quizState.score} out of ${quizState.questions.length}`,
      });
    },
  });

  const startQuiz = () => {
    generateQuizMutation.mutate();
  };

  const selectAnswer = (answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
    }));
  };

  const submitAnswer = () => {
    if (quizState.selectedAnswer === null) return;

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = quizState.selectedAnswer === currentQuestion.correct;
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = quizState.selectedAnswer;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: prev.score + (isCorrect ? 1 : 0),
    }));

    // Move to next question or complete quiz
    setTimeout(() => {
      if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
        }));
      } else {
        // Quiz complete
        const finalScore = quizState.score + (isCorrect ? 1 : 0);
        setQuizState(prev => ({ ...prev, isComplete: true }));
        submitQuizMutation.mutate({
          score: finalScore,
          totalQuestions: quizState.questions.length,
          type: quizType,
        });
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answers: [],
      score: 0,
      isComplete: false,
      timeLeft: 300,
      quizStarted: false,
    });
  };

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progressPercent = quizState.questions.length > 0 
    ? ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100 
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-japanese-charcoal mb-4">Japanese Quiz</h1>
        <p className="text-xl text-gray-600">Test your knowledge with interactive quizzes</p>
      </div>

      {!quizState.quizStarted ? (
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Quiz Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-green-600" />
                Quiz Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={quizType} onValueChange={setQuizType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
                  <TabsTrigger value="katakana">Katakana</TabsTrigger>
                  <TabsTrigger value="kanji">Kanji</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Difficulty Level</Label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      onClick={() => setDifficulty(level)}
                      className={difficulty === level ? "bg-sakura-600" : ""}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Level {difficulty}: {
                    difficulty === 1 ? "Beginner" :
                    difficulty === 2 ? "Elementary" :
                    difficulty === 3 ? "Intermediate" :
                    difficulty === 4 ? "Advanced" : "Expert"
                  }
                </p>
              </div>

              <Button 
                onClick={startQuiz} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={generateQuizMutation.isPending}
              >
                {generateQuizMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Start Quiz (10 Questions)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quiz History */}
          {quizHistory && quizHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quizHistory.slice(0, 5).map((quiz: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{quiz.type}</Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(quiz.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {quiz.score}/{quiz.totalQuestions}
                        </span>
                        <Badge className={
                          (quiz.score / quiz.totalQuestions) >= 0.8 ? "bg-green-500" :
                          (quiz.score / quiz.totalQuestions) >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                        }>
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : quizState.isComplete ? (
        // Quiz Results
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-japanese-charcoal">
                {quizState.score}/{quizState.questions.length}
              </div>
              <div className="text-2xl font-semibold text-gray-600">
                {Math.round((quizState.score / quizState.questions.length) * 100)}%
              </div>
              <Badge 
                className={
                  quizState.score >= 8 ? "bg-yellow-500 text-white" :
                  quizState.score >= 6 ? "bg-green-500 text-white" :
                  quizState.score >= 4 ? "bg-blue-500 text-white" : "bg-red-500 text-white"
                }
              >
                {quizState.score >= 8 ? "🏆 Excellent!" :
                 quizState.score >= 6 ? "🥈 Great Job!" :
                 quizState.score >= 4 ? "🥉 Good Work!" : "Keep Practicing!"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Correct Answers</span>
                <span className="font-semibold text-green-600">{quizState.score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Incorrect Answers</span>
                <span className="font-semibold text-red-600">{quizState.questions.length - quizState.score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quiz Type</span>
                <Badge variant="secondary">{quizType}</Badge>
              </div>
            </div>

            <Button onClick={resetQuiz} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Another Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Quiz In Progress
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Quiz Progress */}
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime(quizState.timeLeft)}
            </Badge>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
              </div>
              <div className="text-lg font-semibold text-japanese-charcoal">
                Score: {quizState.score}
              </div>
            </div>
          </div>

          <Progress value={progressPercent} className="w-full" />

          {/* Current Question */}
          {currentQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-japanese text-center">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={quizState.selectedAnswer?.toString()}
                  onValueChange={(value) => selectAnswer(parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer text-base font-japanese"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  onClick={submitAnswer}
                  disabled={quizState.selectedAnswer === null}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Answer
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Show correct answer after submission */}
          {quizState.answers[quizState.currentQuestionIndex] !== null && currentQuestion && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {quizState.answers[quizState.currentQuestionIndex] === currentQuestion.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {quizState.answers[quizState.currentQuestionIndex] === currentQuestion.correct ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Correct answer:</strong> {currentQuestion.options[currentQuestion.correct]}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentQuestion.explanation}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
