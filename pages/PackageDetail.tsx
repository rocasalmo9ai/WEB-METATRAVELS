import React from 'react';
import { useParams } from 'react-router-dom';
import { Check, X, Calendar, MapPin, Users, Camera } from 'lucide-react';
import { PACKAGES, SITE_CONFIG } from '../constants';
import { useLanguage } from '../components/LanguageContext';

export const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getText, t } = useLanguage();
  const pkg = PACKAGES.find((p) => p.id === id);

  if (!pkg) {
    return (
      <div className="p-20 text-center text-white bg-neutral-900 min-h-screen flex items-center justify-center text-3xl font-serif">
        {t.packageDetail.notFound}
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-[#0c0c0d] pb-24 text-[#f4efe7]">
      {/* Hero */}
      <div className="relative h-[70vh]">
        <img src={pkg.heroImage} alt={getText(pkg.title)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white bg-gradient-to-t from-black/90 to-transparent">
          <div className="container mx-auto">
            <p className="text-accent font-bold tracking-widest uppercase mb-2 text-sm">
              {getText(pkg.destination)}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{getText(pkg.title)}</h1>
            <p className="text-2xl font-light text-gray-200">{getText(pkg.subtitle || '')}</p>

            <div className="flex flex-wrap gap-6 mt-6 text-sm md:text-base font-medium">
              <span className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-accent" /> {getText(pkg.dates)}
              </span>
              <span className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-accent" /> {getText(pkg.duration)}
              </span>
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-accent" /> {t.packageDetail.groupSize} {pkg.minGroupSize}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Intro Description */}
          <section>
            <h2 className="text-3xl font-serif font-bold text-[#f4efe7] mb-6 border-l-2 border-[#b8873d] pl-4">
              {t.packageDetail.description}
            </h2>
            <p className="text-[#d2cabf] leading-relaxed text-lg">{getText(pkg.description)}</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.highlights.map((h, i) => (
                <div key={i} className="flex items-center border border-[#36332d] bg-[#171719] p-4">
                  <div className="bg-[#292725] p-2 rounded-full mr-3 text-[#b8873d]">
                    <Camera size={18} />
                  </div>
                  <span className="text-[#f4efe7] font-medium">{getText(h)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Itinerary */}
          <section>
            <h2 className="text-3xl font-serif font-bold text-[#f4efe7] mb-8 border-l-2 border-[#b8873d] pl-4">
              {t.packageDetail.itinerary}
            </h2>

            <div className="space-y-12">
              {pkg.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="overflow-hidden border border-[#36332d] bg-[#171719] transition-colors hover:border-[#b8873d]"
                >
                  {day.image && (
                    <div className="h-64 md:h-80 overflow-hidden relative">
                      <img src={day.image} alt={getText(day.title)} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 bg-[#0c0c0d]/90 text-[#f4efe7] px-6 py-3 text-lg font-bold">
                        {t.packageDetail.day} {day.day}
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {!day.image && (
                      <span className="text-[#b8873d] font-bold text-xl block mb-2">
                        {t.packageDetail.day} {day.day}
                      </span>
                    )}
                    <h3 className="text-2xl font-serif font-bold text-[#f4efe7] mb-4">{getText(day.title)}</h3>
                    <p className="text-[#d2cabf] leading-relaxed">{getText(day.description)}</p>
                  </div>
                </div>
              ))}

              <div className="border border-[#b8873d]/50 bg-[#171719] text-[#f4efe7] p-8 text-center">
                <p className="text-2xl font-serif italic">"{t.packageDetail.endTrip}"</p>
              </div>
            </div>
          </section>

          {/* Includes / Excludes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#171719] p-8 border border-[#36332d]">
              <h3 className="text-xl font-bold text-[#e4c68f] mb-6 flex items-center">
                <Check className="w-6 h-6 mr-2" /> {t.packageDetail.includes}
              </h3>
              <ul className="space-y-3">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start text-[#d2cabf]">
                    <span className="w-1.5 h-1.5 bg-[#b8873d] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {getText(item)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#171719] p-8 border border-[#36332d]">
              <h3 className="text-xl font-bold text-[#d7aa9b] mb-6 flex items-center">
                <X className="w-6 h-6 mr-2" /> {t.packageDetail.excludes}
              </h3>
              <ul className="space-y-3">
                {pkg.excludes.map((item, i) => (
                  <li key={i} className="flex items-start text-[#d2cabf]">
                    <span className="w-1.5 h-1.5 bg-[#a55b4e] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {getText(item)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[#171719] p-8 border border-[#5b554b] shadow-2xl shadow-black/30">
            <div className="text-center mb-6">
              <p className="text-[#a69d90] text-sm uppercase">{t.packageDetail.perPerson}</p>
              <div className="flex justify-center items-baseline text-[#e4c68f]">
                <span className="text-4xl font-bold">${pkg.price.toLocaleString()}</span>
                <span className="text-xl ml-1">{pkg.currency}</span>
              </div>
              <p className="text-xs text-[#a69d90] mt-2">{t.packageDetail.subjectToChange}</p>
            </div>

            <button className="w-full bg-[#b8873d] hover:bg-[#d1a65d] text-[#0c0c0d] py-4 font-bold text-lg mb-4 transition-transform hover:scale-[1.02]">
              {t.packageDetail.bookNow}
            </button>

            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=Hola, me interesa el paquete ${getText(pkg.title)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full border border-[#b8873d] text-[#e4c68f] hover:bg-[#b8873d] hover:text-[#0c0c0d] py-3 font-semibold flex items-center justify-center transition-colors mb-6"
            >
              {t.packageDetail.whatsapp}
            </a>

            <div className="border-t border-[#36332d] pt-6">
              <h4 className="font-bold text-[#f4efe7] mb-2">{t.packageDetail.doubts}</h4>
              <p className="text-sm text-[#c9c1b5] mb-4">{t.packageDetail.contactText}</p>
              <p className="text-sm font-medium text-[#e4c68f]">{SITE_CONFIG.contact.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
