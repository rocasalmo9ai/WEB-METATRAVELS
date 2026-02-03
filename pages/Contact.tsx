
import React, { useState } from 'react';
import { SITE_CONFIG } from '../constants';
import { Phone, Mail, MapPin, Instagram, Facebook, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleWhatsApp = () => {
    const text = `Hola Meta Travels, mi nombre es ${form.name || '...'}. ${form.message ? 'Mensaje: ' + form.message : 'Me gustaría más información.'}`;
    window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = form.subject || `Nuevo Mensaje de ${form.name}`;
    const body = `Nombre: ${form.name}%0D%0AEmail: ${form.email}%0D%0AMensaje: ${form.message}`;
    window.location.href = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-24 animate-fade-in">
       <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-neutral-900 rounded-[3rem] shadow-3xl overflow-hidden border border-white/5">
             
             {/* Info Side with High-Resolution Natural Visuals */}
             <div className="relative p-16 flex flex-col justify-between overflow-hidden group min-h-[600px]">
                {/* Background Image - Clear and Bright */}
                <div className="absolute inset-0 z-0">
                   <img 
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
                      alt="Luxury Background" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                   />
                   {/* Light Vignette for readability instead of heavy dark overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
                </div>

                <div className="relative z-10 text-white">
                   <h1 className="text-5xl font-bold mb-6 font-serif tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">{t.contact.title}</h1>
                   <p className="text-white mb-12 text-xl font-light leading-relaxed max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{t.contact.subtitle}</p>
                   
                   <div className="space-y-10">
                      <div className="flex items-start group/item">
                         <div className="bg-accent p-3 rounded-2xl mr-5 text-white shadow-xl">
                            <MapPin className="w-6 h-6" />
                         </div>
                         <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            <h3 className="font-bold text-white uppercase tracking-wider text-xs mb-1">{t.contact.office}</h3>
                            <p className="text-white font-medium text-lg">{SITE_CONFIG.contact.address}</p>
                         </div>
                      </div>
                      <div className="flex items-start group/item">
                         <div className="bg-primary p-3 rounded-2xl mr-5 text-white shadow-xl">
                             <Phone className="w-6 h-6" />
                         </div>
                         <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            <h3 className="font-bold text-white uppercase tracking-wider text-xs mb-1">{t.contact.phone}</h3>
                            <p className="text-white font-medium text-lg">{SITE_CONFIG.contact.phone}</p>
                         </div>
                      </div>
                      <div className="flex items-start group/item">
                         <div className="bg-white/20 backdrop-blur-md border border-white/20 p-3 rounded-2xl mr-5 text-white shadow-xl">
                            <Mail className="w-6 h-6" />
                         </div>
                         <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            <h3 className="font-bold text-white uppercase tracking-wider text-xs mb-1">{t.contact.email}</h3>
                            <p className="text-white font-medium text-lg truncate max-w-[200px] md:max-w-xs">{SITE_CONFIG.contact.email}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-16 relative z-10">
                   <h3 className="font-bold mb-6 text-white uppercase tracking-[0.3em] text-[10px] drop-shadow-md">{t.contact.follow}</h3>
                   <div className="flex space-x-5">
                      <a href="#" className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all text-white hover:scale-110 shadow-xl"><Instagram size={20}/></a>
                      <a href="#" className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-white hover:scale-110 shadow-xl"><Facebook size={20}/></a>
                   </div>
                </div>
             </div>

             {/* Form Side - Clear Solid Layout */}
             <div className="p-16 bg-neutral-900 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-10 font-serif tracking-tight">{t.contact.formTitle}</h2>
                <form className="space-y-8" onSubmit={handleEmail}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                         <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3 ml-1">{t.contact.labelName}</label>
                         <input 
                            required
                            type="text" 
                            className="w-full bg-neutral-950 border-2 border-neutral-800 rounded-2xl p-5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none placeholder-neutral-700 transition-all font-medium" 
                            placeholder={t.contact.placeName}
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3 ml-1">{t.contact.labelEmail}</label>
                         <input 
                            required
                            type="email" 
                            className="w-full bg-neutral-950 border-2 border-neutral-800 rounded-2xl p-5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none placeholder-neutral-700 transition-all font-medium" 
                            placeholder={t.contact.placeEmail} 
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                         />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3 ml-1">{t.contact.labelSubject}</label>
                      <input 
                        type="text" 
                        className="w-full bg-neutral-950 border-2 border-neutral-800 rounded-2xl p-5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none placeholder-neutral-700 transition-all font-medium" 
                        placeholder={t.contact.placeSubject} 
                        value={form.subject}
                        onChange={e => setForm({...form, subject: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3 ml-1">{t.contact.labelMessage}</label>
                      <textarea 
                        required
                        rows={4} 
                        className="w-full bg-neutral-950 border-2 border-neutral-800 rounded-2xl p-5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none placeholder-neutral-700 transition-all resize-none font-medium" 
                        placeholder={t.contact.placeMessage}
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                      ></textarea>
                   </div>
                   
                   <div className="flex flex-col sm:flex-row gap-5 pt-6">
                     <button type="button" onClick={handleWhatsApp} className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-bold hover:bg-green-500 transition-all shadow-[0_15px_30px_-10px_rgba(22,163,74,0.4)] flex justify-center items-center uppercase tracking-widest text-xs active:scale-95 group">
                        <MessageCircle className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" /> {t.contact.btnWhatsapp}
                     </button>
                     <button type="submit" className="flex-1 bg-neutral-800 text-white border-2 border-white/10 py-5 rounded-2xl font-bold hover:bg-neutral-700 transition-all shadow-xl flex justify-center items-center uppercase tracking-widest text-xs active:scale-95 group">
                        <Mail className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" /> {t.contact.btnSend}
                     </button>
                   </div>
                </form>
             </div>

          </div>
       </div>
    </div>
  );
};
