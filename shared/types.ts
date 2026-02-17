/**
 * Unified type exports
 */

export interface Resource {
  title: string;
  description: string;
  filename: string;
}

export interface Committee {
  id: number;
  name: string;
  type: 'SAMUN' | 'JMUN';
  chairName: string;
  chairPhoto: string | null;
  coChairName: string;
  coChairPhoto: string | null;
  secretaryName: string;
  secretaryPhoto: string | null;
  topicA: string;
  topicB: string | null;
  image?: string;
  summary?: string;
  resources?: Resource[];
}

export interface CommitteeBrief {
  committeeId: number;
  background: string;
  keyQuestions: string[];
  recommendedSources: { title: string; url: string }[];
  positionChecklist: string[];
}

export interface GlossaryTerm {
  term: string;
  definition_en: string;
  definition_es: string;
  tags: string[];
}

export interface AllocationEntry {
  committeeId: number;
  committeeName: string;
  countries: { name: string; status: 'available' | 'assigned' | 'reserved' }[];
}
