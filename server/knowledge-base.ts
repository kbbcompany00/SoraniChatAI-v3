// This file provides a knowledge base for specific queries about the Qala Non-Governmental Institute
// It contains information to respond to specific inquiries while maintaining Kurdish language support

interface KnowledgeEntry {
  patterns: string[];
  response: string;
  links?: string[];
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
      "خوێندنی قەڵا"
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
export function findMatchingKnowledge(message: string): KnowledgeEntry | undefined {
  const normalizedMessage = message.trim().toLowerCase();
  
  // Check each entry in the knowledge base
  for (const entry of qalaInstitute) {
    // If any pattern matches the message, return this entry
    if (entry.patterns.some(pattern => normalizedMessage.includes(pattern.toLowerCase()))) {
      return entry;
    }
  }
  
  return undefined;
}