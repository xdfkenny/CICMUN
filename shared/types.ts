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
