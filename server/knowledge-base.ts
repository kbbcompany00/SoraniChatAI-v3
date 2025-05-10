// This file provides a knowledge base for specific queries about the Qala Non-Governmental Institute
// It contains information to respond to specific inquiries while maintaining Kurdish language support
import { 
  patternMatchCache, 
  patternMap, 
  regexCache, 
  indexPatterns, 
  tokenize, 
  prefetchCache
} from './performance';

export interface KnowledgeEntry {
  patterns: string[];
  response: string;
  links?: string[];
  priority?: number; // Higher number = higher priority for multiple matches
}

// Knowledge base about Qala Non-Governmental Institute
export const qalaInstitute: KnowledgeEntry[] = [
  {
    patterns: [
      "پەیمانگای قەڵای ناحکومی",
      "پەیمانگەی قەڵای ناحکومی",
      "قەڵای ناحکومی",
      "پەیمانگەی قەڵا",
      "پەیمانگای قەڵا",
      "قەڵا",
      "پەیمانگە",
      "ناحکومی",
      "زانیاری قەڵا",
      "قەڵا چییە",
      "دەربارەی پەیمانگەی قەڵا",
      "دەربارەی قەڵا",
      "زانیاری پەیمانگە",
    ],
    response: `✔️پەیمانگەی قـەڵای ناحکومی؛ یەکەم و باشترین و چالاکترین پەیمانگەی ئەهلییە لە سنووری ئیدارەی گەرمیانداو بەشەکانی:
✅ کـارگێڕی و ژمێریاری
✅ گازو پێتڕۆڵ(نـەوت)
✅ کـۆمپیوتـەری هەیە.

هەلی خوێندن بەدەستبێنن لە پەیمانگەی قـەڵای ناحکومی.

بۆ ئەوەی ببنە یەکێک لە خوێندکارانی پەیمانگەکەمان، تەنھا بڕوانامەی 9ی بنەڕەتیتان پێویستە! هەرئێستا سەردانمان بکەن و ناوتان تۆمار بکەن بۆ ئەوەی کورسیەکی خوێندن حجز بکەن.

پەیمانگەی قەڵا؛ بەبێ مەرجی تەمەن و نمرە سەرجەم دەرچووانی ٣ی ناوەندی(٩ی بنەڕەتی)و (١٠، ١١، ١٢)ی ئامادەیی وەردەگرێت و بڕوانامەی دبلۆمی باوەڕپێکراوی وەزارەتی پەروەردەی حکومەتی ھەرێمی کوردستانیان پێدەبەخشێت.
√ کرێی خوێندن بە 6قیست وەردەگیرێت دوای داشکاندن.
√ باڵەخانەی پەیمانگەی قەڵا مۆدێرن و سەردەمیانەیە.

⏰کاتژمێر ٩ی بەیانی تا ٧ی ئێوارەی هەموو ڕۆژێک دەرگای پەیمانگەکەمان کراوەیەو پێشوازیتان لێدەکەین⬇️

☎️07705009002
☎️07702438095
☎️07701925836
🌍 پەیمانگەی قـەڵاـی ناحکومی
کەلار ـ تەنیشت شاری پزیشکی گەرمیان`,
    links: [
      "https://www.facebook.com/share/1AH7TPx4T6/"
    ]
  },
  {
    patterns: [
      "بەشەکانی پەیمانگە", 
      "بەشەکانی قەڵا",
      "خوێندن لە قەڵا",
      "خوێندنی قەڵا",
      "بەشەکان",
      "خوێندن چی هەیە",
      "خوێندنی چی هەیە",
      "بەشەکانی پەیمانگا",
      "بەشەکانی خوێندن",
      "دەتوانم چی بخوێنم"
    ],
    response: `پەیمانگەی قـەڵای ناحکومی ئەم بەشانەی هەیە:
✅ کـارگێڕی و ژمێریاری
✅ گازو پێتڕۆڵ(نـەوت)
✅ کـۆمپیوتـەر

ناونووسی کراوەیە بۆ وەرگرتنی خوێندکاران! تەنها بڕوانامەی ٩ی بنەڕەتی پێویستە.`
  },
  {
    patterns: [
      "پەیوەندی",
      "تەلەفۆن", 
      "ژمارەی پەیوەندی",
      "ژمارەی مۆبایل قەڵا",
      "تەلەفۆنی قەڵا"
    ],
    response: `بۆ پەیوەندیکردن بە پەیمانگەی قەڵای ناحکومی:

☎️07705009002
☎️07702438095
☎️07701925836

🌍 ناونیشان: کەلار ـ تەنیشت شاری پزیشکی گەرمیان`
  },
  {
    patterns: [
      "کاتی دەوام",
      "کاتژمێری دەوام",
      "کەی کراوەیە"
    ],
    response: `⏰کاتژمێر ٩ی بەیانی تا ٧ی ئێوارەی هەموو ڕۆژێک دەرگای پەیمانگەکەمان کراوەیەو پێشوازیتان لێدەکەین`
  },
  {
    patterns: [
      "کرێی خوێندن",
      "پارەی خوێندن",
      "نرخی خوێندن"
    ],
    response: `کرێی خوێندن لە پەیمانگەی قەڵای ناحکومی بە ٦ قیست وەردەگیرێت دوای داشکاندن.

بۆ زانیاری زیاتر دەربارەی نرخەکان، تکایە پەیوەندی بکەن بە:
☎️07705009002
☎️07702438095
☎️07701925836`
  },
  {
    patterns: [
      "شوێن",
      "ناونیشان",
      "لە کوێیە",
      "ئەدرەس"
    ],
    response: `🌍 پەیمانگەی قـەڵاـی ناحکومی
کەلار ـ تەنیشت شاری پزیشکی گەرمیان`
  },
  {
    patterns: [
      "کۆمپیوتەر",
      "بەشی کۆمپیوتەر",
      "خوێندنی کۆمپیوتەر",
      "زانیاری بەشی کۆمپیوتەر",
      "ای تی",
      "IT",
      "کۆمپیوتەر چییە"
    ],
    response: `بەشی کۆمپیوتەر لە پەیمانگەی قەڵای ناحکومی:

✅ بەشی کۆمپیوتەر لە پەیمانگەی قەڵا دەرفەتێکی باشە بۆ فێربوونی تەکنەلۆجیای سەردەم.
✅ خوێندکاران فێری پڕۆگرامینگ، نێتۆرک، وێبسایت، هاردوێر، و سۆفتوێر دەبن.
✅ بڕوانامەی دبلۆمی باوەڕپێکراوی وەزارەتی پەروەردەی هەرێمی کوردستان بەدەست دەهێنن.

بۆ زانیاری زیاتر پەیوەندی بکەن بە:
☎️07705009002
`
  },
  {
    patterns: [
      "ژمێریاری",
      "کارگێری",
      "کارگێڕی",
      "بەشی کارگێڕی",
      "بەشی ژمێریاری",
      "خوێندنی کارگێڕی",
      "خوێندنی ژمێریاری",
      "ئیدارە"
    ],
    response: `بەشی کارگێڕی و ژمێریاری لە پەیمانگەی قەڵای ناحکومی:

✅ بەشی کارگێڕی و ژمێریاری دەرفەتێکی گرنگە بۆ فێربوونی بەڕێوەبردن و دارایی.
✅ خوێندکاران فێری سیستەمی ژمێریاری، بەڕێوەبردنی دارایی، پلاندانانی کارگێڕی و چەندین بابەتی گرنگی تر دەبن.
✅ بڕوانامەی دبلۆمی باوەڕپێکراوی وەزارەتی پەروەردەی هەرێمی کوردستان بەدەست دەهێنن.

بۆ زانیاری زیاتر پەیوەندی بکەن بە:
☎️07705009002
`
  },
  {
    patterns: [
      "نەوت",
      "پیترۆڵ", 
      "پێتڕۆڵ",
      "گاز",
      "بەشی نەوت",
      "بەشی گاز",
      "بەشی پێتڕۆڵ",
      "خوێندنی نەوت"
    ],
    response: `بەشی گاز و پێتڕۆڵ (نەوت) لە پەیمانگەی قەڵای ناحکومی:

✅ بەشی گاز و پێتڕۆڵ یەکێکە لە بەشە گرنگەکانی پەیمانگەی قەڵا.
✅ خوێندکاران فێری تەکنەلۆجیای نەوت و گاز، دۆزینەوە، بەرهەمهێنان و چەندین بابەتی پەیوەندیدار دەبن.
✅ بڕوانامەی دبلۆمی باوەڕپێکراوی وەزارەتی پەروەردەی هەرێمی کوردستان بەدەست دەهێنن.

بۆ زانیاری زیاتر پەیوەندی بکەن بە:
☎️07705009002
`
  },
  {
    patterns: [
      "مەرجەکانی وەرگرتن",
      "پێداویستیەکانی وەرگرتن",
      "چۆن وەردەگیرێم"
    ],
    response: `مەرجەکانی وەرگرتن لە پەیمانگەی قەڵای ناحکومی:

پەیمانگەی قەڵا؛ بەبێ مەرجی تەمەن و نمرە سەرجەم دەرچووانی ٣ی ناوەندی(٩ی بنەڕەتی)و (١٠، ١١، ١٢)ی ئامادەیی وەردەگرێت و بڕوانامەی دبلۆمی باوەڕپێکراوی وەزارەتی پەروەردەی حکومەتی ھەرێمی کوردستانیان پێدەبەخشێت.

تەنها بڕوانامەی ٩ی بنەڕەتیتان پێویستە!`
  },
  {
    patterns: [
      "فەیسبووک",
      "سۆشیال میدیا",
      "لینک",
      "پەیج"
    ],
    response: `پەڕەی فەیسبووکی پەیمانگەی قەڵا:
https://www.facebook.com/share/1AH7TPx4T6/`
  }
];

