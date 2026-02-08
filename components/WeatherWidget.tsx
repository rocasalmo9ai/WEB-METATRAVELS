import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  CloudRain,
  Sun,
  Wind,
  Waves,
  Calendar,
  MapPin,
  Thermometer,
  Info,
  Shirt,
  Loader2,
  CloudLightning,
  Cloud,
  History,
  Snowflake,
  CloudFog,
  Globe,
  CloudSun,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
} from 'lucide-react';
import { searchLocation, getForecast } from '../services/weatherService';
import { GeoLocation, WeatherData } from '../types';
import { useLanguage } from './LanguageContext';

declare global {
  interface Window {
    jspdf: any;
  }
}

type DateModalType = null | 'start' | 'end';

export const WeatherWidget: React.FC = () => {
  const { t, language } = useLanguage();

  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEstimated, setIsEstimated] = useState(false);

  // Mobile date picker fix (iPhone): open date input inside a modal
  const [isMobile, setIsMobile] = useState(false);
  const [dateModal, setDateModal] = useState<DateModalType>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(max-width: 639px)'); // Tailwind sm breakpoint
    const update = () => setIsMobile(mq.matches);

    update();

    // Safari iOS support
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else {
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  useEffect(() => {
    // scroll-lock when modal open
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    if (dateModal) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [dateModal]);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) setEndDate(startDate);
  }, [startDate, endDate]);

  const formatShortDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return iso;
    }
  };

  // ✅ Score 0–100: convierte datos en decisión (turismo/actividades)
  const scoreDay = (day: WeatherData) => {
    const rain = Math.min(100, Math.max(0, day.rainProb || 0));
    const maxT = day.maxTemp ?? 0;
    const wind = day.windSpeed ?? 0;
    const cond = day.condition;

    let score = 100;

    // lluvia pesa fuerte
    score -= rain * 0.8;

    // viento: penaliza por arriba de 15 km/h
    score -= Math.max(0, wind - 15) * 1.4;

    // confort térmico para turismo
    if (maxT < 18) score -= (18 - maxT) * 2.2;
    if (maxT > 32) score -= (maxT - 32) * 2.0;

    // condiciones “molestas”
    if (cond === 'thunder') score -= 18;
    if (cond === 'snow') score -= 22;
    if (cond === 'fog') score -= 10;
    if (cond === 'rain' || cond === 'drizzle') score -= 8;

    // clamp
    score = Math.round(Math.min(100, Math.max(0, score)));
    return score;
  };

  const weatherAnalysis = useMemo(() => {
    if (!forecast.length) return null;

    const avgRain = forecast.reduce((acc, day) => acc + (day.rainProb || 0), 0) / forecast.length;
    const avgMaxTemp = forecast.reduce((acc, day) => acc + (day.maxTemp || 0), 0) / forecast.length;
    const maxWind = Math.max(...forecast.map((day) => day.windSpeed || 0));
    const extremeHeat = forecast.some((day) => (day.maxTemp || 0) > 32);

    let status: 'favorable' | 'variable' | 'unfavorable' = 'variable';
    if (avgRain < 20 && avgMaxTemp > 18 && avgMaxTemp < 32) status = 'favorable';
    if (avgRain > 50) status = 'unfavorable';

    let summaryText = t.weather.summary.mixedDays;
    if (avgRain < 15) summaryText = t.weather.summary.sunnyDays;
    if (avgRain > 50) summaryText = t.weather.summary.rainyDays;

    // ✅ ranking por score
    const scored = forecast
      .map((d, i) => ({ day: d, idx: i, score: scoreDay(d) }))
      .sort((a, b) => b.score - a.score);

    const best = scored.slice(0, Math.min(2, scored.length));
    const worst = [...scored].reverse().slice(0, Math.min(2, scored.length));

    // “evitar” si realmente son malos; si todo es bueno, no alarmar
    const avoid = worst.filter((x) => x.score <= 58 || (x.day.rainProb || 0) >= 60 || (x.day.windSpeed || 0) >= 35);

    const tripScore = Math.round(scored.reduce((acc, x) => acc + x.score, 0) / scored.length);

    return {
      status,
      summaryText,
      extremeHeat,
      maxWind,
      scoredMap: new Map(scored.map((x) => [x.idx, x.score])),
      bestDays: best,
      avoidDays: avoid,
      tripScore,
    };
  }, [forecast, t, language]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2 && !selectedLocation) {
        try {
          const results = await searchLocation(query);
          setSuggestions(results);
        } catch {
          console.warn('[Weather Hardening] Geo API issue.');
        }
      } else if (query.length < 2) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedLocation]);

  const selectLocation = (loc: GeoLocation) => {
    setSelectedLocation(loc);
    setSuggestions([]);
    setQuery(`${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}`);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (selectedLocation) setSelectedLocation(null);
    setError('');
  };

  const fetchForecastData = async (loc: GeoLocation) => {
    try {
      const data = await getForecast(loc.latitude, loc.longitude, startDate, endDate);
      if (!data || data.length === 0) {
        setError(t.weather.errorApi);
        setForecast([]);
        return;
      }

      const start = new Date(startDate);
      const now = new Date();
      const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setIsEstimated(diffDays > 14);
      setForecast(data);
    } catch {
      setError(t.weather.errorApi);
      setForecast([]);
    }
  };

  const handleFetchClick = async () => {
    setError('');

    if (!startDate || !endDate) {
      setError(t.weather.errorDates);
      return;
    }

    if (!selectedLocation && query.trim().length < 2) {
      setError(t.weather.errorLoc);
      return;
    }

    setLoading(true);
    let locationToUse = selectedLocation;

    if (!locationToUse) {
      try {
        const results = await searchLocation(query);
        if (results && results.length > 0) {
          locationToUse = results[0];
          setSelectedLocation(locationToUse);
          setQuery(`${locationToUse.name}, ${locationToUse.country}`);
          setSuggestions([]);
        } else {
          setError(t.weather.errorNotFound);
          setLoading(false);
          return;
        }
      } catch {
        setError(t.weather.errorApi);
        setLoading(false);
        return;
      }
    }

    if (locationToUse && locationToUse.latitude && locationToUse.longitude) {
      await fetchForecastData(locationToUse);
    } else {
      setError(t.weather.errorLoc);
    }

    setLoading(false);
  };

  const getTravelTip = (day: WeatherData) => {
    const cond = day.condition;
    if (cond === 'thunder') return t.weather.tips.rain;
    if (cond === 'rain' || cond === 'drizzle') return t.weather.tips.rain;
    if (cond === 'snow') return t.weather.tips.snow;
    if ((day.maxTemp || 0) > 28) return t.weather.tips.hot;
    if ((day.maxTemp || 0) < 15) return t.weather.tips.cold;
    if (day.windSpeed && day.windSpeed > 25) return t.weather.tips.wind;
    return t.weather.tips.nice;
  };

  const renderIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sun':
        return <Sun className="text-orange-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'partly_cloudy':
        return <CloudSun className="text-yellow-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'cloudy':
        return <Cloud className="text-gray-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'fog':
        return <CloudFog className="text-slate-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'drizzle':
        return <CloudRain className="text-blue-300 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'rain':
        return <CloudRain className="text-blue-500 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'thunder':
        return <CloudLightning className="text-purple-600 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'windy':
        return <Wind className="text-slate-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      case 'snow':
        return <Snowflake className="text-cyan-100 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
      default:
        return <CloudSun className="text-yellow-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
    }
  };

  const openDateModal = (type: 'start' | 'end') => {
    setError('');
    setDateModal(type);
  };

  /**
   * Mobile modal date behavior:
   * - selecting START auto-advances to END (no OK)
   * - selecting END closes modal (no OK)
   * Keep both fields visible so user can reopen either side.
   */
  const onModalDateChange = (val: string) => {
    setError('');

    if (dateModal === 'start') {
      setStartDate(val);

      // If endDate is empty or behind start, align it to avoid invalid range
      if (!endDate || (val && endDate && val > endDate)) {
        setEndDate(val);
      }

      // Auto-advance to end date selection (no OK needed)
      // setTimeout avoids iOS input quirks with immediate modal switch
      setTimeout(() => setDateModal('end'), 0);
      return;
    }

    if (dateModal === 'end') {
      setEndDate(val);

      // Close immediately after selecting end date (no OK needed)
      setTimeout(() => setDateModal(null), 0);
      return;
    }
  };

  const modalValue = dateModal === 'start' ? startDate : endDate;
  const modalMin = dateModal === 'start' ? today : startDate || today;

  const scoreLabel = language === 'es' ? 'Puntaje' : 'Score';
  const bestLabel = language === 'es' ? 'Mejor ventana' : 'Best window';
  const avoidLabel = language === 'es' ? 'Días a evitar' : 'Days to avoid';
  const noneAvoid = language === 'es' ? 'Ninguno relevante' : 'None flagged';

  return (
    <>
      <div className="bg-neutral-900/40 border border-white/5 rounded-[3rem] sm:rounded-[4rem] shadow-3xl overflow-hidden transition-all duration-700 w-full">
        <div className="bg-neutral-800/20 p-10 sm:p-12 md:p-20 border-b border-white/5 relative">
          <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none">
            <Globe size={600} className="text-primary" />
          </div>
          <h2 className="text-3xl sm:text-6xl font-bold mb-4 sm:mb-6 font-serif tracking-tight text-white drop-shadow-2xl">
            {t.weather.title}
          </h2>
          <p className="text-neutral-500 text-base sm:text-xl font-light max-w-3xl leading-relaxed">
            {t.weather.subtitle}
          </p>
        </div>

        <div className="p-6 sm:p-10 md:p-16 lg:p-20">
          <div className="flex flex-col gap-10 sm:gap-12 mb-16 sm:mb-24 bg-neutral-800/30 p-6 sm:p-10 md:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 shadow-inner overflow-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 sm:gap-12">
              <div className="relative z-30 min-w-0">
                <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.35em] mb-4 ml-1">
                  {t.weather.destination}
                </label>
                <div className="relative group min-w-0">
                  <input
                    type="text"
                    placeholder={t.weather.placeholder}
                    className="w-full min-w-0 pl-14 pr-6 py-5 sm:py-6 bg-neutral-950/40 text-white placeholder-neutral-700 rounded-3xl focus:ring-2 focus:ring-primary/50 outline-none transition-all border border-white/10 group-hover:border-primary/40 text-base sm:text-xl"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleFetchClick()}
                  />
                  <Search className="absolute left-5 top-5 sm:top-6 text-neutral-600 group-hover:text-primary transition-colors w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {suggestions.length > 0 && !selectedLocation && (
                  <div className="absolute top-full left-0 w-full bg-neutral-800 border border-white/10 rounded-3xl mt-3 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-50 overflow-hidden ring-1 ring-white/10 max-h-[320px] overflow-y-auto backdrop-blur-3xl">
                    {suggestions.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => selectLocation(loc)}
                        className="w-full text-left px-7 sm:px-10 py-5 sm:py-6 hover:bg-primary/20 transition-all border-b border-white/5 last:border-0 flex justify-between items-center gap-4"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-white hover:text-primary text-base sm:text-lg transition-colors truncate">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 truncate">
                            {loc.admin1 ? `${loc.admin1}, ` : ''}
                            {loc.country}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-700 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="min-w-0">
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.35em] mb-4 ml-1">
                    {t.weather.startDate}
                  </label>

                  {!isMobile ? (
                    <input
                      type="date"
                      className="w-full min-w-0 px-6 py-5 bg-neutral-950/40 text-white rounded-3xl focus:ring-2 focus:ring-primary/50 outline-none border border-white/10 transition-all font-medium [color-scheme:dark] text-base sm:text-lg"
                      value={startDate}
                      min={today}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setError('');
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => openDateModal('start')}
                      className="w-full min-w-0 px-6 py-5 bg-neutral-950/40 text-white rounded-3xl border border-white/10 transition-all text-left flex items-center justify-between gap-4"
                    >
                      <span className="tabular-nums text-base truncate">
                        {startDate ? startDate : language === 'es' ? 'Selecciona fecha' : 'Select date'}
                      </span>
                      <Calendar className="w-5 h-5 text-neutral-500 shrink-0" />
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.35em] mb-4 ml-1">
                    {t.weather.endDate}
                  </label>

                  {!isMobile ? (
                    <input
                      type="date"
                      className="w-full min-w-0 px-6 py-5 bg-neutral-950/40 text-white rounded-3xl focus:ring-2 focus:ring-primary/50 outline-none border border-white/10 transition-all font-medium [color-scheme:dark] text-base sm:text-lg"
                      value={endDate}
                      min={startDate || today}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setError('');
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => openDateModal('end')}
                      className="w-full min-w-0 px-6 py-5 bg-neutral-950/40 text-white rounded-3xl border border-white/10 transition-all text-left flex items-center justify-between gap-4"
                    >
                      <span className="tabular-nums text-base truncate">
                        {endDate ? endDate : language === 'es' ? 'Selecciona fecha' : 'Select date'}
                      </span>
                      <Calendar className="w-5 h-5 text-neutral-500 shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleFetchClick}
                className="w-full md:w-auto px-10 sm:px-16 bg-accent hover:bg-accent-hover text-white py-6 rounded-[1.75rem] font-black transition-all shadow-2xl shadow-accent/20 flex items-center justify-center uppercase tracking-[0.25em] text-xs sm:text-sm active:scale-95 border border-accent/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-3 w-5 h-5" /> : <Search className="mr-3 w-5 h-5" />}
                {loading ? t.weather.btnLoading : t.weather.btnSearch}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-12 sm:mb-20 bg-red-900/20 border border-red-500/30 p-8 sm:p-10 rounded-[2rem] flex items-start gap-4 text-red-400 animate-fade-in backdrop-blur-xl shadow-2xl overflow-hidden">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-lg font-medium leading-relaxed break-words">{error}</span>
            </div>
          )}

          {selectedLocation && forecast.length > 0 && weatherAnalysis && (
            <div className="animate-fade-in space-y-16 sm:space-y-32 overflow-hidden">
              {/* Summary / Advisor */}
              <div className="bg-neutral-800/40 border border-white/10 rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-12 md:p-20 flex flex-col lg:flex-row gap-10 sm:gap-16 items-stretch justify-between shadow-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 relative z-10 min-w-0">
                  <div
                    className={`w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-[1.75rem] sm:rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl border ${
                      weatherAnalysis.status === 'favorable'
                        ? 'bg-green-900/20 text-green-400 border-green-500/20'
                        : weatherAnalysis.status === 'unfavorable'
                          ? 'bg-red-900/20 text-red-400 border-red-500/20'
                          : 'bg-primary/20 text-primary border-primary/20'
                    }`}
                  >
                    {weatherAnalysis.status === 'favorable' ? (
                      <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    ) : weatherAnalysis.status === 'unfavorable' ? (
                      <AlertCircle className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    ) : (
                      <Info className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-3 font-serif tracking-tight break-words">
                      {t.weather.summary.title}
                    </h4>
                    <p className="text-neutral-300 text-base sm:text-xl md:text-2xl italic leading-relaxed font-light break-words">
                      “
                      {weatherAnalysis.status === 'favorable'
                        ? t.weather.summary.favorable
                        : weatherAnalysis.status === 'unfavorable'
                          ? t.weather.summary.unfavorable
                          : t.weather.summary.variable}
                      ”
                    </p>

                    {/* ✅ NUEVO: score global + ventanas accionables */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-neutral-950/40 border border-white/10 rounded-2xl px-5 py-4 min-w-0">
                        <div className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.28em] truncate">
                          {scoreLabel} (0–100)
                        </div>
                        <div className="mt-2 text-white font-serif text-3xl tabular-nums leading-none">
                          {weatherAnalysis.tripScore}
                        </div>
                      </div>

                      <div className="bg-neutral-950/40 border border-white/10 rounded-2xl px-5 py-4 min-w-0">
                        <div className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.28em] truncate">
                          {bestLabel}
                        </div>
                        <div className="mt-2 text-neutral-200 text-sm sm:text-base font-bold truncate">
                          {weatherAnalysis.bestDays.map((x) => formatShortDate(x.day.date)).join(' · ')}
                        </div>
                      </div>

                      <div className="bg-neutral-950/40 border border-white/10 rounded-2xl px-5 py-4 min-w-0">
                        <div className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.28em] truncate">
                          {avoidLabel}
                        </div>
                        <div className="mt-2 text-neutral-200 text-sm sm:text-base font-bold truncate">
                          {weatherAnalysis.avoidDays.length
                            ? weatherAnalysis.avoidDays.map((x) => formatShortDate(x.day.date)).join(' · ')
                            : noneAvoid}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12 relative z-10 min-w-0">
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.35em] mb-4">
                    {language === 'es' ? 'SÍNTESIS ESTRATÉGICA' : 'STRATEGIC SYNTHESIS'}
                  </p>

                  <p className="text-white font-serif text-3xl sm:text-4xl md:text-5xl leading-tight drop-shadow-lg break-words">
                    {weatherAnalysis.summaryText || '--'}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {weatherAnalysis.extremeHeat && (
                      <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.18em] bg-orange-950/40 border border-orange-500/20 px-5 py-2 rounded-full shadow-lg">
                        {t.weather.summary.heatWarning}
                      </span>
                    )}
                    {weatherAnalysis.maxWind > 30 && (
                      <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.18em] bg-blue-950/40 border border-blue-500/20 px-5 py-2 rounded-full shadow-lg">
                        {t.weather.summary.windWarning}
                      </span>
                    )}
                    {isEstimated && (
                      <span className="text-[10px] text-primary font-black uppercase tracking-[0.18em] bg-primary/15 border border-primary/25 px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <History className="w-4 h-4" />
                        {t.weather.projection}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Destination header */}
              <div className="px-2 sm:px-6 overflow-hidden">
                <h3 className="font-serif font-bold text-white tracking-tight leading-[0.95] flex items-start gap-4 sm:gap-6">
                  <MapPin className="w-10 h-10 sm:w-14 sm:h-14 text-primary shrink-0 mt-1" />
                  <span className="min-w-0">
                    {/* FIX: evita cortar palabras a la mitad (quitamos overflow-wrap:anywhere) */}
                    <span className="block text-5xl sm:text-7xl md:text-8xl break-normal whitespace-normal hyphens-none">
                      {selectedLocation.name}
                    </span>
                    <span className="block text-xl sm:text-3xl text-neutral-600 font-light mt-2 break-normal whitespace-normal hyphens-none">
                      {selectedLocation.country}
                    </span>
                  </span>
                </h3>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 min-w-0">
                  <div className="flex items-center gap-4 text-neutral-400 font-black uppercase">
                    <Calendar className="w-6 h-6 text-accent shrink-0" />
                    <div className="flex items-center gap-2 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] min-w-0">
                      <span className="tabular-nums whitespace-nowrap">{startDate}</span>
                      <span className="text-neutral-600">—</span>
                      <span className="tabular-nums whitespace-nowrap">{endDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 sm:gap-10 overflow-hidden">
                {forecast.map((day, idx) => {
                  const s = weatherAnalysis.scoredMap.get(idx) ?? scoreDay(day);
                  const scoreTone =
                    s >= 78
                      ? 'bg-green-900/20 text-green-300 border-green-500/20'
                      : s >= 60
                        ? 'bg-primary/15 text-primary border-primary/25'
                        : 'bg-red-900/20 text-red-300 border-red-500/20';

                  return (
                    <div
                      key={idx}
                      className="bg-neutral-800/40 border border-white/10 rounded-[3rem] sm:rounded-[4rem] hover:border-primary/50 hover:bg-neutral-800/60 transition-all duration-700 flex flex-col group h-full shadow-[0_40px_100px_rgba(0,0,0,0.45)] overflow-hidden"
                    >
                      <div className="p-8 sm:p-10 md:p-12 flex flex-col h-full gap-8 sm:gap-10 min-w-0">
                        <div className="space-y-3 border-b border-white/5 pb-7 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.35em] truncate">
                              {new Date(day.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long' })}
                            </p>

                            {/* ✅ NUEVO: badge de score */}
                            <span
                              className={`shrink-0 text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border ${scoreTone}`}
                            >
                              {scoreLabel}: <span className="tabular-nums">{s}</span>
                            </span>
                          </div>

                          <h4 className="text-white font-bold text-3xl sm:text-4xl font-serif leading-none tracking-tight">
                            {new Date(day.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' })}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between gap-5 min-h-[132px] sm:min-h-[160px] min-w-0">
                          <div className="shrink-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                            {renderIcon(day.condition)}
                          </div>

                          <div className="flex flex-col items-end text-right flex-1 min-w-0">
                            <span className="font-bold text-white tracking-tighter font-serif leading-none block drop-shadow-2xl text-[clamp(3.8rem,15vw,7rem)]">
                              {Math.round(day.maxTemp || 0)}°
                            </span>
                            <span className="mt-3 text-[10px] sm:text-[11px] text-neutral-500 font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] leading-tight">
                              {t.weather.max}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 sm:gap-8 min-w-0">
                          <div className="bg-neutral-950/40 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center gap-3 border border-white/5 shadow-inner min-w-0">
                            <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600" />
                            <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-black text-center leading-tight tracking-[0.18em] sm:tracking-[0.25em] break-words">
                              {t.weather.min}
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-white tracking-tighter tabular-nums">
                              {Math.round(day.minTemp || 0)}°
                            </span>
                          </div>

                          <div
                            className={`rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center gap-3 border shadow-inner min-w-0 ${
                              (day.rainProb || 0) > 40 ? 'bg-primary/20 border-primary/40' : 'bg-neutral-950/40 border-white/5'
                            }`}
                          >
                            <CloudRain className={`w-5 h-5 sm:w-6 sm:h-6 ${(day.rainProb || 0) > 40 ? 'text-primary' : 'text-neutral-600'}`} />
                            <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-black text-center leading-tight tracking-[0.18em] sm:tracking-[0.25em] break-words">
                              {t.weather.rain}
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-white tracking-tighter tabular-nums">
                              {Math.round(day.rainProb || 0)}%
                            </span>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 mt-auto space-y-6 min-w-0">
                          <div className="flex items-center justify-between gap-4 min-w-0">
                            <div className="flex items-center gap-3 min-w-0">
                              <Sun className="w-5 h-5 text-orange-500/40 shrink-0" />
                              <span className="text-sm text-neutral-300 font-bold tabular-nums tracking-widest truncate">
                                {day.sunrise}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-sm text-neutral-300 font-bold tabular-nums tracking-widest truncate">
                                {day.sunset}
                              </span>
                              <Cloud className="w-5 h-5 text-primary/40 shrink-0" />
                            </div>
                          </div>

                          {day.waterTemp !== null && (
                            <div className="flex items-center gap-5 p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-[2rem] shadow-2xl min-w-0 overflow-hidden">
                              <Waves className="w-8 h-8 text-cyan-400 shrink-0" />
                              <div className="min-w-0">
                                <span className="block text-[9px] sm:text-[10px] text-cyan-700 font-black uppercase tracking-[0.25em] truncate">
                                  {t.weather.water}
                                </span>
                                <span className="block text-xl sm:text-2xl font-bold text-white tracking-tighter tabular-nums">
                                  {day.waterTemp}°C
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="bg-neutral-950/60 p-7 sm:p-9 rounded-[2rem] border border-white/5 space-y-3 shadow-inner min-w-0 overflow-hidden">
                            <div className="flex items-center gap-3 min-w-0">
                              <Shirt className="w-5 h-5 text-accent shrink-0" />
                              <span className="text-[9px] sm:text-[10px] text-accent font-black uppercase tracking-[0.22em] truncate">
                                {t.weather.intel}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-neutral-300 italic font-light leading-relaxed break-words [overflow-wrap:anywhere]">
                              {getTravelTip(day)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-neutral-900/60 border border-white/5 p-10 sm:p-14 rounded-[3rem] sm:rounded-[5rem] flex flex-col md:flex-row items-start md:items-center gap-8 max-w-[1200px] mx-auto text-neutral-500 italic shadow-inner overflow-hidden">
                <Info className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 text-primary/30" />
                <p className="text-sm sm:text-lg leading-relaxed font-light break-words">{t.weather.disclaimer}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Date Modal */}
      {dateModal && (
        <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/80 p-4">
          <div className="w-full max-w-[min(28rem,calc(100vw-2rem))] rounded-[2rem] bg-neutral-900 border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="text-white font-bold tracking-tight">
                {dateModal === 'start' ? t.weather.startDate : t.weather.endDate}
              </div>
              <button
                type="button"
                onClick={() => setDateModal(null)}
                className="p-2 rounded-xl hover:bg-white/5 text-neutral-300"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 pb-[calc(1.5rem+var(--safe-bottom))] space-y-4">
              <input
                type="date"
                className="w-full px-6 py-5 bg-neutral-950/60 text-white rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none border border-white/10 transition-all font-medium [color-scheme:dark] text-base"
                value={modalValue}
                min={modalMin}
                onChange={(e) => onModalDateChange(e.target.value)}
              />

              {/* FIX: quitamos OK para evitar doble confirmación en iPhone.
                  - start: auto-advances a end
                  - end: auto-cierra modal */}
              <div className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                {dateModal === 'start'
                  ? (language === 'es' ? 'Elige salida y pasaremos a regreso.' : 'Pick start date, then we’ll ask for end date.')
                  : (language === 'es' ? 'Elige regreso y cerraremos automáticamente.' : 'Pick end date and we’ll close automatically.')}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
