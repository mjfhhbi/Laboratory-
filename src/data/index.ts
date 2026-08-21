/**
 * Data layer definitions for Food Science AI.
 * Reserved for upcoming modules (standards, formulas, lab records, calculations).
 * No mock or fake data is populated at this stage according to specifications.
 */

export interface SystemMeta {
  version: string;
  stage: string;
  initializedAt: string;
}

export const SYSTEM_META: SystemMeta = {
  version: '1.0.0-skeleton',
  stage: 'Part 1 of 10 - Base Architecture',
  initializedAt: new Date().toISOString()
};
