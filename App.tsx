import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import { Layout } from './components/Layout';
import { LanguageProvider } from './components/LanguageContext';
import { Home } from './pages/Home';
import { PackagesList } from './pages/PackagesList';
import { PackageDetail } from './pages/PackageDetail';
import { CustomTrip } from './pages/CustomTrip';
import { ThankYou } from './pages/ThankYou';
import { WeatherPage } from './pages/WeatherPage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

export const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/packages" element={<PackagesList />} />
            <Route path="/package/:id" element={<PackageDetail />} />
            <Route path="/packages/:id" element={<PackageDetail />} />

            <Route path="/custom-trip" element={<CustomTrip />} />
            <Route path="/questionnaire" element={<Navigate to="/custom-trip" replace />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gracias" element={<ThankYou />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </LanguageProvider>
    </Router>
  );
};

export default App;
