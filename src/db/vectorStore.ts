// ==========================================
// TRACE MVP v1.0 - VECTOR & FTS STORE
// ==========================================

import { INITIAL_SCHEMA_SQL } from './schema';

export interface VectorSearchResult {
  memoryEventId: number;
  similarityScore: number;
}

/**
 * Initializes local SQLite tables and FTS5 triggers.
 */
export async function initializeDatabase(db: any): Promise < void > {
  await db.execAsync(INITIAL_SCHEMA_SQL);
}

/**
 * Performs FTS5 BM25 text search across indexed memories.
 */
export async function searchFTS(
  db: any,
  searchTerm: string,
  limit: number = 20
): Promise < Array < { id: number;rank: number } >> {
  if (!searchTerm.trim()) return [];
  
  const query = `
    SELECT rowid as id, bm25(memory_events_fts) as rank
    FROM memory_events_fts
    WHERE memory_events_fts MATCH ?
    ORDER BY rank ASC
    LIMIT ?;
  `;
  
  try {
    const results = await db.getAllAsync(query, [searchTerm, limit]);
    return results.map((row: any) => ({
      id: Number(row.id),
      rank: Math.abs(Number(row.rank)),
    }));
  } catch (error) {
    console.warn('[FTS Search Warning]', error);
    return [];
  }
}

/**
 * Cosine similarity helper for local vector evaluation.
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}