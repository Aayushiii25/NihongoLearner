import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shuffle, RotateCcw, CheckCircle, Trophy, Clock } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import { apiRequest } from "@/lib/queryClient";
import { shuffleArray } from "@/lib/japanese-data";
import type { VocabularyWord } from "@shared/schema";

interface GameState {
  currentWord: VocabularyWord | null;
  shuffledChars: string[];
  selectedChars: string[];
  score: number;
  level: number;
  timeLeft: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  correctAnswers: number;
  totalQuestions: number;
}

export default function WordJumble() {
  const [gameState, setGameState] = useState<GameState>({
    currentWord: null,
    shuffledChars: [],
    selectedChars: [],
    score: 0,
    level: 1,
    timeLeft: 60,
    gameStarted: false,
    gameCompleted: false,
    correctAnswers: 0,
    totalQuestions: 0,
  });

  const { data: vocabulary, isLoading } = useQuery({
    queryKey: ["/api/vocabulary/random", "hiragana", 10],
    queryFn: async () => {
      const response = await fetch("/api/vocabulary/random?type=hiragana&count=10", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch vocabulary");
      return response.json() as Promise<VocabularyWord[]>;
    },
  });

  const saveScoreMutation = useMutation({
    mutationFn: async (scoreData: { gameType: string; score: number; level: number }) => {
      const response = await apiRequest("POST", "/api/game/score", scoreData);
      return response.json();
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.gameStarted && !gameState.gameCompleted && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            // Game over
            saveScoreMutation.mutate({
              gameType: "word_jumble",
              score: prev.score,
              level: prev.level,
            });
            return { ...prev, timeLeft: 0, gameCompleted: true };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState.gameStarted, gameState.gameCompleted, gameState.timeLeft]);

  const startGame = () => {
    if (!vocabulary || vocabulary.length === 0) return;
    
    const firstWord = vocabulary[0];
    setGameState({
      currentWord: firstWord,
      shuffledChars: shuffleArray(firstWord.romanji.split("")),
      selectedChars: [],
      score: 0,
      level: 1,
      timeLeft: 60,
      gameStarted: true,
      gameCompleted: false,
      correctAnswers: 0,
      totalQuestions: 1,
    });
  };

  const nextWord = () => {
    if (!vocabulary) return;
    
    const nextIndex = gameState.totalQuestions;
    if (nextIndex >= vocabulary.length) {
      // Game completed
      saveScoreMutation.mutate({
        gameType: "word_jumble",
        score: gameState.score,
        level: gameState.level,
      });
      setGameState(prev => ({ ...prev, gameCompleted: true }));
      return;
    }

    const word = vocabulary[nextIndex];
    setGameState(prev => ({
      ...prev,
      currentWord: word,
      shuffledChars: shuffleArray(word.romanji.split("")),
      selectedChars: [],
      totalQuestions: prev.totalQuestions + 1,
    }));
  };

  const selectChar = (char: string, index: number) => {
    setGameState(prev => ({
      ...prev,
      selectedChars: [...prev.selectedChars, char],
      shuffledChars: prev.shuffledChars.filter((_, i) => i !== index),
    }));
  };

  const unselectChar = (index: number) => {
    const char = gameState.selectedChars[index];
    setGameState(prev => ({
      ...prev,
      selectedChars: prev.selectedChars.filter((_, i) => i !== index),
      shuffledChars: [...prev.shuffledChars, char],
    }));
  };

  const checkAnswer = () => {
    const userAnswer = gameState.selectedChars.join("");
    const correctAnswer = gameState.currentWord?.romanji;
    
    if (userAnswer === correctAnswer) {
      // Correct answer
      const points = Math.max(100 - (60 - gameState.timeLeft), 20); // More points for faster answers
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        correctAnswers: prev.correctAnswers + 1,
      }));
      
      setTimeout(nextWord, 1500);
    } else {
      // Incorrect - shuffle the selected chars back
      setGameState(prev => ({
        ...prev,
        shuffledChars: shuffleArray([...prev.shuffledChars, ...prev.selectedChars]),
        selectedChars: [],
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentWord: null,
      shuffledChars: [],
      selectedChars: [],
      score: 0,
      level: 1,
      timeLeft: 60,
      gameStarted: false,
      gameCompleted: false,
      correctAnswers: 0,
      totalQuestions: 0,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-japanese-charcoal mb-4">Word Jumble</h1>
        <p className="text-xl text-gray-600">Rearrange the letters to spell Japanese words</p>
      </div>

      {!gameState.gameStarted ? (
        // Start screen
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Shuffle className="w-6 h-6 text-blue-500" />
              Ready to Play?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                You have 60 seconds to spell as many Japanese words as possible using their romanji.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Click letters to build words</p>
                <p>• Faster answers = more points</p>
                <p>• Complete all words for bonus!</p>
              </div>
            </div>
            <Button 
              onClick={startGame} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!vocabulary || vocabulary.length === 0}
            >
              Start Game
            </Button>
          </CardContent>
        </Card>
      ) : gameState.gameCompleted ? (
        // Game over screen
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Game Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-japanese-charcoal">
                {gameState.score} Points
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Correct Answers: {gameState.correctAnswers} / {gameState.totalQuestions}
                </p>
                <p className="text-gray-600">
                  Accuracy: {Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)}%
                </p>
              </div>
              <Badge 
                className={
                  gameState.score >= 800 ? "bg-yellow-500" :
                  gameState.score >= 600 ? "bg-green-500" :
                  gameState.score >= 400 ? "bg-blue-500" : "bg-gray-500"
                }
              >
                {gameState.score >= 800 ? "🏆 Excellent!" :
                 gameState.score >= 600 ? "🥈 Great!" :
                 gameState.score >= 400 ? "🥉 Good!" : "Keep practicing!"}
              </Badge>
            </div>
            <Button onClick={resetGame} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Game play screen
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Game status */}
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime(gameState.timeLeft)}
            </Badge>
            <div className="text-2xl font-bold text-japanese-charcoal">
              Score: {gameState.score}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Word {gameState.totalQuestions} of {vocabulary?.length || 0}</span>
              <span>{gameState.correctAnswers} correct</span>
            </div>
            <Progress 
              value={vocabulary ? (gameState.totalQuestions / vocabulary.length) * 100 : 0} 
              className="w-full" 
            />
          </div>

          {/* Current word display */}
          {gameState.currentWord && (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl font-japanese text-japanese-charcoal">
                  {gameState.currentWord.character}
                </div>
                <p className="text-lg text-gray-600">
                  {gameState.currentWord.meaning}
                </p>
                <Badge variant="secondary">
                  Spell: {gameState.currentWord.romanji}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Selected characters */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Your Answer:</h3>
              <div className="min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 flex-wrap">
                {gameState.selectedChars.length === 0 ? (
                  <span className="text-gray-400">Click letters below...</span>
                ) : (
                  gameState.selectedChars.map((char, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => unselectChar(index)}
                      className="text-lg font-mono"
                    >
                      {char}
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available characters */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Available Letters:</h3>
              <div className="flex gap-2 justify-center flex-wrap">
                {gameState.shuffledChars.map((char, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    onClick={() => selectChar(char, index)}
                    className="text-lg font-mono hover:bg-sakura-200"
                  >
                    {char}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Check answer button */}
          <div className="text-center">
            <Button
              onClick={checkAnswer}
              disabled={gameState.selectedChars.length !== gameState.currentWord?.romanji.length}
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Check Answer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
