// ==========================================
// TRACE MVP v1.0 - INGESTION SERVICE
// ==========================================

export interface RawPhotoInput {
  localUri: string;
  takenAt: string;
  latitude ? : number | null;
  longitude ? : number | null;
  width ? : number;
  height ? : number;
  ocrText ? : string | null;
}

export interface RawCalendarInput {
  externalCalendarId: string;
  title: string;
  description ? : string | null;
  startAt: string;
  endAt: string;
  locationName ? : string | null;
}

/**
 * Generates a unique public identifier for memory events.
 */
function generatePublicId(): string {
  return 'mem_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Ingests a photo and converts it into a local memory event.
 */
export async function ingestPhoto(db: any, photo: RawPhotoInput): Promise < number > {
  const publicId = generatePublicId();
  const searchableText = `${photo.ocrText || ''} photo image media`.trim();
  
  // 1. Insert Memory Event
  const result = await db.runAsync(
    `INSERT INTO memory_events (
      public_id, type, title, description, start_at, latitude, longitude,
      source_count, photo_count, source_types, ocr_text, searchable_text
    ) VALUES (?, 'photo', ?, ?, ?, ?, ?, 1, 1, '["photo"]', ?, ?)`,
    [
      publicId,
      'Fotoğraf Anısı',
      photo.ocrText ? `OCR: ${photo.ocrText.substring(0, 50)}...` : 'Görsel içerik',
      photo.takenAt,
      photo.latitude || null,
      photo.longitude || null,
      photo.ocrText || null,
      searchableText,
    ]
  );
  
  const memoryEventId = result.lastInsertRowId;
  
  // 2. Link Photo
  await db.runAsync(
    `INSERT INTO photos (
      local_uri, memory_event_id, taken_at, latitude, longitude, width, height, ocr_text, ocr_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      photo.localUri,
      memoryEventId,
      photo.takenAt,
      photo.latitude || null,
      photo.longitude || null,
      photo.width || null,
      photo.height || null,
      photo.ocrText || null,
      photo.ocrText ? 'completed' : 'pending',
    ]
  );
  
  return memoryEventId;
}

/**
 * Ingests a calendar event and links/creates a memory event.
 */
export async function ingestCalendarEvent(db: any, cal: RawCalendarInput): Promise < number > {
  const publicId = generatePublicId();
  const searchableText = `${cal.title} ${cal.description || ''} ${cal.locationName || ''}`.trim();
  
  const result = await db.runAsync(
    `INSERT INTO memory_events (
      public_id, type, title, description, start_at, end_at, location_name,
      source_count, calendar_event_count, source_types, searchable_text
    ) VALUES (?, 'calendar', ?, ?, ?, ?, ?, 1, 1, '["calendar"]', ?)`,
    [
      publicId,
      cal.title,
      cal.description || null,
      cal.startAt,
      cal.endAt,
      cal.locationName || null,
      searchableText,
    ]
  );
  
  const memoryEventId = result.lastInsertRowId;
  
  await db.runAsync(
    `INSERT INTO calendar_events (
      external_calendar_id, memory_event_id, title, description, start_at, end_at, location_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      cal.externalCalendarId,
      memoryEventId,
      cal.title,
      cal.description || null,
      cal.startAt,
      cal.endAt,
      cal.locationName || null,
    ]
  );
  
  return memoryEventId;
}