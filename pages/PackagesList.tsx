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
    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
      {pkg.amenities.flightsIntl && <Globe size={16} className="text-gray-400" />}
      {pkg.amenities.flightsDomestic && <Plane size={16} className="text-gray-400" />}
      {pkg.amenities.accommodation && <Hotel size={16} className="text-gray-400" />}
      {pkg.amenities.meals && <Utensils size={16} className="text-gray-400" />}
      {pkg.amenities.tours && <Map size={16} className="text-gray-400" />}
      {pkg.amenities.guide && <User size={16} className="text-gray-400" />}
      {pkg.amenities.tips && <Coins size={16} className="text-gray-400" />}
      {pkg.amenities.taxes && <TicketCheck size={16} className="text-gray-400" />}
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
    <div className="bg-gray-50 min-h-screen pt-32 md:pt-48 pb-24">
      <div className="container mx-auto px-6">
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            {t.nav.destinations}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
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
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-lg scale-105'
                    // 👇 INACTIVO
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100',
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
            <Link to={`/package/${pkg.id}`} key={pkg.id} className="group block">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full">
                <div className="relative aspect-[4/3]">
                  <img
                    src={pkg.heroImage}
                    alt={getText(pkg.title)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                    {getText(pkg.destination)}
                  </p>

                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                    {getText(pkg.title)}
                  </h3>

                  <div className="flex items-center text-xs text-gray-500 mb-6">
                    <Calendar size={14} className="mr-2" />
                    {getText(pkg.dates)}
                  </div>

                  <div className="flex-grow">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex text-sm text-gray-600 mb-2">
                        <CheckCircle2 size={14} className="mr-2 text-green-600" />
                        {getText(h)}
                      </div>
                    ))}
                  </div>

                  <AmenitiesRow pkg={pkg} />

                  <div className="mt-6 flex justify-between items-center border-t pt-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        {t.common.perPerson}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${pkg.price.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-40">
            <Search size={40} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-serif text-gray-800">
              No se encontraron viajes
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};