/**
 * Checks if the user message contains any of the patterns from the knowledge base
 * @param message User message to check
 * @returns The matching knowledge entry or undefined if no match found
 */
/**
 * Normalize Kurdish text to improve pattern matching
 * This handles common variations in Kurdish spelling and characters
 */
function normalizeKurdishText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    // Normalize some common Kurdish character variations
    .replace(/ه‌/g, 'ە')
    .replace(/ھ/g, 'ە')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک');
}

// Initialize the performance optimization system on module load
(function initializeKnowledgeOptimizations() {
  // Index all patterns for fast lookup
  indexPatterns(qalaInstitute);
  
  // Preload the most common queries into the prefetch cache
  qalaInstitute.forEach((entry) => {
    // For each entry, take the first pattern as the canonical form
    if (entry.patterns.length > 0) {
      prefetchCache.set(normalizeKurdishText(entry.patterns[0]), entry);
    }
  });
  
  console.log(`Optimized ${qalaInstitute.length} knowledge entries with ${patternMap.size} indexed patterns`);
})();

/**
 * Ultra-fast knowledge matching system with caching
 * @param message User message to check
 * @returns The matching knowledge entry or undefined if no match found
 */
export function findMatchingKnowledge(message: string): KnowledgeEntry | undefined {
  const normalizedMessage = normalizeKurdishText(message);
  
  // First check pattern cache for exact matches (fastest path)
  const cachedResult = patternMatchCache.get(normalizedMessage);
  if (cachedResult !== undefined) {
    return cachedResult || undefined; // Convert null to undefined if no match was previously found
  }
  
  // Try prefetch cache for common queries
  const prefetchedResult = prefetchCache.get(normalizedMessage);
  if (prefetchedResult) {
    patternMatchCache.set(normalizedMessage, prefetchedResult);
    return prefetchedResult;
  }
  
  // For very short queries, try direct pattern map lookup (O(1))
  const messageTokens = tokenize(normalizedMessage);
  if (messageTokens.length === 1) {
    const token = messageTokens[0];
    const matchingIndices = patternMap.get(token);
    if (matchingIndices && matchingIndices.length > 0) {
      // If multiple matches, return the one with highest priority or first one
      let bestMatch = qalaInstitute[matchingIndices[0]];
      for (let i = 1; i < matchingIndices.length; i++) {
        const currentEntry = qalaInstitute[matchingIndices[i]];
        if ((currentEntry.priority || 0) > (bestMatch.priority || 0)) {
          bestMatch = currentEntry;
        }
      }
      patternMatchCache.set(normalizedMessage, bestMatch);
      return bestMatch;
    }
  }
  
  // Fallback to the original algorithm with some optimizations
  for (const entry of qalaInstitute) {
    // If any pattern matches the message, return this entry
    if (entry.patterns.some(pattern => normalizedMessage.includes(normalizeKurdishText(pattern)))) {
      patternMatchCache.set(normalizedMessage, entry);
      return entry;
    }
  }
  
  // If no direct match is found, check for general mentions of "Qala"
  if (normalizedMessage.includes('قەڵا') || 
      normalizedMessage.includes('قه‌ڵا') || 
      normalizedMessage.includes('قلا') ||
      normalizedMessage.includes('قەلا')) {
    patternMatchCache.set(normalizedMessage, qalaInstitute[0]);
    return qalaInstitute[0]; // Return the general information entry (first entry)
  }
  
  // No match found - cache the negative result to avoid re-processing
  patternMatchCache.set(normalizedMessage, null);
  return undefined;
}