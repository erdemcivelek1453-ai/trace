// ==========================================
// TRACE MVP v1.0 - 4-WEIGHT HYBRID SEARCH
// ==========================================

import { QueryParsedResult, RetrievalCandidate } from '../types';
import { searchFTS } from './vectorStore';

export interface HybridSearchWeights {
  semantic: number; // Default: 0.40
  text: number;     // Default: 0.20
  date: number;     // Default: 0.20
  location: number; // Default: 0.20
}

const DEFAULT_WEIGHTS: HybridSearchWeights = {
  semantic: 0.40,
  text: 0.20,
  date: 0.20,
  location: 0.20,
};

/**
 * Calculates Haversine distance in kilometers.
 */
function calculateHaversineDistance(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Evaluates candidates based on parsed query context.
 */
export async function executeHybridSearch(
  db: any,
  parsedQuery: QueryParsedResult,
  customWeights: Partial<HybridSearchWeights> = {}
): Promise<RetrievalCandidate[]> {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // 1. Fetch Candidates via SQL / FTS
  const ftsResults = await searchFTS(db, parsedQuery.semanticQuery, 30);
  const ftsMap = new Map<number, number>();
  ftsResults.forEach((item) => ftsMap.set(item.id, item.rank));

  const allMemories = await db.getAllAsync(`
    SELECT * FROM memory_events ORDER BY start_at DESC LIMIT 100;
  `);

  if (!allMemories || allMemories.length === 0) return [];

  const candidates: RetrievalCandidate[] = [];

  for (const raw of allMemories) {
    // 2. Compute Text Score (Normalized FTS rank)
    const rawRank = ftsMap.get(raw.id);
    const textScore = rawRank ? Math.min(1.0, 1.0 / (1.0 + rawRank)) : 0.0;

    // 3. Compute Semantic Score (Mock vector similarity/fallback)
    const semanticScore = textScore > 0 ? textScore * 0.9 : 0.1;

    // 4. Compute Date Score
    let dateScore = 0.5;
    if (parsedQuery.dateRange.from && parsedQuery.dateRange.to) {
      const eventDate = new Date(raw.start_at).getTime();
      const fromDate = new Date(parsedQuery.dateRange.from).getTime();
      const toDate = new Date(parsedQuery.dateRange.to).getTime();

      if (eventDate >= fromDate && eventDate <= toDate) {
        dateScore = 1.0;
      } else {
        const daysDiff = Math.abs(eventDate - fromDate) / (1000 * 3600 * 24);
        dateScore = Math.max(0.0, 1.0 - daysDiff / 30);
      }
    }

    // 5. Compute Location Score
    let locationScore = 0.5;
    if (
      parsedQuery.location.latitude !== null &&
      parsedQuery.location.longitude !== null &&
      raw.latitude !== null &&
      raw.longitude !== null
    ) {
      const distanceKm = calculateHaversineDistance(
        parsedQuery.location.latitude,
        parsedQuery.location.longitude,
        raw.latitude,
        raw.longitude
      );
      const radiusKm = (parsedQuery.location.radiusMeters || 5000) / 1000;
      locationScore = distanceKm <= radiusKm ? 1.0 : Math.max(0, 1.0 - distanceKm / 50);
    }

    // 6. Weighted Final Score Computation
    const finalScore =
      semanticScore * weights.semantic +
      textScore * weights.text +
      dateScore * weights.date +
      locationScore * weights.location;

    candidates.push({
      memoryEventId: raw.id,
      memoryEvent: {
        id: raw.id,
        publicId: raw.public_id,
        type: raw.type,
        title: raw.title,
        description: raw.description,
        startAt: raw.start_at,
        endAt: raw.end_at,
        timezone: raw.timezone,
        locationName: raw.location_name,
        latitude: raw.latitude,
        longitude: raw.longitude,
        importanceScore: raw.importance_score,
        confidenceScore: raw.confidence_score,
        sourceCount: raw.source_count,
        photoCount: raw.photo_count,
        calendarEventCount: raw.calendar_event_count,
        sourceTypes: JSON.parse(raw.source_types || '[]'),
        ocrText: raw.ocr_text,
        searchableText: raw.searchable_text,
      },
      semanticScore,
      textScore,
      dateScore,
      locationScore,
      finalScore,
    });
  }

  // Sort candidates by highest score
  return candidates
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, parsedQuery.limit || 10);
}