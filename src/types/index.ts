export interface Resume {
  id: string;
  originalFile: File;
  updatedContent?: string;
  status: 'processing' | 'completed' | 'error';
}

export interface InterviewPrep {
  questions: string[];
  talkingPoints: string[];
}

export interface JobDescription {
  url: string;
  content?: string;
}