import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Shield,
  Heart,
  Plane,
  Hotel,
  Map,
  User,
  Utensils,
  Calendar,
  Globe,
  CheckCircle2,
  Sparkles,
  BrainCircuit,
} from 'lucide-react';
import { PACKAGES } from '../constants';
import { useLanguage } from '../components/LanguageContext';
import { Package } from '../types';

export const Home: React.FC = () => {
  const { t, getText } = useLanguage();

  const AmenitiesRow = ({ pkg }: { pkg: Package }) => (
    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
      {pkg.amenities.flightsIntl && (
        <div className="group relative">
          <Globe size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
            Vuelos Intl
          </span>
        </div>
      )}
      {pkg.amenities.flightsDomestic && (
        <div className="group relative">
          <Plane size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
            Vuelos Nac
          </span>
        </div>
      )}
      {pkg.amenities.accommodation && (
        <div className="group relative">
          <Hotel size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
            Hospedaje
          </span>
        </div>
      )}
      {pkg.amenities.meals && (
        <div className="group relative">
          <Utensils size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
            Alimentos
          </span>
        </div>
      )}
      {pkg.amenities.tours && (
        <div className="group relative">
          <Map size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
            Tours
          </span>
        </div>
      )}
      {pkg.amenities.guide && (
        <div className="group relative">
          <User size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
            Guía
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in bg-neutral-900 overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="
          relative min-h-[100svh] overflow-hidden
          flex items-start justify-center
          pt-24 pb-24
          md:h-screen md:items-center md:pt-0 md:pb-0
        "
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop"
            alt="Ultra Luxury Destination"
            className="w-full h-full object-cover animate-slow-zoom brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neutral-900/60"></div>
        </div>

        {/* safe-area padding helpers */}
        <div className="absolute inset-0 pointer-events-none safe-top safe-bottom"></div>

        <div className="container mx-auto px-6 relative z-10 text-center safe-top safe-bottom">
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 rounded-full border border-white/40 bg-black/30 backdrop-blur-xl animate-fade-in">
            <Sparkles size={14} className="text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
              {t.hero.defining}
            </span>
          </div>

          <h1 className="text-7xl md:text-[10rem] font-bold mb-10 tracking-tighter leading-none whitespace-pre-line font-serif animate-slide-up drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <span className="text-white block">{t.hero.titlePart1}</span>
            <span className="text-gradient filter drop-shadow-[0_4px_10px_rgba(139,92,246,0.3)]">
              {t.hero.titlePart2}
            </span>
          </h1>

          <p className="text-xl md:text-3xl text-white mb-16 max-w-3xl mx-auto font-light leading-relaxed tracking-wide animate-fade-in [animation-delay:0.4s] drop-shadow-md">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 animate-fade-in [animation-delay:0.6s] pb-10 md:pb-0">
            <Link
              to="/custom-trip"
              className="bg-accent hover:bg-accent-hover text-white px-16 py-6 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-[0_15px_30px_-12px_rgba(245,158,11,0.6)] tracking-[0.3em] uppercase border border-accent/20"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              to="/packages"
              className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/40 px-16 py-6 rounded-full text-sm font-bold transition-all tracking-[0.3em] uppercase shadow-lg"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 bottom-10 mb-[env(safe-area-inset-bottom)]">
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white drop-shadow-sm">
            {t.hero.scroll}
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* AI Technology Teaser */}
      <section className="py-32 bg-neutral-950 border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
              <div className="relative z-10 bg-neutral-900 p-12 rounded-[3rem] border border-white/10 shadow-3xl">
                <BrainCircuit size={48} className="text-accent mb-8" />
                <h3 className="text-4xl font-serif text-white mb-6 leading-tight">
                  Arquitectura Emocional Meta
                </h3>
                <p className="text-neutral-500 leading-relaxed text-lg font-light mb-8">
                  No solo elegimos destinos; decodificamos tu arquitectura emocional para orquestar travesías que
                  resuenan con tu momento vital.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/90">
                    <CheckCircle2 size={18} className="text-accent" />
                    <span className="text-sm font-medium tracking-wide">Profiling Psicográfico Avanzado</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <CheckCircle2 size={18} className="text-accent" />
                    <span className="text-sm font-medium tracking-wide">Optimización de Ritmos Circadianos</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/90">
                    <CheckCircle2 size={18} className="text-accent" />
                    <span className="text-sm font-medium tracking-wide">Curation Engine Grounded 2025</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-10">
              <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px]">The Meta Experience</span>
              <h2 className="text-5xl md:text-6xl font-bold text-white font-serif leading-tight">
                El viaje comienza en tu mente.
              </h2>
              <p className="text-neutral-400 text-xl font-light leading-relaxed">
                Nuestra tecnología propietaria fusiona el análisis de datos de élite con la intuición humana para crear
                el itinerario perfecto, eliminando la fatiga de decisión y dejando solo la maravilla.
              </p>
              <Link
                to="/custom-trip"
                className="inline-flex items-center text-white font-bold tracking-[0.2em] uppercase text-xs group"
              >
                Comenzar Diagnóstico{' '}
                <ArrowRight className="ml-4 group-hover:translate-x-3 transition-transform text-accent" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Proof of Excellence */}
      <section className="py-16 bg-neutral-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between gap-12">
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold text-white font-serif tracking-tighter">500+</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{t.home.stats.destinations}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold text-white font-serif tracking-tighter">24/7</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{t.home.stats.concierge}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold text-white font-serif tracking-tighter">100%</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{t.home.stats.privacy}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold text-white font-serif tracking-tighter">Elite</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{t.home.stats.designers}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-32 bg-neutral-900 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-xl">
              <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px]">{t.home.exclusiveCollection}</span>
              <h2 className="text-6xl md:text-7xl font-bold mt-6 font-serif text-white tracking-tight">{t.home.featuredPackages}</h2>
            </div>
            <Link to="/packages" className="text-white hover:text-accent font-bold text-sm tracking-widest uppercase flex items-center transition-colors group">
              {t.home.viewAll} <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {PACKAGES.slice(0, 6).map((pkg) => (
              <Link to={`/package/${pkg.id}`} key={pkg.id} className="group block h-full">
                <div className="relative overflow-hidden rounded-[3rem] bg-neutral-800/40 border border-white/5 hover:border-accent/30 transition-all duration-700 flex flex-col h-full shadow-2xl">
                  <div className="relative aspect-[3/4] overflow-hidden shrink-0">
                    <img
                      src={pkg.heroImage}
                      alt={getText(pkg.title)}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/20"></div>

                    <div className="absolute top-8 right-8 glass-card px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                      {pkg.type}
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-accent text-[10px] font-bold uppercase tracking-[0.4em] mb-2">{getText(pkg.destination)}</p>
                      <h3 className="text-3xl font-bold font-serif text-white leading-tight">{getText(pkg.title)}</h3>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-grow">
                    <div className="flex items-center text-[10px] text-gray-500 mb-8 font-bold uppercase tracking-widest">
                      <Calendar size={14} className="mr-2 text-accent" /> {getText(pkg.dates)}
                      <span className="mx-4 text-white/10">|</span>
                      {getText(pkg.duration)}
                    </div>

                    <div className="flex-grow">
                      <ul className="space-y-4">
                        {pkg.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-400 font-light">
                            <CheckCircle2 size={16} className="text-primary mr-4 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{getText(h)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <AmenitiesRow pkg={pkg} />

                    <div className="flex justify-between items-center mt-10 pt-8 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.home.investment}</p>
                        <p className="text-3xl font-bold text-white tracking-tighter">
                          ${pkg.price.toLocaleString()} <span className="text-xs font-light text-gray-500">{pkg.currency}</span>
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-accent group-hover:border-accent transition-all transform group-hover:rotate-45 group-hover:scale-110">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Philosophy */}
      <section className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover grayscale brightness-50 transition-all duration-1000 hover:grayscale-0 hover:brightness-100"
                  alt="Office Culture"
                />
              </div>
              <div className="absolute -bottom-16 -right-16 glass-card p-12 rounded-[3rem] max-w-sm shadow-3xl hidden md:block border border-white/10 backdrop-blur-3xl">
                <p className="text-gray-300 italic text-lg leading-relaxed font-light">"{t.home.philosophy.quote}"</p>
                <p className="text-white font-bold mt-6 text-xs tracking-widest uppercase">— {t.home.philosophy.author}</p>
              </div>
            </div>
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">{t.home.philosophy.tag}</span>
              <h2 className="text-6xl md:text-7xl font-bold mt-8 mb-12 font-serif text-white tracking-tight">
                {t.home.philosophy.titlePart1} <br />
                <span className="text-gradient">{t.home.philosophy.titlePart2}</span>
              </h2>

              <div className="space-y-16">
                <div className="flex gap-8">
                  <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                    <Shield size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-3 font-serif">{t.home.features.security.title}</h4>
                    <p className="text-gray-400 font-light leading-relaxed text-lg">{t.home.features.security.desc}</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="w-16 h-16 rounded-3xl bg-accent/20 flex items-center justify-center shrink-0 text-accent border border-accent/20">
                    <Star size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-3 font-serif">{t.home.features.premium.title}</h4>
                    <p className="text-gray-400 font-light leading-relaxed text-lg">{t.home.features.premium.desc}</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="w-16 h-16 rounded-3xl bg-red-500/20 flex items-center justify-center shrink-0 text-red-400 border border-red-500/20">
                    <Heart size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-3 font-serif">{t.home.features.passion.title}</h4>
                    <p className="text-gray-400 font-light leading-relaxed text-lg">{t.home.features.passion.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
            className="w-full h-full object-cover opacity-10 scale-110"
            alt="Adventure Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h3 className="text-6xl md:text-8xl font-bold mb-10 text-white font-serif max-w-5xl mx-auto leading-none tracking-tighter">
            {t.home.customTripTitle}
          </h3>
          <p className="mb-16 text-xl md:text-3xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">{t.home.customTripDesc}</p>
          <Link
            to="/custom-trip"
            className="inline-block bg-white text-black px-20 py-7 rounded-full font-bold transition-all shadow-3xl hover:bg-accent hover:text-white hover:scale-105 active:scale-95 tracking-[0.3em] uppercase text-sm"
          >
            {t.home.customTripBtn}
          </Link>
        </div>
      </section>
    </div>
  );
};
