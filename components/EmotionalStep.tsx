
import React, { useState, useEffect, useMemo } from 'react';
import { User, Users, Heart, Baby, ChevronRight, ShieldCheck, UserCheck, Zap, Activity, AlertCircle, CheckCircle, Save, Trash2 } from 'lucide-react';
import { Modality, LocalizedText, CompositionState, AgeBand, RespondentRole, Respondent } from '../types';

interface EmotionalStepProps {
  phase: 'composition' | 'respondents_config' | 'questions' | 'kids' | 'complete';
  composition: CompositionState;
  respondents: Respondent[];
  activeRespondentIndex: number;
  onUpdate: (data: { 
    composition?: Partial<CompositionState>; 
    respondents?: Respondent[]; 
    phase?: 'composition' | 'respondents_config' | 'questions' | 'kids' | 'complete';
    activeRespondentIndex?: number;
  }) => void;
  onReset?: () => void;
  language: 'es' | 'en';
}

const QUESTIONS_DATA = {
  solo: [
    { id: "IND_Q1", text: { es: "En un día raro donde nadie te pide nada, tú naturalmente…", en: "On a rare day where no one asks for anything, you naturally..." }, options: { es: ["Bajas estímulo y te escondes un poco", "Ordenas 2–3 cosas y te alineas", "Sales a moverte: acción primero"], en: ["Lower stimulus and hide away", "Sort 2-3 things and align yourself", "Get moving: action first"] } },
    { id: "IND_Q2", text: { es: "Si tu mente fuera un cuarto hoy, lo que más agradecería es…", en: "If your mind were a room today, what it would appreciate most is..." }, options: { es: ["Que apaguen el ruido y quede vacío", "Que todo esté en su lugar y se entienda fácil", "Que se abra: aire, calle, vida"], en: ["Noise off, empty space", "Everything in place, easy to understand", "Opened up: air, street, life"] } },
    { id: "IND_Q3", text: { es: "Cuando alguien te propone plan, tú prefieres…", en: "When someone suggests a plan, you prefer..." }, options: { es: ["Que ya venga armado (tú solo ejecutas)", "Elegir entre 2–3 rutas claras", "Decidir sobre la marcha"], en: ["Ready-made (you just execute)", "Choose between 2-3 clear routes", "Decide on the go"] } },
    { id: "IND_Q4", text: { es: "En ambientes nuevos, tú te sientes mejor cuando…", en: "In new environments, you feel best when..." }, options: { es: ["Puedes observar sin interactuar mucho", "Interactúas poco, pero elegido", "Hay energía social disponible (sin obligación)"], en: ["Observe without much interaction", "Interact little, but by choice", "Social energy available (no obligation)"] } },
    { id: "IND_Q5", text: { es: "El tipo de incomodidad que más te rompe el día es…", en: "The type of discomfort that most breaks your day is..." }, options: { es: ["Ruido / saturación / demasiada gente", "Micro-decisiones + logística que drena", "Estancarte: sentir que no pasa nada"], en: ["Noise / saturation / too many people", "Micro-decisions + draining logistics", "Stagnation: feeling nothing happens"] } },
    { id: "IND_Q6", text: { es: "Al final del día, sientes que valió la pena si…", en: "At the end of the day, you feel it was worth it if..." }, options: { es: ["Descansaste y te bajó el sistema", "Te quedó una idea clara", "Hiciste algo retador y te sentiste capaz"], en: ["Rested and system powered down", "Left with a clear idea", "Did something challenging and felt capable"] } },
    { id: "IND_Q7", text: { es: "Cuando pagas por calidad, lo que más valoras sin pensarlo es…", en: "When paying for quality, what you value most without thinking is..." }, options: { es: ["Privacidad + discreción", "Orden + diseño bien resuelto", "Acceso + puertas abiertas"], en: ["Privacy + discretion", "Order + well-resolved design", "Access + open doors"] } },
    { id: "IND_Q8", text: { es: "Una semana bien cerrada se siente como…", en: "A week well-concluded feels like..." }, options: { es: ["Ligereza", "Claridad", "Expansión"], en: ["Lightness", "Clarity", "Expansion"] } }
  ],
  couple: [
    { id: "COU_Q1", text: { es: "Elijan la escena que más se parece a ustedes hoy:", en: "Choose the scene that looks most like you today:" }, options: { es: ["Silencio cómodo, sin prisa", "Risa y descubrimiento", "Algo “especial” bien cuidado (detalle/estética)"], en: ["Comfortable silence, no rush", "Laughter and discovery", "Something 'special' well-cared for (detail/aesthetics)"] } },
    { id: "COU_Q2", text: { es: "Cuando se desacomodan como equipo, casi siempre es porque…", en: "When you get out of sync as a team, it's almost always because..." }, options: { es: ["Hay demasiadas decisiones pequeñas", "Van a ritmos distintos", "El entorno/social los desgasta"], en: ["Too many small decisions", "At different rhythms", "Environment/social wears you down"] } },
    { id: "COU_Q3", text: { es: "La forma más limpia de tomar decisiones entre ustedes es…", en: "The cleanest way to make decisions between you is..." }, options: { es: ["Uno propone y el otro valida", "Se reparten por turnos (bloques)", "Acuerdan lo mínimo y sueltan el resto"], en: ["One proposes, other validates", "Taking turns (blocks)", "Agree on minimum, let go of rest"] } },
    { id: "COU_Q4", text: { es: "La “distancia correcta” con el mundo sería…", en: "The 'correct distance' from the world would be..." }, options: { es: ["Burbuja total", "Privado con ventanas sociales", "Social con retiros puntuales"], en: ["Total bubble", "Private with social windows", "Social with punctual retreats"] } },
    { id: "COU_Q5", text: { es: "El “pulso” ideal para que ustedes funcionen estos días es…", en: "The ideal 'pulse' for you to function these days is..." }, options: { es: ["Pausado", "Balanceado", "Dinámico"], en: ["Paused", "Balanced", "Dynamic"] } },
    { id: "COU_Q6", text: { es: "El momento que más los une suele ser…", en: "The moment that most unites you is usually..." }, options: { es: ["Intimidad impecable (cuidada)", "Meta/actividad ganada juntos", "Estética/cultura que los eleva"], en: ["Intimidad impecable (cuidada)", "Meta/actividad ganada juntos", "Estética/cultura que los eleva"] } },
    { id: "COU_Q7", text: { es: "Esto se arruina si…", en: "This is ruined if..." }, options: { es: ["La logística se vuelve carga mental", "Hay que planear demasiado para que funcione", "Se siente “lo mismo” con otro fondo"], en: ["Logistics becomes mental load", "Must plan too much to work", "Feels like 'the same' with different background"] } },
    { id: "COU_Q8", text: { es: "Al final, lo que más quieren llevarse es…", en: "In the end, what you most want to take away is..." }, options: { es: ["Reconexión calmada", "Complicidad renovada", "Celebración lograda"], en: ["Reconexión calmada", "Complicidad renovada", "Celebración lograda"] } }
  ],
  family: [
    { id: "FAM_Q1", text: { es: "En planes con niños, el día se “tuerce” casi siempre cuando…", en: "In plans with kids, the day 'twists' almost always when..." }, options: { es: ["Se rompe el sueño/horario base", "Se rompe la comida (hambre/antojos)", "Se rompe los tiempos (traslados/esperas)"], en: ["Sleep/schedule broken", "Food (hunger/cravings) broken", "Timing (transfers/waits) broken"] } },
    { id: "FAM_Q2", text: { es: "Cuando aparece la típica crisis, el “botón de reset” que mejor les funciona es…", en: "When a typical crisis appears, the 'reset button' that works best is..." }, options: { es: ["Volver a base / parar todo y recomponer", "Resolver comida rápido y seguir", "Bajar estímulo (espacio/quietud) y simplificar"], en: ["Back to base / stop and recompose", "Resolve food fast and continue", "Lower stimulus (space/stillness) and simplify"] } },
    { id: "FAM_Q3", text: { es: "La regla invisible que más protege la armonía es…", en: "The invisible rule that most protects harmony is..." }, options: { es: ["Saber qué sigue (estructura clara)", "Bloques con aire (marco flexible)", "1–2 anclas y lo demás libre"], en: ["Know what's next (clear structure)", "Blocks with air (flexible frame)", "1-2 anchors, rest is free"] } },
    { id: "FAM_Q4", text: { es: "La dosis de novedad que hoy sí suma (sin factura) es…", en: "The dose of novelty that adds value today (without cost) is..." }, options: { es: ["Familiaridad bien hecha", "Una cosa nueva al día", "Inmersión fuerte, pero con soporte"], en: ["Familiarity well-done", "One new thing a day", "Strong immersion, but with support"] } },
    { id: "FAM_Q5", text: { es: "Cuando hay energías distintas (unos arriba/otros abajo), ustedes naturalmente…", en: "When there are different energies, you naturally..." }, options: { es: ["Ajustan a un ritmo medio para todos", "Se dividen en subgrupos por momentos", "Se turnan: “bloque kids” / “bloque adultos”"], en: ["Adjust to a middle rhythm for all", "Divide into subgroups by moments", "Take turns: 'kids block' / 'adult block'"] } },
    { id: "FAM_Q6", text: { es: "Para que los adultos descansen de verdad, lo que más cambia el juego es…", en: "For adults to truly rest, what changes the game most is..." }, options: { es: ["Que alguien externo cargue decisiones/logística", "Entorno predecible y seguro (cero sobresaltos)", "Entretenimiento confiable para niños, sin fricción"], en: ["External help with decisions/logistics", "Predictable/safe environment", "Reliable entertainment for kids, no friction"] } },
    { id: "FAM_Q7", text: { es: "Para niños 0–7, lo que mejor sostiene el ánimo es…", en: "For kids 0-7, what sustains mood best is..." }, options: { es: ["Juego integrado al plan", "Espacios dedicados (kids club/actividades)", "Rutina simple repetible"], en: ["Play integrated into the plan", "Dedicated spaces (kids club)", "Simple repeatable routine"] } },
    { id: "FAM_Q8", text: { es: "La señal de “valió la pena” para ustedes sería…", en: "The sign of 'it was worth it' for you would be..." }, options: { es: ["Paz real (todo fluyó)", "Vínculo (nos vimos / nos reímos)", "Historia (recuerdo fuerte compartido)"], en: ["Paz real (todo fluyó)", "Vínculo (nos vimos / nos reímos)", "Historia (recuerdo fuerte compartido)"] } }
  ],
  group: [
    { id: "GRP_Q1", text: { es: "Si este grupo fuera una “tripulación”, se parece más a…", en: "If this group were a 'crew', it looks most like..." }, options: { es: ["Exploradores (moverse/descubrir)", "Embajada cultural (capas/estética)", "Club privado (calma/nivel)"], en: ["Exploradores (moverse/descubrir)", "Embajada cultural (capas/estética)", "Club privado (calma/nivel)"] } },
    { id: "GRP_Q2", text: { es: "En la mesa, el clima que más les queda es…", en: "At the table, the vibe that fits you best is..." }, options: { es: ["Risa desinhibida", "Conversación larga y buena", "Ritual corto y luego libertad"], en: ["Risa desinhibida", "Conversación larga y buena", "Ritual corto y luego libertad"] } },
    { id: "GRP_Q3", text: { es: "Cuando este grupo disfruta más, normalmente es porque…", en: "When this group enjoys most, it's usually because..." }, options: { es: ["Está claro “qué sigue” y nadie se desgasta", "Hay marco y aire (sin rigidez)", "Se decide en el momento y sale bien"], en: ["Está claro “qué sigue” y nadie se desgasta", "Hay marco y aire (sin rigidez)", "Se decide en el momento y sale bien"] } },
    { id: "GRP_Q4", text: { es: "El rasgo no negociable del grupo es…", en: "The non-negotiable trait of the group is..." }, options: { es: ["Respeto a acuerdos/tiempos", "Flexibilidad sin juicio (nadie se culpa)", "Energía compartida (sube a todos)"], en: ["Respeto a acuerdos/tiempos", "Flexibilidad sin juicio (nadie se culpa)", "Energía compartida (sube a todos)"] } },
    { id: "GRP_Q5", text: { es: "El “trabajo real” de este plan para el grupo es…", en: "The 'real work' of this plan for the group is..." }, options: { es: ["Cuidar el vínculo y la confianza", "Crear una historia compartida", "Recuperar energía sin fricción"], en: ["Cuidar el vínculo y la confianza", "Crear una historia compartida", "Recuperar energía sin fricción"] } },
    { id: "GRP_Q6", text: { es: "El éxito sonaría más como…", en: "Success would sound like..." }, options: { es: ["Brindis y mesa perfecta", "Silencio frente a algo sublime", "Aplauso/golpe de energía tras un logro"], en: ["Brindis y mesa perfecta", "Silencio frente a algo sublime", "Aplauso/golpe de energía tras un logro"] } },
    { id: "GRP_Q7", text: { es: "La tensión que más aparece “por debajo” suele ser…", en: "The tension that most appears 'underneath' is..." }, options: { es: ["Sentirme arrastrado por un plan ajeno", "Injusticia de valor (pago/no lo disfruto)", "Fricción social (roles/egos/exclusión)"], en: ["Sentirme arrastrado por un plan ajeno", "Injusticia de valor (pago/no lo disfruto)", "Fricción social (roles/egos/exclusión)"] } },
    { id: "GRP_Q8", text: { es: "Si pudieran firmar una sola regla para evitar desgaste, sería…", en: "If you could sign one single rule to avoid burnout, it would be..." }, options: { es: ["“Expectativas cerradas antes de salir”", "“Meetpoints fijos + libertad dentro”", "“Una persona decide reservas para no discutir todo”"], en: ["“Expectativas cerradas antes de salir”", "“Meetpoints fijos + libertad dentro”", "“Una persona decide reservas para no discutir todo”"] } }
  ]
};

