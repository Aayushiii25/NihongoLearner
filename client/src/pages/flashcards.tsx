import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Volume2, RotateCcw, CheckCircle, XCircle, Star } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import { useUpdateProgress } from "@/hooks/use-progress";
import type { VocabularyWord } from "@shared/schema";

export default function Flashcards() {
  const [selectedType, setSelectedType] = useState("hiragana");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userProgress, setUserProgress] = useState<{[key: number]: { correct: number; incorrect: number; }}>({});

  const { data: vocabulary, isLoading } = useQuery({
    queryKey: ["/api/vocabulary", selectedType],
    queryFn: async () => {
      const response = await fetch(`/api/vocabulary?type=${selectedType}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch vocabulary");
      return response.json() as Promise<VocabularyWord[]>;
    },
  });

  const updateProgress = useUpdateProgress();

  const currentCard = vocabulary?.[currentIndex];
  const progressPercent = vocabulary ? ((currentIndex + 1) / vocabulary.length) * 100 : 0;

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentCard) return;

    const current = userProgress[currentCard.id] || { correct: 0, incorrect: 0 };
    const updated = {
      correct: current.correct + (isCorrect ? 1 : 0),
      incorrect: current.incorrect + (isCorrect ? 0 : 1),
    };
    
    setUserProgress(prev => ({
      ...prev,
      [currentCard.id]: updated
    }));

    // Calculate mastery level based on performance
    const totalAttempts = updated.correct + updated.incorrect;
    const accuracy = totalAttempts > 0 ? updated.correct / totalAttempts : 0;
    let masteryLevel = 0;
    if (accuracy >= 0.9 && totalAttempts >= 3) masteryLevel = 5;
    else if (accuracy >= 0.8 && totalAttempts >= 2) masteryLevel = 4;
    else if (accuracy >= 0.7 && totalAttempts >= 2) masteryLevel = 3;
    else if (accuracy >= 0.6) masteryLevel = 2;
    else if (totalAttempts > 0) masteryLevel = 1;

    updateProgress.mutate({
      wordId: currentCard.id,
      correct: updated.correct,
      incorrect: updated.incorrect,
      masteryLevel,
    });

    // Move to next card
    setTimeout(() => {
      nextCard();
    }, 1000);
  };

  const nextCard = () => {
    if (vocabulary && currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
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
        <h1 className="text-4xl font-bold text-japanese-charcoal mb-4 font-japanese">Flashcards</h1>
        <p className="text-xl text-gray-600">Master Japanese characters with interactive flashcards</p>
      </div>

      <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
          <TabsTrigger value="katakana">Katakana</TabsTrigger>
          <TabsTrigger value="kanji">Basic Kanji</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="space-y-6">
          {vocabulary && vocabulary.length > 0 ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Card {currentIndex + 1} of {vocabulary.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(progressPercent)}% Complete
                  </span>
                </div>
                <Progress value={progressPercent} className="w-full" />
              </div>

              {/* Flashcard */}
              <div className="flex justify-center">
                <Card 
                  className="w-full max-w-md h-80 cursor-pointer transform transition-transform duration-300 hover:scale-105"
                  onClick={handleCardFlip}
                >
                  <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center relative">
                    {!isFlipped ? (
                      // Front of card
                      <div className="space-y-4">
                        <div className="text-6xl font-japanese text-japanese-charcoal">
                          {currentCard?.character}
                        </div>
                        <Badge variant="secondary" className="bg-sakura-100 text-sakura-700">
                          {selectedType}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-4">Click to reveal</p>
                      </div>
                    ) : (
                      // Back of card
                      <div className="space-y-4">
                        <div className="text-3xl font-bold text-japanese-charcoal">
                          {currentCard?.romanji}
                        </div>
                        <div className="text-lg text-gray-700">
                          {currentCard?.meaning}
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <Button variant="ghost" size="sm">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <RotateCcw className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Answer Buttons */}
              {isFlipped && (
                <div className="flex justify-center gap-4 animate-slide-up">
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="destructive"
                    className="flex items-center gap-2"
                    disabled={updateProgress.isPending}
                  >
                    <XCircle className="w-5 h-5" />
                    Incorrect
                  </Button>
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    disabled={updateProgress.isPending}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Correct
                  </Button>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={prevCard}
                  variant="outline"
                  disabled={currentIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={resetProgress}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={nextCard}
                  variant="outline"
                >
                  Next
                </Button>
              </div>

              {/* Current Progress */}
              {currentCard && userProgress[currentCard.id] && (
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-center mb-3">Current Card Progress</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        ✓ Correct: {userProgress[currentCard.id].correct}
                      </span>
                      <span className="text-red-600">
                        ✗ Incorrect: {userProgress[currentCard.id].incorrect}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No vocabulary available for {selectedType}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
