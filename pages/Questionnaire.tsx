import React from 'react';
import * as CustomTripModule from './CustomTrip';

const CustomTripComponent: any =
  (CustomTripModule as any).CustomTrip ||
  (CustomTripModule as any).default;

export const Questionnaire: React.FC = () => {
  return <CustomTripComponent />;
};

export default Questionnaire;
