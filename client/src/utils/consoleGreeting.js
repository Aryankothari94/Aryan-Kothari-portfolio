import { personalInfo } from '../data/content';

let printed = false;

export function printDevToolsGreeting() {
  if (printed || typeof window === 'undefined') return;
  printed = true;

  const ascii = `
   ___   _____  _____   _   __   __ __ ____ _____ __ __ ___   ___   ____
  / _ | / _ \\ \\/ / _ | / | / /  / //_// __ \\_  _// // // _ | / _ \\ /  _/
 / __ |/ , _/\\  / __ |/  |/ /  / ,<  / /_/ // / / _  // __ |/ , _/_/ /
/_/ |_/_/|_| /_/_/ |_/_/|__/  /_/|_| \\____//_/ /_//_//_/ |_/_/|_|/___/
`;

  console.log(
    `%c${ascii}\n%c 👋 Hey developer! Inspecting the source?\n%c ${personalInfo.name} — ${personalInfo.title}\n 🎓 B.Tech CSE (8.93 CGPA) · 2 Shipped Production Websites\n 🚀 ${personalInfo.availability}\n 📬 ${personalInfo.email}\n 💡 Tip: Try the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) on the page!`,
    'color: #B8FF2E; font-weight: bold; font-family: monospace; line-height: 1.15;',
    'color: #00F0FF; font-size: 14px; font-weight: bold;',
    'color: #E2E8F0; font-size: 12px; line-height: 1.7;'
  );
}

