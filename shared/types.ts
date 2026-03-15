/**
 * Unified type exports
 */

export type ConferenceType = 'SAMUN' | 'JMUN';

export interface Resource {
  title: string;
  description: string;
  filename: string;
}

export interface PortalResource extends Resource {
  id: string;
  category: string;
  conferences?: ConferenceType[];
}

export interface ScheduleEvent {
  time: string;
  activity: string;
  location: string;
}

export interface ScheduleDay {
  day: string;
  date: string;
  conferences?: ConferenceType[];
  events: ScheduleEvent[];
}

export interface PortalEvent {
  id: string;
  name: string;
  description?: string;
  startDate: string | null;
  endDate: string | null;
  timezone: string | null;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  mapUrl?: string | null;
  externalMapUrl?: string | null;
}

export interface Committee {
  id: number;
  name: string;
  type: ConferenceType;
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

export interface HealthCheckStatus {
  status: 'ok' | 'degraded';
  detail: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  version: string | null;
  checks: {
    committees: HealthCheckStatus & {
      counts: Record<ConferenceType, number>;
    };
    events: HealthCheckStatus & {
      count: number;
    };
    resources: HealthCheckStatus & {
      count: number;
    };
    gallery: HealthCheckStatus & {
      eventCount: number;
      imageCount: number;
    };
  };
}
