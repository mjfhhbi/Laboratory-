/**
 * Food Science AI - Research Projects Storage Engine
 * Persistent IndexedDB Storage with Seed Initialization
 */

import { STORES, getItem, putItem, deleteItem, getAllItems } from './indexedDb';
import { ResearchProject, AcademicLevel, FoodResearchCategory } from '../../types/research';
import { SEED_RESEARCH_PROJECTS } from '../../data/seedResearchProjects';

const LOCAL_STORAGE_FALLBACK_KEY = 'foodscience_research_projects_backup';

export async function getAllResearchProjects(): Promise<ResearchProject[]> {
  try {
    const items = await getAllItems<ResearchProject>(STORES.RESEARCH_PROJECTS);
    if (!items || items.length === 0) {
      // Seed initial research projects
      for (const p of SEED_RESEARCH_PROJECTS) {
        await putItem<ResearchProject>(STORES.RESEARCH_PROJECTS, p);
      }
      return [...SEED_RESEARCH_PROJECTS];
    }

    return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.warn('Failed to fetch research projects from IndexedDB, using fallback:', err);
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return [...SEED_RESEARCH_PROJECTS];
  }
}

export async function getResearchProjectById(id: string): Promise<ResearchProject | null> {
  try {
    const item = await getItem<ResearchProject>(STORES.RESEARCH_PROJECTS, id);
    if (item) return item;
  } catch (err) {
    console.warn('Error fetching project by id from IndexedDB:', err);
  }

  // Check seed
  const fromSeed = SEED_RESEARCH_PROJECTS.find((p) => p.id === id);
  if (fromSeed) return fromSeed;

  // Check fallback
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (raw) {
      const list: ResearchProject[] = JSON.parse(raw);
      return list.find((p) => p.id === id) || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function saveResearchProject(project: ResearchProject): Promise<void> {
  const updated: ResearchProject = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  try {
    await putItem<ResearchProject>(STORES.RESEARCH_PROJECTS, updated);
  } catch (err) {
    console.warn('Failed to save research project to IndexedDB, backing up to localStorage:', err);
  }

  // Always keep localStorage sync fallback
  try {
    const existing = await getAllResearchProjects();
    const idx = existing.findIndex((p) => p.id === updated.id);
    if (idx >= 0) {
      existing[idx] = updated;
    } else {
      existing.unshift(updated);
    }
    localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export async function deleteResearchProject(id: string): Promise<void> {
  try {
    await deleteItem(STORES.RESEARCH_PROJECTS, id);
  } catch (err) {
    console.warn('Failed to delete research project from IndexedDB:', err);
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (raw) {
      const list: ResearchProject[] = JSON.parse(raw);
      const filtered = list.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(filtered));
    }
  } catch {
    // ignore
  }
}

export function createBlankResearchProject(
  category: FoodResearchCategory = 'food_nanotechnology',
  level: AcademicLevel = 'master'
): ResearchProject {
  const now = new Date().toISOString();
  const randomId = 'proj-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);

  return {
    id: randomId,
    title: 'طرح تحقیقاتی جدید صنایع غذایی',
    englishTitle: 'New Food Science & Engineering Research Project',
    academicLevel: level,
    category: category,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    problemStatement: '',
    researchQuestions: [],
    objectives: {
      mainObjective: '',
      specificObjectives: []
    },
    hypotheses: {
      nullHypothesis: '',
      alternativeHypothesis: ''
    },
    variables: [],
    populationAndSample: {
      targetMatrix: '',
      sampleSize: '',
      samplingMethod: '',
      storageConditions: ''
    },
    researchMethodology: {
      designType: 'طرح فاکتوریل بر پایه بلوک‌های کامل تصادفی (RCBD)',
      samplingTimeline: '',
      dataAnalysisMethod: 'آنالیز واریانس (ANOVA) با نرم‌افزار آماری'
    },
    experimentalProcedures: '',
    literatureReview: [],
    results: '',
    discussion: '',
    conclusion: '',
    weaknessesAndLimitations: [],
    suggestedExperiments: [],
    tags: []
  };
}
