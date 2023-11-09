import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useSearchBuilder() {
  const currentPath = usePathname();
  const currentSearch = useSearchParams();
  
  const builder = useCallback((update: Record<string, any>) => {
    const params = new URLSearchParams(currentSearch);

    for (const [key, value] of Object.entries(update)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    if (params.size > 0) {
      return `${currentPath}?${params.toString()}`;
    } else {
      return currentPath;
    }
  }, [currentPath, currentSearch]);

  return builder;
}