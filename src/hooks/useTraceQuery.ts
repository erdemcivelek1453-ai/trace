import { useState } from 'react';
import { handleTraceUserQuery } from '../index';
import { AIResponseContract } from '../types';

export function useTraceQuery(dbClient ? : any) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState < AIResponseContract | null > (null);
  const [error, setError] = useState < string | null > (null);
  
  const executeQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock veritabanı veya gerçek db ile çalıştırma
      const res = await handleTraceUserQuery(dbClient || {}, queryText);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Sorgu çalıştırılırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetQuery = () => {
    setResponse(null);
    setError(null);
    setLoading(false);
  };
  
  return {
    loading,
    response,
    error,
    executeQuery,
    resetQuery,
  };
}