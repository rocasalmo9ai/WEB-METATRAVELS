
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, Send, CheckCircle, Plane, DollarSign, Sparkles, ClipboardCheck, AlertTriangle, Zap, Target, ImageIcon, Loader2, RefreshCcw, Activity, Shield, Map } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { EmotionalStep } from '../components/EmotionalStep';
import { calculateEmotionalProfile } from '../services/scoring';
import { EmotionalProfile, CompositionState, Respondent, DiagnosisResult } from '../types';
import { GoogleGenAI } from '@google/genai';

const STORAGE_KEY = "metatravels_wizard_state_v3";

const INITIAL_COMPOSITION: CompositionState = {
  modality: "",
  ageBands: [],
  respondersMode: "adults_only",
  respondentsCount: 1,
  respondentsRoles: ['leader'],
  saveProfileConsent: false,
  saveRawAnswersConsent: true
};

const INITIAL_FORM_DATA = {
  composition: { ...INITIAL_COMPOSITION },
  respondents: [] as Respondent[],
  emotionalProfile: null as EmotionalProfile | null,
  diagnosisResult: null as DiagnosisResult | null,
  destination: '',
  startDate: '',
  endDate: '',
  travelers: '',
  budget: '',
  name: '',
  email: '',
  phone: ''
};

type StepStatus = 'idle' | 'loading' | 'ready' | 'error';