const ROLE_ICONS: Record<RespondentRole, any> = {
  leader: ShieldCheck,
  caregiver: UserCheck,
  energy: Zap,
  flex: Activity
};

const ROLE_LABELS: Record<string, LocalizedText> = {
  leader: { es: "Líder / Logística", en: "Leader / Logistics" },
  caregiver: { es: "Cuidador Principal", en: "Main Caregiver" },
  energy: { es: "Energía del Grupo", en: "Group Energy" },
  flex: { es: "Flexible", en: "Flexible" }
};

const getDefaultRoles = (mod: Modality | "", count: number): RespondentRole[] => {
  const roles: RespondentRole[] = new Array(count).fill('flex');
  if (count > 0) roles[0] = 'leader';
  if (count > 1) {
    if (mod === 'family') roles[1] = 'caregiver';
    else if (mod === 'group') roles[1] = 'energy';
  }
  return roles;
};

export const EmotionalStep: React.FC<EmotionalStepProps> = ({ phase, composition, respondents, activeRespondentIndex, onUpdate, onReset, language }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [compSubStep, setCompSubStep] = useState(0);
  const [localCount, setLocalCount] = useState<number>(composition.respondentsCount || 1);
  const [localRoles, setLocalRoles] = useState<RespondentRole[]>(composition.respondentsRoles || ['leader']);

  const currentQuestions = useMemo(() => {
    if (!composition.modality) return [];
    return (QUESTIONS_DATA as any)[composition.modality] || [];
  }, [composition.modality]);

  useEffect(() => {
    setCurrentIdx(0);
  }, [activeRespondentIndex, phase]);

  const handleSelectOption = (questionId: string, option: string) => {
    const newRespondents = [...respondents];
    const currentR = newRespondents[activeRespondentIndex];
    if (!currentR) return;

    currentR.answers = { ...currentR.answers, [questionId]: option };
    onUpdate({ respondents: newRespondents });

    if (currentIdx < currentQuestions.length - 1) {
      setTimeout(() => setCurrentIdx(prev => prev + 1), 250);
    } else {
      if (activeRespondentIndex < respondents.length - 1) {
        onUpdate({ activeRespondentIndex: activeRespondentIndex + 1 });
      } else {
        onUpdate({ phase: 'complete' });
      }
    }
  };

  const finalizeConfig = () => {
    const finalRespondents: Respondent[] = localRoles.map((role, i) => ({
      id: `R${i+1}`,
      role,
      weight: role === 'leader' ? 1.2 : 1.0,
      answers: {}
    }));

    onUpdate({
      respondents: finalRespondents,
      composition: { respondentsCount: localCount, respondentsRoles: localRoles },
      phase: 'questions',
      activeRespondentIndex: 0
    });
  };

  if ((phase === 'questions' || phase === 'complete') && (!composition.modality || respondents.length === 0)) {
    return (
      <div className="text-center p-20 bg-neutral-900/60 rounded-[4rem] border border-white/10 space-y-8 shadow-2xl">
        <AlertCircle size={64} className="text-red-500 mx-auto" />
        <h3 className="text-white font-serif text-3xl tracking-tight">Arquitectura interrumpida.</h3>
        <p className="text-neutral-500">Hubo un problema al preparar el motor de diagnóstico.</p>
        <button type="button" onClick={() => window.location.reload()} className="bg-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95">Reestablecer motor</button>
      </div>
    );
  }

  if (phase === 'composition') {
    if (compSubStep === 0) {
      return (
        <div className="space-y-12 animate-fade-in text-center">
          <div className="space-y-2">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Fase 01</span>
             <h4 className="text-white font-serif text-4xl md:text-5xl tracking-tight leading-tight">¿Con quién viajas esta vez?</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { id: 'solo', icon: User, label: language === 'es' ? 'Solo' : 'Solo' },
              { id: 'couple', icon: Heart, label: language === 'es' ? 'Pareja' : 'Couple' },
              { id: 'family', icon: Baby, label: language === 'es' ? 'Familia' : 'Family' },
              { id: 'group', icon: Users, label: language === 'es' ? 'Grupo' : 'Group' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onUpdate({ composition: { modality: item.id as Modality } });
                  setCompSubStep(1);
                }}
                className={`group p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-6 ${
                  composition.modality === item.id 
                    ? 'bg-primary border-primary shadow-[0_20px_60px_rgba(245,158,11,0.3)]' 
                    : 'bg-neutral-800/40 border-neutral-800 hover:border-white/20 hover:bg-neutral-800/60'
                }`}
              >
                <div className={`p-4 rounded-2xl transition-all ${composition.modality === item.id ? 'bg-white/20 text-white' : 'bg-neutral-900 text-neutral-500 group-hover:text-white'}`}>
                   <item.icon size={32} />
                </div>
                <span className={`font-black uppercase tracking-[0.2em] text-[11px] ${composition.modality === item.id ? 'text-white' : 'text-neutral-400'}`}>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-8">
             <label className="flex items-center gap-6 cursor-pointer group hover:bg-white/5 p-4 rounded-[2rem] transition-colors border border-transparent hover:border-white/5">
                <div className={`w-14 h-8 rounded-full p-1.5 transition-all duration-300 ${composition.saveProfileConsent ? 'bg-accent shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-neutral-800'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={composition.saveProfileConsent} 
                      onChange={(e) => onUpdate({ composition: { saveProfileConsent: e.target.checked } })}
                    />
                    <div className={`bg-white w-5 h-5 rounded-full transition-transform shadow-md ${composition.saveProfileConsent ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-black text-white uppercase tracking-widest mb-1">
                    {language === 'es' ? 'Activar persistencia de huella' : 'Activate footprint persistence'}
                  </span>
                  <span className="block text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
                    {language === 'es' ? 'Privacidad local en este dispositivo' : 'Local privacy on this device'}
                  </span>
                </div>
             </label>

             <button 
              type="button" 
              onClick={onReset}
              className="flex items-center gap-2 text-neutral-600 hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest px-6 py-3 border border-white/5 hover:border-red-500/20 rounded-full"
             >
                <Trash2 size={14} /> {language === 'es' ? 'Resetear Diagnóstico' : 'Reset Diagnosis'}
             </button>
          </div>
        </div>
      );
    }

    if (compSubStep === 1) {
      const bands: AgeBand[] = ["0-3", "4-7", "8-12", "13-17", "18+"];
      return (
        <div className="space-y-12 animate-fade-in text-center">
          <div className="space-y-2">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Fase 02</span>
             <h4 className="text-white font-serif text-4xl md:text-5xl tracking-tight leading-tight">¿Qué edades viajan?</h4>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {bands.map(band => (
              <button
                key={band}
                type="button"
                onClick={() => {
                  const current = composition.ageBands || [];
                  const next = current.includes(band) ? current.filter(b => b !== band) : [...current, band];
                  onUpdate({ composition: { ageBands: next } });
                }}
                className={`min-w-[120px] px-10 py-6 rounded-3xl border-2 transition-all font-bold text-lg ${
                    composition.ageBands?.includes(band) 
                    ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20 scale-105' 
                    : 'bg-neutral-800/40 border-neutral-800 text-neutral-500 hover:border-white/20 hover:text-white'}`}
              >
                {band}
              </button>
            ))}
          </div>
          <button 
            type="button"
            disabled={!composition.ageBands?.length}
            onClick={() => {
              if (composition.modality === 'solo') {
                onUpdate({ respondents: [{ id: 'R1', role: 'leader', weight: 1, answers: {} }], phase: 'questions' });
              } else {
                setLocalCount(composition.modality === 'couple' ? 2 : 2);
                setLocalRoles(getDefaultRoles(composition.modality as Modality, 2));
                onUpdate({ phase: 'respondents_config' });
              }
            }}
            className="mt-12 bg-primary hover:bg-primary-dark text-white px-20 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs disabled:opacity-30 shadow-2xl shadow-primary/30 transition-all active:scale-95"
          >
            Avanzar al Perfilado
          </button>
        </div>
      );
    }
  }

  if (phase === 'respondents_config') {
    return (
      <div className="space-y-12 animate-fade-in text-center max-w-3xl mx-auto">
        <div className="space-y-2">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Configuración</span>
             <h4 className="text-white font-serif text-4xl md:text-5xl tracking-tight leading-tight">Dinámica de Grupo</h4>
        </div>

        <div className="bg-neutral-800/40 p-10 md:p-14 rounded-[4rem] border border-white/10 space-y-12 shadow-2xl">
          <div className="space-y-6">
            <p className="text-neutral-400 uppercase tracking-[0.3em] text-[10px] font-black">¿Cuántas personas responderán el test?</p>
            <div className="flex justify-center gap-5">
              {[1, 2, 3, 4, 5].map(n => (
                <button 
                  key={n}
                  type="button"
                  onClick={() => {
                    setLocalCount(n);
                    setLocalRoles(getDefaultRoles(composition.modality as Modality, n));
                  }}
                  className={`w-16 h-16 rounded-[1.5rem] font-bold text-xl transition-all border-2 ${
                      localCount === n 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' 
                      : 'bg-neutral-900 border-neutral-900 text-neutral-600 hover:border-white/10'}`}
                >
                  {n === 5 ? '5+' : n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8 text-left">
            <p className="text-neutral-400 uppercase tracking-[0.3em] text-[10px] font-black text-center">Asigna roles estratégicos por perfil</p>
            <div className="space-y-4">
               {localRoles.map((role, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-6 bg-neutral-950/60 p-6 rounded-3xl border border-white/5 transition-all hover:bg-neutral-950/80">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-xs font-black text-primary shadow-inner">#{i+1}</div>
                <div className="flex flex-wrap gap-3 grow justify-center md:justify-start">
                  {Object.keys(ROLE_LABELS).map(r => {
                    const Icon = ROLE_ICONS[r as RespondentRole];
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          const next = [...localRoles];
                          next[i] = r as RespondentRole;
                          setLocalRoles(next);
                        }}
                        className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 border-2 transition-all ${
                            role === r 
                            ? 'bg-accent border-accent text-white shadow-lg' 
                            : 'bg-neutral-900 border-neutral-900 text-neutral-600 hover:border-white/10 hover:text-white'}`}
                      >
                        <Icon size={14} /> {ROLE_LABELS[r as RespondentRole][language]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            </div>
          </div>

          <button type="button" onClick={finalizeConfig} className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 transition-all active:scale-95">
            Iniciar Cuestionario Estratégico
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'questions') {
    const currentQ = currentQuestions[currentIdx];
    if (!currentQ) return null;
    const currentR = respondents[activeRespondentIndex];
    if (!currentR) return null;
    const Icon = ROLE_ICONS[currentR.role] || User;

    return (
      <div className="max-w-4xl mx-auto animate-fade-in space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-primary/20 p-4 rounded-2xl text-primary shadow-lg"><Icon size={24}/></div>
            <div>
              <p className="text-white font-serif text-2xl tracking-tight">Respondiente {activeRespondentIndex + 1} de {respondents.length}</p>
              <p className="text-accent font-black text-[10px] uppercase tracking-[0.3em]">{ROLE_LABELS[currentR.role][language]}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-neutral-900 px-6 py-3 rounded-full border border-white/5 shadow-inner">
             <span className="text-white font-black text-sm">{currentIdx + 1}</span>
             <span className="text-neutral-600 text-xs uppercase tracking-widest">de {currentQuestions.length}</span>
          </div>
        </div>

        {/* Question Area (Layer 2) */}
        <div className="bg-neutral-900/60 p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-3xl space-y-12">
          <p className="text-white font-serif text-3xl md:text-5xl leading-tight tracking-tight drop-shadow-lg">{currentQ.text[language]}</p>
          <div className="flex flex-col gap-5">
            {currentQ.options[language].map((opt: string) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt)}
                className="w-full p-8 md:p-10 rounded-[2.5rem] text-left text-sm md:text-base font-bold uppercase tracking-[0.1em] transition-all bg-neutral-800/40 border-2 border-transparent text-neutral-400 hover:bg-neutral-800/80 hover:border-primary/50 hover:text-white flex justify-between items-center group shadow-xl"
              >
                <span className="max-w-[85%]">{opt}</span>
                <div className="p-3 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 group-hover:bg-primary/20 text-primary">
                   <ChevronRight />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-24 animate-fade-in space-y-10 max-w-2xl mx-auto">
      <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_20px_60px_rgba(34,197,94,0.2)]">
         <CheckCircle size={50} className="text-green-400" />
      </div>
      <div className="space-y-4">
         <h3 className="text-white font-serif text-5xl tracking-tighter">Perfil Decodificado</h3>
         <p className="text-neutral-400 text-xl font-light leading-relaxed">Hemos procesado tu arquitectura emocional. Tu visión algorítmica está lista.</p>
      </div>
    </div>
  );
};
