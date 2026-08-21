// ==========================================
// TRACE MVP v1.0 - MEMORY EVENT SYNTHESIS ENGINE
// ==========================================

export interface SynthesisCandidate {
  id: number;
  type: string;
  startAt: string;
  latitude: number | null;
  longitude: number | null;
  title: string;
  ocrText ? : string | null;
}

/**
 * Calculates time difference in minutes between two ISO date strings.
 */
function getMinuteDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1).getTime();
  const d2 = new Date(dateStr2).getTime();
  return Math.abs(d1 - d2) / (1000 * 60);
}

/**
 * Synthesizes raw photos and calendar entries into a unified Memory Event.
 * Cluster Rule: Events within 2 hours AND within 500 meters are grouped together.
 */
export async function synthesizeRawInputsToMemoryEvent(
  db: any,
  rawPhotos: SynthesisCandidate[],
  rawCalendar ? : SynthesisCandidate
): Promise < number | null > {
  if (rawPhotos.length === 0 && !rawCalendar) return null;
  
  // 1. Determine base parameters from calendar or primary photo
  const primarySource = rawCalendar || rawPhotos[0];
  const baseTitle = rawCalendar ?
    rawCalendar.title :
    `Anı: ${new Date(primarySource.startAt).toLocaleDateString('tr-TR')}`;
  
  // 2. Aggregate OCR and text content
  const aggregatedOcr = rawPhotos
    .map((p) => p.ocrText)
    .filter(Boolean)
    .join(' ');
  
  const searchableText = `${baseTitle} ${aggregatedOcr}`.trim();
  const publicId = 'mem_' + Math.random().toString(36).substring(2, 11);
  
  // 3. Create unified Memory Event record
  const result = await db.runAsync(
    `INSERT INTO memory_events (
      public_id, type, title, description, start_at, latitude, longitude,
      source_count, photo_count, calendar_event_count, source_types, ocr_text, searchable_text
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      publicId,
      rawCalendar ? 'hybrid_event' : 'photo_cluster',
      baseTitle,
      rawCalendar ? rawCalendar.title : `${rawPhotos.length} Fotoğraflı Anı Kümesi`,
      primarySource.startAt,
      primarySource.latitude || null,
      primarySource.longitude || null,
      rawPhotos.length + (rawCalendar ? 1 : 0),
      rawPhotos.length,
      rawCalendar ? 1 : 0,
      JSON.stringify(rawCalendar ? ['photo', 'calendar'] : ['photo']),
      aggregatedOcr || null,
      searchableText,
    ]
  );
  
  const newMemoryEventId = result.lastInsertRowId;
  
  // 4. Link associated photos to this single Memory Event
  for (const photo of rawPhotos) {
    await db.runAsync(
      'UPDATE photos SET memory_event_id = ? WHERE id = ?',
      [newMemoryEventId, photo.id]
    );
  }
  
  // 5. Link calendar event if available
  if (rawCalendar) {
    await db.runAsync(
      'UPDATE calendar_events SET memory_event_id = ? WHERE id = ?',
      [newMemoryEventId, rawCalendar.id]
    );
  }
  
  return newMemoryEventId;
}