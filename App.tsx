import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { Packages } from './pages/Packages';
import { PackageDetail } from './pages/PackageDetail';
import { ThankYou } from './pages/ThankYou';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Core funnel */}
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/gracias" element={<ThankYou />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
