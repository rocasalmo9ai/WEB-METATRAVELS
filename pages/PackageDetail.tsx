import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, X, Calendar, MapPin, Users, Camera, Mail, Shield, ArrowRight } from 'lucide-react';
import { PACKAGES, SITE_CONFIG } from '../constants';
import { useLanguage } from '../components/LanguageContext';

type Intent = 'apartar' | 'info';

export const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getText, t } = useLanguage();

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === id), [id]);

  // funnel state
  const [intent, setIntent] = useState<Intent>('apartar');
  const [open, setOpen] = useState(false);

  // lead fields (mínimo viable, sin Supabase aún)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whats, setWhats] = useState('');
  const [notes, setNotes] = useState('');

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string>('');

  if (!pkg) {
    return (
      <div className="p-20 text-center text-white bg-neutral-900 min-h-screen flex items-center justify-center text-3xl font-serif">
        {t.packageDetail.notFound}
      </div>
    );
  }

  // depósito recomendado: max(5000, 15% del desde) con tope 20000
  // NOTA: esto asume que pkg.price es "desde" por persona.
  const depositSuggestion = useMemo(() => {
    const base = Number(pkg.price || 0);
    const fifteen = Math.round(base * 0.15);
    const raw = Math.max(5000, fifteen);
    return Math.min(20000, raw);
  }, [pkg.price]);

  const currency = pkg.currency || 'MXN';

  const openModal = (i: Intent) => {
    setIntent(i);
    setError('');
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setError('');
  };

  const validate = () => {
    if (!agree) return 'Debes aceptar que el depósito es no reembolsable y sujeto a condiciones.';
    if (!name.trim()) return 'Escribe tu nombre.';
    if (intent === 'info') {
      // info: email o whatsapp (uno)
      if (!email.trim() && !whats.trim()) return 'Para enviarte la info necesitamos tu correo o WhatsApp.';
      return '';
    }
    // apartar: whatsapp + email recomendados
    if (!whats.trim()) return 'Para apartar necesitamos tu WhatsApp.';
    if (!email.trim()) return 'Para apartar necesitamos tu correo.';
    return '';
  };

  const handleSubmit = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    // Guardado temporal local (no se pierde el lead aunque todavía no haya Supabase)
    const lead = {
      ts: new Date().toISOString(),
      intent,
      packageId: pkg.id,
      packageTitle: getText(pkg.title),
      depositSuggestion,
      currency,
      name,
      email,
      whats,
      notes,
    };
    try {
      const key = 'metatravels_leads_v1';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([lead, ...prev]));
    } catch {
      // si falla localStorage, igual seguimos a gracias
    }

    // manda a /gracias con state (para renderizar resumen)
    navigate('/gracias', {
      state: {
        intent,
        packageTitle: getText(pkg.title),
        depositSuggestion,
        currency,
      },
      replace: true,
    });
  };

  const waText = encodeURIComponent(`Hola, me interesa el paquete: ${getText(pkg.title)}`);
  const waLink = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${waText}`;

  return (
    <div className="animate-fade-in pb-20 bg-white">
      {/* Hero */}
      <div className="relative h-[70vh]">
        <img src={pkg.heroImage} alt={getText(pkg.title)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white bg-gradient-to-t from-black/90 to-transparent">
          <div className="container mx-auto">
            <p className="text-accent font-bold tracking-widest uppercase mb-2 text-sm">{getText(pkg.destination)}</p>
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

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Intro */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-accent pl-4">
              {t.packageDetail.description}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg text-justify">{getText(pkg.description)}</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.highlights.map((h, i) => (
                <div key={i} className="flex items-center bg-purple-50 p-4 rounded-lg">
                  <div className="bg-white p-2 rounded-full mr-3 shadow-sm text-primary">
                    <Camera size={18} />
                  </div>
                  <span className="text-gray-800 font-medium">{getText(h)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Itinerary */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-accent pl-4">
              {t.packageDetail.itinerary}
            </h2>
            <div className="space-y-12">
              {pkg.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="bg-white rounded-none md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {day.image && (
                    <div className="h-64 md:h-80 overflow-hidden relative">
                      <img src={day.image} alt={getText(day.title)} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 bg-primary/90 text-white px-6 py-3 rounded-br-2xl text-lg font-bold">
                        {t.packageDetail.day} {day.day}
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    {!day.image && (
                      <span className="text-primary font-bold text-xl block mb-2">
                        {t.packageDetail.day} {day.day}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{getText(day.title)}</h3>
                    <p className="text-gray-600 leading-relaxed">{getText(day.description)}</p>
                  </div>
                </div>
              ))}
              <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
                <p className="text-2xl font-serif italic">"{t.packageDetail.endTrip}"</p>
              </div>
            </div>
          </section>

          {/* Includes / Excludes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50/50 p-8 rounded-xl border border-green-100">
              <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
                <Check className="w-6 h-6 mr-2" /> {t.packageDetail.includes}
              </h3>
              <ul className="space-y-3">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-700">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {getText(item)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/50 p-8 rounded-xl border border-red-100">
              <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center">
                <X className="w-6 h-6 mr-2" /> {t.packageDetail.excludes}
              </h3>
              <ul className="space-y-3">
                {pkg.excludes.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-700">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {getText(item)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm uppercase">{t.packageDetail.perPerson}</p>
              <div className="flex justify-center items-baseline text-primary">
                <span className="text-4xl font-bold">${pkg.price.toLocaleString()}</span>
                <span className="text-xl ml-1">{currency}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{t.packageDetail.subjectToChange}</p>
            </div>

            {/* Doble carril */}
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => openModal('apartar')}
                className="w-full bg-accent hover:bg-accent-hover text-white py-4 rounded-lg font-bold text-lg shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Apartar <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => openModal('info')}
                className="w-full border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-50 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                Solicitar info <Mail className="w-5 h-5" />
              </button>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
            >
              {t.packageDetail.whatsapp}
            </a>

            <div className="border-t border-gray-100 pt-6 mt-6">
              <h4 className="font-bold text-gray-800 mb-2">{t.packageDetail.doubts}</h4>
              <p className="text-sm text-gray-600 mb-4">{t.packageDetail.contactText}</p>
              <p className="text-sm font-medium text-primary">{SITE_CONFIG.contact.email}</p>
            </div>

            <div className="mt-6 text-[11px] text-gray-500 flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5" />
              <span>
                Depósito no reembolsable. Condiciones y disponibilidad sujetas a proveedores.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-black/70 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-500">
                  {intent === 'apartar' ? 'Apartar paquete' : 'Solicitar información'}
                </div>
                <div className="text-xl font-bold text-gray-900">{getText(pkg.title)}</div>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {intent === 'apartar' && (
                <div className="bg-neutral-900 text-white rounded-2xl p-5">
                  <div className="text-xs uppercase tracking-widest text-white/60">Depósito sugerido</div>
                  <div className="mt-2 text-3xl font-bold">
                    ${depositSuggestion.toLocaleString()} {currency}
                  </div>
                  <div className="mt-2 text-white/60 text-sm">No reembolsable. Se descuenta del total.</div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="WhatsApp"
                  value={whats}
                  onChange={(e) => setWhats(e.target.value)}
                />
              </div>

              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30 min-h-[90px]"
                placeholder="Notas (opcional): fechas, aeropuerto, dudas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  Entiendo y acepto que el depósito es <b>no reembolsable</b> y que el paquete está sujeto a disponibilidad y condiciones de proveedores.
                </span>
              </label>
            </div>

            <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeModal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:flex-1 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-10">
        <Link to="/packages" className="text-sm text-neutral-600 hover:text-neutral-900 underline">
          ← Volver a paquetes
        </Link>
      </div>
    </div>
  );
};
