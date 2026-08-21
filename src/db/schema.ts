// ==========================================
// TRACE MVP v1.0 - LOCAL SQLITE SCHEMA DDL
// ==========================================

export const INITIAL_SCHEMA_SQL = `
-- Enable Foreign Keys
PRAGMA foreign_keys = ON;

-- Memory Events Table
CREATE TABLE IF NOT EXISTS memory_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_at TEXT NOT NULL,
    end_at TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    location_name TEXT,
    latitude REAL,
    longitude REAL,
    importance_score REAL NOT NULL DEFAULT 0.5,
    confidence_score REAL NOT NULL DEFAULT 1.0,
    source_count INTEGER NOT NULL DEFAULT 0,
    photo_count INTEGER NOT NULL DEFAULT 0,
    calendar_event_count INTEGER NOT NULL DEFAULT 0,
    source_types TEXT NOT NULL DEFAULT '[]',
    ocr_text TEXT,
    searchable_text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Photos Table
CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    local_uri TEXT NOT NULL UNIQUE,
    memory_event_id INTEGER REFERENCES memory_events(id) ON DELETE SET NULL,
    taken_at TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    width INTEGER,
    height INTEGER,
    ocr_text TEXT,
    ocr_status TEXT NOT NULL DEFAULT 'pending',
    ocr_processed_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending',
    synced_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_calendar_id TEXT NOT NULL UNIQUE,
    memory_event_id INTEGER REFERENCES memory_events(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_at TEXT NOT NULL,
    end_at TEXT NOT NULL,
    location_name TEXT,
    attendees_hash TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sync Queue Table
CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_type TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    action TEXT NOT NULL, -- 'INSERT' | 'UPDATE' | 'DELETE'
    status TEXT NOT NULL DEFAULT 'pending',
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- FTS5 Full-Text Search Virtual Table
CREATE VIRTUAL TABLE IF NOT EXISTS memory_events_fts USING fts5(
    title,
    description,
    location_name,
    ocr_text,
    searchable_text,
    content='memory_events',
    content_rowid='id'
);

-- FTS Triggers for Auto-Sync
CREATE TRIGGER IF NOT EXISTS memory_events_ai AFTER INSERT ON memory_events BEGIN
    INSERT INTO memory_events_fts(rowid, title, description, location_name, ocr_text, searchable_text)
    VALUES (new.id, new.title, new.description, new.location_name, new.ocr_text, new.searchable_text);
END;

CREATE TRIGGER IF NOT EXISTS memory_events_ad AFTER DELETE ON memory_events BEGIN
    INSERT INTO memory_events_fts(memory_events_fts, rowid, title, description, location_name, ocr_text, searchable_text)
    VALUES('delete', old.id, old.title, old.description, old.location_name, old.ocr_text, old.searchable_text);
END;

CREATE TRIGGER IF NOT EXISTS memory_events_au AFTER UPDATE ON memory_events BEGIN
    INSERT INTO memory_events_fts(memory_events_fts, rowid, title, description, location_name, ocr_text, searchable_text)
    VALUES('delete', old.id, old.title, old.description, old.location_name, old.ocr_text, old.searchable_text);
    INSERT INTO memory_events_fts(rowid, title, description, location_name, ocr_text, searchable_text)
    VALUES (new.id, new.title, new.description, new.location_name, new.ocr_text, new.searchable_text);
END;
`;