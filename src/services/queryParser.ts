// ==========================================
// TRACE MVP v1.0 - LLM QUERY PARSER
// ==========================================

import { QueryParsedResult, QueryIntent } from '../types';

/**
 * Normalizes text input for deterministic parsing fallback.
 */
export function normalizeQueryText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
}

/**
 * Basic rule-based intent resolution fallback.
 */
function resolveIntentFallback(text: string): QueryIntent {
  const lower = text.toLowerCase();
  if (lower.includes('nerede') || lower.includes('konum') || lower.includes('git')) {
    return 'location_history';
  }
  if (lower.includes('kim') || lower.includes('birlikte') || lower.includes('kisi')) {
    return 'people_frequency';
  }
  if (lower.includes('ozet') || lower.includes('ne yaptim')) {
    return 'timeline_summary';
  }
  if (lower.includes('hatirla') || lower.includes('gun')) {
    return 'day_recall';
  }
  return 'memory_search';
}

/**
 * Parses user input into a structured query contract.
 */
export async function parseUserQuery(
  rawQuery: string,
  llmClient ? : any
): Promise < QueryParsedResult > {
  const normalized = normalizeQueryText(rawQuery);
  
  // Fallback / Standalone parsing logic
  if (!llmClient) {
    return {
      originalQuestion: rawQuery,
      normalizedQuestion: normalized,
      intent: resolveIntentFallback(normalized),
      dateRange: { from: null, to: null },
      location: { name: null, latitude: null, longitude: null, radiusMeters: null },
      entities: [],
      keywords: normalized.split(' ').filter((w) => w.length > 2),
      limit: 10,
      semanticQuery: normalized,
    };
  }
  
  // LLM Structured Output Evaluation
  try {
    const prompt = `Parse the user query into structured retrieval parameters JSON.
User query: "${rawQuery}"`;
    
    const response = await llmClient.complete({ prompt });
    const parsed = JSON.parse(response.text);
    
    return {
      originalQuestion: rawQuery,
      normalizedQuestion: normalized,
      intent: parsed.intent || 'memory_search',
      dateRange: parsed.dateRange || { from: null, to: null },
      location: parsed.location || { name: null, latitude: null, longitude: null, radiusMeters: null },
      entities: parsed.entities || [],
      keywords: parsed.keywords || [],
      limit: parsed.limit || 10,
      semanticQuery: parsed.semanticQuery || normalized,
    };
  } catch (error) {
    console.warn('[QueryParser Warning] LLM parsing failed, falling back to heuristics:', error);
    return {
      originalQuestion: rawQuery,
      normalizedQuestion: normalized,
      intent: resolveIntentFallback(normalized),
      dateRange: { from: null, to: null },
      location: { name: null, latitude: null, longitude: null, radiusMeters: null },
      entities: [],
      keywords: normalized.split(' ').filter((w) => w.length > 2),
      limit: 10,
      semanticQuery: normalized,
    };
  }
}