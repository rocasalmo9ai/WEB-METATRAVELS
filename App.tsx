import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import * as HomeModule from './pages/Home';
import * as PackageDetailModule from './pages/PackageDetail';
import * as ThankYouModule from './pages/ThankYou';

// Wrappers que acabas de crear (evitan “file not found”)
import * as PackagesModule from './pages/Packages';
import * as QuestionnaireModule from './pages/Questionnaire';

const Home: any = (HomeModule as any).Home || (HomeModule as any).default;
const PackageDetail: any =
  (PackageDetailModule as any).PackageDetail || (PackageDetailModule as any).default;
const ThankYou: any = (ThankYouModule as any).ThankYou || (ThankYouModule as any).default;

const Packages: any = (PackagesModule as any).Packages || (PackagesModule as any).default;
const Questionnaire: any =
  (QuestionnaireModule as any).Questionnaire || (QuestionnaireModule as any).default;

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/gracias" element={<ThankYou />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
