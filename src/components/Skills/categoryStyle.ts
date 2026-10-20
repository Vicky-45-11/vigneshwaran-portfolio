import type { SkillCategory } from '../../data/portfolio';

// Each category gets its own item colour, like rarity colours in a block game.
export const CATEGORY_COLOR: Record<SkillCategory, string> = {
  PROGRAMMING: '#2f53c9',
  FRONTEND: '#c2361f',
  BACKEND: '#2f7a1f',
  DATABASES: '#a87b2e',
  AI: '#7b3fa0',
  'CORE CS': '#8a2f2f',
  TOOLS: '#11868c',
};

export const CATEGORY_LABEL: Record<SkillCategory, string> = {
  PROGRAMMING: 'Programming',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASES: 'Databases',
  AI: 'AI & Machine Learning',
  'CORE CS': 'Core Computer Science',
  TOOLS: 'Tools',
};
