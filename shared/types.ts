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
  chairName: string | null;
  chairPhoto: string | null;
  coChairName: string | null;
  coChairPhoto: string | null;
  secretaryName: string | null;
  secretaryPhoto: string | null;
  topicA: string;
  topicB: string | null;
  image?: string;
  summary?: string;
  resources?: Resource[];
}
