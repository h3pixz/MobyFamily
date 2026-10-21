export function getFirstName(name?: string) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts[1] ?? parts[0] ?? '';
}

export function getGreeting(name?: string) {
  const hour = new Date().getHours();
  const prefix =
    hour < 5
      ? 'Доброй ночи'
      : hour < 12
        ? 'Доброе утро'
        : hour < 18
          ? 'Добрый день'
          : 'Добрый вечер';
  const firstName = getFirstName(name);

  return firstName ? `${prefix}, ${firstName}` : prefix;
}
