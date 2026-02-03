
import React from 'react';
import { SITE_CONFIG } from '../constants';
import { Shield, Bot, Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="animate-fade-in bg-neutral-900">
       {/* Header */}
       <div className="bg-primary text-white py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h1 className="text-6xl font-bold relative z-10 mb-6 font-serif tracking-tight">{t.about.title}</h1>
          <p className="text-purple-100 text-xl max-w-2xl mx-auto relative z-10 font-light leading-relaxed">{t.about.subtitle}</p>
       </div>

       <div className="container mx-auto px-6 py-32">
          {/* Main Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center mb-40">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <img 
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                    className="relative rounded-[3rem] shadow-3xl w-full object-cover h-[600px] brightness-100 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                    alt="Meta Travels Professional Team" 
                />
                <div className="absolute bottom-10 right-10 bg-black/80 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.3em]">{t.about.tag}</span>
                </div>
             </div>
             
             <div className="flex flex-col">
                <span className="text-accent font-bold uppercase tracking-[0.5em] text-[11px] mb-8 block drop-shadow-sm">Our DNA</span>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-10 font-serif leading-[1.1] tracking-tight">
                  {t.about.mainTitle}
                </h2>
                <div className="space-y-10">
                  <p className="text-white text-2xl font-light leading-relaxed border-l-2 border-primary/40 pl-8 italic">
                     "{t.about.quote}"
                  </p>
                  <div className="space-y-8 pl-8">
                    <p className="text-neutral-300 leading-[1.8] text-lg font-light">
                       {t.about.p1}
                    </p>
                    <p className="text-neutral-300 leading-[1.8] text-lg font-light">
                       {t.about.p2}
                    </p>
                  </div>
                </div>
             </div>
          </div>

          {/* Process Section - How we create your trip */}
          <section className="mb-40">
            <div className="text-center mb-20">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[11px] mb-6 block">The Methodology</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-serif tracking-tight">{t.about.processTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {t.about.processSteps.map((step, index) => (
                <div key={index} className="bg-neutral-800/60 border border-white/10 p-10 rounded-[2.5rem] hover:bg-neutral-800/80 transition-all duration-500 group relative flex flex-col h-full shadow-lg">
                  <div className="text-accent font-black text-xs uppercase tracking-widest mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                    Step 0{index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-5 font-serif leading-tight group-hover:text-accent transition-colors">
                    {step.title.includes(': ') ? step.title.split(': ')[1] : step.title}
                  </h3>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed">
                    {step.desc}
                  </p>
                  {index < 4 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-white/5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <div className="bg-neutral-800/30 p-12 rounded-[3rem] text-center border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-xl group">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-primary group-hover:scale-110 transition-transform">
                    <Shield className="w-12 h-12"/>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-white font-serif">{t.about.values.v1.title}</h3>
                <p className="text-neutral-400 text-base leading-relaxed font-light">{t.about.values.v1.desc}</p>
             </div>
             
             <div className="bg-neutral-800/30 p-12 rounded-[3rem] text-center border border-white/5 hover:border-accent/40 transition-all duration-500 shadow-xl group">
                <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-accent group-hover:scale-110 transition-transform">
                    <Bot className="w-12 h-12"/>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-white font-serif">{t.about.values.v2.title}</h3>
                <p className="text-neutral-400 text-base leading-relaxed font-light">{t.about.values.v2.desc}</p>
             </div>

             <div className="bg-neutral-800/30 p-12 rounded-[3rem] text-center border border-white/5 hover:border-blue-500/40 transition-all duration-500 shadow-xl group">
                <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-blue-500 group-hover:scale-110 transition-transform">
                    <Globe className="w-12 h-12"/>
                </div>
                <h3 className="text-2xl font-bold mb-5 text-white font-serif">{t.about.values.v3.title}</h3>
                <p className="text-neutral-400 text-base leading-relaxed font-light">{t.about.values.v3.desc}</p>
             </div>
          </div>
       </div>
    </div>
  );
};
