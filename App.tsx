import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { PackagesList } from './pages/PackagesList';
import { PackageDetail } from './pages/PackageDetail';
import { Questionnaire } from './pages/Questionnaire';
import { ThankYou } from './pages/ThankYou';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Packages */}
        <Route path="/packages" element={<PackagesList />} />
        <Route path="/packages/:id" element={<PackageDetail />} />

        {/* Questionnaire */}
        <Route path="/questionnaire" element={<Questionnaire />} />

        {/* Thank you */}
        <Route path="/gracias" element={<ThankYou />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
