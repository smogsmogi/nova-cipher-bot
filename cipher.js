// Тот же алфавит, что в cipher.py: одна русская буква → один декоративный символ.
const ALPHABET = {
  "А": ["Å", "Δ", "Ⱥ"],
  "Б": ["Ђ", "Ɓ", "ß"],
  "В": ["В", "Ʋ"],
  "Г": ["Ґ", "Ǥ"],
  "Д": ["Д", "Đ"],
  "Е": ["Σ", "Ę", "Ξ"],
  "Ё": ["Ë", "Ё"],
  "Ж": ["Ж", "Җ", "Ƶ"],
  "З": ["3", "Ʒ", "Ȥ"],
  "И": ["И", "Ι"],
  "Й": ["Ӣ", "Ĭ"],
  "К": ["Ҝ", "Ƙ", "₭"],
  "Л": ["Ӆ", "L", "Λ"],
  "М": ["М", "M"],
  "Н": ["Н", "H"],
  "О": ["Ø", "Ѻ", "⊘"],
  "П": ["П", "Ƥ"],
  "Р": ["ᑭ", "Ʀ", "Р"],
  "С": ["С", "Ϲ"],
  "Т": ["Ţ", "Ŧ", "T"],
  "У": ["Ⴘ", "Y"],
  "Ф": ["Ƒ", "Ф"],
  "Х": ["Ҳ", "X"],
  "Ц": ["Џ", "Ц"],
  "Ч": ["Ⴗ", "Ч"],
  "Ш": ["Ш", "Ʃ"],
  "Щ": ["Щ", "Ŝ"],
  "Ъ": ["Ъ"],
  "Ы": ["Ы", "Ỿ"],
  "Ь": ["ᕊ", "Ь"],
  "Э": ["Є", "Э"],
  "Ю": ["Ю"],
  "Я": ["Я", "Ƴ"],
};

const REVERSE = Object.fromEntries(
  Object.entries(ALPHABET).flatMap(([letter, symbols]) =>
    symbols.map((symbol) => [symbol, letter])
  )
);

function encrypt(text) {
  let result = "";
  for (const character of text) {
    const variants = ALPHABET[character.toUpperCase()];
    result += variants
      ? variants[Math.floor(Math.random() * variants.length)]
      : character;
  }
  return result;
}

function decrypt(text) {
  let result = "";
  for (const character of text) {
    result += REVERSE[character] ?? character;
  }
  return result;
}
