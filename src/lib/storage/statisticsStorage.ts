/**
 * Food Science AI - Statistical Datasets Storage Engine
 * Persistent storage for experimental designs, treatment groups, raw replicates,
 * and scientific benchmark datasets.
 */

import { StatisticalDataset } from '../../types/statistics';
import { getDb, STORES } from './indexedDb';

export const SAMPLE_FOOD_DATASETS: StatisticalDataset[] = [
  {
    id: 'sample-dpph-temp',
    title: 'اثر دمای استخراج بر فعالیت آنتی‌اکسیدانی چای سبز (DPPH)',
    description: 'آزمایش در قالب طرح کاملاً تصادفی (CRD) برای ارزیابی درصد مهار رادیکال آزاد DPPH در دمای استخراج‌های مختلف.',
    foodMatrix: 'عصاره برگ چای سبز (Camellia sinensis)',
    designType: 'crd',
    responseVariable: {
      name: 'مهار رادیکال آزاد DPPH',
      unit: '%'
    },
    independentFactors: [
      {
        id: 'f-temp',
        name: 'دمای استخراج',
        unit: '°C',
        levels: ['40', '60', '80', '100']
      }
    ],
    alphaLevel: 0.05,
    userClarifications: {
      independence: 'fully_independent',
      scaleType: 'continuous_ratio'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groups: [
      {
        id: 'grp-40',
        name: 'دمای ۴۰ درجه سانتی‌گراد',
        treatmentLabel: '40°C',
        factorValues: { 'f-temp': '40' },
        replicates: [
          { id: 'r-40-1', repNumber: 1, rawValue: 42.5 },
          { id: 'r-40-2', repNumber: 2, rawValue: 43.1 },
          { id: 'r-40-3', repNumber: 3, rawValue: 41.8 },
          { id: 'r-40-4', repNumber: 4, rawValue: 42.9 }
        ]
      },
      {
        id: 'grp-60',
        name: 'دمای ۶۰ درجه سانتی‌گراد',
        treatmentLabel: '60°C',
        factorValues: { 'f-temp': '60' },
        replicates: [
          { id: 'r-60-1', repNumber: 1, rawValue: 64.2 },
          { id: 'r-60-2', repNumber: 2, rawValue: 65.5 },
          { id: 'r-60-3', repNumber: 3, rawValue: 63.8 },
          { id: 'r-60-4', repNumber: 4, rawValue: 64.9 }
        ]
      },
      {
        id: 'grp-80',
        name: 'دمای ۸۰ درجه سانتی‌گراد',
        treatmentLabel: '80°C',
        factorValues: { 'f-temp': '80' },
        replicates: [
          { id: 'r-80-1', repNumber: 1, rawValue: 78.4 },
          { id: 'r-80-2', repNumber: 2, rawValue: 79.1 },
          { id: 'r-80-3', repNumber: 3, rawValue: 77.6 },
          { id: 'r-80-4', repNumber: 4, rawValue: 78.8 }
        ]
      },
      {
        id: 'grp-100',
        name: 'دمای ۱۰۰ درجه سانتی‌گراد',
        treatmentLabel: '100°C',
        factorValues: { 'f-temp': '100' },
        replicates: [
          { id: 'r-100-1', repNumber: 1, rawValue: 71.3 },
          { id: 'r-100-2', repNumber: 2, rawValue: 70.8 },
          { id: 'r-100-3', repNumber: 3, rawValue: 72.1 },
          { id: 'r-100-4', repNumber: 4, rawValue: 71.0 }
        ]
      }
    ]
  },
  {
    id: 'sample-emulsion-gum',
    title: 'پایداری امولسیون سس مایونز کم‌چرب با هیدروکلوئیدها',
    description: 'مقایسه اثر افزودن هیدروکلوئیدهای صمغ زانتان، گوار و پکتین بر درصد پایداری امولسیون سس در برابر جدایش فازی.',
    foodMatrix: 'سس مایونز کم چرب (امولسیون O/W)',
    designType: 'crd',
    responseVariable: {
      name: 'پایداری امولسیون',
      unit: '%'
    },
    independentFactors: [
      {
        id: 'f-gum',
        name: 'نوع پایدارکننده',
        levels: ['شاهد (بدون هیدروکلوئید)', 'صمغ زانتان ۰.۳٪', 'صمغ گوار ۰.۳٪', 'پکتین ۰.۳٪']
      }
    ],
    alphaLevel: 0.05,
    userClarifications: {
      independence: 'fully_independent',
      scaleType: 'continuous_ratio'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groups: [
      {
        id: 'g-control',
        name: 'شاهد (بدون هیدروکلوئید)',
        treatmentLabel: 'Control',
        replicates: [
          { id: 'r-ctrl-1', repNumber: 1, rawValue: 55.4 },
          { id: 'r-ctrl-2', repNumber: 2, rawValue: 56.1 },
          { id: 'r-ctrl-3', repNumber: 3, rawValue: 54.8 }
        ]
      },
      {
        id: 'g-xanthan',
        name: 'صمغ زانتان ۰.۳٪',
        treatmentLabel: 'Xanthan Gum',
        replicates: [
          { id: 'r-xnt-1', repNumber: 1, rawValue: 92.4 },
          { id: 'r-xnt-2', repNumber: 2, rawValue: 91.8 },
          { id: 'r-xnt-3', repNumber: 3, rawValue: 93.1 }
        ]
      },
      {
        id: 'g-guar',
        name: 'صمغ گوار ۰.۳٪',
        treatmentLabel: 'Guar Gum',
        replicates: [
          { id: 'r-guar-1', repNumber: 1, rawValue: 84.5 },
          { id: 'r-guar-2', repNumber: 2, rawValue: 85.2 },
          { id: 'r-guar-3', repNumber: 3, rawValue: 83.9 }
        ]
      },
      {
        id: 'g-pectin',
        name: 'پکتین ۰.۳٪',
        treatmentLabel: 'Pectin',
        replicates: [
          { id: 'r-pec-1', repNumber: 1, rawValue: 74.2 },
          { id: 'r-pec-2', repNumber: 2, rawValue: 75.0 },
          { id: 'r-pec-3', repNumber: 3, rawValue: 73.8 }
        ]
      }
    ]
  },
  {
    id: 'sample-shelf-life-kinetics',
    title: 'سینتیک رشد باکتری‌های کلسی‌فرم طی نگهداری شیر پاستوریزه',
    description: 'رگرسیون خطی و همبستگی شمارش باکتریایی نسبت به روزهای نگهداری در دمای یخچال ۴ درجه سانتی‌گراد.',
    foodMatrix: 'شیر کامل پاستوریزه هموژنیزه',
    designType: 'crd',
    responseVariable: {
      name: 'جمعیت باکتریایی',
      unit: 'Log CFU/mL'
    },
    independentFactors: [
      {
        id: 'f-day',
        name: 'زمان نگهداری',
        unit: 'روز',
        levels: ['1', '3', '5', '7', '10', '14']
      }
    ],
    alphaLevel: 0.05,
    userClarifications: {
      independence: 'fully_independent',
      scaleType: 'log_microbial'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groups: [
      {
        id: 'g-d1',
        name: 'روز اول نگهداری',
        treatmentLabel: '1',
        replicates: [
          { id: 'r-d1-1', repNumber: 1, rawValue: 1.85 },
          { id: 'r-d1-2', repNumber: 2, rawValue: 1.90 },
          { id: 'r-d1-3', repNumber: 3, rawValue: 1.82 }
        ]
      },
      {
        id: 'g-d3',
        name: 'روز سوم نگهداری',
        treatmentLabel: '3',
        replicates: [
          { id: 'r-d3-1', repNumber: 1, rawValue: 2.30 },
          { id: 'r-d3-2', repNumber: 2, rawValue: 2.35 },
          { id: 'r-d3-3', repNumber: 3, rawValue: 2.28 }
        ]
      },
      {
        id: 'g-d5',
        name: 'روز پنجم نگهداری',
        treatmentLabel: '5',
        replicates: [
          { id: 'r-d5-1', repNumber: 1, rawValue: 3.12 },
          { id: 'r-d5-2', repNumber: 2, rawValue: 3.18 },
          { id: 'r-d5-3', repNumber: 3, rawValue: 3.05 }
        ]
      },
      {
        id: 'g-d7',
        name: 'روز هفتم نگهداری',
        treatmentLabel: '7',
        replicates: [
          { id: 'r-d7-1', repNumber: 1, rawValue: 4.25 },
          { id: 'r-d7-2', repNumber: 2, rawValue: 4.30 },
          { id: 'r-d7-3', repNumber: 3, rawValue: 4.19 }
        ]
      },
      {
        id: 'g-d10',
        name: 'روز دهم نگهداری',
        treatmentLabel: '10',
        replicates: [
          { id: 'r-d10-1', repNumber: 1, rawValue: 5.60 },
          { id: 'r-d10-2', repNumber: 2, rawValue: 5.72 },
          { id: 'r-d10-3', repNumber: 3, rawValue: 5.55 }
        ]
      }
    ]
  }
];

export async function getAllDatasets(): Promise<StatisticalDataset[]> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.STATISTICAL_DATASETS], 'readonly');
      const store = transaction.objectStore(STORES.STATISTICAL_DATASETS);
      const request = store.getAll();

      request.onsuccess = () => {
        let items: StatisticalDataset[] = request.result || [];
        if (items.length === 0) {
          // Seed with benchmark datasets
          seedDefaultDatasets().then((seeded) => resolve(seeded));
          return;
        }
        resolve(items);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Falling back to local samples due to storage error:', error);
    return SAMPLE_FOOD_DATASETS;
  }
}

