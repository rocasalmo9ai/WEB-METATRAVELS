
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { SITE_CONFIG } from '../constants';

export const SEOHead: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();

  const canonicalUrl = `https://metatravels.com${location.pathname}`;
  const siteTitle = `Meta Travels | ${t.hero.defining}`;
  const description = t.footer.desc;

  // JSON-LD para Agencia de Viajes de Lujo
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Meta Travels",
    "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    "@id": "https://metatravels.com",
    "url": "https://metatravels.com",
    "telephone": SITE_CONFIG.contact.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Reforma 222, Torre Mayor",
      "addressLocality": "CDMX",
      "addressCountry": "MX"
    },
    "priceRange": "$$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </>
  );
};