export const CustomTrip: React.FC = () => {
  const { t, language, getText } = useLanguage();
  
  const [step, setStep] = useState(1);
  const [stepStatus, setStepStatus] = useState<Record<number, StepStatus>>({
    1: 'ready', 2: 'ready', 3: 'idle', 4: 'idle', 5: 'idle'
  });
  const [step1Phase, setStep1Phase] = useState<'composition' | 'respondents_config' | 'questions' | 'kids' | 'complete'>('composition');
  const [activeRespondentIndex, setActiveRespondentIndex] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });

  const hasHydratedRef = useRef(false);
  const prevConsentRef = useRef<boolean | null>(null);

  const isStepComplete = useCallback((s: number): boolean => {
    switch (s) {
      case 1:
        return !!formData.diagnosisResult && !!formData.emotionalProfile && step1Phase === 'complete';
      case 2:
        return formData.destination.trim().length > 0;
      case 3:
        const b = parseFloat(formData.budget);
        return !isNaN(b) && b > 0 && formData.travelers.trim().length > 0;
      case 4:
        return formData.name.trim().length > 0 && /\S+@\S+\.\S+/.test(formData.email);
      case 5:
        return isSubmitted;
      default:
        return false;
    }
  }, [formData, step1Phase, isSubmitted]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadWizardState = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.formData) {
            setFormData(parsed.formData);
            setStep(parsed.step || 1);
            setStep1Phase(parsed.step1Phase || 'composition');
            setActiveRespondentIndex(parsed.activeRespondentIndex || 0);
            setStepStatus(parsed.stepStatus || { 1: 'ready', 2: 'ready', 3: 'idle', 4: 'idle', 5: 'idle' });
            if (parsed.generatedImage) setGeneratedImage(parsed.generatedImage);
            prevConsentRef.current = parsed.formData.composition.saveProfileConsent;
          }
        } catch (e) {
          console.error("Hydration failed", e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      hasHydratedRef.current = true;
    };

    loadWizardState();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasHydratedRef.current) return;

    const saveWizardState = () => {
      const consent = formData.composition.saveProfileConsent;

      if (consent) {
        const stateToSave = {
          formData,
          step,
          step1Phase,
          activeRespondentIndex,
          generatedImage,
          stepStatus,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } else {
        if (prevConsentRef.current === true) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      prevConsentRef.current = consent;
    };

    saveWizardState();
  }, [formData, step, step1Phase, activeRespondentIndex, generatedImage, stepStatus]);

  const handleRestart = useCallback(() => {
    setStep(1);
    setStep1Phase('composition');
    setActiveRespondentIndex(0);
    setIsSubmitted(false);
    setValidationError(null);
    setStepStatus({ 1: 'ready', 2: 'ready', 3: 'idle', 4: 'idle', 5: 'idle' });

    if (!formData.composition.saveProfileConsent) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData({ ...INITIAL_FORM_DATA });
      setGeneratedImage(null);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [formData.composition.saveProfileConsent]);

  useEffect(() => {
    if (isSubmitted) return; 
    let furthestAllowed = 1;
    for (let i = 1; i < 5; i++) {
      if (isStepComplete(i)) furthestAllowed = i + 1;
      else break;
    }
    if (step > furthestAllowed) {
      setStep(furthestAllowed);
    }
  }, [step, isStepComplete, isSubmitted]);

  const scoringResult = useMemo(() => {
    if (formData.composition.modality && formData.respondents.length > 0) {
      try {
        return calculateEmotionalProfile(
          formData.composition.modality as any,
          formData.respondents,
          { hasSmallKids: formData.composition.ageBands.some(b => b === "0-3" || b === "4-7") }
        );
      } catch (e) {
        console.error("Scoring error", e);
        return null;
      }
    }
    return null;
  }, [formData.respondents, formData.composition.modality, formData.composition.ageBands]);

  useEffect(() => {
    if (scoringResult?.status === "OK") {
      setFormData(prev => ({
        ...prev,
        emotionalProfile: scoringResult.profile,
        diagnosisResult: scoringResult.diagnosis
      }));
    }
  }, [scoringResult]);

  useEffect(() => {
    if (step === 3 && stepStatus[3] !== 'ready') {
      setStepStatus(prev => ({ ...prev, 3: 'loading' }));
      const timer = setTimeout(() => {
        setStepStatus(prev => ({ ...prev, 3: 'ready' }));
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [step]);

  const validateStepBeforeNext = (s: number): boolean => {
    setValidationError(null);
    if (s === 1) {
      if (!isStepComplete(1)) {
        setValidationError("Completa el diagnóstico emocional para continuar.");
        return false;
      }
    }
    if (s === 2) {
      if (!isStepComplete(2)) {
        setValidationError("Por favor, ingresa al menos un destino.");
        return false;
      }
    }
    if (s === 3) {
      const b = parseFloat(formData.budget);
      if (isNaN(b) || b <= 0) {
        setValidationError("Ingresa un presupuesto válido (mayor a 0).");
        return false;
      }
      if (formData.travelers.trim().length === 0) {
        setValidationError("Indica el número de viajeros.");
        return false;
      }
    }
    if (s === 4) {
      if (!isStepComplete(4)) {
        setValidationError("Verifica que tu nombre y email sean válidos.");
        return false;
      }
    }
    return true;
  };

  const handleUpdate = useCallback((data: any) => {
    setFormData(prev => {
      const next = { ...prev };
      if (data.composition) next.composition = { ...prev.composition, ...data.composition };
      if (data.respondents) next.respondents = data.respondents;
      return next;
    });
    if (data.phase) setStep1Phase(data.phase);
    if (data.activeRespondentIndex !== undefined) setActiveRespondentIndex(data.activeRespondentIndex);
  }, []);

  const handleNext = () => {
    if (!validateStepBeforeNext(step)) return;

    if (step < 5) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (step === 1) {
      if (step1Phase === 'questions' && activeRespondentIndex > 0) {
        setActiveRespondentIndex(activeRespondentIndex - 1);
      } else if (step1Phase === 'questions') {
        setStep1Phase('composition');
      } else if (step1Phase === 'respondents_config') {
        setStep1Phase('composition');
      } else if (step1Phase === 'complete') {
        setStep1Phase('questions');
      }
    } else {
      setStep(prev => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateVision = async () => {
    if (!formData.emotionalProfile || isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const p = formData.emotionalProfile;
      const prompt = `Luxury travel essence: ${p.architecture.rhythm}, ${p.architecture.environment}. Focus: ${getText(p.peak)}. 8k, cinematic, no people.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) {
      console.warn("Image gen failed", e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5) {
      if (!validateStepBeforeNext(4)) return;
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-white/10 p-16 rounded-[4rem] text-center max-w-2xl animate-fade-in shadow-3xl">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-8" />
          <h2 className="text-5xl font-bold text-white mb-6 font-serif tracking-tight">{t.customTrip.successTitle}</h2>
          <p className="text-neutral-400 text-xl font-light mb-12">{t.customTrip.successDesc}</p>
          <button 
            type="button" 
            onClick={handleRestart} 
            className="bg-primary hover:bg-primary-dark transition-all text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest active:scale-95 shadow-2xl shadow-primary/20"
          >
            {t.customTrip.btnHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">{t.customTrip.tag}</span>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 font-serif tracking-tighter leading-none">{t.customTrip.title}</h1>
          <p className="text-neutral-400 font-light max-w-2xl mx-auto text-xl">{t.customTrip.subtitle}</p>
        </div>

        {/* Dynamic Wizard Stepper */}
        <div className="flex justify-center mb-20 gap-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center grow last:grow-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${
                step === s 
                  ? 'bg-primary text-white scale-110 shadow-xl ring-4 ring-primary/20' 
                  : isStepComplete(s) 
                    ? 'bg-accent text-white' 
                    : 'bg-neutral-900 text-neutral-600 border border-white/5'
              }`}>
                {isStepComplete(s) && step !== s ? <CheckCircle size={20} /> : s}
              </div>
              {s < 5 && <div className={`grow mx-2 h-[2px] transition-all duration-500 ${isStepComplete(s) ? 'bg-accent/40' : 'bg-neutral-800'}`}></div>}
            </div>
          ))}
        </div>

        {/* Main Wizard Container (Layer 2) */}
        <div className="bg-neutral-900/80 backdrop-blur-3xl p-8 md:p-16 rounded-[4rem] border border-white/10 shadow-3xl">
          {validationError && (
            <div className="mb-8 bg-red-900/20 border border-red-500/30 p-6 rounded-[2.5rem] flex items-center gap-4 text-red-400 animate-fade-in">
              <AlertTriangle className="shrink-0" />
              <p className="text-sm font-medium">{validationError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: EMOTIONAL DIAGNOSIS */}
            {step === 1 && (
              <div className="animate-fade-in space-y-12">
                <EmotionalStep 
                  phase={step1Phase}
                  composition={formData.composition}
                  respondents={formData.respondents}
                  activeRespondentIndex={activeRespondentIndex}
                  language={language}
                  onUpdate={handleUpdate}
                  onReset={handleRestart}
                />
                
                {step1Phase === 'complete' && formData.emotionalProfile && (
                  <div className="mt-12 p-10 md:p-14 bg-neutral-800/40 rounded-[3rem] border border-white/10 shadow-2xl animate-fade-in">
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-accent">
                          <Zap size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Perfil Detectado</span>
                        </div>
                        <h4 className="text-4xl md:text-5xl font-serif text-white tracking-tight">{getText(formData.emotionalProfile.name)}</h4>
                        <p className="text-primary text-lg font-medium">{getText(formData.emotionalProfile.tagline)}</p>
                      </div>
                      <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-neutral-950 border border-white/10 flex items-center justify-center relative group shadow-inner">
                        {generatedImage ? (
                          <img src={generatedImage} alt="Vision" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        ) : (
                          <button type="button" onClick={generateVision} disabled={isGeneratingImage} className="flex flex-col items-center gap-6 text-neutral-600 hover:text-white transition-all">
                            {isGeneratingImage ? <Loader2 className="animate-spin w-10 h-10 text-primary" /> : <ImageIcon size={50} />}
                            <span className="text-xs font-bold uppercase tracking-widest">{isGeneratingImage ? 'Creando visión algorítmica...' : 'Visualizar mi viaje'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-12 border-t border-white/5">
                  <button type="button" onClick={handleBack} disabled={step1Phase === 'composition'} className="text-neutral-500 hover:text-white font-bold uppercase tracking-widest text-[10px] disabled:opacity-0 transition-opacity">Atrás</button>
                  <button type="button" onClick={handleNext} disabled={step1Phase !== 'complete'} className="bg-primary hover:bg-primary-dark text-white px-16 py-5 rounded-[2.5rem] font-bold uppercase tracking-widest text-xs disabled:opacity-30 shadow-xl shadow-primary/20 transition-all active:scale-95">Siguiente etapa</button>
                </div>
              </div>
            )}

            {/* STEP 2: PLANNING */}
            {step === 2 && formData.diagnosisResult && (
              <div className="animate-fade-in space-y-12">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-primary/20 rounded-2xl text-primary shadow-xl"><Plane size={28}/></div>
                  <h3 className="text-4xl md:text-5xl font-serif text-white tracking-tight">{t.customTrip.step2}</h3>
                </div>

                <div className="bg-neutral-800/40 p-10 rounded-[3rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Perfil Activo</p>
                    <h4 className="text-3xl font-serif text-white">{formData.emotionalProfile ? getText(formData.emotionalProfile.name) : '—'}</h4>
                  </div>
                  <div className="flex gap-10">
                    <div className="flex flex-col items-center">
                      <Activity size={24} className="text-primary mb-3" />
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">{formData.diagnosisResult.params.ritmo}</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-white/10 pl-10">
                      <Shield size={24} className="text-primary mb-3" />
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">{formData.diagnosisResult.params.estructura.split('_')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-white/10 pl-10">
                      <Map size={24} className="text-primary mb-3" />
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">{formData.diagnosisResult.params.entorno}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4 ml-2">Destino(s) prioritarios</label>
                  <input className="w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-white text-xl outline-none focus:border-primary/50 transition-all placeholder-neutral-700 shadow-inner" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} placeholder={t.customTrip.placeDest} />
                </div>

                <div className="flex justify-between border-t border-white/5 pt-12">
                  <button type="button" onClick={handleBack} className="text-neutral-500 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors">Atrás</button>
                  <button type="button" onClick={handleNext} className="bg-primary hover:bg-primary-dark text-white px-16 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95">Siguiente etapa</button>
                </div>
              </div>
            )}

            {/* STEP 3: BUDGET & STYLE */}
            {step === 3 && (
              <div className="animate-fade-in space-y-12">
                {stepStatus[3] === 'loading' ? (
                  <div className="text-center py-20 space-y-8">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
                    <h3 className="text-3xl text-white font-serif tracking-tight">Personalizando parámetros...</h3>
                    <p className="text-neutral-500 text-lg">Estamos orquestando las opciones según tu huella emocional.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-accent/20 rounded-2xl text-accent shadow-xl"><DollarSign size={28}/></div>
                      <h3 className="text-4xl md:text-5xl font-serif text-white tracking-tight">{t.customTrip.step3}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4 ml-2">Inversión estimada por persona (USD)</label>
                        <input className="w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-white text-xl outline-none focus:border-primary/50 shadow-inner" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="Ej. 7500" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4 ml-2">Número de viajeros</label>
                        <input className="w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-white text-xl outline-none focus:border-primary/50 shadow-inner" value={formData.travelers} onChange={e => setFormData({...formData, travelers: e.target.value})} placeholder="Ej. 2 adultos" />
                      </div>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-12">
                      <button type="button" onClick={handleBack} className="text-neutral-500 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors">Atrás</button>
                      <button type="button" onClick={handleNext} className="bg-primary hover:bg-primary-dark text-white px-16 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95">Siguiente etapa</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 4: CONTACT */}
            {step === 4 && (
              <div className="animate-fade-in space-y-12">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-primary/20 rounded-2xl text-primary shadow-xl"><ClipboardCheck size={28}/></div>
                  <h3 className="text-4xl md:text-5xl font-serif text-white tracking-tight">{t.customTrip.step4}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 ml-2">Nombre Completo</label>
                     <input required placeholder="Tu nombre" className="w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-white text-xl outline-none focus:border-primary/50 shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                     <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 ml-2">Correo Electrónico</label>
                     <input required type="email" placeholder="tucorreo@ejemplo.com" className="w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-white text-xl outline-none focus:border-primary/50 shadow-inner" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="flex justify-between pt-12 border-t border-white/5">
                  <button type="button" onClick={handleBack} className="text-neutral-500 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors">Atrás</button>
                  <button type="button" onClick={handleNext} className="bg-primary hover:bg-primary-dark text-white px-16 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95">Revisar Solicitud</button>
                </div>
              </div>
            )}

            {/* STEP 5: FINAL SUMMARY */}
            {step === 5 && (
              <div className="animate-fade-in space-y-12">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-accent/20 rounded-2xl text-accent shadow-xl"><CheckCircle size={28}/></div>
                  <h3 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Confirmar Travesía</h3>
                </div>
                <div className="bg-neutral-800/40 p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
                    <div className="space-y-2">
                       <span className="text-neutral-500 uppercase text-[10px] font-black tracking-[0.3em] block mb-2">Perfil Emocional</span>
                       <p className="text-2xl font-serif">{formData.emotionalProfile ? getText(formData.emotionalProfile.name) : '—'}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-neutral-500 uppercase text-[10px] font-black tracking-[0.3em] block mb-2">Destino Prioritario</span>
                       <p className="text-2xl font-serif">{formData.destination || '—'}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-neutral-500 uppercase text-[10px] font-black tracking-[0.3em] block mb-2">Viajero Titular</span>
                       <p className="text-2xl font-serif">{formData.name}</p>
                       <p className="text-neutral-400 text-sm font-light">{formData.email}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-neutral-500 uppercase text-[10px] font-black tracking-[0.3em] block mb-2">Presupuesto</span>
                       <p className="text-2xl font-serif">${parseFloat(formData.budget).toLocaleString()} USD <span className="text-sm font-light text-neutral-400">/ pax</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-12">
                  <button type="button" onClick={handleBack} className="text-neutral-500 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors">Atrás</button>
                  <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-20 py-7 rounded-[2.5rem] font-bold uppercase tracking-[0.3em] text-xs shadow-[0_20px_50px_rgba(245,158,11,0.3)] active:scale-95 transition-all">Enviar Solicitud Elite</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
