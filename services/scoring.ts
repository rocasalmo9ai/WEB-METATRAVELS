
import { EmotionalProfile, Modality, LocalizedText, Respondent, DiagnosisResult } from '../types';

export type ScoringResult = 
  | { status: "OK"; profile: EmotionalProfile; diagnosis: DiagnosisResult }
  | { status: "NEEDS_TIEBREAKER"; question: TieBreakerQuestion };

export interface TieBreakerQuestion {
  id: string;
  text: LocalizedText;
  options: {
    label: LocalizedText;
    profileId: string;
  }[];
}

const SCORING_MAP: Record<Modality, Record<string, string>> = {
  solo: {
    "Bajas estímulo y te escondes un poco": "IND_01",
    "Ordenas 2–3 cosas y te alineas": "IND_02",
    "Sales a moverte: acción primero": "IND_03",
    "Que apaguen el ruido y quede vacío": "IND_01",
    "Que todo esté en su lugar y se entienda fácil": "IND_02",
    "Que se abra: aire, calle, vida": "IND_03",
    "Que ya venga armado (tú solo ejecutas)": "IND_01",
    "Elegir entre 2–3 rutas claras": "IND_02",
    "Decidir sobre la marcha": "IND_03",
    "Puedes observar sin interactuar mucho": "IND_01",
    "Interactúas poco, pero elegido": "IND_02",
    "Hay energía social disponible (sin obligación)": "IND_03",
    "Ruido / saturación / demasiada gente": "IND_01",
    "Micro-decisiones + logística que drena": "IND_04",
    "Estancarte: sentir que no pasa nada": "IND_03",
    "Descansaste y te bajó el sistema": "IND_01",
    "Te quedó una idea clara": "IND_02",
    "Hiciste algo retador y te sentiste capaz": "IND_03",
    "Privacidad + discreción": "IND_01",
    "Orden + diseño bien resuelto": "IND_02",
    "Acceso + puertas abiertas": "IND_03",
    "Ligereza": "IND_01",
    "Claridad": "IND_02",
    "Expansión": "IND_03"
  },
  couple: {
    "Silencio cómodo, sin prisa": "COU_01",
    "Risa y descubrimiento": "COU_02",
    "Algo “especial” bien cuidado (detalle/estética)": "COU_03",
    "Hay demasiadas decisiones pequeñas": "COU_04",
    "Van a ritmos distintos": "COU_01",
    "El entorno/social los desgasta": "COU_03",
    "Uno propone y el otro valida": "COU_04",
    "Se reparten por turnos (bloques)": "COU_02",
    "Acuerdan lo mínimo y sueltan el resto": "COU_04",
    "Burbuja total": "COU_01",
    "Privado con ventanas sociales": "COU_04",
    "Social con retiros puntuales": "COU_03",
    "Pausado": "COU_01",
    "Balanceado": "COU_04",
    "Dinámico": "COU_02",
    "Intimidad impecable (cuidada)": "COU_01",
    "Meta/actividad ganada juntos": "COU_02",
    "Estética/cultura que los eleva": "COU_03",
    "La logística se vuelve carga mental": "COU_04",
    "Hay que planear demasiado para que funcione": "COU_04",
    "Se siente “lo mismo” con otro fondo": "COU_02",
    "Reconexión calmada": "COU_01",
    "Complicidad renovada": "COU_02",
    "Celebración lograda": "COU_03"
  },
  family: {
    "Se rompe el sueño/horario base": "FAM_01",
    "Se rompe la comida (hambre/antojos)": "FAM_02",
    "Se rompe los tiempos (traslados/esperas)": "FAM_01",
    "Volver a base / parar todo y recomponer": "FAM_01",
    "Resolver comida rápido y seguir": "FAM_02",
    "Bajar estímulo (espacio/quietud) y simplificar": "FAM_03",
    "Saber qué sigue (estructura clara)": "FAM_01",
    "Bloques con aire (marco flexible)": "FAM_03",
    "1–2 anclas y lo demás libre": "FAM_04",
    "Familiaridad bien hecha": "FAM_01",
    "Una cosa nueva al día": "FAM_03",
    "Inmersión fuerte, pero con soporte": "FAM_04",
    "Ajustan a un ritmo medio para todos": "FAM_02",
    "Se dividen en subgrupos por momentos": "FAM_03",
    "Se turnan: “bloque kids” / “bloque adultos”": "FAM_04",
    "Que alguien externo cargue decisiones/logística": "FAM_01",
    "Entorno predecible y seguro (cero sobresaltos)": "FAM_01",
    "Entretenimiento confiable para niños, sin fricción": "FAM_02",
    "Juego integrado al plan": "FAM_03",
    "Espacios dedicados (kids club/actividades)": "FAM_02",
    "Rutina simple repetible": "FAM_01",
    "Paz real (todo fluyó)": "FAM_01",
    "Vínculo (nos vimos / nos reímos)": "FAM_03",
    "Historia (recuerdo fuerte compartido)": "FAM_04",
    "Moverte y jugar": "FAM_02",
    "Ver cosas nuevas": "FAM_04",
    "Descansar y estar tranquilo": "FAM_01",
    "Hay muchas reglas": "FAM_04",
    "Nos tardamos muchísimo": "FAM_01",
    "No sé qué sigue": "FAM_03"
  },
  group: {
    "Exploradores (moverse/descubrir)": "GRP_04",
    "Embajada cultural (capas/estética)": "GRP_01",
    "Club privado (calma/nivel)": "GRP_02",
    "Risa desinhibida": "GRP_03",
    "Conversación larga y buena": "GRP_01",
    "Ritual corto y luego libertad": "GRP_02",
    "Está claro “qué sigue” y nadie se desgasta": "GRP_01",
    "Hay marco y aire (sin rigidez)": "GRP_02",
    "Se decide en el momento y sale bien": "GRP_03",
    "Respeto a acuerdos/tiempos": "GRP_01",
    "Flexibilidad sin juicio (nadie se culpa)": "GRP_02",
    "Energía compartida (sube a todos)": "GRP_03",
    "Cuidar el vínculo y la confianza": "GRP_02",
    "Crear una historia compartida": "GRP_04",
    "Recuperar energía sin fricción": "GRP_01",
    "Brindis y mesa perfecta": "GRP_03",
    "Silencio frente a algo sublime": "GRP_01",
    "Aplauso/golpe de energía tras un logro": "GRP_04",
    "Sentirme arrastrado por un plan ajeno": "GRP_01",
    "Injusticia de valor (pago/no lo disfruto)": "GRP_02",
    "Fricción social (roles/egos/exclusión)": "GRP_02",
    "“Expectativas cerradas antes de salir”": "GRP_01",
    "“Meetpoints fijos + libertad dentro”": "GRP_02",
    "“Una persona decide reservas para no discutir todo”": "GRP_03"
  }
};

