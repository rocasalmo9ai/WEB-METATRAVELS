
import React from 'react';
import { WeatherWidget } from '../components/WeatherWidget';
import { useLanguage } from '../components/LanguageContext';

export const WeatherPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in bg-neutral-950 min-h-screen pt-32 md:pt-48 pb-24">
       <div className="mx-auto px-6 lg:px-12 w-full max-w-[1800px]">
         {/* Title Section */}
         <div className="text-center mb-16 md:mb-24">
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter font-serif">
              {t.weatherPage.title}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-500 max-w-4xl mx-auto font-light leading-relaxed">
              {t.weatherPage.subtitle}
            </p>
         </div>

         {/* Widget Principal - Full Width support */}
         <div className="relative z-10 w-full">
            <WeatherWidget />
         </div>
         
         {/* Tips Grid - Premium Dark Style */}
         <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-neutral-900/40 p-12 rounded-[3rem] border border-white/5 transition-all hover:border-primary/40 hover:bg-neutral-900/60 shadow-2xl group">
               <h3 className="font-bold text-primary mb-6 text-xl font-serif uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{t.weatherPage.cards.safari.title}</h3>
               <p className="text-lg text-neutral-400 leading-relaxed font-light">{t.weatherPage.cards.safari.desc}</p>
            </div>
            <div className="bg-neutral-900/40 p-12 rounded-[3rem] border border-white/5 transition-all hover:border-primary/40 hover:bg-neutral-900/60 shadow-2xl group">
               <h3 className="font-bold text-primary mb-6 text-xl font-serif uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{t.weatherPage.cards.beach.title}</h3>
               <p className="text-lg text-neutral-400 leading-relaxed font-light">{t.weatherPage.cards.beach.desc}</p>
            </div>
            <div className="bg-neutral-900/40 p-12 rounded-[3rem] border border-white/5 transition-all hover:border-primary/40 hover:bg-neutral-900/60 shadow-2xl group">
               <h3 className="font-bold text-primary mb-6 text-xl font-serif uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{t.weatherPage.cards.city.title}</h3>
               <p className="text-lg text-neutral-400 leading-relaxed font-light">{t.weatherPage.cards.city.desc}</p>
            </div>
         </div>
       </div>
    </div>
  );
};
