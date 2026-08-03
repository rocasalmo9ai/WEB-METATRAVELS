import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PACKAGES } from '../constants';
import {
  Search,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Plane,
  Hotel,
  Map,
  User,
  Utensils,
  Coins,
  TicketCheck,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { Package } from '../types';

export const PackagesList: React.FC = () => {
  const [filter, setFilter] = useState<'all' | string>('all');
  const { t, getText } = useLanguage();

  const filteredPackages = useMemo(() => {
    const base =
      filter === 'all'
        ? PACKAGES
        : PACKAGES.filter(
            (p) =>
              p.type === filter ||
              p.level === filter ||
              (filter === 'Safari' && p.type === 'Safari') ||
              (filter === 'Playa' && p.type === 'Playa') ||
              (filter === 'Cultura' && p.type === 'Cultura') ||
              (filter === 'Crucero' && p.type === 'Crucero') ||
              (filter === 'Lujo' && p.level === 'Lujo')
          );

    let display = [...base];
    while (display.length > 0 && display.length < 9) {
      display = display.concat(
        base.map((p, i) => ({
          ...p,
          id: `${p.id}-dup-${display.length + i}`,
        }))
      );
    }

    return display.slice(0, 9);
  }, [filter]);

  const AmenitiesRow = ({ pkg }: { pkg: Package }) => (
    <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-[#36332d]">
      {pkg.amenities.flightsIntl && <Globe size={16} className="text-[#b8873d]" />}
      {pkg.amenities.flightsDomestic && <Plane size={16} className="text-[#b8873d]" />}
      {pkg.amenities.accommodation && <Hotel size={16} className="text-[#b8873d]" />}
      {pkg.amenities.meals && <Utensils size={16} className="text-[#b8873d]" />}
      {pkg.amenities.tours && <Map size={16} className="text-[#b8873d]" />}
      {pkg.amenities.guide && <User size={16} className="text-[#b8873d]" />}
      {pkg.amenities.tips && <Coins size={16} className="text-[#b8873d]" />}
      {pkg.amenities.taxes && <TicketCheck size={16} className="text-[#b8873d]" />}
    </div>
  );

  const filters = [
    { id: 'all', label: t.common.filters.all },
    { id: 'Safari', label: t.common.filters.safari },
    { id: 'Playa', label: t.common.filters.beach },
    { id: 'Cultura', label: t.common.filters.culture },
    { id: 'Crucero', label: t.common.filters.cruises },
    { id: 'Lujo', label: t.common.filters.luxury },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0d] pt-32 md:pt-48 pb-24 text-[#f4efe7]">
      <div className="container mx-auto px-6">
        {/* Título */}
        <div className="text-center mb-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#b8873d]">Viajes diseñados a tu medida</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#f4efe7] mb-6">
            {t.nav.destinations}
          </h1>
          <p className="text-xl text-[#c9c1b5] max-w-2xl mx-auto">
            {t.home.featuredPackages}
          </p>
        </div>

        {/* FILTROS (FIX DEFINITIVO) */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {filters.map((f) => {
            const isActive = filter === f.id;

            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={[
                  'px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all',
                  isActive
                    // 👇 ACTIVO: oscuro + texto blanco (NO se pierde jamás)
                    ? 'bg-[#b8873d] border-[#b8873d] text-[#0c0c0d] shadow-lg scale-105'
                    // 👇 INACTIVO
                    : 'bg-transparent border-[#5b554b] text-[#f4efe7] hover:border-[#b8873d] hover:text-[#b8873d]',
                ].join(' ')}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPackages.map((pkg) => (
            <Link to={`/package/${pkg.id.replace(/-dup-\d+$/, '')}`} key={pkg.id} className="group block">
              <div className="overflow-hidden border border-[#36332d] bg-[#171719] flex flex-col h-full transition duration-500 group-hover:-translate-y-2 group-hover:border-[#b8873d]">
                <div className="relative aspect-[4/3]">
                  <img
                    src={pkg.heroImage}
                    alt={getText(pkg.title)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d]/70 via-transparent to-transparent" />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <p className="text-xs uppercase tracking-widest text-[#b8873d] mb-3">
                    {getText(pkg.destination)}
                  </p>

                  <h3 className="text-2xl font-serif font-bold text-[#f4efe7] mb-4">
                    {getText(pkg.title)}
                  </h3>

                  <div className="flex items-center text-xs text-[#c9c1b5] mb-6">
                    <Calendar size={14} className="mr-2" />
                    {getText(pkg.dates)}
                  </div>

                  <div className="flex-grow">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex text-sm text-[#ded7cc] mb-2">
                        <CheckCircle2 size={14} className="mr-2 text-[#b8873d]" />
                        {getText(h)}
                      </div>
                    ))}
                  </div>

                  <AmenitiesRow pkg={pkg} />

                  <div className="mt-6 flex justify-between items-center pt-4">
                    <div>
                      <p className="text-xs text-[#a69d90] uppercase">
                        {t.common.perPerson}
                      </p>
                      <p className="text-2xl font-bold text-[#f4efe7]">
                        ${pkg.price.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="text-[#b8873d] transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-40">
            <Search size={40} className="mx-auto text-[#b8873d] mb-6" />
            <h3 className="text-2xl font-serif text-[#f4efe7]">
              No se encontraron viajes
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};
