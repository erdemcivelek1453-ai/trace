// ==========================================
// TRACE MVP v1.0 - AI REASONING ENGINE
// ==========================================

import { RetrievalCandidate, AIResponseContract } from '../types';

/**
 * Builds an anonymized prompt context from memory candidates.
 */
function buildPromptContext(candidates: RetrievalCandidate[]): string {
  if (candidates.length === 0) return 'Bulunan ilgili anı veya kayıt yok.';

  return candidates
    .map((c, index) => {
      const e = c.memoryEvent;
      return `[Anı #${index + 1} | ID: ${e.publicId}]
- Başlık: ${e.title}
- Tarih: ${e.startAt} ${e.endAt ? `- ${e.endAt}` : ''}
- Konum: ${e.locationName || 'Belirtilmemiş'}
- Açıklama/Not: ${e.description || 'Yok'}
- Metin/OCR: ${e.ocrText || 'Yok'}`;
    })
    .join('\n\n');
}

/**
 * Executes final reasoning with strict context referencing.
 */
export async function generateAIReasoning(
  userQuestion: string,
  candidates: RetrievalCandidate[],
  llmClient?: any
): Promise<AIResponseContract> {
  const contextText = buildPromptContext(candidates);

  // Standalone / Fallback logic
  if (!llmClient) {
    if (candidates.length === 0) {
      return {
        answer: 'Sorduğunuz zaman dilimine veya kelimelere ait herhangi bir kayıt bulunamadı.',
        confidence: 0.0,
        memoryRefs: [],
        uncertainties: ['İlgili veritabanı kaydı bulunamadı.'],
        generatedAt: new Date().toISOString(),
      };
    }

    const topMatch = candidates[0].memoryEvent;
    return {
      answer: `Hafızanızdaki kayıtlara göre: "${topMatch.title}" (${topMatch.startAt}) etkinliğini buldum. Konum: ${topMatch.locationName || 'Bilinmiyor'}.`,
      confidence: Math.round(candidates[0].finalScore * 100) / 100,
      memoryRefs: [
        {
          memoryId: topMatch.publicId,
          relevance: candidates[0].finalScore,
          reason: 'Hibrit arama algoritmasında en yüksek skoru aldı.',
        },
      ],
      uncertainties: [],
      generatedAt: new Date().toISOString(),
    };
  }

  // LLM reasoning call
  try {
    const systemPrompt = `Sen Trace kişisel hafıza asistanısın. Sadece sana verilen bağlamı (Context) kullanarak kullanıcının sorusunu yanıtla.
Eğer verilen bağlam yanıt için yetersizse tahmin yürütme ve neyin eksik olduğunu belirt.

BAĞLAM:
${contextText}`;

    const response = await llmClient.complete({
      system: systemPrompt,
      prompt: userQuestion,
    });

    return {
      answer: response.answer,
      confidence: response.confidence || 0.85,
      memoryRefs: response.memoryRefs || [],
      uncertainties: response.uncertainties || [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[AI Reasoning Warning] Failed to generate reasoning:', error);
    return {
      answer: 'Yanıt oluşturulurken bir hata meydana geldi, lütfen tekrar deneyin.',
      confidence: 0.0,
      memoryRefs: [],
      uncertainties: ['LLM servis bağlantı hatası.'],
      generatedAt: new Date().toISOString(),
    };
  }
}