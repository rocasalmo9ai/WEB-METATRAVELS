import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { PackageDetail } from './pages/PackageDetail.tsx';
import { WeatherPage } from './pages/WeatherPage.tsx';
import { Admin } from './pages/Admin.tsx';
import { CustomTrip } from './pages/CustomTrip.tsx';
import { PackagesList } from './pages/PackagesList.tsx';
import { About } from './pages/About.tsx';
import { Contact } from './pages/Contact.tsx';
import { LanguageProvider } from './components/LanguageContext.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/packages" element={<PackagesList />} />
                <Route path="/package/:id" element={<PackageDetail />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/custom-trip" element={<CustomTrip />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/policy" element={<div className="p-20 text-center text-2xl font-serif">Políticas de Privacidad y Términos de Servicio</div>} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
import { ThankYou } from './pages/ThankYou';

// dentro de <Routes>
<Route path="/gracias" element={<ThankYou />} />
