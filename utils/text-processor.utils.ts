import { ATSAnalysis } from '../types/cover-letter.types';

const COMMON_WORDS = new Set([
  'with', 'that', 'this', 'from', 'they', 'will', 'have', 'your', 'more', 'about',
  'when', 'which', 'their', 'what', 'some', 'would', 'there', 'other', 'these',
  'could', 'should', 'where', 'those', 'while', 'after', 'before', 'during'
]);

export function extractKeywords(text: string): string[] {
  if (!text) return [];

  // Convert to lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words and filter
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length >= 4 && !COMMON_WORDS.has(word));
  
  // Count frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });
  
  // Sort by frequency and return top 20
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

export function analyzeATSCompatibility(text: string, keywords: string[]): ATSAnalysis {
  if (!text) {
    return {
      score: 0,
      keywordScore: 0,
      formattingScore: 0,
      missingKeywords: keywords,
      recommendations: ['No text provided for analysis']
    };
  }

  const textLower = text.toLowerCase();
  
  // Check keyword inclusion
  const keywordPresence = keywords.map(keyword => ({
    keyword,
    present: textLower.includes(keyword.toLowerCase())
  }));
  
  const missingKeywords = keywordPresence
    .filter(k => !k.present)
    .map(k => k.keyword);
  
  // Check for formatting issues
  const hasWeirdCharacters = /[^\w\s.,;:?!()"'-]/.test(text);
  const hasExcessiveFormatting = (text.match(/\n\n\n+/g) || []).length > 0;
  
  // Calculate scores
  const keywordScore = (keywordPresence.filter(k => k.present).length / keywords.length) * 100;
  const formattingScore = (hasWeirdCharacters || hasExcessiveFormatting) ? 70 : 100;
  const overallScore = Math.round((keywordScore * 0.7) + (formattingScore * 0.3));
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Consider including these keywords: ${missingKeywords.join(', ')}`);
  }
  
  if (hasWeirdCharacters) {
    recommendations.push('Remove special characters that may confuse ATS systems.');
  }
  
  if (hasExcessiveFormatting) {
    recommendations.push('Simplify formatting to ensure ATS readability.');
  }
  
  if (text.length < 200) {
    recommendations.push('Consider adding more detail to your cover letter.');
  }
  
  if (text.length > 1000) {
    recommendations.push('Consider making your cover letter more concise.');
  }
  
  return {
    score: overallScore,
    keywordScore,
    formattingScore,
    missingKeywords,
    recommendations
  };
}

export function estimateTokenUsage(text: string): number {
  // Simple estimation: approximately 4 characters per token
  // This is a rough estimate and may not be exact
  return Math.ceil(text.length / 4);
} 