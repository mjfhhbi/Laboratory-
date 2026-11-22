/**
 * Food Science AI - Scientific PDF Analysis, Structured Extraction & Verification Types
 * Part 24 of 30
 */

export type PdfAnalysisAction =
  | 'summary'
  | 'methodology'
  | 'materials_equipment'
  | 'parameters'
  | 'results'
  | 'tables'
  | 'references'
  | 'comparison'
  | 'qa';

export type EvidenceType =
  | 'direct_quote'
  | 'table_data'
  | 'numerical_parameter'
  | 'inferred_summary';

export interface AttachedPdfPage {
  pageNumber: number;
  sectionHeading?: string;
  text: string;
  isOcr?: boolean;
}

export interface AttachedPdfDocument {
  id: string;
  title: string;
  fileName: string;
  fileSizeFormatted?: string;
  pageCount: number;
  isScanned: boolean;
  sourceId?: string;
  authorOrOrg?: string;
  year?: string;
  pages: AttachedPdfPage[];
  uploadedAt?: string;
}

export interface ExtractedClaimWithEvidence {
  id: string;
  claimText: string;
  sourceTitle: string;
  sourceDocId: string;
  pageNumber: number;
  sectionHeading?: string;
  evidenceType: EvidenceType;
  quoteExcerpt?: string;
  confidence: 'verified' | 'source_backed' | 'unverified';
}

export interface ExtractedParameterItem {
  name: string;
  value: string;
  unit?: string;
  pageNumber: number;
  isLimit?: boolean;
  condition?: string;
}

export interface ExtractedTableItem {
  id: string;
  title: string;
  pageNumber: number;
  headers: string[];
  rows: string[][];
}

export interface ComparativeAspectItem {
  aspect: string;
  doc1Finding: string;
  doc2Finding: string;
  agreementStatus: 'agreed' | 'discrepancy' | 'different_scope';
  details: string;
}

export interface PdfAnalysisResult {
  actionType: PdfAnalysisAction;
  analyzedDocuments: Array<{
    id: string;
    title: string;
    fileName: string;
    pageCount: number;
    isScanned?: boolean;
  }>;
  claims: ExtractedClaimWithEvidence[];
  parametersFound?: ExtractedParameterItem[];
  tablesFound?: ExtractedTableItem[];
  notMentionedInDocument?: string[];
  comparativeAspects?: ComparativeAspectItem[];
  timestamp?: string;
}
