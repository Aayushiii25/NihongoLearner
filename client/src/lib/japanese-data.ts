export const hiraganaCharacters = [
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
];

export const katakanaCharacters = [
  { character: "ア", romanji: "a", meaning: "a sound" },
  { character: "イ", romanji: "i", meaning: "i sound" },
  { character: "ウ", romanji: "u", meaning: "u sound" },
  { character: "エ", romanji: "e", meaning: "e sound" },
  { character: "オ", romanji: "o", meaning: "o sound" },
];

export const basicKanji = [
  { character: "水", romanji: "mizu", meaning: "water" },
  { character: "火", romanji: "hi", meaning: "fire" },
  { character: "木", romanji: "ki", meaning: "tree/wood" },
  { character: "土", romanji: "tsuchi", meaning: "earth/soil" },
  { character: "金", romanji: "kin", meaning: "gold/money" },
];

export const commonWords = [
  { japanese: "こんにちは", romanji: "konnichiwa", meaning: "hello" },
  { japanese: "ありがとう", romanji: "arigatou", meaning: "thank you" },
  { japanese: "さようなら", romanji: "sayounara", meaning: "goodbye" },
  { japanese: "すみません", romanji: "sumimasen", meaning: "excuse me/sorry" },
  { japanese: "おはよう", romanji: "ohayou", meaning: "good morning" },
];

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}
