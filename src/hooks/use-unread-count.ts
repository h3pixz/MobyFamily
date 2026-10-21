import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { fetchUnreadCount } from '@/api/notifications';

export function useUnreadCount() {
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      fetchUnreadCount()
        .then((value) => {
          if (!cancelled) {
            setCount(value);
          }
        })
        .catch(() => {});

      return () => {
        cancelled = true;
      };
    }, []),
  );

  return count;
}
