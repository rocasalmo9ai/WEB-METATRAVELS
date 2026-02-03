import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { SITE_CONFIG } from '../constants';
import { useLanguage } from './LanguageContext';
import { AIChatConcierge } from './AIChatConcierge';
import { SEOHead } from './SEOHead';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  const navLinks = [
    { name: t.nav.destinations, path: '/packages' },
    { name: t.nav.customTrip, path: '/custom-trip' },
    { name: t.nav.weather, path: '/weather' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.contact, path: '/contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-neutral-950">
      <SEOHead />

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500
        ${isScrolled
          ? 'bg-black/95 backdrop-blur-xl h-20 border-b border-white/5'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent h-28'
        }`}
      >
        <div className="container mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">

            {/* LOGO */}
            <Link to="/" className="flex items-center z-10">
              <span className="text-white font-bold text-2xl">
                Meta<span className="text-accent">Travels</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`uppercase text-xs tracking-[0.3em] font-black
                  ${location.pathname === link.path
                    ? 'text-accent'
                    : 'text-white hover:text-accent'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* ACTIONS DESKTOP */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={toggleLanguage}
                className="flex items-center text-xs font-black uppercase tracking-widest text-white hover:text-accent"
              >
                <Globe className="w-4 h-4 mr-2 text-accent" />
                {language}
              </button>

              <Link
                to="/custom-trip"
                className="bg-accent text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition"
              >
                {t.nav.quote}
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden p-2 text-white z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed inset-0 bg-black z-40 lg:hidden transition-transform duration-500
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full p-10 pt-32">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-3xl font-bold text-white mb-8"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-auto space-y-8">
              <button
                onClick={toggleLanguage}
                className="flex items-center text-xl text-white font-bold"
              >
                <Globe className="w-6 h-6 mr-4 text-accent" />
                {language === 'es' ? 'English' : 'Español'}
              </button>

              <Link
                to="/custom-trip"
                className="block w-full text-center bg-accent text-white py-5 rounded-full text-lg font-black"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.quote}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 🔧 MOBILE FIX: RESERVA ESPACIO PARA HEADER */}
      <main className="flex-grow pt-[120px] lg:pt-0">
        {children}
      </main>

      <AIChatConcierge />

      {/* FOOTER */}
      <footer className="bg-black text-white pt-24 pb-16 border-t border-white/5">
        <div className="container mx-auto px-6 grid gap-16 lg:grid-cols-4">
          <div>
            <h3 className="text-3xl font-bold mb-6">
              Meta<span className="text-accent">Travels</span>
            </h3>
            <p className="text-neutral-500">{t.footer.desc}</p>
            <div className="flex gap-4 mt-6">
              <a href={SITE_CONFIG.socials.instagram}><Instagram /></a>
              <a href={SITE_CONFIG.socials.facebook}><Facebook /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-6 text-accent">
              {t.nav.contact}
            </h4>
            <p className="flex items-center gap-3 text-neutral-400">
              <Phone size={18} /> {SITE_CONFIG.contact.phone}
            </p>
            <p className="flex items-center gap-3 text-neutral-400 mt-3 break-all">
              <Mail size={18} /> {SITE_CONFIG.contact.email}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
