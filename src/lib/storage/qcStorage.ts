import {
  QCProductionBatch,
  QCSample,
  QCTestResult,
  QCDeviation,
  QCCAPAAction
} from '../../types/qualityControl';
import {
  BENCHMARK_PRODUCTION_BATCHES,
  BENCHMARK_QC_SAMPLES,
  BENCHMARK_QC_TEST_RESULTS,
  BENCHMARK_QC_DEVIATIONS,
  BENCHMARK_CAPA_ACTIONS
} from '../../data/qualityControlData';
import { STORES, getItem, putItem } from './indexedDb';

const QC_WORKSPACE_STORAGE_KEY = 'qc_qa_workspace_v1';

export interface QCWorkspaceState {
  id: string;
  batches: QCProductionBatch[];
  samples: QCSample[];
  testResults: QCTestResult[];
  deviations: QCDeviation[];
  capas: QCCAPAAction[];
  isBenchmarkData: boolean;
  updatedAt: string;
}

export function getBenchmarkQCWorkspace(): QCWorkspaceState {
  return {
    id: QC_WORKSPACE_STORAGE_KEY,
    batches: BENCHMARK_PRODUCTION_BATCHES,
    samples: BENCHMARK_QC_SAMPLES,
    testResults: BENCHMARK_QC_TEST_RESULTS,
    deviations: BENCHMARK_QC_DEVIATIONS,
    capas: BENCHMARK_CAPA_ACTIONS,
    isBenchmarkData: true,
    updatedAt: new Date().toISOString()
  };
}

export function getEmptyQCWorkspace(): QCWorkspaceState {
  return {
    id: QC_WORKSPACE_STORAGE_KEY,
    batches: [],
    samples: [],
    testResults: [],
    deviations: [],
    capas: [],
    isBenchmarkData: false,
    updatedAt: new Date().toISOString()
  };
}

export async function loadQCWorkspace(): Promise<QCWorkspaceState> {
  try {
    const saved = await getItem<QCWorkspaceState>(STORES.SETTINGS, QC_WORKSPACE_STORAGE_KEY);
    if (
      saved &&
      Array.isArray(saved.batches) &&
      Array.isArray(saved.samples) &&
      Array.isArray(saved.testResults) &&
      Array.isArray(saved.deviations) &&
      Array.isArray(saved.capas)
    ) {
      return saved;
    }
  } catch (err) {
    console.warn('Failed to load QC workspace from IndexedDB:', err);
  }
  return getBenchmarkQCWorkspace();
}

export async function saveQCWorkspace(
  state: Omit<QCWorkspaceState, 'id' | 'updatedAt'>
): Promise<QCWorkspaceState> {
  const payload: QCWorkspaceState = {
    ...state,
    id: QC_WORKSPACE_STORAGE_KEY,
    updatedAt: new Date().toISOString()
  };
  await putItem<QCWorkspaceState>(STORES.SETTINGS, payload);
  return payload;
}
