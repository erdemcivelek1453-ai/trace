// ==========================================
// TRACE MVP v1.0 - CORE ENTRY POINT
// ==========================================

import { parseUserQuery } from './services/queryParser';
import { executeHybridSearch } from './db/hybridSearch';
import { generateAIReasoning } from './services/aiReasoning';
import { ingestPhoto, ingestCalendarEvent } from './services/ingestionService';
import { processSyncQueue } from './services/syncEngine';
import { synthesizeRawInputsToMemoryEvent } from './services/memoryEventBuilder';

/**
 * Main Trace Pipeline: Orchestrates query execution end-to-end.
 */
export async function handleTraceUserQuery(
  db: any,
  rawQuery: string,
  llmClient ? : any
) {
  // 1. Parse Question Structure & Intent
  const parsedQuery = await parseUserQuery(rawQuery, llmClient);
  
  // 2. Hybrid Retrieval (4-weight)
  const candidateMemories = await executeHybridSearch(db, parsedQuery);
  
  // 3. AI Context Assembly & Response Generation
  const finalResponse = await generateAIReasoning(rawQuery, candidateMemories, llmClient);
  
  return finalResponse;
}

export {
  parseUserQuery,
  executeHybridSearch,
  generateAIReasoning,
  ingestPhoto,
  ingestCalendarEvent,
  processSyncQueue,
  synthesizeRawInputsToMemoryEvent,
};