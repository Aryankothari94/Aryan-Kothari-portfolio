import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const reducedMotion = useReducedMotion();
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('portfolio-theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = useCallback(
    (event) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';

      // Use View Transitions API circular clip-path reveal when supported and motion allowed
      const supportsViewTransition =
        typeof document !== 'undefined' &&
        typeof document.startViewTransition === 'function' &&
        !reducedMotion;

      if (!supportsViewTransition) {
        setTheme(nextTheme);
        return;
      }

      const x = event?.clientX ?? window.innerWidth - 60;
      const y = event?.clientY ?? 36;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 620,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // fallback silently if view transition interrupted
        });
    },
    [theme, reducedMotion]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

