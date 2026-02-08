import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type ThankYouState = {
  intent?: 'apartar' | 'info';
  packageTitle?: string;
  depositSuggestion?: number;
  currency?: string;
};

export const ThankYou: React.FC = () => {
  const loc = useLocation() as { state?: ThankYouState };
  const state = loc?.state || {};

  const intent = state.intent;
  const title = state.packageTitle || '';
  const deposit = state.depositSuggestion;
  const currency = state.currency || 'MXN';

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold">Listo.</h1>

        <p className="mt-4 text-white/80 text-lg leading-relaxed">
          {intent === 'apartar'
            ? `Recibimos tu solicitud para apartar: ${title}`
            : `Recibimos tu solicitud de información: ${title}`}
        </p>

        {intent === 'apartar' && typeof deposit === 'number' ? (
          <div className="mt-6 bg-black/30 border border-white/10 rounded-2xl p-6">
            <div className="text-sm uppercase tracking-widest text-white/60">Depósito sugerido</div>
            <div className="mt-2 text-3xl font-bold">
              ${Number(deposit).toLocaleString()} {currency}
            </div>
            <div className="mt-2 text-white/60 text-sm">
              No reembolsable. Se descuenta del total. Sujeto a disponibilidad.
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/packages"
            className="px-6 py-3 rounded-xl bg-white text-neutral-900 font-bold text-center hover:bg-white/90"
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
          Tiempo de respuesta objetivo: menos de 2 horas.
        </div>
      </div>
    </div>
  );
};
