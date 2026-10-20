// Single source of truth for every piece of personal content on the site.
// Components read from here instead of hard-coding strings.

export type SkillCategory =
  | 'PROGRAMMING'
  | 'FRONTEND'
  | 'BACKEND'
  | 'DATABASES'
  | 'AI'
  | 'CORE CS'
  | 'TOOLS';

export type TechIconName =
  | 'binary'
  | 'braces'
  | 'coffee'
  | 'terminal'
  | 'file-code'
  | 'table'
  | 'atom'
  | 'hexagon'
  | 'route'
  | 'layout-template'
  | 'palette'
  | 'database'
  | 'cylinder'
  | 'leaf'
  | 'zap'
  | 'git-branch'
  | 'folder-git'
  | 'container'
  | 'send'
  | 'brain'
  | 'sparkles'
  | 'message-square-text'
  | 'network'
  | 'boxes'
  | 'cpu'
  | 'workflow';

export interface Skill {
  name: string;
  category: SkillCategory;
  icon: TechIconName;
}

export interface FocusArea {
  number: string;
  title: string;
  description: string;
}

export type ProjectVisual = 'ai-text-detector' | 'campus-connect' | 'spotify-clone';

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  visual: ProjectVisual;
  /** Repository URL. Leave undefined until a real one exists. */
  sourceUrl?: string;
  /** Deployed URL. Leave undefined until a real one exists. */
  liveUrl?: string;
}

export interface Responsibility {
  /** Two or three words, shown on the "document" before it is transformed. */
  topic: string;
  detail: string;
}

export interface Experience {
  organization: string;
  context: string;
  responsibilities: Responsibility[];
}

export interface Education {
  qualification: string;
  institution: string;
  period: string;
  location: string;
  cgpa?: string;
  primary?: boolean;
}

export interface Certification {
  name: string;
  area: string;
}

export interface NavLink {
  label: string;
  id: string;
}

export const personal = {
  name: 'Vigneshwaran S',
  firstName: 'Vigneshwaran',
  initials: 'VS',
  domain: 'VIGNESHWARAN.DEV',
  headline: 'AI / SOFTWARE DEVELOPER',
  supportingHeadline: 'Computer Science (AI) Student · Full-Stack Developer · AI & ML Enthusiast',
  heroCopy:
    'Computer Science (AI) student building intelligent software, full-stack applications, and practical AI-powered experiences.',
  heroMeta: 'AI · FULL-STACK · MACHINE LEARNING',
  about:
    "I'm a Computer Science and Engineering (AI) student at SRM Institute of Science and Technology, focused on building intelligent, scalable, and user-focused software. I enjoy working across AI, machine learning, full-stack development, databases, and problem solving.",
  email: 'sgvigneshwaran.coral@gmail.com',
  phone: '9789391791',
  location: 'Chennai, India',
  github: 'https://github.com/vignesh45-eng',
  githubHandle: 'vignesh45-eng',
} as const;

export const navLinks: NavLink[] = [
  { label: 'ABOUT', id: 'about' },
  { label: 'SKILLS', id: 'skills' },
  { label: 'PROJECTS', id: 'projects' },
  { label: 'EXPERIENCE', id: 'experience' },
  { label: 'CONTACT', id: 'contact' },
];

/** Every section id, in page order. Used for active-link tracking. */
export const sectionIds = [
  'hero',
  'stack',
  'about',
  'focus',
  'skills',
  'projects',
  'experience',
  'education',
  'certifications',
  'contact',
] as const;

export const skillCategories: SkillCategory[] = [
  'PROGRAMMING',
  'FRONTEND',
  'BACKEND',
  'DATABASES',
  'AI',
  'CORE CS',
  'TOOLS',
];

export const skills: Skill[] = [
  { name: 'C', category: 'PROGRAMMING', icon: 'binary' },
  { name: 'C++', category: 'PROGRAMMING', icon: 'braces' },
  { name: 'Java', category: 'PROGRAMMING', icon: 'coffee' },
  { name: 'Python', category: 'PROGRAMMING', icon: 'terminal' },
  { name: 'JavaScript', category: 'PROGRAMMING', icon: 'file-code' },
  { name: 'SQL', category: 'PROGRAMMING', icon: 'table' },

  { name: 'Data Structures and Algorithms', category: 'CORE CS', icon: 'network' },
  { name: 'OOP', category: 'CORE CS', icon: 'boxes' },
  { name: 'DBMS', category: 'CORE CS', icon: 'database' },
  { name: 'Operating Systems', category: 'CORE CS', icon: 'cpu' },
  { name: 'SDLC', category: 'CORE CS', icon: 'workflow' },

  { name: 'Generative AI', category: 'AI', icon: 'sparkles' },
  { name: 'Prompt Engineering', category: 'AI', icon: 'message-square-text' },
  { name: 'Machine Learning', category: 'AI', icon: 'brain' },

  { name: 'HTML5', category: 'FRONTEND', icon: 'layout-template' },
  { name: 'CSS3', category: 'FRONTEND', icon: 'palette' },
  { name: 'React.js', category: 'FRONTEND', icon: 'atom' },

  { name: 'Node.js', category: 'BACKEND', icon: 'hexagon' },
  { name: 'Express.js', category: 'BACKEND', icon: 'route' },

  { name: 'MySQL', category: 'DATABASES', icon: 'database' },
  { name: 'PostgreSQL', category: 'DATABASES', icon: 'cylinder' },
  { name: 'MongoDB', category: 'DATABASES', icon: 'leaf' },
  { name: 'Supabase', category: 'DATABASES', icon: 'zap' },

  { name: 'Git', category: 'TOOLS', icon: 'git-branch' },
  { name: 'GitHub', category: 'TOOLS', icon: 'folder-git' },
  { name: 'Docker', category: 'TOOLS', icon: 'container' },
  { name: 'Postman', category: 'TOOLS', icon: 'send' },
];

