import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Mail, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../constants';

type ThankYouState = {
  intent?: 'apartar' | 'info';
  packageTitle?: string;
  depositSuggestion?: number;
  currency?: string;
};

export const ThankYou: React.FC = () => {
  const loc = useLocation() as { state?: ThankYouState };
  const state = loc?.state;

  const intent = state?.intent || 'info';
  const title = state?.packageTitle || 'tu paquete';
  const deposit = state?.depositSuggestion;
  const currency = state?.currency || 'MXN';

  const headline = intent === 'apartar' ? 'Solicitud de apartado recibida.' : 'Solicitud recibida.';
  const body =
    intent === 'apartar'
      ? `Recibimos tu solicitud para apartar: ${title}.`
      : `Recibimos tu solicitud de información: ${title}.`;

  const waText = useMemo(() => {
    const base =
      intent === 'apartar'
        ? `Hola, ya envié mi solicitud para APARTAR: ${title}. ¿Me apoyan con el siguiente paso?`
        : `Hola, envié mi solicitud de INFO para: ${title}. ¿Me pueden compartir detalles?`;
    return encodeURIComponent(base);
  }, [intent, title]);

  const waLink = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${waText}`;

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-10">
        <div className="text-xs uppercase tracking-[0.35em] text-white/50">MetaTravels</div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold">{headline}</h1>

        <p className="mt-4 text-white/80 text-lg leading-relaxed">{body}</p>

        {intent === 'apartar' && typeof deposit === 'number' ? (
          <div className="mt-6 bg-black/30 border border-white/10 rounded-2xl p-6">
            <div className="text-sm uppercase tracking-widest text-white/60">Depósito sugerido</div>
            <div className="mt-2 text-3xl font-bold">
              ${Number(deposit).toLocaleString()} {currency}
            </div>
            <div className="mt-2 text-white/60 text-sm flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-white/60" />
              <span>No reembolsable. Se descuenta del total. Sujeto a disponibilidad y condiciones de proveedores.</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-black/30 border border-white/10 rounded-2xl p-6">
            <div className="text-sm uppercase tracking-widest text-white/60">Siguiente paso</div>
            <div className="mt-2 text-white/80 text-sm leading-relaxed">
              Te contactaremos para confirmar detalles y enviar opciones. Si quieres acelerar el proceso, escríbenos por WhatsApp.
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-green-500 text-neutral-900 font-bold text-center hover:bg-green-400 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>

          <a
            href={`mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent('MetaTravels - Solicitud')}`}
            className="px-6 py-3 rounded-xl bg-white text-neutral-900 font-bold text-center hover:bg-white/90 flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Correo
          </a>

          <Link
            to="/packages"
            className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-center hover:bg-white/5"
          >
            Volver a paquetes
          </Link>

          <Link
            to="/"
            className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-center hover:bg-white/5"
          >
            Ir al inicio
          </Link>
        </div>

        <div className="mt-8 text-white/50 text-sm">
          SLA: respuesta objetivo &lt; 2 horas.
        </div>

        {!state && (
          <div className="mt-4 text-white/40 text-xs">
            Nota: abriste esta página directamente. Si acabas de enviar tu solicitud, vuelve al paquete y presiona “Enviar” para ver el resumen.
          </div>
        )}
      </div>
    </div>
  );
};
