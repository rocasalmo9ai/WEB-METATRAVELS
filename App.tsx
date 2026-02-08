import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { PackagesList } from './pages/PackagesList';
import { PackageDetail } from './pages/PackageDetail';
import { CustomTrip } from './pages/CustomTrip';
import { ThankYou } from './pages/ThankYou';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Paquetes */}
        <Route path="/packages" element={<PackagesList />} />
        <Route path="/packages/:id" element={<PackageDetail />} />

        {/* Antes era /questionnaire, pero no existe Questionnaire.tsx en tu repo.
            Usamos CustomTrip (que sí existe) para que compile y no se rompa. */}
        <Route path="/questionnaire" element={<CustomTrip />} />

        {/* Thank you */}
        <Route path="/gracias" element={<ThankYou />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
