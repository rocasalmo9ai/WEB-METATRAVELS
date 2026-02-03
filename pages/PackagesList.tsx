
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PACKAGES } from '../constants';
import { Filter, Search, Calendar, CheckCircle2, ArrowRight, Plane, Hotel, Map, User, Utensils, Coins, TicketCheck, Globe } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { Package } from '../types';

export const PackagesList: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const { t, getText } = useLanguage();

  const filteredPackages = useMemo(() => {
    const base = filter === 'all' 
      ? PACKAGES 
      : PACKAGES.filter(p => p.type === filter || p.level === filter || (filter === 'Safari' && p.type === 'Safari') || (filter === 'Playa' && p.type === 'Playa') || (filter === 'Cultura' && p.type === 'Cultura') || (filter === 'Crucero' && p.type === 'Crucero') || (filter === 'Lujo' && p.level === 'Lujo'));
    
    // Para propósitos de demo y completar el grid (mínimo 9 tarjetas)
    let displayList = [...base];
    if (displayList.length > 0) {
      while (displayList.length < 9) {
        displayList = [...displayList, ...base.map((p, i) => ({
          ...p,
          id: `${p.id}-dup-${displayList.length + i}`
        }))];
      }
    }
    return displayList.slice(0, 9);
  }, [filter]);

  const AmenitiesRow = ({ pkg }: { pkg: Package }) => (
    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
      {pkg.amenities.flightsIntl && <Globe size={16} className="text-gray-400 hover:text-accent transition-colors" />}
      {pkg.amenities.flightsDomestic && <Plane size={16} className="text-gray-400 hover:text-accent transition-colors" />}
      {pkg.amenities.accommodation && <Hotel size={16} className="text-gray-400 hover:text-accent transition-colors" />}
      {pkg.amenities.meals && <Utensils size={16} className="text-gray-400 hover:text-accent transition-colors" />}
      {pkg.amenities.tours && <Map size={16} className="text-gray-400 hover:text-accent transition-colors" />}
      {pkg.amenities.guide && <User size={16} className="text-gray-400 hover:text-accent transition-colors" />}
      {pkg.amenities.tips && <Coins size={16} className="text-gray-400 hover:text-accent transition-colors" />}
      {pkg.amenities.taxes && <TicketCheck size={16} className="text-gray-400 hover:text-accent transition-colors" />}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-32 md:pt-48 pb-24 animate-fade-in">
       <div className="container mx-auto px-6">
         {/* Title Section con offset seguro para el header */}
         <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif tracking-tight drop-shadow-sm">
              {t.nav.destinations}
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              {t.home.featuredPackages}
            </p>
         </div>

         {/* Filters - Separación reforzada */}
         <div className="flex flex-wrap justify-center gap-4 mb-20 relative z-20">
            {[
              { id: 'all', label: t.common.filters.all },
              { id: 'Safari', label: t.common.filters.safari },
              { id: 'Playa', label: t.common.filters.beach },
              { id: 'Cultura', label: t.common.filters.culture },
              { id: 'Crucero', label: t.common.filters.cruises },
              { id: 'Lujo', label: t.common.filters.luxury }
            ].map(f => (
               <button 
                 key={f.id}
                 onClick={() => setFilter(f.id)}
                 className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border shadow-sm ${
                    filter === f.id 
                      ? 'bg-primary border-primary text-white shadow-primary/20 scale-105' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary'
                 }`}
               >
                 {f.label}
               </button>
            ))}
         </div>

         {/* Grid de Viajes */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPackages.map(pkg => (
              <Link to={`/package/${pkg.id}`} key={pkg.id} className="group block h-full">
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl bg-white flex flex-col h-full hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                    <img 
                      src={pkg.heroImage} 
                      alt={getText(pkg.title)} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-95" 
                    />
                    <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/10">
                      {pkg.type}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-grow">
                    <p className="text-accent text-[10px] font-bold uppercase mb-3 tracking-[0.3em]">{getText(pkg.destination)}</p>
                    <h3 className="text-2xl font-bold mb-4 leading-tight text-gray-900 font-serif group-hover:text-primary transition-colors">{getText(pkg.title)}</h3>
                    
                    {/* Dates/Info Bar */}
                    <div className="flex items-center text-[10px] text-gray-400 mb-6 bg-gray-50/80 px-4 py-2.5 rounded-xl font-bold uppercase tracking-widest border border-gray-100">
                       <Calendar size={14} className="mr-3 text-primary shrink-0"/> {getText(pkg.dates)}
                    </div>

                    {/* Highlights List */}
                    <div className="mb-6 flex-grow">
                       <p className="text-[9px] text-gray-300 uppercase mb-4 font-bold tracking-[0.2em]">{t.common.highlights}</p>
                       <ul className="space-y-3">
                          {pkg.highlights.slice(0,2).map((h, i) => (
                             <li key={i} className="flex items-start text-sm text-gray-600 font-light leading-snug">
                                <CheckCircle2 size={14} className="text-accent mr-3 mt-0.5 shrink-0"/>
                                <span className="line-clamp-2">{getText(h)}</span>
                             </li>
                          ))}
                       </ul>
                    </div>

                    {/* Amenities Section */}
                    <AmenitiesRow pkg={pkg} />

                    {/* Footer Info */}
                    <div className="flex justify-between items-end border-t border-gray-100 pt-6 mt-6">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{t.common.perPerson}</p>
                        <p className="text-2xl font-bold text-gray-900 tracking-tighter">
                          ${pkg.price.toLocaleString()} <span className="text-xs font-medium text-gray-400">{pkg.currency}</span>
                        </p>
                      </div>
                      <div className="bg-primary/10 text-primary p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-12">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
         </div>

         {/* Empty State Fallback */}
         {filteredPackages.length === 0 && (
           <div className="text-center py-40">
             <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                <Search size={40} />
             </div>
             <h3 className="text-2xl font-serif text-gray-800 mb-2">No se encontraron viajes</h3>
             <p className="text-gray-500">Intenta con otro filtro de nuestra colección.</p>
           </div>
         )}
       </div>
    </div>
  );
};
