import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Star, Menu, Home, BookOpen, Gamepad2, Brain, Camera, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();
  
  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/flashcards", label: "Flashcards", icon: BookOpen },
    { path: "/word-jumble", label: "Word Jumble", icon: Gamepad2 },
    { path: "/quiz", label: "Quiz", icon: Brain },
    { path: "/culture", label: "Culture", icon: Camera },
    { path: "/progress", label: "Progress", icon: TrendingUp },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`${
              mobile 
                ? "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
                : "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors font-medium"
            } ${
              isActive
                ? "bg-sakura-100 text-sakura-700"
                : "text-japanese-charcoal hover:text-sakura-600 hover:bg-sakura-50"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b-2 border-sakura-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-sakura-gradient rounded-full flex items-center justify-center animate-float">
              <span className="text-white font-bold text-xl font-japanese">日</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-japanese-charcoal font-japanese">Nihongo</h1>
              <p className="text-sm text-gray-600">Interactive Japanese Learning</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavLinks />
          </nav>

          <div className="flex items-center space-x-4">
            {userStats && (
              <Badge variant="secondary" className="hidden md:flex items-center space-x-2 bg-sakura-100 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-japanese-gold fill-current" />
                <span className="font-semibold text-japanese-charcoal">
                  {userStats.totalPoints.toLocaleString()} pts
                </span>
              </Badge>
            )}

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-sakura-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold font-japanese">日</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-japanese-charcoal font-japanese">Nihongo</h2>
                    </div>
                  </div>
                  
                  {userStats && (
                    <div className="bg-sakura-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Points</span>
                        <Badge className="bg-sakura-500 text-white">
                          {userStats.totalPoints.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Streak</span>
                        <span className="text-sm font-semibold text-japanese-charcoal">
                          {userStats.streakDays} days
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <nav className="space-y-2">
                    <NavLinks mobile />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
