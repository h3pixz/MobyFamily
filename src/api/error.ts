export function getApiErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;

    if (typeof data === 'string' && data) {
      return data;
    }

    if (data && typeof data === 'object') {
      const details = (data as { errors?: unknown }).errors;

      if (Array.isArray(details)) {
        const messages = details
          .map((item) =>
            item && typeof item === 'object' ? (item as { message?: unknown }).message : null,
          )
          .filter((item): item is string => typeof item === 'string' && item.length > 0);

        if (messages.length > 0) {
          return messages.join('. ');
        }
      }

      const message = (data as { message?: unknown }).message;

      if (Array.isArray(message)) {
        return message.join('. ');
      }
      if (typeof message === 'string' && message) {
        return message === 'Validation failed' ? 'Проверьте заполнение полей.' : message;
      }

      const detail = (data as { error?: unknown }).error;

      if (typeof detail === 'string' && detail) {
        return detail;
      }
    }
  }

  if (error instanceof Error) {
    if (error.message === 'Network request failed') {
      return 'Нет соединения с сервером. Проверьте интернет.';
    }
    if (error.message) {
      return error.message;
    }
  }

  return 'Не удалось выполнить запрос. Попробуйте ещё раз.';
}
