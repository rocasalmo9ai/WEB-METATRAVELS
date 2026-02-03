
import React, { useState, useEffect, useMemo } from 'react';
import { Search, CloudRain, Sun, Wind, Droplets, Waves, Calendar, MapPin, Thermometer, Info, Shirt, Loader2, CloudLightning, Cloud, FileDown, History, Snowflake, CloudFog, Globe, CloudSun, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { searchLocation, getForecast } from '../services/weatherService';
import { GeoLocation, WeatherData } from '../types';
import { useLanguage } from './LanguageContext';

declare global {
  interface Window {
    jspdf: any;
  }
}

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

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
        setEndDate(startDate);
    }
  }, [startDate]);

  const weatherAnalysis = useMemo(() => {
    if (!forecast.length) return null;

    const avgRain = forecast.reduce((acc, day) => acc + (day.rainProb || 0), 0) / forecast.length;
    const avgMaxTemp = forecast.reduce((acc, day) => acc + (day.maxTemp || 0), 0) / forecast.length;
    const maxWind = Math.max(...forecast.map(day => day.windSpeed || 0));
    const extremeHeat = forecast.some(day => day.maxTemp > 32);

    let status: 'favorable' | 'variable' | 'unfavorable' = 'variable';
    if (avgRain < 20 && avgMaxTemp > 18 && avgMaxTemp < 32) status = 'favorable';
    if (avgRain > 50) status = 'unfavorable';

    let summaryText = t.weather.summary.mixedDays;
    if (avgRain < 15) summaryText = t.weather.summary.sunnyDays;
    if (avgRain > 50) summaryText = t.weather.summary.rainyDays;

    return {
      status,
      summaryText,
      extremeHeat,
      maxWind
    };
  }, [forecast, t]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2 && !selectedLocation) {
        try {
            const results = await searchLocation(query);
            setSuggestions(results);
        } catch(e) { 
            console.warn("[Weather Hardening] Geo API issue.");
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

  const handleFetchClick = async () => {
    setError('');
    if(!startDate || !endDate) {
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
        } catch (e) {
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

  const fetchForecastData = async (loc: GeoLocation) => {
    try {
        const data = await getForecast(loc.latitude, loc.longitude, startDate, endDate);
        if (!data || data.length === 0) {
            setError(t.weather.errorApi);
            setForecast([]);
        } else {
            const start = new Date(startDate);
            const now = new Date();
            const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            setIsEstimated(diffDays > 14);
            setForecast(data);
        }
    } catch (err) {
        setError(t.weather.errorApi);
        setForecast([]);
    }
  };

  const getTravelTip = (day: WeatherData) => {
    const cond = day.condition;
    if (cond === 'thunder') return t.weather.tips.rain;
    if (cond === 'rain' || cond === 'drizzle') return t.weather.tips.rain;
    if (cond === 'snow') return t.weather.tips.snow;
    if (day.maxTemp > 28) return t.weather.tips.hot;
    if (day.maxTemp < 15) return t.weather.tips.cold;
    if (day.windSpeed && day.windSpeed > 25) return t.weather.tips.wind;
    return t.weather.tips.nice;
  };

  const renderIcon = (condition: WeatherData['condition']) => {
     switch(condition) {
        case 'sun': return <Sun className="text-orange-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'partly_cloudy': return <CloudSun className="text-yellow-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'cloudy': return <Cloud className="text-gray-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'fog': return <CloudFog className="text-slate-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'drizzle': return <CloudRain className="text-blue-300 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'rain': return <CloudRain className="text-blue-500 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'thunder': return <CloudLightning className="text-purple-600 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'windy': return <Wind className="text-slate-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        case 'snow': return <Snowflake className="text-cyan-100 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
        default: return <CloudSun className="text-yellow-400 w-12 h-12 sm:w-20 sm:h-20 shrink-0" />;
     }
  };

  return (
    <div className="bg-neutral-900/40 border border-white/5 rounded-[4rem] shadow-3xl overflow-visible transition-all duration-700 w-full">
      <div className="bg-neutral-800/20 p-12 md:p-20 border-b border-white/5 relative rounded-t-[4rem]">
        <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none">
           <Globe size={600} className="text-primary" />
        </div>
        <h2 className="text-4xl sm:text-6xl font-bold mb-6 font-serif tracking-tighter text-white drop-shadow-2xl">{t.weather.title}</h2>
        <p className="text-neutral-500 text-xl font-light max-w-3xl leading-relaxed">{t.weather.subtitle}</p>
      </div>
      
      <div className="p-8 md:p-16 lg:p-24">
        {/* Formulario de búsqueda optimizado */}
        <div className="flex flex-col gap-12 mb-24 bg-neutral-800/30 p-10 md:p-16 rounded-[3.5rem] border border-white/10 shadow-inner">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="relative z-30">
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-5 ml-2">{t.weather.destination}</label>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder={t.weather.placeholder}
                            className="w-full pl-16 pr-8 py-6 bg-neutral-950/40 text-white placeholder-neutral-700 rounded-3xl focus:ring-2 focus:ring-primary/50 outline-none transition-all border border-white/10 group-hover:border-primary/40 text-xl"
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleFetchClick()}
                        />
                        <Search className="absolute left-6 top-6 text-neutral-600 group-hover:text-primary transition-colors w-7 h-7" />
                    </div>

                    {suggestions.length > 0 && !selectedLocation && (
                        <div className="absolute top-full left-0 w-full bg-neutral-800 border border-white/10 rounded-3xl mt-4 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-50 overflow-hidden ring-1 ring-white/10 max-h-[400px] overflow-y-auto backdrop-blur-3xl">
                        {suggestions.map(loc => (
                            <button
                                key={loc.id}
                                onClick={() => selectLocation(loc)}
                                className="w-full text-left px-10 py-6 hover:bg-primary/20 transition-all border-b border-white/5 last:border-0 flex justify-between items-center group"
                            >
                                <div className="flex flex-col">
                                  <span className="font-bold text-white group-hover:text-primary text-lg transition-colors">{loc.name}</span>
                                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                                      {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                                  </span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-neutral-700 group-hover:text-primary transform group-hover:translate-x-2 transition-all" />
                            </button>
                        ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-5 ml-2">{t.weather.startDate}</label>
                        <input 
                            type="date" 
                            className="w-full px-8 py-6 bg-neutral-950/40 text-white rounded-3xl focus:ring-2 focus:ring-primary/50 outline-none border border-white/10 transition-all font-medium [color-scheme:dark] text-xl"
                            value={startDate}
                            min={today}
                            onChange={(e) => { setStartDate(e.target.value); setError(''); }}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-5 ml-2">{t.weather.endDate}</label>
                        <input 
                            type="date" 
                            className="w-full px-8 py-6 bg-neutral-950/40 text-white rounded-3xl focus:ring-2 focus:ring-primary/50 outline-none border border-white/10 transition-all font-medium [color-scheme:dark] text-xl"
                            value={endDate}
                            min={startDate || today}
                            onChange={(e) => { setEndDate(e.target.value); setError(''); }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleFetchClick}
                    className="w-full md:w-auto px-20 bg-accent hover:bg-accent-hover text-white py-7 rounded-[2rem] font-black transition-all shadow-2xl shadow-accent/20 flex items-center justify-center uppercase tracking-[0.3em] text-sm active:scale-95 border border-accent/20"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin mr-4 w-6 h-6" /> : <Search className="mr-4 w-6 h-6" />}
                    {loading ? t.weather.btnLoading : t.weather.btnSearch}
                </button>
            </div>
        </div>
        
        {error && (
          <div className="mb-20 bg-red-900/20 border border-red-500/30 p-10 rounded-[2.5rem] flex items-center text-red-400 animate-fade-in backdrop-blur-xl shadow-2xl">
             <AlertCircle className="w-8 h-8 mr-6 shrink-0" />
             <span className="text-lg font-medium">{error}</span>
          </div>
        )}

        {selectedLocation && forecast.length > 0 && weatherAnalysis && (
          <div className="animate-fade-in space-y-32">
            {/* Análisis del Asesor ampliado */}
            <div className="bg-neutral-800/40 border border-white/10 rounded-[4rem] p-12 md:p-20 flex flex-col lg:flex-row gap-16 items-center justify-between shadow-3xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
               <div className="flex items-center gap-10 md:gap-16 relative z-10 w-full lg:w-auto">
                  <div className={`w-24 h-24 md:w-36 md:h-36 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl border ${
                    weatherAnalysis.status === 'favorable' ? 'bg-green-900/20 text-green-400 border-green-500/20' : 
                    weatherAnalysis.status === 'unfavorable' ? 'bg-red-900/20 text-red-400 border-red-500/20' : 'bg-primary/20 text-primary border-primary/20'
                  }`}>
                    {weatherAnalysis.status === 'favorable' ? <CheckCircle2 size={64} /> : 
                     weatherAnalysis.status === 'unfavorable' ? <AlertCircle size={64} /> : <Info size={64} />}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-3xl md:text-4xl mb-4 font-serif tracking-tight">{t.weather.summary.title}</h4>
                    <p className="text-neutral-300 text-xl md:text-2xl italic leading-relaxed max-w-2xl font-light">
                      "{weatherAnalysis.status === 'favorable' ? t.weather.summary.favorable : 
                        weatherAnalysis.status === 'unfavorable' ? t.weather.summary.unfavorable : t.weather.summary.variable}"
                    </p>
                  </div>
               </div>
               <div className="text-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/10 pt-12 lg:pt-0 lg:pl-20 relative z-10 w-full lg:w-auto">
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.4em] mb-6">{language === 'es' ? 'SÍNTESIS ESTRATÉGICA' : 'STRATEGIC SYNTHESIS'}</p>
                  <p className="text-white font-serif text-4xl md:text-5xl leading-tight drop-shadow-lg">{weatherAnalysis.summaryText || '--'}</p>
                  <div className="mt-10 flex flex-wrap gap-5 justify-center lg:justify-end">
                    {weatherAnalysis.extremeHeat && <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.2em] bg-orange-950/40 border border-orange-500/20 px-6 py-3 rounded-full shadow-lg">{t.weather.summary.heatWarning}</span>}
                    {weatherAnalysis.maxWind > 30 && <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] bg-blue-950/40 border border-blue-500/20 px-6 py-3 rounded-full shadow-lg">{t.weather.summary.windWarning}</span>}
                  </div>
               </div>
            </div>

            {/* Cabecera de Destino ampliada */}
            <div className="px-6">
              <h3 className="text-6xl sm:text-9xl font-bold text-white flex flex-wrap items-baseline font-serif tracking-tighter leading-none mb-12">
                <MapPin className="w-16 h-16 mr-8 text-primary shrink-0 self-center"/>
                <span className="break-words">{selectedLocation.name}</span>
                <span className="text-neutral-700 font-light ml-8 text-3xl sm:text-5xl">, {selectedLocation.country}</span>
              </h3>
              <div className="flex flex-wrap items-center gap-12">
                  <p className="text-lg sm:text-xl text-neutral-400 flex items-center tracking-[0.3em] uppercase font-black">
                      <Calendar className="w-8 h-8 mr-5 text-accent shrink-0"/> {startDate} — {endDate}
                  </p>
                  {isEstimated && (
                      <span className="bg-primary/20 text-primary text-xs px-8 py-4 rounded-full border border-primary/30 font-black uppercase tracking-[0.2em] flex items-center shadow-2xl shadow-primary/20">
                         <History className="w-5 h-5 mr-4" /> {t.weather.projection}
                      </span>
                  )}
              </div>
            </div>

            {/* Grid de Pronóstico Diario - 2 columns mobile, auto-expanding desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 md:gap-14 overflow-visible">
              {forecast.map((day, idx) => (
                <div key={idx} className="bg-neutral-800/40 border border-white/10 rounded-[4rem] hover:border-primary/50 hover:bg-neutral-800/60 transition-all duration-700 flex flex-col group h-full shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-visible">
                  <div className="p-12 lg:p-14 flex flex-col h-full gap-12 relative z-10">
                      
                      {/* Bloque 1: Cabecera Temporal */}
                      <div className="space-y-4 border-b border-white/5 pb-10">
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.4em]">
                            {new Date(day.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long' })}
                        </p>
                        <h4 className="text-white font-bold text-4xl font-serif leading-none tracking-tight">
                            {new Date(day.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' })}
                        </h4>
                      </div>

                      {/* Bloque 2: Indicador Principal (Temperatura) - Sin recortes */}
                      <div className="flex items-center justify-between gap-6 py-6 min-h-[160px] overflow-visible">
                        <div className="shrink-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                             {renderIcon(day.condition)}
                        </div>
                        <div className="flex flex-col items-end text-right flex-1 min-w-0">
                          <span className="text-[clamp(5rem,12vw,8rem)] font-bold text-white tracking-tighter font-serif leading-none block drop-shadow-2xl">
                            {Math.round(day.maxTemp)}°
                          </span>
                          <span className="text-[11px] text-neutral-500 font-black uppercase tracking-[0.3em] mt-4 whitespace-normal leading-tight max-w-full text-right">
                            {t.weather.max}
                          </span>
                        </div>
                      </div>

                      {/* Bloque 3: Datos Técnicos Secundarios */}
                      <div className="grid grid-cols-2 gap-8">
                          <div className="bg-neutral-950/40 rounded-[2.5rem] p-8 flex flex-col items-center gap-4 border border-white/5 shadow-inner transition-all hover:bg-neutral-950/60">
                             <Thermometer className="w-6 h-6 text-neutral-600" /> 
                             <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-black text-center leading-none">{t.weather.min}</span>
                             <span className="text-2xl font-bold text-white tracking-tighter">{Math.round(day.minTemp)}°</span>
                          </div>
                          <div className={`rounded-[2.5rem] p-8 flex flex-col items-center gap-4 border transition-all shadow-inner ${day.rainProb > 40 ? 'bg-primary/20 border-primary/40' : 'bg-neutral-950/40 border-white/5 hover:bg-neutral-950/60'}`}>
                             <CloudRain className={`w-6 h-6 ${day.rainProb > 40 ? 'text-primary' : 'text-neutral-600'}`} />
                             <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-black text-center leading-none">{t.weather.rain}</span>
                             <span className="text-2xl font-bold text-white tracking-tighter">{Math.round(day.rainProb)}%</span>
                          </div>
                      </div>

                      {/* Bloque 4: Entorno e Intel */}
                      <div className="space-y-10 pt-10 border-t border-white/5 mt-auto">
                        <div className="flex flex-col gap-8">
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <Sun className="w-6 h-6 text-orange-500/40" /> 
                                <span className="text-sm text-neutral-300 font-bold tabular-nums tracking-widest">{day.sunrise}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-neutral-300 font-bold tabular-nums tracking-widest">{day.sunset}</span>
                                <Cloud className="w-6 h-6 text-primary/40" /> 
                            </div>
                          </div>

                          {day.waterTemp !== null && (
                            <div className="flex items-center gap-8 p-8 bg-cyan-950/20 border border-cyan-500/20 rounded-[2.5rem] shadow-2xl transition-all hover:bg-cyan-950/40">
                              <Waves className="w-10 h-10 text-cyan-400 shrink-0" />
                              <div className="flex flex-col min-w-0">
                                <span className="text-[10px] text-cyan-700 font-black uppercase tracking-[0.3em] leading-none mb-2">{t.weather.water}</span>
                                <span className="text-2xl font-bold text-white tracking-tighter">{day.waterTemp}°C</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Recomendación de equipaje premium */}
                        <div className="bg-neutral-950/60 p-10 rounded-[2.5rem] border border-white/5 space-y-5 shadow-inner">
                          <div className="flex items-center gap-4">
                             <Shirt className="w-6 h-6 text-accent shrink-0" /> 
                             <span className="text-[10px] text-accent font-black uppercase tracking-[0.3em]">{t.weather.intel}</span>
                          </div>
                          <p className="text-base text-neutral-300 italic font-light leading-relaxed">
                            {getTravelTip(day)}
                          </p>
                        </div>
                      </div>

                  </div>
                </div>
              ))}
            </div>
            
            {/* Aviso legal sofisticado */}
            <div className="mt-32 bg-neutral-900/60 border border-white/5 p-16 lg:p-24 rounded-[5rem] flex flex-col md:flex-row items-center gap-16 max-w-[1200px] mx-auto text-neutral-500 italic shadow-inner text-center md:text-left">
               <Info className="w-12 h-12 shrink-0 text-primary/30" />
               <p className="text-lg leading-relaxed font-light">
                  {t.weather.disclaimer}
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
