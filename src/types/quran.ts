export interface Juz {
  id: number;
  name: string;
  hizbs: Hizb[];
}

export interface Hizb {
  id: number;
  juzId: number;
  name: string;
  athman: Thumn[];
}

export interface Thumn {
  id: number;
  hizbId: number;
  name: string;
  order: number;
  memorized: boolean;
  memorizedAt?: Date;
  lastReviewed?: Date;
  reviewType?: 'recent' | 'old';
}

export interface DailyProgress {
  date: Date;
  juzReading: boolean;
  hizbListening: boolean;
  preparationReading: boolean;
  tafseerReading: boolean;
  thumnListening: boolean;
  thumnReading: boolean;
  thumnMemorization: boolean;
  thumnRepetition: number;
}