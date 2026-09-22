export interface SkillItem {
  name: string;
  category: 'PROGRAMMING' | 'FRONTEND' | 'BACKEND' | 'DATABASES' | 'AI' | 'TOOLS' | 'CORE';
  description?: string;
  iconName?: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export interface ExperienceItem {
  organization: string;
  roleDescription: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  cgpa?: string;
  duration: string;
  location: string;
}

export interface CertificationItem {
  name: string;
  category: 'AI / MACHINE LEARNING' | 'PROGRAMMING' | 'DATA SCIENCE' | 'PRODUCTIVITY';
  issuer?: string;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Vigneshwaran S",
    shortName: "VS",
    domain: "vigneshwaran.dev",
    role: "AI / Software Developer",
    educationMeta: "SRMIST • B.Tech CSE (AI)",
    status: "BUILDING INTELLIGENT SOFTWARE",
    heroIntro: "Computer Science student specializing in AI, building intelligent and scalable software experiences.",
    profile: "I am a pre-final Computer Science student specializing in AI with skills in Python, Java, C++, SQL, and full-stack development. Strong in DSA, OOP, Machine Learning, and databases, with hands-on project experience. Interested in building scalable and intelligent software solutions. A quick learner and collaborative team player with strong problem-solving skills.",
    email: "sgvigneshwaran.coral@gmail.com",
    phone: "9789391791",
    location: "Chennai, India",
    github: "https://github.com/vignesh45-eng",
    githubDisplay: "github.com/vignesh45-eng",
  },

  heroHighlights: [
    {
      number: "01",
      title: "AI & MACHINE LEARNING",
      skills: ["Machine Learning", "Generative AI", "Prompt Engineering"],
    },
    {
      number: "02",
      title: "SOFTWARE ENGINEERING",
      skills: ["Python", "Java", "C++", "React.js", "Node.js"],
    },
    {
      number: "03",
      title: "DATABASES & SYSTEMS",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Supabase"],
    },
  ],

  aboutCapabilities: [
    {
      title: "FULL-STACK DEVELOPMENT",
      description: "Building responsive and scalable software experiences using modern frameworks and robust backends.",
      icon: "Code2",
    },
    {
      title: "ARTIFICIAL INTELLIGENCE",
      description: "Exploring Machine Learning, Generative AI models, and structured prompt engineering.",
      icon: "Cpu",
    },
    {
      title: "PROBLEM SOLVING",
      description: "Rigorous foundation in DSA, OOP, DBMS, OS, and Software Development Life Cycle (SDLC).",
      icon: "Binary",
    },
  ],

  skills: [
    // Programming
    { name: "Python", category: "PROGRAMMING" },
    { name: "Java", category: "PROGRAMMING" },
    { name: "C++", category: "PROGRAMMING" },
    { name: "C", category: "PROGRAMMING" },
    { name: "JavaScript", category: "PROGRAMMING" },
    { name: "SQL", category: "PROGRAMMING" },

    // Frontend
    { name: "React.js", category: "FRONTEND" },
    { name: "HTML5", category: "FRONTEND" },
    { name: "CSS3", category: "FRONTEND" },

    // Backend
    { name: "Node.js", category: "BACKEND" },
    { name: "Express.js", category: "BACKEND" },

    // Databases
    { name: "MySQL", category: "DATABASES" },
    { name: "PostgreSQL", category: "DATABASES" },
    { name: "MongoDB", category: "DATABASES" },
    { name: "Supabase", category: "DATABASES" },

    // AI
    { name: "Machine Learning", category: "AI" },
    { name: "Generative AI", category: "AI" },
    { name: "Prompt Engineering", category: "AI" },

    // Tools
    { name: "Git", category: "TOOLS" },
    { name: "GitHub", category: "TOOLS" },
    { name: "Docker", category: "TOOLS" },
    { name: "Postman", category: "TOOLS" },

    // Core
    { name: "DSA", category: "CORE" },
    { name: "OOP", category: "CORE" },
    { name: "DBMS", category: "CORE" },
    { name: "OS", category: "CORE" },
    { name: "SDLC", category: "CORE" },
  ] as SkillItem[],

  projects: [
    {
      id: "ai-text-detector",
      number: "01",
      title: "AI TEXT DETECTOR",
      subtitle: "AI / NLP / CLASSIFICATION",
      tagline: "NLP & Linguistic Confidence Scoring",
      description: "A system that analyzes and classifies text as human-written or AI-generated using NLP techniques, linguistic pattern analysis and confidence scoring to provide accurate, real-time results.",
      tags: ["NLP", "Python", "Machine Learning"],
      featured: true,
    },
    {
      id: "campus-connect",
      number: "02",
      title: "CAMPUS CONNECT",
      subtitle: "COLLABORATION PLATFORM",
      tagline: "Student Co-founder & Project Network",
      description: "A platform that connects students with the same mindset to start startups or build projects together. Solves the problem of finding co-founders and like-minded collaborators within a campus community.",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
      featured: false,
    },
    {
      id: "spotify-clone",
      number: "03",
      title: "SPOTIFY CLONE",
      subtitle: "FRONTEND / INTERACTIVE UI",
      tagline: "Responsive Audio Streaming Interface",
      description: "A responsive Spotify Clone with a modern UI, featuring music browsing, search, playlists, and audio playback controls. Built using HTML, CSS, and JavaScript, delivering a smooth and interactive user experience.",
      tags: ["HTML5", "CSS3", "JavaScript"],
      featured: false,
    },
  ] as ProjectItem[],

  experience: [
    {
      organization: "DIRECTORATE OF STUDENT AFFAIRS",
      roleDescription: "Student Leadership & Event Operations",
      highlights: [
        "Supported planning and coordination of student programs and events.",
        "Managed resources and collaborated with faculty and student teams.",
        "Helped ensure smooth execution of university activities.",
      ],
    },
  ] as ExperienceItem[],

  education: [
    {
      institution: "SRM Institute of Science and Technology",
      degree: "B-Tech in CSE(AI)",
      cgpa: "8.15",
      duration: "08/2024 – Present",
      location: "Chennai",
    },
    {
      institution: "Good Samaritan Public School",
      degree: "Higher Secondary Education (12th Standard)",
      duration: "2024",
      location: "Sirkali",
    },
  ] as EducationItem[],

  certifications: [
    {
      name: "AI Fundamentals: Foundations for Understanding AI",
      category: "AI / MACHINE LEARNING",
    },
    {
      name: "Machine Learning",
      category: "AI / MACHINE LEARNING",
    },
    {
      name: "Programming In Java",
      category: "PROGRAMMING",
    },
    {
      name: "Introduction To Data Science (CISCO)",
      category: "DATA SCIENCE",
      issuer: "CISCO",
    },
    {
      name: "Microsoft Excel - Excel from Beginner to Advanced",
      category: "PRODUCTIVITY",
    },
  ] as CertificationItem[],
};
