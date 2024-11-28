export interface Resume {
  id: string;
  originalFile: File;
  status: 'processing' | 'completed' | 'error';
  updatedPdfUrl?: string;
} 