
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { SITE_CONFIG } from '../constants.ts';
import { useLanguage } from './LanguageContext.tsx';
import { AIChatConcierge } from './AIChatConcierge.tsx';
import { SEOHead } from './SEOHead.tsx';

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
      {/* Dynamic Header - Refined for maximum contrast on dark backgrounds */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out ${isScrolled ? 'bg-black/95 backdrop-blur-2xl shadow-[0_20px_80px_-10px_rgba(0,0,0,1)] h-20 border-b border-white/5' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent h-28'}`}>
        <div className="container mx-auto px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group relative z-10">
              <div className={`font-bold tracking-tighter flex items-center transition-all duration-500 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] ${isScrolled ? 'text-2xl' : 'text-3xl'}`}>
                <span className="text-white">Meta</span>
                <span className="text-accent relative flex items-center ml-1.5">
                  Travels
                  <svg className={`absolute -top-1 -right-7 transform rotate-45 text-accent opacity-0 group-hover:opacity-100 transition-all ${isScrolled ? 'w-5 h-5 -right-6' : 'w-7 h-7'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`text-[11px] font-black transition-all uppercase tracking-[0.3em] relative group drop-shadow-[0_4px_8px_rgba(0,0,0,1)] ${location.pathname === link.path ? 'text-accent' : 'text-white hover:text-accent'}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 h-[2px] bg-accent transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-10">
              <button 
                onClick={toggleLanguage}
                className="flex items-center text-[10px] font-black text-white hover:text-accent transition-colors uppercase tracking-[0.2em] drop-shadow-[0_4px_8px_rgba(0,0,0,1)]"
              >
                <Globe className="w-4 h-4 mr-2.5 text-accent" />
                {language}
              </button>
              <Link 
                to="/custom-trip"
                className={`bg-accent hover:bg-accent-hover text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all transform hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(245,158,11,0.3)] border border-accent/30 ${isScrolled ? 'px-8 py-3' : 'px-10 py-4'}`}
              >
                {t.nav.quote}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-3 text-white relative z-10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-neutral-950 z-40 lg:hidden transition-transform duration-700 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-12 pt-32">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-4xl font-bold text-white mb-10 border-b border-white/5 pb-6 font-serif tracking-tight"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-auto space-y-10">
               <button onClick={toggleLanguage} className="flex items-center text-2xl text-white font-bold uppercase tracking-widest">
                  <Globe className="w-8 h-8 mr-5 text-accent" /> {language === 'es' ? 'English' : 'Español'}
               </button>
               <Link 
                to="/custom-trip"
                className="block w-full text-center bg-accent text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.quote}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        {children}
      </main>

      <AIChatConcierge />

      {/* Footer */}
      <footer className="bg-black text-white pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-28">
            <div className="space-y-10">
              <h3 className="text-4xl font-bold tracking-tighter">Meta<span className="text-accent">Travels</span></h3>
              <p className="text-neutral-500 font-light leading-relaxed text-base">
                {t.footer.desc}
              </p>
              <div className="flex space-x-6">
                <a href={SITE_CONFIG.socials.instagram} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-neutral-400 hover:text-accent hover:border-accent hover:scale-110 transition-all"><Instagram size={22} /></a>
                <a href={SITE_CONFIG.socials.facebook} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-neutral-400 hover:text-accent hover:border-accent hover:scale-110 transition-all"><Facebook size={22} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-10">{t.nav.about}</h4>
              <ul className="space-y-6">
                <li><Link to="/packages" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{t.nav.destinations}</Link></li>
                <li><Link to="/weather" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{t.nav.weather}</Link></li>
                <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{t.nav.about}</Link></li>
                <li><Link to="/custom-trip" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{t.nav.customTrip}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-10">{t.footer.legal}</h4>
              <ul className="space-y-6">
                <li><Link to="/policy" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{t.footer.terms}</Link></li>
                <li><Link to="/policy" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{t.footer.privacy}</Link></li>
                <li><Link to="/policy" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{t.footer.cookies}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-10">{t.nav.contact}</h4>
              <ul className="space-y-8">
                <li className="flex items-start">
                  <div className="bg-neutral-900 border border-white/5 p-3 rounded-2xl mr-5"><Phone className="w-5 h-5 text-accent" /></div>
                  <span className="text-neutral-400 text-base font-medium">{SITE_CONFIG.contact.phone}</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-neutral-900 border border-white/5 p-3 rounded-2xl mr-5"><Mail className="w-5 h-5 text-accent" /></div>
                  <span className="text-neutral-400 text-base font-medium truncate">{SITE_CONFIG.contact.email}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-neutral-600 text-[11px] font-bold uppercase tracking-[0.2em]">© {new Date().getFullYear()} Meta Travels Group. {t.footer.crafted}</p>
            <div className="flex gap-8">
               <span className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.3em]">{t.footer.inspiring}</span>
               <span className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.3em] px-4 border-l border-white/5">{t.footer.premium}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