const TIE_BREAKERS: Record<Modality, TieBreakerQuestion> = {
  solo: {
    id: "TB_IND",
    text: { es: "Cuando todo sale ‘bien’, lo que más valoras es:", en: "When everything goes 'right', what you value most is:" },
    options: [
      { label: { es: "No decidir nada", en: "Not making any decisions" }, profileId: "IND_04" },
      { label: { es: "Tener espacio mental", en: "Having mental space" }, profileId: "IND_01" }
    ]
  },
  couple: {
    id: "TB_COU",
    text: { es: "El viaje gana puntos si:", en: "The trip earns points if:" },
    options: [
      { label: { es: "Alguien externo lo orquesta", en: "Someone external orchestrates it" }, profileId: "COU_04" },
      { label: { es: "Se siente íntimo y simple", en: "It feels intimate and simple" }, profileId: "COU_01" }
    ]
  },
  family: {
    id: "TB_FAM",
    text: { es: "La victoria del viaje es:", en: "The trip's victory is:" },
    options: [
      { label: { es: "Niños regulados + adultos tranquilos", en: "Regulated kids + calm adults" }, profileId: "FAM_01" },
      { label: { es: "Todos con recuerdos distintos pero compatibles", en: "Everyone with different but compatible memories" }, profileId: "FAM_03" }
    ]
  },
  group: {
    id: "TB_GRP",
    text: { es: "Para que el grupo fluya:", en: "For the group to flow:" },
    options: [
      { label: { es: "Una ruta y horarios claros", en: "A clear route and schedules" }, profileId: "GRP_01" },
      { label: { es: "Puntos de encuentro y libertad", en: "Meeting points and freedom" }, profileId: "GRP_02" }
    ]
  }
};

