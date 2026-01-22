
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number | null;
}

export interface MediaFile {
  data: string;
  mimeType: string;
  name: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}
