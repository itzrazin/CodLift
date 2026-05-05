import { useState, useCallback } from 'react';

export const useBackendLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Waking up the backend...");

  const fetchWithGame = useCallback(async (url, options = {}) => {
    // Determine if it's a backend call (should use URL or base check)
    // For CodLift, most API calls start with /api
    
    const timeoutId = setTimeout(() => {
      setIsLoading(true);
    }, 500); // Only show game if call takes > 500ms (to avoid flickering)

    try {
      const response = await fetch(url, options);
      return response;
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  return { isLoading, loadingMessage, setLoadingMessage, fetchWithGame };
};