const PROFILE_DATA: Record<string, EmotionalProfile> = {
  "IND_01": {
    id: "IND_01", modality: "solo",
    name: { es: "Retiro Curado", en: "Curated Retreat" },
    tagline: { es: "Silencio como nuevo lujo", en: "Silence as new luxury" },
    description: { es: "Buscas un espacio de introspección profunda.", en: "You seek a space for deep introspection." },
    evidenceChips: [{ es: "Privacidad", en: "Privacy" }, { es: "Silencio", en: "Silence" }],
    architecture: { rhythm: "respirable", structure: "concierge_total", environment: "refugio", sociability: "baja" },
    peak: { es: "Amanecer en soledad", en: "Sunrise in solitude" },
    end: { es: "Ligereza mental", en: "Mental lightness" },
    avoid: { es: "Sobreestímulo", en: "Overstimulation" },
    durationNights: { min: 4, max: 8 },
    guardrails: [{ es: "Discreción absoluta", en: "Absolute discretion" }],
    recommendation: { destinationType: ["naturaleza"], itineraryStyle: ["base_unica"], guideLevel: "minimo", activityDensity: "baja" }
  },
  "IND_02": {
    id: "IND_02", modality: "solo",
    name: { es: "Exploración con Foco", en: "Focused Exploration" },
    tagline: { es: "Orden y diseño", en: "Order and design" },
    description: { es: "Viajas para aprender con un marco claro.", en: "You travel to learn within a clear framework." },
    evidenceChips: [{ es: "Estructura", en: "Structure" }, { es: "Curiosidad", en: "Curiosity" }],
    architecture: { rhythm: "balanceado", structure: "marco_con_bloques", environment: "hub", sociability: "media" },
    peak: { es: "Descubrimiento cultural", en: "Cultural discovery" },
    end: { es: "Claridad", en: "Clarity" },
    avoid: { es: "Fricción logística", en: "Logistical friction" },
    durationNights: { min: 6, max: 10 },
    guardrails: [{ es: "Expertos locales", en: "Local experts" }],
    recommendation: { destinationType: ["urbano"], itineraryStyle: ["modular"], guideLevel: "mixto", activityDensity: "media" }
  },
  "IND_03": {
    id: "IND_03", modality: "solo",
    name: { es: "Ruptura Energética", en: "Energetic Break" },
    tagline: { es: "Adrenalina y expansión", en: "Adrenaline and expansion" },
    description: { es: "Buscas el movimiento para crecer.", en: "You seek movement to grow." },
    evidenceChips: [{ es: "Impacto", en: "Impact" }, { es: "Intensidad", en: "Intensity" }],
    architecture: { rhythm: "intenso", structure: "libre_curado", environment: "frontera", sociability: "alta" },
    peak: { es: "Reto superado", en: "Challenge overcome" },
    end: { es: "Empoderamiento", en: "Empowerment" },
    avoid: { es: "Encierro", en: "Confinement" },
    durationNights: { min: 5, max: 9 },
    guardrails: [{ es: "Seguridad premium", en: "Premium safety" }],
    recommendation: { destinationType: ["naturaleza"], itineraryStyle: ["multi_sede"], guideLevel: "mixto", activityDensity: "alta" }
  },
  "IND_04": {
    id: "IND_04", modality: "solo",
    name: { es: "Reinicio con Contención", en: "Contained Restart" },
    tagline: { es: "Cuidado experto", en: "Expert care" },
    description: { es: "Necesitas un reset sin esfuerzo.", en: "You need a reset without effort." },
    evidenceChips: [{ es: "Cuidado", en: "Care" }, { es: "Seguridad", en: "Safety" }],
    architecture: { rhythm: "respirable", structure: "concierge_total", environment: "refugio", sociability: "baja" },
    peak: { es: "Sorpresa elegante", en: "Elegant surprise" },
    end: { es: "Renovación", en: "Renewal" },
    avoid: { es: "Decisiones", en: "Decisions" },
    durationNights: { min: 3, max: 6 },
    guardrails: [{ es: "Concierge 24/7", en: "24/7 Concierge" }],
    recommendation: { destinationType: ["resort"], itineraryStyle: ["base_unica"], guideLevel: "concierge_total", activityDensity: "baja" }
  },
  "COU_01": {
    id: "COU_01", modality: "couple",
    name: { es: "Santuario en Pareja", en: "Couple Sanctuary" },
    tagline: { es: "Reconexión íntima", en: "Intimate reconnection" },
    description: { es: "Buscas una burbuja de paz compartida.", en: "You seek a shared peace bubble." },
    evidenceChips: [{ es: "Intimidad", en: "Intimacy" }, { es: "Calma", en: "Calm" }],
    architecture: { rhythm: "respirable", structure: "concierge_total", environment: "refugio", sociability: "baja" },
    peak: { es: "Cena bajo las estrellas", en: "Dinner under the stars" },
    end: { es: "Sintonía total", en: "Total sync" },
    avoid: { es: "Exposición social", en: "Social exposure" },
    durationNights: { min: 4, max: 9 },
    guardrails: [{ es: "Privacidad total", en: "Total privacy" }],
    recommendation: { destinationType: ["resort", "naturaleza"], itineraryStyle: ["base_unica"], guideLevel: "concierge_total", activityDensity: "baja" }
  },
  "COU_02": {
    id: "COU_02", modality: "couple",
    name: { es: "Aventura Cómplice", en: "Complicit Adventure" },
    tagline: { es: "Dinamismo y reto", en: "Dynamism and challenge" },
    description: { es: "Vivir experiencias potentes juntos.", en: "Living powerful experiences together." },
    evidenceChips: [{ es: "Complicidad", en: "Complicity" }, { es: "Energía", en: "Energy" }],
    architecture: { rhythm: "intenso", structure: "marco_con_bloques", environment: "frontera", sociability: "media" },
    peak: { es: "Cumbre alcanzada", en: "Summit reached" },
    end: { es: "Inspiración", en: "Inspiration" },
    avoid: { es: "Rutina", en: "Routine" },
    durationNights: { min: 7, max: 12 },
    guardrails: [{ es: "Guía privado", en: "Private guide" }],
    recommendation: { destinationType: ["naturaleza"], itineraryStyle: ["multi_sede"], guideLevel: "mixto", activityDensity: "alta" }
  },
  "COU_03": {
    id: "COU_03", modality: "couple",
    name: { es: "Celebración Estética", en: "Aesthetic Celebration" },
    tagline: { es: "Brindis al diseño", en: "Toast to design" },
    description: { es: "Celebrar en entornos de alta belleza.", en: "Celebrating in environments of high beauty." },
    evidenceChips: [{ es: "Estética", en: "Aesthetics" }, { es: "Social", en: "Social" }],
    architecture: { rhythm: "balanceado", structure: "marco_con_bloques", environment: "hub", sociability: "alta" },
    peak: { es: "Evento orquestado", en: "Orchestrated event" },
    end: { es: "Alegría", en: "Joy" },
    avoid: { es: "Cosas genéricas", en: "Generic things" },
    durationNights: { min: 5, max: 10 },
    guardrails: [{ es: "Acceso VIP", en: "VIP access" }],
    recommendation: { destinationType: ["urbano", "mixto"], itineraryStyle: ["modular"], guideLevel: "mixto", activityDensity: "media" }
  },
  "COU_04": {
    id: "COU_04", modality: "couple",
    name: { es: "Reajuste Suave", en: "Soft Readjustment" },
    tagline: { es: "Cero fricción", en: "Zero friction" },
    description: { es: "Reencuadrar la pareja sin esfuerzo.", en: "Reframing the couple effortlessly." },
    evidenceChips: [{ es: "Cuidado", en: "Care" }, { es: "Facilidad", en: "Ease" }],
    architecture: { rhythm: "balanceado", structure: "concierge_total", environment: "refugio", sociability: "media" },
    peak: { es: "Decisión delegada", en: "Delegated decision" },
    end: { es: "Bienestar", en: "Well-being" },
    avoid: { es: "Fricción", en: "Friction" },
    durationNights: { min: 6, max: 11 },
    guardrails: [{ es: "Logística premium", en: "Premium logistics" }],
    recommendation: { destinationType: ["resort"], itineraryStyle: ["base_unica"], guideLevel: "concierge_total", activityDensity: "media" }
  },
  "FAM_01": {
    id: "FAM_01", modality: "family",
    name: { es: "Base Segura", en: "Secure Base" },
    tagline: { es: "Contención y orden", en: "Containment and order" },
    description: { es: "Protegiendo el ritmo de todos.", en: "Protecting everyone's pace." },
    evidenceChips: [{ es: "Logística", en: "Logistics" }, { es: "Seguridad", en: "Safety" }],
    architecture: { rhythm: "respirable", structure: "concierge_total", environment: "refugio", sociability: "baja" },
    peak: { es: "Unión sin caos", en: "Unity without chaos" },
    end: { es: "Paz familiar", en: "Family peace" },
    avoid: { es: "Esperas", en: "Waiting" },
    durationNights: { min: 7, max: 14 },
    guardrails: [{ es: "Servicios VIP", en: "VIP services" }],
    recommendation: { destinationType: ["resort"], itineraryStyle: ["base_unica"], guideLevel: "concierge_total", activityDensity: "baja" }
  },
  "FAM_02": {
    id: "FAM_02", modality: "family",
    name: { es: "Tribu Relax & Play", en: "Relax & Play Tribe" },
    tagline: { es: "Juego y aire libre", en: "Play and outdoors" },
    description: { es: "Diversión compartida sin presiones.", en: "Shared fun without pressure." },
    evidenceChips: [{ es: "Juego", en: "Play" }, { es: "Libertad", en: "Freedom" }],
    architecture: { rhythm: "balanceado", structure: "marco_con_bloques", environment: "frontera", sociability: "alta" },
    peak: { es: "Aventura ligera", en: "Light adventure" },
    end: { es: "Risas", en: "Laughter" },
    avoid: { es: "Reglas rígidas", en: "Rigid rules" },
    durationNights: { min: 7, max: 12 },
    guardrails: [{ es: "Kids club premium", en: "Premium kids club" }],
    recommendation: { destinationType: ["resort", "naturaleza"], itineraryStyle: ["base_unica"], guideLevel: "mixto", activityDensity: "media" }
  },
  "FAM_03": {
    id: "FAM_03", modality: "family",
    name: { es: "Exploradores por Capas", en: "Layered Explorers" },
    tagline: { es: "Novedad controlada", en: "Controlled novelty" },
    description: { es: "Descubriendo el mundo por etapas.", en: "Discovering the world in stages." },
    evidenceChips: [{ es: "Curiosidad", en: "Curiosity" }, { es: "Estructura", en: "Structure" }],
    architecture: { rhythm: "balanceado", structure: "marco_con_bloques", environment: "hub", sociability: "media" },
    peak: { es: "Hito cultural", en: "Cultural milestone" },
    end: { es: "Aprendizaje", en: "Learning" },
    avoid: { es: "Desorden", en: "Disorder" },
    durationNights: { min: 8, max: 15 },
    guardrails: [{ es: "Guías adaptados", en: "Adapted guides" }],
    recommendation: { destinationType: ["mixto"], itineraryStyle: ["modular"], guideLevel: "mixto", activityDensity: "media" }
  },
  "FAM_04": {
    id: "FAM_04", modality: "family",
    name: { es: "Ruta Cultural Protegida", en: "Protected Cultural Route" },
    tagline: { es: "Inmersión segura", en: "Safe immersion" },
    description: { es: "Acceso cultural con soporte total.", en: "Cultural access with total support." },
    evidenceChips: [{ es: "Cultura", en: "Culture" }, { es: "Soporte", en: "Support" }],
    architecture: { rhythm: "intenso", structure: "concierge_total", environment: "hub", sociability: "media" },
    peak: { es: "Momento 'wow'", en: "Wow moment" },
    end: { es: "Asombro", en: "Amaze" },
    avoid: { es: "Improvisación", en: "Improvisation" },
    durationNights: { min: 10, max: 18 },
    guardrails: [{ es: "Logística elite", en: "Elite logistics" }],
    recommendation: { destinationType: ["urbano", "mixto"], itineraryStyle: ["multi_sede"], guideLevel: "concierge_total", activityDensity: "alta" }
  },
  "GRP_01": {
    id: "GRP_01", modality: "group",
    name: { es: "Curaduría Dirigida", en: "Directed Curation" },
    tagline: { es: "Liderazgo y claridad", en: "Leadership and clarity" },
    description: { es: "Alguien orquesta, todos disfrutan.", en: "Someone orchestrates, all enjoy." },
    evidenceChips: [{ es: "Orden", en: "Order" }, { es: "Puntualidad", en: "Punctuality" }],
    architecture: { rhythm: "balanceado", structure: "concierge_total", environment: "hub", sociability: "media" },
    peak: { es: "Ruta impecable", en: "Impeccable route" },
    end: { es: "Satisfacción", en: "Satisfaction" },
    avoid: { es: "Caos", en: "Chaos" },
    durationNights: { min: 6, max: 12 },
    guardrails: [{ es: "Plan cerrado", en: "Fixed plan" }],
    recommendation: { destinationType: ["urbano"], itineraryStyle: ["modular"], guideLevel: "concierge_total", activityDensity: "media" }
  },
  "GRP_02": {
    id: "GRP_02", modality: "group",
    name: { es: "Democracia Modular", en: "Modular Democracy" },
    tagline: { es: "Libertad compartida", en: "Shared freedom" },
    description: { es: "Encuentros y espacios libres.", en: "Meetings and free spaces." },
    evidenceChips: [{ es: "Flexibilidad", en: "Flexibility" }, { es: "Respeto", en: "Respect" }],
    architecture: { rhythm: "respirable", structure: "marco_con_bloques", environment: "refugio", sociability: "baja" },
    peak: { es: "Villa compartida", en: "Shared villa" },
    end: { es: "Autonomía", en: "Autonomy" },
    avoid: { es: "Decidir todo", en: "Deciding everything" },
    durationNights: { min: 7, max: 14 },
    guardrails: [{ es: "Espacios amplios", en: "Wide spaces" }],
    recommendation: { destinationType: ["naturaleza"], itineraryStyle: ["base_unica"], guideLevel: "minimo", activityDensity: "baja" }
  },
  "GRP_03": {
    id: "GRP_03", modality: "group",
    name: { es: "Celebración Orquestada", en: "Orchestrated Celebration" },
    tagline: { es: "Brillo social", en: "Social shine" },
    description: { es: "Energía alta en grupo.", en: "High group energy." },
    evidenceChips: [{ es: "Brillo", en: "Shine" }, { es: "Evento", en: "Event" }],
    architecture: { rhythm: "intenso", structure: "marco_con_bloques", environment: "hub", sociability: "alta" },
    peak: { es: "Mesa épica", en: "Epic table" },
    end: { es: "Celebración", en: "Celebration" },
    avoid: { es: "Aburrimiento", en: "Boredom" },
    durationNights: { min: 4, max: 8 },
    guardrails: [{ es: "Acceso VIP", en: "VIP access" }],
    recommendation: { destinationType: ["urbano"], itineraryStyle: ["base_unica"], guideLevel: "mixto", activityDensity: "alta" }
  },
  "GRP_04": {
    id: "GRP_04", modality: "group",
    name: { es: "Expedición de Impacto", en: "Impact Expedition" },
    tagline: { es: "Reto compartido", en: "Shared challenge" },
    description: { es: "Frontera y descubrimiento.", en: "Frontier and discovery." },
    evidenceChips: [{ es: "Impacto", en: "Impact" }, { es: "Reto", en: "Challenge" }],
    architecture: { rhythm: "intenso", structure: "libre_curado", environment: "frontera", sociability: "media" },
    peak: { es: "Hito geográfico", en: "Geographic milestone" },
    end: { es: "Logro", en: "Achievement" },
    avoid: { es: "Planteamiento plano", en: "Flat plan" },
    durationNights: { min: 10, max: 18 },
    guardrails: [{ es: "Logística elite", en: "Elite logistics" }],
    recommendation: { destinationType: ["naturaleza", "base_camp"], itineraryStyle: ["multi_sede"], guideLevel: "mixto", activityDensity: "alta" }
  }
};

