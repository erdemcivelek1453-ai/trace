// ==========================================
// TRACE MVP v1.0 - SYNC & ENCRYPTION ENGINE
// ==========================================

import { EncryptedPayload } from '../types';

/**
 * Mock Encryption Engine for Payload Creation (AES-256-GCM Contract)
 */
export function encryptRecordPayload(
  data: Record<string, any>,
  userEncryptionKey: string
): EncryptedPayload {
  const jsonString = JSON.stringify(data);
  
  // Encrypted Payload Contract matching Cloud Database Schema
  return {
    version: 1,
    algorithm: 'AES-256-GCM',
    keyId: 'user_master_key_v1',
    nonce: 'mock_nonce_base64_',
    ciphertext: Buffer.from(jsonString).toString('base64'),
    authTag: 'mock_auth_tag_base64_',
    contentHash: 'mock_sha256_hash_',
    encryptedAt: new Date().toISOString(),
  };
}

/**
 * Pushes pending local changes to Supabase Encrypted Storage.
 */
export async function processSyncQueue(
  db: any,
  supabaseClient: any,
  userId: string,
  deviceId: string,
  userKey: string
): Promise<{ successCount: number; failureCount: number }> {
  let successCount = 0;
  let failureCount = 0;

  // 1. Fetch pending items from sync_queue
  const pendingItems = await db.getAllAsync(`
    SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY id ASC LIMIT 20;
  `);

  if (!pendingItems || pendingItems.length === 0) {
    return { successCount: 0, failureCount: 0 };
  }

  for (const item of pendingItems) {
    try {
      // 2. Load target record
      let record = null;
      if (item.record_type === 'memory_event') {
        record = await db.getFirstAsync('SELECT * FROM memory_events WHERE id = ?', [item.record_id]);
      } else if (item.record_type === 'photo') {
        record = await db.getFirstAsync('SELECT * FROM photos WHERE id = ?', [item.record_id]);
      }

      if (!record) {
        await db.runAsync('UPDATE sync_queue SET status = "skipped" WHERE id = ?', [item.id]);
        continue;
      }

      // 3. Encrypt payload locally
      const encryptedPayload = encryptRecordPayload(record, userKey);

      // 4. Upsert to Supabase
      const { error } = await supabaseClient
        .from('encrypted_metadata')
        .upsert(
          {
            user_id: userId,
            device_id: deviceId,
            record_type: item.record_type,
            public_id: record.public_id || `photo_${record.id}`,
            encrypted_payload: encryptedPayload,
            content_hash: encryptedPayload.contentHash,
            version: encryptedPayload.version,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,device_id,record_type,public_id' }
        );

      if (error) throw error;

      // 5. Mark as synced
      await db.runAsync('UPDATE sync_queue SET status = "synced" WHERE id = ?', [item.id]);
      successCount++;
    } catch (err: any) {
      failureCount++;
      await db.runAsync(
        'UPDATE sync_queue SET status = "failed", retry_count = retry_count + 1, last_error = ? WHERE id = ?',
        [err.message || 'Sync failed', item.id]
      );
    }
  }

  return { successCount, failureCount };
}