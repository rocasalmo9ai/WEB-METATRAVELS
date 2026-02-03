
export type Language = 'es' | 'en';
export type Modality = "solo" | "couple" | "family" | "group";

export interface LocalizedText {
  es: string;
  en: string;
}

export type AgeBand = "0-3" | "4-7" | "8-12" | "13-17" | "18+";
export type RespondersMode = "adults_only" | "adults_plus_kids_8_12" | "adults_plus_teens_13_17";
export type RespondentRole = "leader" | "caregiver" | "energy" | "flex";

export interface Respondent {
  id: string;
  role: RespondentRole;
  weight: number;
  answers: Record<string, string>;
}

export interface DiagnosisResult {
  modality: Modality;
  profileId: string;
  scores: Record<string, number>;
  params: {
    ritmo: "respirable" | "balanceado" | "intenso";
    estructura: "concierge_total" | "marco_con_bloques" | "libre_curado";
    entorno: "refugio" | "frontera" | "hub";
    sociabilidad: "baja" | "media" | "alta";
  };
  guardrails: string[];
  confidence: "low" | "medium" | "high";
}

export interface CompositionState {
  modality: Modality | "";
  ageBands: AgeBand[];
  respondersMode: RespondersMode;
  respondentsCount: number;
  respondentsRoles: RespondentRole[];
  familyMustHave?: string;
  saveProfileConsent: boolean;
  saveRawAnswersConsent: boolean;
}

export interface EmotionalMeta {
  composition: CompositionState;
  family?: {
    adults: number;
    childrenCount: number;
    childrenAges: number[];
    childrenCanAnswer: boolean[];
    hasSmallKids: boolean;
  }
}

export interface EmotionalProfile {
  id: string;
  modality: Modality;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  evidenceChips: LocalizedText[];
  architecture: {
    rhythm: "respirable" | "balanceado" | "intenso";
    structure: "concierge_total" | "marco_con_bloques" | "libre_curado";
    environment: "refugio" | "frontera" | "hub";
    sociability: "baja" | "media" | "alta";
  };
  peak: LocalizedText;
  end: LocalizedText;
  avoid: LocalizedText;
  durationNights: { min: number; max: number };
  guardrails: LocalizedText[];
  recommendation: {
    destinationType: ("urbano" | "naturaleza" | "mixto" | "resort" | "base_camp")[];
    itineraryStyle: ("base_unica" | "multi_sede" | "modular")[];
    guideLevel: "concierge_total" | "mixto" | "minimo";
    activityDensity: "baja" | "media" | "alta";
  };
}

export interface ItineraryDay {
  day: number;
  title: LocalizedText;
  description: LocalizedText;
  image?: string;
}

export interface Amenities {
  flightsIntl: boolean;
  flightsDomestic: boolean;
  accommodation: boolean;
  tours: boolean;
  guide: boolean;
  meals: boolean;
  tips: boolean;
  taxes: boolean;
}

export interface Package {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle?: LocalizedText; 
  destination: LocalizedText;
  duration: LocalizedText;
  price: number;
  currency: string;
  level: 'Estándar' | 'Premium' | 'Lujo';
  type: 'Safari' | 'Playa' | 'Cultura' | 'Crucero' | 'Expedición';
  heroImage: string;
  description: LocalizedText;
  highlights: LocalizedText[];
  itinerary: ItineraryDay[];
  includes: LocalizedText[];
  excludes: LocalizedText[];
  dates: LocalizedText; 
  minGroupSize?: number;
  amenities: Amenities; 
}

export interface WeatherData {
  date: string;
  minTemp: number;
  maxTemp: number;
  rainProb: number;
  condition: 'sun' | 'partly_cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'drizzle_freezing' | 'rain' | 'rain_freezing' | 'snow' | 'rain_showers' | 'snow_showers' | 'thunder' | 'thunder_hail' | 'windy';
  humidity?: number;
  windSpeed?: number;
  sunrise?: string;
  sunset?: string;
  waterTemp?: number | null; 
  waterTempSource?: 'forecast' | 'climatology' | 'current' | 'unavailable';
  cloudCover?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  status: 'Nuevo' | 'Contactado' | 'Cotización' | 'Ganado';
  date: string;
  modality?: string;
  emotionalAnswers?: Record<string, string>;
  emotionalProfileId?: string;
}

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; 
}