/**
 * Final Weighted Scoring Engine
 */
export const calculateEmotionalProfile = (
  modality: Modality,
  respondents: Respondent[],
  meta?: { hasSmallKids?: boolean }
): ScoringResult => {
  const scores: Record<string, number> = {};
  const currentMap = SCORING_MAP[modality];
  
  if (!currentMap) {
      // Fallback
      const defaultId = modality === 'solo' ? 'IND_01' : modality === 'couple' ? 'COU_01' : modality === 'family' ? 'FAM_01' : 'GRP_01';
      const defProf = PROFILE_DATA[defaultId];
      return { 
        status: "OK", 
        profile: defProf,
        diagnosis: createDiagnosisObject(modality, defaultId, {}, defProf)
      };
  }

  // 1. Accumulate weighted scores from all respondents
  let totalPossibleWeight = 0;
  respondents.forEach(resp => {
    const answers = Object.values(resp.answers);
    totalPossibleWeight += answers.length * resp.weight;
    answers.forEach(val => {
      const profileId = currentMap[val];
      if (profileId) {
        scores[profileId] = (scores[profileId] || 0) + resp.weight;
      }
    });
  });

  // 2. Family Bias (Small kids logic)
  if (modality === "family" && meta?.hasSmallKids) {
    scores["FAM_01"] = (scores["FAM_01"] || 0) + 1.5;
  }

  // 3. Resolve Tie-Breakers (From user explicit answers if available)
  const leader = respondents.find(r => r.role === 'leader') || respondents[0];
  const tbKey = `${modality}_TB`;
  if (leader.answers[tbKey] && PROFILE_DATA[leader.answers[tbKey]]) {
    const chosenId = leader.answers[tbKey];
    const prof = PROFILE_DATA[chosenId];
    return { 
      status: "OK", 
      profile: prof,
      diagnosis: createDiagnosisObject(modality, chosenId, scores, prof, "high")
    };
  }

  // 4. Find Winner
  const scoreEntries = Object.entries(scores);
  if (scoreEntries.length === 0) {
      const defaultId = modality === 'solo' ? 'IND_01' : modality === 'couple' ? 'COU_01' : modality === 'family' ? 'FAM_01' : 'GRP_01';
      const defProf = PROFILE_DATA[defaultId];
      return { 
        status: "OK", 
        profile: defProf,
        diagnosis: createDiagnosisObject(modality, defaultId, {}, defProf)
      };
  }

  const maxScore = Math.max(...scoreEntries.map(e => e[1]));
  const candidates = scoreEntries.filter(e => e[1] === maxScore).map(e => e[0]);

  if (candidates.length > 1) {
    return { status: "NEEDS_TIEBREAKER", question: TIE_BREAKERS[modality] };
  }

  const winnerId = candidates[0];
  const profile = PROFILE_DATA[winnerId] || PROFILE_DATA["IND_01"];
  
  // Confidence calculation
  let confidence: "low" | "medium" | "high" = "medium";
  const ratio = maxScore / (totalPossibleWeight || 1);
  if (ratio > 0.6) confidence = "high";
  else if (ratio < 0.3) confidence = "low";

  return { 
    status: "OK", 
    profile, 
    diagnosis: createDiagnosisObject(modality, winnerId, scores, profile, confidence)
  };
};

function createDiagnosisObject(
  modality: Modality, 
  profileId: string, 
  scores: Record<string, number>, 
  profile: EmotionalProfile,
  confidence: "low" | "medium" | "high" = "medium"
): DiagnosisResult {
  return {
    modality,
    profileId,
    scores,
    params: {
      ritmo: profile.architecture.rhythm,
      estructura: profile.architecture.structure,
      entorno: profile.architecture.environment,
      sociabilidad: profile.architecture.sociability
    },
    guardrails: profile.guardrails.map(g => g.es),
    confidence
  };
}
