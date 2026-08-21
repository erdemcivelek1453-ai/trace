// ==========================================
// TRACE MVP v1.0 - CORE DOMAIN TYPES
// ==========================================

// --- RETRIEVAL & QUERY TYPES ---

export type QueryIntent = |
  'timeline_summary' |
  'location_history' |
  'people_frequency' |
  'day_recall' |
  'memory_search';

export interface QueryLocation {
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number | null;
}

export interface QueryDateRange {
  from: string | null; // ISO Date String
  to: string | null; // ISO Date String
}

export interface QueryParsedResult {
  originalQuestion: string;
  normalizedQuestion: string;
  intent: QueryIntent;
  dateRange: QueryDateRange;
  location: QueryLocation;
  entities: string[];
  keywords: string[];
  limit: number;
  semanticQuery: string;
}

export interface RetrievalCandidate {
  memoryEventId: number;
  memoryEvent: {
    id: number;
    publicId: string;
    type: string;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    timezone: string;
    locationName: string | null;
    latitude: number | null;
    longitude: number | null;
    importanceScore: number;
    confidenceScore: number;
    sourceCount: number;
    photoCount: number;
    calendarEventCount: number;
    sourceTypes: string[];
    ocrText: string | null;
    searchableText: string;
  };
  semanticScore: number;
  textScore: number;
  dateScore: number;
  locationScore: number;
  finalScore: number;
}

// --- AI CONTRACT TYPES ---

export interface AIResponseMemoryRef {
  memoryId: string;
  relevance: number;
  reason: string;
}

export interface AIResponseContract {
  answer: string;
  confidence: number;
  memoryRefs: AIResponseMemoryRef[];
  uncertainties: string[];
  generatedAt: string;
}

// --- SYNC & SECURITY TYPES ---

export interface EncryptedPayload {
  version: number;
  algorithm: 'AES-256-GCM';
  keyId: string;
  nonce: string; // Base64
  ciphertext: string; // Base64
  authTag: string; // Base64
  contentHash: string; // SHA-256
  encryptedAt: string; // ISO Date String
}