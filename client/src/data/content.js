export const personalInfo = {
  name: 'Aryan Kothari',
  title: 'Full-Stack MERN & AI Developer',
  valueProp:
    'I build fast, production-ready MERN web platforms and AI-powered products for startups and businesses.',
  email: 'aryankothari94@gmail.com',
  availability: 'Open for Web Developer Internships & Freelance',
  resumeUrl: 'TODO: Add resume PDF URL',
};

export const about = {
  bio: "I'm a Computer Science student and MERN stack developer who turns product ideas into fast, shipped web applications. I've launched two live production platforms—including a location intelligence app serving 1,500+ users and a self-serve client catalogue—while building AutoDev AI on the side. I focus on clean API architecture, responsive interfaces, and measurable real-world impact.",
  stats: [
    { value: 1500, decimals: 0, suffix: '+', label: 'Live Platform Users' },
    { value: 2, decimals: 0, suffix: '', label: 'Production Launches' },
    { value: 10, decimals: 0, suffix: '', label: 'Core Technologies' },
  ],
};

// Curated 10 strongest technologies
export const skills = {
  core: [
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL (Supabase)',
    'JavaScript (ES6+)',
    'Java',
    'Python',
    'RESTful APIs',
    'n8n AI Workflows',
  ],
};

export const projects = [
  {
    id: 'know-your-city',
    title: 'Know Your City',
    subtitle: 'MERN Stack Location Intelligence',
    status: 'Live',
    oneLiner:
      'Geospatial safety heatmaps, route optimization, and facility search serving 1,500+ users across Indian cities.',
    liveUrl: 'https://knowyourcitys.in',
    repoUrl: 'TODO: Add Know Your City GitHub repository URL',
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    metrics: ['1,500+ users', '150+ registered accounts', '3 geospatial features'],
    highlights: [
      'Built and deployed a full-stack location intelligence platform reaching 1,500+ users and 150+ registered accounts.',
      'Developed safety heatmaps, safe-neighborhood classification, and route optimization across Indian cities.',
      'Engineered modular RESTful APIs and real-time filtering across hospitals, police stations, transport hubs, and accommodations.',
    ],
  },
  {
    id: 'shri-metro-products',
    title: 'Shri Metro Products',
    subtitle: 'Freelance Client Platform',
    status: 'Live',
    oneLiner:
      'Full-stack furniture catalogue (43+ models) with an instant-sync admin dashboard built for a Bengaluru manufacturer.',
    liveUrl: 'https://shrimetroproducts.in',
    repoUrl: 'TODO: Add Shri Metro Products GitHub repository URL',
    techStack: ['Supabase', 'PostgreSQL', 'Admin CRUD', 'Responsive UI'],
    metrics: ['43+ product models', 'Full CRUD admin dashboard', 'End-to-end client delivery'],
    highlights: [
      'Delivered a complete responsive product catalogue covering 43+ furniture models for a Bengaluru manufacturer.',
      'Built a secure admin dashboard enabling the client to add, edit, and remove products with zero developer intervention.',
      'Connected live catalogue updates to Supabase (PostgreSQL) and managed requirement gathering through handover.',
    ],
  },
  {
    id: 'autodev-ai',
    title: 'AutoDev AI',
    subtitle: 'Multi-Agent Software Platform',
    status: 'In Progress',
    oneLiner:
      '4-agent AI platform turning user ideas into architecture, SRS blueprints, and live deployed software.',
    liveUrl: 'TODO: Add AutoDev AI live deployment URL',
    repoUrl: 'TODO: Add AutoDev AI GitHub repository URL',
    techStack: ['AI Agents', 'Automated SRS', 'System Architecture', 'Full-Stack'],
    metrics: ['4-agent pipeline', 'Adaptive requirements', 'Automated SRS'],
    highlights: [
      'Designing a 4-agent pipeline (coding, testing, deployment, maintenance) to convert ideas into deployed software.',
      'Built an adaptive requirement-gathering flow that generates follow-up questions dynamically from user answers.',
      'Implemented automatic architecture review and SRS blueprint generation prior to code execution.',
    ],
  },
];

export const experience = [
  {
    id: 'e-connect-intern',
    role: 'Web Development Intern',
    company: 'E-Connect Pvt. Ltd.',
    period: 'Summer 2024',
    impact: 'Built front-end and back-end web modules in mentored production workflows.',
  },
];

export const education = {
  degree: 'B.Tech in Computer Science & Engineering',
  institution: 'Walchand Institute of Technology, Solapur',
  period: '2023 – Present',
  grade: 'CGPA 8.93',
};

// Max 3 notable recognitions (no filler certificates)
export const notableBadges = [
  'Intercollege Hackathon Finalist',
  'WIT-Char Webtopia (National Level)',
];

export const socials = [
  {
    name: 'LinkedIn',
    url: 'TODO: Add LinkedIn profile URL',
  },
  {
    name: 'GitHub',
    url: 'TODO: Add GitHub profile URL',
  },
  {
    name: 'Email',
    url: 'mailto:aryankothari94@gmail.com',
  },
];
