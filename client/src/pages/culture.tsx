import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Search, Filter, MapPin, Calendar, Tag } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import type { CulturalContent } from "@shared/schema";

export default function Culture() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContent, setSelectedContent] = useState<CulturalContent | null>(null);

  const { data: culturalContent, isLoading } = useQuery({
    queryKey: ["/api/culture", selectedCategory === "all" ? undefined : selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "all" ? "/api/culture" : `/api/culture?category=${selectedCategory}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch cultural content");
      return response.json() as Promise<CulturalContent[]>;
    },
  });

  const categories = [
    { id: "all", label: "All Culture", icon: Camera },
    { id: "traditional_art", label: "Traditional Art", icon: Camera },
    { id: "food_culture", label: "Food Culture", icon: Camera },
    { id: "landmarks", label: "Landmarks", icon: MapPin },
    { id: "general", label: "General", icon: Tag },
  ];

  const filteredContent = culturalContent?.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-japanese-charcoal mb-4 font-japanese">Cultural Immersion</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore Japanese culture, traditions, and lifestyle through beautiful photography and stories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search cultural content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? "bg-sakura-600 hover:bg-sakura-700" 
                    : "hover:bg-sakura-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="card-hover cursor-pointer overflow-hidden">
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x300/FFE0E6/FF6B9D?text=${encodeURIComponent(item.title)}`;
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/90 text-japanese-charcoal"
                      >
                        {item.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-japanese-charcoal mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.description}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-japanese text-japanese-charcoal">
                    {item.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/800x400/FFE0E6/FF6B9D?text=${encodeURIComponent(item.title)}`;
                    }}
                  />
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge className="bg-sakura-100 text-sakura-700">
                      {item.category.replace('_', ' ')}
                    </Badge>
                    {item.tags && item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-japanese-charcoal">Description</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  {item.content && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-japanese-charcoal">Learn More</h4>
                      <div className="bg-sakura-50 rounded-lg p-6 border border-sakura-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-sakura-50 to-purple-50 rounded-lg p-4 border border-sakura-200">
                    <h5 className="font-semibold text-japanese-charcoal mb-2">
                      🌸 Cultural Note
                    </h5>
                    <p className="text-sm text-gray-600">
                      This content represents an important aspect of Japanese culture and tradition. 
                      Understanding these cultural elements helps deepen your appreciation of the Japanese language and way of life.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Cultural Content Found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No content matches "${searchTerm}". Try a different search term.`
              : "No cultural content available for this category."
            }
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Cultural Learning Tips */}
      <div className="mt-16 bg-gradient-to-br from-sakura-50 to-purple-50 rounded-3xl p-8 border border-sakura-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-japanese-charcoal mb-2 font-japanese">
            Cultural Learning Tips
          </h3>
          <p className="text-gray-600">
            Enhance your Japanese learning through cultural understanding
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-sakura-gradient rounded-full flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-japanese-charcoal mb-2">Visual Learning</h4>
            <p className="text-sm text-gray-600">
              Use cultural images to create mental associations with Japanese vocabulary and concepts.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-japanese-charcoal mb-2">Context Understanding</h4>
            <p className="text-sm text-gray-600">
              Learn about the cultural context behind Japanese expressions and social customs.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-japanese-charcoal mb-2">Cultural Vocabulary</h4>
            <p className="text-sm text-gray-600">
              Discover Japanese words and phrases that are deeply rooted in cultural traditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
