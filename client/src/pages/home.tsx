import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chatbot from "@/components/chatbot";
import { Link } from "wouter";
import { 
  Play, 
  Info, 
  BookOpen, 
  Gamepad2, 
  Brain, 
  Camera,
  Sparkles,
  Mountain,
  Sprout
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 bg-sakura-gradient">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 opacity-20 animate-float">
            <Sprout className="w-16 h-16 text-white" />
          </div>
          <div className="absolute bottom-10 right-10 w-24 h-24 opacity-20 animate-float" style={{ animationDelay: "1s" }}>
            <Mountain className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 font-japanese">
                こんにちは！<br/>
                <span className="text-japanese-cream">Welcome to Nihongo</span>
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Master Japanese through interactive conversations, games, and cultural immersion. 
                Start your journey into the beautiful world of Japanese language and culture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/flashcards">
                  <Button className="bg-white text-sakura-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Start Learning
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-sakura-600 transition-all">
                  <Info className="w-5 h-5 mr-2" />
                  How it Works
                </Button>
              </div>
            </div>
            
            {/* Interactive Chatbot */}
            <Chatbot />
          </div>
        </div>
      </section>

      {/* Learning Modules Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-japanese-charcoal mb-4 font-japanese">Learning Modules</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master Japanese through interactive games, flashcards, and cultural exploration
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Flashcards Module */}
            <Link href="/flashcards">
              <Card className="card-hover bg-gradient-to-br from-sakura-50 to-sakura-100 border-sakura-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-sakura-gradient rounded-2xl flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-japanese-charcoal mb-3 font-japanese">Flashcards</h4>
                  <p className="text-gray-600 mb-4 text-sm">
                    Interactive flashcards for Hiragana, Katakana, and Kanji with spaced repetition.
                  </p>
                  <Badge className="bg-sakura-600 text-white">Practice</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Word Jumble Game */}
            <Link href="/word-jumble">
              <Card className="card-hover bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-japanese-charcoal mb-3">Word Jumble</h4>
                  <p className="text-gray-600 mb-4 text-sm">
                    Rearrange characters to form Japanese words and improve recognition skills.
                  </p>
                  <Badge className="bg-blue-600 text-white">Play</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Quiz Module */}
            <Link href="/quiz">
              <Card className="card-hover bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-japanese-charcoal mb-3">Quiz Tests</h4>
                  <p className="text-gray-600 mb-4 text-sm">
                    Multiple choice tests to assess your knowledge and track progress.
                  </p>
                  <Badge className="bg-green-600 text-white">Start Quiz</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Culture Module */}
            <Link href="/culture">
              <Card className="card-hover bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-japanese-charcoal mb-3">Culture</h4>
                  <p className="text-gray-600 mb-4 text-sm">
                    Explore Japanese culture, traditions, and lifestyle through photography.
                  </p>
                  <Badge className="bg-purple-600 text-white">Explore</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-sakura-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-japanese-charcoal">50K+</h4>
              <p className="text-gray-600">Active Learners</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-japanese-charcoal">1000+</h4>
              <p className="text-gray-600">Vocabulary Words</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-japanese-charcoal">95%</h4>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-japanese-charcoal">500+</h4>
              <p className="text-gray-600">Cultural Photos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
