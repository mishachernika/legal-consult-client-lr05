import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';

type Theme = 'light' | 'dark';

// Початкова тема: збережений вибір користувача або системне налаштування
function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Tailwind 4: dark-варіант спрацьовує від класу .dark на <html> (див. @custom-variant в index.css)
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
