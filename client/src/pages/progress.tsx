import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Star, 
  Trophy, 
  Target, 
  Calendar, 
  BookOpen, 
  Brain,
  Gamepad2,
  Flame,
  Award,
  BarChart3,
  Clock
} from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import { useUserStats, useProgress } from "@/hooks/use-progress";

interface StatCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function ProgressPage() {
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { data: hiraganaProgress } = useProgress("hiragana");
  const { data: katakanaProgress } = useProgress("katakana");
  const { data: kanjiProgress } = useProgress("kanji");

  const { data: achievements } = useQuery({
    queryKey: ["/api/user/achievements"],
  });

  const { data: quizHistory } = useQuery({
    queryKey: ["/api/quiz/history"],
  });

  const { data: gameScores } = useQuery({
    queryKey: ["/api/game/scores/word_jumble"],
    queryFn: async () => {
      const response = await fetch("/api/game/scores/word_jumble", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch game scores");
      return response.json();
    },
  });

  if (statsLoading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const calculateProgress = (progressData: any[], type: string) => {
    if (!progressData || progressData.length === 0) return 0;
    const masteredCount = progressData.filter(p => p.masteryLevel >= 4).length;
    return Math.round((masteredCount / progressData.length) * 100);
  };

  const hiraganaPercent = calculateProgress(hiraganaProgress, "hiragana");
  const katakanaPercent = calculateProgress(katakanaProgress, "katakana");
  const kanjiPercent = calculateProgress(kanjiProgress, "kanji");

  const statCards: StatCard[] = [
    {
      title: "Study Streak",
      value: userStats?.streakDays || 0,
      subtitle: "days in a row",
      icon: Flame,
      color: "bg-orange-500"
    },
    {
      title: "Total Points",
      value: userStats?.totalPoints?.toLocaleString() || "0",
      subtitle: "points earned",
      icon: Star,
      color: "bg-yellow-500"
    },
    {
      title: "Words Learned",
      value: userStats?.totalWords || 0,
      subtitle: "vocabulary mastered",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Quiz Accuracy",
      value: `${userStats?.accuracy || 0}%`,
      subtitle: "average score",
      icon: Brain,
      color: "bg-green-500"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-japanese-charcoal mb-4 font-japanese">Your Progress</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-japanese-charcoal">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Learning Progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-sakura-600" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-japanese-charcoal">Hiragana</span>
                    <span className="text-sm text-gray-600">{hiraganaPercent}%</span>
                  </div>
                  <Progress value={hiraganaPercent} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {hiraganaProgress?.filter(p => p.masteryLevel >= 4).length || 0} of {hiraganaProgress?.length || 0} mastered
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-japanese-charcoal">Katakana</span>
                    <span className="text-sm text-gray-600">{katakanaPercent}%</span>
                  </div>
                  <Progress value={katakanaPercent} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {katakanaProgress?.filter(p => p.masteryLevel >= 4).length || 0} of {katakanaProgress?.length || 0} mastered
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-japanese-charcoal">Basic Kanji</span>
                    <span className="text-sm text-gray-600">{kanjiPercent}%</span>
                  </div>
                  <Progress value={kanjiPercent} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {kanjiProgress?.filter(p => p.masteryLevel >= 4).length || 0} of {kanjiProgress?.length || 0} mastered
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="quizzes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
                  <TabsTrigger value="games">Game Scores</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quizzes" className="space-y-3">
                  {quizHistory && quizHistory.length > 0 ? (
                    quizHistory.slice(0, 5).map((quiz: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Brain className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{quiz.type} Quiz</p>
                            <p className="text-xs text-gray-500">
                              {new Date(quiz.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{quiz.score}/{quiz.totalQuestions}</p>
                          <Badge className={
                            (quiz.score / quiz.totalQuestions) >= 0.8 ? "bg-green-500" :
                            (quiz.score / quiz.totalQuestions) >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                          }>
                            {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No quiz history yet</p>
                  )}
                </TabsContent>
                
                <TabsContent value="games" className="space-y-3">
                  {gameScores && gameScores.length > 0 ? (
                    gameScores.slice(0, 5).map((score: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Word Jumble</p>
                            <p className="text-xs text-gray-500">
                              {new Date(score.playedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{score.score} pts</p>
                          <Badge variant="secondary">Level {score.level}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No game scores yet</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Goals */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements && achievements.length > 0 ? (
                achievements.slice(0, 5).map((achievement: any, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-japanese-charcoal">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No achievements yet</p>
                  <p className="text-sm text-gray-400">Keep learning to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Goal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-white">
                    {Math.min(userStats?.streakDays || 0, 7)}/7
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-japanese-charcoal mb-2">
                    Study 7 days this week
                  </p>
                  <Progress 
                    value={Math.min(((userStats?.streakDays || 0) / 7) * 100, 100)} 
                    className="w-full mb-3" 
                  />
                  <p className="text-sm text-gray-600">
                    {userStats?.streakDays >= 7 
                      ? "🎉 Goal completed!" 
                      : `${Math.max(7 - (userStats?.streakDays || 0), 0)} more days to go!`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Tips */}
          <Card className="bg-gradient-to-br from-sakura-50 to-purple-50 border-sakura-200">
            <CardHeader>
              <CardTitle className="text-japanese-charcoal">💡 Study Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-sakura-600">•</span>
                  Practice daily for better retention
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-sakura-600">•</span>
                  Review difficult words frequently
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-sakura-600">•</span>
                  Use cultural context to remember meanings
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-sakura-600">•</span>
                  Mix different learning activities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
