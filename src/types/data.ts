export interface DataRow {
  [key: string]: any;
}

export interface DataSet {
  id: string;
  name: string;
  data: DataRow[];
  columns: string[];
  source: 'csv' | 'json' | 'manual' | 'api' | 'web';
  uploadedAt: Date;
  rowCount: number;
  columnCount: number;
  hasIssues?: boolean;
  issues?: DataIssue[];
}

export interface DataIssue {
  type: 'missing' | 'duplicate' | 'outlier' | 'format';
  description: string;
  rowIndex?: number;
  columnName?: string;
  value?: any;
}

export interface UploadProgress {
  stage: 'uploading' | 'parsing' | 'analyzing' | 'complete';
  progress: number;
  message: string;
}