export interface ReferenceStats {
  totalRows: number;
  uniqueKeys: number;
  lastUpdated: Date;
}

export interface ProcessingResult {
  output: string;
  matchCount: number;
  missingCount: number;
}