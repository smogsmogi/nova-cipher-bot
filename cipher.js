// Тот же алфавит, что в cipher.py: одна русская буква → один декоративный символ.
const ALPHABET = {
  "А": ["Å", "Δ", "Ⱥ", "А"],
  "Б": ["ƃ", "Ђ"],
  "В": ["В", "ß"],
  "Г": ["Ґ", "Г"],
  "Д": ["Д", "Đ"],
  "Е": ["Σ", "Ę", "Ξ"],
  "Ё": ["Ë", "Ё"],
  "Ж": ["Ж", "Җ"],
  "З": ["3", "Ʒ", "Ȥ", "Ƶ"],
  "И": ["И", "N"],
  "Й": ["Ӣ", "Ӣ", "Ū"],
  "К": ["Ҝ", "Ƙ", "₭"],
  "Л": ["Ӆ", "Λ", "Л"],
  "М": ["М", "M"],
  "Н": ["Н", "H"],
  "О": ["Ø", "Ѻ", "⊘"],
  "П": ["П"],
  "Р": ["ᑭ", "Р"],
  "С": ["С", "Ϲ"],
  "Т": ["Ţ", "Ŧ", "T", "卞"],
  "У": ["Ⴘ", "Y", "Ÿ", "Ⴤ"],
  "Ф": ["Ф"],
  "Х": ["Ҳ", "X"],
  "Ц": ["Џ", "Ц"],
  "Ч": ["Ⴗ", "Ч"],
  "Ш": ["Ш"],
  "Щ": ["Щ"],
  "Ъ": ["Ъ"],
  "Ы": ["Ы"],
  "Ь": ["ᕊ", "Ь"],
  "Э": ["Є", "Э"],
  "Ю": ["Ю"],
  "Я": ["Я"],
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
