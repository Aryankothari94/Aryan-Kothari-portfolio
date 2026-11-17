const VISUAL_THEMES = {
  'know-your-city': {
    bgStart: '#06121E',
    bgMid: '#0A2538',
    bgEnd: '#071422',
    accentA: '#00F0FF',
    accentB: '#B8FF2E',
    code: 'KYC // GEOSPATIAL',
    motif: `
      <circle cx="520" cy="240" r="145" fill="none" stroke="#00F0FF" stroke-opacity="0.22" stroke-width="1.5" stroke-dasharray="8 8"/>
      <circle cx="520" cy="240" r="90" fill="none" stroke="#B8FF2E" stroke-opacity="0.35" stroke-width="1.5"/>
      <circle cx="520" cy="240" r="24" fill="#B8FF2E" fill-opacity="0.18" stroke="#B8FF2E" stroke-width="1.5"/>
      <path d="M160 360 Q 340 210, 520 240 T 860 150" fill="none" stroke="#00F0FF" stroke-opacity="0.5" stroke-width="2"/>
      <circle cx="320" cy="255" r="7" fill="#00F0FF"/>
      <circle cx="710" cy="195" r="7" fill="#B8FF2E"/>
    `,
  },
  'shri-metro-products': {
    bgStart: '#120C22',
    bgMid: '#1C163B',
    bgEnd: '#090B14',
    accentA: '#A855F7',
    accentB: '#00F0FF',
    code: 'SMP // CATALOGUE CRUD',
    motif: `
      <rect x="210" y="120" width="220" height="240" rx="18" fill="none" stroke="#A855F7" stroke-opacity="0.35" stroke-width="1.5"/>
      <rect x="465" y="120" width="220" height="110" rx="18" fill="#5B6CFF" fill-opacity="0.12" stroke="#00F0FF" stroke-opacity="0.35" stroke-width="1.5"/>
      <rect x="465" y="250" width="220" height="110" rx="18" fill="none" stroke="#B8FF2E" stroke-opacity="0.35" stroke-width="1.5"/>
      <line x1="240" y1="165" x2="360" y2="165" stroke="#F4F6FB" stroke-opacity="0.35" stroke-width="4" stroke-linecap="round"/>
      <line x1="240" y1="190" x2="320" y2="190" stroke="#A855F7" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round"/>
    `,
  },
  'autodev-ai': {
    bgStart: '#0B1310',
    bgMid: '#10241A',
    bgEnd: '#070A12',
    accentA: '#B8FF2E',
    accentB: '#00F0FF',
    code: 'AUTODEV // 4-AGENT PIPELINE',
    motif: `
      <line x1="190" y1="240" x2="770" y2="240" stroke="#B8FF2E" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="6 6"/>
      <circle cx="190" cy="240" r="42" fill="#0D1614" stroke="#B8FF2E" stroke-opacity="0.7" stroke-width="2"/>
      <circle cx="383" cy="240" r="42" fill="#0D1614" stroke="#00F0FF" stroke-opacity="0.7" stroke-width="2"/>
      <circle cx="576" cy="240" r="42" fill="#0D1614" stroke="#5B6CFF" stroke-opacity="0.7" stroke-width="2"/>
      <circle cx="770" cy="240" r="42" fill="#0D1614" stroke="#A855F7" stroke-opacity="0.7" stroke-width="2"/>
    `,
  },
};

export function getProjectPlaceholderSvgUrl(projectId) {
  const theme = VISUAL_THEMES[projectId] || VISUAL_THEMES['know-your-city'];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.bgStart}"/>
          <stop offset="52%" stop-color="${theme.bgMid}"/>
          <stop offset="100%" stop-color="${theme.bgEnd}"/>
        </linearGradient>
        <radialGradient id="glowA" cx="25%" cy="30%" r="55%">
          <stop offset="0%" stop-color="${theme.accentA}" stop-opacity="0.34"/>
          <stop offset="100%" stop-color="${theme.accentA}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowB" cx="78%" cy="72%" r="50%">
          <stop offset="0%" stop-color="${theme.accentB}" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="${theme.accentB}" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="960" height="540" fill="url(#bg)"/>
      <rect width="960" height="540" fill="url(#grid)"/>
      <rect width="960" height="540" fill="url(#glowA)"/>
      <rect width="960" height="540" fill="url(#glowB)"/>
      ${theme.motif}
      <text x="48" y="485" fill="rgba(244,246,251,0.55)" font-family="monospace" font-size="16" letter-spacing="4">${theme.code}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