/** Technologies shown in the two marquee rows (a subset of `skills`). */
const marqueeNames = {
  rowOne: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'SQL', 'React.js', 'Node.js', 'Express.js', 'HTML5', 'CSS3'],
  rowTwo: [
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Supabase',
    'Git',
    'GitHub',
    'Docker',
    'Postman',
    'Machine Learning',
    'Generative AI',
    'Prompt Engineering',
  ],
};

const skillByName = (name: string): Skill => {
  const skill = skills.find((s) => s.name === name);
  if (!skill) throw new Error(`Unknown skill in marquee: ${name}`);
  return skill;
};

export const marqueeRows: [Skill[], Skill[]] = [
  marqueeNames.rowOne.map(skillByName),
  marqueeNames.rowTwo.map(skillByName),
];

export const focusAreas: FocusArea[] = [
  {
    number: '01',
    title: 'AI & MACHINE LEARNING',
    description: 'Explore intelligent applications, text analysis, and machine-learning concepts.',
  },
  {
    number: '02',
    title: 'FULL-STACK APPLICATIONS',
    description: 'Build responsive interfaces and connected application experiences.',
  },
  {
    number: '03',
    title: 'DATABASE SYSTEMS',
    description: 'Work with structured and document-oriented databases.',
  },
  {
    number: '04',
    title: 'SOFTWARE ENGINEERING',
    description: 'Apply programming fundamentals, object-oriented design, and problem-solving principles.',
  },
  {
    number: '05',
    title: 'DATA-DRIVEN EXPERIENCES',
    description: 'Present information through clear, useful, interactive interfaces.',
  },
];

export const projects: Project[] = [
  {
    id: 'ai-text-detector',
    number: '01',
    title: 'AI TEXT DETECTOR',
    category: 'AI / NLP',
    description:
      'An AI-powered system that analyzes and classifies text as human-written or AI-generated using NLP techniques, linguistic pattern analysis, and confidence scoring.',
    technologies: ['Python', 'NLP', 'Machine Learning', 'Generative AI'],
    visual: 'ai-text-detector',
  },
  {
    id: 'campus-connect',
    number: '02',
    title: 'CAMPUS CONNECT',
    category: 'Collaboration Platform',
    description:
      'A platform designed to help students find like-minded collaborators, co-founders, and teammates for startups and campus projects.',
    technologies: [],
    visual: 'campus-connect',
  },
  {
    id: 'spotify-clone',
    number: '03',
    title: 'SPOTIFY CLONE',
    category: 'Web Development',
    description:
      'A responsive music interface featuring browsing, search, playlists, and audio playback controls.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    visual: 'spotify-clone',
  },
];

export const experience: Experience[] = [
  {
    organization: 'Directorate of Student Affairs',
    context: 'Student organizational experience · SRM Institute of Science and Technology',
    responsibilities: [
      { topic: 'Programs & events', detail: 'Supported planning and coordination of student programs and events.' },
      { topic: 'Resources', detail: 'Managed resources.' },
      { topic: 'Teamwork', detail: 'Collaborated with faculty and student teams.' },
      { topic: 'Execution', detail: 'Helped ensure smooth execution of activities.' },
    ],
  },
];

export const education: Education[] = [
  {
    qualification: 'B.Tech in Computer Science and Engineering (AI)',
    institution: 'SRM Institute of Science and Technology',
    period: '2024–Present',
    location: 'Chennai, India',
    cgpa: '8.15',
    primary: true,
  },
  {
    qualification: 'Higher Secondary Education',
    institution: 'Good Samaritan Public School',
    period: '2024',
    location: 'Sirkali, India',
  },
];

export const certifications: Certification[] = [
  { name: 'AI Fundamentals: Foundations for Understanding AI', area: 'Artificial Intelligence' },
  { name: 'Machine Learning', area: 'Artificial Intelligence' },
  { name: 'Programming in Java', area: 'Programming' },
  { name: 'Introduction To Data Science (CISCO)', area: 'Data Science' },
  { name: 'Microsoft Excel — Excel from Beginner to Advanced', area: 'Productivity' },
];