export async function getDatasetById(id: string): Promise<StatisticalDataset | null> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.STATISTICAL_DATASETS], 'readonly');
      const store = transaction.objectStore(STORES.STATISTICAL_DATASETS);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          // Check samples
          const sample = SAMPLE_FOOD_DATASETS.find((s) => s.id === id);
          resolve(sample || null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    const sample = SAMPLE_FOOD_DATASETS.find((s) => s.id === id);
    return sample || null;
  }
}

export async function saveDataset(dataset: StatisticalDataset): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.STATISTICAL_DATASETS], 'readwrite');
    const store = transaction.objectStore(STORES.STATISTICAL_DATASETS);
    const updated = {
      ...dataset,
      updatedAt: new Date().toISOString()
    };
    const request = store.put(updated);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDataset(id: string): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.STATISTICAL_DATASETS], 'readwrite');
    const store = transaction.objectStore(STORES.STATISTICAL_DATASETS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function seedDefaultDatasets(): Promise<StatisticalDataset[]> {
  const db = await getDb();
  return new Promise((resolve) => {
    const transaction = db.transaction([STORES.STATISTICAL_DATASETS], 'readwrite');
    const store = transaction.objectStore(STORES.STATISTICAL_DATASETS);

    SAMPLE_FOOD_DATASETS.forEach((sample) => {
      store.put(sample);
    });

    transaction.oncomplete = () => {
      resolve(SAMPLE_FOOD_DATASETS);
    };

    transaction.onerror = () => {
      resolve(SAMPLE_FOOD_DATASETS);
    };
  });
}
