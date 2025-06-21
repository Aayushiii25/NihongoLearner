import { 
  User, InsertUser, VocabularyWord, InsertVocabularyWord, 
  UserProgress, InsertUserProgress, Quiz, InsertQuiz,
  GameScore, InsertGameScore, Achievement, InsertAchievement,
  CulturalContent, InsertCulturalContent, ChatMessage, InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<void>;
  updateUserStreak(userId: number, streakDays: number): Promise<void>;

  // Vocabulary operations
  getAllVocabulary(): Promise<VocabularyWord[]>;
  getVocabularyByType(type: string): Promise<VocabularyWord[]>;
  getVocabularyByLevel(level: number): Promise<VocabularyWord[]>;
  getRandomVocabulary(type: string, count: number): Promise<VocabularyWord[]>;

  // Progress operations
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressByType(userId: number, type: string): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserStats(userId: number): Promise<{
    totalWords: number;
    masteredWords: number;
    accuracy: number;
    streakDays: number;
    totalPoints: number;
  }>;

  // Quiz operations
  saveQuizResult(quiz: InsertQuiz): Promise<Quiz>;
  getUserQuizHistory(userId: number): Promise<Quiz[]>;

  // Game operations
  saveGameScore(score: InsertGameScore): Promise<GameScore>;
  getUserGameScores(userId: number, gameType: string): Promise<GameScore[]>;
  getLeaderboard(gameType: string, limit: number): Promise<GameScore[]>;

  // Achievement operations
  getUserAchievements(userId: number): Promise<Achievement[]>;
  addAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Cultural content operations
  getAllCulturalContent(): Promise<CulturalContent[]>;
  getCulturalContentByCategory(category: string): Promise<CulturalContent[]>;

  // Chat operations
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getUserChatHistory(userId: number, limit: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private vocabulary: Map<number, VocabularyWord> = new Map();
  private progress: Map<number, UserProgress> = new Map();
  private quizzes: Map<number, Quiz> = new Map();
  private gameScores: Map<number, GameScore> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private culturalContent: Map<number, CulturalContent> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  
  private currentUserId = 1;
  private currentVocabId = 1;
  private currentProgressId = 1;
  private currentQuizId = 1;
  private currentGameScoreId = 1;
  private currentAchievementId = 1;
  private currentCulturalId = 1;
  private currentChatId = 1;

  constructor() {
    this.initializeVocabulary();
    this.initializeCulturalContent();
    this.createDefaultUser();
  }

  private createDefaultUser() {
    const defaultUser: User = {
      id: 1,
      username: "demo_user",
      email: "demo@nihongo.app",
      password: "hashed_password",
      totalPoints: 1250,
      streakDays: 12,
      lastStudyDate: new Date(),
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;
  }

  private initializeVocabulary() {
    const hiraganaData = [
      { character: "あ", romanji: "a", meaning: "a sound" },
      { character: "い", romanji: "i", meaning: "i sound" },
      { character: "う", romanji: "u", meaning: "u sound" },
      { character: "え", romanji: "e", meaning: "e sound" },
      { character: "お", romanji: "o", meaning: "o sound" },
      { character: "か", romanji: "ka", meaning: "ka sound" },
      { character: "き", romanji: "ki", meaning: "ki sound" },
      { character: "く", romanji: "ku", meaning: "ku sound" },
      { character: "け", romanji: "ke", meaning: "ke sound" },
      { character: "こ", romanji: "ko", meaning: "ko sound" },
      { character: "さ", romanji: "sa", meaning: "sa sound" },
      { character: "し", romanji: "shi", meaning: "shi sound" },
      { character: "す", romanji: "su", meaning: "su sound" },
      { character: "せ", romanji: "se", meaning: "se sound" },
      { character: "そ", romanji: "so", meaning: "so sound" },
      { character: "た", romanji: "ta", meaning: "ta sound" },
      { character: "ち", romanji: "chi", meaning: "chi sound" },
      { character: "つ", romanji: "tsu", meaning: "tsu sound" },
      { character: "て", romanji: "te", meaning: "te sound" },
      { character: "と", romanji: "to", meaning: "to sound" },
      { character: "な", romanji: "na", meaning: "na sound" },
      { character: "に", romanji: "ni", meaning: "ni sound" },
      { character: "ぬ", romanji: "nu", meaning: "nu sound" },
      { character: "ね", romanji: "ne", meaning: "ne sound" },
      { character: "の", romanji: "no", meaning: "no sound" },
      { character: "は", romanji: "ha", meaning: "ha sound" },
      { character: "ひ", romanji: "hi", meaning: "hi sound" },
      { character: "ふ", romanji: "fu", meaning: "fu sound" },
      { character: "へ", romanji: "he", meaning: "he sound" },
      { character: "ほ", romanji: "ho", meaning: "ho sound" },
      { character: "ま", romanji: "ma", meaning: "ma sound" },
      { character: "み", romanji: "mi", meaning: "mi sound" },
      { character: "む", romanji: "mu", meaning: "mu sound" },
      { character: "め", romanji: "me", meaning: "me sound" },
      { character: "も", romanji: "mo", meaning: "mo sound" },
      { character: "や", romanji: "ya", meaning: "ya sound" },
      { character: "ゆ", romanji: "yu", meaning: "yu sound" },
      { character: "よ", romanji: "yo", meaning: "yo sound" },
      { character: "ら", romanji: "ra", meaning: "ra sound" },
      { character: "り", romanji: "ri", meaning: "ri sound" },
      { character: "る", romanji: "ru", meaning: "ru sound" },
      { character: "れ", romanji: "re", meaning: "re sound" },
      { character: "ろ", romanji: "ro", meaning: "ro sound" },
      { character: "わ", romanji: "wa", meaning: "wa sound" },
      { character: "ん", romanji: "n", meaning: "n sound" },
    ];

    const katakanaData = [
      { character: "ア", romanji: "a", meaning: "a sound" },
      { character: "イ", romanji: "i", meaning: "i sound" },
      { character: "ウ", romanji: "u", meaning: "u sound" },
      { character: "エ", romanji: "e", meaning: "e sound" },
      { character: "オ", romanji: "o", meaning: "o sound" },
      { character: "カ", romanji: "ka", meaning: "ka sound" },
      { character: "キ", romanji: "ki", meaning: "ki sound" },
      { character: "ク", romanji: "ku", meaning: "ku sound" },
      { character: "ケ", romanji: "ke", meaning: "ke sound" },
      { character: "コ", romanji: "ko", meaning: "ko sound" },
    ];

    const basicKanji = [
      { character: "水", romanji: "mizu", meaning: "water" },
      { character: "火", romanji: "hi", meaning: "fire" },
      { character: "木", romanji: "ki", meaning: "tree/wood" },
      { character: "土", romanji: "tsuchi", meaning: "earth/soil" },
      { character: "金", romanji: "kin", meaning: "gold/money" },
      { character: "人", romanji: "hito", meaning: "person" },
      { character: "大", romanji: "dai", meaning: "big" },
      { character: "小", romanji: "shou", meaning: "small" },
      { character: "山", romanji: "yama", meaning: "mountain" },
      { character: "川", romanji: "kawa", meaning: "river" },
    ];

    hiraganaData.forEach((item, index) => {
      const word: VocabularyWord = {
        id: this.currentVocabId++,
        character: item.character,
        romanji: item.romanji,
        meaning: item.meaning,
        type: "hiragana",
        level: 1,
        audioUrl: null,
      };
      this.vocabulary.set(word.id, word);
    });

    katakanaData.forEach((item, index) => {
      const word: VocabularyWord = {
        id: this.currentVocabId++,
        character: item.character,
        romanji: item.romanji,
        meaning: item.meaning,
        type: "katakana",
        level: 1,
        audioUrl: null,
      };
      this.vocabulary.set(word.id, word);
    });

    basicKanji.forEach((item, index) => {
      const word: VocabularyWord = {
        id: this.currentVocabId++,
        character: item.character,
        romanji: item.romanji,
        meaning: item.meaning,
        type: "kanji",
        level: 2,
        audioUrl: null,
      };
      this.vocabulary.set(word.id, word);
    });
  }

  private initializeCulturalContent() {
    const culturalData = [
      {
        title: "Tea Ceremony",
        description: "Experience the art of traditional Japanese tea preparation",
        imageUrl: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "traditional_art",
        tags: ["tea", "ceremony", "tradition"],
        content: "The Japanese tea ceremony, known as 'chanoyu' or 'sado', is a traditional ritual influenced by Zen Buddhism in which powdered green tea, or matcha, is ceremonially prepared by a skilled practitioner and served to a small group of guests in a tranquil setting."
      },
      {
        title: "Sakura Season",
        description: "The beauty of cherry blossoms across Japan",
        imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "general",
        tags: ["sakura", "spring", "nature"],
        content: "Cherry blossom season, or 'sakura', is one of the most celebrated times in Japan. The ephemeral beauty of the pink and white flowers represents the fleeting nature of life and is deeply embedded in Japanese culture and philosophy."
      },
      {
        title: "Calligraphy Art",
        description: "The elegant art of Japanese writing",
        imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "traditional_art",
        tags: ["calligraphy", "art", "writing"],
        content: "Japanese calligraphy, or 'shodo', is the artistic practice of writing characters with brush and ink. It requires years of practice to master the proper balance, rhythm, and flow of the brush strokes."
      },
      {
        title: "Sushi Culture",
        description: "Discover the art of Japanese cuisine",
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "food_culture",
        tags: ["sushi", "food", "culture"],
        content: "Sushi is much more than just raw fish and rice. It's an art form that requires years of training to master. The preparation involves precise knife skills, understanding of fish quality, and perfect rice preparation."
      },
      {
        title: "Mount Fuji",
        description: "Japan's iconic sacred mountain",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "landmarks",
        tags: ["fuji", "mountain", "landmark"],
        content: "Mount Fuji is Japan's tallest mountain and most enduring symbol. This active volcano has been worshipped as a sacred mountain and serves as a popular subject for artists and poets."
      },
      {
        title: "Zen Gardens",
        description: "Peaceful meditation spaces in Japanese culture",
        imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "traditional_art",
        tags: ["zen", "garden", "meditation"],
        content: "Japanese zen gardens, or 'karesansui', are designed to facilitate meditation. These minimalist landscapes use rocks, gravel, moss, and pruned trees to create peaceful spaces for contemplation."
      },
      {
        title: "Origami Art",
        description: "The ancient art of paper folding",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "traditional_art",
        tags: ["origami", "paper", "art"],
        content: "Origami is the Japanese art of paper folding. The goal is to transform a flat square sheet of paper into a finished sculpture through folding and sculpting techniques, without using cuts or glue."
      },
      {
        title: "Tokyo Lights",
        description: "Modern Japan's vibrant city culture",
        imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "landmarks",
        tags: ["tokyo", "modern", "city"],
        content: "Tokyo represents the modern face of Japan, where traditional culture meets cutting-edge technology. The city's neon-lit streets, especially in areas like Shibuya and Shinjuku, showcase Japan's contemporary urban culture."
      }
    ];

    culturalData.forEach((item) => {
      const content: CulturalContent = {
        id: this.currentCulturalId++,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        category: item.category,
        tags: item.tags,
        content: item.content,
      };
      this.culturalContent.set(content.id, content);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      totalPoints: 0,
      streakDays: 0,
      lastStudyDate: null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.totalPoints = (user.totalPoints || 0) + points;
      this.users.set(userId, user);
    }
  }

  async updateUserStreak(userId: number, streakDays: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.streakDays = streakDays;
      user.lastStudyDate = new Date();
      this.users.set(userId, user);
    }
  }

  // Vocabulary operations
  async getAllVocabulary(): Promise<VocabularyWord[]> {
    return Array.from(this.vocabulary.values());
  }

  async getVocabularyByType(type: string): Promise<VocabularyWord[]> {
    return Array.from(this.vocabulary.values()).filter(word => word.type === type);
  }

  async getVocabularyByLevel(level: number): Promise<VocabularyWord[]> {
    return Array.from(this.vocabulary.values()).filter(word => word.level === level);
  }

  async getRandomVocabulary(type: string, count: number): Promise<VocabularyWord[]> {
    const typeWords = await this.getVocabularyByType(type);
    const shuffled = typeWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Progress operations
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId);
  }

  async getUserProgressByType(userId: number, type: string): Promise<UserProgress[]> {
    const userProgress = await this.getUserProgress(userId);
    const typeWords = await this.getVocabularyByType(type);
    const typeWordIds = new Set(typeWords.map(w => w.id));
    return userProgress.filter(p => typeWordIds.has(p.wordId));
  }

  async updateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existing = Array.from(this.progress.values()).find(
      p => p.userId === insertProgress.userId && p.wordId === insertProgress.wordId
    );

    if (existing) {
      const updated: UserProgress = {
        ...existing,
        correct: insertProgress.correct,
        incorrect: insertProgress.incorrect,
        lastReviewed: new Date(),
        masteryLevel: insertProgress.masteryLevel,
      };
      this.progress.set(existing.id, updated);
      return updated;
    } else {
      const newProgress: UserProgress = {
        ...insertProgress,
        id: this.currentProgressId++,
        lastReviewed: new Date(),
      };
      this.progress.set(newProgress.id, newProgress);
      return newProgress;
    }
  }

  async getUserStats(userId: number): Promise<{
    totalWords: number;
    masteredWords: number;
    accuracy: number;
    streakDays: number;
    totalPoints: number;
  }> {
    const user = await this.getUser(userId);
    const userProgress = await this.getUserProgress(userId);
    
    const totalWords = userProgress.length;
    const masteredWords = userProgress.filter(p => p.masteryLevel >= 4).length;
    const totalAttempts = userProgress.reduce((sum, p) => sum + p.correct + p.incorrect, 0);
    const totalCorrect = userProgress.reduce((sum, p) => sum + p.correct, 0);
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    return {
      totalWords,
      masteredWords,
      accuracy: Math.round(accuracy),
      streakDays: user?.streakDays || 0,
      totalPoints: user?.totalPoints || 0,
    };
  }

  // Quiz operations
  async saveQuizResult(insertQuiz: InsertQuiz): Promise<Quiz> {
    const quiz: Quiz = {
      ...insertQuiz,
      id: this.currentQuizId++,
      completedAt: new Date(),
    };
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  async getUserQuizHistory(userId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values())
      .filter(q => q.userId === userId)
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());
  }

  // Game operations
  async saveGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const score: GameScore = {
      ...insertScore,
      id: this.currentGameScoreId++,
      playedAt: new Date(),
    };
    this.gameScores.set(score.id, score);
    return score;
  }

  async getUserGameScores(userId: number, gameType: string): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(s => s.userId === userId && s.gameType === gameType)
      .sort((a, b) => b.score - a.score);
  }

  async getLeaderboard(gameType: string, limit: number): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(s => s.gameType === gameType)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Achievement operations
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime());
  }

  async addAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      ...insertAchievement,
      id: this.currentAchievementId++,
      unlockedAt: new Date(),
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  // Cultural content operations
  async getAllCulturalContent(): Promise<CulturalContent[]> {
    return Array.from(this.culturalContent.values());
  }

  async getCulturalContentByCategory(category: string): Promise<CulturalContent[]> {
    return Array.from(this.culturalContent.values()).filter(c => c.category === category);
  }

  // Chat operations
  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      ...insertMessage,
      id: this.currentChatId++,
      timestamp: new Date(),
    };
    this.chatMessages.set(message.id, message);
    return message;
  }

  async getUserChatHistory(userId: number, limit: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
